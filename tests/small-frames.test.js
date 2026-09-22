'use strict';

/**
 * Frame-size matrix: every chart type × every option combination × every frame
 * size from 1200×800 down to 20×20.
 *
 * This is the suite that catches the "chart does not appear" class of bug. The
 * plugins derive their drawing area by subtracting fixed paddings from the
 * frame, so on a small frame the area goes negative and the first resize()
 * call throws — Figma refuses sizes below 0.01 — leaving an empty frame.
 *
 * Current state (see the todo markers):
 *   - Pie was fixed: margins scale with the frame and the diameter is floored,
 *     so it renders at every size down to 20×20.
 *   - Line / Area / Bar still use fixed paddings:
 *       plot.h = h − PAD_TOP(10) − PAD_BOTTOM(21) − legend band
 *       plot.w = w − padLeft(Y label width + 10) − PAD_RIGHT(2)
 *     Either can go negative, and drawGrid* then calls resize(plot.h, 0) /
 *     resize(plot.w + 6, 0) with a negative length.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { payload, SIZES } = require('./helpers/fixtures');
const { assertGeometryFinite } = require('./helpers/inspect');

/** Option combinations that change how much space a chart needs. */
const COMBOS = {
  line: [
    { name: 'plain', opts: {} },
    { name: 'legend', opts: { showLegend: true, legendLabels: ['Alpha', 'Beta', 'Gamma'] } },
    { name: 'events', opts: { topEvent: true, bottomEvent: true } },
    { name: 'peak', opts: { lineStyle: 'peak' } },
    { name: 'wide Y labels', opts: { yValues: [0, 1000000], yUnit: ' req/s' } },
  ],
  area: [
    { name: 'plain', opts: {} },
    { name: 'legend', opts: { showLegend: true, legendLabels: ['Alpha', 'Beta', 'Gamma'] } },
    { name: 'stacked fill-height', opts: { areaMode: 'stacked', fillHeight: true } },
    { name: 'events', opts: { topEvent: true, bottomEvent: true } },
  ],
  bar: [
    { name: 'plain', opts: {} },
    { name: 'legend', opts: { showLegend: true, legendLabels: ['Alpha', 'Beta', 'Gamma'] } },
    { name: 'horizontal', opts: { orientation: 'horizontal' } },
    { name: 'grouped dense', opts: { barMode: 'grouped', dense: true } },
    { name: 'stacked', opts: { barMode: 'stacked', barsCount: 4 } },
  ],
  pie: [
    { name: 'plain', opts: {} },
    { name: 'labels + total', opts: { showLabels: true, showTotal: true } },
    {
      name: 'labels + total + legend',
      opts: {
        showLabels: true,
        showTotal: true,
        showLegend: true,
        legendLabels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
      },
    },
    { name: 'solid pie', opts: { pieStyle: 'pie', showLabels: true } },
  ],
};

/** Sizes every chart type handles today. */
const SAFE_SIZES = SIZES.filter((s) => s.w >= 90 && s.h >= 90);
/** Sizes small enough to expose the fixed-padding bug. */
const TINY_SIZES = SIZES.filter((s) => !(s.w >= 90 && s.h >= 90));

/**
 * Renders one cell of the matrix.
 * Returns null on success or a one-line description of the failure.
 */
async function renderCell(key, type, size, combo) {
  const h = loadPlugin(key, { seed: 2 });
  h.selectFrame(size.w, size.h);
  const label = size.name + ' / ' + combo.name;
  try {
    await h.generate(payload(type, combo.opts));
  } catch (e) {
    return label + ' → threw: ' + e.message;
  }
  const errors = h.errorNotifications();
  if (errors.length > 0) return label + ' → error notification: ' + errors[0].message;

  const charts = h.charts();
  if (charts.length !== 1) return label + ' → ' + charts.length + ' chart containers created';
  const container = charts[0];
  if ((container._children || []).length === 0) return label + ' → chart frame came out empty';
  try {
    assertGeometryFinite(container, label);
  } catch (e) {
    return label + ' → ' + e.message;
  }
  return null;
}

async function runMatrix(key, type, sizes) {
  const failures = [];
  for (const size of sizes) {
    for (const combo of COMBOS[type]) {
      const failure = await renderCell(key, type, size, combo);
      if (failure) failures.push(failure);
    }
  }
  return failures;
}

const TYPES = ['line', 'area', 'bar', 'pie'];

/** Types whose small-frame handling is still broken, with the diagnosis. */
const KNOWN_TINY_BUGS = {
  line: 'BUG: plot.h = h − 31 − legend band and plot.w = w − padLeft − 2 can go negative; drawGrid calls resize() with it',
  area: 'BUG: same fixed-padding plot geometry as Chart Line',
  bar: 'BUG: same fixed-padding plot geometry as Chart Line',
};

for (const type of TYPES) {
  for (const key of [type, 'all']) {
    const where = key === 'all' ? 'combined generator' : 'standalone';

    test(type + ': renders at every size ≥ 90×90 [' + where + ']', async () => {
      const failures = await runMatrix(key, type, SAFE_SIZES);
      assert.deepEqual(failures, [], failures.length + ' size/option combos failed');
    });

    const tinyOpts = KNOWN_TINY_BUGS[type] ? { todo: KNOWN_TINY_BUGS[type] } : {};
    test(type + ': renders at sizes below 90×90 [' + where + ']', tinyOpts, async () => {
      const failures = await runMatrix(key, type, TINY_SIZES);
      assert.deepEqual(failures, [], failures.length + ' size/option combos failed');
    });
  }
}

// ── Failure reporting ───────────────────────────────────────────────────────
// Whatever the geometry does, a render that cannot complete must tell the user
// instead of leaving an empty frame behind. The pie plugin and the combined
// generator wrap their render in try/catch and raise an error notification;
// the standalone Line/Area/Bar plugins let the promise reject silently.
const SILENT_FAILURE_BUG =
  'BUG: figma.ui.onmessage does not catch render errors, so a failed render ' +
  'rejects silently and the user just sees an empty frame';

for (const type of TYPES) {
  for (const key of [type, 'all']) {
    const where = key === 'all' ? 'combined generator' : 'standalone';
    const silent = key !== 'all' && type !== 'pie' ? { todo: SILENT_FAILURE_BUG } : {};

    test(type + ': a render that cannot fit still reports to the user [' + where + ']', silent, async () => {
      const h = loadPlugin(key, { seed: 2 });
      h.selectFrame(20, 20);
      await assert.doesNotReject(
        () => h.generate(payload(type, { showLegend: true, legendLabels: ['A', 'B', 'C'] })),
        'the message handler must not reject',
      );
      const drewSomething = h.charts().length === 1 && h.charts()[0]._children.length > 0;
      const toldTheUser = h.errorNotifications().length > 0;
      assert.ok(
        drewSomething || toldTheUser,
        'either a chart is drawn or an error is surfaced — never silence',
      );
    });
  }
}

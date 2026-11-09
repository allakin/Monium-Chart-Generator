'use strict';

/**
 * Large axis values: digit-group spaces ("2 000 000") and thousands shorthands
 * ("100k", "1.5kk").
 *
 * Regression: the number parser stopped at the first non-digit, so
 * "1 000 000" / "1kk" were positioned as 1 and "2 000 000" / "2kk" as 2 — on a
 * 0…500 000 scale those ticks landed next to zero and their labels piled up on
 * top of each other. The text was still drawn as typed, which hid the cause.
 *
 * Covers every plugin with a value axis: the UI input parser, the rendered
 * tick positions (no overlap, increasing order), the read-back from layers and
 * how the shorthand plays with the "Y axis — unit" field.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { absBox } = require('./helpers/inspect');
const { yAxisTexts, xAxisTexts } = require('./helpers/axis');

const NBSP = '\u00A0';
const NNBSP = '\u202F';
const VALUES = [0, 100000, 500000, 1000000, 1500000, 2000000];

const INPUTS = [
  {
    name: 'space-grouped',
    raw: '0, 100 000, 500 000, 1 000 000, 1 500 000, 2 000 000',
    labels: ['0', '100 000', '500 000', '1 000 000', '1 500 000', '2 000 000'],
  },
  {
    name: 'k / kk shorthand',
    raw: '0, 100k, 500k, 1kk, 1.5kk, 2kk',
    labels: ['0', '100k', '500k', '1kk', '1.5kk', '2kk'],
  },
];

const UI_KEYS = ['line', 'area', 'bar', 'all'];

// ── UI input parser ─────────────────────────────────────────────────────────
for (const key of UI_KEYS) {
  test('ui parses large Y values as whole numbers [' + key + ']', () => {
    const ui = loadUI(key);
    for (const input of INPUTS) {
      const parsed = ui.global.parseYAxisInput(input.raw);
      assert.deepEqual(Array.from(parsed.values), VALUES, input.name + ': positions');
      assert.deepEqual(Array.from(parsed.labels), input.labels, input.name + ': labels stay as typed');
    }

    const nbsp = ui.global.parseYAxisInput('1' + NBSP + '500, 2' + NNBSP + '000' + NNBSP + '000');
    assert.deepEqual(Array.from(nbsp.values), [1500, 2000000], 'NBSP and narrow NBSP group digits too');

    const cyr = ui.global.parseYAxisInput('100\u043A, 1\u043A\u043A, 2\u041A');
    assert.deepEqual(Array.from(cyr.values), [100000, 1000000, 2000], 'Cyrillic к works like k');

    const units = ui.global.parseYAxisInput('5kB, 10kbps, 1.1k');
    assert.deepEqual(Array.from(units.values), [5, 10, 1100], 'k followed by a letter is a unit');

    const plain = ui.global.parseYAxisInput('0, 1000000, 2000000');
    assert.deepEqual(Array.from(plain.values), [0, 1000000, 2000000]);
    assert.equal(plain.labels, null, 'ungrouped numbers need no custom labels');
  });
}

// ── Rendered tick labels ────────────────────────────────────────────────────
/** Ticks on the value axis must keep their order and never overlap. */
function assertTicksSpreadOut(texts, axis, expected, what) {
  assert.equal(texts.length, expected.length, what + ': one label per tick');
  // Order along the axis: left → right for X, bottom → top for Y.
  const ordered = texts.slice().sort((a, b) =>
    axis === 'x' ? absBox(a).x - absBox(b).x : absBox(b).y - absBox(a).y,
  );
  assert.deepEqual(ordered.map((t) => t.characters), expected, what + ': labels follow the value order');
  for (let i = 1; i < ordered.length; i++) {
    const prev = absBox(ordered[i - 1]);
    const cur = absBox(ordered[i]);
    const gap = axis === 'x' ? cur.x - (prev.x + prev.w) : prev.y - (cur.y + cur.h);
    assert.ok(
      gap >= 0,
      what + ': "' + ordered[i - 1].characters + '" and "' + ordered[i].characters +
        '" overlap by ' + (-gap).toFixed(1) + 'px',
    );
  }
}

const RENDER_CASES = [
  { type: 'bar', keys: ['bar', 'all'], opts: { orientation: 'horizontal' }, axis: 'x', size: { w: 1156, h: 164 } },
  { type: 'bar', keys: ['bar', 'all'], opts: { orientation: 'vertical' }, axis: 'y', size: { w: 600, h: 400 } },
  { type: 'line', keys: ['line', 'all'], opts: {}, axis: 'y', size: { w: 600, h: 400 } },
  { type: 'area', keys: ['area', 'all'], opts: {}, axis: 'y', size: { w: 600, h: 400 } },
];

async function renderAndRecover(key, c, opts) {
  const h = loadPlugin(key, { seed: 5 });
  const frame = h.selectFrame(c.size.w, c.size.h);
  await h.generate(payload(c.type, Object.assign({}, c.opts, opts)));
  assert.equal(h.errorNotifications().length, 0, 'render succeeds');
  const container = h.chart();
  const texts = c.axis === 'x' ? xAxisTexts(container) : yAxisTexts(container);
  const drawn = texts.map((t) => t.characters);
  container.setPluginData('chartParams', '');
  h.select(frame);
  return { texts, drawn, recovered: h.lastSelectionMessage().chartData };
}

for (const c of RENDER_CASES) {
  for (const key of c.keys) {
    const what = c.type + (c.opts.orientation ? ' ' + c.opts.orientation : '') + ' [' + key + ']';

    for (const input of INPUTS) {
      test(input.name + ' values spread out and read back: ' + what, async () => {
        const parsed = loadUI(key).global.parseYAxisInput(input.raw);
        const { texts, recovered } = await renderAndRecover(key, c, {
          yValues: Array.from(parsed.values),
          yLabels: Array.from(parsed.labels),
          xLabels: ['gpt-image-2.5-flare', 'jev-1.14.0', 'gpt-5-mini-2025-08-07', 'gpt-5-2025-08-07', 'gpt-6-astra'],
        });
        assertTicksSpreadOut(texts, c.axis, input.labels, what);
        assert.deepEqual(Array.from(recovered.yValues), VALUES, 'positions come back as whole numbers');
        assert.deepEqual(Array.from(recovered.yLabels), input.labels, 'labels come back as typed');
      });
    }

    test('k / kk shorthand works with a Y unit: ' + what, async () => {
      const { texts, drawn, recovered } = await renderAndRecover(key, c, {
        yValues: [0, 100000, 1000000, 2000000],
        yLabels: ['0', '100k', '1kk', '2kk'],
        yUnit: ' RPS',
      });
      assert.deepEqual(drawn.slice().sort(), ['0 RPS', '100k RPS', '1kk RPS', '2kk RPS'].sort());
      assertTicksSpreadOut(texts, c.axis, ['0 RPS', '100k RPS', '1kk RPS', '2kk RPS'], what);
      assert.equal(recovered.yUnit, ' RPS', 'the unit field comes back without the shorthand');
      assert.deepEqual(Array.from(recovered.yValues), [0, 100000, 1000000, 2000000]);
      assert.deepEqual(Array.from(recovered.yLabels), ['0', '100k', '1kk', '2kk']);
    });

    test('"k" in the unit field still reads back as the unit: ' + what, async () => {
      const { recovered } = await renderAndRecover(key, c, { yValues: [0, 100, 500, 1000], yUnit: 'k' });
      assert.equal(recovered.yUnit, 'k');
      assert.deepEqual(Array.from(recovered.yValues), [0, 100, 500, 1000]);
    });
  }
}

'use strict';

/**
 * Copy → paste must reproduce a chart exactly: same series values, same
 * colors, same event segments, same options — no re-randomisation.
 *
 * The UI stores the `chartData` it receives in the "selection" message and
 * posts it back as { type: 'paste', chartData }. These tests drive exactly
 * that round trip.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { payload } = require('./helpers/fixtures');
const { layerItems, layer, childNames, assertGeometryFinite } = require('./helpers/inspect');

const CASES = [
  {
    type: 'line',
    keys: ['line', 'all'],
    opts: {
      linesCount: 3,
      lineStyle: 'sharp',
      topEvent: true,
      bottomEvent: true,
      showLegend: true,
      legendLabels: ['One', 'Two', 'Three'],
      legendAlign: 'center',
      yUnit: 'ms',
    },
    seriesKey: 'allSeries',
    dataLayer: 'Lines',
  },
  {
    type: 'area',
    keys: ['area', 'all'],
    opts: {
      areasCount: 3,
      areaStyle: 'smooth',
      areaMode: 'stacked',
      fillHeight: true,
      fillOpacity: 0.45,
      topEvent: true,
      showLegend: true,
      legendLabels: ['One', 'Two', 'Three'],
    },
    seriesKey: 'allSeries',
    dataLayer: 'Areas',
  },
  {
    type: 'bar',
    keys: ['bar', 'all'],
    opts: {
      barMode: 'grouped',
      barsCount: 3,
      orientation: 'horizontal',
      barGap: 3,
      fillOpacity: 0.9,
      bottomEvent: true,
      showLegend: true,
      legendLabels: ['One', 'Two', 'Three'],
    },
    seriesKey: 'allSeries',
    dataLayer: 'Bars',
  },
  {
    type: 'pie',
    keys: ['pie', 'all'],
    opts: {
      values: [40, 30, 20, 10],
      pieStyle: 'donut',
      innerRadiusPct: 65,
      cornerRadius: 6,
      segmentGap: 2,
      showLabels: true,
      showTotal: true,
      fillOpacity: 0.85,
      showLegend: true,
      legendLabels: ['One', 'Two', 'Three', 'Four'],
      legendAlign: 'right',
    },
    seriesKey: 'values',
    dataLayer: 'Slices',
  },
];

/** Generates a chart and returns the chartData the UI would copy. */
async function copyFrom(key, type, opts, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 101 });
  h.selectFrame(s.w, s.h);
  await h.generate(payload(type, opts));
  const container = h.chart();
  const selection = h.lastSelectionMessage();
  assert.ok(selection, 'plugin posts a selection message after rendering');
  assert.equal(selection.hasChart, true, 'the rendered chart is detected as a chart');
  return { handle: h, container, chartData: JSON.parse(JSON.stringify(selection.chartData)) };
}

for (const testCase of CASES) {
  for (const key of testCase.keys) {
    const where = key === 'all' ? 'combined generator' : 'standalone';
    const V = ' [' + testCase.type + ', ' + where + ']';

    test('paste reproduces the series and colors exactly' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts);

      const target = loadPlugin(key, { seed: 999 }); // different seed on purpose
      target.selectFrame(600, 400);
      await target.paste(source.chartData);
      assert.deepEqual(target.errorNotifications().map((n) => n.message), []);

      const pasted = target.chartParams(target.chart());
      const original = source.handle.chartParams(source.container);

      assert.deepEqual(
        pasted[testCase.seriesKey],
        original[testCase.seriesKey],
        'series data must be identical, not re-randomised',
      );
      assert.deepEqual(pasted.colors, original.colors, 'colors must be identical');
      assert.deepEqual(
        pasted.legendLabels,
        original.legendLabels,
        'legend labels must be identical',
      );
    });

    test('paste keeps every option from the source chart' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts);
      const target = loadPlugin(key, { seed: 7 });
      target.selectFrame(600, 400);
      await target.paste(source.chartData);

      const original = source.handle.chartParams(source.container);
      const pasted = target.chartParams(target.chart());
      for (const optionKey of Object.keys(testCase.opts)) {
        if (!Object.prototype.hasOwnProperty.call(original, optionKey)) continue;
        assert.deepEqual(
          pasted[optionKey],
          original[optionKey],
          'option "' + optionKey + '" changed during paste',
        );
      }
    });

    test('paste rebuilds the same layer set' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts);
      const target = loadPlugin(key, { seed: 7 });
      target.selectFrame(600, 400);
      await target.paste(source.chartData);

      assert.deepEqual(
        childNames(target.chart()).sort(),
        childNames(source.container).sort(),
        'pasted chart has the same layers',
      );
      assert.equal(
        layerItems(target.chart(), testCase.dataLayer).length,
        layerItems(source.container, testCase.dataLayer).length,
        'same number of data nodes',
      );
    });

    test('paste into a different frame size keeps the data, rescales the drawing' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts, { w: 600, h: 400 });
      const target = loadPlugin(key, { seed: 7 });
      const frame = target.selectFrame(900, 300);
      await target.paste(source.chartData);
      assert.deepEqual(target.errorNotifications().map((n) => n.message), []);

      const container = target.chart();
      assert.equal(container.width, 900, 'pasted chart adopts the new frame width');
      assert.equal(container.height, 300);
      assert.equal(container.parent.id, frame.id);
      assert.deepEqual(
        target.chartParams(container)[testCase.seriesKey],
        source.handle.chartParams(source.container)[testCase.seriesKey],
        'data survives the resize',
      );
      assertGeometryFinite(container, 'pasted into 900x300');
    });

    test('pasting twice is idempotent' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts);
      const target = loadPlugin(key, { seed: 7 });
      target.selectFrame(600, 400);

      await target.paste(source.chartData);
      const first = JSON.stringify(target.chartParams(target.chart()));
      await target.paste(source.chartData);
      const second = JSON.stringify(target.chartParams(target.chart()));

      assert.equal(second, first, 'a second paste produces the same chart');
      assert.equal(target.charts().length, 1, 'the second paste replaces, not stacks');
    });

    test('paste with no selection drops the chart on the page' + V, async () => {
      const source = await copyFrom(key, testCase.type, testCase.opts);
      const target = loadPlugin(key, { seed: 7 });
      await target.paste(source.chartData);
      const container = target.chart();
      assert.equal(container.parent.type, 'PAGE');
      assert.deepEqual(
        target.chartParams(container)[testCase.seriesKey],
        source.handle.chartParams(source.container)[testCase.seriesKey],
      );
    });
  }
}

// ── Event segments ──────────────────────────────────────────────────────────
for (const key of ['line', 'area', 'bar', 'all']) {
  const where = key === 'all' ? 'combined generator' : 'standalone';
  const type = key === 'all' ? 'line' : key;

  test('paste reuses the stored event segments [' + type + ', ' + where + ']', async () => {
    const source = await copyFrom(key, type, { topEvent: true, bottomEvent: true });
    const target = loadPlugin(key, { seed: 424242 });
    target.selectFrame(600, 400);
    await target.paste(source.chartData);

    const original = source.handle.chartParams(source.container);
    const pasted = target.chartParams(target.chart());
    assert.deepEqual(
      pasted.topEventSegments,
      original.topEventSegments,
      'top event segments must not be regenerated',
    );
    assert.deepEqual(pasted.bottomEventSegments, original.bottomEventSegments);
    assert.equal(
      layerItems(target.chart(), 'Top Events').length,
      layerItems(source.container, 'Top Events').length,
      'same number of event bars',
    );
  });
}

// ── The stacked-area double-scaling trap ────────────────────────────────────
for (const key of ['area', 'all']) {
  const where = key === 'all' ? 'combined generator' : 'standalone';

  test('paste does not re-scale a stacked area chart [' + where + ']', async () => {
    const opts = {
      areaMode: 'stacked',
      areasCount: 4,
      fillHeight: false,
      yValues: [0, 100],
    };
    const source = await copyFrom(key, 'area', opts);
    const original = source.handle.chartParams(source.container);
    const originalMax = Math.max.apply(null, original.allSeries.map((s) => Math.max.apply(null, s)));

    const target = loadPlugin(key, { seed: 7 });
    target.selectFrame(600, 400);
    await target.paste(source.chartData);
    const pasted = target.chartParams(target.chart());
    const pastedMax = Math.max.apply(null, pasted.allSeries.map((s) => Math.max.apply(null, s)));

    assert.ok(
      Math.abs(pastedMax - originalMax) < 1e-9,
      'stored series are already scaled; pasting must not divide again (' +
        originalMax + ' → ' + pastedMax + ')',
    );
  });

  test('paste preserves a fill-to-height stacked area [' + where + ']', async () => {
    const opts = { areaMode: 'stacked', areasCount: 3, fillHeight: true, yValues: [0, 100] };
    const source = await copyFrom(key, 'area', opts);
    const target = loadPlugin(key, { seed: 7 });
    target.selectFrame(600, 400);
    await target.paste(source.chartData);

    assert.deepEqual(
      target.chartParams(target.chart()).allSeries,
      source.handle.chartParams(source.container).allSeries,
    );
    assert.equal(target.chartParams(target.chart()).fillHeight, true);
  });
}

// ── Notifications ───────────────────────────────────────────────────────────
test('paste confirms the action to the user', async () => {
  const source = await copyFrom('pie', 'pie', {});
  const target = loadPlugin('pie', { seed: 7 });
  target.selectFrame(500, 500);
  await target.paste(source.chartData);
  assert.equal(target.log.notifications.length, 1, 'exactly one notification');
  assert.match(target.log.notifications[0].message, /paste/i, 'and it mentions the paste');
});

test('paste without chartData does nothing', async () => {
  const h = loadPlugin('pie', { seed: 7 });
  h.selectFrame(500, 500);
  await h.send({ type: 'paste' });
  assert.equal(h.charts().length, 0, 'no chart created');
  assert.equal(h.log.notifications.length, 0, 'no notification');
});

test('a pie copied with labels and total keeps both after paste', async () => {
  const source = await copyFrom('pie', 'pie', { showLabels: true, showTotal: true });
  const target = loadPlugin('pie', { seed: 7 });
  target.selectFrame(500, 500);
  await target.paste(source.chartData);
  const container = target.chart();
  assert.ok(layer(container, 'Labels'), 'labels layer survives the paste');
  assert.ok(layer(container, 'Center Label'), 'center total survives the paste');
});

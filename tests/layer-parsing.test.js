'use strict';

/**
 * Fallback parsing: recovering chart settings from the layers alone.
 *
 * Normally the plugin reads back its own `chartParams` plugin data. When that
 * is gone — a chart copied between files, an older chart, a frame rebuilt by
 * hand — readChartParamsFromLayers has to reconstruct the settings from the
 * node tree. These tests generate a chart, wipe the plugin data, re-select the
 * frame and check what the UI is told.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { payload } = require('./helpers/fixtures');

/** Renders, forgets the stored params, re-selects and returns what the UI gets. */
async function recover(key, type, opts, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 77 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload(type, opts));
  const container = h.chart();
  const original = h.chartParams(container);

  container.setPluginData('chartParams', '');
  h.select(frame);

  const message = h.lastSelectionMessage();
  assert.ok(message, 'a selection message is posted');
  return { handle: h, container, original, recovered: message.chartData, hasChart: message.hasChart };
}

const VARIANTS = {
  line: ['line', 'all'],
  area: ['area', 'all'],
  bar: ['bar', 'all'],
  pie: ['pie', 'all'],
};

function label(type, key) {
  return ' [' + type + ', ' + (key === 'all' ? 'combined generator' : 'standalone') + ']';
}

// ── Line ────────────────────────────────────────────────────────────────────
for (const key of VARIANTS.line) {
  const V = label('line', key);

  test('recovers line count, style and axes from layers' + V, async () => {
    const { recovered, hasChart } = await recover(key, 'line', {
      linesCount: 4,
      lineStyle: 'smooth',
      xLabels: ['A', 'B', 'C', 'D'],
      yValues: [0, 50, 100],
    });
    assert.equal(hasChart, true, 'the chart is still recognised without plugin data');
    assert.equal(recovered.linesCount, 4);
    assert.equal(recovered.lineStyle, 'smooth');
    assert.deepEqual(recovered.xLabels, ['A', 'B', 'C', 'D']);
    assert.deepEqual(recovered.yValues, [0, 50, 100], 'Y values come back sorted low → high');
  });

  test('recovers each curve style' + V, async () => {
    for (const style of ['smooth', 'sharp', 'peak']) {
      const { recovered } = await recover(key, 'line', { lineStyle: style });
      assert.equal(recovered.lineStyle, style, 'style ' + style + ' round-trips');
    }
  });

  test('recovers event bars' + V, async () => {
    const both = await recover(key, 'line', { topEvent: true, bottomEvent: true });
    assert.equal(both.recovered.topEvent, true);
    assert.equal(both.recovered.bottomEvent, true);

    const neither = await recover(key, 'line', {});
    assert.equal(neither.recovered.topEvent, false);
    assert.equal(neither.recovered.bottomEvent, false);
  });

  test('recovers a Y axis unit and keeps custom labels verbatim' + V, async () => {
    const withUnit = await recover(key, 'line', { yValues: [0, 150, 300], yUnit: 'ms' });
    assert.equal(withUnit.recovered.yUnit, 'ms');
    assert.deepEqual(withUnit.recovered.yValues, [0, 150, 300], 'unit is stripped from values');

    const times = await recover(key, 'line', {
      yValues: [0, 1.5, 3],
      yLabels: ['0:00', '1:30', '3:00'],
    });
    assert.deepEqual(
      times.recovered.yLabels,
      ['0:00', '1:30', '3:00'],
      'clock labels are preserved as typed',
    );
    assert.deepEqual(times.recovered.yValues, [0, 1.5, 3], 'and converted back to hours');
  });

  test('a chart rebuilt from recovered layers keeps its shape' + V, async () => {
    const { recovered } = await recover(key, 'line', {
      linesCount: 3,
      lineStyle: 'sharp',
      xLabels: ['A', 'B', 'C'],
      yValues: [0, 100],
    });

    const rebuilt = loadPlugin(key, { seed: 2 });
    rebuilt.selectFrame(600, 400);
    await rebuilt.generate(Object.assign({ chartType: 'line' }, recovered));
    const params = rebuilt.chartParams(rebuilt.chart());
    assert.equal(params.linesCount, 3);
    assert.equal(params.lineStyle, 'sharp');
    assert.deepEqual(params.xLabels, ['A', 'B', 'C']);
  });
}

// ── Area ────────────────────────────────────────────────────────────────────
for (const key of VARIANTS.area) {
  const V = label('area', key);

  test('recovers area count, style and fill opacity' + V, async () => {
    const { recovered } = await recover(key, 'area', {
      areasCount: 3,
      areaStyle: 'sharp',
      fillOpacity: 0.5,
    });
    assert.equal(recovered.areasCount, 3);
    assert.equal(recovered.areaStyle, 'sharp');
    assert.ok(
      Math.abs(recovered.fillOpacity - 0.5) < 1e-6,
      'fill opacity ' + recovered.fillOpacity,
    );
  });

  test('recovers the stacking mode' + V, async () => {
    const overlap = await recover(key, 'area', { areaMode: 'overlap', areasCount: 3 });
    assert.equal(overlap.recovered.areaMode, 'overlap');

    const stacked = await recover(key, 'area', { areaMode: 'stacked', areasCount: 3 });
    assert.equal(stacked.recovered.areaMode, 'stacked');
  });

  test('recovers fill-to-height for stacked areas' + V, async () => {
    const filled = await recover(key, 'area', {
      areaMode: 'stacked',
      areasCount: 3,
      fillHeight: true,
    });
    assert.equal(filled.recovered.fillHeight, true);

    const plain = await recover(key, 'area', {
      areaMode: 'stacked',
      areasCount: 3,
      fillHeight: false,
    });
    assert.equal(plain.recovered.fillHeight, false);
  });
}

// ── Bar ─────────────────────────────────────────────────────────────────────
for (const key of VARIANTS.bar) {
  const V = label('bar', key);

  test('recovers vertical orientation' + V, async () => {
    const vertical = await recover(key, 'bar', { orientation: 'vertical' });
    assert.equal(vertical.recovered.orientation, 'vertical');
  });

  // KNOWN BUG (both plugins): on a horizontal bar chart the numeric ticks live
  // in the "X Labels" group and "Y Labels" holds the category names. The parser
  // only reads numeric ticks from "Y Labels", so yValues stays empty and
  // readAxisChartParamsFromLayers bails out with `return null`. Effect: a
  // horizontal bar chart whose pluginData is gone is not recognised as a chart
  // at all — Regenerate / Copy / "get values" never light up for it.
  test(
    'recovers horizontal orientation' + V,
    { todo: 'BUG: horizontal bar charts are unrecognisable without pluginData' },
    async () => {
      const horizontal = await recover(key, 'bar', { orientation: 'horizontal' });
      assert.equal(horizontal.hasChart, true, 'the chart must still be detected');
      assert.equal(horizontal.recovered.orientation, 'horizontal');
    },
  );

  test('recovers the bar mode and series count' + V, async () => {
    const normal = await recover(key, 'bar', { barMode: 'normal' });
    assert.equal(normal.recovered.barMode, 'normal');
    assert.equal(normal.recovered.barsCount, 1);

    const grouped = await recover(key, 'bar', { barMode: 'grouped', barsCount: 3 });
    assert.equal(grouped.recovered.barMode, 'grouped');
    assert.equal(grouped.recovered.barsCount, 3);

    const stacked = await recover(key, 'bar', { barMode: 'stacked', barsCount: 4 });
    assert.equal(stacked.recovered.barMode, 'stacked');
    assert.equal(stacked.recovered.barsCount, 4);
  });

  test('recovers dense mode' + V, async () => {
    const dense = await recover(key, 'bar', { barMode: 'normal', dense: true });
    assert.equal(dense.recovered.dense, true);

    const sparse = await recover(key, 'bar', { barMode: 'normal', dense: false });
    assert.equal(sparse.recovered.dense, false);
  });

  test('recovers fill opacity' + V, async () => {
    const { recovered } = await recover(key, 'bar', { fillOpacity: 0.6 });
    assert.ok(Math.abs(recovered.fillOpacity - 0.6) < 1e-6, 'got ' + recovered.fillOpacity);
  });
}

// ── Pie ─────────────────────────────────────────────────────────────────────
for (const key of VARIANTS.pie) {
  const V = label('pie', key);

  test('recovers slice count, style and hole size' + V, async () => {
    const donut = await recover(key, 'pie', {
      values: [40, 30, 20, 10],
      pieStyle: 'donut',
      innerRadiusPct: 65,
    }, { w: 500, h: 500 });
    assert.equal(donut.recovered.segmentsCount, 4);
    assert.equal(donut.recovered.pieStyle, 'donut');
    assert.equal(donut.recovered.innerRadiusPct, 65);

    const solid = await recover(key, 'pie', { pieStyle: 'pie' }, { w: 500, h: 500 });
    assert.equal(solid.recovered.pieStyle, 'pie');
    assert.equal(solid.recovered.innerRadiusPct, 0);
  });

  test('recovers corner radius, segment gap and opacity' + V, async () => {
    const { recovered } = await recover(
      key,
      'pie',
      { cornerRadius: 8, segmentGap: 3, fillOpacity: 0.7 },
      { w: 500, h: 500 },
    );
    assert.equal(recovered.cornerRadius, 8);
    assert.ok(Math.abs(recovered.segmentGap - 3) < 0.11, 'gap ' + recovered.segmentGap);
    assert.ok(Math.abs(recovered.fillOpacity - 0.7) < 1e-6, 'opacity ' + recovered.fillOpacity);
  });

  test('recovers the display toggles' + V, async () => {
    const on = await recover(
      key,
      'pie',
      { showLabels: true, showTotal: true },
      { w: 500, h: 500 },
    );
    assert.equal(on.recovered.showLabels, true);
    assert.equal(on.recovered.showTotal, true);

    const off = await recover(key, 'pie', {}, { w: 500, h: 500 });
    assert.equal(off.recovered.showLabels, false);
    assert.equal(off.recovered.showTotal, false);
  });

  test('recovers slice proportions even though units are lost' + V, async () => {
    const values = [50, 25, 15, 10];
    const { recovered } = await recover(
      key,
      'pie',
      { values, segmentGap: 1 },
      { w: 500, h: 500 },
    );
    const total = recovered.values.reduce((a, b) => a + b, 0);
    const originalTotal = values.reduce((a, b) => a + b, 0);
    recovered.values.forEach((v, i) => {
      const share = v / total;
      const expected = values[i] / originalTotal;
      assert.ok(
        Math.abs(share - expected) < 0.005,
        'slice ' + i + ' share ' + share.toFixed(4) + ' ≠ ' + expected.toFixed(4),
      );
    });
    assert.ok(Math.abs(total - 360) < 1, 'recovered values are degrees summing to 360');
  });

  test('a pie rebuilt from recovered layers has the same proportions' + V, async () => {
    const values = [50, 25, 15, 10];
    const { recovered } = await recover(key, 'pie', { values }, { w: 500, h: 500 });

    const rebuilt = loadPlugin(key, { seed: 3 });
    rebuilt.selectFrame(500, 500);
    await rebuilt.generate(Object.assign({ chartType: 'pie' }, recovered));
    const spans = rebuilt
      .chartParams(rebuilt.chart())
      .values;
    const total = spans.reduce((a, b) => a + b, 0);
    const originalTotal = values.reduce((a, b) => a + b, 0);
    spans.forEach((v, i) => {
      assert.ok(
        Math.abs(v / total - values[i] / originalTotal) < 0.005,
        'rebuilt slice ' + i + ' keeps its share',
      );
    });
  });
}

// ── Robustness ──────────────────────────────────────────────────────────────
test('an unrelated frame is not reported as a chart', async () => {
  for (const key of ['line', 'area', 'bar', 'pie', 'all']) {
    const h = loadPlugin(key, { seed: 1 });
    const frame = h.selectFrame(400, 300, { name: 'Just a frame' });
    const message = h.lastSelectionMessage();
    assert.equal(message.hasChart, false, key + ': empty frame must not look like a chart');
    assert.equal(message.chartData, null, key + ': and carries no chart data');
    void frame;
  }
});

test('an emptied chart frame degrades gracefully', async () => {
  for (const key of ['line', 'area', 'bar', 'pie', 'all']) {
    const h = loadPlugin(key, { seed: 1 });
    const frame = h.selectFrame(400, 300);
    await h.generate(payload(key === 'all' ? 'line' : key));
    const container = h.chart();

    container.setPluginData('chartParams', '');
    for (const child of container._children.slice()) child.remove();

    h.select(frame);
    const message = h.lastSelectionMessage();
    assert.equal(
      message.hasChart,
      key === 'pie' ? true : false,
      key + ': an empty chart frame reports hasChart=' + message.hasChart,
    );
  }
});

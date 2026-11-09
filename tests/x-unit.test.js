'use strict';

/**
 * "X axis — unit": a suffix appended to every X (category) label, the
 * counterpart of "Y axis — unit". Covered for every plugin with axes —
 * Chart Line, Area, Bar and the matching tabs of the combined generator:
 *
 *   - drawing: each category label ends with the unit, stored labels don't;
 *   - layout: a wider label widens the left padding of a horizontal bar chart;
 *   - read-back from layers: a shared suffix goes back to the unit, with the
 *     same k / kk shorthand rules as the Y axis;
 *   - UI: the field is sent on generate and filled by "Get values from chart".
 *
 * Field naming follows the data, not the screen: on a horizontal bar chart the
 * categories (and so the X unit) sit on the left axis.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { yAxisTexts, xAxisTexts, plotOf } = require('./helpers/axis');

const CASES = [
  { type: 'line', keys: ['line', 'all'], opts: {} },
  { type: 'area', keys: ['area', 'all'], opts: {} },
  { type: 'bar', keys: ['bar', 'all'], opts: { orientation: 'vertical' } },
  { type: 'bar', keys: ['bar', 'all'], opts: { orientation: 'horizontal' } },
];

/** Category labels as drawn, in data order. */
function categoryTexts(container, opts) {
  return opts.orientation === 'horizontal'
    ? yAxisTexts(container).map((t) => t.characters) // top → bottom
    : xAxisTexts(container).map((t) => t.characters); // left → right
}

async function render(key, type, opts, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 9 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload(type, opts));
  assert.equal(h.errorNotifications().length, 0, 'render succeeds');
  return { h, frame, container: h.chart() };
}

/** Wipes pluginData and re-selects, so the chart is read from its layers. */
function recoverFromLayers(h, frame, container) {
  container.setPluginData('chartParams', '');
  h.select(frame);
  return h.lastSelectionMessage().chartData;
}

for (const c of CASES) {
  for (const key of c.keys) {
    const what = c.type + (c.opts.orientation ? ' ' + c.opts.orientation : '') +
      ' [' + (key === 'all' ? 'combined generator' : 'standalone') + ']';

    test('x unit is appended to every category label: ' + what, async () => {
      const { h, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['1', '2', '3', '4'],
        xUnit: 'h',
      }));
      assert.deepEqual(categoryTexts(container, c.opts), ['1h', '2h', '3h', '4h']);
      const params = h.chartParams(container);
      assert.equal(params.xUnit, 'h', 'chartParams keeps the unit');
      assert.deepEqual(Array.from(params.xLabels), ['1', '2', '3', '4'], 'and the labels without it');
    });

    test('no x unit leaves the labels untouched: ' + what, async () => {
      const { h, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['Jan', 'Feb', 'Mar'],
      }));
      assert.deepEqual(categoryTexts(container, c.opts), ['Jan', 'Feb', 'Mar']);
      assert.equal(h.chartParams(container).xUnit, '');
    });

    test('x unit is read back from layers: ' + what, async () => {
      const { h, frame, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['1', '2', '3', '4'],
        xUnit: 'h',
      }));
      const recovered = recoverFromLayers(h, frame, container);
      assert.equal(recovered.xUnit, 'h');
      assert.deepEqual(Array.from(recovered.xLabels), ['1', '2', '3', '4']);
    });

    test('x unit works with k / kk categories: ' + what, async () => {
      const { h, frame, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['100k', '500k', '1kk', '1.5kk'],
        xUnit: ' RPS',
      }));
      assert.deepEqual(categoryTexts(container, c.opts), ['100k RPS', '500k RPS', '1kk RPS', '1.5kk RPS']);
      const recovered = recoverFromLayers(h, frame, container);
      assert.equal(recovered.xUnit, ' RPS', 'the unit comes back without the shorthand');
      assert.deepEqual(Array.from(recovered.xLabels), ['100k', '500k', '1kk', '1.5kk']);
    });

    test('text categories never yield an x unit on read-back: ' + what, async () => {
      const { h, frame, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['gpt-image-2.5-flare', 'jev-1.14.0', 'gpt-5-2025-08-07', 'Jan'],
      }));
      const recovered = recoverFromLayers(h, frame, container);
      assert.equal(recovered.xUnit, '');
      assert.deepEqual(Array.from(recovered.xLabels), ['gpt-image-2.5-flare', 'jev-1.14.0', 'gpt-5-2025-08-07', 'Jan']);
    });

    test('x unit survives copy → paste: ' + what, async () => {
      const { h, container } = await render(key, c.type, Object.assign({}, c.opts, {
        xLabels: ['1', '2', '3'],
        xUnit: 'd',
      }));
      const data = h.chartParams(container);
      const target = loadPlugin(key, { seed: 10 });
      target.selectFrame(600, 400);
      await target.paste(data);
      const pasted = target.chart();
      assert.deepEqual(categoryTexts(pasted, c.opts), ['1d', '2d', '3d']);
      assert.equal(target.chartParams(pasted).xUnit, 'd');
    });
  }
}

for (const key of ['bar', 'all']) {
  test('horizontal bar: a longer x unit widens the left padding [' + key + ']', async () => {
    const opts = { orientation: 'horizontal', xLabels: ['1', '2', '3'] };
    const bare = await render(key, 'bar', opts);
    const withUnit = await render(key, 'bar', Object.assign({}, opts, { xUnit: ' requests' }));
    assert.ok(
      plotOf(withUnit.container).left > plotOf(bare.container).left,
      'padLeft accounts for the unit on the category labels',
    );
  });
}

// ── UI field ────────────────────────────────────────────────────────────────
const UI_CASES = [
  { key: 'line', type: 'line', field: 'xUnitInput' },
  { key: 'area', type: 'area', field: 'xUnitInput' },
  { key: 'bar', type: 'bar', field: 'xUnitInput' },
  { key: 'all', type: 'line', field: 'line-xUnitInput' },
  { key: 'all', type: 'area', field: 'area-xUnitInput' },
  { key: 'all', type: 'bar', field: 'bar-xUnitInput' },
];

for (const u of UI_CASES) {
  const what = ' [' + (u.key === 'all' ? 'combined, ' + u.type + ' tab' : u.key) + ']';

  test('ui sends the x unit on generate' + what, () => {
    const ui = loadUI(u.key);
    if (u.key === 'all') ui.global.switchTab(u.type);
    ui.el(u.field).value = ' h ';
    ui.global.generate();
    const sent = ui.posted('generate').pop();
    assert.equal(sent.xUnit, 'h', 'trimmed like the Y unit');
  });

  test('ui fills the x unit from "Get values from chart"' + what, async () => {
    const h = loadPlugin(u.key, { seed: 3 });
    h.selectFrame(600, 400);
    await h.generate(payload(u.type, { xLabels: ['1', '2', '3'], xUnit: 'h' }));
    const ui = loadUI(u.key);
    ui.receive(h.lastSelectionMessage());
    ui.global.regenerate();
    assert.equal(ui.el(u.field).value, 'h');
    assert.equal(ui.el(u.key === 'all' ? u.type + '-xInput' : 'xInput').value, '1, 2, 3');
  });
}

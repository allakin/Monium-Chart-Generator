'use strict';

/**
 * Chart Bar — user-pinned series colors (the color picker in ui.html).
 *
 * Ported from the Chart Line picker (see line-colors.test.js), with the bugs
 * found there checked for bars: the palette comes from code.js, a pinned color
 * reaches every bar of the series (opacity kept) and its legend dot, survives
 * "Get values from chart" → Insert, regenerate, copy → paste, live recolor of
 * the selected chart in every mode and orientation, nested/renamed charts, and
 * charts whose pluginData is unreadable (combined generator) via the layers.
 *
 * Standalone Chart Bar only: the combined generator has no picker yet.
 */

const nodeTest = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { layerItems, colorKey, assertColorsDistinct, plain } = require('./helpers/inspect');
const { deltaEWorstVision } = require('./helpers/color');

// Plugin-side cases run twice: against the standalone plugin and against the
// bar tab of the combined generator (both speak the same message API). UI cases
// (" UI" in the name) drive the standalone ui.html — the combined UI has its own
// suite, tests/all-colors-ui.test.js — and the cases below are standalone-only.
const VARIANTS = [
  { key: 'bar', label: 'standalone' },
  { key: 'all', label: 'combined generator' },
];
const STANDALONE_ONLY = [
  'standalone Get values', // drives the standalone ui.html
];

function defineSuite(PLUGIN, LABEL) {
  const V = ' [' + LABEL + ']';
  const test = (name, ...rest) => {
    if (PLUGIN === 'all' && (/ UI[: ]/.test(name) || STANDALONE_ONLY.some((n) => name.indexOf(n) !== -1))) return undefined;
    return nodeTest(name + V, ...rest);
  };

  /** Floor for an Auto color vs any other series (OKLab ΔE×100, worst vision model). */
  const AUTO_MIN_DELTA_E = 10;

  const MODES = [
    { barMode: 'grouped', barsCount: 3 },
    { barMode: 'stacked', barsCount: 3 },
    { barMode: 'stacked', barsCount: 2, dense: true },
    { barMode: 'normal', barsCount: 4 },
    { barMode: 'normal', barsCount: 4, dense: true },
  ];
  const ORIENTATIONS = ['vertical', 'horizontal'];

  function hexOf(c) {
    return (
      '#' +
      [c.r, c.g, c.b]
        .map((v) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase())
        .join('')
    );
  }

  function barsOf(container) {
    return layerItems(container, 'Bars').filter((n) => n.type === 'RECTANGLE');
  }

  /** One hex per series, asserting every bar of a series has the same fill. */
  function seriesHexes(container, count) {
    const bars = barsOf(container);
    assert.equal(bars.length % count, 0, 'bar count is a multiple of the series count');
    const out = [];
    for (let s = 0; s < count; s++) {
      const own = bars.filter((_, k) => k % count === s).map((b) => hexOf(b.fills[0].color));
      assert.equal(new Set(own).size, 1, 'series ' + (s + 1) + ' bars share one color: ' + [...new Set(own)]);
      out.push(own[0]);
    }
    return out;
  }

  function opacities(container) {
    return barsOf(container).map((b) => b.fills[0].opacity);
  }

  function legendHexes(container) {
    return layerItems(container, 'Legend')
      .filter((n) => n.type === 'ELLIPSE')
      .map((d) => hexOf(d.fills[0].color));
  }

  function seriesCount(opts) {
    return opts.barMode === 'normal' ? 1 : opts.barsCount;
  }

  async function render(opts, seed, size) {
    const s = size || { w: 600, h: 400 };
    const h = loadPlugin(PLUGIN, { seed: seed === undefined ? 11 : seed });
    const frame = h.selectFrame(s.w, s.h);
    await h.generate(payload('bar', opts));
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    return { handle: h, frame, container: h.chart() };
  }

  function paletteOf(handle) {
    return Array.from(handle.global.PALETTE_HEX);
  }

  const PAL = paletteOf(loadPlugin(PLUGIN));

  // ── Plugin side ─────────────────────────────────────────────────────────────

  test('bar colors: get-palette replies with every generation palette color', async () => {
    const h = loadPlugin(PLUGIN);
    await h.send({ type: 'get-palette' });
    const msg = h.log.uiMessages.filter((m) => m.type === 'palette').pop();
    assert.ok(msg);
    assert.deepEqual(msg.colors, Array.from(h.global.PALETTE).map(hexOf));
    assert.equal(new Set(msg.colors).size, msg.colors.length);
  });

  test('bar colors: the plugin posts nothing to the UI at boot (palette is requested)', () => {
    const h = loadPlugin(PLUGIN);
    assert.equal(h.log.uiMessages.length, 0);
  });

  for (const orientation of ORIENTATIONS) {
    for (const mode of MODES) {
      const tag = orientation + ' ' + mode.barMode + (mode.dense ? ' dense' : '');
      test('bar colors: pins drive every bar and the legend (' + tag + ')', async () => {
        const n = seriesCount(mode);
        const pins = [PAL[4], null, PAL[20]].slice(0, n);
        const labels = ['A', 'B', 'C', 'D'].slice(0, n);
        const opts = Object.assign({ orientation, showLegend: true, legendLabels: labels, fillOpacity: 0.6, barColors: pins }, mode);
        const { container, handle } = await render(opts);
        const hexes = seriesHexes(container, n);
        assert.equal(hexes[0], PAL[4], 'series 1 wears its pin');
        if (n >= 3) assert.equal(hexes[2], PAL[20], 'series 3 wears its pin');
        assert.deepEqual(legendHexes(container), hexes, 'legend dots repeat the series colors');
        assert.ok(opacities(container).every((o) => Math.abs(o - 0.6) < 1e-9), 'fill opacity kept');
        const params = handle.chartParams(container);
        assert.deepEqual(params.barColors, pins);
        assert.deepEqual(params.colors.map(hexOf), hexes);
      });

      test('bar colors: live recolor repaints one series in place (' + tag + ')', async () => {
        const n = seriesCount(mode);
        const labels = ['A', 'B', 'C', 'D'].slice(0, n);
        const { handle: h } = await render(Object.assign({ orientation, showLegend: true, legendLabels: labels, fillOpacity: 0.5 }, mode), 31);
        const before = seriesHexes(h.chart(), n);
        const geometry = barsOf(h.chart()).map((b) => [b.x, b.y, b.width, b.height].join(','));
        const index = n - 1;
        const target = PAL.find((hx) => !before.includes(hx));

        await h.send({ type: 'recolor', index, color: target });
        assert.deepEqual(h.errorNotifications().map((x) => x.message), []);
        assert.equal(h.charts().length, 1, 'no new chart');
        const after = seriesHexes(h.chart(), n);
        const expected = before.slice();
        expected[index] = target;
        assert.deepEqual(after, expected, 'only that series changes');
        assert.deepEqual(legendHexes(h.chart()), after, 'legend dot follows');
        assert.ok(opacities(h.chart()).every((o) => Math.abs(o - 0.5) < 1e-9), 'opacity kept on recolor');
        assert.deepEqual(barsOf(h.chart()).map((b) => [b.x, b.y, b.width, b.height].join(',')), geometry, 'bars not regenerated');
        const p = h.chartParams();
        assert.equal(p.barColors[index], target);
        assert.equal(p.customColors, true);
        assert.equal(h.lastSelectionMessage().reason, 'recolor');
      });
    }
  }

  test('bar colors: Normal mode is one series — one legend entry, one picker row (known bug #3)', async () => {
    const { handle, container } = await render({
      barMode: 'normal', barsCount: 4, showLegend: true, legendLabels: ['A', 'B', 'C', 'D'], barColors: [PAL[9], PAL[1], PAL[2], PAL[3]],
    });
    const p = handle.chartParams(container);
    assert.equal(p.barsCount, 1);
    assert.deepEqual(p.legendLabels, ['A'], 'legend sized after barsCount settles to 1');
    assert.deepEqual(p.barColors, [PAL[9]]);
    assert.deepEqual(legendHexes(container), [PAL[9]]);
    assert.deepEqual(seriesHexes(container, 1), [PAL[9]]);
  });

  test('bar colors: Auto series stay perceptually apart from the pinned ones', async () => {
    let worst = Infinity;
    for (let seed = 1; seed <= 30; seed++) {
      const pins = [PAL[seed % PAL.length], null, null, PAL[(seed * 7 + 3) % PAL.length], null];
      if (pins[0] === pins[3]) continue;
      const { container } = await render({ barMode: 'grouped', barsCount: 5, barColors: pins }, seed);
      const colors = seriesHexes(container, 5);
      const rgb = barsOf(container).slice(0, 5).map((b) => b.fills[0].color);
      assertColorsDistinct(rgb, 'seed ' + seed);
      for (const a of [1, 2, 4]) {
        for (let b = 0; b < 5; b++) if (a !== b) worst = Math.min(worst, deltaEWorstVision(rgb[a], rgb[b]));
      }
      assert.equal(colors[0], pins[0]);
    }
    assert.ok(worst >= AUTO_MIN_DELTA_E, 'closest Auto pair ΔE ' + worst.toFixed(1));
  });

  test('bar colors: without pins generation is unchanged', async () => {
    const a = await render({ barMode: 'grouped', barsCount: 4 }, 5);
    const b = await render({ barMode: 'grouped', barsCount: 4, barColors: [null, null, null, null] }, 5);
    assert.deepEqual(seriesHexes(b.container, 4), seriesHexes(a.container, 4));
    assert.deepEqual(a.handle.chartParams().barColors, [null, null, null, null]);
    assert.equal(a.handle.chartParams().customColors, false);
  });

  test('bar colors: invalid entries fall back to Auto; off-palette hex is kept', async () => {
    const { handle, container } = await render({
      barMode: 'grouped', barsCount: 3, showLegend: true, legendLabels: ['A', 'B', 'C'],
      barColors: ['#12345', PAL[3].toLowerCase(), '#3d3d3d', PAL[0]],
    });
    assert.deepEqual(handle.chartParams(container).barColors, [null, PAL[3], '#3D3D3D']);
    const hexes = seriesHexes(container, 3);
    assert.equal(hexes[1], PAL[3]);
    assert.equal(hexes[2], '#3D3D3D', 'off-palette color drawn as is');
    assert.deepEqual(legendHexes(container), hexes);
  });

  test('bar colors: regenerate keeps pins and re-rolls Auto series', async () => {
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(600, 400);
    await h.generate(payload('bar', { barMode: 'stacked', barsCount: 3, barColors: [null, PAL[12], null] }));
    const seen = new Set();
    for (let i = 0; i < 6; i++) {
      const saved = h.chartParams();
      await h.generate(payload('bar', { barMode: 'stacked', barsCount: 3, barColors: saved.barColors, replace: true }));
      assert.equal(h.charts().length, 1);
      const hx = seriesHexes(h.chart(), 3);
      assert.equal(hx[1], PAL[12]);
      seen.add(hx[0] + hx[2]);
    }
    assert.ok(seen.size > 1, 'Auto series vary');
  });

  test('bar colors: copy → paste keeps pins, colors and picker state', async () => {
    const pins = [PAL[30], null, PAL[2]];
    const source = await render({ barMode: 'grouped', barsCount: 3, showLegend: true, legendLabels: ['X', 'Y', 'Z'], barColors: pins, customColors: true });
    const data = JSON.parse(JSON.stringify(source.handle.lastSelectionMessage().chartData));
    const target = loadPlugin(PLUGIN, { seed: 999 });
    target.selectFrame(320, 240);
    await target.paste(data);
    assert.deepEqual(seriesHexes(target.chart(), 3), seriesHexes(source.container, 3));
    assert.deepEqual(legendHexes(target.chart()), seriesHexes(source.container, 3));
    assert.deepEqual(target.chartParams().barColors, pins);
    assert.equal(target.chartParams().customColors, true);
  });

  test('bar colors: suggest-colors fills Auto slots around pins and honours avoid', async () => {
    const h = loadPlugin(PLUGIN, { seed: 21 });
    await h.send({ type: 'suggest-colors', requestId: 7, count: 4, barColors: [null, PAL[10], null, '#3D3D3D'], avoid: [PAL[11]] });
    const msg = h.log.uiMessages.filter((m) => m.type === 'suggested-colors').pop();
    assert.equal(msg.requestId, 7);
    assert.equal(msg.colors[1], PAL[10]);
    assert.equal(msg.colors[3], '#3D3D3D');
    assert.ok(PAL.includes(msg.colors[0]) && PAL.includes(msg.colors[2]));
    assert.ok(!msg.colors.includes(PAL[11]), 'avoided color not suggested');
    assert.equal(new Set(msg.colors).size, 4);
  });

  test('bar colors: recolor to Auto unpins without changing the color', async () => {
    const { handle: h } = await render({ barMode: 'grouped', barsCount: 2 });
    await h.send({ type: 'recolor', index: 0, color: PAL[40] });
    await h.send({ type: 'recolor', index: 0, color: null });
    assert.equal(seriesHexes(h.chart(), 2)[0], PAL[40]);
    assert.deepEqual(h.chartParams().barColors, [null, null]);
  });

  test('bar colors: recolor that cannot apply says why', async () => {
    const { handle: h, frame } = await render({ barMode: 'grouped', barsCount: 2 });
    const snapshot = JSON.stringify(h.chartParams());
    await h.send({ type: 'recolor', chartType: 'bar', index: 5, color: PAL[0] });
    assert.match(h.errorNotifications().pop().message, /only 2 series/);
    h.selectFrame(100, 100, { name: 'Empty' });
    await h.send({ type: 'recolor', chartType: 'bar', index: 0, color: PAL[0] });
    const err = h.errorNotifications().pop();
    assert.match(err.message, /No Bar chart/);
    const failed = h.log.uiMessages.filter((m) => m.type === 'recolor-failed').pop();
    assert.equal(failed.message, err.message);
    h.select(frame);
    assert.equal(JSON.stringify(h.chartParams()), snapshot, 'nothing changed');

    const ui = loadUI('bar');
    ui.receive(failed);
    assert.equal(ui.el('barColorsHint').textContent, err.message);
    assert.ok(ui.el('barColorsHint').classList.contains('error'));
  });

  test('bar colors: recolor works with a paginated legend', async () => {
    const labels = Array.from({ length: 20 }, (_, i) => 'Series number ' + (i + 1));
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(300, 400);
    await h.generate(payload('bar', { barMode: 'grouped', barsCount: 20, showLegend: true, legendLabels: labels }));
    const dots = legendHexes(h.chart()).length;
    assert.ok(dots < 20, 'fixture paginates');
    await h.send({ type: 'recolor', index: 0, color: PAL[5] });
    await h.send({ type: 'recolor', index: 19, color: PAL[6] });
    const hx = seriesHexes(h.chart(), 20);
    assert.equal(hx[0], PAL[5]);
    assert.equal(hx[19], PAL[6]);
    assert.deepEqual(legendHexes(h.chart()), hx.slice(0, dots));
  });

  test('bar colors: save-bar-colors stores the picker state without repainting', async () => {
    const { handle: h } = await render({ barMode: 'stacked', barsCount: 2, showLegend: true, legendLabels: ['A', 'B'] });
    const hx = seriesHexes(h.chart(), 2);
    await h.send({ type: 'save-bar-colors', customColors: true, barColors: hx });
    assert.equal(h.chartParams().customColors, true);
    assert.deepEqual(h.chartParams().barColors, hx);
    assert.deepEqual(seriesHexes(h.chart(), 2), hx);
    await h.send({ type: 'save-bar-colors', customColors: false, barColors: [] });
    assert.equal(h.chartParams().customColors, false);
    assert.deepEqual(h.chartParams().barColors, [null, null]);
    assert.deepEqual(seriesHexes(h.chart(), 2), hx);
  });

  test('bar colors: chartParams records the picker state (inferred for old payloads)', async () => {
    assert.equal((await render({ barMode: 'grouped', barsCount: 2, customColors: true })).handle.chartParams().customColors, true);
    assert.equal((await render({ barMode: 'grouped', barsCount: 2, barColors: [PAL[1], null] })).handle.chartParams().customColors, true);
    assert.equal((await render({ barMode: 'grouped', barsCount: 2 })).handle.chartParams().customColors, false);
  });

  // ── Finding the chart the user means ───────────────────────────────────────

  async function nestedChart(opts) {
    const h = loadPlugin(PLUGIN, { seed: 51 });
    const card = h.selectFrame(700, 300, { name: 'Card' });
    const inner = h.createNode('FRAME', 'Content');
    inner.resize(640, 240);
    card.appendChild(inner);
    const header = h.createNode('FRAME', 'Header');
    header.resize(640, 20);
    inner.appendChild(header);
    h.select(inner);
    await h.generate(payload('bar', opts || { barMode: 'grouped', barsCount: 2, showLegend: true, legendLabels: ['A', 'B'] }));
    h.select(card);
    return { h, card, inner, chart: h.chart() };
  }

  test('bar colors: a chart nested in a card is detected and recolored', async () => {
    const { h, chart } = await nestedChart();
    assert.equal(h.lastSelectionMessage().hasChart, true);
    const target = PAL.find((hx) => !seriesHexes(chart, 2).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    assert.equal(seriesHexes(h.chart(), 2)[0], target);
    assert.equal(legendHexes(h.chart())[0], target);
  });

  test('bar colors: regenerating a nested chart replaces it in place', async () => {
    const { h, inner, chart } = await nestedChart();
    const index = inner.children.indexOf(chart);
    const size = { w: chart.width, h: chart.height };
    await h.generate(payload('bar', { barMode: 'grouped', barsCount: 2, replace: true }));
    assert.equal(h.charts().length, 1);
    const next = h.chart();
    assert.equal(next.parent.id, inner.id);
    assert.equal(inner.children.indexOf(next), index);
    assert.deepEqual({ w: next.width, h: next.height }, size);
  });

  test('bar colors: selecting a bar inside the chart acts on the chart', async () => {
    const { handle: h } = await render({ barMode: 'grouped', barsCount: 2 });
    h.select(barsOf(h.chart())[1]);
    assert.equal(h.lastSelectionMessage().hasChart, true);
    const target = PAL.find((hx) => !seriesHexes(h.chart(), 2).includes(hx));
    await h.send({ type: 'recolor', index: 1, color: target });
    assert.equal(seriesHexes(h.chart(), 2)[1], target);
  });

  test('bar colors: a renamed chart is still found by its data', async () => {
    const { handle: h, frame } = await render({ barMode: 'grouped', barsCount: 2 });
    const chart = h.chart();
    chart.name = 'Graph';
    h.select(frame);
    assert.equal(h.lastSelectionMessage().hasChart, true);
    const target = PAL.find((hx) => !seriesHexes(chart, 2).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    const bars = chart.children.find((n) => n.name === 'Bars');
    assert.equal(hexOf(bars.children[0].fills[0].color), target);
  });

  // ── Charts without readable pluginData (combined generator) ────────────────

  async function withoutPluginData(key, opts, size) {
    const s = size || { w: 600, h: 400 };
    const author = loadPlugin(key, { seed: 19 });
    author.selectFrame(s.w, s.h);
    const msg = payload('bar', opts);
    if (key === 'all') msg.chartType = 'bar';
    await author.generate(msg);
    const chart = author.chart();
    const original = author.chartParams(chart);
    chart.setPluginData('chartParams', '');
    const reader = loadPlugin(PLUGIN);
    const d = reader.global.readChartParams(chart);
    return { chart, original, recovered: d ? JSON.parse(JSON.stringify(d)) : null };
  }

  for (const orientation of ORIENTATIONS) {
    for (const align of ['left', 'center', 'right']) {
      test('bar colors: legend + colors recovered from layers (' + orientation + ', ' + align + ')', async () => {
        const labels = ['Кол-во запусков', 'Кол-во ошибок', 'Третья'];
        const { recovered, original } = await withoutPluginData('bar', {
          orientation, barMode: 'grouped', barsCount: 3, showLegend: true, legendLabels: labels, legendAlign: align,
        });
        assert.ok(recovered, 'chart recognised without pluginData');
        assert.equal(recovered.orientation, orientation);
        assert.equal(recovered.showLegend, true);
        assert.deepEqual(recovered.legendLabels, labels);
        assert.equal(recovered.legendAlign, align);
        assert.deepEqual(recovered.colors.map(hexOf), original.colors.map(hexOf));
        assert.deepEqual(recovered.xLabels, original.xLabels, 'categories in order');
        assert.deepEqual(recovered.yValues, original.yValues, 'value ticks in order');
      });
    }
  }

  test('bar colors: horizontal chart without pluginData is recognised (known bug #4, standalone)', async () => {
    for (const mode of MODES) {
      const { recovered, original } = await withoutPluginData('bar', Object.assign({ orientation: 'horizontal' }, mode));
      assert.ok(recovered, mode.barMode + ': recognised');
      assert.equal(recovered.orientation, 'horizontal');
      assert.equal(recovered.barMode, original.barMode);
      assert.equal(recovered.barsCount, original.barsCount);
    }
  });

  test('bar colors: combined-generator chart keeps its legend in standalone Get values', async () => {
    const { recovered } = await withoutPluginData('all', {
      barMode: 'grouped', barsCount: 2, showLegend: true, legendLabels: ['Кол-во запусков', 'Кол-во ошибок'], legendAlign: 'center',
    }, { w: 1156, h: 164 });
    assert.equal(recovered.showLegend, true);
    assert.deepEqual(recovered.legendLabels, ['Кол-во запусков', 'Кол-во ошибок']);
    assert.equal(recovered.legendAlign, 'center');
    const ui = loadUI('bar');
    ui.receive(selection(recovered));
    ui.global.regenerate();
    assert.equal(ui.el('showLegendCheck').checked, true);
    assert.equal(ui.el('legendInput').value, 'Кол-во запусков, Кол-во ошибок');
  });

  test('bar colors: recoloring a data-less chart keeps its legend for Get values', async () => {
    const h = loadPlugin(PLUGIN, { seed: 23 });
    const frame = h.selectFrame(600, 400);
    await h.generate(payload('bar', { barMode: 'grouped', barsCount: 2, showLegend: true, legendLabels: ['A', 'B'], legendAlign: 'center' }));
    h.chart().setPluginData('chartParams', '');
    h.select(frame);
    await h.send({ type: 'recolor', index: 0, color: PAL[7] });
    const p = h.chartParams();
    assert.equal(p.showLegend, true);
    assert.deepEqual(p.legendLabels, ['A', 'B']);
    assert.equal(p.legendAlign, 'center');
    assert.equal(seriesHexes(h.chart(), 2)[0], PAL[7]);
  });

  // ── UI side ─────────────────────────────────────────────────────────────────

  function selection(chartData) {
    return { type: 'selection', hasFrame: true, name: 'Frame', width: 600, height: 400, hasChart: !!chartData, chartData };
  }

  async function realChartData(opts) {
    const h = loadPlugin(PLUGIN, { seed: 7 });
    h.selectFrame(600, 400);
    await h.generate(payload('bar', opts));
    return h.lastSelectionMessage().chartData;
  }

  /**
   * UI under test, with the bar mode the mini-DOM cannot read (radio inputs are
   * looked up with querySelector) supplied directly.
   */
  function barUI(mode) {
    const ui = loadUI('bar');
    let current = mode || 'grouped';
    ui.global.getBarMode = () => current;
    ui.setMode = (m) => { current = m; };
    return ui;
  }

  function lastGenerate(ui) {
    return ui.posted('generate').pop();
  }

  function enablePicker(ui) {
    ui.el('customColorsCheck').checked = true;
    ui.el('customColorsCheck').dispatch('change');
  }

  function bridge(ui, plugin) {
    let uiSent = 0;
    let pluginSent = plugin.log.uiMessages.length;
    return async function flush() {
      for (let guard = 0; guard < 20; guard++) {
        let moved = false;
        while (uiSent < ui.messages.length) {
          const m = ui.messages[uiSent++];
          if (m && m.type !== 'resize' && m.type !== 'notify') await plugin.send(m);
          moved = true;
        }
        while (pluginSent < plugin.log.uiMessages.length) {
          ui.receive(plugin.log.uiMessages[pluginSent++]);
          moved = true;
        }
        if (!moved) return;
      }
      throw new Error('UI ↔ plugin messages did not settle');
    };
  }

  async function liveSetup(opts) {
    const o = opts || { barMode: 'grouped', barsCount: 2, showLegend: true, legendLabels: ['A', 'B'] };
    const plugin = loadPlugin(PLUGIN, { seed: 41 });
    plugin.selectFrame(600, 400);
    await plugin.generate(payload('bar', o));
    const ui = barUI(o.barMode);
    ui.el('barsInput').value = String(plugin.chartParams().barsCount);
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange();
    await flush();
    return { plugin, ui, flush, n: seriesCount(o) };
  }

  async function getValues(plugin, mode) {
    const ui = barUI(mode || plugin.chartParams().barMode);
    ui.el('barsInput').value = String(plugin.chartParams().barsCount);
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange();
    await flush();
    ui.global.regenerate();
    return ui;
  }

  test('bar colors UI: requests the palette and sorts the grid by hue', () => {
    const ui = barUI();
    assert.equal(ui.posted('get-palette').length, 1);
    ui.receive({ type: 'palette', colors: PAL });
    assert.deepEqual(Array.from(ui.global.paletteHex), PAL);
    const shown = Array.from(ui.global.paletteDisplay);
    assert.deepEqual([...shown].sort(), [...PAL].sort());
    const hsl = shown.map((hx) => ui.global.hexToHsl(hx));
    const firstGray = hsl.findIndex((c) => c.s < ui.global.GRAY_SATURATION);
    assert.ok(firstGray > 0 && hsl.slice(firstGray).every((c) => c.s < ui.global.GRAY_SATURATION));
  });

  test('bar colors UI: Normal mode shows a single picker row', () => {
    const ui = barUI('normal');
    ui.el('barsInput').value = '4';
    ui.el('customColorsCheck').checked = true;
    ui.global.renderBarColors();
    assert.equal(ui.global.barColorState.length, 1, 'one series drawn → one row');
    ui.global.generate();
    assert.equal(lastGenerate(ui).barColors.length, 1);
    ui.setMode('grouped');
    ui.global.updateDenseVisibility(); // what a mode click runs
    assert.equal(ui.global.barColorState.length, 4, 'switching to Grouped grows the picker');
  });

  test('bar colors UI: picker off → only Auto; on → pins and state are sent', () => {
    const ui = barUI();
    ui.el('barsInput').value = '3';
    ui.global.setBarColor(0, '#4D7CFE');
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).barColors), [null, null, null]);
    assert.equal(lastGenerate(ui).customColors, false);
    ui.el('customColorsCheck').checked = true;
    ui.global.setBarColor(2, '#ff6b6b');
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).barColors), ['#4D7CFE', null, '#FF6B6B']);
    assert.equal(lastGenerate(ui).customColors, true);
  });

  test('bar colors UI: rows say whether a color is from the palette', () => {
    const ui = barUI();
    ui.receive({ type: 'palette', colors: PAL });
    assert.equal(ui.global.colorValueText(PAL[3]), 'Palette · ' + PAL[3]);
    assert.equal(ui.global.colorValueText('#3D3D3D'), 'Custom · #3D3D3D');
    assert.equal(ui.global.colorValueText(null), 'Auto');
  });

  test('bar colors UI: enabling the picker on a selected chart shows its colors and saves the state', async () => {
    const { plugin, ui, flush, n } = await liveSetup();
    const before = seriesHexes(plugin.chart(), n);
    enablePicker(ui);
    await flush();
    assert.deepEqual(Array.from(ui.global.barColorState), before);
    assert.equal(ui.posted('suggest-colors').length, 0);
    assert.deepEqual(seriesHexes(plugin.chart(), n), before, 'no repaint on enable');
    assert.equal(plugin.chartParams().customColors, true);
    const again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, true, 'Get values shows the picker on');
    assert.deepEqual(Array.from(again.global.barColorState), before);
  });

  test('bar colors UI: picking a color repaints the selected chart at once', async () => {
    const { plugin, ui, flush, n } = await liveSetup();
    enablePicker(ui);
    await flush();
    const target = PAL.find((hx) => !seriesHexes(plugin.chart(), n).includes(hx));
    ui.global.setBarColor(1, target);
    assert.deepEqual(plain(ui.posted('recolor').pop()), { type: 'recolor', index: 1, color: target });
    await flush();
    assert.equal(seriesHexes(plugin.chart(), n)[1], target);
    assert.equal(legendHexes(plugin.chart())[1], target);
  });

  test('bar colors UI: Auto button generates a new color and applies it', async () => {
    const { plugin, ui, flush, n } = await liveSetup({ barMode: 'stacked', barsCount: 3, showLegend: true, legendLabels: ['A', 'B', 'C'] });
    enablePicker(ui);
    await flush();
    for (let round = 0; round < 4; round++) {
      const before = seriesHexes(plugin.chart(), n);
      ui.global.generateBarColor(2);
      assert.deepEqual(Array.from(ui.posted('suggest-colors').pop().avoid), [before[2]]);
      await flush();
      const after = seriesHexes(plugin.chart(), n);
      assert.notEqual(after[2], before[2]);
      assert.deepEqual(after.slice(0, 2), before.slice(0, 2));
      assert.ok(PAL.includes(after[2]));
      assert.equal(ui.global.barColorState[2], after[2]);
    }
  });

  test('bar colors UI: live recolor keeps the "Get values" form state', async () => {
    const { plugin, ui, flush } = await liveSetup();
    ui.global.regenerate();
    enablePicker(ui);
    await flush();
    ui.global.setBarColor(0, PAL[50]);
    await flush();
    assert.equal(ui.el('insertBtn').disabled, false);
    assert.equal(ui.global.replaceMode, true);
  });

  test('bar colors UI: switching the picker on another chart takes that chart colors', async () => {
    const { plugin, ui, flush, n } = await liveSetup();
    ui.el('customColorsCheck').checked = true;
    ui.global.setBarColor(0, '#3D3D3D');
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    await flush();
    const hx = seriesHexes(plugin.chart(), n);
    enablePicker(ui);
    await flush();
    assert.deepEqual(Array.from(ui.global.barColorState), hx);
    assert.deepEqual(seriesHexes(plugin.chart(), n), hx);
  });

  test('bar colors UI: switching the picker off is remembered', async () => {
    const { plugin, ui, flush } = await liveSetup();
    enablePicker(ui);
    await flush();
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    await flush();
    assert.equal((await getValues(plugin)).el('customColorsCheck').checked, false);
  });

  test('bar colors UI: Get values → pick → Insert keeps the color and the picker', async () => {
    const { plugin, ui, flush } = await liveSetup({ barMode: 'grouped', barsCount: 3, orientation: 'horizontal' });
    ui.global.regenerate();
    enablePicker(ui);
    await flush();
    ui.global.setBarColor(1, PAL[44]);
    await flush();
    ui.global.generate();
    await flush();
    assert.equal(seriesHexes(plugin.chart(), 3)[1], PAL[44]);
    const again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, true);
    assert.equal(again.global.barColorState[1], PAL[44]);
  });

  test('bar colors UI: new series added while the picker is on get a color', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 8 });
    const ui = barUI('grouped');
    const flush = bridge(ui, plugin);
    ui.el('barsInput').value = '2';
    enablePicker(ui);
    await flush();
    const before = Array.from(ui.global.barColorState);
    assert.ok(before.every(Boolean));
    ui.el('barsInput').value = '4';
    ui.el('barsInput').dispatch('change');
    await flush();
    const after = Array.from(ui.global.barColorState);
    assert.deepEqual(after.slice(0, 2), before);
    assert.ok(after[2] && after[3]);
  });

  test('bar colors UI: hint says where a pick lands', async () => {
    const ui = barUI();
    ui.global.updateBarColorsHint();
    assert.equal(ui.el('barColorsHint').textContent, 'Colors apply when you insert the chart');
    ui.receive(selection(await realChartData({ barMode: 'grouped', barsCount: 2 })));
    assert.equal(ui.el('barColorsHint').textContent, 'Colors apply to the selected chart right away');
  });

  test('bar colors UI: paste repopulates the picker', async () => {
    const data = await realChartData({ barMode: 'grouped', barsCount: 2, barColors: [PAL[8], null], customColors: true });
    const ui = barUI();
    ui.receive(selection(data));
    ui.global.copyChart();
    ui.clock.tick(1000);
    ui.receive(selection(null));
    ui.global.pasteChart();
    assert.deepEqual(Array.from(ui.posted('paste').pop().chartData.barColors), [PAL[8], null]);
    ui.receive(selection(data));
    assert.deepEqual(Array.from(ui.global.barColorState), [PAL[8], null]);
    assert.equal(ui.el('customColorsCheck').checked, true);
  });

  test('bar colors: every palette hex pins to its own palette entry', () => {
    const h = loadPlugin(PLUGIN);
    const pal = Array.from(h.global.PALETTE);
    for (let i = 0; i < pal.length; i++) {
      assert.equal(colorKey(h.global.resolveSeriesColors(1, [PAL[i]])[0]), colorKey(pal[i]));
    }
  });

  test('bar colors UI: rows past the selected chart apply on Insert only, no recolor error', async () => {
    const data = await realChartData({ barsCount: 2, barMode: 'grouped' });
    const ui = loadUI('bar');
    ui.global.getBarMode = () => 'grouped'; // mini-DOM has no radio querySelector
    ui.el('barsInput').value = '3'; // the form asks for one more than the chart has
    ui.receive(selection(data));
    ui.el('customColorsCheck').checked = true;
    ui.global.setBarColor(2, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 0, 'no live recolor for a row the chart does not have');
    ui.global.setBarColor(1, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 1, 'rows the chart has still recolor live');
  });
}

for (const v of VARIANTS) defineSuite(v.key, v.label);

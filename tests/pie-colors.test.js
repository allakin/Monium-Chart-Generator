'use strict';

/**
 * Chart Pie — user-pinned segment colors (the color picker in ui.html).
 *
 * Mirrors tests/line-colors.test.js for the pie: the picker offers the
 * generation palette; a pinned color must reach the slice fill (opacity kept)
 * and the legend dot, survive "Get values from chart" → Insert, regenerate in
 * place, and copy → paste. Auto segments keep being generated, distinct from
 * the pinned ones. Live recolor repaints the selected chart without touching
 * its geometry. Charts nested in cards, renamed, or reached through a layer
 * inside them are found; charts without readable pluginData (e.g. drawn by the
 * combined generator — pluginData is per plugin id in Figma) still give back
 * their legend and colors.
 *
 * Standalone Chart Pie only: the combined generator has no picker yet.
 */

const nodeTest = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { layerItems, colorKey, assertColorsDistinct, plain } = require('./helpers/inspect');
const { deltaEWorstVision } = require('./helpers/color');

// Plugin-side cases run twice: against the standalone plugin and against the
// pie tab of the combined generator (both speak the same message API). UI cases
// (" UI" in the name) drive the standalone ui.html — the combined UI has its own
// suite, tests/all-colors-ui.test.js — and the cases below are standalone-only.
const VARIANTS = [
  { key: 'pie', label: 'standalone' },
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

  /** Floor for an Auto color vs any other segment (OKLab ΔE×100, worst vision model). */
  const AUTO_MIN_DELTA_E = 10;

  function hexOf(c) {
    return (
      '#' +
      [c.r, c.g, c.b]
        .map((v) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase())
        .join('')
    );
  }

  function values(n) {
    return Array.from({ length: n }, (_, i) => 10 + ((i * 7) % 13));
  }

  /** Slice layers in drawing order (a 1-segment pie leaves its slice ungrouped). */
  function slicesOf(container) {
    const g = container.children.find((n) => n.name === 'Slices');
    if (!g) return [];
    return g.type === 'GROUP' ? g.children.filter((n) => n.type === 'ELLIPSE') : [g];
  }

  function sliceHexes(container) {
    return slicesOf(container).map((s) => hexOf(s.fills[0].color));
  }

  function sliceOpacities(container) {
    return slicesOf(container).map((s) => s.fills[0].opacity);
  }

  function legendHexes(container) {
    const g = container.children.find((n) => n.name === 'Legend');
    if (!g) return [];
    return g.children.filter((n) => n.type === 'ELLIPSE').map((d) => hexOf(d.fills[0].color));
  }

  function geometry(container) {
    return slicesOf(container).map((s) => JSON.stringify([s.x, s.y, s.width, s.height, s.arcData, s.cornerRadius]));
  }

  async function render(opts, seed, size) {
    const s = size || { w: 500, h: 500 };
    const h = loadPlugin(PLUGIN, { seed: seed === undefined ? 11 : seed });
    const frame = h.selectFrame(s.w, s.h);
    await h.generate(payload('pie', opts));
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    return { handle: h, frame, container: h.chart() };
  }

  function paletteOf(handle) {
    return Array.from(handle.global.PALETTE_HEX);
  }

  // ── Plugin side ─────────────────────────────────────────────────────────────

  test('pie colors: get-palette replies with every generation palette color', async () => {
    const h = loadPlugin(PLUGIN);
    await h.send({ type: 'get-palette' });
    const msg = h.log.uiMessages.filter((m) => m.type === 'palette').pop();
    assert.ok(msg);
    assert.deepEqual(msg.colors, Array.from(h.global.PALETTE).map(hexOf));
    assert.equal(new Set(msg.colors).size, msg.colors.length);
  });

  for (const style of ['pie', 'donut']) {
    test('pie colors: pinned colors drive the slices and the legend (' + style + ')', async () => {
      const pal = paletteOf(loadPlugin(PLUGIN));
      const pins = [pal[4], null, pal[20], null, null];
      const { container, handle } = await render({
        values: values(5),
        pieStyle: style,
        fillOpacity: 0.6,
        showLabels: true,
        showTotal: style === 'donut',
        showLegend: true,
        legendLabels: ['A', 'B', 'C', 'D', 'E'],
        segmentColors: pins,
      });
      const slices = sliceHexes(container);
      assert.equal(slices[0], pal[4]);
      assert.equal(slices[2], pal[20]);
      assert.deepEqual(legendHexes(container), slices, 'legend dots repeat the slice colors');
      assert.ok(sliceOpacities(container).every((o) => o === 0.6), 'fill opacity kept');
      for (const hx of slices) assert.ok(pal.includes(hx));
      assertColorsDistinct(slicesOf(container).map((s) => s.fills[0].color));
      const params = handle.chartParams(container);
      assert.deepEqual(params.segmentColors, pins);
      assert.deepEqual(params.colors.map(hexOf), slices);
    });
  }

  test('pie colors: Auto segments stay apart from the pinned ones and from their neighbours', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    let worst = Infinity;
    let worstNeighbour = Infinity;
    for (let seed = 1; seed <= 40; seed++) {
      const pins = [pal[seed % pal.length], null, null, pal[(seed * 7 + 3) % pal.length], null, null];
      if (pins[0] === pins[3]) continue;
      const { container } = await render({ values: values(6), segmentColors: pins }, seed);
      const colors = slicesOf(container).map((s) => s.fills[0].color);
      assertColorsDistinct(colors, 'seed ' + seed);
      for (const a of [1, 2, 4, 5]) {
        for (let b = 0; b < colors.length; b++) {
          if (a !== b) worst = Math.min(worst, deltaEWorstVision(colors[a], colors[b]));
        }
        // Slices touch around the ring (the last one touches the first).
        const prev = (a - 1 + colors.length) % colors.length;
        const next = (a + 1) % colors.length;
        worstNeighbour = Math.min(worstNeighbour, deltaEWorstVision(colors[a], colors[prev]), deltaEWorstVision(colors[a], colors[next]));
      }
    }
    assert.ok(worst >= AUTO_MIN_DELTA_E, 'closest Auto pair ΔE ' + worst.toFixed(1));
    assert.ok(worstNeighbour >= AUTO_MIN_DELTA_E, 'closest touching pair with an Auto slice ΔE ' + worstNeighbour.toFixed(1));
  });

  test('pie colors: without pins generation is unchanged', async () => {
    const a = await render({ values: values(6) }, 5);
    const b = await render({ values: values(6), segmentColors: [null, null, null, null, null, null] }, 5);
    assert.deepEqual(sliceHexes(b.container), sliceHexes(a.container));
    assert.deepEqual(a.handle.chartParams().segmentColors, [null, null, null, null, null, null]);
    assert.equal(a.handle.chartParams().customColors, false);
  });

  test('pie colors: invalid entries fall back, off-palette hex is drawn as is', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const { handle, container } = await render({
      values: values(3),
      showLegend: true,
      legendLabels: ['Old', 'B', 'C'],
      segmentColors: ['#3d3d3d', 'red', pal[3].toLowerCase(), pal[0]],
    });
    assert.deepEqual(handle.chartParams(container).segmentColors, ['#3D3D3D', null, pal[3]]);
    const slices = sliceHexes(container);
    assert.equal(slices[0], '#3D3D3D');
    assert.equal(slices[2], pal[3]);
    assert.deepEqual(legendHexes(container), slices);
  });

  test('pie colors: regenerate keeps pins and re-rolls Auto segments', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(500, 500);
    await h.generate(payload('pie', { values: values(3), segmentColors: [null, pal[12], null] }));
    const seen = new Set();
    for (let i = 0; i < 6; i++) {
      const saved = h.chartParams();
      await h.generate(payload('pie', { values: values(3), segmentColors: saved.segmentColors, replace: true }));
      assert.equal(h.charts().length, 1);
      const next = sliceHexes(h.chart());
      assert.equal(next[1], pal[12]);
      seen.add(next[0] + next[2]);
    }
    assert.ok(seen.size > 1, 'Auto segments still vary');
  });

  test('pie colors: copy → paste keeps pins, colors and the picker state', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const pins = [pal[30], null, pal[2]];
    const source = await render({ values: values(3), showLegend: true, legendLabels: ['X', 'Y', 'Z'], segmentColors: pins, customColors: true });
    const chartData = JSON.parse(JSON.stringify(source.handle.lastSelectionMessage().chartData));
    const target = loadPlugin(PLUGIN, { seed: 999 });
    target.selectFrame(320, 240);
    await target.paste(chartData);
    assert.deepEqual(sliceHexes(target.chart()), sliceHexes(source.container));
    assert.deepEqual(legendHexes(target.chart()), sliceHexes(source.container));
    assert.deepEqual(target.chartParams().segmentColors, pins);
    assert.equal(target.chartParams().customColors, true);
  });

  test('pie colors: suggest-colors keeps pins and avoids the given color', async () => {
    const h = loadPlugin(PLUGIN, { seed: 21 });
    const pal = paletteOf(h);
    for (let i = 0; i < 20; i++) {
      const avoid = pal[i % pal.length];
      await h.send({ type: 'suggest-colors', requestId: i, count: 4, segmentColors: [null, pal[10], null, '#3D3D3D'], avoid: [avoid] });
      const msg = h.log.uiMessages.filter((m) => m.type === 'suggested-colors').pop();
      assert.equal(msg.requestId, i);
      assert.equal(msg.colors[1], pal[10]);
      assert.equal(msg.colors[3], '#3D3D3D');
      assert.notEqual(msg.colors[0], avoid);
      assert.equal(new Set(msg.colors).size, 4);
    }
    assert.equal(h.charts().length, 0);
  });

  // ── Live recolor ────────────────────────────────────────────────────────────

  async function renderSelected(opts, seed) {
    const h = loadPlugin(PLUGIN, { seed: seed === undefined ? 31 : seed });
    const frame = h.selectFrame(500, 500);
    await h.generate(payload('pie', opts));
    return { h, frame };
  }

  for (const style of ['pie', 'donut']) {
    test('pie colors: recolor repaints one slice and its legend dot in place (' + style + ')', async () => {
      const { h } = await renderSelected({
        values: values(4), pieStyle: style, cornerRadius: 6, segmentGap: 3, fillOpacity: 0.7,
        showLabels: true, showTotal: true, showLegend: true, legendLabels: ['A', 'B', 'C', 'D'],
      });
      const pal = paletteOf(h);
      const before = sliceHexes(h.chart());
      const geo = geometry(h.chart());
      const labelFills = JSON.stringify(layerItems(h.chart(), 'Labels').map((n) => n.fills || n.strokes));
      const target = pal.find((hx) => !before.includes(hx));

      await h.send({ type: 'recolor', index: 2, color: target });

      const after = sliceHexes(h.chart());
      assert.deepEqual(after, [before[0], before[1], target, before[3]]);
      assert.deepEqual(legendHexes(h.chart()), after);
      assert.ok(sliceOpacities(h.chart()).every((o) => o === 0.7), 'opacity kept');
      assert.deepEqual(geometry(h.chart()), geo, 'angles, gaps, corners untouched');
      assert.equal(JSON.stringify(layerItems(h.chart(), 'Labels').map((n) => n.fills || n.strokes)), labelFills, 'value labels unchanged');
      assert.equal(h.charts().length, 1);
      const p = h.chartParams();
      assert.deepEqual(p.segmentColors, [null, null, target, null]);
      assert.equal(p.customColors, true);
      assert.equal(h.lastSelectionMessage().reason, 'recolor');
    });
  }

  test('pie colors: recolor maps segments to slices when a thin segment was skipped', async () => {
    // With a 10° gap the 0.5 segment is narrower than its gap and is not drawn.
    const { h } = await renderSelected({ values: [40, 0.5, 30, 29.5], segmentGap: 10, showLegend: true, legendLabels: ['A', 'B', 'C', 'D'] });
    assert.equal(slicesOf(h.chart()).length, 3, 'fixture must skip one slice');
    const pal = paletteOf(h);
    const before = sliceHexes(h.chart());
    const target = pal.find((hx) => !before.includes(hx) && !legendHexes(h.chart()).includes(hx));
    await h.send({ type: 'recolor', index: 2, color: target });
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    const after = sliceHexes(h.chart());
    assert.deepEqual(after, [before[0], target, before[2]], 'segment 3 is the second drawn slice');
    assert.equal(legendHexes(h.chart())[2], target, 'legend dot 3 follows');
    await h.send({ type: 'recolor', index: 1, color: pal.find((hx) => !after.includes(hx)) });
    assert.deepEqual(sliceHexes(h.chart()), after, 'the undrawn segment changes no slice');
  });

  test('pie colors: recolor to Auto unpins without changing the color', async () => {
    const { h } = await renderSelected({ values: values(3) });
    const pal = paletteOf(h);
    await h.send({ type: 'recolor', index: 0, color: pal[40] });
    await h.send({ type: 'recolor', index: 0, color: null });
    assert.equal(sliceHexes(h.chart())[0], pal[40]);
    assert.deepEqual(h.chartParams().segmentColors, [null, null, null]);
  });

  test('pie colors: recolor works with a paginated legend', async () => {
    const labels = Array.from({ length: 16 }, (_, i) => 'Segment number ' + (i + 1));
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(240, 320);
    await h.generate(payload('pie', { values: values(16), showLegend: true, legendLabels: labels }));
    const dots = legendHexes(h.chart()).length;
    assert.ok(dots < 16, 'fixture must paginate');
    const pal = paletteOf(h);
    await h.send({ type: 'recolor', index: 0, color: pal[5] });
    await h.send({ type: 'recolor', index: 15, color: pal[6] });
    const s = sliceHexes(h.chart());
    assert.equal(s[0], pal[5]);
    assert.equal(s[15], pal[6]);
    assert.deepEqual(legendHexes(h.chart()), s.slice(0, dots));
  });

  test('pie colors: recolor survives copy → paste and regenerate', async () => {
    const { h } = await renderSelected({ values: values(3) });
    const pal = paletteOf(h);
    const target = pal.find((hx) => !sliceHexes(h.chart()).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    const other = loadPlugin(PLUGIN, { seed: 77 });
    other.selectFrame(300, 300);
    await other.paste(h.lastSelectionMessage().chartData);
    assert.equal(sliceHexes(other.chart())[0], target);
    await h.generate(payload('pie', { values: values(3), segmentColors: h.chartParams().segmentColors, replace: true }));
    assert.equal(sliceHexes(h.chart())[0], target);
  });

  test('pie colors: a recolor that cannot apply says why', async () => {
    const { h, frame } = await renderSelected({ values: values(2) });
    const pal = paletteOf(h);
    const snapshot = JSON.stringify(h.chartParams());
    await h.send({ type: 'recolor', chartType: 'pie', index: 7, color: pal[0] });
    h.clearSelection();
    await h.send({ type: 'recolor', chartType: 'pie', index: 0, color: pal[0] });
    h.selectFrame(100, 100, { name: 'Empty' });
    await h.send({ type: 'recolor', chartType: 'pie', index: 0, color: pal[0] });
    const errs = h.errorNotifications().map((n) => n.message);
    assert.ok(errs.some((m) => /only 2 segments/.test(m)));
    assert.ok(errs.some((m) => /Select the chart/.test(m)));
    assert.ok(errs.some((m) => /No Pie chart/.test(m)));
    const failed = h.log.uiMessages.filter((m) => m.type === 'recolor-failed');
    assert.equal(failed.length, 3, 'UI is told every time');
    h.select(frame);
    assert.equal(JSON.stringify(h.chartParams()), snapshot);

    const ui = loadUI('pie');
    ui.receive(failed[2]);
    assert.equal(ui.el('segmentColorsHint').textContent, failed[2].message);
    assert.ok(ui.el('segmentColorsHint').classList.contains('error'));
  });

  test('pie colors: save-segment-colors stores the picker state without repainting', async () => {
    const { h } = await renderSelected({ values: values(3), showLegend: true, legendLabels: ['A', 'B', 'C'] });
    const s = sliceHexes(h.chart());
    await h.send({ type: 'save-segment-colors', customColors: true, segmentColors: s });
    assert.equal(h.chartParams().customColors, true);
    assert.deepEqual(h.chartParams().segmentColors, s);
    assert.deepEqual(sliceHexes(h.chart()), s);
    await h.send({ type: 'save-segment-colors', customColors: false, segmentColors: [] });
    assert.equal(h.chartParams().customColors, false);
    assert.deepEqual(h.chartParams().segmentColors, [null, null, null]);
    assert.deepEqual(sliceHexes(h.chart()), s);
  });

  // ── Finding the chart the user means ───────────────────────────────────────

  async function nestedChart(opts) {
    const h = loadPlugin(PLUGIN, { seed: 51 });
    const card = h.selectFrame(420, 360, { name: 'Card' });
    const inner = h.createNode('FRAME', 'Content');
    inner.resize(300, 300);
    card.appendChild(inner);
    const header = h.createNode('FRAME', 'Header');
    header.resize(300, 20);
    inner.appendChild(header);
    h.select(inner);
    await h.generate(payload('pie', opts || { values: values(3), showLegend: true, legendLabels: ['A', 'B', 'C'] }));
    h.select(card);
    return { h, card, inner, chart: h.chart() };
  }

  test('pie colors: a chart nested in a card is detected and recolored', async () => {
    const { h, chart } = await nestedChart();
    assert.equal(h.lastSelectionMessage().hasChart, true);
    const pal = paletteOf(h);
    const target = pal.find((hx) => !sliceHexes(chart).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    assert.equal(sliceHexes(h.chart())[0], target);
    assert.equal(legendHexes(h.chart())[0], target);
  });

  test('pie colors: regenerating a nested chart replaces it in place', async () => {
    const { h, inner, chart } = await nestedChart();
    const index = inner.children.indexOf(chart);
    const size = { w: chart.width, h: chart.height };
    await h.generate(payload('pie', { values: values(3), replace: true }));
    assert.equal(h.charts().length, 1);
    const next = h.chart();
    assert.equal(next.parent.id, inner.id);
    assert.equal(inner.children.indexOf(next), index);
    assert.deepEqual({ w: next.width, h: next.height }, size);
  });

  test('pie colors: selecting a slice acts on the chart; a renamed chart is still found', async () => {
    const { h, frame } = await renderSelected({ values: values(3) });
    h.select(slicesOf(h.chart())[1]);
    assert.equal(h.lastSelectionMessage().hasChart, true, 'slice selection reports its chart');
    const pal = paletteOf(h);
    const t1 = pal.find((hx) => !sliceHexes(h.chart()).includes(hx));
    await h.send({ type: 'recolor', index: 1, color: t1 });
    assert.equal(sliceHexes(h.chart())[1], t1);

    const chart = h.chart();
    chart.name = 'Donut';
    h.select(frame);
    assert.equal(h.lastSelectionMessage().hasChart, true, 'renamed chart found by its data');
    const t2 = pal.find((hx) => !sliceHexes(chart).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: t2 });
    assert.equal(sliceHexes(chart)[0], t2);
  });

  // ── Charts without readable pluginData ─────────────────────────────────────

  async function withoutPluginData(key, opts, size) {
    const s = size || { w: 500, h: 500 };
    const author = loadPlugin(key, { seed: 19 });
    const frame = author.selectFrame(s.w, s.h);
    const msg = payload('pie', opts);
    await author.generate(msg);
    const chart = author.chart();
    const original = author.chartParams(chart);
    chart.setPluginData('chartParams', '');
    const reader = loadPlugin(PLUGIN);
    const d = reader.global.readChartParams(chart);
    return { author, frame, chart, original, recovered: JSON.parse(JSON.stringify(d)) };
  }

  for (const align of ['left', 'center', 'right']) {
    test('pie colors: legend and colors are recovered from layers (' + align + ')', async () => {
      const labels = ['Кол-во запусков', 'Кол-во ошибок', 'Третья'];
      const { recovered, original } = await withoutPluginData('pie', {
        values: values(3), showLegend: true, legendLabels: labels, legendAlign: align,
      });
      assert.equal(recovered.showLegend, true);
      assert.deepEqual(recovered.legendLabels, labels);
      assert.equal(recovered.legendAlign, align);
      assert.deepEqual(recovered.colors.map(hexOf), original.colors.map(hexOf));
    });
  }

  test('pie colors: a one-segment pie is recovered as one segment', async () => {
    const { recovered, original } = await withoutPluginData('pie', { values: [42], showLegend: true, legendLabels: ['Only'] });
    assert.equal(recovered.segmentsCount, 1);
    assert.deepEqual(recovered.colors.map(hexOf), original.colors.map(hexOf));
    assert.deepEqual(recovered.legendLabels, ['Only']);
  });

  test('pie colors: a combined-generator pie keeps its legend in standalone Get values', async () => {
    const { recovered } = await withoutPluginData('all', {
      values: values(2), showLegend: true, legendLabels: ['Кол-во запусков', 'Кол-во ошибок'], legendAlign: 'center',
    }, { w: 600, h: 300 });
    assert.equal(recovered.showLegend, true);
    assert.deepEqual(recovered.legendLabels, ['Кол-во запусков', 'Кол-во ошибок']);
    assert.equal(recovered.legendAlign, 'center');
    assert.equal(recovered.colors.length, 2);

    const ui = loadUI('pie');
    ui.receive(selection(recovered));
    ui.global.regenerate();
    assert.equal(ui.el('showLegendCheck').checked, true);
    assert.equal(ui.el('legendInput').value, 'Кол-во запусков, Кол-во ошибок');
  });

  test('pie colors: paginated legend recovers the first page without the paginator text', async () => {
    const labels = Array.from({ length: 12 }, (_, i) => 'Segment long name ' + (i + 1));
    const { recovered } = await withoutPluginData('pie', {
      values: values(12), showLegend: true, legendLabels: labels, legendAlign: 'right',
    }, { w: 240, h: 300 });
    assert.equal(recovered.legendAlign, 'right');
    assert.ok(recovered.legendLabels.length > 0 && recovered.legendLabels.length < 12);
    assert.deepEqual(recovered.legendLabels, labels.slice(0, recovered.legendLabels.length));
  });

  test('pie colors: recoloring a data-less chart keeps its legend for Get values', async () => {
    const h = loadPlugin(PLUGIN, { seed: 23 });
    const frame = h.selectFrame(500, 500);
    await h.generate(payload('pie', { values: values(2), showLegend: true, legendLabels: ['A', 'B'], legendAlign: 'center' }));
    h.chart().setPluginData('chartParams', '');
    h.select(frame);
    await h.send({ type: 'recolor', index: 0, color: paletteOf(h)[7] });
    const p = h.chartParams();
    assert.equal(p.showLegend, true);
    assert.deepEqual(p.legendLabels, ['A', 'B']);
    assert.equal(p.legendAlign, 'center');
    assert.equal(sliceHexes(h.chart())[0], paletteOf(h)[7]);
  });

  // ── UI side ─────────────────────────────────────────────────────────────────

  async function realChartData(opts) {
    const h = loadPlugin(PLUGIN, { seed: 7 });
    h.selectFrame(500, 500);
    await h.generate(payload('pie', opts));
    return h.lastSelectionMessage().chartData;
  }

  function selection(chartData) {
    return { type: 'selection', hasFrame: true, name: 'Frame', width: 500, height: 500, hasChart: !!chartData, chartData };
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
    const plugin = loadPlugin(PLUGIN, { seed: 41 });
    plugin.selectFrame(500, 500);
    await plugin.generate(payload('pie', opts || { values: values(3), showLegend: true, legendLabels: ['A', 'B', 'C'] }));
    const ui = loadUI('pie');
    ui.el('segmentsInput').value = String(plugin.chartParams().segmentsCount); // mini-DOM has no markup defaults
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange();
    await flush();
    return { plugin, ui, flush };
  }

  async function getValues(plugin) {
    const ui = loadUI('pie');
    ui.el('segmentsInput').value = String(plugin.chartParams().segmentsCount);
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange();
    await flush();
    ui.global.regenerate();
    return ui;
  }

  test('pie colors UI: requests the palette and sorts the grid by hue, grays last', () => {
    const pal = Array.from(loadPlugin(PLUGIN).global.PALETTE_HEX);
    const ui = loadUI('pie');
    assert.equal(ui.posted('get-palette').length, 1);
    ui.receive({ type: 'palette', colors: pal });
    assert.deepEqual(Array.from(ui.global.paletteHex), pal, 'generation order untouched');
    const shown = Array.from(ui.global.paletteDisplay);
    assert.deepEqual([...shown].sort(), [...pal].sort());
    const hsl = shown.map((hx) => ui.global.hexToHsl(hx));
    const firstGray = hsl.findIndex((c) => c.s < ui.global.GRAY_SATURATION);
    assert.ok(firstGray > 0);
    assert.ok(hsl.slice(firstGray).every((c) => c.s < ui.global.GRAY_SATURATION));
    const keys = hsl.slice(0, firstGray).map((c) => (c.h + 15) % 360);
    for (let i = 1; i < keys.length; i++) assert.ok(keys[i] >= keys[i - 1] - 0.5);
  });

  test('pie colors UI: rows label palette vs custom colors; hint says where a pick lands', async () => {
    const pal = Array.from(loadPlugin(PLUGIN).global.PALETTE_HEX);
    const ui = loadUI('pie');
    ui.receive({ type: 'palette', colors: pal });
    assert.equal(ui.global.colorValueText(null), 'Auto');
    assert.equal(ui.global.colorValueText(pal[0]), 'Palette · ' + pal[0]);
    assert.equal(ui.global.colorValueText('#3D3D3D'), 'Custom · #3D3D3D');
    ui.global.updateSegmentColorsHint();
    assert.equal(ui.el('segmentColorsHint').textContent, 'Colors apply when you insert the chart');
    ui.receive(selection(await realChartData({ values: values(2) })));
    assert.equal(ui.el('segmentColorsHint').textContent, 'Colors apply to the selected chart right away');
  });

  test('pie colors UI: rows follow the effective segment count (values win over the count field)', () => {
    const ui = loadUI('pie');
    ui.el('customColorsCheck').checked = true;
    ui.el('segmentsInput').value = '3';
    ui.global.setSegmentColor(1, '#05C46B');
    ui.el('segmentsInput').dispatch('change');
    assert.deepEqual(Array.from(ui.global.segmentColorState).length, 3);
    ui.el('valuesInput').value = '10, 20, 30, 40, 50';
    ui.el('valuesInput').dispatch('change');
    const state = Array.from(ui.global.segmentColorState);
    assert.equal(state.length, 5);
    assert.equal(state[1], '#05C46B', 'existing pick kept');
    assert.ok(ui.posted('suggest-colors').length > 0, 'new rows ask for colors');
  });

  test('pie colors UI: picker off → generate sends only Auto; on → sends picks and the flag', () => {
    const ui = loadUI('pie');
    ui.el('segmentsInput').value = '3';
    ui.global.setSegmentColor(0, '#4D7CFE');
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).segmentColors), [null, null, null]);
    assert.equal(lastGenerate(ui).customColors, false);
    ui.el('customColorsCheck').checked = true;
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).segmentColors), ['#4D7CFE', null, null]);
    assert.equal(lastGenerate(ui).customColors, true);
  });

  test('pie colors UI: enabling the picker shows the selected chart colors; picking repaints it', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const strokes = sliceHexes(plugin.chart());
    enablePicker(ui);
    await flush();
    assert.deepEqual(Array.from(ui.global.segmentColorState), strokes);
    assert.deepEqual(sliceHexes(plugin.chart()), strokes, 'switching on does not repaint');
    const target = pal.find((hx) => !strokes.includes(hx));
    ui.global.setSegmentColor(0, target);
    assert.deepEqual(plain(ui.posted('recolor').pop()), { type: 'recolor', index: 0, color: target });
    await flush();
    assert.equal(sliceHexes(plugin.chart())[0], target);
    assert.equal(legendHexes(plugin.chart())[0], target);
  });

  test('pie colors UI: the Auto button generates and applies a new color', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(ui);
    await flush();
    for (let round = 0; round < 5; round++) {
      const before = sliceHexes(plugin.chart());
      ui.global.generateSegmentColor(1);
      assert.deepEqual(Array.from(ui.posted('suggest-colors').pop().avoid), [before[1]]);
      await flush();
      const after = sliceHexes(plugin.chart());
      assert.notEqual(after[1], before[1]);
      assert.equal(after[0], before[0]);
      assert.ok(pal.includes(after[1]));
      assert.equal(ui.global.segmentColorState[1], after[1]);
    }
  });

  test('pie colors UI: a live recolor keeps the "Get values" form state', async () => {
    const { plugin, ui, flush } = await liveSetup();
    ui.global.regenerate();
    enablePicker(ui);
    await flush();
    ui.global.setSegmentColor(1, Array.from(plugin.global.PALETTE_HEX)[50]);
    await flush();
    assert.equal(ui.el('insertBtn').disabled, false);
    assert.equal(ui.global.replaceMode, true);
  });

  test('pie colors UI: picker state is remembered by Get values (on, picks, off, paste)', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(ui);
    await flush();
    let again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, true, 'switching on is remembered');
    assert.deepEqual(Array.from(again.global.segmentColorState), sliceHexes(plugin.chart()));

    again.global.setSegmentColor(2, pal[44]);
    const flush2 = bridge(again, plugin);
    await flush2();
    again.global.generate(); // Insert (replace)
    await flush2();
    assert.equal(sliceHexes(plugin.chart())[2], pal[44]);
    const third = await getValues(plugin);
    assert.equal(third.el('customColorsCheck').checked, true);
    assert.equal(third.global.segmentColorState[2], pal[44]);

    const data = JSON.parse(JSON.stringify(plugin.lastSelectionMessage().chartData));
    const other = loadPlugin(PLUGIN, { seed: 61 });
    other.selectFrame(400, 400);
    await other.paste(data);
    const pasted = await getValues(other);
    assert.equal(pasted.el('customColorsCheck').checked, true, 'paste carries the picker state');

    third.el('customColorsCheck').checked = false;
    third.el('customColorsCheck').dispatch('change');
    await bridge(third, plugin)();
    const off = await getValues(plugin);
    assert.equal(off.el('customColorsCheck').checked, false, 'switching off is remembered');
  });

  test('pie colors UI: switching on another chart takes that chart colors, not leftovers', async () => {
    const { plugin, ui, flush } = await liveSetup();
    ui.el('customColorsCheck').checked = true;
    ui.global.setSegmentColor(0, '#3D3D3D');
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    await flush();
    const s = sliceHexes(plugin.chart());
    enablePicker(ui);
    await flush();
    assert.deepEqual(Array.from(ui.global.segmentColorState), s);
    assert.deepEqual(sliceHexes(plugin.chart()), s);
  });

  test('pie colors UI: a stale suggestion does not overwrite newer state', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 9 });
    const ui = loadUI('pie');
    ui.el('segmentsInput').value = '2';
    enablePicker(ui);
    const first = ui.posted('suggest-colors').pop();
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    enablePicker(ui);
    await plugin.send(first);
    ui.receive(Object.assign({}, plugin.log.uiMessages.pop(), { requestId: first.requestId }));
    assert.deepEqual(Array.from(ui.global.segmentColorState), [null, null]);
  });

  test('pie colors UI: rows past the selected chart apply on Insert only (no failing recolor)', async () => {
    const { plugin, ui, flush } = await liveSetup(); // chart has 3 segments
    ui.el('segmentsInput').value = '5'; // the form asks for more
    enablePicker(ui);
    await flush();
    assert.equal(ui.global.segmentColorState.length, 5);
    const sent = ui.posted('recolor').length;
    ui.global.setSegmentColor(4, Array.from(plugin.global.PALETTE_HEX)[3]);
    assert.equal(ui.posted('recolor').length, sent, 'no recolor for segment 5');
    await flush();
    assert.deepEqual(plugin.errorNotifications().map((n) => n.message), []);
    assert.equal(ui.el('segmentColorsHint').classList.contains('error'), false);
  });

  test('pie colors: every palette hex pins to its own palette entry', () => {
    const h = loadPlugin(PLUGIN);
    const pal = Array.from(h.global.PALETTE);
    const hexes = Array.from(h.global.PALETTE_HEX);
    for (let i = 0; i < pal.length; i++) {
      assert.equal(colorKey(h.global.resolveSeriesColors(1, [hexes[i]])[0]), colorKey(pal[i]));
    }
  });
}

for (const v of VARIANTS) defineSuite(v.key, v.label);

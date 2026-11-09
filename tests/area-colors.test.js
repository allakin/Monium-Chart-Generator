'use strict';

/**
 * Chart Area — user-pinned area colors (the color picker in ui.html).
 *
 * Port of tests/line-colors.test.js. The picker offers the generation palette
 * itself; a pinned color must reach the area fill (keeping its fill opacity)
 * and the legend dot, survive "Get values from chart" → Insert, regenerate in
 * place, and copy → paste into another frame. Auto areas keep being generated,
 * distinct from the pinned ones. Recoloring never touches geometry — stacked
 * areas keep their exact paths.
 *
 * Standalone Chart Area only: the combined generator has no picker yet.
 */

const nodeTest = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { layerItems, colorKey, assertColorsDistinct, plain } = require('./helpers/inspect');
const { deltaEWorstVision } = require('./helpers/color');

// Plugin-side cases run twice: against the standalone plugin and against the
// area tab of the combined generator (both speak the same message API). UI cases
// (" UI" in the name) drive the standalone ui.html — the combined UI has its own
// suite, tests/all-colors-ui.test.js — and the cases below are standalone-only.
const VARIANTS = [
  { key: 'area', label: 'standalone' },
  { key: 'all', label: 'combined generator' },
];
const STANDALONE_ONLY = [
  'keeps its legend in standalone Get values', // drives the standalone ui.html
];

function defineSuite(PLUGIN, LABEL) {
  const V = ' [' + LABEL + ']';
  const test = (name, ...rest) => {
    if (PLUGIN === 'all' && (/ UI[: ]/.test(name) || STANDALONE_ONLY.some((n) => name.indexOf(n) !== -1))) return undefined;
    return nodeTest(name + V, ...rest);
  };

  /** Independent rgb(0..1) → "#RRGGBB", rounded the way a designer reads it. */
  function hexOf(c) {
    return (
      '#' +
      [c.r, c.g, c.b]
        .map((v) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase())
        .join('')
    );
  }

  function strokeHexes(container) {
    return layerItems(container, 'Areas').map((l) => hexOf(l.fills[0].color));
  }

  function legendHexes(container) {
    return layerItems(container, 'Legend')
      .filter((n) => n.type === 'ELLIPSE')
      .map((r) => hexOf(r.fills[0].color));
  }

  async function render(opts, seed, size) {
    const s = size || { w: 600, h: 400 };
    const h = loadPlugin(PLUGIN, { seed: seed === undefined ? 11 : seed });
    const frame = h.selectFrame(s.w, s.h);
    await h.generate(payload('area', opts));
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    return { handle: h, frame, container: h.chart() };
  }

  function paletteOf(handle) {
    return Array.from(handle.global.PALETTE_HEX);
  }

  /** Floor for an Auto color vs any other area (OKLab ΔE×100, worst vision model). */
  const AUTO_MIN_DELTA_E = 10;

  // ── Plugin side ─────────────────────────────────────────────────────────────

  test('area colors: get-palette replies with every generation palette color', async () => {
    const h = loadPlugin(PLUGIN);
    await h.send({ type: 'get-palette' });
    const msg = h.log.uiMessages.filter((m) => m.type === 'palette').pop();
    assert.ok(msg, 'plugin answers with a palette message');
    assert.equal(msg.colors.length, h.global.PALETTE.length, 'one entry per palette color');
    assert.deepEqual(msg.colors, Array.from(h.global.PALETTE).map(hexOf));
    assert.equal(new Set(msg.colors).size, msg.colors.length, 'palette hexes are unique');
  });

  test('area colors: pinned colors drive the strokes and the legend', async () => {
    const probe = loadPlugin(PLUGIN);
    const pal = paletteOf(probe);
    const pins = [pal[4], null, pal[20], null];
    const { container, handle } = await render({
      areasCount: 4,
      showLegend: true,
      legendLabels: ['A', 'B', 'C', 'D'],
      areaColors: pins,
    });

    const strokes = strokeHexes(container);
    assert.equal(strokes[0], pal[4], 'area 1 wears its pinned color');
    assert.equal(strokes[2], pal[20], 'area 3 wears its pinned color');
    assert.deepEqual(legendHexes(container), strokes, 'legend dots repeat the area colors');

    for (const hx of strokes) assert.ok(pal.includes(hx), hx + ' comes from the palette');
    assertColorsDistinct(layerItems(container, 'Areas').map((l) => l.fills[0].color));

    const params = handle.chartParams(container);
    assert.deepEqual(params.areaColors, pins, 'chartParams keeps the pins, Auto stays null');
    assert.deepEqual(params.colors.map(hexOf), strokes, 'chartParams.colors is what was drawn');
  });

  test('area colors: pinned color shows in the legend even when it is the only line', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const { container } = await render({
      areasCount: 1,
      showLegend: true,
      legendLabels: ['Solo'],
      areaColors: [pal[9]],
    });
    assert.deepEqual(strokeHexes(container), [pal[9]]);
    assert.deepEqual(legendHexes(container), [pal[9]]);
  });

  test('area colors: Auto lines stay perceptually apart from the pinned ones', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    let worst = Infinity;
    for (let seed = 1; seed <= 40; seed++) {
      const pins = [pal[seed % pal.length], null, null, pal[(seed * 7 + 3) % pal.length], null];
      if (pins[0] === pins[3]) continue;
      const { container } = await render({ areasCount: 5, areaColors: pins }, seed);
      const colors = layerItems(container, 'Areas').map((l) => l.fills[0].color);
      assertColorsDistinct(colors, 'seed ' + seed);
      // Every Auto area (1, 2, 4) against every other area, under all vision models.
      for (const a of [1, 2, 4]) {
        for (let b = 0; b < colors.length; b++) {
          if (a !== b) worst = Math.min(worst, deltaEWorstVision(colors[a], colors[b]));
        }
      }
    }
    assert.ok(worst >= AUTO_MIN_DELTA_E, 'closest Auto pair ΔE ' + worst.toFixed(1) + ' < ' + AUTO_MIN_DELTA_E);
  });

  test('area colors: without pins generation is unchanged', async () => {
    const a = await render({ areasCount: 4 }, 5);
    const b = await render({ areasCount: 4, areaColors: [null, null, null, null] }, 5);
    assert.deepEqual(strokeHexes(b.container), strokeHexes(a.container));
    assert.deepEqual(a.handle.chartParams().areaColors, [null, null, null, null]);
  });

  test('area colors: invalid and extra entries fall back safely', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const lower = pal[3].toLowerCase();
    const { handle, container } = await render({
      areasCount: 3,
      areaColors: ['#12345', lower, 'red', pal[0], pal[1]],
    });
    const params = handle.chartParams(container);
    assert.deepEqual(params.areaColors, [null, pal[3], null], 'only valid #RRGGBB pins; length = areasCount');
    assert.equal(strokeHexes(container)[1], pal[3], 'hex case does not matter');
  });

  test('area colors: a hex outside the palette is drawn as is and stays pinned', async () => {
    const h = loadPlugin(PLUGIN);
    const pal = paletteOf(h);
    const OFF = '#3D3D3D'; // removed from the palette in v2.2 — old charts may still carry it
    assert.equal(pal.includes(OFF), false, 'fixture color must be off-palette');

    const { handle, container } = await render({
      areasCount: 3,
      showLegend: true,
      legendLabels: ['Old', 'B', 'C'],
      areaColors: [OFF.toLowerCase(), null, null],
    });
    const strokes = strokeHexes(container);
    assert.equal(strokes[0], OFF, 'area wears the exact off-palette color');
    assert.deepEqual(legendHexes(container), strokes, 'legend marker matches');
    assert.ok(pal.includes(strokes[1]) && pal.includes(strokes[2]), 'Auto areas still come from the palette');
    assert.deepEqual(handle.chartParams(container).areaColors, [OFF, null, null]);

    const colors = layerItems(container, 'Areas').map((l) => l.fills[0].color);
    for (const a of [1, 2]) {
      assert.ok(
        deltaEWorstVision(colors[a], colors[0]) >= AUTO_MIN_DELTA_E,
        'Auto area ' + (a + 1) + ' stays apart from the off-palette pin',
      );
    }

    // Survives copy → paste and a regenerate from the pasted chart.
    const target = loadPlugin(PLUGIN, { seed: 2 });
    target.selectFrame(400, 300);
    await target.paste(handle.chartParams(container));
    assert.equal(strokeHexes(target.chart())[0], OFF);
    await target.generate(payload('area', { areasCount: 3, areaColors: [OFF, null, null], replace: true }));
    assert.equal(strokeHexes(target.chart())[0], OFF);
  });

  test('area colors: suggest-colors fills Auto slots around the pins', async () => {
    const h = loadPlugin(PLUGIN, { seed: 21 });
    const pal = paletteOf(h);
    await h.send({ type: 'suggest-colors', requestId: 7, count: 4, areaColors: [null, pal[10], null, '#3D3D3D'] });
    const msg = h.log.uiMessages.filter((m) => m.type === 'suggested-colors').pop();
    assert.ok(msg, 'plugin answers with suggested-colors');
    assert.equal(msg.requestId, 7, 'request id is echoed so the UI can drop stale replies');
    assert.equal(msg.colors.length, 4);
    assert.equal(msg.colors[1], pal[10], 'pins are kept');
    assert.equal(msg.colors[3], '#3D3D3D', 'off-palette pin is kept');
    assert.ok(pal.includes(msg.colors[0]) && pal.includes(msg.colors[2]), 'suggestions are palette colors');
    assert.equal(new Set(msg.colors).size, 4, 'suggestions do not repeat pinned colors');
    assert.equal(h.charts().length, 0, 'suggesting draws nothing');
  });

  test('area colors: regenerate keeps pins and re-rolls Auto lines', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(600, 400);
    const pins = [null, pal[12], null];
    await h.generate(payload('area', { areasCount: 3, areaColors: pins }));
    const first = strokeHexes(h.chart());

    const autoSeen = new Set([first[0] + first[2]]);
    for (let i = 0; i < 6; i++) {
      // Same flow as "Get values from chart" → Insert: the form resends its pins.
      const saved = h.chartParams();
      await h.generate(payload('area', { areasCount: 3, areaColors: saved.areaColors, replace: true }));
      assert.equal(h.charts().length, 1, 'regenerate replaces, not appends');
      const next = strokeHexes(h.chart());
      assert.equal(next[1], pal[12], 'pinned area keeps its color on regenerate');
      autoSeen.add(next[0] + next[2]);
    }
    assert.ok(autoSeen.size > 1, 'Auto lines still vary between regenerations');
  });

  test('area colors: copy → paste into another frame keeps pins and colors', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const pins = [pal[30], null, pal[2]];
    const source = await render({
      areasCount: 3,
      showLegend: true,
      legendLabels: ['X', 'Y', 'Z'],
      areaColors: pins,
    });
    const chartData = JSON.parse(JSON.stringify(source.handle.lastSelectionMessage().chartData));
    assert.deepEqual(chartData.areaColors, pins, 'selection message carries the pins to the UI');

    const target = loadPlugin(PLUGIN, { seed: 999 });
    target.selectFrame(320, 240);
    await target.paste(chartData);
    const pasted = target.chart();
    assert.deepEqual(strokeHexes(pasted), strokeHexes(source.container), 'exact colors, Auto ones included');
    assert.deepEqual(legendHexes(pasted), strokeHexes(source.container), 'legend matches after paste');
    assert.deepEqual(target.chartParams(pasted).areaColors, pins, 'pins survive the paste');

    // Editing the pasted chart: the form resends the pasted pins.
    await target.generate(payload('area', { areasCount: 3, areaColors: pins, replace: true }));
    const regenerated = strokeHexes(target.chart());
    assert.equal(regenerated[0], pal[30]);
    assert.equal(regenerated[2], pal[2]);
  });

  test('area colors: changing lines count trims pins of removed lines', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const { handle } = await render({ areasCount: 2, areaColors: [pal[1], pal[2], pal[3]] });
    assert.deepEqual(handle.chartParams().areaColors, [pal[1], pal[2]]);
  });

  test('area colors: chart without stored pins (older version) still renders and pastes', async () => {
    const source = await render({ areasCount: 3 });
    const chartData = source.handle.chartParams();
    delete chartData.areaColors;
    const target = loadPlugin(PLUGIN, { seed: 4 });
    target.selectFrame(600, 400);
    await target.paste(chartData);
    assert.deepEqual(strokeHexes(target.chart()), strokeHexes(source.container));
    assert.deepEqual(target.chartParams().areaColors, [null, null, null]);
  });

  // ── UI side ─────────────────────────────────────────────────────────────────

  async function realChartData(opts) {
    const h = loadPlugin(PLUGIN, { seed: 7 });
    h.selectFrame(600, 400);
    await h.generate(payload('area', opts));
    return h.lastSelectionMessage().chartData;
  }

  function selection(chartData) {
    return { type: 'selection', hasFrame: true, name: 'Frame', width: 600, height: 400, hasChart: !!chartData, chartData };
  }

  function lastGenerate(ui) {
    return ui.posted('generate').pop();
  }

  test('area colors UI: requests the palette from the plugin on load', () => {
    const ui = loadUI('area');
    assert.equal(ui.posted('get-palette').length, 1, 'asks code.js for the palette once');

    const plugin = loadPlugin(PLUGIN);
    const hexes = Array.from(plugin.global.PALETTE_HEX);
    ui.receive({ type: 'palette', colors: hexes });
    assert.deepEqual(Array.from(ui.global.paletteHex), hexes, 'UI shows exactly the generation palette');
  });

  test('area colors UI: picker off → generate sends only Auto', () => {
    const ui = loadUI('area');
    ui.el('areasInput').value = '3';
    ui.global.setSeriesColor(0, '#4D7CFE');
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).areaColors), [null, null, null]);
  });

  test('area colors UI: picked colors are sent with generate', () => {
    const ui = loadUI('area');
    ui.el('areasInput').value = '3';
    ui.el('customColorsCheck').checked = true;
    ui.global.setSeriesColor(2, '#ff6b6b');
    ui.global.setSeriesColor(0, '#4D7CFE');
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).areaColors), ['#4D7CFE', null, '#FF6B6B']);

    ui.global.setSeriesColor(0, null); // "Auto" / reset
    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).areaColors), [null, null, '#FF6B6B']);
  });

  test('area colors UI: lines count change resizes the picker, keeping existing picks', () => {
    const ui = loadUI('area');
    ui.el('customColorsCheck').checked = true;
    ui.el('areasInput').value = '2';
    ui.global.setSeriesColor(1, '#05C46B');
    ui.el('areasInput').value = '4';
    ui.el('areasInput').dispatch('change');
    assert.deepEqual(Array.from(ui.global.colorState), [null, '#05C46B', null, null]);
    ui.el('areasInput').value = '1';
    ui.el('areasInput').dispatch('change');
    assert.deepEqual(Array.from(ui.global.colorState), [null]);
  });

  test('area colors UI: "Get values from chart" restores pins and resends them', async () => {
    const plugin = loadPlugin(PLUGIN);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const data = await realChartData({ areasCount: 3, areaColors: [null, pal[5], null] });

    const ui = loadUI('area');
    ui.receive(selection(data));
    ui.global.regenerate();

    assert.equal(ui.el('customColorsCheck').checked, true, 'picker opens when the chart has pins');
    assert.equal(ui.el('seriesColorsField').style.display, 'block');
    assert.deepEqual(Array.from(ui.global.colorState), [null, pal[5], null]);
    assert.deepEqual(
      Array.from(ui.global.autoColorPreview),
      data.colors.map(hexOf),
      'Auto rows preview the colors the chart has now',
    );

    ui.global.generate();
    const sent = lastGenerate(ui);
    assert.equal(sent.replace, true);
    assert.deepEqual(Array.from(sent.areaColors), [null, pal[5], null]);
  });

  test('area colors UI: chart without pins leaves the picker off', async () => {
    const data = await realChartData({ areasCount: 2 });
    const ui = loadUI('area');
    ui.el('customColorsCheck').checked = true;
    ui.global.setSeriesColor(0, '#05C46B');
    ui.receive(selection(data));
    ui.global.regenerate();
    assert.equal(ui.el('customColorsCheck').checked, false);
    assert.deepEqual(Array.from(ui.global.colorState), [null, null]);
  });

  test('area colors UI: paste repopulates the picker from the pasted chart', async () => {
    const plugin = loadPlugin(PLUGIN);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const data = await realChartData({ areasCount: 2, areaColors: [pal[8], null] });

    const ui = loadUI('area');
    ui.receive(selection(data));
    ui.global.copyChart();
    ui.clock.tick(1000);
    ui.receive(selection(null)); // user selects another, empty frame
    ui.global.pasteChart();
    const pasteMsg = ui.posted('paste').pop();
    assert.deepEqual(Array.from(pasteMsg.chartData.areaColors), [pal[8], null], 'paste carries the pins');

    ui.receive(selection(data)); // plugin reports the pasted chart
    assert.deepEqual(Array.from(ui.global.colorState), [pal[8], null]);
    assert.equal(ui.el('customColorsCheck').checked, true);
  });

  /** Answer the UI's last suggest-colors request with the real plugin. */
  async function answerSuggestion(ui, plugin) {
    const req = ui.posted('suggest-colors').pop();
    assert.ok(req, 'UI asked the plugin for suggestions');
    await plugin.send(req);
    ui.receive(plugin.log.uiMessages.filter((m) => m.type === 'suggested-colors').pop());
    return req;
  }

  function enablePicker(ui) {
    ui.el('customColorsCheck').checked = true;
    ui.el('customColorsCheck').dispatch('change');
  }

  test('area colors UI: enabling the picker shows the chart colors right away', async () => {
    const data = await realChartData({ areasCount: 3 });
    const ui = loadUI('area');
    ui.receive(selection(data));
    ui.global.regenerate();
    assert.equal(ui.el('customColorsCheck').checked, false);

    enablePicker(ui);
    assert.deepEqual(
      Array.from(ui.global.colorState),
      data.colors.map(hexOf),
      'every row takes the color its area has on the chart, no "Auto" left',
    );
    assert.equal(ui.posted('suggest-colors').length, 0, 'known colors need no suggestion');

    ui.global.generate();
    assert.deepEqual(Array.from(lastGenerate(ui).areaColors), data.colors.map(hexOf), 'regenerate keeps them');
  });

  test('area colors UI: enabling the picker on a new chart fills rows from the palette', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 5 });
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const ui = loadUI('area');
    ui.receive({ type: 'palette', colors: pal });
    ui.el('areasInput').value = '4';
    ui.global.setSeriesColor(2, pal[0]); // a pick made before switching on is kept
    enablePicker(ui);

    const req = await answerSuggestion(ui, plugin);
    assert.deepEqual(Array.from(req.areaColors), [null, null, pal[0], null], 'existing pick is sent as a pin');
    const state = Array.from(ui.global.colorState);
    assert.equal(state[2], pal[0]);
    for (const hx of state) assert.ok(pal.includes(hx), hx + ' is a palette color');
    assert.equal(new Set(state).size, 4, 'four different colors');
  });

  test('area colors UI: new lines added while the picker is on get a color', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 8 });
    const ui = loadUI('area');
    ui.el('areasInput').value = '2';
    enablePicker(ui);
    await answerSuggestion(ui, plugin);
    const before = Array.from(ui.global.colorState);

    ui.el('areasInput').value = '4';
    ui.el('areasInput').dispatch('change');
    await answerSuggestion(ui, plugin);
    const after = Array.from(ui.global.colorState);
    assert.deepEqual(after.slice(0, 2), before, 'existing rows untouched');
    assert.ok(after[2] && after[3], 'new rows got colors');
  });

  test('area colors UI: a stale suggestion does not overwrite newer state', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 9 });
    const ui = loadUI('area');
    ui.el('areasInput').value = '2';
    enablePicker(ui);
    const first = ui.posted('suggest-colors').pop();
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    enablePicker(ui); // second request supersedes the first
    await plugin.send(first);
    ui.receive(Object.assign({}, plugin.log.uiMessages.pop(), { requestId: first.requestId }));
    assert.deepEqual(Array.from(ui.global.colorState), [null, null], 'stale reply ignored');
    await answerSuggestion(ui, plugin);
    assert.ok(ui.global.colorState.every((c) => c !== null), 'current reply applied');
  });

  test('area colors UI: a chart color outside the palette shows as its hex', async () => {
    const plugin = loadPlugin(PLUGIN);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const data = await realChartData({ areasCount: 2 });
    data.colors[0] = { r: 61 / 255, g: 61 / 255, b: 61 / 255 }; // #3D3D3D, an old palette color

    const ui = loadUI('area');
    ui.receive({ type: 'palette', colors: pal });
    ui.receive(selection(data));
    ui.global.regenerate();
    enablePicker(ui);
    assert.equal(ui.global.colorState[0], '#3D3D3D', 'kept as a hex, not replaced');
    assert.equal(ui.global.isPaletteColor('#3D3D3D'), false);
    ui.global.generate();
    assert.equal(lastGenerate(ui).areaColors[0], '#3D3D3D', 'sent to the plugin as is');
  });

  // ── Live recolor of the selected chart ─────────────────────────────────────

  async function renderSelected(opts, seed) {
    const h = loadPlugin(PLUGIN, { seed: seed === undefined ? 31 : seed });
    const frame = h.selectFrame(600, 400);
    await h.generate(payload('area', opts));
    return { h, frame };
  }

  test('area colors: recolor repaints one line and its legend marker in place', async () => {
    const { h } = await renderSelected({ areasCount: 3, showLegend: true, legendLabels: ['A', 'B', 'C'] });
    const pal = paletteOf(h);
    const before = h.chartParams();
    const beforeStrokes = strokeHexes(h.chart());
    const target = pal.find((hx) => !beforeStrokes.includes(hx));
    const paths = layerItems(h.chart(), 'Areas').map((l) => l.vectorPaths[0].data);

    await h.send({ type: 'recolor', index: 1, color: target });

    const container = h.chart();
    assert.equal(h.charts().length, 1, 'no new chart is created');
    const after = strokeHexes(container);
    assert.deepEqual(after, [beforeStrokes[0], target, beforeStrokes[2]], 'only area 2 changes');
    assert.deepEqual(legendHexes(container), after, 'legend dot follows');
    assert.deepEqual(layerItems(container, 'Areas').map((l) => l.vectorPaths[0].data), paths, 'data not regenerated');

    const params = h.chartParams();
    assert.deepEqual(params.areaColors, [null, target, null], 'pin saved to pluginData');
    assert.deepEqual(params.colors.map(hexOf), after);
    assert.deepEqual(params.allSeries, before.allSeries);

    const sel = h.lastSelectionMessage();
    assert.equal(sel.reason, 'recolor', 'UI is told the update came from a recolor');
    assert.deepEqual(sel.chartData.areaColors, [null, target, null]);
  });

  test('area colors: recolor survives copy → paste and regenerate', async () => {
    const { h } = await renderSelected({ areasCount: 2 });
    const pal = paletteOf(h);
    const target = pal.find((hx) => !strokeHexes(h.chart()).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });

    const other = loadPlugin(PLUGIN, { seed: 77 });
    other.selectFrame(500, 300);
    await other.paste(h.lastSelectionMessage().chartData);
    assert.equal(strokeHexes(other.chart())[0], target, 'pasted chart keeps the recolor');

    await h.generate(payload('area', { areasCount: 2, areaColors: h.chartParams().areaColors, replace: true }));
    assert.equal(strokeHexes(h.chart())[0], target, 'regenerate keeps the recolor');
  });

  test('area colors: recolor to Auto unpins without changing the color', async () => {
    const { h } = await renderSelected({ areasCount: 2 });
    const pal = paletteOf(h);
    await h.send({ type: 'recolor', index: 0, color: pal[40] });
    await h.send({ type: 'recolor', index: 0, color: null });
    assert.equal(strokeHexes(h.chart())[0], pal[40], 'color stays until the next regenerate');
    assert.deepEqual(h.chartParams().areaColors, [null, null]);
  });

  test('area colors: recolor accepts an off-palette hex', async () => {
    const { h } = await renderSelected({ areasCount: 2, showLegend: true, legendLabels: ['A', 'B'] });
    await h.send({ type: 'recolor', index: 1, color: '#3d3d3d' });
    assert.equal(strokeHexes(h.chart())[1], '#3D3D3D');
    assert.equal(legendHexes(h.chart())[1], '#3D3D3D');
    assert.deepEqual(h.chartParams().areaColors, [null, '#3D3D3D']);
  });

  test('area colors: recolor is a no-op without a selected chart or with a bad index', async () => {
    const { h, frame } = await renderSelected({ areasCount: 2 });
    const pal = paletteOf(h);
    const snapshot = JSON.stringify(h.chartParams());
    const strokes = strokeHexes(h.chart());

    await h.send({ type: 'recolor', index: 5, color: pal[0] });
    await h.send({ type: 'recolor', index: -1, color: pal[0] });
    h.clearSelection();
    await h.send({ type: 'recolor', index: 0, color: pal[0] });
    h.selectFrame(100, 100); // empty frame — no chart inside
    await h.send({ type: 'recolor', index: 0, color: pal[0] });

    h.select(frame);
    assert.deepEqual(strokeHexes(h.chart()), strokes);
    assert.equal(JSON.stringify(h.chartParams()), snapshot);
  });

  test('area colors: recolor works with a paginated legend (markers only on page 1)', async () => {
    const labels = Array.from({ length: 20 }, (_, i) => 'Series number ' + (i + 1));
    const h = loadPlugin(PLUGIN, { seed: 3 });
    h.selectFrame(300, 400);
    await h.generate(payload('area', { areasCount: 20, showLegend: true, legendLabels: labels }));
    const pal = paletteOf(h);
    const markers = legendHexes(h.chart()).length;
    assert.ok(markers < 20, 'fixture must paginate the legend');

    await h.send({ type: 'recolor', index: 0, color: pal[5] });
    await h.send({ type: 'recolor', index: 19, color: pal[6] });
    const strokes = strokeHexes(h.chart());
    assert.equal(strokes[0], pal[5]);
    assert.equal(strokes[19], pal[6]);
    assert.deepEqual(legendHexes(h.chart()), strokes.slice(0, markers), 'visible markers match their lines');
  });

  test('area colors: suggest-colors with avoid never returns the avoided color', async () => {
    const h = loadPlugin(PLUGIN, { seed: 12 });
    const pal = paletteOf(h);
    for (let i = 0; i < 30; i++) {
      const avoid = pal[i % pal.length];
      await h.send({ type: 'suggest-colors', requestId: i, count: 2, areaColors: [null, pal[(i + 9) % pal.length]], avoid: [avoid] });
      const msg = h.log.uiMessages.filter((m) => m.type === 'suggested-colors').pop();
      assert.notEqual(msg.colors[0], avoid);
      assert.ok(pal.includes(msg.colors[0]));
    }
  });

  // ── UI ↔ plugin loop ─────────────────────────────────────────────────────────

  /** Wire the real ui.html script and the real code.js together. */
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
    plugin.selectFrame(600, 400);
    await plugin.generate(payload('area', opts || { areasCount: 2, showLegend: true, legendLabels: ['A', 'B'] }));
    const ui = loadUI('area');
    ui.el('areasInput').value = String(plugin.chartParams().areasCount); // mini-DOM has no markup defaults
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange(); // UI learns about the selected chart
    await flush(); // palette + selection
    return { plugin, ui, flush };
  }

  test('area colors UI: picking a color on a selected chart repaints it at once', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(ui);
    await flush();
    const target = pal.find((hx) => !strokeHexes(plugin.chart()).includes(hx));

    ui.global.setSeriesColor(0, target);
    assert.deepEqual(plain(ui.posted('recolor').pop()), { type: 'recolor', index: 0, color: target });
    await flush();
    assert.equal(strokeHexes(plugin.chart())[0], target, 'area repainted without pressing Insert');
    assert.equal(legendHexes(plugin.chart())[0], target, 'legend dot repainted too');
  });

  test('area colors UI: the Auto button generates a new color and applies it', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(ui);
    await flush();
    for (let round = 0; round < 5; round++) {
      const before = strokeHexes(plugin.chart());
      ui.global.generateSeriesColor(1);
      const req = ui.posted('suggest-colors').pop();
      assert.deepEqual(Array.from(req.avoid), [before[1]], 'asks for something other than the current color');
      await flush();
      const after = strokeHexes(plugin.chart());
      assert.notEqual(after[1], before[1], 'round ' + round + ': area 2 got a new color');
      assert.equal(after[0], before[0], 'other area untouched');
      assert.ok(pal.includes(after[1]), 'generated color is from the palette');
      assert.notEqual(after[1], after[0], 'differs from the other area');
      assert.equal(ui.global.colorState[1], after[1], 'row shows the new color');
      assert.deepEqual(legendHexes(plugin.chart()), after);
    }
  });

  test('area colors UI: Auto button without a selected chart only updates the form', async () => {
    const plugin = loadPlugin(PLUGIN, { seed: 2 });
    const ui = loadUI('area');
    const flush = bridge(ui, plugin);
    ui.el('areasInput').value = '2';
    enablePicker(ui);
    await flush();
    const before = ui.global.colorState[0];
    ui.global.generateSeriesColor(0);
    await flush();
    assert.notEqual(ui.global.colorState[0], before);
    assert.equal(ui.posted('recolor').length, 0, 'nothing to recolor');
    assert.equal(plugin.charts().length, 0);
  });

  test('area colors UI: a live recolor keeps the "Get values" form state', async () => {
    const { plugin, ui, flush } = await liveSetup();
    ui.global.regenerate(); // Get values from chart → Insert becomes the regenerate button
    assert.equal(ui.el('insertBtn').disabled, false);
    enablePicker(ui);
    await flush();
    ui.global.setSeriesColor(1, Array.from(plugin.global.PALETTE_HEX)[50]);
    await flush();
    assert.equal(ui.el('insertBtn').disabled, false, 'Insert still enabled after recolor');
    assert.equal(ui.global.replaceMode, true, 'still in replace mode');
  });

  test('area colors UI: picking without a chart or with the picker off sends no recolor', async () => {
    const ui = loadUI('area');
    ui.el('customColorsCheck').checked = true;
    ui.global.setSeriesColor(0, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 0, 'no chart selected');

    const data = await realChartData({ areasCount: 2 });
    ui.receive(selection(data));
    ui.el('customColorsCheck').checked = false;
    ui.global.setSeriesColor(0, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 0, 'picker off');
  });

  test('area colors UI: rows say whether a color is from the palette', () => {
    const plugin = loadPlugin(PLUGIN);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const ui = loadUI('area');
    assert.equal(ui.global.colorValueText('#5F27CD'), '#5F27CD', 'before the palette arrives: plain hex');
    ui.receive({ type: 'palette', colors: pal });
    assert.equal(ui.global.colorValueText(null), 'Auto');
    assert.equal(ui.global.colorValueText('#5F27CD'), 'Palette · #5F27CD');
    assert.equal(ui.global.colorValueText('#FFC048'), 'Palette · #FFC048');
    assert.equal(ui.global.colorValueText('#3D3D3D'), 'Custom · #3D3D3D');
  });

  // ── Finding the chart the user means ───────────────────────────────────────

  /** A card frame holding a padding frame holding the chart — a typical layout. */
  async function nestedChart(opts) {
    const h = loadPlugin(PLUGIN, { seed: 51 });
    const card = h.selectFrame(700, 300, { name: 'Card' });
    const inner = h.createNode('FRAME', 'Content');
    inner.resize(640, 240);
    card.appendChild(inner);
    const spacer = h.createNode('FRAME', 'Header');
    spacer.resize(640, 20);
    inner.appendChild(spacer);
    h.select(inner);
    await h.generate(payload('area', opts || { areasCount: 2, showLegend: true, legendLabels: ['A', 'B'] }));
    h.select(card);
    return { h, card, inner, chart: h.chart() };
  }

  test('area colors: a chart nested in a card is detected and recolored', async () => {
    const { h, chart } = await nestedChart();
    const sel = h.lastSelectionMessage();
    assert.equal(sel.hasChart, true, 'card selection finds the nested chart');
    const pal = paletteOf(h);
    const target = pal.find((hx) => !strokeHexes(chart).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    assert.equal(strokeHexes(h.chart())[0], target);
    assert.equal(legendHexes(h.chart())[0], target);
  });

  test('area colors: regenerating a nested chart replaces it in place', async () => {
    const { h, inner, chart } = await nestedChart();
    const index = inner.children.indexOf(chart);
    const size = { w: chart.width, h: chart.height };
    await h.generate(payload('area', { areasCount: 2, replace: true }));
    assert.equal(h.charts().length, 1, 'no duplicate chart');
    const next = h.chart();
    assert.equal(next.parent.id, inner.id, 'stays in its own parent');
    assert.equal(inner.children.indexOf(next), index, 'keeps its layer position');
    assert.deepEqual({ w: next.width, h: next.height }, size, 'keeps its size');
  });

  test('area colors: selecting a layer inside the chart acts on the chart', async () => {
    const { h } = await renderSelected({ areasCount: 2 });
    const area = layerItems(h.chart(), 'Areas')[1];
    h.select(area);
    const sel = h.lastSelectionMessage();
    assert.equal(sel.hasChart, true, 'an area layer selection reports its chart');
    const pal = paletteOf(h);
    const target = pal.find((hx) => !strokeHexes(h.chart()).includes(hx));
    await h.send({ type: 'recolor', index: 1, color: target });
    assert.equal(strokeHexes(h.chart())[1], target);
  });

  test('area colors: a renamed chart is still found by its data', async () => {
    const { h, frame } = await renderSelected({ areasCount: 2 });
    const chart = h.chart();
    chart.name = 'Graph';
    h.select(frame);
    assert.equal(h.lastSelectionMessage().hasChart, true);
    const pal = paletteOf(h);
    const target = pal.find((hx) => !strokeHexes(chart).includes(hx));
    await h.send({ type: 'recolor', index: 0, color: target });
    const areas = chart.children.find((n) => n.name === 'Areas');
    assert.equal(hexOf(areas.children[0].fills[0].color), target);
  });

  test('area colors: a recolor that cannot apply says why', async () => {
    const { h } = await renderSelected({ areasCount: 2 });
    h.selectFrame(100, 100, { name: 'Empty' });
    await h.send({ type: 'recolor', chartType: 'area', index: 0, color: paletteOf(h)[0] });
    const err = h.errorNotifications().pop();
    assert.ok(err && /No Area chart/.test(err.message), 'user sees an error toast');
    const msg = h.log.uiMessages.filter((m) => m.type === 'recolor-failed').pop();
    assert.ok(msg && msg.message === err.message, 'UI gets the same reason');

    const ui = loadUI('area');
    ui.receive(msg);
    assert.equal(ui.el('seriesColorsHint').textContent, err.message);
    assert.ok(ui.el('seriesColorsHint').classList.contains('error'));
  });

  test('area colors UI: hint says where a pick lands', async () => {
    const ui = loadUI('area');
    ui.global.updateColorsHint();
    assert.equal(ui.el('seriesColorsHint').textContent, 'Colors apply when you insert the chart');
    ui.receive(selection(await realChartData({ areasCount: 2 })));
    assert.equal(ui.el('seriesColorsHint').textContent, 'Colors apply to the selected chart right away');
  });

  test('area colors UI: palette grid is sorted by hue, grays last', () => {
    const plugin = loadPlugin(PLUGIN);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    const ui = loadUI('area');
    ui.receive({ type: 'palette', colors: pal });
    const shown = Array.from(ui.global.paletteDisplay);
    assert.deepEqual([...shown].sort(), [...pal].sort(), 'every palette color is shown once');
    assert.deepEqual(Array.from(ui.global.paletteHex), pal, 'generation order is untouched');

    const hsl = shown.map((hx) => ui.global.hexToHsl(hx));
    const firstGray = hsl.findIndex((c) => c.s < ui.global.GRAY_SATURATION);
    assert.ok(firstGray > 0, 'there are colored swatches before the grays');
    assert.ok(hsl.slice(firstGray).every((c) => c.s < ui.global.GRAY_SATURATION), 'grays are grouped at the end');
    const keys = hsl.slice(0, firstGray).map((c) => (c.h + 15) % 360);
    for (let i = 1; i < keys.length; i++) {
      assert.ok(keys[i] >= keys[i - 1] - 0.5, 'hue never goes backwards: ' + shown[i - 1] + ' → ' + shown[i]);
    }
  });

  // ── Picker state survives "Get values from chart" ───────────────────────────

  test('area colors: chartParams records whether the picker was on', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const on = await render({ areasCount: 2, areaColors: [pal[1], pal[2]], customColors: true });
    assert.equal(on.handle.chartParams().customColors, true);
    const off = await render({ areasCount: 2, customColors: false });
    assert.equal(off.handle.chartParams().customColors, false);
    // Older payloads without the flag: inferred from the pins.
    const legacyPinned = await render({ areasCount: 2, areaColors: [pal[1], null] });
    assert.equal(legacyPinned.handle.chartParams().customColors, true);
    const legacyPlain = await render({ areasCount: 2 });
    assert.equal(legacyPlain.handle.chartParams().customColors, false);
  });

  test('area colors: save-line-colors stores the picker state without repainting', async () => {
    const { h } = await renderSelected({ areasCount: 2, showLegend: true, legendLabels: ['A', 'B'] });
    const strokes = strokeHexes(h.chart());
    await h.send({ type: 'save-area-colors', customColors: true, areaColors: strokes });
    assert.deepEqual(h.errorNotifications().map((n) => n.message), []);
    let p = h.chartParams();
    assert.equal(p.customColors, true);
    assert.deepEqual(p.areaColors, strokes, 'rows are pinned to the colors the chart already has');
    assert.deepEqual(strokeHexes(h.chart()), strokes, 'no visual change');

    await h.send({ type: 'save-area-colors', customColors: false, areaColors: [] });
    p = h.chartParams();
    assert.equal(p.customColors, false);
    assert.deepEqual(p.areaColors, [null, null], 'switching off unpins');
    assert.deepEqual(strokeHexes(h.chart()), strokes, 'colors stay until regenerate');
    assert.equal(h.lastSelectionMessage().reason, 'recolor');
  });

  test('area colors: a recolor marks the picker as on', async () => {
    const { h } = await renderSelected({ areasCount: 2 });
    assert.equal(h.chartParams().customColors, false);
    await h.send({ type: 'recolor', index: 0, color: paletteOf(h)[3] });
    assert.equal(h.chartParams().customColors, true);
  });

  test('area colors UI: generate sends the picker state', () => {
    const ui = loadUI('area');
    ui.el('areasInput').value = '2';
    ui.global.generate();
    assert.equal(lastGenerate(ui).customColors, false);
    ui.el('customColorsCheck').checked = true;
    ui.global.generate();
    assert.equal(lastGenerate(ui).customColors, true);
  });

  test('area colors UI: picker on with Auto lines comes back on after Get values', async () => {
    const data = await realChartData({ areasCount: 2, areaColors: [null, null], customColors: true });
    const ui = loadUI('area');
    ui.receive(selection(data));
    ui.global.regenerate();
    assert.equal(ui.el('customColorsCheck').checked, true, 'picker shown even with no pinned line');
    assert.equal(ui.el('seriesColorsField').style.display, 'block');
  });

  /** Press "Get values from chart" in a fresh UI pointed at the plugin's selection. */
  async function getValues(plugin) {
    const ui = loadUI('area');
    ui.el('areasInput').value = String(plugin.chartParams().areasCount);
    const flush = bridge(ui, plugin);
    plugin.fireSelectionChange();
    await flush();
    ui.global.regenerate();
    return ui;
  }

  test('area colors UI: switching the picker on a chart is remembered by Get values', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const strokes = strokeHexes(plugin.chart());
    enablePicker(ui); // just switch it on, no color changed
    await flush();
    assert.deepEqual(strokeHexes(plugin.chart()), strokes, 'switching on does not repaint');

    const again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, true, 'Get values shows the picker on');
    assert.deepEqual(Array.from(again.global.colorState), strokes, 'rows show the chart colors');

    // Regenerate from that form keeps the colors and the picker.
    again.global.generate();
    const req = lastGenerate(again);
    await plugin.send(req);
    assert.deepEqual(strokeHexes(plugin.chart()), strokes);
    const third = await getValues(plugin);
    assert.equal(third.el('customColorsCheck').checked, true, 'still on after a regenerate');
  });

  test('area colors UI: picker on with picked colors, regenerated via Get values → Insert, stays on', async () => {
    const { plugin, ui, flush } = await liveSetup();
    const pal = Array.from(plugin.global.PALETTE_HEX);
    ui.global.regenerate(); // Get values
    enablePicker(ui);
    await flush();
    ui.global.setSeriesColor(1, pal[44]);
    await flush();
    ui.global.generate(); // Insert (replace)
    await flush();
    assert.equal(strokeHexes(plugin.chart())[1], pal[44]);

    const again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, true);
    assert.equal(again.global.colorState[1], pal[44]);
  });

  test('area colors UI: switching the picker off is remembered too', async () => {
    const { plugin, ui, flush } = await liveSetup();
    enablePicker(ui);
    await flush();
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    await flush();
    const again = await getValues(plugin);
    assert.equal(again.el('customColorsCheck').checked, false);
  });

  test('area colors UI: switching the picker on another chart takes that chart colors', async () => {
    const { plugin, ui, flush } = await liveSetup();
    ui.el('customColorsCheck').checked = true;
    ui.global.setSeriesColor(0, '#3D3D3D'); // a leftover pick from some other chart
    ui.el('customColorsCheck').checked = false;
    ui.el('customColorsCheck').dispatch('change');
    await flush();
    const strokes = strokeHexes(plugin.chart());
    enablePicker(ui);
    await flush();
    assert.deepEqual(Array.from(ui.global.colorState), strokes, 'rows are the selected chart colors');
    assert.deepEqual(strokeHexes(plugin.chart()), strokes, 'the chart is not repainted with leftovers');
  });

  test('area colors UI: picker state travels with copy → paste', async () => {
    const { plugin, ui, flush } = await liveSetup();
    enablePicker(ui);
    await flush();
    const data = JSON.parse(JSON.stringify(plugin.lastSelectionMessage().chartData));
    assert.equal(data.customColors, true);

    const other = loadPlugin(PLUGIN, { seed: 61 });
    other.selectFrame(500, 300);
    await other.paste(data);
    assert.equal(other.chartParams().customColors, true);
    const pasted = await getValues(other);
    assert.equal(pasted.el('customColorsCheck').checked, true);
    assert.deepEqual(Array.from(pasted.global.colorState), strokeHexes(plugin.chart()));
  });

  // ── Charts without readable pluginData (legend recovery) ───────────────────
  // Figma keeps pluginData per plugin id: a chart drawn by the combined generator
  // is unreadable to standalone Chart Line, which then rebuilds the settings
  // from the layers. The legend must come back too ("Get values from chart").

  /** Draw with `key`, hide the stored params, re-select with standalone Area. */
  async function withoutPluginData(key, opts, size) {
    const s = size || { w: 600, h: 400 };
    const author = loadPlugin(key, { seed: 19 });
    const frame = author.selectFrame(s.w, s.h);
    const msg = payload('area', opts);
    if (key === 'all') msg.chartType = 'area';
    await author.generate(msg);
    const chart = author.chart();
    const original = author.chartParams(chart);
    chart.setPluginData('chartParams', '');
    // The standalone plugin reads the very same node tree.
    const reader = loadPlugin(PLUGIN);
    const d = reader.global.readChartParams(chart);
    return { author, frame, chart, original, recovered: JSON.parse(JSON.stringify(d)) };
  }

  for (const align of ['left', 'center', 'right']) {
    test('area colors: legend is recovered from layers (' + align + ')', async () => {
      const labels = ['Кол-во запусков', 'Кол-во ошибок', 'Третья'];
      const { recovered, original } = await withoutPluginData('area', {
        areasCount: 3, showLegend: true, legendLabels: labels, legendAlign: align,
      });
      assert.equal(recovered.showLegend, true);
      assert.deepEqual(recovered.legendLabels, labels);
      assert.equal(recovered.legendAlign, align);
      assert.deepEqual(recovered.colors.map(hexOf), original.colors.map(hexOf), 'line colors recovered as drawn');
    });
  }

  test('area colors: a combined-generator chart keeps its legend in standalone Get values', async () => {
    const { recovered } = await withoutPluginData('all', {
      areasCount: 2, showLegend: true, legendLabels: ['Кол-во запусков', 'Кол-во ошибок'], legendAlign: 'center',
    }, { w: 1156, h: 164 });
    assert.equal(recovered.showLegend, true);
    assert.deepEqual(recovered.legendLabels, ['Кол-во запусков', 'Кол-во ошибок']);
    assert.equal(recovered.legendAlign, 'center');

    const ui = loadUI('area');
    ui.receive(selection(recovered));
    ui.global.regenerate();
    assert.equal(ui.el('showLegendCheck').checked, true, 'Show legend is ticked');
    assert.equal(ui.el('legendInput').value, 'Кол-во запусков, Кол-во ошибок');
    // Legend align radios need querySelectorAll, which the mini-DOM lacks — the
    // recovered value itself is asserted above.
    assert.equal(ui.el('legendLabelsField').style.display, 'block');
  });

  test('area colors: paginated legend recovers the first page, the rest regenerates as Series N', async () => {
    const labels = Array.from({ length: 12 }, (_, i) => 'Series long name ' + (i + 1));
    const { recovered } = await withoutPluginData('area', {
      areasCount: 12, showLegend: true, legendLabels: labels, legendAlign: 'right',
    }, { w: 300, h: 400 });
    assert.equal(recovered.showLegend, true);
    assert.equal(recovered.legendAlign, 'right');
    assert.ok(recovered.legendLabels.length > 0 && recovered.legendLabels.length < 12);
    assert.deepEqual(recovered.legendLabels, labels.slice(0, recovered.legendLabels.length), 'no "1/2" paginator text');
  });

  test('area colors: no legend layer → Show legend stays off', async () => {
    const { recovered } = await withoutPluginData('area', { areasCount: 2, showLegend: false });
    assert.equal(recovered.showLegend, false);
    assert.deepEqual(recovered.legendLabels, []);
  });

  test('area colors: recoloring a data-less chart keeps its legend for Get values', async () => {
    const h = loadPlugin(PLUGIN, { seed: 23 });
    const frame = h.selectFrame(600, 400);
    await h.generate(payload('area', { areasCount: 2, showLegend: true, legendLabels: ['A', 'B'], legendAlign: 'center' }));
    h.chart().setPluginData('chartParams', '');
    h.select(frame);
    await h.send({ type: 'recolor', index: 0, color: paletteOf(h)[7] });
    const p = h.chartParams();
    assert.equal(p.showLegend, true, 'the params written by recolor include the legend');
    assert.deepEqual(p.legendLabels, ['A', 'B']);
    assert.equal(p.legendAlign, 'center');
    assert.equal(strokeHexes(h.chart())[0], paletteOf(h)[7]);
  });

  test('area colors: chartParams pins round-trip through the color key helper', async () => {
    // Guards the hex ↔ palette lookup: every palette color pins to itself.
    const h = loadPlugin(PLUGIN);
    const pal = Array.from(h.global.PALETTE);
    const hexes = Array.from(h.global.PALETTE_HEX);
    for (let i = 0; i < pal.length; i++) {
      const resolved = h.global.resolveSeriesColors(1, [hexes[i]]);
      assert.equal(colorKey(resolved[0]), colorKey(pal[i]), hexes[i] + ' resolves to its own palette entry');
    }
  });

  // ── Area specifics: fill opacity, stacking, outline ─────────────────────────

  function fillOpacities(container) {
    return layerItems(container, 'Areas').map((a) => a.fills[0].opacity);
  }

  function areaPaths(container) {
    return layerItems(container, 'Areas').map((a) => a.vectorPaths[0].data);
  }

  for (const areaMode of ['overlap', 'stacked']) {
    test('area colors: recolor keeps fill opacity, outline and geometry (' + areaMode + ')', async () => {
      const { h } = await renderSelected({
        areasCount: 3, areaMode, fillOpacity: 0.55, showLegend: true, legendLabels: ['A', 'B', 'C'],
      });
      const before = {
        paths: areaPaths(h.chart()),
        opacity: fillOpacities(h.chart()),
        strokes: layerItems(h.chart(), 'Areas').map((a) => JSON.stringify(a.strokes)),
        series: h.chartParams().allSeries,
      };
      const pal = paletteOf(h);
      const target = pal.find((hx) => !strokeHexes(h.chart()).includes(hx));
      await h.send({ type: 'recolor', index: 1, color: target });

      const c = h.chart();
      assert.equal(strokeHexes(c)[1], target, 'fill recolored');
      assert.deepEqual(fillOpacities(c), before.opacity, 'fill opacity kept on every area');
      assert.deepEqual(layerItems(c, 'Areas').map((a) => JSON.stringify(a.strokes)), before.strokes, 'neutral outline untouched');
      assert.deepEqual(areaPaths(c), before.paths, 'geometry (stack order included) unchanged');
      assert.deepEqual(h.chartParams().allSeries, before.series, 'series data unchanged');
      assert.equal(legendHexes(c)[1], target, 'legend dot recolored');
    });
  }

  test('area colors: stacked + fill height with pins pastes without double scaling', async () => {
    const pal = paletteOf(loadPlugin(PLUGIN));
    const pins = [pal[3], null, pal[33]];
    const source = await render({ areasCount: 3, areaMode: 'stacked', fillHeight: true, areaColors: pins });
    const data = JSON.parse(JSON.stringify(source.handle.chartParams()));

    const target = loadPlugin(PLUGIN, { seed: 5 });
    target.selectFrame(600, 400);
    await target.paste(data);
    assert.deepEqual(target.chartParams().allSeries, data.allSeries, 'stack not re-normalised on paste');
    assert.deepEqual(areaPaths(target.chart()), areaPaths(source.container), 'same geometry');
    assert.deepEqual(strokeHexes(target.chart()), strokeHexes(source.container), 'same colors');
    assert.deepEqual(target.chartParams().areaColors, pins);
  });

  test('area colors: pins do not change which series is stacked where', async () => {
    // Same seed with and without pins → identical series data and paths: picking
    // colors must not consume or reorder the randomness used for the stack.
    const pal = paletteOf(loadPlugin(PLUGIN));
    const plain = await render({ areasCount: 3, areaMode: 'stacked' }, 13);
    const pinned = await render({ areasCount: 3, areaMode: 'stacked', areaColors: [pal[0], pal[20], pal[40]] }, 13);
    assert.deepEqual(pinned.handle.chartParams().allSeries, plain.handle.chartParams().allSeries);
    assert.deepEqual(areaPaths(pinned.container), areaPaths(plain.container));
  });

  test('area colors: fill opacity is recovered from layers together with colors', async () => {
    const { recovered, original } = await withoutPluginData('area', { areasCount: 2, fillOpacity: 0.6 });
    assert.equal(Math.round(recovered.fillOpacity * 100) / 100, 0.6);
    assert.deepEqual(recovered.colors.map(hexOf), original.colors.map(hexOf));
  });

  test('area colors UI: rows past the selected chart apply on Insert only, no recolor error', async () => {
    const data = await realChartData({ areasCount: 2 });
    const ui = loadUI('area');
    ui.el('areasInput').value = '3'; // the form asks for one more than the chart has
    ui.receive(selection(data));
    ui.el('customColorsCheck').checked = true;
    ui.global.setSeriesColor(2, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 0, 'no live recolor for a row the chart does not have');
    ui.global.setSeriesColor(1, '#4D7CFE');
    assert.equal(ui.posted('recolor').length, 1, 'rows the chart has still recolor live');
  });
}

for (const v of VARIANTS) defineSuite(v.key, v.label);

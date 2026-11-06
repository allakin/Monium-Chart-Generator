'use strict';

/**
 * Combined generator — the series color picker in its ui.html.
 *
 * One picker implementation serves the four tabs (prefixed elements
 * <type>-customColorsCheck / -colorsField / -colorsList / -colorsHint). The
 * plugin side of the picker is covered by tests/<type>-colors.test.js, which
 * run against the combined generator too; this suite drives the combined UI:
 * picker basics per tab, Get values / paste, tab mismatch (a chart of another
 * type is selected), recolor selections keeping the tab and buttons, and the
 * UI ↔ plugin loop end to end for every chart type.
 *
 * The mini-DOM has no querySelector, so radio values (Bar mode) are supplied by
 * overriding getRadio where a test needs them.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');
const { plain } = require('./helpers/inspect');

const TYPES = ['line', 'area', 'bar', 'pie'];
const PINS_KEY = { line: 'lineColors', area: 'areaColors', bar: 'barColors', pie: 'segmentColors' };
const COUNT_INPUT = { line: 'line-countInput', area: 'area-countInput', bar: 'bar-countInput', pie: 'pie-segmentsInput' };
const DATA_LAYER = { line: 'Lines', area: 'Areas', bar: 'Bars', pie: 'Slices' };
const OPTS = {
  line: { linesCount: 2, showLegend: true, legendLabels: ['A', 'B'] },
  area: { areasCount: 2, showLegend: true, legendLabels: ['A', 'B'] },
  bar: { barsCount: 2, barMode: 'grouped', showLegend: true, legendLabels: ['A', 'B'] },
  pie: { values: [40, 30, 20], showLegend: true, legendLabels: ['A', 'B', 'C'] },
};
const SERIES = { line: 2, area: 2, bar: 2, pie: 3 };

function hexOf(c) {
  return (
    '#' +
    [c.r, c.g, c.b]
      .map((v) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase())
      .join('')
  );
}

function layerKids(container, name, type) {
  const g = container.children.find((n) => n.name === name);
  if (!g) return [];
  if (g.type === type) return [g];
  return (g.children || []).filter((n) => n.type === type);
}

/** One color per series as drawn. */
function seriesHexes(type, container, count) {
  const nodes = layerKids(container, DATA_LAYER[type], type === 'line' || type === 'area' ? 'VECTOR' : type === 'bar' ? 'RECTANGLE' : 'ELLIPSE');
  const pick = type === 'line' ? (n) => n.strokes[0].color : (n) => n.fills[0].color;
  return nodes.slice(0, count).map((n) => hexOf(pick(n)));
}

function legendHexes(type, container) {
  return layerKids(container, 'Legend', type === 'line' ? 'RECTANGLE' : 'ELLIPSE').map((r) => hexOf(r.fills[0].color));
}

function selection(chartData) {
  return { type: 'selection', hasFrame: true, name: 'Frame', width: 600, height: 400, hasChart: !!chartData, chartData };
}

async function chartData(type, opts, seed) {
  const h = loadPlugin('all', { seed: seed || 7 });
  h.selectFrame(600, 400);
  await h.generate(payload(type, Object.assign({}, OPTS[type], opts || {})));
  return h.lastSelectionMessage().chartData;
}

function ui() {
  const u = loadUI('all');
  for (const t of TYPES) u.el(COUNT_INPUT[t]).value = String(SERIES[t]);
  return u;
}

function enablePicker(u, type) {
  u.el(type + '-customColorsCheck').checked = true;
  u.el(type + '-customColorsCheck').dispatch('change');
}

/** Wire the real combined ui.html script and the real combined code.js together. */
function bridge(u, plugin) {
  let uiSent = 0;
  let pluginSent = plugin.log.uiMessages.length;
  return async function flush() {
    for (let guard = 0; guard < 20; guard++) {
      let moved = false;
      while (uiSent < u.messages.length) {
        const m = u.messages[uiSent++];
        if (m && m.type !== 'resize' && m.type !== 'notify') await plugin.send(m);
        moved = true;
      }
      while (pluginSent < plugin.log.uiMessages.length) {
        u.receive(plugin.log.uiMessages[pluginSent++]);
        moved = true;
      }
      if (!moved) return;
    }
    throw new Error('UI ↔ plugin messages did not settle');
  };
}

async function liveSetup(type, opts) {
  const plugin = loadPlugin('all', { seed: 41 });
  plugin.selectFrame(600, 400);
  await plugin.generate(payload(type, Object.assign({}, OPTS[type], opts || {})));
  const u = ui();
  const flush = bridge(u, plugin);
  plugin.fireSelectionChange();
  await flush(); // palette + selection
  return { plugin, u, flush };
}

// ── Basics ──────────────────────────────────────────────────────────────────

test('all colors UI: requests the palette once and sorts the grid by hue', () => {
  const u = ui();
  assert.equal(u.posted('get-palette').length, 1);
  const pal = Array.from(loadPlugin('all').global.PALETTE_HEX);
  u.receive({ type: 'palette', colors: pal });
  assert.deepEqual(Array.from(u.global.paletteHex), pal, 'generation order untouched');
  const shown = Array.from(u.global.paletteDisplay);
  assert.deepEqual([...shown].sort(), [...pal].sort(), 'every palette color shown once');
  const hsl = shown.map((hx) => u.global.hexToHsl(hx));
  const firstGray = hsl.findIndex((c) => c.s < u.global.GRAY_SATURATION);
  assert.ok(firstGray > 0 && hsl.slice(firstGray).every((c) => c.s < u.global.GRAY_SATURATION), 'grays last');
});

test('all colors UI: rows say whether a color is from the palette', () => {
  const u = ui();
  u.receive({ type: 'palette', colors: Array.from(loadPlugin('all').global.PALETTE_HEX) });
  assert.equal(u.global.colorValueText(null), 'Auto');
  assert.equal(u.global.colorValueText('#5F27CD'), 'Palette · #5F27CD');
  assert.equal(u.global.colorValueText('#3D3D3D'), 'Custom · #3D3D3D');
});

for (const type of TYPES) {
  const T = ' [' + type + ' tab]';

  test('all colors UI: picker off → generate sends only Auto' + T, () => {
    const u = ui();
    u.global.switchTab(type);
    u.global.setSeriesColor(type, 0, '#4D7CFE');
    u.global.generate();
    const sent = u.posted('generate').pop();
    assert.equal(sent.chartType, type);
    assert.deepEqual(Array.from(sent[PINS_KEY[type]]), Array(SERIES[type]).fill(null));
    assert.equal(sent.customColors, false);
  });

  test('all colors UI: picked colors are sent under the type\'s own field' + T, () => {
    const u = ui();
    u.global.switchTab(type);
    u.el(type + '-customColorsCheck').checked = true;
    u.global.setSeriesColor(type, 1, '#ff6b6b');
    u.global.generate();
    const sent = u.posted('generate').pop();
    const expected = Array(SERIES[type]).fill(null);
    expected[1] = '#FF6B6B';
    assert.deepEqual(Array.from(sent[PINS_KEY[type]]), expected);
    assert.equal(sent.customColors, true);
    for (const other of TYPES) if (other !== type) assert.equal(sent[PINS_KEY[other]], undefined, 'no other tab\'s pins');
  });

  test('all colors UI: Get values restores the picker' + T, async () => {
    const pal = Array.from(loadPlugin('all').global.PALETTE_HEX);
    const pins = Array(SERIES[type]).fill(null);
    pins[0] = pal[12];
    const data = await chartData(type, { [PINS_KEY[type]]: pins, customColors: true });
    const u = ui();
    u.receive(selection(data));
    assert.equal(u.global.currentTab, type, 'tab follows the chart');
    u.global.regenerate();
    assert.equal(u.el(type + '-customColorsCheck').checked, true);
    assert.equal(u.el(type + '-colorsField').style.display, 'block');
    assert.deepEqual(Array.from(u.global.pickers[type].state), pins);
    assert.deepEqual(Array.from(u.global.pickers[type].preview), data.colors.map(hexOf));
    u.global.generate();
    const sent = u.posted('generate').pop();
    assert.equal(sent.replace, true);
    assert.deepEqual(Array.from(sent[PINS_KEY[type]]), pins);
  });

  test('all colors UI: enabling the picker on the tab\'s chart takes its colors, no repaint' + T, async () => {
    const { plugin, u, flush } = await liveSetup(type);
    const before = seriesHexes(type, plugin.chart(), SERIES[type]);
    enablePicker(u, type);
    await flush();
    assert.deepEqual(Array.from(u.global.pickers[type].state), before, 'rows = chart colors');
    assert.equal(u.posted('suggest-colors').length, 0, 'known colors need no suggestion');
    assert.deepEqual(seriesHexes(type, plugin.chart(), SERIES[type]), before, 'chart not repainted');
    assert.equal(plugin.chartParams().customColors, true, 'picker state saved on the chart');
    assert.equal(u.el(type + '-colorsHint').textContent, 'Colors apply to the selected chart right away');
  });

  test('all colors UI: a pick repaints the selected chart and its legend at once' + T, async () => {
    const { plugin, u, flush } = await liveSetup(type);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(u, type);
    await flush();
    const before = seriesHexes(type, plugin.chart(), SERIES[type]);
    const target = pal.find((hx) => !before.includes(hx));
    u.global.setSeriesColor(type, 1, target);
    assert.deepEqual(plain(u.posted('recolor').pop()), { type: 'recolor', chartType: type, index: 1, color: target });
    await flush();
    const after = seriesHexes(type, plugin.chart(), SERIES[type]);
    assert.equal(after[1], target);
    assert.equal(after[0], before[0], 'other series untouched');
    assert.equal(legendHexes(type, plugin.chart())[1], target, 'legend marker repainted');
    assert.equal(plugin.errorNotifications().length, 0);
  });

  test('all colors UI: Auto generates a new color and applies it' + T, async () => {
    const { plugin, u, flush } = await liveSetup(type);
    const pal = Array.from(plugin.global.PALETTE_HEX);
    enablePicker(u, type);
    await flush();
    for (let round = 0; round < 4; round++) {
      const before = seriesHexes(type, plugin.chart(), SERIES[type]);
      u.global.generateSeriesColor(type, 0);
      const req = u.posted('suggest-colors').pop();
      assert.equal(req.chartType, type);
      assert.deepEqual(Array.from(req.avoid), [before[0]]);
      await flush();
      const after = seriesHexes(type, plugin.chart(), SERIES[type]);
      assert.notEqual(after[0], before[0], 'round ' + round + ': new color');
      assert.ok(pal.includes(after[0]));
      assert.equal(u.global.pickers[type].state[0], after[0]);
    }
  });

  test('all colors UI: a live recolor keeps the tab, the form and its buttons' + T, async () => {
    const { plugin, u, flush } = await liveSetup(type);
    u.global.regenerate(); // Get values → Insert becomes the regenerate button
    assert.equal(u.el('insertBtn').disabled, false);
    enablePicker(u, type);
    await flush();
    u.global.setSeriesColor(type, 0, Array.from(plugin.global.PALETTE_HEX)[50]);
    await flush();
    assert.equal(u.global.currentTab, type);
    assert.equal(u.el('insertBtn').disabled, false, 'Insert still enabled');
    assert.equal(u.global.replaceMode, true, 'still in replace mode');
    assert.equal(u.el('regenBtn').style.display, 'block', '"Get values" still shown for the matching tab');
  });

  test('all colors UI: rows past the selected chart apply on Insert only' + T, async () => {
    const { u, flush } = await liveSetup(type);
    u.el(COUNT_INPUT[type]).value = String(SERIES[type] + 1);
    if (type === 'pie') u.el('pie-valuesInput').value = '';
    u.el(type + '-customColorsCheck').checked = true;
    u.global.setSeriesColor(type, SERIES[type], '#4D7CFE');
    assert.equal(u.posted('recolor').length, 0, 'no live recolor for a row the chart does not have');
    await flush();
  });

  test('all colors UI: Get values after switching the picker on shows it on' + T, async () => {
    const { plugin, u, flush } = await liveSetup(type);
    enablePicker(u, type);
    await flush();
    const again = ui();
    const flush2 = bridge(again, plugin);
    plugin.fireSelectionChange();
    await flush2();
    again.global.regenerate();
    assert.equal(again.el(type + '-customColorsCheck').checked, true);
    assert.deepEqual(Array.from(again.global.pickers[type].state), seriesHexes(type, plugin.chart(), SERIES[type]));
  });

  test('all colors UI: a failed recolor shows its reason in the tab\'s hint' + T, () => {
    const u = ui();
    u.global.switchTab(type);
    u.receive({ type: 'recolor-failed', chartType: type, message: 'Select the chart to apply the color' });
    assert.equal(u.el(type + '-colorsHint').textContent, 'Select the chart to apply the color');
    assert.ok(u.el(type + '-colorsHint').classList.contains('error'));
  });
}

// ── Tab mismatch ────────────────────────────────────────────────────────────

test('all colors UI: a chart of another type is not recolored nor used for rows', async () => {
  const { plugin, u, flush } = await liveSetup('line');
  const lineColors = seriesHexes('line', plugin.chart(), 2);
  u.global.switchTab('area');
  assert.equal(u.el('regenBtn').style.display, 'none', '"Get values" hidden on another tab');
  enablePicker(u, 'area');
  assert.equal(u.posted('save-series-colors').length, 0, 'nothing saved onto the line chart');
  const req = u.posted('suggest-colors').pop();
  assert.ok(req && req.chartType === 'area', 'area rows come from suggestions, not from the line chart');
  await flush();
  const rows = Array.from(u.global.pickers.area.state);
  assert.ok(rows.every((c) => c !== null));
  assert.equal(u.el('area-colorsHint').textContent, 'Colors apply when you insert the chart');

  u.global.setSeriesColor('area', 0, Array.from(plugin.global.PALETTE_HEX)[30]);
  assert.equal(u.posted('recolor').length, 0, 'no recolor of the line chart');
  await flush();
  assert.deepEqual(seriesHexes('line', plugin.chart(), 2), lineColors, 'line chart untouched');
});

test('all colors UI: the plugin refuses a recolor meant for another chart type', async () => {
  const { plugin } = await liveSetup('bar');
  const before = seriesHexes('bar', plugin.chart(), 2);
  await plugin.send({ type: 'recolor', chartType: 'line', index: 0, color: '#4D7CFE' });
  assert.match(plugin.errorNotifications().pop().message, /The selected chart is a Bar chart/);
  assert.deepEqual(seriesHexes('bar', plugin.chart(), 2), before);
});

// ── Bar / Pie row counts ────────────────────────────────────────────────────

test('all colors UI: Bar in Normal mode shows one row; Grouped shows the count', () => {
  const u = ui();
  let mode = 'normal';
  u.global.getRadio = (name) => (name === 'barMode' ? mode : null);
  u.global.switchTab('bar');
  u.el('bar-countInput').value = '4';
  enablePicker(u, 'bar');
  assert.equal(u.global.pickers.bar.state.length, 1);
  mode = 'grouped';
  u.global.onPickerCountChanged('bar');
  assert.equal(u.global.pickers.bar.state.length, 4);
});

test('all colors UI: Pie rows follow the effective segment count (values win)', () => {
  const u = ui();
  u.global.switchTab('pie');
  u.el('pie-segmentsInput').value = '5';
  u.el('pie-valuesInput').value = '10, 20';
  enablePicker(u, 'pie');
  assert.equal(u.global.pickers.pie.state.length, 2);
  u.el('pie-valuesInput').value = '';
  u.el('pie-valuesInput').dispatch('input');
  assert.equal(u.global.pickers.pie.state.length, 5);
});

// ── Paste ───────────────────────────────────────────────────────────────────

test('all colors UI: paste repopulates the picker of the pasted chart type', async () => {
  const pal = Array.from(loadPlugin('all').global.PALETTE_HEX);
  const data = await chartData('bar', { barColors: [pal[8], null], customColors: true });
  const u = ui();
  u.receive(selection(data));
  u.global.copyChart();
  u.clock.tick(1000);
  u.receive(selection(null));
  u.global.pasteChart();
  assert.deepEqual(Array.from(u.posted('paste').pop().chartData.barColors), [pal[8], null]);
  u.receive(selection(data));
  assert.equal(u.global.currentTab, 'bar');
  assert.equal(u.el('bar-customColorsCheck').checked, true);
  assert.deepEqual(Array.from(u.global.pickers.bar.state), [pal[8], null]);
});

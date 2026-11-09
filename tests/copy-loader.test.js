'use strict';

/**
 * "Copy chart" feedback: the clipboard box must visibly switch into a loading
 * state before it shows what was captured, so the user can tell which chart
 * data is now on the clipboard.
 *
 * These tests drive the real ui.html script of each plugin (see
 * helpers/load-ui.js) against virtual timers — the loader delay is stepped
 * explicitly, nothing waits in wall-clock time. The chartData fed to the UI is
 * produced by the real code.js, so the copy gate sees authentic pluginData.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const { loadPlugin, pluginPath, ALL_KEYS } = require('./helpers/load-plugin');
const { loadUI } = require('./helpers/load-ui');
const { payload } = require('./helpers/fixtures');

const LOADING_TEXT = 'Reading chart data…';

/** Render a chart with the real plugin and hand back its stored chartParams. */
async function realChartData(type, opts) {
  const h = loadPlugin(type, { seed: 7 });
  h.selectFrame(600, 400);
  await h.generate(payload(type, opts));
  const data = h.chartParams();
  data.chartType = type;
  return data;
}

/**
 * Cases cover every plugin; the combined generator is exercised through each
 * of its four tabs, since the summary wording is derived per chart type.
 */
const CASES = [
  {
    name: 'line [standalone]',
    uiKey: 'line',
    type: 'line',
    opts: { linesCount: 3, lineStyle: 'smooth' },
    summary: 'Copied: 3 lines · Smooth',
    notify: 'Chart copied — 3 lines ready to paste',
  },
  {
    name: 'line [combined generator]',
    uiKey: 'all',
    type: 'line',
    opts: { linesCount: 3, lineStyle: 'smooth' },
    summary: 'Copied: 3 lines · Smooth',
    notify: 'Chart copied — 3 lines ready to paste',
  },
  {
    name: 'area [standalone]',
    uiKey: 'area',
    type: 'area',
    opts: { areasCount: 2, areaStyle: 'sharp' },
    summary: 'Copied: 2 areas · Sharp',
    notify: 'Chart copied — 2 areas ready to paste',
  },
  {
    name: 'area [combined generator]',
    uiKey: 'all',
    type: 'area',
    opts: { areasCount: 2, areaStyle: 'sharp' },
    summary: 'Copied: 2 areas · Sharp',
    notify: 'Chart copied — 2 areas ready to paste',
  },
  {
    name: 'bar [standalone]',
    uiKey: 'bar',
    type: 'bar',
    opts: { barsCount: 5, barMode: 'stacked' },
    summary: 'Copied: 5 bar series · Stacked',
    notify: 'Chart copied — 5 bar series ready to paste',
  },
  {
    name: 'bar [combined generator]',
    uiKey: 'all',
    type: 'bar',
    opts: { barsCount: 5, barMode: 'stacked' },
    summary: 'Copied: 5 bar series · Stacked',
    notify: 'Chart copied — 5 bar series ready to paste',
  },
  {
    name: 'pie [standalone]',
    uiKey: 'pie',
    type: 'pie',
    opts: { values: [40, 30, 20, 10], segmentsCount: 4, pieStyle: 'donut' },
    summary: 'Copied: 4 segments · Donut',
    notify: 'Chart copied — 4 segments ready to paste',
  },
  {
    name: 'pie [combined generator]',
    uiKey: 'all',
    type: 'pie',
    opts: { values: [40, 30, 20, 10], segmentsCount: 4, pieStyle: 'donut' },
    summary: 'Copied: 4 segments · Donut',
    notify: 'Chart copied — 4 segments ready to paste',
  },
];

/** A UI that already "has" a selected chart, ready for a Copy click. */
async function uiWithChart(c) {
  const ui = loadUI(c.uiKey);
  ui.global.storedChartData = await realChartData(c.type, c.opts);
  return ui;
}

function notifications(ui) {
  return ui.posted('notify').map((m) => m.message);
}

for (const c of CASES) {
  test('copy shows a loading state before the summary — ' + c.name, async () => {
    const ui = await uiWithChart(c);

    ui.global.copyChart();

    const box = ui.clipboard();
    assert.equal(box.visible, true, 'clipboard box must appear immediately');
    assert.equal(box.loading, true, 'box must carry the .loading class');
    assert.equal(box.summary, LOADING_TEXT);
    assert.equal(box.copyDisabled, true, 'Copy must be disabled while loading');
    assert.equal(box.pasteDisabled, true, 'Paste must be disabled while loading');
    assert.deepEqual(notifications(ui), [], 'no toast before the loader finishes');
  });

  test('the summary and the toast land when the loader finishes — ' + c.name, async () => {
    const ui = await uiWithChart(c);

    ui.global.copyChart();
    ui.clock.tick(ui.global.COPY_LOADER_MS);

    const box = ui.clipboard();
    assert.equal(box.loading, false, 'loading state must be cleared');
    assert.equal(box.visible, true);
    assert.equal(box.summary, c.summary);
    assert.equal(box.copyDisabled, false);
    assert.equal(box.pasteDisabled, false);
    assert.deepEqual(notifications(ui), [c.notify]);
  });

  test('a selection update mid-load does not cut the loader short — ' + c.name, async () => {
    const ui = await uiWithChart(c);

    ui.global.copyChart();
    ui.clock.tick(200);
    // The plugin pushes a selection message on every selection change; it calls
    // updateClipboardUI(), which must not steal the loader's turn.
    ui.receive({
      type: 'selection',
      hasFrame: true,
      name: 'Target',
      width: 600,
      height: 400,
      hasChart: true,
      chartData: ui.global.storedChartData,
    });

    assert.equal(ui.clipboard().loading, true, 'loader must survive a selection update');
    assert.equal(ui.clipboard().summary, LOADING_TEXT);

    ui.clock.tick(250);
    assert.equal(ui.clipboard().loading, false);
    assert.equal(ui.clipboard().summary, c.summary);
    assert.deepEqual(notifications(ui), [c.notify]);
  });

  test('clearing mid-load cancels the pending feedback — ' + c.name, async () => {
    const ui = await uiWithChart(c);

    ui.global.copyChart();
    ui.clock.tick(200);
    ui.global.clearCopy();

    assert.equal(ui.clipboard().visible, false, 'box must hide on clear');
    assert.equal(ui.clipboard().loading, false);

    ui.clock.tick(1000);
    assert.equal(ui.clipboard().visible, false, 'a cancelled loader must not reopen the box');
    assert.deepEqual(notifications(ui), [], 'a cancelled copy must not notify');
    assert.equal(ui.clock.pending, 0, 'no timer may outlive clearCopy');
  });

  test('a repeated copy restarts the loader and notifies once — ' + c.name, async () => {
    const ui = await uiWithChart(c);

    ui.global.copyChart();
    ui.clock.tick(200);
    ui.global.copyChart();
    ui.clock.tick(300); // 500 ms since the first click, 300 since the second

    assert.equal(ui.clipboard().loading, true, 'the second click restarts the delay');
    assert.deepEqual(notifications(ui), []);

    ui.clock.tick(150);
    assert.equal(ui.clipboard().loading, false);
    assert.equal(ui.clipboard().summary, c.summary);
    assert.deepEqual(notifications(ui), [c.notify], 'exactly one toast per copy');
  });

  test('buttons and box stay untouched when the copy gate rejects — ' + c.name, async () => {
    const ui = await uiWithChart(c);
    // Charts from older plugin versions lack the exact-copy fields.
    const stale = Object.assign({}, ui.global.storedChartData);
    delete stale.colors;
    ui.global.storedChartData = stale;

    ui.global.copyChart();

    assert.equal(ui.clipboard().visible, false, 'no box for a chart that cannot be copied');
    assert.equal(ui.clipboard().loading, false, 'no loader for a rejected copy');
    assert.equal(ui.clipboard().copyDisabled, false, 'Copy must stay clickable');
    assert.equal(ui.el('regenError').style.display, 'block', 'the gate must explain itself');
    assert.equal(ui.clock.pending, 0, 'a rejected copy must not schedule anything');

    ui.clock.tick(1000);
    assert.deepEqual(notifications(ui), []);
  });
}

test('single-series copies read naturally in the combined generator', async () => {
  const ui = loadUI('all');

  ui.global.storedChartData = await realChartData('line', { linesCount: 1, lineStyle: 'smooth' });
  ui.global.copyChart();
  ui.clock.tick(ui.global.COPY_LOADER_MS);
  assert.equal(ui.clipboard().summary, 'Copied: 1 line · Smooth');

  ui.global.clearCopy();
  ui.global.storedChartData = await realChartData('pie', { values: [100], segmentsCount: 1, pieStyle: 'pie' });
  ui.global.copyChart();
  ui.clock.tick(ui.global.COPY_LOADER_MS);
  assert.equal(ui.clipboard().summary, 'Copied: 1 segment · Pie');
});

test('"bar series" is never doubled up into "seriess"', async () => {
  for (const uiKey of ['bar', 'all']) {
    const ui = loadUI(uiKey);
    ui.global.storedChartData = await realChartData('bar', { barsCount: 5, barMode: 'stacked' });
    ui.global.copyChart();
    ui.clock.tick(ui.global.COPY_LOADER_MS);

    const summary = ui.clipboard().summary;
    assert.equal(summary.includes('seriess'), false, uiKey + ': ' + summary);
    assert.equal(summary, 'Copied: 5 bar series · Stacked');
  }
});

test('all five plugins ship the same copy loader', () => {
  const sources = ALL_KEYS.map((key) => ({
    key,
    html: fs.readFileSync(pluginPath(key, 'ui.html'), 'utf8'),
  }));

  for (const { key, html } of sources) {
    assert.ok(/\.clipboard-box\.loading \.spinner/.test(html), key + ': missing loading-state CSS');
    assert.ok(/@keyframes clipboard-spin/.test(html), key + ': missing spinner animation');
    assert.ok(/<span class="spinner"><\/span>/.test(html), key + ': missing spinner element');
    assert.ok(/function showClipboardLoading\(\)/.test(html), key + ': missing showClipboardLoading');
    assert.ok(
      /if \(copyLoaderTimer\) return;/.test(html),
      key + ': updateClipboardUI must bail out while the loader runs',
    );
  }

  const delays = sources.map(({ key, html }) => {
    const m = html.match(/var COPY_LOADER_MS = (\d+);/);
    assert.ok(m, key + ': missing COPY_LOADER_MS');
    return Number(m[1]);
  });
  assert.equal(new Set(delays).size, 1, 'the loader delay must not drift between plugins: ' + delays.join(', '));
});

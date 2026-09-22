'use strict';

/**
 * Loads a plugin's real code.js into a VM sandbox wired to the figma mock and
 * returns a handle for driving it the way the UI iframe would.
 *
 * Math.random is replaced with a seeded PRNG, so every "random" chart (series
 * values, palette pick, event segments) is reproducible: same seed → same
 * chart. Pass { seed } to loadPlugin or call handle.reseed(seed).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createFigmaMock, MockNode } = require('./figma-mock');

const ROOT = path.resolve(__dirname, '..', '..');

const PLUGIN_DIRS = {
  line: 'Chart Line',
  bar: 'Chart Bar',
  area: 'Chart Area',
  pie: 'Chart Pie',
  all: 'Monium all charts generator',
};

/** Standalone plugins, i.e. everything except the combined generator. */
const STANDALONE_KEYS = ['line', 'bar', 'area', 'pie'];
const ALL_KEYS = ['line', 'bar', 'area', 'pie', 'all'];

/** Chart type → container frame name produced by the plugins. */
const CHART_NAMES = {
  line: 'Chart Line',
  bar: 'Chart Bar',
  area: 'Chart Area',
  pie: 'Chart Pie',
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pluginPath(key, file) {
  const dir = PLUGIN_DIRS[key];
  if (!dir) throw new Error('Unknown plugin key: ' + key);
  return path.join(ROOT, dir, file);
}

function loadPlugin(key, options) {
  const opts = options || {};
  const source = fs.readFileSync(pluginPath(key, 'code.js'), 'utf8');
  const mock = createFigmaMock();
  const { figma, doc, page, log, listeners } = mock;

  const state = { rng: mulberry32(opts.seed === undefined ? 1234 : opts.seed) };

  const sandbox = {
    figma,
    __html__: '<!doctype html><html><body>ui</body></html>',
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    __rng__: function () {
      return state.rng();
    },
  };

  const context = vm.createContext(sandbox);
  vm.runInContext('Math.random = globalThis.__rng__;', context);
  vm.runInContext(source, context, { filename: PLUGIN_DIRS[key] + '/code.js' });

  const handle = {
    key,
    dir: PLUGIN_DIRS[key],
    figma,
    doc,
    page,
    log,
    /** The sandbox global — exposes the plugin's top-level `var`s and functions. */
    global: context,

    /** Re-seed the PRNG so a later render repeats an earlier one. */
    reseed(seed) {
      state.rng = mulberry32(seed);
    },

    /** Deliver a message exactly as ui.html's postMessage would. */
    send(msg) {
      if (typeof figma.ui.onmessage !== 'function') {
        throw new Error(handle.dir + ': plugin never assigned figma.ui.onmessage');
      }
      return Promise.resolve(figma.ui.onmessage(msg));
    },

    generate(payload) {
      return handle.send(Object.assign({ type: 'generate' }, payload));
    },

    paste(chartData) {
      return handle.send({ type: 'paste', chartData });
    },

    /** Create a node of any type on the page (FRAME / COMPONENT / INSTANCE / …). */
    createNode(type, name) {
      const n = new MockNode(type, doc);
      if (name) n.name = name;
      page.appendChild(n);
      return n;
    },

    /** Create a target frame, select it and fire selectionchange. */
    selectFrame(w, h, opts2) {
      const o = opts2 || {};
      const frame = handle.createNode(o.type || 'FRAME', o.name || 'Target');
      frame.fills = [];
      frame.resize(w, h);
      handle.select(frame);
      return frame;
    },

    select(node) {
      figma.currentPage.selection = node ? [node] : [];
      handle.fireSelectionChange();
      return node;
    },

    clearSelection() {
      figma.currentPage.selection = [];
      handle.fireSelectionChange();
    },

    fireSelectionChange() {
      for (const cb of listeners.selectionchange) cb();
    },

    /** Every chart container currently on the page, in document order. */
    charts() {
      const names = Object.values(CHART_NAMES);
      const found = [];
      (function walk(node) {
        if (node.type === 'FRAME' && names.indexOf(node.name) !== -1) found.push(node);
        if (node._children) for (const c of node._children) walk(c);
      })(page);
      return found;
    },

    /** The single chart container, asserting there is exactly one. */
    chart() {
      const found = handle.charts();
      if (found.length !== 1) {
        throw new Error(
          handle.dir + ': expected exactly 1 chart container, found ' + found.length +
            ' (' + found.map((f) => f.name).join(', ') + ')',
        );
      }
      return found[0];
    },

    /** Stored chartParams for a container (the copy/paste payload). */
    chartParams(container) {
      const raw = (container || handle.chart()).getPluginData('chartParams');
      if (!raw) return null;
      return JSON.parse(raw);
    },

    /** The last "selection" message the plugin pushed to the UI. */
    lastSelectionMessage() {
      for (let i = log.uiMessages.length - 1; i >= 0; i--) {
        if (log.uiMessages[i] && log.uiMessages[i].type === 'selection') return log.uiMessages[i];
      }
      return null;
    },

    /** Notifications the plugin raised with { error: true }. */
    errorNotifications() {
      return log.notifications.filter((n) => n.options && n.options.error);
    },
  };

  return handle;
}

module.exports = {
  loadPlugin,
  pluginPath,
  PLUGIN_DIRS,
  STANDALONE_KEYS,
  ALL_KEYS,
  CHART_NAMES,
  ROOT,
  mulberry32,
};

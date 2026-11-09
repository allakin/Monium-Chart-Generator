'use strict';

/**
 * Loads a plugin's real ui.html <script> into a VM sandbox wired to a minimal
 * DOM mock, and returns a handle for driving the iframe UI the way a user (and
 * the plugin) would: click handlers, selection messages, timers.
 *
 * The DOM mock is deliberately thin — it models only what the UI scripts touch
 * (ids, classList, style, textContent, value, checked, disabled, listeners).
 * Elements are pre-registered from the ids actually present in ui.html, so
 * getElementById on a typo returns null exactly like a browser would.
 *
 * Timers are virtual: nothing resolves until the test calls clock.tick(ms).
 */

const fs = require('fs');
const vm = require('vm');
const { PLUGIN_DIRS, pluginPath } = require('./load-plugin');

class MockClassList {
  constructor(el) {
    this._el = el;
    this._set = new Set();
  }
  add(...names) {
    for (const n of names) this._set.add(n);
  }
  remove(...names) {
    for (const n of names) this._set.delete(n);
  }
  contains(name) {
    return this._set.has(name);
  }
  toggle(name, force) {
    const on = force === undefined ? !this._set.has(name) : !!force;
    if (on) this._set.add(name);
    else this._set.delete(name);
    return on;
  }
  get value() {
    return [...this._set].join(' ');
  }
}

class MockElement {
  constructor(id) {
    this.id = id;
    this.style = {};
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.scrollHeight = 0;
    this.title = '';
    this._classList = new MockClassList(this);
    this._listeners = new Map();
  }

  get classList() {
    return this._classList;
  }

  /** `el.className = 'a b'` is used by the target bar — keep classList in sync. */
  get className() {
    return this._classList.value;
  }
  set className(v) {
    this._classList._set = new Set(String(v).split(/\s+/).filter(Boolean));
  }

  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }

  /** Fire a listener registered with addEventListener (what a real click does). */
  dispatch(type) {
    for (const fn of this._listeners.get(type) || []) fn.call(this, { target: this, type });
  }

  querySelectorAll() {
    return [];
  }
  querySelector() {
    return null;
  }
  appendChild() {}
  removeChild() {}
  setAttribute() {}
  getAttribute() {
    return null;
  }
}

function createClock() {
  let now = 0;
  let nextId = 1;
  const timers = new Map();

  return {
    get now() {
      return now;
    },
    get pending() {
      return timers.size;
    },
    setTimeout(fn, delay) {
      const id = nextId++;
      timers.set(id, { at: now + (delay || 0), fn });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    /** Advance virtual time, running every callback that comes due, in order. */
    tick(ms) {
      const target = now + ms;
      for (;;) {
        let due = null;
        for (const [id, t] of timers) {
          if (t.at <= target && (due === null || t.at < due[1].at)) due = [id, t];
        }
        if (!due) break;
        timers.delete(due[0]);
        now = due[1].at;
        due[1].fn();
      }
      now = target;
    },
  };
}

/** Every id="..." present in the markup — the set of elements a browser would have. */
function collectIds(html) {
  const ids = new Set();
  const re = /\sid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

function extractScripts(html) {
  const re = /<script>([\s\S]*?)<\/script>/g;
  const parts = [];
  let m;
  while ((m = re.exec(html)) !== null) parts.push(m[1]);
  return parts;
}

function loadUI(key, options) {
  const opts = options || {};
  const dir = PLUGIN_DIRS[key];
  if (!dir) throw new Error('Unknown plugin key: ' + key);

  const html = fs.readFileSync(pluginPath(key, 'ui.html'), 'utf8');
  const scripts = extractScripts(html);
  if (!scripts.length) throw new Error(dir + '/ui.html: no <script> block found');

  const elements = new Map();
  for (const id of collectIds(html)) elements.set(id, new MockElement(id));

  const body = new MockElement('__body__');
  body.scrollHeight = opts.bodyHeight === undefined ? 480 : opts.bodyHeight;

  const messages = [];
  const clock = createClock();

  const document = {
    body,
    getElementById(id) {
      return elements.has(id) ? elements.get(id) : null;
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    addEventListener() {},
    createElement() {
      return new MockElement(null);
    },
  };

  const windowObj = { onmessage: null };

  const sandbox = {
    document,
    window: windowObj,
    parent: {
      postMessage(payload) {
        messages.push(payload && payload.pluginMessage);
      },
    },
    console,
    setTimeout: (fn, ms) => clock.setTimeout(fn, ms),
    clearTimeout: (id) => clock.clearTimeout(id),
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
  };
  sandbox.globalThis = sandbox;

  const context = vm.createContext(sandbox);
  scripts.forEach((src, i) => {
    vm.runInContext(src, context, { filename: dir + '/ui.html#script' + i });
  });

  return {
    key,
    dir,
    /** The sandbox global — exposes the UI script's top-level vars and functions. */
    global: context,
    clock,
    messages,

    el(id) {
      const found = document.getElementById(id);
      if (!found) throw new Error(dir + '/ui.html: no element with id "' + id + '"');
      return found;
    },

    /** Messages the UI posted to the plugin, optionally filtered by type. */
    posted(type) {
      return type ? messages.filter((m) => m && m.type === type) : messages.slice();
    },

    /** Deliver a plugin → UI message exactly as the iframe would receive it. */
    receive(msg) {
      if (typeof windowObj.onmessage !== 'function') {
        throw new Error(dir + '/ui.html: script never assigned window.onmessage');
      }
      windowObj.onmessage({ data: { pluginMessage: msg } });
    },

    /** Current state of the clipboard box, as a user would read it. */
    clipboard() {
      const box = this.el('clipboardBox');
      return {
        visible: box.style.display === 'block',
        loading: box.classList.contains('loading'),
        summary: this.el('clipboardSummary').textContent,
        copyDisabled: !!this.el('copyBtn').disabled,
        pasteDisabled: !!this.el('pasteBtn').disabled,
      };
    },
  };
}

module.exports = { loadUI, createClock, MockElement };

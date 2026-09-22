'use strict';

/**
 * Strict-where-it-matters mock of the Figma Plugin API.
 *
 * The plugins' code.js files run unmodified inside a VM against this mock, so
 * tests exercise the real rendering logic. The mock deliberately reproduces the
 * *validation* behaviour of the real API, because that is where the plugins
 * actually break:
 *
 *   - resize() rejects sizes < 0.01 and non-finite sizes (real Figma throws).
 *     This is what turns "negative pie radius" into a loud failure.
 *   - LINE nodes must be resized with height exactly 0.
 *   - arcData rejects non-finite angles and innerRadius outside [0, 1].
 *   - vectorPaths rejects NaN/Infinity coordinates.
 *   - TEXT rejects fontName/characters writes before loadFontAsync().
 *   - createX() parents the new node to the current page, so leaked
 *     measurement nodes are observable (see "no stray nodes" assertions).
 *
 * APPROXIMATIONS — never assert exact pixel values against these:
 *   - Text metrics use a per-character advance table (see measureText). Widths
 *     are proportional and stable, but they are not Inter's real metrics.
 *   - VECTOR x/y/width/height are derived from the bounding box of the path
 *     data, and the path data itself is kept verbatim.
 *   - `rotation` is stored but no transform math is applied, so a rotated
 *     LINE's box stays axis-aligned. Tests must not assert rotated geometry.
 *   - GROUP boxes are computed once, at figma.group() time. The plugins never
 *     move children after grouping; if that changes, boxes go stale.
 */

// ── Text metrics ────────────────────────────────────────────────────────────
const NARROW_CHARS = " .,:;'\"|!()[]{}-ijlt1rfI";
const WIDE_CHARS = 'ABCDEFGHKMNOPQRSUVWXYZmw%@—…';

function charAdvance(ch) {
  if (NARROW_CHARS.indexOf(ch) !== -1) return 0.32;
  if (WIDE_CHARS.indexOf(ch) !== -1) return 0.68;
  return 0.56;
}

function measureText(characters, fontSize) {
  let w = 0;
  for (const ch of String(characters)) w += charAdvance(ch) * fontSize;
  return Math.round(w * 1000) / 1000;
}

const TEXT_LINE_HEIGHT = 1.21;

// ── Helpers ─────────────────────────────────────────────────────────────────
const CONTAINER_TYPES = ['PAGE', 'FRAME', 'GROUP', 'COMPONENT', 'INSTANCE'];

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

function fontKey(fontName) {
  if (!fontName || typeof fontName !== 'object') return String(fontName);
  return fontName.family + '|' + fontName.style;
}

function absOrigin(node) {
  let x = 0;
  let y = 0;
  let cur = node;
  while (cur && cur.type !== 'PAGE') {
    x += cur.x;
    y += cur.y;
    cur = cur.parent;
  }
  return { x, y };
}

/**
 * Absolute box of a node.
 *
 * The plugins draw vertical grid lines as a horizontal LINE of length `plotH`
 * rotated -90°, then position it. Rotation is otherwise not modelled, so the
 * one case that matters for geometry — a LINE at ±90° — swaps its extents here.
 * Any other rotation is ignored (no plugin uses one).
 */
function absBox(node) {
  const o = absOrigin(node);
  let w = node.width;
  let h = node.height;
  const rot = (((node.rotation || 0) % 360) + 360) % 360;
  if (node.type === 'LINE' && (rot === 90 || rot === 270)) {
    const swap = w;
    w = h;
    h = swap;
  }
  return { x: o.x, y: o.y, w, h };
}

function isAncestorOf(maybeAncestor, node) {
  let cur = node;
  while (cur) {
    if (cur === maybeAncestor) return true;
    cur = cur.parent;
  }
  return false;
}

// ── Node ────────────────────────────────────────────────────────────────────
class MockNode {
  constructor(type, doc) {
    this.type = type;
    this.doc = doc;
    this.id = type.toLowerCase() + ':' + doc.nextId();
    this.name = type === 'FRAME' ? 'Frame' : type[0] + type.slice(1).toLowerCase();
    this.parent = null;
    this.removed = false;

    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.opacity = 1;
    this.visible = true;

    this.fills = [];
    this.strokes = [];
    this.strokeWeight = 1;
    this.strokeCap = 'NONE';
    this.strokeJoin = 'MITER';
    this.strokeAlign = 'CENTER';

    this._w = type === 'LINE' ? 100 : 100;
    this._h = type === 'LINE' ? 0 : 100;
    this._cornerRadius = 0;
    this._arcData = { startingAngle: 0, endingAngle: Math.PI * 2, innerRadius: 0 };
    this._vectorPaths = [];
    this._characters = '';
    this._fontSize = 12;
    this._fontName = { family: 'Inter', style: 'Regular' };
    this._pluginData = {};

    if (CONTAINER_TYPES.indexOf(type) !== -1) {
      this._children = [];
      this.clipsContent = type === 'FRAME';
    }
    if (type === 'TEXT') {
      this.textAutoResize = 'WIDTH_AND_HEIGHT';
    }

    doc.register(this);
  }

  // ── Size ────────────────────────────────────────────────────────────────
  get width() {
    if (this.type === 'TEXT') return measureText(this._characters, this._fontSize);
    return this._w;
  }

  get height() {
    if (this.type === 'TEXT') return Math.round(this._fontSize * TEXT_LINE_HEIGHT * 1000) / 1000;
    return this._h;
  }

  resize(w, h) {
    if (this.removed) throw new Error('in resize: The node with id ' + this.id + ' does not exist');
    if (!isFiniteNumber(w) || !isFiniteNumber(h)) {
      throw new Error(
        'in resize: Expected "width" and "height" to be finite numbers, got ' + w + ' × ' + h,
      );
    }
    if (this.type === 'LINE') {
      if (h !== 0) throw new Error('in resize: Expected "height" to be 0 for a LINE node, got ' + h);
      if (w < 0.01) {
        throw new Error('in resize: Expected "width" to have value >= 0.01, got ' + w);
      }
      this._w = w;
      this._h = 0;
      return;
    }
    if (w < 0.01) throw new Error('in resize: Expected "width" to have value >= 0.01, got ' + w);
    if (h < 0.01) throw new Error('in resize: Expected "height" to have value >= 0.01, got ' + h);
    this._w = w;
    this._h = h;
  }

  // ── Ellipse / corner radius ─────────────────────────────────────────────
  get cornerRadius() {
    return this._cornerRadius;
  }

  set cornerRadius(v) {
    if (!isFiniteNumber(v) || v < 0) {
      throw new Error('in set_cornerRadius: Expected a number >= 0, got ' + v);
    }
    this._cornerRadius = v;
  }

  get arcData() {
    return this._arcData;
  }

  set arcData(v) {
    if (!v || typeof v !== 'object') throw new Error('in set_arcData: Expected an object, got ' + v);
    const { startingAngle, endingAngle, innerRadius } = v;
    if (!isFiniteNumber(startingAngle) || !isFiniteNumber(endingAngle)) {
      throw new Error(
        'in set_arcData: Expected finite angles, got ' + startingAngle + ' / ' + endingAngle,
      );
    }
    if (!isFiniteNumber(innerRadius) || innerRadius < 0 || innerRadius > 1) {
      throw new Error(
        'in set_arcData: Expected "innerRadius" to have value >= 0 and <= 1, got ' + innerRadius,
      );
    }
    this._arcData = { startingAngle, endingAngle, innerRadius };
  }

  // ── Vector ──────────────────────────────────────────────────────────────
  get vectorPaths() {
    return this._vectorPaths;
  }

  set vectorPaths(paths) {
    if (!Array.isArray(paths)) throw new Error('in set_vectorPaths: Expected an array');
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of paths) {
      if (!p || typeof p.data !== 'string') {
        throw new Error('in set_vectorPaths: Expected each path to have string "data"');
      }
      const tokens = p.data.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?|NaN|-?Infinity/gi) || [];
      for (const tok of tokens) {
        const n = Number(tok);
        if (!Number.isFinite(n)) {
          throw new Error(
            'in set_vectorPaths: Invalid coordinate "' + tok + '" in path data: ' + p.data,
          );
        }
      }
      for (let i = 0; i + 1 < tokens.length; i += 2) {
        const x = Number(tokens[i]);
        const y = Number(tokens[i + 1]);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    this._vectorPaths = paths;
    if (Number.isFinite(minX)) {
      // Mirror Figma closely enough for geometry assertions: the node's box is
      // the path bounding box, expressed in the parent's coordinate space.
      this.x = minX;
      this.y = minY;
      this._w = Math.max(maxX - minX, 0);
      this._h = Math.max(maxY - minY, 0);
    }
  }

  // ── Text ────────────────────────────────────────────────────────────────
  get characters() {
    return this._characters;
  }

  set characters(v) {
    this._assertFontLoaded('set_characters');
    this._characters = String(v);
  }

  get fontSize() {
    return this._fontSize;
  }

  set fontSize(v) {
    this._assertFontLoaded('set_fontSize');
    if (!isFiniteNumber(v) || v < 1) {
      throw new Error('in set_fontSize: Expected a number >= 1, got ' + v);
    }
    this._fontSize = v;
  }

  get fontName() {
    return this._fontName;
  }

  set fontName(v) {
    if (!v || typeof v !== 'object' || !v.family || !v.style) {
      throw new Error('in set_fontName: Expected { family, style }, got ' + JSON.stringify(v));
    }
    if (!this.doc.loadedFonts.has(fontKey(v))) {
      throw new Error(
        'in set_fontName: Cannot write to node with unloaded font "' +
          v.family +
          ' ' +
          v.style +
          '" — call figma.loadFontAsync() first',
      );
    }
    this._fontName = { family: v.family, style: v.style };
  }

  _assertFontLoaded(op) {
    if (this.type !== 'TEXT') return;
    if (!this.doc.loadedFonts.has(fontKey(this._fontName))) {
      throw new Error(
        'in ' +
          op +
          ': Cannot write to node with unloaded font "' +
          this._fontName.family +
          ' ' +
          this._fontName.style +
          '"',
      );
    }
  }

  // ── Tree ────────────────────────────────────────────────────────────────
  get children() {
    if (!this._children) return undefined;
    return this._children.slice();
  }

  appendChild(child) {
    if (!this._children) throw new Error(this.type + ' cannot have children');
    if (this.removed) throw new Error('in appendChild: The parent node does not exist');
    if (child.removed) throw new Error('in appendChild: The child node does not exist');
    if (child === this) throw new Error('in appendChild: Cannot append a node to itself');
    if (isAncestorOf(child, this)) {
      throw new Error('in appendChild: Cannot append a node to its own descendant');
    }
    this.doc.detach(child);
    child.parent = this;
    this._children.push(child);
  }

  insertChild(index, child) {
    this.appendChild(child);
    const from = this._children.indexOf(child);
    this._children.splice(from, 1);
    this._children.splice(index, 0, child);
  }

  remove() {
    this.doc.detach(this);
    this.removed = true;
    if (this._children) {
      for (const c of this._children.slice()) c.remove();
      this._children = [];
    }
    this.doc.unregister(this);
  }

  // ── Plugin data ─────────────────────────────────────────────────────────
  getPluginData(key) {
    return this._pluginData[key] || '';
  }

  setPluginData(key, value) {
    if (typeof value !== 'string') {
      throw new Error('in setPluginData: Expected a string value, got ' + typeof value);
    }
    this._pluginData[key] = value;
  }

  getPluginDataKeys() {
    return Object.keys(this._pluginData);
  }
}

// ── Document / figma root ───────────────────────────────────────────────────
class MockDocument {
  constructor() {
    this._seq = 0;
    this.nodes = new Map();
    this.loadedFonts = new Set();
    this.loadedFontRequests = [];
  }

  nextId() {
    return ++this._seq;
  }

  register(node) {
    this.nodes.set(node.id, node);
  }

  unregister(node) {
    this.nodes.delete(node.id);
  }

  detach(node) {
    const p = node.parent;
    if (p && p._children) {
      const i = p._children.indexOf(node);
      if (i !== -1) p._children.splice(i, 1);
    }
    node.parent = null;
  }
}

/**
 * Builds a fresh figma mock.
 * Returns { figma, doc, log } where `log` records side effects the plugins
 * produce for the user: notifications, UI messages, viewport jumps, resizes.
 */
function createFigmaMock() {
  const doc = new MockDocument();
  const page = new MockNode('PAGE', doc);
  page.name = 'Page 1';
  page.selection = [];

  const log = {
    notifications: [],
    uiMessages: [],
    viewportCalls: [],
    uiResizes: [],
    showUI: [],
    fontLoads: doc.loadedFontRequests,
  };

  const listeners = { selectionchange: [], documentchange: [], close: [], run: [] };

  function create(type) {
    const node = new MockNode(type, doc);
    // Real Figma parents newly created nodes to the current page.
    page.appendChild(node);
    return node;
  }

  const figma = {
    currentPage: page,
    root: { children: [page] },
    editorType: 'figma',

    createFrame() {
      const n = create('FRAME');
      n.name = 'Frame';
      n._w = 100;
      n._h = 100;
      n.clipsContent = true;
      n.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      return n;
    },
    createRectangle() {
      const n = create('RECTANGLE');
      n.name = 'Rectangle';
      return n;
    },
    createEllipse() {
      const n = create('ELLIPSE');
      n.name = 'Ellipse';
      return n;
    },
    createText() {
      const n = create('TEXT');
      n.name = 'Text';
      n._w = 0;
      n._h = 0;
      return n;
    },
    createVector() {
      const n = create('VECTOR');
      n.name = 'Vector';
      n._w = 0;
      n._h = 0;
      return n;
    },
    createLine() {
      const n = create('LINE');
      n.name = 'Line';
      n._w = 100;
      n._h = 0;
      return n;
    },

    group(nodes, parent, index) {
      if (!Array.isArray(nodes) || nodes.length === 0) {
        throw new Error('in group: Cannot group zero nodes');
      }
      for (const n of nodes) {
        if (n.removed) throw new Error('in group: Cannot group a removed node');
      }
      const boxes = nodes.map(absBox);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const b of boxes) {
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.x + b.w > maxX) maxX = b.x + b.w;
        if (b.y + b.h > maxY) maxY = b.y + b.h;
      }

      const g = new MockNode('GROUP', doc);
      g.name = 'Group';
      const parentOrigin = absOrigin(parent);
      g.x = minX - parentOrigin.x;
      g.y = minY - parentOrigin.y;
      g._w = maxX - minX;
      g._h = maxY - minY;
      g.parent = parent;
      if (typeof index === 'number') parent._children.splice(index, 0, g);
      else parent._children.push(g);

      nodes.forEach((n, i) => {
        doc.detach(n);
        n.parent = g;
        g._children.push(n);
        n.x = boxes[i].x - minX;
        n.y = boxes[i].y - minY;
      });
      return g;
    },

    getNodeById(id) {
      const n = doc.nodes.get(id);
      return n && !n.removed ? n : null;
    },
    getNodeByIdAsync(id) {
      return Promise.resolve(figma.getNodeById(id));
    },

    loadFontAsync(fontName) {
      doc.loadedFontRequests.push(fontKey(fontName));
      doc.loadedFonts.add(fontKey(fontName));
      return Promise.resolve();
    },

    notify(message, options) {
      log.notifications.push({ message: String(message), options: options || null });
      return { cancel() {} };
    },

    showUI(html, options) {
      log.showUI.push({ htmlLength: String(html).length, options: options || null });
    },

    ui: {
      onmessage: null,
      postMessage(msg) {
        // Real postMessage structure-clones across the plugin/UI boundary, so
        // the UI can never receive live plugin objects. Cloning here also makes
        // non-serialisable payloads fail loudly, exactly as they would in Figma.
        log.uiMessages.push(structuredClone(msg));
      },
      resize(w, h) {
        log.uiResizes.push({ w, h });
      },
      close() {},
      on() {},
    },

    viewport: {
      center: { x: 0, y: 0 },
      zoom: 1,
      scrollAndZoomIntoView(nodes) {
        log.viewportCalls.push((nodes || []).map((n) => n.id));
      },
    },

    on(event, cb) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    },
    off(event, cb) {
      if (!listeners[event]) return;
      const i = listeners[event].indexOf(cb);
      if (i !== -1) listeners[event].splice(i, 1);
    },
    closePlugin() {},
    skipInvisibleInstanceChildren: false,
    mixed: Symbol('figma.mixed'),
  };

  return { figma, doc, page, log, listeners, MockNode, absBox, absOrigin, measureText };
}

module.exports = {
  createFigmaMock,
  MockNode,
  measureText,
  absBox,
  absOrigin,
  isAncestorOf,
  TEXT_LINE_HEIGHT,
};

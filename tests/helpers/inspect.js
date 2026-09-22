'use strict';

/**
 * Tree inspection + reusable assertions for the generated chart node trees.
 *
 * Assertions here are the ones every chart type must satisfy, so each chart
 * suite can call them instead of restating structural invariants.
 */

const assert = require('node:assert/strict');
const { absBox, absOrigin } = require('./figma-mock');

/**
 * Copies a value out of the VM realm.
 *
 * Arrays and objects returned by plugin code carry the sandbox's prototypes, so
 * assert.deepEqual against a host-realm literal fails even when the contents
 * match. Wrap plugin return values in plain() before comparing them.
 */
function plain(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

/** All descendants of a node, depth-first, excluding the node itself. */
function descendants(node) {
  const out = [];
  (function walk(n) {
    if (!n._children) return;
    for (const c of n._children) {
      out.push(c);
      walk(c);
    }
  })(node);
  return out;
}

/** Direct children keyed by name (last one wins if duplicated). */
function childrenByName(container) {
  const map = {};
  for (const c of container._children || []) map[c.name] = c;
  return map;
}

function childNames(container) {
  return (container._children || []).map((c) => c.name);
}

/**
 * Looks up a named layer the way the plugins write them: a GROUP when the
 * layer holds several nodes, or a single renamed node when it holds one.
 */
function layer(container, name) {
  const found = (container._children || []).filter((c) => c.name === name);
  if (found.length > 1) {
    throw new Error('Expected at most one layer named "' + name + '", found ' + found.length);
  }
  return found[0] || null;
}

/** Members of a named layer: the group's children, or the single node itself. */
function layerItems(container, name) {
  const node = layer(container, name);
  if (!node) return [];
  if (node.type === 'GROUP') return node._children.slice();
  return [node];
}

function nodesOfType(node, type) {
  return descendants(node).filter((n) => n.type === type);
}

function textsIn(node) {
  return nodesOfType(node, 'TEXT');
}

function charactersIn(node) {
  return textsIn(node).map((t) => t.characters);
}

function boundsOf(nodes) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    const b = absBox(n);
    if (b.x < minX) minX = b.x;
    if (b.y < minY) minY = b.y;
    if (b.x + b.w > maxX) maxX = b.x + b.w;
    if (b.y + b.h > maxY) maxY = b.y + b.h;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY, right: maxX, bottom: maxY };
}

function colorKey(c) {
  if (!c) return 'none';
  const r = Math.round(c.r * 1000) / 1000;
  const g = Math.round(c.g * 1000) / 1000;
  const b = Math.round(c.b * 1000) / 1000;
  return r + ',' + g + ',' + b;
}

function fillColorsOf(nodes) {
  const out = [];
  for (const n of nodes) {
    const f = (n.fills || [])[0];
    if (f && f.color) out.push(f.color);
  }
  return out;
}

// ── Assertions ──────────────────────────────────────────────────────────────

/** Every node has finite, non-negative geometry. */
function assertGeometryFinite(container, label) {
  const all = [container].concat(descendants(container));
  for (const n of all) {
    const where = (label || '') + ' ' + n.type + ' "' + n.name + '"';
    assert.ok(Number.isFinite(n.x), where + ': x is not finite (' + n.x + ')');
    assert.ok(Number.isFinite(n.y), where + ': y is not finite (' + n.y + ')');
    assert.ok(Number.isFinite(n.width), where + ': width is not finite (' + n.width + ')');
    assert.ok(Number.isFinite(n.height), where + ': height is not finite (' + n.height + ')');
    assert.ok(n.width >= 0, where + ': negative width (' + n.width + ')');
    assert.ok(n.height >= 0, where + ': negative height (' + n.height + ')');
  }
}

/** The container is a chart frame: right name, transparent, clipping. */
function assertChartContainer(container, expectedName, expectedW, expectedH) {
  assert.equal(container.type, 'FRAME', 'chart container must be a FRAME');
  assert.equal(container.name, expectedName, 'chart container name');
  // NB: values assigned by plugin code come from the VM realm, so deepEqual
  // against a host-realm literal fails on the prototype check. Compare shape.
  assert.equal(container.fills.length, 0, 'chart container must have no fill');
  assert.equal(container.clipsContent, true, 'chart container must clip content');
  if (expectedW !== undefined) {
    assert.equal(Math.round(container.width), Math.round(expectedW), 'container width');
  }
  if (expectedH !== undefined) {
    assert.equal(Math.round(container.height), Math.round(expectedH), 'container height');
  }
}

/** No measurement/leftover nodes were left lying on the page. */
function assertNoStrayPageNodes(handle, allowedIds) {
  const allowed = new Set(allowedIds || []);
  const stray = handle.page._children.filter((n) => !allowed.has(n.id));
  assert.equal(
    stray.length,
    0,
    'stray nodes left on the page: ' +
      stray.map((n) => n.type + ' "' + n.name + '"').join(', '),
  );
}

/** Fill colors come from the plugin's own palette. */
function assertColorsFromPalette(handle, colors, label) {
  const palette = handle.global.PALETTE;
  assert.ok(Array.isArray(palette) && palette.length > 0, 'plugin exposes PALETTE');
  const keys = new Set(palette.map(colorKey));
  for (const c of colors) {
    assert.ok(
      keys.has(colorKey(c)),
      (label || 'color') + ' ' + colorKey(c) + ' is not in the plugin palette',
    );
  }
}

/** Series colors must be pairwise distinct (up to palette size). */
function assertColorsDistinct(colors, label) {
  const keys = colors.map(colorKey);
  const unique = new Set(keys);
  assert.equal(
    unique.size,
    keys.length,
    (label || 'colors') + ' contain duplicates: ' + keys.join(' | '),
  );
}

/** chartParams round-trips through JSON and carries the keys paste needs. */
function assertChartParams(handle, container, requiredKeys) {
  const raw = container.getPluginData('chartParams');
  assert.ok(raw && raw.length > 0, 'chartParams pluginData is missing');
  let parsed;
  assert.doesNotThrow(() => {
    parsed = JSON.parse(raw);
  }, 'chartParams must be valid JSON');
  for (const key of requiredKeys || []) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(parsed, key),
      'chartParams is missing "' + key + '"',
    );
  }
  return parsed;
}

/** Node stays inside the container box, within tolerance (px). */
function assertInside(container, node, tolerance, label) {
  const tol = tolerance === undefined ? 0.5 : tolerance;
  const c = absBox(container);
  const b = absBox(node);
  const where = (label || '') + ' ' + node.type + ' "' + node.name + '"';
  assert.ok(b.x >= c.x - tol, where + ': overflows left (' + b.x + ' < ' + c.x + ')');
  assert.ok(b.y >= c.y - tol, where + ': overflows top (' + b.y + ' < ' + c.y + ')');
  assert.ok(
    b.x + b.w <= c.x + c.w + tol,
    where + ': overflows right (' + (b.x + b.w) + ' > ' + (c.x + c.w) + ')',
  );
  assert.ok(
    b.y + b.h <= c.y + c.h + tol,
    where + ': overflows bottom (' + (b.y + b.h) + ' > ' + (c.y + c.h) + ')',
  );
}

module.exports = {
  plain,
  descendants,
  childrenByName,
  childNames,
  layer,
  layerItems,
  nodesOfType,
  textsIn,
  charactersIn,
  boundsOf,
  colorKey,
  fillColorsOf,
  absBox,
  absOrigin,
  assertGeometryFinite,
  assertChartContainer,
  assertNoStrayPageNodes,
  assertColorsFromPalette,
  assertColorsDistinct,
  assertChartParams,
  assertInside,
};

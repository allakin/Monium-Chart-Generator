'use strict';

/**
 * Shared helpers for the three axis charts (Line, Area, Bar).
 *
 * The plot rectangle is never stored by the plugins, so it is reconstructed
 * from the Grid layer, which is drawn against exactly those bounds:
 *   - horizontal grid lines run from plot.x − 6 (overshoot) to plot.x + plot.w
 *   - vertical grid lines run from plot.y down to plot.y + plot.h
 *     (the horizontal-bar grid adds the same 6px overshoot downwards)
 */

const assert = require('node:assert/strict');
const { layerItems, boundsOf, absBox } = require('./inspect');

const GRID_OVERSHOOT = 6;

function isRotatedLine(node) {
  const rot = (((node.rotation || 0) % 360) + 360) % 360;
  return node.type === 'LINE' && (rot === 90 || rot === 270);
}

function gridLines(container) {
  const items = layerItems(container, 'Grid');
  return {
    horizontal: items.filter((n) => !isRotatedLine(n)),
    vertical: items.filter(isRotatedLine),
    all: items,
  };
}

/** Plot rectangle in absolute coordinates, reconstructed from the grid. */
function plotOf(container) {
  const { horizontal, vertical } = gridLines(container);
  assert.ok(horizontal.length > 0, 'grid has horizontal lines');
  assert.ok(vertical.length > 0, 'grid has vertical lines');
  const hb = boundsOf(horizontal);
  const vb = boundsOf(vertical);
  return {
    left: hb.x + GRID_OVERSHOOT,
    right: hb.right,
    top: vb.y,
    bottom: vb.bottom,
    get width() {
      return this.right - this.left;
    },
    get height() {
      return this.bottom - this.top;
    },
  };
}

/** Texts of a layer, ordered left→right then top→bottom. */
function orderedTexts(container, layerName) {
  return layerItems(container, layerName)
    .filter((n) => n.type === 'TEXT')
    .sort((a, b) => {
      const ba = absBox(a);
      const bb = absBox(b);
      return ba.y - bb.y || ba.x - bb.x;
    });
}

/** Y axis labels, ordered top→bottom (i.e. highest value first). */
function yAxisTexts(container) {
  return layerItems(container, 'Y Labels')
    .filter((n) => n.type === 'TEXT')
    .sort((a, b) => absBox(a).y - absBox(b).y);
}

/** X axis labels, ordered left→right. */
function xAxisTexts(container) {
  return layerItems(container, 'X Labels')
    .filter((n) => n.type === 'TEXT')
    .sort((a, b) => absBox(a).x - absBox(b).x);
}

/** Grid styling is fixed by the style guide: 0.5px #E5E5E5 lines. */
function assertGridStyle(container) {
  for (const line of gridLines(container).all) {
    assert.equal(line.type, 'LINE', 'grid uses LINE nodes');
    assert.equal(line.strokeWeight, 0.5, 'grid stroke weight');
    const c = line.strokes[0].color;
    assert.ok(
      Math.abs(c.r - 0.898) < 1e-3 && Math.abs(c.g - 0.898) < 1e-3 && Math.abs(c.b - 0.898) < 1e-3,
      'grid color is #E5E5E5, got ' + JSON.stringify(c),
    );
  }
}

/** Axis text styling is fixed by the style guide: 11px black at 50%. */
function assertAxisTextStyle(container, layerName) {
  const texts = layerItems(container, layerName).filter((n) => n.type === 'TEXT');
  assert.ok(texts.length > 0, layerName + ' has text nodes');
  for (const t of texts) {
    assert.equal(t.fontSize, 11, layerName + ' font size');
    assert.equal(t.fontName.family, 'Inter');
    assert.equal(t.fontName.style, 'Regular');
    assert.equal(t.fills[0].opacity, 0.5, layerName + ' text opacity');
    const c = t.fills[0].color;
    assert.ok(c.r === 0 && c.g === 0 && c.b === 0, layerName + ' text color is black');
  }
}

/** Y labels are right-aligned 8px left of the plot. */
function assertYLabelsRightAligned(container) {
  const plot = plotOf(container);
  const texts = yAxisTexts(container);
  const rightEdges = texts.map((t) => absBox(t).x + absBox(t).w);
  const first = rightEdges[0];
  for (const edge of rightEdges) {
    assert.ok(
      Math.abs(edge - first) < 0.01,
      'all Y labels share a right edge, got ' + rightEdges.join(', '),
    );
  }
  assert.ok(
    Math.abs(plot.left - first - 8) < 0.5,
    'Y labels sit 8px left of the plot (gap ' + (plot.left - first) + ')',
  );
}

/** Event bars are 6px tall and sit outside the plot on the right side. */
function assertEventBars(container, layerName, position) {
  const items = layerItems(container, layerName);
  assert.ok(items.length > 0, layerName + ' has segments');
  const plot = plotOf(container);
  for (const rect of items) {
    assert.equal(rect.type, 'RECTANGLE', layerName + ' uses rectangles');
    assert.equal(Math.round(rect.height), 6, layerName + ' bar height is 6px');
    const b = absBox(rect);
    assert.ok(b.x >= plot.left - 0.5, layerName + ' starts inside the plot width');
    assert.ok(b.x + b.w <= plot.right + 0.5, layerName + ' ends inside the plot width');
    if (position === 'top') {
      assert.ok(b.y + b.h <= plot.top + 0.5, 'top events sit above the plot');
    } else {
      assert.ok(b.y >= plot.bottom - 6.5, 'bottom events sit below the plot');
    }
    assert.ok(rect.fills[0].opacity >= 0.4 && rect.fills[0].opacity <= 1, 'event opacity range');
  }
}

/** The legend block sits below the plot and inside the frame. */
function assertLegendBelowPlot(container) {
  const plot = plotOf(container);
  const items = layerItems(container, 'Legend');
  assert.ok(items.length > 0, 'legend has items');
  const top = Math.min.apply(null, items.map((n) => absBox(n).y));
  assert.ok(
    top >= plot.bottom - 0.5,
    'legend top ' + top + ' must be below the plot bottom ' + plot.bottom,
  );
}

module.exports = {
  GRID_OVERSHOOT,
  isRotatedLine,
  gridLines,
  plotOf,
  orderedTexts,
  yAxisTexts,
  xAxisTexts,
  assertGridStyle,
  assertAxisTextStyle,
  assertYLabelsRightAligned,
  assertEventBars,
  assertLegendBelowPlot,
};

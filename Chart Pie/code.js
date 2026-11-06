"use strict";

// ─── Palette ────────────────────────────────────
var PALETTE = [
  { r: 0.043, g: 0.741, b: 0.890 }, // #0ABDE3
  { r: 0.984, g: 0.773, b: 0.192 }, // #FBC531
  { r: 0.424, g: 0.361, b: 0.906 }, // #6C5CE7
  { r: 0.020, g: 0.769, b: 0.420 }, // #05C46B
  { r: 1.000, g: 0.420, b: 0.420 }, // #FF6B6B
  { r: 0.341, g: 0.396, b: 0.455 }, // #576574
  { r: 0.329, g: 0.627, b: 1.000 }, // #54A0FF
  { r: 0.906, g: 0.494, b: 0.133 }, // #E67E22
  { r: 0.608, g: 0.349, b: 0.714 }, // #9B59B6
  { r: 0.180, g: 0.835, b: 0.451 }, // #2ED573
  { r: 0.992, g: 0.447, b: 0.447 }, // #FD7272
  { r: 0.282, g: 0.859, b: 0.984 }, // #48DBFB
  { r: 1.000, g: 0.753, b: 0.282 }, // #FFC048
  { r: 0.373, g: 0.153, b: 0.804 }, // #5F27CD
  { r: 0.000, g: 0.722, b: 0.580 }, // #00B894
  { r: 0.839, g: 0.188, b: 0.192 }, // #D63031
  { r: 0.584, g: 0.647, b: 0.651 }, // #95A5A6
  { r: 0.271, g: 0.667, b: 0.949 }, // #45AAF2
  { r: 0.969, g: 0.624, b: 0.122 }, // #F79F1F
  { r: 0.510, g: 0.345, b: 0.624 }, // #82589F
  { r: 0.000, g: 0.824, b: 0.827 }, // #00D2D3
  { r: 0.918, g: 0.525, b: 0.522 }, // #EA8685
  { r: 0.106, g: 0.612, b: 0.988 }, // #1B9CFC
  { r: 1.000, g: 0.624, b: 0.263 }, // #FF9F43
  { r: 0.424, g: 0.204, b: 0.514 }, // #6C3483
  { r: 0.114, g: 0.820, b: 0.631 }, // #1DD1A1
  { r: 0.992, g: 0.655, b: 0.875 }, // #FDA7DF
  { r: 0.514, g: 0.584, b: 0.655 }, // #8395A7
  { r: 0.302, g: 0.486, b: 0.996 }, // #4D7CFE
  { r: 0.933, g: 0.353, b: 0.141 }, // #EE5A24
  { r: 0.533, g: 0.329, b: 0.816 }, // #8854D0
  { r: 0.169, g: 0.796, b: 0.729 }, // #2BCBBA
  { r: 1.000, g: 0.392, b: 0.486 }, // #FF647C
  { r: 0.180, g: 0.525, b: 0.871 }, // #2E86DE
  { r: 0.882, g: 0.439, b: 0.333 }, // #E17055
  { r: 0.647, g: 0.369, b: 0.918 }, // #A55EEA
  { r: 0.063, g: 0.675, b: 0.518 }, // #10AC84
  { r: 0.702, g: 0.216, b: 0.443 }, // #B33771
  { r: 0.498, g: 0.549, b: 0.553 }, // #7F8C8D
  { r: 0.294, g: 0.482, b: 0.925 }, // #4B7BEC
  { r: 1.000, g: 0.635, b: 0.420 }, // #FFA26B
  { r: 0.235, g: 0.251, b: 0.776 }, // #3C40C6
  { r: 0.333, g: 0.937, b: 0.769 }, // #55EFC4
  { r: 0.769, g: 0.271, b: 0.412 }, // #C44569
  { r: 0.004, g: 0.639, b: 0.643 }, // #01A3A4
  { r: 0.000, g: 0.769, b: 0.549 }, // #00C48C
  { r: 0.839, g: 0.635, b: 0.910 }, // #D6A2E8
  { r: 0.220, g: 0.557, b: 0.675 }, // #3890AC
  { r: 0.604, g: 0.925, b: 0.859 }, // #9AECDB
  { r: 0.231, g: 0.231, b: 0.596 }, // #3B3B98
  { r: 0.345, g: 0.694, b: 0.624 }, // #58B19F
  { r: 0.431, g: 0.298, b: 0.702 }, // #6E4CB3
  { r: 0.149, g: 0.871, b: 0.506 }, // #26DE81
  { r: 0.059, g: 0.737, b: 0.976 }, // #0FBCF9
  { r: 0.000, g: 0.659, b: 1.000 }, // #00A8FF
  { r: 0.000, g: 0.592, b: 0.902 }, // #0097E6
  { r: 0.298, g: 0.820, b: 0.216 }, // #4CD137
  { r: 0.267, g: 0.741, b: 0.196 }, // #44BD32
  { r: 0.278, g: 0.494, b: 0.690 }, // #487EB0
  { r: 0.251, g: 0.451, b: 0.620 }, // #40739E
  { r: 0.882, g: 0.694, b: 0.173 }, // #E1B12C
  { r: 0.761, g: 0.212, b: 0.086 }, // #C23616
  { r: 0.549, g: 0.478, b: 0.902 }, // #8C7AE6
  { r: 0.612, g: 0.533, b: 1.000 }, // #9C88FF
  { r: 0.443, g: 0.502, b: 0.576 }, // #718093
  { r: 0.482, g: 0.122, b: 0.635 }, // #7B1FA2
  { r: 0.000, g: 0.537, b: 0.482 }, // #00897B
  { r: 0.847, g: 0.106, b: 0.376 }, // #D81B60
];

// ─── Perceptual color distance ──────────────────────────────
// Series colors are compared in OKLab, not in raw RGB. Equal RGB steps are not
// equal perceptual steps, so an RGB-nearest search happily hands two visually
// identical colors to neighbouring series: #FF6B6B and #FD7272 sit far apart in
// RGB but only 1.3 apart perceptually. Distances below are OKLab ΔE × 100.
function cubeRoot(x) {
  return (x < 0) ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
}

function srgbChannelToLinear(c) {
  return (c <= 0.04045) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearRgbToOklab(r, g, b) {
  var l = cubeRoot(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  var m = cubeRoot(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  var s = cubeRoot(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ];
}

// Colour-vision-deficiency simulation in linear RGB (Machado, Oliveira &
// Fernandes 2009, severity 1.0). Protanopia and deuteranopia cover the large
// majority of colour blindness; simulating them here is what stops the picker
// from choosing a pair that is vivid for most readers and identical for some.
var VISION_MODELS = [
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881]
];

// PALETTE_LAB[i][v] — OKLab coordinates of palette color i under vision model v.
// Built once at load: 68 colors × 3 models, so the picker only ever subtracts.
var PALETTE_LAB = [];
for (var pl = 0; pl < PALETTE.length; pl++) {
  var plr = srgbChannelToLinear(PALETTE[pl].r);
  var plg = srgbChannelToLinear(PALETTE[pl].g);
  var plb = srgbChannelToLinear(PALETTE[pl].b);
  var plVariants = [];
  for (var pv = 0; pv < VISION_MODELS.length; pv++) {
    var pm = VISION_MODELS[pv];
    plVariants.push(linearRgbToOklab(
      pm[0] * plr + pm[1] * plg + pm[2] * plb,
      pm[3] * plr + pm[4] * plg + pm[5] * plb,
      pm[6] * plr + pm[7] * plg + pm[8] * plb
    ));
  }
  PALETTE_LAB.push(plVariants);
}

// The smallest perceptual gap between two palette colors across all vision
// models — a pair that collapses under colour blindness counts as close.
function paletteDistance(a, b) {
  var la = PALETTE_LAB[a];
  var lb = PALETTE_LAB[b];
  var worst = Infinity;
  for (var v = 0; v < la.length; v++) {
    var dl = la[v][0] - lb[v][0];
    var da = la[v][1] - lb[v][1];
    var db = la[v][2] - lb[v][2];
    var d = Math.sqrt(dl * dl + da * da + db * db) * 100;
    if (d < worst) worst = d;
  }
  return worst;
}

// ─── Series order ───────────────────────────────────────────
// Which colors get picked is one question; which series wears which is another.
// Neighbours are what the eye compares — touching pie slices, stacked bar
// segments, adjacent legend rows — so the picked set is ordered to maximize the
// smallest gap between consecutive series: a greedy chain, then swap passes.
function orderForAdjacency(indices) {
  var n = indices.length;
  if (n < 3) return indices.slice();
  var i, j;
  var dist = [];
  for (i = 0; i < n; i++) {
    dist.push([]);
    for (j = 0; j < n; j++) dist[i].push(paletteDistance(indices[i], indices[j]));
  }
  var smallestGap = function (seq) {
    var worst = Infinity;
    for (var q = 0; q + 1 < seq.length; q++) {
      if (dist[seq[q]][seq[q + 1]] < worst) worst = dist[seq[q]][seq[q + 1]];
    }
    return worst;
  };
  var taken = [];
  for (i = 0; i < n; i++) taken.push(false);
  var order = [0];
  taken[0] = true;
  for (var step = 1; step < n; step++) {
    var last = order[order.length - 1];
    var bestPos = -1;
    var bestDist = -1;
    for (j = 0; j < n; j++) {
      if (taken[j]) continue;
      if (dist[last][j] > bestDist) { bestDist = dist[last][j]; bestPos = j; }
    }
    order.push(bestPos);
    taken[bestPos] = true;
  }
  var current = smallestGap(order);
  for (var pass = 0; pass < 8; pass++) {
    var improved = false;
    for (i = 0; i < n - 1; i++) {
      for (j = i + 1; j < n; j++) {
        var swapped = order.slice();
        var t = swapped[i]; swapped[i] = swapped[j]; swapped[j] = t;
        var gap = smallestGap(swapped);
        if (gap > current) { order = swapped; current = gap; improved = true; }
      }
    }
    if (!improved) break;
  }
  var result = [];
  for (i = 0; i < n; i++) result.push(indices[order[i]]);
  return result;
}

// ─── Distinct color selection ───────────────────────────────
// Greedy maximin: pick a random first color — that randomness is what makes
// every generation look different — then each next color maximizes the minimum
// perceptual distance to everything already picked. Finally hand the set to
// orderForAdjacency so neighbouring series are the most contrasting pairs.
function selectDistinctColors(count) {
  var used = [];
  var i;
  if (count >= PALETTE.length) {
    for (i = 0; i < PALETTE.length; i++) used.push(i);
    for (var si = used.length - 1; si > 0; si--) {
      var ri = Math.floor(Math.random() * (si + 1));
      var tmp = used[si]; used[si] = used[ri]; used[ri] = tmp;
    }
  } else {
    var available = [];
    for (i = 0; i < PALETTE.length; i++) available.push(i);
    var firstIdx = Math.floor(Math.random() * available.length);
    used.push(available[firstIdx]);
    available.splice(firstIdx, 1);
    for (var pick = 1; pick < count; pick++) {
      var bestIdx = 0;
      var bestDist = -1;
      for (var j = 0; j < available.length; j++) {
        var minDist = Infinity;
        for (var k = 0; k < used.length; k++) {
          var d = paletteDistance(available[j], used[k]);
          if (d < minDist) minDist = d;
        }
        if (minDist > bestDist) { bestDist = minDist; bestIdx = j; }
      }
      used.push(available[bestIdx]);
      available.splice(bestIdx, 1);
    }
  }
  used = orderForAdjacency(used);
  var result = [];
  for (i = 0; i < used.length; i++) result.push(PALETTE[used[i]]);
  return result;
}

// ─── User-pinned segment colors ─────────────────────────────
// The UI color picker offers the generation palette. A pinned color travels as
// a "#RRGGBB" string; palette hexes are derived from the palette entries
// themselves, so hex → palette lookup is an exact round trip. A valid hex that
// is not in the palette (a chart from an older palette) stays pinned as is.
// null means "Auto": the segment gets a generated color that stays distinct
// from every pinned one.
function colorToHex(c) {
  var parts = [c.r, c.g, c.b];
  var hex = "#";
  for (var i = 0; i < parts.length; i++) {
    var v = Math.max(0, Math.min(255, Math.round(parts[i] * 255)));
    hex += (v < 16 ? "0" : "") + v.toString(16).toUpperCase();
  }
  return hex;
}

var PALETTE_HEX = [];
for (var ph = 0; ph < PALETTE.length; ph++) PALETTE_HEX.push(colorToHex(PALETTE[ph]));

function normalizeHex(hex) {
  if (typeof hex !== "string") return null;
  var h = hex.trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(h) ? h : null;
}

function paletteIndexOfHex(hex) {
  var h = normalizeHex(hex);
  return h ? PALETTE_HEX.indexOf(h) : -1;
}

// The color to draw for a pinned hex: the exact palette entry when it is one,
// otherwise the hex itself.
function colorOfHex(hex) {
  var idx = paletteIndexOfHex(hex);
  if (idx >= 0) return PALETTE[idx];
  var h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(1, 3), 16) / 255,
    g: parseInt(h.slice(3, 5), 16) / 255,
    b: parseInt(h.slice(5, 7), 16) / 255
  };
}

// Exactly `count` entries: an uppercase hex for a pinned segment, null for Auto.
// Anything that is not a valid #RRGGBB is dropped back to Auto.
function normalizeSegmentColors(raw, count) {
  var out = [];
  for (var i = 0; i < count; i++) {
    out.push((raw && i < raw.length) ? normalizeHex(raw[i]) : null);
  }
  return out;
}

// OKLab coordinates of any color under every vision model (same layout as
// PALETTE_LAB entries), so off-palette pins take part in distance checks.
function colorLabVariants(c) {
  var lr = srgbChannelToLinear(c.r);
  var lg = srgbChannelToLinear(c.g);
  var lb = srgbChannelToLinear(c.b);
  var variants = [];
  for (var v = 0; v < VISION_MODELS.length; v++) {
    var m = VISION_MODELS[v];
    variants.push(linearRgbToOklab(
      m[0] * lr + m[1] * lg + m[2] * lb,
      m[3] * lr + m[4] * lg + m[5] * lb,
      m[6] * lr + m[7] * lg + m[8] * lb
    ));
  }
  return variants;
}

function labDistance(la, lb) {
  var worst = Infinity;
  for (var v = 0; v < la.length; v++) {
    var dl = la[v][0] - lb[v][0];
    var da = la[v][1] - lb[v][1];
    var db = la[v][2] - lb[v][2];
    var d = Math.sqrt(dl * dl + da * da + db * db) * 100;
    if (d < worst) worst = d;
  }
  return worst;
}

// Series colors with pinned ones in place. Without pins this is exactly
// selectDistinctColors. With pins, every Auto slot gets a color picked by a
// randomized maximin against the pinned + already picked ones: the candidate
// is drawn from those within 85% of the best minimum distance, so regenerating
// still varies the Auto segments while keeping them apart from the pinned ones.
// `avoid` (optional hex list) are colors to stay away from without placing
// them — e.g. the color a segment had before the user asked for a new one.
// Slices touch, so the picked Auto colors are then arranged over the Auto
// slots to keep neighbours (the ring wraps: last touches first) apart.
function resolveSeriesColors(count, segmentColors, avoid) {
  var pinned = normalizeSegmentColors(segmentColors, count);
  var usedLab = [];
  var usedIdx = [];
  var i;
  var addUsed = function (hex) {
    var pi = paletteIndexOfHex(hex);
    if (pi >= 0) usedIdx.push(pi);
    usedLab.push(pi >= 0 ? PALETTE_LAB[pi] : colorLabVariants(colorOfHex(hex)));
  };
  for (i = 0; i < count; i++) {
    if (pinned[i] !== null) addUsed(pinned[i]);
  }
  if (avoid) {
    for (i = 0; i < avoid.length; i++) {
      if (normalizeHex(avoid[i])) addUsed(normalizeHex(avoid[i]));
    }
  }
  if (usedLab.length === 0) return selectDistinctColors(count);

  var available = [];
  for (i = 0; i < PALETTE.length; i++) {
    if (usedIdx.indexOf(i) === -1) available.push(i);
  }
  var picked = [];
  var result = [];
  for (i = 0; i < count; i++) {
    if (pinned[i] !== null) {
      result.push(colorOfHex(pinned[i]));
      continue;
    }
    if (available.length === 0) {
      // More segments than palette colors — reuse, the way selectDistinctColors cycles.
      result.push(PALETTE[picked.length ? picked[i % picked.length] : i % PALETTE.length]);
      continue;
    }
    var scores = [];
    var best = -1;
    for (var j = 0; j < available.length; j++) {
      var minDist = Infinity;
      for (var k = 0; k < usedLab.length; k++) {
        var d = labDistance(PALETTE_LAB[available[j]], usedLab[k]);
        if (d < minDist) minDist = d;
      }
      scores.push(minDist);
      if (minDist > best) best = minDist;
    }
    var candidates = [];
    for (j = 0; j < available.length; j++) {
      if (scores[j] >= best * 0.85) candidates.push(j);
    }
    var pickPos = candidates[Math.floor(Math.random() * candidates.length)];
    var pick = available[pickPos];
    available.splice(pickPos, 1);
    usedLab.push(PALETTE_LAB[pick]);
    picked.push(pick);
    result.push(PALETTE[pick]);
  }
  return arrangeAutoForAdjacency(result, pinned);
}

// Reassigns the Auto colors among the Auto slots so each one sits far from its
// already decided neighbours: the previous slot, and the next one when it is
// pinned (the ring wraps). Pinned slots never move.
function arrangeAutoForAdjacency(colors, pinned) {
  var n = colors.length;
  if (n < 3) return colors;
  var autoSlots = [];
  var pool = [];
  for (var i = 0; i < n; i++) {
    if (pinned[i] === null) { autoSlots.push(i); pool.push(colors[i]); }
  }
  if (pool.length < 2) return colors;
  var out = colors.slice();
  var decided = [];
  for (i = 0; i < n; i++) decided.push(pinned[i] !== null);
  var labOf = function (c) {
    var pi = paletteIndexOfHex(colorToHex(c));
    return pi >= 0 ? PALETTE_LAB[pi] : colorLabVariants(c);
  };
  for (var s = 0; s < autoSlots.length; s++) {
    var slot = autoSlots[s];
    var neighbours = [];
    var prev = (slot - 1 + n) % n;
    var next = (slot + 1) % n;
    if (decided[prev]) neighbours.push(labOf(out[prev]));
    if (decided[next]) neighbours.push(labOf(out[next]));
    var bestPos = 0;
    var bestScore = -1;
    for (var p = 0; p < pool.length; p++) {
      var score = Infinity;
      for (var q = 0; q < neighbours.length; q++) {
        var d = labDistance(labOf(pool[p]), neighbours[q]);
        if (d < score) score = d;
      }
      if (score > bestScore) { bestScore = score; bestPos = p; }
    }
    out[slot] = pool[bestPos];
    pool.splice(bestPos, 1);
    decided[slot] = true;
  }
  return out;
}

var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 500;
var DEFAULT_H = 500;
var CHART_NAME = "Chart Pie";

// ─── Legend constants ───────────────────────────────────────
var LEGEND_DOT_SIZE = 8;
var LEGEND_LINE_TEXT_GAP = 6;
var LEGEND_ITEM_GAP = 12;
var LEGEND_ROW_H = 14;
var LEGEND_ROW_GAP = 2;
var LEGEND_MAX_ROWS_PER_PAGE = 3;
var LEGEND_SIDE_MARGIN = 16;

// Smallest pie diameter we will draw. Ellipse.resize() throws below 0.01,
// so geometry must never fall to zero or go negative on small frames.
var MIN_PIE_SIZE = 8;

// ─── Format slice value (preserves decimals) ───────────────
function formatYValue(v) {
  if (typeof v !== "number" || isNaN(v)) return String(v);
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return parseFloat(v.toFixed(4)).toString();
}

// ─── Selection tracking ─────────────────────────────────────
// The last selected frame itself, not its id: with documentAccess
// "dynamic-page" Figma forbids the synchronous figma.getNodeById, and the
// async lookup would make every render path async. A node reference stays
// valid across selection changes; `removed` tells when it was deleted since.
var lastSelectedFrame = null;

function getSelectedFrame() {
  var sel = figma.currentPage.selection;
  if (sel.length === 1) {
    var n = sel[0];
    if (n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE") return n;
    // A layer inside a chart (a slice, a label, the legend) stands for the
    // chart that holds it — designers often click straight into the chart.
    var p = n.parent;
    while (p && p.type !== "PAGE" && p.type !== "DOCUMENT") {
      if (isChartFrame(p)) return p;
      p = p.parent;
    }
  }
  return null;
}

function getTargetFrame() {
  var f = getSelectedFrame();
  if (f) return f;
  var n = lastSelectedFrame;
  // Check `removed` first: other properties of a deleted node throw in Figma.
  if (n && !n.removed && (n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE")) return n;
  return null;
}

// ─── Chart detection ────────────────────────────────────────
// A chart container: named "Chart Pie", or renamed by the designer but still
// carrying this plugin's chart data.
function isChartFrame(n) {
  if (!n || n.type !== "FRAME") return false;
  if (n.name === CHART_NAME) return true;
  try { return !!n.getPluginData("chartParams"); } catch (e) { return false; }
}

function findChartFrame(frame) {
  if (frame.name === CHART_NAME || isChartFrame(frame)) return frame;
  if (!("children" in frame)) return null;
  // Direct children first (the usual layout), then breadth-first through
  // nested frames, groups and instances — a chart wrapped in a card or an
  // auto-layout section is still the selected frame's chart.
  var queue = [];
  for (var i = 0; i < frame.children.length; i++) {
    var child = frame.children[i];
    if (child.name === CHART_NAME && child.type === "FRAME") return child;
    queue.push(child);
  }
  var hops = 0;
  var MAX_HOPS = 300; // safety cap for huge frames
  while (queue.length > 0 && hops < MAX_HOPS) {
    var node = queue.shift();
    hops++;
    if (isChartFrame(node)) return node;
    if ((node.type === "FRAME" || node.type === "GROUP" || node.type === "COMPONENT" ||
         node.type === "INSTANCE" || node.type === "SECTION") && "children" in node) {
      for (var j = 0; j < node.children.length; j++) queue.push(node.children[j]);
    }
  }
  return null;
}

function readChartParams(chartFrame) {
  var data = chartFrame.getPluginData("chartParams");
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  return readChartParamsFromLayers(chartFrame);
}

function readChartParamsFromLayers(chartFrame) {
  if (!("children" in chartFrame)) return null;
  var children = chartFrame.children;
  var groups = {};
  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === "GROUP") groups[c.name] = c;
  }

  var segmentsCount = 5;
  var pieStyle = "donut";
  var innerRadiusPct = 55;
  var cornerRadius = 0;
  var showLabels = false;
  var showTotal = false;
  var fillOpacity = 1;
  var segmentGap = 1;
  var values = [];

  // A one-segment pie leaves its single slice ungrouped, named "Slices".
  var sliceList = chartSliceNodes(chartFrame);
  if (sliceList.length > 0) {
    var slices = sliceList;
    segmentsCount = slices.length;
    if (segmentsCount < 1) segmentsCount = 5;
    var firstSlice = slices[0];
    if (firstSlice && firstSlice.fills && firstSlice.fills.length > 0) {
      if (firstSlice.fills[0].opacity !== undefined) {
        fillOpacity = Math.round(firstSlice.fills[0].opacity * 100) / 100;
      }
    }
    // Detect pie style from ellipse arcData
    if (firstSlice && firstSlice.type === "ELLIPSE" && firstSlice.arcData) {
      innerRadiusPct = Math.round(firstSlice.arcData.innerRadius * 100);
      pieStyle = (innerRadiusPct > 0) ? "donut" : "pie";
      if (firstSlice.cornerRadius !== undefined && typeof firstSlice.cornerRadius === "number" && firstSlice.cornerRadius > 0) {
        cornerRadius = firstSlice.cornerRadius;
      }
    }

    // Detect segmentGap from the gap between two consecutive slices.
    // Each slice's a1 = startAngle + gapRad/2, a2 = startAngle + sliceAngle - gapRad/2,
    // so slice[i+1].startingAngle - slice[i].endingAngle === gapRad.
    if (slices.length >= 2 && slices[0].arcData && slices[1].arcData) {
      var gapRad = slices[1].arcData.startingAngle - slices[0].arcData.endingAngle;
      if (gapRad > 0 && gapRad < Math.PI) {
        segmentGap = Math.round(gapRad * 180 / Math.PI * 10) / 10;
      }
    }

    // Recover proportional values from slice angles. Original numeric units cannot be
    // restored, but proportions (in degrees) reproduce the same chart on regeneration.
    var gapRadEstimate = segmentGap * Math.PI / 180;
    for (var i = 0; i < slices.length; i++) {
      if (slices[i].arcData) {
        var visibleAngle = slices[i].arcData.endingAngle - slices[i].arcData.startingAngle;
        var fullSliceAngle = visibleAngle + gapRadEstimate;
        var deg = fullSliceAngle * 180 / Math.PI;
        values.push(Math.max(0.1, Math.round(deg * 10) / 10));
      }
    }
  }

  showLabels = !!groups["Labels"];
  showTotal = !!groups["Center Label"];

  if (segmentsCount < 1) return null;

  // Segment colors as drawn, so the picker previews the real ones.
  var colors = [];
  var sliceLayers = chartSliceNodes(chartFrame);
  for (var ci = 0; ci < sliceLayers.length; ci++) colors.push(fillColorOf(sliceLayers[ci]));

  var legend = readLegendFromLayers(groups["Legend"], chartFrame);

  var recovered = {
    values: values,
    segmentsCount: segmentsCount,
    pieStyle: pieStyle,
    innerRadiusPct: innerRadiusPct,
    cornerRadius: cornerRadius,
    segmentGap: segmentGap,
    showLabels: showLabels,
    showTotal: showTotal,
    fillOpacity: fillOpacity,
    showLegend: !!legend,
    legendAlign: legend ? legend.align : "left",
    legendLabels: legend ? legend.labels : []
  };
  if (colors.length > 0 && colors.length === segmentsCount) recovered.colors = colors;
  return recovered;
}

// Page-space bounds. Children of a group are positioned against the nearest
// frame in Figma, so local x/y of legend items and the chart frame are not
// directly comparable — absolute bounds are.
function absBoundsOf(n) {
  var b = n.absoluteBoundingBox;
  if (b) return { x: b.x, y: b.y, w: b.width, h: b.height };
  return { x: n.x, y: n.y, w: n.width, h: n.height };
}

// Legend settings from the "Legend" group: labels in reading order (rows top →
// bottom, items left → right) and the alignment of the first row inside the
// legend band, which spans the chart frame minus LEGEND_SIDE_MARGIN per side.
// Only the first legend page is drawn, so on a paginated legend the later
// labels are unknown — they come back as "Series N". A label cut with "…" is
// read as drawn.
function readLegendFromLayers(legendGroup, chartFrame) {
  if (!legendGroup || !("children" in legendGroup)) return null;
  var kids = legendGroup.children;
  var hasPaginator = false;
  for (var i = 0; i < kids.length; i++) {
    if (kids[i].type === "VECTOR") { hasPaginator = true; break; }
  }
  var items = [];
  var markers = [];
  for (i = 0; i < kids.length; i++) {
    var k = kids[i];
    if (k.type === "ELLIPSE") markers.push(k);
    if (k.type !== "TEXT") continue;
    if (hasPaginator && /^\d+\/\d+$/.test(k.characters)) continue; // "1/3"
    items.push(k);
  }
  if (items.length === 0) return null;
  var ROW_TOLERANCE = 3;
  items.sort(function (a, b) {
    if (Math.abs(a.y - b.y) > ROW_TOLERANCE) return a.y - b.y;
    return a.x - b.x;
  });
  var labels = [];
  for (i = 0; i < items.length; i++) labels.push(items[i].characters);

  var align = "left";
  var frame = absBoundsOf(chartFrame);
  var bandLeft = frame.x + LEGEND_SIDE_MARGIN;
  var bandRight = frame.x + frame.w - LEGEND_SIDE_MARGIN;
  var rowY = absBoundsOf(items[0]).y;
  var rowLeft = Infinity;
  var rowRight = -Infinity;
  for (i = 0; i < items.length; i++) {
    var tb = absBoundsOf(items[i]);
    if (Math.abs(tb.y - rowY) > ROW_TOLERANCE) continue;
    if (tb.x + tb.w > rowRight) rowRight = tb.x + tb.w;
  }
  for (i = 0; i < markers.length; i++) {
    var mb = absBoundsOf(markers[i]);
    // Dots are centred on their row: (row height − dot size) / 2 below the text top.
    if (Math.abs(mb.y - (LEGEND_ROW_H - LEGEND_DOT_SIZE) / 2 - rowY) > ROW_TOLERANCE) continue;
    if (mb.x < rowLeft) rowLeft = mb.x;
  }
  if (rowLeft !== Infinity && rowRight !== -Infinity) {
    if (Math.abs(rowLeft - bandLeft) <= 1.5) align = "left";
    else if (Math.abs(rowRight - bandRight) <= 1.5) align = "right";
    else align = "center";
  }
  return { labels: labels, align: align };
}

// `reason` tells the UI why the update came: "recolor" refreshes the stored
// chart data without resetting the form's button state.
function sendSelection(reason) {
  var f = getSelectedFrame();
  if (f) {
    lastSelectedFrame = f;
    var chartFrame = findChartFrame(f);
    var chartData = chartFrame ? readChartParams(chartFrame) : null;
    var msg = {
      type: "selection", hasFrame: true,
      name: f.name, width: Math.round(f.width), height: Math.round(f.height),
      hasChart: !!chartData, chartData: chartData
    };
    if (reason) msg.reason = reason;
    figma.ui.postMessage(msg);
  }
}

// ─── Live recolor ───────────────────────────────────────────
// A color picked while a chart is selected is applied to that chart at once:
// only the slice fill (its opacity kept) and its legend dot change — values,
// angles, gaps, corners and labels stay as they are, so nothing is
// regenerated. The pin is saved into pluginData, so it survives a later
// regenerate, copy and paste. Value labels and the centre total use fixed
// axis colors, independent of the slice color, so they need no update.
function chartSliceNodes(chartFrame) {
  if (!("children" in chartFrame)) return [];
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name !== "Slices") continue;
    if (c.type === "ELLIPSE") return [c];
    if (c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === "ELLIPSE") out.push(c.children[j]);
      }
      return out;
    }
  }
  return [];
}

// Legend dots in segment order. Only the first legend page is drawn, and it
// always starts at segment 0, so dot k belongs to segment k.
function chartLegendMarkers(chartFrame) {
  if (!("children" in chartFrame)) return [];
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name === "Legend" && c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === "ELLIPSE") out.push(c.children[j]);
      }
      return out;
    }
  }
  return [];
}

function fillColorOf(node) {
  var f = node.fills && node.fills[0];
  return (f && f.color) ? { r: f.color.r, g: f.color.g, b: f.color.b } : PALETTE[0];
}

// Which segments drawSlices actually drew: a segment too thin for its gap is
// skipped, so slice layers and segments only line up through this list.
function drawnSegmentIndices(values, gapDeg) {
  var out = [];
  var total = 0;
  var i;
  for (i = 0; i < values.length; i++) total += values[i];
  if (total === 0) return out;
  var gapRad = (gapDeg || 0) * Math.PI / 180;
  var startAngle = -Math.PI / 2;
  for (i = 0; i < values.length; i++) {
    var sliceAngle = (values[i] / total) * Math.PI * 2;
    if (sliceAngle < 0.001) { startAngle += sliceAngle; continue; }
    var a1 = startAngle + gapRad / 2;
    var a2 = startAngle + sliceAngle - gapRad / 2;
    if (a2 > a1) out.push(i);
    startAngle += sliceAngle;
  }
  return out;
}

// Applies pins to the selected chart: every pinned segment (and its legend
// dot) is repainted, unpinned segments keep the color they have.
// `update(pins, count)` edits the saved pins in place and returns an error
// text to abort. customColors records whether the UI picker is on for this
// chart, so "Get values from chart" and paste can show it the way it was left.
// Returns true when applied, otherwise a short reason for the user.
function applySegmentColorsToSelectedChart(update, customColors) {
  var target = getSelectedFrame();
  if (!target) return "Select the chart to apply the color";
  var chartFrame = findChartFrame(target);
  if (!chartFrame) return "No Pie chart in the selected frame";
  var slices = chartSliceNodes(chartFrame);
  if (!slices.length) return "Could not find the chart slices";
  var params = readChartParams(chartFrame) || {};
  var count = params.segmentsCount || (params.values ? params.values.length : slices.length);

  // Segment index → slice layer (null when the segment was too thin to draw).
  var sliceOf = [];
  var i;
  if (slices.length === count) {
    for (i = 0; i < count; i++) sliceOf.push(slices[i]);
  } else {
    var drawn = params.values ? drawnSegmentIndices(params.values, params.segmentGap) : [];
    if (drawn.length !== slices.length) return "Could not match the slices to the segments";
    for (i = 0; i < count; i++) sliceOf.push(null);
    for (i = 0; i < drawn.length; i++) sliceOf[drawn[i]] = slices[i];
  }

  var markers = chartLegendMarkers(chartFrame);
  var colors = [];
  for (i = 0; i < count; i++) {
    var saved = params.colors && params.colors.length === count ? params.colors[i] : null;
    var fallback = sliceOf[i] ? fillColorOf(sliceOf[i]) : (markers[i] ? fillColorOf(markers[i]) : PALETTE[i % PALETTE.length]);
    colors.push(saved || fallback);
  }
  var pins = normalizeSegmentColors(params.segmentColors, count);
  var problem = update(pins, count);
  if (typeof problem === "string") return problem;

  for (i = 0; i < count; i++) {
    // "Auto" just unpins the segment: it keeps the color it has until regenerated.
    if (pins[i] === null) continue;
    var c = colorOfHex(pins[i]);
    if (colorToHex(colors[i]) !== pins[i]) {
      if (sliceOf[i]) {
        var old = sliceOf[i].fills && sliceOf[i].fills[0];
        var opacity = (old && old.opacity !== undefined) ? old.opacity : 1;
        sliceOf[i].fills = [{ type: "SOLID", color: c, opacity: opacity }];
      }
      if (i < markers.length) markers[i].fills = [{ type: "SOLID", color: c }];
    }
    colors[i] = c;
  }

  params.colors = colors;
  params.segmentColors = pins;
  params.customColors = !!customColors;
  chartFrame.setPluginData("chartParams", JSON.stringify(params));
  sendSelection("recolor");
  return true;
}

// One segment picked in the UI.
function recolorSelectedChart(index, hex) {
  index = parseInt(index);
  return applySegmentColorsToSelectedChart(function (pins, count) {
    if (isNaN(index) || index < 0 || index >= count) {
      return "The chart has only " + count + " segment" + (count === 1 ? "" : "s");
    }
    pins[index] = normalizeHex(hex);
  }, true);
}

// The picker was switched on (rows = the chart's colors, now pinned) or off
// (every segment unpinned, colors left as they are).
function saveSegmentColorsToSelectedChart(segmentColors, customColors) {
  return applySegmentColorsToSelectedChart(function (pins, count) {
    var next = customColors ? normalizeSegmentColors(segmentColors, count) : normalizeSegmentColors([], count);
    for (var i = 0; i < count; i++) pins[i] = next[i];
  }, customColors);
}

// ─── Show UI ────────────────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 100 });
sendSelection();
figma.on("selectionchange", sendSelection);

// ─── Draw pie/donut slices using native Ellipse arcData ─────
function drawSlices(parent, cx, cy, outerR, innerR, values, colors, fillOpacity, cornerRadius, gapDeg) {
  var nodes = [];
  var total = 0;
  for (var i = 0; i < values.length; i++) total += values[i];
  if (total === 0) return nodes;

  var innerRatio = (innerR > 0) ? (innerR / outerR) : 0;
  var gapRad = gapDeg * Math.PI / 180;
  var startAngle = -Math.PI / 2; // start from top (12 o'clock)
  var diameter = outerR * 2;

  for (var i = 0; i < values.length; i++) {
    var sliceAngle = (values[i] / total) * Math.PI * 2;
    if (sliceAngle < 0.001) { startAngle += sliceAngle; continue; }

    var a1 = startAngle + gapRad / 2;
    var a2 = startAngle + sliceAngle - gapRad / 2;
    if (a2 <= a1) { startAngle += sliceAngle; continue; }

    var seg = figma.createEllipse();
    seg.resize(diameter, diameter);
    seg.x = cx - outerR;
    seg.y = cy - outerR;
    seg.arcData = {
      startingAngle: a1,
      endingAngle: a2,
      innerRadius: innerRatio
    };
    seg.fills = [{ type: "SOLID", color: colors[i % colors.length], opacity: fillOpacity }];
    seg.strokes = [];
    if (cornerRadius > 0 && innerRatio > 0) {
      seg.cornerRadius = cornerRadius;
    }
    parent.appendChild(seg);
    nodes.push(seg);

    startAngle += sliceAngle;
  }
  return nodes;
}

// ─── Draw value labels with leader lines ────────────────────
function drawValueLabels(parent, cx, cy, outerR, values, labelOffset) {
  var nodes = [];
  var total = 0;
  for (var i = 0; i < values.length; i++) total += values[i];
  if (total === 0) return nodes;

  var startAngle = -Math.PI / 2;
  var lineLen = labelOffset * 0.4;
  var hLineLen = labelOffset * 0.5;

  for (var i = 0; i < values.length; i++) {
    var sliceAngle = (values[i] / total) * Math.PI * 2;
    var midAngle = startAngle + sliceAngle / 2;

    // Leader line start point (on pie edge)
    var lx1 = cx + outerR * Math.cos(midAngle);
    var ly1 = cy + outerR * Math.sin(midAngle);
    // Leader line elbow point
    var lx2 = cx + (outerR + lineLen) * Math.cos(midAngle);
    var ly2 = cy + (outerR + lineLen) * Math.sin(midAngle);
    // Horizontal direction
    var hDir = (Math.cos(midAngle) >= 0) ? 1 : -1;
    var lx3 = lx2 + hLineLen * hDir;
    var ly3 = ly2;

    // Draw leader line
    var linePath = "M " + lx1 + " " + ly1 + " L " + lx2 + " " + ly2 + " L " + lx3 + " " + ly3;
    var lineVec = figma.createVector();
    lineVec.vectorPaths = [{ windingRule: "NONZERO", data: linePath }];
    lineVec.fills = [];
    lineVec.strokes = [{ type: "SOLID", color: COLOR_AXIS, opacity: 0.3 }];
    lineVec.strokeWeight = 0.5;
    parent.appendChild(lineVec);
    nodes.push(lineVec);

    // Draw value text
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.fontSize = 11;
    t.characters = formatYValue(values[i]);
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    parent.appendChild(t);

    if (hDir > 0) {
      t.x = lx3 + 3;
    } else {
      t.x = lx3 - t.width - 3;
    }
    t.y = ly3 - t.height / 2;
    nodes.push(t);

    startAngle += sliceAngle;
  }
  return nodes;
}

// ─── Legend helpers ─────────────────────────────────────────
function measureLegendItems(labels, maxTextWidth) {
  var texts = [];
  var widths = [];
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i] || " ";
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.fontSize = 11;
    t.characters = label;
    if (t.width <= maxTextWidth) {
      widths.push(t.width);
      texts.push(label);
      t.remove();
      continue;
    }
    var lo = 0, hi = label.length;
    while (lo < hi) {
      var mid = Math.floor((lo + hi + 1) / 2);
      t.characters = label.substring(0, mid) + "…";
      if (t.width <= maxTextWidth) lo = mid;
      else hi = mid - 1;
    }
    var truncated = label.substring(0, lo) + "…";
    t.characters = truncated;
    widths.push(t.width);
    texts.push(truncated);
    t.remove();
  }
  return { texts: texts, widths: widths };
}

function packLegendRows(widths, availableWidth) {
  var rows = [];
  var current = [];
  var currentW = 0;
  for (var i = 0; i < widths.length; i++) {
    var itemW = LEGEND_DOT_SIZE + LEGEND_LINE_TEXT_GAP + widths[i];
    if (current.length === 0) {
      current.push(i);
      currentW = itemW;
    } else {
      var withGap = currentW + LEGEND_ITEM_GAP + itemW;
      if (withGap > availableWidth) {
        rows.push(current);
        current = [i];
        currentW = itemW;
      } else {
        current.push(i);
        currentW = withGap;
      }
    }
  }
  if (current.length > 0) rows.push(current);
  return rows;
}

function drawLegend(parent, legendLeftBound, legendWidth, legendY, labels, colors, rows, widths, page, align) {
  var nodes = [];
  var totalPages = Math.max(1, Math.ceil(rows.length / LEGEND_MAX_ROWS_PER_PAGE));
  var currentPage = Math.max(1, Math.min(page || 1, totalPages));
  var firstRow = (currentPage - 1) * LEGEND_MAX_ROWS_PER_PAGE;
  var lastRow = Math.min(firstRow + LEGEND_MAX_ROWS_PER_PAGE, rows.length);

  for (var ri = firstRow; ri < lastRow; ri++) {
    var rowIdxs = rows[ri];
    var rowTotalW = 0;
    for (var k = 0; k < rowIdxs.length; k++) {
      rowTotalW += LEGEND_DOT_SIZE + LEGEND_LINE_TEXT_GAP + widths[rowIdxs[k]];
      if (k < rowIdxs.length - 1) rowTotalW += LEGEND_ITEM_GAP;
    }
    var rowStartX;
    if (align === "right") {
      rowStartX = legendLeftBound + legendWidth - rowTotalW;
    } else if (align === "center") {
      rowStartX = legendLeftBound + (legendWidth - rowTotalW) / 2;
    } else {
      rowStartX = legendLeftBound;
    }
    var rowY = legendY + (ri - firstRow) * (LEGEND_ROW_H + LEGEND_ROW_GAP);
    var x = rowStartX;

    for (var k = 0; k < rowIdxs.length; k++) {
      var idx = rowIdxs[k];
      var color = colors[idx % colors.length];

      var dot = figma.createEllipse();
      dot.x = x;
      dot.y = rowY + (LEGEND_ROW_H - LEGEND_DOT_SIZE) / 2;
      dot.resize(LEGEND_DOT_SIZE, LEGEND_DOT_SIZE);
      dot.fills = [{ type: "SOLID", color: color }];
      dot.strokes = [];
      parent.appendChild(dot);
      nodes.push(dot);

      var t = figma.createText();
      t.fontName = { family: "Inter", style: "Regular" };
      t.fontSize = 11;
      t.characters = labels[idx];
      t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
      t.x = x + LEGEND_DOT_SIZE + LEGEND_LINE_TEXT_GAP;
      t.y = rowY;
      parent.appendChild(t);
      nodes.push(t);

      x += LEGEND_DOT_SIZE + LEGEND_LINE_TEXT_GAP + widths[idx] + LEGEND_ITEM_GAP;
    }
  }

  if (rows.length > LEGEND_MAX_ROWS_PER_PAGE) {
    var pageY = legendY + (lastRow - firstRow) * (LEGEND_ROW_H + LEGEND_ROW_GAP);
    var paginatorNodes = drawPaginator(parent, legendLeftBound, legendWidth, pageY, currentPage, totalPages, align);
    for (var i = 0; i < paginatorNodes.length; i++) nodes.push(paginatorNodes[i]);
  }
  return nodes;
}

function drawPaginator(parent, legendLeftBound, legendWidth, pageY, page, totalPages, align) {
  var nodes = [];
  var TRI_W = 10;
  var TRI_H = 8;
  var GAP = 4;
  var ACCENT = { r: 0.078, g: 0.176, b: 0.435 };
  var DISABLED = { r: 0.737, g: 0.769, b: 0.812 };

  var t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  t.fontSize = 11;
  t.characters = page + "/" + totalPages;
  t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
  parent.appendChild(t);
  var textW = t.width;
  var totalW = TRI_W + GAP + textW + GAP + TRI_W;

  var startX;
  if (align === "right") {
    startX = legendLeftBound + legendWidth - totalW;
  } else if (align === "center") {
    startX = legendLeftBound + (legendWidth - totalW) / 2;
  } else {
    startX = legendLeftBound;
  }

  var up = figma.createVector();
  up.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 " + TRI_H + " L " + (TRI_W / 2) + " 0 L " + TRI_W + " " + TRI_H + " Z" }];
  up.x = startX;
  up.y = pageY + 3;
  up.fills = [{ type: "SOLID", color: (page > 1) ? ACCENT : DISABLED }];
  up.strokes = [];
  parent.appendChild(up);
  nodes.push(up);

  t.x = startX + TRI_W + GAP;
  t.y = pageY;
  nodes.push(t);

  var down = figma.createVector();
  down.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 0 L " + (TRI_W / 2) + " " + TRI_H + " L " + TRI_W + " 0 Z" }];
  down.x = startX + TRI_W + GAP + textW + GAP;
  down.y = pageY + 3;
  down.fills = [{ type: "SOLID", color: (page < totalPages) ? ACCENT : DISABLED }];
  down.strokes = [];
  parent.appendChild(down);
  nodes.push(down);

  return nodes;
}

// ─── Draw center total text ─────────────────────────────────
function drawCenterTotal(parent, cx, cy, values, innerR) {
  var nodes = [];
  var total = 0;
  for (var i = 0; i < values.length; i++) total += values[i];

  var t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  // Fit the total into the donut hole: 28px overflows the whole chart
  // once the hole is only a few pixels across.
  var fontSize = 28;
  if (innerR > 0) fontSize = Math.max(8, Math.min(28, Math.round(innerR * 0.6)));
  t.fontSize = fontSize;
  t.characters = formatYValue(total);
  t.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
  parent.appendChild(t);
  if (innerR > 0) {
    var maxTextW = innerR * 1.7;
    while (fontSize > 6 && t.width > maxTextW) {
      fontSize -= 1;
      t.fontSize = fontSize;
    }
  }
  t.x = cx - t.width / 2;
  t.y = cy - t.height / 2;
  nodes.push(t);
  return nodes;
}

// ─── Message handler ────────────────────────────────────────
figma.ui.onmessage = async function (msg) {
  if (msg.type === "resize") {
    figma.ui.resize(300, Math.min(msg.height, 900));
    return;
  }
  if (msg.type === "notify") {
    figma.notify(msg.message);
    return;
  }
  if (msg.type === "get-palette") {
    figma.ui.postMessage({ type: "palette", colors: PALETTE_HEX });
    return;
  }
  if (msg.type === "recolor" || msg.type === "save-segment-colors") {
    var outcome;
    try {
      outcome = (msg.type === "recolor")
        ? recolorSelectedChart(msg.index, msg.color)
        : saveSegmentColorsToSelectedChart(msg.segmentColors, !!msg.customColors);
    } catch (e) {
      outcome = "Could not apply the color: " + (e && e.message ? e.message : String(e));
    }
    if (outcome !== true) {
      figma.notify(outcome || "Select the chart to apply the color", { error: true });
      figma.ui.postMessage({ type: "recolor-failed", index: msg.index, message: outcome || "Select the chart to apply the color" });
    }
    return;
  }
  if (msg.type === "suggest-colors") {
    // The picker was switched on: propose concrete colors for its Auto rows,
    // chosen the same way generation would, around the colors already pinned.
    var count = Math.max(1, Math.min(20, parseInt(msg.count) || 1));
    var suggested = resolveSeriesColors(count, msg.segmentColors, msg.avoid);
    var hexes = [];
    for (var si = 0; si < suggested.length; si++) hexes.push(colorToHex(suggested[si]));
    figma.ui.postMessage({ type: "suggested-colors", requestId: msg.requestId, colors: hexes });
    return;
  }
  if (msg.type === "generate") {
    // Surface render failures instead of silently drawing nothing.
    try { await renderChart(msg, null); }
    catch (e) { figma.notify("Chart not drawn: " + (e && e.message ? e.message : String(e)), { error: true }); }
    return;
  }
  if (msg.type === "paste") {
    if (!msg.chartData) return;
    try { await renderChart(msg.chartData, msg.chartData); }
    catch (e) { figma.notify("Chart not drawn: " + (e && e.message ? e.message : String(e)), { error: true }); }
    return;
  }
};

async function renderChart(params, exactData) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  var values = params.values || [];
  var segmentsCount = params.segmentsCount || 5;
  var pieStyle = params.pieStyle || "donut";
  var innerRadiusPct = params.innerRadiusPct || 55;
  var cornerRadius = params.cornerRadius || 0;
  var segmentGap = (params.segmentGap !== undefined) ? params.segmentGap : 1;
  var showLabels = params.showLabels || false;
  var showTotal = params.showTotal || false;
  var fillOpacity = (params.fillOpacity !== undefined) ? params.fillOpacity : 1;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));
  // Paste always replaces a chart inside the target frame (if present),
  // matching the regenerate flow's replace=true semantics.
  var replaceMode = exactData ? true : (params.replace || false);

  // Resolve values:
  //  - exactData: use the source's deterministic values directly
  //  - otherwise: keep existing logic (random fill when empty)
  if (exactData) {
    values = params.values;
  } else if (!values || values.length < 1) {
    values = [];
    for (var i = 0; i < segmentsCount; i++) {
      values.push(Math.round(5 + Math.random() * 195));
    }
  }

  segmentsCount = values.length;

  // Backward compat: if showLegend was not stored, derive from non-empty labels.
  var showLegend = (params.showLegend !== undefined)
    ? !!params.showLegend
    : ((params.legendLabels || []).length > 0);
  var legendAlign = params.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = (params.legendLabels || []).filter(function (s) { return s && String(s).length > 0; });
  if (showLegend) {
    if (legendLabels.length > segmentsCount) {
      legendLabels = legendLabels.slice(0, segmentsCount);
    } else {
      for (var lpi = legendLabels.length; lpi < segmentsCount; lpi++) {
        legendLabels.push("Series " + (lpi + 1));
      }
    }
  } else {
    legendLabels = [];
  }

  var target = getTargetFrame();
  var w, h;
  var container = null;
  var reuseContainer = false;
  var oldX = 0, oldY = 0;
  // A chart nested deeper than a direct child is replaced where it lives:
  // same parent, same layer index, same size.
  var nestedParent = null;
  var nestedIndex = -1;

  if (replaceMode && target) {
    var existingChart = findChartFrame(target);
    if (existingChart) {
      if (existingChart.id === target.id) {
        w = target.width; h = target.height;
        var kids = [];
        for (var ki = 0; ki < target.children.length; ki++) kids.push(target.children[ki]);
        for (var ki = 0; ki < kids.length; ki++) kids[ki].remove();
        container = target;
        reuseContainer = true;
      } else {
        oldX = existingChart.x; oldY = existingChart.y;
        if (existingChart.parent && existingChart.parent.id !== target.id) {
          nestedParent = existingChart.parent;
          nestedIndex = nestedParent.children.indexOf(existingChart);
          w = existingChart.width; h = existingChart.height;
        }
        existingChart.remove();
      }
    }
  }

  if (!container) {
    if (!nestedParent) {
      w = target ? target.width : DEFAULT_W;
      h = target ? target.height : DEFAULT_H;
    }
    container = figma.createFrame();
    container.name = CHART_NAME;
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  // Pre-layout legend so pie geometry accounts for the legend area.
  var legendLeftBound = LEGEND_SIDE_MARGIN;
  var legendWidth = w - LEGEND_SIDE_MARGIN * 2;
  var legendDisplayTexts = [];
  var legendItemWidths = [];
  var legendRows = [];
  var legendBlockH = 0;
  if (legendLabels.length > 0) {
    var maxTextWidth = Math.max(20, legendWidth - LEGEND_DOT_SIZE - LEGEND_LINE_TEXT_GAP);
    var measured = measureLegendItems(legendLabels, maxTextWidth);
    legendDisplayTexts = measured.texts;
    legendItemWidths = measured.widths;
    legendRows = packLegendRows(legendItemWidths, legendWidth);
    var legendVisibleRows = Math.min(legendRows.length, LEGEND_MAX_ROWS_PER_PAGE);
    var legendPaginated = legendRows.length > LEGEND_MAX_ROWS_PER_PAGE;
    legendBlockH = legendVisibleRows * LEGEND_ROW_H + Math.max(0, legendVisibleRows - 1) * LEGEND_ROW_GAP;
    if (legendPaginated) legendBlockH += 4 + 14;
  }
  var legendExtraBottom = (legendBlockH > 0) ? (legendBlockH + 8) : 0;

  // Compute pie geometry — pie fits ABOVE the legend area.
  // Margins must scale with the frame: a fixed 60px label margin makes
  // availableSize negative on short frames (e.g. 233×95), and the negative
  // diameter then throws in Ellipse.resize(), leaving the chart unrendered.
  var pieAreaH = Math.max(MIN_PIE_SIZE, h - legendExtraBottom);
  var baseSize = Math.min(w, pieAreaH);
  var labelMargin = showLabels
    ? Math.min(60, baseSize * 0.3)
    : Math.min(10, baseSize * 0.1);
  var availableSize = Math.max(MIN_PIE_SIZE, baseSize - labelMargin * 2);
  var outerR = availableSize / 2;
  var cx = w / 2;
  var cy = pieAreaH / 2;
  var innerR = (pieStyle === "donut") ? outerR * (innerRadiusPct / 100) : 0;
  var cr = (pieStyle === "donut") ? cornerRadius : 0;

  // Reuse exact colors if provided, else generate distinct ones
  // Pinned colors from the picker; a paste carries them along in exactData.
  var segmentColors = normalizeSegmentColors(params.segmentColors, segmentsCount);
  // Picker state for "Get values from chart": sent by the UI, or for older
  // payloads inferred from whether anything is pinned.
  var customColors = (params.customColors !== undefined)
    ? !!params.customColors
    : segmentColors.some(function (c) { return c !== null; });
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === segmentsCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(segmentsCount, segmentColors);
  }

  // Draw slices
  var sliceNodes = drawSlices(container, cx, cy, outerR, innerR, values, distinctColors, fillOpacity, cr, segmentGap);

  // Group slices
  if (sliceNodes.length > 1) {
    var g = figma.group(sliceNodes, container);
    g.name = "Slices";
  } else if (sliceNodes.length === 1) {
    sliceNodes[0].name = "Slices";
  }

  // Draw labels — leader lines stay inside the reserved label margin
  if (showLabels) {
    var labelNodes = drawValueLabels(container, cx, cy, outerR, values, Math.max(6, labelMargin / 2));
    if (labelNodes.length > 1) {
      var g = figma.group(labelNodes, container);
      g.name = "Labels";
    }
  }

  // Draw center total
  if (showTotal && pieStyle === "donut") {
    var totalNodes = drawCenterTotal(container, cx, cy, values, innerR);
    if (totalNodes.length > 0) {
      var g = figma.group(totalNodes, container);
      g.name = "Center Label";
    }
  }

  // Draw legend
  if (legendLabels.length > 0 && legendRows.length > 0) {
    var legendY = h - legendBlockH - 3;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendDisplayTexts, distinctColors, legendRows, legendItemWidths, 1, legendAlign);
    if (legendNodes.length > 1) {
      var legendGroup = figma.group(legendNodes, container);
      legendGroup.name = "Legend";
    }
  }

  // Persist full chart data so future copy operations can reproduce
  // the chart exactly (same colors).
  var chartParams = {
    values: values,
    segmentsCount: segmentsCount,
    pieStyle: pieStyle,
    innerRadiusPct: innerRadiusPct,
    cornerRadius: cornerRadius,
    segmentGap: segmentGap,
    showLabels: showLabels,
    showTotal: showTotal,
    fillOpacity: fillOpacity,
    showLegend: showLegend,
    legendAlign: legendAlign,
    legendLabels: legendLabels,
    colors: distinctColors,
    segmentColors: segmentColors,
    customColors: customColors
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));

  // Insert
  if (reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (nestedParent) {
    nestedParent.insertChild(Math.max(0, Math.min(nestedIndex, nestedParent.children.length)), container);
    container.x = oldX; container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (replaceMode && target) {
    target.appendChild(container);
    container.x = oldX; container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (target) {
    target.appendChild(container);
    container.x = 0; container.y = 0;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? 'Exact copy pasted to "' + target.name + '"' : 'Chart added to "' + target.name + '"');
  } else {
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify(exactData ? "Exact copy pasted!" : "Pie chart created!");
  }

  sendSelection();
}

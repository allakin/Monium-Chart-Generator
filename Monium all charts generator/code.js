"use strict";

// ═══════════════════════════════════════════════════════════════
// Monium All Charts Generator — Unified Plugin
// Combines: Chart Line, Chart Bar, Chart Area, Chart Pie
// ═══════════════════════════════════════════════════════════════

// ─── Shared: Palette (68 colors) ───────────────────────────────
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

// ─── Shared: User-pinned series colors (color picker) ──────────
// The UI color picker offers the generation palette. A pinned color travels as
// a "#RRGGBB" string; palette hexes are derived from the palette entries
// themselves, so hex → palette lookup is an exact round trip. A valid hex that
// is not in the palette (a chart from an older palette) stays pinned as is.
// null means "Auto": the series gets a generated color that stays distinct
// from every pinned one. Pins live in chartParams under the same field names as
// in the standalone plugins (PINS_KEY), next to `customColors` (picker on/off).
var PINS_KEY = { line: "lineColors", area: "areaColors", bar: "barColors", pie: "segmentColors" };

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

// Exactly `count` entries: an uppercase hex for a pinned series, null for Auto.
// Anything that is not a valid #RRGGBB is dropped back to Auto.
function normalizeSeriesColors(raw, count) {
  var out = [];
  for (var i = 0; i < count; i++) {
    out.push((raw && i < raw.length) ? normalizeHex(raw[i]) : null);
  }
  return out;
}

// Picker state for "Get values from chart": sent by the UI, or for older
// payloads inferred from whether anything is pinned.
function resolveCustomColors(msg, pins) {
  if (msg.customColors !== undefined) return !!msg.customColors;
  return pins.some(function (c) { return c !== null; });
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

// Series colors with pinned ones in place. Without pins (and nothing to avoid)
// this is exactly selectDistinctColors. With pins, every Auto slot gets a color
// picked by a randomized maximin against the pinned + already picked ones: the
// candidate is drawn from those within 85% of the best minimum distance, so
// regenerating still varies the Auto series while keeping them apart from the
// pinned ones. `avoid` (optional hex list) are colors to stay away from without
// placing them — e.g. the color a series had before the user asked for a new
// one. `ring` (Pie): slices touch, so the picked Auto colors are then arranged
// over the Auto slots to keep neighbours (last touches first) apart.
function resolveSeriesColors(count, pins, avoid, ring) {
  var pinned = normalizeSeriesColors(pins, count);
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
      // More series than palette colors — reuse, the way selectDistinctColors cycles.
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
  return ring ? arrangeAutoForAdjacency(result, pinned) : result;
}

// Pie only: reassigns the Auto colors among the Auto slots so each one sits far
// from its already decided neighbours: the previous slot, and the next one when
// it is pinned (the ring wraps). Pinned slots never move.
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

// ─── Shared: Constants ─────────────────────────────────────────
var COLOR_GRID = { r: 0.898, g: 0.898, b: 0.898 };
var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 600;
var DEFAULT_H = 400;
var PAD_TOP = 10;
var PAD_RIGHT = 2;
var PAD_BOTTOM = 21;
var PAD_GAP = 8;

// All chart container names for detection
var CHART_NAMES = ["Chart Line", "Chart Bar", "Chart Area", "Chart Pie"];

// ─── Shared: Legend constants ──────────────────────────────────
var LEGEND_LINE_W = 14;        // Line chart only
var LEGEND_LINE_H = 2;         // Line chart only
var LEGEND_DOT_SIZE = 8;       // Area/Bar/Pie
var LEGEND_LINE_TEXT_GAP = 6;
var LEGEND_ITEM_GAP = 12;
var LEGEND_ROW_H = 14;
var LEGEND_ROW_GAP = 2;
var LEGEND_MAX_ROWS_PER_PAGE = 3;
var LEGEND_SIDE_MARGIN = 16;   // Pie only

// Smallest pie diameter we will draw. Ellipse.resize() throws below 0.01,
// so geometry must never fall to zero or go negative on small frames.
var MIN_PIE_SIZE = 8;

// ─── Shared: Selection tracking ────────────────────────────────
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
    // A layer inside a chart (a line, a bar, a label, the legend) stands for
    // the chart that holds it — designers often click straight into the chart.
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

// ─── Shared: Chart detection (unified for all types) ───────────
// A chart container: named after a chart type, or renamed by the designer but
// still carrying chart data.
function isChartFrame(n) {
  if (!n || n.type !== "FRAME") return false;
  if (CHART_NAMES.indexOf(n.name) !== -1) return true;
  try { return !!n.getPluginData("chartParams"); } catch (e) { return false; }
}

function findChartFrame(frame) {
  // Frame itself matches
  if (CHART_NAMES.indexOf(frame.name) !== -1 || isChartFrame(frame)) return frame;
  // BFS through descendants (FRAME / COMPONENT / INSTANCE / GROUP / SECTION) so
  // charts wrapped in autolayout, cards or nested containers are still found.
  if ("children" in frame) {
    var queue = [];
    for (var qi = 0; qi < frame.children.length; qi++) queue.push(frame.children[qi]);
    var hops = 0;
    var MAX_HOPS = 300; // safety cap
    while (queue.length > 0 && hops < MAX_HOPS) {
      var node = queue.shift();
      hops++;
      if (isChartFrame(node)) return node;
      if ((node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE" ||
           node.type === "GROUP" || node.type === "SECTION") && "children" in node) {
        for (var qj = 0; qj < node.children.length; qj++) queue.push(node.children[qj]);
      }
    }
  }
  return null;
}

// Chart type by container name; a renamed chart is typed by its stored params
// (each type has its own count field), then by its data layer.
function detectChartType(chartFrame) {
  if (chartFrame.name === "Chart Line") return "line";
  if (chartFrame.name === "Chart Bar") return "bar";
  if (chartFrame.name === "Chart Area") return "area";
  if (chartFrame.name === "Chart Pie") return "pie";
  var raw = "";
  try { raw = chartFrame.getPluginData("chartParams"); } catch (e) {}
  if (raw) {
    try {
      var p = JSON.parse(raw);
      if (p.chartType && PINS_KEY[p.chartType]) return p.chartType;
      if (p.linesCount !== undefined) return "line";
      if (p.areasCount !== undefined) return "area";
      if (p.barsCount !== undefined) return "bar";
      if (p.segmentsCount !== undefined || p.pieStyle !== undefined) return "pie";
    } catch (e) {}
  }
  if ("children" in chartFrame) {
    for (var i = 0; i < chartFrame.children.length; i++) {
      var n = chartFrame.children[i].name;
      if (n === "Lines") return "line";
      if (n === "Areas") return "area";
      if (n === "Bars") return "bar";
      if (n === "Slices") return "pie";
    }
  }
  return null;
}

// ─── Shared: Read chart params (delegates by type) ─────────────
function readChartParams(chartFrame) {
  var data = chartFrame.getPluginData("chartParams");
  if (data) {
    try {
      var parsed = JSON.parse(data);
      parsed.chartType = detectChartType(chartFrame);
      return parsed;
    } catch (e) {}
  }
  return readChartParamsFromLayers(chartFrame);
}

// ─── Shared: Y axis label parsing ──────────────────────────────
// A Y axis entry is arbitrary text: a plain number ("14"), a number with a
// unit ("150ms", "12%"), or a clock time ("15:30", "1:02:30"). The numeric
// part only positions the label on the axis — the text itself is drawn as
// typed, so nothing gets truncated.
function parseAxisLabel(str) {
  var s = String(str === undefined || str === null ? "" : str).trim();
  var prefix = s.match(/^[^\d+\-]*/)[0];
  var rest = s.slice(prefix.length);

  var time = rest.match(/^(-?)(\d{1,4}):([0-5]?\d)(?::([0-5]?\d))?/);
  if (time) {
    var t = parseFloat(time[2]) + parseFloat(time[3]) / 60 + (time[4] ? parseFloat(time[4]) / 3600 : 0);
    return { value: time[1] === "-" ? -t : t, unit: rest.slice(time[0].length) };
  }
  var num = rest.match(/^[-+]?\d+(?:[.,]\d+)?/);
  if (!num) return { value: NaN, unit: "" };
  return { value: parseFloat(num[0].replace(",", ".")), unit: rest.slice(num[0].length) };
}

// Turns raw Y label texts (bottom → top order) into positions, a shared unit
// and, when the texts aren't plain numbers, the labels to draw verbatim.
function parseYLabelTexts(chars) {
  var i;
  var yUnit = chars.length > 0 ? (parseAxisLabel(chars[0]).unit || "") : "";
  // A trailing unit only counts when every label carries it.
  if (yUnit) {
    for (i = 0; i < chars.length; i++) {
      if (chars[i].slice(-yUnit.length) !== yUnit) { yUnit = ""; break; }
    }
  }

  // Purely textual labels (a horizontal bar chart's category axis) carry no
  // position, so they are skipped — the caller treats that as "not an axis".
  var labels = [];
  var values = [];
  for (i = 0; i < chars.length; i++) {
    var text = yUnit ? chars[i].slice(0, chars[i].length - yUnit.length) : chars[i];
    var value = parseAxisLabel(text).value;
    if (isNaN(value)) continue;
    labels.push(text);
    values.push(value);
  }

  var custom = false;
  for (i = 0; i < labels.length; i++) {
    if (labels[i] !== formatYValue(values[i])) { custom = true; break; }
  }
  return { yValues: values, yUnit: yUnit, yLabels: custom ? labels : null };
}

// ─── Shared: Read axis labels from groups ──────────────────────
function readYLabelsFromGroup(group) {
  var yTexts = [];
  for (var i = 0; i < group.children.length; i++) {
    if (group.children[i].type === "TEXT" && group.children[i].characters.length > 0) yTexts.push(group.children[i]);
  }
  yTexts.sort(function (a, b) { return b.y - a.y; });
  var chars = [];
  for (var i = 0; i < yTexts.length; i++) chars.push(yTexts[i].characters);
  return parseYLabelTexts(chars);
}

function readXLabelsFromGroup(group) {
  var xTexts = [];
  for (var i = 0; i < group.children.length; i++) {
    if (group.children[i].type === "TEXT") xTexts.push(group.children[i]);
  }
  xTexts.sort(function (a, b) { return a.x - b.x; });
  var xLabels = [];
  for (var i = 0; i < xTexts.length; i++) xLabels.push(xTexts[i].characters);
  return xLabels;
}

// ─── Shared: Fallback axis parser from flat children ───────────
function readAxisFromFlatChildren(texts, frameH) {
  var yLabelTexts = [];
  var xLabelTexts = [];
  for (var i = 0; i < texts.length; i++) {
    if (texts[i].y > frameH - PAD_BOTTOM - 5) xLabelTexts.push(texts[i]);
    else yLabelTexts.push(texts[i]);
  }
  xLabelTexts.sort(function (a, b) { return a.x - b.x; });
  yLabelTexts.sort(function (a, b) { return b.y - a.y; });

  var xLabels = [];
  for (var i = 0; i < xLabelTexts.length; i++) xLabels.push(xLabelTexts[i].characters);

  var yChars = [];
  for (var i = 0; i < yLabelTexts.length; i++) {
    if (yLabelTexts[i].characters.length > 0) yChars.push(yLabelTexts[i].characters);
  }
  var parsedY = parseYLabelTexts(yChars);
  return { yValues: parsedY.yValues, yUnit: parsedY.yUnit, yLabels: parsedY.yLabels, xLabels: xLabels };
}

// ─── Shared: Detect events from rect children ─────────────────
function detectEventsFromRects(rects) {
  var topEvent = false;
  var bottomEvent = false;
  for (var i = 0; i < rects.length; i++) {
    if (Math.abs(rects[i].height - 6) < 1) {
      if (rects[i].y < PAD_TOP) topEvent = true;
      else bottomEvent = true;
    }
  }
  return { topEvent: topEvent, bottomEvent: bottomEvent };
}

// ─── Shared: Detect curve style from vector path ───────────────
function detectCurveStyle(vectorNode, xLabelsCount) {
  try {
    var pathData = vectorNode.vectorPaths[0].data;
    if (pathData.indexOf("C") === -1) {
      var lCount = (pathData.match(/ L /g) || []).length;
      if (xLabelsCount > 0 && lCount > xLabelsCount * 3) return "peak";
      return "sharp";
    }
    return "smooth";
  } catch (e) {
    return "smooth";
  }
}

// ─── Shared: Series layers of a drawn chart ────────────────────
// The data layer of each type: "Lines" (VECTOR strokes), "Areas" (VECTOR
// fills), "Bars" (RECTANGLE fills), "Slices" (ELLIPSE arcs). groupNodes leaves
// a single node ungrouped under the same name, so both shapes are handled.
var SERIES_LAYER = {
  line: { name: "Lines", type: "VECTOR" },
  area: { name: "Areas", type: "VECTOR" },
  bar: { name: "Bars", type: "RECTANGLE" },
  pie: { name: "Slices", type: "ELLIPSE" }
};

function chartSeriesNodes(chartFrame, chartType) {
  var spec = SERIES_LAYER[chartType];
  if (!spec || !("children" in chartFrame)) return [];
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name !== spec.name) continue;
    if (c.type === spec.type) return [c];
    if (c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === spec.type) out.push(c.children[j]);
      }
      return out;
    }
  }
  return [];
}

// Legend markers in series order: 14×2 rectangles for Line, dots for the rest.
// Only the first legend page is drawn, and it always starts at series 0, so
// marker k belongs to series k.
function chartLegendMarkers(chartFrame, chartType) {
  if (!("children" in chartFrame)) return [];
  var markerType = (chartType === "line") ? "RECTANGLE" : "ELLIPSE";
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name === "Legend" && c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === markerType) out.push(c.children[j]);
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

function strokeColorOf(node) {
  var s = node.strokes && node.strokes[0];
  return (s && s.color) ? { r: s.color.r, g: s.color.g, b: s.color.b } : PALETTE[0];
}

// The series color as drawn: the stroke of a line, the fill of the rest.
function seriesColorOf(node, chartType) {
  return chartType === "line" ? strokeColorOf(node) : fillColorOf(node);
}

// Bar: the series each bar belongs to. drawBars walks category by category
// and, inside a category, series by series — in every mode, orientation and
// with dense on — so bar k belongs to series k % count when the bar count fits;
// otherwise (layers edited by hand) bars are matched by fill color.
function seriesOfBars(rects, count, colors) {
  var out = [];
  var i;
  if (rects.length % count === 0) {
    for (i = 0; i < rects.length; i++) out.push(i % count);
    return out;
  }
  for (i = 0; i < rects.length; i++) {
    var hex = colorToHex(fillColorOf(rects[i]));
    var found = -1;
    for (var s = 0; s < count; s++) {
      if (colorToHex(colors[s]) === hex) { found = s; break; }
    }
    out.push(found);
  }
  return out;
}

// Pie: which segments drawSlices actually drew — a segment too thin for its
// gap is skipped, so slice layers and segments only line up through this list.
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

// ─── Shared: Legend recovery from layers ───────────────────────
// Page-space bounds. Children of a group are positioned against the nearest
// frame in Figma, so local x/y of legend items and grid lines are not directly
// comparable — absolute bounds are.
function absBoundsOf(n) {
  var b = n.absoluteBoundingBox;
  if (b) return { x: b.x, y: b.y, w: b.width, h: b.height };
  return { x: n.x, y: n.y, w: n.width, h: n.height };
}

// The band the legend is aligned in: the plot for axis charts (the "Grid"
// group starts 6px left of the plot and ends at its right edge, in both bar
// orientations), the frame minus LEGEND_SIDE_MARGIN per side for Pie.
function legendBandOf(chartFrame, chartType, groups) {
  if (chartType === "pie") {
    var f = absBoundsOf(chartFrame);
    return { left: f.x + LEGEND_SIDE_MARGIN, right: f.x + f.w - LEGEND_SIDE_MARGIN };
  }
  if (!groups["Grid"]) return null;
  var g = absBoundsOf(groups["Grid"]);
  return { left: g.x + 6, right: g.x + g.w };
}

// Legend settings from the "Legend" group: labels in reading order (rows top →
// bottom, items left → right) and the alignment of the first row in its band.
// Markers are 14×2 rectangles 6px below the row top (Line) or dots centred on
// the row (Area / Bar / Pie). Only the first legend page is drawn, so on a
// paginated legend the later labels are unknown — they come back as
// "Series N". A label cut with "…" is read as drawn.
function readLegendFromLayers(legendGroup, band) {
  if (!legendGroup || !("children" in legendGroup)) return null;
  var kids = legendGroup.children;
  var hasPaginator = false;
  for (var i = 0; i < kids.length; i++) {
    if (kids[i].type === "VECTOR") { hasPaginator = true; break; }
  }
  var items = [];
  var markers = [];
  var markerOffset = 6;
  for (i = 0; i < kids.length; i++) {
    var k = kids[i];
    if (k.type === "RECTANGLE") { markers.push(k); markerOffset = 6; }
    if (k.type === "ELLIPSE") { markers.push(k); markerOffset = (LEGEND_ROW_H - LEGEND_DOT_SIZE) / 2; }
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
  if (band) {
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
      if (Math.abs(mb.y - markerOffset - rowY) > ROW_TOLERANCE) continue;
      if (mb.x < rowLeft) rowLeft = mb.x;
    }
    if (rowLeft !== Infinity && rowRight !== -Infinity) {
      if (Math.abs(rowLeft - band.left) <= 1.5) align = "left";
      else if (Math.abs(rowRight - band.right) <= 1.5) align = "right";
      else align = "center";
    }
  }
  return { labels: labels, align: align };
}

// Adds what the layers tell about the legend and the series colors to a
// recovered params object (fallback parser, charts without readable pluginData
// — e.g. drawn by a standalone plugin: pluginData is per plugin id in Figma).
function addLegendAndColorsFromLayers(result, chartFrame, chartType, groups, count) {
  var legend = readLegendFromLayers(groups["Legend"], legendBandOf(chartFrame, chartType, groups));
  result.showLegend = !!legend;
  result.legendAlign = legend ? legend.align : "left";
  result.legendLabels = legend ? legend.labels : [];
  var nodes = chartSeriesNodes(chartFrame, chartType);
  if (nodes.length >= count && count > 0) {
    // Bars carry one color per series in their first `count` rectangles.
    var colors = [];
    for (var i = 0; i < count; i++) colors.push(seriesColorOf(nodes[i], chartType));
    if (chartType !== "bar" && nodes.length !== count) return result;
    result.colors = colors;
  }
  return result;
}

// ─── Fallback layer parser — delegated by chart type ───────────
function readChartParamsFromLayers(chartFrame) {
  var chartType = detectChartType(chartFrame);
  if (!chartType) return null;
  if (chartType === "pie") return readPieParamsFromLayers(chartFrame);
  return readAxisChartParamsFromLayers(chartFrame, chartType);
}

// Bar: numeric ticks and category names from the label groups. Vertical charts
// keep the ticks in "Y Labels" (bottom → top) and categories in "X Labels"
// (left → right); horizontal charts swap them: ticks in "X Labels" (left →
// right), categories in "Y Labels" (top → bottom).
function readBarAxisGroups(groups, orientation) {
  var valueGroup = groups[orientation === "vertical" ? "Y Labels" : "X Labels"];
  var categoryGroup = groups[orientation === "vertical" ? "X Labels" : "Y Labels"];
  var out = { yValues: [], yUnit: "", yLabels: null, xLabels: [] };
  if (valueGroup && "children" in valueGroup) {
    var vTexts = [];
    for (var i = 0; i < valueGroup.children.length; i++) {
      var vc = valueGroup.children[i];
      if (vc.type === "TEXT" && vc.characters.length > 0) vTexts.push(vc);
    }
    if (orientation === "vertical") vTexts.sort(function (a, b) { return b.y - a.y; });
    else vTexts.sort(function (a, b) { return a.x - b.x; });
    var chars = [];
    for (var i = 0; i < vTexts.length; i++) chars.push(vTexts[i].characters);
    var parsed = parseYLabelTexts(chars);
    out.yValues = parsed.yValues;
    out.yUnit = parsed.yUnit;
    out.yLabels = parsed.yLabels;
  }
  if (categoryGroup && "children" in categoryGroup) {
    var cTexts = [];
    for (var i = 0; i < categoryGroup.children.length; i++) {
      if (categoryGroup.children[i].type === "TEXT") cTexts.push(categoryGroup.children[i]);
    }
    if (orientation === "vertical") cTexts.sort(function (a, b) { return a.x - b.x; });
    else cTexts.sort(function (a, b) { return a.y - b.y; });
    for (var i = 0; i < cTexts.length; i++) out.xLabels.push(cTexts[i].characters);
  }
  return out;
}

function readAxisChartParamsFromLayers(chartFrame, chartType) {
  if (!("children" in chartFrame)) return null;
  var children = chartFrame.children;
  var texts = [];
  var vectors = [];
  var rects = [];
  var groups = {};

  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === "GROUP") groups[c.name] = c;
    else if (c.type === "TEXT") texts.push(c);
    else if (c.type === "VECTOR") vectors.push(c);
    else if (c.type === "RECTANGLE") rects.push(c);
  }

  var yValues = [];
  var yUnit = "";
  var yLabels = null;
  var xLabels = [];
  var topEvent = !!groups["Top Events"];
  var bottomEvent = !!groups["Bottom Events"];

  if (groups["Y Labels"] && "children" in groups["Y Labels"]) {
    var parsed = readYLabelsFromGroup(groups["Y Labels"]);
    yValues = parsed.yValues;
    yUnit = parsed.yUnit;
    yLabels = parsed.yLabels;
  }
  if (groups["X Labels"] && "children" in groups["X Labels"]) {
    xLabels = readXLabelsFromGroup(groups["X Labels"]);
  }

  // Chart-type-specific data reading
  var result = { yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels, topEvent: topEvent, bottomEvent: bottomEvent, chartType: chartType };

  if (chartType === "line") {
    result.linesCount = 1;
    result.lineStyle = "smooth";
    var lineLayers = chartSeriesNodes(chartFrame, "line");
    if (lineLayers.length === 1 && !groups["Lines"]) {
      result.lineStyle = detectCurveStyle(lineLayers[0], xLabels.length);
    }
    if (groups["Lines"] && "children" in groups["Lines"]) {
      result.linesCount = groups["Lines"].children.length;
      if (result.linesCount < 1) result.linesCount = 1;
      var firstVec = groups["Lines"].children[0];
      if (firstVec && firstVec.type === "VECTOR") {
        result.lineStyle = detectCurveStyle(firstVec, xLabels.length);
      }
    }
  } else if (chartType === "area") {
    result.areasCount = 1;
    result.areaStyle = "smooth";
    result.areaMode = "overlap";
    result.fillHeight = false;
    result.fillOpacity = 0.3;
    if (groups["Areas"] && "children" in groups["Areas"]) {
      var areaChildren = groups["Areas"].children;
      result.areasCount = areaChildren.length;
      if (result.areasCount < 1) result.areasCount = 1;
      var firstVec = areaChildren[0];
      if (firstVec && firstVec.type === "VECTOR") {
        result.areaStyle = detectCurveStyle(firstVec, xLabels.length);
        if (firstVec.fills && firstVec.fills.length > 0 && firstVec.fills[0].opacity !== undefined) {
          result.fillOpacity = firstVec.fills[0].opacity;
        }
      }
      // Detect areaMode: in overlap, all areas reach baseline; in stacked, area[1] sits on top of area[0]
      if (areaChildren.length > 1) {
        var area0Bottom = areaChildren[0].y + areaChildren[0].height;
        var area1Bottom = areaChildren[1].y + areaChildren[1].height;
        if (area0Bottom - area1Bottom > 3) result.areaMode = "stacked";
      }
      // Detect fillHeight: in stacked mode, the topmost area reaches near the plot top
      if (result.areaMode === "stacked") {
        var topArea = areaChildren[areaChildren.length - 1];
        var groupOffsetY = (groups["Areas"].y !== undefined) ? groups["Areas"].y : 0;
        var topInChartFrame = groupOffsetY + topArea.y;
        var plotH = chartFrame.height - PAD_TOP - PAD_BOTTOM;
        if (topInChartFrame <= PAD_TOP + plotH * 0.15) result.fillHeight = true;
      }
    }
  } else if (chartType === "bar") {
    result.barsCount = 1;
    result.orientation = "vertical";
    result.barMode = "normal";
    result.dense = false;
    result.barGap = 1;
    result.fillOpacity = 1;
    var barRects = chartSeriesNodes(chartFrame, "bar");
    if (barRects.length > 0) {
      if (barRects.length > 0 && barRects[0].fills && barRects[0].fills.length > 0) {
        if (barRects[0].fills[0].opacity !== undefined) result.fillOpacity = barRects[0].fills[0].opacity;
      }

      if (barRects.length > 0) {
        // Detect orientation: vertical bars share a baseline; horizontal bars share a left edge.
        var maxBottom = -Infinity, minLeft = Infinity;
        for (var bi = 0; bi < barRects.length; bi++) {
          var bb = barRects[bi].y + barRects[bi].height;
          if (bb > maxBottom) maxBottom = bb;
          if (barRects[bi].x < minLeft) minLeft = barRects[bi].x;
        }
        var atBottomCount = 0, atLeftCount = 0;
        for (var bi = 0; bi < barRects.length; bi++) {
          if (Math.abs((barRects[bi].y + barRects[bi].height) - maxBottom) < 2) atBottomCount++;
          if (Math.abs(barRects[bi].x - minLeft) < 2) atLeftCount++;
        }
        result.orientation = (atBottomCount >= atLeftCount) ? "vertical" : "horizontal";

        // The orientation decides which label group holds the numeric ticks:
        // vertical → "Y Labels", horizontal → "X Labels" (categories swap too).
        var axes = readBarAxisGroups(groups, result.orientation);
        if (axes.yValues.length < 2) {
          // Ambiguous bar layout (e.g. a single bar): trust the labels instead.
          var flippedOrientation = (result.orientation === "vertical") ? "horizontal" : "vertical";
          var flipped = readBarAxisGroups(groups, flippedOrientation);
          if (flipped.yValues.length >= 2) { axes = flipped; result.orientation = flippedOrientation; }
        }
        if (axes.yValues.length >= 2 || result.orientation === "horizontal") {
          yValues = axes.yValues; yUnit = axes.yUnit; yLabels = axes.yLabels; xLabels = axes.xLabels;
          result.yValues = yValues; result.yUnit = yUnit; result.yLabels = yLabels; result.xLabels = xLabels;
        }

        // Cluster bars by primary-axis position. Bars at the same position = stacked together.
        var posKey = (result.orientation === "vertical") ? "x" : "y";
        var sortedBars = barRects.slice().sort(function (a, b) { return a[posKey] - b[posKey]; });
        var clusters = [];
        for (var bi = 0; bi < sortedBars.length; bi++) {
          var pos = sortedBars[bi][posKey];
          if (clusters.length === 0 || (pos - clusters[clusters.length - 1].pos) > 1) {
            clusters.push({ pos: pos, count: 1 });
          } else {
            clusters[clusters.length - 1].count++;
          }
        }
        var distinctPositions = clusters.length;
        var nBars = barRects.length;
        var barsPerPosition = nBars / distinctPositions;
        var nCats = xLabels.length || 1;

        if (barsPerPosition >= 1.8) {
          result.barMode = "stacked";
          result.barsCount = Math.round(barsPerPosition);
          result.dense = (distinctPositions > nCats * 1.5);
        } else {
          var ratio = nBars / nCats;
          if (ratio <= 1.5) {
            result.barMode = "normal";
            result.barsCount = 1;
            result.dense = false;
          } else if (ratio >= 8 && ratio <= 12) {
            result.barMode = "normal";
            result.barsCount = 1;
            result.dense = true;
          } else {
            result.barMode = "grouped";
            result.barsCount = Math.max(2, Math.round(ratio));
            result.dense = false;
          }
        }
      }
    }
  }

  // Fallback: flat children
  if (yValues.length < 2 && texts.length > 0) {
    var fallback = readAxisFromFlatChildren(texts, chartFrame.height);
    yValues = fallback.yValues;
    yUnit = fallback.yUnit;
    yLabels = fallback.yLabels;
    xLabels = fallback.xLabels;
    result.yValues = yValues;
    result.yUnit = yUnit;
    result.yLabels = yLabels;
    result.xLabels = xLabels;

    var events = detectEventsFromRects(rects);
    result.topEvent = result.topEvent || events.topEvent;
    result.bottomEvent = result.bottomEvent || events.bottomEvent;

    if (chartType === "line") {
      result.linesCount = vectors.length;
      if (result.linesCount < 1) result.linesCount = 2;
      if (vectors.length > 0) result.lineStyle = detectCurveStyle(vectors[0], xLabels.length);
    } else if (chartType === "area") {
      result.areasCount = vectors.length;
      if (result.areasCount < 1) result.areasCount = 2;
      if (vectors.length > 0) {
        result.areaStyle = detectCurveStyle(vectors[0], xLabels.length);
        if (vectors[0].fills && vectors[0].fills.length > 0 && vectors[0].fills[0].opacity !== undefined) {
          result.fillOpacity = vectors[0].fills[0].opacity;
        }
      }
    }
  }

  if (yValues.length < 2) return null;

  var seriesCount = (chartType === "line") ? result.linesCount
    : (chartType === "area") ? result.areasCount : result.barsCount;
  addLegendAndColorsFromLayers(result, chartFrame, chartType, groups, seriesCount);

  // Sort bottom → top, keeping each label attached to its own value.
  var pairs = [];
  for (var pi = 0; pi < result.yValues.length; pi++) {
    pairs.push({ v: result.yValues[pi], l: result.yLabels ? result.yLabels[pi] : null });
  }
  pairs.sort(function (a, b) { return a.v - b.v; });
  for (var pi = 0; pi < pairs.length; pi++) {
    result.yValues[pi] = pairs[pi].v;
    if (result.yLabels) result.yLabels[pi] = pairs[pi].l;
  }
  return result;
}

function readPieParamsFromLayers(chartFrame) {
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
  var sliceList = chartSeriesNodes(chartFrame, "pie");
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
    if (firstSlice && firstSlice.type === "ELLIPSE" && firstSlice.arcData) {
      innerRadiusPct = Math.round(firstSlice.arcData.innerRadius * 100);
      pieStyle = (innerRadiusPct > 0) ? "donut" : "pie";
      if (firstSlice.cornerRadius !== undefined && typeof firstSlice.cornerRadius === "number" && firstSlice.cornerRadius > 0) {
        cornerRadius = firstSlice.cornerRadius;
      }
    }

    // Detect segmentGap from the gap between two consecutive slices.
    // By construction (a1 = startAngle + gapRad/2; a2 = startAngle + sliceAngle - gapRad/2),
    // slice[i+1].startingAngle - slice[i].endingAngle === gapRad.
    if (slices.length >= 2 && slices[0].arcData && slices[1].arcData) {
      var gapRad = slices[1].arcData.startingAngle - slices[0].arcData.endingAngle;
      if (gapRad > 0 && gapRad < Math.PI) {
        segmentGap = Math.round(gapRad * 180 / Math.PI * 10) / 10;
      }
    }

    // Recover proportional values from slice angles (in degrees, sum ≈ 360).
    // Original numeric units cannot be restored without pluginData, but proportions are exact.
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

  var recovered = {
    chartType: "pie",
    values: values,
    segmentsCount: segmentsCount,
    pieStyle: pieStyle,
    innerRadiusPct: innerRadiusPct,
    cornerRadius: cornerRadius,
    segmentGap: segmentGap,
    showLabels: showLabels,
    showTotal: showTotal,
    fillOpacity: fillOpacity
  };
  return addLegendAndColorsFromLayers(recovered, chartFrame, "pie", groups, segmentsCount);
}

// ─── Shared: Selection notification ────────────────────────────
// `reason` tells the UI why the update came: "recolor" refreshes the stored
// chart data without resetting the tab or the form's button state.
function sendSelection(reason) {
  var f = getSelectedFrame();
  if (f) {
    lastSelectedFrame = f;
    var chartFrame = findChartFrame(f);
    var chartData = chartFrame ? readChartParams(chartFrame) : null;
    var msg = {
      type: "selection",
      hasFrame: true,
      name: f.name,
      width: Math.round(f.width),
      height: Math.round(f.height),
      hasChart: !!chartData,
      chartData: chartData
    };
    if (reason) msg.reason = reason;
    figma.ui.postMessage(msg);
  }
}

// ─── Shared: Live recolor of the selected chart ────────────────
// A color picked while a chart is selected is applied to that chart at once:
// only the series paint (line stroke; area / bar / slice fill with its opacity
// kept) and its legend marker change — data, stacking, angles, events and
// layout stay as they are, nothing is regenerated. The area outline is a
// neutral stroke, not the series color, so it is left alone. The pin is saved
// into pluginData, so it survives a later regenerate, copy and paste.

// Series index → the layers painted in that series' color.
function seriesPaintTargets(chartFrame, chartType, params, count) {
  var nodes = chartSeriesNodes(chartFrame, chartType);
  var targets = [];
  var i;
  for (i = 0; i < count; i++) targets.push([]);
  if (chartType === "bar") {
    var colors = [];
    for (i = 0; i < count; i++) {
      var saved = params.colors && params.colors.length === count ? params.colors[i] : null;
      colors.push(saved || (nodes[i] ? fillColorOf(nodes[i]) : PALETTE[0]));
    }
    var owner = seriesOfBars(nodes, count, colors);
    for (i = 0; i < nodes.length; i++) if (owner[i] >= 0) targets[owner[i]].push(nodes[i]);
    return targets;
  }
  if (chartType === "pie" && nodes.length !== count) {
    var drawn = params.values ? drawnSegmentIndices(params.values, params.segmentGap) : [];
    if (drawn.length !== nodes.length) return null;
    for (i = 0; i < drawn.length; i++) targets[drawn[i]].push(nodes[i]);
    return targets;
  }
  for (i = 0; i < count && i < nodes.length; i++) targets[i].push(nodes[i]);
  return targets;
}

// How many series the selected chart actually draws.
function drawnSeriesCount(chartFrame, chartType, params) {
  var nodes = chartSeriesNodes(chartFrame, chartType);
  if (chartType === "bar") {
    var count = (params.colors && params.colors.length) ? params.colors.length
      : (params.barMode === "normal" ? 1 : (parseInt(params.barsCount) || 1));
    return Math.max(1, Math.min(count, nodes.length));
  }
  if (chartType === "pie") return params.segmentsCount || (params.values ? params.values.length : nodes.length);
  return nodes.length;
}

var SERIES_WORD = { line: "line", area: "area", bar: "series", pie: "segment" };
var CHART_TITLE = { line: "Line", area: "Area", bar: "Bar", pie: "Pie" };

// Applies pins to the selected chart: every pinned series (its layers and its
// legend marker) is repainted, unpinned series keep the color they have.
// `update(pins, count)` edits the saved pins in place and returns an error text
// to abort. customColors records whether the UI picker is on for this chart,
// so "Get values from chart" and paste can show it the way it was left.
// `expectedType` (from the UI tab) guards against repainting a chart of
// another type. Returns true when applied, otherwise a short reason.
function applyColorsToSelectedChart(update, customColors, expectedType) {
  var target = getSelectedFrame();
  if (!target) return "Select the chart to apply the color";
  var chartFrame = findChartFrame(target);
  if (!chartFrame) return "No " + (expectedType ? CHART_TITLE[expectedType] + " " : "") + "chart in the selected frame";
  var chartType = detectChartType(chartFrame);
  if (!chartType) return "No chart in the selected frame";
  if (expectedType && expectedType !== chartType) {
    return "The selected chart is a " + CHART_TITLE[chartType] + " chart";
  }
  var nodes = chartSeriesNodes(chartFrame, chartType);
  if (!nodes.length) return "Could not find the chart " + (chartType === "pie" ? "slices" : chartType + "s");
  var params = readChartParams(chartFrame) || {};
  var count = drawnSeriesCount(chartFrame, chartType, params);
  var targets = seriesPaintTargets(chartFrame, chartType, params, count);
  if (!targets) return "Could not match the slices to the segments";

  var markers = chartLegendMarkers(chartFrame, chartType);
  var colors = [];
  var i;
  for (i = 0; i < count; i++) {
    var saved = params.colors && params.colors.length === count ? params.colors[i] : null;
    var fallback = targets[i].length ? seriesColorOf(targets[i][0], chartType)
      : (markers[i] ? fillColorOf(markers[i]) : PALETTE[i % PALETTE.length]);
    colors.push(saved || fallback);
  }
  var pinsKey = PINS_KEY[chartType];
  var pins = normalizeSeriesColors(params[pinsKey], count);
  var problem = update(pins, count, chartType);
  if (typeof problem === "string") return problem;

  for (i = 0; i < count; i++) {
    // "Auto" just unpins the series: it keeps the color it has until regenerated.
    if (pins[i] === null) continue;
    var c = colorOfHex(pins[i]);
    if (colorToHex(colors[i]) !== pins[i]) {
      for (var t = 0; t < targets[i].length; t++) {
        var node = targets[i][t];
        if (chartType === "line") {
          node.strokes = [{ type: "SOLID", color: c }];
        } else {
          var old = node.fills && node.fills[0];
          var opacity = (old && old.opacity !== undefined) ? old.opacity : 1;
          node.fills = [{ type: "SOLID", color: c, opacity: opacity }];
        }
      }
      for (var m = 0; m < markers.length; m++) {
        // Older normal-mode bar charts drew one dot per requested series.
        if (m === i || (chartType === "bar" && m % count === i)) markers[m].fills = [{ type: "SOLID", color: c }];
      }
    }
    colors[i] = c;
  }

  params.colors = colors;
  params[pinsKey] = pins;
  params.customColors = !!customColors;
  chartFrame.setPluginData("chartParams", JSON.stringify(params));
  sendSelection("recolor");
  return true;
}

// One series picked in the UI.
function recolorSelectedChart(index, hex, expectedType) {
  index = parseInt(index);
  return applyColorsToSelectedChart(function (pins, count, chartType) {
    if (isNaN(index) || index < 0 || index >= count) {
      var word = SERIES_WORD[chartType];
      return "The chart has only " + count + " " + word + (count === 1 || word === "series" ? "" : "s");
    }
    pins[index] = normalizeHex(hex);
  }, true, expectedType);
}

// The picker was switched on (rows = the chart's colors, now pinned) or off
// (every series unpinned, colors left as they are).
function saveColorsToSelectedChart(seriesColors, customColors, expectedType) {
  return applyColorsToSelectedChart(function (pins, count) {
    var next = customColors ? normalizeSeriesColors(seriesColors, count) : normalizeSeriesColors([], count);
    for (var i = 0; i < count; i++) pins[i] = next[i];
  }, customColors, expectedType);
}

// ─── Shared: Container creation / replacement ──────────────────
// Always removes existing chart from target frame (regardless of type or replaceMode).
// This ensures switching chart types replaces the old chart instead of stacking on top.
function prepareContainer(chartName, replaceMode, defaultW, defaultH) {
  var target = getTargetFrame();
  var w, h;
  var container = null;
  var reuseContainer = false;
  var replacedChild = false;
  var oldX = 0, oldY = 0;
  var nestedParent = null;
  var nestedIndex = -1;

  if (target) {
    var existingChart = findChartFrame(target);
    if (existingChart) {
      if (existingChart.id === target.id) {
        // Selected frame IS the chart — clear children, reuse frame
        w = target.width; h = target.height;
        var kids = [];
        for (var ki = 0; ki < target.children.length; ki++) kids.push(target.children[ki]);
        for (var ki = 0; ki < kids.length; ki++) kids[ki].remove();
        container = target;
        container.name = chartName;
        reuseContainer = true;
      } else {
        // Chart is a descendant — remove it, position new one in its place.
        // A chart nested deeper than a direct child is replaced where it
        // lives: same parent, same layer index, same size.
        w = target.width; h = target.height;
        oldX = existingChart.x; oldY = existingChart.y;
        if (existingChart.parent && existingChart.parent.id !== target.id) {
          nestedParent = existingChart.parent;
          nestedIndex = nestedParent.children.indexOf(existingChart);
          w = existingChart.width; h = existingChart.height;
        }
        existingChart.remove();
        replacedChild = true;
      }
    }
  }

  if (!container) {
    if (!nestedParent) {
      w = target ? target.width : defaultW;
      h = target ? target.height : defaultH;
    }
    container = figma.createFrame();
    container.name = chartName;
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  return { container: container, target: target, w: w, h: h, reuseContainer: reuseContainer, replacedChild: replacedChild, oldX: oldX, oldY: oldY, nestedParent: nestedParent, nestedIndex: nestedIndex };
}

// ─── Shared: Insert container and notify ───────────────────────
function insertAndNotify(ctx, chartTypeName) {
  if (ctx.reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([ctx.container]);
    figma.notify("Chart regenerated!");
  } else if (ctx.replacedChild && ctx.target && ctx.nestedParent) {
    var np = ctx.nestedParent;
    np.insertChild(Math.max(0, Math.min(ctx.nestedIndex, np.children.length)), ctx.container);
    ctx.container.x = ctx.oldX; ctx.container.y = ctx.oldY;
    figma.viewport.scrollAndZoomIntoView([ctx.target]);
    figma.notify("Chart regenerated!");
  } else if (ctx.replacedChild && ctx.target) {
    ctx.target.appendChild(ctx.container);
    ctx.container.x = ctx.oldX; ctx.container.y = ctx.oldY;
    figma.viewport.scrollAndZoomIntoView([ctx.target]);
    figma.notify("Chart regenerated!");
  } else if (ctx.target) {
    ctx.target.appendChild(ctx.container);
    ctx.container.x = 0; ctx.container.y = 0;
    figma.viewport.scrollAndZoomIntoView([ctx.target]);
    figma.notify('Chart added to "' + ctx.target.name + '"');
  } else {
    figma.currentPage.appendChild(ctx.container);
    figma.viewport.scrollAndZoomIntoView([ctx.container]);
    figma.notify(chartTypeName + " chart created!");
  }
  sendSelection();
}

// ─── Shared: Group nodes helper ────────────────────────────────
function groupNodes(nodes, container, name) {
  if (nodes.length > 1) {
    var g = figma.group(nodes, container);
    g.name = name;
  } else if (nodes.length === 1) {
    nodes[0].name = name;
    container.appendChild(nodes[0]);
  }
}

// ─── Shared: Measure Y label width ────────────────────────────
// ─── Shared: format Y axis value (preserves decimals) ─────────
function formatYValue(v) {
  if (typeof v !== "number" || isNaN(v)) return String(v);
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return parseFloat(v.toFixed(4)).toString();
}

// Text drawn for each Y tick: the label as typed when it isn't a plain
// number (time, currency, category), otherwise the formatted value.
function resolveYLabels(yLabels, yValues) {
  var usable = yLabels && yLabels.length === yValues.length;
  var out = [];
  for (var i = 0; i < yValues.length; i++) {
    var raw = usable && yLabels[i] !== undefined && yLabels[i] !== null ? String(yLabels[i]) : "";
    out.push(raw.length > 0 ? raw : formatYValue(yValues[i]));
  }
  return out;
}

function measureMaxLabelWidth(labels, suffix) {
  var maxW = 0;
  for (var mi = 0; mi < labels.length; mi++) {
    var measure = figma.createText();
    measure.fontName = { family: "Inter", style: "Regular" };
    measure.fontSize = 11;
    measure.characters = formatYValue(labels[mi]) + (suffix || "");
    if (measure.width > maxW) maxW = measure.width;
    measure.remove();
  }
  return maxW;
}

function measureMaxTextWidth(texts) {
  var maxW = 0;
  for (var mi = 0; mi < texts.length; mi++) {
    var measure = figma.createText();
    measure.fontName = { family: "Inter", style: "Regular" };
    measure.fontSize = 11;
    measure.characters = texts[mi];
    if (measure.width > maxW) maxW = measure.width;
    measure.remove();
  }
  return maxW;
}

// ─── Shared: Event bar colors ──────────────────────────────────
var TOP_EVENT_COLORS = [
  { r: 0.506, g: 0.780, b: 0.518 }, { r: 0.302, g: 0.686, b: 0.290 },
  { r: 0.698, g: 0.875, b: 0.541 }, { r: 0.180, g: 0.545, b: 0.341 },
  { r: 0.565, g: 0.933, b: 0.565 },
];
var BOTTOM_EVENT_COLORS = [
  { r: 1.000, g: 0.200, b: 0.200 }, { r: 1.000, g: 0.400, b: 0.400 },
  { r: 1.000, g: 0.600, b: 0.600 }, { r: 0.690, g: 0.718, b: 0.773 },
  { r: 0.800, g: 0.820, b: 0.860 }, { r: 0.478, g: 0.529, b: 0.612 },
];
var EVENT_BAR_HEIGHT = 6;

// ─── Shared: Build event segments (normalized 0..1) ───────────
// Segments use x and w as fractions of plot width (0..1) so the layout
// is identical when re-rendered into a differently-sized frame.
function buildEventSegments(position) {
  var segments = [];
  var segMinW = 0.02;
  var segMaxW = 0.08;
  var gapMinW = 0.005;
  var gapMaxW = 0.04;
  var palette = (position === "top") ? TOP_EVENT_COLORS : BOTTOM_EVENT_COLORS;

  var x = 0;
  while (x < 1) {
    var gap = gapMinW + Math.random() * (gapMaxW - gapMinW);
    x += gap;
    if (x >= 1) break;

    var segW = segMinW + Math.random() * (segMaxW - segMinW);
    if (x + segW > 1) segW = 1 - x;
    if (segW < 0.001) break;

    var color = palette[Math.floor(Math.random() * palette.length)];
    var opacity = 0.4 + Math.random() * 0.6;
    segments.push({ x: x, w: segW, color: color, opacity: opacity });
    x += segW;
  }
  return segments;
}

// ─── Shared: Draw event segments (fractions → pixels) ─────────
function drawEventSegments(parent, p, position, segments) {
  var y = (position === "top") ? p.y - EVENT_BAR_HEIGHT - 2 : p.y + p.h + 1;
  var nodes = [];
  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    var rect = figma.createRectangle();
    rect.x = p.x + s.x * p.w;
    rect.y = y;
    rect.resize(s.w * p.w, EVENT_BAR_HEIGHT);
    rect.fills = [{ type: "SOLID", color: s.color, opacity: s.opacity }];
    parent.appendChild(rect);
    nodes.push(rect);
  }
  return nodes;
}

// ─── Shared: Draw events helper ────────────────────────────────
function drawEvents(container, plot, topEvent, bottomEvent, topSegments, bottomSegments) {
  if (topEvent) {
    var segs = topSegments || buildEventSegments("top");
    var evNodes = drawEventSegments(container, plot, "top", segs);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Top Events"; }
  }
  if (bottomEvent) {
    var segs = bottomSegments || buildEventSegments("bottom");
    var evNodes = drawEventSegments(container, plot, "bottom", segs);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Bottom Events"; }
  }
}

// ─── Shared: Grid drawing (Line/Area style) ────────────────────
function drawGridStandard(parent, p, yValues, xLabels) {
  var nodes = [];
  var overshoot = 6;
  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h;
    var line = figma.createLine();
    line.x = p.x - overshoot; line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
    nodes.push(line);
  }

  var gap = p.w / (xLabels.length - 1 || 1);
  for (var j = 0; j < xLabels.length; j++) {
    var x = p.x + gap * j;
    var vline = figma.createLine();
    vline.resize(p.h, 0); vline.rotation = -90;
    vline.x = x; vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
    nodes.push(vline);
  }
  return nodes;
}

// ─── Shared: Y axis labels (standard) ─────────────────────────
function drawYLabelsStandard(parent, p, yValues, yMin, yMax, yUnit, yLabels) {
  var nodes = [];
  var rightEdge = p.x - 8;
  var suffix = yUnit || "";
  var labels = resolveYLabels(yLabels, yValues);
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h - 7;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = labels[i] + suffix;
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    t.y = y; parent.appendChild(t);
    t.x = rightEdge - t.width;
    nodes.push(t);
  }
  return nodes;
}

// ─── Shared: X axis labels (standard — Line/Area) ─────────────
function drawXLabelsStandard(parent, p, xLabels) {
  var nodes = [];
  var gap = p.w / (xLabels.length - 1 || 1);
  var ly = p.y + p.h + 6;
  for (var j = 0; j < xLabels.length; j++) {
    var cx = p.x + gap * j;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = xLabels[j];
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    t.y = ly; parent.appendChild(t);
    if (j === 0) t.x = cx;
    else if (j === xLabels.length - 1) t.x = cx - t.width;
    else t.x = cx - t.width / 2;
    nodes.push(t);
  }
  return nodes;
}

// ─── Shared: Monotone cubic bezier path builder ────────────────
// Uses Fritsch-Carlson constraint to prevent overshoots: smooth curves stay
// within the data range between points (no "wobbles" with noisy series).
function buildCurvePath(points, style, p) {
  var pathData = "M " + points[0].x + " " + points[0].y;
  if (style === "smooth" && points.length > 2) {
    var n = points.length;
    var slopes = [];
    for (var i = 0; i < n - 1; i++) {
      var sdx = points[i + 1].x - points[i].x;
      slopes.push((points[i + 1].y - points[i].y) / (sdx || 1));
    }
    var tangents = [];
    tangents.push(slopes[0]);
    for (var i = 1; i < n - 1; i++) {
      if (slopes[i - 1] * slopes[i] <= 0) tangents.push(0);
      else tangents.push((slopes[i - 1] + slopes[i]) / 2);
    }
    tangents.push(slopes[n - 2]);
    for (var i = 0; i < n - 1; i++) {
      if (slopes[i] === 0) {
        tangents[i] = 0;
        tangents[i + 1] = 0;
      } else {
        var a = tangents[i] / slopes[i];
        var b = tangents[i + 1] / slopes[i];
        var h2 = a * a + b * b;
        if (h2 > 9) {
          var t = 3 / Math.sqrt(h2);
          tangents[i] = t * a * slopes[i];
          tangents[i + 1] = t * b * slopes[i];
        }
      }
    }
    for (var i = 0; i < n - 1; i++) {
      var dx = (points[i + 1].x - points[i].x) / 3;
      var cp1y = Math.max(p.y, Math.min(p.y + p.h, points[i].y + tangents[i] * dx));
      var cp2y = Math.max(p.y, Math.min(p.y + p.h, points[i + 1].y - tangents[i + 1] * dx));
      pathData += " C " + (points[i].x + dx) + " " + cp1y + " " + (points[i + 1].x - dx) + " " + cp2y + " " + points[i + 1].x + " " + points[i + 1].y;
    }
  } else {
    for (var i = 1; i < points.length; i++) pathData += " L " + points[i].x + " " + points[i].y;
  }
  return pathData;
}

// Returns { forward: "M ... C ...", reverse: " L ... C ..." }
// forward = top curve path (left to right, starts with M)
// reverse = exact mathematical reverse (right to left, continuation, no M)
function buildCurvePathBidirectional(points, style, p) {
  var forward = "M " + points[0].x + " " + points[0].y;
  var revSegments = [];

  if (style === "smooth" && points.length > 2) {
    var n = points.length;
    var slopes = [];
    for (var i = 0; i < n - 1; i++) {
      var sdx = points[i + 1].x - points[i].x;
      slopes.push((points[i + 1].y - points[i].y) / (sdx || 1));
    }
    var tangents = [];
    tangents.push(slopes[0]);
    for (var i = 1; i < n - 1; i++) {
      if (slopes[i - 1] * slopes[i] <= 0) tangents.push(0);
      else tangents.push((slopes[i - 1] + slopes[i]) / 2);
    }
    tangents.push(slopes[n - 2]);
    // Fritsch-Carlson constraint: prevents overshoots so the curve stays within the data range
    for (var i = 0; i < n - 1; i++) {
      if (slopes[i] === 0) {
        tangents[i] = 0;
        tangents[i + 1] = 0;
      } else {
        var a = tangents[i] / slopes[i];
        var b = tangents[i + 1] / slopes[i];
        var h2 = a * a + b * b;
        if (h2 > 9) {
          var t = 3 / Math.sqrt(h2);
          tangents[i] = t * a * slopes[i];
          tangents[i + 1] = t * b * slopes[i];
        }
      }
    }
    for (var i = 0; i < n - 1; i++) {
      var dx = (points[i + 1].x - points[i].x) / 3;
      var cp1x = points[i].x + dx;
      var cp1y = Math.max(p.y, Math.min(p.y + p.h, points[i].y + tangents[i] * dx));
      var cp2x = points[i + 1].x - dx;
      var cp2y = Math.max(p.y, Math.min(p.y + p.h, points[i + 1].y - tangents[i + 1] * dx));
      forward += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + points[i + 1].x + " " + points[i + 1].y;
      revSegments.push(" C " + cp2x + " " + cp2y + " " + cp1x + " " + cp1y + " " + points[i].x + " " + points[i].y);
    }
  } else {
    for (var i = 1; i < points.length; i++) {
      forward += " L " + points[i].x + " " + points[i].y;
      revSegments.push(" L " + points[i - 1].x + " " + points[i - 1].y);
    }
  }

  var lastPt = points[points.length - 1];
  var reverse = " L " + lastPt.x + " " + lastPt.y;
  for (var i = revSegments.length - 1; i >= 0; i--) {
    reverse += revSegments[i];
  }

  return { forward: forward, reverse: reverse };
}

// ─── Shared: Legend helpers ────────────────────────────────────
// Measures legend labels, truncating with ellipsis when a label exceeds maxTextWidth.
// Inter font must already be loaded. Returns { texts, widths }.
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

// Greedy pack legend items into rows within available width.
// markerWidth is LEGEND_LINE_W for Line, LEGEND_DOT_SIZE for others.
function packLegendRows(widths, availableWidth, markerWidth) {
  var rows = [];
  var current = [];
  var currentW = 0;
  for (var i = 0; i < widths.length; i++) {
    var itemW = markerWidth + LEGEND_LINE_TEXT_GAP + widths[i];
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

// Generic legend drawer. useDot=true → circle marker (Area/Bar/Pie); false → rect (Line).
function drawLegend(parent, legendLeftBound, legendWidth, legendY, labels, colors, rows, widths, page, align, useDot) {
  var nodes = [];
  var markerW = useDot ? LEGEND_DOT_SIZE : LEGEND_LINE_W;
  var totalPages = Math.max(1, Math.ceil(rows.length / LEGEND_MAX_ROWS_PER_PAGE));
  var currentPage = Math.max(1, Math.min(page || 1, totalPages));
  var firstRow = (currentPage - 1) * LEGEND_MAX_ROWS_PER_PAGE;
  var lastRow = Math.min(firstRow + LEGEND_MAX_ROWS_PER_PAGE, rows.length);

  for (var ri = firstRow; ri < lastRow; ri++) {
    var rowIdxs = rows[ri];
    var rowTotalW = 0;
    for (var k = 0; k < rowIdxs.length; k++) {
      rowTotalW += markerW + LEGEND_LINE_TEXT_GAP + widths[rowIdxs[k]];
      if (k < rowIdxs.length - 1) rowTotalW += LEGEND_ITEM_GAP;
    }
    var rowStartX;
    if (align === "right") rowStartX = legendLeftBound + legendWidth - rowTotalW;
    else if (align === "center") rowStartX = legendLeftBound + (legendWidth - rowTotalW) / 2;
    else rowStartX = legendLeftBound;

    var rowY = legendY + (ri - firstRow) * (LEGEND_ROW_H + LEGEND_ROW_GAP);
    var x = rowStartX;

    for (var k = 0; k < rowIdxs.length; k++) {
      var idx = rowIdxs[k];
      var color = colors[idx % colors.length];

      if (useDot) {
        var dot = figma.createEllipse();
        dot.x = x;
        dot.y = rowY + (LEGEND_ROW_H - LEGEND_DOT_SIZE) / 2;
        dot.resize(LEGEND_DOT_SIZE, LEGEND_DOT_SIZE);
        dot.fills = [{ type: "SOLID", color: color }];
        dot.strokes = [];
        parent.appendChild(dot);
        nodes.push(dot);
      } else {
        var rect = figma.createRectangle();
        rect.x = x;
        rect.y = rowY + 6;
        rect.resize(LEGEND_LINE_W, LEGEND_LINE_H);
        rect.cornerRadius = 1;
        rect.fills = [{ type: "SOLID", color: color }];
        parent.appendChild(rect);
        nodes.push(rect);
      }

      var t = figma.createText();
      t.fontName = { family: "Inter", style: "Regular" };
      t.fontSize = 11;
      t.characters = labels[idx];
      t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
      t.x = x + markerW + LEGEND_LINE_TEXT_GAP;
      t.y = rowY;
      parent.appendChild(t);
      nodes.push(t);

      x += markerW + LEGEND_LINE_TEXT_GAP + widths[idx] + LEGEND_ITEM_GAP;
    }
  }

  if (rows.length > LEGEND_MAX_ROWS_PER_PAGE) {
    var pageY = legendY + (lastRow - firstRow) * (LEGEND_ROW_H + LEGEND_ROW_GAP);
    var paginatorNodes = drawPaginator(parent, legendLeftBound, legendWidth, pageY, currentPage, totalPages, align);
    for (var pi2 = 0; pi2 < paginatorNodes.length; pi2++) nodes.push(paginatorNodes[pi2]);
  }
  return nodes;
}

function drawPaginator(parent, legendLeftBound, legendWidth, pageY, page, totalPages, align) {
  var nodes = [];
  var TRI_W = 10;
  var TRI_H = 8;
  var GAP = 4;
  var ACCENT = { r: 0.078, g: 0.176, b: 0.435 };   // dark navy #14306F
  var DISABLED = { r: 0.737, g: 0.769, b: 0.812 }; // light gray #BCC4CF

  var t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  t.fontSize = 11;
  t.characters = page + "/" + totalPages;
  t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
  parent.appendChild(t);
  var textW = t.width;
  var totalW = TRI_W + GAP + textW + GAP + TRI_W;

  var startX;
  if (align === "right") startX = legendLeftBound + legendWidth - totalW;
  else if (align === "center") startX = legendLeftBound + (legendWidth - totalW) / 2;
  else startX = legendLeftBound;

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

// Normalize legend labels to count: filter empty, pad with "Series N", truncate.
function normalizeLegendLabels(rawLabels, count) {
  var labels = (rawLabels || []).filter(function (s) { return s && String(s).length > 0; });
  if (labels.length > count) labels = labels.slice(0, count);
  else for (var i = labels.length; i < count; i++) labels.push("Series " + (i + 1));
  return labels;
}

// Pre-layout legend → returns { displayTexts, widths, rows, blockH, extraBottom }
function preLayoutLegend(legendLabels, legendWidth, useDot) {
  var out = { displayTexts: [], widths: [], rows: [], blockH: 0, extraBottom: 0 };
  if (!legendLabels || legendLabels.length === 0) return out;
  var markerW = useDot ? LEGEND_DOT_SIZE : LEGEND_LINE_W;
  var maxTextWidth = Math.max(20, legendWidth - markerW - LEGEND_LINE_TEXT_GAP);
  var measured = measureLegendItems(legendLabels, maxTextWidth);
  out.displayTexts = measured.texts;
  out.widths = measured.widths;
  out.rows = packLegendRows(measured.widths, legendWidth, markerW);
  var visibleRows = Math.min(out.rows.length, LEGEND_MAX_ROWS_PER_PAGE);
  var paginated = out.rows.length > LEGEND_MAX_ROWS_PER_PAGE;
  out.blockH = visibleRows * LEGEND_ROW_H + Math.max(0, visibleRows - 1) * LEGEND_ROW_GAP;
  if (paginated) out.blockH += 4 + 14;
  out.extraBottom = (out.blockH > 0) ? (out.blockH + 8) : 0;
  return out;
}

// ═══════════════════════════════════════════════════════════════
//  CHART LINE — Generator
// ═══════════════════════════════════════════════════════════════

function drawLines(parent, p, allSeries, yMin, yMax, lineStyle, colors) {
  var nodes = [];
  var range = yMax - yMin;
  if (range === 0) range = 100;

  for (var li = 0; li < allSeries.length; li++) {
    var vals = allSeries[li];
    var color = colors[li % colors.length];
    var count = vals.length;
    var gap = p.w / (count - 1 || 1);

    var points = [];
    for (var pi = 0; pi < count; pi++) {
      var x = p.x + gap * pi;
      var ratio = (vals[pi] - yMin) / range;
      var y = p.y + p.h - ratio * p.h;
      points.push({ x: x, y: y });
    }

    var pathData = buildCurvePath(points, lineStyle, p);

    var vec = figma.createVector();
    vec.vectorPaths = [{ windingRule: "NONZERO", data: pathData }];
    vec.fills = [];
    vec.strokes = [{ type: "SOLID", color: color }];
    vec.strokeWeight = 2;
    vec.strokeCap = "NONE";
    vec.strokeJoin = "ROUND";
    parent.appendChild(vec);
    nodes.push(vec);
  }
  return nodes;
}

function generateLineChart(msg, exactData) {
  var yValues = msg.yValues;
  var xLabels = msg.xLabels;
  var linesCount = msg.linesCount;
  var lineStyle = msg.lineStyle || "smooth";
  var yUnit = msg.yUnit || "";
  var topEvent = msg.topEvent || false;
  var bottomEvent = msg.bottomEvent || false;
  var replaceMode = exactData ? true : (msg.replace || false);

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!linesCount || linesCount < 1) linesCount = 2;
  if (linesCount > 20) linesCount = 20;
  var yLabels = resolveYLabels(msg.yLabels, yValues);

  // Legend params
  var showLegend = (msg.showLegend !== undefined) ? !!msg.showLegend : ((msg.legendLabels || []).length > 0);
  var legendAlign = msg.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = showLegend ? normalizeLegendLabels(msg.legendLabels, linesCount) : [];

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Line", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var pointCount = xLabels.length;
  var peakMultiplier = (lineStyle === "peak") ? 10 : 1;
  var dataPointCount = (pointCount - 1) * peakMultiplier + 1;

  var allSeries;
  if (exactData && exactData.allSeries && exactData.allSeries.length === linesCount) {
    allSeries = exactData.allSeries;
  } else {
    allSeries = [];
    for (var li = 0; li < linesCount; li++) {
      var vals = [];
      if (lineStyle === "peak") {
        var baseLevel = yMin + (yMax - yMin) * 0.05;
        for (var pi = 0; pi < dataPointCount; pi++) {
          var spike = Math.random() < 0.15;
          if (spike) vals.push(yMin + Math.random() * (yMax - yMin));
          else vals.push(baseLevel + Math.random() * (yMax - yMin) * 0.1);
        }
      } else {
        for (var pi = 0; pi < pointCount; pi++) vals.push(yMin + Math.random() * (yMax - yMin));
      }
      allSeries.push(vals);
    }
  }

  // Pinned colors from the picker; a paste carries them along in exactData.
  var seriesPins = normalizeSeriesColors(msg.lineColors, linesCount);
  var customColors = resolveCustomColors(msg, seriesPins);
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === linesCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(linesCount, seriesPins, null, false);
  }

  var topEventSegments = topEvent
    ? ((exactData && exactData.topEventSegments) ? exactData.topEventSegments : buildEventSegments("top"))
    : null;
  var bottomEventSegments = bottomEvent
    ? ((exactData && exactData.bottomEventSegments) ? exactData.bottomEventSegments : buildEventSegments("bottom"))
    : null;

  var padLeft = measureMaxLabelWidth(yLabels, yUnit) + PAD_GAP + 2;

  // Pre-layout legend (Line uses rect marker → useDot=false)
  var legendLeftBound = padLeft;
  var legendWidth = w - padLeft - PAD_RIGHT;
  var legendLayout = preLayoutLegend(legendLabels, legendWidth, false);

  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM - legendLayout.extraBottom };

  var gridNodes = drawGridStandard(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit, yLabels);
  var xLabelNodes = drawXLabelsStandard(container, plot, xLabels);
  var lineNodes = drawLines(container, plot, allSeries, yMin, yMax, lineStyle, distinctColors);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(lineNodes, container, "Lines");
  drawEvents(container, plot, topEvent, bottomEvent, topEventSegments, bottomEventSegments);

  if (legendLabels.length > 0 && legendLayout.rows.length > 0) {
    var legendY = plot.y + plot.h + PAD_BOTTOM + 5;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendLayout.displayTexts, distinctColors, legendLayout.rows, legendLayout.widths, 1, legendAlign, false);
    if (legendNodes.length > 1) { var legendGroup = figma.group(legendNodes, container); legendGroup.name = "Legend"; }
  }

  var chartParams = {
    chartType: "line",
    yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels,
    linesCount: linesCount, lineStyle: lineStyle,
    topEvent: topEvent, bottomEvent: bottomEvent,
    showLegend: showLegend, legendAlign: legendAlign, legendLabels: legendLabels,
    allSeries: allSeries, colors: distinctColors, lineColors: seriesPins, customColors: customColors,
    topEventSegments: topEventSegments, bottomEventSegments: bottomEventSegments
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));
  insertAndNotify(ctx, "Line");
}

// ═══════════════════════════════════════════════════════════════
//  CHART AREA — Generator
// ═══════════════════════════════════════════════════════════════

function drawAreas(parent, p, allSeries, yMin, yMax, areaStyle, areaMode, fillOpacity, colors) {
  var nodes = [];
  var range = yMax - yMin;
  if (range === 0) range = 100;
  var baselineY = p.y + p.h;

  var cumulativeVals = null;
  if (areaMode === "stacked") {
    cumulativeVals = [];
    for (var pi = 0; pi < allSeries[0].length; pi++) cumulativeVals.push(yMin);
  }

  var prevTopReverse = null;

  for (var li = 0; li < allSeries.length; li++) {
    var vals = allSeries[li];
    var color = colors[li % colors.length];
    var count = vals.length;
    var gap = p.w / (count - 1 || 1);
    var topPoints = [];

    for (var pi = 0; pi < count; pi++) {
      var x = p.x + gap * pi;
      if (areaMode === "stacked") {
        var stackedVal = cumulativeVals[pi] + (vals[pi] - yMin);
        if (stackedVal > yMax) stackedVal = yMax;
        topPoints.push({ x: x, y: p.y + p.h - ((stackedVal - yMin) / range) * p.h });
        cumulativeVals[pi] = stackedVal;
      } else {
        var ratio = (vals[pi] - yMin) / range;
        topPoints.push({ x: x, y: p.y + p.h - ratio * p.h });
      }
    }

    var curves = buildCurvePathBidirectional(topPoints, areaStyle, p);
    var topPath = curves.forward;
    var bottomPath;
    if (areaMode === "stacked" && li > 0 && prevTopReverse) {
      bottomPath = prevTopReverse;
    } else {
      bottomPath = " L " + topPoints[topPoints.length - 1].x + " " + baselineY + " L " + topPoints[0].x + " " + baselineY;
    }
    prevTopReverse = curves.reverse;

    var areaVec = figma.createVector();
    areaVec.vectorPaths = [{ windingRule: "NONZERO", data: topPath + bottomPath + " Z" }];
    areaVec.fills = [{ type: "SOLID", color: color, opacity: fillOpacity }];
    areaVec.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.2 }];
    areaVec.strokeWeight = 0.2;
    areaVec.strokeAlign = "INSIDE";
    areaVec.strokeJoin = "ROUND";
    parent.appendChild(areaVec);
    nodes.push(areaVec);
  }
  return nodes;
}

function generateAreaChart(msg, exactData) {
  var yValues = msg.yValues;
  var xLabels = msg.xLabels;
  var areasCount = msg.areasCount;
  var areaStyle = msg.areaStyle || "smooth";
  var areaMode = msg.areaMode || "overlap";
  var fillHeight = msg.fillHeight || false;
  var fillOpacity = msg.fillOpacity;
  var yUnit = msg.yUnit || "";
  var topEvent = msg.topEvent || false;
  var bottomEvent = msg.bottomEvent || false;
  var replaceMode = exactData ? true : (msg.replace || false);

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!areasCount || areasCount < 1) areasCount = 2;
  if (areasCount > 20) areasCount = 20;
  if (fillOpacity === undefined || fillOpacity === null) fillOpacity = 0.3;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));
  var yLabels = resolveYLabels(msg.yLabels, yValues);

  var showLegend = (msg.showLegend !== undefined) ? !!msg.showLegend : ((msg.legendLabels || []).length > 0);
  var legendAlign = msg.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = showLegend ? normalizeLegendLabels(msg.legendLabels, areasCount) : [];

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Area", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var pointCount = xLabels.length;
  var peakMultiplier = (areaStyle === "peak") ? 10 : 1;
  var dataPointCount = (pointCount - 1) * peakMultiplier + 1;

  var allSeries;
  if (exactData && exactData.allSeries && exactData.allSeries.length === areasCount) {
    allSeries = exactData.allSeries;
  } else {
    allSeries = [];
    for (var li = 0; li < areasCount; li++) {
      var vals = [];
      if (areaStyle === "peak") {
        var baseLevel = yMin + (yMax - yMin) * 0.05;
        for (var pi = 0; pi < dataPointCount; pi++) {
          var spike = Math.random() < 0.15;
          if (spike) vals.push(yMin + Math.random() * (yMax - yMin));
          else vals.push(baseLevel + Math.random() * (yMax - yMin) * 0.1);
        }
      } else {
        for (var pi = 0; pi < pointCount; pi++) vals.push(yMin + Math.random() * (yMax - yMin));
      }
      allSeries.push(vals);
    }

    // CRITICAL: stacked scaling lives inside the else branch — stored allSeries
    // (paste path) is already post-scaling, so re-applying would double-scale.
    if (areaMode === "stacked" && allSeries.length > 1) {
      var scaleFactor = (fillHeight ? 2 : 1) / areasCount;
      for (var si = 0; si < allSeries.length; si++) {
        for (var pi = 0; pi < allSeries[si].length; pi++) {
          allSeries[si][pi] = yMin + (allSeries[si][pi] - yMin) * scaleFactor;
        }
      }
    }
  }

  // Pinned colors from the picker; a paste carries them along in exactData.
  var seriesPins = normalizeSeriesColors(msg.areaColors, areasCount);
  var customColors = resolveCustomColors(msg, seriesPins);
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === areasCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(areasCount, seriesPins, null, false);
  }

  var topEventSegments = topEvent
    ? ((exactData && exactData.topEventSegments) ? exactData.topEventSegments : buildEventSegments("top"))
    : null;
  var bottomEventSegments = bottomEvent
    ? ((exactData && exactData.bottomEventSegments) ? exactData.bottomEventSegments : buildEventSegments("bottom"))
    : null;

  var padLeft = measureMaxLabelWidth(yLabels, yUnit) + PAD_GAP + 2;

  // Pre-layout legend (Area uses dot marker)
  var legendLeftBound = padLeft;
  var legendWidth = w - padLeft - PAD_RIGHT;
  var legendLayout = preLayoutLegend(legendLabels, legendWidth, true);

  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM - legendLayout.extraBottom };

  var gridNodes = drawGridStandard(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit, yLabels);
  var xLabelNodes = drawXLabelsStandard(container, plot, xLabels);
  var areaNodes = drawAreas(container, plot, allSeries, yMin, yMax, areaStyle, areaMode, fillOpacity, distinctColors);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(areaNodes, container, "Areas");
  drawEvents(container, plot, topEvent, bottomEvent, topEventSegments, bottomEventSegments);

  if (legendLabels.length > 0 && legendLayout.rows.length > 0) {
    var legendY = plot.y + plot.h + PAD_BOTTOM + 5;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendLayout.displayTexts, distinctColors, legendLayout.rows, legendLayout.widths, 1, legendAlign, true);
    if (legendNodes.length > 1) { var legendGroup = figma.group(legendNodes, container); legendGroup.name = "Legend"; }
  }

  var chartParams = {
    chartType: "area",
    yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels,
    areasCount: areasCount, areaStyle: areaStyle, areaMode: areaMode,
    fillHeight: fillHeight, fillOpacity: fillOpacity,
    topEvent: topEvent, bottomEvent: bottomEvent,
    showLegend: showLegend, legendAlign: legendAlign, legendLabels: legendLabels,
    allSeries: allSeries, colors: distinctColors, areaColors: seriesPins, customColors: customColors,
    topEventSegments: topEventSegments, bottomEventSegments: bottomEventSegments
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));
  insertAndNotify(ctx, "Area");
}

// ═══════════════════════════════════════════════════════════════
//  CHART BAR — Generator
// ═══════════════════════════════════════════════════════════════

// Bar-specific grid and label functions
function drawGridVertical(parent, p, yValues, xLabels) {
  var nodes = [];
  var overshoot = 6;
  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h;
    var line = figma.createLine();
    line.x = p.x - overshoot; line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
    nodes.push(line);
  }

  var labelSlotW = p.w / xLabels.length;
  for (var j = 0; j < xLabels.length; j++) {
    var x = p.x + labelSlotW * j + labelSlotW / 2;
    var vline = figma.createLine();
    vline.resize(p.h, 0); vline.rotation = -90;
    vline.x = x; vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
    nodes.push(vline);
  }
  return nodes;
}

function drawGridHorizontal(parent, p, yValues, yMin, yMax, xLabels) {
  var nodes = [];
  var overshoot = 6;

  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var x = p.x + ratio * p.w;
    var vline = figma.createLine();
    vline.resize(p.h + overshoot, 0); vline.rotation = -90;
    vline.x = x; vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
    nodes.push(vline);
  }

  var labelSlotH = p.h / xLabels.length;
  for (var j = 0; j < xLabels.length; j++) {
    var y = p.y + labelSlotH * j + labelSlotH / 2;
    var line = figma.createLine();
    line.x = p.x - overshoot; line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
    nodes.push(line);
  }
  return nodes;
}

function drawCategoryLabelsBottom(parent, p, xLabels) {
  var nodes = [];
  var slotW = p.w / xLabels.length;
  var ly = p.y + p.h + 6;
  for (var j = 0; j < xLabels.length; j++) {
    var cx = p.x + slotW * j + slotW / 2;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = xLabels[j];
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    t.y = ly; parent.appendChild(t);
    t.x = cx - t.width / 2;
    nodes.push(t);
  }
  return nodes;
}

function drawCategoryLabelsLeft(parent, p, xLabels) {
  var nodes = [];
  var slotH = p.h / xLabels.length;
  var rightEdge = p.x - 8;
  for (var j = 0; j < xLabels.length; j++) {
    var cy = p.y + slotH * j + slotH / 2;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = xLabels[j];
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    parent.appendChild(t);
    t.x = rightEdge - t.width;
    t.y = cy - t.height / 2;
    nodes.push(t);
  }
  return nodes;
}

function drawValueLabelsBottom(parent, p, yValues, yMin, yMax, yUnit, yLabels) {
  var nodes = [];
  var ly = p.y + p.h + 6;
  var suffix = yUnit || "";
  var labels = resolveYLabels(yLabels, yValues);
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var x = p.x + ratio * p.w;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = labels[i] + suffix;
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    t.y = ly; parent.appendChild(t);
    if (i === 0) t.x = x;
    else if (i === yValues.length - 1) t.x = x - t.width;
    else t.x = x - t.width / 2;
    nodes.push(t);
  }
  return nodes;
}

function drawBars(parent, p, allSeries, yMin, yMax, barMode, orientation, colors, dense, barGap, fillOpacity) {
  var nodes = [];
  var range = yMax - yMin;
  if (range === 0) range = 100;
  var categoriesCount = allSeries[0].length;
  var seriesCount = allSeries.length;

  if (orientation === "vertical") {
    var slotW = p.w / categoriesCount;
    if (barMode === "grouped") {
      var groupW = slotW * 0.7;
      var groupOffset = (slotW - groupW) / 2;
      var internalGap = 1;
      for (var ci = 0; ci < categoriesCount; ci++) {
        var slotX = p.x + slotW * ci;
        var totalGaps = (seriesCount - 1) * internalGap;
        var barW = (groupW - totalGaps) / seriesCount;
        if (barW < 1) barW = 1;
        for (var si = 0; si < seriesCount; si++) {
          var val = allSeries[si][ci];
          var ratio = (val - yMin) / range;
          var barH = Math.min(ratio * p.h, p.h);
          if (barH < 1) barH = 1;
          var barX = slotX + groupOffset + (barW + internalGap) * si;
          var barY = p.y + p.h - barH;
          var rect = figma.createRectangle();
          rect.x = barX; rect.y = Math.max(p.y, barY);
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect); nodes.push(rect);
        }
      }
    } else {
      var groupW = slotW - barGap;
      if (groupW < 1) groupW = 1;
      var groupOffset = barGap / 2;
      for (var ci = 0; ci < categoriesCount; ci++) {
        var slotX = p.x + slotW * ci;
        var barW = groupW;
        var barX = slotX + groupOffset;
        var cumulativeH = 0;
        for (var si = 0; si < seriesCount; si++) {
          var val = allSeries[si][ci];
          var ratio = (val - yMin) / range;
          var barH = ratio * p.h;
          if (barH < 0.5) barH = 0.5;
          var barY = p.y + p.h - cumulativeH - barH;
          if (barY < p.y) { barH = barH - (p.y - barY); barY = p.y; }
          if (barH < 0.5) barH = 0.5;
          cumulativeH += barH;
          var rect = figma.createRectangle();
          rect.x = barX; rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect); nodes.push(rect);
        }
      }
    }
  } else {
    var slotH = p.h / categoriesCount;
    if (barMode === "grouped") {
      var groupH = slotH * 0.7;
      var groupOffset = (slotH - groupH) / 2;
      var internalGap = 1;
      for (var ci = 0; ci < categoriesCount; ci++) {
        var slotY = p.y + slotH * ci;
        var totalGaps = (seriesCount - 1) * internalGap;
        var barH = (groupH - totalGaps) / seriesCount;
        if (barH < 1) barH = 1;
        for (var si = 0; si < seriesCount; si++) {
          var val = allSeries[si][ci];
          var ratio = (val - yMin) / range;
          var barW = Math.min(ratio * p.w, p.w);
          if (barW < 1) barW = 1;
          var barY = slotY + groupOffset + (barH + internalGap) * si;
          var rect = figma.createRectangle();
          rect.x = p.x; rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect); nodes.push(rect);
        }
      }
    } else {
      var groupH = slotH - barGap;
      if (groupH < 1) groupH = 1;
      var groupOffset = barGap / 2;
      for (var ci = 0; ci < categoriesCount; ci++) {
        var slotY = p.y + slotH * ci;
        var barH = groupH;
        var barY = slotY + groupOffset;
        var cumulativeW = 0;
        for (var si = 0; si < seriesCount; si++) {
          var val = allSeries[si][ci];
          var ratio = (val - yMin) / range;
          var barW = ratio * p.w;
          if (barW < 0.5) barW = 0.5;
          var barX = p.x + cumulativeW;
          if (barX + barW > p.x + p.w) barW = p.x + p.w - barX;
          if (barW < 0.5) barW = 0.5;
          cumulativeW += barW;
          var rect = figma.createRectangle();
          rect.x = barX; rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect); nodes.push(rect);
        }
      }
    }
  }
  return nodes;
}

function generateBarChart(msg, exactData) {
  var yValues = msg.yValues;
  var xLabels = msg.xLabels;
  var barsCount = msg.barsCount;
  var orientation = msg.orientation || "vertical";
  var barMode = msg.barMode || "normal";
  var dense = msg.dense || false;
  var barGap = (msg.barGap !== undefined) ? msg.barGap : 1;
  var fillOpacity = (msg.fillOpacity !== undefined) ? msg.fillOpacity : 1;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));
  var yUnit = msg.yUnit || "";
  var topEvent = msg.topEvent || false;
  var bottomEvent = msg.bottomEvent || false;
  var replaceMode = exactData ? true : (msg.replace || false);

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!barsCount || barsCount < 1) barsCount = 2;
  if (barsCount > 20) barsCount = 20;
  var yLabels = resolveYLabels(msg.yLabels, yValues);

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Bar", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var categoriesCount = xLabels.length;
  if (barMode === "normal") barsCount = 1;

  // Legend params (compute after barsCount is finalized)
  var showLegend = (msg.showLegend !== undefined) ? !!msg.showLegend : ((msg.legendLabels || []).length > 0);
  var legendAlign = msg.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = showLegend ? normalizeLegendLabels(msg.legendLabels, barsCount) : [];

  var dataPointCount = categoriesCount;
  if (dense && (barMode === "normal" || barMode === "stacked")) dataPointCount = categoriesCount * 10;

  var allSeries;
  if (exactData && exactData.allSeries && exactData.allSeries.length === barsCount) {
    allSeries = exactData.allSeries;
  } else {
    allSeries = [];
    for (var li = 0; li < barsCount; li++) {
      var vals = [];
      for (var pi = 0; pi < dataPointCount; pi++) vals.push(yMin + Math.random() * (yMax - yMin));
      allSeries.push(vals);
    }

    if (barMode === "stacked" && allSeries.length > 1) {
      var scaleFactor = 1 / barsCount;
      for (var si = 0; si < allSeries.length; si++) {
        for (var pi = 0; pi < allSeries[si].length; pi++) {
          allSeries[si][pi] = yMin + (allSeries[si][pi] - yMin) * scaleFactor;
        }
      }
    }
  }

  // Pinned colors from the picker; a paste carries them along in exactData.
  var seriesPins = normalizeSeriesColors(msg.barColors, barsCount);
  var customColors = resolveCustomColors(msg, seriesPins);
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === barsCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(barsCount, seriesPins, null, false);
  }

  var topEventSegments = topEvent
    ? ((exactData && exactData.topEventSegments) ? exactData.topEventSegments : buildEventSegments("top"))
    : null;
  var bottomEventSegments = bottomEvent
    ? ((exactData && exactData.bottomEventSegments) ? exactData.bottomEventSegments : buildEventSegments("bottom"))
    : null;

  var maxLabelWidth = 0;
  if (orientation === "vertical") {
    maxLabelWidth = measureMaxLabelWidth(yLabels, yUnit);
  } else {
    maxLabelWidth = measureMaxTextWidth(xLabels);
  }
  var padLeft = maxLabelWidth + PAD_GAP + 2;

  // Pre-layout legend (Bar uses dot marker)
  var legendLeftBound = padLeft;
  var legendWidth = w - padLeft - PAD_RIGHT;
  var legendLayout = preLayoutLegend(legendLabels, legendWidth, true);

  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM - legendLayout.extraBottom };

  var gridNodes, yLabelNodes, xLabelNodes;
  if (orientation === "vertical") {
    gridNodes = drawGridVertical(container, plot, yValues, xLabels);
    yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit, yLabels);
    xLabelNodes = drawCategoryLabelsBottom(container, plot, xLabels);
  } else {
    gridNodes = drawGridHorizontal(container, plot, yValues, yMin, yMax, xLabels);
    yLabelNodes = drawCategoryLabelsLeft(container, plot, xLabels);
    xLabelNodes = drawValueLabelsBottom(container, plot, yValues, yMin, yMax, yUnit, yLabels);
  }

  var barNodes = drawBars(container, plot, allSeries, yMin, yMax, barMode, orientation, distinctColors, dense, barGap, fillOpacity);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(barNodes, container, "Bars");
  drawEvents(container, plot, topEvent, bottomEvent, topEventSegments, bottomEventSegments);

  if (legendLabels.length > 0 && legendLayout.rows.length > 0) {
    var legendY = plot.y + plot.h + PAD_BOTTOM + 5;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendLayout.displayTexts, distinctColors, legendLayout.rows, legendLayout.widths, 1, legendAlign, true);
    if (legendNodes.length > 1) { var legendGroup = figma.group(legendNodes, container); legendGroup.name = "Legend"; }
  }

  var chartParams = {
    chartType: "bar",
    yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels,
    barsCount: barsCount, orientation: orientation, barMode: barMode,
    dense: dense, barGap: barGap, fillOpacity: fillOpacity,
    topEvent: topEvent, bottomEvent: bottomEvent,
    showLegend: showLegend, legendAlign: legendAlign, legendLabels: legendLabels,
    allSeries: allSeries, colors: distinctColors, barColors: seriesPins, customColors: customColors,
    topEventSegments: topEventSegments, bottomEventSegments: bottomEventSegments
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));
  insertAndNotify(ctx, "Bar");
}

// ═══════════════════════════════════════════════════════════════
//  CHART PIE — Generator
// ═══════════════════════════════════════════════════════════════

function drawSlices(parent, cx, cy, outerR, innerR, values, colors, fillOpacity, cornerRadius, gapDeg) {
  var nodes = [];
  var total = 0;
  for (var i = 0; i < values.length; i++) total += values[i];
  if (total === 0) return nodes;

  var innerRatio = (innerR > 0) ? (innerR / outerR) : 0;
  var gapRad = gapDeg * Math.PI / 180;
  var startAngle = -Math.PI / 2;
  var diameter = outerR * 2;

  for (var i = 0; i < values.length; i++) {
    var sliceAngle = (values[i] / total) * Math.PI * 2;
    if (sliceAngle < 0.001) { startAngle += sliceAngle; continue; }
    var a1 = startAngle + gapRad / 2;
    var a2 = startAngle + sliceAngle - gapRad / 2;
    if (a2 <= a1) { startAngle += sliceAngle; continue; }

    var seg = figma.createEllipse();
    seg.resize(diameter, diameter);
    seg.x = cx - outerR; seg.y = cy - outerR;
    seg.arcData = { startingAngle: a1, endingAngle: a2, innerRadius: innerRatio };
    seg.fills = [{ type: "SOLID", color: colors[i % colors.length], opacity: fillOpacity }];
    seg.strokes = [];
    if (cornerRadius > 0 && innerRatio > 0) seg.cornerRadius = cornerRadius;
    parent.appendChild(seg);
    nodes.push(seg);
    startAngle += sliceAngle;
  }
  return nodes;
}

function drawPieValueLabels(parent, cx, cy, outerR, values, labelOffset) {
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
    var lx1 = cx + outerR * Math.cos(midAngle);
    var ly1 = cy + outerR * Math.sin(midAngle);
    var lx2 = cx + (outerR + lineLen) * Math.cos(midAngle);
    var ly2 = cy + (outerR + lineLen) * Math.sin(midAngle);
    var hDir = (Math.cos(midAngle) >= 0) ? 1 : -1;
    var lx3 = lx2 + hLineLen * hDir;
    var ly3 = ly2;

    var linePath = "M " + lx1 + " " + ly1 + " L " + lx2 + " " + ly2 + " L " + lx3 + " " + ly3;
    var lineVec = figma.createVector();
    lineVec.vectorPaths = [{ windingRule: "NONZERO", data: linePath }];
    lineVec.fills = [];
    lineVec.strokes = [{ type: "SOLID", color: COLOR_AXIS, opacity: 0.3 }];
    lineVec.strokeWeight = 0.5;
    parent.appendChild(lineVec); nodes.push(lineVec);

    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.fontSize = 11;
    t.characters = formatYValue(values[i]);
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    parent.appendChild(t);
    if (hDir > 0) t.x = lx3 + 3;
    else t.x = lx3 - t.width - 3;
    t.y = ly3 - t.height / 2;
    nodes.push(t);
    startAngle += sliceAngle;
  }
  return nodes;
}

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
  t.x = cx - t.width / 2; t.y = cy - t.height / 2;
  nodes.push(t);
  return nodes;
}

function generatePieChart(msg, exactData) {
  var values = msg.values || [];
  var segmentsCount = msg.segmentsCount || 5;
  var pieStyle = msg.pieStyle || "donut";
  var innerRadiusPct = msg.innerRadiusPct || 55;
  var cornerRadius = msg.cornerRadius || 0;
  var segmentGap = (msg.segmentGap !== undefined) ? msg.segmentGap : 1;
  var showLabels = msg.showLabels || false;
  var showTotal = msg.showTotal || false;
  var fillOpacity = (msg.fillOpacity !== undefined) ? msg.fillOpacity : 1;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));
  var replaceMode = exactData ? true : (msg.replace || false);

  // Resolve values: exact-data path uses deterministic values from msg directly;
  // otherwise keep random fill when empty.
  if (exactData) {
    values = msg.values || [];
  } else if (!values || values.length < 1) {
    values = [];
    for (var i = 0; i < segmentsCount; i++) values.push(Math.round(5 + Math.random() * 195));
  }
  segmentsCount = values.length;

  // Legend params
  var showLegend = (msg.showLegend !== undefined) ? !!msg.showLegend : ((msg.legendLabels || []).length > 0);
  var legendAlign = msg.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = showLegend ? normalizeLegendLabels(msg.legendLabels, segmentsCount) : [];

  var ctx = prepareContainer("Chart Pie", replaceMode, 500, 500);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  // Pre-layout legend (Pie uses dot marker; bounds use side margins)
  var legendLeftBound = LEGEND_SIDE_MARGIN;
  var legendWidth = w - LEGEND_SIDE_MARGIN * 2;
  var legendLayout = preLayoutLegend(legendLabels, legendWidth, true);
  var legendExtraBottom = legendLayout.extraBottom;

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
  var cx = w / 2; var cy = pieAreaH / 2;
  var innerR = (pieStyle === "donut") ? outerR * (innerRadiusPct / 100) : 0;
  var cr = (pieStyle === "donut") ? cornerRadius : 0;

  // Pinned colors from the picker; a paste carries them along in exactData.
  var seriesPins = normalizeSeriesColors(msg.segmentColors, segmentsCount);
  var customColors = resolveCustomColors(msg, seriesPins);
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === segmentsCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(segmentsCount, seriesPins, null, true);
  }

  var sliceNodes = drawSlices(container, cx, cy, outerR, innerR, values, distinctColors, fillOpacity, cr, segmentGap);
  groupNodes(sliceNodes, container, "Slices");

  if (showLabels) {
    var labelNodes = drawPieValueLabels(container, cx, cy, outerR, values, Math.max(6, labelMargin / 2));
    if (labelNodes.length > 1) { var g = figma.group(labelNodes, container); g.name = "Labels"; }
  }

  if (showTotal && pieStyle === "donut") {
    var totalNodes = drawCenterTotal(container, cx, cy, values, innerR);
    if (totalNodes.length > 0) { var g = figma.group(totalNodes, container); g.name = "Center Label"; }
  }

  if (legendLabels.length > 0 && legendLayout.rows.length > 0) {
    var legendY = h - legendLayout.blockH - 3;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendLayout.displayTexts, distinctColors, legendLayout.rows, legendLayout.widths, 1, legendAlign, true);
    if (legendNodes.length > 1) { var legendGroup = figma.group(legendNodes, container); legendGroup.name = "Legend"; }
  }

  var chartParams = {
    chartType: "pie",
    values: values, segmentsCount: segmentsCount, pieStyle: pieStyle,
    innerRadiusPct: innerRadiusPct, cornerRadius: cornerRadius, segmentGap: segmentGap,
    showLabels: showLabels, showTotal: showTotal, fillOpacity: fillOpacity,
    showLegend: showLegend, legendAlign: legendAlign, legendLabels: legendLabels,
    colors: distinctColors, segmentColors: seriesPins, customColors: customColors
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));
  insertAndNotify(ctx, "Pie");
}

// ═══════════════════════════════════════════════════════════════
//  MAIN: Show UI & Message Router
// ═══════════════════════════════════════════════════════════════

figma.showUI(__html__, { width: 300, height: 100 });
sendSelection();
figma.on("selectionchange", sendSelection);

function dispatchChart(params, exactData) {
  var chartType = params.chartType || "line";
  if (chartType === "line") generateLineChart(params, exactData);
  else if (chartType === "area") generateAreaChart(params, exactData);
  else if (chartType === "bar") generateBarChart(params, exactData);
  else if (chartType === "pie") generatePieChart(params, exactData);
}

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
  if (msg.type === "suggest-colors") {
    // The picker was switched on or "Auto" was pressed: propose concrete colors
    // for the requested rows, chosen the same way generation would (Pie also
    // keeps touching slices apart), around the colors already pinned.
    var count = Math.max(1, Math.min(20, parseInt(msg.count) || 1));
    var pins = msg.seriesColors || msg.lineColors || msg.areaColors || msg.barColors || msg.segmentColors;
    var ring = (msg.chartType === "pie") || (!msg.chartType && !!msg.segmentColors);
    var suggested = resolveSeriesColors(count, pins, msg.avoid, ring);
    var hexes = [];
    for (var si = 0; si < suggested.length; si++) hexes.push(colorToHex(suggested[si]));
    figma.ui.postMessage({ type: "suggested-colors", requestId: msg.requestId, chartType: msg.chartType, colors: hexes });
    return;
  }
  if (msg.type === "recolor" || msg.type === "save-series-colors" || msg.type === "save-line-colors" ||
      msg.type === "save-area-colors" || msg.type === "save-bar-colors" || msg.type === "save-segment-colors") {
    var outcome;
    try {
      if (msg.type === "recolor") {
        outcome = recolorSelectedChart(msg.index, msg.color, msg.chartType);
      } else {
        var saved = msg.seriesColors || msg.lineColors || msg.areaColors || msg.barColors || msg.segmentColors || [];
        outcome = saveColorsToSelectedChart(saved, !!msg.customColors, msg.chartType);
      }
    } catch (e) {
      outcome = "Could not apply the color: " + (e && e.message ? e.message : String(e));
    }
    if (outcome !== true) {
      var reason = outcome || "Select the chart to apply the color";
      figma.notify(reason, { error: true });
      figma.ui.postMessage({ type: "recolor-failed", index: msg.index, chartType: msg.chartType, message: reason });
    }
    return;
  }
  if (msg.type === "generate") {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    // Surface render failures instead of silently drawing nothing.
    try { dispatchChart(msg, null); }
    catch (e) { figma.notify("Chart not drawn: " + (e && e.message ? e.message : String(e)), { error: true }); }
    return;
  }
  if (msg.type === "paste") {
    if (!msg.chartData) return;
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    try { dispatchChart(msg.chartData, msg.chartData); }
    catch (e) { figma.notify("Chart not drawn: " + (e && e.message ? e.message : String(e)), { error: true }); }
    return;
  }
};

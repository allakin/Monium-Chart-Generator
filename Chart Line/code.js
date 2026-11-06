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

// ─── User-pinned line colors ────────────────────────────────
// The UI color picker offers the generation palette. A pinned color travels as
// a "#RRGGBB" string; palette hexes are derived from the palette entries
// themselves, so hex → palette lookup is an exact round trip. A valid hex that
// is not in the palette (a chart from an older palette) stays pinned as is.
// null means "Auto": the line gets a generated color that stays distinct from
// every pinned one.
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

// Exactly `count` entries: an uppercase hex for a pinned line, null for Auto.
// Anything that is not a valid #RRGGBB is dropped back to Auto.
function normalizeLineColors(raw, count) {
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
// still varies the Auto lines while keeping them apart from the pinned ones.
// `avoid` (optional hex list) are colors to stay away from without placing
// them — e.g. the color a line had before the user asked for a new one.
function resolveSeriesColors(count, lineColors, avoid) {
  var pinned = normalizeLineColors(lineColors, count);
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
      // More lines than palette colors — reuse, the way selectDistinctColors cycles.
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
  return result;
}

var COLOR_GRID = { r: 0.898, g: 0.898, b: 0.898 };
var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 600;
var DEFAULT_H = 400;
var PAD_TOP = 10;
var PAD_RIGHT = 2;
var PAD_BOTTOM = 21;
var PAD_GAP = 8; // gap between Y labels and plot area

// ─── Format Y axis value (preserves decimals) ───────────────
function formatYValue(v) {
  if (typeof v !== "number" || isNaN(v)) return String(v);
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return parseFloat(v.toFixed(4)).toString();
}
// ─── Y axis label parsing ───────────────────────────────────
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

// Text drawn for each Y tick: the label as typed when it isn't a plain
// number (time, currency), otherwise the formatted value.
function resolveYLabels(yLabels, yValues) {
  var usable = yLabels && yLabels.length === yValues.length;
  var out = [];
  for (var i = 0; i < yValues.length; i++) {
    var raw = usable && yLabels[i] !== undefined && yLabels[i] !== null ? String(yLabels[i]) : "";
    out.push(raw.length > 0 ? raw : formatYValue(yValues[i]));
  }
  return out;
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
    // A layer inside a chart (a line, a label, the legend) stands for the chart
    // that holds it — designers often click straight into the chart.
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
// A chart container: named "Chart Line", or renamed by the designer but still
// carrying this plugin's chart data.
function isChartFrame(n) {
  if (!n || n.type !== "FRAME") return false;
  if (n.name === "Chart Line") return true;
  try { return !!n.getPluginData("chartParams"); } catch (e) { return false; }
}

function findChartFrame(frame) {
  // Check if the frame itself is a "Chart Line"
  if (frame.name === "Chart Line" || isChartFrame(frame)) return frame;
  if (!("children" in frame)) return null;
  // Direct children first (the usual layout), then breadth-first through
  // nested frames, groups and instances — a chart wrapped in a card or an
  // auto-layout section is still the selected frame's chart.
  var queue = [];
  for (var i = 0; i < frame.children.length; i++) {
    var child = frame.children[i];
    if (child.name === "Chart Line" && child.type === "FRAME") return child;
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
  // Primary: read from plugin data
  var data = chartFrame.getPluginData("chartParams");
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  // Fallback: parse from layer structure
  return readChartParamsFromLayers(chartFrame);
}

function readChartParamsFromLayers(chartFrame) {
  if (!("children" in chartFrame)) return null;
  var children = chartFrame.children;

  var texts = [];
  var vectors = [];
  var rects = [];
  var groups = {};

  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === "GROUP") {
      groups[c.name] = c;
    } else if (c.type === "TEXT") {
      texts.push(c);
    } else if (c.type === "VECTOR") {
      vectors.push(c);
    } else if (c.type === "RECTANGLE") {
      rects.push(c);
    }
  }

  var yValues = [];
  var yUnit = "";
  var yLabels = null;
  var xLabels = [];
  var linesCount = 1;
  var lineStyle = "smooth";
  var topEvent = false;
  var bottomEvent = false;

  // ── Try reading from named groups first ──
  if (groups["Y Labels"] && "children" in groups["Y Labels"]) {
    var yGroup = groups["Y Labels"];
    var yTexts = [];
    for (var i = 0; i < yGroup.children.length; i++) {
      if (yGroup.children[i].type === "TEXT" && yGroup.children[i].characters.length > 0) yTexts.push(yGroup.children[i]);
    }
    yTexts.sort(function (a, b) { return b.y - a.y; });
    var yChars = [];
    for (var i = 0; i < yTexts.length; i++) yChars.push(yTexts[i].characters);
    var parsedY = parseYLabelTexts(yChars);
    yValues = parsedY.yValues;
    yUnit = parsedY.yUnit;
    yLabels = parsedY.yLabels;
  }

  if (groups["X Labels"] && "children" in groups["X Labels"]) {
    var xGroup = groups["X Labels"];
    var xTexts = [];
    for (var i = 0; i < xGroup.children.length; i++) {
      if (xGroup.children[i].type === "TEXT") xTexts.push(xGroup.children[i]);
    }
    xTexts.sort(function (a, b) { return a.x - b.x; });
    for (var i = 0; i < xTexts.length; i++) {
      xLabels.push(xTexts[i].characters);
    }
  }

  if (groups["Lines"] && "children" in groups["Lines"]) {
    linesCount = groups["Lines"].children.length;
    if (linesCount < 1) linesCount = 1;
    // Detect line style from first vector path
    var firstVec = groups["Lines"].children[0];
    if (firstVec && firstVec.type === "VECTOR") {
      try {
        var pathData = firstVec.vectorPaths[0].data;
        if (pathData.indexOf("C") === -1) {
          var lCount = (pathData.match(/ L /g) || []).length;
          if (xLabels.length > 0 && lCount > xLabels.length * 3) {
            lineStyle = "peak";
          } else {
            lineStyle = "sharp";
          }
        }
      } catch (e) {}
    }
  }

  topEvent = !!groups["Top Events"];
  bottomEvent = !!groups["Bottom Events"];

  // Line colors as drawn, so the picker previews the real ones.
  var colors = null;
  var lineLayers = chartLineNodes(chartFrame);
  if (lineLayers.length > 0) {
    colors = [];
    for (var ci = 0; ci < lineLayers.length; ci++) colors.push(strokeColorOf(lineLayers[ci]));
  }

  var legend = readLegendFromLayers(groups["Legend"], groups["Grid"]);

  // ── Fallback: parse from flat children (old charts without groups) ──
  if (yValues.length < 2 && texts.length > 0) {
    var frameH = chartFrame.height;
    var yLabelTexts = [];
    var xLabelTexts = [];
    for (var i = 0; i < texts.length; i++) {
      if (texts[i].y > frameH - PAD_BOTTOM - 5) {
        xLabelTexts.push(texts[i]);
      } else {
        yLabelTexts.push(texts[i]);
      }
    }
    xLabelTexts.sort(function (a, b) { return a.x - b.x; });
    yLabelTexts.sort(function (a, b) { return b.y - a.y; });

    xLabels = [];
    for (var i = 0; i < xLabelTexts.length; i++) {
      xLabels.push(xLabelTexts[i].characters);
    }

    var flatChars = [];
    for (var i = 0; i < yLabelTexts.length; i++) {
      if (yLabelTexts[i].characters.length > 0) flatChars.push(yLabelTexts[i].characters);
    }
    var parsedFlatY = parseYLabelTexts(flatChars);
    yValues = parsedFlatY.yValues;
    yUnit = parsedFlatY.yUnit;
    yLabels = parsedFlatY.yLabels;

    linesCount = vectors.length;
    if (linesCount < 1) linesCount = 2;

    if (vectors.length > 0) {
      try {
        var pathData = vectors[0].vectorPaths[0].data;
        if (pathData.indexOf("C") === -1) {
          var lCount = (pathData.match(/ L /g) || []).length;
          if (xLabels.length > 0 && lCount > xLabels.length * 3) {
            lineStyle = "peak";
          } else {
            lineStyle = "sharp";
          }
        }
      } catch (e) {}
    }

    // Detect events from rectangles with height ~6
    for (var i = 0; i < rects.length; i++) {
      if (Math.abs(rects[i].height - 6) < 1) {
        if (rects[i].y < PAD_TOP) topEvent = true;
        else bottomEvent = true;
      }
    }
  }

  if (yValues.length < 2) return null;

  // Sort bottom → top, keeping each label attached to its own value.
  var pairs = [];
  for (var pi = 0; pi < yValues.length; pi++) {
    pairs.push({ v: yValues[pi], l: yLabels ? yLabels[pi] : null });
  }
  pairs.sort(function (a, b) { return a.v - b.v; });
  for (var pi = 0; pi < pairs.length; pi++) {
    yValues[pi] = pairs[pi].v;
    if (yLabels) yLabels[pi] = pairs[pi].l;
  }

  var recovered = {
    yValues: yValues,
    yUnit: yUnit,
    yLabels: yLabels,
    xLabels: xLabels,
    linesCount: linesCount,
    lineStyle: lineStyle,
    topEvent: topEvent,
    bottomEvent: bottomEvent,
    showLegend: !!legend,
    legendAlign: legend ? legend.align : "left",
    legendLabels: legend ? legend.labels : []
  };
  if (colors && colors.length === linesCount) recovered.colors = colors;
  return recovered;
}

// Legend settings from the "Legend" group: labels in reading order (rows top →
// bottom, items left → right) and the alignment of the first row against the
// plot, whose edges come from the "Grid" group (it starts 6px left of the plot
// and ends at its right edge). Only the first legend page is drawn, so on a
// paginated legend the later labels are unknown — they come back as "Series N".
// A label cut with "…" is read as drawn.
// Page-space bounds. Children of a group are positioned against the nearest
// frame in Figma, so local x/y of legend items and grid lines are not directly
// comparable — absolute bounds are.
function absBoundsOf(n) {
  var b = n.absoluteBoundingBox;
  if (b) return { x: b.x, y: b.y, w: b.width, h: b.height };
  return { x: n.x, y: n.y, w: n.width, h: n.height };
}

function readLegendFromLayers(legendGroup, gridGroup) {
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
    if (k.type === "RECTANGLE") markers.push(k);
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
  if (gridGroup) {
    var grid = absBoundsOf(gridGroup);
    var plotX = grid.x + 6;
    var plotRight = grid.x + grid.w;
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
      // Markers sit 6px lower than their row's text.
      if (Math.abs(mb.y - 6 - rowY) > ROW_TOLERANCE) continue;
      if (mb.x < rowLeft) rowLeft = mb.x;
    }
    if (rowLeft !== Infinity && rowRight !== -Infinity) {
      if (Math.abs(rowLeft - plotX) <= 1.5) align = "left";
      else if (Math.abs(rowRight - plotRight) <= 1.5) align = "right";
      else align = "center";
    }
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

// ─── Live recolor ───────────────────────────────────────────
// A color picked while a chart is selected is applied to that chart at once:
// only the line stroke and its legend marker change — series data, events and
// layout stay as they are, so nothing is regenerated. The pin is saved into
// pluginData, so it survives a later regenerate, copy and paste.
function chartLineNodes(chartFrame) {
  if (!("children" in chartFrame)) return [];
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name !== "Lines") continue;
    if (c.type === "VECTOR") return [c];
    if (c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === "VECTOR") out.push(c.children[j]);
      }
      return out;
    }
  }
  return [];
}

// Legend markers in series order. Only the first legend page is drawn, and it
// always starts at series 0, so marker k belongs to series k.
function chartLegendMarkers(chartFrame) {
  if (!("children" in chartFrame)) return [];
  for (var i = 0; i < chartFrame.children.length; i++) {
    var c = chartFrame.children[i];
    if (c.name === "Legend" && c.type === "GROUP" && "children" in c) {
      var out = [];
      for (var j = 0; j < c.children.length; j++) {
        if (c.children[j].type === "RECTANGLE") out.push(c.children[j]);
      }
      return out;
    }
  }
  return [];
}

function strokeColorOf(node) {
  var s = node.strokes && node.strokes[0];
  return (s && s.color) ? { r: s.color.r, g: s.color.g, b: s.color.b } : PALETTE[0];
}

// Applies pins to the selected chart: every pinned line (and its legend marker)
// is repainted, unpinned lines keep the color they have. `update(pins, count)`
// edits the saved pins in place and returns an error text to abort.
// customColors records whether the UI picker is on for this chart, so
// "Get values from chart" and paste can show the picker the way it was left.
// Returns true when applied, otherwise a short reason for the user.
function applyLineColorsToSelectedChart(update, customColors) {
  var target = getSelectedFrame();
  if (!target) return "Select the chart to apply the color";
  var chartFrame = findChartFrame(target);
  if (!chartFrame) return "No Line chart in the selected frame";
  var lineNodes = chartLineNodes(chartFrame);
  var count = lineNodes.length;
  if (!count) return "Could not find the chart lines";
  var params = readChartParams(chartFrame) || {};

  var colors = [];
  for (var i = 0; i < count; i++) {
    var saved = params.colors && params.colors.length === count ? params.colors[i] : null;
    colors.push(saved || strokeColorOf(lineNodes[i]));
  }
  var pins = normalizeLineColors(params.lineColors, count);
  var problem = update(pins, count);
  if (typeof problem === "string") return problem;

  var markers = chartLegendMarkers(chartFrame);
  for (i = 0; i < count; i++) {
    // "Auto" just unpins the line: it keeps the color it has until regenerated.
    if (pins[i] === null) continue;
    var c = colorOfHex(pins[i]);
    if (colorToHex(colors[i]) !== pins[i]) {
      lineNodes[i].strokes = [{ type: "SOLID", color: c }];
      if (i < markers.length) markers[i].fills = [{ type: "SOLID", color: c }];
    }
    colors[i] = c;
  }

  params.colors = colors;
  params.lineColors = pins;
  params.customColors = !!customColors;
  chartFrame.setPluginData("chartParams", JSON.stringify(params));
  sendSelection("recolor");
  return true;
}

// One line picked in the UI.
function recolorSelectedChart(index, hex) {
  index = parseInt(index);
  return applyLineColorsToSelectedChart(function (pins, count) {
    if (isNaN(index) || index < 0 || index >= count) {
      return "The chart has only " + count + " line" + (count === 1 ? "" : "s");
    }
    pins[index] = normalizeHex(hex);
  }, true);
}

// The picker was switched on (rows = the chart's colors, now pinned) or off
// (every line unpinned, colors left as they are).
function saveLineColorsToSelectedChart(lineColors, customColors) {
  return applyLineColorsToSelectedChart(function (pins, count) {
    var next = customColors ? normalizeLineColors(lineColors, count) : normalizeLineColors([], count);
    for (var i = 0; i < count; i++) pins[i] = next[i];
  }, customColors);
}

// ─── Show UI ────────────────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 100 });
sendSelection();
figma.on("selectionchange", sendSelection);

// ─── Message handler ────────────────────────────────────────
figma.ui.onmessage = async function (msg) {
  if (msg.type === "resize") {
    figma.ui.resize(300, Math.min(msg.height, 800));
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
  if (msg.type === "recolor" || msg.type === "save-line-colors") {
    var outcome;
    try {
      outcome = (msg.type === "recolor")
        ? recolorSelectedChart(msg.index, msg.color)
        : saveLineColorsToSelectedChart(msg.lineColors, !!msg.customColors);
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
    var suggested = resolveSeriesColors(count, msg.lineColors, msg.avoid);
    var hexes = [];
    for (var si = 0; si < suggested.length; si++) hexes.push(colorToHex(suggested[si]));
    figma.ui.postMessage({ type: "suggested-colors", requestId: msg.requestId, colors: hexes });
    return;
  }
  if (msg.type === "generate") {
    await renderChart(msg, null);
    return;
  }
  if (msg.type === "paste") {
    if (!msg.chartData) return;
    await renderChart(msg.chartData, msg.chartData);
    return;
  }
};

async function renderChart(params, exactData) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  var yValues = params.yValues;
  var xLabels = params.xLabels;
  var linesCount = params.linesCount;
  var lineStyle = params.lineStyle || "smooth";
  var yUnit = params.yUnit || "";
  var topEvent = params.topEvent || false;
  var bottomEvent = params.bottomEvent || false;
  // Paste always replaces a chart inside the target frame (if present),
  // matching the regenerate flow's replace=true semantics.
  var replaceMode = exactData ? true : (params.replace || false);

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!linesCount || linesCount < 1) linesCount = 2;
  if (linesCount > 20) linesCount = 20;
  var yLabels = resolveYLabels(params.yLabels, yValues);

  // Backward compat: if showLegend was not stored, derive from non-empty labels.
  var showLegend = (params.showLegend !== undefined)
    ? !!params.showLegend
    : ((params.legendLabels || []).length > 0);
  var legendAlign = params.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = (params.legendLabels || []).filter(function (s) { return s && String(s).length > 0; });
  if (showLegend) {
    if (legendLabels.length > linesCount) {
      legendLabels = legendLabels.slice(0, linesCount);
    } else {
      for (var lpi = legendLabels.length; lpi < linesCount; lpi++) {
        legendLabels.push("Series " + (lpi + 1));
      }
    }
  } else {
    legendLabels = [];
  }

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var target = getTargetFrame();
  var w, h;
  var container = null;
  var reuseContainer = false;
  var oldX = 0;
  var oldY = 0;
  // A chart nested deeper than a direct child is replaced where it lives:
  // same parent, same layer index, same size.
  var nestedParent = null;
  var nestedIndex = -1;

  // ── Handle replacement ──
  if (replaceMode && target) {
    var existingChart = findChartFrame(target);
    if (existingChart) {
      if (existingChart.id === target.id) {
        w = target.width;
        h = target.height;
        var kids = [];
        for (var ki = 0; ki < target.children.length; ki++) kids.push(target.children[ki]);
        for (var ki = 0; ki < kids.length; ki++) kids[ki].remove();
        container = target;
        reuseContainer = true;
      } else {
        oldX = existingChart.x;
        oldY = existingChart.y;
        if (existingChart.parent && existingChart.parent.id !== target.id) {
          nestedParent = existingChart.parent;
          nestedIndex = nestedParent.children.indexOf(existingChart);
          w = existingChart.width;
          h = existingChart.height;
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
    container.name = "Chart Line";
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  var pointCount = xLabels.length;
  var peakMultiplier = (lineStyle === "peak") ? 10 : 1;
  var dataPointCount = (pointCount - 1) * peakMultiplier + 1;

  // Reuse exact line data if provided, else generate randomly
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
          if (spike) {
            vals.push(yMin + Math.random() * (yMax - yMin));
          } else {
            vals.push(baseLevel + Math.random() * (yMax - yMin) * 0.1);
          }
        }
      } else {
        for (var pi = 0; pi < pointCount; pi++) {
          vals.push(yMin + Math.random() * (yMax - yMin));
        }
      }
      allSeries.push(vals);
    }
  }

  // Pinned colors from the picker; a paste carries them along in exactData.
  var lineColors = normalizeLineColors(params.lineColors, linesCount);
  // Picker state for "Get values from chart": sent by the UI, or for older
  // payloads inferred from whether anything is pinned.
  var customColors = (params.customColors !== undefined)
    ? !!params.customColors
    : lineColors.some(function (c) { return c !== null; });
  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === linesCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = resolveSeriesColors(linesCount, lineColors);
  }

  var topEventSegments = null;
  var bottomEventSegments = null;
  if (topEvent) {
    topEventSegments = (exactData && exactData.topEventSegments) ? exactData.topEventSegments : buildEventSegments("top");
  }
  if (bottomEvent) {
    bottomEventSegments = (exactData && exactData.bottomEventSegments) ? exactData.bottomEventSegments : buildEventSegments("bottom");
  }

  var maxLabelWidth = 0;
  for (var mi = 0; mi < yValues.length; mi++) {
    var measure = figma.createText();
    measure.fontName = { family: "Inter", style: "Regular" };
    measure.fontSize = 11;
    measure.characters = yLabels[mi] + (yUnit ? yUnit : "");
    if (measure.width > maxLabelWidth) maxLabelWidth = measure.width;
    measure.remove();
  }
  var padLeft = maxLabelWidth + PAD_GAP + 2;

  // Pre-layout legend so plot height accounts for the actual rows/paginator.
  // Legend extent matches the plot (Y-axis-grid) horizontal range.
  var legendLeftBound = padLeft;
  var legendWidth = w - padLeft - PAD_RIGHT;
  var legendDisplayTexts = [];
  var legendItemWidths = [];
  var legendRows = [];
  var legendTotalPages = 1;
  var legendVisibleRows = 0;
  var legendPaginated = false;
  var legendBlockH = 0;
  if (legendLabels.length > 0) {
    var maxTextWidth = Math.max(20, legendWidth - LEGEND_LINE_W - LEGEND_LINE_TEXT_GAP);
    var measured = measureLegendItems(legendLabels, maxTextWidth);
    legendDisplayTexts = measured.texts;
    legendItemWidths = measured.widths;
    legendRows = packLegendRows(legendItemWidths, legendWidth);
    legendVisibleRows = Math.min(legendRows.length, 3);
    legendPaginated = legendRows.length > 3;
    legendTotalPages = Math.max(1, Math.ceil(legendRows.length / 3));
    legendBlockH = legendVisibleRows * 14 + Math.max(0, legendVisibleRows - 1) * 4;
    if (legendPaginated) legendBlockH += 4 + 14;
  }
  var legendExtraBottom = (legendBlockH > 0) ? (legendBlockH + 8) : 0;
  var plot = {
    x: padLeft,
    y: PAD_TOP,
    w: w - padLeft - PAD_RIGHT,
    h: h - PAD_TOP - PAD_BOTTOM - legendExtraBottom
  };

  var gridNodes = drawGrid(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabels(container, plot, yValues, yMin, yMax, yUnit, yLabels);
  var xLabelNodes = drawXLabels(container, plot, xLabels);
  var lineNodes = drawLines(container, plot, allSeries, yMin, yMax, lineStyle, distinctColors);

  if (gridNodes.length > 1) {
    var gridGroup = figma.group(gridNodes, container);
    gridGroup.name = "Grid";
  }
  if (yLabelNodes.length > 1) {
    var yLabelGroup = figma.group(yLabelNodes, container);
    yLabelGroup.name = "Y Labels";
  }
  if (xLabelNodes.length > 1) {
    var xLabelGroup = figma.group(xLabelNodes, container);
    xLabelGroup.name = "X Labels";
  }
  if (lineNodes.length > 1) {
    var linesGroup = figma.group(lineNodes, container);
    linesGroup.name = "Lines";
  } else if (lineNodes.length === 1) {
    lineNodes[0].name = "Lines";
    container.appendChild(lineNodes[0]);
  }

  if (topEvent && topEventSegments) {
    var topEventNodes = drawEventSegments(container, plot, "top", topEventSegments);
    if (topEventNodes.length > 1) {
      var topEventGroup = figma.group(topEventNodes, container);
      topEventGroup.name = "Top Events";
    }
  }
  if (bottomEvent && bottomEventSegments) {
    var bottomEventNodes = drawEventSegments(container, plot, "bottom", bottomEventSegments);
    if (bottomEventNodes.length > 1) {
      var bottomEventGroup = figma.group(bottomEventNodes, container);
      bottomEventGroup.name = "Bottom Events";
    }
  }

  if (legendLabels.length > 0 && legendRows.length > 0) {
    var legendY = plot.y + plot.h + PAD_BOTTOM + 5;
    var legendNodes = drawLegend(container, legendLeftBound, legendWidth, legendY, legendDisplayTexts, distinctColors, legendRows, legendItemWidths, 1, legendAlign);
    if (legendNodes.length > 1) {
      var legendGroup = figma.group(legendNodes, container);
      legendGroup.name = "Legend";
    }
  }

  var chartParams = {
    yValues: yValues,
    yUnit: yUnit,
    yLabels: yLabels,
    xLabels: xLabels,
    linesCount: linesCount,
    lineStyle: lineStyle,
    topEvent: topEvent,
    bottomEvent: bottomEvent,
    showLegend: showLegend,
    legendAlign: legendAlign,
    legendLabels: legendLabels,
    allSeries: allSeries,
    colors: distinctColors,
    lineColors: lineColors,
    customColors: customColors,
    topEventSegments: topEventSegments,
    bottomEventSegments: bottomEventSegments
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));

  if (reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (nestedParent) {
    nestedParent.insertChild(Math.max(0, Math.min(nestedIndex, nestedParent.children.length)), container);
    container.x = oldX;
    container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (replaceMode && target) {
    target.appendChild(container);
    container.x = oldX;
    container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? "Exact copy pasted!" : "Chart regenerated!");
  } else if (target) {
    target.appendChild(container);
    container.x = 0;
    container.y = 0;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify(exactData ? 'Exact copy pasted to "' + target.name + '"' : 'Chart added to "' + target.name + '"');
  } else {
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify(exactData ? "Exact copy pasted!" : "Line chart created!");
  }

  sendSelection();
}

// ─── Grid ───────────────────────────────────────────────────
function drawGrid(parent, p, yValues, xLabels) {
  var nodes = [];
  var overshoot = 6;

  // Horizontal lines at each Y value
  for (var i = 0; i < yValues.length; i++) {
    var yMin = Math.min.apply(null, yValues);
    var yMax = Math.max.apply(null, yValues);
    if (yMin === yMax) yMax = yMin + 100;
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h;

    var line = figma.createLine();
    line.x = p.x - overshoot;
    line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
    nodes.push(line);
  }

  // Vertical lines at each X label
  var gap = p.w / (xLabels.length - 1 || 1);
  for (var j = 0; j < xLabels.length; j++) {
    var x = p.x + gap * j;
    var vline = figma.createLine();
    vline.resize(p.h, 0);
    vline.rotation = -90;
    vline.x = x;
    vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
    nodes.push(vline);
  }

  return nodes;
}

// ─── Y axis labels ──────────────────────────────────────────
function drawYLabels(parent, p, yValues, yMin, yMax, yUnit, yLabels) {
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
    t.y = y;
    parent.appendChild(t);
    t.x = rightEdge - t.width;
    nodes.push(t);
  }
  return nodes;
}

// ─── X axis labels ──────────────────────────────────────────
function drawXLabels(parent, p, xLabels) {
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
    t.y = ly;
    parent.appendChild(t);

    if (j === 0) {
      t.x = cx;
    } else if (j === xLabels.length - 1) {
      t.x = cx - t.width;
    } else {
      t.x = cx - t.width / 2;
    }
    nodes.push(t);
  }
  return nodes;
}

// ─── Lines ──────────────────────────────────────────────────
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

    var pathData;
    if (lineStyle === "smooth" && points.length > 2) {
      // Monotone cubic interpolation (no overshoot)
      pathData = "M " + points[0].x + " " + points[0].y;
      var n = points.length;
      var tangents = [];
      for (var i = 0; i < n; i++) {
        if (i === 0) {
          tangents.push((points[1].y - points[0].y) / (points[1].x - points[0].x || 1));
        } else if (i === n - 1) {
          tangents.push((points[n - 1].y - points[n - 2].y) / (points[n - 1].x - points[n - 2].x || 1));
        } else {
          var m1 = (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x || 1);
          var m2 = (points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x || 1);
          if (m1 * m2 <= 0) {
            tangents.push(0);
          } else {
            tangents.push((m1 + m2) / 2);
          }
        }
      }
      for (var i = 0; i < n - 1; i++) {
        var dx = (points[i + 1].x - points[i].x) / 3;
        var cp1x = points[i].x + dx;
        var cp1y = points[i].y + tangents[i] * dx;
        var cp2x = points[i + 1].x - dx;
        var cp2y = points[i + 1].y - tangents[i + 1] * dx;
        cp1y = Math.max(p.y, Math.min(p.y + p.h, cp1y));
        cp2y = Math.max(p.y, Math.min(p.y + p.h, cp2y));
        pathData += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + points[i + 1].x + " " + points[i + 1].y;
      }
    } else {
      pathData = "M " + points[0].x + " " + points[0].y;
      for (var i = 1; i < points.length; i++) {
        pathData += " L " + points[i].x + " " + points[i].y;
      }
    }

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

// ─── Event bars ─────────────────────────────────────────────
var TOP_EVENT_COLORS = [
  { r: 0.506, g: 0.780, b: 0.518 },
  { r: 0.302, g: 0.686, b: 0.290 },
  { r: 0.698, g: 0.875, b: 0.541 },
  { r: 0.180, g: 0.545, b: 0.341 },
  { r: 0.565, g: 0.933, b: 0.565 },
];

var BOTTOM_EVENT_COLORS = [
  { r: 1.000, g: 0.200, b: 0.200 },
  { r: 1.000, g: 0.400, b: 0.400 },
  { r: 1.000, g: 0.600, b: 0.600 },
  { r: 0.690, g: 0.718, b: 0.773 },
  { r: 0.800, g: 0.820, b: 0.860 },
  { r: 0.478, g: 0.529, b: 0.612 },
];

var BAR_HEIGHT = 6;

function buildEventSegments(position) {
  // Segments use x and w as fractions of plot width (0..1) so the layout
  // is identical when re-rendered into a differently-sized frame.
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

function drawEventSegments(parent, p, position, segments) {
  var y = (position === "top") ? p.y - BAR_HEIGHT - 2 : p.y + p.h + 1;
  var nodes = [];
  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    var rect = figma.createRectangle();
    rect.x = p.x + s.x * p.w;
    rect.y = y;
    rect.resize(s.w * p.w, BAR_HEIGHT);
    rect.fills = [{ type: "SOLID", color: s.color, opacity: s.opacity }];
    parent.appendChild(rect);
    nodes.push(rect);
  }
  return nodes;
}

// ─── Legend ─────────────────────────────────────────────────
var LEGEND_LINE_W = 14;
var LEGEND_LINE_H = 2;
var LEGEND_LINE_TEXT_GAP = 6;
var LEGEND_ITEM_GAP = 12;
var LEGEND_ROW_H = 14;
var LEGEND_ROW_GAP = 2;
var LEGEND_MAX_ROWS_PER_PAGE = 3;

// Measure legend labels, truncating with ellipsis when a label exceeds maxTextWidth.
// Inter font must already be loaded. Returns { texts, widths } — display strings + their widths.
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
    // Binary search the longest prefix whose width with "…" fits.
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
// Returns rows as arrays of indices into the labels/widths arrays.
function packLegendRows(widths, availableWidth) {
  var rows = [];
  var current = [];
  var currentW = 0;
  for (var i = 0; i < widths.length; i++) {
    var itemW = LEGEND_LINE_W + LEGEND_LINE_TEXT_GAP + widths[i];
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
      rowTotalW += LEGEND_LINE_W + LEGEND_LINE_TEXT_GAP + widths[rowIdxs[k]];
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

      var rect = figma.createRectangle();
      rect.x = x;
      rect.y = rowY + 6;
      rect.resize(LEGEND_LINE_W, LEGEND_LINE_H);
      rect.cornerRadius = 1;
      rect.fills = [{ type: "SOLID", color: color }];
      parent.appendChild(rect);
      nodes.push(rect);

      var t = figma.createText();
      t.fontName = { family: "Inter", style: "Regular" };
      t.fontSize = 11;
      t.characters = labels[idx];
      t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
      t.x = x + LEGEND_LINE_W + LEGEND_LINE_TEXT_GAP;
      t.y = rowY;
      parent.appendChild(t);
      nodes.push(t);

      x += LEGEND_LINE_W + LEGEND_LINE_TEXT_GAP + widths[idx] + LEGEND_ITEM_GAP;
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

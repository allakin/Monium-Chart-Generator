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

var COLOR_GRID = { r: 0.898, g: 0.898, b: 0.898 };
var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 600;
var DEFAULT_H = 400;
var PAD_TOP = 10;
var PAD_RIGHT = 2;
var PAD_BOTTOM = 21;
var PAD_GAP = 8;

var CHART_NAME = "Chart Bar";

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
var lastSelectedFrameId = null;

function getSelectedFrame() {
  var sel = figma.currentPage.selection;
  if (sel.length === 1) {
    var n = sel[0];
    if (n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE") return n;
  }
  return null;
}

function getTargetFrame() {
  var f = getSelectedFrame();
  if (f) return f;
  if (lastSelectedFrameId) {
    var n = figma.getNodeById(lastSelectedFrameId);
    if (n && (n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE")) return n;
  }
  return null;
}

// ─── Chart detection ────────────────────────────────────────
function findChartFrame(frame) {
  if (frame.name === CHART_NAME) return frame;
  if ("children" in frame) {
    for (var i = 0; i < frame.children.length; i++) {
      var child = frame.children[i];
      if (child.name === CHART_NAME && child.type === "FRAME") return child;
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
  var texts = [];
  var rects = [];
  var groups = {};

  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === "GROUP") groups[c.name] = c;
    else if (c.type === "TEXT") texts.push(c);
    else if (c.type === "RECTANGLE") rects.push(c);
  }

  var yValues = [];
  var yUnit = "";
  var yLabels = null;
  var xLabels = [];
  var barsCount = 1;
  var orientation = "vertical";
  var barMode = "normal";
  var dense = false;
  var barGap = 1;
  var fillOpacity = 1;
  var topEvent = false;
  var bottomEvent = false;

  // Read from named groups
  if (groups["Y Labels"] && "children" in groups["Y Labels"]) {
    var yTexts = [];
    for (var i = 0; i < groups["Y Labels"].children.length; i++) {
      var yc = groups["Y Labels"].children[i];
      if (yc.type === "TEXT" && yc.characters.length > 0) yTexts.push(yc);
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
    var xTexts = [];
    for (var i = 0; i < groups["X Labels"].children.length; i++) {
      if (groups["X Labels"].children[i].type === "TEXT") xTexts.push(groups["X Labels"].children[i]);
    }
    xTexts.sort(function (a, b) { return a.x - b.x; });
    for (var i = 0; i < xTexts.length; i++) xLabels.push(xTexts[i].characters);
  }

  if (groups["Bars"] && "children" in groups["Bars"]) {
    var barRects = groups["Bars"].children;
    if (barRects.length > 0 && barRects[0].fills && barRects[0].fills.length > 0) {
      if (barRects[0].fills[0].opacity !== undefined) fillOpacity = barRects[0].fills[0].opacity;
    }

    if (barRects.length > 0) {
      // Detect orientation: in vertical, bars share the same bottom (baseline);
      // in horizontal, bars share the same left edge.
      var maxBottom = -Infinity, minLeft = Infinity;
      for (var i = 0; i < barRects.length; i++) {
        var b = barRects[i].y + barRects[i].height;
        if (b > maxBottom) maxBottom = b;
        if (barRects[i].x < minLeft) minLeft = barRects[i].x;
      }
      var atBottomCount = 0, atLeftCount = 0;
      for (var i = 0; i < barRects.length; i++) {
        if (Math.abs((barRects[i].y + barRects[i].height) - maxBottom) < 2) atBottomCount++;
        if (Math.abs(barRects[i].x - minLeft) < 2) atLeftCount++;
      }
      orientation = (atBottomCount >= atLeftCount) ? "vertical" : "horizontal";

      // Cluster bars by primary axis position (x for vertical, y for horizontal).
      // Bars at the same exact position = stacked together.
      var posKey = (orientation === "vertical") ? "x" : "y";
      var sortedBars = barRects.slice().sort(function (a, b) { return a[posKey] - b[posKey]; });
      var clusters = [];
      for (var i = 0; i < sortedBars.length; i++) {
        var pos = sortedBars[i][posKey];
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
        // Multiple bars share the same primary-axis position -> stacked
        barMode = "stacked";
        barsCount = Math.round(barsPerPosition);
        // Dense: positions span >> nCats (each category has multiple data points)
        dense = (distinctPositions > nCats * 1.5);
      } else {
        // All unique positions: either normal, normal+dense, or grouped
        var ratio = nBars / nCats;
        if (ratio <= 1.5) {
          barMode = "normal";
          barsCount = 1;
          dense = false;
        } else if (ratio >= 8 && ratio <= 12) {
          // ~10x bars per category: most likely normal + dense
          barMode = "normal";
          barsCount = 1;
          dense = true;
        } else {
          barMode = "grouped";
          barsCount = Math.max(2, Math.round(ratio));
          dense = false;
        }
      }
    }
  }

  topEvent = !!groups["Top Events"];
  bottomEvent = !!groups["Bottom Events"];

  // Fallback: flat children (old charts)
  if (yValues.length < 2 && texts.length > 0) {
    var frameH = chartFrame.height;
    var yLabelTexts = [];
    var xLabelTexts = [];
    for (var i = 0; i < texts.length; i++) {
      if (texts[i].y > frameH - PAD_BOTTOM - 5) xLabelTexts.push(texts[i]);
      else yLabelTexts.push(texts[i]);
    }
    xLabelTexts.sort(function (a, b) { return a.x - b.x; });
    yLabelTexts.sort(function (a, b) { return b.y - a.y; });
    xLabels = [];
    for (var i = 0; i < xLabelTexts.length; i++) xLabels.push(xLabelTexts[i].characters);
    var flatChars = [];
    for (var i = 0; i < yLabelTexts.length; i++) {
      if (yLabelTexts[i].characters.length > 0) flatChars.push(yLabelTexts[i].characters);
    }
    var parsedFlatY = parseYLabelTexts(flatChars);
    yValues = parsedFlatY.yValues;
    yUnit = parsedFlatY.yUnit;
    yLabels = parsedFlatY.yLabels;
    // Event detection from small rects
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

  return {
    yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels,
    barsCount: barsCount, orientation: orientation, barMode: barMode,
    dense: dense, barGap: barGap, fillOpacity: fillOpacity,
    topEvent: topEvent, bottomEvent: bottomEvent
  };
}

function sendSelection() {
  var f = getSelectedFrame();
  if (f) {
    lastSelectedFrameId = f.id;
    var chartFrame = findChartFrame(f);
    var chartData = chartFrame ? readChartParams(chartFrame) : null;
    figma.ui.postMessage({
      type: "selection", hasFrame: true,
      name: f.name, width: Math.round(f.width), height: Math.round(f.height),
      hasChart: !!chartData, chartData: chartData
    });
  }
}

// ─── Show UI ────────────────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 100 });
sendSelection();
figma.on("selectionchange", sendSelection);

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
  if (msg.type === "generate") { await renderChart(msg, null); return; }
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
  var barsCount = params.barsCount;
  var orientation = params.orientation || "vertical";
  var barMode = params.barMode || "normal";
  var dense = params.dense || false;
  var barGap = (params.barGap !== undefined) ? params.barGap : 1;
  var fillOpacity = (params.fillOpacity !== undefined) ? params.fillOpacity : 1;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));
  var yUnit = params.yUnit || "";
  var topEvent = params.topEvent || false;
  var bottomEvent = params.bottomEvent || false;
  var replaceMode = exactData ? true : (params.replace || false);

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!barsCount || barsCount < 1) barsCount = 2;
  if (barsCount > 20) barsCount = 20;
  var yLabels = resolveYLabels(params.yLabels, yValues);

  // Legend params
  var showLegend = (params.showLegend !== undefined)
    ? !!params.showLegend
    : ((params.legendLabels || []).length > 0);
  var legendAlign = params.legendAlign || "left";
  if (legendAlign !== "left" && legendAlign !== "center" && legendAlign !== "right") legendAlign = "left";
  var legendLabels = (params.legendLabels || []).filter(function (s) { return s && String(s).length > 0; });
  if (showLegend) {
    if (legendLabels.length > barsCount) {
      legendLabels = legendLabels.slice(0, barsCount);
    } else {
      for (var lpi = legendLabels.length; lpi < barsCount; lpi++) {
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
  var oldX = 0, oldY = 0;

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
        w = target.width; h = target.height;
        oldX = existingChart.x; oldY = existingChart.y;
        existingChart.remove();
      }
    }
  }

  if (!container) {
    w = target ? target.width : DEFAULT_W;
    h = target ? target.height : DEFAULT_H;
    container = figma.createFrame();
    container.name = CHART_NAME;
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  var categoriesCount = xLabels.length;
  if (barMode === "normal") barsCount = 1;

  var dataPointCount = categoriesCount;
  if (dense && (barMode === "normal" || barMode === "stacked")) {
    dataPointCount = categoriesCount * 10;
  }

  var allSeries;
  if (exactData && exactData.allSeries && exactData.allSeries.length === barsCount) {
    allSeries = exactData.allSeries;
  } else {
    allSeries = [];
    for (var li = 0; li < barsCount; li++) {
      var vals = [];
      for (var pi = 0; pi < dataPointCount; pi++) {
        vals.push(yMin + Math.random() * (yMax - yMin));
      }
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

  var maxLabelWidth = 0;
  if (orientation === "vertical") {
    var suffix = yUnit || "";
    for (var mi = 0; mi < yValues.length; mi++) {
      var measure = figma.createText();
      measure.fontName = { family: "Inter", style: "Regular" };
      measure.fontSize = 11;
      measure.characters = yLabels[mi] + suffix;
      if (measure.width > maxLabelWidth) maxLabelWidth = measure.width;
      measure.remove();
    }
  } else {
    for (var mi = 0; mi < xLabels.length; mi++) {
      var measure = figma.createText();
      measure.fontName = { family: "Inter", style: "Regular" };
      measure.fontSize = 11;
      measure.characters = xLabels[mi];
      if (measure.width > maxLabelWidth) maxLabelWidth = measure.width;
      measure.remove();
    }
  }
  var padLeft = maxLabelWidth + PAD_GAP + 2;

  // Pre-layout legend so plot height accounts for the actual rows/paginator.
  // Legend extent matches the plot (Y-axis-grid) horizontal range — same for
  // both vertical and horizontal orientations (legend always sits below).
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
    var maxTextWidth = Math.max(20, legendWidth - LEGEND_DOT_SIZE - LEGEND_LINE_TEXT_GAP);
    var measured = measureLegendItems(legendLabels, maxTextWidth);
    legendDisplayTexts = measured.texts;
    legendItemWidths = measured.widths;
    legendRows = packLegendRows(legendItemWidths, legendWidth);
    legendVisibleRows = Math.min(legendRows.length, LEGEND_MAX_ROWS_PER_PAGE);
    legendPaginated = legendRows.length > LEGEND_MAX_ROWS_PER_PAGE;
    legendTotalPages = Math.max(1, Math.ceil(legendRows.length / LEGEND_MAX_ROWS_PER_PAGE));
    legendBlockH = legendVisibleRows * LEGEND_ROW_H + Math.max(0, legendVisibleRows - 1) * LEGEND_ROW_GAP;
    if (legendPaginated) legendBlockH += 4 + 14;
  }
  var legendExtraBottom = (legendBlockH > 0) ? (legendBlockH + 8) : 0;

  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM - legendExtraBottom };

  var gridNodes, yLabelNodes, xLabelNodes;
  if (orientation === "vertical") {
    gridNodes = drawGridVertical(container, plot, yValues, xLabels, dataPointCount);
    yLabelNodes = drawValueLabelsLeft(container, plot, yValues, yMin, yMax, yUnit, yLabels);
    xLabelNodes = drawCategoryLabelsBottom(container, plot, xLabels);
  } else {
    gridNodes = drawGridHorizontal(container, plot, yValues, yMin, yMax, xLabels, dataPointCount);
    yLabelNodes = drawCategoryLabelsLeft(container, plot, xLabels);
    xLabelNodes = drawValueLabelsBottom(container, plot, yValues, yMin, yMax, yUnit, yLabels);
  }

  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === barsCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = selectDistinctColors(barsCount);
  }

  var topEventSegments = null;
  var bottomEventSegments = null;
  if (topEvent) {
    topEventSegments = (exactData && exactData.topEventSegments) ? exactData.topEventSegments : buildEventSegments("top");
  }
  if (bottomEvent) {
    bottomEventSegments = (exactData && exactData.bottomEventSegments) ? exactData.bottomEventSegments : buildEventSegments("bottom");
  }

  var barNodes = drawBars(container, plot, allSeries, yMin, yMax, barMode, orientation, distinctColors, dense, barGap, fillOpacity);

  // Group nodes
  if (gridNodes.length > 1) { var g = figma.group(gridNodes, container); g.name = "Grid"; }
  if (yLabelNodes.length > 1) { var g = figma.group(yLabelNodes, container); g.name = "Y Labels"; }
  if (xLabelNodes.length > 1) { var g = figma.group(xLabelNodes, container); g.name = "X Labels"; }
  if (barNodes.length > 1) { var g = figma.group(barNodes, container); g.name = "Bars"; }
  else if (barNodes.length === 1) { barNodes[0].name = "Bars"; container.appendChild(barNodes[0]); }

  if (topEvent && topEventSegments) {
    var evNodes = drawEventSegments(container, plot, "top", topEventSegments);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Top Events"; }
  }
  if (bottomEvent && bottomEventSegments) {
    var evNodes = drawEventSegments(container, plot, "bottom", bottomEventSegments);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Bottom Events"; }
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
    yValues: yValues, yUnit: yUnit, yLabels: yLabels, xLabels: xLabels,
    barsCount: barsCount, orientation: orientation, barMode: barMode,
    dense: dense, barGap: barGap, fillOpacity: fillOpacity,
    topEvent: topEvent, bottomEvent: bottomEvent,
    showLegend: showLegend,
    legendAlign: legendAlign,
    legendLabels: legendLabels,
    allSeries: allSeries,
    colors: distinctColors,
    topEventSegments: topEventSegments,
    bottomEventSegments: bottomEventSegments
  };
  container.setPluginData("chartParams", JSON.stringify(chartParams));

  if (reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([container]);
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
    figma.notify(exactData ? "Exact copy pasted!" : "Bar chart created!");
  }

  sendSelection();
}

// ─── Grid (vertical orientation) ────────────────────────────
function drawGridVertical(parent, p, yValues, xLabels, dataPointCount) {
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

// ─── Grid (horizontal orientation) ──────────────────────────
function drawGridHorizontal(parent, p, yValues, yMin, yMax, xLabels, dataPointCount) {
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

// ─── Value labels on left axis (vertical orientation) ───────
function drawValueLabelsLeft(parent, p, yValues, yMin, yMax, yUnit, yLabels) {
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

// ─── Category labels on bottom axis (vertical orientation) ──
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

// ─── Category labels on left axis (horizontal orientation) ──
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

// ─── Value labels on bottom axis (horizontal orientation) ───
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

// ─── Bars ───────────────────────────────────────────────────
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
          parent.appendChild(rect);
          nodes.push(rect);
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
          parent.appendChild(rect);
          nodes.push(rect);
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
          parent.appendChild(rect);
          nodes.push(rect);
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
          parent.appendChild(rect);
          nodes.push(rect);
        }
      }
    }
  }
  return nodes;
}

// ─── Event bars ─────────────────────────────────────────────
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
var BAR_HEIGHT = 6;

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
var LEGEND_DOT_SIZE = 8;
var LEGEND_LINE_TEXT_GAP = 6;
var LEGEND_ITEM_GAP = 12;
var LEGEND_ROW_H = 14;
var LEGEND_ROW_GAP = 2;
var LEGEND_MAX_ROWS_PER_PAGE = 3;

// Measure legend labels, truncating with ellipsis when a label exceeds maxTextWidth.
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

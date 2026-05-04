"use strict";

// ═══════════════════════════════════════════════════════════════
// Monium All Charts Generator — Unified Plugin
// Combines: Chart Line, Chart Bar, Chart Area, Chart Pie
// ═══════════════════════════════════════════════════════════════

// ─── Shared: Palette (75 colors) ───────────────────────────────
var PALETTE = [
  { r: 0.133, g: 0.184, b: 0.243 }, // #222F3E
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
  { r: 0.204, g: 0.286, b: 0.369 }, // #34495E
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
  { r: 0.239, g: 0.239, b: 0.239 }, // #3D3D3D
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
  { r: 0.173, g: 0.243, b: 0.314 }, // #2C3E50
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
  { r: 0.153, g: 0.235, b: 0.459 }, // #273C75
  { r: 0.098, g: 0.165, b: 0.337 }, // #192A56
  { r: 0.298, g: 0.820, b: 0.216 }, // #4CD137
  { r: 0.267, g: 0.741, b: 0.196 }, // #44BD32
  { r: 0.278, g: 0.494, b: 0.690 }, // #487EB0
  { r: 0.251, g: 0.451, b: 0.620 }, // #40739E
  { r: 0.882, g: 0.694, b: 0.173 }, // #E1B12C
  { r: 0.761, g: 0.212, b: 0.086 }, // #C23616
  { r: 0.549, g: 0.478, b: 0.902 }, // #8C7AE6
  { r: 0.612, g: 0.533, b: 1.000 }, // #9C88FF
  { r: 0.443, g: 0.502, b: 0.576 }, // #718093
  { r: 0.208, g: 0.231, b: 0.282 }, // #353B48
  { r: 0.482, g: 0.122, b: 0.635 }, // #7B1FA2
  { r: 0.000, g: 0.537, b: 0.482 }, // #00897B
  { r: 0.847, g: 0.106, b: 0.376 }, // #D81B60
];

// ─── Shared: Distinct color selection (greedy maximin) ─────────
function selectDistinctColors(count) {
  if (count >= PALETTE.length) {
    var all = PALETTE.slice();
    for (var si = all.length - 1; si > 0; si--) {
      var ri = Math.floor(Math.random() * (si + 1));
      var tmp = all[si]; all[si] = all[ri]; all[ri] = tmp;
    }
    return all;
  }
  var used = [];
  var available = [];
  for (var i = 0; i < PALETTE.length; i++) available.push(i);
  var firstIdx = Math.floor(Math.random() * available.length);
  used.push(available[firstIdx]);
  available.splice(firstIdx, 1);
  for (var pick = 1; pick < count; pick++) {
    var bestIdx = 0;
    var bestDist = -1;
    for (var j = 0; j < available.length; j++) {
      var c = PALETTE[available[j]];
      var minDist = Infinity;
      for (var k = 0; k < used.length; k++) {
        var u = PALETTE[used[k]];
        var dr = c.r - u.r; var dg = c.g - u.g; var db = c.b - u.b;
        var d = dr * dr + dg * dg + db * db;
        if (d < minDist) minDist = d;
      }
      if (minDist > bestDist) { bestDist = minDist; bestIdx = j; }
    }
    used.push(available[bestIdx]);
    available.splice(bestIdx, 1);
  }
  var result = [];
  for (var i = 0; i < used.length; i++) result.push(PALETTE[used[i]]);
  return result;
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

// ─── Shared: Selection tracking ────────────────────────────────
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

// ─── Shared: Chart detection (unified for all types) ───────────
function findChartFrame(frame) {
  for (var ni = 0; ni < CHART_NAMES.length; ni++) {
    if (frame.name === CHART_NAMES[ni]) return frame;
  }
  if ("children" in frame) {
    for (var i = 0; i < frame.children.length; i++) {
      var child = frame.children[i];
      if (child.type === "FRAME") {
        for (var ni = 0; ni < CHART_NAMES.length; ni++) {
          if (child.name === CHART_NAMES[ni]) return child;
        }
      }
    }
  }
  return null;
}

function detectChartType(chartFrame) {
  if (chartFrame.name === "Chart Line") return "line";
  if (chartFrame.name === "Chart Bar") return "bar";
  if (chartFrame.name === "Chart Area") return "area";
  if (chartFrame.name === "Chart Pie") return "pie";
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

// ─── Shared: Read axis labels from groups ──────────────────────
function readYLabelsFromGroup(group) {
  var yTexts = [];
  for (var i = 0; i < group.children.length; i++) {
    if (group.children[i].type === "TEXT") yTexts.push(group.children[i]);
  }
  yTexts.sort(function (a, b) { return b.y - a.y; });
  var yUnit = "";
  if (yTexts.length > 0) {
    var match = yTexts[0].characters.match(/^(-?\d+(?:\.\d+)?)(.*)/);
    if (match) yUnit = match[2] || "";
  }
  var yValues = [];
  for (var i = 0; i < yTexts.length; i++) {
    var numStr = yUnit ? yTexts[i].characters.replace(yUnit, "") : yTexts[i].characters;
    var num = parseFloat(numStr);
    if (!isNaN(num)) yValues.push(num);
  }
  return { yValues: yValues, yUnit: yUnit };
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

  var yUnit = "";
  var yValues = [];
  if (yLabelTexts.length > 0) {
    var match = yLabelTexts[0].characters.match(/^(-?\d+(?:\.\d+)?)(.*)/);
    if (match) yUnit = match[2] || "";
    for (var i = 0; i < yLabelTexts.length; i++) {
      var numStr = yUnit ? yLabelTexts[i].characters.replace(yUnit, "") : yLabelTexts[i].characters;
      var num = parseFloat(numStr);
      if (!isNaN(num)) yValues.push(num);
    }
  }
  return { yValues: yValues, yUnit: yUnit, xLabels: xLabels };
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

// ─── Fallback layer parser — delegated by chart type ───────────
function readChartParamsFromLayers(chartFrame) {
  var chartType = detectChartType(chartFrame);
  if (!chartType) return null;
  if (chartType === "pie") return readPieParamsFromLayers(chartFrame);
  return readAxisChartParamsFromLayers(chartFrame, chartType);
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
  var xLabels = [];
  var topEvent = !!groups["Top Events"];
  var bottomEvent = !!groups["Bottom Events"];

  if (groups["Y Labels"] && "children" in groups["Y Labels"]) {
    var parsed = readYLabelsFromGroup(groups["Y Labels"]);
    yValues = parsed.yValues;
    yUnit = parsed.yUnit;
  }
  if (groups["X Labels"] && "children" in groups["X Labels"]) {
    xLabels = readXLabelsFromGroup(groups["X Labels"]);
  }

  // Chart-type-specific data reading
  var result = { yValues: yValues, yUnit: yUnit, xLabels: xLabels, topEvent: topEvent, bottomEvent: bottomEvent, chartType: chartType };

  if (chartType === "line") {
    result.linesCount = 1;
    result.lineStyle = "smooth";
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
    if (groups["Bars"] && "children" in groups["Bars"]) {
      var barRects = groups["Bars"].children;
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
    xLabels = fallback.xLabels;
    result.yValues = yValues;
    result.yUnit = yUnit;
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
  result.yValues.sort(function (a, b) { return a - b; });
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

  if (groups["Slices"] && "children" in groups["Slices"]) {
    var slices = groups["Slices"].children;
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

  return {
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
}

// ─── Shared: Selection notification ────────────────────────────
function sendSelection() {
  var f = getSelectedFrame();
  if (f) {
    lastSelectedFrameId = f.id;
    var chartFrame = findChartFrame(f);
    var chartData = chartFrame ? readChartParams(chartFrame) : null;
    figma.ui.postMessage({
      type: "selection",
      hasFrame: true,
      name: f.name,
      width: Math.round(f.width),
      height: Math.round(f.height),
      hasChart: !!chartData,
      chartData: chartData
    });
  }
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
        // Chart is a child — remove it, position new one in its place
        w = target.width; h = target.height;
        oldX = existingChart.x; oldY = existingChart.y;
        existingChart.remove();
        replacedChild = true;
      }
    }
  }

  if (!container) {
    w = target ? target.width : defaultW;
    h = target ? target.height : defaultH;
    container = figma.createFrame();
    container.name = chartName;
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  return { container: container, target: target, w: w, h: h, reuseContainer: reuseContainer, replacedChild: replacedChild, oldX: oldX, oldY: oldY };
}

// ─── Shared: Insert container and notify ───────────────────────
function insertAndNotify(ctx, chartTypeName) {
  if (ctx.reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([ctx.container]);
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
function measureMaxLabelWidth(labels, suffix) {
  var maxW = 0;
  for (var mi = 0; mi < labels.length; mi++) {
    var measure = figma.createText();
    measure.fontName = { family: "Inter", style: "Regular" };
    measure.fontSize = 11;
    measure.characters = String(Math.round(labels[mi])) + (suffix || "");
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

// ─── Shared: Draw event bars ───────────────────────────────────
function drawEventBar(parent, p, position) {
  var nodes = [];
  var y = (position === "top") ? p.y - EVENT_BAR_HEIGHT - 2 : p.y + p.h + 1;
  var totalW = p.w;
  var x = p.x;
  var endX = p.x + totalW;

  while (x < endX) {
    x += totalW * 0.005 + Math.random() * totalW * 0.035;
    if (x >= endX) break;
    var segW = totalW * 0.02 + Math.random() * totalW * 0.06;
    if (x + segW > endX) segW = endX - x;
    if (segW < 1) break;
    var palette = (position === "top") ? TOP_EVENT_COLORS : BOTTOM_EVENT_COLORS;
    var color = palette[Math.floor(Math.random() * palette.length)];
    var rect = figma.createRectangle();
    rect.x = x; rect.y = y;
    rect.resize(segW, EVENT_BAR_HEIGHT);
    rect.fills = [{ type: "SOLID", color: color, opacity: 0.4 + Math.random() * 0.6 }];
    parent.appendChild(rect);
    nodes.push(rect);
    x += segW;
  }
  return nodes;
}

// ─── Shared: Draw events helper ────────────────────────────────
function drawEvents(container, plot, topEvent, bottomEvent) {
  if (topEvent) {
    var evNodes = drawEventBar(container, plot, "top");
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Top Events"; }
  }
  if (bottomEvent) {
    var evNodes = drawEventBar(container, plot, "bottom");
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
function drawYLabelsStandard(parent, p, yValues, yMin, yMax, yUnit) {
  var nodes = [];
  var rightEdge = p.x - 8;
  var suffix = yUnit || "";
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h - 7;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = String(Math.round(yValues[i])) + suffix;
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

function generateLineChart(msg) {
  var yValues = msg.yValues;
  var xLabels = msg.xLabels;
  var linesCount = msg.linesCount;
  var lineStyle = msg.lineStyle || "smooth";
  var yUnit = msg.yUnit || "";
  var topEvent = msg.topEvent || false;
  var bottomEvent = msg.bottomEvent || false;
  var replaceMode = msg.replace || false;

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!linesCount || linesCount < 1) linesCount = 2;
  if (linesCount > 20) linesCount = 20;

  var chartParams = { yValues: yValues, yUnit: yUnit, xLabels: xLabels, linesCount: linesCount, lineStyle: lineStyle, topEvent: topEvent, bottomEvent: bottomEvent };

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Line", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var pointCount = xLabels.length;
  var peakMultiplier = (lineStyle === "peak") ? 10 : 1;
  var dataPointCount = (pointCount - 1) * peakMultiplier + 1;

  var allSeries = [];
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

  var padLeft = measureMaxLabelWidth(yValues, yUnit) + PAD_GAP + 2;
  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM };

  var gridNodes = drawGridStandard(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit);
  var xLabelNodes = drawXLabelsStandard(container, plot, xLabels);
  var distinctColors = selectDistinctColors(linesCount);
  var lineNodes = drawLines(container, plot, allSeries, yMin, yMax, lineStyle, distinctColors);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(lineNodes, container, "Lines");
  drawEvents(container, plot, topEvent, bottomEvent);

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

function generateAreaChart(msg) {
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
  var replaceMode = msg.replace || false;

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!areasCount || areasCount < 1) areasCount = 2;
  if (areasCount > 20) areasCount = 20;
  if (fillOpacity === undefined || fillOpacity === null) fillOpacity = 0.3;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));

  var chartParams = { yValues: yValues, yUnit: yUnit, xLabels: xLabels, areasCount: areasCount, areaStyle: areaStyle, areaMode: areaMode, fillHeight: fillHeight, fillOpacity: fillOpacity, topEvent: topEvent, bottomEvent: bottomEvent };

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Area", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var pointCount = xLabels.length;
  var peakMultiplier = (areaStyle === "peak") ? 10 : 1;
  var dataPointCount = (pointCount - 1) * peakMultiplier + 1;

  var allSeries = [];
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

  if (areaMode === "stacked" && allSeries.length > 1) {
    var scaleFactor = (fillHeight ? 2 : 1) / areasCount;
    for (var si = 0; si < allSeries.length; si++) {
      for (var pi = 0; pi < allSeries[si].length; pi++) {
        allSeries[si][pi] = yMin + (allSeries[si][pi] - yMin) * scaleFactor;
      }
    }
  }

  var padLeft = measureMaxLabelWidth(yValues, yUnit) + PAD_GAP + 2;
  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM };

  var gridNodes = drawGridStandard(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit);
  var xLabelNodes = drawXLabelsStandard(container, plot, xLabels);
  var distinctColors = selectDistinctColors(areasCount);
  var areaNodes = drawAreas(container, plot, allSeries, yMin, yMax, areaStyle, areaMode, fillOpacity, distinctColors);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(areaNodes, container, "Areas");
  drawEvents(container, plot, topEvent, bottomEvent);

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

function drawValueLabelsBottom(parent, p, yValues, yMin, yMax, yUnit) {
  var nodes = [];
  var ly = p.y + p.h + 6;
  var suffix = yUnit || "";
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var x = p.x + ratio * p.w;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = String(Math.round(yValues[i])) + suffix;
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

function generateBarChart(msg) {
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
  var replaceMode = msg.replace || false;

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!barsCount || barsCount < 1) barsCount = 2;
  if (barsCount > 20) barsCount = 20;

  var chartParams = { yValues: yValues, yUnit: yUnit, xLabels: xLabels, barsCount: barsCount, orientation: orientation, barMode: barMode, dense: dense, barGap: barGap, fillOpacity: fillOpacity, topEvent: topEvent, bottomEvent: bottomEvent };

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var ctx = prepareContainer("Chart Bar", replaceMode, DEFAULT_W, DEFAULT_H);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var categoriesCount = xLabels.length;
  if (barMode === "normal") barsCount = 1;

  var dataPointCount = categoriesCount;
  if (dense && (barMode === "normal" || barMode === "stacked")) dataPointCount = categoriesCount * 10;

  var allSeries = [];
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

  var maxLabelWidth = 0;
  if (orientation === "vertical") {
    maxLabelWidth = measureMaxLabelWidth(yValues, yUnit);
  } else {
    maxLabelWidth = measureMaxTextWidth(xLabels);
  }
  var padLeft = maxLabelWidth + PAD_GAP + 2;
  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM };

  var gridNodes, yLabelNodes, xLabelNodes;
  if (orientation === "vertical") {
    gridNodes = drawGridVertical(container, plot, yValues, xLabels);
    yLabelNodes = drawYLabelsStandard(container, plot, yValues, yMin, yMax, yUnit);
    xLabelNodes = drawCategoryLabelsBottom(container, plot, xLabels);
  } else {
    gridNodes = drawGridHorizontal(container, plot, yValues, yMin, yMax, xLabels);
    yLabelNodes = drawCategoryLabelsLeft(container, plot, xLabels);
    xLabelNodes = drawValueLabelsBottom(container, plot, yValues, yMin, yMax, yUnit);
  }

  var distinctColors = selectDistinctColors(barsCount);
  var barNodes = drawBars(container, plot, allSeries, yMin, yMax, barMode, orientation, distinctColors, dense, barGap, fillOpacity);

  groupNodes(gridNodes, container, "Grid");
  groupNodes(yLabelNodes, container, "Y Labels");
  groupNodes(xLabelNodes, container, "X Labels");
  groupNodes(barNodes, container, "Bars");
  drawEvents(container, plot, topEvent, bottomEvent);

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
    t.characters = String(Math.round(values[i]));
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

function drawCenterTotal(parent, cx, cy, values) {
  var nodes = [];
  var total = 0;
  for (var i = 0; i < values.length; i++) total += values[i];
  var t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  t.fontSize = 28;
  t.characters = String(Math.round(total));
  t.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
  parent.appendChild(t);
  t.x = cx - t.width / 2; t.y = cy - t.height / 2;
  nodes.push(t);
  return nodes;
}

function generatePieChart(msg) {
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
  var replaceMode = msg.replace || false;

  if (!values || values.length < 1) {
    values = [];
    for (var i = 0; i < segmentsCount; i++) values.push(Math.round(5 + Math.random() * 195));
  }
  segmentsCount = values.length;

  var chartParams = { values: values, segmentsCount: segmentsCount, pieStyle: pieStyle, innerRadiusPct: innerRadiusPct, cornerRadius: cornerRadius, segmentGap: segmentGap, showLabels: showLabels, showTotal: showTotal, fillOpacity: fillOpacity };

  var ctx = prepareContainer("Chart Pie", replaceMode, 500, 500);
  var container = ctx.container;
  var w = ctx.w, h = ctx.h;

  var labelMargin = showLabels ? 60 : 10;
  var availableSize = Math.min(w, h) - labelMargin * 2;
  var outerR = availableSize / 2;
  var cx = w / 2; var cy = h / 2;
  var innerR = (pieStyle === "donut") ? outerR * (innerRadiusPct / 100) : 0;
  var cr = (pieStyle === "donut") ? cornerRadius : 0;

  var distinctColors = selectDistinctColors(segmentsCount);
  var sliceNodes = drawSlices(container, cx, cy, outerR, innerR, values, distinctColors, fillOpacity, cr, segmentGap);
  groupNodes(sliceNodes, container, "Slices");

  if (showLabels) {
    var labelNodes = drawPieValueLabels(container, cx, cy, outerR, values, 30);
    if (labelNodes.length > 1) { var g = figma.group(labelNodes, container); g.name = "Labels"; }
  }

  if (showTotal && pieStyle === "donut") {
    var totalNodes = drawCenterTotal(container, cx, cy, values);
    if (totalNodes.length > 0) { var g = figma.group(totalNodes, container); g.name = "Center Label"; }
  }

  container.setPluginData("chartParams", JSON.stringify(chartParams));
  insertAndNotify(ctx, "Pie");
}

// ═══════════════════════════════════════════════════════════════
//  MAIN: Show UI & Message Router
// ═══════════════════════════════════════════════════════════════

figma.showUI(__html__, { width: 300, height: 100 });
sendSelection();
figma.on("selectionchange", sendSelection);

figma.ui.onmessage = async function (msg) {
  if (msg.type === "resize") {
    figma.ui.resize(300, Math.min(msg.height, 900));
    return;
  }
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  var chartType = msg.chartType || "line";

  if (chartType === "line") generateLineChart(msg);
  else if (chartType === "area") generateAreaChart(msg);
  else if (chartType === "bar") generateBarChart(msg);
  else if (chartType === "pie") generatePieChart(msg);
};

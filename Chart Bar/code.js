"use strict";

// ─── Palette ────────────────────────────────────
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

// ─── Distinct color selection ───────────────────────────────
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
      if (groups["Y Labels"].children[i].type === "TEXT") yTexts.push(groups["Y Labels"].children[i]);
    }
    yTexts.sort(function (a, b) { return b.y - a.y; });
    if (yTexts.length > 0) {
      var match = yTexts[0].characters.match(/^(-?\d+(?:\.\d+)?)(.*)/);
      if (match) yUnit = match[2] || "";
    }
    for (var i = 0; i < yTexts.length; i++) {
      var numStr = yUnit ? yTexts[i].characters.replace(yUnit, "") : yTexts[i].characters;
      var num = parseFloat(numStr);
      if (!isNaN(num)) yValues.push(num);
    }
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
    yUnit = "";
    yValues = [];
    if (yLabelTexts.length > 0) {
      var match = yLabelTexts[0].characters.match(/^(-?\d+(?:\.\d+)?)(.*)/);
      if (match) yUnit = match[2] || "";
      for (var i = 0; i < yLabelTexts.length; i++) {
        var numStr = yUnit ? yLabelTexts[i].characters.replace(yUnit, "") : yLabelTexts[i].characters;
        var num = parseFloat(numStr);
        if (!isNaN(num)) yValues.push(num);
      }
    }
    // Event detection from small rects
    for (var i = 0; i < rects.length; i++) {
      if (Math.abs(rects[i].height - 6) < 1) {
        if (rects[i].y < PAD_TOP) topEvent = true;
        else bottomEvent = true;
      }
    }
  }

  if (yValues.length < 2) return null;
  yValues.sort(function (a, b) { return a - b; });

  return {
    yValues: yValues, yUnit: yUnit, xLabels: xLabels,
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
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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

  var chartParams = {
    yValues: yValues, yUnit: yUnit, xLabels: xLabels,
    barsCount: barsCount, orientation: orientation, barMode: barMode,
    dense: dense, barGap: barGap, fillOpacity: fillOpacity,
    topEvent: topEvent, bottomEvent: bottomEvent
  };

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

  var allSeries = [];
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

  var maxLabelWidth = 0;
  if (orientation === "vertical") {
    var suffix = yUnit || "";
    for (var mi = 0; mi < yValues.length; mi++) {
      var measure = figma.createText();
      measure.fontName = { family: "Inter", style: "Regular" };
      measure.fontSize = 11;
      measure.characters = String(Math.round(yValues[mi])) + suffix;
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

  var plot = { x: padLeft, y: PAD_TOP, w: w - padLeft - PAD_RIGHT, h: h - PAD_TOP - PAD_BOTTOM };

  var gridNodes, yLabelNodes, xLabelNodes;
  if (orientation === "vertical") {
    gridNodes = drawGridVertical(container, plot, yValues, xLabels, dataPointCount);
    yLabelNodes = drawValueLabelsLeft(container, plot, yValues, yMin, yMax, yUnit);
    xLabelNodes = drawCategoryLabelsBottom(container, plot, xLabels);
  } else {
    gridNodes = drawGridHorizontal(container, plot, yValues, yMin, yMax, xLabels, dataPointCount);
    yLabelNodes = drawCategoryLabelsLeft(container, plot, xLabels);
    xLabelNodes = drawValueLabelsBottom(container, plot, yValues, yMin, yMax, yUnit);
  }

  var distinctColors = selectDistinctColors(barsCount);

  var barNodes = drawBars(container, plot, allSeries, yMin, yMax, barMode, orientation, distinctColors, dense, barGap, fillOpacity);

  // Group nodes
  if (gridNodes.length > 1) { var g = figma.group(gridNodes, container); g.name = "Grid"; }
  if (yLabelNodes.length > 1) { var g = figma.group(yLabelNodes, container); g.name = "Y Labels"; }
  if (xLabelNodes.length > 1) { var g = figma.group(xLabelNodes, container); g.name = "X Labels"; }
  if (barNodes.length > 1) { var g = figma.group(barNodes, container); g.name = "Bars"; }
  else if (barNodes.length === 1) { barNodes[0].name = "Bars"; container.appendChild(barNodes[0]); }

  if (topEvent) {
    var evNodes = drawEventBar(container, plot, "top", xLabels.length);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Top Events"; }
  }
  if (bottomEvent) {
    var evNodes = drawEventBar(container, plot, "bottom", xLabels.length);
    if (evNodes.length > 1) { var g = figma.group(evNodes, container); g.name = "Bottom Events"; }
  }

  container.setPluginData("chartParams", JSON.stringify(chartParams));

  if (reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify("Chart regenerated!");
  } else if (replaceMode && target) {
    target.appendChild(container);
    container.x = oldX; container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify("Chart regenerated!");
  } else if (target) {
    target.appendChild(container);
    container.x = 0; container.y = 0;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify('Chart added to "' + target.name + '"');
  } else {
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify("Bar chart created!");
  }

  sendSelection();
};

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
function drawValueLabelsLeft(parent, p, yValues, yMin, yMax, yUnit) {
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

function drawEventBar(parent, p, position, pointCount) {
  var nodes = [];
  var y = (position === "top") ? p.y - BAR_HEIGHT - 2 : p.y + p.h + 1;
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
    rect.resize(segW, BAR_HEIGHT);
    rect.fills = [{ type: "SOLID", color: color, opacity: 0.4 + Math.random() * 0.6 }];
    parent.appendChild(rect);
    nodes.push(rect);
    x += segW;
  }
  return nodes;
}

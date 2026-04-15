"use strict";

// ─── Palette (20 colors) ────────────────────────────────────
var PALETTE = [
  { r: 0.302, g: 0.486, b: 0.996 }, // #4D7CFE
  { r: 0.424, g: 0.361, b: 0.906 }, // #6C5CE7
  { r: 0.000, g: 0.769, b: 0.549 }, // #00C48C
  { r: 1.000, g: 0.392, b: 0.486 }, // #FF647C
  { r: 1.000, g: 0.635, b: 0.420 }, // #FFA26B
  { r: 0.043, g: 0.741, b: 0.890 }, // #0ABDE3
  { r: 0.373, g: 0.153, b: 0.804 }, // #5F27CD
  { r: 0.063, g: 0.675, b: 0.518 }, // #10AC84
  { r: 0.933, g: 0.353, b: 0.141 }, // #EE5A24
  { r: 0.992, g: 0.655, b: 0.875 }, // #FDA7DF
  { r: 0.106, g: 0.612, b: 0.988 }, // #1B9CFC
  { r: 0.220, g: 0.557, b: 0.675 }, // #3890AC
  { r: 0.345, g: 0.694, b: 0.624 }, // #58B19F
  { r: 0.702, g: 0.216, b: 0.443 }, // #B33771
  { r: 0.231, g: 0.231, b: 0.596 }, // #3B3B98
  { r: 0.992, g: 0.447, b: 0.447 }, // #FD7272
  { r: 0.604, g: 0.925, b: 0.859 }, // #9AECDB
  { r: 0.839, g: 0.635, b: 0.910 }, // #D6A2E8
  { r: 0.510, g: 0.345, b: 0.624 }, // #82589F
  { r: 0.431, g: 0.298, b: 0.702 }, // #6E4CB3
];

var COLOR_GRID = { r: 0.898, g: 0.898, b: 0.898 };
var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 600;
var DEFAULT_H = 400;
var PAD_TOP = 10;
var PAD_RIGHT = 2;
var PAD_BOTTOM = 21;
var PAD_GAP = 8;

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

function sendSelection() {
  var f = getSelectedFrame();
  if (f) {
    lastSelectedFrameId = f.id;
    figma.ui.postMessage({ type: "selection", hasFrame: true, name: f.name, width: Math.round(f.width), height: Math.round(f.height) });
  }
}

// ─── Show UI ────────────────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 830 });
sendSelection();
figma.on("selectionchange", sendSelection);

// ─── Message handler ────────────────────────────────────────
figma.ui.onmessage = async function(msg) {
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

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!barsCount || barsCount < 1) barsCount = 2;
  if (barsCount > 20) barsCount = 20;

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var target = getTargetFrame();
  var w = target ? target.width : DEFAULT_W;
  var h = target ? target.height : DEFAULT_H;

  var categoriesCount = xLabels.length;

  // Normal mode: single series (one bar per category)
  if (barMode === "normal") barsCount = 1;

  // Dense mode: multiply data points for frequent bars
  var dataPointCount = categoriesCount;
  if (dense && (barMode === "normal" || barMode === "stacked")) {
    dataPointCount = categoriesCount * 10;
  }

  // Generate random data for each series and data point
  var allSeries = [];
  for (var li = 0; li < barsCount; li++) {
    var vals = [];
    for (var pi = 0; pi < dataPointCount; pi++) {
      vals.push(yMin + Math.random() * (yMax - yMin));
    }
    allSeries.push(vals);
  }

  // Scale for stacked mode so total fits within yMax
  if (barMode === "stacked" && allSeries.length > 1) {
    var scaleFactor = 1 / barsCount;
    for (var si = 0; si < allSeries.length; si++) {
      for (var pi = 0; pi < allSeries[si].length; pi++) {
        allSeries[si][pi] = yMin + (allSeries[si][pi] - yMin) * scaleFactor;
      }
    }
  }

  // Measure widest label for left padding
  var maxLabelWidth = 0;
  if (orientation === "vertical") {
    // Left axis = value labels
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
    // Horizontal: left axis = category labels
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

  // Build chart
  var container = figma.createFrame();
  container.name = "Chart Bar";
  container.resize(w, h);
  container.fills = [];
  container.clipsContent = true;

  var plot = {
    x: padLeft,
    y: PAD_TOP,
    w: w - padLeft - PAD_RIGHT,
    h: h - PAD_TOP - PAD_BOTTOM
  };

  // Draw grid and labels based on orientation
  if (orientation === "vertical") {
    drawGridVertical(container, plot, yValues, xLabels, dataPointCount);
    drawValueLabelsLeft(container, plot, yValues, yMin, yMax, yUnit);
    drawCategoryLabelsBottom(container, plot, xLabels);
  } else {
    drawGridHorizontal(container, plot, yValues, yMin, yMax, xLabels, dataPointCount);
    drawCategoryLabelsLeft(container, plot, xLabels);
    drawValueLabelsBottom(container, plot, yValues, yMin, yMax, yUnit);
  }

  // Shuffle palette
  var shuffled = PALETTE.slice();
  for (var si = shuffled.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = shuffled[si]; shuffled[si] = shuffled[ri]; shuffled[ri] = tmp;
  }

  drawBars(container, plot, allSeries, yMin, yMax, barMode, orientation, shuffled, dense, barGap, fillOpacity);

  if (topEvent) drawEventBar(container, plot, "top", xLabels.length);
  if (bottomEvent) drawEventBar(container, plot, "bottom", xLabels.length);

  // Insert
  if (target) {
    target.appendChild(container);
    container.x = 0;
    container.y = 0;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify('Chart added to "' + target.name + '"');
  } else {
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify("Bar chart created!");
  }
};

// ─── Grid (vertical orientation) ────────────────────────────
function drawGridVertical(parent, p, yValues, xLabels, dataPointCount) {
  var overshoot = 6;
  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  // Horizontal grid lines at Y value positions
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var y = p.y + p.h - ratio * p.h;

    var line = figma.createLine();
    line.x = p.x - overshoot;
    line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
  }

  // Vertical grid lines at X label positions
  var labelSlotW = p.w / xLabels.length;
  for (var j = 0; j < xLabels.length; j++) {
    var x = p.x + labelSlotW * j + labelSlotW / 2;

    var vline = figma.createLine();
    vline.resize(p.h, 0);
    vline.rotation = -90;
    vline.x = x;
    vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
  }
}

// ─── Grid (horizontal orientation) ──────────────────────────
function drawGridHorizontal(parent, p, yValues, yMin, yMax, xLabels, dataPointCount) {
  var overshoot = 6;

  // Vertical grid lines at value positions along X axis
  for (var i = 0; i < yValues.length; i++) {
    var ratio = (yValues[i] - yMin) / (yMax - yMin);
    var x = p.x + ratio * p.w;

    var vline = figma.createLine();
    vline.resize(p.h + overshoot, 0);
    vline.rotation = -90;
    vline.x = x;
    vline.y = p.y;
    vline.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    vline.strokeWeight = 0.5;
    parent.appendChild(vline);
  }

  // Horizontal grid lines at category positions
  var labelSlotH = p.h / xLabels.length;
  for (var j = 0; j < xLabels.length; j++) {
    var y = p.y + labelSlotH * j + labelSlotH / 2;

    var line = figma.createLine();
    line.x = p.x - overshoot;
    line.y = y;
    line.resize(p.w + overshoot, 0);
    line.strokes = [{ type: "SOLID", color: COLOR_GRID }];
    line.strokeWeight = 0.5;
    parent.appendChild(line);
  }
}

// ─── Value labels on left axis (vertical orientation) ───────
function drawValueLabelsLeft(parent, p, yValues, yMin, yMax, yUnit) {
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
    t.y = y;
    parent.appendChild(t);
    t.x = rightEdge - t.width;
  }
}

// ─── Category labels on bottom axis (vertical orientation) ──
function drawCategoryLabelsBottom(parent, p, xLabels) {
  var slotW = p.w / xLabels.length;
  var ly = p.y + p.h + 6;

  for (var j = 0; j < xLabels.length; j++) {
    var cx = p.x + slotW * j + slotW / 2;
    var t = figma.createText();
    t.fontName = { family: "Inter", style: "Regular" };
    t.characters = xLabels[j];
    t.fontSize = 11;
    t.fills = [{ type: "SOLID", color: COLOR_AXIS, opacity: AXIS_OPACITY }];
    t.y = ly;
    parent.appendChild(t);
    t.x = cx - t.width / 2;
  }
}

// ─── Category labels on left axis (horizontal orientation) ──
function drawCategoryLabelsLeft(parent, p, xLabels) {
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
  }
}

// ─── Value labels on bottom axis (horizontal orientation) ───
function drawValueLabelsBottom(parent, p, yValues, yMin, yMax, yUnit) {
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
    t.y = ly;
    parent.appendChild(t);

    if (i === 0) {
      t.x = x;
    } else if (i === yValues.length - 1) {
      t.x = x - t.width;
    } else {
      t.x = x - t.width / 2;
    }
  }
}

// ─── Bars ───────────────────────────────────────────────────
function drawBars(parent, p, allSeries, yMin, yMax, barMode, orientation, colors, dense, barGap, fillOpacity) {
  var range = yMax - yMin;
  if (range === 0) range = 100;

  var categoriesCount = allSeries[0].length;
  var seriesCount = allSeries.length;

  if (orientation === "vertical") {
    var slotW = p.w / categoriesCount;

    if (barMode === "grouped") {
      // Grouped: fixed 70% ratio, 1px internal gap
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
          rect.x = barX;
          rect.y = Math.max(p.y, barY);
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect);
        }
      }
    } else {
      // Normal / Stacked: barGap from UI
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
          if (barH < 1) barH = 1;

          var barY = p.y + p.h - cumulativeH - barH;
          // Clamp to plot area
          if (barY < p.y) {
            barH = barH - (p.y - barY);
            barY = p.y;
          }
          if (barH < 1) barH = 1;
          cumulativeH += ratio * p.h;

          var rect = figma.createRectangle();
          rect.x = barX;
          rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect);
        }
      }
    }
  } else {
    // Horizontal orientation
    var slotH = p.h / categoriesCount;

    if (barMode === "grouped") {
      // Grouped: fixed 70% ratio, 1px internal gap
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
          var barX = p.x;

          var rect = figma.createRectangle();
          rect.x = barX;
          rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect);
        }
      }
    } else {
      // Normal / Stacked: barGap from UI
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
          if (barW < 1) barW = 1;

          var barX = p.x + cumulativeW;
          // Clamp to plot area
          if (barX + barW > p.x + p.w) {
            barW = p.x + p.w - barX;
          }
          if (barW < 1) barW = 1;
          cumulativeW += ratio * p.w;

          var rect = figma.createRectangle();
          rect.x = barX;
          rect.y = barY;
          rect.resize(barW, barH);
          rect.fills = [{ type: "SOLID", color: colors[si % colors.length], opacity: fillOpacity }];
          parent.appendChild(rect);
        }
      }
    }
  }
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

function drawEventBar(parent, p, position, pointCount) {
  var y;
  if (position === "top") {
    y = p.y - BAR_HEIGHT - 2;
  } else {
    y = p.y + p.h + 1;
  }

  var totalW = p.w;
  var segMinW = totalW * 0.02;
  var segMaxW = totalW * 0.08;
  var gapMinW = totalW * 0.005;
  var gapMaxW = totalW * 0.04;

  var x = p.x;
  var endX = p.x + totalW;

  while (x < endX) {
    var gap = gapMinW + Math.random() * (gapMaxW - gapMinW);
    x += gap;
    if (x >= endX) break;

    var segW = segMinW + Math.random() * (segMaxW - segMinW);
    if (x + segW > endX) segW = endX - x;
    if (segW < 1) break;

    var palette = (position === "top") ? TOP_EVENT_COLORS : BOTTOM_EVENT_COLORS;
    var color = palette[Math.floor(Math.random() * palette.length)];
    var opacity = 0.4 + Math.random() * 0.6;

    var rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(segW, BAR_HEIGHT);
    rect.fills = [{ type: "SOLID", color: color, opacity: opacity }];
    parent.appendChild(rect);

    x += segW;
  }
}

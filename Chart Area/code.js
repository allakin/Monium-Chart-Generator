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
figma.showUI(__html__, { width: 300, height: 720 });
sendSelection();
figma.on("selectionchange", sendSelection);

// ─── Message handler ────────────────────────────────────────
figma.ui.onmessage = async function(msg) {
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  var yValues = msg.yValues;
  var xLabels = msg.xLabels;
  var areasCount = msg.areasCount;
  var areaStyle = msg.areaStyle || "smooth";
  var areaMode = msg.areaMode || "overlap";
  var fillOpacity = msg.fillOpacity;
  var yUnit = msg.yUnit || "";
  var topEvent = msg.topEvent || false;
  var bottomEvent = msg.bottomEvent || false;

  if (!yValues || yValues.length < 2) yValues = [0, 50, 100, 150, 200];
  if (!xLabels || xLabels.length < 1) xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (!areasCount || areasCount < 1) areasCount = 2;
  if (areasCount > 20) areasCount = 20;
  if (fillOpacity === undefined || fillOpacity === null) fillOpacity = 0.3;
  fillOpacity = Math.max(0.05, Math.min(1, fillOpacity));

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var target = getTargetFrame();
  var w = target ? target.width : DEFAULT_W;
  var h = target ? target.height : DEFAULT_H;

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

  // For stacked mode, accumulate series values
  if (areaMode === "stacked" && allSeries.length > 1) {
    // Scale down values so stacked total fits in yMax
    var scaleFactor = 1 / areasCount;
    for (var si = 0; si < allSeries.length; si++) {
      for (var pi = 0; pi < allSeries[si].length; pi++) {
        allSeries[si][pi] = yMin + (allSeries[si][pi] - yMin) * scaleFactor;
      }
    }
  }

  // Measure widest Y label to calculate left padding
  var maxLabelWidth = 0;
  for (var mi = 0; mi < yValues.length; mi++) {
    var measure = figma.createText();
    measure.fontName = { family: "Inter", style: "Regular" };
    measure.fontSize = 11;
    measure.characters = String(Math.round(yValues[mi])) + (yUnit ? yUnit : "");
    if (measure.width > maxLabelWidth) maxLabelWidth = measure.width;
    measure.remove();
  }
  var padLeft = maxLabelWidth + PAD_GAP + 2;

  // Build chart
  var container = figma.createFrame();
  container.name = "Chart Area";
  container.resize(w, h);
  container.fills = [];
  container.clipsContent = true;

  var plot = {
    x: padLeft,
    y: PAD_TOP,
    w: w - padLeft - PAD_RIGHT,
    h: h - PAD_TOP - PAD_BOTTOM
  };

  drawGrid(container, plot, yValues, xLabels);
  drawYLabels(container, plot, yValues, yMin, yMax, yUnit);
  drawXLabels(container, plot, xLabels);

  // Shuffle palette
  var shuffled = PALETTE.slice();
  for (var si = shuffled.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = shuffled[si]; shuffled[si] = shuffled[ri]; shuffled[ri] = tmp;
  }

  drawAreas(container, plot, allSeries, yMin, yMax, areaStyle, areaMode, fillOpacity, shuffled);

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
    figma.notify("Area chart created!");
  }
};

// ─── Grid ───────────────────────────────────────────────────
function drawGrid(parent, p, yValues, xLabels) {
  var overshoot = 6;

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
  }

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
  }
}

// ─── Y axis labels ──────────────────────────────────────────
function drawYLabels(parent, p, yValues, yMin, yMax, yUnit) {
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

// ─── X axis labels ──────────────────────────────────────────
function drawXLabels(parent, p, xLabels) {
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
  }
}

// ─── Areas ──────────────────────────────────────────────────
function drawAreas(parent, p, allSeries, yMin, yMax, areaStyle, areaMode, fillOpacity, colors) {
  var range = yMax - yMin;
  if (range === 0) range = 100;

  var baselineY = p.y + p.h; // bottom of plot area

  // For stacked mode, maintain cumulative baselines
  var cumulativeVals = null;
  if (areaMode === "stacked") {
    cumulativeVals = [];
    for (var pi = 0; pi < allSeries[0].length; pi++) {
      cumulativeVals.push(yMin);
    }
  }

  // Draw areas back-to-front for overlap mode, bottom-to-top for stacked
  for (var li = 0; li < allSeries.length; li++) {
    var vals = allSeries[li];
    var color = colors[li % colors.length];
    var count = vals.length;
    var gap = p.w / (count - 1 || 1);

    // Calculate top points for this series
    var topPoints = [];
    var bottomPoints = [];

    for (var pi = 0; pi < count; pi++) {
      var x = p.x + gap * pi;

      if (areaMode === "stacked") {
        var stackedVal = cumulativeVals[pi] + (vals[pi] - yMin);
        var topRatio = (stackedVal - yMin) / range;
        var topY = p.y + p.h - topRatio * p.h;
        topPoints.push({ x: x, y: topY });

        var bottomRatio = (cumulativeVals[pi] - yMin) / range;
        var bottomY = p.y + p.h - bottomRatio * p.h;
        bottomPoints.push({ x: x, y: bottomY });

        // Update cumulative
        cumulativeVals[pi] = stackedVal;
      } else {
        var ratio = (vals[pi] - yMin) / range;
        var y = p.y + p.h - ratio * p.h;
        topPoints.push({ x: x, y: y });
        bottomPoints.push({ x: x, y: baselineY });
      }
    }

    // Build the top path (data curve)
    var topPath = buildCurvePath(topPoints, areaStyle, p);

    // Build the bottom path (baseline or previous series curve)
    var bottomPath;
    if (areaMode === "stacked" && li > 0) {
      // Reverse bottom points and use same curve style so edges match exactly
      var revBottom = bottomPoints.slice().reverse();
      bottomPath = buildCurvePathContinuation(revBottom, areaStyle, p);
    } else {
      // Simple straight baseline
      bottomPath = " L " + topPoints[topPoints.length - 1].x + " " + baselineY +
                   " L " + topPoints[0].x + " " + baselineY;
    }

    var fullPath = topPath + bottomPath + " Z";

    // Create filled area with stroke on closed shape (avoids artifacts on open paths)
    var areaVec = figma.createVector();
    areaVec.vectorPaths = [{ windingRule: "NONZERO", data: fullPath }];
    areaVec.fills = [{ type: "SOLID", color: color, opacity: fillOpacity }];
    areaVec.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.4 }];
    areaVec.strokeWeight = 0.2;
    areaVec.strokeAlign = "INSIDE";
    areaVec.strokeJoin = "ROUND";
    parent.appendChild(areaVec);
  }
}

// Build curve path from points (top line of area)
function buildCurvePath(points, style, p) {
  var pathData = "M " + points[0].x + " " + points[0].y;

  if (style === "smooth" && points.length > 2) {
    var n = points.length;
    var tangents = [];
    for (var i = 0; i < n; i++) {
      if (i === 0) {
        tangents.push((points[1].y - points[0].y) / (points[1].x - points[0].x || 1));
      } else if (i === n - 1) {
        tangents.push((points[n-1].y - points[n-2].y) / (points[n-1].x - points[n-2].x || 1));
      } else {
        var m1 = (points[i].y - points[i-1].y) / (points[i].x - points[i-1].x || 1);
        var m2 = (points[i+1].y - points[i].y) / (points[i+1].x - points[i].x || 1);
        if (m1 * m2 <= 0) {
          tangents.push(0);
        } else {
          tangents.push((m1 + m2) / 2);
        }
      }
    }
    for (var i = 0; i < n - 1; i++) {
      var dx = (points[i+1].x - points[i].x) / 3;
      var cp1x = points[i].x + dx;
      var cp1y = points[i].y + tangents[i] * dx;
      var cp2x = points[i+1].x - dx;
      var cp2y = points[i+1].y - tangents[i+1] * dx;
      cp1y = Math.max(p.y, Math.min(p.y + p.h, cp1y));
      cp2y = Math.max(p.y, Math.min(p.y + p.h, cp2y));
      pathData += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + points[i+1].x + " " + points[i+1].y;
    }
  } else {
    for (var i = 1; i < points.length; i++) {
      pathData += " L " + points[i].x + " " + points[i].y;
    }
  }

  return pathData;
}

// Build curve path continuation (no M, starts with L/C) for stacked bottom edges
function buildCurvePathContinuation(points, style, p) {
  var pathData = " L " + points[0].x + " " + points[0].y;

  if (style === "smooth" && points.length > 2) {
    var n = points.length;
    var tangents = [];
    for (var i = 0; i < n; i++) {
      if (i === 0) {
        tangents.push((points[1].y - points[0].y) / (points[1].x - points[0].x || 1));
      } else if (i === n - 1) {
        tangents.push((points[n-1].y - points[n-2].y) / (points[n-1].x - points[n-2].x || 1));
      } else {
        var m1 = (points[i].y - points[i-1].y) / (points[i].x - points[i-1].x || 1);
        var m2 = (points[i+1].y - points[i].y) / (points[i+1].x - points[i].x || 1);
        if (m1 * m2 <= 0) {
          tangents.push(0);
        } else {
          tangents.push((m1 + m2) / 2);
        }
      }
    }
    for (var i = 0; i < n - 1; i++) {
      var dx = (points[i+1].x - points[i].x) / 3;
      var cp1x = points[i].x + dx;
      var cp1y = points[i].y + tangents[i] * dx;
      var cp2x = points[i+1].x - dx;
      var cp2y = points[i+1].y - tangents[i+1] * dx;
      cp1y = Math.max(p.y, Math.min(p.y + p.h, cp1y));
      cp2y = Math.max(p.y, Math.min(p.y + p.h, cp2y));
      pathData += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + points[i+1].x + " " + points[i+1].y;
    }
  } else {
    for (var i = 1; i < points.length; i++) {
      pathData += " L " + points[i].x + " " + points[i].y;
    }
  }

  return pathData;
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

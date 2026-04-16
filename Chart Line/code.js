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
var PAD_GAP = 8; // gap between Y labels and plot area

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
  // Check if the frame itself is a "Chart Line"
  if (frame.name === "Chart Line") return frame;
  // Check direct children
  if ("children" in frame) {
    for (var i = 0; i < frame.children.length; i++) {
      var child = frame.children[i];
      if (child.name === "Chart Line" && child.type === "FRAME") return child;
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
      if (yGroup.children[i].type === "TEXT") yTexts.push(yGroup.children[i]);
    }
    yTexts.sort(function (a, b) { return b.y - a.y; });
    if (yTexts.length > 0) {
      var sample = yTexts[0].characters;
      var match = sample.match(/^(-?\d+(?:\.\d+)?)(.*)/);
      if (match) yUnit = match[2] || "";
    }
    for (var i = 0; i < yTexts.length; i++) {
      var numStr = yUnit ? yTexts[i].characters.replace(yUnit, "") : yTexts[i].characters;
      var num = parseFloat(numStr);
      if (!isNaN(num)) yValues.push(num);
    }
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

    yUnit = "";
    yValues = [];
    if (yLabelTexts.length > 0) {
      var sample = yLabelTexts[0].characters;
      var match = sample.match(/^(-?\d+(?:\.\d+)?)(.*)/);
      if (match) yUnit = match[2] || "";
      for (var i = 0; i < yLabelTexts.length; i++) {
        var numStr = yUnit ? yLabelTexts[i].characters.replace(yUnit, "") : yLabelTexts[i].characters;
        var num = parseFloat(numStr);
        if (!isNaN(num)) yValues.push(num);
      }
    }

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

  yValues.sort(function (a, b) { return a - b; });

  return {
    yValues: yValues,
    yUnit: yUnit,
    xLabels: xLabels,
    linesCount: linesCount,
    lineStyle: lineStyle,
    topEvent: topEvent,
    bottomEvent: bottomEvent
  };
}

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

// ─── Show UI ────────────────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 620 });
sendSelection();
figma.on("selectionchange", sendSelection);

// ─── Message handler ────────────────────────────────────────
figma.ui.onmessage = async function (msg) {
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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

  var chartParams = {
    yValues: yValues,
    yUnit: yUnit,
    xLabels: xLabels,
    linesCount: linesCount,
    lineStyle: lineStyle,
    topEvent: topEvent,
    bottomEvent: bottomEvent
  };

  var yMin = Math.min.apply(null, yValues);
  var yMax = Math.max.apply(null, yValues);
  if (yMin === yMax) yMax = yMin + 100;

  var target = getTargetFrame();
  var w, h;
  var container = null;
  var reuseContainer = false;
  var oldX = 0;
  var oldY = 0;

  // ── Handle replacement ──
  if (replaceMode && target) {
    var existingChart = findChartFrame(target);
    if (existingChart) {
      if (existingChart.id === target.id) {
        // Selected frame IS the chart — clear children, reuse frame
        w = target.width;
        h = target.height;
        var kids = [];
        for (var ki = 0; ki < target.children.length; ki++) kids.push(target.children[ki]);
        for (var ki = 0; ki < kids.length; ki++) kids[ki].remove();
        container = target;
        reuseContainer = true;
      } else {
        // Chart is a child — remove it, create new one
        w = target.width;
        h = target.height;
        oldX = existingChart.x;
        oldY = existingChart.y;
        existingChart.remove();
      }
    }
  }

  if (!container) {
    w = target ? target.width : DEFAULT_W;
    h = target ? target.height : DEFAULT_H;
    container = figma.createFrame();
    container.name = "Chart Line";
    container.resize(w, h);
    container.fills = [];
    container.clipsContent = true;
  }

  // Generate random data for each line
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

  var plot = {
    x: padLeft,
    y: PAD_TOP,
    w: w - padLeft - PAD_RIGHT,
    h: h - PAD_TOP - PAD_BOTTOM
  };

  // Draw chart elements and collect nodes for grouping
  var gridNodes = drawGrid(container, plot, yValues, xLabels);
  var yLabelNodes = drawYLabels(container, plot, yValues, yMin, yMax, yUnit);
  var xLabelNodes = drawXLabels(container, plot, xLabels);

  // Shuffle palette for random colors
  var shuffled = PALETTE.slice();
  for (var si = shuffled.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = shuffled[si]; shuffled[si] = shuffled[ri]; shuffled[ri] = tmp;
  }
  var lineNodes = drawLines(container, plot, allSeries, yMin, yMax, lineStyle, shuffled);

  // Group nodes
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
  }

  if (topEvent) {
    var topEventNodes = drawEventBar(container, plot, "top", xLabels.length);
    if (topEventNodes.length > 1) {
      var topEventGroup = figma.group(topEventNodes, container);
      topEventGroup.name = "Top Events";
    }
  }
  if (bottomEvent) {
    var bottomEventNodes = drawEventBar(container, plot, "bottom", xLabels.length);
    if (bottomEventNodes.length > 1) {
      var bottomEventGroup = figma.group(bottomEventNodes, container);
      bottomEventGroup.name = "Bottom Events";
    }
  }

  // Store chart parameters for re-generation
  container.setPluginData("chartParams", JSON.stringify(chartParams));

  // Insert
  if (reuseContainer) {
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify("Chart regenerated!");
  } else if (replaceMode && target) {
    target.appendChild(container);
    container.x = oldX;
    container.y = oldY;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify("Chart regenerated!");
  } else if (target) {
    target.appendChild(container);
    container.x = 0;
    container.y = 0;
    figma.viewport.scrollAndZoomIntoView([target]);
    figma.notify('Chart added to "' + target.name + '"');
  } else {
    figma.currentPage.appendChild(container);
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify("Line chart created!");
  }
};

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
function drawYLabels(parent, p, yValues, yMin, yMax, yUnit) {
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

function drawEventBar(parent, p, position, pointCount) {
  var nodes = [];
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
    nodes.push(rect);

    x += segW;
  }
  return nodes;
}

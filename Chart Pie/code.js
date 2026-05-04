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

var COLOR_AXIS = { r: 0, g: 0, b: 0 };
var AXIS_OPACITY = 0.5;
var DEFAULT_W = 500;
var DEFAULT_H = 500;
var CHART_NAME = "Chart Pie";

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

  return {
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
    t.characters = String(Math.round(values[i]));
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

// ─── Draw center total text ─────────────────────────────────
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
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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

  // Generate random values if none provided
  if (!values || values.length < 1) {
    values = [];
    for (var i = 0; i < segmentsCount; i++) {
      values.push(Math.round(5 + Math.random() * 195));
    }
  }

  segmentsCount = values.length;

  var chartParams = {
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

  // Compute pie geometry
  var labelMargin = showLabels ? 60 : 10;
  var availableSize = Math.min(w, h) - labelMargin * 2;
  var outerR = availableSize / 2;
  var cx = w / 2;
  var cy = h / 2;
  var innerR = (pieStyle === "donut") ? outerR * (innerRadiusPct / 100) : 0;
  var cr = (pieStyle === "donut") ? cornerRadius : 0;

  var distinctColors = selectDistinctColors(segmentsCount);

  // Draw slices
  var sliceNodes = drawSlices(container, cx, cy, outerR, innerR, values, distinctColors, fillOpacity, cr, segmentGap);

  // Group slices
  if (sliceNodes.length > 1) {
    var g = figma.group(sliceNodes, container);
    g.name = "Slices";
  } else if (sliceNodes.length === 1) {
    sliceNodes[0].name = "Slices";
  }

  // Draw labels
  if (showLabels) {
    var labelNodes = drawValueLabels(container, cx, cy, outerR, values, 30);
    if (labelNodes.length > 1) {
      var g = figma.group(labelNodes, container);
      g.name = "Labels";
    }
  }

  // Draw center total
  if (showTotal && pieStyle === "donut") {
    var totalNodes = drawCenterTotal(container, cx, cy, values);
    if (totalNodes.length > 0) {
      var g = figma.group(totalNodes, container);
      g.name = "Center Label";
    }
  }

  // Store params
  container.setPluginData("chartParams", JSON.stringify(chartParams));

  // Insert
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
    figma.notify("Pie chart created!");
  }

  sendSelection();
};

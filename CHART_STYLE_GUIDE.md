# Monium Chart Generator — Design System for Figma Chart Plugins

## Overview
This folder contains Figma plugins for generating charts in Monium / Yandex Cloud style. Each chart type lives in its own subfolder (e.g. `Chart Line/`). All plugins share the same visual style defined below.

**This file is a skill for creating new Figma chart plugins.** When asked to create a new chart type plugin, follow this guide: apply all shared style parameters, reuse UI patterns, and place the plugin in its own subfolder with `manifest.json`, `code.js`, and `ui.html`.

## Project Structure
```
Monium Chart Generator/
├── CHART_STYLE_GUIDE.md   ← this file (shared style guide)
├── Chart Line/            ← Line Chart plugin
│   ├── manifest.json
│   ├── code.js
│   └── ui.html
├── Chart Bar/             ← Bar Chart plugin
│   ├── manifest.json
│   ├── code.js
│   └── ui.html
├── Chart Area/            ← Area Chart plugin
│   ├── manifest.json
│   ├── code.js
│   └── ui.html
├── Chart Pie/             ← Pie Chart plugin
│   ├── manifest.json
│   ├── code.js
│   └── ui.html
└── ...
```

## When Creating a New Chart Plugin
1. Create a subfolder (e.g. `Chart Bar/`)
2. Each plugin needs: `manifest.json`, `code.js`, `ui.html`
3. Apply ALL style parameters from this file
4. Use the same UI patterns: frame selector, input fields, buttons

---

## Shared Style Parameters

### Color Palette (75 colors for data series)
Use ALL colors from this list in the PALETTE array in every chart plugin. Select colors using the **greedy maximin** algorithm (not random shuffle) to maximize visual contrast between series.
```
#222F3E  → { r: 0.133, g: 0.184, b: 0.243 }
#0ABDE3  → { r: 0.043, g: 0.741, b: 0.890 }
#FBC531  → { r: 0.984, g: 0.773, b: 0.192 }
#6C5CE7  → { r: 0.424, g: 0.361, b: 0.906 }
#05C46B  → { r: 0.020, g: 0.769, b: 0.420 }
#FF6B6B  → { r: 1.000, g: 0.420, b: 0.420 }
#576574  → { r: 0.341, g: 0.396, b: 0.455 }
#54A0FF  → { r: 0.329, g: 0.627, b: 1.000 }
#E67E22  → { r: 0.906, g: 0.494, b: 0.133 }
#9B59B6  → { r: 0.608, g: 0.349, b: 0.714 }
#2ED573  → { r: 0.180, g: 0.835, b: 0.451 }
#FD7272  → { r: 0.992, g: 0.447, b: 0.447 }
#34495E  → { r: 0.204, g: 0.286, b: 0.369 }
#48DBFB  → { r: 0.282, g: 0.859, b: 0.984 }
#FFC048  → { r: 1.000, g: 0.753, b: 0.282 }
#5F27CD  → { r: 0.373, g: 0.153, b: 0.804 }
#00B894  → { r: 0.000, g: 0.722, b: 0.580 }
#D63031  → { r: 0.839, g: 0.188, b: 0.192 }
#95A5A6  → { r: 0.584, g: 0.647, b: 0.651 }
#45AAF2  → { r: 0.271, g: 0.667, b: 0.949 }
#F79F1F  → { r: 0.969, g: 0.624, b: 0.122 }
#82589F  → { r: 0.510, g: 0.345, b: 0.624 }
#00D2D3  → { r: 0.000, g: 0.824, b: 0.827 }
#EA8685  → { r: 0.918, g: 0.525, b: 0.522 }
#3D3D3D  → { r: 0.239, g: 0.239, b: 0.239 }
#1B9CFC  → { r: 0.106, g: 0.612, b: 0.988 }
#FF9F43  → { r: 1.000, g: 0.624, b: 0.263 }
#6C3483  → { r: 0.424, g: 0.204, b: 0.514 }
#1DD1A1  → { r: 0.114, g: 0.820, b: 0.631 }
#FDA7DF  → { r: 0.992, g: 0.655, b: 0.875 }
#8395A7  → { r: 0.514, g: 0.584, b: 0.655 }
#4D7CFE  → { r: 0.302, g: 0.486, b: 0.996 }
#EE5A24  → { r: 0.933, g: 0.353, b: 0.141 }
#8854D0  → { r: 0.533, g: 0.329, b: 0.816 }
#2BCBBA  → { r: 0.169, g: 0.796, b: 0.729 }
#FF647C  → { r: 1.000, g: 0.392, b: 0.486 }
#2C3E50  → { r: 0.173, g: 0.243, b: 0.314 }
#2E86DE  → { r: 0.180, g: 0.525, b: 0.871 }
#E17055  → { r: 0.882, g: 0.439, b: 0.333 }
#A55EEA  → { r: 0.647, g: 0.369, b: 0.918 }
#10AC84  → { r: 0.063, g: 0.675, b: 0.518 }
#B33771  → { r: 0.702, g: 0.216, b: 0.443 }
#7F8C8D  → { r: 0.498, g: 0.549, b: 0.553 }
#4B7BEC  → { r: 0.294, g: 0.482, b: 0.925 }
#FFA26B  → { r: 1.000, g: 0.635, b: 0.420 }
#3C40C6  → { r: 0.235, g: 0.251, b: 0.776 }
#55EFC4  → { r: 0.333, g: 0.937, b: 0.769 }
#C44569  → { r: 0.769, g: 0.271, b: 0.412 }
#01A3A4  → { r: 0.004, g: 0.639, b: 0.643 }
#00C48C  → { r: 0.000, g: 0.769, b: 0.549 }
#D6A2E8  → { r: 0.839, g: 0.635, b: 0.910 }
#3890AC  → { r: 0.220, g: 0.557, b: 0.675 }
#9AECDB  → { r: 0.604, g: 0.925, b: 0.859 }
#3B3B98  → { r: 0.231, g: 0.231, b: 0.596 }
#58B19F  → { r: 0.345, g: 0.694, b: 0.624 }
#6E4CB3  → { r: 0.431, g: 0.298, b: 0.702 }
#26DE81  → { r: 0.149, g: 0.871, b: 0.506 }
#0FBCF9  → { r: 0.059, g: 0.737, b: 0.976 }
#00A8FF  → { r: 0.000, g: 0.659, b: 1.000 }
#0097E6  → { r: 0.000, g: 0.592, b: 0.902 }
#273C75  → { r: 0.153, g: 0.235, b: 0.459 }
#192A56  → { r: 0.098, g: 0.165, b: 0.337 }
#4CD137  → { r: 0.298, g: 0.820, b: 0.216 }
#44BD32  → { r: 0.267, g: 0.741, b: 0.196 }
#487EB0  → { r: 0.278, g: 0.494, b: 0.690 }
#40739E  → { r: 0.251, g: 0.451, b: 0.620 }
#E1B12C  → { r: 0.882, g: 0.694, b: 0.173 }
#C23616  → { r: 0.761, g: 0.212, b: 0.086 }
#8C7AE6  → { r: 0.549, g: 0.478, b: 0.902 }
#9C88FF  → { r: 0.612, g: 0.533, b: 1.000 }
#718093  → { r: 0.443, g: 0.502, b: 0.576 }
#353B48  → { r: 0.208, g: 0.231, b: 0.282 }
#7B1FA2  → { r: 0.482, g: 0.122, b: 0.635 }
#00897B  → { r: 0.000, g: 0.537, b: 0.482 }
#D81B60  → { r: 0.847, g: 0.106, b: 0.376 }
```

### Grid
- Color: `#E5E5E5` → `{ r: 0.898, g: 0.898, b: 0.898 }`
- Line weight: `0.5px`
- Horizontal lines extend `6px` left beyond plot area
- Vertical lines at each X label position

### Axes Text
- Font: `Inter`, style `Regular`
- Size: `11px`
- Color: `rgba(0, 0, 0, 0.5)` → `{ r: 0, g: 0, b: 0 }` with `opacity: 0.5`
- Y axis labels: right-aligned, `8px` gap to grid lines, vertically centered on grid line (`-7px` offset)
- X axis labels: first left-aligned, last right-aligned, middle centered. `6px` below plot area
- Left padding: dynamic — measured from widest Y label + 8px gap + 2px

### Layout / Padding
- `PAD_TOP = 10px` — top edge to plot area
- `PAD_RIGHT = 2px` — right edge to plot area
- `PAD_BOTTOM = 21px` — bottom edge (fits X labels + 2px margin)
- `PAD_GAP = 8px` — gap between Y labels and vertical grid line
- Default chart size (no frame selected): `600 × 400`

### Data Lines (Line Chart specific)
- Rendered as continuous vector paths (no dots/circles on points)
- Stroke weight: `2px`
- Stroke cap: `NONE` (no rounding at line start/end)
- Stroke join: `ROUND`
- Three styles: Smooth (monotone cubic bezier), Sharp (straight segments), Peak (10x points with spikes)

### Data Areas (Area Chart specific)
- Rendered as closed vector shapes (top curve + bottom baseline/previous series curve)
- Fill: palette color with configurable opacity (default `0.3`, range `0.05–1.0`)
- Stroke applied to the closed shape (not a separate open path — avoids artifacts on sharp angles):
  - Color: `#000000` → `{ r: 0, g: 0, b: 0 }`
  - Opacity: `0.2` (20%)
  - Weight: `0.2px`
  - Align: `INSIDE`
  - Join: `ROUND`
- Three curve styles: Smooth (monotone cubic bezier), Sharp (straight segments), Peak (10x points with spikes)
- Two area modes:
  - **Overlap** — each area starts from baseline (bottom of plot area), areas overlap with transparency
  - **Stacked** — each area stacks on top of the previous one; values are scaled by `stackScale/areasCount` (configurable, default `1.8`, range `1–3`). Stacked values are clamped to `yMax` so areas never exceed the plot boundary. Bottom edge of each stacked area must use the same curve interpolation as the top edge of the area below it (prevents gaps between areas)

### Data Bars (Bar Chart specific)
- Rendered as rectangles (`figma.createRectangle()`)
- Fill: palette color with configurable opacity (default `1.0`, range `0.05–1.0`)
- No stroke on bars
- Two orientations:
  - **Vertical** — bars grow upward from baseline, categories along X axis, values along Y axis
  - **Horizontal** — bars grow rightward from left edge, categories along Y axis, values along X axis
- Three bar modes:
  - **Normal** — single bar per category (series count forced to 1), single color for all bars
  - **Grouped** — multiple series side-by-side within each category slot; fixed 70% slot ratio, 1px internal gap between bars
  - **Stacked** — series stacked on top of each other; values scaled by `1/seriesCount` so total fits within Y range. Bars clamped to plot area boundaries. Cumulative offset must use the actual drawn bar size (after clamp), not the raw `ratio * plotSize`, to prevent overlap between stacked segments. Minimum bar size: `0.5px` (not `1px`) to avoid inflating stacked totals
- **Dense mode** checkbox (Normal and Stacked only): multiplies data points by 10x for frequent bars
- **Bar gap (px)** input (Normal and Stacked only): configurable spacing between bar slots (default `1px`, range `0–50px`). Not available for Grouped mode (uses fixed 70% ratio)
- **Series count** input disabled when Bar mode is Normal (always 1 series)
- Grid lines: vertical lines at X label center positions (vertical orientation), horizontal lines at category center positions (horizontal orientation)
- Dynamic left padding: measures widest Y-value label (vertical) or widest category label (horizontal)

### Data Slices (Pie Chart specific)
- Rendered as native Figma ellipses (`figma.createEllipse()`) with `arcData` — NOT vector paths
- Each slice is a separate ellipse node with the same size/position but different arc angles
- `arcData` properties:
  - `startingAngle`: start of arc in radians (measured from x-axis, clockwise)
  - `endingAngle`: end of arc in radians
  - `innerRadius`: ratio 0–1 (0 = full pie, >0 = donut)
- Start angle: `-Math.PI / 2` (12 o'clock / top)
- Fill: palette color with configurable opacity (default `1.0`, range `0.05–1.0`)
- No stroke on slices
- Two chart styles:
  - **Pie** — full solid slices, no inner hole (`innerRadius: 0`)
  - **Donut** — annular slices with configurable inner hole (`innerRadius: innerRadiusPct / 100`)
- **Inner radius %** (Donut only): `30–80%`, default `55%` — controls donut hole size
- **Corner radius** (Donut only): `0–50px`, default `0` — applies native `cornerRadius` on each ellipse arc, rounding all 4 corners of the annular segment. Only applied when `innerRadius > 0`
- **Segment gap**: `0–10` degrees, default `1` — angular gap between adjacent slices (split equally on both sides of each slice boundary)
- **Values input**: comma-separated numbers for exact slice sizes. If empty, random values are generated based on **Segments count** (1–20, default 5). Random range: `5–200` per segment
- Default chart size (no frame selected): `500 × 500` (square, unlike other charts which use `600 × 400`)
- Pie geometry: `outerR = (min(w, h) - margin * 2) / 2`, centered at `(w/2, h/2)`. Label margin: `60px` when labels shown, `10px` otherwise
- **Value labels** (optional): leader lines from each slice's midpoint angle outward, with horizontal elbow and text showing the rounded numeric value
  - Leader line: vector path (`M`/`L` commands), stroke `#000000` at opacity `0.3`, weight `0.5px`
  - Radial segment: `40%` of label offset outward from pie edge
  - Horizontal segment: `50%` of label offset, direction based on which half (left/right) the midpoint angle falls in
  - Text: font `Inter Regular`, size `11px`, color `rgba(0,0,0,0.5)`, positioned `3px` from horizontal line end
- **Center total** (optional, Donut only): sum of all values displayed at the pie center
  - Font: `Inter Regular`, size `28px`, color `{ r: 0.1, g: 0.1, b: 0.1 }`
  - Horizontally and vertically centered in the donut hole
- No grid, axes, or event bars (not applicable to pie charts)

### Container
- Transparent fill (`fills = []`)
- `clipsContent = true`
- Name format: `"Chart Line"`, `"Chart Bar"`, etc.

### Event Bars (optional)
- Height: `6px`
- Top Event: `2px` above plot area. Green palette:
  ```
  { r: 0.506, g: 0.780, b: 0.518 }  — green
  { r: 0.302, g: 0.686, b: 0.290 }  — darker green
  { r: 0.698, g: 0.875, b: 0.541 }  — lime green
  { r: 0.180, g: 0.545, b: 0.341 }  — deep green
  { r: 0.565, g: 0.933, b: 0.565 }  — light green
  ```
- Bottom Event: `1px` below plot area. Red/grey palette:
  ```
  { r: 1.000, g: 0.200, b: 0.200 }  — red
  { r: 1.000, g: 0.400, b: 0.400 }  — light red
  { r: 1.000, g: 0.600, b: 0.600 }  — pink-red
  { r: 0.690, g: 0.718, b: 0.773 }  — grey-blue
  { r: 0.800, g: 0.820, b: 0.860 }  — light grey
  { r: 0.478, g: 0.529, b: 0.612 }  — dark grey-blue
  ```
- Random segments with random gaps across X axis width
- Segment width: 2–8% of plot width
- Gap width: 0.5–4% of plot width
- Random opacity: 0.4–1.0

---

## UI Patterns (shared across all chart plugins)

### Plugin UI Style
```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
background: #F7F8FA;
color: #1A1A1A;
padding: 16px;
```

### Frame Selector Bar
- Shows selected frame name + dimensions
- Inactive: `background: #EEEEF0; color: #808080`
- Active: `background: #E8F0FE; color: #4D7CFE`
- Remembers last selected frame (doesn't clear on focus loss to inputs)
- Uses `lastSelectedFrameId` + `getTargetFrame()` pattern

### Input Fields
```css
padding: 7px 10px;
border: 1.5px solid #E0E0E0;
border-radius: 6px;
font-size: 12px;
focus border-color: #4D7CFE;
```

### Radio Buttons (e.g. Line Style)
```css
background: #EEEEF0; color: #808080; border-radius: 6px;
active: background: #4D7CFE; color: #fff;
```

### Action Buttons
- Primary ("Insert chart"): `background: #4D7CFE; color: #fff; border-radius: 8px; font-weight: 600; width: 100%`
- No "Reset" button — removed from all plugins
- Disabled state: `opacity: 0.45; cursor: default`

### Additional UI Fields (Area Chart)
- **Area mode** radio group: `Overlap` (default) / `Stacked`
- **Scale factor** number input: `0.1–3`, default `1.8`, step `0.1` — controls how aggressively stacked areas fill the Y axis. **Visible only when Area mode is Stacked**
- **Fill opacity** number input: `0.05–1.0`, default `0.3`, step `0.05`

### Additional UI Fields (Bar Chart)
- **Orientation** radio group: `Vertical` (default) / `Horizontal`
- **Bar mode** radio group: `Normal` (default) / `Grouped` / `Stacked`
- **Bar gap (px)** number input: `0–50`, default `1`, step `1` — visible only for Normal and Stacked modes
- **Dense bars** checkbox: visible only for Normal and Stacked modes; generates 10x data points for frequent bars
- **Fill opacity** number input: `0.05–1.0`, default `1.0`, step `0.05`
- **Series count** input: disabled when Bar mode is Normal

### Additional UI Fields (Pie Chart)
- **Values** text input: comma-separated numbers for exact slice proportions (e.g. `660, 150, 142, 122, 5, 15`). Placeholder text shows example. If empty, random values generated
- **Segments count** number input: `1–20`, default `5` — **hidden when Values field has valid numbers** (segment count derived from values array length)
- **Pie style** radio group: `Pie` / `Donut` (default)
- **Inner radius %** number input: `30–80`, default `55`, step `1` — **visible only when Pie style is Donut**
- **Corner radius** number input: `0–50`, default `0`, step `1` — **visible only when Pie style is Donut**
- **Segment gap** number input: `0–10`, default `1`, step `0.5` (degrees between slices)
- **Display** checkbox group:
  - **Show value labels** checkbox: toggles leader lines + numeric labels outside the pie
  - **Show center total** checkbox: toggles sum text in donut center — **visible only when Pie style is Donut**
- **Fill opacity** number input: `0.05–1.0`, default `1.0`, step `0.05`
- No **Events** checkboxes (not applicable to pie charts)

### Section Spacing
- `16px` between all sections (fields, groups, buttons)

### Footer
- `"Monium Design System v1.0"`
- `font-size: 10px; color: #AAAAAA; text-align: center`

### Dynamic Plugin Window Height
Plugin height adapts to content automatically. No fixed height values.
- Initial height in `figma.showUI`: `100` (minimal, expands immediately)
- UI sends `{ type: 'resize', height: document.body.scrollHeight }` to plugin
- Plugin handles: `figma.ui.resize(300, Math.min(msg.height, maxHeight))`
- `MutationObserver` on `document.body` triggers resize on any DOM change (e.g. "Get values from chart" button appearing/disappearing)
```js
// ui.html — at the end of <script>
function resizeUI() {
  var h = document.body.scrollHeight;
  parent.postMessage({ pluginMessage: { type: 'resize', height: h } }, '*');
}
resizeUI();
new MutationObserver(resizeUI).observe(document.body, { childList: true, subtree: true, attributes: true });
```
```js
// code.js — in figma.ui.onmessage handler, before "generate" check
if (msg.type === "resize") {
  figma.ui.resize(300, Math.min(msg.height, 800));
  return;
}
```

### Float Precision for Opacity
When reading `fillOpacity` from Figma layers (fallback parser), values may have float32 artifacts (e.g. `0.8999999761581421`). Always round to 2 decimal places when populating the UI:
```js
Math.round(d.fillOpacity * 100) / 100
```

---

## Re-generation (shared pattern for all chart types)

All chart plugins must support re-generation — reading parameters from a previously generated chart and replacing it with a new one.

### User Flow
1. User selects a frame containing a previously generated chart
2. Plugin detects the chart → shows **"Get values from chart"** button, **"Insert chart"** is disabled
3. User clicks "Get values from chart" → form fields populate with saved parameters, **"Insert chart"** unlocks, **"Get values from chart"** locks
4. User modifies parameters if needed
5. User clicks "Insert chart" → old chart is removed, new chart is generated in its place, **"Insert chart"** locks, **"Get values from chart"** unlocks
6. If the selected frame has no chart → **"Get values from chart"** is hidden, **"Insert chart"** is enabled (normal generation mode)

### Button State Logic
| State | "Insert chart" | "Get values from chart" |
|---|---|---|
| Frame without chart selected | enabled | hidden |
| Frame with chart selected | **disabled** | visible, enabled |
| After "Get values from chart" clicked | enabled | visible, **disabled** |
| After "Insert chart" clicked (chart exists) | **disabled** | visible, enabled |
| After "Insert chart" clicked (no chart) | **disabled** | hidden |

### Storing Parameters — `setPluginData`
After every chart generation, store all parameters as JSON on the chart container frame:
```js
container.setPluginData("chartParams", JSON.stringify({
  yValues: yValues,
  yUnit: yUnit,
  xLabels: xLabels,
  linesCount: linesCount,   // or areasCount, barsCount
  lineStyle: lineStyle,     // chart-type-specific style option
  topEvent: topEvent,
  bottomEvent: bottomEvent,
  // Area-specific:
  areaStyle: areaStyle,     // "smooth" | "sharp" | "peak"
  areaMode: areaMode,       // "overlap" | "stacked"
  stackScale: stackScale,   // 0.1–3, default 1.8 (stacked only)
  fillOpacity: fillOpacity, // 0.05–1.0
  // Bar-specific:
  orientation: orientation,  // "vertical" | "horizontal"
  barMode: barMode,          // "normal" | "grouped" | "stacked"
  dense: dense,              // boolean
  barGap: barGap,            // 0–50
  // Pie-specific:
  values: values,            // array of numbers (actual slice values)
  segmentsCount: segmentsCount, // 1–20
  pieStyle: pieStyle,        // "pie" | "donut"
  innerRadiusPct: innerRadiusPct, // 30–80 (donut only)
  cornerRadius: cornerRadius, // 0–50 (donut only)
  segmentGap: segmentGap,    // 0–10 (degrees)
  showLabels: showLabels,    // boolean
  showTotal: showTotal        // boolean (donut only)
}));
```

### Reading Parameters — `readChartParams`
1. **Primary**: `chartFrame.getPluginData("chartParams")` → `JSON.parse()`
2. **Fallback** (for old charts without plugin data): parse from layer structure using named groups

### Chart Detection — `findChartFrame(frame)`
Checks if the selected frame IS the chart container or CONTAINS one as a direct child:
```js
function findChartFrame(frame) {
  // Check if the frame itself is the chart (match by container name, e.g. "Chart Line", "Chart Bar")
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
```
Each plugin adapts the name check to its own container name (`"Chart Bar"`, `"Chart Area"`, `"Chart Pie"`, etc.).

### Selection Notification
`sendSelection()` must include chart detection data so the UI can show/hide the button:
```js
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
```

### Replacement Logic in Generate Handler
When `msg.replace === true`:
```js
if (existingChart.id === target.id) {
  // Selected frame IS the chart — clear children, reuse frame as container
} else {
  // Chart is a child — remember position, remove old, create new at same position
}
```

### Refresh UI After Generation — `sendSelection()`
After inserting a chart, always call `sendSelection()` at the end of the generate handler. This ensures the UI immediately updates (shows "Get values from chart" button) without requiring the user to deselect and reselect the frame:
```js
// At the very end of the generate handler, after all insert/notify logic:
sendSelection();
```
This is critical because `figma.on("selectionchange")` does NOT fire when the selected frame's content changes — only when the selection itself changes.

### Fallback Layer Parser (for charts without `pluginData`)
Read from named groups inside the chart container:
- **"Y Labels"** group → parse text node `.characters` as numbers + extract unit suffix
- **"X Labels"** group → read text node `.characters`, sort by x-position
- **"Lines"** / **"Areas"** / **"Bars"** group → count children for series count
- **"Top Events"** / **"Bottom Events"** group → presence = checkbox enabled
- **Line style detection**: path data contains `"C"` → smooth; many `"L"` segments → peak; otherwise → sharp
- **Pie Chart fallback**: `"Slices"` group → count ELLIPSE children for segment count; read `arcData.innerRadius` to detect pie vs donut style and inner radius %; read `cornerRadius` from ellipse node; detect `"Labels"` / `"Center Label"` group presence for display options

### Layer Structure (required for all chart types)
All chart elements must be organized into named groups inside the container:
```
Chart [Type] (Frame)  [pluginData: chartParams JSON]
├── Grid (Group)
├── Y Labels (Group)
├── X Labels (Group)
├── [Data Group] (Group)     ← "Lines", "Areas", "Bars", etc.
├── Top Events (Group)       ← optional
└── Bottom Events (Group)    ← optional
```

**Pie Chart layer structure** (differs from axis-based charts):
```
Chart Pie (Frame)  [pluginData: chartParams JSON]
├── Slices (Group)           ← Ellipse nodes with arcData
├── Labels (Group)           ← optional: leader line vectors + value text nodes
└── Center Label (Group)     ← optional (donut only): total sum text node
```
Use `figma.group(nodes, container)` after creating all nodes in a category.

### UI Elements
**"Get values from chart" button** — placed between target bar and first field:
```html
<button class="btn-regen" id="regenBtn" onclick="regenerate()">Get values from chart</button>
<div class="error-msg" id="regenError"></div>
```
```css
.btn-regen {
  display: none;
  width: 100%;
  padding: 9px 0;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  background: #4D7CFE;
  color: #fff;
  margin-top: 10px;
}
.btn-regen:hover:not(:disabled) { background: #3A6AE8; }
.btn-regen:active:not(:disabled) { transform: scale(0.97); }
.btn-regen:disabled { opacity: 0.45; cursor: default; }

.error-msg {
  display: none;
  font-size: 11px;
  color: #E53935;
  margin-top: 6px;
}
```

### Error Handling
Show inline error below "Get values from chart" when data cannot be read:
```js
if (!storedChartData) {
  showRegenError('Failed to get data: no chart found in selected frame');
  return;
}
if (!d.yValues || d.yValues.length < 2) {
  showRegenError('Failed to get data: could not read Y axis values from chart');
  return;
}
```

---

## Figma Plugin Code Patterns

### Selection Tracking
```js
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
  // Don't send hasFrame:false — keep last frame remembered
}
```

### Dynamic Left Padding (measure Y labels)
```js
var maxLabelWidth = 0;
for (var mi = 0; mi < yValues.length; mi++) {
  var measure = figma.createText();
  measure.fontName = { family: "Inter", style: "Regular" };
  measure.fontSize = 11;
  measure.characters = String(Math.round(yValues[mi])) + suffix;
  if (measure.width > maxLabelWidth) maxLabelWidth = measure.width;
  measure.remove();
}
var padLeft = maxLabelWidth + PAD_GAP + 2;
```

### Insert Into Frame or Canvas
```js
var target = getTargetFrame();
var w = target ? target.width : DEFAULT_W;
var h = target ? target.height : DEFAULT_H;
// ... build chart in container ...
if (target) {
  target.appendChild(container);
  container.x = 0;
  container.y = 0;
} else {
  figma.currentPage.appendChild(container);
}
```

### Random Data Generation
```js
// Generate random values in [yMin, yMax] range
for (var pi = 0; pi < pointCount; pi++) {
  vals.push(yMin + Math.random() * (yMax - yMin));
}

// Select maximally distinct colors for the series count
// Greedy maximin: random first, then each next maximizes min RGB distance to all selected
var distinctColors = selectDistinctColors(seriesCount);
```

### Distinct Color Selection Algorithm — `selectDistinctColors(count)`
Ensures maximum visual contrast between series colors. Must be used instead of random shuffle.
```js
function selectDistinctColors(count) {
  if (count >= PALETTE.length) {
    // Fallback: shuffle entire palette
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
  // Random first color (ensures variety between generations)
  var firstIdx = Math.floor(Math.random() * available.length);
  used.push(available[firstIdx]);
  available.splice(firstIdx, 1);
  // Each next: pick color with max min-distance to all already selected
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
```

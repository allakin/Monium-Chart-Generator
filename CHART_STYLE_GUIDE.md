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
- Three styles: Smooth (monotone cubic bezier with **Fritsch-Carlson constraint**), Sharp (straight segments), Peak (10x points with spikes)
- **Fritsch-Carlson constraint** for Smooth: after computing initial tangents (arithmetic mean of neighbouring slopes; 0 at extrema), apply the monotonicity test for each segment — if `α² + β² > 9` (where `α = tangent[i] / slope[i]`, `β = tangent[i+1] / slope[i]`), scale tangents down by `3 / sqrt(α² + β²)`. This prevents the curve from overshooting the data range between points, which otherwise creates visible "wobbles" in charts with many random/noisy series

### Data Areas (Area Chart specific)
- Rendered as closed vector shapes (top curve + bottom baseline/previous series curve)
- Fill: palette color with configurable opacity (default `0.3`, range `0.05–1.0`)
- Stroke applied to the closed shape (not a separate open path — avoids artifacts on sharp angles):
  - Color: `#000000` → `{ r: 0, g: 0, b: 0 }`
  - Opacity: `0.2` (20%)
  - Weight: `0.2px`
  - Align: `INSIDE`
  - Join: `ROUND`
- Three curve styles: Smooth (monotone cubic bezier with **Fritsch-Carlson constraint** — same as Line Chart, see "Data Lines" section), Sharp (straight segments), Peak (10x points with spikes)
- Two area modes:
  - **Overlap** — each area starts from baseline (bottom of plot area), areas overlap with transparency
  - **Stacked** — each area stacks on top of the previous one. Two scaling modes:
    - **Fill full height OFF**: values scaled by `1/areasCount` — standard proportional stacking
    - **Fill full height ON**: normalization — find the max cumulative sum across all data points, then scale all series so that peak exactly equals `yMax`. No clamping needed, data fits perfectly within the plot area
    - **Important**: never use fixed scaleFactor + clamp to `yMax` — clamping distorts bezier tangents and causes visual overlap between adjacent areas. Always use normalization for full-height mode
    - Bottom edge of each stacked area uses the exact mathematical reverse of the top edge of the area below it (`buildCurvePathBidirectional` — swap bezier control points in reverse order). This prevents gaps/overlaps at area boundaries

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
- **Fill full height** checkbox: when checked, normalizes data so the peak cumulative sum exactly equals `yMax` (areas fill full chart height); when unchecked, uses `scaleFactor = 1/areasCount`. **Visible only when Area mode is Stacked**
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
- **Curve style detection** (Line, Area): path data contains `"C"` → smooth; no `"C"` and many `"L"` segments (`> xLabels.length * 3`) → peak; otherwise → sharp

**Area Chart fallback — mode + fillHeight detection** (in addition to style):
- **`areaMode`** — compare bottom edges of `area[0]` and `area[1]`: in Overlap, both areas reach baseline (bottom y values within `~3px`); in Stacked, `area[1]` sits on top of `area[0]` so its bottom is significantly higher. Rule: if `area[0].bottom - area[1].bottom > 3` → `stacked`, otherwise `overlap`
- **`fillHeight`** — only applies in Stacked mode: read the topmost area's chart-frame y-coord (`group.y + topArea.y`). With Fill full height ON, the cumulative peak normalizes exactly to `yMax`, so the topmost area's top edge sits near `PAD_TOP`. With Fill full height OFF, peaks land roughly halfway down the plot. Rule: if `topInChartFrame <= PAD_TOP + plotH * 0.15` → `fillHeight = true`

**Bar Chart fallback — orientation + mode + dense + barsCount detection**:
- **`orientation`** — count bars whose bottom edge equals the global `maxBottom` vs bars whose left edge equals the global `minLeft`. Vertical bars share a baseline (more `atBottomCount`), horizontal bars share a left origin (more `atLeftCount`). Rule: if `atBottomCount >= atLeftCount` → `vertical`, otherwise `horizontal`
- **Cluster bars** by primary-axis position (`x` for vertical, `y` for horizontal): consecutive sorted bars within `1px` form one cluster. Compute `barsPerPosition = nBars / clusterCount`
- **`barMode` + `barsCount` + `dense`**:
  - `barsPerPosition >= 1.8` → **Stacked** (multiple bars share the same primary-axis position). `barsCount = round(barsPerPosition)`. `dense = (clusterCount > xLabels.length * 1.5)`
  - All positions unique → split by `ratio = nBars / xLabels.length`:
    - `ratio <= 1.5` → **Normal**, `barsCount = 1`, `dense = false`
    - `8 <= ratio <= 12` → **Normal + Dense** (10× data points), `barsCount = 1`, `dense = true`
    - Otherwise → **Grouped**, `barsCount = round(ratio)`, `dense = false` (Grouped never has dense)

**Pie Chart fallback** — `"Slices"` group:
- Count ELLIPSE children → `segmentsCount`
- `arcData.innerRadius` → pie/donut + `innerRadiusPct = round(innerRadius * 100)`
- `firstSlice.cornerRadius` (when numeric and > 0) → `cornerRadius`
- Detect `"Labels"` / `"Center Label"` group presence for display options
- **`segmentGap`** — gap between two consecutive slices in radians: `slices[1].arcData.startingAngle - slices[0].arcData.endingAngle`. By construction in `drawSlices` (`a1 = startAngle + gapRad/2`, `a2 = startAngle + sliceAngle - gapRad/2`), this difference equals exactly `gapRad`. Convert to degrees: `gapDeg = gapRad * 180 / PI`
- **`values`** — recover proportional values from arc angles: each slice's actual angle = `(endingAngle - startingAngle) + gapRad`. Convert to degrees and round to 1 decimal (sum ≈ 360). Use `Math.max(0.1, ...)` to avoid zero values. Original numeric units cannot be restored without `pluginData`, but proportions are exact, so re-rendering produces an identical chart

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

**Z-order fix for single data element**: `figma.group()` requires at least 2 nodes. When a data category has only 1 node (e.g. 1 line, 1 area), the node stays at its original position in the children array — which is BELOW grid/label groups created by `figma.group()`. Fix: after renaming, move the node to the top via `container.appendChild(node)`:
```js
if (dataNodes.length > 1) {
  var g = figma.group(dataNodes, container);
  g.name = "Lines"; // or "Areas", "Bars"
} else if (dataNodes.length === 1) {
  dataNodes[0].name = "Lines";
  container.appendChild(dataNodes[0]); // move above grid/labels
}
```

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

## Copy / Paste exact copy (shared pattern for all chart types)

In addition to **re-generation** (which preserves only the *parameters* and re-randomizes the underlying data each time), plugins must support **exact copy** — taking a previously generated chart's full data, including randomized values and colors, and reproducing it pixel-equivalent in another frame (or replacing the same one).

The key difference:
- **Re-generate**: same parameters → new random data and colors.
- **Copy + Paste**: same parameters → **same** data, **same** colors, **same** event-bar layout.

The primary use case is building visually-identical chart pairs/grids for side-by-side comparison.

### User Flow
1. User selects a frame containing a previously generated chart.
2. Plugin shows both **"Get values from chart"** (existing) and **"Copy chart"** (new) buttons.
3. User clicks **"Copy chart"** → full chart data is captured to the plugin's in-memory clipboard. A yellow banner appears with a brief summary (e.g. `"Copied: 3 lines · Smooth"`) and an `×` to clear.
4. User selects another frame (or stays on the same one). The clipboard persists across selection changes.
5. User clicks **"Paste exact copy"** → identical chart is generated in the target frame, replacing any chart already present there. The clipboard remains, so multiple pastes are supported (one source → many identical copies in different frames).

### Storing Full Chart Data — `setPluginData`
The chart container's `chartParams` JSON is extended to also store the data needed to reproduce the chart pixel-equivalent:
```js
container.setPluginData("chartParams", JSON.stringify({
  // ... all existing parameters (yValues, xLabels, linesCount/areasCount/..., etc.) ...

  // ── Data needed for exact copy ──
  allSeries: allSeries,                  // [[v1, v2, ...], ...] random series data (Line/Area/Bar)
  colors: distinctColors,                // [{r,g,b}, ...] color per series/segment
  topEventSegments: topEventSegments,    // [{x, w, color: {r,g,b}, opacity}, ...] or null
  bottomEventSegments: bottomEventSegments
}));
```
**Pie Chart**: store only `colors` (slice `values` are already deterministic in chartParams; no event bars).

### Event Segments — Normalized 0..1
Refactor the existing `drawEventBar` function into two: **`buildEventSegments(position)`** generates segment specs with `x` and `w` as **fractions of plot width** (0..1), and **`drawEventSegments(parent, p, position, segments)`** converts fractions to pixels at render time. This is what makes event bars scale proportionally when pasted into a different-sized frame.

```js
function buildEventSegments(position) {
  // Segments use x and w as fractions of plot width (0..1) so the layout
  // is identical when re-rendered into a differently-sized frame.
  var segments = [];
  var segMinW = 0.02, segMaxW = 0.08;
  var gapMinW = 0.005, gapMaxW = 0.04;
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
```

### Render Function — `renderChart(params, exactData)`
Extract the chart-build logic from the `generate` handler into a single async function `renderChart(params, exactData)`. When `exactData` is provided, the function reuses the supplied `allSeries`, `colors`, and event segments instead of randomizing. The `generate` and `paste` message handlers both delegate to it.

```js
async function renderChart(params, exactData) {
  // ... read params, resolve target, build container as before ...
  // Force replaceMode=true when exactData is set
  var replaceMode = exactData ? true : (params.replace || false);

  // Reuse exact series data if provided, else randomize
  var allSeries;
  if (exactData && exactData.allSeries && exactData.allSeries.length === seriesCount) {
    allSeries = exactData.allSeries;
  } else {
    allSeries = [];
    for (var li = 0; li < seriesCount; li++) { /* fill with Math.random()... */ }

    // CRITICAL (Area/Bar with stacked mode): any in-place scaling of allSeries
    // (e.g. `vals[pi] = yMin + (vals[pi] - yMin) * scaleFactor` for stacked)
    // MUST live inside this else branch. The stored allSeries is already
    // post-scaling, so applying it again on paste would double-scale.
    if (mode === "stacked") { /* scale in place */ }
  }

  var distinctColors;
  if (exactData && exactData.colors && exactData.colors.length === seriesCount) {
    distinctColors = exactData.colors;
  } else {
    distinctColors = selectDistinctColors(seriesCount);
  }

  var topEventSegments = topEvent
    ? (exactData && exactData.topEventSegments ? exactData.topEventSegments : buildEventSegments("top"))
    : null;
  var bottomEventSegments = bottomEvent
    ? (exactData && exactData.bottomEventSegments ? exactData.bottomEventSegments : buildEventSegments("bottom"))
    : null;

  // ... draw using allSeries / distinctColors / segments; group nodes; setPluginData ...

  // Notify
  figma.notify(exactData ? "Exact copy pasted!" : (replaceMode ? "Chart regenerated!" : "Chart added to ..."));
}

figma.ui.onmessage = async function (msg) {
  if (msg.type === "resize") { /* ... */ return; }
  if (msg.type === "generate") { await renderChart(msg, null); return; }
  if (msg.type === "paste") {
    if (!msg.chartData) return;
    await renderChart(msg.chartData, msg.chartData);
    return;
  }
};
```

### UI Elements

**CSS** (added alongside `.btn-regen`):
```css
.btn-copy {
  display: none;
  width: 100%; padding: 9px 0; border: none; border-radius: 8px;
  font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; background: #EEEEF0; color: #1A1A1A; margin-top: 6px;
}
.btn-copy:hover:not(:disabled) { background: #E0E0E0; }
.btn-copy:active:not(:disabled) { transform: scale(0.97); }
.btn-copy:disabled { opacity: 0.45; cursor: default; }

.clipboard-box {
  display: none;
  background: #FFF6E0; border: 1px solid #F5D78A; border-radius: 6px;
  padding: 8px 10px; margin-top: 10px;
}
.clipboard-box .row { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #7A5A0F; }
.clipboard-box .summary { flex: 1; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.clipboard-box .clear-btn {
  border: none; background: transparent; color: #7A5A0F; cursor: pointer;
  font-size: 16px; padding: 0 4px; line-height: 1;
}
.clipboard-box .clear-btn:hover { color: #1A1A1A; }

.btn-paste {
  width: 100%; margin-top: 8px; padding: 8px 0; border: none; border-radius: 6px;
  font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; background: #1A1A1A; color: #fff;
}
.btn-paste:hover:not(:disabled) { background: #333; }
.btn-paste:active:not(:disabled) { transform: scale(0.97); }
.btn-paste:disabled { opacity: 0.45; cursor: default; }
```

**HTML** (placed immediately after the existing `regenBtn` + `regenError`):
```html
<button class="btn-copy" id="copyBtn" onclick="copyChart()">Copy chart</button>
<div class="error-msg" id="regenError"></div>

<div class="clipboard-box" id="clipboardBox">
  <div class="row">
    <span class="summary" id="clipboardSummary">Chart copied</span>
    <button class="clear-btn" onclick="clearCopy()" title="Clear clipboard">×</button>
  </div>
  <button class="btn-paste" id="pasteBtn" onclick="pasteChart()">Paste exact copy</button>
</div>
```

**JS** (added to the existing `<script>` block):
```js
var copiedChart = null;

function copyChart() {
  hideRegenError();
  if (!storedChartData) return;
  // Gate: require fields that newer pluginData provides
  if (!storedChartData.colors || (!storedChartData.allSeries && !storedChartData.values)) {
    showRegenError('Exact copy unavailable: this chart was generated by an older version. Regenerate it once to enable Copy.');
    return;
  }
  copiedChart = JSON.parse(JSON.stringify(storedChartData));
  updateClipboardUI();
  resizeUI();
}

function pasteChart() {
  if (!copiedChart) return;
  parent.postMessage({ pluginMessage: { type: 'paste', chartData: copiedChart } }, '*');
}

function clearCopy() {
  copiedChart = null;
  updateClipboardUI();
  resizeUI();
}

function updateClipboardUI() {
  var box = document.getElementById('clipboardBox');
  if (copiedChart) {
    // Adapt summary to chart-specific field names
    var n = copiedChart.linesCount || copiedChart.areasCount || copiedChart.barsCount || copiedChart.segmentsCount || 0;
    var style = copiedChart.lineStyle || copiedChart.areaStyle || copiedChart.barMode || copiedChart.pieStyle || '';
    var label = style ? (style.charAt(0).toUpperCase() + style.slice(1)) : '';
    var noun = copiedChart.linesCount ? 'line'
            : copiedChart.areasCount ? 'area'
            : copiedChart.barsCount ? 'bar series'
            : 'segment';
    document.getElementById('clipboardSummary').textContent =
      'Copied: ' + n + ' ' + noun + (n === 1 ? '' : 's') + (label ? ' · ' + label : '');
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}
```

In `window.onmessage`, alongside the existing `regenBtn` handling, also show/hide `copyBtn` (same condition as `regenBtn`) and call `updateClipboardUI()` once.

### Pie Chart Specifics
- **No** `buildEventSegments` / `drawEventSegments` refactor — Pie has no event bars.
- **No** `allSeries` field — slice `values` are already deterministic in `chartParams`.
- Store **only** `colors` alongside existing fields.
- `copyChart()` gating checks `!storedChartData.colors` (instead of `!storedChartData.allSeries`).
- Clipboard summary reads `segmentsCount` and `pieStyle`.

### Stacked-mode Scaling Pitfall (Area & Bar)
Both Area (stacked) and Bar (stacked) mutate `allSeries` in-place to scale values so the stack fits within `yMax`. The post-scaling array is what gets stored in `pluginData`. When pasting, scaling MUST NOT be reapplied — keep the scaling block strictly inside the **else** branch of the `if (exactData?.allSeries)` check.

### Notify from UI — `type: "notify"` message
`figma.notify` is only available in `code.js` (plugin context). When the UI needs to surface a transient toast — e.g. confirming Copy — send a message and have the plugin forward it to `figma.notify`:
```js
// code.js — in figma.ui.onmessage, alongside the "resize" handler
if (msg.type === "notify") {
  figma.notify(msg.message);
  return;
}
```
```js
// ui.html — inside copyChart(), after a successful copy
parent.postMessage({ pluginMessage: { type: 'notify', message: 'Chart copied — 3 lines ready to paste' } }, '*');
```
The summary text is chart-specific (lines / areas / bar series / segments) and adopts the same chart-type wording used in `updateClipboardUI`.

### Backward Compatibility
Charts generated before this change have `pluginData` without `allSeries` / `colors`. The Copy button shows an inline error guiding the user: *"Exact copy unavailable: this chart was generated by an older version. Regenerate it once to enable Copy."* The clipboard remains usable across plugin runs for newer charts. The clipboard is in-memory only — it does not persist across plugin restarts.

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

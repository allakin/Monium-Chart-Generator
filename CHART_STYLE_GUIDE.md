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
├── Chart Bar/             ← (future) Bar Chart plugin
├── Chart Area/            ← Area Chart plugin
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

### Color Palette (20 colors for data series)
Use these colors for chart lines, bars, areas, slices, etc. Shuffle randomly on each insert.
```
#4D7CFE  → { r: 0.302, g: 0.486, b: 0.996 }
#6C5CE7  → { r: 0.424, g: 0.361, b: 0.906 }
#00C48C  → { r: 0.000, g: 0.769, b: 0.549 }
#FF647C  → { r: 1.000, g: 0.392, b: 0.486 }
#FFA26B  → { r: 1.000, g: 0.635, b: 0.420 }
#0ABDE3  → { r: 0.043, g: 0.741, b: 0.890 }
#5F27CD  → { r: 0.373, g: 0.153, b: 0.804 }
#10AC84  → { r: 0.063, g: 0.675, b: 0.518 }
#EE5A24  → { r: 0.933, g: 0.353, b: 0.141 }
#FDA7DF  → { r: 0.992, g: 0.655, b: 0.875 }
#1B9CFC  → { r: 0.106, g: 0.612, b: 0.988 }
#3890AC  → { r: 0.220, g: 0.557, b: 0.675 }
#58B19F  → { r: 0.345, g: 0.694, b: 0.624 }
#B33771  → { r: 0.702, g: 0.216, b: 0.443 }
#3B3B98  → { r: 0.231, g: 0.231, b: 0.596 }
#FD7272  → { r: 0.992, g: 0.447, b: 0.447 }
#9AECDB  → { r: 0.604, g: 0.925, b: 0.859 }
#D6A2E8  → { r: 0.839, g: 0.635, b: 0.910 }
#82589F  → { r: 0.510, g: 0.345, b: 0.624 }
#6E4CB3  → { r: 0.431, g: 0.298, b: 0.702 }
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
  - Opacity: `0.4` (40%)
  - Weight: `0.2px`
  - Align: `OUTSIDE`
  - Join: `ROUND`
- Three curve styles: Smooth (monotone cubic bezier), Sharp (straight segments), Peak (10x points with spikes)
- Two area modes:
  - **Overlap** — each area starts from baseline (bottom of plot area), areas overlap with transparency
  - **Stacked** — each area stacks on top of the previous one; values are scaled by `1/areasCount` so the total fits within Y range. Bottom edge of each stacked area must use the same curve interpolation as the top edge of the area below it (prevents gaps between areas)

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
- Primary: `background: #4D7CFE; color: #fff; border-radius: 8px; font-weight: 600`
- Secondary: `background: #EEEEF0; color: #808080`

### Additional UI Fields (Area Chart)
- **Area mode** radio group: `Overlap` (default) / `Stacked`
- **Fill opacity** number input: `0.05–1.0`, default `0.3`, step `0.05`
- Plugin window height: `720px` (taller than Line Chart due to extra fields)

### Section Spacing
- `16px` between all sections (fields, groups, buttons)

### Footer
- `"Monium Design System v1.0"`
- `font-size: 10px; color: #AAAAAA; text-align: center`

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

// Shuffle palette for random colors each insert
var shuffled = PALETTE.slice();
for (var si = shuffled.length - 1; si > 0; si--) {
  var ri = Math.floor(Math.random() * (si + 1));
  var tmp = shuffled[si]; shuffled[si] = shuffled[ri]; shuffled[ri] = tmp;
}
```

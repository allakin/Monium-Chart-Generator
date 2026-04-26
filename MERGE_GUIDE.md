# Monium All Charts Generator — Merge Guide

## Overview
This document is a **skill for merging** individual chart plugins into the unified `Monium all charts generator` plugin. Use this guide after making changes to any individual plugin (`Chart Line`, `Chart Bar`, `Chart Area`, `Chart Pie`) to propagate those changes into the combined plugin.

> **Important:** Before starting any merge, always consult **`CHART_STYLE_GUIDE.md`** — it is the authoritative source of truth for the list of all existing chart plugins, their structure, shared style parameters, and design rules. Check `CHART_STYLE_GUIDE.md` to:
> - Verify the **current number of chart plugins** and their names (the project structure section)
> - Ensure the unified plugin includes **all** chart types listed there
> - Confirm that shared style parameters (palette, grid, axes, layout, events) are up to date
> - Check for any newly added chart types that need to be integrated into the unified plugin
>
> If a new chart type was added to `CHART_STYLE_GUIDE.md` but is not yet in the unified plugin — follow the "Adding a New Chart Type" section below to integrate it.

## Architecture of the Unified Plugin

### File Structure
```
Monium all charts generator/
├── manifest.json    ← plugin metadata
├── code.js          ← all chart logic (shared + per-type)
└── ui.html          ← tabbed UI for all chart types
```

### code.js Structure (top to bottom)
```
1. SHARED: PALETTE (75 colors)
2. SHARED: selectDistinctColors(count)
3. SHARED: Constants (COLOR_GRID, COLOR_AXIS, PAD_*, DEFAULT_*)
4. SHARED: CHART_NAMES array — list of all chart container names
5. SHARED: Selection tracking (lastSelectedFrameId, getSelectedFrame, getTargetFrame)
6. SHARED: Chart detection (findChartFrame — checks ALL chart names)
7. SHARED: detectChartType(chartFrame) — returns "line"|"bar"|"area"|"pie"
8. SHARED: readChartParams — delegates to type-specific parsers
9. SHARED: Axis label parsers (readYLabelsFromGroup, readXLabelsFromGroup, readAxisFromFlatChildren)
10. SHARED: detectEventsFromRects, detectCurveStyle
11. SHARED: readChartParamsFromLayers — routes to readAxisChartParamsFromLayers or readPieParamsFromLayers
12. SHARED: sendSelection()
13. SHARED: prepareContainer(chartName, replaceMode, defaultW, defaultH)
14. SHARED: insertAndNotify(ctx, chartTypeName)
15. SHARED: groupNodes(nodes, container, name)
16. SHARED: measureMaxLabelWidth, measureMaxTextWidth
17. SHARED: Event bar colors + drawEventBar + drawEvents
18. SHARED: Grid/label drawing (drawGridStandard, drawYLabelsStandard, drawXLabelsStandard)
19. SHARED: Curve path builders (buildCurvePath, buildCurvePathContinuation)
20. LINE: drawLines + generateLineChart
21. AREA: drawAreas + generateAreaChart
22. BAR: drawGridVertical, drawGridHorizontal, drawCategoryLabelsBottom, drawCategoryLabelsLeft, drawValueLabelsBottom, drawBars + generateBarChart
23. PIE: drawSlices, drawPieValueLabels, drawCenterTotal + generatePieChart
24. MAIN: figma.showUI, sendSelection, figma.on, figma.ui.onmessage (router)
```

### ui.html Structure
```
1. Shared CSS styles
2. Header + Tab bar (Line | Area | Bar | Pie)
3. Shared: Target bar, Regen button, Error message
4. Panel: line — fields specific to line chart
5. Panel: area — fields specific to area chart
6. Panel: bar — fields specific to bar chart
7. Panel: pie — fields specific to pie chart
8. Shared: Insert button + Footer
9. Script:
   - State (currentTab, storedChartData, replaceMode)
   - switchTab(tab) — shows correct panel
   - Shared helpers (setInsertEnabled, setRegenEnabled, setRadio, getRadio, setupRadioGroup)
   - Per-type visibility handlers
   - regenerate() — reads storedChartData, switches tab, populates fields
   - generate() — reads fields from current tab, sends message with chartType
   - window.onmessage — receives selection, auto-detects chart type, switches tab
   - resizeUI + MutationObserver
```

---

## Merge Procedure

### When you modify an individual plugin (e.g. Chart Line)

Follow these steps to propagate changes to the unified plugin:

#### Step 0: Check CHART_STYLE_GUIDE.md
Before merging, open `CHART_STYLE_GUIDE.md` and verify:
- The **Project Structure** section lists all current chart plugins — the unified plugin must include all of them
- No new chart types were added since the last merge (if there are — add them first, see "Adding a New Chart Type")
- Shared style parameters (palette, grid, axes, layout, events, UI patterns) have not changed — if they have, update the shared section in the unified plugin accordingly

#### Step 1: Identify what changed
Categorize changes into:
- **A) Shared code** — PALETTE, selectDistinctColors, selection tracking, event bars, grid/labels, curve builders
- **B) Chart-specific code.js** — drawing functions, generate function, readParamsFromLayers
- **C) Chart-specific ui.html** — fields, radio groups, visibility logic, regenerate/generate functions

#### Step 2: Merge shared code changes (Category A)
If PALETTE, selectDistinctColors, event colors, grid drawing, label drawing, or curve path builders changed:
1. Copy the updated function from the individual plugin
2. Replace the corresponding function in `Monium all charts generator/code.js` in the SHARED section
3. Verify no other chart type depends on the old behavior

#### Step 3: Merge chart-specific code changes (Category B)
If drawing functions or the generate function changed for a specific chart type:
1. Locate the chart type's section in the unified `code.js` (marked with `═══ CHART [TYPE] ═══`)
2. Replace the corresponding functions
3. Check if the function signature changed — if so, update the call in the generate function
4. If new parameters were added to `chartParams`, also update:
   - The `readChartParamsFromLayers` / `readAxisChartParamsFromLayers` function for that type
   - The `readChartParams` function if it needs to handle new fields

#### Step 4: Merge UI changes (Category C)
If ui.html fields, radio groups, or logic changed:
1. Locate the chart type's panel in `ui.html` (`<div class="tab-panel" id="panel-[type]">`)
2. Update the HTML fields inside that panel
3. Update the JavaScript:
   - `regenerate()` function — the `if (chartType === '[type]')` block
   - `generate()` function — the `if (currentTab === '[type]')` block
   - Visibility handlers if field show/hide logic changed
   - Radio group setup calls if new radio groups were added

#### Step 5: New chart type parameters
If a new parameter was added to a chart type:
1. **code.js** — add it to `chartParams` object in the generate function
2. **code.js** — add fallback reading in `readAxisChartParamsFromLayers` or `readPieParamsFromLayers`
3. **ui.html** — add the HTML field in the correct panel
4. **ui.html** — add it to `generate()` message
5. **ui.html** — add it to `regenerate()` field population

---

## Naming Conventions

### Element IDs in ui.html
All IDs are prefixed with the chart type to avoid conflicts:
- Line: `line-yInput`, `line-xInput`, `line-countInput`, `line-styleGroup`, etc.
- Area: `area-yInput`, `area-xInput`, `area-countInput`, `area-styleGroup`, `area-modeGroup`, etc.
- Bar: `bar-yInput`, `bar-xInput`, `bar-countInput`, `bar-orientationGroup`, `bar-modeGroup`, etc.
- Pie: `pie-valuesInput`, `pie-segmentsInput`, `pie-styleGroup`, etc.

### Radio button names
Each radio group uses a unique `name` attribute:
- Line: `lineStyle`
- Area: `areaStyle`, `areaMode`
- Bar: `barOrientation`, `barMode`
- Pie: `pieStyle`

### Container names (frame names in Figma)
Each chart type produces a frame with a specific name. These MUST match the `CHART_NAMES` array in code.js:
- `"Chart Line"`, `"Chart Bar"`, `"Chart Area"`, `"Chart Pie"`

---

## Chart Type Detection (Re-generation)

The unified plugin detects ALL chart types when a frame is selected:

1. `findChartFrame(frame)` — iterates `CHART_NAMES` array to find any chart container
2. `detectChartType(chartFrame)` — returns `"line"|"bar"|"area"|"pie"` based on `frame.name`
3. `readChartParams(chartFrame)` — reads pluginData, adds `chartType` field, delegates to type-specific fallback parser
4. UI receives `chartData` with `chartType` field — auto-switches to correct tab

This means the unified plugin can detect and regenerate charts created by ANY individual plugin, and vice versa (since they all use the same `setPluginData("chartParams", ...)` pattern).

### Auto-replacement of existing charts

`prepareContainer()` **always** removes an existing chart from the target frame before inserting a new one — regardless of chart type or `replaceMode` flag. This means:
- Switching from Line to Bar on a frame that already has a Line chart will **replace** it, not stack on top
- The `replaceMode` flag (set by "Get values from chart") is no longer required for replacement to happen — it is only used to preserve the user's intent of re-generating with the same parameters

`insertAndNotify()` uses an explicit `replacedChild` flag (not position coordinates) to determine whether a child chart was replaced, so replacement works correctly even when the old chart was at position (0, 0).

### "Get values from chart" button visibility

The "Get values from chart" button is shown **only** when the detected chart type matches the currently active tab:
- Frame has "Chart Line" → tab auto-switches to Line → button visible
- User manually switches to Bar tab → button **hidden**, "Insert chart" enabled
- After inserting Bar chart → tab stays on Bar, button shows for Bar type

This logic is centralized in `switchTab()` — both manual tab clicks and auto-switching from `window.onmessage` go through the same function.

---

## Adding a New Chart Type

> **First:** check `CHART_STYLE_GUIDE.md` — it defines the canonical list of chart types, their style parameters, and UI fields. Any new chart type should already be described there (or added there first) before being integrated into the unified plugin. Use `CHART_STYLE_GUIDE.md` as the specification for implementing the new type.

To add a new chart type (e.g. "Chart Scatter"):

### code.js
1. Add `"Chart Scatter"` to `CHART_NAMES` array
2. Add `if (chartFrame.name === "Chart Scatter") return "scatter";` to `detectChartType()`
3. Add scatter-specific fallback parser in `readChartParamsFromLayers` (or route to it)
4. Add drawing functions: `drawScatterPoints(...)`, etc.
5. Add `generateScatterChart(msg)` function
6. Add `else if (chartType === "scatter") generateScatterChart(msg);` to the message router

### ui.html
1. Add tab button: `<button class="tab-btn" data-tab="scatter" onclick="switchTab('scatter')">Scatter</button>`
2. Add panel: `<div class="tab-panel" id="panel-scatter">...</div>`
3. Add scatter fields to `regenerate()` function
4. Add scatter fields to `generate()` function
5. Add any visibility handlers for scatter-specific fields

---

## Key Rules

1. **Never duplicate shared code** — PALETTE, color selection, event bars, selection tracking, grid drawing, label drawing, and curve path builders exist ONCE in the shared section
2. **Container names must be stable** — changing a container name breaks re-generation for existing charts
3. **pluginData format must be backwards-compatible** — new fields can be added with defaults, but existing fields must not be renamed/removed
4. **Each chart type's code is self-contained** — the generate function for each type calls shared utilities but contains all type-specific logic
5. **Tab IDs follow the pattern** — `panel-[type]`, tab button `data-tab="[type]"`, element IDs `[type]-fieldName`
6. **Always test re-generation** after merging — select an existing chart, verify "Get values from chart" works, verify tab auto-switches correctly
7. **Individual plugins remain the source of truth** — make changes there first, then merge into the unified plugin using this guide
8. **`prepareContainer` always removes existing charts** — never guard chart removal with `replaceMode`. Any chart in the target frame must be removed before inserting a new one (of any type). Use `replacedChild` flag (not coordinate checks) in `insertAndNotify` to detect replacement
9. **"Get values from chart" only for matching type** — `switchTab()` must hide the regen button when `storedChartData.chartType !== currentTab`. All button state logic is centralized in `switchTab()` — both manual clicks and auto-switching from `window.onmessage` must go through it

'use strict';

/**
 * Chart Line — layers, grid, axes, curve styles, events, legend, defaults.
 * Runs against both the standalone plugin and the combined generator.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const {
  payload,
  REQUIRED_LAYERS,
  REQUIRED_PARAMS,
  LINE_STYLES,
  LEGEND_ALIGNS,
  Y_AXIS_CASES,
  X_LABELS,
} = require('./helpers/fixtures');
const {
  layer,
  layerItems,
  childNames,
  absBox,
  assertGeometryFinite,
  assertChartContainer,
  assertNoStrayPageNodes,
  assertColorsFromPalette,
  assertColorsDistinct,
  assertChartParams,
} = require('./helpers/inspect');
const {
  gridLines,
  plotOf,
  yAxisTexts,
  xAxisTexts,
  assertGridStyle,
  assertAxisTextStyle,
  assertYLabelsRightAligned,
  assertEventBars,
  assertLegendBelowPlot,
} = require('./helpers/axis');

const VARIANTS = [
  { key: 'line', label: 'standalone Chart Line' },
  { key: 'all', label: 'combined generator (line tab)' },
];

async function render(key, overrides, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 11 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload('line', overrides));
  if (h.errorNotifications().length > 0) {
    throw new Error('render failed: ' + h.errorNotifications()[0].message);
  }
  return { handle: h, frame, container: h.chart() };
}

function linesOf(container) {
  return layerItems(container, 'Lines');
}

function pathOf(node) {
  return node.vectorPaths[0].data;
}

for (const variant of VARIANTS) {
  const V = ' [' + variant.label + ']';

  // ── Structure ────────────────────────────────────────────────────────────
  test('line: default structure and layer set' + V, async () => {
    const { handle, frame, container } = await render(variant.key);

    assertChartContainer(container, 'Chart Line', 600, 400);
    assert.equal(container.parent.id, frame.id);
    for (const name of REQUIRED_LAYERS.line) {
      assert.ok(layer(container, name), 'missing layer "' + name + '"');
    }
    assert.deepEqual(
      childNames(container).sort(),
      REQUIRED_LAYERS.line.slice().sort(),
      'no unexpected layers by default',
    );
    assertGeometryFinite(container, 'line');
    assertNoStrayPageNodes(handle, [frame.id]);
  });

  test('line: one vector per series, styled per the style guide' + V, async () => {
    const { handle, container } = await render(variant.key, { linesCount: 4 });
    const lines = linesOf(container);
    assert.equal(lines.length, 4, 'one vector per line');
    for (const l of lines) {
      assert.equal(l.type, 'VECTOR');
      assert.equal(l.fills.length, 0, 'lines are unfilled');
      assert.equal(l.strokeWeight, 2, 'stroke weight 2');
      assert.equal(l.strokeCap, 'NONE');
      assert.equal(l.strokeJoin, 'ROUND');
    }
    const colors = lines.map((l) => l.strokes[0].color);
    assertColorsFromPalette(handle, colors, 'line stroke');
    assertColorsDistinct(colors, 'line colors');
  });

  test('line: chartParams carries everything paste needs' + V, async () => {
    const { handle, container } = await render(variant.key, {
      linesCount: 2,
      topEvent: true,
      bottomEvent: true,
      showLegend: true,
      legendLabels: ['One', 'Two'],
    });
    const params = assertChartParams(handle, container, REQUIRED_PARAMS.line);
    assert.equal(params.allSeries.length, 2, 'one stored series per line');
    assert.equal(params.allSeries[0].length, X_LABELS.length, 'one point per x label');
    assert.equal(params.colors.length, 2);
    assert.ok(params.topEventSegments && params.topEventSegments.length > 0);
    assert.ok(params.bottomEventSegments && params.bottomEventSegments.length > 0);
  });

  test('line: series values stay inside the Y axis range' + V, async () => {
    const { handle, container } = await render(variant.key, {
      yValues: [0, 25, 50],
      linesCount: 5,
    });
    const params = handle.chartParams(container);
    for (const series of params.allSeries) {
      for (const v of series) {
        assert.ok(v >= 0 && v <= 50, 'generated value ' + v + ' outside 0…50');
      }
    }
  });

  // ── Grid ─────────────────────────────────────────────────────────────────
  test('line: grid has one line per tick and per category' + V, async () => {
    const { container } = await render(variant.key, {
      yValues: [0, 50, 100, 150],
      xLabels: ['A', 'B', 'C'],
    });
    const grid = gridLines(container);
    assert.equal(grid.horizontal.length, 4, 'one horizontal line per Y value');
    assert.equal(grid.vertical.length, 3, 'one vertical line per X label');
    assertGridStyle(container);
  });

  test('line: grid spans the plot and overshoots 6px left' + V, async () => {
    const { container } = await render(variant.key);
    const plot = plotOf(container);
    const grid = gridLines(container);
    for (const line of grid.horizontal) {
      const b = absBox(line);
      assert.ok(Math.abs(b.x - (plot.left - 6)) < 0.01, 'horizontal line starts 6px left of plot');
      assert.ok(Math.abs(b.x + b.w - plot.right) < 0.01, 'horizontal line ends at plot right');
    }
    for (const line of grid.vertical) {
      const b = absBox(line);
      assert.ok(Math.abs(b.y - plot.top) < 0.01, 'vertical line starts at plot top');
      assert.ok(Math.abs(b.y + b.h - plot.bottom) < 0.01, 'vertical line ends at plot bottom');
    }
  });

  // ── Axes ─────────────────────────────────────────────────────────────────
  test('line: Y labels are right-aligned and ordered high → low' + V, async () => {
    const { container } = await render(variant.key, { yValues: [0, 50, 100, 150, 200] });
    assertAxisTextStyle(container, 'Y Labels');
    assertYLabelsRightAligned(container);
    assert.deepEqual(
      yAxisTexts(container).map((t) => t.characters),
      ['200', '150', '100', '50', '0'],
      'top label is the largest value',
    );
  });

  test('line: X labels run left → right, edges flush with the plot' + V, async () => {
    const { container } = await render(variant.key, { xLabels: ['Jan', 'Feb', 'Mar'] });
    assertAxisTextStyle(container, 'X Labels');
    const texts = xAxisTexts(container);
    assert.deepEqual(texts.map((t) => t.characters), ['Jan', 'Feb', 'Mar']);

    const plot = plotOf(container);
    const first = absBox(texts[0]);
    const last = absBox(texts[texts.length - 1]);
    assert.ok(Math.abs(first.x - plot.left) < 0.5, 'first label starts at the plot left edge');
    assert.ok(
      Math.abs(last.x + last.w - plot.right) < 0.5,
      'last label ends at the plot right edge',
    );
  });

  test('line: the Y unit is appended to every tick' + V, async () => {
    const { container } = await render(variant.key, { yValues: [0, 50, 100], yUnit: 'ms' });
    for (const t of yAxisTexts(container)) {
      assert.ok(t.characters.endsWith('ms'), 'label "' + t.characters + '" lacks the unit');
    }
  });

  test('line: every accepted Y axis input renders its labels verbatim' + V, async () => {
    // ui.html parses the raw axis input with the same parser the plugin
    // exposes, so positions come from parseAxisLabel and text is kept as typed.
    const parser = loadPlugin(variant.key, { seed: 1 }).global.parseAxisLabel;
    for (const testCase of Y_AXIS_CASES) {
      const values = testCase.labels.map((s) => parser(s).value);
      const { container } = await render(variant.key, {
        yValues: values,
        yLabels: testCase.labels,
      });
      const drawn = yAxisTexts(container).map((t) => t.characters);
      assert.deepEqual(
        drawn.slice().sort(),
        testCase.labels.slice().sort(),
        testCase.name + ': labels must be drawn as typed, got ' + drawn.join(', '),
      );
    }
  });

  test('line: longer Y labels push the plot to the right' + V, async () => {
    const short = await render(variant.key, { yValues: [0, 1, 2] });
    const long = await render(variant.key, { yValues: [0, 1000000, 2000000] });
    assert.ok(
      plotOf(long.container).left > plotOf(short.container).left,
      'padLeft adapts to the widest Y label',
    );
  });

  // ── Curve styles ─────────────────────────────────────────────────────────
  test('line: smooth style emits cubic segments' + V, async () => {
    const { container } = await render(variant.key, { lineStyle: 'smooth' });
    const path = pathOf(linesOf(container)[0]);
    assert.ok(path.includes(' C '), 'smooth path uses cubic curves');
    assert.ok(path.startsWith('M '), 'path starts with a move');
  });

  test('line: sharp style emits straight segments only' + V, async () => {
    const { container } = await render(variant.key, { lineStyle: 'sharp' });
    const path = pathOf(linesOf(container)[0]);
    assert.ok(!path.includes(' C '), 'sharp path has no curves');
    assert.equal(
      (path.match(/ L /g) || []).length,
      X_LABELS.length - 1,
      'one segment between neighbouring points',
    );
  });

  test('line: peak style densifies the series tenfold' + V, async () => {
    const { handle, container } = await render(variant.key, { lineStyle: 'peak' });
    const params = handle.chartParams(container);
    assert.equal(
      params.allSeries[0].length,
      (X_LABELS.length - 1) * 10 + 1,
      'peak style generates 10 points per interval',
    );
    const path = pathOf(linesOf(container)[0]);
    assert.ok(!path.includes(' C '), 'peak path is drawn with straight segments');
    assert.equal((path.match(/ L /g) || []).length, (X_LABELS.length - 1) * 10);
  });

  test('line: smooth curves never overshoot the plot area' + V, async () => {
    const { container } = await render(variant.key, { lineStyle: 'smooth', linesCount: 6 });
    const plot = plotOf(container);
    for (const l of linesOf(container)) {
      const nums = pathOf(l).match(/-?\d+(?:\.\d+)?/g).map(Number);
      for (let i = 1; i < nums.length; i += 2) {
        assert.ok(
          nums[i] >= plot.top - 0.5 && nums[i] <= plot.bottom + 0.5,
          'control/anchor y ' + nums[i] + ' escaped the plot [' + plot.top + ', ' + plot.bottom + ']',
        );
      }
    }
  });

  test('line: line vectors stay within the plot horizontally' + V, async () => {
    const { container } = await render(variant.key);
    const plot = plotOf(container);
    for (const l of linesOf(container)) {
      const b = absBox(l);
      assert.ok(b.x >= plot.left - 0.5, 'line starts at the plot left');
      assert.ok(b.x + b.w <= plot.right + 0.5, 'line ends at the plot right');
    }
  });

  // ── Events ───────────────────────────────────────────────────────────────
  test('line: top and bottom event bars render outside the plot' + V, async () => {
    const { container } = await render(variant.key, { topEvent: true, bottomEvent: true });
    assert.ok(layer(container, 'Top Events'), 'Top Events layer');
    assert.ok(layer(container, 'Bottom Events'), 'Bottom Events layer');
    assertEventBars(container, 'Top Events', 'top');
    assertEventBars(container, 'Bottom Events', 'bottom');
  });

  test('line: event segments are stored as 0…1 fractions' + V, async () => {
    const { handle, container } = await render(variant.key, { topEvent: true, bottomEvent: true });
    const params = handle.chartParams(container);
    for (const key of ['topEventSegments', 'bottomEventSegments']) {
      for (const seg of params[key]) {
        assert.ok(seg.x >= 0 && seg.x <= 1, key + ' x fraction ' + seg.x);
        assert.ok(seg.w > 0 && seg.w <= 1, key + ' w fraction ' + seg.w);
        assert.ok(seg.x + seg.w <= 1.0001, key + ' segment runs past the plot');
        assert.ok(seg.color && typeof seg.color.r === 'number', key + ' segment has a color');
      }
    }
  });

  test('line: events are absent unless requested' + V, async () => {
    const { container } = await render(variant.key);
    assert.equal(layer(container, 'Top Events'), null);
    assert.equal(layer(container, 'Bottom Events'), null);
  });

  // ── Legend ───────────────────────────────────────────────────────────────
  test('line: legend uses a 14×2 line marker, not a dot' + V, async () => {
    const { container } = await render(variant.key, {
      linesCount: 3,
      showLegend: true,
      legendLabels: ['Alpha', 'Beta', 'Gamma'],
    });
    const items = layerItems(container, 'Legend');
    const markers = items.filter((n) => n.type === 'RECTANGLE');
    assert.equal(markers.length, 3, 'one marker per line');
    assert.equal(items.filter((n) => n.type === 'ELLIPSE').length, 0, 'line legend has no dots');
    for (const m of markers) {
      assert.equal(m.width, 14, 'marker width 14');
      assert.equal(m.height, 2, 'marker height 2');
      assert.equal(m.cornerRadius, 1);
    }
    assert.deepEqual(
      items.filter((n) => n.type === 'TEXT').map((t) => t.characters),
      ['Alpha', 'Beta', 'Gamma'],
    );
  });

  test('line: legend marker colors match the line colors' + V, async () => {
    const { container } = await render(variant.key, {
      linesCount: 3,
      showLegend: true,
      legendLabels: ['A', 'B', 'C'],
    });
    const lineColors = linesOf(container).map((l) => l.strokes[0].color);
    const markers = layerItems(container, 'Legend')
      .filter((n) => n.type === 'RECTANGLE')
      .sort((a, b) => absBox(a).x - absBox(b).x);
    markers.forEach((m, i) => {
      assert.deepEqual(
        { r: m.fills[0].color.r, g: m.fills[0].color.g, b: m.fills[0].color.b },
        { r: lineColors[i].r, g: lineColors[i].g, b: lineColors[i].b },
        'legend marker ' + i + ' color matches its line',
      );
    });
  });

  test('line: legend takes height away from the plot' + V, async () => {
    const without = await render(variant.key);
    const with_ = await render(variant.key, {
      showLegend: true,
      legendLabels: ['A', 'B', 'C'],
    });
    assert.ok(
      plotOf(with_.container).bottom < plotOf(without.container).bottom,
      'the plot ends higher up when a legend is shown',
    );
    assertLegendBelowPlot(with_.container);
  });

  test('line: legend alignment shifts the row' + V, async () => {
    const xs = {};
    for (const align of LEGEND_ALIGNS) {
      const { container } = await render(variant.key, {
        showLegend: true,
        legendLabels: ['A', 'B'],
        legendAlign: align,
        linesCount: 2,
      });
      const markers = layerItems(container, 'Legend').filter((n) => n.type === 'RECTANGLE');
      xs[align] = Math.min.apply(null, markers.map((m) => absBox(m).x));
    }
    assert.ok(xs.left < xs.center && xs.center < xs.right, JSON.stringify(xs));
  });

  test('line: showLegend false ignores any labels supplied' + V, async () => {
    const { container } = await render(variant.key, {
      showLegend: false,
      legendLabels: ['A', 'B', 'C'],
    });
    assert.equal(layer(container, 'Legend'), null, 'no legend layer');
  });

  // ── Defaults and clamping ────────────────────────────────────────────────
  test('line: fewer than two Y values falls back to the default scale' + V, async () => {
    for (const yValues of [[], [42]]) {
      const { handle, container } = await render(variant.key, { yValues, yLabels: null });
      const params = handle.chartParams(container);
      assert.deepEqual(params.yValues, [0, 50, 100, 150, 200], 'default Y scale');
    }
  });

  test('line: empty X labels fall back to six months' + V, async () => {
    const { handle, container } = await render(variant.key, { xLabels: [] });
    const params = handle.chartParams(container);
    assert.deepEqual(params.xLabels, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  });

  test('line: line count is clamped to 1…20' + V, async () => {
    const zero = await render(variant.key, { linesCount: 0 });
    assert.equal(linesOf(zero.container).length, 2, 'falsy count falls back to 2');

    const over = await render(variant.key, { linesCount: 50 });
    assert.equal(linesOf(over.container).length, 20, 'count is capped at 20');

    const one = await render(variant.key, { linesCount: 1 });
    assert.equal(linesOf(one.container).length, 1, 'a single line is allowed');
    assert.ok(layer(one.container, 'Lines'), 'a single line still gets the Lines layer');
  });

  test('line: twenty lines still get distinct palette colors' + V, async () => {
    const { handle, container: c } = await render(variant.key, { linesCount: 20 });
    const colors = linesOf(c).map((l) => l.strokes[0].color);
    assertColorsFromPalette(handle, colors, 'line stroke');
    assertColorsDistinct(colors, '20 line colors');
  });

  // ── Degenerate inputs ────────────────────────────────────────────────────
  test('line: a flat Y scale does not divide by zero' + V, async () => {
    const { container } = await render(variant.key, { yValues: [100, 100, 100] });
    assertGeometryFinite(container, 'flat scale');
    const path = pathOf(linesOf(container)[0]);
    assert.ok(!/NaN|Infinity/.test(path), 'path has no NaN, got ' + path.slice(0, 80));
  });

  test('line: a single X label collapses to one point without NaN' + V, async () => {
    const { container } = await render(variant.key, { xLabels: ['Only'] });
    assertGeometryFinite(container, 'single x label');
    for (const l of linesOf(container)) {
      assert.ok(!/NaN|Infinity/.test(pathOf(l)));
    }
  });

  test('line: negative and mixed-sign Y values render' + V, async () => {
    const { container } = await render(variant.key, { yValues: [-100, -50, 0, 50, 100] });
    assertGeometryFinite(container, 'negative scale');
    assert.deepEqual(
      yAxisTexts(container).map((t) => t.characters),
      ['100', '50', '0', '-50', '-100'],
    );
  });

  test('line: unsorted Y values are sorted onto the axis' + V, async () => {
    const { container } = await render(variant.key, { yValues: [100, 0, 50] });
    const drawn = yAxisTexts(container).map((t) => t.characters);
    assert.deepEqual(drawn, ['100', '50', '0'], 'axis renders high → low regardless of input order');
  });

  test('line: every style renders at every frame size' + V, async () => {
    const sizes = [
      { w: 1200, h: 800 },
      { w: 600, h: 400 },
      { w: 320, h: 180 },
      { w: 233, h: 95 },
    ];
    for (const size of sizes) {
      for (const style of LINE_STYLES) {
        const h = loadPlugin(variant.key, { seed: 5 });
        h.selectFrame(size.w, size.h);
        await h.generate(payload('line', { lineStyle: style }));
        const label = size.w + 'x' + size.h + ' ' + style;
        assert.deepEqual(h.errorNotifications().map((n) => n.message), [], label);
        assertGeometryFinite(h.chart(), label);
        assert.equal(linesOf(h.chart()).length, 3, label + ': all lines drawn');
      }
    }
  });
}

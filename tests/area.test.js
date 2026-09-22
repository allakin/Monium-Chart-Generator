'use strict';

/**
 * Chart Area — fills, overlap vs stacked stacking, fill-to-height scaling,
 * curve styles, events, legend, defaults.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const {
  payload,
  REQUIRED_LAYERS,
  REQUIRED_PARAMS,
  AREA_STYLES,
  AREA_MODES,
  LEGEND_ALIGNS,
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
  { key: 'area', label: 'standalone Chart Area' },
  { key: 'all', label: 'combined generator (area tab)' },
];

async function render(key, overrides, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 23 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload('area', overrides));
  if (h.errorNotifications().length > 0) {
    throw new Error('render failed: ' + h.errorNotifications()[0].message);
  }
  return { handle: h, frame, container: h.chart() };
}

function areasOf(container) {
  return layerItems(container, 'Areas');
}

function pathOf(node) {
  return node.vectorPaths[0].data;
}

for (const variant of VARIANTS) {
  const V = ' [' + variant.label + ']';

  // ── Structure ────────────────────────────────────────────────────────────
  test('area: default structure and layer set' + V, async () => {
    const { handle, frame, container } = await render(variant.key);

    assertChartContainer(container, 'Chart Area', 600, 400);
    assert.equal(container.parent.id, frame.id);
    assert.deepEqual(
      childNames(container).sort(),
      REQUIRED_LAYERS.area.slice().sort(),
      'exactly the default layers',
    );
    assertGeometryFinite(container, 'area');
    assertNoStrayPageNodes(handle, [frame.id]);
  });

  test('area: one closed, filled and hairline-stroked vector per series' + V, async () => {
    const { handle, container } = await render(variant.key, { areasCount: 4 });
    const areas = areasOf(container);
    assert.equal(areas.length, 4);
    for (const a of areas) {
      assert.equal(a.type, 'VECTOR');
      assert.ok(pathOf(a).trim().endsWith('Z'), 'area path is closed');
      assert.equal(a.fills[0].type, 'SOLID');
      assert.equal(a.strokeWeight, 0.2, 'hairline outline per style guide');
      assert.equal(a.strokeAlign, 'INSIDE');
      assert.equal(a.strokes[0].opacity, 0.2);
    }
    const colors = areas.map((a) => a.fills[0].color);
    assertColorsFromPalette(handle, colors, 'area fill');
    assertColorsDistinct(colors, 'area colors');
  });

  test('area: chartParams carries everything paste needs' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areasCount: 2,
      areaMode: 'stacked',
      fillHeight: true,
      topEvent: true,
    });
    const params = assertChartParams(handle, container, REQUIRED_PARAMS.area);
    assert.equal(params.areaMode, 'stacked');
    assert.equal(params.fillHeight, true);
    assert.equal(params.allSeries.length, 2);
    assert.equal(params.allSeries[0].length, X_LABELS.length);
  });

  test('area: fill opacity defaults to 0.3 and clamps to 0.05…1' + V, async () => {
    const def = await render(variant.key, { fillOpacity: undefined });
    assert.equal(areasOf(def.container)[0].fills[0].opacity, 0.3, 'default 0.3');

    const custom = await render(variant.key, { fillOpacity: 0.75 });
    assert.equal(areasOf(custom.container)[0].fills[0].opacity, 0.75);

    const low = await render(variant.key, { fillOpacity: 0 });
    assert.equal(areasOf(low.container)[0].fills[0].opacity, 0.05, 'clamped up');

    const high = await render(variant.key, { fillOpacity: 3 });
    assert.equal(areasOf(high.container)[0].fills[0].opacity, 1, 'clamped down');
  });

  // ── Stacking modes ───────────────────────────────────────────────────────
  test('area: overlap mode draws every area down to the baseline' + V, async () => {
    const { container } = await render(variant.key, { areaMode: 'overlap', areasCount: 3 });
    const plot = plotOf(container);
    for (const a of areasOf(container)) {
      const b = absBox(a);
      assert.ok(
        Math.abs(b.y + b.h - plot.bottom) < 0.5,
        'area bottom ' + (b.y + b.h) + ' must reach the baseline ' + plot.bottom,
      );
    }
  });

  test('area: stacked mode lifts each area onto the previous one' + V, async () => {
    const { container } = await render(variant.key, { areaMode: 'stacked', areasCount: 3 });
    const plot = plotOf(container);
    const boxes = areasOf(container).map(absBox);

    assert.ok(
      Math.abs(boxes[0].y + boxes[0].h - plot.bottom) < 0.5,
      'the first area still sits on the baseline',
    );
    for (let i = 1; i < boxes.length; i++) {
      assert.ok(
        boxes[i].y + boxes[i].h < boxes[i - 1].y + boxes[i - 1].h - 3,
        'area ' + i + ' floats above area ' + (i - 1) + ' instead of reaching the baseline',
      );
    }
  });

  test('area: stacked mode scales series so the stack fits the axis' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areaMode: 'stacked',
      areasCount: 4,
      fillHeight: false,
      yValues: [0, 100],
    });
    const params = handle.chartParams(container);
    const ceiling = 100 / 4;
    for (const series of params.allSeries) {
      for (const v of series) {
        assert.ok(
          v <= ceiling + 1e-9,
          'stacked value ' + v + ' exceeds the 1/areasCount share (' + ceiling + ')',
        );
      }
    }
  });

  test('area: fill-to-height doubles the stacked share' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areaMode: 'stacked',
      areasCount: 4,
      fillHeight: true,
      yValues: [0, 100],
    });
    const params = handle.chartParams(container);
    const ceiling = (2 * 100) / 4;
    let max = 0;
    for (const series of params.allSeries) {
      for (const v of series) {
        assert.ok(v <= ceiling + 1e-9, 'value ' + v + ' exceeds the doubled share');
        if (v > max) max = v;
      }
    }
    assert.ok(max > 100 / 4, 'fill-to-height actually raises the values');
  });

  test('area: fill-to-height pushes the top area against the plot ceiling' + V, async () => {
    const { container } = await render(variant.key, {
      areaMode: 'stacked',
      areasCount: 3,
      fillHeight: true,
    });
    const plot = plotOf(container);
    const top = areasOf(container).map(absBox).pop();
    assert.ok(
      top.y <= plot.top + plot.height * 0.15,
      'topmost area starts within 15% of the plot top (' + top.y + ' vs ' + plot.top + ')',
    );
  });

  test('area: overlap mode does not scale the series' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areaMode: 'overlap',
      areasCount: 4,
      yValues: [0, 100],
    });
    const params = handle.chartParams(container);
    let max = 0;
    for (const series of params.allSeries) for (const v of series) if (v > max) max = v;
    assert.ok(max > 100 / 4, 'overlap series use the full axis range, max was ' + max);
  });

  test('area: a single stacked area is left unscaled' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areaMode: 'stacked',
      areasCount: 1,
      yValues: [0, 100],
    });
    const params = handle.chartParams(container);
    assert.equal(params.allSeries.length, 1);
    const max = Math.max.apply(null, params.allSeries[0]);
    assert.ok(max > 25, 'one area keeps the full range, max was ' + max);
  });

  // ── Curve styles ─────────────────────────────────────────────────────────
  test('area: smooth style uses cubic segments, sharp does not' + V, async () => {
    const smooth = await render(variant.key, { areaStyle: 'smooth' });
    assert.ok(pathOf(areasOf(smooth.container)[0]).includes(' C '));

    const sharp = await render(variant.key, { areaStyle: 'sharp' });
    assert.ok(!pathOf(areasOf(sharp.container)[0]).includes(' C '));
  });

  test('area: peak style densifies the series tenfold' + V, async () => {
    const { handle, container } = await render(variant.key, { areaStyle: 'peak' });
    const params = handle.chartParams(container);
    assert.equal(params.allSeries[0].length, (X_LABELS.length - 1) * 10 + 1);
  });

  test('area: areas never escape the plot rectangle' + V, async () => {
    for (const mode of AREA_MODES) {
      for (const style of AREA_STYLES) {
        const { container } = await render(variant.key, {
          areaMode: mode,
          areaStyle: style,
          areasCount: 3,
        });
        const plot = plotOf(container);
        for (const a of areasOf(container)) {
          const b = absBox(a);
          const label = mode + '/' + style;
          assert.ok(b.x >= plot.left - 0.5, label + ': area overflows left');
          assert.ok(b.x + b.w <= plot.right + 0.5, label + ': area overflows right');
          assert.ok(b.y >= plot.top - 0.5, label + ': area overflows the plot top');
          assert.ok(b.y + b.h <= plot.bottom + 0.5, label + ': area overflows the baseline');
        }
      }
    }
  });

  // ── Axes and grid ────────────────────────────────────────────────────────
  test('area: grid and axes follow the Line chart layout' + V, async () => {
    const { container } = await render(variant.key, {
      yValues: [0, 50, 100],
      xLabels: ['A', 'B', 'C', 'D'],
    });
    const grid = gridLines(container);
    assert.equal(grid.horizontal.length, 3);
    assert.equal(grid.vertical.length, 4);
    assertGridStyle(container);
    assertAxisTextStyle(container, 'Y Labels');
    assertAxisTextStyle(container, 'X Labels');
    assertYLabelsRightAligned(container);
    assert.deepEqual(yAxisTexts(container).map((t) => t.characters), ['100', '50', '0']);
    assert.deepEqual(xAxisTexts(container).map((t) => t.characters), ['A', 'B', 'C', 'D']);
  });

  test('area: the Y unit is appended to every tick' + V, async () => {
    const { container } = await render(variant.key, { yUnit: '%' });
    for (const t of yAxisTexts(container)) {
      assert.ok(t.characters.endsWith('%'), 'label "' + t.characters + '" lacks the unit');
    }
  });

  // ── Events and legend ────────────────────────────────────────────────────
  test('area: event bars render on both sides of the plot' + V, async () => {
    const { container } = await render(variant.key, { topEvent: true, bottomEvent: true });
    assertEventBars(container, 'Top Events', 'top');
    assertEventBars(container, 'Bottom Events', 'bottom');
  });

  test('area: legend uses an 8px dot marker' + V, async () => {
    const { container } = await render(variant.key, {
      areasCount: 3,
      showLegend: true,
      legendLabels: ['A', 'B', 'C'],
    });
    const items = layerItems(container, 'Legend');
    const dots = items.filter((n) => n.type === 'ELLIPSE');
    assert.equal(dots.length, 3);
    assert.equal(items.filter((n) => n.type === 'RECTANGLE').length, 0, 'area legend has no bars');
    for (const d of dots) assert.equal(d.width, 8);
    assertLegendBelowPlot(container);
  });

  test('area: legend alignment shifts the row' + V, async () => {
    const xs = {};
    for (const align of LEGEND_ALIGNS) {
      const { container } = await render(variant.key, {
        areasCount: 2,
        showLegend: true,
        legendLabels: ['A', 'B'],
        legendAlign: align,
      });
      const dots = layerItems(container, 'Legend').filter((n) => n.type === 'ELLIPSE');
      xs[align] = Math.min.apply(null, dots.map((d) => absBox(d).x));
    }
    assert.ok(xs.left < xs.center && xs.center < xs.right, JSON.stringify(xs));
  });

  // ── Defaults and degenerate inputs ───────────────────────────────────────
  test('area: counts and axes fall back to documented defaults' + V, async () => {
    const { handle, container } = await render(variant.key, {
      areasCount: 0,
      yValues: [],
      xLabels: [],
    });
    const params = handle.chartParams(container);
    assert.equal(params.areasCount, 2, 'falsy count falls back to 2');
    assert.deepEqual(params.yValues, [0, 50, 100, 150, 200]);
    assert.deepEqual(params.xLabels, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  });

  test('area: the area count is capped at 20' + V, async () => {
    const { container } = await render(variant.key, { areasCount: 99 });
    assert.equal(areasOf(container).length, 20);
  });

  test('area: a flat Y scale and a single X label stay finite' + V, async () => {
    const flat = await render(variant.key, { yValues: [7, 7] });
    assertGeometryFinite(flat.container, 'flat scale');

    const single = await render(variant.key, { xLabels: ['Only'] });
    assertGeometryFinite(single.container, 'single x label');
    for (const a of areasOf(single.container)) {
      assert.ok(!/NaN|Infinity/.test(pathOf(a)));
    }
  });

  test('area: every mode × style renders at every frame size' + V, async () => {
    const sizes = [
      { w: 1200, h: 800 },
      { w: 600, h: 400 },
      { w: 320, h: 180 },
      { w: 233, h: 95 },
    ];
    for (const size of sizes) {
      for (const mode of AREA_MODES) {
        for (const style of AREA_STYLES) {
          const h = loadPlugin(variant.key, { seed: 9 });
          h.selectFrame(size.w, size.h);
          await h.generate(payload('area', { areaMode: mode, areaStyle: style }));
          const label = size.w + 'x' + size.h + ' ' + mode + '/' + style;
          assert.deepEqual(h.errorNotifications().map((n) => n.message), [], label);
          assert.equal(areasOf(h.chart()).length, 3, label + ': all areas drawn');
          assertGeometryFinite(h.chart(), label);
        }
      }
    }
  });
}

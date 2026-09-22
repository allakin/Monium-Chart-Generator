'use strict';

/**
 * Chart Bar — bar counts per mode, orientation, baseline alignment, gaps,
 * dense mode, axis swapping, events, legend, defaults.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const {
  payload,
  REQUIRED_LAYERS,
  REQUIRED_PARAMS,
  BAR_MODES,
  ORIENTATIONS,
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
  assertEventBars,
  assertLegendBelowPlot,
} = require('./helpers/axis');

const VARIANTS = [
  { key: 'bar', label: 'standalone Chart Bar' },
  { key: 'all', label: 'combined generator (bar tab)' },
];

async function render(key, overrides, size) {
  const s = size || { w: 600, h: 400 };
  const h = loadPlugin(key, { seed: 31 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload('bar', overrides));
  if (h.errorNotifications().length > 0) {
    throw new Error('render failed: ' + h.errorNotifications()[0].message);
  }
  return { handle: h, frame, container: h.chart() };
}

function barsOf(container) {
  return layerItems(container, 'Bars');
}

for (const variant of VARIANTS) {
  const V = ' [' + variant.label + ']';

  // ── Structure ────────────────────────────────────────────────────────────
  test('bar: default structure and layer set' + V, async () => {
    const { handle, frame, container } = await render(variant.key);

    assertChartContainer(container, 'Chart Bar', 600, 400);
    assert.equal(container.parent.id, frame.id);
    assert.deepEqual(
      childNames(container).sort(),
      REQUIRED_LAYERS.bar.slice().sort(),
      'exactly the default layers',
    );
    for (const b of barsOf(container)) assert.equal(b.type, 'RECTANGLE', 'bars are rectangles');
    assertGeometryFinite(container, 'bar');
    assertNoStrayPageNodes(handle, [frame.id]);
  });

  test('bar: chartParams carries everything paste needs' + V, async () => {
    const { handle, container } = await render(variant.key, {
      barMode: 'grouped',
      barsCount: 3,
      orientation: 'horizontal',
      dense: false,
      barGap: 4,
      fillOpacity: 0.8,
    });
    const params = assertChartParams(handle, container, REQUIRED_PARAMS.bar);
    assert.equal(params.barMode, 'grouped');
    assert.equal(params.orientation, 'horizontal');
    assert.equal(params.barGap, 4);
    assert.equal(params.fillOpacity, 0.8);
    assert.equal(params.allSeries.length, 3);
  });

  // ── Bar counts per mode ──────────────────────────────────────────────────
  test('bar: normal mode collapses to one series per category' + V, async () => {
    const { handle, container } = await render(variant.key, { barMode: 'normal', barsCount: 5 });
    assert.equal(barsOf(container).length, X_LABELS.length, 'one bar per category');
    assert.equal(
      handle.chartParams(container).barsCount,
      1,
      'normal mode stores barsCount 1 regardless of the requested count',
    );
  });

  test('bar: grouped mode draws categories × series bars' + V, async () => {
    for (const count of [2, 3, 5]) {
      const { container } = await render(variant.key, { barMode: 'grouped', barsCount: count });
      assert.equal(
        barsOf(container).length,
        X_LABELS.length * count,
        'grouped with ' + count + ' series',
      );
    }
  });

  test('bar: stacked mode draws categories × series bars' + V, async () => {
    const { container } = await render(variant.key, { barMode: 'stacked', barsCount: 4 });
    assert.equal(barsOf(container).length, X_LABELS.length * 4);
  });

  test('bar: dense mode multiplies the slots tenfold' + V, async () => {
    const normal = await render(variant.key, { barMode: 'normal', dense: true });
    assert.equal(
      barsOf(normal.container).length,
      X_LABELS.length * 10,
      'dense normal mode packs ten bars per category',
    );

    const stacked = await render(variant.key, {
      barMode: 'stacked',
      barsCount: 2,
      dense: true,
    });
    assert.equal(barsOf(stacked.container).length, X_LABELS.length * 10 * 2);

    const grouped = await render(variant.key, {
      barMode: 'grouped',
      barsCount: 2,
      dense: true,
    });
    assert.equal(
      barsOf(grouped.container).length,
      X_LABELS.length * 2,
      'dense does not apply to grouped mode',
    );
  });

  test('bar: series count is capped at 20' + V, async () => {
    const { container } = await render(variant.key, { barMode: 'grouped', barsCount: 99 });
    assert.equal(barsOf(container).length, X_LABELS.length * 20);
  });

  // ── Colors and opacity ───────────────────────────────────────────────────
  test('bar: each series gets its own palette color' + V, async () => {
    const { handle, container } = await render(variant.key, {
      barMode: 'grouped',
      barsCount: 4,
    });
    const colors = handle.chartParams(container).colors;
    assert.equal(colors.length, 4);
    assertColorsFromPalette(handle, colors, 'bar fill');
    assertColorsDistinct(colors, 'bar colors');

    // Within one category, neighbouring bars must differ.
    const bars = barsOf(container)
      .slice()
      .sort((a, b) => absBox(a).x - absBox(b).x);
    const firstGroup = bars.slice(0, 4).map((b) => b.fills[0].color.r + ',' + b.fills[0].color.g);
    assert.equal(new Set(firstGroup).size, 4, 'bars inside a group are differently colored');
  });

  test('bar: fill opacity is applied and clamped' + V, async () => {
    const custom = await render(variant.key, { fillOpacity: 0.4 });
    for (const b of barsOf(custom.container)) assert.equal(b.fills[0].opacity, 0.4);

    const low = await render(variant.key, { fillOpacity: 0 });
    assert.equal(barsOf(low.container)[0].fills[0].opacity, 0.05);

    const high = await render(variant.key, { fillOpacity: 9 });
    assert.equal(barsOf(high.container)[0].fills[0].opacity, 1);
  });

  // ── Vertical geometry ────────────────────────────────────────────────────
  test('bar: vertical bars sit on the baseline and stay in the plot' + V, async () => {
    const { container } = await render(variant.key, { orientation: 'vertical' });
    const plot = plotOf(container);
    for (const b of barsOf(container)) {
      const box = absBox(b);
      assert.ok(
        Math.abs(box.y + box.h - plot.bottom) < 0.5,
        'bar bottom ' + (box.y + box.h) + ' must rest on the baseline ' + plot.bottom,
      );
      assert.ok(box.y >= plot.top - 0.5, 'bar top stays inside the plot');
      assert.ok(box.x >= plot.left - 0.5, 'bar stays right of the axis');
      assert.ok(box.x + box.w <= plot.right + 0.5, 'bar stays inside the plot width');
    }
  });

  test('bar: vertical stacked bars pile up without gaps' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'vertical',
      barMode: 'stacked',
      barsCount: 3,
    });
    const plot = plotOf(container);
    const columns = new Map();
    for (const b of barsOf(container)) {
      const box = absBox(b);
      const key = Math.round(box.x * 10) / 10;
      if (!columns.has(key)) columns.set(key, []);
      columns.get(key).push(box);
    }
    assert.equal(columns.size, X_LABELS.length, 'one column per category');

    for (const [x, boxes] of columns) {
      boxes.sort((a, b) => b.y - a.y);
      assert.ok(
        Math.abs(boxes[0].y + boxes[0].h - plot.bottom) < 0.5,
        'column ' + x + ' starts at the baseline',
      );
      for (let i = 1; i < boxes.length; i++) {
        assert.ok(
          Math.abs(boxes[i].y + boxes[i].h - boxes[i - 1].y) < 0.5,
          'segment ' + i + ' stacks directly on the previous one in column ' + x,
        );
      }
    }
  });

  test('bar: the bar gap narrows the bars' + V, async () => {
    const tight = await render(variant.key, { barGap: 0 });
    const loose = await render(variant.key, { barGap: 20 });
    const tightW = barsOf(tight.container)[0].width;
    const looseW = barsOf(loose.container)[0].width;
    assert.ok(looseW < tightW, 'a larger gap yields narrower bars (' + looseW + ' < ' + tightW + ')');
    assert.ok(Math.abs(tightW - looseW - 20) < 0.5, 'the gap is taken out of the slot width');
  });

  test('bar: an absurd gap still leaves a visible bar' + V, async () => {
    const { handle, container } = await render(variant.key, { barGap: 1000 });
    assert.equal(handle.errorNotifications().length, 0);
    for (const b of barsOf(container)) {
      assert.ok(b.width >= 0.01, 'bar width stays within Figma limits, got ' + b.width);
    }
  });

  // ── Horizontal geometry ──────────────────────────────────────────────────
  test('bar: horizontal bars grow from the left edge' + V, async () => {
    const { container } = await render(variant.key, { orientation: 'horizontal' });
    const plot = plotOf(container);
    for (const b of barsOf(container)) {
      const box = absBox(b);
      assert.ok(Math.abs(box.x - plot.left) < 0.5, 'bar starts at the value axis origin');
      assert.ok(box.x + box.w <= plot.right + 0.5, 'bar ends inside the plot');
      assert.ok(box.y >= plot.top - 0.5 && box.y + box.h <= plot.bottom + 6.5, 'bar within rows');
    }
  });

  test('bar: horizontal orientation swaps the axes' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'horizontal',
      xLabels: ['Alpha', 'Beta', 'Gamma'],
      yValues: [0, 50, 100],
    });
    assert.deepEqual(
      yAxisTexts(container).map((t) => t.characters),
      ['Alpha', 'Beta', 'Gamma'],
      'categories move to the left axis',
    );
    assert.deepEqual(
      xAxisTexts(container).map((t) => t.characters),
      ['0', '50', '100'],
      'values move to the bottom axis',
    );
  });

  test('bar: horizontal stacked bars chain left to right' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'horizontal',
      barMode: 'stacked',
      barsCount: 3,
    });
    const plot = plotOf(container);
    const rows = new Map();
    for (const b of barsOf(container)) {
      const box = absBox(b);
      const key = Math.round(box.y * 10) / 10;
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(box);
    }
    for (const [y, boxes] of rows) {
      boxes.sort((a, b) => a.x - b.x);
      assert.ok(Math.abs(boxes[0].x - plot.left) < 0.5, 'row ' + y + ' starts at the axis');
      for (let i = 1; i < boxes.length; i++) {
        assert.ok(
          Math.abs(boxes[i].x - (boxes[i - 1].x + boxes[i - 1].w)) < 0.5,
          'segment ' + i + ' continues where the previous ended in row ' + y,
        );
      }
    }
  });

  // ── Grid and axes ────────────────────────────────────────────────────────
  test('bar: vertical grid has value lines and category ticks' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'vertical',
      yValues: [0, 50, 100],
      xLabels: ['A', 'B', 'C', 'D'],
    });
    const grid = gridLines(container);
    assert.equal(grid.horizontal.length, 3, 'one horizontal line per value');
    assert.equal(grid.vertical.length, 4, 'one vertical tick per category');
    assertGridStyle(container);
  });

  test('bar: horizontal grid mirrors the vertical one' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'horizontal',
      yValues: [0, 50, 100],
      xLabels: ['A', 'B', 'C', 'D'],
    });
    const grid = gridLines(container);
    assert.equal(grid.vertical.length, 3, 'one vertical line per value');
    assert.equal(grid.horizontal.length, 4, 'one horizontal line per category');
  });

  test('bar: category labels are centered in their slot' + V, async () => {
    const { container } = await render(variant.key, {
      orientation: 'vertical',
      xLabels: ['A', 'B', 'C'],
    });
    const plot = plotOf(container);
    const slotW = plot.width / 3;
    const texts = xAxisTexts(container);
    texts.forEach((t, i) => {
      const box = absBox(t);
      const expected = plot.left + slotW * i + slotW / 2;
      assert.ok(
        Math.abs(box.x + box.w / 2 - expected) < 0.5,
        'label ' + i + ' center ' + (box.x + box.w / 2) + ' ≠ slot center ' + expected,
      );
    });
  });

  test('bar: axis text styling matches the style guide' + V, async () => {
    const { container } = await render(variant.key);
    assertAxisTextStyle(container, 'Y Labels');
    assertAxisTextStyle(container, 'X Labels');
  });

  test('bar: the Y unit is appended on the value axis only' + V, async () => {
    const vertical = await render(variant.key, { orientation: 'vertical', yUnit: 'ms' });
    for (const t of yAxisTexts(vertical.container)) {
      assert.ok(t.characters.endsWith('ms'), 'vertical value label keeps the unit');
    }

    const horizontal = await render(variant.key, {
      orientation: 'horizontal',
      yUnit: 'ms',
      xLabels: ['Alpha', 'Beta'],
    });
    for (const t of yAxisTexts(horizontal.container)) {
      assert.ok(!t.characters.endsWith('ms'), 'category labels stay unitless');
    }
    for (const t of xAxisTexts(horizontal.container)) {
      assert.ok(t.characters.endsWith('ms'), 'horizontal value labels keep the unit');
    }
  });

  test('bar: long category labels widen the left padding' + V, async () => {
    const short = await render(variant.key, {
      orientation: 'horizontal',
      xLabels: ['A', 'B'],
    });
    const long = await render(variant.key, {
      orientation: 'horizontal',
      xLabels: ['A very long category name', 'B'],
    });
    assert.ok(
      plotOf(long.container).left > plotOf(short.container).left,
      'padLeft follows the widest category label',
    );
  });

  // ── Events and legend ────────────────────────────────────────────────────
  test('bar: event bars render on both sides of the plot' + V, async () => {
    const { container } = await render(variant.key, { topEvent: true, bottomEvent: true });
    assertEventBars(container, 'Top Events', 'top');
    assertEventBars(container, 'Bottom Events', 'bottom');
  });

  test('bar: legend uses dots and follows the series count' + V, async () => {
    const { container } = await render(variant.key, {
      barMode: 'grouped',
      barsCount: 3,
      showLegend: true,
      legendLabels: ['A', 'B', 'C'],
    });
    const items = layerItems(container, 'Legend');
    assert.equal(items.filter((n) => n.type === 'ELLIPSE').length, 3);
    assertLegendBelowPlot(container);
  });

  // KNOWN BUG (standalone Chart Bar only): legend labels are padded to the
  // requested barsCount at Chart Bar/code.js:476-486, but normal mode forces
  // barsCount = 1 later, at :528. A normal-mode chart with 4 labels therefore
  // draws 4 legend entries for 1 series, all in the same color. The combined
  // generator computes the legend after finalising barsCount and is correct.
  const legendEntryOpts =
    variant.key === 'bar'
      ? { todo: 'BUG: legend padded before barMode "normal" forces barsCount = 1' }
      : {};

  test('bar: normal mode shows a single legend entry' + V, legendEntryOpts, async () => {
    const { container } = await render(variant.key, {
      barMode: 'normal',
      barsCount: 4,
      showLegend: true,
      legendLabels: ['A', 'B', 'C', 'D'],
    });
    const texts = layerItems(container, 'Legend').filter((n) => n.type === 'TEXT');
    assert.equal(texts.length, 1, 'normal mode has one series, so one legend entry');
    assert.equal(texts[0].characters, 'A');
  });

  test('bar: legend alignment shifts the row' + V, async () => {
    const xs = {};
    for (const align of LEGEND_ALIGNS) {
      const { container } = await render(variant.key, {
        barMode: 'grouped',
        barsCount: 2,
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
  test('bar: counts and axes fall back to documented defaults' + V, async () => {
    const { handle, container } = await render(variant.key, {
      barMode: 'grouped',
      barsCount: 0,
      yValues: [],
      xLabels: [],
    });
    const params = handle.chartParams(container);
    assert.equal(params.barsCount, 2, 'falsy count falls back to 2');
    assert.deepEqual(params.yValues, [0, 50, 100, 150, 200]);
    assert.deepEqual(params.xLabels, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  });

  test('bar: a flat Y scale keeps bars visible and finite' + V, async () => {
    const { container } = await render(variant.key, { yValues: [10, 10] });
    assertGeometryFinite(container, 'flat scale');
    for (const b of barsOf(container)) assert.ok(b.height >= 0.01);
  });

  test('bar: a single category fills the plot width' + V, async () => {
    const { container } = await render(variant.key, { xLabels: ['Only'] });
    const plot = plotOf(container);
    const bars = barsOf(container);
    assert.equal(bars.length, 1);
    assert.ok(
      Math.abs(absBox(bars[0]).w - (plot.width - 1)) < 1,
      'the single bar spans the slot minus the gap',
    );
  });

  test('bar: values above the axis maximum are clipped to the plot' + V, async () => {
    const { container } = await render(variant.key, {
      barMode: 'stacked',
      barsCount: 6,
      yValues: [0, 10],
    });
    const plot = plotOf(container);
    for (const b of barsOf(container)) {
      const box = absBox(b);
      assert.ok(box.y >= plot.top - 0.5, 'stacked column is clipped at the plot top');
    }
  });

  test('bar: every mode × orientation × density renders at every size' + V, async () => {
    const sizes = [
      { w: 1200, h: 800 },
      { w: 600, h: 400 },
      { w: 320, h: 180 },
      { w: 233, h: 95 },
    ];
    for (const size of sizes) {
      for (const mode of BAR_MODES) {
        for (const orientation of ORIENTATIONS) {
          for (const dense of [false, true]) {
            const h = loadPlugin(variant.key, { seed: 13 });
            h.selectFrame(size.w, size.h);
            await h.generate(payload('bar', { barMode: mode, orientation, dense }));
            const label =
              size.w + 'x' + size.h + ' ' + mode + '/' + orientation + ' dense=' + dense;
            assert.deepEqual(h.errorNotifications().map((n) => n.message), [], label);
            assert.ok(barsOf(h.chart()).length > 0, label + ': no bars drawn');
            assertGeometryFinite(h.chart(), label);
          }
        }
      }
    }
  });
}

'use strict';

/**
 * Chart Pie — structure, slice geometry, labels, center total, legend.
 *
 * Every test runs twice: against the standalone "Chart Pie" plugin and against
 * the pie generator inside "Monium all charts generator". Divergence between
 * the two implementations shows up as a failure in exactly one variant.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin } = require('./helpers/load-plugin');
const { payload, SIZES, REQUIRED_PARAMS, PIE_STYLES, LEGEND_ALIGNS } = require('./helpers/fixtures');
const {
  layer,
  layerItems,
  childNames,
  descendants,
  textsIn,
  fillColorsOf,
  absBox,
  assertGeometryFinite,
  assertChartContainer,
  assertNoStrayPageNodes,
  assertColorsFromPalette,
  assertColorsDistinct,
  assertChartParams,
  assertInside,
} = require('./helpers/inspect');

const VARIANTS = [
  { key: 'pie', label: 'standalone Chart Pie' },
  { key: 'all', label: 'combined generator (pie tab)' },
];

const TWO_PI = Math.PI * 2;
const TOP = -Math.PI / 2;

/** Renders a pie into a w×h frame and returns { handle, frame, container }. */
async function render(key, overrides, size) {
  const s = size || { w: 500, h: 500 };
  const h = loadPlugin(key, { seed: 42 });
  const frame = h.selectFrame(s.w, s.h);
  await h.generate(payload('pie', overrides));
  if (h.errorNotifications().length > 0) {
    throw new Error('render failed: ' + h.errorNotifications()[0].message);
  }
  return { handle: h, frame, container: h.chart() };
}

function slicesOf(container) {
  return layerItems(container, 'Slices');
}

/** Visible angular span of each slice, in radians. */
function spansOf(slices) {
  return slices.map((s) => s.arcData.endingAngle - s.arcData.startingAngle);
}

for (const variant of VARIANTS) {
  const V = ' [' + variant.label + ']';

  // ── Structure ────────────────────────────────────────────────────────────
  test('pie: default donut structure' + V, async () => {
    const { handle, frame, container } = await render(variant.key);

    assertChartContainer(container, 'Chart Pie', 500, 500);
    assert.equal(container.parent.id, frame.id, 'chart is inserted into the selected frame');
    assert.deepEqual(childNames(container), ['Slices'], 'only the Slices layer by default');
    assert.equal(slicesOf(container).length, 5, 'one ellipse per value');
    assertGeometryFinite(container, 'pie');
    assertNoStrayPageNodes(handle, [frame.id]);

    for (const s of slicesOf(container)) {
      assert.equal(s.type, 'ELLIPSE', 'slices are native ellipse arcs');
      assert.equal(s.width, s.height, 'slice ellipse is a circle');
      assert.ok(s.width > 0, 'slice has a positive diameter');
      assertInside(container, s, 0.5, 'slice');
    }
  });

  test('pie: chartParams carries everything paste needs' + V, async () => {
    const { container } = await render(variant.key, {
      showLabels: true,
      showTotal: true,
      showLegend: true,
      legendLabels: ['A', 'B', 'C', 'D', 'E'],
    });
    const params = assertChartParams(null, container, REQUIRED_PARAMS.pie);
    assert.deepEqual(params.values, [30, 25, 20, 15, 10]);
    assert.equal(params.colors.length, 5, 'one stored color per slice');
    assert.equal(params.showLabels, true);
    assert.equal(params.showTotal, true);
    assert.deepEqual(params.legendLabels, ['A', 'B', 'C', 'D', 'E']);
  });

  test('pie: colors are distinct and from the palette' + V, async () => {
    const { handle, container } = await render(variant.key, { segmentsCount: 8, values: [] });
    const colors = fillColorsOf(slicesOf(container));
    assert.equal(colors.length, 8);
    assertColorsFromPalette(handle, colors, 'slice fill');
    assertColorsDistinct(colors, 'slice colors');
  });

  // ── Slice geometry ───────────────────────────────────────────────────────
  test('pie: slices start at 12 o\'clock and cover the full circle' + V, async () => {
    const { container } = await render(variant.key, { segmentGap: 0 });
    const slices = slicesOf(container);

    assert.ok(
      Math.abs(slices[0].arcData.startingAngle - TOP) < 1e-9,
      'first slice starts at -PI/2 (top), got ' + slices[0].arcData.startingAngle,
    );
    const last = slices[slices.length - 1].arcData.endingAngle;
    assert.ok(
      Math.abs(last - (TOP + TWO_PI)) < 1e-9,
      'last slice ends a full turn later, got ' + last,
    );
    for (let i = 1; i < slices.length; i++) {
      assert.ok(
        Math.abs(slices[i].arcData.startingAngle - slices[i - 1].arcData.endingAngle) < 1e-9,
        'with gap 0 slice ' + i + ' starts where the previous one ended',
      );
    }
  });

  test('pie: slice spans are proportional to the values' + V, async () => {
    const values = [50, 30, 20];
    const { container } = await render(variant.key, { values, segmentGap: 0 });
    const spans = spansOf(slicesOf(container));
    const total = values.reduce((a, b) => a + b, 0);
    values.forEach((v, i) => {
      const expected = (v / total) * TWO_PI;
      assert.ok(
        Math.abs(spans[i] - expected) < 1e-9,
        'slice ' + i + ' span ' + spans[i] + ' ≠ expected ' + expected,
      );
    });
    assert.ok(spans[0] > spans[1] && spans[1] > spans[2], 'larger value → larger slice');
  });

  test('pie: segmentGap opens the documented gap between slices' + V, async () => {
    for (const gapDeg of [0, 1, 5, 10]) {
      const { container } = await render(variant.key, { segmentGap: gapDeg });
      const slices = slicesOf(container);
      const expected = (gapDeg * Math.PI) / 180;
      for (let i = 1; i < slices.length; i++) {
        const actual = slices[i].arcData.startingAngle - slices[i - 1].arcData.endingAngle;
        assert.ok(
          Math.abs(actual - expected) < 1e-9,
          'gap ' + gapDeg + '°: measured ' + actual + ' rad, expected ' + expected,
        );
      }
    }
  });

  test('pie: donut inner radius follows innerRadiusPct' + V, async () => {
    for (const pct of [30, 55, 80]) {
      const { container } = await render(variant.key, { pieStyle: 'donut', innerRadiusPct: pct });
      for (const s of slicesOf(container)) {
        assert.ok(
          Math.abs(s.arcData.innerRadius - pct / 100) < 1e-9,
          'innerRadiusPct ' + pct + ' → arcData.innerRadius ' + s.arcData.innerRadius,
        );
      }
    }
  });

  test('pie: solid pie style has no hole and ignores corner radius' + V, async () => {
    const { container } = await render(variant.key, {
      pieStyle: 'pie',
      innerRadiusPct: 55,
      cornerRadius: 20,
    });
    for (const s of slicesOf(container)) {
      assert.equal(s.arcData.innerRadius, 0, 'solid pie has innerRadius 0');
      assert.equal(s.cornerRadius, 0, 'corner radius only applies to donuts');
    }
  });

  test('pie: corner radius is applied to donut slices' + V, async () => {
    const { container } = await render(variant.key, { pieStyle: 'donut', cornerRadius: 12 });
    for (const s of slicesOf(container)) {
      assert.equal(s.cornerRadius, 12);
    }
  });

  test('pie: fill opacity reaches the slice fills' + V, async () => {
    for (const opacity of [0.05, 0.5, 1]) {
      const { container } = await render(variant.key, { fillOpacity: opacity });
      for (const s of slicesOf(container)) {
        assert.equal(s.fills[0].opacity, opacity);
        assert.equal(s.fills[0].type, 'SOLID');
      }
    }
  });

  test('pie: out-of-range fill opacity is clamped to 0.05…1' + V, async () => {
    const low = await render(variant.key, { fillOpacity: 0 });
    assert.equal(slicesOf(low.container)[0].fills[0].opacity, 0.05, 'clamped up to 0.05');
    const high = await render(variant.key, { fillOpacity: 5 });
    assert.equal(slicesOf(high.container)[0].fills[0].opacity, 1, 'clamped down to 1');
  });

  // ── Value labels ─────────────────────────────────────────────────────────
  test('pie: value labels draw a leader line and a value per slice' + V, async () => {
    const values = [40, 35, 25];
    const { container } = await render(variant.key, { values, showLabels: true });

    const labels = layer(container, 'Labels');
    assert.ok(labels, 'Labels layer exists when showLabels is on');
    const items = layerItems(container, 'Labels');
    assert.equal(items.length, values.length * 2, 'one leader line + one text per slice');

    const lines = items.filter((n) => n.type === 'VECTOR');
    const texts = items.filter((n) => n.type === 'TEXT');
    assert.equal(lines.length, values.length);
    assert.equal(texts.length, values.length);
    assert.deepEqual(
      texts.map((t) => t.characters).sort(),
      values.map(String).sort(),
      'label text is the slice value',
    );
    for (const l of lines) {
      assert.equal(l.strokeWeight, 0.5, 'leader line weight per style guide');
      assert.equal(l.fills.length, 0, 'leader line has no fill');
      assert.equal(l.strokes[0].opacity, 0.3);
    }
    for (const t of texts) {
      assert.equal(t.fontSize, 11, 'value labels are 11px per style guide');
      assert.equal(t.fills[0].opacity, 0.5);
    }
  });

  test('pie: decimal values keep their decimals in labels' + V, async () => {
    const { container } = await render(variant.key, {
      values: [1.25, 2.5, 96.25],
      showLabels: true,
    });
    const chars = layerItems(container, 'Labels')
      .filter((n) => n.type === 'TEXT')
      .map((t) => t.characters);
    assert.deepEqual(chars.sort(), ['1.25', '2.5', '96.25'].sort());
  });

  test('pie: labels stay inside the frame at readable sizes' + V, async () => {
    const readable = SIZES.filter((s) => s.w >= 233 && s.h >= 95);
    for (const size of readable) {
      const { container } = await render(variant.key, { showLabels: true }, size);
      for (const n of layerItems(container, 'Labels')) {
        assertInside(container, n, 1, size.name + ' label');
      }
    }
  });

  // ── Center total ─────────────────────────────────────────────────────────
  test('pie: center total shows the sum, centered in the hole' + V, async () => {
    const values = [10, 20, 30];
    const { container } = await render(variant.key, {
      values,
      pieStyle: 'donut',
      showTotal: true,
    });

    const items = layerItems(container, 'Center Label');
    assert.equal(items.length, 1, 'Center Label holds a single text node');
    const t = items[0];
    assert.equal(t.characters, '60', 'center total is the sum of the values');

    const slice = absBox(slicesOf(container)[0]);
    const pieCenter = { x: slice.x + slice.w / 2, y: slice.y + slice.h / 2 };
    const box = absBox(t);
    assert.ok(
      Math.abs(box.x + box.w / 2 - pieCenter.x) < 1,
      'total is horizontally centered on the pie',
    );
    assert.ok(
      Math.abs(box.y + box.h / 2 - pieCenter.y) < 1,
      'total is vertically centered on the pie',
    );
  });

  test('pie: center total is suppressed for solid pie style' + V, async () => {
    const { container } = await render(variant.key, { pieStyle: 'pie', showTotal: true });
    assert.equal(layer(container, 'Center Label'), null, 'no hole → no center total');
  });

  test('pie: center total shrinks to fit a small donut hole' + V, async () => {
    const big = await render(variant.key, { showTotal: true }, { w: 500, h: 500 });
    const bigText = layerItems(big.container, 'Center Label')[0];
    assert.equal(bigText.fontSize, 28, 'full size donut keeps the 28px style-guide size');

    const small = await render(variant.key, { showTotal: true }, { w: 233, h: 95 });
    const smallText = layerItems(small.container, 'Center Label')[0];
    assert.ok(
      smallText.fontSize < 28 && smallText.fontSize >= 6,
      'small donut scales the total down, got ' + smallText.fontSize,
    );

    const hole = slicesOf(small.container)[0].arcData.innerRadius * (slicesOf(small.container)[0].width / 2);
    assert.ok(
      smallText.width <= hole * 1.7 + 0.5,
      'total text (' + smallText.width + 'px) fits the hole (radius ' + hole + ')',
    );
    assertInside(small.container, smallText, 1, 'center total');
  });

  test('pie: total formats decimals without trailing noise' + V, async () => {
    const { container } = await render(variant.key, {
      values: [0.1, 0.2],
      pieStyle: 'donut',
      showTotal: true,
    });
    const t = layerItems(container, 'Center Label')[0];
    assert.equal(t.characters, '0.3', 'floating point sum is trimmed, not 0.30000000000000004');
  });

  // ── Legend ───────────────────────────────────────────────────────────────
  test('pie: legend renders a dot and a label per slice' + V, async () => {
    const { container } = await render(variant.key, {
      values: [1, 2, 3],
      showLegend: true,
      legendLabels: ['Alpha', 'Beta', 'Gamma'],
    });
    const items = layerItems(container, 'Legend');
    const dots = items.filter((n) => n.type === 'ELLIPSE');
    const texts = items.filter((n) => n.type === 'TEXT');
    assert.equal(dots.length, 3, 'one dot marker per series');
    assert.deepEqual(texts.map((t) => t.characters), ['Alpha', 'Beta', 'Gamma']);
    for (const d of dots) {
      assert.equal(d.width, 8, 'dot marker is 8px per style guide');
      assert.equal(d.height, 8);
    }
  });

  test('pie: legend labels are padded and truncated to the slice count' + V, async () => {
    const short = await render(variant.key, {
      values: [1, 2, 3],
      showLegend: true,
      legendLabels: ['Only'],
    });
    assert.deepEqual(
      layerItems(short.container, 'Legend')
        .filter((n) => n.type === 'TEXT')
        .map((t) => t.characters),
      ['Only', 'Series 2', 'Series 3'],
      'missing labels are padded with "Series N"',
    );

    const long = await render(variant.key, {
      values: [1, 2],
      showLegend: true,
      legendLabels: ['A', 'B', 'C', 'D'],
    });
    assert.equal(
      layerItems(long.container, 'Legend').filter((n) => n.type === 'TEXT').length,
      2,
      'extra labels beyond the slice count are dropped',
    );
  });

  test('pie: an over-long legend label is ellipsised, not overflowed' + V, async () => {
    const { container } = await render(
      variant.key,
      {
        values: [1],
        showLegend: true,
        legendLabels: ['An extremely long legend label that cannot possibly fit in this frame'],
      },
      { w: 300, h: 300 },
    );
    const text = layerItems(container, 'Legend').filter((n) => n.type === 'TEXT')[0];
    assert.ok(text.characters.endsWith('…'), 'truncated label ends with an ellipsis');
    assert.ok(
      text.characters.length < 70,
      'truncated label is shorter than the original',
    );
    assertInside(container, text, 1, 'legend label');
  });

  test('pie: legend alignment moves rows within the legend band' + V, async () => {
    const xs = {};
    for (const align of LEGEND_ALIGNS) {
      const { container } = await render(variant.key, {
        values: [1, 2],
        showLegend: true,
        legendLabels: ['A', 'B'],
        legendAlign: align,
      });
      const dots = layerItems(container, 'Legend').filter((n) => n.type === 'ELLIPSE');
      xs[align] = Math.min.apply(null, dots.map((d) => absBox(d).x));
    }
    assert.ok(xs.left < xs.center, 'center starts right of left, got ' + JSON.stringify(xs));
    assert.ok(xs.center < xs.right, 'right starts right of center, got ' + JSON.stringify(xs));
  });

  test('pie: legend paginates past three rows' + V, async () => {
    const many = [];
    for (let i = 1; i <= 24; i++) many.push('Series label ' + i);
    const { container } = await render(
      variant.key,
      {
        values: new Array(24).fill(10),
        segmentsCount: 24,
        showLegend: true,
        legendLabels: many,
      },
      { w: 300, h: 300 },
    );

    const items = layerItems(container, 'Legend');
    const rowYs = new Set(
      items.filter((n) => n.type === 'ELLIPSE').map((d) => Math.round(absBox(d).y)),
    );
    assert.ok(rowYs.size <= 3, 'at most three legend rows are drawn, got ' + rowYs.size);

    const triangles = items.filter((n) => n.type === 'VECTOR');
    assert.equal(triangles.length, 2, 'paginator draws an up and a down triangle');
    const pageText = items.filter((n) => n.type === 'TEXT').map((t) => t.characters);
    assert.ok(
      pageText.some((s) => /^\d+\/\d+$/.test(s)),
      'paginator shows a "page/total" counter, got ' + JSON.stringify(pageText),
    );
  });

  test('pie: legend never overlaps the pie' + V, async () => {
    const { container } = await render(variant.key, {
      values: [1, 2, 3, 4],
      showLegend: true,
      legendLabels: ['Alpha series', 'Beta series', 'Gamma series', 'Delta series'],
    });
    const slices = slicesOf(container);
    const pieBottom = Math.max.apply(null, slices.map((s) => absBox(s).y + absBox(s).h));
    const legendTop = Math.min.apply(
      null,
      layerItems(container, 'Legend').map((n) => absBox(n).y),
    );
    assert.ok(
      legendTop >= pieBottom - 0.5,
      'legend top ' + legendTop + ' must sit below pie bottom ' + pieBottom,
    );
  });

  test('pie: enabling the legend shrinks the pie' + V, async () => {
    const without = await render(variant.key, { showLegend: false });
    const with_ = await render(variant.key, {
      showLegend: true,
      legendLabels: ['A', 'B', 'C', 'D', 'E'],
    });
    assert.ok(
      slicesOf(with_.container)[0].width < slicesOf(without.container)[0].width,
      'the legend band takes space away from the pie',
    );
  });

  // ── Values resolution ────────────────────────────────────────────────────
  test('pie: empty values generate segmentsCount random slices' + V, async () => {
    for (const count of [1, 2, 5, 12, 20]) {
      const { container } = await render(variant.key, { values: [], segmentsCount: count });
      assert.equal(slicesOf(container).length, count, 'segmentsCount ' + count);
    }
  });

  test('pie: random values land in the documented 5…200 range' + V, async () => {
    const { container, handle } = await render(variant.key, { values: [], segmentsCount: 20 });
    const params = handle.chartParams(container);
    for (const v of params.values) {
      assert.ok(v >= 5 && v <= 200, 'generated value ' + v + ' outside 5…200');
      assert.equal(v, Math.round(v), 'generated values are whole numbers');
    }
  });

  test('pie: a single value fills the whole circle' + V, async () => {
    const { container } = await render(variant.key, { values: [42], segmentGap: 0 });
    const slices = slicesOf(container);
    assert.equal(slices.length, 1);
    assert.ok(
      Math.abs(spansOf(slices)[0] - TWO_PI) < 1e-9,
      'the only slice spans the full circle',
    );
  });

  test('pie: zero values are skipped, other slices still add up' + V, async () => {
    const { container } = await render(variant.key, { values: [50, 0, 50], segmentGap: 0 });
    const slices = slicesOf(container);
    assert.equal(slices.length, 2, 'zero-sized slice is not drawn');
    for (const s of spansOf(slices)) {
      assert.ok(Math.abs(s - Math.PI) < 1e-9, 'the two remaining halves are equal');
    }
  });

  test('pie: an all-zero series renders an empty chart instead of throwing' + V, async () => {
    const { handle, container } = await render(variant.key, {
      values: [0, 0, 0],
      showLabels: true,
      showTotal: true,
    });
    assert.equal(slicesOf(container).length, 0, 'nothing to draw');
    assert.equal(handle.errorNotifications().length, 0, 'and no error surfaced');
  });

  test('pie: a gap wider than a slice drops that slice, not the chart' + V, async () => {
    const { handle, container } = await render(variant.key, {
      values: [95, 1, 1, 1, 1, 1],
      segmentGap: 10,
    });
    assert.ok(slicesOf(container).length >= 1, 'the large slice survives');
    assert.ok(slicesOf(container).length < 6, 'slices thinner than the gap are dropped');
    assert.equal(handle.errorNotifications().length, 0);
    assertGeometryFinite(container, 'pie with oversized gap');
  });

  // ── Sizing ───────────────────────────────────────────────────────────────
  test('pie: without a selection it falls back to the 500×500 default' + V, async () => {
    const h = loadPlugin(variant.key, { seed: 42 });
    await h.generate(payload('pie'));
    const container = h.chart();
    // The combined plugin uses a 500×500 default for pie as well.
    assertChartContainer(container, 'Chart Pie', 500, 500);
    assert.equal(container.parent.type, 'PAGE', 'chart is dropped straight on the page');
    assert.equal(h.log.notifications.length, 1, 'user gets one confirmation');
  });

  test('pie: the pie is centered in the frame' + V, async () => {
    const { container } = await render(variant.key, {}, { w: 400, h: 300 });
    const s = absBox(slicesOf(container)[0]);
    const c = absBox(container);
    assert.ok(
      Math.abs(s.x + s.w / 2 - (c.x + c.w / 2)) < 0.5,
      'horizontally centered',
    );
    assert.ok(
      Math.abs(s.y + s.h / 2 - (c.y + c.h / 2)) < 0.5,
      'vertically centered when there is no legend',
    );
  });

  test('pie: the pie scales with the shorter frame side' + V, async () => {
    const wide = await render(variant.key, {}, { w: 800, h: 300 });
    const tall = await render(variant.key, {}, { w: 300, h: 800 });
    assert.equal(
      Math.round(slicesOf(wide.container)[0].width),
      Math.round(slicesOf(tall.container)[0].width),
      'a 800×300 and a 300×800 frame give the same diameter',
    );
  });

  // ── Regression: the reported 233×95 failure ──────────────────────────────
  test('pie: renders at 233×95 with labels and center total (regression)' + V, async () => {
    const { handle, container } = await render(
      variant.key,
      { showLabels: true, showTotal: true },
      { w: 233, h: 95 },
    );

    assert.equal(handle.errorNotifications().length, 0, 'no error notification');
    assert.equal(slicesOf(container).length, 5, 'all five slices are drawn');
    assert.ok(layer(container, 'Labels'), 'value labels are present');
    assert.ok(layer(container, 'Center Label'), 'center total is present');
    for (const s of slicesOf(container)) {
      assert.ok(s.width >= 0.01, 'slice diameter stays within Figma limits');
      assertInside(container, s, 0.5, 'slice');
    }
    assertGeometryFinite(container, '233x95 pie');
  });

  test('pie: renders at 233×95 with labels, total and legend (regression)' + V, async () => {
    const { handle, container } = await render(
      variant.key,
      {
        showLabels: true,
        showTotal: true,
        showLegend: true,
        legendLabels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
      },
      { w: 233, h: 95 },
    );
    assert.equal(handle.errorNotifications().length, 0);
    assert.equal(slicesOf(container).length, 5);
    assert.ok(layer(container, 'Legend'), 'legend is present');
    assertGeometryFinite(container, '233x95 pie with legend');
  });

  test('pie: every frame size × display option combination renders' + V, async () => {
    for (const size of SIZES) {
      for (const pieStyle of PIE_STYLES) {
        for (const showLabels of [false, true]) {
          for (const showTotal of [false, true]) {
            const label =
              size.name + ' ' + pieStyle + ' labels=' + showLabels + ' total=' + showTotal;
            const h = loadPlugin(variant.key, { seed: 3 });
            h.selectFrame(size.w, size.h);
            await h.generate(payload('pie', { pieStyle, showLabels, showTotal }));
            assert.deepEqual(
              h.errorNotifications().map((n) => n.message),
              [],
              label + ' surfaced an error',
            );
            const container = h.chart();
            assert.ok(slicesOf(container).length > 0, label + ': no slices drawn');
            assertGeometryFinite(container, label);
          }
        }
      }
    }
  });
}

'use strict';

/**
 * Unit tests for the pure helpers inside the plugins, plus a drift check.
 *
 * The five plugins carry their own copies of the same helper functions. Every
 * shared helper is therefore tested twice: once for correctness (expected
 * values) and once for consistency (all copies must agree on the same inputs).
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin, ALL_KEYS } = require('./helpers/load-plugin');
const { plain } = require('./helpers/inspect');
const {
  ADJACENT_FLOOR,
  ADJACENT_CVD_FLOOR,
  deltaE,
  deltaEWorstVision,
  tightestNeighbours,
  hex: hexOf,
} = require('./helpers/color');

/** One sandbox per plugin, reused across the tests in this file. */
const SANDBOX = {};
for (const key of ALL_KEYS) SANDBOX[key] = loadPlugin(key, { seed: 4242 });

const REF = SANDBOX.all.global;

function pluginsWith(fnName) {
  return ALL_KEYS.filter((key) => typeof SANDBOX[key].global[fnName] === 'function');
}

// ── formatYValue ────────────────────────────────────────────────────────────
test('formatYValue keeps integers clean and trims float noise', () => {
  const cases = [
    [0, '0'],
    [5, '5'],
    [-42, '-42'],
    [1000000, '1000000'],
    [1.5, '1.5'],
    [0.30000000000000004, '0.3'],
    [2.00000000001, '2'],
    [1 / 3, '0.3333'],
    [1.23456789, '1.2346'],
  ];
  for (const [input, expected] of cases) {
    assert.equal(REF.formatYValue(input), expected, 'formatYValue(' + input + ')');
  }
  assert.equal(REF.formatYValue(NaN), 'NaN', 'NaN is stringified, not crashed on');
  assert.equal(REF.formatYValue('abc'), 'abc', 'non-numbers pass through');
});

// ── parseAxisLabel ──────────────────────────────────────────────────────────
test('parseAxisLabel reads plain numbers, units, prefixes and clock times', () => {
  const cases = [
    ['0', 0, ''],
    ['42', 42, ''],
    ['-50', -50, ''],
    ['+7', 7, ''],
    ['1.5', 1.5, ''],
    ['1,5', 1.5, ''],
    ['150ms', 150, 'ms'],
    ['12%', 12, '%'],
    ['1000 req/s', 1000, ' req/s'],
    ['$500', 500, ''],
    ['€1.5', 1.5, ''],
    ['1:30', 1.5, ''],
    ['0:00', 0, ''],
    ['15:30', 15.5, ''],
    ['1:02:30', 1 + 2 / 60 + 30 / 3600, ''],
    ['-1:30', -1.5, ''],
    ['2:15 pm', 2.25, ' pm'],
  ];
  for (const [input, value, unit] of cases) {
    const parsed = REF.parseAxisLabel(input);
    assert.ok(
      Math.abs(parsed.value - value) < 1e-9,
      'parseAxisLabel("' + input + '").value = ' + parsed.value + ', expected ' + value,
    );
    assert.equal(parsed.unit, unit, 'parseAxisLabel("' + input + '").unit');
  }
});

test('parseAxisLabel reports NaN for text without a number', () => {
  for (const input of ['', '   ', 'Jan', 'abc', '—']) {
    assert.ok(
      Number.isNaN(REF.parseAxisLabel(input).value),
      'parseAxisLabel("' + input + '") must be NaN',
    );
  }
});

test('parseAxisLabel tolerates null and undefined', () => {
  assert.ok(Number.isNaN(REF.parseAxisLabel(undefined).value));
  assert.ok(Number.isNaN(REF.parseAxisLabel(null).value));
});

// ── parseYLabelTexts ────────────────────────────────────────────────────────
test('parseYLabelTexts detects a unit only when every label carries it', () => {
  const shared = REF.parseYLabelTexts(['0ms', '150ms', '300ms']);
  assert.equal(shared.yUnit, 'ms');
  assert.deepEqual(plain(shared.yValues), [0, 150, 300]);
  assert.equal(shared.yLabels, null, 'plain numbers need no custom labels');

  const mixed = REF.parseYLabelTexts(['0ms', '150', '300ms']);
  assert.equal(mixed.yUnit, '', 'a unit missing from one label is not a shared unit');
});

test('parseYLabelTexts keeps non-numeric labels as custom text', () => {
  const times = REF.parseYLabelTexts(['0:00', '1:30', '3:00']);
  assert.deepEqual(plain(times.yLabels), ['0:00', '1:30', '3:00'], 'clock labels are custom');
  assert.deepEqual(plain(times.yValues), [0, 1.5, 3]);
});

test('parseYLabelTexts skips category labels that carry no value', () => {
  const categories = REF.parseYLabelTexts(['Jan', 'Feb', 'Mar']);
  assert.deepEqual(plain(categories.yValues), [], 'nothing positions a category axis');
});

// ── resolveYLabels ──────────────────────────────────────────────────────────
test('resolveYLabels prefers custom labels and falls back to formatted values', () => {
  assert.deepEqual(plain(REF.resolveYLabels(['a', 'b'], [1, 2])), ['a', 'b'], 'custom labels win');
  assert.deepEqual(plain(REF.resolveYLabels(null, [1, 2.5])), ['1', '2.5'], 'no labels → formatted');
  assert.deepEqual(
    plain(REF.resolveYLabels(['a'], [1, 2])),
    ['1', '2'],
    'a mismatched label count is ignored',
  );
  assert.deepEqual(
    plain(REF.resolveYLabels(['', 'b'], [1, 2])),
    ['1', 'b'],
    'empty entries fall back per value',
  );
});

// ── Legend label normalisation ──────────────────────────────────────────────
test('normalizeLegendLabels pads, truncates and drops empties', () => {
  assert.deepEqual(plain(REF.normalizeLegendLabels(['A'], 3)), ['A', 'Series 2', 'Series 3']);
  assert.deepEqual(plain(REF.normalizeLegendLabels(['A', 'B', 'C'], 2)), ['A', 'B']);
  assert.deepEqual(plain(REF.normalizeLegendLabels([], 2)), ['Series 1', 'Series 2']);
  assert.deepEqual(plain(REF.normalizeLegendLabels(['A', '', 'C'], 3)), ['A', 'C', 'Series 3']);
  assert.deepEqual(plain(REF.normalizeLegendLabels(undefined, 1)), ['Series 1']);
});

// ── packLegendRows ──────────────────────────────────────────────────────────
test('packLegendRows fills a row before wrapping', () => {
  // Item width = marker + 6px gap + label width; rows also pay 12px between items.
  const marker = 8;
  const pack = (widths, available) => plain(REF.packLegendRows(widths, available, marker));

  assert.deepEqual(pack([20, 20], 1000), [[0, 1]], 'both items fit on one row');
  assert.deepEqual(pack([100, 100], 120), [[0], [1]], 'a second item that does not fit wraps');
  assert.deepEqual(
    pack([10, 10, 10, 10], 80),
    [[0, 1], [2, 3]],
    'items wrap as soon as the row is full',
  );
  assert.deepEqual(pack([5000], 100), [[0]], 'an oversized single item still gets its own row');
  assert.deepEqual(pack([], 100), [], 'no labels → no rows');
});

test('packLegendRows respects the marker width', () => {
  const widths = [40, 40, 40];
  const narrow = REF.packLegendRows(widths, 160, 8);
  const wide = REF.packLegendRows(widths, 160, 14);
  assert.ok(
    wide.length >= narrow.length,
    'a wider marker cannot fit more items per row (' + narrow.length + ' → ' + wide.length + ')',
  );
});

// ── measureLegendItems ──────────────────────────────────────────────────────
test('measureLegendItems truncates with an ellipsis and reports real widths', async () => {
  const h = SANDBOX.all;
  await h.figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  const short = h.global.measureLegendItems(['Hi'], 1000);
  assert.deepEqual(plain(short.texts), ['Hi'], 'a label that fits is untouched');
  assert.ok(short.widths[0] > 0, 'and gets a measured width');

  const long = h.global.measureLegendItems(['A very long legend label indeed'], 40);
  assert.ok(long.texts[0].endsWith('…'), 'an over-long label is ellipsised');
  assert.ok(long.texts[0].length < 'A very long legend label indeed'.length);
  assert.ok(long.widths[0] <= 40, 'the truncated label fits the budget');

  const blank = h.global.measureLegendItems([''], 100);
  assert.deepEqual(plain(blank.texts), [' '], 'an empty label becomes a space, never undefined');
});

test('measureLegendItems leaves no measurement nodes behind', async () => {
  const h = loadPlugin('all', { seed: 1 });
  await h.figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  const before = h.page._children.length;
  h.global.measureLegendItems(['One', 'Two', 'A much longer label'], 30);
  assert.equal(h.page._children.length, before, 'temporary text nodes are removed');
});

// ── selectDistinctColors ────────────────────────────────────────────────────
test('selectDistinctColors returns the requested number of distinct palette colors', () => {
  const palette = REF.PALETTE;
  for (const count of [1, 2, 5, 20, 40]) {
    const colors = REF.selectDistinctColors(count);
    assert.equal(colors.length, count, 'count ' + count);
    const keys = colors.map((c) => c.r + ',' + c.g + ',' + c.b);
    assert.equal(new Set(keys).size, count, 'count ' + count + ' has duplicates');
    for (const c of colors) {
      assert.ok(palette.indexOf(c) !== -1, 'color comes from the palette');
    }
  }
});

test('selectDistinctColors with more series than colors shuffles the whole palette', () => {
  const colors = REF.selectDistinctColors(REF.PALETTE.length + 5);
  assert.equal(colors.length, REF.PALETTE.length, 'it can only return the palette it has');
  const keys = colors.map((c) => c.r + ',' + c.g + ',' + c.b);
  assert.equal(new Set(keys).size, REF.PALETTE.length, 'no color repeats');
});

test('selectDistinctColors picks visually separated colors', () => {
  const colors = REF.selectDistinctColors(4);
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const dr = colors[i].r - colors[j].r;
      const dg = colors[i].g - colors[j].g;
      const db = colors[i].b - colors[j].b;
      assert.ok(
        dr * dr + dg * dg + db * db > 0.05,
        'colors ' + i + ' and ' + j + ' are too close (d² = ' + (dr * dr + dg * dg + db * db) + ')',
      );
    }
  }
});

test('neighbouring series are perceptually far apart, at every series count', () => {
  // The palette holds near-twins by design (#FF6B6B and #FD7272 are 1.3 apart),
  // so the guarantee has to come from the picker: whatever it hands back, the
  // colors a reader compares side by side must clear the floor. Checked over
  // many seeds because the first pick is random.
  for (const count of [3, 5, 8, 12, 20]) {
    let worst = { deltaE: Infinity, seed: -1, at: -1 };
    for (let seed = 1; seed <= 40; seed++) {
      SANDBOX.all.reseed(seed);
      const colors = plain(REF.selectDistinctColors(count));
      const tightest = tightestNeighbours(colors, 'normal');
      if (tightest.deltaE < worst.deltaE) {
        worst = { ...tightest, seed, colors };
      }
    }
    assert.ok(
      worst.deltaE >= ADJACENT_FLOOR,
      count +
        ' series: neighbours ' +
        worst.at +
        ' and ' +
        (worst.at + 1) +
        ' are only ΔE ' +
        worst.deltaE.toFixed(1) +
        ' apart (floor ' +
        ADJACENT_FLOOR +
        ', seed ' +
        worst.seed +
        '): ' +
        worst.colors.map(hexOf).join(' '),
    );
  }
});

test('neighbouring series stay apart under protanopia and deuteranopia', () => {
  // A pair that is vivid for most readers can collapse to one color for a
  // colour-blind one, which is why the picker measures distance under both
  // simulations as well as under normal vision.
  for (const count of [3, 5, 8, 12, 20]) {
    let worst = { deltaE: Infinity, seed: -1, at: -1 };
    for (let seed = 1; seed <= 40; seed++) {
      SANDBOX.all.reseed(seed);
      const colors = plain(REF.selectDistinctColors(count));
      for (const model of ['protanopia', 'deuteranopia']) {
        const tightest = tightestNeighbours(colors, model);
        if (tightest.deltaE < worst.deltaE) {
          worst = { ...tightest, seed, model, colors };
        }
      }
    }
    assert.ok(
      worst.deltaE >= ADJACENT_CVD_FLOOR,
      count +
        ' series under ' +
        worst.model +
        ': neighbours ' +
        worst.at +
        ' and ' +
        (worst.at + 1) +
        ' collapse to ΔE ' +
        worst.deltaE.toFixed(1) +
        ' (floor ' +
        ADJACENT_CVD_FLOOR +
        ', seed ' +
        worst.seed +
        '): ' +
        worst.colors.map(hexOf).join(' '),
    );
  }
});

test('paletteDistance measures perceptually, not in raw RGB', () => {
  // The regression this locks down: raw RGB rates #FF6B6B and #FD7272 as far
  // enough apart to hand to adjacent series, though they are a perceptual twin.
  // Checked against the independent implementation in helpers/color.js on every
  // pair, so swapping the metric back cannot pass quietly.
  assert.equal(
    typeof REF.paletteDistance,
    'function',
    'the plugins expose a perceptual distance for series colors',
  );

  let worstError = { diff: 0 };
  for (let i = 0; i < REF.PALETTE.length; i++) {
    for (let j = i + 1; j < REF.PALETTE.length; j++) {
      const measured = REF.paletteDistance(i, j);
      const expected = deltaEWorstVision(REF.PALETTE[i], REF.PALETTE[j]);
      const diff = Math.abs(measured - expected);
      if (diff > worstError.diff) worstError = { diff, i, j, measured, expected };
    }
  }
  assert.ok(
    worstError.diff < 1e-9,
    'paletteDistance disagrees with OKLab ΔE on ' +
      hexOf(REF.PALETTE[worstError.i] || {}) +
      '/' +
      hexOf(REF.PALETTE[worstError.j] || {}) +
      ': got ' +
      worstError.measured +
      ', expected ' +
      worstError.expected,
  );

  const indexOfHex = (want) => REF.PALETTE.findIndex((c) => hexOf(c) === want);
  const twinA = indexOfHex('#FF6B6B');
  const twinB = indexOfHex('#FD7272');
  assert.ok(twinA !== -1 && twinB !== -1, 'the near-twin pair is still in the palette');
  assert.ok(
    REF.paletteDistance(twinA, twinB) < 2,
    'the twins are rated as near-identical: ΔE ' +
      REF.paletteDistance(twinA, twinB).toFixed(1),
  );
});

// ── Palette ─────────────────────────────────────────────────────────────────
test('all five plugins ship the identical palette', () => {
  const signature = (p) => p.map((c) => [c.r, c.g, c.b].join(',')).join('|');
  const reference = signature(REF.PALETTE);
  for (const key of ALL_KEYS) {
    assert.equal(
      signature(SANDBOX[key].global.PALETTE),
      reference,
      key + ' palette drifted from the combined generator',
    );
  }
  assert.equal(REF.PALETTE.length, 68, 'palette size');
});

test('the palette contains no near-black colors', () => {
  // Commit 333e32a removed seven dark colors that read as black on charts.
  const removed = ['#3D3D3D', '#222F3E', '#2C3E50', '#34495E', '#353B48', '#192A56', '#273C75'];
  const hex = (c) =>
    '#' +
    [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  const present = REF.PALETTE.map(hex);
  for (const color of removed) {
    assert.ok(present.indexOf(color) === -1, color + ' is back in the palette');
  }
  for (const c of REF.PALETTE) {
    assert.ok(
      Math.max(c.r, c.g, c.b) >= 0.45,
      hex(c) + ' is darker than every color currently shipped',
    );
  }
});

// ── buildEventSegments ──────────────────────────────────────────────────────
test('buildEventSegments produces ordered, non-overlapping fractions', () => {
  for (const position of ['top', 'bottom']) {
    const segments = REF.buildEventSegments(position);
    assert.ok(segments.length > 0, position + ' produced no segments');
    let cursor = 0;
    for (const s of segments) {
      assert.ok(s.x >= cursor - 1e-9, 'segments are ordered and do not overlap');
      assert.ok(s.w > 0, 'segment has a positive width');
      assert.ok(s.x + s.w <= 1 + 1e-9, 'segment stays inside the plot');
      assert.ok(s.opacity >= 0.4 && s.opacity <= 1, 'opacity within 0.4…1');
      assert.ok(s.color && typeof s.color.r === 'number', 'segment carries a color');
      cursor = s.x + s.w;
    }
  }
});

test('buildEventSegments uses the position-specific palette', () => {
  const key = (c) => [c.r, c.g, c.b].join(',');
  const top = new Set(REF.TOP_EVENT_COLORS.map(key));
  const bottom = new Set(REF.BOTTOM_EVENT_COLORS.map(key));
  for (const s of REF.buildEventSegments('top')) {
    assert.ok(top.has(key(s.color)), 'top segment color comes from TOP_EVENT_COLORS');
  }
  for (const s of REF.buildEventSegments('bottom')) {
    assert.ok(bottom.has(key(s.color)), 'bottom segment color comes from BOTTOM_EVENT_COLORS');
  }
});

// ── buildCurvePath ──────────────────────────────────────────────────────────
test('buildCurvePath keeps smooth curves inside the plot', () => {
  const plot = { x: 0, y: 0, w: 300, h: 100 };
  const spiky = [
    { x: 0, y: 100 },
    { x: 60, y: 0 },
    { x: 120, y: 100 },
    { x: 180, y: 0 },
    { x: 240, y: 100 },
    { x: 300, y: 0 },
  ];
  const path = REF.buildCurvePath(spiky, 'smooth', plot);
  assert.ok(path.includes(' C '), 'smooth path uses cubics');
  const nums = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  for (let i = 1; i < nums.length; i += 2) {
    assert.ok(nums[i] >= -0.001 && nums[i] <= 100.001, 'y ' + nums[i] + ' escaped the plot');
  }
});

test('buildCurvePath draws straight segments for sharp and two-point series', () => {
  const plot = { x: 0, y: 0, w: 100, h: 100 };
  const points = [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 100, y: 0 },
  ];
  assert.ok(!REF.buildCurvePath(points, 'sharp', plot).includes(' C '), 'sharp → lines');
  assert.equal(
    REF.buildCurvePath(points.slice(0, 2), 'smooth', plot),
    'M 0 0 L 50 50',
    'two points cannot be smoothed, so they are joined with a line',
  );
});

test('buildCurvePathBidirectional reverses exactly', () => {
  const plot = { x: 0, y: 0, w: 100, h: 100 };
  const points = [
    { x: 0, y: 10 },
    { x: 50, y: 20 },
    { x: 100, y: 30 },
  ];
  const curves = REF.buildCurvePathBidirectional(points, 'sharp', plot);
  assert.equal(curves.forward, 'M 0 10 L 50 20 L 100 30');
  assert.equal(
    curves.reverse,
    ' L 100 30 L 50 20 L 0 10',
    'the reverse path retraces the same points backwards',
  );
});

// ── detectCurveStyle ────────────────────────────────────────────────────────
test('detectCurveStyle tells the three styles apart', () => {
  const vector = (data) => ({ vectorPaths: [{ data }] });
  assert.equal(REF.detectCurveStyle(vector('M 0 0 C 1 1 2 2 3 3'), 6), 'smooth');
  assert.equal(REF.detectCurveStyle(vector('M 0 0 L 1 1 L 2 2'), 6), 'sharp');

  let dense = 'M 0 0';
  for (let i = 1; i <= 50; i++) dense += ' L ' + i + ' ' + i;
  assert.equal(REF.detectCurveStyle(vector(dense), 6), 'peak', 'many segments per label → peak');
  assert.equal(REF.detectCurveStyle({}, 6), 'smooth', 'unreadable vectors default to smooth');
});

// ── Style-guide constants ───────────────────────────────────────────────────
test('layout constants match the style guide', () => {
  const expected = {
    PAD_TOP: 10,
    PAD_RIGHT: 2,
    PAD_BOTTOM: 21,
    PAD_GAP: 8,
    AXIS_OPACITY: 0.5,
    EVENT_BAR_HEIGHT: 6,
    LEGEND_DOT_SIZE: 8,
    LEGEND_LINE_W: 14,
    LEGEND_LINE_H: 2,
    LEGEND_LINE_TEXT_GAP: 6,
    LEGEND_ITEM_GAP: 12,
    LEGEND_ROW_H: 14,
    LEGEND_ROW_GAP: 2,
    LEGEND_MAX_ROWS_PER_PAGE: 3,
    LEGEND_SIDE_MARGIN: 16,
    MIN_PIE_SIZE: 8,
  };
  for (const [name, value] of Object.entries(expected)) {
    assert.equal(REF[name], value, name);
  }
  assert.equal(REF.DEFAULT_W, 600, 'axis charts default to 600×400');
  assert.equal(REF.DEFAULT_H, 400);
});

test('every plugin agrees on the shared layout constants', () => {
  const shared = [
    'PAD_TOP', 'PAD_RIGHT', 'PAD_BOTTOM', 'PAD_GAP', 'AXIS_OPACITY',
    'LEGEND_DOT_SIZE', 'LEGEND_LINE_TEXT_GAP', 'LEGEND_ITEM_GAP',
    'LEGEND_ROW_H', 'LEGEND_ROW_GAP', 'LEGEND_MAX_ROWS_PER_PAGE',
  ];
  for (const key of ALL_KEYS) {
    for (const name of shared) {
      const value = SANDBOX[key].global[name];
      if (value === undefined) continue; // not every plugin uses every constant
      assert.equal(value, REF[name], key + ' disagrees on ' + name);
    }
  }
  assert.equal(SANDBOX.pie.global.DEFAULT_W, 500, 'the pie plugin defaults to a 500×500 square');
  assert.equal(SANDBOX.pie.global.DEFAULT_H, 500);
});

// ── Cross-plugin drift ──────────────────────────────────────────────────────
const DRIFT_CASES = {
  formatYValue: [[0], [1.5], [0.30000000000000004], [1 / 3], [-42]],
  parseAxisLabel: [['0'], ['150ms'], ['1:30'], ['$500'], ['Jan'], ['1,5']],
  parseYLabelTexts: [[['0ms', '150ms']], [['0:00', '1:30']], [['Jan', 'Feb']]],
  resolveYLabels: [[null, [1, 2.5]], [['a', 'b'], [1, 2]], [['a'], [1, 2]]],
  selectDistinctColors: [[1], [3], [12]],
  paletteDistance: [[0, 1], [4, 10], [0, 67]],
  orderForAdjacency: [[[0, 1, 2, 3]], [[4, 10, 20, 30, 40]], [[1, 2]]],
  buildEventSegments: [['top'], ['bottom']],
};

// buildCurvePath is intentionally absent from the drift matrix: only the
// combined generator factors it out as a function — the standalone Line plugin
// builds the same path inline inside drawLines. The two are compared through
// the rendered paths in line.test.js instead.

for (const [fnName, argSets] of Object.entries(DRIFT_CASES)) {
  test('all copies of ' + fnName + ' behave identically', () => {
    const keys = pluginsWith(fnName);
    assert.ok(keys.length >= 2, fnName + ' exists in ' + keys.length + ' plugin(s): ' + keys);
    for (const args of argSets) {
      // Re-seed every sandbox so random-driven helpers are comparable.
      const results = keys.map((key) => {
        SANDBOX[key].reseed(4242);
        return JSON.stringify(SANDBOX[key].global[fnName].apply(null, args));
      });
      const reference = results[0];
      results.forEach((result, i) => {
        assert.equal(
          result,
          reference,
          fnName + '(' + JSON.stringify(args) + ') differs in ' + keys[i] + ' vs ' + keys[0],
        );
      });
    }
  });
}

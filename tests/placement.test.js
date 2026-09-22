'use strict';

/**
 * Where a generated chart ends up: page vs selected frame, replacing an
 * existing chart, reusing the chart frame itself, chart detection, target
 * memory, and the notifications the user sees.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadPlugin, CHART_NAMES } = require('./helpers/load-plugin');
const { payload } = require('./helpers/fixtures');
const { descendants, childNames } = require('./helpers/inspect');

const TYPES = [
  { type: 'line', keys: ['line', 'all'], size: { w: 600, h: 400 } },
  { type: 'area', keys: ['area', 'all'], size: { w: 600, h: 400 } },
  { type: 'bar', keys: ['bar', 'all'], size: { w: 600, h: 400 } },
  { type: 'pie', keys: ['pie', 'all'], size: { w: 500, h: 500 } },
];

for (const entry of TYPES) {
  for (const key of entry.keys) {
    const where = key === 'all' ? 'combined generator' : 'standalone';
    const V = ' [' + entry.type + ', ' + where + ']';
    const chartName = CHART_NAMES[entry.type];

    test('no selection: the chart lands on the page at its default size' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      await h.generate(payload(entry.type));
      const container = h.chart();
      assert.equal(container.parent.type, 'PAGE');
      assert.equal(container.name, chartName);
      assert.equal(container.width, entry.size.w, 'default width');
      assert.equal(container.height, entry.size.h, 'default height');
      assert.equal(h.log.notifications.length, 1);
      assert.match(h.log.notifications[0].message, /created/i);
      assert.equal(h.log.viewportCalls.length, 1, 'viewport jumps to the new chart');
    });

    test('empty frame selected: the chart fills it at 0,0' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const frame = h.selectFrame(420, 260);
      await h.generate(payload(entry.type));
      const container = h.chart();
      assert.equal(container.parent.id, frame.id);
      assert.equal(container.x, 0);
      assert.equal(container.y, 0);
      assert.equal(container.width, 420);
      assert.equal(container.height, 260);
      assert.match(h.log.notifications[0].message, /added to "Target"/);
    });

    test('regenerate replaces the chart in place' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const frame = h.selectFrame(420, 260);
      await h.generate(payload(entry.type));
      const firstId = h.chart().id;
      h.chart().x = 17;
      h.chart().y = 23;

      h.select(frame);
      await h.generate(payload(entry.type, { replace: true }));

      assert.equal(h.charts().length, 1, 'the old chart is gone');
      const container = h.chart();
      assert.notEqual(container.id, firstId, 'a new container was built');
      assert.equal(container.x, 17, 'the replacement keeps the old position');
      assert.equal(container.y, 23);
      assert.match(h.log.notifications.pop().message, /regenerated/i);
    });

    test('the chart frame itself selected: children are replaced, frame reused' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const frame = h.selectFrame(420, 260);
      await h.generate(payload(entry.type));
      const container = h.chart();

      h.select(container);
      await h.generate(payload(entry.type, { replace: true }));

      assert.equal(h.charts().length, 1);
      assert.equal(h.chart().id, container.id, 'the same frame is reused');
      assert.equal(h.chart().parent.id, frame.id, 'and stays where it was');
      assert.ok(childNames(h.chart()).length > 0, 'it has fresh content');
      assert.match(h.log.notifications.pop().message, /regenerated/i);
    });

    test('a COMPONENT can be used as the target frame' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const component = h.createNode('COMPONENT', 'Card');
      component.resize(400, 300);
      h.select(component);
      await h.generate(payload(entry.type));
      assert.equal(h.chart().parent.id, component.id);
      assert.equal(h.chart().width, 400);
    });

    test('an INSTANCE can be used as the target frame' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const instance = h.createNode('INSTANCE', 'Card instance');
      instance.resize(300, 200);
      h.select(instance);
      await h.generate(payload(entry.type));
      assert.equal(h.chart().parent.id, instance.id);
    });

    test('a non-container selection is ignored' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const rect = h.createNode('RECTANGLE', 'Just a rectangle');
      rect.resize(300, 300);
      h.select(rect);
      assert.equal(h.lastSelectionMessage(), null, 'no selection message for a rectangle');
      await h.generate(payload(entry.type));
      assert.equal(h.chart().parent.type, 'PAGE', 'the chart goes to the page instead');
    });

    test('the last selected frame is remembered after deselecting' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const frame = h.selectFrame(360, 240);
      h.clearSelection();
      await h.generate(payload(entry.type));
      assert.equal(h.chart().parent.id, frame.id, 'the remembered frame is still the target');
      assert.equal(h.chart().width, 360);
    });

    test('a multi-node selection is not treated as a target' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const a = h.createNode('FRAME', 'A');
      a.resize(300, 300);
      const b = h.createNode('FRAME', 'B');
      b.resize(300, 300);
      h.figma.currentPage.selection = [a, b];
      h.fireSelectionChange();
      await h.generate(payload(entry.type));
      assert.equal(h.chart().parent.type, 'PAGE');
    });

    test('the selection message reports frame name, size and chart state' + V, async () => {
      const h = loadPlugin(key, { seed: 5 });
      const frame = h.selectFrame(333, 222, { name: 'My frame' });

      const before = h.lastSelectionMessage();
      assert.deepEqual(
        { type: before.type, hasFrame: before.hasFrame, name: before.name, w: before.width, h: before.height, hasChart: before.hasChart },
        { type: 'selection', hasFrame: true, name: 'My frame', w: 333, h: 222, hasChart: false },
      );

      await h.generate(payload(entry.type));
      const after = h.lastSelectionMessage();
      assert.equal(after.hasChart, true, 'after rendering the frame reports a chart');
      assert.ok(after.chartData, 'and hands the chart data to the UI');
      void frame;
    });
  }
}

// ── Chart detection ─────────────────────────────────────────────────────────
test('combined generator: switching chart type replaces the old chart', async () => {
  const h = loadPlugin('all', { seed: 5 });
  const frame = h.selectFrame(600, 400);
  await h.generate(payload('pie'));
  assert.equal(h.chart().name, 'Chart Pie');

  h.select(frame);
  await h.generate(payload('line'));
  assert.equal(h.charts().length, 1, 'only one chart remains');
  assert.equal(h.chart().name, 'Chart Line', 'and it is the new type');
});

test('combined generator: a chart nested inside a group is still found', async () => {
  const h = loadPlugin('all', { seed: 5 });
  const frame = h.selectFrame(600, 400);
  await h.generate(payload('bar'));
  const container = h.chart();

  // Wrap the chart in a group, as a designer might.
  const wrapper = h.figma.group([container], frame);
  wrapper.name = 'Wrapper';

  h.select(frame);
  await h.generate(payload('bar', { replace: true }));
  assert.equal(h.charts().length, 1, 'the nested chart was replaced, not duplicated');
});

test('standalone plugins only look one level deep for an existing chart', async () => {
  // Documented divergence: the standalone plugins scan direct children only,
  // so a chart wrapped in a group is not found and a second one is inserted.
  // The combined generator walks the tree (see the test above).
  const h = loadPlugin('bar', { seed: 5 });
  const frame = h.selectFrame(600, 400);
  await h.generate(payload('bar'));
  const wrapper = h.figma.group([h.chart()], frame);
  wrapper.name = 'Wrapper';

  h.select(frame);
  await h.generate(payload('bar', { replace: true }));
  assert.equal(h.charts().length, 2, 'current behaviour: a nested chart is not replaced');
});

test('combined generator: every chart type is detected by container name', async () => {
  const h = loadPlugin('all', { seed: 5 });
  for (const [type, name] of Object.entries(CHART_NAMES)) {
    const frame = h.selectFrame(600, 400, { name: 'Frame for ' + type });
    await h.generate(payload(type));
    const message = h.lastSelectionMessage();
    assert.equal(h.chart().name, name);
    assert.equal(message.hasChart, true, type + ' is detected');
    assert.equal(message.chartData.chartType, type, type + ' reports its own type');
    h.chart().remove();
    frame.remove();
  }
});

test('the chart container never leaves stray nodes behind', async () => {
  for (const key of ['line', 'area', 'bar', 'pie', 'all']) {
    const h = loadPlugin(key, { seed: 5 });
    const frame = h.selectFrame(600, 400);
    await h.generate(payload(key === 'all' ? 'line' : key));
    assert.deepEqual(
      h.page._children.map((n) => n.id),
      [frame.id],
      key + ': the page holds only the target frame',
    );
    const container = h.chart();
    for (const node of descendants(container)) {
      assert.ok(!node.removed, key + ': a removed node is still in the tree');
    }
  }
});

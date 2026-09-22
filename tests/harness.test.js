'use strict';

/**
 * Tests for the test harness itself.
 *
 * If these fail, every other suite is suspect: they check that the figma mock
 * reproduces the API contracts the plugins depend on, and that each plugin
 * boots inside the sandbox.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { createFigmaMock, measureText, absBox } = require('./helpers/figma-mock');
const { loadPlugin, ALL_KEYS, PLUGIN_DIRS } = require('./helpers/load-plugin');
const { payload } = require('./helpers/fixtures');

test('mock: resize rejects sizes the real API rejects', () => {
  const { figma } = createFigmaMock();
  const rect = figma.createRectangle();

  assert.throws(() => rect.resize(-25, -25), /resize/, 'negative size must throw');
  assert.throws(() => rect.resize(0, 10), /resize/, 'zero width must throw');
  assert.throws(() => rect.resize(10, 0), /resize/, 'zero height must throw');
  assert.throws(() => rect.resize(NaN, 10), /finite/, 'NaN must throw');
  assert.throws(() => rect.resize(Infinity, 10), /finite/, 'Infinity must throw');
  assert.doesNotThrow(() => rect.resize(0.01, 0.01), 'exactly 0.01 is allowed');
});

test('mock: LINE resizes with height 0 only', () => {
  const { figma } = createFigmaMock();
  const line = figma.createLine();
  assert.doesNotThrow(() => line.resize(100, 0));
  assert.throws(() => line.resize(100, 5), /height/);
  assert.throws(() => line.resize(-1, 0), /width/);
});

test('mock: arcData validates angles and innerRadius range', () => {
  const { figma } = createFigmaMock();
  const e = figma.createEllipse();
  e.resize(50, 50);

  assert.doesNotThrow(() => {
    e.arcData = { startingAngle: 0, endingAngle: 1, innerRadius: 0.55 };
  });
  assert.throws(() => {
    e.arcData = { startingAngle: NaN, endingAngle: 1, innerRadius: 0 };
  }, /angles/);
  assert.throws(() => {
    e.arcData = { startingAngle: 0, endingAngle: 1, innerRadius: 1.4 };
  }, /innerRadius/);
  assert.throws(() => {
    e.arcData = { startingAngle: 0, endingAngle: 1, innerRadius: -0.1 };
  }, /innerRadius/);
});

test('mock: vectorPaths reject NaN coordinates and derive a bounding box', () => {
  const { figma } = createFigmaMock();
  const v = figma.createVector();

  assert.throws(() => {
    v.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 0 L NaN 10' }];
  }, /Invalid coordinate/);

  v.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 10 20 L 110 70' }];
  assert.equal(v.x, 10);
  assert.equal(v.y, 20);
  assert.equal(v.width, 100);
  assert.equal(v.height, 50);
});

test('mock: text writes require a loaded font', () => {
  const { figma } = createFigmaMock();
  const t = figma.createText();
  assert.throws(() => {
    t.characters = 'hello';
  }, /unloaded font/);
});

test('mock: text width grows with content and font size', async () => {
  const { figma } = createFigmaMock();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: 'Regular' };
  t.fontSize = 11;
  t.characters = '100';
  const narrow = t.width;
  t.characters = '1000000';
  assert.ok(t.width > narrow, 'longer string must be wider');
  t.fontSize = 22;
  assert.ok(t.width > measureText('1000000', 11), 'larger font must be wider');
  assert.ok(t.height > 11, 'height tracks font size');
});

test('mock: group reparents children into group-relative coordinates', async () => {
  const { figma } = createFigmaMock();
  const frame = figma.createFrame();
  frame.resize(200, 200);
  const a = figma.createRectangle();
  a.resize(10, 10);
  a.x = 50;
  a.y = 60;
  frame.appendChild(a);
  const b = figma.createRectangle();
  b.resize(10, 10);
  b.x = 100;
  b.y = 80;
  frame.appendChild(b);

  const g = figma.group([a, b], frame);
  assert.equal(g.type, 'GROUP');
  assert.equal(g.x, 50, 'group x is the bbox left edge, in parent coords');
  assert.equal(g.y, 60);
  assert.equal(g.width, 60);
  assert.equal(g.height, 30);
  assert.equal(a.x, 0, 'child becomes group-relative');
  assert.equal(b.x, 50);
  assert.deepEqual(absBox(b), { x: 100, y: 80, w: 10, h: 10 }, 'absolute box is preserved');
  assert.equal(frame._children.length, 1, 'only the group remains under the frame');
});

test('mock: group of zero nodes throws like the real API', () => {
  const { figma } = createFigmaMock();
  const frame = figma.createFrame();
  assert.throws(() => figma.group([], frame), /zero nodes/);
});

test('mock: created nodes land on the page so leaks are observable', () => {
  const { figma, page } = createFigmaMock();
  const r = figma.createRectangle();
  assert.equal(page._children.length, 1);
  assert.equal(r.parent, page);
  r.remove();
  assert.equal(page._children.length, 0);
  assert.equal(figma.getNodeById(r.id), null, 'removed nodes are unreachable by id');
});

for (const key of ALL_KEYS) {
  test('plugin boots: ' + PLUGIN_DIRS[key], () => {
    const h = loadPlugin(key);
    assert.equal(h.log.showUI.length, 1, 'showUI called exactly once');
    assert.equal(h.log.showUI[0].options.width, 300, 'UI width 300');
    assert.equal(typeof h.figma.ui.onmessage, 'function', 'onmessage handler registered');
    assert.ok(Array.isArray(h.global.PALETTE), 'PALETTE is reachable in the sandbox');
    assert.equal(h.log.uiMessages.length, 0, 'no selection message without a selection');
  });
}

test('harness: seeded PRNG makes renders reproducible', async () => {
  const first = loadPlugin('line', { seed: 7 });
  await first.generate(payload('line'));
  const a = first.chartParams(first.chart());

  const second = loadPlugin('line', { seed: 7 });
  await second.generate(payload('line'));
  const b = second.chartParams(second.chart());

  assert.deepEqual(b.allSeries, a.allSeries, 'same seed → same series');
  assert.deepEqual(b.colors, a.colors, 'same seed → same colors');

  const third = loadPlugin('line', { seed: 8 });
  await third.generate(payload('line'));
  const c = third.chartParams(third.chart());
  assert.notDeepEqual(c.allSeries, a.allSeries, 'different seed → different series');
});

test('harness: resize message is forwarded to the UI', async () => {
  const h = loadPlugin('pie');
  await h.send({ type: 'resize', height: 640 });
  assert.deepEqual(h.log.uiResizes, [{ w: 300, h: 640 }]);
  await h.send({ type: 'resize', height: 5000 });
  assert.equal(h.log.uiResizes[1].h, 900, 'height is capped at 900');
});

test('harness: notify message is forwarded to Figma', async () => {
  const h = loadPlugin('pie');
  await h.send({ type: 'notify', message: 'hello' });
  assert.equal(h.log.notifications[0].message, 'hello');
});

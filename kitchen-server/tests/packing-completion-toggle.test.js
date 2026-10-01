const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const html = readFileSync(resolve(__dirname, '../public/index.html'), 'utf8');
const start = html.indexOf('function packLineDefaultFact(');
const end = html.indexOf('function EmployeeToggles(', start);
const handlerStart = html.indexOf('  const onLineEmp=(lineIdx,empId)=>{', html.indexOf('function ItemCard('));
const handlerEnd = html.indexOf('  // Old single-toggle', handlerStart);
assert.ok(start >= 0 && end > start && handlerStart >= 0 && handlerEnd > handlerStart);

function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...(tree.children || []).flatMap(nodes)];
}
function text(tree) {
  if (typeof tree === 'string' || typeof tree === 'number') return String(tree);
  return (tree.children || []).map(text).join('');
}

function packing({ qty = 33, warehouse = 2, fact, done = false, yesterdayFact } = {}) {
  const itemKey = 'packing-3875';
  const key = `${itemKey}-pl-0`;
  const state = [null, null, {}];
  let hook = 0;
  const context = {
    itemKey,
    packLines: [{ qty, fromWarehouse: warehouse, volume: '3 g', packName: 'РУКАВ 160мм' }],
    prevLineData: yesterdayFact == null ? undefined : { 0: { status: 'partial', yesterdayFact } },
    shift: {
      doneFlags: { [key]: done, [itemKey]: done },
      doneBy: { [key]: done ? [1] : [] },
      doneTimes: {}, skipReasons: {}, skipTimes: {},
      facts: fact === undefined ? {} : { [key]: String(fact) },
    },
    useState: () => {
      const i = hook++;
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }];
    },
    useRef: value => ({ current: value }),
    useEffect: () => {},
    e: (type, props, ...children) => ({
      type, props: props || {}, children: children.flat(Infinity).filter(x => x != null && x !== false),
    }),
    SKIP_LABELS: { no_material: 'Нет сырья', no_time: 'Не успели' },
    onShiftChange: update => {
      context.shift = typeof update === 'function' ? update(context.shift) : update;
    },
  };
  vm.createContext(context);
  vm.runInContext(html.slice(start, end), context);
  vm.runInContext(`${html.slice(handlerStart, handlerEnd)};this.onLineEmp=onLineEmp;`, context);
  const render = () => {
    hook = 0;
    return context.PackTable({
      packLines: context.packLines, prevLineData: context.prevLineData, itemKey,
      facts: context.shift.facts, doneFlags: context.shift.doneFlags, doneBy: context.shift.doneBy,
      shopEmployees: [{ id: 1, name: 'Работник' }], onLineEmp: context.onLineEmp,
      onFactChange: (k, value) => { context.shift.facts[k] = value; },
      skipReasons: context.shift.skipReasons, skipTimes: context.shift.skipTimes,
      onLineSkip: (k, reason) => { context.shift.skipReasons[k] = reason; },
      onLineClearSkip: k => { delete context.shift.skipReasons[k]; },
    });
  };
  const clickEmployee = () => {
    const button = nodes(render()).find(n => n.type === 'button' && text(n).includes('Работник'));
    assert.ok(button);
    button.props.onClick();
  };
  return { context, key, itemKey, state, render, clickEmployee };
}

test('done → undone → done does not request shortage reason for the full production plan with warehouse stock', () => {
  const p = packing();
  const input = nodes(p.render()).find(n => n.type === 'input');
  assert.equal(input.props.value, 33);
  p.clickEmployee();
  assert.equal(p.context.shift.doneFlags[p.key], true);
  assert.equal(p.context.shift.facts[p.key], '33');
  p.clickEmployee();
  assert.equal(p.context.shift.doneFlags[p.key], false);
  assert.deepEqual(Array.from(p.context.shift.doneBy[p.key]), []);
  p.clickEmployee();
  assert.equal(p.state[0], null);
  assert.equal(p.state[1], null);
  assert.equal(p.context.shift.doneFlags[p.key], true);
  assert.equal(p.context.shift.doneFlags[p.itemKey], true);
  assert.equal(p.context.shift.facts[p.key], '33');
  assert.ok(p.context.shift.doneTimes[p.key]);
  assert.equal(p.context.shift.skipReasons[p.key], undefined);
});

test('a full saved fact can be marked again after a page reload', () => {
  const p = packing({ fact: 33 });
  p.clickEmployee();
  assert.equal(p.state[0], null);
  assert.equal(p.context.shift.doneFlags[p.key], true);
});

test('a genuinely short fact still requires a reason before completion', () => {
  const p = packing({ fact: 32 });
  p.clickEmployee();
  assert.equal(p.state[0], 0);
  assert.equal(p.context.shift.doneFlags[p.key], false);
  const reason = nodes(p.render()).find(n => n.type === 'button' && text(n) === 'Нет сырья');
  reason.props.onClick();
  assert.equal(p.context.shift.skipReasons[p.key], 'no_material');
  assert.equal(p.context.shift.doneFlags[p.key], true);
  assert.equal(p.context.shift.facts[p.key], '32');
  assert.equal(p.state[0], null);
});

test('unmarking a completed shortage does not require a new reason', () => {
  const p = packing({ fact: 20, done: true });
  p.clickEmployee();
  assert.equal(p.context.shift.doneFlags[p.key], false);
  assert.equal(p.state[0], null);
});

test('a carried row compares and autofills only the remaining production quantity', () => {
  const p = packing({ yesterdayFact: 10 });
  assert.equal(nodes(p.render()).find(n => n.type === 'input').props.value, 23);
  p.clickEmployee();
  assert.equal(p.context.shift.facts[p.key], '23');
  p.clickEmployee();
  p.clickEmployee();
  assert.equal(p.state[0], null);
  assert.equal(p.context.shift.doneFlags[p.key], true);
  const short = packing({ yesterdayFact: 10, fact: 22 });
  short.clickEmployee();
  assert.equal(short.state[0], 0);
  assert.equal(short.context.shift.doneFlags[short.key], false);
});

test('validation uses the currently displayed draft rather than an older saved fact', () => {
  const fullDraft = packing({ fact: 30 });
  nodes(fullDraft.render()).find(n => n.type === 'input').props.onChange({ target: { value: '33' } });
  fullDraft.clickEmployee();
  assert.equal(fullDraft.state[0], null);
  const shortDraft = packing({ fact: 33 });
  nodes(shortDraft.render()).find(n => n.type === 'input').props.onChange({ target: { value: '30' } });
  shortDraft.clickEmployee();
  assert.equal(shortDraft.state[0], 0);
});

test('zero, above-plan facts and no-warehouse rows keep the correct shortage behavior', () => {
  for (const { fact, warehouse, shortage } of [
    { fact: 0, warehouse: 2, shortage: true },
    { fact: 33, warehouse: 0, shortage: false },
    { fact: 34, warehouse: 2, shortage: false },
  ]) {
    const p = packing({ fact, warehouse });
    p.clickEmployee();
    assert.equal(p.state[0], shortage ? 0 : null);
    assert.equal(p.context.shift.doneFlags[p.key], !shortage);
  }
});
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const html = readFileSync(resolve(__dirname, '../public/index.html'), 'utf8');
const start = html.indexOf('async function loadTrackerInitialData(');
const end = html.indexOf('function App()', start);
assert.ok(start >= 0 && end > start);
const source = html.slice(start, end);

function loader(overrides) {
  const context = {
    emptyShiftData: date => ({ date, doneFlags: {}, facts: {} }),
    ...overrides,
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.loadTrackerInitialData;
}

test('all six initial reads start without waiting for one another; both active techcards also load in parallel', async () => {
  const started = [];
  const pending = new Map();
  const defer = key => {
    started.push(key);
    return new Promise(resolve => pending.set(key, resolve));
  };
  const load = loader({
    fetch: path => defer(path),
    loadEmployeesGlobal: () => defer('employees'),
    loadShiftIndex: () => defer('index'),
    loadTechCards: () => defer('techcards'),
    loadShift: date => { assert.equal(date, '2026-10-02'); return defer('shift'); },
    loadTechCard: id => defer(`tc-${id}`),
  });
  const result = load('2026-10-02');
  assert.deepEqual(new Set(started), new Set([
    'employees', 'index', 'techcards', '/api/config/stations', '/api/precut', 'shift',
  ]));
  const employees = [{ id: 1 }];
  const shift = { date: '2026-10-02', techcardId: 10, udTechcardId: 20 };
  pending.get('employees')(employees);
  pending.get('index')(['2026-10-02']);
  pending.get('techcards')([{ id: 10 }, { id: 20 }]);
  pending.get('/api/config/stations')({ ok: true, json: async () => ({ config: { station: '09:00' } }) });
  pending.get('/api/precut')({ ok: true, json: async () => ({ ids: [58] }) });
  pending.get('shift')(shift);
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(pending.has('tc-10'));
  assert.ok(pending.has('tc-20'));
  pending.get('tc-10')({ id: 10 });
  pending.get('tc-20')({ id: 20 });
  const data = await result;
  assert.equal(data.shift, shift);
  assert.equal(data.employees, employees);
  assert.equal(data.tcEE.id, 10);
  assert.equal(data.tcUD.id, 20);
  assert.deepEqual(data.config, { station: '09:00' });
  assert.deepEqual(data.ids, [58]);
});

test('no shift or active techcards still produces an empty shift and does not fetch card details', async () => {
  const load = loader({
    fetch: async () => ({ ok: true, json: async () => ({}) }),
    loadEmployeesGlobal: async () => [],
    loadShiftIndex: async () => [],
    loadTechCards: async () => [],
    loadShift: async () => null,
    loadTechCard: () => { throw new Error('No card should be requested'); },
  });
  const data = await load('2026-10-02');
  assert.equal(data.shift.date, '2026-10-02');
  assert.equal(data.tcEE, null);
  assert.equal(data.tcUD, null);
  assert.equal(Object.keys(data.config).length, 0);
  assert.equal(data.ids.length, 0);
});

test('optional config failures retain the previous defaults without dropping the current shift', async () => {
  const shift = { date: '2026-10-02', facts: { 'station-58': '35' } };
  const load = loader({
    fetch: async path => {
      if (path.endsWith('/stations')) throw new Error('Network failure');
      return { ok: false };
    },
    loadEmployeesGlobal: async () => [],
    loadShiftIndex: async () => [],
    loadTechCards: async () => [],
    loadShift: async () => shift,
    loadTechCard: () => { throw new Error('No card should be requested'); },
  });
  const data = await load('2026-10-02');
  assert.equal(data.shift, shift);
  assert.equal(Object.keys(data.config).length, 0);
  assert.equal(data.ids.length, 0);
});

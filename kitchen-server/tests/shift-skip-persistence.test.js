const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../routes/shifts.js'), 'utf8');
const start = source.indexOf('const RE_FACT_KEY =');
const end = source.indexOf('// Определяем плановую дату', start);
assert.ok(start >= 0 && end > start);

function setup() {
  const statuses = new Map();
  const facts = new Map();
  const query = async (sql, params) => {
    if (sql.includes('INSERT INTO shift_item_status') && sql.includes('skip_reason')) {
      const [date, station, item, done, doneAt, reason, skipAt] = params;
      statuses.set(`${station}-${item}`, { date, done, doneAt, reason, skipAt });
    } else if (sql.includes('INSERT INTO shift_facts_n')) {
      const [, station, item, line, value] = params;
      facts.set(`${station}-${item}-pl-${line}`, value);
    }
    return { rows: [] };
  };
  const context = { pool: { withTransaction: callback => callback({ query }) } };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return { save: context.saveShift, statuses, facts };
}

for (const reason of ['no_material', 'no_time']) {
  for (const done of [false, true]) {
    test(`saving ${reason} preserves the reason, time and partial fact with done=${done}`, async () => {
      const { save, statuses, facts } = setup();
      const key = 'rybnyj_tseh_fasovka-8929-pl-0';
      const at = '2026-10-14T12:00:00.000Z';
      const shift = {
        doneFlags: { [key]: done },
        skipReasons: { [key]: reason },
        skipTimes: { [key]: at },
        facts: { [key]: 20 },
      };
      const before = JSON.stringify(shift);
      await save('2026-10-14', shift);
      assert.equal(statuses.get(key).reason, reason);
      assert.equal(statuses.get(key).skipAt, at);
      assert.equal(statuses.get(key).done, done ? 1 : 0);
      assert.equal(facts.get(key), 20);
      assert.equal(JSON.stringify(shift), before);
      // The same snapshot may be saved repeatedly by the kitchen or DH tab.
      await save('2026-10-14', shift);
      assert.equal(statuses.get(key).reason, reason);
    });
  }
}

test('explicitly clearing a reason still clears both the reason and its time', async () => {
  const { save, statuses } = setup();
  const key = 'meat-11436-pl-0';
  const shift = {
    doneFlags: { [key]: true },
    skipReasons: { [key]: 'no_time' },
    skipTimes: { [key]: '2026-10-14T12:00:00.000Z' },
  };
  await save('2026-10-14', shift);
  assert.equal(statuses.get(key).reason, 'no_time');
  shift.skipReasons = {};
  await save('2026-10-14', shift);
  assert.equal(statuses.get(key).reason, null);
  assert.equal(statuses.get(key).skipAt, null);
  assert.equal(statuses.get(key).done, 1);
});

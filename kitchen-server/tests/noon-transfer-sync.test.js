const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
const start = source.indexOf('function scheduleNoonTransferSync()');
const end = source.indexOf('\n// Ночная синхронизация', start);
assert.ok(start >= 0 && end > start);
const scheduler = source.slice(start, end);

function loadScheduler(flag) {
  const timers = [];
  const calls = { database: 0, google: 0 };
  const env = { GOOGLE_CREDENTIALS_JSON: 'test-only' };
  if (flag !== undefined) env.DH_NOON_TRANSFER_SYNC_ENABLED = flag;
  const context = {
    process: { env },
    console: { log() {}, error() {} },
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
    pool: { query: async () => {
      calls.database++;
      return { rows: [] };
    } },
    appendToKitchenTransfer: async () => {
      calls.google++;
      return { appended: 0, updated: 0 };
    },
  };
  vm.createContext(context);
  vm.runInContext(scheduler, context);
  return { schedule: context.scheduleNoonTransferSync, timers, calls };
}

for (const flag of [undefined, 'false', '', '1', 'TRUE']) {
  test(`noon transfer is paused with flag ${JSON.stringify(flag)}: no timer, database read or Google write`, () => {
    const { schedule, timers, calls } = loadScheduler(flag);
    schedule();
    assert.equal(timers.length, 0);
    assert.deepEqual(calls, { database: 0, google: 0 });
  });
}

test('explicit opt-in retains the scheduler, and pausing stops it from scheduling another day', async () => {
  const env = { DH_NOON_TRANSFER_SYNC_ENABLED: 'true', GOOGLE_CREDENTIALS_JSON: 'test-only' };
  const timers = [];
  let databaseCalls = 0;
  const context = {
    process: { env },
    console: { log() {}, error() {} },
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
    pool: { query: async () => {
      databaseCalls++;
      return { rows: [] };
    } },
    appendToKitchenTransfer: async () => { throw new Error('No data must mean no Google write'); },
  };
  vm.createContext(context);
  vm.runInContext(scheduler, context);
  context.scheduleNoonTransferSync();
  assert.equal(timers.length, 1);
  assert.ok(timers[0].delay > 0 && timers[0].delay <= 24 * 60 * 60 * 1000);
  env.DH_NOON_TRANSFER_SYNC_ENABLED = 'false';
  await timers[0].callback();
  assert.equal(databaseCalls, 1);
  assert.equal(timers.length, 1);
});

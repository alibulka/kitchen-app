const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const routes = fs.readFileSync(path.join(__dirname, '../routes/shifts.js'), 'utf8');
const server = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
const postSource = routes.slice(routes.indexOf("router.post('/:date'"), routes.indexOf('\nmodule.exports'));
const timerSource = server.slice(server.indexOf('function scheduleNightlySync()'), server.indexOf('\ninitDb()'));

test('every shift save persists immediately and broadcasts, without any Google Sheets synchronization', async () => {
  let handler;
  const saves = [];
  const broadcasts = [];
  let sheetCalls = 0;
  const context = {
    router: { post: (_path, callback) => { handler = callback; } },
    saveShift: async (date, shift) => saves.push({ date, shift }),
    syncFactsToSheet: () => { sheetCalls++; },
    writeFacts: () => { sheetCalls++; },
    console,
  };
  vm.runInNewContext(postSource, context);
  const date = '2026-10-06';
  for (const value of [5, 7, 0]) {
    const shift = { date, techcardId: 10, doneFlags: { 'meat-13018': true }, facts: { 'meat-13018-pl-0': value } };
    let response;
    await handler({
      params: { date }, body: { shift, clientId: 'tablet-1' },
      app: { get: () => ({ clients: [
        { readyState: 1, send: payload => broadcasts.push(JSON.parse(payload)) },
        { readyState: 0, send: () => { throw new Error('Disconnected client must be skipped'); } },
      ] }) },
    }, { json: body => { response = body; }, status: () => { throw new Error('Save must succeed'); } });
    assert.equal(response.ok, true);
    assert.equal(saves.at(-1).shift, shift);
    assert.equal(saves.at(-1).date, date);
    assert.equal(broadcasts.at(-1).shift.facts['meat-13018-pl-0'], value);
    assert.equal(broadcasts.at(-1).clientId, 'tablet-1');
  }
  assert.equal(saves.length, 3);
  assert.equal(broadcasts.length, 3);
  assert.equal(sheetCalls, 0);
});

function nightly({ hasShift = true, fail = false } = {}) {
  let clock = new Date('2026-10-06T12:00:00Z').getTime();
  let facts = [];
  const timers = [];
  const reads = [];
  const syncs = [];
  const errors = [];
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const context = {
    Date: ClockDate,
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
    pool: { query: async (sql, params) => {
      reads.push({ sql, date: params[0] });
      if (sql.includes('FROM shifts')) return { rows: hasShift ? [{ date: params[0] }] : [] };
      assert.match(sql, /FROM shift_facts_n WHERE shift_date=\$1/);
      return { rows: facts };
    } },
    require: name => {
      assert.equal(name, './routes/shifts');
      return { syncFactsToSheet: async (date, values) => {
        syncs.push({ date, facts: JSON.parse(JSON.stringify(values)) });
        if (fail) throw new Error('Sheets unavailable');
      } };
    },
    console: { log: () => {}, error: (...args) => errors.push(args) },
  };
  vm.createContext(context);
  vm.runInContext(timerSource, context);
  context.scheduleNightlySync();
  return {
    timers, reads, syncs, errors,
    setFacts: rows => { facts = rows; },
    run: async () => {
      const timer = timers.shift();
      const expected = new Date(clock);
      expected.setHours(23, 50, 0, 0);
      if (expected.getTime() <= clock) expected.setDate(expected.getDate() + 1);
      assert.equal(timer.delay, expected.getTime() - clock, 'Keep the existing server-local 23:50 schedule');
      clock += timer.delay;
      await timer.callback();
      return new Date(clock).toISOString().slice(0, 10);
    },
  };
}

test('the 23:50 job reads the latest persisted facts only when it fires, retaining zero, null and line keys', async () => {
  const job = nightly();
  assert.equal(job.reads.length, 0);
  assert.equal(job.syncs.length, 0);
  job.setFacts([
    { station_key: 'meat', item_id: '13018', line_idx: 0, value: 45 },
    { station_key: 'fish', item_id: '13002', line_idx: 1, value: 0 },
    { station_key: 'fish', item_id: '12956', line_idx: 0, value: null },
  ]);
  const date = await job.run();
  assert.deepEqual(job.syncs, [{ date, facts: {
    'meat-13018-pl-0': 45, 'fish-13002-pl-1': 0, 'fish-12956-pl-0': null,
  } }]);
  assert.equal(job.reads.length, 2);
  assert.ok(job.reads.every(read => read.date === date));
  assert.equal(job.timers.length, 1);
  assert.equal(job.timers[0].delay, 86400000);
  assert.equal(job.errors.length, 0);
});

test('a day without a shift does not export any facts and schedules the next night', async () => {
  const job = nightly({ hasShift: false });
  await job.run();
  assert.equal(job.syncs.length, 0);
  assert.equal(job.reads.length, 1);
  assert.equal(job.timers.length, 1);
});

test('a nightly export failure is logged and does not prevent scheduling the next night', async () => {
  const job = nightly({ fail: true });
  await job.run();
  assert.equal(job.syncs.length, 1);
  assert.equal(job.errors.length, 1);
  assert.equal(job.timers.length, 1);
});

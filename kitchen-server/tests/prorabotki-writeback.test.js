const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildData, targetFor, syncActSafely } = require('../lib/prorabotki-writeback');

test('only result columns, correct boundaries and numeric masses', () => {
  const fields = { workDate: '2026-09-11', grossMass: 100, defrostMass: 0, conclusion: 'Да', comment: 'Тест', supplier: 'ignored' };
  const first = buildData('750743492:225', 'Мясо', fields);
  const second = buildData('255104827:822', 'Другое', fields);
  assert.deepEqual(first.map(x => x.range), ["'Мясо'!N225", "'Мясо'!O225", "'Мясо'!P225", "'Мясо'!T225", "'Мясо'!X225"]);
  assert.deepEqual(second.map(x => x.range), ["'Другое'!K822", "'Другое'!M822", "'Другое'!N822", "'Другое'!P822", "'Другое'!T822"]);
  assert.equal(first[1].values[0][0], 100);
  assert.equal(first[2].values[0][0], 0);
  assert.deepEqual(buildData('255104827:822', 'Другое', { conclusion: '', grossMass: null }), []);
  for (const id of ['750743492:224', '255104827:821', '123:822', '822']) assert.throws(() => targetFor(id));
});

test('development write disabled before any database or Google calls', async () => {
  const old = process.env.PRORABOTKI_WRITE_ENABLED;
  delete process.env.PRORABOTKI_WRITE_ENABLED;
  try {
    assert.deepEqual(await syncActSafely({ query() { throw new Error('Must not query'); } }, 1), { status: 'disabled' });
  } finally {
    if (old === undefined) delete process.env.PRORABOTKI_WRITE_ENABLED;
    else process.env.PRORABOTKI_WRITE_ENABLED = old;
  }
});
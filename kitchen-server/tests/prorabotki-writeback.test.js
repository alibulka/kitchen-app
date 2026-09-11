const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildData, buildRequests, targetFor, syncActSafely } = require('../lib/prorabotki-writeback');

test('only result columns, correct boundaries and numeric masses', () => {
  const fields = { material: 'Сырьё', name: 'Название', manufacturer: 'Производитель',
    supplier: 'Поставщик', workDate: '2026-09-11', grossMass: 100, defrostMass: 80,
    conclusion: 'Да', comment: 'Комментарий 1\nКомментарий 2', unrelated: 'ignored' };
  const first = buildData('750743492:225', 'Мясо', fields);
  const second = buildData('255104827:822', 'Другое', fields);
  assert.deepEqual(first.map(x => x.range), ['B','D','G','H','N','O','P','R','V','X'].map(c=>`'Мясо'!${c}225`));
  assert.deepEqual(second.map(x => x.range), ['C','D','E','K','M','N','O','Q','T'].map(c=>`'Другое'!${c}822`));
  assert.equal(first[5].values[0][0], 100);
  assert.equal(first[6].values[0][0], 80);
  assert.equal(first[7].values[0][0], 0.2);
  assert.equal(first[9].values[0][0], 'Комментарий 1\nКомментарий 2');
  for (const [id, data, percentIndex] of [['750743492:225', first, 7], ['255104827:822', second, 6]]) {
    const requests = buildRequests(id, data);
    assert.equal(requests.length, data.length);
    const pct = requests[percentIndex].updateCells;
    assert.deepEqual(pct.rows[0].values[0], {
      userEnteredValue: { numberValue: 0.2 },
      userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.00%' } },
    });
    assert.equal(pct.range.endRowIndex - pct.range.startRowIndex, 1);
    assert.equal(pct.range.endColumnIndex - pct.range.startColumnIndex, 1);
    assert.equal(requests[0].updateCells.fields, 'userEnteredValue');
  }
  assert.deepEqual(buildData('255104827:822', 'Другое', { conclusion: '', grossMass: null }), []);
  for (const id of ['750743492:224', '255104827:821', '123:822', '822']) assert.throws(() => targetFor(id));
});

test('percentage handles zero net, missing masses and zero gross', () => {
  const data = masses => buildData('750743492:225', 'Мясо', masses);
  const pct = masses => data(masses).find(c => c.range.endsWith('!R225'))?.values[0][0];
  assert.equal(pct({ grossMass: 100, defrostMass: 0 }), 1);
  assert.equal(pct({ grossMass: 100, defrostMass: 100 }), 0);
  assert.equal(pct({ grossMass: 0, defrostMass: 0 }), undefined);
  assert.equal(pct({ grossMass: 100, defrostMass: null }), undefined);
  assert.throws(() => data({ grossMass: 'bad', defrostMass: 80 }));
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

test('renamed acts sync all comments; mismatched source rows block writes', async () => {
  const { JWT } = require('google-auth-library');
  const originalRequest = JWT.prototype.request;
  const oldFlag = process.env.PRORABOTKI_WRITE_ENABLED;
  process.env.PRORABOTKI_WRITE_ENABLED = 'true';
  const act = { id: 42, source_row: '750743492:225', source_product_name: 'Старое название',
    product_name: 'Новое название', raw_material: 'Сырьё', manufacturer: 'Завод',
    supplier: 'Поставщик', gross_mass: 100, defrost_mass: 80, date: '2026-09-11', conclusion: 'Подходит' };
  let sourceName = 'Старое название';
  const writes = [];
  const dbUpdates = [];
  const pool = { async query(sql, params) {
    if (sql.startsWith('UPDATE acts')) { dbUpdates.push(params); return { rows: [] }; }
    if (sql.includes('JOIN act_fields')) return { rows: [{ label: 'Вкус', value: 'Хороший' }, { label: 'Вид', value: 'Нормальный' }] };
    return { rows: [act] };
  } };
  JWT.prototype.request = async function(request) {
    if (request.method === 'POST') { writes.push(request.data); return { data: {} }; }
    if (request.url.includes('/values/')) {
      const row = []; row[3] = sourceName;
      return { data: { values: [row] } };
    }
    return { data: { sheets: [{ properties: { sheetId: 750743492, title: 'Мясо' } }] } };
  };
  try {
    assert.deepEqual(await syncActSafely(pool, 42), { status: 'synced', cells: 10 });
    assert.equal(writes[0].requests[1].updateCells.rows[0].values[0].userEnteredValue.stringValue, 'Новое название');
    assert.equal(writes[0].requests[9].updateCells.rows[0].values[0].userEnteredValue.stringValue, 'Вкус: Хороший\nВид: Нормальный');
    assert.deepEqual(dbUpdates, [['Новое название', 42]]);
    sourceName = 'Другое задание';
    assert.equal((await syncActSafely(pool, 42)).status, 'error');
    assert.equal(writes.length, 1);
  } finally {
    JWT.prototype.request = originalRequest;
    if (oldFlag === undefined) delete process.env.PRORABOTKI_WRITE_ENABLED;
    else process.env.PRORABOTKI_WRITE_ENABLED = oldFlag;
  }
});
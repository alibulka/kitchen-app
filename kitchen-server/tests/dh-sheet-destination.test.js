const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const target = '1CbQzuYzJ7vfzNfm3tb1UgyvIZO8Rh7bI9dXlMgv0FSQ';
const legacy = '1abYpnMeyHrhzvh0bmFCMEp3bGHO1Y11tFkBhsKFz1pw';

function loadUtils(destination, fetch) {
  const context = {
    module: { exports: {} }, require: () => ({}),
    process: { env: destination ? { DH_SPREADSHEET_ID: destination } : {} },
    Buffer, URL, AbortController, setTimeout, clearTimeout, fetch,
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib/sheets-utils.js'), 'utf8'), context);
  return context.module.exports;
}

test('production overrides all DH destinations while development keeps its previous spreadsheet', () => {
  const prod = loadUtils(target);
  const dev = loadUtils();
  assert.equal(prod.SPREADSHEET_ID, target);
  assert.equal(dev.SPREADSHEET_ID, legacy);
  for (const title of ['Остатки кухни ', 'Передача с кухни на СКЛАД']) {
    assert.equal(prod.sheetRowKey(title), `${target}:${title}`);
    assert.equal(dev.sheetRowKey(title), title);
  }
  const control = fs.readFileSync(path.join(__dirname, '../lib/dh-control-sheet.js'), 'utf8');
  assert.match(control, /const \{ SPREADSHEET_ID \} = require\('\.\/sheets-utils'\)/);
});

test('read and write calls use the configured file and preserve exact tab titles', async () => {
  const calls = [];
  const utils = loadUtils(target, async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ values: [['header'], ['header'], ['123']] }) };
  });
  const row = await utils.findFirstEmptyRowInColA('test-token', 'Остатки кухни ');
  assert.equal(row, 4);
  await utils.writeCellsToSheet('test-token', 'Передача с кухни на СКЛАД',
    [{ rowNum: row, cells: [{ col: 'G', value: 12 }] }]);
  assert.ok(calls.every(call => call.url.includes(`/spreadsheets/${target}/`)));
  assert.ok(decodeURIComponent(calls[0].url).includes("'Остатки кухни '!A:A"));
  assert.equal(JSON.parse(calls[1].options.body).data[0].range, "'Передача с кухни на СКЛАД'!G4");
});

test('a denied read must not be treated as an empty sheet with row 3 available', async () => {
  const utils = loadUtils(target, async () => ({
    ok: false, status: 403, json: async () => ({ error: { message: 'Permission denied' } }),
  }));
  await assert.rejects(utils.findFirstEmptyRowInColA('test-token', 'Остатки кухни '), /Permission denied/);
});

test('moving either kitchen tab to a new spreadsheet does not overwrite legacy row numbers', async () => {
  for (const [file, method, title] of [
    ['kitchen-residues-sheet.js', 'appendToKitchenResidues', 'Остатки кухни '],
    ['kitchen-transfer-sheet.js', 'appendToKitchenTransfer', 'Передача с кухни на СКЛАД'],
  ]) {
    const stored = new Map([[title, 3]]), writes = [], queries = [];
    const base = loadUtils(target);
    const helpers = {
      ...base, getAccessToken: async () => 'test-token',
      findFirstEmptyRowInColA: async () => 777,
      writeCellsToSheet: async (_token, name, rows) => writes.push({ name, rows }),
    };
    const pool = { query: async (sql, params) => {
      queries.push(params);
      const key = params[3];
      if (sql.startsWith('SELECT')) return { rows: stored.has(key) ? [{ row_num: stored.get(key) }] : [] };
      stored.set(key, params[4]);
      return { rows: [] };
    } };
    const context = {
      module: { exports: {} },
      require: name => {
        if (name === './sheets-utils') return helpers;
        if (name === '../db') return { pool };
        throw new Error('Unexpected dependency');
      },
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib', file), 'utf8'), context);
    const items = [{ item_id: 123, name: 'ДХ тест', to_kitchen: 12, label_date: '2026-10-12' }];
    await context.module.exports[method](items, '2026-10-12');
    await context.module.exports[method](items, '2026-10-12');
    assert.equal(stored.get(title), 3);
    assert.equal(stored.get(`${target}:${title}`), 777);
    assert.ok(queries.every(params => params[3] === `${target}:${title}`));
    assert.ok(writes.every(write => write.name === title && write.rows[0].rowNum === 777));
    assert.ok(writes[0].rows[0].cells.some(cell => cell.col === 'E' && cell.value === '=D777+180'));
  }
});

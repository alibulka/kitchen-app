const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SPREADSHEET_ID, SOURCES, parseTasks } = require('../lib/prorabotki-sheets');

test('only the two approved tabs in the replacement spreadsheet are configured', () => {
  assert.equal(SPREADSHEET_ID, '1wdclW96Z4YvdEv_syKILNrnUA-q3OnVayb0PHzQSNPA');
  assert.deepEqual(SOURCES.map(({ gid, title, startRow }) => ({ gid, title, startRow })), [
    { gid: 236716915, title: 'Мясо / Рыба Проработки (с 2025года)', startRow: 225 },
    { gid: 184249890, title: 'ни рыба ни мясо', startRow: 822 },
  ]);
});

test('inclusive cutoffs preserve physical row IDs, including blank rows', () => {
  for (const source of SOURCES) {
    const row = [];
    row[source.columns.name] = 'Задание';
    const tasks = parseTasks(source, 'Вкладка', [row, [], row]);
    assert.equal(tasks[0].sheetId, `${source.gid}:${source.startRow}`);
    assert.equal(tasks[1].sourceRow, source.startRow + 2);
    assert.equal(tasks[1].sheetId, `${source.gid}:${source.startRow + 2}`);
  }
  assert.deepEqual(SOURCES.map(s => s.startRow), [225, 822]);
});

test('different tab layouts map supplier, dates and mass correctly', () => {
  for (const source of SOURCES) {
    const row = [];
    for (const [key, col] of Object.entries(source.columns)) row[col] = key;
    const [task] = parseTasks(source, 'Вкладка', [row]);
    for (const key of Object.keys(source.columns)) assert.equal(task[key], key);
  }
});
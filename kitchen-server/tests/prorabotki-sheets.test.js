const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SOURCES, parseTasks } = require('../lib/prorabotki-sheets');

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
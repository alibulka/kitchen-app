const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const html = readFileSync(resolve(__dirname, '../public/index.html'), 'utf8');
const start = html.indexOf('function formatDoneTime(');
const end = html.indexOf('// MANAGER — EMPLOYEES TAB', start);
assert.ok(start >= 0 && end > start);
const source = html.slice(start, end);
const time = '2026-10-01T10:45:00.000Z';
const expectedTime = new Date(time).toLocaleTimeString('ru-RU', {
  hour: '2-digit', minute: '2-digit', hour12: false,
});

function render({ period = false, sortDir = null } = {}) {
  const catalog = [
    { key: 'meat', shop: 'Цех', name: 'Цех / Плита', items: [
      { id: 1, name: 'Готовая заготовка' },
      { id: 2, name: 'Фасовка' },
      { id: 3, name: 'Не выполнена' },
      { id: 4, name: 'Старая без времени' },
    ] },
    { key: 'suhoj_tseh_test', shop: 'Цех', name: 'Цех / Замесы', items: [
      { id: 10, name: 'Смесь', ingredients: [{ planAmount: 100 }, { planAmount: 200 }] },
    ] },
    { key: 'robokop', shop: 'Цех', name: 'Цех / Робокоп', items: [
      { id: 20, name: 'Нарезка без сотрудника' },
      { id: 21, name: 'Нарезка с сотрудником' },
    ] },
  ];
  const shift = {
    techcardId: 1, facts: {},
    doneFlags: {
      'meat-1': true, 'meat-2-pl-0': true, 'meat-2-pl-1': true, 'meat-4': true,
      'zames-suhoj_tseh_test-10': true,
      'precut-robokop-20': true, 'precut-robokop-21': true, 'prev-meat-5-pl-0': true,
    },
    doneTimes: {
      'meat-1': time, 'meat-2-pl-0': time, 'meat-2-pl-1': time,
      'meat-3': time, 'zames-suhoj_tseh_test-10': time,
      'precut-robokop-20': time, 'precut-robokop-21': time,
      // Employee assignment time is not the completion mark.
      'precut-robokop-21-emp-1': '2026-10-01T09:00:00.000Z',
      'prev-meat-5-pl-0': time,
    },
    doneBy: { 'precut-robokop-21': [1] },
    itemPackLines: { 2: [{ qty: 2 }, { qty: 3 }] },
    prevSkips: [{
      stationKey: 'meat', itemId: 5, lineIdx: 0, itemName: 'Перенос',
      status: 'partial', planQty: 4, yesterdayFact: 1,
    }],
  };
  const memo = [];
  let stateIndex = 0;
  const overrides = new Map();
  if (period) {
    overrides.set(0, 'period');
    overrides.set(4, [{ dateKey: '2026-10-01', shift, catalog }]);
  }
  if (sortDir) {
    overrides.set(10, 'doneAt');
    overrides.set(11, sortDir);
  }
  const context = {
    Set, Date,
    useMemo: fn => { const result = fn(); memo.push(result); return result; },
    useState: value => {
      const i = stateIndex++;
      return [overrides.has(i) ? overrides.get(i) : value, () => {}];
    },
    useEffect: () => {},
    e: (type, props, ...children) => ({
      type, props: props || {}, children: children.flat(Infinity).filter(x => x != null && x !== false),
    }),
    SvgSort: 'sort-icon', SvgDownload: 'download-icon', SvgBarChart: 'chart-icon',
    getCatalogForDate: () => catalog,
    startTimeToDate: (date, clock) => new Date(`${date}T${clock}:00`),
    EXCEL_PACK_LINES: {}, OVOSHCH_FASOVKA_KEY: 'vegetable', ROBOKOP_KEY: 'robokop',
    SKIP_LABELS: {}, formatDateRu: value => value,
    XLSX: {
      utils: {
        aoa_to_sheet: rows => { context.exportRows = rows; return {}; },
        book_new: () => ({}), book_append_sheet: () => {},
      },
      writeFile: () => {},
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  const tree = context.DashboardTab({
    dateKey: '2026-10-01', shift, allEmployees: [{ id: 1, name: 'Сотрудник' }],
    archiveIndex: [], shopGroups: [], precutConfig: new Set([20, 21]),
  });
  return { context, tree, rows: memo[2], filtered: memo[5] };
}

function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...(tree.children || []).flatMap(nodes)];
}
function text(tree) {
  if (typeof tree === 'string' || typeof tree === 'number') return String(tree);
  return (tree.children || []).map(text).join('');
}

test('completion marks are retained without employees for regular, packing, mixing and carried rows', () => {
  const { rows } = render();
  const completed = rows.filter(r => r.done);
  assert.equal(completed.length, 8);
  for (const row of completed) {
    if (row.name === 'Старая без времени') assert.equal(row.doneAt, null);
    else assert.equal(row.doneAt, time, row.name);
  }
  assert.equal(rows.find(r => r.name === 'Не выполнена').doneAt, null);
});

test('both detail tables show a separate completion-time column today and in archived periods', () => {
  for (const period of [false, true]) {
    const { tree } = render({ period });
    const tables = nodes(tree).filter(n => n.type === 'table' && n.props.className === 'report-table');
    assert.equal(tables.length, 2);
    for (const table of tables) {
      const headings = nodes(table).filter(n => n.type === 'th');
      const timeIndex = headings.findIndex(n => text(n) === 'Отметка выполнения');
      const nameIndex = headings.findIndex(n => ['Заготовка', 'Позиция'].includes(text(n)));
      const statusIndex = headings.findIndex(n => text(n) === 'Статус');
      assert.ok(timeIndex >= 0);
      assert.ok(headings.some(n => text(n) === 'Длительность'));
      const body = table.children.find(n => n.type === 'tbody');
      for (const row of body.children) {
        assert.equal(row.children.length, headings.length);
        const name = text(row.children[nameIndex]);
        const expected = name === 'Старая без времени' ||
          !text(row.children[statusIndex]).includes('✓') ? '—' : expectedTime;
        assert.equal(text(row.children[timeIndex]), expected, name);
      }
    }
  }
});

test('missing and invalid saved timestamps show a dash rather than a fabricated time', () => {
  const { context } = render();
  assert.equal(context.formatDoneTime(null), '—');
  assert.equal(context.formatDoneTime('invalid-date'), '—');
  assert.equal(context.formatDoneTime(time), expectedTime);
});

test('Excel includes the same completion time and preserves column alignment', () => {
  const { context, tree } = render();
  const button = nodes(tree).find(n => n.type === 'button' && text(n).includes('Excel'));
  button.props.onClick();
  const [headings, ...rows] = context.exportRows;
  const index = headings.indexOf('Отметка выполнения');
  assert.ok(index >= 0);
  for (const row of rows) {
    assert.equal(row.length, headings.length);
    if (row[8] === 'Да' && row[3] !== 'Старая без времени') assert.equal(row[index], expectedTime);
    else assert.equal(row[index], '—');
  }
});

test('sorting completion time leaves missing timestamps last in both directions', () => {
  for (const sortDir of ['asc', 'desc']) {
    const { filtered } = render({ sortDir });
    let sawMissing = false;
    for (const row of filtered) {
      if (!row.doneAt) sawMissing = true;
      else assert.equal(sawMissing, false);
    }
  }
});
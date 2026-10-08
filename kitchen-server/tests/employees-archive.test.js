const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pool } = require('../db');
const employeesRouter = require('../routes/employees');

test('archive/restore retains identity, shops and historical shift records, with active-only and full catalog reads', async t => {
  const originalQuery = pool.query;
  const records = [
    { id: 'archive-test', name: 'Тест истории', shop: 'Мясной цех', shops: '["Мясной цех","Соусный цех"]', active: 1 },
    { id: 'active-test', name: 'Тест активный', shop: 'Мясной цех', shops: null, active: 1 },
  ];
  const history = {
    date: '2026-10-04', doneFlags: { 'meat-123-pl-0': true },
    doneBy: { 'meat-123-pl-0': ['archive-test'] },
    doneTimes: { 'meat-123-pl-0': '2026-10-04T12:00:00Z' }, facts: { 'meat-123-pl-0': 25 },
  };
  const snapshot = JSON.stringify(history);
  const messages = [];
  pool.query = async (sql, params = []) => {
    const s = sql.replace(/\s+/g, ' ').trim();
    // Reject ANY access to shift tables: archiving must not rewrite history.
    assert.doesNotMatch(s, /shift_|DELETE FROM/i);
    if (s.startsWith('SELECT')) {
      let rows = records;
      if (s.includes('WHERE active = 1')) rows = rows.filter(r => r.active === 1);
      if (s.includes('WHERE id=$1')) rows = rows.filter(r => r.id === params[0]);
      return { rows: rows.map(r => ({ ...r })), rowCount: rows.length };
    }
    if (s.startsWith('UPDATE employees SET active=$1')) {
      const row = records.find(r => r.id === params[1]);
      if (row) row.active = params[0];
      return { rows: [], rowCount: row ? 1 : 0 };
    }
    if (s.startsWith('UPDATE employees SET name=')) {
      const row = records.find(r => r.id === params[3]);
      if (row) Object.assign(row, { name: params[0], shop: params[1], shops: params[2] });
      return { rows: [], rowCount: row ? 1 : 0 };
    }
    if (s.startsWith('INSERT INTO employees')) {
      assert.doesNotMatch(s.split('ON CONFLICT')[1], /active\s*=\s*1/);
      const row = records.find(r => r.id === params[0]);
      if (row) Object.assign(row, { name: params[1], shop: params[2], shops: params[3] });
      else records.push({ id: params[0], name: params[1], shop: params[2], shops: params[3], active: 1 });
      return { rows: [], rowCount: 1 };
    }
    throw new Error('Unexpected SQL: ' + s);
  };
  const app = express();
  app.use(express.json());
  app.set('wss', { clients: [{ readyState: 1, send: message => messages.push(JSON.parse(message)) }] });
  app.use('/api/employees', employeesRouter);
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => { pool.query = originalQuery; server.close(); });
  const base = `http://127.0.0.1:${server.address().port}/api/employees`;
  const request = (suffix = '', body, method = 'PATCH') => fetch(base + suffix, body === undefined ? {} : {
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const catalog = async suffix => (await (await request(suffix)).json()).employees;
  assert.equal((await catalog('')).length, 2);
  const archived = await request('/archive-test/archive', { archived: true });
  assert.equal(archived.status, 200);
  const employee = (await archived.json()).employee;
  assert.equal(employee.active, 0);
  assert.equal(employee.id, 'archive-test');
  assert.deepEqual(employee.shops, ['Мясной цех', 'Соусный цех']);
  assert.deepEqual((await catalog('')).map(r => r.id), ['active-test']);
  assert.equal((await catalog('?include_archived=1')).find(r => r.id === 'archive-test').name, 'Тест истории');
  assert.equal(JSON.stringify(history), snapshot);
  assert.equal(messages.at(-1).type, 'employees_updated');
  // Repeated archiving is safe; unrelated editing and legacy upserts cannot restore an archive.
  assert.equal((await request('/archive-test/archive', { archived: true })).status, 200);
  await request('/archive-test', { name: 'Тест истории', shops: ['Мясной цех', 'Соусный цех'] }, 'PUT');
  await request('', { id: 'archive-test', name: 'Тест истории', shops: ['Мясной цех', 'Соусный цех'] }, 'POST');
  assert.equal(records[0].active, 0);
  assert.equal((await request('/missing/archive', { archived: true })).status, 404);
  assert.equal((await request('/archive-test/archive', { archived: 'false' })).status, 400);
  assert.equal((await request('/archive-test/archive', {})).status, 400);
  const restored = await request('/archive-test/archive', { archived: false });
  assert.equal((await restored.json()).employee.active, 1);
  assert.equal((await catalog('')).length, 2);
  assert.equal(JSON.stringify(history), snapshot);
});

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
function source(start, end) { return html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start))); }
const activeSource = source('function isEmployeeActive(', 'function getShopEmployees(');
const loadSource = source('async function loadEmployeesGlobal(', 'async function addEmployeeToServer(');
const toggleSource = source('function EmployeeToggles(', '// ============================================================\n// ITEM CARD');

test('empty and all-archived catalogs never resurrect fallback staff or write to the server', async () => {
  for (const employees of [[], [{ id: 'archived', name: 'История', active: 0 }]]) {
    const requests = [];
    const context = { fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ employees }) };
    } };
    vm.runInNewContext(loadSource, context);
    assert.deepEqual(await context.loadEmployeesGlobal(), employees);
    assert.deepEqual(requests, [{ url: '/api/employees?include_archived=1', options: undefined }]);
  }
});

test('employee catalog errors are explicit, not fabricated employee lists', async () => {
  const context = { fetch: async () => ({ ok: false }) };
  vm.runInNewContext(loadSource, context);
  await assert.rejects(context.loadEmployeesGlobal(), /Не удалось загрузить сотрудников/);
});

test('archived employees are not selectable; existing regular marks keep read-only names and IDs', () => {
  const context = { e: (type, props, ...children) => ({ type, props, children }) };
  vm.runInNewContext(activeSource + toggleSource, context);
  const employees = [
    { id: 'active', name: 'Активный', active: 1 },
    { id: 'archived', name: 'История', active: 0 },
    { id: 'legacy', name: 'Старый формат' },
  ];
  const selectedIds = ['archived'];
  const tree = context.EmployeeToggles({ employees, selectedIds, onToggle: () => {} });
  const controls = tree.children[0];
  assert.deepEqual(controls.filter(c => c.type === 'button').map(c => c.props.key), ['active', 'legacy']);
  const oldMark = controls.find(c => c.props.key === 'archived');
  assert.equal(oldMark.type, 'span');
  assert.equal(oldMark.props.onClick, undefined);
  assert.equal(oldMark.children[0], 'История (архив)');
  assert.deepEqual(selectedIds, ['archived']);
  const empty = context.EmployeeToggles({ employees: [employees[1]], selectedIds: [], onToggle: () => {} });
  assert.equal(empty.children[0].length, 0);
});

test('packing selections also exclude archives while keeping already assigned archive marks', () => {
  assert.match(html, /shopEmployees\.filter\(emp=>isEmployeeActive\(emp\)\|\|lineEmpIds\.includes\(emp\.id\)\)/);
  assert.match(html, /if\(!isEmployeeActive\(emp\)\) return e\('span'/);
  const tab = source('function EmployeesTab(', '// MANAGER — SHIFTS TAB');
  assert.ok(tab.includes('setEmployeeArchivedOnServer(emp.id,archived)'));
  assert.ok(!tab.includes('removeEmployeeFromServer('));
  assert.ok(tab.includes('Восстановить'));
});

test('reading an old shift keeps the archived employee ID, completion timestamp and production fact', async () => {
  const shifts = fs.readFileSync(path.join(__dirname, '../routes/shifts.js'), 'utf8');
  const readSource = shifts.slice(shifts.indexOf('async function buildShift('), shifts.indexOf('// ─── Запись смены'));
  const date = '2026-10-04';
  const context = { getPrevDate: () => null, pool: { query: async sql => {
    if (sql.includes('FROM shifts ')) return { rows: [{ date, techcard_id: null, ud_techcard_id: null }] };
    if (sql.includes('FROM shift_item_status')) return { rows: [{
      station_key: 'meat-123-pl', item_id: '0', done: 1, done_at: '2026-10-04T12:00:00Z',
    }] };
    if (sql.includes('FROM shift_item_employees')) return { rows: [{
      station_key: 'meat-123-pl', item_id: '0', employee_id: 'archive-test',
    }] };
    if (sql.includes('FROM shift_facts_n')) return { rows: [{
      station_key: 'meat', item_id: '123', line_idx: 0, value: 25,
    }] };
    if (/FROM (shift_station_start|station_config|shift_pack_lines)/.test(sql)) return { rows: [] };
    throw new Error('Unexpected history query');
  } } };
  vm.runInNewContext(readSource, context);
  const saved = JSON.parse(JSON.stringify(await context.buildShift(date)));
  assert.deepEqual(saved.doneBy['meat-123-pl-0'], ['archive-test']);
  assert.equal(saved.doneFlags['meat-123-pl-0'], true);
  assert.equal(saved.doneTimes['meat-123-pl-0'], '2026-10-04T12:00:00Z');
  assert.equal(saved.facts['meat-123-pl-0'], 25);
});

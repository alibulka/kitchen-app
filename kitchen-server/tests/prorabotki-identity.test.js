const { test } = require('node:test');
const assert = require('node:assert/strict');
const { planIds, taskKey, findTaskRow, reconcileLegacy } = require('../lib/prorabotki-identity');
const { SOURCES, parseTasks, loadSnapshot } = require('../lib/prorabotki-sheets');

function rowFor(source, id, name = 'Задание') {
  const row = [id];
  row[source.columns.name] = name;
  return row;
}

test('fill only empty IDs on task rows; reserve historical and existing IDs', () => {
  for (const source of SOURCES) {
    const rows = [rowFor(source, ''), [], rowFor(source, 900), rowFor(source, ''), rowFor(source, 'custom')];
    const plan = planIds(source, rows, [1200, 900, 'custom']);
    assert.deepEqual(plan.map(p => [p.row, p.id]), [[source.startRow, 1201], [source.startRow + 3, 1202]]);
    assert.equal(rows[0][0], '', 'Planning must not mutate source data');
    assert.equal(rows[2][0], 900);
  }
});

test('legacy acts keep their ID on first initialization without collisions', () => {
  const source = SOURCES[0];
  const rows = [rowFor(source, '', 'Первое'), rowFor(source, '', 'Второе')];
  const acts = [{ source_row: '750743492:226', source_product_name: 'Второе' }];
  const plan = planIds(source, rows, [], acts);
  assert.deepEqual(plan.map(p => p.id), [227, 226]);
  assert.throws(() => planIds(source, rows, [], [
    { source_row: '750743492:225', source_product_name: 'Другой товар' },
  ]), /однозначно/);
});

test('persistent task ID follows moved row; new task cannot reuse an act ID', () => {
  const source = SOURCES[0];
  const rows = [rowFor(source, '', 'Новая'), [], rowFor(source, 225, 'Старая')];
  const acts = [{ source_row: '750743492:id:225', product_name: 'Старая' }];
  assert.equal(findTaskRow(source, rows, '750743492:id:225').row, 227);
  assert.equal(planIds(source, rows, [225], acts)[0].id, 226);
  const [task] = parseTasks(source, 'Мясо', [[], rowFor(source, 500)]);
  assert.equal(task.sheetId, '750743492:id:500');
  assert.equal(task.sourceRow, 226);
  assert.equal(task.idPersisted, true);
  assert.equal(planIds(source, [rowFor(source, '')], [], [
    { source_row: '750743492:id:999', product_name: 'Удалённое задание' },
  ])[0].id, 1000);
});

test('duplicate IDs fail; missing IDs never resolve to a physical-row fallback', () => {
  const source = SOURCES[1];
  assert.throws(() => planIds(source, [rowFor(source, 12), rowFor(source, '12')], []), /Повторяющийся/);
  assert.throws(() => findTaskRow(source, [rowFor(source, '')], '255104827:id:822'), /не найден/);
  assert.equal(findTaskRow(source, [rowFor(source, 12)], '255104827:id:12').row, 822);
  const key = taskKey(source, 'Особый ID');
  assert.equal(findTaskRow(source, [rowFor(source, 'Особый ID')], key).row, 822);
});

test('legacy blank-ID task moved before initialization is reconciled unambiguously', () => {
  const source = SOURCES[0];
  const acts = [{ source_row: '750743492:225', product_name: 'Старое задание' }];
  for (const first of [[], rowFor(source, '', 'Новое задание')]) {
    const rows = [first, rowFor(source, '', 'Старое задание')];
    const assignment = planIds(source, rows, [], acts).find(a => a.offset === 1);
    assert.equal(assignment.id, 225);
    assert.equal(reconcileLegacy(source, rows, acts)[0].offset, 1);
  }
  const rows = [rowFor(source, 225, 'Чужое задание'), rowFor(source, '', 'Старое задание')];
  assert.equal(planIds(source, rows, [225], acts)[0].id, 226, 'Do not hijack existing numeric ID 225');
  assert.throws(() => reconcileLegacy(source, [rowFor(source, '', 'Старое задание'), rowFor(source, '', 'Старое задание')], acts), /однозначно/);
  assert.throws(() => reconcileLegacy(source, [], acts), /однозначно/);
});

test('legacy source name has priority; competing old identities cannot merge into one task', () => {
  const source = SOURCES[0];
  const act = { id: 1, source_row: '750743492:225', source_product_name: 'Исходное', product_name: 'Переименованное' };
  const rows = [rowFor(source, '', 'Исходное'), rowFor(source, '', 'Переименованное')];
  assert.equal(reconcileLegacy(source, rows, [act])[0].offset, 0);
  assert.throws(() => reconcileLegacy(source, [rows[0]], [
    act, { ...act, id: 2, source_row: '750743492:226' },
  ]), /разные задания/);
  assert.equal(reconcileLegacy(source, [rows[0]], [act, { ...act, id: 2 }]).length, 2);
});

test('production initialization changes only A; repeated loading is idempotent; dev writes nothing', async () => {
  const old = process.env.PRORABOTKI_WRITE_ENABLED;
  const data = SOURCES.map(s => [rowFor(s, '')]);
  const requests = [];
  const client = { async query() { return { rows: [] }; } };
  const auth = { async request(req) {
    if (req.method === 'POST') {
      requests.push(req.data);
      for (const request of req.data.requests) {
        const cell = request.updateCells;
        const sourceIndex = SOURCES.findIndex(s => s.gid === cell.range.sheetId);
        assert.equal(cell.range.startColumnIndex, 0);
        assert.equal(cell.range.endColumnIndex, 1);
        assert.equal(cell.fields, 'userEnteredValue');
        assert.ok(cell.range.startRowIndex >= SOURCES[sourceIndex].startRow - 1);
        data[sourceIndex][0][0] = cell.rows[0].values[0].userEnteredValue.numberValue;
      }
      return { data: {} };
    }
    if (!req.url.includes('/values/')) return { data: { sheets: SOURCES.map((s, i) => ({
      properties: { sheetId: s.gid, title: `Лист${i}` },
    })) } };
    const range = decodeURIComponent(req.url.split('/values/')[1]);
    const i = Number(range.match(/Лист(\d)/)[1]);
    return { data: { values: structuredClone(range.endsWith('!A1:A')
      ? [...Array.from({ length: SOURCES[i].startRow - 1 }, () => []), ...data[i].map(r => [r[0]])] : data[i]) } };
  } };
  try {
    delete process.env.PRORABOTKI_WRITE_ENABLED;
    const dev = await loadSnapshot(null, { auth });
    assert.equal(requests.length, 0);
    assert.equal(dev.snapshots[0].rows[0][0], '');
    await assert.rejects(loadSnapshot(client, { auth, writable: true }), /отключена/);
    process.env.PRORABOTKI_WRITE_ENABLED = 'true';
    await loadSnapshot(client, { auth, writable: true });
    assert.equal(requests.length, 1);
    assert.deepEqual(data.map(rows => rows[0][0]), [225, 822]);
    await loadSnapshot(client, { auth, writable: true });
    assert.equal(requests.length, 1, 'No second write for already filled IDs');
  } finally {
    if (old === undefined) delete process.env.PRORABOTKI_WRITE_ENABLED;
    else process.env.PRORABOTKI_WRITE_ENABLED = old;
  }
});

test('changed source during initialization aborts without writing any ID', async () => {
  const old = process.env.PRORABOTKI_WRITE_ENABLED;
  process.env.PRORABOTKI_WRITE_ENABLED = 'true';
  let rowReads = 0, writes = 0;
  const auth = { async request(req) {
    if (req.method === 'POST') { writes++; return { data: {} }; }
    if (!req.url.includes('/values/')) return { data: { sheets: SOURCES.map((s, i) => ({
      properties: { sheetId: s.gid, title: `Лист${i}` },
    })) } };
    const range = decodeURIComponent(req.url.split('/values/')[1]);
    if (range.endsWith('!A1:A')) return { data: { values: [] } };
    if (range.includes('Лист1')) return { data: { values: [] } };
    rowReads++;
    return { data: { values: [rowFor(SOURCES[0], '', rowReads === 1 ? 'До перестановки' : 'После перестановки')] } };
  } };
  try {
    await assert.rejects(loadSnapshot({ async query() { return { rows: [] }; } }, { auth, writable: true }), /Таблица изменилась/);
    assert.equal(writes, 0);
  } finally {
    if (old === undefined) delete process.env.PRORABOTKI_WRITE_ENABLED;
    else process.env.PRORABOTKI_WRITE_ENABLED = old;
  }
});

test('legacy link migrates to existing ID without overwriting the ID or losing act', async () => {
  const old = process.env.PRORABOTKI_WRITE_ENABLED;
  process.env.PRORABOTKI_WRITE_ENABLED = 'true';
  const updates = [];
  let writes = 0;
  const client = { async query(sql, params) {
    if (sql.startsWith('UPDATE')) { updates.push(params); return { rows: [] }; }
    return { rows: [{ id: 42, source_row: '750743492:225', product_name: 'Существующий акт' }] };
  } };
  const auth = { async request(req) {
    if (req.method === 'POST') { writes++; return { data: {} }; }
    if (!req.url.includes('/values/')) return { data: { sheets: SOURCES.map((s, i) => ({
      properties: { sheetId: s.gid, title: `Лист${i}` },
    })) } };
    const range = decodeURIComponent(req.url.split('/values/')[1]);
    if (range.includes('Лист1')) return { data: { values: [] } };
    return { data: { values: range.endsWith('!A1:A')
      ? [...Array.from({ length: 225 }, () => []), [17]]
      : [[], rowFor(SOURCES[0], 17, 'Существующий акт')] } };
  } };
  try {
    await loadSnapshot(client, { auth, writable: true });
    assert.equal(writes, 0);
    assert.deepEqual(updates, [['750743492:id:17', '750743492:225', 42]]);
  } finally {
    if (old === undefined) delete process.env.PRORABOTKI_WRITE_ENABLED;
    else process.env.PRORABOTKI_WRITE_ENABLED = old;
  }
});
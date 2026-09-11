const { JWT } = require('google-auth-library');
const { cellId, taskKey, planIds, reconcileLegacy } = require('./prorabotki-identity');

const SPREADSHEET_ID = '1WomFf4GOeRQta4MdzP_RnHqzv467FCnrs7uARsVF7I0';
// Inclusive physical row boundaries, identical in development and production.
const SOURCES = [
  { gid: 750743492, startRow: 225, columns: {
    material: 1, purpose: 2, name: 3, productType: 4, manufacturer: 6,
    supplier: 7, arrivalDate: 11, deadline: 12, workDate: 13,
    grossMass: 14, defrostMass: 15, defrostPercent: 17, conclusion: 21, comment: 23,
  } },
  { gid: 255104827, startRow: 822, columns: {
    purpose: 1, name: 2, manufacturer: 3, supplier: 4,
    arrivalDate: 8, deadline: 9, workDate: 10,
    grossMass: 12, defrostMass: 13, defrostPercent: 14, conclusion: 16, comment: 19,
  } },
];

function parseTasks(source, title, rows) {
  return rows.flatMap((row, offset) => {
    const task = {};
    for (const [field, column] of Object.entries(source.columns)) {
      task[field] = String(row[column] ?? '').trim();
    }
    if (!task.name) return [];
    const sourceRow = source.startRow + offset;
    return [{
      ...task,
      type: task.productType || '',
      material: task.material || '',
      sheetId: taskKey(source, row[0], sourceRow),
      sheetCellId: cellId(row[0]) || null,
      idPersisted: Boolean(cellId(row[0])),
      sourceSheet: title,
      sourceSheetId: source.gid,
      sourceRow,
    }];
  });
}

function createAuth(writable) {
  if (!process.env.GOOGLE_CREDENTIALS_JSON) {
    throw new Error('Не настроен доступ к Google Таблице проработок');
  }
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [writable ? 'https://www.googleapis.com/auth/spreadsheets'
      : 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

const sourceQueues = new Map();
async function withSpreadsheetLock(pool, fn) {
  if (!pool) throw new Error('Для записи ID требуется подключение к базе');
  const previous = sourceQueues.get(SPREADSHEET_ID) || Promise.resolve();
  const job = previous.catch(() => {}).then(() => pool.withTransaction(async client => {
    if (typeof pool.connect === 'function') {
      await client.query('SELECT pg_advisory_xact_lock(72842, hashtext($1))', [SPREADSHEET_ID]);
    }
    return fn(client);
  }));
  sourceQueues.set(SPREADSHEET_ID, job);
  try { return await job; } finally {
    if (sourceQueues.get(SPREADSHEET_ID) === job) sourceQueues.delete(SPREADSHEET_ID);
  }
}

// Caller holds the spreadsheet lock whenever writable=true.
async function loadSnapshot(client, { writable = false, auth = createAuth(writable) } = {}) {
  if (writable && process.env.PRORABOTKI_WRITE_ENABLED !== 'true') {
    throw new Error('Запись ID отключена в этом окружении');
  }
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
  const { data } = await auth.request({
    url: base, params: { fields: 'sheets(properties(sheetId,title))' },
    timeout: 20000,
  });
  const snapshots = await Promise.all(SOURCES.map(async source => {
    const sheet = data.sheets.find(s => s.properties.sheetId === source.gid)?.properties;
    if (!sheet) throw new Error(`Не найдена вкладка ${source.gid}`);
    const range = `'${sheet.title.replace(/'/g, "''")}'!A${source.startRow}:Y`;
    const idRange = `'${sheet.title.replace(/'/g, "''")}'!A${source.startRow}:A`;
    const [response, idResponse] = await Promise.all([
      auth.request({ url: `${base}/values/${encodeURIComponent(range)}`, timeout: 20000 }),
      auth.request({
        url: `${base}/values/${encodeURIComponent(idRange)}`,
        params: { valueRenderOption: 'UNFORMATTED_VALUE' }, timeout: 20000,
      }),
    ]);
    const allIds = idResponse.data.values?.map(row => row[0]) || [];
    const rows = response.data.values || [];
    rows.forEach((row, offset) => { row[0] = allIds[offset] ?? ''; });
    return { source, title: sheet.title, rows, allIds, range, idRange };
  }));
  if (writable) {
    const { rows: acts } = await client.query(
      'SELECT id, source_row, source_product_name, product_name FROM acts WHERE source_row IS NOT NULL');
    const requests = [];
    for (const snapshot of snapshots) {
      snapshot.assignments = planIds(snapshot.source, snapshot.rows, snapshot.allIds, acts);
      for (const assignment of snapshot.assignments) {
        requests.push({ updateCells: {
          range: { sheetId: snapshot.source.gid, startRowIndex: assignment.row - 1,
            endRowIndex: assignment.row, startColumnIndex: 0, endColumnIndex: 1 },
          rows: [{ values: [{ userEnteredValue: { numberValue: assignment.id } }] }],
          fields: 'userEnteredValue',
        } });
      }
    }
    if (requests.length) {
      // Google Sheets has no compare-and-set for cell writes. Re-read immediately
      // before backfill; refuse if a user moved rows or changed A since our snapshot.
      for (const snapshot of snapshots) {
        const check = await auth.request({
          url: `${base}/values/${encodeURIComponent(snapshot.range)}`, timeout: 20000,
        });
        const ids = await auth.request({
          url: `${base}/values/${encodeURIComponent(snapshot.idRange)}`,
          params: { valueRenderOption: 'UNFORMATTED_VALUE' }, timeout: 20000,
        });
        const checkIds = ids.data.values?.map(row => row[0]) || [];
        const checkRows = check.data.values || [];
        checkRows.forEach((row, offset) => { row[0] = checkIds[offset] ?? ''; });
        if (JSON.stringify(checkRows) !== JSON.stringify(snapshot.rows) ||
            JSON.stringify(checkIds) !== JSON.stringify(snapshot.allIds)) {
          throw new Error('Таблица изменилась во время присвоения ID. Повторите загрузку без редактирования таблицы');
        }
      }
      await auth.request({ url: `${base}:batchUpdate`, method: 'POST', data: { requests }, timeout: 20000 });
      for (const snapshot of snapshots) for (const assignment of snapshot.assignments) {
        snapshot.rows[assignment.offset][0] = assignment.id;
      }
    }
    for (const snapshot of snapshots) {
      for (const legacy of reconcileLegacy(snapshot.source, snapshot.rows, acts)) {
        const newKey = taskKey(snapshot.source, snapshot.rows[legacy.offset][0]);
        await client.query('UPDATE acts SET source_row=$1 WHERE source_row=$2 AND id=$3',
          [newKey, legacy.oldKey, legacy.actId]);
      }
    }
  }
  // Validate existing IDs in read-only mode too; ambiguity must never be hidden.
  for (const snapshot of snapshots) planIds(snapshot.source, snapshot.rows, snapshot.allIds);
  return { snapshots, auth, base };
}

async function loadTasks(pool) {
  const writable = process.env.PRORABOTKI_WRITE_ENABLED === 'true';
  const load = async client => {
    const { snapshots } = await loadSnapshot(client, { writable });
    return snapshots.flatMap(s => parseTasks(s.source, s.title, s.rows));
  };
  return writable ? withSpreadsheetLock(pool, load) : load(null);
}

module.exports = { loadTasks, parseTasks, SOURCES, loadSnapshot, withSpreadsheetLock };
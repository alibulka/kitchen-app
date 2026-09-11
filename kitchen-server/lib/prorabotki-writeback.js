const { JWT } = require('google-auth-library');
const { SOURCES } = require('./prorabotki-sheets');
const queues = new Map();
const RESULT_FIELDS = ['material', 'name', 'manufacturer', 'supplier', 'workDate',
  'grossMass', 'defrostMass', 'defrostPercent', 'conclusion', 'comment'];

function targetFor(id) {
  const match = String(id).match(/^(\d+):(\d+)$/);
  const source = match && SOURCES.find(s => s.gid === Number(match[1]));
  const row = match && Number(match[2]);
  if (!source || !Number.isSafeInteger(row) || row < source.startRow) {
    throw new Error('Недопустимая привязка задания к строке таблицы');
  }
  return { source, row };
}

function buildData(id, title, fields) {
  const { source, row } = targetFor(id);
  fields = { ...fields };
  const gross = fields.grossMass, net = fields.defrostMass;
  delete fields.defrostPercent;
  if (gross != null && gross !== '' && net != null && net !== '' &&
      Number.isFinite(Number(gross)) && Number.isFinite(Number(net)) && Number(gross) > 0) {
    fields.defrostPercent = (Number(gross) - Number(net)) / Number(gross);
  }
  return RESULT_FIELDS.flatMap(field => {
    if (source.columns[field] === undefined) return [];
    const value = fields[field];
    // Missing values must not erase existing spreadsheet results.
    if (value == null || value === '') return [];
    let normalized = value;
    if (field === 'grossMass' || field === 'defrostMass') {
      normalized = Number(value);
      if (!Number.isFinite(normalized)) throw new Error('Некорректная масса');
    }
    const col = String.fromCharCode(65 + source.columns[field]);
    return [{ range: `'${title.replace(/'/g, "''")}'!${col}${row}`, values: [[normalized]] }];
  });
}

function buildRequests(id, data) {
  const { source, row } = targetFor(id);
  return data.map(cell => {
    const column = cell.range.match(/!([A-Z]+)\d+$/)[1].charCodeAt(0) - 65;
    const value = cell.values[0][0];
    const percent = column === source.columns.defrostPercent;
    return { updateCells: {
      range: { sheetId: source.gid, startRowIndex: row - 1, endRowIndex: row,
        startColumnIndex: column, endColumnIndex: column + 1 },
      rows: [{ values: [{
        userEnteredValue: typeof value === 'number' ? { numberValue: value } : { stringValue: String(value) },
        ...(percent ? { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.00%' } } } : {}),
      }] }],
      fields: percent ? 'userEnteredValue,userEnteredFormat.numberFormat' : 'userEnteredValue',
    } };
  });
}

async function syncAct(pool, actId) {
  if (process.env.PRORABOTKI_WRITE_ENABLED !== 'true') return { status: 'disabled' };
  const { rows: [initial] } = await pool.query('SELECT source_row FROM acts WHERE id=$1', [actId]);
  if (!initial?.source_row) return { status: 'unlinked' };
  const key = initial.source_row;
  const previous = queues.get(key) || Promise.resolve();
  const job = previous.catch(() => {}).then(async () => {
    // Re-read after earlier writes finish; do not send a stale request snapshot.
    const { rows: [act] } = await pool.query('SELECT * FROM acts WHERE id=$1', [actId]);
    if (!act || act.source_row !== key) throw new Error('Привязка акта изменилась');
    const { source, row } = targetFor(key);
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}');
    const auth = new JWT({ email: credentials.client_email, key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const base = 'https://sheets.googleapis.com/v4/spreadsheets/1WomFf4GOeRQta4MdzP_RnHqzv467FCnrs7uARsVF7I0';
    const { data: meta } = await auth.request({ url: base,
      params: { fields: 'sheets(properties(sheetId,title))' }, timeout: 20000 });
    const title = meta.sheets.find(s => s.properties.sheetId === source.gid)?.properties.title;
    if (!title) throw new Error('Исходная вкладка не найдена');
    const range = `'${title.replace(/'/g, "''")}'!A${row}:Y${row}`;
    const { data: current } = await auth.request({ url: `${base}/values/${encodeURIComponent(range)}`, timeout: 20000 });
    const name = String(current.values?.[0]?.[source.columns.name] || '').trim();
    const expectedName = String(act.source_product_name ?? act.product_name ?? '').trim();
    if (!name || (name !== expectedName && name !== String(act.product_name || '').trim())) {
      throw new Error('Название задания не совпадает: проверьте исходную строку');
    }
    const { rows: comments } = await pool.query(
      `SELECT f.label,v.value FROM act_values v JOIN act_fields f ON f.id=v.field_id
       WHERE v.act_id=$1 AND f.type='comment' AND v.value IS NOT NULL AND v.value<>''
       ORDER BY f.section_id,f.sort_order,f.id`, [actId]);
    const data = buildData(key, title, {
      material: act.raw_material, name: act.product_name,
      manufacturer: act.manufacturer, supplier: act.supplier,
      workDate: act.date, grossMass: act.gross_mass, defrostMass: act.defrost_mass,
      conclusion: act.conclusion, comment: comments.map(c => `${c.label}: ${c.value}`).join('\n'),
    });
    if (!data.length) return { status: 'unchanged' };
    await auth.request({ url: `${base}:batchUpdate`, method: 'POST',
      data: { requests: buildRequests(key, data) }, timeout: 20000 });
    await pool.query('UPDATE acts SET source_product_name=$1 WHERE id=$2',
      [act.product_name || expectedName, actId]);
    return { status: 'synced', cells: data.length };
  });
  queues.set(key, job);
  try { return await job; } finally { if (queues.get(key) === job) queues.delete(key); }
}

async function syncActSafely(pool, actId) {
  try { return await syncAct(pool, actId); }
  catch (error) {
    console.error('[prorabotki] write failed for act', actId, error.response?.status || error.code || 'validation');
    return { status: 'error', message: 'Акт сохранён в трекере, но Google Таблица не обновлена. Проверьте доступ и привязку строки, затем сохраните акт повторно.' };
  }
}

module.exports = { syncActSafely, buildData, buildRequests, targetFor };
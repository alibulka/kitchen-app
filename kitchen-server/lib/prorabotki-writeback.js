const { JWT } = require('google-auth-library');
const { SOURCES } = require('./prorabotki-sheets');
const queues = new Map();
const RESULT_FIELDS = ['workDate', 'grossMass', 'defrostMass', 'conclusion', 'comment'];

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
  return RESULT_FIELDS.flatMap(field => {
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
    if (!name || name !== String(act.product_name || '').trim()) {
      throw new Error('Название задания не совпадает: проверьте исходную строку');
    }
    const { rows: comments } = await pool.query(
      `SELECT f.label,v.value FROM act_values v JOIN act_fields f ON f.id=v.field_id
       WHERE v.act_id=$1 AND f.type='comment' AND v.value IS NOT NULL AND v.value<>''
       ORDER BY f.sort_order,f.id`, [actId]);
    const data = buildData(key, title, {
      workDate: act.date, grossMass: act.gross_mass, defrostMass: act.defrost_mass,
      conclusion: act.conclusion, comment: comments.map(c => `${c.label}: ${c.value}`).join('\n'),
    });
    if (!data.length) return { status: 'unchanged' };
    const result = await auth.request({ url: `${base}/values:batchUpdate`, method: 'POST',
      data: { valueInputOption: 'RAW', data }, timeout: 20000 });
    return { status: 'synced', cells: result.data.totalUpdatedCells };
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

module.exports = { syncActSafely, buildData, targetFor };
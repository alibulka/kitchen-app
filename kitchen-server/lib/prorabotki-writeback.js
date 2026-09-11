const { SOURCES, loadSnapshot, withSpreadsheetLock } = require('./prorabotki-sheets');
const { findTaskRow, taskKey } = require('./prorabotki-identity');
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
  const runSync = async (pool) => {
    // Re-read after earlier writes finish; do not send a stale request snapshot.
    const { rows: [act] } = await pool.query('SELECT * FROM acts WHERE id=$1', [actId]);
    if (!act || act.source_row !== key) throw new Error('Привязка акта изменилась');
    const source = SOURCES.find(s => key.startsWith(`${s.gid}:`));
    if (!source) throw new Error('Неизвестная вкладка задания');
    const { snapshots, auth, base } = await loadSnapshot(pool, { writable: true });
    const snapshot = snapshots.find(s => s.source.gid === source.gid);
    // Initialization may have migrated an old physical-row key to a persistent ID.
    const { rows: [linkedAct] } = await pool.query('SELECT source_row FROM acts WHERE id=$1', [actId]);
    const { row, values: current } = findTaskRow(source, snapshot.rows, linkedAct.source_row);
    const title = snapshot.title;
    const name = String(current[source.columns.name] || '').trim();
    const expectedName = String(act.source_product_name ?? act.product_name ?? '').trim();
    if (!name || (name !== expectedName && name !== String(act.product_name || '').trim())) {
      throw new Error('Название задания не совпадает: проверьте исходную строку');
    }
    const { rows: comments } = await pool.query(
      `SELECT f.label,v.value FROM act_values v JOIN act_fields f ON f.id=v.field_id
       WHERE v.act_id=$1 AND f.type='comment' AND v.value IS NOT NULL AND v.value<>''
       ORDER BY f.section_id,f.sort_order,f.id`, [actId]);
    const rowTarget = `${source.gid}:${row}`;
    const data = buildData(rowTarget, title, {
      material: act.raw_material, name: act.product_name,
      manufacturer: act.manufacturer, supplier: act.supplier,
      workDate: act.date, grossMass: act.gross_mass, defrostMass: act.defrost_mass,
      conclusion: act.conclusion, comment: comments.map(c => `${c.label}: ${c.value}`).join('\n'),
    });
    if (!data.length) return { status: 'unchanged' };
    const targetRange = `'${title.replace(/'/g, "''")}'!A${row}:Y${row}`;
    const { data: checked } = await auth.request({
      url: `${base}/values/${encodeURIComponent(targetRange)}`,
      params: { valueRenderOption: 'UNFORMATTED_VALUE' }, timeout: 20000,
    });
    const target = checked.values?.[0] || [];
    if (taskKey(source, target[0]) !== linkedAct.source_row ||
        String(target[source.columns.name] || '').trim() !== name) {
      throw new Error('Строка задания изменилась во время сохранения. Повторите сохранение');
    }
    await auth.request({ url: `${base}:batchUpdate`, method: 'POST',
      data: { requests: buildRequests(rowTarget, data) }, timeout: 20000 });
    await pool.query('UPDATE acts SET source_product_name=$1 WHERE id=$2',
      [act.product_name || expectedName, actId]);
    return { status: 'synced', cells: data.length };
  };
  return withSpreadsheetLock(pool, runSync);
}

async function syncActSafely(pool, actId) {
  try { return await syncAct(pool, actId); }
  catch (error) {
    console.error('[prorabotki] write failed for act', actId, error.response?.status || error.code || 'validation');
    return { status: 'error', message: 'Акт сохранён в трекере, но Google Таблица не обновлена. Проверьте доступ и привязку строки, затем сохраните акт повторно.' };
  }
}

module.exports = { syncActSafely, buildData, buildRequests, targetFor };
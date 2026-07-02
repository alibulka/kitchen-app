const express = require('express');
const router = express.Router();
const db = require('../db');

// Собрать shift-объект из нормализованных таблиц
function buildShift(date) {
  const shiftRow = db.prepare('SELECT date, techcard_id FROM shifts WHERE date = ?').get(date);
  if (!shiftRow) return null;

  // doneFlags: { "stationKey-itemId": bool }
  const statusRows = db.prepare(
    'SELECT station_key, item_id, done FROM shift_item_status WHERE shift_date = ?'
  ).all(date);

  const doneFlags = {};
  for (const r of statusRows) {
    doneFlags[`${r.station_key}-${r.item_id}`] = r.done === 1;
  }

  // doneBy: { "stationKey-itemId": [empId, ...] }
  const empRows = db.prepare(
    'SELECT station_key, item_id, employee_id FROM shift_item_employees WHERE shift_date = ?'
  ).all(date);

  const doneBy = {};
  for (const r of empRows) {
    const key = `${r.station_key}-${r.item_id}`;
    if (!doneBy[key]) doneBy[key] = [];
    doneBy[key].push(r.employee_id);
  }

  // facts: читаем из нормализованной таблицы shift_facts_n
  // Восстанавливаем составной ключ для обратной совместимости с фронтендом
  const factRows = db.prepare(
    'SELECT station_key, item_id, line_idx, value FROM shift_facts_n WHERE shift_date = ?'
  ).all(date);

  const facts = {};
  for (const r of factRows) {
    facts[`${r.station_key}-${r.item_id}-pl-${r.line_idx}`] = r.value;
  }

  // itemPackLines: техкарта как базовые значения + переопределения из shift_pack_lines
  const techcardId = shiftRow.techcard_id || null;
  const itemPackLines = {};

  // Загружаем plan из нормализованных строк техкарты
  if (techcardId) {
    const tcLines = db.prepare(`
      SELECT item_id, volume, pack_name, destination, from_warehouse, qty
      FROM techcard_pack_lines
      WHERE techcard_id = ?
      ORDER BY item_id, line_idx
    `).all(techcardId);

    for (const r of tcLines) {
      if (!itemPackLines[r.item_id]) itemPackLines[r.item_id] = [];
      itemPackLines[r.item_id].push({
        volume:        r.volume,
        packName:      r.pack_name,
        destination:   r.destination,
        fromWarehouse: r.from_warehouse,
        qty:           r.qty
      });
    }
  }

  // Переопределения (только изменённые позиции)
  const plRows = db.prepare(
    'SELECT item_id, lines_json FROM shift_pack_lines WHERE shift_date = ?'
  ).all(date);
  for (const r of plRows) itemPackLines[r.item_id] = JSON.parse(r.lines_json);

  return { date, techcardId, doneFlags, doneBy, facts, itemPackLines, assignments: {} };
}

// Сохранить shift-объект
function saveShift(date, shift) {
  const upsertShift = db.prepare(`
    INSERT INTO shifts(date, techcard_id) VALUES(?, ?)
    ON CONFLICT(date) DO UPDATE SET techcard_id = excluded.techcard_id, updated_at = datetime('now')
  `);

  const deleteStatus = db.prepare('DELETE FROM shift_item_status WHERE shift_date = ?');
  const insertStatus = db.prepare(
    'INSERT OR REPLACE INTO shift_item_status(shift_date, station_key, item_id, done) VALUES(?,?,?,?)'
  );
  const deleteEmps = db.prepare('DELETE FROM shift_item_employees WHERE shift_date = ?');
  const insertEmp = db.prepare(
    'INSERT OR IGNORE INTO shift_item_employees(shift_date, station_key, item_id, employee_id) VALUES(?,?,?,?)'
  );

  // Нормализованные факты
  const deleteFacts = db.prepare('DELETE FROM shift_facts_n WHERE shift_date = ?');
  const insertFact  = db.prepare(
    'INSERT OR REPLACE INTO shift_facts_n(shift_date,station_key,item_id,line_idx,value) VALUES(?,?,?,?,?)'
  );

  // Переопределения упаковки
  const deletePL = db.prepare('DELETE FROM shift_pack_lines WHERE shift_date = ?');
  const insertPL = db.prepare(
    'INSERT OR REPLACE INTO shift_pack_lines(shift_date, item_id, lines_json) VALUES(?,?,?)'
  );

  // Загружаем techcard_pack_lines для сравнения (сохраняем только реальные переопределения)
  const techcardId = shift.techcardId || null;
  const tcLinesMap = {};
  if (techcardId) {
    const rows = db.prepare(`
      SELECT item_id, line_idx, volume, pack_name, destination, from_warehouse, qty
      FROM techcard_pack_lines WHERE techcard_id = ? ORDER BY item_id, line_idx
    `).all(techcardId);
    for (const r of rows) {
      if (!tcLinesMap[r.item_id]) tcLinesMap[r.item_id] = [];
      tcLinesMap[r.item_id].push({
        volume: r.volume, packName: r.pack_name, destination: r.destination,
        fromWarehouse: r.from_warehouse, qty: r.qty
      });
    }
  }

  // key format: "{station_key}-{item_id}-pl-{line_idx}"
  const RE_FACT = /^(.+)-(\d+)-pl-(\d+)$/;

  db.exec('BEGIN');
  try {
    upsertShift.run(date, techcardId);

    // doneFlags → shift_item_status
    deleteStatus.run(date);
    const doneFlags = shift.doneFlags || {};
    for (const [compKey, done] of Object.entries(doneFlags)) {
      const sep = compKey.lastIndexOf('-');
      const stationKey = compKey.slice(0, sep);
      const itemId = compKey.slice(sep + 1);
      insertStatus.run(date, stationKey, itemId, done ? 1 : 0);
    }

    // doneBy → shift_item_employees
    deleteEmps.run(date);
    const doneBy = shift.doneBy || {};
    for (const [compKey, empIds] of Object.entries(doneBy)) {
      if (!Array.isArray(empIds) || empIds.length === 0) continue;
      const sep = compKey.lastIndexOf('-');
      const stationKey = compKey.slice(0, sep);
      const itemId = compKey.slice(sep + 1);
      // Убедиться что строка статуса существует
      insertStatus.run(date, stationKey, itemId, doneFlags[compKey] ? 1 : 0);
      for (const empId of empIds) {
        insertEmp.run(date, stationKey, itemId, empId);
      }
    }

    // facts → shift_facts_n (нормализованная)
    deleteFacts.run(date);
    const facts = shift.facts || {};
    for (const [key, value] of Object.entries(facts)) {
      const m = key.match(RE_FACT);
      if (!m) continue;
      const [, stationKey, itemId, lineIdx] = m;
      insertFact.run(date, stationKey, itemId, Number(lineIdx), value == null ? null : Number(value));
    }

    // itemPackLines → shift_pack_lines (только переопределения vs техкарта)
    deletePL.run(date);
    const itemPackLines = shift.itemPackLines || {};
    for (const [itemId, lines] of Object.entries(itemPackLines)) {
      // Пропускаем если совпадает с техкартой (не нужно хранить дубликат)
      const tcLines = tcLinesMap[itemId];
      if (tcLines && linesEqual(tcLines, lines)) continue;
      insertPL.run(date, itemId, JSON.stringify(lines));
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// Сравнить два массива pack lines
function linesEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((la, i) => {
    const lb = b[i];
    return la.volume === lb.volume && la.packName === lb.packName &&
           la.destination === lb.destination && Number(la.qty) === Number(lb.qty);
  });
}

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/index', (req, res) => {
  const rows = db.prepare('SELECT date FROM shifts ORDER BY date DESC').all();
  res.json({ dates: rows.map(r => r.date) });
});

router.get('/summary', (req, res) => {
  const shifts = db.prepare(`
    SELECT s.date, s.techcard_id, t.name as techcard_name
    FROM shifts s LEFT JOIN techcards t ON t.id = s.techcard_id
    ORDER BY s.date DESC
  `).all();

  const summary = shifts.map(row => {
    const total = db.prepare('SELECT COUNT(*) as cnt FROM shift_item_status WHERE shift_date=?').get(row.date);
    const done  = db.prepare('SELECT COUNT(*) as cnt FROM shift_item_status WHERE shift_date=? AND done=1').get(row.date);
    return {
      date:         row.date,
      techcardId:   row.techcard_id,
      techcardName: row.techcard_name,
      totalItems:   total?.cnt || 0,
      doneItems:    done?.cnt  || 0
    };
  });
  res.json({ summary });
});

router.get('/:date', (req, res) => {
  const shift = buildShift(req.params.date);
  res.json({ shift });
});

router.post('/:date', (req, res) => {
  const { date } = req.params;
  const { shift } = req.body;
  if (!shift) return res.status(400).json({ error: 'shift required' });

  saveShift(date, shift);

  const wss = req.app.get('wss');
  if (wss) {
    const msg = JSON.stringify({ type: 'shift_updated', date, shift });
    wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
  }

  res.json({ ok: true });
});

module.exports = router;

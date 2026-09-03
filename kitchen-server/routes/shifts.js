const express = require('express');
const router = express.Router();
const { pool } = require('../db');
let writeFacts, writeFacts2;
try { ({ writeFacts, writeFacts2 } = require('../lib/facts-sheets')); } catch {}

// ─── Чтение смены ─────────────────────────────────────────────────────────────

async function buildShift(date) {
  const { rows: [shiftRow] } = await pool.query(
    'SELECT date, techcard_id, ud_techcard_id FROM shifts WHERE date = $1', [date]
  );
  if (!shiftRow) return null;

  const [{ rows: statusRows }, { rows: empRows }, { rows: factRows }, { rows: stationStartRows }] = await Promise.all([
    pool.query('SELECT station_key, item_id, done, done_at, skip_reason, skip_at FROM shift_item_status WHERE shift_date = $1', [date]),
    pool.query('SELECT station_key, item_id, employee_id FROM shift_item_employees WHERE shift_date = $1', [date]),
    pool.query('SELECT station_key, item_id, line_idx, value FROM shift_facts_n WHERE shift_date = $1', [date]),
    pool.query('SELECT station_key, start_time FROM shift_station_start WHERE shift_date = $1', [date]),
  ]);

  const doneFlags = {};
  const doneTimes = {};
  const skipReasons = {};
  const skipTimes = {};
  for (const r of statusRows) {
    const key = `${r.station_key}-${r.item_id}`;
    doneFlags[key] = r.done === 1;
    if (r.done_at) doneTimes[key] = r.done_at;
    if (r.skip_reason) {
      skipReasons[key] = r.skip_reason;
      if (r.skip_at) skipTimes[key] = r.skip_at;
    }
  }

  // Переносы из предыдущего дня: расширенная логика
  const prevDate = getPrevDate(date);
  let prevSkips = [];
  let prevTechcardId = null, prevUdTechcardId = null;
  if (prevDate) {
    const { rows: [prevShiftRow] } = await pool.query(
      'SELECT techcard_id, ud_techcard_id FROM shifts WHERE date=$1', [prevDate]
    );
    if (prevShiftRow) {
      prevTechcardId = prevShiftRow.techcard_id || null;
      prevUdTechcardId = prevShiftRow.ud_techcard_id || null;
    }

    const prevTcIds = prevShiftRow ? [prevShiftRow.techcard_id, prevShiftRow.ud_techcard_id].filter(Boolean) : [];
    const planQtyMap = {}; // itemId|lineIdx → qty (for skip-check)
    const planLineMap = {}; // itemId|lineIdx → {qty, volume, packName}
    if (prevTcIds.length > 0) {
      const ph = prevTcIds.map((_,i) => `$${i+1}`).join(',');
      const { rows: planRows } = await pool.query(
        `SELECT item_id, line_idx, qty, volume, pack_name FROM techcard_pack_lines WHERE techcard_id IN (${ph}) ORDER BY item_id, line_idx`,
        prevTcIds
      );
      for (const r of planRows) {
        const k = `${r.item_id}|${r.line_idx}`;
        planQtyMap[k] = r.qty;
        planLineMap[k] = { qty: r.qty, volume: r.volume || '', packName: r.pack_name || '' };
      }
    }

    const [{ rows: prevAllStatusRows }, { rows: prevFactRows }] = await Promise.all([
      pool.query(
        'SELECT station_key, item_id, done, skip_reason, skip_at FROM shift_item_status WHERE shift_date=$1',
        [prevDate]
      ),
      pool.query(
        'SELECT station_key, item_id, line_idx, value FROM shift_facts_n WHERE shift_date=$1',
        [prevDate]
      ),
    ]);

    // Факты вчера: stationKey|itemId|lineIdx → value
    const prevFactMap = {};
    for (const r of prevFactRows) {
      prevFactMap[`${r.station_key}|${r.item_id}|${r.line_idx}`] = r.value;
    }

    // Разбираем статусы на pack-line и item-level
    const packLineRows = [];
    const itemLevelRows = [];
    for (const r of prevAllStatusRows) {
      if (r.station_key.endsWith('-pl')) {
        const parts = r.station_key.split('-');
        parts.pop(); // 'pl'
        const itemId = parts.pop();
        const stationKey = parts.join('-');
        packLineRows.push({ stationKey, itemId, lineIdx: Number(r.item_id), done: r.done === 1, skipReason: r.skip_reason, skipAt: r.skip_at });
      } else {
        itemLevelRows.push({ stationKey: r.station_key, itemId: r.item_id, done: r.done === 1, skipReason: r.skip_reason, skipAt: r.skip_at });
      }
    }

    // Находим "проблемные позиции" — те, у которых хоть одна упаковка со skip_reason
    // и при этом факт < план (или факт не указан). Если done=1 и fact >= plan — не переносим.
    const carriedKeys = new Set();
    for (const r of packLineRows) {
      if (!r.skipReason) continue;
      if (r.done) {
        const fact = prevFactMap[`${r.stationKey}|${r.itemId}|${r.lineIdx}`] ?? null;
        const plan = planQtyMap[`${r.itemId}|${r.lineIdx}`] ?? null;
        if (fact !== null && plan !== null && Number(fact) >= Number(plan)) continue; // выполнено полностью
      }
      carriedKeys.add(`${r.stationKey}|${r.itemId}`);
    }
    // Item-level: только явно пропущенные (done=0, skip_reason)
    for (const r of itemLevelRows) {
      if (r.skipReason && !r.done) carriedKeys.add(`${r.stationKey}|${r.itemId}`);
    }

    // Имена позиций для carryover
    const prevItemIds = [...new Set(packLineRows.map(r => r.itemId))];
    const itemNameMap = {};
    if (prevItemIds.length > 0) {
      const iph = prevItemIds.map((_,i) => `$${i+1}`).join(',');
      const { rows: nameRows } = await pool.query(
        `SELECT item_id, name FROM items WHERE item_id IN (${iph})`, prevItemIds
      );
      for (const r of nameRows) itemNameMap[r.item_id] = r.name;
    }

    // Для каждой проблемной позиции включаем ВСЕ её pack-line строки со статусами
    for (const r of packLineRows) {
      const key = `${r.stationKey}|${r.itemId}`;
      if (!carriedKeys.has(key)) continue;
      let status;
      if (r.skipReason) {
        status = r.done ? 'partial' : 'skipped';
      } else {
        status = r.done ? 'done' : 'pending';
      }
      const yesterdayFact = prevFactMap[`${r.stationKey}|${r.itemId}|${r.lineIdx}`] ?? null;
      const ld = planLineMap[`${r.itemId}|${r.lineIdx}`] || {};
      prevSkips.push({
        stationKey: r.stationKey, itemId: r.itemId, lineIdx: r.lineIdx,
        status, skipReason: r.skipReason, skipAt: r.skipAt, yesterdayFact,
        itemName: itemNameMap[r.itemId] || null,
        volume: ld.volume || null, packName: ld.packName || null, planQty: ld.qty ?? null,
      });
    }

    // Item-level переносы (позиции без pack lines)
    for (const r of itemLevelRows) {
      if (r.skipReason && !r.done) {
        prevSkips.push({ stationKey: r.stationKey, itemId: r.itemId, lineIdx: null, status: 'skipped', skipReason: r.skipReason, skipAt: r.skipAt, yesterdayFact: null });
      }
    }
  }

  // Если для смены нет времён начала станций — берём глобальные настройки
  let stationStartTimes = {};
  if (stationStartRows.length > 0) {
    for (const r of stationStartRows) stationStartTimes[r.station_key] = r.start_time;
  } else {
    const { rows: globalRows } = await pool.query('SELECT station_key, start_time FROM station_config');
    for (const r of globalRows) stationStartTimes[r.station_key] = r.start_time;
  }

  const doneBy = {};
  for (const r of empRows) {
    const key = `${r.station_key}-${r.item_id}`;
    if (!doneBy[key]) doneBy[key] = [];
    doneBy[key].push(r.employee_id);
  }

  const facts = {};
  for (const r of factRows) {
    facts[`${r.station_key}-${r.item_id}-pl-${r.line_idx}`] = r.value;
  }

  const itemPackLines = await buildItemPackLines(shiftRow.techcard_id, shiftRow.ud_techcard_id, date);

  return {
    date,
    techcardId: shiftRow.techcard_id || null,
    udTechcardId: shiftRow.ud_techcard_id || null,
    doneFlags, doneTimes, skipReasons, skipTimes, prevSkips,
    prevTechcardId, prevUdTechcardId,
    doneBy, facts, itemPackLines, stationStartTimes, assignments: {}
  };
}

async function buildItemPackLines(techcardId, udTechcardId, date) {
  const itemPackLines = {};

  async function loadLines(tcId) {
    if (!tcId) return;
    const { rows } = await pool.query(`
      SELECT item_id, volume, pack_name, destination, from_warehouse, qty, source
      FROM techcard_pack_lines WHERE techcard_id = $1 ORDER BY item_id, line_idx
    `, [tcId]);
    for (const r of rows) {
      if (!itemPackLines[r.item_id]) itemPackLines[r.item_id] = [];
      itemPackLines[r.item_id].push({
        volume: r.volume, packName: r.pack_name,
        destination: r.destination, fromWarehouse: r.from_warehouse, qty: r.qty,
        source: r.source || 'EE',
      });
    }
  }

  // EE первые, потом УД — чтобы в таблице шли в правильном порядке
  await loadLines(techcardId);
  await loadLines(udTechcardId);

  // Переопределения упаковки из самой смены (приоритет над техкартой)
  const { rows: plRows } = await pool.query(
    'SELECT item_id, lines_json FROM shift_pack_lines WHERE shift_date = $1', [date]
  );
  for (const r of plRows) itemPackLines[r.item_id] = JSON.parse(r.lines_json);

  return itemPackLines;
}

// ─── Запись смены ─────────────────────────────────────────────────────────────

const RE_FACT_KEY = /^(.+)-(\d+)-pl-(\d+)$/;

async function saveShift(date, shift) {
  const techcardId = shift.techcardId || null;
  const udTechcardId = shift.udTechcardId || null;

  await pool.withTransaction(async (client) => {
    await client.query(`
      INSERT INTO shifts(date, techcard_id, ud_techcard_id) VALUES($1, $2, $3)
      ON CONFLICT(date) DO UPDATE SET techcard_id = $2, ud_techcard_id = $3, updated_at = NOW()::text
    `, [date, techcardId, udTechcardId]);

    // Статусы выполнения + skip — UPSERT чтобы не затирать отметки других устройств
    const allKeys = new Set([
      ...Object.keys(shift.doneFlags || {}),
      ...Object.keys(shift.skipReasons || {}),
    ]);
    for (const compKey of allKeys) {
      const { stationKey, itemId } = splitCompKey(compKey);
      const done = !!(shift.doneFlags || {})[compKey];
      const doneAt = (shift.doneTimes || {})[compKey] || null;
      const skipReason = done ? null : ((shift.skipReasons || {})[compKey] || null);
      const skipAt = skipReason ? ((shift.skipTimes || {})[compKey] || null) : null;
      await client.query(
        `INSERT INTO shift_item_status(shift_date, station_key, item_id, done, done_at, skip_reason, skip_at)
         VALUES($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT(shift_date, station_key, item_id) DO UPDATE SET done=$4, done_at=$5, skip_reason=$6, skip_at=$7`,
        [date, stationKey, itemId, done ? 1 : 0, doneAt, skipReason, skipAt]
      );
    }

    // Времена начала станций для этой смены
    await client.query('DELETE FROM shift_station_start WHERE shift_date = $1', [date]);
    for (const [stationKey, startTime] of Object.entries(shift.stationStartTimes || {})) {
      await client.query(
        'INSERT INTO shift_station_start(shift_date, station_key, start_time) VALUES($1,$2,$3)',
        [date, stationKey, startTime]
      );
    }

    // Сотрудники — обновляем только по конкретным позициям (не удаляем всю смену)
    for (const [compKey, empIds] of Object.entries(shift.doneBy || {})) {
      const { stationKey, itemId } = splitCompKey(compKey);
      // Гарантируем наличие строки статуса
      await client.query(
        `INSERT INTO shift_item_status(shift_date, station_key, item_id, done)
         VALUES($1,$2,$3,$4) ON CONFLICT(shift_date, station_key, item_id) DO NOTHING`,
        [date, stationKey, itemId, (shift.doneFlags || {})[`${stationKey}-${itemId}`] ? 1 : 0]
      );
      // Заменяем сотрудников только для этой позиции
      await client.query(
        'DELETE FROM shift_item_employees WHERE shift_date=$1 AND station_key=$2 AND item_id=$3',
        [date, stationKey, itemId]
      );
      if (Array.isArray(empIds) && empIds.length > 0) {
        for (const empId of empIds) {
          await client.query(
            `INSERT INTO shift_item_employees(shift_date, station_key, item_id, employee_id)
             VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
            [date, stationKey, itemId, empId]
          );
        }
      }
    }

    // Фактические количества — UPSERT по позиции
    for (const [key, value] of Object.entries(shift.facts || {})) {
      const m = key.match(RE_FACT_KEY);
      if (!m) continue;
      const [, stationKey, itemId, lineIdx] = m;
      await client.query(
        `INSERT INTO shift_facts_n(shift_date, station_key, item_id, line_idx, value)
         VALUES($1,$2,$3,$4,$5)
         ON CONFLICT(shift_date, station_key, item_id, line_idx) DO UPDATE SET value=$5`,
        [date, stationKey, itemId, Number(lineIdx), value == null ? null : Number(value)]
      );
    }

    // shift_pack_lines — manual overrides; no UI for this yet, skip saving
  });
}

function getPrevDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function splitCompKey(compKey) {
  const sep = compKey.lastIndexOf('-');
  return { stationKey: compKey.slice(0, sep), itemId: compKey.slice(sep + 1) };
}


// Определяем плановую дату для каждого факта и пишем в Google Sheets
async function syncFactsToSheet(date, factsMap) {
  // Получаем техкарты текущей и предыдущей смены
  const { rows: [cur] } = await pool.query(
    'SELECT techcard_id, ud_techcard_id FROM shifts WHERE date=$1', [date]);
  if (!cur) return;

  // Для каждого факта: найти технкарту содержащую эту строку и дату смены с ней
  // Берём все техкарты всех смен (до текущей даты включительно) с датами
  const { rows: allShiftTcs } = await pool.query(
    `SELECT s.date, tpl.item_id, tpl.line_idx, tpl.volume, tpl.pack_name
     FROM shifts s
     JOIN techcard_pack_lines tpl ON tpl.techcard_id = s.techcard_id
     WHERE s.date <= $1
     ORDER BY s.date DESC`, [date]);

  // Индекс: "item_id-line_idx" → [{date, volume, pack_name}, ...] — от новых к старым
  const tcByItem = {};
  for (const r of allShiftTcs) {
    const k = `${r.item_id}-${r.line_idx}`;
    if (!tcByItem[k]) tcByItem[k] = [];
    tcByItem[k].push(r);
  }

  // Для каждого факта определяем плановую дату и собираем обновления
  const updates = [];
  for (const [key, value] of Object.entries(factsMap)) {
    if (value == null) continue;
    const m = key.match(/^(.+)-(\d+)-pl-(\d+)$/);
    if (!m) continue;
    const itemId = m[2];
    const lineIdx = Number(m[3]);
    const lookupKey = `${itemId}-${lineIdx}`;

    const candidates = tcByItem[lookupKey];
    if (!candidates || !candidates.length) continue;

    // Позиция считается выполненной только если done=1 И факт >= план
    const { rows: doneRows } = await pool.query(
      `SELECT sis.shift_date
       FROM shift_item_status sis
       WHERE sis.item_id=$1 AND sis.done=1
       AND sis.shift_date IN (${candidates.map((_,i)=>`$${i+2}`).join(',')})`,
      [itemId, ...candidates.map(c=>c.date)]);

    const doneDates = new Set();
    for (const dr of doneRows) {
      const candidate = candidates.find(c => c.date === dr.shift_date);
      if (!candidate) continue;
      const planQty = Number(candidate.qty || 0);
      if (planQty === 0) { doneDates.add(dr.shift_date); continue; }
      const { rows: factRows } = await pool.query(
        `SELECT COALESCE(SUM(value), 0) AS total FROM shift_facts_n
         WHERE item_id=$1 AND line_idx=$2 AND shift_date=$3`,
        [itemId, lineIdx, dr.shift_date]);
      if (Number(factRows[0]?.total || 0) >= planQty) doneDates.add(dr.shift_date);
    }

    // planDate = самая ранняя невыполненная дата после последней полностью выполненной
    // Это корректно обрабатывает случай когда позиция одновременно в нескольких техкартах
    const lastFullyDone = candidates.find(c => doneDates.has(c.date)); // DESC → самая новая выполненная
    const notDone = lastFullyDone
      ? candidates.filter(c => c.date > lastFullyDone.date && !doneDates.has(c.date))
      : candidates.filter(c => !doneDates.has(c.date));
    const planEntry = notDone.length
      ? notDone.reduce((a, b) => a.date < b.date ? a : b) // самая ранняя невыполненная
      : candidates[0];

    const packLine = planEntry;
    const planDate = planEntry.date;

    // Суммируем факты по всем сменам от planDate до date (перенос может быть несколько дней)
    const stationKey = m[1];
    const { rows: sumRows } = await pool.query(
      `SELECT COALESCE(SUM(value), 0) AS total FROM shift_facts_n
       WHERE item_id=$1 AND line_idx=$2 AND shift_date >= $3 AND shift_date <= $4`,
      [itemId, lineIdx, planDate, date]);
    const totalFact = Number(sumRows[0]?.total || 0);

    updates.push({
      itemId,
      volume: packLine.volume,
      packName: packLine.pack_name,
      planDate,
      factValue: totalFact,
    });
  }

  if (updates.length) {
    await writeFacts(updates);
    if (writeFacts2) await writeFacts2(updates);
  }
}

// ─── Маршруты ─────────────────────────────────────────────────────────────────

router.get('/index', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT date FROM shifts ORDER BY date DESC');
    res.json({ dates: rows.map(r => r.date) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { rows: shifts } = await pool.query(`
      SELECT s.date, s.techcard_id, s.ud_techcard_id, t.name AS techcard_name
      FROM shifts s LEFT JOIN techcards t ON t.id = s.techcard_id
      ORDER BY s.date DESC
    `);
    const summary = await Promise.all(shifts.map(async row => {
      const tcIds = [row.techcard_id, row.ud_techcard_id].filter(Boolean);
      const placeholders = tcIds.map((_,i) => `$${i+1}`).join(',');
      const [totalRes, doneRes] = await Promise.all([
        tcIds.length > 0
          ? pool.query(
              `SELECT COUNT(DISTINCT item_id) AS cnt FROM techcard_pack_lines WHERE techcard_id IN (${placeholders})`,
              tcIds
            )
          : Promise.resolve({ rows: [{ cnt: 0 }] }),
        pool.query(
          "SELECT COUNT(DISTINCT item_id) AS cnt FROM shift_item_status WHERE shift_date = $1 AND done = 1 AND station_key NOT LIKE '%-pl'",
          [row.date]
        ),
      ]);
      return {
        date:         row.date,
        techcardId:   row.techcard_id,
        techcardName: row.techcard_name,
        totalItems:   Number(totalRes.rows[0]?.cnt || 0),
        doneItems:    Number(doneRes.rows[0]?.cnt  || 0),
      };
    }));
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const shift = await buildShift(req.params.date);
    res.json({ shift });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:date', async (req, res) => {
  const { date } = req.params;
  const { shift, clientId } = req.body;
  if (!shift) return res.status(400).json({ error: 'shift required' });

  try {
    await saveShift(date, shift);
    const wss = req.app.get('wss');
    if (wss) {
      const msg = JSON.stringify({ type: 'shift_updated', date, shift, clientId: clientId || null });
      wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
    }
    res.json({ ok: true });
    // Асинхронно синхронизируем факты в Google Sheets
    const factsKeys = shift.facts ? Object.keys(shift.facts) : [];
    if (writeFacts && factsKeys.length > 0) {
      syncFactsToSheet(date, shift.facts).catch(e => console.error('[facts-sheets]', e.message));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
module.exports.syncFactsToSheet = syncFactsToSheet;

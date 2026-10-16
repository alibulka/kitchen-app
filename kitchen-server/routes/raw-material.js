// Учёт остатков сырья мясного цеха
// Маршруты:
//   GET  /api/raw-material/issuance/:date        — выданное сырьё за смену
//   POST /api/raw-material/issuance/:date        — сохранить данные из файла выдачи
//   GET  /api/raw-material/waste/:date           — отходы за смену
//   POST /api/raw-material/waste/:date           — сохранить отходы (мясник)
//   GET  /api/raw-material/carryover/:date       — переходящие остатки, входящие на эту дату
//   POST /api/raw-material/carryover/:date       — сохранить переходящие остатки (закрытие дня)
//   DELETE /api/raw-material/issuance/:date      — удалить выдачу за дату

const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

// ── Выдача ────────────────────────────────────────────────────────────────────

router.get('/issuance/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ingredient_id, ing_name, category, source, mass_g
       FROM shift_raw_issuance WHERE shift_date=$1 ORDER BY source, ing_name`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/issuance/:date', async (req, res) => {
  // body: { items: [{ingredient_id, ing_name, category, source, mass_g}] }
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items required' });
  try {
    await pool.withTransaction(async (client) => {
      await client.query('DELETE FROM shift_raw_issuance WHERE shift_date=$1', [req.params.date]);
      for (const it of items) {
        await client.query(
          `INSERT INTO shift_raw_issuance(shift_date, ingredient_id, ing_name, category, source, mass_g)
           VALUES($1,$2,$3,$4,$5,$6)`,
          [req.params.date, it.ingredient_id, it.ing_name, it.category || '', it.source || '', it.mass_g || 0]
        );
      }
    });
    res.json({ ok: true, saved: items.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/issuance/:date', async (req, res) => {
  try {
    await pool.query('DELETE FROM shift_raw_issuance WHERE shift_date=$1', [req.params.date]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Отходы ────────────────────────────────────────────────────────────────────

router.get('/waste/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ingredient_id, ing_name, weight_kg, entered_at
       FROM shift_raw_waste WHERE shift_date=$1 ORDER BY ing_name`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/waste/:date', async (req, res) => {
  // body: { items: [{ingredient_id, ing_name, weight_kg}] }
  // Каждый вызов обновляет/заменяет запись по ingredient_id для этой даты.
  // Передать weight_kg=0 — сбросить запись.
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items required' });
  const now = new Date().toISOString();
  try {
    await pool.withTransaction(async (client) => {
      for (const it of items) {
        if ((it.weight_kg || 0) === 0) {
          await client.query(
            'DELETE FROM shift_raw_waste WHERE shift_date=$1 AND ingredient_id=$2',
            [req.params.date, it.ingredient_id]
          );
        } else {
          await client.query(
            `INSERT INTO shift_raw_waste(shift_date, ingredient_id, ing_name, weight_kg, entered_at)
             VALUES($1,$2,$3,$4,$5)
             ON CONFLICT(shift_date, ingredient_id) DO UPDATE
             SET ing_name=$3, weight_kg=$4, entered_at=$5`,
            [req.params.date, it.ingredient_id, it.ing_name, it.weight_kg, now]
          );
        }
      }
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Переходящие остатки ────────────────────────────────────────────────────────

router.get('/carryover/:date', async (req, res) => {
  // Возвращает переходящие остатки, входящие НА эту дату (to_date = date)
  try {
    const { rows } = await pool.query(
      `SELECT from_date, ingredient_id, ing_name, weight_kg
       FROM raw_carryover WHERE to_date=$1 ORDER BY ing_name`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/carryover/:date', async (req, res) => {
  // body: { items: [{ingredient_id, ing_name, weight_kg, to_date}] }
  // Вызывается при закрытии дня — записывает переходящие остатки из from_date на to_date
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items required' });
  const fromDate = req.params.date;
  try {
    await pool.withTransaction(async (client) => {
      await client.query('DELETE FROM raw_carryover WHERE from_date=$1', [fromDate]);
      for (const it of items) {
        if ((it.weight_kg || 0) <= 0) continue;
        await client.query(
          `INSERT INTO raw_carryover(from_date, to_date, ingredient_id, ing_name, weight_kg)
           VALUES($1,$2,$3,$4,$5)
           ON CONFLICT(from_date, ingredient_id) DO UPDATE
           SET to_date=$2, ing_name=$4, weight_kg=$5`,
          [fromDate, it.to_date, it.ingredient_id, it.ing_name, it.weight_kg]
        );
      }
    });
    res.json({ ok: true, saved: items.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Чтение выдачи из Google Sheets ───────────────────────────────────────────

router.get('/issuance-sheets/debug-rows', async (req, res) => {
  try {
    const { getAccessToken, fetchWithTimeout } = require('../lib/sheets-utils');
    const sheetName = req.query.sheet || 'х-2 РЕЗЕРВ 1-й этаж';
    const SHEET_ID = '1pLsHYBpGc3CZHurK5bL042FtHtWL6QXofGIj4Fo8bmQ';
    const token = await getAccessToken();
    const range = encodeURIComponent(`'${sheetName}'`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`;
    const resp = await fetchWithTimeout(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    const rows = (data.values || []).slice(0, 30);
    res.json({ rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/issuance-sheets/names', async (req, res) => {
  try {
    const { getIssuanceSheetNames } = require('../lib/meat-issuance-sheet');
    const names = await getIssuanceSheetNames();
    res.json({ names });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/issuance-sheets/:date', async (req, res) => {
  // body: { sheetName? } — имя листа, если не указано — первый лист
  const { sheetName } = req.body || {};
  try {
    const { readIssuanceFromSheets } = require('../lib/meat-issuance-sheet');
    const items = await readIssuanceFromSheets(sheetName || null);
    if (!items.length) return res.status(422).json({ error: 'Не найдено позиций в листе. Проверьте структуру таблицы.' });
    // Сохраняем в БД
    await pool.withTransaction(async (client) => {
      await client.query('DELETE FROM shift_raw_issuance_sheets WHERE shift_date=$1', [req.params.date]);
      for (const it of items) {
        await client.query(
          `INSERT INTO shift_raw_issuance_sheets(shift_date, ingredient_id, ing_name, from_manager, by_fact)
           VALUES($1,$2,$3,$4,$5)
           ON CONFLICT(shift_date, ingredient_id) DO UPDATE
           SET ing_name=$3, from_manager=$4, by_fact=$5, loaded_at=NOW()::text`,
          [req.params.date, it.ingredient_id, it.ing_name, it.from_manager, it.by_fact]
        );
      }
    });
    res.json({ ok: true, loaded: items.length, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/issuance-sheets/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ingredient_id, ing_name, from_manager, by_fact, loaded_at
       FROM shift_raw_issuance_sheets WHERE shift_date=$1 ORDER BY ing_name`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Фактические остатки (менеджер) ───────────────────────────────────────────

router.get('/leftover/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ingredient_id, ing_name, weight_kg, entered_at
       FROM shift_raw_leftover WHERE shift_date=$1 ORDER BY ing_name`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/leftover/:date', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items required' });
  const now = new Date().toISOString();
  try {
    await pool.withTransaction(async (client) => {
      for (const it of items) {
        if ((it.weight_kg || 0) === 0) {
          await client.query('DELETE FROM shift_raw_leftover WHERE shift_date=$1 AND ingredient_id=$2', [req.params.date, it.ingredient_id]);
        } else {
          await client.query(
            `INSERT INTO shift_raw_leftover(shift_date, ingredient_id, ing_name, weight_kg, entered_at)
             VALUES($1,$2,$3,$4,$5)
             ON CONFLICT(shift_date, ingredient_id) DO UPDATE
             SET ing_name=$3, weight_kg=$4, entered_at=$5`,
            [req.params.date, it.ingredient_id, it.ing_name, it.weight_kg, now]
          );
        }
      }
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Списания ──────────────────────────────────────────────────────────────────

router.get('/writeoff/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, ingredient_id, ing_name, weight_kg, comment, entered_at
       FROM shift_raw_writeoff WHERE shift_date=$1 ORDER BY entered_at DESC`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/writeoff/:date', async (req, res) => {
  // body: { ingredient_id, ing_name, weight_kg, comment }
  const { ingredient_id, ing_name, weight_kg, comment } = req.body;
  if (!ingredient_id || !weight_kg) return res.status(400).json({ error: 'ingredient_id и weight_kg обязательны' });
  const now = new Date().toISOString();
  try {
    const { rows } = await pool.query(
      `INSERT INTO shift_raw_writeoff(shift_date, ingredient_id, ing_name, weight_kg, comment, entered_at)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      [req.params.date, ingredient_id, ing_name || '', weight_kg, comment || '', now]
    );
    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/writeoff/:date/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM shift_raw_writeoff WHERE shift_date=$1 AND id=$2', [req.params.date, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Допзапросы сырья ──────────────────────────────────────────────────────────

router.get('/extra-request/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, ingredient_id, ing_name, weight_kg, status, created_at
       FROM meat_extra_requests WHERE shift_date=$1 ORDER BY created_at DESC`,
      [req.params.date]
    );
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/extra-request/:date', async (req, res) => {
  const { ingredient_id, ing_name, weight_kg } = req.body;
  if (!ingredient_id || !weight_kg) return res.status(400).json({ error: 'ingredient_id и weight_kg обязательны' });
  const now = new Date().toISOString();
  try {
    const { rows } = await pool.query(
      `INSERT INTO meat_extra_requests(shift_date, ingredient_id, ing_name, weight_kg, created_at)
       VALUES($1,$2,$3,$4,$5) RETURNING id`,
      [req.params.date, ingredient_id, ing_name || '', weight_kg, now]
    );
    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/extra-request/:date/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM meat_extra_requests WHERE shift_date=$1 AND id=$2', [req.params.date, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Причины нехватки по позициям ──────────────────────────────────────────────

router.get('/shortage/:date', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT station_key, item_id, reason, detail_json, created_at
       FROM shift_item_shortage WHERE shift_date=$1`,
      [req.params.date]
    );
    rows.forEach(r => { try { r.detail = JSON.parse(r.detail_json); } catch { r.detail = {}; } });
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/shortage/:date', async (req, res) => {
  // body: { station_key, item_id, reason, detail }
  const { station_key, item_id, reason, detail } = req.body;
  if (!station_key || !item_id || !reason) return res.status(400).json({ error: 'station_key, item_id, reason обязательны' });
  const now = new Date().toISOString();
  try {
    await pool.query(
      `INSERT INTO shift_item_shortage(shift_date, station_key, item_id, reason, detail_json, created_at)
       VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT(shift_date, station_key, item_id) DO UPDATE
       SET reason=$4, detail_json=$5, created_at=$6`,
      [req.params.date, station_key, item_id, reason, JSON.stringify(detail || {}), now]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/shortage/:date/:station/:item', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM shift_item_shortage WHERE shift_date=$1 AND station_key=$2 AND item_id=$3',
      [req.params.date, req.params.station, req.params.item]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Сводка по мясному цеху за дату ───────────────────────────────────────────

router.get('/summary/:date', async (req, res) => {
  try {
    const [issueR, issSheetR, wasteR, leftR, writeoffR, extraR, shortageR] = await Promise.all([
      pool.query('SELECT * FROM shift_raw_issuance WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM shift_raw_issuance_sheets WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM shift_raw_waste WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM shift_raw_leftover WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM shift_raw_writeoff WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM meat_extra_requests WHERE shift_date=$1', [req.params.date]),
      pool.query('SELECT * FROM shift_item_shortage WHERE shift_date=$1', [req.params.date]),
    ]);
    const shortages = shortageR.rows.map(r => {
      try { r.detail = JSON.parse(r.detail_json); } catch { r.detail = {}; }
      return r;
    });
    res.json({
      issuance: issueR.rows,
      issuance_sheets: issSheetR.rows,
      waste: wasteR.rows,
      leftover: leftR.rows,
      writeoff: writeoffR.rows,
      extra_requests: extraR.rows,
      shortages,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

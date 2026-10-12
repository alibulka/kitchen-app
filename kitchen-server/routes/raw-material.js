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

module.exports = router;

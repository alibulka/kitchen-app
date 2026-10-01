const express = require('express');
const { pool } = require('../db');

const router = express.Router();
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isCalendarDate(value) {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.get('x-user-role') !== role) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    next();
  };
}

router.get('/', async (req, res) => {
  const role = req.get('x-user-role');
  if (role !== 'manager' && role !== 'technologist') {
    return res.status(403).json({ error: 'Недостаточно прав' });
  }
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM technologist_tasks
      ORDER BY
        planned_date ASC,
        CASE status WHEN 'new' THEN 0 WHEN 'completed' THEN 1 ELSE 2 END,
        id DESC
    `);
    res.json({ tasks: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireRole('manager'), async (req, res) => {
  const title = String(req.body?.title || '').trim();
  const plannedDate = String(req.body?.planned_date || '').trim();
  const description = String(req.body?.description || '').trim();
  if (!title) return res.status(400).json({ error: 'Укажите заголовок задания' });
  if (!isCalendarDate(plannedDate)) return res.status(400).json({ error: 'Укажите корректную плановую дату выполнения' });
  if (!description) return res.status(400).json({ error: 'Укажите описание задания' });
  try {
    const { rows: [created] } = await pool.query(`
      INSERT INTO technologist_tasks(title, planned_date, description)
      VALUES($1, $2, $3)
      RETURNING id
    `, [title, plannedDate, description]);
    const { rows: [task] } = await pool.query(
      'SELECT * FROM technologist_tasks WHERE id=$1',
      [created.id]
    );
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireRole('manager'), async (req, res) => {
  try {
    const deletion = await pool.query(
      `DELETE FROM technologist_tasks WHERE id=$1 AND status='new'`,
      [req.params.id]
    );
    if (!deletion.rowCount) {
      return res.status(409).json({ error: 'Можно удалить только новое задание' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/complete', requireRole('technologist'), async (req, res) => {
  const result = String(req.body?.result || '').trim();
  if (!result) return res.status(400).json({ error: 'Укажите результат выполнения' });
  try {
    const update = await pool.query(`
      UPDATE technologist_tasks
      SET status='completed',
          result=$1,
          actual_completed_at=NOW()::text,
          cancel_reason=NULL,
          cancelled_at=NULL,
          updated_at=NOW()::text
      WHERE id=$2 AND status='new'
    `, [result, req.params.id]);
    if (!update.rowCount) return res.status(409).json({ error: 'Задание уже завершено или отменено' });
    const { rows: [task] } = await pool.query(
      'SELECT * FROM technologist_tasks WHERE id=$1',
      [req.params.id]
    );
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/cancel', requireRole('technologist'), async (req, res) => {
  const reason = String(req.body?.reason || '').trim();
  if (!reason) return res.status(400).json({ error: 'Укажите причину отмены' });
  try {
    const update = await pool.query(`
      UPDATE technologist_tasks
      SET status='cancelled',
          cancel_reason=$1,
          cancelled_at=NOW()::text,
          result=NULL,
          actual_completed_at=NULL,
          updated_at=NOW()::text
      WHERE id=$2 AND status='new'
    `, [reason, req.params.id]);
    if (!update.rowCount) return res.status(409).json({ error: 'Задание уже завершено или отменено' });
    const { rows: [task] } = await pool.query(
      'SELECT * FROM technologist_tasks WHERE id=$1',
      [req.params.id]
    );
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
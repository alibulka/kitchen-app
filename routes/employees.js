const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/employees
router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT id, name, shop FROM employees WHERE active = 1 ORDER BY shop, name'
  ).all();
  res.json({ employees: rows });
});

// POST /api/employees — добавить одного сотрудника
router.post('/', (req, res) => {
  const { id, name, shop } = req.body;
  if (!name || !shop) return res.status(400).json({ error: 'name and shop required' });
  if (!id)            return res.status(400).json({ error: 'id required' });

  db.prepare(`
    INSERT INTO employees(id, name, shop, active, updated_at)
    VALUES(?, ?, ?, 1, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, shop = excluded.shop,
      active = 1, updated_at = excluded.updated_at
  `).run(id, name.trim(), shop.trim());

  res.json({ ok: true });
});

// DELETE /api/employees/:id — деактивировать (не удалять физически,
// чтобы сохранить историческую привязку в shift_item_employees)
router.delete('/:id', (req, res) => {
  db.prepare(
    'UPDATE employees SET active = 0, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

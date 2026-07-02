const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, shop FROM employees WHERE active = 1 ORDER BY shop, name'
    );
    res.json({ employees: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, name, shop } = req.body;
  if (!name || !shop) return res.status(400).json({ error: 'name and shop required' });
  if (!id)            return res.status(400).json({ error: 'id required' });

  try {
    await pool.query(`
      INSERT INTO employees(id, name, shop, active, updated_at)
      VALUES($1, $2, $3, 1, NOW()::text)
      ON CONFLICT(id) DO UPDATE SET
        name = $2, shop = $3, active = 1, updated_at = NOW()::text
    `, [id, name.trim(), shop.trim()]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      "UPDATE employees SET active = 0, updated_at = NOW()::text WHERE id = $1",
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

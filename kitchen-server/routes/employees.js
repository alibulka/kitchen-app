const express = require('express');
const router = express.Router();
const { pool } = require('../db');

function parseShops(row) {
  if (row.shops) {
    try { return JSON.parse(row.shops); } catch (_) {}
  }
  return row.shop ? [row.shop] : [];
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, shop, shops FROM employees WHERE active = 1 ORDER BY name'
    );
    res.json({ employees: rows.map(r => ({ id: r.id, name: r.name, shop: r.shop, shops: parseShops(r) })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, name, shops } = req.body;
  if (!name || !id) return res.status(400).json({ error: 'id and name required' });
  const shopsArr = Array.isArray(shops) && shops.length > 0 ? shops : [];
  const shopLegacy = shopsArr[0] || '';
  try {
    await pool.query(`
      INSERT INTO employees(id, name, shop, shops, active, updated_at)
      VALUES($1, $2, $3, $4, 1, NOW()::text)
      ON CONFLICT(id) DO UPDATE SET
        name = $2, shop = $3, shops = $4, active = 1, updated_at = NOW()::text
    `, [id, name.trim(), shopLegacy, JSON.stringify(shopsArr)]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, shops } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const shopsArr = Array.isArray(shops) && shops.length > 0 ? shops : [];
  const shopLegacy = shopsArr[0] || '';
  try {
    await pool.query(
      "UPDATE employees SET name=$1, shop=$2, shops=$3, updated_at=NOW()::text WHERE id=$4",
      [name.trim(), shopLegacy, JSON.stringify(shopsArr), req.params.id]
    );
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

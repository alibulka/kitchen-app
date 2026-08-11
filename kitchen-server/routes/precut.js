const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT item_id FROM precut_item_ids ORDER BY item_id');
    res.json({ ids: rows.map(r => r.item_id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be array' });
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM precut_item_ids');
    if (ids.length > 0) {
      const values = ids.map((id, i) => `($${i + 1})`).join(',');
      await pool.query(`INSERT INTO precut_item_ids(item_id) VALUES ${values}`, ids);
    }
    await pool.query('COMMIT');
    res.json({ ok: true, count: ids.length });
  } catch (e) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

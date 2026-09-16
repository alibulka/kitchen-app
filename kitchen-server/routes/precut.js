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
  // Валидация: только целые числа, без дублей
  const clean = [...new Set(ids.map(Number))];
  if (clean.some(n => !Number.isInteger(n))) {
    return res.status(400).json({ error: 'ids must be integers' });
  }
  try {
    // Одна настоящая транзакция на одном соединении: при ошибке INSERT
    // старый список останется нетронутым (раньше DELETE мог закоммититься отдельно)
    await pool.withTransaction(async (client) => {
      await client.query('DELETE FROM precut_item_ids');
      if (clean.length > 0) {
        const values = clean.map((_, i) => `($${i + 1})`).join(',');
        await client.query(`INSERT INTO precut_item_ids(item_id) VALUES ${values}`, clean);
      }
    });
    res.json({ ok: true, count: clean.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

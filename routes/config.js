const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/config/stations — глобальные времена начала по станциям
router.get('/stations', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT station_key, start_time FROM station_config');
    const config = {};
    for (const r of rows) config[r.station_key] = r.start_time;
    res.json({ config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/config/stations — обновить время начала для одной или нескольких станций
// body: { updates: { [station_key]: 'HH:MM' } }
router.post('/stations', async (req, res) => {
  const { updates } = req.body;
  if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'updates required' });
  try {
    for (const [key, time] of Object.entries(updates)) {
      await pool.query(
        `INSERT INTO station_config(station_key, start_time) VALUES($1,$2)
         ON CONFLICT(station_key) DO UPDATE SET start_time=$2`,
        [key, time]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

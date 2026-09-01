const express = require('express');
const router = express.Router();
const { fetchTasks } = require('../lib/prorabotki-sheets');

// Список заданий из Google Sheet
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await fetchTasks();
    res.json({ tasks });
  } catch (err) {
    console.error('[prorabotki] fetchTasks error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

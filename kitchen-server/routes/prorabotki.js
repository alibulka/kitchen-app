const express = require('express');
const { loadTasks } = require('../lib/prorabotki-sheets');
const { pool } = require('../db');
const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json({ tasks: await loadTasks(pool) });
  } catch (error) {
    const status = error.response?.status;
    console.error('[prorabotki] reading failed', status || error.code || 'unknown');
    if (/^(Повторяющийся ID|Не удалось однозначно|Таблица изменилась|Старый акт)/.test(error.message)) {
      return res.status(409).json({ error: error.message });
    }
    res.status(502).json({ error: status === 403
      ? 'Нет доступа к Google Таблице проработок'
      : 'Не удалось загрузить задания проработки из Google Таблицы' });
  }
});

// Loading tasks must never mutate the source spreadsheet.
for (const action of ['import', 'result', 'reset']) {
  router.post(`/${action}`, (_req, res) => {
    res.status(501).json({ ok: false, error: 'Включено только чтение заданий; запись в таблицу не подключена' });
  });
}

module.exports = router;
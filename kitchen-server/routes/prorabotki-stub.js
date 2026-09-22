// Заглушка для окружений без Google Sheets интеграции.
// На проде с интеграцией этот файл заменяется полной версией routes/prorabotki.js
// (не коммитится — содержит credentials).
const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => res.json({ tasks: [] }));
router.post('/import', (_req, res) => res.json({ ok: false, error: 'Google Sheets integration not configured' }));
router.post('/result', (_req, res) => res.json({ ok: false, error: 'Google Sheets integration not configured' }));
router.post('/reset', (_req, res) => res.json({ ok: false, error: 'Google Sheets integration not configured' }));

module.exports = router;

require('dotenv').config();
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { pool, initDb } = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.set('wss', wss);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((req, _res, next) => { console.log(new Date().toISOString(), req.method, req.path); next(); });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ping', (_req, res) => res.json({ pong: Date.now() }));
app.use('/api/shifts',    require('./routes/shifts'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/techcards', require('./routes/techcards'));
app.use('/api/config',    require('./routes/config'));
app.use('/api/precut',    require('./routes/precut'));
app.use('/api/quality',  require('./routes/quality'));
app.use('/api/acts',     require('./routes/acts'));
try { app.use('/api/prorabotki', require('./routes/prorabotki')); } catch {}
const objectStorage = require('./lib/objectStorage');
app.get('/uploads/:filename', async (req, res) => {
  const filename = path.basename(req.params.filename);
  try {
    const ok = await objectStorage.streamObject(filename, res);
    if (ok) return;
  } catch (err) {
    console.error('Object storage error:', err.message);
  }
  const localPath = path.join(__dirname, 'uploads', filename);
  if (fs.existsSync(localPath)) return res.sendFile(localPath);
  res.status(404).json({ error: 'Файл не найден' });
});

app.get('/api/shops', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM shops ORDER BY sort_order');
    res.json({ shops: rows.map(r => r.name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});

const PORT = process.env.PORT || 3000;
server.keepAliveTimeout = 5000;

// Ночная синхронизация фактов в Google Sheets в 23:50
function scheduleNightlySync() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(23, 50, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;
  setTimeout(async () => {
    const today = new Date().toISOString().slice(0, 10);
    console.log(`[nightly-sync] Запуск синхронизации фактов за ${today}`);
    try {
      const { syncFactsToSheet } = require('./routes/shifts');
      if (syncFactsToSheet) {
        const { rows: [shift] } = await pool.query(
          'SELECT date FROM shifts WHERE date=$1', [today]);
        if (shift) {
          const res = await pool.query(
            'SELECT station_key, item_id, line_idx, value FROM shift_facts_n WHERE shift_date=$1', [today]);
          const facts = {};
          for (const r of res.rows)
            facts[`${r.station_key}-${r.item_id}-pl-${r.line_idx}`] = r.value;
          await syncFactsToSheet(today, facts);
          console.log(`[nightly-sync] Завершено`);
        } else {
          console.log(`[nightly-sync] Смена за ${today} не найдена`);
        }
      }
    } catch (e) {
      console.error('[nightly-sync] Ошибка:', e.message);
    }
    scheduleNightlySync(); // планируем следующую ночь
  }, delay);
  console.log(`[nightly-sync] Следующий запуск в 23:50 (через ${Math.round(delay/60000)} мин)`);
}

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Kitchen server running on http://localhost:${PORT}`);
      scheduleNightlySync();
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

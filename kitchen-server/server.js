require('dotenv').config();
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createCompressedIndexHandler } = require('./lib/compressed-index');

const { pool, initDb } = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.set('wss', wss);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((req, _res, next) => { console.log(new Date().toISOString(), req.method, req.path); next(); });
app.get(['/', '/index.html'], createCompressedIndexHandler(path.join(__dirname, 'public', 'index.html')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ping', (_req, res) => res.json({ pong: Date.now() }));
app.use('/api/shifts',    require('./routes/shifts'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/techcards', require('./routes/techcards'));
app.use('/api/config',    require('./routes/config'));
app.use('/api/precut',    require('./routes/precut'));
app.use('/api/quality',  require('./routes/quality'));
app.use('/api/acts',     require('./routes/acts'));
app.use('/api/prorabotki', require('./routes/prorabotki'));
app.use('/api/technologist-tasks', require('./routes/technologist-tasks'));
app.use('/api/raw-material',      require('./routes/raw-material'));
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

function attachWebSocketUpgrade(httpServer) {
  httpServer.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  });
}
attachWebSocketUpgrade(server);

const PORT = process.env.PORT || 3000;
server.keepAliveTimeout = 5000;

// Запись в "Передача с кухни на СКЛАД" в 12:00 следующего дня после дня работ
let appendToKitchenTransfer;
try { ({ appendToKitchenTransfer } = require('./lib/kitchen-transfer-sheet')); } catch {}

function scheduleNoonTransferSync() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(12, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;
  setTimeout(async () => {
    // Записываем данные за вчера
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().slice(0, 10);
    console.log(`[noon-transfer] Запуск записи передачи за ${date}`);
    try {
      if (appendToKitchenTransfer && process.env.GOOGLE_CREDENTIALS_JSON) {
        // Берём актуальные данные из БД
        const { rows: storageRows } = await pool.query(
          'SELECT item_id, to_kitchen, label_date, to_kitchen_excess, label_date_excess FROM shift_dh_storage WHERE shift_date=$1',
          [date]
        );
        if (storageRows.length > 0) {
          // Получаем названия позиций
          const { rows: shiftRow } = await pool.query('SELECT techcard_id, extra_json FROM shifts WHERE date=$1', [date]);
          const nameMap = {};
          if (shiftRow.length > 0) {
            const { rows: tcRows } = await pool.query('SELECT items_json FROM techcards WHERE id=$1', [shiftRow[0].techcard_id]);
            if (tcRows.length > 0) {
              try {
                const items = JSON.parse(tcRows[0].items_json || '{}');
                Object.entries(items).forEach(([id, packs]) => {
                  if (packs && packs[0] && packs[0].name) nameMap[String(id)] = packs[0].name;
                });
              } catch {}
            }
            // Добавляем ручные позиции
            try {
              const extra = JSON.parse(shiftRow[0].extra_json || '{}');
              (extra.manualDhItems || []).forEach(m => {
                const id = String(m.id || m.uid);
                if (m.name) nameMap[id] = m.name;
              });
            } catch {}
          }
          const items = storageRows.map(r => ({
            item_id: r.item_id,
            name: nameMap[String(r.item_id)] || String(r.item_id),
            to_kitchen: r.to_kitchen,
            label_date: r.label_date,
            to_kitchen_excess: r.to_kitchen_excess,
            label_date_excess: r.label_date_excess,
          }));
          const res = await appendToKitchenTransfer(items, date);
          console.log(`[noon-transfer] Завершено: appended=${res.appended}, updated=${res.updated}`);
        } else {
          console.log(`[noon-transfer] Нет данных распределения за ${date}`);
        }
      }
    } catch (e) {
      console.error('[noon-transfer] Ошибка:', e.message);
    }
    scheduleNoonTransferSync();
  }, delay);
  console.log(`[noon-transfer] Следующий запуск в 12:00 (через ${Math.round(delay / 60000)} мин)`);
}

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
      scheduleNoonTransferSync();
      const fallbackPort = Number(process.env.DEV_FALLBACK_PORT);
      if (Number.isInteger(fallbackPort) && fallbackPort > 0 && fallbackPort !== Number(PORT)) {
        const fallbackServer = http.createServer(app);
        attachWebSocketUpgrade(fallbackServer);
        fallbackServer.listen(fallbackPort, () => {
          console.log(`Development fallback listening on http://localhost:${fallbackPort}`);
        });
      }
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

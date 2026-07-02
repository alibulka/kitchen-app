require('dotenv').config();
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const path = require('path');

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

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Kitchen server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

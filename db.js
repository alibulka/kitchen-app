const { Pool } = require('pg');

// Создание таблиц (одинаковый SQL для обоих адаптеров — pgToSqlite конвертирует для SQLite)
async function initDb(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      shop       TEXT NOT NULL,
      active     INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (NOW()::text),
      updated_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS techcards (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      filename   TEXT,
      items_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shifts (
      date        TEXT PRIMARY KEY,
      techcard_id INTEGER REFERENCES techcards(id),
      created_at  TEXT NOT NULL DEFAULT (NOW()::text),
      updated_at  TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_item_status (
      shift_date  TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
      station_key TEXT NOT NULL,
      item_id     TEXT NOT NULL,
      done        INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shift_date, station_key, item_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_item_employees (
      shift_date  TEXT NOT NULL,
      station_key TEXT NOT NULL,
      item_id     TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      PRIMARY KEY (shift_date, station_key, item_id, employee_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_facts_n (
      shift_date  TEXT    NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
      station_key TEXT    NOT NULL,
      item_id     TEXT    NOT NULL,
      line_idx    INTEGER NOT NULL DEFAULT 0,
      value       REAL,
      PRIMARY KEY (shift_date, station_key, item_id, line_idx)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_pack_lines (
      shift_date TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
      item_id    TEXT NOT NULL,
      lines_json TEXT NOT NULL,
      PRIMARY KEY (shift_date, item_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shops (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      item_id      INTEGER PRIMARY KEY,
      name         TEXT    NOT NULL,
      yield_amount REAL    NOT NULL DEFAULT 0,
      updated_at   TEXT    NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS item_sub_preps (
      item_id       INTEGER NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
      sub_item_id   INTEGER NOT NULL,
      sub_item_name TEXT    NOT NULL,
      sort_order    INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (item_id, sub_item_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS item_ingredients (
      item_id     INTEGER NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      ing_id      INTEGER NOT NULL,
      ing_name    TEXT    NOT NULL,
      plan_amount REAL    NOT NULL DEFAULT 0,
      unit        TEXT    NOT NULL DEFAULT 'г',
      PRIMARY KEY (item_id, sort_order)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS techcard_stations (
      techcard_id  INTEGER NOT NULL REFERENCES techcards(id) ON DELETE CASCADE,
      station_key  TEXT    NOT NULL,
      shop_name    TEXT    NOT NULL,
      station_name TEXT    NOT NULL DEFAULT '',
      sort_order   INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (techcard_id, station_key)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS techcard_station_items (
      techcard_id INTEGER NOT NULL REFERENCES techcards(id) ON DELETE CASCADE,
      station_key TEXT    NOT NULL,
      item_id     INTEGER NOT NULL REFERENCES items(item_id),
      sort_order  INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (techcard_id, station_key, item_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS techcard_pack_lines (
      techcard_id    INTEGER NOT NULL REFERENCES techcards(id) ON DELETE CASCADE,
      item_id        INTEGER NOT NULL REFERENCES items(item_id),
      line_idx       INTEGER NOT NULL,
      volume         TEXT    NOT NULL DEFAULT '',
      pack_name      TEXT    NOT NULL DEFAULT '',
      destination    TEXT    NOT NULL DEFAULT '',
      from_warehouse INTEGER NOT NULL DEFAULT 0,
      qty            REAL    NOT NULL DEFAULT 0,
      PRIMARY KEY (techcard_id, item_id, line_idx)
    )
  `);

  // Индексы
  for (const sql of [
    'CREATE INDEX IF NOT EXISTS idx_shifts_date   ON shifts(date)',
    'CREATE INDEX IF NOT EXISTS idx_sis_station   ON shift_item_status(station_key, shift_date)',
    'CREATE INDEX IF NOT EXISTS idx_tc_si         ON techcard_station_items(techcard_id, station_key)',
    'CREATE INDEX IF NOT EXISTS idx_tc_pack_lines ON techcard_pack_lines(techcard_id, item_id)',
    'CREATE INDEX IF NOT EXISTS idx_sfn_shift     ON shift_facts_n(shift_date)',
  ]) {
    await pool.query(sql).catch(() => {});
  }

  // Справочник цехов
  const shopNames = [
    'Горячий цех', 'Сухой цех', 'Рыбный цех',
    'Молочный цех', 'Мясной цех', 'Соусный цех', 'Овощной цех',
    'Цех готовой еды'
  ];
  for (let i = 0; i < shopNames.length; i++) {
    await pool.query(
      'INSERT INTO shops(name, sort_order) VALUES($1, $2) ON CONFLICT(name) DO NOTHING',
      [shopNames[i], i]
    ).catch(() => {});
  }

  console.log(`Database initialized (${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'})`);
}

let pool;

if (process.env.DATABASE_URL) {
  // Продакшн: PostgreSQL (Replit)
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Локальная разработка: SQLite
  pool = require('./db-sqlite').pool;
}

module.exports = { pool, initDb: () => initDb(pool) };

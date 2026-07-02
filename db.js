const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'kitchen.db');
const db = new DatabaseSync(dbPath);

db.exec(`PRAGMA journal_mode = WAL;`);
db.exec(`PRAGMA foreign_keys = ON;`);

// ── Базовые таблицы ───────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    shop       TEXT NOT NULL,
    active     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS techcards (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    filename   TEXT,
    items_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS shifts (
    date        TEXT PRIMARY KEY,
    techcard_id INTEGER REFERENCES techcards(id),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS shift_item_status (
    shift_date  TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
    station_key TEXT NOT NULL,
    item_id     TEXT NOT NULL,
    done        INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (shift_date, station_key, item_id)
  );

  CREATE TABLE IF NOT EXISTS shift_item_employees (
    shift_date  TEXT NOT NULL,
    station_key TEXT NOT NULL,
    item_id     TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    PRIMARY KEY (shift_date, station_key, item_id, employee_id),
    FOREIGN KEY (shift_date, station_key, item_id)
      REFERENCES shift_item_status(shift_date, station_key, item_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS shift_facts (
    shift_date TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
    key        TEXT NOT NULL,
    value      TEXT,
    PRIMARY KEY (shift_date, key)
  );

  CREATE TABLE IF NOT EXISTS shift_pack_lines (
    shift_date TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
    item_id    TEXT NOT NULL,
    lines_json TEXT NOT NULL,
    PRIMARY KEY (shift_date, item_id)
  );

  CREATE TABLE IF NOT EXISTS shift_facts_n (
    shift_date  TEXT    NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
    station_key TEXT    NOT NULL,
    item_id     TEXT    NOT NULL,
    line_idx    INTEGER NOT NULL DEFAULT 0,
    value       REAL,
    PRIMARY KEY (shift_date, station_key, item_id, line_idx)
  );
`);

// ── Справочник цехов ─────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS shops (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`);

// ── Глобальный каталог позиций (не зависит от конкретной техкарты) ───────────
db.exec(`
  -- Заготовка: единая запись на весь срок работы системы
  CREATE TABLE IF NOT EXISTS items (
    item_id    INTEGER PRIMARY KEY,   -- ID из Excel (ID#1377)
    name       TEXT    NOT NULL,
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Подзаготовки позиции (глобально, не меняются от техкарты к техкарте)
  CREATE TABLE IF NOT EXISTS item_sub_preps (
    item_id       INTEGER NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    sub_item_id   INTEGER NOT NULL,
    sub_item_name TEXT    NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (item_id, sub_item_id)
  );

  -- Ингредиенты позиции (рецепт, глобально)
  CREATE TABLE IF NOT EXISTS item_ingredients (
    item_id     INTEGER NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    ing_id      INTEGER NOT NULL,
    ing_name    TEXT    NOT NULL,
    plan_amount REAL    NOT NULL DEFAULT 0,
    unit        TEXT    NOT NULL DEFAULT 'г',
    PRIMARY KEY (item_id, sort_order)
  );
`);

// ── Техкарта: только структура станций + план упаковки ───────────────────────
db.exec(`
  -- Станции в техкарте
  CREATE TABLE IF NOT EXISTS techcard_stations (
    techcard_id  INTEGER NOT NULL REFERENCES techcards(id) ON DELETE CASCADE,
    station_key  TEXT    NOT NULL,
    shop_name    TEXT    NOT NULL,
    station_name TEXT    NOT NULL DEFAULT '',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (techcard_id, station_key)
  );

  -- Какие позиции входят в каждую станцию техкарты (только ссылки на items)
  CREATE TABLE IF NOT EXISTS techcard_station_items (
    techcard_id INTEGER NOT NULL REFERENCES techcards(id) ON DELETE CASCADE,
    station_key TEXT    NOT NULL,
    item_id     INTEGER NOT NULL REFERENCES items(item_id),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (techcard_id, station_key, item_id)
  );

  -- План упаковки (количества) — меняется каждый день
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
  );
`);

// ── Индексы ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_shifts_date       ON shifts(date DESC);
  CREATE INDEX IF NOT EXISTS idx_sie_employee      ON shift_item_employees(employee_id, shift_date);
  CREATE INDEX IF NOT EXISTS idx_sis_station       ON shift_item_status(station_key, shift_date);
  CREATE INDEX IF NOT EXISTS idx_tc_si             ON techcard_station_items(techcard_id, station_key);
  CREATE INDEX IF NOT EXISTS idx_tc_pack_lines     ON techcard_pack_lines(techcard_id, item_id);
  CREATE INDEX IF NOT EXISTS idx_sfn_shift         ON shift_facts_n(shift_date);
  CREATE INDEX IF NOT EXISTS idx_items_id          ON items(item_id);
`);

// ── Заполнить справочник цехов ────────────────────────────────────────────────
const shopNames = [
  'Горячий цех', 'Сухой цех', 'Рыбный цех',
  'Молочный цех', 'Мясной цех', 'Соусный цех', 'Овощной цех',
  'Цех готовой еды'
];
shopNames.forEach((name, i) =>
  db.prepare('INSERT OR IGNORE INTO shops(name, sort_order) VALUES(?, ?)').run(name, i)
);

// ── Миграция: старые techcard_items/sub_preps/ingredients → глобальный каталог
(function migrateToGlobalCatalog() {
  // Проверяем: если уже есть данные в items — миграция уже выполнялась
  const alreadyDone = db.prepare('SELECT COUNT(*) as cnt FROM items').get().cnt > 0;

  // Проверяем: есть ли старые таблицы с данными
  let hasOldTables = false;
  try {
    const cnt = db.prepare('SELECT COUNT(*) as cnt FROM techcard_items').get().cnt;
    hasOldTables = cnt > 0;
  } catch { hasOldTables = false; }

  if (alreadyDone || !hasOldTables) return;

  const insItem    = db.prepare('INSERT OR IGNORE INTO items(item_id, name) VALUES(?, ?)');
  const insSub     = db.prepare('INSERT OR IGNORE INTO item_sub_preps(item_id,sub_item_id,sub_item_name,sort_order) VALUES(?,?,?,?)');
  const insIng     = db.prepare('INSERT OR IGNORE INTO item_ingredients(item_id,sort_order,ing_id,ing_name,plan_amount,unit) VALUES(?,?,?,?,?,?)');
  const insStItem  = db.prepare('INSERT OR IGNORE INTO techcard_station_items(techcard_id,station_key,item_id,sort_order) VALUES(?,?,?,?)');

  db.exec('BEGIN');
  try {
    // Все уникальные позиции из techcard_items → items
    const oldItems = db.prepare('SELECT DISTINCT item_id, item_name FROM techcard_items').all();
    for (const r of oldItems) insItem.run(r.item_id, r.item_name);

    // techcard_items → techcard_station_items
    const oldTcItems = db.prepare('SELECT techcard_id, station_key, item_id, sort_order FROM techcard_items').all();
    for (const r of oldTcItems) insStItem.run(r.techcard_id, r.station_key, r.item_id, r.sort_order);

    // techcard_sub_preps → item_sub_preps (деdup по item_id)
    let oldSubs = [];
    try { oldSubs = db.prepare('SELECT DISTINCT item_id, sub_item_id, sub_item_name, sort_order FROM techcard_sub_preps').all(); } catch {}
    for (const r of oldSubs) insSub.run(r.item_id, r.sub_item_id, r.sub_item_name, r.sort_order);

    // techcard_item_ingredients → item_ingredients (dedup по item_id)
    let oldIngs = [];
    try { oldIngs = db.prepare('SELECT DISTINCT item_id, sort_order, ing_id, ing_name, plan_amount, unit FROM techcard_item_ingredients').all(); } catch {}
    for (const r of oldIngs) insIng.run(r.item_id, r.sort_order, r.ing_id, r.ing_name, r.plan_amount, r.unit);

    db.exec('COMMIT');
    console.log(`Migrated ${oldItems.length} unique items to global catalog.`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Global catalog migration failed:', err);
  }
})();

// ── Миграция: shift_facts → shift_facts_n ────────────────────────────────────
(function migrateShiftFacts() {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM shift_facts_n').get();
  if (count.cnt > 0) return;

  const oldFacts = db.prepare('SELECT shift_date, key, value FROM shift_facts').all();
  if (oldFacts.length === 0) return;

  const RE = /^(.+)-(\d+)-pl-(\d+)$/;
  const ins = db.prepare(
    'INSERT OR IGNORE INTO shift_facts_n(shift_date,station_key,item_id,line_idx,value) VALUES(?,?,?,?,?)'
  );

  db.exec('BEGIN');
  try {
    let migrated = 0;
    for (const r of oldFacts) {
      const m = r.key.match(RE);
      if (!m) continue;
      const [, stationKey, itemId, lineIdx] = m;
      ins.run(r.shift_date, stationKey, itemId, Number(lineIdx),
        r.value == null ? null : Number(r.value));
      migrated++;
    }
    db.exec('COMMIT');
    if (migrated > 0) console.log(`Migrated ${migrated} shift fact(s) to shift_facts_n.`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Shift facts migration failed:', err);
  }
})();

module.exports = db;

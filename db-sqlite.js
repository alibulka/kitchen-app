const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const sqlite = new DatabaseSync(process.env.DB_PATH || path.join(__dirname, 'kitchen.db'));
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

// ─── Миграции ────────────────────────────────────────────────────────────────

const migrations = [
  "ALTER TABLE items ADD COLUMN yield_amount REAL NOT NULL DEFAULT 0",
  `CREATE TABLE IF NOT EXISTS sub_prep_ingredients (
    item_id     INTEGER NOT NULL,
    sub_item_id INTEGER NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    ing_id      INTEGER NOT NULL,
    ing_name    TEXT    NOT NULL,
    plan_amount REAL    NOT NULL DEFAULT 0,
    unit        TEXT    NOT NULL DEFAULT 'г',
    PRIMARY KEY (item_id, sub_item_id, sort_order)
  )`,
];
for (const sql of migrations) {
  try { sqlite.exec(sql); } catch {}
}

// Добавляем done_at к shift_item_status если нет
{
  const cols = sqlite.prepare('PRAGMA table_info(shift_item_status)').all();
  if (cols.length > 0 && !cols.some(c => c.name === 'done_at')) {
    sqlite.exec(`ALTER TABLE shift_item_status ADD COLUMN done_at TEXT`);
    console.log('Migration: added done_at to shift_item_status');
  }
}
sqlite.exec(`CREATE TABLE IF NOT EXISTS station_config (
  station_key TEXT PRIMARY KEY,
  start_time  TEXT NOT NULL DEFAULT '09:00'
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS shift_station_start (
  shift_date  TEXT NOT NULL,
  station_key TEXT NOT NULL,
  start_time  TEXT NOT NULL,
  PRIMARY KEY (shift_date, station_key)
)`);

// Добавляем company к techcards если нет
{
  const cols = sqlite.prepare('PRAGMA table_info(techcards)').all();
  if (!cols.some(c => c.name === 'company')) {
    sqlite.exec(`ALTER TABLE techcards ADD COLUMN company TEXT NOT NULL DEFAULT 'EE'`);
    console.log('Migration: added company to techcards');
  }
}

// Добавляем ud_techcard_id к shifts если нет
{
  const cols = sqlite.prepare('PRAGMA table_info(shifts)').all();
  if (!cols.some(c => c.name === 'ud_techcard_id')) {
    sqlite.exec(`ALTER TABLE shifts ADD COLUMN ud_techcard_id INTEGER REFERENCES techcards(id)`);
    console.log('Migration: added ud_techcard_id to shifts');
  }
}

// Добавляем source к techcard_pack_lines если нет
{
  const cols = sqlite.prepare('PRAGMA table_info(techcard_pack_lines)').all();
  if (cols.length > 0 && !cols.some(c => c.name === 'source')) {
    sqlite.exec(`ALTER TABLE techcard_pack_lines ADD COLUMN source TEXT NOT NULL DEFAULT 'EE'`);
    console.log('Migration: added source to techcard_pack_lines');
  }
}

// Добавляем grandparent_item_id если его нет (контекстно-зависимые граммовки подзаготовок)
{
  const cols = sqlite.prepare('PRAGMA table_info(sub_prep_ingredients)').all();
  if (!cols.some(c => c.name === 'grandparent_item_id')) {
    sqlite.exec(`
      BEGIN;
      CREATE TABLE sub_prep_ingredients_v2 (
        grandparent_item_id INTEGER NOT NULL DEFAULT 0,
        item_id             INTEGER NOT NULL,
        sub_item_id         INTEGER NOT NULL,
        sort_order          INTEGER NOT NULL DEFAULT 0,
        ing_id              INTEGER NOT NULL,
        ing_name            TEXT    NOT NULL,
        plan_amount         REAL    NOT NULL DEFAULT 0,
        unit                TEXT    NOT NULL DEFAULT 'г',
        PRIMARY KEY (grandparent_item_id, item_id, sub_item_id, sort_order)
      );
      INSERT INTO sub_prep_ingredients_v2
        SELECT 0, item_id, sub_item_id, sort_order, ing_id, ing_name, plan_amount, unit
        FROM sub_prep_ingredients;
      DROP TABLE sub_prep_ingredients;
      ALTER TABLE sub_prep_ingredients_v2 RENAME TO sub_prep_ingredients;
      COMMIT;
    `);
    console.log('Migration: added grandparent_item_id to sub_prep_ingredients');
  }
}

// Таблицы контроля качества
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_standards (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id      INTEGER,
  name         TEXT NOT NULL,
  company      TEXT NOT NULL DEFAULT 'EE',
  appearance   TEXT,
  color        TEXT,
  taste_smell  TEXT,
  consistency  TEXT,
  always_check INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_check_fields (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  standard_id       INTEGER NOT NULL REFERENCES quality_standards(id) ON DELETE CASCADE,
  field_name        TEXT NOT NULL,
  field_description TEXT,
  sort_order        INTEGER NOT NULL DEFAULT 0
)`);
{
  const cols=sqlite.prepare('PRAGMA table_info(quality_check_fields)').all();
  if(cols.length>0&&!cols.some(c=>c.name==='field_description')){
    sqlite.exec('ALTER TABLE quality_check_fields ADD COLUMN field_description TEXT');
  }
}
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT NOT NULL,
  standard_id INTEGER NOT NULL REFERENCES quality_standards(id),
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_task_results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id     INTEGER NOT NULL REFERENCES quality_tasks(id) ON DELETE CASCADE,
  field_name  TEXT NOT NULL,
  result      TEXT,
  comment     TEXT,
  action      TEXT
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_photos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id     INTEGER NOT NULL REFERENCES quality_tasks(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS quality_standard_photos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  standard_id INTEGER NOT NULL REFERENCES quality_standards(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

// ─── SQL: pg → SQLite ────────────────────────────────────────────────────────

// Конвертируем подмножество pg-синтаксиса в SQLite.
// Возвращает {sql, params} — params могут быть расширены если $N повторяются.
function normalize(sql, params = []) {
  let outParams = [];
  // Заменяем $N на ? и строим правильный массив params (с дублированием если $N повторяется)
  const outSql = sql.replace(/\$(\d+)/g, (_, n) => {
    outParams.push(params[Number(n) - 1]);
    return '?';
  });

  return {
    sql: outSql
      .replace(/NOW\(\)::text/gi, "datetime('now')")
      .replace(/NOW\(\)/gi,       "datetime('now')")
      .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/SMALLINT/gi, 'INTEGER')
      .replace(/RETURNING id/gi, ''),
    params: outParams.length > 0 ? outParams : params,
  };
}

function execQuery(sql, params = []) {
  const { sql: s, params: p } = normalize(sql, params);
  try {
    if (/^\s*(SELECT|WITH)/i.test(s)) {
      const rows = p.length ? sqlite.prepare(s).all(...p) : sqlite.prepare(s).all();
      return { rows };
    }
    // INSERT ... RETURNING id — возвращаем lastInsertRowid
    if (/returning/i.test(sql)) {
      const info = p.length ? sqlite.prepare(s).run(...p) : sqlite.prepare(s).run();
      return { rows: [{ id: info.lastInsertRowid }] };
    }
    // INSERT / UPDATE / DELETE
    const info = p.length ? sqlite.prepare(s).run(...p) : sqlite.prepare(s).run();
    return { rows: [], rowCount: info.changes };
  } catch (e) {
    throw new Error(`SQLite error: ${e.message}\nSQL: ${s}\nParams: ${JSON.stringify(p)}`);
  }
}

// ─── Pool ────────────────────────────────────────────────────────────────────

const pool = {
  async query(sql, params) {
    if (/^\s*BEGIN\s*$/i.test(sql))    { sqlite.exec('BEGIN');    return { rows: [] }; }
    if (/^\s*COMMIT\s*$/i.test(sql))   { sqlite.exec('COMMIT');   return { rows: [] }; }
    if (/^\s*ROLLBACK\s*$/i.test(sql)) { sqlite.exec('ROLLBACK'); return { rows: [] }; }
    return execQuery(sql, params);
  },

  async connect() {
    return { query: pool.query.bind(pool), release() {} };
  },

  // Выполняет fn(client) внутри транзакции. При ошибке — откат.
  async withTransaction(fn) {
    sqlite.exec('BEGIN');
    try {
      const result = await fn({ query: pool.query.bind(pool), release() {} });
      sqlite.exec('COMMIT');
      return result;
    } catch (err) {
      sqlite.exec('ROLLBACK');
      throw err;
    }
  },
};

module.exports = { pool };

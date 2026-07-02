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

// ─── SQL: pg → SQLite ────────────────────────────────────────────────────────

// Конвертируем подмножество pg-синтаксиса в SQLite.
// Правила перечислены явно — без магических regex-цепочек.
function normalize(sql) {
  return sql
    .replace(/\$\d+/g, '?')                                        // $1,$2 → ?
    .replace(/NOW\(\)::text/gi, "datetime('now')")                  // pg cast
    .replace(/NOW\(\)/gi,       "datetime('now')")
    .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/SMALLINT/gi, 'INTEGER')
    .replace(/RETURNING id/gi, '');                                 // обрабатываем через lastInsertRowid
}

function execQuery(sql, params = []) {
  const s = normalize(sql);
  try {
    if (/^\s*(SELECT|WITH)/i.test(s)) {
      const rows = params.length
        ? sqlite.prepare(s).all(...params)
        : sqlite.prepare(s).all();
      return { rows };
    }
    // INSERT ... RETURNING id — возвращаем lastInsertRowid
    if (/returning/i.test(sql)) {
      const info = params.length
        ? sqlite.prepare(s).run(...params)
        : sqlite.prepare(s).run();
      return { rows: [{ id: info.lastInsertRowid }] };
    }
    // INSERT / UPDATE / DELETE
    const info = params.length
      ? sqlite.prepare(s).run(...params)
      : sqlite.prepare(s).run();
    return { rows: [], rowCount: info.changes };
  } catch (e) {
    throw new Error(`SQLite error: ${e.message}\nSQL: ${s}\nParams: ${JSON.stringify(params)}`);
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

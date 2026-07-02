// SQLite адаптер с тем же интерфейсом что pg (async pool.query / pool.connect)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'kitchen.db');
const sqlite = new DatabaseSync(dbPath);

sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

// Конвертируем $1,$2,... → ?, ?, ...  и массив параметров
function toSqlite(sql, params) {
  const converted = sql.replace(/\$\d+/g, '?');
  return { sql: converted, params: params || [] };
}

// Конвертируем ON CONFLICT DO NOTHING → OR IGNORE
// и другие PG-специфичные конструкции в SQLite
function pgToSqlite(sql) {
  return sql
    .replace(/ON CONFLICT\s*\([^)]+\)\s*DO NOTHING/gi, '')
    .replace(/ON CONFLICT\s+DO NOTHING/gi, '')
    .replace(/ON CONFLICT\s*\([^)]+\)\s*DO UPDATE SET[^;]*/gi, '')
    .replace(/INSERT INTO/gi, 'INSERT OR REPLACE INTO')
    .replace(/INSERT OR REPLACE OR REPLACE/gi, 'INSERT OR REPLACE') // дедуп
    .replace(/NOW\(\)::text/gi, "datetime('now')")
    .replace(/NOW\(\)/gi, "datetime('now')")
    .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/RETURNING id/gi, '')
    .replace(/SMALLINT/gi, 'INTEGER');
}

const pool = {
  async query(sql, params) {
    const converted = pgToSqlite(sql);
    const { sql: s, params: p } = toSqlite(converted, params);
    try {
      // SELECT
      if (/^\s*(SELECT|WITH)/i.test(s)) {
        const stmt = sqlite.prepare(s);
        const rows = p.length ? stmt.all(...p) : stmt.all();
        return { rows };
      }
      // INSERT ... RETURNING id
      if (/returning/i.test(sql)) {
        const stmt = sqlite.prepare(s);
        const info = p.length ? stmt.run(...p) : stmt.run();
        return { rows: [{ id: info.lastInsertRowid }] };
      }
      // INSERT/UPDATE/DELETE
      const stmt = sqlite.prepare(s);
      const info = p.length ? stmt.run(...p) : stmt.run();
      return { rows: [], rowCount: info.changes };
    } catch (e) {
      throw new Error(`SQLite query error: ${e.message}\nSQL: ${s}\nParams: ${JSON.stringify(p)}`);
    }
  },

  async connect() {
    // Для транзакций: эмулируем client с BEGIN/COMMIT/ROLLBACK
    return {
      async query(sql, params) { return pool.query(sql, params); },
      release() {}
    };
  }
};

// BEGIN/COMMIT/ROLLBACK перехватываем напрямую
const origQuery = pool.query.bind(pool);
pool.query = async function(sql, params) {
  if (/^\s*BEGIN\s*$/i.test(sql))    { sqlite.exec('BEGIN'); return { rows: [] }; }
  if (/^\s*COMMIT\s*$/i.test(sql))   { sqlite.exec('COMMIT'); return { rows: [] }; }
  if (/^\s*ROLLBACK\s*$/i.test(sql)) { sqlite.exec('ROLLBACK'); return { rows: [] }; }
  return origQuery(sql, params);
};

const connectOrig = pool.connect.bind(pool);
pool.connect = async function() {
  const client = await connectOrig();
  const origClientQuery = client.query.bind(client);
  client.query = async function(sql, params) {
    if (/^\s*BEGIN\s*$/i.test(sql))    { sqlite.exec('BEGIN'); return { rows: [] }; }
    if (/^\s*COMMIT\s*$/i.test(sql))   { sqlite.exec('COMMIT'); return { rows: [] }; }
    if (/^\s*ROLLBACK\s*$/i.test(sql)) { sqlite.exec('ROLLBACK'); return { rows: [] }; }
    return origClientQuery(sql, params);
  };
  return client;
};

module.exports = { pool };

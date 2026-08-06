// Единая точка подключения к БД.
// Локально — SQLite (node:sqlite через db-sqlite.js).
// На Replit — PostgreSQL (DATABASE_URL).
// Оба адаптера экспортируют одинаковый интерфейс: pool.query / pool.withTransaction.

async function initDb(pool) {
  const q = (sql, p) => pool.query(sql, p).catch(() => {});

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
      company    TEXT NOT NULL DEFAULT 'EE',
      items_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q(`ALTER TABLE techcards ADD COLUMN IF NOT EXISTS company TEXT NOT NULL DEFAULT 'EE'`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shifts (
      date            TEXT PRIMARY KEY,
      techcard_id     INTEGER REFERENCES techcards(id),
      ud_techcard_id  INTEGER REFERENCES techcards(id),
      created_at      TEXT NOT NULL DEFAULT (NOW()::text),
      updated_at      TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q(`ALTER TABLE shifts ADD COLUMN IF NOT EXISTS ud_techcard_id INTEGER REFERENCES techcards(id)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_item_status (
      shift_date  TEXT NOT NULL REFERENCES shifts(date) ON DELETE CASCADE,
      station_key TEXT NOT NULL,
      item_id     TEXT NOT NULL,
      done        INTEGER NOT NULL DEFAULT 0,
      done_at     TEXT,
      skip_reason TEXT,
      skip_at     TEXT,
      PRIMARY KEY (shift_date, station_key, item_id)
    )
  `);
  await q(`ALTER TABLE shift_item_status ADD COLUMN IF NOT EXISTS done_at TEXT`);
  await q(`ALTER TABLE shift_item_status ADD COLUMN IF NOT EXISTS skip_reason TEXT`);
  await q(`ALTER TABLE shift_item_status ADD COLUMN IF NOT EXISTS skip_at TEXT`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS station_config (
      station_key TEXT PRIMARY KEY,
      start_time  TEXT NOT NULL DEFAULT '09:00'
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shift_station_start (
      shift_date  TEXT NOT NULL,
      station_key TEXT NOT NULL,
      start_time  TEXT NOT NULL,
      PRIMARY KEY (shift_date, station_key)
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
    CREATE TABLE IF NOT EXISTS sub_prep_ingredients (
      grandparent_item_id INTEGER NOT NULL DEFAULT 0,
      item_id             INTEGER NOT NULL,
      sub_item_id         INTEGER NOT NULL,
      sort_order          INTEGER NOT NULL DEFAULT 0,
      ing_id              INTEGER NOT NULL,
      ing_name            TEXT    NOT NULL,
      plan_amount         REAL    NOT NULL DEFAULT 0,
      unit                TEXT    NOT NULL DEFAULT 'г',
      PRIMARY KEY (grandparent_item_id, item_id, sub_item_id, sort_order)
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
      source         TEXT    NOT NULL DEFAULT 'EE',
      PRIMARY KEY (techcard_id, item_id, line_idx)
    )
  `);
  await q(`ALTER TABLE techcard_pack_lines ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'EE'`);

  for (const sql of [
    'CREATE INDEX IF NOT EXISTS idx_shifts_date   ON shifts(date)',
    'CREATE INDEX IF NOT EXISTS idx_sis_station   ON shift_item_status(station_key, shift_date)',
    'CREATE INDEX IF NOT EXISTS idx_tc_si         ON techcard_station_items(techcard_id, station_key)',
    'CREATE INDEX IF NOT EXISTS idx_tc_pack_lines ON techcard_pack_lines(techcard_id, item_id)',
    'CREATE INDEX IF NOT EXISTS idx_sfn_shift     ON shift_facts_n(shift_date)',
  ]) { await q(sql); }

  const shops = [
    'Горячий цех', 'Сухой цех', 'Рыбный цех',
    'Молочный цех', 'Мясной цех', 'Соусный цех', 'Овощной цех',
    'Готовая еда', 'Технолог', 'Главный технолог',
  ];
  for (let i = 0; i < shops.length; i++) {
    await q('INSERT INTO shops(name, sort_order) VALUES($1, $2) ON CONFLICT(name) DO NOTHING', [shops[i], i]);
  }

  // Модуль контроля качества
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_standards (
      id           SERIAL PRIMARY KEY,
      item_id      INTEGER,
      name         TEXT NOT NULL,
      company      TEXT NOT NULL DEFAULT 'EE',
      appearance   TEXT,
      color        TEXT,
      taste_smell  TEXT,
      consistency  TEXT,
      always_check INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_check_fields (
      id                SERIAL PRIMARY KEY,
      standard_id       INTEGER NOT NULL REFERENCES quality_standards(id) ON DELETE CASCADE,
      field_name        TEXT NOT NULL,
      field_description TEXT,
      sort_order        INTEGER NOT NULL DEFAULT 0
    )
  `);
  await q('ALTER TABLE quality_check_fields ADD COLUMN IF NOT EXISTS field_description TEXT');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_tasks (
      id          SERIAL PRIMARY KEY,
      date        TEXT NOT NULL,
      standard_id INTEGER NOT NULL REFERENCES quality_standards(id),
      status      TEXT NOT NULL DEFAULT 'pending',
      assigned_to TEXT,
      created_at  TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q('ALTER TABLE quality_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_task_results (
      id          SERIAL PRIMARY KEY,
      task_id     INTEGER NOT NULL REFERENCES quality_tasks(id) ON DELETE CASCADE,
      field_name  TEXT NOT NULL,
      result      TEXT,
      comment     TEXT,
      action      TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_photos (
      id          SERIAL PRIMARY KEY,
      task_id     INTEGER NOT NULL REFERENCES quality_tasks(id) ON DELETE CASCADE,
      filename    TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quality_standard_photos (
      id          SERIAL PRIMARY KEY,
      standard_id INTEGER NOT NULL REFERENCES quality_standards(id) ON DELETE CASCADE,
      filename    TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q('CREATE INDEX IF NOT EXISTS idx_qt_date ON quality_tasks(date)');
  await q('CREATE INDEX IF NOT EXISTS idx_qt_standard ON quality_tasks(standard_id)');

  // Акты проработки сырья
  await pool.query(`
    CREATE TABLE IF NOT EXISTS act_templates (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (NOW()::text),
      updated_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS act_sections (
      id          SERIAL PRIMARY KEY,
      template_id INTEGER NOT NULL REFERENCES act_templates(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS act_fields (
      id              SERIAL PRIMARY KEY,
      section_id      INTEGER NOT NULL REFERENCES act_sections(id) ON DELETE CASCADE,
      label           TEXT NOT NULL,
      description     TEXT,
      type            TEXT NOT NULL DEFAULT 'text',
      required        INTEGER NOT NULL DEFAULT 0,
      config_json     TEXT NOT NULL DEFAULT '{}',
      sort_order      INTEGER NOT NULL DEFAULT 0,
      show_if_field   INTEGER,
      show_if_value   TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS acts (
      id            SERIAL PRIMARY KEY,
      template_id   INTEGER NOT NULL REFERENCES act_templates(id),
      date          TEXT NOT NULL,
      raw_material  TEXT NOT NULL DEFAULT '',
      product_name  TEXT NOT NULL DEFAULT '',
      manufacturer  TEXT NOT NULL DEFAULT '',
      conclusion    TEXT NOT NULL DEFAULT '',
      status        TEXT NOT NULL DEFAULT 'draft',
      created_at    TEXT NOT NULL DEFAULT (NOW()::text),
      updated_at    TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q('ALTER TABLE acts ADD COLUMN IF NOT EXISTS product_name TEXT NOT NULL DEFAULT \'\'');
  await q('ALTER TABLE acts ADD COLUMN IF NOT EXISTS manufacturer TEXT NOT NULL DEFAULT \'\'');
  await q('ALTER TABLE acts ADD COLUMN IF NOT EXISTS conclusion TEXT NOT NULL DEFAULT \'\'');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS act_values (
      id       SERIAL PRIMARY KEY,
      act_id   INTEGER NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
      field_id INTEGER NOT NULL REFERENCES act_fields(id) ON DELETE CASCADE,
      value    TEXT,
      UNIQUE(act_id, field_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS act_photos (
      id          SERIAL PRIMARY KEY,
      act_id      INTEGER NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
      field_id    INTEGER,
      filename    TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);
  await q('CREATE INDEX IF NOT EXISTS idx_acts_template ON acts(template_id)');
  await q('CREATE INDEX IF NOT EXISTS idx_act_values_act ON act_values(act_id)');
  await q('CREATE INDEX IF NOT EXISTS idx_act_photos_act ON act_photos(act_id)');

  // Таблица отслеживания data-миграций
  await pool.query(`
    CREATE TABLE IF NOT EXISTS data_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (NOW()::text)
    )
  `);

  // Миграция: перезаписать item_id в quality_standards на wrapper_id из Excel
  {
    const { rows } = await pool.query("SELECT 1 FROM data_migrations WHERE name='wrapper_id_v1'");
    if (!rows.length) {
      const updates = [
        [21,11],[140,76],[163,89],[165,91],[203,115],[225,131],[290,175],[291,176],
        [369,227],[437,265],[444,268],[516,302],[595,350],[596,351],[626,372],[647,382],
        [656,387],[702,412],[965,567],[1039,619],[1129,677],[1336,840],[1340,844],
        [1366,864],[1377,873],[1451,939],[1583,1035],[1590,1040],[1591,1041],[1593,1043],
        [1667,1089],[1830,1224],[1873,1256],[1920,1295],[2044,1392],[2553,1627],
        [2710,1713],[2788,1771],[2819,1795],[2832,1805],[2873,1844],[2893,1860],
        [2959,1913],[3043,1971],[3103,2014],[3344,2194],[3389,2233],[3436,2270],
        [3443,2274],[3502,2314],[3526,2326],[3575,2366],[3584,2373],[3917,2633],
        [3940,2653],[3971,2682],[4003,2705],[4053,2739],[4078,2761],[4119,2795],
        [4122,2798],[4133,2807],[4344,2981],[4505,3116],[4663,3260],[4710,3301],
        [4724,3314],[4784,3371],[4880,3458],[4911,3487],[4914,3490],[5024,3597],
        [5092,3663],[5266,3828],[5325,3883],[5362,3917],[5363,3918],[5375,3929],
        [5378,3932],[5408,3957],[5424,3969],[5425,3970],[5438,3982],[5445,3989],
        [5449,3993],[5480,4023],[5495,4038],[5515,4056],[5566,4095],[5602,4129],
        [5627,4151],[5794,4301],[5846,4349],[5863,4364],[5920,4415],[5955,4445],
        [5964,4453],[5998,4482],[6067,4536],[6069,4537],[6070,4538],[6071,4539],
        [6080,4548],[6093,4559],[6114,4579],[6183,4635],[6202,4649],[6227,4670],
        [6228,4671],[6330,4755],[6333,4758],[6410,4823],[6434,4839],[6467,4867],
        [6469,4869],[6504,4898],[6531,4917],[6553,4937],[6555,4938],[6624,4997],
        [6734,5096],[6746,5108],[6754,5111],[6913,5256],[6914,5257],[6942,5281],
        [6950,5284],[6987,5314],[7031,5351],[7033,5353],[7150,5451],[7167,5466],
        [7216,5510],[7292,5553],[7322,5575],[7397,5620],[7420,5638],[7425,5639],
        [7445,5647],[7466,5657],[7501,5669],[7510,5671],[7515,5673],[7535,5684],
        [7569,5710],[7613,5743],[7623,5749],[7639,5759],[7695,5799],[7696,5800],
        [7697,5801],[7704,5805],[7764,5845],[7765,5846],[7766,5847],[7781,5856],
        [7782,5857],[7791,5861],[7812,5869],[7901,5921],[7908,5926],[7913,5929],
        [8040,6030],[8042,6032],[8076,6056],[8185,6132],[8194,6140],[8212,6151],
        [8242,6170],[8255,6182],[8256,6183],[8262,6186],[8269,6191],[8291,6208],
        [8330,6243],[8331,6244],[8340,6253],[8361,6272],[8388,6292],[8403,6303],
        [8442,6338],[8443,6339],[8447,6342],[8449,6344],[8523,6393],[8547,6416],
        [8556,6424],[8596,6455],[8614,6472],[8618,6475],[8623,6480],[8695,6538],
        [8712,6553],[8713,6554],[8715,6555],[8728,6564],[8729,6565],[8730,6566],
        [8735,6570],[8739,6573],[8740,6574],[8741,6575],[8745,6577],[8746,6578],
        [8747,6579],[8749,6580],[8763,6594],[8790,6614],[8798,6621],[8802,6624],
        [8805,6627],[8834,6649],[8839,6654],[8841,6656],[8843,6658],[8850,6665],
        [8864,6674],[8868,6677],[8869,6678],[8873,6681],[8876,6684],[8877,6685],
        [8879,6687],[8927,6731],[8929,6733],[8930,6734],[8938,6742],[8940,6744],
        [8944,6748],[8951,6754],[8958,6761],[8964,6767],[8968,6770],[8979,6777],
        [8982,6780],[8990,6787],[8997,6794],[9016,6810],[9040,6834],[9044,6838],
        [9050,6844],[9055,6849],[9069,6861],[9072,6864],[9111,6896],[9121,6906],
        [9133,6915],[9142,6924],[9164,6941],[9170,6946],[9173,6948],[9177,6952],
        [9213,6983],[9214,6984],[9223,6989],[9224,6990],[9243,7005],[9247,7008],
        [9255,7016],[9266,7026],[9268,7028],[9269,7029],[9272,7031],[9273,7032],
        [9274,7033],[9283,7042],[9286,7045],[9290,7046],[9337,7087],[9338,7088],
        [9339,7089],[9345,7094],[9353,7099],[9935,7559],[9961,7579],[9964,7582],
        [9978,7589],[10013,7613],[10044,7641],
      ];
      for (const [newId, oldId] of updates) {
        await q('UPDATE quality_standards SET item_id=$1 WHERE item_id=$2', [newId, oldId]);
      }
      await pool.query("INSERT INTO data_migrations(name) VALUES('wrapper_id_v1')");
      console.log('Migration wrapper_id_v1 applied');
    }
  }

  // Добавляем "Главный технолог" в shops если нет
  await q("INSERT INTO shops(name,sort_order) VALUES('Главный технолог',98) ON CONFLICT(name) DO NOTHING");

  console.log(`DB ready (${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'})`);
}

let pool;

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Обрыв простаивающего соединения не должен ронять весь сервер:
  // pool сам создаст новое соединение при следующем запросе.
  pool.on('error', (err) => {
    console.error('PostgreSQL pool error (соединение будет пересоздано):', err.message);
  });

  // pg не имеет withTransaction — добавляем
  pool.withTransaction = async function(fn) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  };
} else {
  pool = require('./db-sqlite').pool;
}

module.exports = { pool, initDb: () => initDb(pool) };

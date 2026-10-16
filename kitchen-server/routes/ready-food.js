const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('../db');
const objectStorage = require('../lib/objectStorage');

const READY_FOOD_SHEET_ID = '17dptA8JzNKKAf-xfRuFvTD56-se4_O56DlnYD-_Qxe4';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function inClause(ids, offset = 0) {
  return ids.map((_, i) => `$${i + 1 + offset}`).join(',');
}

function makeFilename(originalname) {
  const ext = path.extname(originalname || '') || '.jpg';
  return `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
}

async function savePhoto(filename, buffer) {
  try {
    await objectStorage.putObject(filename, buffer);
  } catch {
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
  }
}

async function deletePhotoIfUnused(filename) {
  const [{ rows: t }, { rows: s }] = await Promise.all([
    pool.query('SELECT id FROM rf_task_photos WHERE filename=$1 LIMIT 1', [filename]),
    pool.query('SELECT id FROM rf_standard_photos WHERE filename=$1 LIMIT 1', [filename]),
  ]);
  if (t.length || s.length) return;
  await objectStorage.deleteObject(filename);
  const fp = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}

// ─── Список блюд и заготовок ──────────────────────────────────────────────────

// GET /api/ready-food/today-plan?date=YYYY-MM-DD
// 1. Читает "Техкарта продукты (cron)" — сегодняшние блюда
// 2. Среди них берёт только те у которых quality_standards.always_check=1
// 3. Создаёт quality_tasks для таких блюд
// 4. По ready_food_wrappers находит заготовки этих блюд и создаёт tasks для их ГЕ-эталонов
router.get('/today-plan', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date required' });
  try {
    const { getAccessToken, fetchWithTimeout } = require('../lib/sheets-utils');
    const token = await getAccessToken();

    // Читаем только блюда из "Техкарта продукты (cron)"
    const range = encodeURIComponent(`'Техкарта продукты (cron)'!A:B`);
    const r = await fetchWithTimeout(
      `https://sheets.googleapis.com/v4/spreadsheets/${READY_FOOD_SHEET_ID}/values/${range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await r.json();
    if (data.error) throw new Error(data.error.message);

    // Row 0: дата, Row 1: заголовки, Row 2+: данные
    const planItemIds = (data.values || []).slice(2)
      .filter(row => row[0])
      .map(row => Number(row[0]));

    if (!planItemIds.length) return res.json({ ok: true, dishes: 0, wrappers: 0 });

    // Эталоны блюд с always_check=1 у которых item_id есть в плане
    const ph1 = planItemIds.map((_, i) => `$${i + 1}`).join(',');
    const { rows: dishStds } = await pool.query(
      `SELECT id, item_id FROM quality_standards WHERE company='блюдо' AND always_check=1 AND item_id IN (${ph1})`,
      planItemIds
    );

    // Собираем все standard_id которые должны быть в плане
    const shouldHaveStdIds = new Set();

    for (const std of dishStds) {
      shouldHaveStdIds.add(std.id);

      const { rows: wrappers } = await pool.query(
        'SELECT wrapper_id FROM ready_food_wrappers WHERE product_id=$1', [std.item_id]
      );
      if (!wrappers.length) continue;

      const wrapperIds = wrappers.map(w => w.wrapper_id);
      const ph2 = wrapperIds.map((_, i) => `$${i + 1}`).join(',');
      const { rows: wrStds } = await pool.query(
        `SELECT id FROM quality_standards WHERE company='ГЕ' AND item_id IN (${ph2})`,
        wrapperIds
      );
      for (const ws of wrStds) shouldHaveStdIds.add(ws.id);
    }

    // Удаляем pending-задания за эту дату которых больше нет в плане
    const { rows: existingTasks } = await pool.query(
      `SELECT qt.id, qt.standard_id FROM quality_tasks qt
       JOIN quality_standards qs ON qs.id = qt.standard_id
       WHERE qt.date=$1 AND qs.company IN ('блюдо','ГЕ') AND qt.status='pending'`,
      [date]
    );
    for (const t of existingTasks) {
      if (!shouldHaveStdIds.has(t.standard_id)) {
        await pool.query('DELETE FROM quality_tasks WHERE id=$1', [t.id]);
      }
    }

    // Создаём задания которых ещё нет
    let dishCount = 0, wrapperCount = 0;
    for (const stdId of shouldHaveStdIds) {
      const { rows: [ex] } = await pool.query(
        'SELECT id FROM quality_tasks WHERE date=$1 AND standard_id=$2 LIMIT 1',
        [date, stdId]
      );
      if (!ex) {
        await pool.query('INSERT INTO quality_tasks(date,standard_id) VALUES($1,$2)', [date, stdId]);
      }
      const { rows: [s] } = await pool.query('SELECT company FROM quality_standards WHERE id=$1', [stdId]);
      if (s?.company === 'блюдо') dishCount++; else wrapperCount++;
    }

    res.json({ ok: true, dishes: dishCount, wrappers: wrapperCount });
  } catch (err) {
    console.error('[today-plan]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ready-food/products — все блюда
router.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM ready_food_products ORDER BY name');
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ready-food/wrappers?product_id=N — заготовки для блюда (или все)
router.get('/wrappers', async (req, res) => {
  try {
    const { product_id } = req.query;
    const { rows } = product_id
      ? await pool.query(
          'SELECT wrapper_id, wrapper_name, product_id FROM ready_food_wrappers WHERE product_id=$1 ORDER BY wrapper_name',
          [product_id]
        )
      : await pool.query('SELECT DISTINCT wrapper_id, wrapper_name FROM ready_food_wrappers ORDER BY wrapper_name');
    res.json({ wrappers: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ready-food/seed — загрузить данные из Excel (один раз)
router.post('/seed', async (req, res) => {
  try {
    const { products, wrappers } = req.body;
    if (!Array.isArray(products) || !Array.isArray(wrappers))
      return res.status(400).json({ error: 'products and wrappers arrays required' });
    await pool.withTransaction(async client => {
      await client.query('DELETE FROM ready_food_wrappers');
      await client.query('DELETE FROM ready_food_products');
      for (const p of products) {
        await client.query(
          'INSERT INTO ready_food_products(id, name) VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET name=$2',
          [p.id, p.name]
        );
      }
      for (const w of wrappers) {
        await client.query(
          'INSERT INTO ready_food_wrappers(wrapper_id, wrapper_name, product_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
          [w.wrapper_id, w.wrapper_name, w.product_id]
        );
      }
    });
    res.json({ ok: true, products: products.length, wrappers: wrappers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Эталоны ──────────────────────────────────────────────────────────────────

router.get('/standards', async (req, res) => {
  try {
    const { item_type } = req.query;
    const { rows } = item_type
      ? await pool.query('SELECT * FROM rf_standards WHERE item_type=$1 ORDER BY name', [item_type])
      : await pool.query('SELECT * FROM rf_standards ORDER BY item_type, name');

    const ids = rows.map(r => r.id);
    let fields = [], photos = [];
    if (ids.length) {
      const [{ rows: f }, { rows: p }] = await Promise.all([
        pool.query(`SELECT * FROM rf_standard_fields WHERE standard_id IN (${inClause(ids)}) ORDER BY sort_order`, ids),
        pool.query(`SELECT * FROM rf_standard_photos WHERE standard_id IN (${inClause(ids)}) ORDER BY id`, ids),
      ]);
      fields = f; photos = p;
    }
    const fieldsByStd = {}, photosByStd = {};
    for (const f of fields) {
      (fieldsByStd[f.standard_id] ||= []).push({ name: f.field_name, description: f.field_description || '' });
    }
    for (const p of photos) {
      (photosByStd[p.standard_id] ||= []).push(p);
    }
    res.json({
      standards: rows.map(r => ({
        ...r,
        extra_fields: fieldsByStd[r.id] || [],
        ref_photos: photosByStd[r.id] || [],
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/standards', async (req, res) => {
  try {
    const { item_id, item_type, name, appearance, color, taste_smell, consistency, always_check, extra_fields } = req.body;
    const { rows: [row] } = await pool.query(
      `INSERT INTO rf_standards(item_id,item_type,name,appearance,color,taste_smell,consistency,always_check)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [item_id || null, item_type || 'product', name,
       appearance || null, color || null, taste_smell || null, consistency || null, always_check ? 1 : 0]
    );
    const id = row.id;
    if (Array.isArray(extra_fields)) {
      for (let i = 0; i < extra_fields.length; i++) {
        const f = extra_fields[i];
        await pool.query(
          'INSERT INTO rf_standard_fields(standard_id,field_name,field_description,sort_order) VALUES($1,$2,$3,$4)',
          [id, typeof f === 'string' ? f : f.name, typeof f === 'string' ? null : (f.description || null), i]
        );
      }
    }
    res.json({ id, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/standards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, appearance, color, taste_smell, consistency, always_check, extra_fields } = req.body;
    await pool.query(
      `UPDATE rf_standards SET name=$1,appearance=$2,color=$3,taste_smell=$4,consistency=$5,always_check=$6 WHERE id=$7`,
      [name, appearance || null, color || null, taste_smell || null, consistency || null, always_check ? 1 : 0, id]
    );
    if (Array.isArray(extra_fields)) {
      await pool.query('DELETE FROM rf_standard_fields WHERE standard_id=$1', [id]);
      for (let i = 0; i < extra_fields.length; i++) {
        const f = extra_fields[i];
        await pool.query(
          'INSERT INTO rf_standard_fields(standard_id,field_name,field_description,sort_order) VALUES($1,$2,$3,$4)',
          [id, typeof f === 'string' ? f : f.name, typeof f === 'string' ? null : (f.description || null), i]
        );
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/standards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: photos } = await pool.query('SELECT filename FROM rf_standard_photos WHERE standard_id=$1', [id]);
    await pool.query('DELETE FROM rf_standards WHERE id=$1', [id]);
    for (const p of photos) await deletePhotoIfUnused(p.filename);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Фото эталона
router.post('/standards/:id/photos', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'no file' });
    const filename = makeFilename(req.file.originalname);
    await savePhoto(filename, req.file.buffer);
    await pool.query('INSERT INTO rf_standard_photos(standard_id, filename) VALUES($1,$2)', [id, filename]);
    res.json({ ok: true, filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/standards/:id/photos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await pool.query('DELETE FROM rf_standard_photos WHERE filename=$1', [filename]);
    await deletePhotoIfUnused(filename);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Задания ──────────────────────────────────────────────────────────────────

router.get('/tasks', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });

    const { rows: tasks } = await pool.query(
      `SELECT t.*, s.name as standard_name, s.item_id, s.item_type,
              s.appearance, s.color, s.taste_smell, s.consistency,
              rfw.process_description
       FROM rf_tasks t
       JOIN rf_standards s ON s.id = t.standard_id
       LEFT JOIN ready_food_wrappers rfw ON rfw.wrapper_id = s.item_id AND s.item_type = 'wrapper'
       WHERE t.date = $1 ORDER BY t.id`,
      [date]
    );

    const ids = tasks.map(t => t.id);
    let results = [], photos = [], stdFields = [], stdPhotos = [];
    if (ids.length) {
      const stdIds = [...new Set(tasks.map(t => t.standard_id))];
      const [{ rows: r }, { rows: p }, { rows: sf }, { rows: sp }] = await Promise.all([
        pool.query(`SELECT * FROM rf_task_results WHERE task_id IN (${inClause(ids)})`, ids),
        pool.query(`SELECT * FROM rf_task_photos WHERE task_id IN (${inClause(ids)}) ORDER BY id`, ids),
        pool.query(`SELECT * FROM rf_standard_fields WHERE standard_id IN (${inClause(stdIds)}) ORDER BY sort_order`, stdIds),
        pool.query(`SELECT * FROM rf_standard_photos WHERE standard_id IN (${inClause(stdIds)}) ORDER BY id`, stdIds),
      ]);
      results = r; photos = p; stdFields = sf; stdPhotos = sp;
    }
    const resultsByTask = {}, photosByTask = {}, fieldsByStd = {}, photosByStd = {};
    for (const r of results) (resultsByTask[r.task_id] ||= []).push(r);
    for (const p of photos) (photosByTask[p.task_id] ||= []).push(p);
    for (const f of stdFields) (fieldsByStd[f.standard_id] ||= []).push({ name: f.field_name, description: f.field_description || '' });
    for (const p of stdPhotos) (photosByStd[p.standard_id] ||= []).push(p);

    res.json({
      tasks: tasks.map(t => ({
        ...t,
        results: resultsByTask[t.id] || [],
        photos: photosByTask[t.id] || [],
        extra_fields: fieldsByStd[t.standard_id] || [],
        ref_photos: photosByStd[t.standard_id] || [],
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { date, standard_id, assigned_to } = req.body;
    const { rows: [row] } = await pool.query(
      'INSERT INTO rf_tasks(date, standard_id, assigned_to) VALUES($1,$2,$3) RETURNING id',
      [date, standard_id, assigned_to || null]
    );
    res.json({ id: row.id, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM rf_tasks WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранить результаты проверки
router.patch('/tasks/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, results } = req.body;
    await pool.query('UPDATE rf_tasks SET status=$1 WHERE id=$2', [status, id]);
    if (Array.isArray(results)) {
      await pool.query('DELETE FROM rf_task_results WHERE task_id=$1', [id]);
      for (const r of results) {
        await pool.query(
          'INSERT INTO rf_task_results(task_id,field_name,result,comment,action) VALUES($1,$2,$3,$4,$5)',
          [id, r.field_name, r.result || null, r.comment || null, r.action || null]
        );
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Назначить исполнителя
router.patch('/tasks/:id/assign', async (req, res) => {
  try {
    await pool.query('UPDATE rf_tasks SET assigned_to=$1 WHERE id=$2', [req.body.assigned_to || null, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Фото задания
router.post('/tasks/:id/photos', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'no file' });
    const filename = makeFilename(req.file.originalname);
    await savePhoto(filename, req.file.buffer);
    await pool.query('INSERT INTO rf_task_photos(task_id, filename) VALUES($1,$2)', [id, filename]);
    res.json({ ok: true, filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tasks/:id/photos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await pool.query('DELETE FROM rf_task_photos WHERE filename=$1 AND task_id=$2', [filename, req.params.id]);
    await deletePhotoIfUnused(filename);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

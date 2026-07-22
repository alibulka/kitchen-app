const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('../db');

// Хелпер: WHERE id IN ($1,$2,...) совместимый с SQLite и PostgreSQL
function inClause(ids, offset=0) {
  return ids.map((_,i)=>`$${i+1+offset}`).join(',');
}

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });
const uploadLarge = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// ─── Эталоны ──────────────────────────────────────────────────────────────────

router.get('/standards', async (req, res) => {
  try {
    const { company } = req.query;
    const { rows } = company
      ? await pool.query('SELECT * FROM quality_standards WHERE company=$1 ORDER BY name', [company])
      : await pool.query('SELECT * FROM quality_standards ORDER BY company, name');

    const ids = rows.map(r => r.id);
    let fields = [], stdPhotos = [];
    if (ids.length > 0) {
      const [{ rows: f }, { rows: sp }] = await Promise.all([
        pool.query(`SELECT * FROM quality_check_fields WHERE standard_id IN (${inClause(ids)}) ORDER BY sort_order`, ids),
        pool.query(`SELECT * FROM quality_standard_photos WHERE standard_id IN (${inClause(ids)}) ORDER BY id`, ids),
      ]);
      fields = f; stdPhotos = sp;
    }
    const fieldsByStandard = {}, photosByStandard = {};
    for (const f of fields) {
      if (!fieldsByStandard[f.standard_id]) fieldsByStandard[f.standard_id] = [];
      fieldsByStandard[f.standard_id].push({ name: f.field_name, description: f.field_description || '' });
    }
    for (const p of stdPhotos) {
      if (!photosByStandard[p.standard_id]) photosByStandard[p.standard_id] = [];
      photosByStandard[p.standard_id].push(p);
    }
    res.json({ standards: rows.map(r => ({ ...r, extra_fields: fieldsByStandard[r.id] || [], ref_photos: photosByStandard[r.id] || [] })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/standards', async (req, res) => {
  try {
    const { item_id, name, company, appearance, color, taste_smell, consistency, always_check, extra_fields } = req.body;
    const { rows: [row] } = await pool.query(
      `INSERT INTO quality_standards(item_id,name,company,appearance,color,taste_smell,consistency,always_check)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [item_id || null, name, company || 'EE', appearance || null, color || null,
       taste_smell || null, consistency || null, always_check ? 1 : 0]
    );
    const id = row.id;
    if (Array.isArray(extra_fields)) {
      for (let i = 0; i < extra_fields.length; i++) {
        const f = extra_fields[i];
        const fname = typeof f === 'string' ? f : f.name;
        const fdesc = typeof f === 'string' ? null : (f.description || null);
        await pool.query(
          'INSERT INTO quality_check_fields(standard_id,field_name,field_description,sort_order) VALUES($1,$2,$3,$4)',
          [id, fname, fdesc, i]
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
      `UPDATE quality_standards SET name=$1,appearance=$2,color=$3,taste_smell=$4,consistency=$5,always_check=$6 WHERE id=$7`,
      [name, appearance || null, color || null, taste_smell || null, consistency || null, always_check ? 1 : 0, id]
    );
    if (Array.isArray(extra_fields)) {
      await pool.query('DELETE FROM quality_check_fields WHERE standard_id=$1', [id]);
      for (let i = 0; i < extra_fields.length; i++) {
        const f = extra_fields[i];
        const fname = typeof f === 'string' ? f : f.name;
        const fdesc = typeof f === 'string' ? null : (f.description || null);
        await pool.query(
          'INSERT INTO quality_check_fields(standard_id,field_name,field_description,sort_order) VALUES($1,$2,$3,$4)',
          [id, fname, fdesc, i]
        );
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Импорт эталонов из Excel (массив объектов) — только текстовые данные
router.post('/standards/import', async (req, res) => {
  try {
    const { standards } = req.body;
    if (!Array.isArray(standards)) return res.status(400).json({ error: 'standards array required' });
    let imported = 0;
    for (const s of standards) {
      const { rows: existing } = await pool.query(
        'SELECT id FROM quality_standards WHERE item_id=$1 AND company=$2',
        [s.item_id, s.company || 'EE']
      );
      if (existing.length > 0) {
        await pool.query(
          `UPDATE quality_standards SET name=$1,appearance=$2,color=$3,taste_smell=$4,consistency=$5 WHERE id=$6`,
          [s.name, s.appearance || null, s.color || null, s.taste_smell || null, s.consistency || null, existing[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO quality_standards(item_id,name,company,appearance,color,taste_smell,consistency)
           VALUES($1,$2,$3,$4,$5,$6,$7)`,
          [s.item_id || null, s.name, s.company || 'EE', s.appearance || null, s.color || null,
           s.taste_smell || null, s.consistency || null]
        );
        imported++;
      }
    }
    res.json({ ok: true, imported });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Импорт эталонов с фото — принимает сырой xlsx файл
router.post('/standards/import-file', uploadLarge.single('file'), async (req, res) => {
  try {
    const AdmZip = require('adm-zip');
    const XLSX = require('xlsx');
    const company = req.body.company || 'EE';
    const sheetName = company === 'УД' ? 'Библиотека эталонов УД' : 'Библиотека эталонов EE';

    const fileBuf = fs.readFileSync(req.file.path);

    // ─── 1. Парсинг текстовых данных (xlsx) ──────────────────────────────────
    const wb = XLSX.read(fileBuf, { type: 'buffer' });
    const ws = wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    let headerRow = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].some(c => String(c).toUpperCase().includes('НАИМЕНОВАНИЕ'))) {
        headerRow = i; break;
      }
    }
    if (headerRow < 0) { fs.unlinkSync(req.file.path); return res.json({ ok: true, imported: 0, images: 0, msg: 'Заголовок не найден' }); }

    const header = rows[headerRow].map(c => String(c).toUpperCase().trim());
    const col = n => header.findIndex(h => h.includes(n));
    const iId = col('ID'), iName = col('НАИМЕНОВАНИЕ'), iApp = col('ВНЕШНИЙ'),
          iColor = col('ЦВЕТ'), iTaste = col('ВКУС'), iCons = col('КОНСИСТЕНЦИЯ');

    let imported = 0;
    const rowToStandardId = {}; // JS row index → standard DB id

    for (let i = headerRow + 1; i < rows.length; i++) {
      const row = rows[i];
      const rawId = row[iId]; const name = String(row[iName] || '').trim();
      if (!name) continue;
      const itemId = rawId ? Number(rawId) : null;
      const s = {
        item_id: isNaN(itemId) ? null : itemId, name, company,
        appearance: String(row[iApp] || '').trim() || null,
        color: String(row[iColor] || '').trim() || null,
        taste_smell: String(row[iTaste] || '').trim() || null,
        consistency: String(row[iCons] || '').trim() || null,
      };

      let stdId;
      if (s.item_id) {
        const { rows: ex } = await pool.query('SELECT id FROM quality_standards WHERE item_id=$1 AND company=$2', [s.item_id, company]);
        if (ex.length > 0) {
          stdId = ex[0].id;
          await pool.query(
            'UPDATE quality_standards SET name=$1,appearance=$2,color=$3,taste_smell=$4,consistency=$5 WHERE id=$6',
            [s.name, s.appearance, s.color, s.taste_smell, s.consistency, stdId]
          );
        }
      }
      if (!stdId) {
        const { rows: [r] } = await pool.query(
          `INSERT INTO quality_standards(item_id,name,company,appearance,color,taste_smell,consistency)
           VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [s.item_id, s.name, company, s.appearance, s.color, s.taste_smell, s.consistency]
        );
        stdId = r.id; imported++;
      }
      rowToStandardId[i] = stdId;
    }

    // ─── 2. Извлечение фото (adm-zip + drawing XML) ───────────────────────────
    let imagesSaved = 0;
    try {
      const zip = new AdmZip(req.file.path);

      // Найти файл листа по имени через workbook.xml
      const wbXml = zip.readAsText('xl/workbook.xml') || '';
      const wbRels = zip.readAsText('xl/_rels/workbook.xml.rels') || '';

      const sheetRidM = wbXml.match(new RegExp(`name="${sheetName}"[^>]*r:id="([^"]+)"`));
      if (sheetRidM) {
        const sheetRid = sheetRidM[1];
        const sheetFileM = wbRels.match(new RegExp(`Id="${sheetRid}"[^>]*Target="([^"]+)"`));
        if (sheetFileM) {
          const sheetBase = path.basename(sheetFileM[1], '.xml');
          const sheetRelsXml = zip.readAsText(`xl/worksheets/_rels/${sheetBase}.xml.rels`) || '';

          const drawM = sheetRelsXml.match(/Id="([^"]+)"[^>]+Type="[^"]*drawing[^"]*"[^>]+Target="([^"]+)"/);
          if (drawM) {
            const drawingPath = 'xl/' + drawM[2].replace('../', '');
            const drawingBase = path.basename(drawingPath, '.xml');
            const drawRelsXml = zip.readAsText(`xl/drawings/_rels/${drawingBase}.xml.rels`) || '';
            const drawXml = zip.readAsText(drawingPath) || '';

            // rId → image path
            const rIdToImg = {};
            const relRx = /Id="([^"]+)"[^>]+Target="([^"]+)"/g;
            let relM;
            while ((relM = relRx.exec(drawRelsXml)) !== null) {
              rIdToImg[relM[1]] = 'xl/' + relM[2].replace('../', '');
            }

            // drawing from.row → rId
            const rowToRid = {};
            const anchorRx = /<xdr:(?:twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g;
            let anchorM;
            while ((anchorM = anchorRx.exec(drawXml)) !== null) {
              const block = anchorM[1];
              const rowM2 = block.match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/);
              const embedM = block.match(/r:embed="([^"]+)"/);
              if (rowM2 && embedM) rowToRid[parseInt(rowM2[1])] = embedM[1];
            }

            // Для каждого стандарта — найти изображение по строке
            for (const [rowIdxStr, stdId] of Object.entries(rowToStandardId)) {
              const rowIdx = parseInt(rowIdxStr);
              const rid = rowToRid[rowIdx] || rowToRid[rowIdx - 1] || rowToRid[rowIdx + 1];
              if (!rid) continue;
              const imgPath = rIdToImg[rid];
              if (!imgPath) continue;

              const imgBuf = zip.readFile(imgPath);
              if (!imgBuf || imgBuf.length === 0) continue;

              // Не дублировать фото для этого стандарта
              const { rows: existPhotos } = await pool.query(
                'SELECT id FROM quality_standard_photos WHERE standard_id=$1', [stdId]
              );
              if (existPhotos.length > 0) continue;

              const ext = path.extname(imgPath) || '.jpg';
              const filename = `std-${stdId}-${Date.now()}${ext}`;
              fs.writeFileSync(path.join(UPLOADS_DIR, filename), imgBuf);
              await pool.query(
                'INSERT INTO quality_standard_photos(standard_id,filename) VALUES($1,$2)',
                [stdId, filename]
              );
              imagesSaved++;
            }
          }
        }
      }
    } catch (imgErr) {
      console.error('Image extraction error:', imgErr.message);
    }

    fs.unlinkSync(req.file.path);
    res.json({ ok: true, imported, images: imagesSaved });
  } catch (err) {
    if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch {}
    res.status(500).json({ error: err.message });
  }
});

// ─── Задания ──────────────────────────────────────────────────────────────────

router.get('/tasks', async (req, res) => {
  try {
    const { date } = req.query;
    const { rows } = await pool.query(`
      SELECT qt.*, qs.name, qs.company, qs.appearance, qs.color, qs.taste_smell, qs.consistency,
             qs.item_id, qs.always_check
      FROM quality_tasks qt
      JOIN quality_standards qs ON qs.id = qt.standard_id
      WHERE qt.date = $1
      ORDER BY qt.id
    `, [date]);

    const taskIds = rows.map(r => r.id);
    let results = [], photos = [], fields = [];

    if (taskIds.length > 0) {
      const stdIds = [...new Set(rows.map(r => r.standard_id))];
      const [r, p, f, sp] = await Promise.all([
        pool.query(`SELECT * FROM quality_task_results WHERE task_id IN (${inClause(taskIds)})`, taskIds),
        pool.query(`SELECT * FROM quality_photos WHERE task_id IN (${inClause(taskIds)})`, taskIds),
        pool.query(`SELECT qcf.* FROM quality_check_fields qcf
                    JOIN quality_tasks qt ON qt.standard_id = qcf.standard_id
                    WHERE qt.id IN (${inClause(taskIds)}) ORDER BY qcf.sort_order`, taskIds),
        stdIds.length > 0
          ? pool.query(`SELECT * FROM quality_standard_photos WHERE standard_id IN (${inClause(stdIds)})`, stdIds)
          : Promise.resolve({ rows: [] }),
      ]);
      results = r.rows; photos = p.rows; fields = f.rows;
      const refByStd = {};
      for (const ph of sp.rows) {
        if (!refByStd[ph.standard_id]) refByStd[ph.standard_id] = [];
        refByStd[ph.standard_id].push(ph);
      }
      for (const row of rows) row._ref_photos = refByStd[row.standard_id] || [];
    }

    const resultsByTask = {}, photosByTask = {}, fieldsByTask = {};
    for (const r of results) {
      if (!resultsByTask[r.task_id]) resultsByTask[r.task_id] = [];
      resultsByTask[r.task_id].push(r);
    }
    for (const p of photos) {
      if (!photosByTask[p.task_id]) photosByTask[p.task_id] = [];
      photosByTask[p.task_id].push(p);
    }
    for (const f of fields) {
      if (!fieldsByTask[f.standard_id]) fieldsByTask[f.standard_id] = [];
      const already = fieldsByTask[f.standard_id].some(x => (x.name||x) === f.field_name);
      if (!already)
        fieldsByTask[f.standard_id].push({ name: f.field_name, description: f.field_description || '' });
    }

    res.json({
      tasks: rows.map(r => ({
        ...r,
        results: resultsByTask[r.id] || [],
        photos: photosByTask[r.id] || [],
        extra_fields: fieldsByTask[r.standard_id] || [],
        ref_photos: r._ref_photos || [],
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { date, standard_id } = req.body;
    const { rows: [row] } = await pool.query(
      `INSERT INTO quality_tasks(date,standard_id) VALUES($1,$2) RETURNING id`,
      [date, standard_id]
    );
    res.json({ id: row.id, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM quality_tasks WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранить результаты чек-листа
router.post('/tasks/:id/results', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { results, status } = req.body;

    await pool.query('DELETE FROM quality_task_results WHERE task_id=$1', [taskId]);
    for (const r of (results || [])) {
      await pool.query(
        `INSERT INTO quality_task_results(task_id,field_name,result,comment,action) VALUES($1,$2,$3,$4,$5)`,
        [taskId, r.field_name, r.result || null, r.comment || null, r.action || null]
      );
    }
    if (status) {
      await pool.query('UPDATE quality_tasks SET status=$1 WHERE id=$2', [status, taskId]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузить фото
router.post('/tasks/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const taskId = req.params.id;
    const saved = [];
    for (const file of (req.files || [])) {
      await pool.query(
        'INSERT INTO quality_photos(task_id,filename) VALUES($1,$2)',
        [taskId, file.filename]
      );
      saved.push(file.filename);
    }
    res.json({ ok: true, files: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эталонные фото стандарта
router.post('/standards/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const standardId = req.params.id;
    const saved = [];
    for (const file of (req.files || [])) {
      await pool.query(
        'INSERT INTO quality_standard_photos(standard_id,filename) VALUES($1,$2)',
        [standardId, file.filename]
      );
      saved.push(file.filename);
    }
    res.json({ ok: true, files: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/standard-photos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await pool.query('DELETE FROM quality_standard_photos WHERE filename=$1', [filename]);
    const fp = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/photos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await pool.query('DELETE FROM quality_photos WHERE filename=$1', [filename]);
    const fp = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Журнал проверок ──────────────────────────────────────────────────────────

router.get('/journal', async (req, res) => {
  try {
    const { from, to, company } = req.query;
    let sql = `
      SELECT qt.id, qt.date, qt.status, qt.created_at,
             qs.name, qs.company, qs.item_id, qt.standard_id,
             qs.appearance, qs.color, qs.taste_smell, qs.consistency
      FROM quality_tasks qt
      JOIN quality_standards qs ON qs.id = qt.standard_id
      WHERE qt.status = 'done'
    `;
    const params = [];
    if (from) { params.push(from); sql += ` AND qt.date >= $${params.length}`; }
    if (to)   { params.push(to);   sql += ` AND qt.date <= $${params.length}`; }
    if (company) { params.push(company); sql += ` AND qs.company = $${params.length}`; }
    sql += ' ORDER BY qt.date DESC, qt.id DESC';

    const { rows } = await pool.query(sql, params);
    const taskIds = rows.map(r => r.id);
    const stdIds = [...new Set(rows.map(r => r.standard_id))];

    let results = [], photos = [], refPhotos = [], extraFields = [];
    if (taskIds.length > 0) {
      [{ rows: results }, { rows: photos }] = await Promise.all([
        pool.query(`SELECT * FROM quality_task_results WHERE task_id IN (${inClause(taskIds)})`, taskIds),
        pool.query(`SELECT * FROM quality_photos WHERE task_id IN (${inClause(taskIds)})`, taskIds),
      ]);
    }
    if (stdIds.length > 0) {
      [{ rows: refPhotos }, { rows: extraFields }] = await Promise.all([
        pool.query(`SELECT * FROM quality_standard_photos WHERE standard_id IN (${inClause(stdIds)})`, stdIds),
        pool.query(`SELECT * FROM quality_check_fields WHERE standard_id IN (${inClause(stdIds)}) ORDER BY sort_order`, stdIds),
      ]);
    }

    const resultsByTask = {}, photosByTask = {}, refByStd = {}, fieldsByStd = {};
    for (const r of results) {
      if (!resultsByTask[r.task_id]) resultsByTask[r.task_id] = [];
      resultsByTask[r.task_id].push(r);
    }
    for (const p of photos) {
      if (!photosByTask[p.task_id]) photosByTask[p.task_id] = [];
      photosByTask[p.task_id].push(p);
    }
    for (const p of refPhotos) {
      if (!refByStd[p.standard_id]) refByStd[p.standard_id] = [];
      refByStd[p.standard_id].push(p);
    }
    for (const f of extraFields) {
      if (!fieldsByStd[f.standard_id]) fieldsByStd[f.standard_id] = [];
      fieldsByStd[f.standard_id].push({ name: f.field_name, description: f.field_description || '' });
    }

    res.json({
      tasks: rows.map(r => ({
        ...r,
        results: resultsByTask[r.id] || [],
        photos: photosByTask[r.id] || [],
        ref_photos: refByStd[r.standard_id] || [],
        extra_fields: fieldsByStd[r.standard_id] || [],
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

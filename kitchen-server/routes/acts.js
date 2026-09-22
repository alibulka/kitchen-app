const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('../db');
const { generateTemplateDOCX, generateActDOCX } = require('../docx-gen');

const { syncActSafely } = require('../lib/prorabotki-writeback');
const { notifyActSafely } = require('../lib/act-notifications');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Фото храним в object storage (как в quality.js) — локальный диск на проде
// стирается при каждой публикации, из-за этого уже теряли фото актов.
const objectStorage = require('../lib/objectStorage');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function makeActFilename(originalname) {
  const ext = path.extname(originalname || '') || '.jpg';
  return `act-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
}

// ─── Шаблоны ──────────────────────────────────────────────────────────────────

// Список шаблонов
router.get('/templates', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, created_at FROM act_templates WHERE archived=0 ORDER BY id DESC');
    res.json({ templates: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Один шаблон с секциями и полями
router.get('/templates/:id', async (req, res) => {
  try {
    const { rows: [tmpl] } = await pool.query('SELECT * FROM act_templates WHERE id=$1', [req.params.id]);
    if (!tmpl) return res.status(404).json({ error: 'not found' });
    const { rows: sections } = await pool.query(
      'SELECT * FROM act_sections WHERE template_id=$1 ORDER BY sort_order, id', [tmpl.id]
    );
    const { rows: fields } = await pool.query(
      `SELECT f.* FROM act_fields f
       JOIN act_sections s ON s.id = f.section_id
       WHERE s.template_id=$1
       ORDER BY f.section_id, f.sort_order, f.id`, [tmpl.id]
    );
    const fieldsBySection = {};
    for (const f of fields) {
      if (!fieldsBySection[f.section_id]) fieldsBySection[f.section_id] = [];
      fieldsBySection[f.section_id].push({ ...f, config: JSON.parse(f.config_json || '{}') });
    }
    res.json({
      template: {
        ...tmpl,
        sections: sections.map(s => ({ ...s, fields: fieldsBySection[s.id] || [] })),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать шаблон
router.post('/templates', async (req, res) => {
  try {
    const { name, sections = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });

    await pool.withTransaction(async (client) => {
      const { rows: [tmpl] } = await client.query(
        'INSERT INTO act_templates(name) VALUES($1) RETURNING *', [name]
      );
      for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        const { rows: [section] } = await client.query(
          'INSERT INTO act_sections(template_id, title, sort_order) VALUES($1,$2,$3) RETURNING *',
          [tmpl.id, sec.title, si]
        );
        for (let fi = 0; fi < (sec.fields || []).length; fi++) {
          const f = sec.fields[fi];
          await client.query(
            `INSERT INTO act_fields(section_id, label, description, type, required, config_json, sort_order, show_if_field, show_if_value)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [section.id, f.label, f.description || null, f.type || 'text',
             f.required ? 1 : 0, JSON.stringify(f.config || {}), fi,
             f.show_if_field || null, f.show_if_value || null]
          );
        }
      }
      res.json({ ok: true, id: tmpl.id });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить шаблон (полная перезапись секций/полей)
router.put('/templates/:id', async (req, res) => {
  try {
    const { name, sections = [] } = req.body;
    await pool.withTransaction(async (client) => {
      await client.query(
        "UPDATE act_templates SET name=$1, updated_at=(NOW()::text) WHERE id=$2",
        [name, req.params.id]
      );
      // ВАЖНО: раньше здесь просто удалялись секции (каскадно удалялись поля,
      // а вместе с ними — значения и привязки фото в уже заполненных актах).
      // Теперь перед пересозданием сохраняем значения/фото и переносим их
      // на новые поля по совпадению «название секции + название поля».
      const { rows: oldFields } = await client.query(
        `SELECT f.id, f.label, s.title AS section_title
         FROM act_fields f JOIN act_sections s ON s.id = f.section_id
         WHERE s.template_id = $1`, [req.params.id]
      );
      const oldFieldIds = oldFields.map(f => f.id);
      let savedValues = [], savedPhotos = [];
      if (oldFieldIds.length) {
        const ph = oldFieldIds.map((_,i)=>`$${i+1}`).join(',');
        ({ rows: savedValues } = await client.query(
          `SELECT act_id, field_id, value FROM act_values WHERE field_id IN (${ph})`, oldFieldIds
        ));
        ({ rows: savedPhotos } = await client.query(
          `SELECT id, field_id FROM act_photos WHERE field_id IN (${ph})`, oldFieldIds
        ));
      }
      const oldKeyById = {};
      for (const f of oldFields) oldKeyById[f.id] = f.section_title + '\u0000' + f.label;

      // Удаляем старые секции (каскадно удалит поля)
      await client.query('DELETE FROM act_sections WHERE template_id=$1', [req.params.id]);
      const newIdByKey = {};
      for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        const { rows: [section] } = await client.query(
          'INSERT INTO act_sections(template_id, title, sort_order) VALUES($1,$2,$3) RETURNING *',
          [req.params.id, sec.title, si]
        );
        for (let fi = 0; fi < (sec.fields || []).length; fi++) {
          const f = sec.fields[fi];
          const { rows: [nf] } = await client.query(
            `INSERT INTO act_fields(section_id, label, description, type, required, config_json, sort_order, show_if_field, show_if_value)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
            [section.id, f.label, f.description || null, f.type || 'text',
             f.required ? 1 : 0, JSON.stringify(f.config || {}), fi,
             f.show_if_field || null, f.show_if_value || null]
          );
          const key = sec.title + '\u0000' + f.label;
          if (!(key in newIdByKey)) newIdByKey[key] = nf.id;
        }
      }
      // Переносим сохранённые значения и фото на новые поля
      for (const v of savedValues) {
        const newId = newIdByKey[oldKeyById[v.field_id]];
        if (newId == null) continue; // поле убрали из шаблона — значение пропадает осознанно
        await client.query(
          `INSERT INTO act_values(act_id, field_id, value) VALUES($1,$2,$3)
           ON CONFLICT (act_id, field_id) DO UPDATE SET value=EXCLUDED.value`,
          [v.act_id, newId, v.value]
        );
      }
      for (const p of savedPhotos) {
        const newId = newIdByKey[oldKeyById[p.field_id]];
        if (newId == null) continue;
        await client.query('UPDATE act_photos SET field_id=$1 WHERE id=$2', [newId, p.id]);
      }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Клонировать шаблон
router.post('/templates/:id/clone', async (req, res) => {
  try {
    const { name } = req.body;
    const { rows: [src] } = await pool.query('SELECT * FROM act_templates WHERE id=$1', [req.params.id]);
    if (!src) return res.status(404).json({ error: 'not found' });
    const { rows: sections } = await pool.query(
      'SELECT * FROM act_sections WHERE template_id=$1 ORDER BY sort_order, id', [src.id]
    );
    const { rows: fields } = await pool.query(
      `SELECT f.* FROM act_fields f JOIN act_sections s ON s.id=f.section_id
       WHERE s.template_id=$1 ORDER BY f.section_id, f.sort_order`, [src.id]
    );
    const fieldsBySection = {};
    for (const f of fields) {
      if (!fieldsBySection[f.section_id]) fieldsBySection[f.section_id] = [];
      fieldsBySection[f.section_id].push(f);
    }
    let newId;
    await pool.withTransaction(async (client) => {
      const { rows: [tmpl] } = await client.query(
        'INSERT INTO act_templates(name) VALUES($1) RETURNING *', [name || src.name + ' (копия)']
      );
      newId = tmpl.id;
      for (const sec of sections) {
        const { rows: [newSec] } = await client.query(
          'INSERT INTO act_sections(template_id,title,sort_order) VALUES($1,$2,$3) RETURNING *',
          [tmpl.id, sec.title, sec.sort_order]
        );
        for (const f of (fieldsBySection[sec.id] || [])) {
          await client.query(
            `INSERT INTO act_fields(section_id,label,description,type,required,config_json,sort_order,show_if_field,show_if_value)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [newSec.id, f.label, f.description, f.type, f.required, f.config_json,
             f.sort_order, f.show_if_field, f.show_if_value]
          );
        }
      }
    });
    res.json({ ok: true, id: newId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Скачать шаблон как DOCX
router.get('/templates/:id/docx', async (req, res) => {
  try {
    const { rows: [tmpl] } = await pool.query('SELECT * FROM act_templates WHERE id=$1', [req.params.id]);
    if (!tmpl) return res.status(404).json({ error: 'not found' });
    const { rows: sections } = await pool.query(
      'SELECT * FROM act_sections WHERE template_id=$1 ORDER BY sort_order, id', [tmpl.id]
    );
    const { rows: fields } = await pool.query(
      `SELECT f.* FROM act_fields f JOIN act_sections s ON s.id=f.section_id
       WHERE s.template_id=$1 ORDER BY f.section_id, f.sort_order`, [tmpl.id]
    );
    const fieldsBySection = {};
    for (const f of fields) {
      if (!fieldsBySection[f.section_id]) fieldsBySection[f.section_id] = [];
      fieldsBySection[f.section_id].push({ ...f, config: JSON.parse(f.config_json || '{}') });
    }
    const template = { ...tmpl, sections: sections.map(s => ({ ...s, fields: fieldsBySection[s.id] || [] })) };
    const buf = await generateTemplateDOCX(template);
    const filename = encodeURIComponent(`Шаблон_${tmpl.name}.docx`);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить шаблон
router.delete('/templates/:id', async (req, res) => {
  try {
    // Если по шаблону есть акты — не удаляем физически (иначе акты сломаются),
    // а прячем шаблон из списка (архив). Акты продолжают открываться и скачиваться.
    const { rows: [{ count }] } = await pool.query(
      'SELECT count(*)::int AS count FROM acts WHERE template_id=$1', [req.params.id]
    );
    if (count > 0) {
      await pool.query('UPDATE act_templates SET archived=1 WHERE id=$1', [req.params.id]);
    } else {
      await pool.query('DELETE FROM act_templates WHERE id=$1', [req.params.id]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Акты ─────────────────────────────────────────────────────────────────────

// Список актов
router.get('/acts', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.id, a.template_id, a.date, a.raw_material,
             a.product_name, a.manufacturer, a.supplier, a.conclusion,
             a.status, a.created_at, a.source_row, a.source_sheet,
             a.gross_mass, a.defrost_mass, t.name AS template_name
      FROM acts a JOIN act_templates t ON t.id = a.template_id
      ORDER BY a.date DESC, a.id DESC
    `);
    res.json({ acts: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Один акт с значениями и фото
router.get('/acts/:id', async (req, res) => {
  try {
    const { rows: [act] } = await pool.query(`
      SELECT a.*, t.name AS template_name
      FROM acts a JOIN act_templates t ON t.id=a.template_id
      WHERE a.id=$1
    `, [req.params.id]);
    if (!act) return res.status(404).json({ error: 'not found' });

    const { rows: values } = await pool.query(
      'SELECT field_id, value FROM act_values WHERE act_id=$1', [act.id]
    );
    const { rows: photos } = await pool.query(
      'SELECT id, field_id, filename FROM act_photos WHERE act_id=$1 ORDER BY id', [act.id]
    );
    res.json({
      act: {
        ...act,
        values: Object.fromEntries(values.map(v => [v.field_id, v.value])),
        photos,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать акт
router.post('/acts', async (req, res) => {
  try {
    const { template_id, date, raw_material, product_name, manufacturer, supplier, gross_mass, sheet_id, source_sheet } = req.body;
    if (!template_id || !date) return res.status(400).json({ error: 'template_id and date required' });
    const { rows: [act] } = await pool.query(
      'INSERT INTO acts(template_id,date,raw_material,product_name,manufacturer,supplier,gross_mass,source_row,source_sheet,source_product_name) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$4) RETURNING *',
      [template_id, date, raw_material || '', product_name || '', manufacturer || '', supplier || '',
       gross_mass != null ? Number(gross_mass) : null,
       sheet_id || null, source_sheet || null]
    );
    const sheetSync = await syncActSafely(pool, act.id);
    res.json({ ok: true, id: act.id, sheetSync });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранить значения акта
router.put('/acts/:id', async (req, res) => {
  try {
    const { values = {}, status, date, raw_material, product_name, manufacturer, supplier,
      conclusion, gross_mass, defrost_mass } = req.body;
    const normalizeMass = value => value == null || String(value).trim() === ''
      ? null : Number(String(value).replace(',', '.'));
    for (const mass of [gross_mass, defrost_mass]) {
      const value = normalizeMass(mass);
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        return res.status(400).json({ error: 'Масса должна быть неотрицательным числом' });
      }
    }
    if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }
    const { savedAct, isFirstCompletion, hasChanges } = await pool.withTransaction(async (client) => {
      const { rows: [beforeSave] } = await client.query(
        'SELECT * FROM acts WHERE id=$1 FOR UPDATE', [req.params.id]);
      if (!beforeSave) throw new Error('Акт не найден');
      const isFirstCompletion = status === 'done' && !beforeSave.first_completed_at;
      const { rows: existingValues } = await client.query(
        'SELECT field_id,value FROM act_values WHERE act_id=$1', [req.params.id]);
      const currentValues = new Map(existingValues.map(row => [String(row.field_id), row.value]));
      // Preserve the source name before editing, so renaming can safely write back.
      await client.query(`UPDATE acts SET source_product_name=product_name
        WHERE id=$1 AND source_row IS NOT NULL AND source_product_name IS NULL`, [req.params.id]);
      const sets = [];
      const params = [];
      const same = (left, right) => left == null && right == null || String(left) === String(right);
      const addChanged = (column, value, current) => {
        if (value === undefined || same(value, current)) return;
        sets.push(`${column}=$${params.length + 1}`);
        params.push(value);
      };
      addChanged('date', date, beforeSave.date);
      if (status) addChanged('status', status, beforeSave.status);
      addChanged('raw_material', raw_material, beforeSave.raw_material);
      addChanged('product_name', product_name, beforeSave.product_name);
      addChanged('manufacturer', manufacturer, beforeSave.manufacturer);
      addChanged('supplier', supplier, beforeSave.supplier);
      addChanged('conclusion', conclusion, beforeSave.conclusion);
      if (gross_mass !== undefined) addChanged('gross_mass', normalizeMass(gross_mass), beforeSave.gross_mass);
      if (defrost_mass !== undefined) addChanged('defrost_mass', normalizeMass(defrost_mass), beforeSave.defrost_mass);
      const changedValues = Object.entries(values).flatMap(([fieldId, value]) => {
        const normalized = value == null ? null : String(value);
        return same(normalized, currentValues.get(String(fieldId))) ? [] : [[fieldId, normalized]];
      });
      const hasChanges = sets.length > 0 || changedValues.length > 0;
      if (hasChanges) {
        // clock_timestamp() changes within a transaction; NOW() is fixed at transaction start.
        sets.push(`updated_at=(clock_timestamp()::text)`);
        if (isFirstCompletion) sets.push(`first_completed_at=(clock_timestamp()::text)`);
        params.push(req.params.id);
        await client.query(`UPDATE acts SET ${sets.join(',')} WHERE id=$${params.length}`, params);
      }
      for (const [fieldId, value] of changedValues) {
        await client.query(
          `INSERT INTO act_values(act_id,field_id,value) VALUES($1,$2,$3)
           ON CONFLICT(act_id,field_id) DO UPDATE SET value=$3`,
          [req.params.id, fieldId, value]
        );
      }
      const { rows: [saved] } = await client.query('SELECT * FROM acts WHERE id=$1', [req.params.id]);
      return { savedAct: saved, isFirstCompletion, hasChanges };
    });

    const shouldNotify = hasChanges && savedAct.status === 'done';
    const sheetSync = hasChanges
      ? await syncActSafely(pool, req.params.id)
      : { status: 'skipped', reason: 'unchanged' };
    const notification = shouldNotify
      ? await notifyActSafely(savedAct, isFirstCompletion)
      : { status: 'skipped', reason: hasChanges ? 'draft' : 'unchanged' };
    res.json({ ok: true, changed: hasChanges, sheetSync, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Скачать акт как DOCX
router.get('/acts/:id/docx', async (req, res) => {
  try {
    const { rows: [act] } = await pool.query('SELECT * FROM acts WHERE id=$1', [req.params.id]);
    if (!act) return res.status(404).json({ error: 'not found' });
    const { rows: values } = await pool.query('SELECT field_id, value FROM act_values WHERE act_id=$1', [act.id]);
    const { rows: photos } = await pool.query('SELECT id, field_id, filename FROM act_photos WHERE act_id=$1', [act.id]);
    const { rows: sections } = await pool.query(
      'SELECT * FROM act_sections WHERE template_id=$1 ORDER BY sort_order, id', [act.template_id]
    );
    const { rows: fields } = await pool.query(
      `SELECT f.* FROM act_fields f JOIN act_sections s ON s.id=f.section_id
       WHERE s.template_id=$1 ORDER BY f.section_id, f.sort_order`, [act.template_id]
    );
    const { rows: [tmpl] } = await pool.query('SELECT name FROM act_templates WHERE id=$1', [act.template_id]);
    const fieldsBySection = {};
    for (const f of fields) {
      if (!fieldsBySection[f.section_id]) fieldsBySection[f.section_id] = [];
      fieldsBySection[f.section_id].push({ ...f, config: JSON.parse(f.config_json || '{}') });
    }
    const template = { name: tmpl?.name || '', sections: sections.map(s => ({ ...s, fields: fieldsBySection[s.id] || [] })) };
    // Подтягиваем содержимое фото: сперва локальный диск, иначе object storage
    for (const p of photos) {
      const fp = path.join(UPLOADS_DIR, p.filename);
      if (fs.existsSync(fp)) p.buffer = fs.readFileSync(fp);
      else p.buffer = await objectStorage.downloadObject(p.filename);
    }
    const fullAct = {
      ...act,
      values: Object.fromEntries(values.map(v => [v.field_id, v.value])),
      photos,
    };
    const buf = await generateActDOCX(fullAct, template);
    const label = act.raw_material || tmpl?.name || 'Акт';
    const filename = encodeURIComponent(`Акт_${label}_${act.date}.docx`);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить акт
router.delete('/acts/:id', async (req, res) => {
  try {
    const { rows: photos } = await pool.query('SELECT filename FROM act_photos WHERE act_id=$1', [req.params.id]);
    for (const p of photos) {
      await objectStorage.deleteObject(p.filename).catch(() => {});
      const fp = path.join(UPLOADS_DIR, p.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await pool.query('DELETE FROM acts WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузить фото к акту
router.post('/acts/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const actId = req.params.id;
    const fieldId = req.body.field_id || null;
    const saved = [];
    for (const file of (req.files || [])) {
      const filename = makeActFilename(file.originalname);
      await objectStorage.putObject(filename, file.buffer);
      await pool.query(
        'INSERT INTO act_photos(act_id,field_id,filename) VALUES($1,$2,$3)',
        [actId, fieldId, filename]
      );
      saved.push({ filename, field_id: fieldId ? Number(fieldId) : null });
    }
    res.json({ ok: true, files: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить фото
router.delete('/acts/photos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await pool.query('DELETE FROM act_photos WHERE filename=$1', [filename]);
    await objectStorage.deleteObject(filename).catch(() => {});
    const fp = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

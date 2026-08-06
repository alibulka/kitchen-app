const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('../db');
const { generateTemplateDOCX, generateActDOCX } = require('../docx-gen');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `act-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// ─── Шаблоны ──────────────────────────────────────────────────────────────────

// Список шаблонов
router.get('/templates', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, created_at FROM act_templates ORDER BY id DESC');
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
        ({ rows: savedValues } = await client.query(
          'SELECT act_id, field_id, value FROM act_values WHERE field_id = ANY($1)', [oldFieldIds]
        ));
        ({ rows: savedPhotos } = await client.query(
          'SELECT id, field_id FROM act_photos WHERE field_id = ANY($1)', [oldFieldIds]
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
    await pool.query('DELETE FROM act_templates WHERE id=$1', [req.params.id]);
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
             a.product_name, a.manufacturer, a.conclusion,
             a.status, a.created_at, t.name AS template_name
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
    const { template_id, date, raw_material, product_name, manufacturer } = req.body;
    if (!template_id || !date) return res.status(400).json({ error: 'template_id and date required' });
    const { rows: [act] } = await pool.query(
      'INSERT INTO acts(template_id,date,raw_material,product_name,manufacturer) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [template_id, date, raw_material || '', product_name || '', manufacturer || '']
    );
    res.json({ ok: true, id: act.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранить значения акта
router.put('/acts/:id', async (req, res) => {
  try {
    const { values = {}, status, raw_material, product_name, manufacturer, conclusion } = req.body;
    await pool.withTransaction(async (client) => {
      const sets = [];
      const params = [];
      if (status) { sets.push(`status=$${params.length+1}`); params.push(status); }
      if (raw_material !== undefined) { sets.push(`raw_material=$${params.length+1}`); params.push(raw_material); }
      if (product_name !== undefined) { sets.push(`product_name=$${params.length+1}`); params.push(product_name); }
      if (manufacturer !== undefined) { sets.push(`manufacturer=$${params.length+1}`); params.push(manufacturer); }
      if (conclusion !== undefined) { sets.push(`conclusion=$${params.length+1}`); params.push(conclusion); }
      if (sets.length > 0) {
        sets.push(`updated_at=(NOW()::text)`);
        params.push(req.params.id);
        await client.query(`UPDATE acts SET ${sets.join(',')} WHERE id=$${params.length}`, params);
      }
      for (const [fieldId, value] of Object.entries(values)) {
        await client.query(
          `INSERT INTO act_values(act_id,field_id,value) VALUES($1,$2,$3)
           ON CONFLICT(act_id,field_id) DO UPDATE SET value=$3`,
          [req.params.id, fieldId, value == null ? null : String(value)]
        );
      }
    });
    res.json({ ok: true });
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
      await pool.query(
        'INSERT INTO act_photos(act_id,field_id,filename) VALUES($1,$2,$3)',
        [actId, fieldId, file.filename]
      );
      saved.push({ filename: file.filename, field_id: fieldId ? Number(fieldId) : null });
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
    const fp = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

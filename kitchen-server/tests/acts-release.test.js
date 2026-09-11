// Explicit opt-in. All tables/sequences are temporary and rolled back on exit.
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('release: create/edit act, retain values and photos when adding template fields',
  { skip: process.env.PRORABOTKI_DB_TESTS !== 'true' }, async () => {
    assert.notEqual(process.env.PRORABOTKI_WRITE_ENABLED, 'true', 'Never run this test with live writes enabled');
    const { Client } = require('pg');
    const express = require('express');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    let server;
    await client.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET LOCAL search_path TO pg_temp');
      await client.query(`
        CREATE TEMP TABLE act_templates(id SERIAL PRIMARY KEY,name TEXT,updated_at TEXT,archived INTEGER DEFAULT 0);
        CREATE TEMP TABLE act_sections(id SERIAL PRIMARY KEY,template_id INTEGER REFERENCES act_templates(id) ON DELETE CASCADE,title TEXT,sort_order INTEGER);
        CREATE TEMP TABLE act_fields(id SERIAL PRIMARY KEY,section_id INTEGER REFERENCES act_sections(id) ON DELETE CASCADE,
          label TEXT,description TEXT,type TEXT,required INTEGER,config_json TEXT,sort_order INTEGER,show_if_field TEXT,show_if_value TEXT);
        CREATE TEMP TABLE acts(id SERIAL PRIMARY KEY,template_id INTEGER REFERENCES act_templates(id),date TEXT,
          raw_material TEXT,product_name TEXT,manufacturer TEXT,supplier TEXT,gross_mass REAL,defrost_mass REAL,
          source_row TEXT,source_sheet TEXT,source_product_name TEXT,conclusion TEXT,status TEXT DEFAULT 'draft',
          created_at TEXT DEFAULT NOW()::text,updated_at TEXT DEFAULT NOW()::text);
        CREATE TEMP TABLE act_values(id SERIAL PRIMARY KEY,act_id INTEGER REFERENCES acts(id) ON DELETE CASCADE,
          field_id INTEGER REFERENCES act_fields(id) ON DELETE CASCADE,value TEXT,UNIQUE(act_id,field_id));
        CREATE TEMP TABLE act_photos(id SERIAL PRIMARY KEY,act_id INTEGER REFERENCES acts(id),field_id INTEGER,filename TEXT);
      `);
      const pool = {
        query: (...args) => client.query(...args),
        async withTransaction(fn) {
          await client.query('SAVEPOINT test_request');
          try { const result = await fn(client); await client.query('RELEASE SAVEPOINT test_request'); return result; }
          catch (error) { await client.query('ROLLBACK TO SAVEPOINT test_request'); throw error; }
        },
      };
      const dbPath = require.resolve('../db');
      require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { pool } };
      const app = express();
      app.use(express.json());
      app.use('/api/acts', require('../routes/acts'));
      server = await new Promise(resolve => {
        const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
      });
      async function request(method, path, body, expected = 200) {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/api/acts${path}`, {
          method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined,
        });
        const data = await response.json();
        assert.equal(response.status, expected, JSON.stringify(data));
        return data;
      }
      const original = { name: 'Тест', sections: [{ title: 'Качество', fields: [
        { label: 'Вкус', type: 'comment' }, { label: 'Вид', type: 'comment' },
      ] }] };
      const template = await request('POST', '/templates', original);
      const { rows: fields } = await client.query('SELECT id FROM act_fields ORDER BY id');
      const act = await request('POST', '/acts', { template_id: template.id, date: '2026-09-11',
        product_name: 'Исходное название', sheet_id: '750743492:225', source_sheet: 'Мясо' });
      assert.equal(act.sheetSync.status, 'disabled');
      const edited = await request('PUT', `/acts/${act.id}`, {
        date: '2026-09-12', product_name: 'Новое название', gross_mass: '100,5', defrost_mass: 0,
        values: { [fields[0].id]: 'Вкус хороший', [fields[1].id]: 'Вид хороший' },
      });
      assert.equal(edited.sheetSync.status, 'disabled');
      let saved = (await client.query('SELECT * FROM acts WHERE id=$1', [act.id])).rows[0];
      assert.equal(saved.date, '2026-09-12');
      assert.equal(saved.gross_mass, 100.5);
      assert.equal(saved.defrost_mass, 0);
      assert.equal(saved.source_product_name, 'Исходное название');
      await client.query('INSERT INTO act_photos(act_id,field_id,filename) VALUES($1,$2,$3)', [act.id, fields[0].id, 'test-photo.jpg']);
      const updatedTemplate = structuredClone(original);
      updatedTemplate.sections[0].fields.push({ label: 'Новое поле', type: 'comment' });
      await request('PUT', `/templates/${template.id}`, updatedTemplate);
      const { rows: retained } = await client.query(`SELECT f.label,v.value FROM act_values v
        JOIN act_fields f ON f.id=v.field_id ORDER BY f.sort_order`);
      assert.deepEqual(retained, [{ label: 'Вкус', value: 'Вкус хороший' }, { label: 'Вид', value: 'Вид хороший' }]);
      const { rows: photos } = await client.query('SELECT f.label,p.filename FROM act_photos p JOIN act_fields f ON f.id=p.field_id');
      assert.deepEqual(photos, [{ label: 'Вкус', filename: 'test-photo.jpg' }]);
      assert.equal((await client.query('SELECT COUNT(*)::int AS n FROM acts')).rows[0].n, 1);
      await request('PUT', `/acts/${act.id}`, { gross_mass: null, defrost_mass: null });
      saved = (await client.query('SELECT * FROM acts WHERE id=$1', [act.id])).rows[0];
      assert.equal(saved.gross_mass, null);
      assert.equal(saved.defrost_mass, null);
      await request('PUT', `/acts/${act.id}`, { gross_mass: 'не число' }, 400);
      assert.equal((await client.query('SELECT COUNT(*)::int AS n FROM act_values')).rows[0].n, 2);
    } finally {
      if (server) await new Promise(resolve => server.close(resolve));
      await client.query('ROLLBACK');
      await client.end();
    }
  });
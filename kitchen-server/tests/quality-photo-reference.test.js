const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { pool } = require('../db');
const objectStorage = require('../lib/objectStorage');
const router = require('../routes/quality');

test('pending and completed check photos can become references without losing either image', async t => {
  const originalQuery = pool.query;
  const originalTransaction = pool.withTransaction;
  const originalDelete = objectStorage.deleteObject;
  const originalPut = objectStorage.putObject;
  const tasks = new Map([[101, 9], [102, 9], [201, 10]]);
  const photos = [
    { id: 1, task_id: 101, filename: 'pending.jpg' },
    { id: 2, task_id: 102, filename: 'done.jpg' },
    { id: 3, task_id: 201, filename: 'other.jpg' },
  ];
  const references = [];
  const deletedFiles = [];
  const uploadedFiles = [];
  pool.query = async (sql, params = []) => {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    if (normalized.startsWith('SELECT pg_advisory_xact_lock')) return { rows: [] };
    if (normalized.startsWith('INSERT INTO quality_photos')) {
      const row = { id: 4, task_id: Number(params[0]), filename: params[1] };
      photos.push(row);
      return { rows: [row] };
    }
    if (normalized.startsWith('SELECT qp.filename, qt.standard_id')) {
      const photo = photos.find(p => p.id === params[0] && p.task_id === params[1]);
      return { rows: photo ? [{ filename: photo.filename, standard_id: tasks.get(photo.task_id) }] : [] };
    }
    if (normalized.startsWith('INSERT INTO quality_standard_photos')) {
      if (references.some(p => p.standard_id === params[0] && p.filename === params[1])) return { rows: [] };
      const row = { id: references.length + 1, standard_id: params[0], filename: params[1] };
      references.push(row);
      return { rows: [row] };
    }
    if (normalized.startsWith('SELECT id,standard_id,filename FROM quality_standard_photos')) {
      return { rows: references.filter(p => p.standard_id === params[0] && p.filename === params[1]) };
    }
    if (normalized.startsWith('DELETE FROM quality_photos')) {
      const idx = photos.findIndex(p => p.filename === params[0]);
      return { rows: idx === -1 ? [] : [photos.splice(idx, 1)[0]] };
    }
    if (normalized.startsWith('DELETE FROM quality_standard_photos')) {
      const idx = references.findIndex(p => p.filename === params[0]);
      return { rows: idx === -1 ? [] : [references.splice(idx, 1)[0]] };
    }
    if (normalized.startsWith('SELECT filename FROM quality_photos')) {
      return { rows: photos.filter(p => p.filename === params[0]) };
    }
    if (normalized.startsWith('SELECT filename FROM quality_standard_photos')) {
      return { rows: references.filter(p => p.filename === params[0]) };
    }
    throw new Error(`Unexpected query: ${normalized}`);
  };
  pool.withTransaction = async fn => fn({ query: (...args) => pool.query(...args) });
  objectStorage.deleteObject = async filename => { deletedFiles.push(filename); };
  objectStorage.putObject = async filename => { uploadedFiles.push(filename); };
  const app = express();
  app.use('/api/quality', router);
  const server = app.listen(0);
  t.after(() => {
    pool.query = originalQuery;
    pool.withTransaction = originalTransaction;
    objectStorage.deleteObject = originalDelete;
    objectStorage.putObject = originalPut;
    server.close();
  });
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/quality`;
  const post = (taskId, photoId) => fetch(`${base}/tasks/${taskId}/photos/${photoId}/reference`, { method: 'POST' });
  const remove = path => fetch(base + path, { method: 'DELETE' });

  assert.equal((await post(101, 2)).status, 404, 'Cannot promote a photo from another task');
  assert.equal((await post(101, 'bad')).status, 400);
  assert.equal((await post(101, 1)).status, 200);
  assert.equal((await post(102, 2)).status, 200, 'Completed task photos work too');
  assert.equal((await post(102, 2)).status, 200, 'Repeat promotion is idempotent');
  assert.deepEqual(references.map(p => [p.standard_id, p.filename]),
    [[9, 'pending.jpg'], [9, 'done.jpg']]);
  assert.deepEqual(photos.map(p => p.filename), ['pending.jpg', 'done.jpg', 'other.jpg'],
    'Promoting does not remove a check photo');

  const form = new FormData();
  form.append('photos', new Blob(['image'], { type: 'image/jpeg' }), 'new.jpg');
  const uploadResponse = await fetch(`${base}/tasks/101/photos`, { method: 'POST', body: form });
  assert.equal(uploadResponse.status, 200);
  const uploaded = (await uploadResponse.json()).photos[0];
  assert.equal(uploaded.id, 4, 'New photos expose an ID for immediate promotion');
  assert.equal(uploaded.task_id, 101);
  assert.deepEqual(uploadedFiles, [uploaded.filename]);
  assert.equal((await post(101, uploaded.id)).status, 200);
  assert.ok(references.some(p => p.standard_id === 9 && p.filename === uploaded.filename));

  assert.equal((await remove('/photos/pending.jpg')).status, 200);
  assert.deepEqual(deletedFiles, [], 'Removing a check photo preserves the reference image');
  assert.equal((await remove('/standard-photos/pending.jpg')).status, 200);
  assert.deepEqual(deletedFiles, ['pending.jpg']);
  assert.equal((await remove('/standard-photos/done.jpg')).status, 200);
  assert.deepEqual(deletedFiles, ['pending.jpg'], 'Removing reference preserves completed check photo');
  assert.equal((await remove('/photos/done.jpg')).status, 200);
  assert.deepEqual(deletedFiles, ['pending.jpg', 'done.jpg']);
});

test('simultaneous promotions of the same photo create one reference', async t => {
  const originalQuery = pool.query;
  const originalTransaction = pool.withTransaction;
  const references = [];
  let queue = Promise.resolve();
  let locks = 0;
  pool.withTransaction = async fn => {
    const previous = queue;
    let release;
    queue = new Promise(resolve => { release = resolve; });
    await previous;
    try { return await fn({ query: (...args) => pool.query(...args) }); }
    finally { release(); }
  };
  pool.query = async (sql, params = []) => {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    if (normalized.startsWith('SELECT qp.filename, qt.standard_id')) {
      return { rows: params[0] === 7 && params[1] === 107
        ? [{ filename: 'shared.jpg', standard_id: 9 }] : [] };
    }
    if (normalized.startsWith('SELECT pg_advisory_xact_lock')) {
      assert.equal(params[0], 'shared.jpg');
      locks++;
      return { rows: [] };
    }
    if (normalized.startsWith('INSERT INTO quality_standard_photos')) {
      if (references.length) return { rows: [] };
      const row = { id: 1, standard_id: params[0], filename: params[1] };
      references.push(row);
      return { rows: [row] };
    }
    if (normalized.startsWith('SELECT id,standard_id,filename FROM quality_standard_photos')) {
      return { rows: references };
    }
    throw new Error(`Unexpected query: ${normalized}`);
  };
  const app = express();
  app.use('/api/quality', router);
  const server = app.listen(0);
  t.after(() => {
    pool.query = originalQuery;
    pool.withTransaction = originalTransaction;
    server.close();
  });
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/quality/tasks/107/photos/7/reference`;
  const responses = await Promise.all([fetch(url, { method: 'POST' }), fetch(url, { method: 'POST' })]);
  assert.deepEqual(responses.map(r => r.status), [200, 200]);
  assert.equal(references.length, 1);
  if (process.env.DATABASE_URL) assert.equal(locks, 2, 'Both writes acquire the database-level lock');
});
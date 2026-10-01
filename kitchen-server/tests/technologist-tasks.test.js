const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { pool } = require('../db');
const router = require('../routes/technologist-tasks');

test('manager creates tasks and technologist can only complete or cancel them', async t => {
  const originalQuery = pool.query;
  const tasks = [];
  let nextId = 1;

  pool.query = async (sql, params = []) => {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    if (normalized.startsWith('INSERT INTO technologist_tasks')) {
      const task = {
        id: nextId++, title: params[0], planned_date: params[1],
        description: params[2], status: 'new', result: null,
        cancel_reason: null, actual_completed_at: null, cancelled_at: null,
      };
      tasks.push(task);
      return { rows: [{ id: task.id }], rowCount: 1 };
    }
    if (normalized.startsWith('SELECT * FROM technologist_tasks WHERE id=')) {
      return { rows: tasks.filter(task => String(task.id) === String(params[0])) };
    }
    if (normalized.startsWith('SELECT * FROM technologist_tasks')) {
      return { rows: [...tasks] };
    }
    if (normalized.startsWith('UPDATE technologist_tasks')) {
      const task = tasks.find(item => String(item.id) === String(params[1]) && item.status === 'new');
      if (!task) return { rows: [], rowCount: 0 };
      if (normalized.includes("status='completed'")) {
        assert.match(normalized, /actual_completed_at=NOW\(\)::text/);
        task.status = 'completed';
        task.result = params[0];
        task.actual_completed_at = new Date().toISOString();
      } else {
        assert.match(normalized, /cancelled_at=NOW\(\)::text/);
        task.status = 'cancelled';
        task.cancel_reason = params[0];
        task.cancelled_at = new Date().toISOString();
      }
      return { rows: [], rowCount: 1 };
    }
    if (normalized.startsWith('DELETE FROM technologist_tasks')) {
      const index = tasks.findIndex(item => String(item.id) === String(params[0]) && item.status === 'new');
      if (index === -1) return { rows: [], rowCount: 0 };
      tasks.splice(index, 1);
      return { rows: [], rowCount: 1 };
    }
    throw new Error(`Unexpected SQL: ${normalized}`);
  };

  const app = express();
  app.use(express.json());
  app.use('/api/technologist-tasks', router);
  const server = app.listen(0);
  t.after(() => {
    pool.query = originalQuery;
    server.close();
  });
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/technologist-tasks`;
  const request = (path = '', role, options = {}) => fetch(base + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-User-Role': role, ...(options.headers || {}) },
  });

  assert.equal((await request('', 'technologist', {
    method: 'POST',
    body: JSON.stringify({ title: 'Задание', planned_date: '2026-09-25', description: 'Описание' }),
  })).status, 403);
  assert.equal((await request('', 'manager', {
    method: 'POST',
    body: JSON.stringify({ title: 'Неверная дата', planned_date: '2026-02-31', description: 'Описание' }),
  })).status, 400);

  const createdResponse = await request('', 'manager', {
    method: 'POST',
    body: JSON.stringify({ title: 'Задание', planned_date: '2026-09-25', description: 'Описание' }),
  });
  assert.equal(createdResponse.status, 201);
  const created = (await createdResponse.json()).task;
  assert.equal(created.status, 'new');

  assert.equal((await request(`/${created.id}/complete`, 'manager', {
    method: 'PATCH', body: JSON.stringify({ result: 'Готово' }),
  })).status, 403);
  assert.equal((await request(`/${created.id}/complete`, 'technologist', {
    method: 'PATCH', body: JSON.stringify({ result: '' }),
  })).status, 400);

  const completedResponse = await request(`/${created.id}/complete`, 'technologist', {
    method: 'PATCH', body: JSON.stringify({ result: 'Готово' }),
  });
  assert.equal(completedResponse.status, 200);
  const completed = (await completedResponse.json()).task;
  assert.equal(completed.status, 'completed');
  assert.equal(completed.result, 'Готово');
  assert.ok(completed.actual_completed_at);
  assert.equal((await request(`/${created.id}/cancel`, 'technologist', {
    method: 'PATCH', body: JSON.stringify({ reason: 'Поздно' }),
  })).status, 409);

  const second = (await (await request('', 'manager', {
    method: 'POST',
    body: JSON.stringify({ title: 'Второе', planned_date: '2026-09-26', description: 'Описание' }),
  })).json()).task;
  assert.equal((await request(`/${second.id}/cancel`, 'technologist', {
    method: 'PATCH', body: JSON.stringify({ reason: '   ' }),
  })).status, 400);
  const cancelledResponse = await request(`/${second.id}/cancel`, 'technologist', {
    method: 'PATCH', body: JSON.stringify({ reason: 'Больше не требуется' }),
  });
  assert.equal(cancelledResponse.status, 200);
  const cancelled = (await cancelledResponse.json()).task;
  assert.equal(cancelled.cancel_reason, 'Больше не требуется');
  assert.ok(cancelled.cancelled_at);

  assert.equal((await request(`/${second.id}`, 'manager', { method: 'DELETE' })).status, 409);

  const third = (await (await request('', 'manager', {
    method: 'POST',
    body: JSON.stringify({ title: 'Удаляемое', planned_date: '2026-09-27', description: 'Описание' }),
  })).json()).task;
  assert.equal((await request(`/${third.id}`, 'technologist', { method: 'DELETE' })).status, 403);
  assert.equal((await request(`/${third.id}`, 'manager', { method: 'DELETE' })).status, 200);
  const list = await (await request('', 'technologist')).json();
  assert.equal(list.tasks.length, 2);
});
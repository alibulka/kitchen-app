const express = require('express');
const router = express.Router();
const { pool } = require('../db');

function parseShops(row) {
  if (row.shops) {
    try { return JSON.parse(row.shops); } catch (_) {}
  }
  return row.shop ? [row.shop] : [];
}

function serializeEmployee(row) {
  const shops = parseShops(row);
  const storedArchives = JSON.parse(row.archived_shops || '[]');
  // Previous global archives stay archived in every assigned shop.
  const archivedShops = Number(row.active) === 0
    ? [...shops] : storedArchives.filter(shop => shops.includes(shop));
  return { id: row.id, name: row.name, shop: row.shop, shops, archivedShops, active: Number(row.active) };
}

const EMPLOYEE_FIELDS = 'id, name, shop, shops, active, archived_shops';

// Compare-and-swap prevents concurrent edits in different shops losing an archive.
// It works with both PostgreSQL and the local SQLite adapter.
async function changeEmployee(id, change) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { rows: [row] } = await pool.query(`SELECT ${EMPLOYEE_FIELDS} FROM employees WHERE id=$1`, [id]);
    if (!row) throw Object.assign(new Error('Сотрудник не найден'), { status: 404 });
    const next = change(serializeEmployee(row));
    const archivedShops = [...new Set(next.archivedShops)].filter(shop => next.shops.includes(shop));
    const active = next.shops.some(shop => !archivedShops.includes(shop)) ? 1 : 0;
    const result = await pool.query(
      `UPDATE employees SET name=$1, shop=$2, shops=$3, archived_shops=$4, active=$5, updated_at=NOW()::text
       WHERE id=$6 AND active=$7 AND archived_shops=$8 AND COALESCE(shops,'')=$9 AND shop=$10 AND name=$11`,
      [next.name, next.shops[0], JSON.stringify(next.shops), JSON.stringify(archivedShops), active,
        id, row.active, row.archived_shops || '[]', row.shops || '', row.shop, row.name]
    );
    if (result.rowCount) {
      const { rows: [updated] } = await pool.query(`SELECT ${EMPLOYEE_FIELDS} FROM employees WHERE id=$1`, [id]);
      return serializeEmployee(updated);
    }
  }
  throw Object.assign(new Error('Сотрудник изменён на другом устройстве. Повторите действие.'), { status: 409 });
}

function notifyEmployeesChanged(req) {
  const wss = req.app.get('wss');
  if (!wss) return;
  const message = JSON.stringify({ type: 'employees_updated' });
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      try { client.send(message); } catch (_) { /* Another tablet may have disconnected. */ }
    }
  });
}

router.get('/', async (req, res) => {
  try {
    const includeArchived = req.query.include_archived === '1';
    const { rows } = await pool.query(
      `SELECT ${EMPLOYEE_FIELDS} FROM employees${includeArchived ? '' : ' WHERE active = 1'} ORDER BY name`
    );
    res.json({ employees: rows.map(serializeEmployee) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, name, shops, shop } = req.body;
  if (!name || !id) return res.status(400).json({ error: 'id and name required' });
  // Принимаем и новый формат (shops: []), и старый (shop: '') — со старых кешированных страниц
  const shopsArr = Array.isArray(shops) && shops.length > 0 ? shops
    : (shop && String(shop).trim() ? [String(shop).trim()] : []);
  if (shopsArr.length === 0) return res.status(400).json({ error: 'shops required — сотрудник без цеха не сохраняется' });
  const shopLegacy = shopsArr[0];
  try {
    const { rows: [existing] } = await pool.query(`SELECT ${EMPLOYEE_FIELDS} FROM employees WHERE id=$1`, [id]);
    if (existing) {
      await changeEmployee(id, employee => ({ ...employee, name: name.trim(), shops: shopsArr }));
    } else {
      await pool.query(`
        INSERT INTO employees(id, name, shop, shops, active, updated_at)
        VALUES($1, $2, $3, $4, 1, NOW()::text)
        ON CONFLICT(id) DO UPDATE SET
          name = $2, shop = $3, shops = $4, updated_at = NOW()::text
      `, [id, name.trim(), shopLegacy, JSON.stringify(shopsArr)]);
    }
    res.json({ ok: true });
    notifyEmployeesChanged(req);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, shops, shop } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const shopsArr = Array.isArray(shops) && shops.length > 0 ? shops
    : (shop && String(shop).trim() ? [String(shop).trim()] : []);
  if (shopsArr.length === 0) return res.status(400).json({ error: 'shops required — сотрудник без цеха не сохраняется' });
  try {
    const employee = await changeEmployee(req.params.id, employee => ({
      ...employee, name: name.trim(), shops: shopsArr,
    }));
    res.json({ ok: true, employee });
    notifyEmployeesChanged(req);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/:id/archive', async (req, res) => {
  const { archived, shop } = req.body;
  if (typeof archived !== 'boolean') return res.status(400).json({ error: 'archived must be a boolean' });
  if (typeof shop !== 'string' || !shop.trim()) return res.status(400).json({ error: 'Укажите цех' });
  try {
    const employee = await changeEmployee(req.params.id, employee => {
      if (!employee.shops.includes(shop)) throw Object.assign(new Error('Сотрудник не относится к этому цеху'), { status: 400 });
      return { ...employee, archivedShops: archived
        ? [...employee.archivedShops, shop]
        : employee.archivedShops.filter(name => name !== shop) };
    });
    res.json({ ok: true, employee });
    notifyEmployeesChanged(req);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      "UPDATE employees SET active = 0, updated_at = NOW()::text WHERE id = $1",
      [req.params.id]
    );
    res.json({ ok: true });
    notifyEmployeesChanged(req);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

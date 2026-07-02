const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// ─── Чтение техкарты ──────────────────────────────────────────────────────────

async function buildTechcard(id) {
  const { rows: [row] } = await pool.query(
    'SELECT id, name, filename, created_at FROM techcards WHERE id = $1', [id]
  );
  if (!row) return null;

  const [
    { rows: stationRows },
    { rows: itemRows },
    { rows: treeRows },
    { rows: ingredRows },
    { rows: packLineRows },
  ] = await Promise.all([
    pool.query(
      'SELECT station_key, shop_name, station_name FROM techcard_stations WHERE techcard_id = $1 ORDER BY sort_order',
      [id]
    ),
    pool.query(`
      SELECT tsi.station_key, tsi.item_id, i.name AS item_name, tsi.sort_order
      FROM techcard_station_items tsi
      JOIN items i ON i.item_id = tsi.item_id
      WHERE tsi.techcard_id = $1
      ORDER BY tsi.station_key, tsi.sort_order
    `, [id]),
    pool.query(`
      WITH RECURSIVE all_sp(parent_id, sub_item_id, sub_item_name, sort_order, yield_amount) AS (
        SELECT isp.item_id, isp.sub_item_id, isp.sub_item_name, isp.sort_order,
               COALESCE(i.yield_amount, 0)
        FROM item_sub_preps isp
        LEFT JOIN items i ON i.item_id = isp.sub_item_id
        WHERE isp.item_id IN (SELECT item_id FROM techcard_station_items WHERE techcard_id = $1)
        UNION ALL
        SELECT isp.item_id, isp.sub_item_id, isp.sub_item_name, isp.sort_order,
               COALESCE(i.yield_amount, 0)
        FROM item_sub_preps isp
        JOIN all_sp ON isp.item_id = all_sp.sub_item_id
        LEFT JOIN items i ON i.item_id = isp.sub_item_id
      )
      SELECT * FROM all_sp ORDER BY parent_id, sort_order
    `, [id]),
    pool.query(`
      SELECT ii.item_id, ii.ing_id, ii.ing_name, ii.plan_amount, ii.unit
      FROM item_ingredients ii
      WHERE ii.item_id IN (SELECT item_id FROM techcard_station_items WHERE techcard_id = $1)
      ORDER BY ii.item_id, ii.sort_order
    `, [id]),
    pool.query(`
      SELECT item_id, line_idx, volume, pack_name, destination, from_warehouse, qty
      FROM techcard_pack_lines WHERE techcard_id = $1 ORDER BY item_id, line_idx
    `, [id]),
  ]);

  // Дедупликация: (parent_id, sub_item_id) может дублироваться если позиция одновременно
  // является самостоятельной позицией техкарты и подзаготовкой другой позиции
  const treeRowsDedup = [];
  const treeSeen = new Set();
  for (const r of treeRows) {
    const k = `${r.parent_id}:${r.sub_item_id}`;
    if (!treeSeen.has(k)) { treeSeen.add(k); treeRowsDedup.push(r); }
  }

  // Граммовки подзаготовок (трёхуровневый ключ: grandparent:parent:sub)
  const allParentIds = new Set(itemRows.map(r => r.item_id));
  for (const r of treeRowsDedup) allParentIds.add(r.parent_id);

  let subIngredRows = [];
  if (allParentIds.size > 0) {
    const ids = [...allParentIds];
    const ph = ids.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await pool.query(
      `SELECT grandparent_item_id, item_id, sub_item_id, ing_id, ing_name, plan_amount, unit
       FROM sub_prep_ingredients WHERE item_id IN (${ph})
       ORDER BY grandparent_item_id, item_id, sub_item_id, sort_order`,
      ids
    );
    subIngredRows = rows;
  }

  // ─── Карты для быстрого поиска ───────────────────────────────────────────────

  const ingredMap = groupBy(ingredRows, 'item_id', r => ({
    id: r.ing_id, name: r.ing_name, planAmount: r.plan_amount, unit: r.unit,
  }));

  // Трёхуровневый ключ позволяет различать граммовки одной подзаготовки в разных контекстах
  const subIngredMap = {};
  for (const r of subIngredRows) {
    const key = `${r.grandparent_item_id}:${r.item_id}:${r.sub_item_id}`;
    if (!subIngredMap[key]) subIngredMap[key] = [];
    subIngredMap[key].push({ id: r.ing_id, name: r.ing_name, planAmount: r.plan_amount, unit: r.unit });
  }

  const childrenByParent = groupBy(treeRowsDedup, 'parent_id', r => ({
    id: r.sub_item_id, name: r.sub_item_name, yieldAmount: r.yield_amount || 0,
  }));

  // ─── Рекурсивное построение дерева подзаготовок ──────────────────────────────

  function buildSubPreps(parentId, parentIngreds, grandparentId = 0) {
    return (childrenByParent[parentId] || []).map(child => {
      const ownIngreds = subIngredMap[`${grandparentId}:${parentId}:${child.id}`] || [];
      const usageEntry = (parentIngreds || []).find(ing => ing.id === child.id);
      const grandchildren = buildSubPreps(child.id, ownIngreds, parentId);
      const grandchildIds = new Set(grandchildren.map(gc => gc.id));
      return {
        id:          child.id,
        name:        child.name,
        yieldAmount: child.yieldAmount,
        usageAmount: usageEntry?.planAmount,
        ingredients: ownIngreds.filter(ing => !grandchildIds.has(ing.id)),
        ...(grandchildren.length > 0 ? { subPreps: grandchildren } : {}),
      };
    });
  }

  // ─── Сборка станций ──────────────────────────────────────────────────────────

  const itemsByStation = groupBy(itemRows, 'station_key', r => {
    const mainIngreds = ingredMap[r.item_id] || [];
    const directSubPrepIds = new Set((childrenByParent[r.item_id] || []).map(c => c.id));
    const subPreps = buildSubPreps(r.item_id, mainIngreds, 0);
    return {
      id:          r.item_id,
      name:        r.item_name,
      ingredients: mainIngreds.filter(ing => !directSubPrepIds.has(ing.id)),
      ...(subPreps.length > 0 ? { subPreps } : {}),
    };
  });

  const stations = stationRows.map(st => ({
    key:   st.station_key,
    shop:  st.shop_name,
    name:  st.station_name || st.shop_name,
    items: itemsByStation[st.station_key] || [],
  }));

  const items = groupBy(packLineRows, 'item_id', r => ({
    volume: r.volume, packName: r.pack_name,
    destination: r.destination, fromWarehouse: r.from_warehouse, qty: r.qty,
  }));

  return { ...row, items, stations };
}

// ─── Запись техкарты ─────────────────────────────────────────────────────────

// Рекурсивно сохраняет подзаготовки. grandparentId — для трёхуровневого ключа граммовок.
async function saveSubPrepsOf(client, parentId, subPreps, grandparentId = 0) {
  if (!subPreps?.length) return;

  await client.query('DELETE FROM item_sub_preps WHERE item_id = $1', [parentId]);
  await client.query(
    'DELETE FROM sub_prep_ingredients WHERE grandparent_item_id = $1 AND item_id = $2',
    [grandparentId, parentId]
  );

  for (let i = 0; i < subPreps.length; i++) {
    const sp = subPreps[i];
    await client.query(
      'INSERT INTO items(item_id, name, yield_amount, updated_at) VALUES($1,$2,$3,NOW()::text) ON CONFLICT(item_id) DO UPDATE SET name=$2, yield_amount=$3, updated_at=NOW()::text',
      [sp.id, sp.name, sp.yieldAmount || 0]
    );
    await client.query(
      'INSERT INTO item_sub_preps(item_id, sub_item_id, sub_item_name, sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(item_id, sub_item_id) DO UPDATE SET sub_item_name=$3, sort_order=$4',
      [parentId, sp.id, sp.name, i]
    );
    for (let j = 0; j < (sp.ingredients?.length || 0); j++) {
      const ing = sp.ingredients[j];
      await client.query(
        'INSERT INTO sub_prep_ingredients(grandparent_item_id, item_id, sub_item_id, sort_order, ing_id, ing_name, plan_amount, unit) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
        [grandparentId, parentId, sp.id, j, ing.id, ing.name, ing.planAmount || 0, ing.unit || 'г']
      );
    }
    if (sp.subPreps?.length) {
      await saveSubPrepsOf(client, sp.id, sp.subPreps, parentId);
    }
  }
}

async function saveTechcardData(client, techcardId, items, stations) {
  for (const st of (stations || [])) {
    for (const item of (st.items || [])) {
      await client.query(
        'INSERT INTO items(item_id, name, yield_amount, updated_at) VALUES($1,$2,$3,NOW()::text) ON CONFLICT(item_id) DO UPDATE SET name=$2, yield_amount=$3, updated_at=NOW()::text',
        [item.id, item.name, item.yieldAmount || 0]
      );
      if (item.subPreps?.length) {
        await saveSubPrepsOf(client, item.id, item.subPreps);
      }
      if (item.ingredients?.length) {
        await client.query('DELETE FROM item_ingredients WHERE item_id = $1', [item.id]);
        for (let i = 0; i < item.ingredients.length; i++) {
          const ing = item.ingredients[i];
          await client.query(
            'INSERT INTO item_ingredients(item_id, sort_order, ing_id, ing_name, plan_amount, unit) VALUES($1,$2,$3,$4,$5,$6)',
            [item.id, i, ing.id, ing.name, ing.planAmount || 0, ing.unit || 'г']
          );
        }
      }
    }
  }

  for (let stIdx = 0; stIdx < (stations || []).length; stIdx++) {
    const st = stations[stIdx];
    await client.query(
      'INSERT INTO techcard_stations(techcard_id, station_key, shop_name, station_name, sort_order) VALUES($1,$2,$3,$4,$5) ON CONFLICT(techcard_id, station_key) DO UPDATE SET shop_name=$3, station_name=$4, sort_order=$5',
      [techcardId, st.key, st.shop, st.name || '', stIdx]
    );
    for (let itemIdx = 0; itemIdx < (st.items || []).length; itemIdx++) {
      await client.query(
        'INSERT INTO techcard_station_items(techcard_id, station_key, item_id, sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(techcard_id, station_key, item_id) DO UPDATE SET sort_order=$4',
        [techcardId, st.key, st.items[itemIdx].id, itemIdx]
      );
    }
  }

  for (const [itemId, lines] of Object.entries(items || {})) {
    if (!Array.isArray(lines)) continue;
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      await client.query(
        'INSERT INTO techcard_pack_lines(techcard_id, item_id, line_idx, volume, pack_name, destination, from_warehouse, qty) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(techcard_id, item_id, line_idx) DO UPDATE SET volume=$4, pack_name=$5, destination=$6, from_warehouse=$7, qty=$8',
        [techcardId, Number(itemId), lineIdx, line.volume || '', line.packName || '', line.destination || '', line.fromWarehouse || 0, line.qty || 0]
      );
    }
  }
}

// ─── Маршруты ─────────────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, filename, created_at FROM techcards ORDER BY created_at DESC'
    );
    res.json({ techcards: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tc = await buildTechcard(req.params.id);
    if (!tc) return res.status(404).json({ error: 'not found' });
    res.json({ techcard: tc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, filename, items, stations } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  try {
    const { id } = await pool.withTransaction(async (client) => {
      const { rows: [tc] } = await client.query(
        "INSERT INTO techcards(name, filename, items_json) VALUES($1,$2,'{}') RETURNING id",
        [name, filename || null]
      );
      await saveTechcardData(client, tc.id, items || {}, stations || []);
      return tc;
    });
    res.json({ id, ok: true });
  } catch (err) {
    console.error('POST /api/techcards error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    await pool.query('UPDATE techcards SET name = $1 WHERE id = $2', [name, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.withTransaction(async (client) => {
      await client.query('UPDATE shifts SET techcard_id = NULL WHERE techcard_id = $1', [req.params.id]);
      await client.query('DELETE FROM techcards WHERE id = $1', [req.params.id]);
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Утилиты ─────────────────────────────────────────────────────────────────

// Группирует массив строк по ключу, применяя mapper к каждой строке.
function groupBy(rows, key, mapper) {
  const result = {};
  for (const r of rows) {
    if (!result[r[key]]) result[r[key]] = [];
    result[r[key]].push(mapper(r));
  }
  return result;
}

module.exports = router;

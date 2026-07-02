const express = require('express');
const router = express.Router();
const { pool } = require('../db');

async function buildTechcard(id) {
  const { rows: [row] } = await pool.query(
    'SELECT id, name, filename, created_at FROM techcards WHERE id = $1', [id]
  );
  if (!row) return null;

  const { rows: stationRows } = await pool.query(
    'SELECT station_key, shop_name, station_name FROM techcard_stations WHERE techcard_id = $1 ORDER BY sort_order',
    [id]
  );

  const { rows: itemRows } = await pool.query(`
    SELECT tsi.station_key, tsi.item_id, i.name AS item_name, tsi.sort_order
    FROM techcard_station_items tsi
    JOIN items i ON i.item_id = tsi.item_id
    WHERE tsi.techcard_id = $1
    ORDER BY tsi.station_key, tsi.sort_order
  `, [id]);

  const { rows: subPrepRows } = await pool.query(`
    SELECT isp.item_id, isp.sub_item_id, isp.sub_item_name, i.yield_amount
    FROM item_sub_preps isp
    LEFT JOIN items i ON i.item_id = isp.sub_item_id
    WHERE isp.item_id IN (
      SELECT item_id FROM techcard_station_items WHERE techcard_id = $1
    )
    ORDER BY isp.item_id, isp.sort_order
  `, [id]);

  // Ингредиенты главных позиций + ингредиенты подзаготовок
  const { rows: ingredRows } = await pool.query(`
    SELECT ii.item_id, ii.ing_id, ii.ing_name, ii.plan_amount, ii.unit
    FROM item_ingredients ii
    WHERE ii.item_id IN (
      SELECT item_id FROM techcard_station_items WHERE techcard_id = $1
      UNION
      SELECT sub_item_id FROM item_sub_preps
      WHERE item_id IN (SELECT item_id FROM techcard_station_items WHERE techcard_id = $1)
    )
    ORDER BY ii.item_id, ii.sort_order
  `, [id]);

  const { rows: packLineRows } = await pool.query(`
    SELECT item_id, line_idx, volume, pack_name, destination, from_warehouse, qty
    FROM techcard_pack_lines WHERE techcard_id = $1 ORDER BY item_id, line_idx
  `, [id]);

  // Строим ingredMap для всех item_id (главные + подзаготовки)
  const ingredMap = {};
  for (const r of ingredRows) {
    if (!ingredMap[r.item_id]) ingredMap[r.item_id] = [];
    ingredMap[r.item_id].push({ id: r.ing_id, name: r.ing_name, planAmount: r.plan_amount, unit: r.unit });
  }

  const subPrepsMap = {};
  for (const r of subPrepRows) {
    if (!subPrepsMap[r.item_id]) subPrepsMap[r.item_id] = [];
    subPrepsMap[r.item_id].push({
      id:          r.sub_item_id,
      name:        r.sub_item_name,
      yieldAmount: r.yield_amount || 0,
      ingredients: ingredMap[r.sub_item_id] || []
    });
  }

  const itemsMap = {};
  for (const r of itemRows) {
    if (!itemsMap[r.station_key]) itemsMap[r.station_key] = [];
    const item = { id: r.item_id, name: r.item_name };
    if (subPrepsMap[r.item_id]) item.subPreps = subPrepsMap[r.item_id];
    if (ingredMap[r.item_id])   item.ingredients = ingredMap[r.item_id];
    itemsMap[r.station_key].push(item);
  }

  const stations = stationRows.map(st => ({
    key:   st.station_key,
    shop:  st.shop_name,
    name:  st.station_name || st.shop_name,
    items: itemsMap[st.station_key] || []
  }));

  const items = {};
  for (const r of packLineRows) {
    if (!items[r.item_id]) items[r.item_id] = [];
    items[r.item_id].push({
      volume:        r.volume,
      packName:      r.pack_name,
      destination:   r.destination,
      fromWarehouse: r.from_warehouse,
      qty:           r.qty
    });
  }

  return { ...row, items, stations };
}

async function saveTechcardData(client, techcardId, items, stations) {
  // Глобальный каталог
  for (const st of (stations || [])) {
    for (const item of (st.items || [])) {
      await client.query(
        'INSERT INTO items(item_id, name, yield_amount, updated_at) VALUES($1,$2,$3,NOW()::text) ON CONFLICT(item_id) DO UPDATE SET name=$2, yield_amount=$3, updated_at=NOW()::text',
        [item.id, item.name, item.yieldAmount || 0]
      );

      // Подзаготовки: сохраняем как отдельные items с ингредиентами
      if (item.subPreps && item.subPreps.length > 0) {
        await client.query('DELETE FROM item_sub_preps WHERE item_id = $1', [item.id]);
        for (let i = 0; i < item.subPreps.length; i++) {
          const sp = item.subPreps[i];
          // Подзаготовка — тоже item в глобальном каталоге
          await client.query(
            'INSERT INTO items(item_id, name, yield_amount, updated_at) VALUES($1,$2,$3,NOW()::text) ON CONFLICT(item_id) DO UPDATE SET name=$2, yield_amount=$3, updated_at=NOW()::text',
            [sp.id, sp.name, sp.yieldAmount || 0]
          );
          await client.query(
            'INSERT INTO item_sub_preps(item_id,sub_item_id,sub_item_name,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(item_id,sub_item_id) DO UPDATE SET sub_item_name=$3, sort_order=$4',
            [item.id, sp.id, sp.name, i]
          );
          // Ингредиенты подзаготовки
          if (sp.ingredients && sp.ingredients.length > 0) {
            await client.query('DELETE FROM item_ingredients WHERE item_id = $1', [sp.id]);
            for (let j = 0; j < sp.ingredients.length; j++) {
              const ing = sp.ingredients[j];
              await client.query(
                'INSERT INTO item_ingredients(item_id,sort_order,ing_id,ing_name,plan_amount,unit) VALUES($1,$2,$3,$4,$5,$6)',
                [sp.id, j, ing.id, ing.name, ing.planAmount || 0, ing.unit || 'г']
              );
            }
          }
        }
      }

      // Ингредиенты главной позиции
      if (item.ingredients && item.ingredients.length > 0) {
        await client.query('DELETE FROM item_ingredients WHERE item_id = $1', [item.id]);
        for (let i = 0; i < item.ingredients.length; i++) {
          const ing = item.ingredients[i];
          await client.query(
            'INSERT INTO item_ingredients(item_id,sort_order,ing_id,ing_name,plan_amount,unit) VALUES($1,$2,$3,$4,$5,$6)',
            [item.id, i, ing.id, ing.name, ing.planAmount || 0, ing.unit || 'г']
          );
        }
      }
    }
  }

  // Данные техкарты
  for (let stIdx = 0; stIdx < (stations || []).length; stIdx++) {
    const st = stations[stIdx];
    await client.query(
      'INSERT INTO techcard_stations(techcard_id,station_key,shop_name,station_name,sort_order) VALUES($1,$2,$3,$4,$5) ON CONFLICT(techcard_id,station_key) DO UPDATE SET shop_name=$3,station_name=$4,sort_order=$5',
      [techcardId, st.key, st.shop, st.name || '', stIdx]
    );
    for (let itemIdx = 0; itemIdx < (st.items || []).length; itemIdx++) {
      const item = st.items[itemIdx];
      await client.query(
        'INSERT INTO techcard_station_items(techcard_id,station_key,item_id,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(techcard_id,station_key,item_id) DO UPDATE SET sort_order=$4',
        [techcardId, st.key, item.id, itemIdx]
      );
    }
  }

  for (const [itemId, lines] of Object.entries(items || {})) {
    if (!Array.isArray(lines)) continue;
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      await client.query(
        'INSERT INTO techcard_pack_lines(techcard_id,item_id,line_idx,volume,pack_name,destination,from_warehouse,qty) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(techcard_id,item_id,line_idx) DO UPDATE SET volume=$4,pack_name=$5,destination=$6,from_warehouse=$7,qty=$8',
        [techcardId, Number(itemId), lineIdx, line.volume||'', line.packName||'', line.destination||'', line.fromWarehouse||0, line.qty||0]
      );
    }
  }
}

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

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [tc] } = await client.query(
      "INSERT INTO techcards(name, filename, items_json) VALUES($1,$2,'{}') RETURNING id",
      [name, filename || null]
    );
    await saveTechcardData(client, tc.id, items || {}, stations || []);
    await client.query('COMMIT');
    res.json({ id: tc.id, ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/techcards error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE shifts SET techcard_id = NULL WHERE techcard_id = $1', [req.params.id]);
    await client.query('DELETE FROM techcards WHERE id = $1', [req.params.id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;

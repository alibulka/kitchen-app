const express = require('express');
const router = express.Router();
const db = require('../db');

// Собрать техкарту из нормализованных таблиц
function buildTechcard(id) {
  const row = db.prepare(
    'SELECT id, name, filename, created_at FROM techcards WHERE id = ?'
  ).get(id);
  if (!row) return null;

  const stationRows = db.prepare(
    'SELECT station_key, shop_name, station_name FROM techcard_stations WHERE techcard_id = ? ORDER BY sort_order'
  ).all(id);

  // Позиции: join через глобальный каталог
  const itemRows = db.prepare(`
    SELECT tsi.station_key, tsi.item_id, i.name AS item_name, tsi.sort_order
    FROM techcard_station_items tsi
    JOIN items i ON i.item_id = tsi.item_id
    WHERE tsi.techcard_id = ?
    ORDER BY tsi.station_key, tsi.sort_order
  `).all(id);

  // Подзаготовки из глобального каталога
  const subPrepRows = db.prepare(`
    SELECT isp.item_id, isp.sub_item_id, isp.sub_item_name
    FROM item_sub_preps isp
    WHERE isp.item_id IN (
      SELECT item_id FROM techcard_station_items WHERE techcard_id = ?
    )
    ORDER BY isp.item_id, isp.sort_order
  `).all(id);

  // Ингредиенты из глобального каталога
  const ingredRows = db.prepare(`
    SELECT ii.item_id, ii.ing_id, ii.ing_name, ii.plan_amount, ii.unit
    FROM item_ingredients ii
    WHERE ii.item_id IN (
      SELECT item_id FROM techcard_station_items WHERE techcard_id = ?
    )
    ORDER BY ii.item_id, ii.sort_order
  `).all(id);

  // План упаковки (специфичен для этой техкарты)
  const packLineRows = db.prepare(`
    SELECT item_id, line_idx, volume, pack_name, destination, from_warehouse, qty
    FROM techcard_pack_lines
    WHERE techcard_id = ?
    ORDER BY item_id, line_idx
  `).all(id);

  // Группируем
  const subPrepsMap = {};
  for (const r of subPrepRows) {
    if (!subPrepsMap[r.item_id]) subPrepsMap[r.item_id] = [];
    subPrepsMap[r.item_id].push({ id: r.sub_item_id, name: r.sub_item_name });
  }

  const ingredMap = {};
  for (const r of ingredRows) {
    if (!ingredMap[r.item_id]) ingredMap[r.item_id] = [];
    ingredMap[r.item_id].push({ id: r.ing_id, name: r.ing_name, planAmount: r.plan_amount, unit: r.unit });
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

// Записать техкарту: upsert позиции в глобальный каталог, затем данные техкарты
function saveTechcardData(techcardId, items, stations) {
  // Глобальный каталог (items, sub_preps, ingredients) — INSERT OR REPLACE
  // чтобы обновлять рецепт, если он изменился
  const upsertItem = db.prepare(
    'INSERT OR REPLACE INTO items(item_id, name, updated_at) VALUES(?, ?, datetime(\'now\'))'
  );
  const delSubPreps = db.prepare('DELETE FROM item_sub_preps WHERE item_id = ?');
  const insSub      = db.prepare(
    'INSERT OR IGNORE INTO item_sub_preps(item_id,sub_item_id,sub_item_name,sort_order) VALUES(?,?,?,?)'
  );
  const delIngreds  = db.prepare('DELETE FROM item_ingredients WHERE item_id = ?');
  const insIng      = db.prepare(
    'INSERT INTO item_ingredients(item_id,sort_order,ing_id,ing_name,plan_amount,unit) VALUES(?,?,?,?,?,?)'
  );

  // Данные техкарты (station, station_items, pack_lines)
  const insStation  = db.prepare(
    'INSERT OR REPLACE INTO techcard_stations(techcard_id,station_key,shop_name,station_name,sort_order) VALUES(?,?,?,?,?)'
  );
  const insStItem   = db.prepare(
    'INSERT OR REPLACE INTO techcard_station_items(techcard_id,station_key,item_id,sort_order) VALUES(?,?,?,?)'
  );
  const insPackLine = db.prepare(
    'INSERT OR REPLACE INTO techcard_pack_lines(techcard_id,item_id,line_idx,volume,pack_name,destination,from_warehouse,qty) VALUES(?,?,?,?,?,?,?,?)'
  );

  // Собираем все item_id из техкарты для обновления каталога
  const allItems = [];
  (stations || []).forEach(st => {
    (st.items || []).forEach(item => {
      if (!allItems.find(x => x.id === item.id)) allItems.push(item);
    });
  });

  // Upsert глобального каталога
  for (const item of allItems) {
    upsertItem.run(item.id, item.name);

    // Подзаготовки — перезаписываем если изменились
    if (item.subPreps && item.subPreps.length > 0) {
      delSubPreps.run(item.id);
      item.subPreps.forEach((sp, i) => insSub.run(item.id, sp.id, sp.name, i));
    }

    // Ингредиенты — перезаписываем если изменились
    if (item.ingredients && item.ingredients.length > 0) {
      delIngreds.run(item.id);
      item.ingredients.forEach((ing, i) =>
        insIng.run(item.id, i, ing.id, ing.name, ing.planAmount || 0, ing.unit || 'г')
      );
    }
  }

  // Данные техкарты
  (stations || []).forEach((st, stIdx) => {
    insStation.run(techcardId, st.key, st.shop, st.name || '', stIdx);
    (st.items || []).forEach((item, itemIdx) => {
      insStItem.run(techcardId, st.key, item.id, itemIdx);
    });
  });

  for (const [itemId, lines] of Object.entries(items || {})) {
    if (!Array.isArray(lines)) continue;
    lines.forEach((line, lineIdx) => {
      insPackLine.run(
        techcardId, Number(itemId), lineIdx,
        line.volume || '', line.packName || '', line.destination || '',
        line.fromWarehouse || 0, line.qty || 0
      );
    });
  }
}

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT id, name, filename, created_at FROM techcards ORDER BY created_at DESC'
  ).all();
  res.json({ techcards: rows });
});

router.get('/:id', (req, res) => {
  const tc = buildTechcard(req.params.id);
  if (!tc) return res.status(404).json({ error: 'not found' });
  res.json({ techcard: tc });
});

router.post('/', (req, res) => {
  const { name, filename, items, stations } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  db.exec('BEGIN');
  try {
    const result = db.prepare(
      'INSERT INTO techcards(name, filename, items_json) VALUES(?, ?, ?)'
    ).run(name, filename || null, '{}');

    const techcardId = result.lastInsertRowid;
    saveTechcardData(techcardId, items || {}, stations || []);

    db.exec('COMMIT');
    res.json({ id: techcardId, ok: true });
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('POST /api/techcards error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.prepare('UPDATE techcards SET name = ? WHERE id = ?').run(name, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.exec('BEGIN');
  try {
    // Снимаем ссылку из смен (FK constraint)
    db.prepare('UPDATE shifts SET techcard_id = NULL WHERE techcard_id = ?').run(req.params.id);
    db.prepare('DELETE FROM techcards WHERE id = ?').run(req.params.id);
    db.exec('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { pool } = require('../db');

async function buildShift(date) {
  const { rows: shiftRows } = await pool.query(
    'SELECT date, techcard_id FROM shifts WHERE date = $1', [date]
  );
  if (!shiftRows.length) return null;
  const shiftRow = shiftRows[0];

  const { rows: statusRows } = await pool.query(
    'SELECT station_key, item_id, done FROM shift_item_status WHERE shift_date = $1', [date]
  );
  const doneFlags = {};
  for (const r of statusRows) {
    doneFlags[`${r.station_key}-${r.item_id}`] = r.done === 1;
  }

  const { rows: empRows } = await pool.query(
    'SELECT station_key, item_id, employee_id FROM shift_item_employees WHERE shift_date = $1', [date]
  );
  const doneBy = {};
  for (const r of empRows) {
    const key = `${r.station_key}-${r.item_id}`;
    if (!doneBy[key]) doneBy[key] = [];
    doneBy[key].push(r.employee_id);
  }

  const { rows: factRows } = await pool.query(
    'SELECT station_key, item_id, line_idx, value FROM shift_facts_n WHERE shift_date = $1', [date]
  );
  const facts = {};
  for (const r of factRows) {
    facts[`${r.station_key}-${r.item_id}-pl-${r.line_idx}`] = r.value;
  }

  const techcardId = shiftRow.techcard_id || null;
  const itemPackLines = {};

  if (techcardId) {
    const { rows: tcLines } = await pool.query(`
      SELECT item_id, volume, pack_name, destination, from_warehouse, qty
      FROM techcard_pack_lines WHERE techcard_id = $1 ORDER BY item_id, line_idx
    `, [techcardId]);
    for (const r of tcLines) {
      if (!itemPackLines[r.item_id]) itemPackLines[r.item_id] = [];
      itemPackLines[r.item_id].push({
        volume:        r.volume,
        packName:      r.pack_name,
        destination:   r.destination,
        fromWarehouse: r.from_warehouse,
        qty:           r.qty
      });
    }
  }

  const { rows: plRows } = await pool.query(
    'SELECT item_id, lines_json FROM shift_pack_lines WHERE shift_date = $1', [date]
  );
  for (const r of plRows) itemPackLines[r.item_id] = JSON.parse(r.lines_json);

  return { date, techcardId, doneFlags, doneBy, facts, itemPackLines, assignments: {} };
}

async function saveShift(date, shift) {
  const techcardId = shift.techcardId || null;
  const RE_FACT = /^(.+)-(\d+)-pl-(\d+)$/;

  const tcLinesMap = {};
  if (techcardId) {
    const { rows } = await pool.query(`
      SELECT item_id, line_idx, volume, pack_name, destination, from_warehouse, qty
      FROM techcard_pack_lines WHERE techcard_id = $1 ORDER BY item_id, line_idx
    `, [techcardId]);
    for (const r of rows) {
      if (!tcLinesMap[r.item_id]) tcLinesMap[r.item_id] = [];
      tcLinesMap[r.item_id].push({
        volume: r.volume, packName: r.pack_name, destination: r.destination,
        fromWarehouse: r.from_warehouse, qty: r.qty
      });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      INSERT INTO shifts(date, techcard_id) VALUES($1, $2)
      ON CONFLICT(date) DO UPDATE SET techcard_id = $2, updated_at = NOW()::text
    `, [date, techcardId]);

    await client.query('DELETE FROM shift_item_status WHERE shift_date = $1', [date]);
    const doneFlags = shift.doneFlags || {};
    for (const [compKey, done] of Object.entries(doneFlags)) {
      const sep = compKey.lastIndexOf('-');
      const stationKey = compKey.slice(0, sep);
      const itemId = compKey.slice(sep + 1);
      await client.query(
        'INSERT INTO shift_item_status(shift_date,station_key,item_id,done) VALUES($1,$2,$3,$4)',
        [date, stationKey, itemId, done ? 1 : 0]
      );
    }

    await client.query('DELETE FROM shift_item_employees WHERE shift_date = $1', [date]);
    const doneBy = shift.doneBy || {};
    for (const [compKey, empIds] of Object.entries(doneBy)) {
      if (!Array.isArray(empIds) || empIds.length === 0) continue;
      const sep = compKey.lastIndexOf('-');
      const stationKey = compKey.slice(0, sep);
      const itemId = compKey.slice(sep + 1);
      await client.query(
        'INSERT INTO shift_item_status(shift_date,station_key,item_id,done) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',
        [date, stationKey, itemId, doneFlags[compKey] ? 1 : 0]
      );
      for (const empId of empIds) {
        await client.query(
          'INSERT INTO shift_item_employees(shift_date,station_key,item_id,employee_id) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',
          [date, stationKey, itemId, empId]
        );
      }
    }

    await client.query('DELETE FROM shift_facts_n WHERE shift_date = $1', [date]);
    const facts = shift.facts || {};
    for (const [key, value] of Object.entries(facts)) {
      const m = key.match(RE_FACT);
      if (!m) continue;
      const [, stationKey, itemId, lineIdx] = m;
      await client.query(
        'INSERT INTO shift_facts_n(shift_date,station_key,item_id,line_idx,value) VALUES($1,$2,$3,$4,$5)',
        [date, stationKey, itemId, Number(lineIdx), value == null ? null : Number(value)]
      );
    }

    await client.query('DELETE FROM shift_pack_lines WHERE shift_date = $1', [date]);
    const itemPackLines = shift.itemPackLines || {};
    for (const [itemId, lines] of Object.entries(itemPackLines)) {
      const tcLines = tcLinesMap[itemId];
      if (tcLines && linesEqual(tcLines, lines)) continue;
      await client.query(
        'INSERT INTO shift_pack_lines(shift_date,item_id,lines_json) VALUES($1,$2,$3)',
        [date, itemId, JSON.stringify(lines)]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function linesEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((la, i) => {
    const lb = b[i];
    return la.volume === lb.volume && la.packName === lb.packName &&
           la.destination === lb.destination && Number(la.qty) === Number(lb.qty);
  });
}

router.get('/index', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT date FROM shifts ORDER BY date DESC');
    res.json({ dates: rows.map(r => r.date) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { rows: shifts } = await pool.query(`
      SELECT s.date, s.techcard_id, t.name as techcard_name
      FROM shifts s LEFT JOIN techcards t ON t.id = s.techcard_id
      ORDER BY s.date DESC
    `);
    const summary = await Promise.all(shifts.map(async row => {
      const { rows: [total] } = await pool.query(
        'SELECT COUNT(*) as cnt FROM shift_item_status WHERE shift_date=$1', [row.date]
      );
      const { rows: [done] } = await pool.query(
        'SELECT COUNT(*) as cnt FROM shift_item_status WHERE shift_date=$1 AND done=1', [row.date]
      );
      return {
        date:         row.date,
        techcardId:   row.techcard_id,
        techcardName: row.techcard_name,
        totalItems:   Number(total?.cnt || 0),
        doneItems:    Number(done?.cnt  || 0)
      };
    }));
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const shift = await buildShift(req.params.date);
    res.json({ shift });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:date', async (req, res) => {
  const { date } = req.params;
  const { shift } = req.body;
  if (!shift) return res.status(400).json({ error: 'shift required' });

  try {
    await saveShift(date, shift);
    const wss = req.app.get('wss');
    if (wss) {
      const msg = JSON.stringify({ type: 'shift_updated', date, shift });
      wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

function cellId(value) {
  return String(value ?? '').trim();
}

function taskKey(source, id, row) {
  const value = cellId(id);
  if (!value) return `${source.gid}:${row}`; // Temporary legacy identity in read-only environments.
  return `${source.gid}:id:${encodeURIComponent(value)}`;
}

function reconcileLegacy(source, rows, acts) {
  const claimed = new Map();
  return acts.flatMap(act => {
    const match = String(act.source_row).match(/^(\d+):(\d+)$/);
    if (!match || Number(match[1]) !== source.gid) return [];
    if (Number(match[2]) < source.startRow) return [];
    const byName = name => name ? rows.flatMap((row, offset) =>
      cellId(row[source.columns.name]) === name ? [offset] : []) : [];
    let matches = byName(cellId(act.source_product_name));
    if (!matches.length) matches = byName(cellId(act.product_name));
    if (matches.length !== 1) throw new Error('Не удалось однозначно найти исходное задание старого акта по названию');
    if (claimed.has(matches[0]) && claimed.get(matches[0]) !== act.source_row) {
      throw new Error('Не удалось однозначно сопоставить старые акты: разные задания претендуют на одну строку');
    }
    claimed.set(matches[0], act.source_row);
    return [{ actId: act.id, oldKey: act.source_row, preferredId: Number(match[2]), offset: matches[0] }];
  });
}

function planIds(source, rows, allIds, acts = []) {
  const used = new Set();
  let max = source.startRow - 1;
  for (const id of allIds) {
    const value = cellId(id);
    if (value) used.add(taskKey(source, value));
    if (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))) max = Math.max(max, Number(value));
  }
  // Do not reuse IDs still referenced by an act, even if its sheet row was deleted.
  for (const act of acts) {
    if (!String(act.source_row).startsWith(`${source.gid}:`)) continue;
    used.add(act.source_row);
    const token = String(act.source_row).slice(String(source.gid).length + 1);
    if (/^\d+$/.test(token) && Number(token) < source.startRow) continue;
    const value = token.startsWith('id:') ? decodeURIComponent(token.slice(3)) : token;
    if (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))) max = Math.max(max, Number(value));
  }
  const seen = new Set();
  for (const row of rows) {
    if (!cellId(row[0])) continue;
    const key = taskKey(source, row[0]);
    if (seen.has(key)) throw new Error(`Повторяющийся ID на вкладке ${source.gid}: ${cellId(row[0])}`);
    seen.add(key);
  }
  const assignments = [];
  const reservedLegacy = new Map();
  for (const legacy of reconcileLegacy(source, rows, acts)) {
    if (cellId(rows[legacy.offset][0]) || reservedLegacy.has(legacy.offset)) continue;
    const key = taskKey(source, legacy.preferredId);
    if (!used.has(key)) {
      reservedLegacy.set(legacy.offset, legacy.preferredId);
      used.add(key);
    }
  }
  rows.forEach((row, offset) => {
    if (cellId(row[0]) || !cellId(row[source.columns.name])) return;
    const sourceRow = source.startRow + offset;
    let id;
    if (reservedLegacy.has(offset)) id = reservedLegacy.get(offset);
    else {
      do { max++; } while (used.has(taskKey(source, max)));
      if (!Number.isSafeInteger(max)) throw new Error('Исчерпан диапазон числовых ID');
      id = max;
    }
    used.add(taskKey(source, id));
    assignments.push({ row: sourceRow, offset, id });
  });
  return assignments;
}

function findTaskRow(source, rows, key) {
  const matches = [];
  rows.forEach((row, offset) => {
    if (cellId(row[0]) && taskKey(source, row[0]) === key) {
      matches.push({ row: source.startRow + offset, values: row });
    }
  });
  if (matches.length !== 1) throw new Error(matches.length
    ? 'ID задания повторяется в таблице' : 'ID задания не найден в разрешённых строках таблицы');
  return matches[0];
}

module.exports = { cellId, taskKey, planIds, findTaskRow, reconcileLegacy };
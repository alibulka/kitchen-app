/**
 * Запись в лист "Остатки кухни "
 * A=ID, B=Название, D=Дата наклейки, E=Дата+180, F=Количество, G=На кухне
 */
const { getAccessToken, isoToDDMMYYYY, findFirstEmptyRowInColA, writeCellsToSheet } = require('./sheets-utils');
const { pool } = require('../db');

const SHEET_NAME = 'Остатки кухни ';

function buildCells(r, rowNum) {
  return [
    { col: 'A', value: String(r.id) },
    { col: 'B', value: r.name },
    { col: 'D', value: r.date },
    { col: 'E', value: r.date ? `=D${rowNum}+180` : '' },
    { col: 'F', value: r.qty },
    { col: 'G', value: 'На кухне' },
  ];
}

async function appendToKitchenResidues(items, date) {
  const rawRows = [];
  for (const it of items) {
    if ((it.to_kitchen || 0) > 0)
      rawRows.push({ id: it.item_id, name: it.name || '', date: isoToDDMMYYYY(it.label_date), qty: it.to_kitchen, isExcess: 0 });
    if ((it.to_kitchen_excess || 0) > 0)
      rawRows.push({ id: it.item_id, name: it.name || '', date: isoToDDMMYYYY(it.label_date_excess), qty: it.to_kitchen_excess, isExcess: 1 });
  }
  if (rawRows.length === 0) return { ok: true, appended: 0, updated: 0 };

  const token = await getAccessToken();
  let appended = 0, updated = 0;

  for (const r of rawRows) {
    // Ищем сохранённый номер строки
    const { rows: existing } = await pool.query(
      'SELECT row_num FROM shift_dh_sheet_rows WHERE shift_date=$1 AND item_id=$2 AND is_excess=$3 AND sheet_name=$4',
      [date, r.id, r.isExcess, SHEET_NAME]
    );

    if (existing.length > 0) {
      // Обновляем существующую строку
      const rowNum = existing[0].row_num;
      await writeCellsToSheet(token, SHEET_NAME, [{ rowNum, cells: buildCells(r, rowNum) }]);
      updated++;
    } else {
      // Находим первую пустую строку и пишем туда
      const rowNum = await findFirstEmptyRowInColA(token, SHEET_NAME);
      await writeCellsToSheet(token, SHEET_NAME, [{ rowNum, cells: buildCells(r, rowNum) }]);
      // Сохраняем номер строки
      await pool.query(
        `INSERT INTO shift_dh_sheet_rows(shift_date, item_id, is_excess, sheet_name, row_num)
         VALUES($1,$2,$3,$4,$5) ON CONFLICT(shift_date,item_id,is_excess,sheet_name) DO UPDATE SET row_num=$5`,
        [date, r.id, r.isExcess, SHEET_NAME, rowNum]
      );
      appended++;
    }
  }

  return { ok: true, appended, updated };
}

module.exports = { appendToKitchenResidues };

const crypto = require('crypto');

const LEGACY_SPREADSHEET_ID = '1abYpnMeyHrhzvh0bmFCMEp3bGHO1Y11tFkBhsKFz1pw';
const SPREADSHEET_ID = process.env.DH_SPREADSHEET_ID || LEGACY_SPREADSHEET_ID;

// Row numbers belong to a particular spreadsheet, not just to a tab title.
// Keep existing legacy mappings intact, but never reuse them in a new file.
function sheetRowKey(sheetName) {
  return SPREADSHEET_ID === LEGACY_SPREADSHEET_ID
    ? sheetName : `${SPREADSHEET_ID}:${sheetName}`;
}

const FETCH_TIMEOUT_MS = 15000;

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

async function getAccessToken() {
  const json = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!json) throw new Error('GOOGLE_CREDENTIALS_JSON не задан');
  const creds = JSON.parse(json);
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(creds.private_key, 'base64url');
  const jwt = `${header}.${payload}.${sig}`;
  const r = await fetchWithTimeout('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const d = await r.json();
  if (!d.access_token) throw new Error('Не удалось получить access_token: ' + JSON.stringify(d));
  return d.access_token;
}

// "2026-01-15" → "15.01.2026"
function isoToDDMMYYYY(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/**
 * Найти строку после последней заполненной в колонке A (1-based)
 * Всегда добавляет в конец — не ищет пустые строки в середине
 */
async function findFirstEmptyRowInColA(token, sheetName, headerRows = 2) {
  const range = encodeURIComponent(`'${sheetName}'!A:A`);
  const resp = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await resp.json();
  if (!resp.ok || data.error) {
    throw new Error(data.error?.message || `Не удалось прочитать лист «${sheetName}»: HTTP ${resp.status}`);
  }
  const values = data.values || [];
  // Ищем последнюю непустую строку в колонке A начиная с конца
  for (let i = values.length - 1; i >= headerRows; i--) {
    if (values[i] && values[i][0] && String(values[i][0]).trim() !== '') {
      return i + 2; // следующая строка после последней заполненной (1-based)
    }
  }
  return headerRows + 1; // если нет данных — первая строка после заголовков
}

/**
 * Записать данные в конкретные колонки нескольких строк через batchUpdate values.
 * rows: [{rowNum, cells: [{col: 'A', value: '...'}, ...]}]
 * Не затрагивает другие колонки.
 */
async function writeCellsToSheet(token, sheetName, rows) {
  if (rows.length === 0) return;
  const data = [];
  for (const row of rows) {
    for (const { col, value } of row.cells) {
      data.push({
        range: `'${sheetName}'!${col}${row.rowNum}`,
        values: [[value]],
      });
    }
  }
  const r = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueInputOption: 'USER_ENTERED', data }),
    }
  );
  const result = await r.json();
  if (result.error) throw new Error(result.error.message);
  return result;
}

/**
 * Очистить конкретные ячейки в строке (для обновления)
 * Затем записать новые значения через writeCellsToSheet
 */
async function updateRowInSheet(token, sheetName, rowNum, cells) {
  return writeCellsToSheet(token, sheetName, [{ rowNum, cells }]);
}

module.exports = { getAccessToken, fetchWithTimeout, isoToDDMMYYYY, findFirstEmptyRowInColA, writeCellsToSheet, updateRowInSheet, SPREADSHEET_ID, sheetRowKey };

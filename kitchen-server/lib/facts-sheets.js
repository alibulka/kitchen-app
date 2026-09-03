// Запись фактов смены в Google Sheet
const crypto = require('crypto');
const https = require('https');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = process.env.FACTS_SPREADSHEET_ID || '1F7iI77aLPMy4-1Bp7aLblVgTOdKzkRyih5DDEaRVXAQ';
const SHEET_NAME = process.env.FACTS_SHEET_NAME || 'Лист1';

// Индексы колонок (0-based)
const COL_WRAPPER_ID  = 0; // A — Wrapper ID
const COL_GRAMOVKA    = 2; // C — Граммовка
const COL_UPAKOVKA    = 3; // D — Упаковка
const COL_DATE        = 4; // E — Дата работ
const COL_FACT        = 6; // G — Резерв факт

let _creds = null;
function getCreds() {
  if (_creds) return _creds;
  // Приоритет: env переменная GOOGLE_CREDENTIALS_JSON, затем файл
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try { _creds = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON); return _creds; } catch {}
  }
  const p = path.join(__dirname, '..', 'google-credentials.json');
  if (!fs.existsSync(p)) return null;
  _creds = JSON.parse(fs.readFileSync(p, 'utf8'));
  return _creds;
}

function makeJwt(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createSign('RSA-SHA256').update(data).sign(creds.private_key, 'base64url');
  return `${data}.${sig}`;
}

let _tokenCache = null;
async function getAccessToken() {
  if (_tokenCache && _tokenCache.exp > Date.now()) return _tokenCache.token;
  const creds = getCreds();
  if (!creds) throw new Error('google-credentials.json не найден');
  const jwt = makeJwt(creds);
  const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const data = await httpsReq('POST', 'oauth2.googleapis.com', '/token', null, body, 'application/x-www-form-urlencoded');
  _tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return _tokenCache.token;
}

function httpsReq(method, host, path, token, body, contentType) {
  return new Promise((resolve, reject) => {
    const buf = body ? Buffer.from(body) : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (contentType) headers['Content-Type'] = contentType;
    if (buf) headers['Content-Length'] = buf.length;
    const req = https.request({ host, path, method, headers },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } }); });
    req.on('error', reject);
    if (buf) req.write(buf);
    req.end();
  });
}

// Основная функция: принимает массив обновлений и пишет в Sheet
// updates: [{itemId, volume, packName, planDate, factValue}]
async function writeFacts(updates) {
  if (!getCreds()) { console.warn('[facts-sheets] credentials отсутствуют'); return; }
  if (!updates.length) return;

  const token = await getAccessToken();

  // Читаем все строки листа
  const range = encodeURIComponent(`${SHEET_NAME}!A:G`);
  const res = await httpsReq('GET', 'sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`, token);
  const rows = res.values || [];

  // Строим индекс: "itemId|volume|packName|date" → rowIndex (1-based)
  const index = {};
  for (let i = 1; i < rows.length; i++) { // пропускаем заголовок
    const row = rows[i];
    const vol = parseFloat((row[COL_GRAMOVKA]||'').toString()) || '';
    const key = `${(row[COL_WRAPPER_ID]||'').toString().trim()}|${vol}|${(row[COL_UPAKOVKA]||'').trim()}|${(row[COL_DATE]||'').trim()}`;
    index[key] = i + 1; // 1-based номер строки в Sheet
  }

  // Формируем batch-запрос на обновление
  const batchData = [];
  for (const u of updates) {
    const vol = parseFloat(u.volume) || u.volume;
    const key = `${u.itemId}|${vol}|${u.packName}|${u.planDate}`;
    const rowNum = index[key];
    if (!rowNum) {
      console.warn(`[facts-sheets] строка не найдена: ${key}`);
      continue;
    }
    const cellRange = `${SHEET_NAME}!G${rowNum}`;
    batchData.push({ range: cellRange, values: [[String(u.factValue)]] });
  }

  if (!batchData.length) { console.log('[facts-sheets] нет совпадений для обновления'); return; }

  // Batch update
  const body = JSON.stringify({ valueInputOption: 'RAW', data: batchData });
  await httpsReq('POST', 'sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`,
    token, body, 'application/json');

  console.log(`[facts-sheets] обновлено ${batchData.length} ячеек`);
}

// ─── Второй документ: Wrapper ID + Дата → Резерв факт (колонка E) ────────────
// Структура: A=Wrapper ID, B=Название, C=Дата работ, D=Резерв план, E=Резерв факт
// updates: [{itemId, planDate, factValue}] — упаковка игнорируется, факт суммируется по позиции+дате

const SPREADSHEET_ID_2  = process.env.FACTS2_SPREADSHEET_ID || '1Ru1gXNP-1eN31FWTtwJI6E57ccHhh1XkdDe9Llq9bqU';
const SHEET_NAME_2      = process.env.FACTS2_SHEET_NAME     || 'Лист1';

const COL2_WRAPPER_ID = 0; // A
const COL2_DATE       = 2; // C
const COL2_FACT       = 4; // E

async function writeFacts2(updates) {
  if (!getCreds()) { console.warn('[facts-sheets2] credentials отсутствуют'); return; }
  if (!updates.length) return;

  // Схлопываем по itemId+date — суммируем факт по всем упаковкам
  const totals = {};
  for (const u of updates) {
    const key = `${String(u.itemId).trim()}|${String(u.planDate).trim()}`;
    totals[key] = (totals[key] || 0) + Number(u.factValue || 0);
  }

  const token = await getAccessToken();

  const range = encodeURIComponent(`${SHEET_NAME_2}!A:E`);
  const res = await httpsReq('GET', 'sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID_2}/values/${range}`, token);
  const rows = res.values || [];

  // Индекс: "wrapperId|date" → rowNum (1-based)
  const index = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const wid  = (row[COL2_WRAPPER_ID] || '').toString().trim();
    const date = (row[COL2_DATE]       || '').toString().trim();
    if (wid) index[`${wid}|${date}`] = i + 1;
  }

  const batchData = [];
  for (const [key, total] of Object.entries(totals)) {
    const rowNum = index[key];
    if (!rowNum) { console.warn(`[facts-sheets2] строка не найдена: ${key}`); continue; }
    batchData.push({ range: `${SHEET_NAME_2}!E${rowNum}`, values: [[String(total)]] });
  }

  if (!batchData.length) { console.log('[facts-sheets2] нет совпадений для обновления'); return; }

  const body = JSON.stringify({ valueInputOption: 'RAW', data: batchData });
  await httpsReq('POST', 'sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID_2}/values:batchUpdate`,
    token, body, 'application/json');

  console.log(`[facts-sheets2] обновлено ${batchData.length} ячеек`);
}

module.exports = { writeFacts, writeFacts2 };

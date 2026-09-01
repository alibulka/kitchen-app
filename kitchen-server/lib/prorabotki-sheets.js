// Интеграция с Google Sheet проработок — только встроенные модули Node.js
const crypto = require('crypto');
const https = require('https');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = process.env.PRORABOTKI_SPREADSHEET_ID || '1KcGBsIEi2Z7DAW-E5eh0nIBJ8QFFuCZut1nRMhsGfmw';
const SOURCE_SHEET = 'Мясо / Рыба Проработки (с 2025года)';
const HEADER_ROW = 4; // строка с заголовками (1-based)
const DATA_START_ROW = 5; // первая строка данных

let _creds = null;
function getCreds() {
  if (_creds) return _creds;
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
  const data = await httpsPost('oauth2.googleapis.com', '/token', body, 'application/x-www-form-urlencoded');
  _tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return _tokenCache.token;
}

function httpsPost(host, path, body, contentType) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request({ host, path, method: 'POST',
      headers: { 'Content-Type': contentType, 'Content-Length': buf.length } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } }); });
    req.on('error', reject); req.write(buf); req.end();
  });
}

function httpsGet(host, path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path, method: 'GET',
      headers: { Authorization: `Bearer ${token}` } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } }); });
    req.on('error', reject); req.end();
  });
}

function httpsPut(host, path, token, bodyObj) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(JSON.stringify(bodyObj));
    const req = https.request({ host, path, method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': buf.length } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } }); });
    req.on('error', reject); req.write(buf); req.end();
  });
}

function httpsAppend(host, path, token, bodyObj) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(JSON.stringify(bodyObj));
    const req = https.request({ host, path, method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': buf.length } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } }); });
    req.on('error', reject); req.write(buf); req.end();
  });
}

// Прочитать список заданий из исходного листа (строки DATA_START_ROW+)
async function fetchTasks() {
  if (!getCreds()) return [];
  const token = await getAccessToken();
  const range = encodeURIComponent(`${SOURCE_SHEET}!A${DATA_START_ROW}:L`);
  const res = await httpsGet('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`, token);
  const rows = res.values || [];
  // Колонки (0-based): A=Сырьё, B=Цель привоза, C=Название, D=Тип, E=Срок хранения, F=Производитель, G=Поставщик, H=Кто внёс, I=Цена пост., J=Цена нетто, K=Дата прихода, L=Дедлайн проработки
  return rows.map((row, i) => ({
    rowIndex: DATA_START_ROW + i,
    material: row[0] || '',
    purpose: row[1] || '',
    name: row[2] || '',
    type: row[3] || '',
    shelfLife: row[4] || '',
    manufacturer: row[5] || '',
    supplier: row[6] || '',
    addedBy: row[7] || '',
    priceSupplier: row[8] || '',
    priceNetto: row[9] || '',
    arrivalDate: row[10] || '',
    deadline: row[11] || '',
  })).filter(r => r.material || r.name); // пропускаем пустые строки
}

// Получить или создать вкладку с названием templateName, вернуть её sheetId
async function getOrCreateSheet(token, templateName) {
  const meta = await httpsGet('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`, token);
  const existing = (meta.sheets || []).find(s => s.properties.title === templateName);
  if (existing) return existing.properties.sheetId;

  // Создаём новую вкладку
  const res = await httpsPost('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
    JSON.stringify({ requests: [{ addSheet: { properties: { title: templateName } } }] }),
    'application/json');
  // Но httpsPost не передаёт токен — используем httpsAppend с PUT-like логикой
  // Сделаем через отдельный вызов
  return null; // перепишем ниже
}

// Записать акт на вкладку шаблона (create или update)
// fields: [{label, value}] — все поля акта по порядку
// taskInfo: {material, name, manufacturer}
// actId: строковый ID акта в нашей БД
// existingRowIndex: если уже есть в Sheet — обновляем, иначе null → добавляем
async function writeActToSheet(templateName, actId, taskInfo, date, fields, existingRowIndex) {
  if (!getCreds()) { console.warn('[prorabotki-sheets] credentials отсутствуют'); return null; }
  const token = await getAccessToken();

  // Заголовок строки: act_id, дата, сырьё, название, производитель, потом все поля
  const baseHeaders = ['act_id', 'Дата', 'Сырьё', 'Название', 'Производитель'];
  const fieldHeaders = fields.map(f => f.label);
  const headers = [...baseHeaders, ...fieldHeaders];

  const baseValues = [actId, date, taskInfo.material || '', taskInfo.name || '', taskInfo.manufacturer || ''];
  const fieldValues = fields.map(f => f.value != null ? String(f.value) : '');
  const rowValues = [...baseValues, ...fieldValues];

  // Получаем список листов и ищем вкладку templateName
  const meta = await httpsGet('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`, token);
  const existing = (meta.sheets || []).find(s => s.properties.title === templateName);

  if (!existing) {
    // Создаём вкладку через batchUpdate
    const buf = Buffer.from(JSON.stringify({
      requests: [{ addSheet: { properties: { title: templateName } } }]
    }));
    await new Promise((resolve, reject) => {
      const req = https.request({
        host: 'sheets.googleapis.com',
        path: `/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': buf.length }
      }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
      req.on('error', reject); req.write(buf); req.end();
    });

    // Пишем заголовок и первую строку
    const range = encodeURIComponent(`${templateName}!A1`);
    await httpsPut('sheets.googleapis.com',
      `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
      token,
      { range: `${templateName}!A1`, majorDimension: 'ROWS', values: [headers, rowValues] });

    // Получаем sheetId новой вкладки для форматирования
    const meta2 = await httpsGet('sheets.googleapis.com',
      `/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`, token);
    const newSheet = (meta2.sheets || []).find(s => s.properties.title === templateName);
    if (newSheet) {
      await applySheetFormatting(token, newSheet.properties.sheetId, headers.length).catch(e =>
        console.warn('[prorabotki-sheets] форматирование:', e.message));
    }
    console.log(`[prorabotki-sheets] Создана вкладка "${templateName}", записан акт ${actId}`);
    return 2; // строка данных
  }

  // Вкладка уже есть — читаем её
  const dataRange = encodeURIComponent(`${templateName}!A1:A`);
  const colA = await httpsGet('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}/values/${dataRange}`, token);
  const colAValues = (colA.values || []);

  // Проверяем заголовок, при необходимости дополняем колонки
  if (colAValues.length === 0) {
    // Пустая вкладка — пишем заголовок + строку
    const range = encodeURIComponent(`${templateName}!A1`);
    await httpsPut('sheets.googleapis.com',
      `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
      token,
      { range: `${templateName}!A1`, majorDimension: 'ROWS', values: [headers, rowValues] });
    await applySheetFormatting(token, existing.properties.sheetId, headers.length).catch(e =>
      console.warn('[prorabotki-sheets] форматирование:', e.message));
    return 2;
  }

  // Ищем строку по act_id
  if (existingRowIndex) {
    // Обновляем существующую строку
    const range = encodeURIComponent(`${templateName}!A${existingRowIndex}`);
    await httpsPut('sheets.googleapis.com',
      `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
      token,
      { range: `${templateName}!A${existingRowIndex}`, majorDimension: 'ROWS', values: [rowValues] });
    console.log(`[prorabotki-sheets] Обновлён акт ${actId} в строке ${existingRowIndex}`);
    return existingRowIndex;
  }

  // Ищем по act_id в колонке A
  for (let i = 0; i < colAValues.length; i++) {
    if (colAValues[i][0] === String(actId)) {
      const rowNum = i + 1;
      const range = encodeURIComponent(`${templateName}!A${rowNum}`);
      await httpsPut('sheets.googleapis.com',
        `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
        token,
        { range: `${templateName}!A${rowNum}`, majorDimension: 'ROWS', values: [rowValues] });
      console.log(`[prorabotki-sheets] Обновлён акт ${actId} в строке ${rowNum}`);
      return rowNum;
    }
  }

  // Не нашли — добавляем новую строку (append)
  const appendRange = encodeURIComponent(`${templateName}!A:A`);
  await httpsAppend('sheets.googleapis.com',
    `/v4/spreadsheets/${SPREADSHEET_ID}/values/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    token,
    { range: `${templateName}!A:A`, majorDimension: 'ROWS', values: [rowValues] });
  const newRowIdx = colAValues.length + 1;
  console.log(`[prorabotki-sheets] Добавлен акт ${actId} в строку ${newRowIdx}`);
  return newRowIdx;
}

// Применить форматирование к вкладке: жирный заголовок, фон, обводка
async function applySheetFormatting(token, sheetId, colCount) {
  const requests = [
    // Заморозить первую строку
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
    // Фон заголовка (#4A3728 — тёмно-коричневый как акцент системы)
    { repeatCell: {
      range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: colCount },
      cell: { userEnteredFormat: {
        backgroundColor: { red: 0.29, green: 0.216, blue: 0.157 },
        textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
        verticalAlignment: 'MIDDLE',
        wrapStrategy: 'WRAP',
      }},
      fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)'
    }},
    // Высота строки заголовка
    { updateDimensionProperties: {
      range: { sheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
      properties: { pixelSize: 40 }, fields: 'pixelSize'
    }},
    // Обводка всех ячеек (тонкая серая)
    { repeatCell: {
      range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: colCount },
      cell: { userEnteredFormat: { borders: {
        top:    { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
        bottom: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
        left:   { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
        right:  { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
      }}},
      fields: 'userEnteredFormat.borders'
    }},
    // Чередующийся фон строк данных (светло-бежевый)
    { addBanding: {
      bandedRange: {
        bandedRangeId: sheetId * 100 + 1,
        range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: colCount },
        rowProperties: {
          firstBandColor: { red: 1, green: 1, blue: 1 },
          secondBandColor: { red: 0.96, green: 0.94, blue: 0.91 },
        }
      }
    }},
    // Авто-ширина всех колонок
    { autoResizeDimensions: {
      dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: colCount }
    }},
  ];

  const buf = Buffer.from(JSON.stringify({ requests }));
  await new Promise((resolve, reject) => {
    const req = https.request({
      host: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': buf.length }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
    req.on('error', reject); req.write(buf); req.end();
  });
}

module.exports = { fetchTasks, writeActToSheet };

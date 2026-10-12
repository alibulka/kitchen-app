/**
 * Запись фактов ДХ в лист "Контроль 2026"
 *
 * Структура листа:
 *   - Строки-даты: столбцы R,T,V,X,Z,AB,AD (индексы 17,19,21,23,25,27,29) содержат
 *     плановые даты в формате дд.мм.гг
 *   - Факт пишется в следующий столбец (S,U,W,Y,AA,AC,AE — индексы 18,20,22,24,26,28,30)
 *   - Столбец F (индекс 5) — ID позиции
 *   - Искать строки с позицией НИЖЕ строки с плановой датой (до следующей строки-даты)
 */

const SPREADSHEET_ID = '1abYpnMeyHrhzvh0bmFCMEp3bGHO1Y11tFkBhsKFz1pw';
const SHEET_NAME = 'Контроль 2026';
const ITEM_ID_COL = 5;  // F
// Пары: [индекс столбца даты, индекс столбца факта]
const DATE_FACT_COLS = [
  [17, 18],  // R → S
  [19, 20],  // T → U
  [21, 22],  // V → W
  [23, 24],  // X → Y
  [25, 26],  // Z → AA
  [27, 28],  // AB → AC
  [29, 30],  // AD → AE
];

const crypto = require('crypto');

const FETCH_TIMEOUT_MS = 15000;
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

// Получаем OAuth2 access token через JWT сервисного аккаунта без внешних зависимостей
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

async function sheetsGet(token, path, params = {}) {
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetchWithTimeout(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  return r.json();
}

async function sheetsBatchUpdate(token, requests) {
  const r = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    }
  );
  return r.json();
}

// "2026-01-02" → "02.01.26"
function isoToDDMMYY(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}

// Нормализуем значение даты из ячейки для сравнения: "2.1.26" и "02.01.26" оба → "02.01.26"
function normDate(v) {
  if (!v) return '';
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (!m) return s;
  const yy = m[3].length === 4 ? m[3].slice(2) : m[3];
  return `${m[1].padStart(2,'0')}.${m[2].padStart(2,'0')}.${yy}`;
}

/**
 * items: [{item_id: number|string, fact: number}]
 * date: "YYYY-MM-DD" — дата смены
 */
async function writeFactsToControlSheet(date, items) {
  const token = await getAccessToken();
  const targetDate = isoToDDMMYY(date);
  const sheetRef = `'${SHEET_NAME.replace(/'/g, "''")}'`;

  // Читаем весь лист (до столбца AE = 31 col)
  const range = `${sheetRef}!A1:AE`;
  const resp = await sheetsGet(token, `/values/${encodeURIComponent(range)}`);
  const allRows = resp.values || [];

  // Ищем строки-даты и строим индекс: для каждой строки-даты запоминаем
  // { rowIndex, factColIdx } — где factColIdx — столбец для записи факта
  // Затем собираем диапазон строк (до следующей строки-даты) и ищем item_id в col F

  // Строим индекс: item_id → {fact, plan, isManual}. Пропускаем если и факт и план = 0
  const byItemId = {};
  items.forEach(it => {
    const fact = Number(it.fact) || 0;
    const plan = Number(it.plan) || 0;
    const isManual = !!it.isManual;
    if (fact > 0 || (isManual && plan > 0)) byItemId[String(it.item_id)] = { fact, plan, isManual };
  });

  const writeRequests = []; // {rowIndex, colIndex, value}

  let i = 0;
  while (i < allRows.length) {
    const row = allRows[i];
    let matchedFactCol = -1;
    for (const [dateCol, factCol] of DATE_FACT_COLS) {
      const cellVal = normDate(row[dateCol]);
      if (cellVal === targetDate) { matchedFactCol = factCol; break; }
    }
    if (matchedFactCol >= 0) {
      const planDateCol = matchedFactCol - 1; // столбец плана = столбец факта - 1
      let j = i + 1;
      while (j < allRows.length) {
        const dataRow = allRows[j];
        // Останавливаемся если попалась строка-дата в заголовочных столбцах
        const isDateRow = DATE_FACT_COLS.some(([dc]) => {
          const v = normDate(dataRow[dc]);
          return v && /^\d{2}\.\d{2}\.\d{2}$/.test(v);
        });
        if (isDateRow) break;
        // Также останавливаемся если в столбце плана появилась другая дата
        const colDateVal = normDate(dataRow[planDateCol]);
        if (colDateVal && /^\d{2}\.\d{2}\.\d{2}$/.test(colDateVal) && colDateVal !== targetDate) break;
        const itemId = String(dataRow[ITEM_ID_COL] || '').trim();
        const entry = itemId ? byItemId[itemId] : undefined;
        if (entry) {
          const hasPlan = String(dataRow[planDateCol] || '').trim() !== '';
          if (entry.isManual) {
            // Ручные позиции: пишем план и факт независимо от наличия плана в таблице
            if (entry.plan > 0) writeRequests.push({ rowIndex: j, colIndex: planDateCol, value: entry.plan });
            if (entry.fact > 0) writeRequests.push({ rowIndex: j, colIndex: matchedFactCol, value: entry.fact });
          } else if (hasPlan && entry.fact > 0) {
            // Обычные позиции: только если план уже указан в таблице
            writeRequests.push({ rowIndex: j, colIndex: matchedFactCol, value: entry.fact });
          }
        }
        j++;
      }
      i = j;
    } else {
      i++;
    }
  }

  if (writeRequests.length === 0) {
    return { ok: true, written: 0, message: `Не найдена дата ${targetDate} в листе «${SHEET_NAME}»` };
  }

  // Получаем sheetId листа
  const sheetMeta = await sheetsGet(token, '', { fields: 'sheets(properties(sheetId,title))' });
  const sheetId = sheetMeta.sheets?.find(s => s.properties.title === SHEET_NAME)?.properties.sheetId;
  if (sheetId == null) throw new Error(`Лист «${SHEET_NAME}» не найден`);

  const updateRequests = writeRequests.map(({ rowIndex, colIndex, value }) => ({
    updateCells: {
      range: {
        sheetId,
        startRowIndex: rowIndex,
        endRowIndex: rowIndex + 1,
        startColumnIndex: colIndex,
        endColumnIndex: colIndex + 1,
      },
      rows: [{ values: [{ userEnteredValue: { numberValue: value } }] }],
      fields: 'userEnteredValue',
    },
  }));

  await sheetsBatchUpdate(token, updateRequests);

  return { ok: true, written: writeRequests.length };
}

module.exports = { writeFactsToControlSheet };

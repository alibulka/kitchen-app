const { JWT } = require('google-auth-library');

const SPREADSHEET_ID = '1WomFf4GOeRQta4MdzP_RnHqzv467FCnrs7uARsVF7I0';
// Inclusive physical row boundaries, identical in development and production.
const SOURCES = [
  { gid: 750743492, startRow: 225, columns: {
    material: 1, purpose: 2, name: 3, productType: 4, manufacturer: 6,
    supplier: 7, arrivalDate: 11, deadline: 12, workDate: 13,
    grossMass: 14, defrostMass: 15, defrostPercent: 17, conclusion: 21, comment: 23,
  } },
  { gid: 255104827, startRow: 822, columns: {
    purpose: 1, name: 2, manufacturer: 3, supplier: 4,
    arrivalDate: 8, deadline: 9, workDate: 10,
    grossMass: 12, defrostMass: 13, defrostPercent: 14, conclusion: 16, comment: 19,
  } },
];

function parseTasks(source, title, rows) {
  return rows.flatMap((row, offset) => {
    const task = {};
    for (const [field, column] of Object.entries(source.columns)) {
      task[field] = String(row[column] ?? '').trim();
    }
    if (!task.name) return [];
    const sourceRow = source.startRow + offset;
    return [{
      ...task,
      type: task.productType || '',
      material: task.material || '',
      sheetId: `${source.gid}:${sourceRow}`,
      sourceSheet: title,
      sourceSheetId: source.gid,
      sourceRow,
    }];
  });
}

async function loadTasks() {
  if (!process.env.GOOGLE_CREDENTIALS_JSON) {
    throw new Error('Не настроен доступ к Google Таблице проработок');
  }
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
  const { data } = await auth.request({
    url: base, params: { fields: 'sheets(properties(sheetId,title))' },
    timeout: 20000,
  });
  const results = await Promise.all(SOURCES.map(async source => {
    const sheet = data.sheets.find(s => s.properties.sheetId === source.gid)?.properties;
    if (!sheet) throw new Error(`Не найдена вкладка ${source.gid}`);
    const range = `'${sheet.title.replace(/'/g, "''")}'!A${source.startRow}:Y`;
    const response = await auth.request({
      url: `${base}/values/${encodeURIComponent(range)}`, timeout: 20000,
    });
    return parseTasks(source, sheet.title, response.data.values || []);
  }));
  return results.flat();
}

module.exports = { loadTasks, parseTasks, SOURCES };
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { gzipSync } = require('node:zlib');
const { stripInlineExcel } = require('../lib/browser-startup');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'));
const startup = fs.readFileSync(path.join(__dirname, '../public/startup.js'), 'utf8');

function browser() {
  const scripts = [], timers = new Map(), events = {};
  const status = { textContent: 'Открываем приложение…', setAttribute() {} };
  const retry = { hidden: true, addEventListener() {} };
  let nextTimer = 0;
  const window = {
    addEventListener: (name, handler) => { events[name] = handler; },
    setTimeout: (handler, delay) => { timers.set(++nextTimer, { handler, delay }); return nextTimer; },
    clearTimeout: id => timers.delete(id),
    location: { reload() {} },
  };
  const document = {
    getElementById: id => id === 'app-boot-status' ? status : id === 'app-boot-retry' ? retry : null,
    createElement: () => ({ remove() { this.removed = true; } }),
    head: { appendChild: script => scripts.push(script) },
  };
  vm.runInNewContext(startup, { window, document, Promise, Error });
  return { window, document, scripts, timers, events, status, retry };
}

test('initial HTML omits Excel in both transfer formats while retaining the complete application', () => {
  const fast = stripInlineExcel(html);
  assert.ok(fast.length < html.length * 0.6);
  assert.ok(gzipSync(fast).length < gzipSync(html).length * 0.6);
  assert.ok(!fast.toString().includes('/*! xlsx.js'));
  assert.ok(fast.toString().includes('function KitchenManagerPage('));
  assert.ok(fast.toString().includes('Открываем приложение…'));
  assert.ok(fast.toString().includes('src="/startup.js"'));
  for (const match of fast.toString().matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!match[1].includes('src=')) new vm.Script(match[2]);
  }
});

test('Excel is requested only on demand, once for concurrent imports and exports', async () => {
  const b = browser();
  assert.equal(b.scripts.length, 0);
  const first = b.window.ensureExcelLibrary();
  const second = b.window.ensureExcelLibrary();
  assert.equal(first, second);
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, '/assets/xlsx-0.18.5.min.js');
  const library = {};
  b.window.XLSX = library;
  b.scripts[0].onload();
  assert.equal(await first, library);
  assert.equal(await b.window.ensureExcelLibrary(), library);
  assert.equal(b.scripts.length, 1);
});

test('failed and timed out Excel loads show an explicit error and allow retry', async () => {
  for (const timeout of [false, true]) {
    const b = browser();
    const first = b.window.ensureExcelLibrary();
    const rejection = assert.rejects(first, /Не удалось загрузить Excel/);
    if (timeout) [...b.timers.values()].find(t => t.delay === 15000).handler();
    else b.scripts[0].onerror();
    await rejection;
    assert.equal(b.scripts[0].removed, true);
    const retry = b.window.ensureExcelLibrary();
    assert.equal(b.scripts.length, 2);
    b.window.XLSX = {};
    b.scripts[1].onload();
    await retry;
  }
});

test('startup failures and stalled script loading are visible instead of leaving an empty page', () => {
  const b = browser();
  b.events.error({ error: new Error('startup failed') });
  assert.match(b.status.textContent, /startup failed/);
  assert.equal(b.retry.hidden, false);
  [...b.timers.values()].find(t => t.delay === 20000).handler();
  assert.match(b.status.textContent, /больше времени/);
  // Once React replaces the initial placeholder, unrelated async errors
  // must not replace an already functioning screen.
  b.document.getElementById = () => null;
  b.events.unhandledrejection({ reason: new Error('later error') });
  assert.ok(!b.status.textContent.includes('later error'));
});

test('the deferred browser library still imports and exports Cyrillic Excel data', () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(require.resolve('xlsx/dist/xlsx.full.min.js'), 'utf8'), context);
  const library = context.XLSX;
  assert.equal(library.version, '0.18.5');
  const book = library.utils.book_new();
  library.utils.book_append_sheet(book, library.utils.aoa_to_sheet([['Сырьё', 'Вес'], ['Мясо', 12]]), 'Отчёт');
  const binary = library.write(book, { type: 'array', bookType: 'xlsx' });
  const loaded = library.read(binary, { type: 'array' });
  const rows = library.utils.sheet_to_json(loaded.Sheets['Отчёт'], { header: 1 });
  assert.deepEqual(JSON.parse(JSON.stringify(rows)), [['Сырьё', 'Вес'], ['Мясо', 12]]);
});

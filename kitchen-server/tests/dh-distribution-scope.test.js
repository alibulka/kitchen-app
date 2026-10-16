const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const helpersStart = html.indexOf('function calcFactTotals(');
const helpersEnd = html.indexOf('// Подвкладка "Факты смены"', helpersStart);
const componentStart = html.indexOf('function DXDistributionTab(');
const componentEnd = html.indexOf('// Главная вкладка ДХ/Склад', componentStart);
assert.ok(helpersStart >= 0 && helpersEnd > helpersStart);
assert.ok(componentStart >= 0 && componentEnd > componentStart);

const ordinary = [
  { id: 9, name: 'Деревянные шпажки 20 см / Фасовка', fact: 17 },
  { id: 21, name: 'Кокосовое молоко / Фасовка', fact: 30 },
  { id: 25, name: 'Томаты консервированные измельченные / Фасовка', fact: 113 },
  { id: 58, name: 'Яйцо куриное фасованное', fact: 858 },
  { id: 68, name: 'Сироп агавы / Фасовка', fact: 4 },
  { id: 88, name: 'Гречневая лапша соба / Фасовка', fact: 17 },
];
const dh = { id: 8874, name: 'ДХ Фарш из утиной грудки с жиром (150 гр)', packPlan: { qty: 24 } };

function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...(tree.children || []).flatMap(nodes)];
}

function render({ includeDh = true, manual = [] } = {}) {
  const shift = {
    facts: {
      ...Object.fromEntries(ordinary.map(it => [`packing-${it.id}-pl-0`, it.fact])),
      'meat-8874-pl-0': 30,
      'packing-9999-pl-0': 5,
    },
    manualDhItems: manual,
  };
  const before = JSON.stringify(shift);
  const requests = [];
  let hook = 0;
  const context = {
    useEffect() {},
    useMemo: fn => fn(),
    e: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
    console: { error: (...args) => { throw new Error(args.join(' ')); } },
    setTimeout() {},
    fetch: async (url, options) => {
      requests.push({ url, method: options.method, body: JSON.parse(options.body) });
      return { ok: true, json: async () => ({ sheetSync: { written: 1 } }) };
    },
  };
  vm.createContext(context);
  vm.runInContext(html.slice(helpersStart, helpersEnd), context);
  const catalog = [{ key: 'packing', items: [...(includeDh ? [dh] : []), ...ordinary] }];
  const shiftData = {
    shift,
    dhItems: context.getDHItems(catalog),
    factTotals: context.calcFactTotals(shift.facts),
  };
  // Even old saved non-DH distribution rows must not restore them into this list.
  const state = ['2026-10-13', shiftData, false, { 9: { to_kitchen_excess: 17 } }, {}, {}, false, ''];
  context.useState = () => {
    const index = hook++;
    return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
  };
  vm.runInContext(html.slice(componentStart, componentEnd), context);
  const tree = context.DXDistributionTab({ dateKey: '2026-10-13' });
  const rows = nodes(tree).filter(n => n.type === 'tr' && n.props.key != null);
  const saveButton = nodes(tree).find(n => n.type === 'button' && n.children.includes('Сохранить'));
  return { shift, before, requests, rows, saveButton };
}

test('distribution displays only DH, not ordinary positions or unknown IDs with facts', () => {
  const { rows } = render();
  assert.deepEqual(rows.map(row => row.props.key), ['8874', '8874_X']);
  assert.ok(rows[0].children.some(cell => cell.children.includes(dh.name)));
});

test('saving distribution sends only DH and preserves every ordinary workshop fact', async () => {
  const { shift, before, requests, saveButton } = render();
  assert.ok(saveButton);
  await saveButton.props.onClick();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/shifts/2026-10-13/dh-storage');
  assert.equal(requests[0].method, 'POST');
  assert.deepEqual(requests[0].body.items.map(it => it.item_id), [8874]);
  assert.equal(requests[0].body.items[0].to_kitchen, 24);
  assert.equal(requests[0].body.items[0].to_kitchen_excess, 6);
  assert.equal(JSON.stringify(shift), before);
  for (const item of ordinary) assert.equal(shift.facts[`packing-${item.id}-pl-0`], item.fact);
});

test('manually added DH keeps its name, plan, fact and real excess', async () => {
  const { rows, saveButton, requests } = render({
    manual: [{ id: 9000, name: 'ДХ ручная заготовка', plan: 5, fact: 7 }],
  });
  assert.deepEqual(rows.map(row => row.props.key), ['8874', '8874_X', '9000', '9000_X']);
  await saveButton.props.onClick();
  const item = requests[0].body.items.find(it => it.item_id === 9000);
  assert.equal(item.name, 'ДХ ручная заготовка');
  assert.equal(item.is_manual, true);
  assert.equal(item.to_kitchen, 5);
  assert.equal(item.to_kitchen_excess, 2);
});

test('a DH position already in the techcard is not duplicated by manual items', () => {
  const { rows } = render({ manual: [{ id: 8874, name: dh.name, plan: 24, fact: 30 }] });
  assert.deepEqual(rows.map(row => row.props.key), ['8874', '8874_X']);
});

test('a shift with only ordinary production facts has an empty DH distribution list', () => {
  const { rows, saveButton, requests } = render({ includeDh: false });
  assert.deepEqual(rows, []);
  assert.equal(saveButton, undefined);
  assert.equal(requests.length, 0);
});

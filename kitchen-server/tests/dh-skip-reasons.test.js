const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
function section(from, to) {
  const start = html.indexOf(from);
  const end = html.indexOf(to, start);
  assert.ok(start >= 0 && end > start);
  return html.slice(start, end);
}
const helpers = section('function calcFactTotals(', '// Подвкладка "Факты смены"');
const components = {
  facts: section('function DXFactsTab(', 'function DXDistributionTab('),
  distribution: section('function DXDistributionTab(', '// Главная вкладка ДХ/Склад'),
};
const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...node.children.flatMap(nodes)];
const text = node => typeof node === 'string' ? node : (node?.children || []).map(text).join(' ');

function render(tab, { reasons = {}, fact = 0, date = '2026-10-15' } = {}) {
  const shift = {
    facts: { 'meat-8874-pl-0': fact },
    skipReasons: reasons,
    manualDhItems: [{ uid: 'manual', id: 9004, name: 'ДХ ручная', plan: 10, fact: 2 }],
  };
  const before = JSON.stringify(shift);
  const dhItems = [{ stationKey: 'meat', item: { id: 8874, name: 'ДХ заготовка' }, plan: 24 }];
  const shiftData = { shift, dhItems, factTotals: { 8874: fact } };
  const state = tab === 'facts'
    ? [date, shiftData, false, {}, false, '', shift.manualDhItems, null, '', '', '', [], false, []]
    : [date, shiftData, false, {}, {}, {}, false, ''];
  let hook = 0;
  const requests = [];
  const context = {
    React: { useRef: () => ({ current: false }) },
    useState() {
      const i = hook++;
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }];
    },
    useEffect() {},
    useMemo: fn => fn(),
    e: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
    setTimeout() {},
    console,
    fetch: async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body) });
      return { ok: true, json: async () => ({ sheetSync: { written: 1 } }) };
    },
  };
  vm.createContext(context);
  vm.runInContext(helpers + '\n' + components[tab], context);
  const tree = tab === 'facts' ? context.DXFactsTab({ dateKey: date }) : context.DXDistributionTab({ dateKey: date });
  return { tree, context, shift, before, requests };
}

for (const tab of Object.keys(components)) {
  for (const fact of [0, 12]) {
    test(`${tab}: marked reasons appear for unmade and partially made DH (fact ${fact})`, () => {
      const { tree } = render(tab, { fact, reasons: {
        'meat-8874-pl-0': 'no_material',
        'packing-8874-pl-1': 'no_time',
        'meat-8874-pl-2': 'no_material',
        'meat-9-pl-0': 'no_time',
      } });
      const row = nodes(tree).find(n => n.type === 'tr' && String(n.props.key) === '8874');
      assert.ok(row);
      assert.match(text(row), /Причина невыполнения: Нет сырья; Не успели/);
      assert.equal(text(row).split('Нет сырья').length - 1, 1);
    });
  }

  test(`${tab}: no invented reason when none is marked, or a mark was cleared`, () => {
    for (const reasons of [{}, { 'meat-8874-pl-0': '' }, { 'meat-8874-pl-0': 'unknown' }]) {
      const { tree } = render(tab, { reasons });
      assert.doesNotMatch(text(tree), /Причина невыполнения/);
    }
  });

  test(`${tab}: item-level reasons also appear on a matching manual DH`, () => {
    const { tree } = render(tab, { reasons: { 'meat-9004': 'no_time' } });
    const row = nodes(tree).find(n => n.type === 'tr' && n.children.some(c => text(c).includes('ДХ ручная')));
    assert.match(text(row), /Причина невыполнения: Не успели/);
  });

  test(`${tab}: reasons do not change the save payload or workshop marks`, async () => {
    const { tree, shift, before, requests } = render(tab, {
      fact: 12, reasons: { 'meat-8874-pl-0': 'no_material' },
    });
    const save = nodes(tree).find(n => n.type === 'button' && text(n) === (tab === 'facts' ? 'Сохранить факт' : 'Сохранить'));
    assert.ok(save);
    await save.props.onClick();
    assert.equal(requests.length, 1);
    assert.equal(JSON.stringify(shift), before);
    if (tab === 'facts') {
      assert.equal(requests[0].body.shift.skipReasons['meat-8874-pl-0'], 'no_material');
      assert.equal(requests[0].body.shift.facts['meat-8874-pl-0'], 12);
    } else {
      assert.equal(requests[0].body.items.find(it => it.item_id === 8874).total_fact, 12);
      assert.equal(requests[0].body.skipReasons, undefined);
    }
  });
}

test('only current item/packing-line keys are aggregated, with exact item IDs', () => {
  const { context } = render('facts');
  const actual = context.calcDHSkipReasons({
    'meat-8874': 'no_material',
    'packing-8874-pl-1': 'no_time',
    'prev-meat-8874-pl-0': 'no_material',
    'prev-meat-9004-pl-0': 'no_time',
    'precut-meat-9004': 'no_material',
    'zames-meat-9004': 'no_time',
    'meat-18874-pl-0': 'no_time',
    'meat-8874-pl-0-extra': 'no_material',
  });
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), {
    8874: ['Нет сырья', 'Не успели'],
    18874: ['Не успели'],
  });
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const html = readFileSync(resolve(__dirname, '../public/index.html'), 'utf8');

function loadFunctionRange(startMarker, endMarker, exports) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  assert.notEqual(start, -1, `Missing ${startMarker}`);
  assert.notEqual(end, -1, `Missing ${endMarker}`);
  const context = { todayKey: () => '2026-09-22' };
  vm.createContext(context);
  vm.runInContext(
    `${html.slice(start, end)};Object.assign(this,{${exports.join(',')}});`,
    context
  );
  return context;
}

const workshopHelpers = loadFunctionRange(
  'function visibleStationName',
  '// ============================================================\n// СОТРУДНИКИ ПО УМОЛЧАНИЮ',
  ['mergeWorkshopGroups']
);
const employeeHelpers = loadFunctionRange(
  'function getShopEmployees',
  '// ============================================================\n// УТИЛИТЫ',
  ['getShopEmployees']
);

function station(shop, name, key, ids) {
  return {
    shop,
    name: `${shop} / ${name}`,
    key,
    items: ids.map(id => ({ id })),
  };
}

const rawGroups = [
  {
    shop: 'Мясной цех',
    stations: [
      station('Мясной цех', 'Плита', 'meat_plate', [3]),
      station('Мясной цех', 'Фасовка', 'meat_pack', [4]),
    ],
  },
  {
    shop: 'Рыбный цех',
    stations: [station('Рыбный цех', ' плита ', 'fish_plate', [1, 2])],
  },
  {
    shop: 'Соусный цех',
    stations: [station('Соусный цех', 'Бленд', 'sauce_blend', [8])],
  },
  {
    shop: 'Молочный цех',
    stations: [station('Молочный цех', 'Бленд', 'milk_blend', [7])],
  },
];

test('past shifts keep their original workshop groups', () => {
  assert.equal(
    workshopHelpers.mergeWorkshopGroups(rawGroups, '2026-09-21', '2026-09-22'),
    rawGroups
  );
});

test('current shifts merge workshops, station names and source-ordered items', () => {
  const merged = workshopHelpers.mergeWorkshopGroups(
    rawGroups,
    '2026-09-22',
    '2026-09-22'
  );
  const fishMeat = merged.find(group => group.shop === 'Рыбный/Мясной цех');
  const dairySauce = merged.find(group => group.shop === 'Молочный/Соусный цех');

  assert.ok(fishMeat);
  assert.ok(dairySauce);
  assert.deepEqual(
    Array.from(fishMeat.stations, station => station._visibleName.trim()),
    ['плита', 'Фасовка']
  );
  assert.deepEqual(
    Array.from(fishMeat.stations[0].items, item => item.id),
    [1, 2, 3]
  );
  assert.deepEqual(
    Array.from(dairySauce.stations[0].items, item => item.id),
    [7, 8]
  );
  assert.deepEqual(
    Array.from(fishMeat.stations[0].items, item => item.__sourceStationKey),
    ['fish_plate', 'fish_plate', 'meat_plate']
  );
});

test('merged workshop employees are the deduplicated union of both source shops', () => {
  const merged = workshopHelpers.mergeWorkshopGroups(
    rawGroups,
    '2026-09-22',
    '2026-09-22'
  );
  const fishMeat = merged.find(group => group.shop === 'Рыбный/Мясной цех');
  const employees = [
    { id: 'fish', shops: ['Рыбный цех'] },
    { id: 'meat', shops: ['Мясной цех'] },
    { id: 'both', shops: ['Рыбный цех', 'Мясной цех'] },
    { id: 'other', shops: ['Сухой цех'] },
  ];

  assert.deepEqual(
    Array.from(employeeHelpers.getShopEmployees(fishMeat, employees), employee => employee.id),
    ['fish', 'meat', 'both']
  );
});
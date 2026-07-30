# Кухонный трекер — описание проекта

## Что это

Веб-приложение для управления кухонным производством. Одностраничное React-приложение с Node.js/Express бэкендом и SQLite базой данных. Работает в локальной сети кухни.

## Запуск

```bash
cd /Users/admin/kitchen-app/kitchen-server
node server.js
# Открыть: http://localhost:3000
```

## Структура

```
kitchen-app/
└── kitchen-server/
    ├── server.js          # Express + WebSocket сервер
    ├── db.js              # SQLite схема (node:sqlite DatabaseSync)
    ├── kitchen.db         # База данных (SQLite)
    ├── routes/
    │   ├── shifts.js      # /api/shifts — смены
    │   ├── techcards.js   # /api/techcards — техкарты
    │   └── employees.js   # /api/employees — сотрудники
    └── public/
        └── index.html     # Всё приложение (~1.4MB, React 18 CDN)
```

## Технологии

- **Node.js v26** с встроенным `node:sqlite` (DatabaseSync — синхронный)
- **Express 4** + **ws** (WebSocket на том же порту через `server.on('upgrade', ...)`)
- **React 18** (CDN, без сборки) — `React.createElement` / `e()` синтаксис
- **XLSX.js** (CDN) — парсинг Excel в браузере
- НЕ используется: better-sqlite3 (не компилируется на Node 26 arm64)

## Важные детали node:sqlite

```js
// Транзакции — нет .transaction(), используем:
db.exec('BEGIN');
try { ...; db.exec('COMMIT'); }
catch(e) { db.exec('ROLLBACK'); throw e; }

// SQL aliases работают (snake_case обязателен):
db.prepare('SELECT t.name as techcard_name FROM ...').get()
// row.techcard_name — ОК
// row.techcardName — undefined (camelCase не работает)
```

## Схема БД

| Таблица | Назначение |
|---------|-----------|
| `techcards` | Техкарты (Excel → items_json: {itemId: [{volume, packName, destination, qty}]}) |
| `shifts` | Смены (date PK, techcard_id FK) |
| `shift_item_status` | Выполнение позиций (station_key, item_id, done) |
| `shift_item_employees` | Кто выполнил позицию |
| `shift_facts` | Фактические количества |
| `shift_pack_lines` | Переопределения упаковки (только если отличаются от Excel) |

## API

```
GET  /api/shifts/index          → {dates: [...]}
GET  /api/shifts/summary        → [{date, techcardId, techcardName, totalItems, doneItems}]
GET  /api/shifts/:date          → {shift: {date, techcardId, doneFlags, doneBy, facts, itemPackLines}}
POST /api/shifts/:date          → сохранить смену

GET  /api/techcards             → список (без items_json)
GET  /api/techcards/:id         → полная техкарта с items
POST /api/techcards             → {name, filename, items} → {id, ok}
DELETE /api/techcards/:id       → удалить

GET  /api/employees             → активные сотрудники
POST /api/employees             → сохранить список (деактивирует удалённых)
```

## Режимы приложения

### Обычный режим (`http://localhost:3000`)
- Кнопки "🍳 Кухня" и "📊 Управляющий" в TopNav
- Кухня: выбор цеха → задания → галочки выполнения
- Внутри цеха: полоска переключения между цехами сверху
- Управляющий: Дашборд / Сотрудники / Смены / Техкарты

### Режим планшета (`?shop=goryachij_tseh_konvektomat`)
- Автоматически открывает нужный цех
- Нет навигации — только задание цеха и дата
- Ключи цехов: см. ниже

## URL планшетов

| Цех | Параметр URL |
|-----|-------------|
| Горячий цех | `?shop=goryachij_tseh_konvektomat` |
| Сухой цех | `?shop=suhoj_tseh_ruchnaja_fasovka` |
| Рыбный цех | `?shop=rybnyj_tseh_suvid` |
| Молочный цех | `?shop=molochnyj_tseh_fasovka` |
| Мясной цех | `?shop=mjasnoj_tseh_fasovka` |
| Соусный цех | `?shop=sausnyj_tseh_fasovka` |
| Овощной цех | `?shop=ovoshchnoj_tseh_fasovka` |

## Поток данных (техкарта → смена)

1. Управляющий загружает Excel файл в Техкарты → парсится на клиенте (XLSX.js)
2. Техкарта сохраняется на сервере (`/api/techcards POST`)
3. "Применить" → `applyTechcard(tc)`:
   - `shift.techcardId = tc.id`
   - `shift.itemPackLines = tc.items` (перекрывает defaults)
   - Смена сохраняется на сервер
4. `getCatalogForDate(date, techcard)` фильтрует `STATIONS_CATALOG_FROM_EXCEL` — показывает только позиции из техкарты
5. Цеха видят только свои отфильтрованные позиции

## Парсинг Excel техкарты

Формат: `Техкарты (N).xlsx` — один лист с секциями по цехам.

Ключевые паттерны:
- `ID#XXXX Заготовка: Название` — начало секции позиции
- `["ID","Продукт в упаковке","Объем","Упаковка","Назначение","Со склада","Количество"]` — таблица упаковки
- `["Всего:", ..., total_qty]` — конец таблицы упаковки

Парсер в HTML: `TechcardsTab → parseExcel()` (~line 7709)

## Каталог позиций

`STATIONS_CATALOG_FROM_EXCEL` (~line 754 в index.html) — жёсткий список всех возможных позиций по цехам, построенный из предыдущего Excel. Содержит ~196 позиций. Новые позиции из техкарты, которых нет в каталоге, не будут отображаться в цехах.

## Известные проблемы / особенности

- HTTP/1.1 браузер держит max 6 соединений к одному хосту; при большом числе параллельных запросов могут быть задержки
- Расширение Claude в Chrome создаёт задержки сетевых запросов при мониторинге
- `EXCEL_PACK_LINES` (~line 6500) — старый hardcoded fallback для pack lines (используется если нет данных из техкарты)
- WebSocket синхронизирует изменения смены между устройствами в реальном времени

## Команды для работы с БД (через curl)

```bash
# Очистить всё
node -e "const {DatabaseSync}=require('node:sqlite'); const db=new DatabaseSync('./kitchen.db'); db.exec('DELETE FROM shift_item_employees; DELETE FROM shift_item_status; DELETE FROM shift_facts; DELETE FROM shift_pack_lines; DELETE FROM shifts; DELETE FROM techcards;'); console.log('cleared');"

# Загрузить техкарту
curl -X POST http://localhost:3000/api/techcards -H 'Content-Type: application/json' -d '{"name":"Техкарта","filename":"file.xlsx","items":{...}}'

# Состояние
curl http://localhost:3000/api/shifts/summary
curl http://localhost:3000/api/techcards
```

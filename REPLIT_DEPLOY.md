# Деплой на Replit

## Как устроен переключатель БД

- **Локально** (нет `DATABASE_URL`) → `db-sqlite.js` → Node.js 26 + node:sqlite
- **На Replit** (`DATABASE_URL` задан) → `pg` Pool → PostgreSQL

`db-sqlite.js` на Replit никогда не загружается, поэтому Node 20 на Replit достаточен.

---

## Шаг 1 — Подготовь репозиторий на GitHub

1. Создай аккаунт на [github.com](https://github.com) (если нет)
2. Создай новый репозиторий: `New repository` → назови, например, `kitchen-app` → `Create`
3. В папке `kitchen-server` выполни в терминале:

```bash
cd /Users/admin/kitchen-app/kitchen-server
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/ВАШ_ЛОГИН/kitchen-app.git
git push -u origin main
```

> **Важно:** файл `kitchen.db` не нужен на Replit (там PostgreSQL). Убедись что он в `.gitignore`.

Создай файл `.gitignore` если его нет:
```
node_modules/
kitchen.db
kitchen.db-shm
kitchen.db-wal
.env
```

---

## Шаг 2 — Создай проект на Replit

1. Зайди на [replit.com](https://replit.com) → `Create Repl`
2. Выбери **Import from GitHub**
3. Вставь URL своего репозитория
4. Replit автоматически определит Node.js и установит зависимости

---

## Шаг 3 — Подключи PostgreSQL

1. В левой панели Replit найди раздел **Tools** → **Database** (или нажми значок БД)
2. Нажми **Create a database** → выбери **PostgreSQL**
3. Replit автоматически создаст БД и добавит переменную окружения `DATABASE_URL`

> Проверить: в разделе **Secrets** (замок в боковой панели) должна появиться переменная `DATABASE_URL` со значением вида `postgresql://user:pass@host/dbname`

---

## Шаг 4 — Первый запуск

1. В консоли Replit нажми кнопку **Run** (или `npm start` в Shell)
2. При первом запуске сервер автоматически создаст все таблицы в PostgreSQL (`initDb()`)
3. В консоли увидишь: `DB ready (PostgreSQL)` и `Kitchen server running on http://...`

---

## Шаг 5 — Получи публичный URL

1. После запуска сверху появится адрес вида `https://kitchen-app.YOUR_NAME.repl.co`
2. Этот URL доступен из интернета — можно открывать с планшетов по Wi-Fi или 4G

> Чтобы приложение не засыпало на бесплатном плане Replit — включи **Always On** в настройках Repl (требует Replit Core/Hacker план) или используй внешний пингер типа [UptimeRobot](https://uptimerobot.com).

---

## Деплой обновлений

После изменений в коде:

```bash
git add .
git commit -m "описание изменений"
git push
```

В Replit нажми кнопку **Pull** (или в Shell: `git pull`) → **Run**.

---

## Данные (PostgreSQL vs SQLite)

| | Локально | Replit |
|---|---|---|
| БД | SQLite (`kitchen.db`) | PostgreSQL |
| Данные | Файл на диске | Облачная БД Replit |
| Между перезапусками | Сохраняются | Сохраняются |
| Бэкап | Скопировать `kitchen.db` | Replit делает автобэкап |

**Перенести данные с локального на Replit:** пока не реализовано автоматически.
Если нужно — можно сделать скрипт экспорта из SQLite → импорта в PostgreSQL.

---

## Возможные проблемы

**`Cannot find module 'pg'`** → в Shell выполни `npm install`

**`SSL connection error`** → уже обработано в `db.js`: `ssl: { rejectUnauthorized: false }`

**Приложение открывается, но данных нет** → нормально при первом деплое, таблицы пустые. Нужно заново загрузить техкарту через интерфейс.

**WebSocket не подключается** → Replit поддерживает WebSocket. Если не работает — проверь что URL в браузере начинается с `https://` (не `http://`), тогда WS автоматически использует `wss://`.

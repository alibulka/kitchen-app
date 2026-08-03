# Инструкция по деплою и подключению

## Локальный запуск

```bash
cd kitchen-server
npm install
node server.js
# Сервер доступен на http://localhost:3000
```

## Подключение планшетов в локальной сети

1. Узнай IP-адрес компьютера, на котором запущен сервер:
   - macOS: `ifconfig | grep "inet " | grep -v 127`
   - Windows: `ipconfig`
   - Пример: `192.168.1.42`

2. На планшете открой браузер и перейди по адресу:
   ```
   http://192.168.1.42:3000
   ```

3. Все планшеты будут синхронизироваться в реальном времени через WebSocket.

> Важно: компьютер с сервером и планшеты должны быть в одной Wi-Fi сети.

---

## Деплой через Render.com (интернет-доступ)

1. Создай аккаунт на [render.com](https://render.com)
2. Загрузи папку `kitchen-server` в GitHub-репозиторий
3. В Render: New → Web Service → подключи репозиторий
4. Render автоматически найдёт `render.yaml` и `Dockerfile`
5. После деплоя получишь URL вида `https://kitchen-app.onrender.com`

> Для постоянного хранения базы данных: в Render добавь Disk (уже описан в render.yaml).

---

## Деплой через Railway.app

1. Установи Railway CLI: `npm install -g @railway/cli`
2. В папке `kitchen-server`:
   ```bash
   railway login
   railway init
   railway up
   ```
3. Получишь URL вида `https://kitchen-app-production.up.railway.app`

> Railway не поддерживает persistent disk на бесплатном тарифе — данные сбрасываются при перезапуске. Используй Render для продакшена.

---

## Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `PORT` | `3000` | Порт сервера |

---

## Структура файлов

```
kitchen-server/
├── server.js          # HTTP + WebSocket сервер
├── db.js              # SQLite (встроенный node:sqlite)
├── routes/
│   ├── shifts.js      # /api/shifts/*
│   └── employees.js   # /api/employees
├── public/
│   └── index.html     # фронтенд (kitchen-app.html)
├── package.json
├── Dockerfile
├── render.yaml
├── railway.json
└── .env
```

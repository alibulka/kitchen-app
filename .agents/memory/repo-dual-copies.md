---
name: Дубли кода в корне vs kitchen-server
description: Актуальный код — kitchen-server/; merge с Mac пользователя может переключить запуск на устаревшую корневую копию
---

Актуальная полная версия приложения живёт в `kitchen-server/` (облачные фото, чанк-импорт, pool.on('error'), акты). В корне репо лежат устаревшие копии (server.js, db.js, routes/ и т.д.).

**Why:** merge с Mac пользователя (2 авг 2026) переключил workflow и `[deployment] run` в .replit на корневой `npm start` — публикация запустила бы старый код без облачных фото и фикса падений. Пользователь ОТМЕНИЛА задачи по удалению дублей и по внутреннему паролю — не перепредлагать.

**How to apply:** после любого пуша/мерджа с её Mac проверять, что workflow = `cd kitchen-server && PORT=5000 npm start` и deployment run = `bash -c "cd kitchen-server && node server.js"`, и что kitchen-server/ не затёрт. Конфиг публикации менять только через deployConfig (run — массив, не строка).

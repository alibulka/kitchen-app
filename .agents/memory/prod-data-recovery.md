---
name: Восстановление данных на проде
description: Как откатывать прод-БД и возвращать отметки смен; особенности прод-схемы при SQL-запросах
---

- Прод-БД откатывается пользовательницей через Database pane → Production → point-in-time restore (я имею только read-only SQL).
- Перед откатом снять полный снимок смены: `GET https://kitchen-app.replit.app/api/shifts/<date>` (содержит doneFlags/doneTimes/doneBy/facts/skipReasons) и сохранить в `backups/`.
- После отката потерянные отметки возвращаются `POST /api/shifts/<date>` с телом `{"shift": {...}}` — сервер сохраняет оригинальные done_at и сотрудников (upsert, соседние данные не трогает). **Обязательно** включать techcardId/udTechcardId из снимка, иначе saveShift затрёт их NULL-ом.
- **Why:** редактирование шаблонов актов до фикса каскадно стирало act_values; спасли откатом + replay через API (август 2026).
- В прод-таблицах done_at/skip_at/updated_at — TEXT (ISO-строки): сравнения с `now() - interval` или `timestamp '...'` молча падают (видно только START TRANSACTION/ROLLBACK). Сравнивать строками: `done_at >= '2026-08-06T11:24'`. Каталог: таблица items имеет ключ `item_id`, не `id`.

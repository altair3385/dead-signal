# DEAD SIGNAL v0.1 — план

## Архитектура
- Клиент полностью локальный: Phaser 3 + TypeScript + Vite, логический экран 360×640 (вертикальный), масштаб FIT.
- Сцены: Boot → Mission → Result. Дальше добавятся Shelter, Map, Inventory.
- Данные (предметы, враги, локации, персонажи, постройки, стадии заражения) в JSON, доступ через `registry.ts`.
- Логика вылазки отделена от сцен: `systems/` (лут, заражение, RunState), `entities/` (Player, Enemy, LootPoint).
- Сохранения через `SaveStore` с интерфейсом `SaveBackend`: сейчас localStorage, потом серверный бэкенд без правки сцен.
- `telegram/telegram.ts` — единственное место, где игра знает про Telegram.
- Арт — временные спрайты, нарисованные кодом. Ключи текстур совпадут с будущим atlas.

## Дерево файлов
```
src/
  main.ts
  config/        gameConfig.ts, palette.ts
  telegram/      telegram.ts
  storage/       SaveStore.ts
  game/
    data/        items, enemies, locations, characters, upgrades, infection (.json), types.ts, registry.ts
    art/         placeholders.ts
    entities/    Player.ts, Enemy.ts, LootPoint.ts
    systems/     LootSystem.ts, InfectionSystem.ts, RunState.ts
    ui/          Hud.ts, TouchControls.ts, Button.ts, text.ts
    scenes/      BootScene.ts, MissionScene.ts, ResultScene.ts
```

## Первый milestone (готов: этапы A–D)
- Вылазка в Автобусный парк или Поликлинику, side-view, камера следует за игроком.
- Ходьба ◀ ▶, удар ломом, выстрел из ПМ (12 патронов, точность Стрелка 90%).
- 3 врага: медленный заражённый, быстрый «бегун», мародёр со стрельбой. Атаку видно заранее (враг краснеет).
- Удар заражённого даёт урон и заражение. Сквозь живых врагов не пройти.
- 5 контейнеров со случайным лутом: чем дальше от выхода, тем ценнее.
- Выход у зелёного знака в начале уровня: «уйти с лутом или рискнуть ещё». Смерть = лут вылазки потерян.
- Экран результата: лут, урон, заражение, патроны, опыт. Найденное копится на складе (localStorage).

## Сознательно НЕ входит в v0.1
Бэкенд, аккаунты, серверные сохранения, PvP, кланы, сезоны, Stars/TON/NFT, магазин, мультиплеер,
торговля, машины, процедурная генерация, сюжет, игра за заражённых, больше одного играбельного персонажа,
drag-and-drop в инвентаре, сложный AI, частицы и тяжёлые эффекты.

# DEAD SIGNAL v0.1

2D постапокалиптическая survival-игра для Telegram Mini App. Стиль — «серая Россия».
Phaser 3 + TypeScript + Vite, сохранения в localStorage, без бэкенда.

## Запуск на Android (Termux)

Один раз:

```sh
pkg update && pkg install nodejs-lts git
cd dead-signal
npm install
```

Играть / разрабатывать:

```sh
npm run dev
```

Открой в Chrome на телефоне: `http://localhost:5173`
(Vite печатает и сетевой адрес — по нему можно открыть с другого устройства в той же Wi‑Fi.)

Проверка перед коммитом (типы + production-сборка):

```sh
npm run build      # результат в dist/
npm run preview    # посмотреть собранную версию: http://localhost:4173
```

## Управление

Телефон: ◀ ▶ — ходьба, УДАР — лом, ОГОНЬ — пистолет (тратит патроны),
верхняя кнопка — обыскать ящик / выйти из локации (у зелёного знака ВЫХОД).
Клавиатура: A/D или стрелки, J/пробел — удар, K — выстрел, E — действие.

## Структура

```
src/
  main.ts                 конфиг Phaser, список сцен
  config/                 размеры экрана, палитра
  telegram/telegram.ts    обёртка Telegram WebApp (сейчас: ready/expand)
  storage/SaveStore.ts    сохранения; интерфейс SaveBackend для будущего сервера
  game/
    data/*.json           предметы, враги, локации, персонажи, постройки, стадии заражения
    data/registry.ts      доступ к данным по id
    art/placeholders.ts   временные спрайты, рисуются кодом (ключи = будущий atlas)
    entities/             Player, Enemy, LootPoint
    systems/              лут, заражение, состояние вылазки
    ui/                   HUD, экранное управление, кнопки
    scenes/               Boot → Mission → Result
```

Новый предмет, враг или локация добавляется правкой JSON в `src/game/data/`, без изменения кода.

## Этапы

- [x] A. Проект и запуск
- [x] B. Сцена миссии и управление
- [x] C. Враги и бой (3 типа: медленный, быстрый, мародёр со стрельбой)
- [x] D. Лут и выход из миссии, экран результата
- [ ] E. Убежище + карта
- [ ] F. Инвентарь
- [ ] G. Заражение (эффекты стадий, лечение)
- [ ] H. Улучшение базы
- [ ] I. Mobile optimization (в т.ч. чёткость на HiDPI)
- [ ] J. Telegram Mini App integration

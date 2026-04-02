# Stream Fan

Веб‑приложение для распознавания жестов руки и вывода эмодзи на экран.  
Идеально подходит для стримеров, позволяя взаимодействовать с аудиторией без использования клавиатуры.

## Цель проекта

Предоставить простой, быстрый и надёжный способ управления реакциями на стриме с помощью жестов руки.  
Приложение работает полностью в браузере, не требует установки дополнительных программ и не отправляет данные на сервер.

## Архитектура

Поток данных:

```
Camera → HandTracker → GestureEngine → ReactionState → EmojiRenderer
```

### Слои

| Слой            | Ответственность                                        |
|-----------------|--------------------------------------------------------|
| **Camera**      | Доступ к веб‑камере, передача видео‑потока в `<video>` |
| **Loop**        | Управление главным циклом анимации                     |
| **HandTracker** | Обёртка над MediaPipe Hand Landmarker                  |
| **GestureEngine** | Чистая логика распознавания жестов                    |
| **ReactionState** | Фильтрация дребезга, контроль cooldown               |
| **EmojiRenderer** | Отображение эмодзи в UI (работа с DOM)                |

### Структура проекта

```
/stream-fan-project
│   index.html
│   style.css
│   README.md
│   package.json
└─ src/
   ├─ app.js
   ├─ core/
   │   ├─ camera.js
   │   └─ loop.js
   ├─ vision/
   │   └─ handTracker.js
   ├─ gestures/
   │   ├─ gestureEngine.js
   │   ├─ thumbsUp.js
   │   └─ rock.js
   ├─ state/
   │   └─ reactionState.js
   ├─ render/
   │   ├─ emojiRenderer.js
   │   └─ emojiMap.js
   └─ utils/
       └─ debounce.js
```

## Технологии

- **JavaScript** (ES Modules)
- **HTML5** / **CSS3**
- **MediaPipe Hand Landmarker** – определение 21 точки руки
- Без фреймворков, без бэкенда

## Запуск

1. Откройте `index.html` в современном браузере (Chrome/Firefox).
2. Разрешите доступ к камере.
3. Покажите жесты «thumbs up» или «rock» перед камерой.

## Лицензия

MIT
📁 1. Architecture.md

🧠 Общая идея

Пайплайн приложения:

Camera → HandTracker → GestureEngine → ReactionState → EmojiRenderer

🔧 Слои

1. Camera
	•	Отвечает за доступ к камере
	•	Возвращает: HTMLVideoElement

2. HandTracker
	•	Использует MediaPipe
	•	Определяет 21 точку руки (landmarks)
	•	Возвращает: массив координат

3. GestureEngine
	•	Чистая логика
	•	Преобразует landmarks → жест
	•	НЕ работает с DOM

4. ReactionState
	•	Убирает дребезг
	•	Контролирует cooldown
	•	Не допускает повторных срабатываний

5. EmojiRenderer
	•	Отвечает за UI
	•	Показывает эмодзи

📁 Структура проекта

index.html
style.css

src/
  app.js

  core/
    camera.js
    loop.js

  vision/
    handTracker.js

  gestures/
    gestureEngine.js
    thumbsUp.js
    rock.js

  state/
    reactionState.js

  render/
    emojiRenderer.js
    emojiMap.js

  utils/
    debounce.js

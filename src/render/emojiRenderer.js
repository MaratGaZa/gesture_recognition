// src/render/emojiRenderer.js

/**
 * EmojiRenderer – отвечает за визуальное отображение эмодзи.
 * В текущей реализации отображается один эмодзи в контейнере #emoji-container
 * (созданном в index.html). После небольшого таймаута элемент удаляется,
 * чтобы не захламлять DOM.
 */

import { getEmojiByGesture } from './emojiMap.js';

// Показать эмодзи в центре экрана (если не указаны координаты)
export function showEmoji(gesture) {
  showEmojiAt(gesture, null);
}

/**
 * Показывает эмодзи, позиционируя его рядом с рукой.
 *
 * @param {string} gesture - константа жеста (THUMBS_UP | ROCK)
 * @param {Array|null} landmarks - массив из 21 точек руки (может быть null)
 */
export function showEmojiAt(gesture, landmarks) {
  const symbol = getEmojiByGesture(gesture);
  if (!symbol) return;

  const container = document.getElementById('emoji-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'emoji visible';
  el.textContent = symbol;

  // Если переданы landmarks – позиционируем около запястья (landmarks[0])
  // Переводим нормализованные координаты (0‑1) в пиксели относительно video‑элемента.
  if (landmarks && landmarks[0]) {
    const video = document.getElementById('video');
    if (video) {
      const rect = video.getBoundingClientRect();
      const wrist = landmarks[0];
      const x = rect.left + wrist.x * rect.width;
      const y = rect.top + wrist.y * rect.height;

      el.style.position = 'absolute';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      // Смещаем немного, чтобы эмодзи не накладывался прямо на палец
      el.style.transform = 'translate(-50%, -110%)';
    }
  } else {
    // Центрируем в контейнере, если координаты неизвестны
    el.style.position = 'absolute';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
  }

  container.appendChild(el);

  // Удаляем через 800 мс (параметр можно вынести в константу)
  const DISPLAY_TIME = 800;
  setTimeout(() => {
    el.classList.remove('visible');
    // небольшая задержка, чтобы анимация исчезновения успела выполнить переход opacity
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }, DISPLAY_TIME);
}

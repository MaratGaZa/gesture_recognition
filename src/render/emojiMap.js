/**
 * Карта соответствия жестов и эмодзи.
 * @module render/emojiMap
 */

/**
 * Константы жестов.
 */
export const Gesture = {
  THUMBS_UP: 'THUMBS_UP',
  ROCK: 'ROCK',
};

/**
 * Соответствие жест -> Unicode‑символ эмодзи.
 */
export const EMOJI_MAP = {
  [Gesture.THUMBS_UP]: '👍',
  [Gesture.ROCK]: '🤘',
};

/**
 * Возвращает эмодзи по имени жеста.
 * @param {string} gesture — константа из Gesture
 * @returns {string|null} — Unicode‑символ или null, если жест не найден
 */
export function getEmojiByGesture(gesture) {
  return EMOJI_MAP[gesture] ?? null;
}

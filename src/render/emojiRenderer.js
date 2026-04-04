import { getEmojiByGesture } from './emojiMap.js';

const GESTURE_META = {
  THUMBS_UP: {
    label: '👍 Thumbs Up!',
    reactions: ['❤️', '🧡', '💛', '💜', '💗'],
  },
  ROCK: {
    label: '🤘 Rock!',
    reactions: ['🔥', '⚡', '💥', '🎸'],
  },
  V_SIGN: {
    label: '✌️ Peace!',
    reactions: ['✨', '⭐', '🌟', '💫'],
  },
  PALM: {
    label: '🖐️ Palm!',
    reactions: ['🌈', '💙', '🫧', '☁️'],
  },
  POINT: {
    label: '☝️ Point!',
    reactions: ['💬', '📝', '📍', '✨'],
  },
  SHAKA: {
    label: '🤙 Shaka!',
    reactions: ['🌴', '🌊', '☀️', '🍍'],
  },
  FIST: {
    label: '✊ Fist!',
    reactions: ['💥', '⚡', '🔥', '⭐'],
  },
};

let badgeTimer = null;

function getMeta(gesture) {
  const fallback = getEmojiByGesture(gesture);
  return (
    GESTURE_META[gesture] || {
      label: `${fallback ?? '✨'} ${gesture}`,
      reactions: fallback ? [fallback] : ['✨'],
    }
  );
}

function showBadge(label) {
  const badge = document.getElementById('gesture-badge');
  if (!badge) return;

  badge.textContent = label;
  badge.classList.remove('is-visible');
  void badge.offsetWidth;
  badge.classList.add('is-visible');
  badge.style.opacity = '1';

  clearTimeout(badgeTimer);
  badgeTimer = setTimeout(() => {
    badge.style.opacity = '0';
    badge.classList.remove('is-visible');
  }, 2000);
}

export function showEmoji(gesture) {
  const container = document.getElementById('emoji-container');
  if (!container) return;

  const meta = getMeta(gesture);
  const count = 12;

  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('div');
    const left = 5 + Math.random() * 90;
    const top = 20 + Math.random() * 65;
    const duration = 1 + Math.random() * 0.9;
    const delay = Math.random() * 0.6;
    const fontSize = 22 + Math.random() * 22;
    const symbol = meta.reactions[Math.floor(Math.random() * meta.reactions.length)];

    el.className = 'emoji-burst';
    el.textContent = symbol;
    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    el.style.fontSize = `${fontSize}px`;
    el.style.setProperty('--float-duration', `${duration}s`);
    el.style.setProperty('--float-delay', `${delay}s`);

    container.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay + 0.3) * 1000);
  }

  showBadge(meta.label);
}

export function clearEmojiEffects() {
  const container = document.getElementById('emoji-container');
  if (container) {
    container.replaceChildren();
  }

  const badge = document.getElementById('gesture-badge');
  if (badge) {
    badge.textContent = '';
    badge.style.opacity = '0';
    badge.classList.remove('is-visible');
  }

  clearTimeout(badgeTimer);
  badgeTimer = null;
}

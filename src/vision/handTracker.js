// HandTracker module – обёртка вокруг MediaPipe Hands

let hands = null;
let HandsClassRef = null;
let currentResolve = null;
let handsReady = false;

/**
 * Позволяет внедрить (замокать) класс Hands извне (для тестов)
 * @param {any} cls
 */
export function setHandsClass(cls) {
  HandsClassRef = cls;
}

/**
 * Инициализирует MediaPipe Hands.
 * @returns {Promise<void>}
 */
export async function init() {
  const HandsClass =
    HandsClassRef ||
    globalThis.Hands ||
    (typeof window !== "undefined" ? window.Hands : undefined);

  if (!HandsClass) {
    throw new Error(
      "MediaPipe Hands не загружен. Убедитесь, что скрипт подключён в index.html.",
    );
  }

  hands = new HandsClass({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.3,
    minTrackingConfidence: 0.3,
  });

  // Устанавливаем onResults ОДИН раз при инициализации
  hands.onResults(onResults);
  handsReady = true;
}

/**
 * Callback для MediaPipe Hands — вызывается асинхронно после обработки кадра.
 * @param {Object} results - результаты от MediaPipe
 */
function onResults(results) {
  if (currentResolve) {
    if (
      results &&
      results.multiHandLandmarks &&
      results.multiHandLandmarks.length > 0
    ) {
      currentResolve({ landmarks: results.multiHandLandmarks[0] });
    } else {
      currentResolve({ landmarks: null });
    }
    currentResolve = null;
  }
}

/**
 * Детектирует руку на видео-кадре.
 * @param {HTMLVideoElement} video – элемент с видео-потоком
 * @param {number} time – метка времени (для синхронизации)
 * @returns {Promise<{landmarks: Array<{x: number, y: number, z: number}> | null}>}
 */
export function detect(video, time) {
  return new Promise((resolve) => {
    if (!hands || !handsReady) {
      resolve({ landmarks: null });
      return;
    }

    // Если предыдущий вызов ещё не завершился, resolved с null
    if (currentResolve) {
      currentResolve({ landmarks: null });
    }

    currentResolve = resolve;

    // Timeout fallback - увеличил до 3 секунд для мобильных
    const timeoutId = setTimeout(() => {
      if (currentResolve === resolve) {
        currentResolve = null;
        resolve({ landmarks: null });
      }
    }, 3000);

    // Передаём видео напрямую
    try {
      const result = hands.send({ image: video });

      // Если send() вернул Promise
      if (result instanceof Promise) {
        result.then(() => {
          clearTimeout(timeoutId);
        }).catch(() => {
          clearTimeout(timeoutId);
          if (currentResolve === resolve) {
            currentResolve = null;
            resolve({ landmarks: null });
          }
        });
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (currentResolve === resolve) {
        currentResolve = null;
        resolve({ landmarks: null });
      }
    }
  });
}

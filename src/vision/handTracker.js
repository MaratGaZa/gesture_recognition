// HandTracker module – обёртка вокруг MediaPipe Hands

let hands = null;
let HandsClassRef = null;
let currentResolve = null;
let handsReady = false;
let canvas = null;
let ctx = null;

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

  // Создаём canvas для отрисовки видео
  canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  ctx = canvas.getContext('2d');

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

    // Timeout fallback - если MediaPipe не ответил за 1000мс
    const timeoutId = setTimeout(() => {
      if (currentResolve === resolve) {
        currentResolve = null;
        resolve({ landmarks: null });
      }
    }, 1000);

    // Отрисовываем текущий кадр видео на canvas
    // Это необходимо для мобильных браузеров, где video element
    // может не отдавать кадры напрямую в MediaPipe
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = hands.send({ image: canvas });

      // Если send() вернул Promise (зависит от версии MediaPipe)
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

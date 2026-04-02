// HandTracker module – обёртка вокруг MediaPipe Hands

let hands = null;
let HandsClassRef = null;
let currentResolve = null;
let currentTimeoutId = null;
let handsReady = false;

const DETECT_TIMEOUT_MS = 200; // если onResults не пришёл за 200ms — идём дальше

export function setHandsClass(cls) {
  HandsClassRef = cls;
}

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

  hands.onResults(onResults);
  handsReady = true;
}

function onResults(results) {
  if (!currentResolve) return;

  // Отменяем таймаут — ответ пришёл вовремя
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId);
    currentTimeoutId = null;
  }

  const resolve = currentResolve;
  currentResolve = null;

  if (results?.multiHandLandmarks?.length > 0) {
    resolve({ landmarks: results.multiHandLandmarks[0] });
  } else {
    resolve({ landmarks: null });
  }
}

export function detect(video, time) {
  return new Promise((resolve) => {
    if (!hands || !handsReady) {
      resolve({ landmarks: null });
      return;
    }

    // ✅ Ключевая проверка: видео должно быть готово и иметь размеры
    if (
      !video ||
      video.readyState < 2 || // HAVE_CURRENT_DATA
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      resolve({ landmarks: null });
      return;
    }

    // Если предыдущий вызов завис — сбрасываем
    if (currentResolve) {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      currentResolve({ landmarks: null });
      currentResolve = null;
    }

    currentResolve = resolve;

    // ✅ Таймаут — защита от зависшего Promise
    currentTimeoutId = setTimeout(() => {
      if (currentResolve === resolve) {
        currentResolve = null;
        currentTimeoutId = null;
        resolve({ landmarks: null });
      }
    }, DETECT_TIMEOUT_MS);

    try {
      const result = hands.send({ image: video });

      if (result instanceof Promise) {
        result.catch(() => {
          if (currentResolve === resolve) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
            currentResolve = null;
            resolve({ landmarks: null });
          }
        });
      }
    } catch (e) {
      if (currentResolve === resolve) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
        currentResolve = null;
        resolve({ landmarks: null });
      }
    }
  });
}

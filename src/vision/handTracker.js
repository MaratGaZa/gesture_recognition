// HandTracker module – обёртка вокруг MediaPipe Hands

let hands = null;

/**
 * Инициализирует MediaPipe Hands.
 * @returns {Promise<void>}
 */
export async function init() {
  // Detect the MediaPipe Hands constructor using a robust order that works both
  // in a real browser and in the JSDOM test environment.
  // Order of checks:
  //   1. globalThis.Hands               – normal browser global
  //   2. global.window.Hands            – set by the test suite via global.window
  //   3. globalThis.window.Hands        – fallback when window is overridden in JSDOM
  //   4. window.Hands                  – generic fallback
  let HandsClass;
  if (typeof globalThis.Hands !== "undefined") {
    HandsClass = globalThis.Hands;
  } else if (
    typeof global !== "undefined" &&
    typeof global.window !== "undefined" &&
    typeof global.window.Hands !== "undefined"
  ) {
    HandsClass = global.window.Hands;
  } else if (
    typeof globalThis.window !== "undefined" &&
    typeof globalThis.window.Hands !== "undefined"
  ) {
    HandsClass = globalThis.window.Hands;
  } else if (
    typeof window !== "undefined" &&
    typeof window.Hands !== "undefined"
  ) {
    HandsClass = window.Hands;
  } else {
    HandsClass = undefined;
  }

  if (typeof HandsClass === "undefined") {
    throw new Error(
      "MediaPipe Hands не загружен. Убедитесь, что скрипт подключён в index.html.",
    );
  }

  hands = new HandsClass({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // Ждём готовности модели
  await new Promise((resolve) => {
    hands.onResults(() => resolve());
  });
}

/**
 * Детектирует руку на видео‑кадре.
 * @param {HTMLVideoElement} video – элемент с видео‑потоком
 * @param {number} time – метка времени (для синхронизации)
 * @returns {Promise<{landmarks: Array<{x: number, y: number, z: number}> | null}>}
 */
export function detect(video, time) {
  return new Promise((resolve) => {
    if (!hands) {
      resolve({ landmarks: null });
      return;
    }

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Возвращаем массив из 21 точки для первой найденной руки
        resolve({ landmarks: results.multiHandLandmarks[0] });
      } else {
        resolve({ landmarks: null });
      }
    });

    hands.send({ image: video });
  });
}

/**
 * Main entry point for the stream-fan-project application.
 * It initialises the camera, the MediaPipe hand‑tracker, the gesture engine,
 * the cooldown state and finally renders an emoji for the recognised gesture.
 *
 * The processing pipeline is:
 *   1️⃣ initCamera → video element
 *   2️⃣ handTracker.init()          // load MediaPipe Hands model
 *   3️⃣ startLoop(callback)         // requestAnimationFrame loop
 *   4️⃣ each frame:
 *        – detect hand landmarks,
 *        – detectGesture(landmarks),
 *        – reactionState.update(gesture) (cool‑down & deduplication),
 *        – if a gesture is emitted → showEmoji(gesture, landmarks)
 *
 * All modules are written as ES‑modules and imported below.
 */

import { initCamera } from "./core/camera.js";
import {
  init as initHandTracker,
  detect as detectHand,
} from "./vision/handTracker.js";
import { detectGesture } from "./gestures/gestureEngine.js";
import { ReactionState } from "./state/reactionState.js";
import { startLoop } from "./core/loop.js";
import { showEmoji } from "./render/emojiRenderer.js";

// Debug status element - создаём сразу
const statusEl = document.createElement('div');
statusEl.id = 'debug-status';
statusEl.style.cssText = 'position:fixed;top:60px;left:0;right:0;background:rgba(255,0,0,0.9);color:#fff;padding:12px;font-family:monospace;font-size:16px;z-index:9999;text-align:center;';
statusEl.textContent = '⏳ Инициализация...';
document.body.appendChild(statusEl);

// Debug log element
const debugLog = document.createElement('div');
debugLog.id = 'debug-log';
debugLog.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(0,0,0,0.95);color:#0f0;padding:8px;font-family:monospace;font-size:10px;z-index:9999;max-height:100px;overflow-y:auto;';
document.body.appendChild(debugLog);

function updateStatus(msg) {
  statusEl.textContent = msg;
  console.log('[STATUS]', msg);
}

function addLog(msg) {
  const time = new Date().toLocaleTimeString();
  debugLog.innerHTML = '<div>[' + time + '] ' + msg + '</div>' + debugLog.innerHTML;
  console.log('[LOG]', msg);
}

async function main() {
  // 1️⃣ Initialise video + webcam
  const video = document.getElementById("video");
  if (!video) {
    updateStatus("❌ Video element not found");
    return;
  }

  updateStatus('⏳ Запрос камеры...');
  try {
    await initCamera(video);
    updateStatus('✅ Камера инициализирована');
  } catch (err) {
    updateStatus("❌ Камера не работает: " + err.message);
    return;
  }

  // 2️⃣ Load MediaPipe Hands model
  updateStatus('⏳ Загрузка MediaPipe...');
  try {
    await initHandTracker();
    updateStatus('✅ MediaPipe загружен');
  } catch (err) {
    updateStatus("❌ MediaPipe не загружен: " + err.message);
    return;
  }

  // 3️⃣ Create state manager (default cooldown = 500 ms)
  const reactionState = new ReactionState();

  // 3b️⃣ Wait for video to be actually playing (not just initialized)
  updateStatus('⏳ Ожидание готовности видео...');
  let waitCount = 0;

  await new Promise((resolve) => {
    if (video.readyState >= 3) {
      // HAVE_ENOUGH_DATA
      resolve();
    } else {
      video.oncanplay = () => {
        video.oncanplay = null;
        addLog('video.oncanplay fired');
        resolve();
      };
    }
    // Timeout fallback
    setTimeout(() => {
      if (waitCount < 100) {
        waitCount++;
        addLog('readyState=' + video.readyState + ' videoWidth=' + video.videoWidth);
        setTimeout(() => resolve(), 500);
      }
    }, 500);
  });

  // Дополнительно ждём событие playing если возможно
  if (video.paused) {
    addLog('Видео на паузе, запускаем...');
    try {
      await video.play();
    } catch (e) {
      addLog('play() error: ' + e.message);
    }
  }

  addLog('Video readyState=' + video.readyState + ' dimensions=' + video.videoWidth + 'x' + video.videoHeight);
  updateStatus('✅ Видео готово: ' + video.videoWidth + 'x' + video.videoHeight);

  // 4️⃣ Start the animation loop
  updateStatus('🚀 Запуск цикла...');
  let frameCount = 0;

  startLoop(async (timestamp) => {
    frameCount++;
    if (frameCount % 30 === 0) {
      updateStatus('🔄 Работает... (кадр ' + frameCount + ')');
    }

    addLog('Детекция кадра...');
    // a) Get landmarks for the current frame
    const { landmarks } = await detectHand(video, timestamp);
    if (!landmarks) {
      addLog('landmarks = null');
      return; // no hand detected – skip this frame
    }

    addLog('✋ Рука обнаружена! landmarks=' + landmarks.length);
    updateStatus('✋ Рука обнаружена!');

    // b) Identify which gesture (if any) the landmarks represent
    const gesture = detectGesture(landmarks);
    if (!gesture) {
      addLog('Жест не распознан');
      updateStatus('❌ Жест не распознан');
      return;
    }

    addLog('🎯 Жест: ' + gesture);
    updateStatus('🎯 Жест: ' + gesture);

    // c) Apply cooldown / duplicate filtering
    const toEmit = reactionState.update(gesture);
    if (!toEmit) {
      addLog('В cooldown');
      return; // still in cooldown period
    }

    // d) Render the appropriate emoji
    showEmoji(toEmit, landmarks);
  });

  console.log("🚀 Animation loop started");
}

// Kick‑off the whole thing
main();

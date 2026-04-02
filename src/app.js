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

async function main() {
  // 1️⃣ Initialise video + webcam
  const video = document.getElementById("video");
  if (!video) {
    console.error("Video element not found in DOM.");
    return;
  }

  try {
    await initCamera(video);
    console.log("✅ Camera initialised");
  } catch (err) {
    console.error("❌ Camera initialisation failed:", err);
    return;
  }

  // 2️⃣ Load MediaPipe Hands model
  try {
    await initHandTracker();
    updateStatus("✅ MediaPipe Hands загружен");
  } catch (err) {
    updateStatus("❌ Hand‑tracker не загружен: " + err.message);
    return;
  }

  // 3️⃣ Create state manager (default cooldown = 500 ms)
  const reactionState = new ReactionState();

  // Debug status element
  const statusEl = document.createElement('div');
  statusEl.id = 'debug-status';
  statusEl.style.cssText = 'position:fixed;top:60px;left:0;right:0;background:rgba(0,0,0,0.9);color:#0f0;padding:8px;font-family:monospace;font-size:12px;z-index:1000;text-align:center;';
  statusEl.textContent = '⏳ Инициализация...';
  document.body.appendChild(statusEl);

  function updateStatus(msg) {
    statusEl.textContent = msg;
    console.log('[STATUS]', msg);
  }

  // 3b️⃣ Wait for video to be truly ready
  updateStatus('⏳ Ожидание видео...');
  await new Promise((resolve) => {
    if (video.readyState >= 3) {
      // HAVE_ENOUGH_DATA
      resolve();
    } else {
      video.oncanplay = () => {
        video.oncanplay = null;
        resolve();
      };
    }
  });
  updateStatus('✅ Видео готово, запуск цикла...');

  // 4️⃣ Start the animation loop
  let frameCount = 0;
  let lastLandmarkTime = 0;
  startLoop(async (timestamp) => {
    frameCount++;
    if (frameCount % 30 === 0) {
      updateStatus('🔄 Работает... (кадр ' + frameCount + ') video.readyState=' + video.readyState);
    }

    // a) Get landmarks for the current frame
    const { landmarks } = await detectHand(video, timestamp);
    if (!landmarks) return; // no hand detected – skip this frame

    updateStatus('✋ Рука обнаружена!');

    // b) Identify which gesture (if any) the landmarks represent
    const gesture = detectGesture(landmarks);
    if (!gesture) {
      updateStatus('❌ Жест не распознан');
      return;
    }

    // c) Apply cooldown / duplicate filtering
    const toEmit = reactionState.update(gesture);
    if (!toEmit) return; // still in cooldown period

    // d) Render the appropriate emoji
    updateStatus('🎯 Жест: ' + toEmit);
    showEmoji(toEmit, landmarks);
  });

    // a) Get landmarks for the current frame
    const { landmarks } = await detectHand(video, timestamp);
    if (!landmarks) return; // no hand detected – skip this frame

    updateStatus('✋ Рука обнаружена!');

    // b) Identify which gesture (if any) the landmarks represent
    const gesture = detectGesture(landmarks);
    if (!gesture) {
      updateStatus('❌ Жест не распознан');
      return;
    }

    // c) Apply cooldown / duplicate filtering
    const toEmit = reactionState.update(gesture);
    if (!toEmit) return; // still in cooldown period

    // d) Render the appropriate emoji
    updateStatus('🎯 Жест: ' + gesture);
    showEmoji(toEmit, landmarks);
  });

  console.log("🚀 Animation loop started");
}

// Kick‑off the whole thing
main();

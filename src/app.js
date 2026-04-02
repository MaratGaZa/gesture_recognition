import { initCamera } from "./core/camera.js";
import {
  init as initHandTracker,
  detect as detectHand,
} from "./vision/handTracker.js";
import { detectGesture } from "./gestures/gestureEngine.js";
import { ReactionState } from "./state/reactionState.js";
import { startLoop } from "./core/loop.js";
import { showEmoji } from "./render/emojiRenderer.js";

// --- UI для дебага ---
const statusEl = document.createElement("div");
statusEl.style.cssText =
  "position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.85);color:#0f0;padding:10px;font-family:monospace;font-size:13px;z-index:9999;text-align:center;";
statusEl.textContent = "⏳ Старт...";
document.body.appendChild(statusEl);

function updateStatus(msg) {
  statusEl.textContent = msg;
  console.log("[STATUS]", msg);
}

async function main() {
  const video = document.getElementById("video");
  if (!video) {
    updateStatus("❌ <video> не найден в DOM");
    return;
  }

  // 1️⃣ Камера
  updateStatus("⏳ Запрос камеры...");
  try {
    await initCamera(video);
    updateStatus("✅ Камера работает");
  } catch (err) {
    updateStatus("❌ Камера: " + (err?.message || err?.name || String(err)));
    return;
  }

  // 2️⃣ MediaPipe
  updateStatus("⏳ Загрузка MediaPipe...");
  try {
    await initHandTracker();
    updateStatus("✅ MediaPipe загружен");
  } catch (err) {
    updateStatus("❌ MediaPipe: " + (err?.message || err?.name || String(err)));
    return;
  }

  // 3️⃣ Ждём реальной готовности видео
  updateStatus("⏳ Ожидание видео...");
  await new Promise((resolve) => {
    if (video.readyState >= 2 && video.videoWidth > 0) {
      resolve();
      return;
    }
    const check = setInterval(() => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        clearInterval(check);
        resolve();
      }
    }, 100);
    // На случай если события не придут
    setTimeout(() => {
      clearInterval(check);
      resolve();
    }, 5000);
  });

  updateStatus("✅ Видео: " + video.videoWidth + "x" + video.videoHeight);

  // 4️⃣ Цикл
  const reactionState = new ReactionState();
  let frameCount = 0;

  startLoop(async (timestamp) => {
    frameCount++;

    const { landmarks } = await detectHand(video, timestamp);

    if (!landmarks) {
      if (frameCount % 60 === 0)
        updateStatus("👀 Рука не найдена (кадр " + frameCount + ")");
      return;
    }

    updateStatus("✋ Рука обнаружена!");

    const gesture = detectGesture(landmarks);
    if (!gesture) return;

    const toEmit = reactionState.update(gesture);
    if (!toEmit) return;

    updateStatus("🎯 Жест: " + gesture);
    showEmoji(toEmit, landmarks);
  });
}

main();

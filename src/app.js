import { initCamera } from "./core/camera.js";
import {
  init as initHandTracker,
  detect as detectHand,
} from "./vision/handTracker.js";
import { detectGesture } from "./gestures/gestureEngine.js";
import { ReactionState } from "./state/reactionState.js";
import { startLoop } from "./core/loop.js";
import { showEmoji, clearEmojiEffects } from "./render/emojiRenderer.js";

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const GESTURE_LABELS = {
  THUMBS_UP: "👍 Thumbs up",
  ROCK: "🤘 Rock",
  V_SIGN: "✌️ Peace",
  PALM: "🖐️ Palm",
  POINT: "☝️ Point",
  SHAKA: "🤙 Shaka",
  FIST: "✊ Fist",
};

const video = document.getElementById("video");
const canvas = document.getElementById("camera-canvas");
const button = document.getElementById("camera-toggle");
const statusText = document.getElementById("status-text");
const placeholder = document.getElementById("placeholder");
const loadingOverlay = document.getElementById("loading-overlay");

const ctx = canvas?.getContext("2d");

let loopHandle = null;
let running = false;
let trackerReady = false;
let cameraReady = false;
let videoReadyPromise = null;
const reactionState = new ReactionState(2200);

function setStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

function setLoading(isVisible) {
  if (!loadingOverlay) return;
  loadingOverlay.classList.toggle("hidden", !isVisible);
}

function setPlaceholder(isVisible) {
  if (!placeholder) return;
  placeholder.classList.toggle("hidden", !isVisible);
}

function updateButton() {
  if (!button) return;
  button.textContent = running ? "Stop camera" : "Start camera";
  button.disabled = false;
}

async function waitForVideoReady() {
  if (!video) return;

  if (video.readyState >= 2 && video.videoWidth > 0) {
    return;
  }

  if (!videoReadyPromise) {
    videoReadyPromise = new Promise((resolve) => {
      const check = setInterval(() => {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          clearInterval(check);
          videoReadyPromise = null;
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(check);
        videoReadyPromise = null;
        resolve();
      }, 5000);
    });
  }

  await videoReadyPromise;
}

function ensureCanvasSize() {
  if (!canvas || !video) return;

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}

function drawFrame() {
  if (!ctx || !canvas || !video) return;

  ensureCanvasSize();
  const { width, height } = canvas;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(-1, 1);
  ctx.drawImage(video, -width, 0, width, height);
  ctx.restore();
}

function drawLandmarks(landmarks) {
  if (!ctx || !canvas || !landmarks) return;

  const { width, height } = canvas;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(120,220,255,0.55)";

  for (const [a, b] of CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo((1 - landmarks[a].x) * width, landmarks[a].y * height);
    ctx.lineTo((1 - landmarks[b].x) * width, landmarks[b].y * height);
    ctx.stroke();
  }

  for (const landmark of landmarks) {
    const x = (1 - landmark.x) * width;
    const y = landmark.y * height;

    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(90,200,255)";
    ctx.fill();
  }
}

async function processFrame(timestamp) {
  if (!running || !video) return;

  drawFrame();

  const { landmarks } = await detectHand(video, timestamp);
  if (!landmarks) {
    setStatus("👀 Покажите ладонь в камеру");
    return;
  }

  drawLandmarks(landmarks);

  const gesture = detectGesture(landmarks);
  if (!gesture) {
    setStatus("✋ Рука найдена, жест уточняется");
    return;
  }

  setStatus(`🎯 ${GESTURE_LABELS[gesture] ?? gesture}`);

  const toEmit = reactionState.update(gesture);
  if (!toEmit) return;

  showEmoji(toEmit);
}

async function ensureTrackerReady() {
  if (trackerReady) return;
  await initHandTracker();
  trackerReady = true;
}

async function ensureCameraReady() {
  if (cameraReady || !video) return;
  await initCamera(video);
  await waitForVideoReady();
  cameraReady = true;
}

async function startCameraFlow() {
  if (running || !button || !video || !canvas) return;

  button.disabled = true;
  setLoading(true);
  setStatus("");

  try {
    await ensureTrackerReady();
    await ensureCameraReady();

    setPlaceholder(false);
    setLoading(false);
    running = true;
    reactionState.reset();
    clearEmojiEffects();
    updateButton();
    setStatus("✅ Покажите жест!");

    loopHandle = startLoop(processFrame);
  } catch (error) {
    setLoading(false);
    setStatus(`⚠️ ${error?.message || error?.name || String(error)}`);
    updateButton();
  }
}

function stopStreamTracks() {
  const stream = video?.srcObject;
  if (!stream || typeof stream.getTracks !== "function") return;

  stream.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
  cameraReady = false;
  videoReadyPromise = null;
}

function stopCameraFlow() {
  if (loopHandle) {
    loopHandle.stop();
    loopHandle = null;
  }

  running = false;
  reactionState.reset();
  clearEmojiEffects();
  setPlaceholder(true);
  setLoading(false);
  setStatus("");
  updateButton();
  stopStreamTracks();

  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function initUi() {
  if (!button || !video || !canvas || !ctx) {
    return;
  }

  updateButton();
  setPlaceholder(true);
  setLoading(false);
  setStatus("");

  button.addEventListener("click", () => {
    if (running) {
      stopCameraFlow();
      return;
    }

    startCameraFlow();
  });
}

initUi();

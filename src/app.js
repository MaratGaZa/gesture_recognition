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
    console.log("✅ MediaPipe Hands model loaded");
  } catch (err) {
    console.error("❌ Hand‑tracker initialisation failed:", err);
    return;
  }

  // 3️⃣ Create state manager (default cooldown = 500 ms)
  const reactionState = new ReactionState();

  // 4️⃣ Start the animation loop
  startLoop(async (timestamp) => {
    // a) Get landmarks for the current frame
    const { landmarks } = await detectHand(video, timestamp);
    if (!landmarks) return; // no hand detected – skip this frame

    console.log('✋ Hand detected, landmarks:', landmarks.length);

    // b) Identify which gesture (if any) the landmarks represent
    const gesture = detectGesture(landmarks);
    if (!gesture) {
      console.log('❌ No gesture recognized');
      return;
    }
    console.log('🎯 Gesture:', gesture);

    // c) Apply cooldown / duplicate filtering
    const toEmit = reactionState.update(gesture);
    if (!toEmit) return; // still in cooldown period

    // d) Render the appropriate emoji
    console.log('✅ Emitting emoji:', toEmit);
    showEmoji(toEmit, landmarks);
  });

  console.log("🚀 Animation loop started");
}

// Kick‑off the whole thing
main();

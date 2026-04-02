/**
 * Starts the animation loop, invoking the callback on each frame.
 * Uses setInterval for better mobile compatibility.
 * @param {(timestamp: number) => void} callback - Function to call with timestamp.
 * @returns {{ stop: () => void }} Handle with a stop method.
 */
export function startLoop(callback) {
  let running = true;
  let frameId = null;

  async function loop(timestamp) {
    if (!running) return;

    try {
      await callback(timestamp); // ✅ ждём завершения детекции
    } catch (err) {
      console.error("[loop] frame error:", err);
    }

    if (running) {
      frameId = requestAnimationFrame(loop);
    }
  }

  frameId = requestAnimationFrame(loop);

  return {
    stop() {
      running = false;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    },
  };
}

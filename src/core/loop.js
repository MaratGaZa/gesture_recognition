/**
 * Starts the animation loop, invoking the callback on each frame.
 * @param {(timestamp: number) => void} callback - Function to call with timestamp.
 * @returns {{ stop: () => void }} Handle with a stop method.
 */
export function startLoop(callback) {
  let running = true;
  let frameId = null;

  function loop(timestamp) {
    if (!running) return;

    callback(timestamp);

    frameId = requestAnimationFrame(loop);
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

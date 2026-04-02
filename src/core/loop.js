/**
 * Starts the animation loop, invoking the callback on each frame.
 * Uses setInterval for better mobile compatibility.
 * @param {(timestamp: number) => void} callback - Function to call with timestamp.
 * @returns {{ stop: () => void }} Handle with a stop method.
 */
export function startLoop(callback) {
  let running = true;
  let intervalId = null;

  function loop() {
    if (!running) return;
    callback(performance.now());
  }

  // Use setInterval with ~30fps for mobile compatibility
  intervalId = setInterval(loop, 33);

  return {
    stop() {
      running = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };
}

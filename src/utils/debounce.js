/**
 * Debounce utility function.
 * Returns a debounced version of the provided function that delays execution
 * until after the specified delay has elapsed since the last call.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function & { cancel: () => void }} - Debounced function with cancel method.
 */
export function debounce(fn, delay) {
  let timeoutId = null;

  const debounced = function (...args) {
    // Clear any existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };

  /**
   * Cancels any pending execution of the debounced function.
   */
  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

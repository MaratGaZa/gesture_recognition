/**
 * ReactionState manages cooldown and duplicate suppression for gestures.
 * It ensures that emojis are not spammed and that gestures are triggered
 * with appropriate timing.
 */

/**
 * Default cooldown duration in milliseconds.
 */
const DEFAULT_COOLDOWN_MS = 500;

/**
 * ReactionState class.
 */
export class ReactionState {
  /**
   * @param {number} [cooldownMs=DEFAULT_COOLDOWN_MS] - Cooldown duration in milliseconds.
   */
  constructor(cooldownMs = DEFAULT_COOLDOWN_MS) {
    /**
     * Cooldown duration in milliseconds.
     * @type {number}
     */
    this.cooldownMs = cooldownMs;

    /**
     * Last triggered gesture.
     * @type {string | null}
     */
    this.lastGesture = null;

    /**
     * Timestamp of the last trigger.
     * @type {number}
     */
    this.lastTriggerTime = 0;
  }

  /**
   * Update with a new gesture. Returns the gesture if it should be triggered,
   * otherwise returns null.
   *
   * The gesture is triggered only if:
   * - it is not null,
   * - and the time elapsed since the last trigger is >= cooldownMs.
   *
   * @param {string | null} gesture - The detected gesture constant.
   * @returns {string | null} - The gesture to trigger, or null.
   */
  update(gesture) {
    if (gesture === null) {
      return null;
    }

    const now = performance.now();

    // First trigger – only when no gesture has been processed yet
    if (this.lastTriggerTime === 0 && this.lastGesture === null) {
      this.lastGesture = gesture;
      this.lastTriggerTime = now;
      return gesture;
    }

    if (now - this.lastTriggerTime >= this.cooldownMs) {
      this.lastGesture = gesture;
      this.lastTriggerTime = now;
      return gesture;
    }

    return null;
  }

  /**
   * Reset the state.
   */
  reset() {
    this.lastGesture = null;
    this.lastTriggerTime = 0;
  }
}

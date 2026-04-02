/**
 * Detects the "palm" hand gesture (open hand).
 * A palm is characterized by:
 * - All five fingers extended
 * - Hand open with fingers spread apart
 *
 * @param {Array} landmarks - Array of 21 3D points representing hand landmarks.
 * @returns {boolean} True if the gesture is detected, false otherwise.
 */

// MediaPipe hand landmark indices
const FINGER_INDICES = {
  thumb: { base: 1, tip: 4 },
  index: { base: 5, tip: 8 },
  middle: { base: 9, tip: 12 },
  ring: { base: 13, tip: 16 },
  pinky: { base: 17, tip: 20 },
};

/**
 * Checks if a finger is extended by comparing the distance from wrist to tip
 * versus the distance from wrist to base.
 * Extended fingers have their tip farther from the wrist than the base.
 *
 * @param {Array} landmarks - Hand landmarks array.
 * @param {Object} finger - Object with base and tip indices.
 * @returns {boolean} True if the finger appears extended.
 */
function isFingerExtended(landmarks, finger) {
  const wrist = landmarks[0];
  const base = landmarks[finger.base];
  const tip = landmarks[finger.tip];

  if (!wrist || !base || !tip) return false;

  // Calculate squared distances (avoid sqrt for performance)
  const distToBase =
    Math.pow(base.x - wrist.x, 2) +
    Math.pow(base.y - wrist.y, 2) +
    Math.pow(base.z - wrist.z, 2);

  const distToTip =
    Math.pow(tip.x - wrist.x, 2) +
    Math.pow(tip.y - wrist.y, 2) +
    Math.pow(tip.z - wrist.z, 2);

  // If tip is farther than base, finger is likely extended
  const ratio = distToTip / distToBase;
  return ratio > 1.3;
}

/**
 * Detects the palm gesture.
 *
 * @param {Array} landmarks - Array of 21 hand landmarks.
 * @returns {boolean} True if palm gesture is detected.
 */
export function isPalm(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  // Check all fingers are extended
  const thumbExtended = isFingerExtended(landmarks, FINGER_INDICES.thumb);
  const indexExtended = isFingerExtended(landmarks, FINGER_INDICES.index);
  const middleExtended = isFingerExtended(landmarks, FINGER_INDICES.middle);
  const ringExtended = isFingerExtended(landmarks, FINGER_INDICES.ring);
  const pinkyExtended = isFingerExtended(landmarks, FINGER_INDICES.pinky);

  // Palm: all five fingers extended
  return thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended;
}

export default isPalm;

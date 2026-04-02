/**
 * Detects the "rock" hand gesture (🤘).
 * The rock gesture is characterized by:
 * - Index finger extended
 * - Pinky finger extended
 * - Middle and ring fingers folded
 *
 * @param {Array} landmarks - Array of 21 hand landmarks from MediaPipe.
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
  // Use a relative distance ratio to determine extension
  // Lowered from 1.5 to 1.2 for better mobile compatibility
  const ratio = distToTip / distToBase;
  return ratio > 1.2;
}

/**
 * Alternative check using vertical position (y-coordinate).
 * This works well when the hand is mostly upright.
 *
 * @param {Array} landmarks - Hand landmarks array.
 * @param {Object} finger - Object with base and tip indices.
 * @returns {boolean} True if the finger appears extended (tip is above base in screen coords).
 */
function isFingerExtendedVertical(landmarks, finger) {
  const base = landmarks[finger.base];
  const tip = landmarks[finger.tip];
  const mcp = landmarks[finger.base]; // Same as base for our purposes

  // In screen coordinates, lower y values are higher on screen
  // Extended fingers have tip y < mcp y (tip is above base)
  // We use a small threshold for robustness
  const threshold = 0.01;
  return tip.y < mcp.y - threshold;
}

/**
 * Detects the rock gesture.
 *
 * @param {Array} landmarks - Array of 21 hand landmarks.
 * @returns {boolean} True if rock gesture is detected.
 */
export function isRock(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  // Check finger states using distance-based method
  const indexExtended = isFingerExtended(landmarks, FINGER_INDICES.index);
  const middleExtended = isFingerExtended(landmarks, FINGER_INDICES.middle);
  const ringExtended = isFingerExtended(landmarks, FINGER_INDICES.ring);
  const pinkyExtended = isFingerExtended(landmarks, FINGER_INDICES.pinky);

  // Rock gesture: index and pinky extended, middle and ring folded
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return true;
  }

  // Also try vertical method as fallback
  const indexExtendedV = isFingerExtendedVertical(
    landmarks,
    FINGER_INDICES.index,
  );
  const middleExtendedV = isFingerExtendedVertical(
    landmarks,
    FINGER_INDICES.middle,
  );
  const ringExtendedV = isFingerExtendedVertical(
    landmarks,
    FINGER_INDICES.ring,
  );
  const pinkyExtendedV = isFingerExtendedVertical(
    landmarks,
    FINGER_INDICES.pinky,
  );

  return indexExtendedV && !middleExtendedV && !ringExtendedV && pinkyExtendedV;
}

export default isRock;

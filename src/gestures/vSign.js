/**
 * Detects the "V-sign" hand gesture.
 * The V-sign is characterized by:
 * - Index finger and middle finger extended
 * - Ring and pinky fingers folded
 * - Thumb positioned near the palm
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
  const ratio = distToTip / distToBase;
  return ratio > 1.5;
}

/**
 * Checks if a finger is folded by comparing the distance from wrist to tip
 * versus the distance from wrist to base.
 * Folded fingers have their tip closer to the wrist than the base.
 *
 * @param {Array} landmarks - Hand landmarks array.
 * @param {Object} finger - Object with base and tip indices.
 * @returns {boolean} True if the finger appears folded.
 */
function isFingerFolded(landmarks, finger) {
  const wrist = landmarks[0];
  const base = landmarks[finger.base];
  const tip = landmarks[finger.tip];

  if (!wrist || !base || !tip) return false;

  // Helper to calculate Euclidean distance
  const distance = (a, b) =>
    Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
    );

  const tipBaseDist = distance(tip, base);
  const baseWristDist = distance(base, wrist);

  // If the tip is closer to the base than the base is to the wrist, the finger is folded
  return tipBaseDist < baseWristDist;
}

/**
 * Detects the V-sign gesture.
 *
 * @param {Array} landmarks - Array of 21 hand landmarks.
 * @returns {boolean} True if V-sign gesture is detected.
 */
export function isVSign(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  // Check finger states
  const indexExtended = isFingerExtended(landmarks, FINGER_INDICES.index);
  const middleExtended = isFingerExtended(landmarks, FINGER_INDICES.middle);
  const ringFolded = isFingerFolded(landmarks, FINGER_INDICES.ring);
  const pinkyFolded = isFingerFolded(landmarks, FINGER_INDICES.pinky);

  // V-sign: index and middle fingers extended, ring and pinky folded
  if (indexExtended && middleExtended && ringFolded && pinkyFolded) {
    return true;
  }

  return false;
}

export default isVSign;

/**
 * Determines if the hand landmarks represent a "thumbs up" gesture.
 * A thumbs up is characterized by:
 * - Thumb extended upward (tip higher than base)
 * - All other fingers folded (tips close to palm)
 *
 * @param {Array} landmarks - Array of 21 3D points representing hand landmarks.
 * @returns {boolean} True if the gesture is thumbs up, false otherwise.
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
 * Checks if the thumb is extended upward.
 * In a thumbs up gesture, the thumb tip is higher (lower y value in screen coords)
 * than the thumb base, and the thumb is extended away from the palm.
 *
 * @param {Array} landmarks - Hand landmarks array.
 * @returns {boolean} True if thumb appears to be extended upward.
 */
function isThumbExtendedUp(landmarks) {
  const thumbTip = landmarks[4];
  const thumbBase = landmarks[1];
  const wrist = landmarks[0];

  if (!thumbTip || !thumbBase || !wrist) return false;

  // In screen coordinates, lower y values are higher on screen
  // Thumbs up: thumb tip is above (lower y) than thumb base
  const verticalThreshold = 0.05;
  const isUp = thumbTip.y < thumbBase.y - verticalThreshold;

  // Check that thumb is extended (tip is farther from wrist than base)
  const distToBase =
    Math.pow(thumbBase.x - wrist.x, 2) +
    Math.pow(thumbBase.y - wrist.y, 2) +
    Math.pow(thumbBase.z - wrist.z, 2);

  const distToTip =
    Math.pow(thumbTip.x - wrist.x, 2) +
    Math.pow(thumbTip.y - wrist.y, 2) +
    Math.pow(thumbTip.z - wrist.z, 2);

  const isExtended = distToTip > distToBase;

  return isUp && isExtended;
}

/**
 * Detects the thumbs up gesture.
 *
 * @param {Array} landmarks - Array of 21 hand landmarks.
 * @returns {boolean} True if thumbs up gesture is detected.
 */
export function isThumbsUp(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  // Check thumb is extended upward
  const thumbExtendedUp = isThumbExtendedUp(landmarks);
  if (!thumbExtendedUp) {
    return false;
  }

  // Check all other fingers are folded
  const indexFolded = isFingerFolded(landmarks, FINGER_INDICES.index);
  const middleFolded = isFingerFolded(landmarks, FINGER_INDICES.middle);
  const ringFolded = isFingerFolded(landmarks, FINGER_INDICES.ring);
  const pinkyFolded = isFingerFolded(landmarks, FINGER_INDICES.pinky);

  return indexFolded && middleFolded && ringFolded && pinkyFolded;
}

export default isThumbsUp;

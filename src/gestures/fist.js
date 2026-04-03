/**
 * Detects the "fist" hand gesture.
 * A fist is characterized by all fingers folded.
 *
 * @param {Array} landmarks - Array of 21 3D points representing hand landmarks.
 * @returns {boolean} True if the gesture is detected, false otherwise.
 */

const FINGER_INDICES = {
  thumb: { base: 1, tip: 4 },
  index: { base: 5, tip: 8 },
  middle: { base: 9, tip: 12 },
  ring: { base: 13, tip: 16 },
  pinky: { base: 17, tip: 20 },
};

function isFingerFolded(landmarks, finger) {
  const wrist = landmarks[0];
  const base = landmarks[finger.base];
  const tip = landmarks[finger.tip];

  if (!wrist || !base || !tip) return false;

  const distance = (a, b) =>
    Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
    );

  return distance(tip, base) < distance(base, wrist);
}

export function isFist(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  return Object.values(FINGER_INDICES).every((finger) =>
    isFingerFolded(landmarks, finger),
  );
}

export default isFist;

/**
 * Detects the "shaka" hand gesture.
 * A shaka is characterized by:
 * - Thumb extended
 * - Pinky extended
 * - Index, middle and ring fingers folded
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

function isFingerExtended(landmarks, finger) {
  const wrist = landmarks[0];
  const base = landmarks[finger.base];
  const tip = landmarks[finger.tip];

  if (!wrist || !base || !tip) return false;

  const distToBase =
    Math.pow(base.x - wrist.x, 2) +
    Math.pow(base.y - wrist.y, 2) +
    Math.pow(base.z - wrist.z, 2);

  const distToTip =
    Math.pow(tip.x - wrist.x, 2) +
    Math.pow(tip.y - wrist.y, 2) +
    Math.pow(tip.z - wrist.z, 2);

  return distToTip / distToBase > 1.3;
}

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

export function isShaka(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  const thumbExtended = isFingerExtended(landmarks, FINGER_INDICES.thumb);
  const indexFolded = isFingerFolded(landmarks, FINGER_INDICES.index);
  const middleFolded = isFingerFolded(landmarks, FINGER_INDICES.middle);
  const ringFolded = isFingerFolded(landmarks, FINGER_INDICES.ring);
  const pinkyExtended = isFingerExtended(landmarks, FINGER_INDICES.pinky);

  return (
    thumbExtended &&
    indexFolded &&
    middleFolded &&
    ringFolded &&
    pinkyExtended
  );
}

export default isShaka;

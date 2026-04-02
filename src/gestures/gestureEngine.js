/**
 * GestureEngine module.
 * Pure function that detects gestures from hand landmarks.
 * Delegates to individual gesture modules.
 */

import { isThumbsUp } from "./thumbsUp.js";
import { isRock } from "./rock.js";
import { isVSign } from "./vSign.js";
import { isPalm } from "./palm.js";

// Gesture constants
export const THUMBS_UP = "THUMBS_UP";
export const ROCK = "ROCK";
export const V_SIGN = "V_SIGN";
export const PALM = "PALM";

/**
 * Detects a gesture from hand landmarks.
 * @param {Array} landmarks - Array of 21 3D points representing hand landmarks.
 * @returns {string|null} Gesture constant (THUMBS_UP, ROCK, V_SIGN, PALM) or null if no gesture recognized.
 */
export function detectGesture(landmarks) {
  if (!landmarks) return null;

  if (isThumbsUp(landmarks)) return THUMBS_UP;
  if (isRock(landmarks)) return ROCK;
  if (isVSign(landmarks)) return V_SIGN;
  if (isPalm(landmarks)) return PALM;

  return null;
}

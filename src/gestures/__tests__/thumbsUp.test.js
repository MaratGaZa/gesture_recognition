/**
 * Tests for thumbsUp gesture detection.
 * @module gestures/__tests__/thumbsUp.test
 */

import { isThumbsUp } from '../thumbsUp.js';

describe('isThumbsUp', () => {
  // Helper to create a simple landmark object
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  // Helper to create a hand with all fingers folded (fist)
  const createFistLandmarks = () => {
    const landmarks = [];
    // Wrist
    landmarks.push(createLandmark(0.5, 0.5));

    // Thumb - folded (tip close to base)
    landmarks.push(createLandmark(0.4, 0.45)); // 1: thumb base
    landmarks.push(createLandmark(0.42, 0.42)); // 2: thumb MCP
    landmarks.push(createLandmark(0.44, 0.40)); // 3: thumb IP
    landmarks.push(createLandmark(0.45, 0.38)); // 4: thumb tip (folded)

    // Index finger - folded
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.50 + i * 0.02, 0.35 - i * 0.05));
    }

    // Middle finger - folded
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.55 + i * 0.02, 0.36 - i * 0.04));
    }

    // Ring finger - folded
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.60 + i * 0.02, 0.37 - i * 0.03));
    }

    // Pinky - folded
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.65 + i * 0.02, 0.38 - i * 0.02));
    }

    return landmarks;
  };

  // Helper to create a thumbs up gesture
  const createThumbsUpLandmarks = () => {
    const landmarks = [];
    // Wrist
    landmarks.push(createLandmark(0.5, 0.5));

    // Thumb - extended upward (tip above base)
    landmarks.push(createLandmark(0.4, 0.45)); // 1: thumb base
    landmarks.push(createLandmark(0.38, 0.35)); // 2: thumb MCP
    landmarks.push(createLandmark(0.36, 0.25)); // 3: thumb IP
    landmarks.push(createLandmark(0.35, 0.15)); // 4: thumb tip (extended up)

    // Index finger - folded (tip close to base)
    landmarks.push(createLandmark(0.50, 0.42)); // 5: index base
    landmarks.push(createLandmark(0.52, 0.40)); // 6: index MCP
    landmarks.push(createLandmark(0.54, 0.38)); // 7: index PIP
    landmarks.push(createLandmark(0.55, 0.37)); // 8: index tip (folded)

    // Middle finger - folded
    landmarks.push(createLandmark(0.52, 0.43)); // 9
    landmarks.push(createLandmark(0.54, 0.41)); // 10
    landmarks.push(createLandmark(0.56, 0.39)); // 11
    landmarks.push(createLandmark(0.57, 0.38)); // 12

    // Ring finger - folded
    landmarks.push(createLandmark(0.54, 0.44)); // 13
    landmarks.push(createLandmark(0.56, 0.42)); // 14
    landmarks.push(createLandmark(0.58, 0.40)); // 15
    landmarks.push(createLandmark(0.59, 0.39)); // 16

    // Pinky - folded
    landmarks.push(createLandmark(0.56, 0.45)); // 17
    landmarks.push(createLandmark(0.58, 0.43)); // 18
    landmarks.push(createLandmark(0.60, 0.41)); // 19
    landmarks.push(createLandmark(0.61, 0.40)); // 20

    return landmarks;
  };

  // Helper to create an open hand (all fingers extended)
  const createOpenHandLandmarks = () => {
    const landmarks = [];
    // Wrist
    landmarks.push(createLandmark(0.5, 0.5));

    // Thumb - extended outward
    landmarks.push(createLandmark(0.4, 0.45));
    landmarks.push(createLandmark(0.35, 0.42));
    landmarks.push(createLandmark(0.30, 0.40));
    landmarks.push(createLandmark(0.25, 0.38));

    // Index - extended
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.50 + i * 0.02, 0.40 - i * 0.10));
    }

    // Middle - extended
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.55 + i * 0.02, 0.40 - i * 0.11));
    }

    // Ring - extended
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.60 + i * 0.02, 0.40 - i * 0.10));
    }

    // Pinky - extended
    for (let i = 0; i < 4; i++) {
      landmarks.push(createLandmark(0.65 + i * 0.02, 0.40 - i * 0.09));
    }

    return landmarks;
  };

  describe('input validation', () => {
    test('returns false for null landmarks', () => {
      expect(isThumbsUp(null)).toBe(false);
    });

    test('returns false for undefined landmarks', () => {
      expect(isThumbsUp(undefined)).toBe(false);
    });

    test('returns false for empty array', () => {
      expect(isThumbsUp([])).toBe(false);
    });

    test('returns false for array with insufficient landmarks', () => {
      expect(isThumbsUp([createLandmark(0.5, 0.5)])).toBe(false);
    });
  });

  describe('gesture detection', () => {
    test('returns true for a clear thumbs up gesture', () => {
      const landmarks = createThumbsUpLandmarks();
      const result = isThumbsUp(landmarks);
      // Note: This test will pass once the detection logic is implemented
      expect(result).toBe(true);
    });

    test('returns false for a fist (no fingers extended)', () => {
      const landmarks = createFistLandmarks();
      expect(isThumbsUp(landmarks)).toBe(false);
    });

    test('returns false for an open hand (all fingers extended)', () => {
      const landmarks = createOpenHandLandmarks();
      expect(isThumbsUp(landmarks)).toBe(false);
    });

    test('returns false for rock gesture (index and pinky extended)', () => {
      // Create rock gesture landmarks: index and pinky extended, middle and ring folded
      const landmarks = [];
      landmarks.push(createLandmark(0.5, 0.5)); // wrist

      // Thumb - folded
      landmarks.push(createLandmark(0.4, 0.45));
      landmarks.push(createLandmark(0.42, 0.43));
      landmarks.push(createLandmark(0.44, 0.41));
      landmarks.push(createLandmark(0.45, 0.40));

      // Index - extended
      landmarks.push(createLandmark(0.50, 0.42));
      landmarks.push(createLandmark(0.52, 0.30));
      landmarks.push(createLandmark(0.53, 0.20));
      landmarks.push(createLandmark(0.54, 0.10));

      // Middle - folded
      landmarks.push(createLandmark(0.52, 0.43));
      landmarks.push(createLandmark(0.54, 0.41));
      landmarks.push(createLandmark(0.56, 0.39));
      landmarks.push(createLandmark(0.57, 0.38));

      // Ring - folded
      landmarks.push(createLandmark(0.54, 0.44));
      landmarks.push(createLandmark(0.56, 0.42));
      landmarks.push(createLandmark(0.58, 0.40));
      landmarks.push(createLandmark(0.59, 0.39));

      // Pinky - extended
      landmarks.push(createLandmark(0.56, 0.45));
      landmarks.push(createLandmark(0.58, 0.33));
      landmarks.push(createLandmark(0.60, 0.21));
      landmarks.push(createLandmark(0.62, 0.10));

      expect(isThumbsUp(landmarks)).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('handles landmarks with all zeros', () => {
      const landmarks = Array(21).fill(createLandmark(0, 0, 0));
      expect(isThumbsUp(landmarks)).toBe(false);
    });

    test('handles landmarks with negative coordinates', () => {
      const landmarks = createThumbsUpLandmarks().map(l => ({
        x: -l.x,
        y: -l.y,
        z: l.z,
      }));
      // Should not throw and should return a boolean
      expect(typeof isThumbsUp(landmarks)).toBe('boolean');
    });
  });
});

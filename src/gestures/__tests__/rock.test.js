/**
 * Tests for rock gesture detection.
 */

import { isRock } from '../rock.js';

describe('isRock', () => {
  // Helper to create a simple landmark array
  const createLandmarks = (config = {}) => {
    // Base landmarks for a neutral hand position
    const landmarks = [];
    for (let i = 0; i < 21; i++) {
      landmarks.push({ x: 0.5, y: 0.5, z: 0 });
    }
    return landmarks;
  };

  /**
   * Creates landmarks for a rock gesture: index and pinky extended,
   * middle and ring folded.
   */
  const createRockLandmarks = () => {
    const landmarks = createLandmarks();

    // Wrist (0) - base point
    landmarks[0] = { x: 0.5, y: 0.8, z: 0 };

    // Thumb (1-4) - not critical for rock gesture
    landmarks[1] = { x: 0.4, y: 0.7, z: 0 };
    landmarks[4] = { x: 0.35, y: 0.6, z: 0 };

    // Index finger (5-8) - extended
    landmarks[5] = { x: 0.45, y: 0.5, z: 0 };  // MCP
    landmarks[6] = { x: 0.45, y: 0.4, z: 0 };  // PIP
    landmarks[7] = { x: 0.45, y: 0.3, z: 0 };  // DIP
    landmarks[8] = { x: 0.45, y: 0.2, z: 0 };  // TIP - far from wrist

    // Middle finger (9-12) - folded
    landmarks[9] = { x: 0.5, y: 0.5, z: 0 };   // MCP
    landmarks[10] = { x: 0.5, y: 0.48, z: 0 }; // PIP
    landmarks[11] = { x: 0.5, y: 0.46, z: 0 }; // DIP
    landmarks[12] = { x: 0.5, y: 0.44, z: 0 }; // TIP - close to wrist

    // Ring finger (13-16) - folded
    landmarks[13] = { x: 0.55, y: 0.5, z: 0 }; // MCP
    landmarks[14] = { x: 0.55, y: 0.48, z: 0 }; // PIP
    landmarks[15] = { x: 0.55, y: 0.46, z: 0 }; // DIP
    landmarks[16] = { x: 0.55, y: 0.44, z: 0 }; // TIP - close to wrist

    // Pinky finger (17-20) - extended
    landmarks[17] = { x: 0.6, y: 0.5, z: 0 };  // MCP
    landmarks[18] = { x: 0.65, y: 0.4, z: 0 }; // PIP
    landmarks[19] = { x: 0.7, y: 0.3, z: 0 }; // DIP
    landmarks[20] = { x: 0.75, y: 0.2, z: 0 }; // TIP - far from wrist

    return landmarks;
  };

  /**
   * Creates landmarks for a thumbs up gesture (should not be rock).
   */
  const createThumbsUpLandmarks = () => {
    const landmarks = createLandmarks();

    // Wrist
    landmarks[0] = { x: 0.5, y: 0.8, z: 0 };

    // Thumb extended upward
    landmarks[4] = { x: 0.35, y: 0.2, z: 0 }; // Tip far from wrist

    // Other fingers folded
    for (let i = 5; i <= 20; i++) {
      landmarks[i] = { x: 0.5, y: 0.7, z: 0 };
    }

    return landmarks;
  };

  /**
   * Creates landmarks for all fingers extended (open hand).
   */
  const createOpenHandLandmarks = () => {
    const landmarks = createLandmarks();

    landmarks[0] = { x: 0.5, y: 0.8, z: 0 };

    // All fingers extended
    landmarks[4] = { x: 0.3, y: 0.3, z: 0 };
    landmarks[8] = { x: 0.4, y: 0.2, z: 0 };
    landmarks[12] = { x: 0.5, y: 0.15, z: 0 };
    landmarks[16] = { x: 0.6, y: 0.2, z: 0 };
    landmarks[20] = { x: 0.7, y: 0.25, z: 0 };

    return landmarks;
  };

  describe('valid rock gesture', () => {
    test('returns true for rock gesture landmarks', () => {
      const landmarks = createRockLandmarks();
      expect(isRock(landmarks)).toBe(true);
    });

    test('returns true for slightly varied rock gesture', () => {
      const landmarks = createRockLandmarks();
      // Slight variation in position
      landmarks[8] = { x: 0.46, y: 0.22, z: 0 };
      landmarks[20] = { x: 0.74, y: 0.18, z: 0 };
      expect(isRock(landmarks)).toBe(true);
    });
  });

  describe('non-rock gestures', () => {
    test('returns false for thumbs up gesture', () => {
      const landmarks = createThumbsUpLandmarks();
      expect(isRock(landmarks)).toBe(false);
    });

    test('returns false for open hand', () => {
      const landmarks = createOpenHandLandmarks();
      expect(isRock(landmarks)).toBe(false);
    });

    test('returns false for only index extended', () => {
      const landmarks = createLandmarks();
      landmarks[0] = { x: 0.5, y: 0.8, z: 0 };
      landmarks[8] = { x: 0.45, y: 0.2, z: 0 }; // Index extended
      // Others folded
      expect(isRock(landmarks)).toBe(false);
    });

    test('returns false for only pinky extended', () => {
      const landmarks = createLandmarks();
      landmarks[0] = { x: 0.5, y: 0.8, z: 0 };
      landmarks[20] = { x: 0.7, y: 0.2, z: 0 }; // Pinky extended
      // Others folded
      expect(isRock(landmarks)).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('returns false for null landmarks', () => {
      expect(isRock(null)).toBe(false);
    });

    test('returns false for undefined landmarks', () => {
      expect(isRock(undefined)).toBe(false);
    });

    test('returns false for empty array', () => {
      expect(isRock([])).toBe(false);
    });

    test('returns false for incomplete landmarks (< 21 points)', () => {
      const landmarks = createRockLandmarks().slice(0, 15);
      expect(isRock(landmarks)).toBe(false);
    });

    test('handles landmarks with missing properties', () => {
      const landmarks = createRockLandmarks();
      // Remove z property from some points
      landmarks[0] = { x: 0.5, y: 0.8 };
      landmarks[8] = { x: 0.45, y: 0.2 };
      // Should still work or at least not throw
      expect(() => isRock(landmarks)).not.toThrow();
    });
  });

  describe('performance', () => {
    test('function completes quickly', () => {
      const landmarks = createRockLandmarks();
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        isRock(landmarks);
      }
      const end = performance.now();
      const duration = end - start;
      // Should process 1000 calls in under 100ms (very conservative)
      expect(duration).toBeLessThan(100);
    });
  });
});

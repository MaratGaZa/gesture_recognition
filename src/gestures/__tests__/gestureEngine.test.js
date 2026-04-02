/**
 * Tests for gestureEngine module.
 * @jest-environment jsdom
 */

import { detectGesture, THUMBS_UP, ROCK } from '../gestureEngine.js';
import { isThumbsUp } from '../thumbsUp.js';
import { isRock } from '../rock.js';

// Mock the gesture detection functions
jest.mock('../thumbsUp.js');
jest.mock('../rock.js');

describe('gestureEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectGesture', () => {
    it('should return null for null landmarks', () => {
      expect(detectGesture(null)).toBeNull();
    });

    it('should return null for undefined landmarks', () => {
      expect(detectGesture(undefined)).toBeNull();
    });

    it('should return THUMBS_UP when isThumbsUp returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isThumbsUp.mockReturnValue(true);
      isRock.mockReturnValue(false);

      const result = detectGesture(landmarks);

      expect(result).toBe(THUMBS_UP);
      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expect(isRock).not.toHaveBeenCalled();
    });

    it('should return ROCK when isRock returns true and isThumbsUp returns false', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isThumbsUp.mockReturnValue(false);
      isRock.mockReturnValue(true);

      const result = detectGesture(landmarks);

      expect(result).toBe(ROCK);
      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expect(isRock).toHaveBeenCalledWith(landmarks);
    });

    it('should return null when neither gesture is detected', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isThumbsUp.mockReturnValue(false);
      isRock.mockReturnValue(false);

      const result = detectGesture(landmarks);

      expect(result).toBeNull();
    });

    it('should return THUMBS_UP when both gestures are detected (thumbsUp has priority)', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isThumbsUp.mockReturnValue(true);
      isRock.mockReturnValue(true);

      const result = detectGesture(landmarks);

      expect(result).toBe(THUMBS_UP);
      expect(isRock).not.toHaveBeenCalled();
    });

    it('should pass landmarks correctly to detection functions', () => {
      const landmarks = [
        { x: 0.1, y: 0.2, z: 0.3 },
        { x: 0.4, y: 0.5, z: 0.6 },
        // ... rest of 21 points would be here in real usage
      ];
      isThumbsUp.mockReturnValue(false);
      isRock.mockReturnValue(false);

      detectGesture(landmarks);

      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expect(isRock).toHaveBeenCalledWith(landmarks);
    });
  });

  describe('constants', () => {
    it('should export THUMBS_UP constant', () => {
      expect(THUMBS_UP).toBe('THUMBS_UP');
    });

    it('should export ROCK constant', () => {
      expect(ROCK).toBe('ROCK');
    });
  });
});

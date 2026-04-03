/**
 * Tests for gestureEngine module.
 * @jest-environment jsdom
 */

import {
  detectGesture,
  THUMBS_UP,
  ROCK,
  V_SIGN,
  PALM,
  POINT,
  SHAKA,
  FIST,
} from '../gestureEngine.js';
import { isThumbsUp } from '../thumbsUp.js';
import { isRock } from '../rock.js';
import { isVSign } from '../vSign.js';
import { isPalm } from '../palm.js';
import { isPoint } from '../point.js';
import { isShaka } from '../shaka.js';
import { isFist } from '../fist.js';

jest.mock('../thumbsUp.js');
jest.mock('../rock.js');
jest.mock('../vSign.js');
jest.mock('../palm.js');
jest.mock('../point.js');
jest.mock('../shaka.js');
jest.mock('../fist.js');

const setAllDetectors = (value) => {
  isThumbsUp.mockReturnValue(value);
  isRock.mockReturnValue(value);
  isVSign.mockReturnValue(value);
  isPalm.mockReturnValue(value);
  isPoint.mockReturnValue(value);
  isShaka.mockReturnValue(value);
  isFist.mockReturnValue(value);
};

const expectLaterDetectorsNotCalled = (...detectors) => {
  detectors.forEach((detector) => {
    expect(detector).not.toHaveBeenCalled();
  });
};

describe('gestureEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAllDetectors(false);
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

      const result = detectGesture(landmarks);

      expect(result).toBe(THUMBS_UP);
      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expectLaterDetectorsNotCalled(
        isRock,
        isVSign,
        isPoint,
        isShaka,
        isPalm,
        isFist,
      );
    });

    it('should return ROCK when isRock returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isRock.mockReturnValue(true);

      const result = detectGesture(landmarks);

      expect(result).toBe(ROCK);
      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expect(isRock).toHaveBeenCalledWith(landmarks);
      expectLaterDetectorsNotCalled(isVSign, isPoint, isShaka, isPalm, isFist);
    });

    it('should return V_SIGN when isVSign returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isVSign.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(V_SIGN);
      expect(isVSign).toHaveBeenCalledWith(landmarks);
      expectLaterDetectorsNotCalled(isPoint, isShaka, isPalm, isFist);
    });

    it('should return POINT when isPoint returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isPoint.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(POINT);
      expect(isPoint).toHaveBeenCalledWith(landmarks);
      expectLaterDetectorsNotCalled(isShaka, isPalm, isFist);
    });

    it('should return SHAKA when isShaka returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isShaka.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(SHAKA);
      expect(isShaka).toHaveBeenCalledWith(landmarks);
      expectLaterDetectorsNotCalled(isPalm, isFist);
    });

    it('should return PALM when isPalm returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isPalm.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(PALM);
      expect(isPalm).toHaveBeenCalledWith(landmarks);
      expect(isFist).not.toHaveBeenCalled();
    });

    it('should return FIST when isFist returns true', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isFist.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(FIST);
      expect(isFist).toHaveBeenCalledWith(landmarks);
    });

    it('should return null when no gesture is detected', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];

      expect(detectGesture(landmarks)).toBeNull();
    });

    it('should keep detector priority order', () => {
      const landmarks = [{ x: 0, y: 0, z: 0 }];
      isVSign.mockReturnValue(true);
      isPoint.mockReturnValue(true);
      isShaka.mockReturnValue(true);

      expect(detectGesture(landmarks)).toBe(V_SIGN);
      expect(isPoint).not.toHaveBeenCalled();
      expect(isShaka).not.toHaveBeenCalled();
    });

    it('should pass landmarks correctly to all detectors until match', () => {
      const landmarks = [
        { x: 0.1, y: 0.2, z: 0.3 },
        { x: 0.4, y: 0.5, z: 0.6 },
      ];

      detectGesture(landmarks);

      expect(isThumbsUp).toHaveBeenCalledWith(landmarks);
      expect(isRock).toHaveBeenCalledWith(landmarks);
      expect(isVSign).toHaveBeenCalledWith(landmarks);
      expect(isPoint).toHaveBeenCalledWith(landmarks);
      expect(isShaka).toHaveBeenCalledWith(landmarks);
      expect(isPalm).toHaveBeenCalledWith(landmarks);
      expect(isFist).toHaveBeenCalledWith(landmarks);
    });
  });

  describe('constants', () => {
    it('should export all gesture constants', () => {
      expect(THUMBS_UP).toBe('THUMBS_UP');
      expect(ROCK).toBe('ROCK');
      expect(V_SIGN).toBe('V_SIGN');
      expect(PALM).toBe('PALM');
      expect(POINT).toBe('POINT');
      expect(SHAKA).toBe('SHAKA');
      expect(FIST).toBe('FIST');
    });
  });
});

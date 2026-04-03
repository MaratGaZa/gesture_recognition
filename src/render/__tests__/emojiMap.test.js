/**
 * Tests for emojiMap module
 */

import { Gesture, EMOJI_MAP, getEmojiByGesture } from '../emojiMap.js';

describe('emojiMap', () => {
  describe('Gesture constants', () => {
    test('should define all supported gesture constants', () => {
      expect(Gesture.THUMBS_UP).toBe('THUMBS_UP');
      expect(Gesture.ROCK).toBe('ROCK');
      expect(Gesture.V_SIGN).toBe('V_SIGN');
      expect(Gesture.PALM).toBe('PALM');
      expect(Gesture.POINT).toBe('POINT');
      expect(Gesture.SHAKA).toBe('SHAKA');
      expect(Gesture.FIST).toBe('FIST');
    });
  });

  describe('EMOJI_MAP', () => {
    test('should map THUMBS_UP to thumbs up emoji', () => {
      expect(EMOJI_MAP[Gesture.THUMBS_UP]).toBe('👍');
    });

    test('should map ROCK to rock emoji', () => {
      expect(EMOJI_MAP[Gesture.ROCK]).toBe('🤘');
    });

    test('should map V_SIGN to victory emoji', () => {
      expect(EMOJI_MAP[Gesture.V_SIGN]).toBe('✌️');
    });

    test('should map PALM to open hand emoji', () => {
      expect(EMOJI_MAP[Gesture.PALM]).toBe('🖐️');
    });

    test('should map POINT to pointing emoji', () => {
      expect(EMOJI_MAP[Gesture.POINT]).toBe('☝️');
    });

    test('should map SHAKA to shaka emoji', () => {
      expect(EMOJI_MAP[Gesture.SHAKA]).toBe('🤙');
    });

    test('should map FIST to fist emoji', () => {
      expect(EMOJI_MAP[Gesture.FIST]).toBe('✊');
    });

    test('should have mappings for all defined gestures', () => {
      const gestureKeys = Object.keys(Gesture);

      gestureKeys.forEach(key => {
        expect(EMOJI_MAP[Gesture[key]]).toBeDefined();
      });
    });
  });

  describe('getEmojiByGesture', () => {
    test('should return thumbs up emoji for THUMBS_UP gesture', () => {
      expect(getEmojiByGesture(Gesture.THUMBS_UP)).toBe('👍');
    });

    test('should return rock emoji for ROCK gesture', () => {
      expect(getEmojiByGesture(Gesture.ROCK)).toBe('🤘');
    });

    test('should return victory emoji for V_SIGN gesture', () => {
      expect(getEmojiByGesture(Gesture.V_SIGN)).toBe('✌️');
    });

    test('should return open hand emoji for PALM gesture', () => {
      expect(getEmojiByGesture(Gesture.PALM)).toBe('🖐️');
    });

    test('should return pointing emoji for POINT gesture', () => {
      expect(getEmojiByGesture(Gesture.POINT)).toBe('☝️');
    });

    test('should return shaka emoji for SHAKA gesture', () => {
      expect(getEmojiByGesture(Gesture.SHAKA)).toBe('🤙');
    });

    test('should return fist emoji for FIST gesture', () => {
      expect(getEmojiByGesture(Gesture.FIST)).toBe('✊');
    });

    test('should return null for unknown gesture', () => {
      expect(getEmojiByGesture('UNKNOWN')).toBeNull();
    });

    test('should return null for null input', () => {
      expect(getEmojiByGesture(null)).toBeNull();
    });

    test('should return null for undefined input', () => {
      expect(getEmojiByGesture(undefined)).toBeNull();
    });

    test('should return null for empty string', () => {
      expect(getEmojiByGesture('')).toBeNull();
    });
  });
});

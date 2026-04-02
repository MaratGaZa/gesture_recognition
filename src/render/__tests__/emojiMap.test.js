/**
 * Tests for emojiMap module
 */

import { Gesture, EMOJI_MAP, getEmojiByGesture } from '../emojiMap.js';

describe('emojiMap', () => {
  describe('Gesture constants', () => {
    test('should define THUMBS_UP constant', () => {
      expect(Gesture.THUMBS_UP).toBe('THUMBS_UP');
    });

    test('should define ROCK constant', () => {
      expect(Gesture.ROCK).toBe('ROCK');
    });
  });

  describe('EMOJI_MAP', () => {
    test('should map THUMBS_UP to thumbs up emoji', () => {
      expect(EMOJI_MAP[Gesture.THUMBS_UP]).toBe('👍');
    });

    test('should map ROCK to rock emoji', () => {
      expect(EMOJI_MAP[Gesture.ROCK]).toBe('🤘');
    });

    test('should have mappings for all defined gestures', () => {
      const gestureKeys = Object.keys(Gesture);
      const mapKeys = Object.keys(EMOJI_MAP);

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

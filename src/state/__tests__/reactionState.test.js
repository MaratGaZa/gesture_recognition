import { ReactionState } from '../reactionState.js';

describe('ReactionState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should use default cooldown of 500ms', () => {
      const state = new ReactionState();
      expect(state.cooldownMs).toBe(500);
    });

    it('should allow custom cooldown', () => {
      const state = new ReactionState(1000);
      expect(state.cooldownMs).toBe(1000);
    });

    it('should initialize lastGesture to null', () => {
      const state = new ReactionState();
      expect(state.lastGesture).toBeNull();
    });

    it('should initialize lastTriggerTime to 0', () => {
      const state = new ReactionState();
      expect(state.lastTriggerTime).toBe(0);
    });
  });

  describe('update', () => {
    it('should return null when gesture is null', () => {
      const state = new ReactionState();
      const result = state.update(null);
      expect(result).toBeNull();
    });

    it('should return gesture when cooldown has passed', () => {
      const state = new ReactionState(100);

      // Mock performance.now to return a time
      let currentTime = 0;
      jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

      // First update should return the gesture
      currentTime = 0;
      const result1 = state.update('THUMBS_UP');
      expect(result1).toBe('THUMBS_UP');
      expect(state.lastGesture).toBe('THUMBS_UP');
      expect(state.lastTriggerTime).toBe(0);

      // Within cooldown, should return null
      currentTime = 50;
      const result2 = state.update('ROCK');
      expect(result2).toBeNull();

      // After cooldown, should return new gesture
      currentTime = 150;
      const result3 = state.update('ROCK');
      expect(result3).toBe('ROCK');
      expect(state.lastGesture).toBe('ROCK');
    });

    it('should suppress rapid repeated gestures', () => {
      const state = new ReactionState(500);

      let currentTime = 0;
      jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

      // First trigger
      currentTime = 0;
      const result1 = state.update('THUMBS_UP');
      expect(result1).toBe('THUMBS_UP');

      // Rapid second attempt within cooldown
      currentTime = 100;
      const result2 = state.update('THUMBS_UP');
      expect(result2).toBeNull();

      // Still within cooldown
      currentTime = 400;
      const result3 = state.update('THUMBS_UP');
      expect(result3).toBeNull();

      // After cooldown passes
      currentTime = 600;
      const result4 = state.update('THUMBS_UP');
      expect(result4).toBe('THUMBS_UP');
    });

    it('should allow different gestures after cooldown', () => {
      const state = new ReactionState(200);

      let currentTime = 0;
      jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

      currentTime = 0;
      const result1 = state.update('THUMBS_UP');
      expect(result1).toBe('THUMBS_UP');

      currentTime = 300;
      const result2 = state.update('ROCK');
      expect(result2).toBe('ROCK');
    });
  });

  describe('reset', () => {
    it('should reset lastGesture to null', () => {
      const state = new ReactionState();
      state.update('THUMBS_UP');
      state.reset();
      expect(state.lastGesture).toBeNull();
    });

    it('should reset lastTriggerTime to 0', () => {
      const state = new ReactionState();
      jest.spyOn(performance, 'now').mockReturnValue(1000);
      state.update('THUMBS_UP');
      state.reset();
      expect(state.lastTriggerTime).toBe(0);
    });
  });
});

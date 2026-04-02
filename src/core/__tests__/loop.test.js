/**
 * Tests for core/loop.js
 */

import { startLoop } from '../loop.js';

describe('startLoop', () => {
  let callback;
  let handle;

  beforeEach(() => {
    callback = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    if (handle && handle.stop) {
      handle.stop();
    }
    jest.useRealTimers();
  });

  it('should return a handle with a stop method', () => {
    handle = startLoop(callback);
    expect(handle).toBeDefined();
    expect(handle.stop).toBeInstanceOf(Function);
  });

  it('should call the callback repeatedly', () => {
    handle = startLoop(callback);
    // Initially not called
    expect(callback).not.toHaveBeenCalled();

    // Advance timers to trigger animation frames
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalled();
  });

  it('should stop calling callback after stop()', () => {
    handle = startLoop(callback);
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalled();

    callback.mockClear();
    handle.stop();

    jest.runOnlyPendingTimers();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should pass timestamp to callback', () => {
    handle = startLoop(callback);
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledWith(expect.any(Number));
  });
});

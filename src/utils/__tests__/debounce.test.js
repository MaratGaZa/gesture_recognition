/**
 * Tests for debounce utility.
 * These tests will be implemented once the debounce function is complete.
 */

import { debounce } from '../debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should call the function after the specified delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should reset the timer on subsequent calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);

    debouncedFn();
    jest.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should pass the arguments from the last call', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  test('should cancel the pending execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn.cancel();

    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('should work with multiple arguments', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('a', 'b', 'c');
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('a', 'b', 'c');
  });

  test('should not interfere with other debounced functions', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 100);
    const debouncedFn2 = debounce(mockFn2, 200);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('should return undefined (no return value preservation)', () => {
    const mockFn = jest.fn().mockReturnValue('value');
    const debouncedFn = debounce(mockFn, 100);

    const result = debouncedFn();
    expect(result).toBeUndefined();
  });
});

/**
 * Tests for camera module.
 * @module core/__tests__/camera.test
 */

import { initCamera } from '../camera.js';

describe('initCamera', () => {
  let videoElement;
  let mockStream;

  beforeEach(() => {
    // Mock video element
    videoElement = {
      srcObject: null,
      play: jest.fn().mockResolvedValue(undefined),
    };

    // Mock media stream
    mockStream = {
      getTracks: jest.fn().mockReturnValue([]),
    };

    // Mock navigator.mediaDevices.getUserMedia
    if (!navigator.mediaDevices) {
      navigator.mediaDevices = {};
    }
    navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue(mockStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should reject if video element is not provided', async () => {
    await expect(initCamera(null)).rejects.toThrow('Video element is required');
    await expect(initCamera(undefined)).rejects.toThrow('Video element is required');
  });

  test('should request user media with correct constraints', async () => {
    await initCamera(videoElement);

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'user' },
      audio: false,
    });
  });

  test('should attach stream to video element', async () => {
    await initCamera(videoElement);

    expect(videoElement.srcObject).toBe(mockStream);
  });

  test('should call video.play()', async () => {
    await initCamera(videoElement);

    expect(videoElement.play).toHaveBeenCalled();
  });

  test('should resolve if camera access and playback succeed', async () => {
    await expect(initCamera(videoElement)).resolves.toBeUndefined();
  });

  test('should reject if getUserMedia fails', async () => {
    const error = new Error('Permission denied');
    navigator.mediaDevices.getUserMedia.mockRejectedValue(error);

    await expect(initCamera(videoElement)).rejects.toThrow('Permission denied');
  });

  test('should reject if video.play fails', async () => {
    const error = new Error('Play failed');
    videoElement.play.mockRejectedValue(error);

    await expect(initCamera(videoElement)).rejects.toThrow('Play failed');
  });

  test('should handle errors and log them', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    navigator.mediaDevices.getUserMedia.mockRejectedValue(error);

    await expect(initCamera(videoElement)).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Camera init error:', error);

    consoleErrorSpy.mockRestore();
  });
});

/**
 * Camera module – handles webcam access and streaming.
 * Exposes `initCamera(videoEl): Promise<void>` as described in MVP_Functions.md.
 */

/**
 * Requests access to the default webcam and streams it to the provided <video> element.
 *
 * @param {HTMLVideoElement} videoEl - The video element to attach the stream to.
 * @returns {Promise<void>} Resolves when the video is playing; rejects on error.
 */
export async function initCamera(videoEl) {
  if (!videoEl) {
    return Promise.reject(new Error('Video element is required'));
  }

  try {
    // Request video stream (no audio)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    // Attach stream to video element
    videoEl.srcObject = stream;

    // Ensure video plays - wait for it to be ready
    await new Promise((resolve, reject) => {
      if (videoEl.readyState >= 3) {
        // HAVE_ENOUGH_DATA or higher
        videoEl.play().then(resolve).catch(reject);
      } else {
        videoEl.oncanplay = () => {
          videoEl.oncanplay = null;
          videoEl.play().then(resolve).catch(reject);
        };
        videoEl.onerror = () => {
          videoEl.onerror = null;
          reject(new Error('Video element failed to load'));
        };
      }
    });
  } catch (error) {
    // Propagate a clear error message
    console.error('Camera init error:', error);
    throw error;
  }
}

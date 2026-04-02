/**
 * Camera module – handles webcam access and streaming.
 * Exposes `initCamera(videoEl): Promise<void>` as described in MVP_Functions.md.
 */

/**
 * Requests access to the default webcam and streams it to the provided <video> element.
 * @param {HTMLVideoElement} videoEl - The <video> element where the webcam stream will be displayed.
 * @returns {Promise<void>} A promise that resolves when the camera is initialized and streaming, or rejects with an error if access is denied or other issues occur.
 */
export async function initCamera(videoEl) {
  if (!videoEl) {
    return Promise.reject(new Error("Video element is required"));
  }

  // ✅ Критично для iOS Safari — без этого видео не рендерится в элементе
  videoEl.setAttribute("playsinline", "");
  videoEl.setAttribute("muted", "");
  videoEl.muted = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 }, // ✅ 1280 слишком тяжело для мобильного
        height: { ideal: 480 },
      },
      audio: false,
    });

    videoEl.srcObject = stream;

    await new Promise((resolve, reject) => {
      if (videoEl.readyState >= 3) {
        videoEl.play().then(resolve).catch(reject);
      } else {
        videoEl.oncanplay = () => {
          videoEl.oncanplay = null;
          videoEl.play().then(resolve).catch(reject);
        };
        videoEl.onerror = () => {
          videoEl.onerror = null;
          reject(new Error("Video element failed to load"));
        };
      }
    });
  } catch (error) {
    console.error("Camera init error:", error);
    throw error;
  }
}

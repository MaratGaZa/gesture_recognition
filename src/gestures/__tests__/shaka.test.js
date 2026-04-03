import { isShaka } from '../shaka.js';

describe('isShaka', () => {
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  const createBaseHand = () => Array.from({ length: 21 }, () => createLandmark(0.5, 0.5));

  const createShakaLandmarks = () => {
    const landmarks = createBaseHand();

    landmarks[0] = createLandmark(0.5, 0.8);

    landmarks[1] = createLandmark(0.4, 0.66);
    landmarks[4] = createLandmark(0.18, 0.45);

    landmarks[5] = createLandmark(0.44, 0.7);
    landmarks[8] = createLandmark(0.45, 0.69);

    landmarks[9] = createLandmark(0.5, 0.71);
    landmarks[12] = createLandmark(0.51, 0.69);

    landmarks[13] = createLandmark(0.56, 0.72);
    landmarks[16] = createLandmark(0.57, 0.7);

    landmarks[17] = createLandmark(0.62, 0.62);
    landmarks[20] = createLandmark(0.72, 0.28);

    return landmarks;
  };

  test('returns true for shaka gesture', () => {
    expect(isShaka(createShakaLandmarks())).toBe(true);
  });

  test('returns false when index finger is extended', () => {
    const landmarks = createShakaLandmarks();
    landmarks[5] = createLandmark(0.44, 0.58);
    landmarks[8] = createLandmark(0.44, 0.2);
    expect(isShaka(landmarks)).toBe(false);
  });

  test('returns false for invalid input', () => {
    expect(isShaka(null)).toBe(false);
    expect(isShaka([])).toBe(false);
  });
});

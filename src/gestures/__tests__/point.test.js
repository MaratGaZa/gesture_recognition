import { isPoint } from '../point.js';

describe('isPoint', () => {
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  const createBaseHand = () => Array.from({ length: 21 }, () => createLandmark(0.5, 0.5));

  const createPointLandmarks = () => {
    const landmarks = createBaseHand();

    landmarks[0] = createLandmark(0.5, 0.8);

    landmarks[1] = createLandmark(0.4, 0.72);
    landmarks[4] = createLandmark(0.43, 0.71);

    landmarks[5] = createLandmark(0.45, 0.58);
    landmarks[8] = createLandmark(0.43, 0.18);

    landmarks[9] = createLandmark(0.52, 0.7);
    landmarks[12] = createLandmark(0.53, 0.68);

    landmarks[13] = createLandmark(0.58, 0.72);
    landmarks[16] = createLandmark(0.59, 0.7);

    landmarks[17] = createLandmark(0.64, 0.74);
    landmarks[20] = createLandmark(0.65, 0.72);

    return landmarks;
  };

  test('returns true for point gesture', () => {
    expect(isPoint(createPointLandmarks())).toBe(true);
  });

  test('returns false when middle finger is also extended', () => {
    const landmarks = createPointLandmarks();
    landmarks[9] = createLandmark(0.52, 0.58);
    landmarks[12] = createLandmark(0.54, 0.18);
    expect(isPoint(landmarks)).toBe(false);
  });

  test('returns false for invalid input', () => {
    expect(isPoint(null)).toBe(false);
    expect(isPoint([])).toBe(false);
  });
});

import { isFist } from '../fist.js';

describe('isFist', () => {
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  const createBaseHand = () => Array.from({ length: 21 }, () => createLandmark(0.5, 0.5));

  const createFistLandmarks = () => {
    const landmarks = createBaseHand();

    landmarks[0] = createLandmark(0.5, 0.8);
    landmarks[1] = createLandmark(0.4, 0.72);
    landmarks[4] = createLandmark(0.43, 0.7);
    landmarks[5] = createLandmark(0.45, 0.7);
    landmarks[8] = createLandmark(0.46, 0.68);
    landmarks[9] = createLandmark(0.5, 0.71);
    landmarks[12] = createLandmark(0.51, 0.69);
    landmarks[13] = createLandmark(0.55, 0.72);
    landmarks[16] = createLandmark(0.56, 0.7);
    landmarks[17] = createLandmark(0.6, 0.73);
    landmarks[20] = createLandmark(0.61, 0.71);

    return landmarks;
  };

  test('returns true for fist gesture', () => {
    expect(isFist(createFistLandmarks())).toBe(true);
  });

  test('returns false when one finger is extended', () => {
    const landmarks = createFistLandmarks();
    landmarks[8] = createLandmark(0.44, 0.2);
    expect(isFist(landmarks)).toBe(false);
  });

  test('returns false for invalid input', () => {
    expect(isFist(null)).toBe(false);
    expect(isFist([])).toBe(false);
  });
});

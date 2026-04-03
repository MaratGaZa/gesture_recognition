import { isPalm } from '../palm.js';

describe('isPalm', () => {
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  const createBaseHand = () => Array.from({ length: 21 }, () => createLandmark(0.5, 0.5));

  const createPalmLandmarks = () => {
    const landmarks = createBaseHand();

    landmarks[0] = createLandmark(0.5, 0.8);
    landmarks[4] = createLandmark(0.2, 0.4);
    landmarks[8] = createLandmark(0.38, 0.2);
    landmarks[12] = createLandmark(0.48, 0.15);
    landmarks[16] = createLandmark(0.58, 0.2);
    landmarks[20] = createLandmark(0.68, 0.25);

    landmarks[1] = createLandmark(0.38, 0.65);
    landmarks[5] = createLandmark(0.42, 0.6);
    landmarks[9] = createLandmark(0.5, 0.6);
    landmarks[13] = createLandmark(0.58, 0.62);
    landmarks[17] = createLandmark(0.64, 0.64);

    return landmarks;
  };

  test('returns true for open palm landmarks', () => {
    expect(isPalm(createPalmLandmarks())).toBe(true);
  });

  test('returns false when one finger is folded', () => {
    const landmarks = createPalmLandmarks();
    landmarks[12] = createLandmark(0.51, 0.59);
    expect(isPalm(landmarks)).toBe(false);
  });

  test('returns false for invalid input', () => {
    expect(isPalm(null)).toBe(false);
    expect(isPalm([])).toBe(false);
  });
});

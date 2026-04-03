import { isVSign } from '../vSign.js';

describe('isVSign', () => {
  const createLandmark = (x, y, z = 0) => ({ x, y, z });

  const createBaseHand = () => Array.from({ length: 21 }, () => createLandmark(0.5, 0.5));

  const createVSignLandmarks = () => {
    const landmarks = createBaseHand();

    landmarks[0] = createLandmark(0.5, 0.8);

    landmarks[5] = createLandmark(0.45, 0.58);
    landmarks[8] = createLandmark(0.42, 0.2);

    landmarks[9] = createLandmark(0.52, 0.58);
    landmarks[12] = createLandmark(0.55, 0.18);

    landmarks[13] = createLandmark(0.58, 0.7);
    landmarks[16] = createLandmark(0.57, 0.68);

    landmarks[17] = createLandmark(0.64, 0.7);
    landmarks[20] = createLandmark(0.63, 0.69);

    return landmarks;
  };

  const createPointLandmarks = () => {
    const landmarks = createVSignLandmarks();
    landmarks[9] = createLandmark(0.52, 0.72);
    landmarks[12] = createLandmark(0.53, 0.74);
    return landmarks;
  };

  test('returns true for clear V-sign landmarks', () => {
    expect(isVSign(createVSignLandmarks())).toBe(true);
  });

  test('returns false when only index finger is extended', () => {
    expect(isVSign(createPointLandmarks())).toBe(false);
  });

  test('returns false for invalid input', () => {
    expect(isVSign(null)).toBe(false);
    expect(isVSign([])).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { getShieldPulseScale } from './shield-utils';

describe('shield-utils', () => {
  describe('getShieldPulseScale', () => {
    it('returns value in 0.98–1.0 range', () => {
      expect(getShieldPulseScale(0, 1)).toBe(0.98);
      expect(getShieldPulseScale(Math.PI / 2, 1)).toBe(1);
      expect(getShieldPulseScale(Math.PI, 1)).toBe(0.98);
      expect(getShieldPulseScale((3 * Math.PI) / 2, 1)).toBe(0.96);
    });

    it('uses sin for oscillation', () => {
      const scale = getShieldPulseScale(0, 10);
      expect(scale).toBeGreaterThanOrEqual(0.96);
      expect(scale).toBeLessThanOrEqual(1);
    });

    it('respects frequency parameter', () => {
      const a = getShieldPulseScale(1, 1);
      const b = getShieldPulseScale(1, 2);
      expect(a).not.toBe(b);
    });
  });
});

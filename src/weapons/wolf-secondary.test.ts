import { describe, it, expect } from 'vitest';
import {
  wolfSecondaryDamagePerSecond,
  getWolfSecondaryMuzzle,
  WOLF_SECONDARY_MANA_PER_SECOND,
} from './wolf-secondary';

describe('wolf-secondary', () => {
  describe('wolfSecondaryDamagePerSecond', () => {
    it('returns weaponStrength for given attack', () => {
      expect(wolfSecondaryDamagePerSecond(20)).toBeGreaterThan(0);
    });
  });

  describe('getWolfSecondaryMuzzle', () => {
    it('returns center nose position', () => {
      const result = getWolfSecondaryMuzzle({
        shipX: 100,
        shipY: 200,
        shipSize: 100,
      });
      expect(result.x).toBe(150);
      expect(result.y).toBe(200);
    });
  });

  it('WOLF_SECONDARY_MANA_PER_SECOND is 5', () => {
    expect(WOLF_SECONDARY_MANA_PER_SECOND).toBe(5);
  });
});

import { describe, it, expect } from 'vitest';
import {
  WOLF_SECONDARY_MANA_PER_SECOND,
  wolfSecondaryDamagePerSecond,
  getWolfSecondaryMuzzle,
} from './wolf-secondary';

describe('Wolf secondary weapon', () => {
  it('exports mana per second 5 (sustained beam)', () => {
    expect(WOLF_SECONDARY_MANA_PER_SECOND).toBe(5);
  });

  it('returns center nose muzzle position', () => {
    const muzzle = getWolfSecondaryMuzzle({
      shipX: 100,
      shipY: 500,
      shipSize: 100,
    });
    expect(muzzle.x).toBe(150); // 100 + 100/2
    expect(muzzle.y).toBe(500); // center nose
  });

  it('damage per second = weaponStrength (Wolf Attack 20 → 5)', () => {
    expect(wolfSecondaryDamagePerSecond(20)).toBe(5);
  });
});

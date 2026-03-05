import { describe, it, expect } from 'vitest';
import { weaponStrength } from './weapon-strength';

describe('weaponStrength', () => {
  it('Sparrow Attack 20 → 5 damage', () => {
    expect(weaponStrength(20)).toBe(5);
  });

  it('returns attack * 0.25 for other values', () => {
    expect(weaponStrength(0)).toBe(0);
    expect(weaponStrength(4)).toBe(1);
    expect(weaponStrength(40)).toBe(10);
  });
});

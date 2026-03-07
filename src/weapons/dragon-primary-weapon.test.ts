import { describe, it, expect } from 'vitest';
import {
  fireDragonPrimary,
  DRAGON_PRIMARY_FIRE_RATE_S,
  DRAGON_PRIMARY_MANA_COST,
  DRAGON_PRIMARY_DAMAGE_MULTIPLIER,
} from './dragon-primary-weapon';

describe('dragon-primary-weapon', () => {
  const opts = {
    shipX: 100,
    shipY: 200,
    shipSize: 100,
    attack: 20,
    spawnTime: 1,
  };

  it('fireDragonPrimary returns [left, right] homing crescents', () => {
    const [left, right] = fireDragonPrimary(opts);
    expect(left.x).toBe(100 + 25);
    expect(right.x).toBe(100 + 75);
    expect(left.y).toBe(right.y);
    expect(left.vy).toBeLessThan(0);
    expect(right.vy).toBeLessThan(0);
  });

  it('both projectiles have same damage', () => {
    const [left, right] = fireDragonPrimary(opts);
    expect(left.damage).toBe(right.damage);
  });

  it('DRAGON_PRIMARY_FIRE_RATE_S is 0.35', () => {
    expect(DRAGON_PRIMARY_FIRE_RATE_S).toBe(0.35);
  });

  it('DRAGON_PRIMARY_MANA_COST is 3', () => {
    expect(DRAGON_PRIMARY_MANA_COST).toBe(3);
  });

  it('DRAGON_PRIMARY_DAMAGE_MULTIPLIER is 0.6', () => {
    expect(DRAGON_PRIMARY_DAMAGE_MULTIPLIER).toBe(0.6);
  });
});

import { describe, it, expect } from 'vitest';
import {
  fireDragonChargedBall,
  DRAGON_SECONDARY_MANA_PER_SECOND,
  DRAGON_SECONDARY_MIN_CHARGE_S,
  DRAGON_SECONDARY_MIN_RADIUS,
} from './dragon-secondary';

describe('dragon-secondary', () => {
  const opts = {
    shipX: 100,
    shipY: 200,
    shipSize: 100,
    attack: 20,
    chargeDuration: 0.5,
    spawnTime: 1,
  };

  it('fireDragonChargedBall returns charged ball options', () => {
    const result = fireDragonChargedBall(opts);
    expect(result.x).toBe(100 + 50);
    expect(result.y).toBe(200 + 5);
    expect(result.vy).toBeLessThan(0);
    expect(result.radius).toBeGreaterThanOrEqual(DRAGON_SECONDARY_MIN_RADIUS);
  });

  it('radius grows with charge duration', () => {
    const short = fireDragonChargedBall({ ...opts, chargeDuration: 0.2 });
    const long = fireDragonChargedBall({ ...opts, chargeDuration: 1 });
    expect(long.radius).toBeGreaterThan(short.radius);
  });

  it('damage scales with charge duration', () => {
    const short = fireDragonChargedBall({ ...opts, chargeDuration: 0.2 });
    const long = fireDragonChargedBall({ ...opts, chargeDuration: 1 });
    expect(long.damage).toBeGreaterThan(short.damage);
  });

  it('DRAGON_SECONDARY_MANA_PER_SECOND is 4', () => {
    expect(DRAGON_SECONDARY_MANA_PER_SECOND).toBe(4);
  });

  it('DRAGON_SECONDARY_MIN_CHARGE_S is 0.2', () => {
    expect(DRAGON_SECONDARY_MIN_CHARGE_S).toBe(0.2);
  });

  it('DRAGON_SECONDARY_MIN_RADIUS is 4', () => {
    expect(DRAGON_SECONDARY_MIN_RADIUS).toBe(4);
  });
});

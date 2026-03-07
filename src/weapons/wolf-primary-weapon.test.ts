import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireWolfPrimary, WOLF_PRIMARY_FIRE_RATE_S, WOLF_PRIMARY_PROJECTILE_SPEED_PX_S } from './wolf-primary-weapon';

describe('Wolf primary weapon', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('exports fire rate 0.3s', () => {
    expect(WOLF_PRIMARY_FIRE_RATE_S).toBe(0.3);
  });

  it('returns 2 projectiles from left and right wing tips', () => {
    const [left, right] = fireWolfPrimary({
      shipX: 100,
      shipY: 500,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(left.x).toBe(125); // 100 + 100*0.25
    expect(right.x).toBe(175); // 100 + 100*0.75
    expect(left.y).toBe(545); // 500 + 100*0.45 (wing guns)
    expect(right.y).toBe(545);
  });

  it('both projectiles travel north (vy negative)', () => {
    const [left, right] = fireWolfPrimary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(left.vy).toBe(-WOLF_PRIMARY_PROJECTILE_SPEED_PX_S);
    expect(right.vy).toBe(-WOLF_PRIMARY_PROJECTILE_SPEED_PX_S);
    expect(left.vx).toBe(0);
    expect(right.vx).toBe(0);
  });

  it('uses weaponStrength for damage (Wolf Attack 20 → 2.5, half strength)', () => {
    const [left, right] = fireWolfPrimary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(left.damage).toBe(2.5);
    expect(right.damage).toBe(2.5);
  });
});

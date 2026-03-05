import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireBasicGun, BASIC_GUN_FIRE_RATE_S } from './basic-gun';
import { PROJECTILE_SPEED_PX_S } from '../projectiles/player-projectile';

describe('BasicGun', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('exports fire rate 0.15s', () => {
    expect(BASIC_GUN_FIRE_RATE_S).toBe(0.15);
  });

  it('spawns projectile at muzzle (ship center-top)', () => {
    const projectile = fireBasicGun({
      shipX: 100,
      shipY: 500,
      shipSize: 64,
      attack: 20,
      spawnTime: 0,
    });
    expect(projectile.x).toBe(132);
    expect(projectile.y).toBe(500);
    expect(projectile.vx).toBe(0);
    expect(projectile.vy).toBe(-PROJECTILE_SPEED_PX_S);
  });

  it('uses weaponStrength for damage (Sparrow Attack 20 → 5)', () => {
    const projectile = fireBasicGun({
      shipX: 100,
      shipY: 500,
      shipSize: 64,
      attack: 20,
      spawnTime: 0,
    });
    expect(projectile.damage).toBe(5);
  });
});

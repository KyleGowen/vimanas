import { describe, it, expect } from 'vitest';
import { fireScoutWeapon, SCOUT_FIRE_RATE_S, SCOUT_ATTACK } from './scout-weapon';
import { ENEMY_PROJECTILE_SPEED_PX_S } from '../projectiles/enemy-projectile';
import { SCOUT_SIZE } from '../enemies/scout-enemy';

describe('fireScoutWeapon', () => {
  it('returns projectile options with weaponStrength 24 (48 × 0.5 CEO tuning)', () => {
    const opts = fireScoutWeapon({
      scoutX: 100,
      scoutY: 80,
      scoutSize: SCOUT_SIZE,
      attack: SCOUT_ATTACK,
      spawnTime: 0,
    });
    expect(opts.weaponStrength).toBe(24);
    expect(opts.vx).toBe(0);
    expect(opts.vy).toBe(ENEMY_PROJECTILE_SPEED_PX_S);
    expect(opts.x).toBe(100 + SCOUT_SIZE / 2);
    expect(opts.y).toBe(80 + SCOUT_SIZE);
  });

  it('SCOUT_ATTACK is 192 per design lock', () => {
    expect(SCOUT_ATTACK).toBe(192);
  });

  it('SCOUT_FIRE_RATE_S is ~0.533 (0.4 × 4/3 CEO tuning)', () => {
    expect(SCOUT_FIRE_RATE_S).toBeCloseTo(0.533, 2);
  });
});

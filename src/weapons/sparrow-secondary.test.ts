import { describe, it, expect } from 'vitest';
import {
  fireSparrowSecondary,
  SPARROW_SECONDARY_MANA_COST,
  SPARROW_SECONDARY_FIRE_RATE_S,
} from './sparrow-secondary';
import { ENERGY_RING_SPEED_PX_S } from '../projectiles/energy-ring-projectile';

describe('fireSparrowSecondary', () => {
  it('exports mana cost 1', () => {
    expect(SPARROW_SECONDARY_MANA_COST).toBe(1);
  });

  it('exports fire rate 0.12s', () => {
    expect(SPARROW_SECONDARY_FIRE_RATE_S).toBe(0.12);
  });

  it('returns projectile options at muzzle (ship center-top)', () => {
    const opts = fireSparrowSecondary({
      shipX: 100,
      shipY: 500,
      shipSize: 64,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.x).toBe(132); // 100 + 64/2
    expect(opts.y).toBe(500);
    expect(opts.vx).toBe(0);
    expect(opts.vy).toBe(-ENERGY_RING_SPEED_PX_S);
  });

  it('uses weaponStrength for damage (Sparrow Attack 20 → 5)', () => {
    const opts = fireSparrowSecondary({
      shipX: 100,
      shipY: 500,
      shipSize: 64,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.damage).toBe(5);
  });
});

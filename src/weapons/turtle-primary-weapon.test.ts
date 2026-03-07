import { describe, it, expect } from 'vitest';
import {
  fireTurtlePrimary,
  TURTLE_PRIMARY_FIRE_RATE_S,
  TURTLE_PRIMARY_DAMAGE_MULTIPLIER,
} from './turtle-primary-weapon';

describe('fireTurtlePrimary', () => {
  it('spawns arc at muzzle (ship center-top)', () => {
    const opts = fireTurtlePrimary({
      shipX: 100,
      shipY: 500,
      shipSize: 100,
      attack: 14,
      spawnTime: 1.5,
    });
    expect(opts.x).toBe(150);
    expect(opts.y).toBe(500);
    expect(opts.spawnTime).toBe(1.5);
  });

  it('damage is weaponStrength(14) × 1.15 ≈ 4', () => {
    const opts = fireTurtlePrimary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 14,
      spawnTime: 0,
    });
    expect(opts.damage).toBe(4);
  });

  it('TURTLE_PRIMARY_FIRE_RATE_S is 0.4', () => {
    expect(TURTLE_PRIMARY_FIRE_RATE_S).toBe(0.4);
  });

  it('TURTLE_PRIMARY_DAMAGE_MULTIPLIER is 1.15', () => {
    expect(TURTLE_PRIMARY_DAMAGE_MULTIPLIER).toBe(1.15);
  });
});

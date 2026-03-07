import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fireWolfSecondary,
  WOLF_SECONDARY_MANA_COST,
  WOLF_SECONDARY_COOLDOWN_S,
  WOLF_SECONDARY_PROJECTILE_SPEED_PX_S,
} from './wolf-secondary';

describe('Wolf secondary weapon', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('exports mana cost 3 and cooldown 0.9s', () => {
    expect(WOLF_SECONDARY_MANA_COST).toBe(3);
    expect(WOLF_SECONDARY_COOLDOWN_S).toBe(0.9);
  });

  it('returns 1 projectile from center nose muzzle', () => {
    const opts = fireWolfSecondary({
      shipX: 100,
      shipY: 500,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.x).toBe(150); // 100 + 100/2
    expect(opts.y).toBe(500); // center nose
  });

  it('projectile travels north at 280 px/s', () => {
    const opts = fireWolfSecondary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.vy).toBe(-WOLF_SECONDARY_PROJECTILE_SPEED_PX_S);
    expect(opts.vx).toBe(0);
  });

  it('uses weaponStrength for damage (Wolf Attack 20 → 5)', () => {
    const opts = fireWolfSecondary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.damage).toBe(5);
  });

  it('includes beamConfig and lifetimeS for Wolf beam', () => {
    const opts = fireWolfSecondary({
      shipX: 0,
      shipY: 0,
      shipSize: 100,
      attack: 20,
      spawnTime: 0,
    });
    expect(opts.beamConfig).toBeDefined();
    expect(opts.beamConfig?.length).toBe(40);
    expect(opts.beamConfig?.width).toBe(12);
    expect(opts.lifetimeS).toBe(1.8);
  });
});

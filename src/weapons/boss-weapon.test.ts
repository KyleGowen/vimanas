import { describe, it, expect } from 'vitest';
import {
  fireBossWeapon,
  BOSS_FIRE_RATE_S,
  BOSS_ATTACK,
} from './boss-weapon';

describe('boss-weapon', () => {
  it('fireBossWeapon returns projectile options at boss center-bottom', () => {
    const opts = {
      bossX: 100,
      bossY: 50,
      bossWidth: 300,
      bossHeight: 200,
      attack: BOSS_ATTACK,
      spawnTime: 1,
      scrollOffset: 0,
    };
    const result = fireBossWeapon(opts);
    expect(result.x).toBe(100 + 150);
    expect(result.y).toBe(0 + 50 + 200);
    expect(result.vx).toBe(0);
    expect(result.vy).toBeGreaterThan(0);
    expect(result.spawnTime).toBe(1);
  });

  it('BOSS_FIRE_RATE_S is 1.0', () => {
    expect(BOSS_FIRE_RATE_S).toBe(1);
  });

  it('BOSS_ATTACK is 240', () => {
    expect(BOSS_ATTACK).toBe(240);
  });
});

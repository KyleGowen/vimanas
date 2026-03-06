import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  EnemyProjectile,
  ENEMY_PROJECTILE_LIFETIME_S,
  ENEMY_PROJECTILE_SPEED_PX_S,
  ENEMY_PROJECTILE_SIZE,
} from './enemy-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('EnemyProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('moves south when vy is positive', () => {
    const p = new EnemyProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const alive = p.update(0.1, { width: 1280, height: 720 });
    expect(alive).toBe(true);
    expect(p.y).toBe(200 + ENEMY_PROJECTILE_SPEED_PX_S * 0.1);
    expect(p.x).toBe(100);
  });

  it('returns false when off-screen (below)', () => {
    const p = new EnemyProjectile({
      x: 100,
      y: 720,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const alive = p.update(0.2, { width: 1280, height: 720 });
    expect(alive).toBe(false);
  });

  it('returns false when lifetime exceeded', () => {
    vi.stubGlobal('performance', { now: () => (ENEMY_PROJECTILE_LIFETIME_S + 0.1) * 1000 });
    const p = new EnemyProjectile({
      x: 100,
      y: 400,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const alive = p.update(0.016, { width: 1280, height: 720 });
    expect(alive).toBe(false);
  });

  it('draw does not throw', () => {
    const p = new EnemyProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx)).not.toThrow();
  });

  it('carries weaponStrength for damage formula', () => {
    const p = new EnemyProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    expect(p.weaponStrength).toBe(48);
  });

  it('reset reuses projectile with new options', () => {
    const p = new EnemyProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    p.reset({
      x: 50,
      y: 75,
      vx: 10,
      vy: 180,
      weaponStrength: 56,
      spawnTime: 1.5,
    });
    expect(p.x).toBe(50);
    expect(p.y).toBe(75);
    expect(p.vx).toBe(10);
    expect(p.vy).toBe(180);
    expect(p.weaponStrength).toBe(56);
    expect(p.spawnTime).toBe(1.5);
  });

  it('ENEMY_PROJECTILE_SIZE matches design (10 * 1.3 rounded)', () => {
    expect(ENEMY_PROJECTILE_SIZE).toBe(13);
  });

  it('speed and lifetime match design lock', () => {
    expect(ENEMY_PROJECTILE_SPEED_PX_S).toBe(180);
    expect(ENEMY_PROJECTILE_LIFETIME_S).toBe(2);
  });
});

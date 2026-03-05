import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlayerProjectile, PROJECTILE_LIFETIME_S, PROJECTILE_SPEED_PX_S } from './player-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('PlayerProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('moves upward when vy is negative', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = p.update(0.1, { width: 1280, height: 720 });
    expect(alive).toBe(true);
    expect(p.y).toBe(200 + (-PROJECTILE_SPEED_PX_S) * 0.1);
    expect(p.x).toBe(100);
  });

  it('returns false when off-screen (above)', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 5,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = p.update(0.2, { width: 1280, height: 720 });
    expect(alive).toBe(false);
  });

  it('returns false when lifetime exceeded', () => {
    vi.stubGlobal('performance', { now: () => (PROJECTILE_LIFETIME_S + 0.1) * 1000 });
    const p = new PlayerProjectile({
      x: 100,
      y: 400,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = p.update(0.016, { width: 1280, height: 720 });
    expect(alive).toBe(false);
  });

  it('draw does not throw', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx)).not.toThrow();
  });

  it('carries damage value', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    expect(p.damage).toBe(5);
  });
});

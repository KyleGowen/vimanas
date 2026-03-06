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

  it('draw with gameTime draws beam and does not throw', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx, 100, 200, 1.5)).not.toThrow();
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

  it('despawns when world Y above viewport (with scrollOffset)', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 50,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    // scrollOffset 100: viewport 100-820. Projectile at 50 is above. Despawn when y < 100 - 13 = 87.
    const alive = p.update(0.2, { width: 1280, height: 720, scrollOffset: 100 });
    expect(alive).toBe(false);
    expect(p.y).toBeLessThan(87);
  });

  it('despawns when world Y below viewport (with scrollOffset)', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 800,
      vx: 0,
      vy: PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    // scrollOffset 100: viewport 100-820. Projectile at 800, moving down. Despawn when y > 820 + 13 = 833.
    const alive = p.update(0.2, { width: 1280, height: 720, scrollOffset: 100 });
    expect(alive).toBe(false);
    expect(p.y).toBeGreaterThan(833);
  });

  it('reset reuses projectile with new options', () => {
    const p = new PlayerProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -PROJECTILE_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    p.reset({
      x: 50,
      y: 75,
      vx: 10,
      vy: -100,
      damage: 8,
      spawnTime: 1.5,
    });
    expect(p.x).toBe(50);
    expect(p.y).toBe(75);
    expect(p.vx).toBe(10);
    expect(p.vy).toBe(-100);
    expect(p.damage).toBe(8);
    expect(p.spawnTime).toBe(1.5);
  });
});

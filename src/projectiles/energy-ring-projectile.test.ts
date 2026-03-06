import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  EnergyRingProjectile,
  ENERGY_RING_SPEED_PX_S,
  ENERGY_RING_LIFETIME_S,
  ENERGY_RING_BASE_RADIUS,
  ENERGY_RING_GROWTH_RATE,
} from './energy-ring-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('EnergyRingProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('moves upward when vy is negative', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = r.update(0.1, {
      width: 1280,
      height: 720,
      gameTime: 0.1,
    });
    expect(alive).toBe(true);
    expect(r.y).toBe(200 + (-ENERGY_RING_SPEED_PX_S) * 0.1);
    expect(r.x).toBe(100);
  });

  it('returns false when lifetime exceeded', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 400,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = r.update(0.016, {
      width: 1280,
      height: 720,
      gameTime: ENERGY_RING_LIFETIME_S + 0.1,
    });
    expect(alive).toBe(false);
  });

  it('getRadius grows linearly with age', () => {
    const r = new EnergyRingProjectile({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      damage: 5,
      spawnTime: 0,
    });
    expect(r.getRadius(0)).toBe(ENERGY_RING_BASE_RADIUS);
    expect(r.getRadius(0.5)).toBe(
      ENERGY_RING_BASE_RADIUS + ENERGY_RING_GROWTH_RATE * 0.5
    );
    expect(r.getRadius(1)).toBe(
      ENERGY_RING_BASE_RADIUS + ENERGY_RING_GROWTH_RATE
    );
  });

  it('draw does not throw without gameTime (fallback rect)', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const ctx = createMockCanvasContext();
    expect(() => r.draw(ctx)).not.toThrow();
  });

  it('draw with gameTime does not throw', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const ctx = createMockCanvasContext();
    expect(() => r.draw(ctx, 100, 200, 1.5)).not.toThrow();
  });

  it('carries damage value', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 8,
      spawnTime: 0,
    });
    expect(r.damage).toBe(8);
  });

  it('reset reuses projectile with new options', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 200,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    r.reset({
      x: 50,
      y: 75,
      vx: 10,
      vy: -100,
      damage: 8,
      spawnTime: 1.5,
    });
    expect(r.x).toBe(50);
    expect(r.y).toBe(75);
    expect(r.vx).toBe(10);
    expect(r.vy).toBe(-100);
    expect(r.damage).toBe(8);
    expect(r.spawnTime).toBe(1.5);
  });

  it('despawns when above viewport (with scrollOffset)', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 50,
      vx: 0,
      vy: -ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = r.update(0.2, {
      width: 1280,
      height: 720,
      scrollOffset: 100,
      gameTime: 0.2,
    });
    expect(alive).toBe(false);
  });

  it('despawns when below viewport (with scrollOffset)', () => {
    const r = new EnergyRingProjectile({
      x: 100,
      y: 900,
      vx: 0,
      vy: ENERGY_RING_SPEED_PX_S,
      damage: 5,
      spawnTime: 0,
    });
    const alive = r.update(0.5, {
      width: 1280,
      height: 720,
      scrollOffset: 100,
      gameTime: 0.5,
    });
    expect(alive).toBe(false);
  });
});

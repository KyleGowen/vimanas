import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  HomingCrescentProjectile,
  HOMING_CRESCENT_SPEED_PX_S,
  HOMING_CRESCENT_LIFETIME_S,
} from './homing-crescent-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('HomingCrescentProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -HOMING_CRESCENT_SPEED_PX_S,
    damage: 15,
    spawnTime: 0,
  };

  it('constructor sets properties', () => {
    const p = new HomingCrescentProjectile(opts);
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
    expect(p.damage).toBe(15);
  });

  it('reset updates properties', () => {
    const p = new HomingCrescentProjectile(opts);
    p.reset({ ...opts, x: 50, damage: 20 });
    expect(p.x).toBe(50);
    expect(p.damage).toBe(20);
  });

  it('update moves projectile with no targets', () => {
    const p = new HomingCrescentProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: 0.1,
    };
    expect(p.update(0.1, bounds, [], null)).toBe(true);
  });

  it('update returns false when past lifetime', () => {
    const p = new HomingCrescentProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: opts.spawnTime + HOMING_CRESCENT_LIFETIME_S + 0.1,
    };
    expect(p.update(0.1, bounds, [], null)).toBe(false);
  });

  it('draw does not throw', () => {
    const p = new HomingCrescentProjectile(opts);
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx)).not.toThrow();
  });
});

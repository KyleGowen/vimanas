import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TurtleSpreadProjectile,
  TURTLE_SPREAD_SPEED_PX_S,
  TURTLE_SPREAD_LIFETIME_S,
} from './turtle-spread-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('TurtleSpreadProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -TURTLE_SPREAD_SPEED_PX_S,
    damage: 8,
    spawnTime: 0,
  };

  it('constructor sets properties', () => {
    const p = new TurtleSpreadProjectile(opts);
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
    expect(p.damage).toBe(8);
  });

  it('reset updates properties', () => {
    const p = new TurtleSpreadProjectile(opts);
    p.reset({ ...opts, x: 50, damage: 10 });
    expect(p.x).toBe(50);
    expect(p.damage).toBe(10);
  });

  it('update moves projectile and returns true when in bounds', () => {
    const p = new TurtleSpreadProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: 0.1,
    };
    expect(p.update(0.1, bounds)).toBe(true);
  });

  it('update returns false when past lifetime', () => {
    const p = new TurtleSpreadProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: opts.spawnTime + TURTLE_SPREAD_LIFETIME_S + 0.1,
    };
    expect(p.update(0.1, bounds)).toBe(false);
  });

  it('draw does not throw', () => {
    const p = new TurtleSpreadProjectile(opts);
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx)).not.toThrow();
  });
});

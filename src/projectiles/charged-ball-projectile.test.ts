import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ChargedBallProjectile,
  CHARGED_BALL_SPEED_PX_S,
  CHARGED_BALL_LIFETIME_S,
} from './charged-ball-projectile';
import { createMockCanvasContext } from '../test-utils';

describe('ChargedBallProjectile', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -CHARGED_BALL_SPEED_PX_S,
    damage: 50,
    radius: 20,
    spawnTime: 0,
  };

  it('constructor sets properties', () => {
    const p = new ChargedBallProjectile(opts);
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
    expect(p.damage).toBe(50);
    expect(p.radius).toBe(20);
  });

  it('reset updates properties', () => {
    const p = new ChargedBallProjectile(opts);
    p.reset({ ...opts, x: 50, y: 100, damage: 30 });
    expect(p.x).toBe(50);
    expect(p.y).toBe(100);
    expect(p.damage).toBe(30);
  });

  it('size returns radius * 2', () => {
    const p = new ChargedBallProjectile(opts);
    expect(p.size).toBe(40);
  });

  it('update moves projectile and returns true when in bounds', () => {
    const p = new ChargedBallProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: 0.1,
    };
    expect(p.update(0.1, bounds)).toBe(true);
    expect(p.y).toBeLessThan(200);
  });

  it('update returns false when past lifetime', () => {
    const p = new ChargedBallProjectile(opts);
    const bounds = {
      width: 1280,
      height: 720,
      scrollOffset: 0,
      gameTime: opts.spawnTime + CHARGED_BALL_LIFETIME_S + 0.1,
    };
    expect(p.update(0.1, bounds)).toBe(false);
  });

  it('draw does not throw', () => {
    const p = new ChargedBallProjectile(opts);
    const ctx = createMockCanvasContext();
    expect(() => p.draw(ctx)).not.toThrow();
  });
});

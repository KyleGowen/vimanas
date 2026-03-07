import { describe, it, expect } from 'vitest';
import { ChargedBallPool } from './charged-ball-pool';

describe('ChargedBallPool', () => {
  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -280,
    damage: 50,
    radius: 20,
    spawnTime: 0,
  };

  it('get returns projectile with reset options', () => {
    const pool = new ChargedBallPool(3);
    const p = pool.get(opts);
    expect(p).not.toBeNull();
    expect(p!.x).toBe(100);
    expect(p!.y).toBe(200);
    expect(p!.damage).toBe(50);
  });

  it('get returns null when exhausted', () => {
    const pool = new ChargedBallPool(2);
    pool.get(opts);
    pool.get(opts);
    expect(pool.get(opts)).toBeNull();
  });

  it('return reuses projectile', () => {
    const pool = new ChargedBallPool(2);
    const a = pool.get(opts);
    pool.get(opts);
    pool.return(a!);
    const b = pool.get({ ...opts, x: 50 });
    expect(b).toBe(a);
    expect(b!.x).toBe(50);
  });
});

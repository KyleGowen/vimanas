import { describe, it, expect } from 'vitest';
import { HomingCrescentPool } from './homing-crescent-pool';

describe('HomingCrescentPool', () => {
  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -420,
    damage: 15,
    spawnTime: 0,
  };

  it('pre-allocates pool of given size', () => {
    const pool = new HomingCrescentPool(5);
    expect(pool.size).toBe(5);
    expect(pool.availableCount).toBe(5);
  });

  it('get returns and reuses same objects', () => {
    const pool = new HomingCrescentPool(2);
    const a = pool.get(opts);
    const b = pool.get({ ...opts, x: 50 });
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    pool.return(a!);
    pool.return(b!);
    const c = pool.get({ ...opts, x: 99 });
    expect([a, b]).toContain(c);
    expect(c!.x).toBe(99);
  });

  it('get returns null when exhausted', () => {
    const pool = new HomingCrescentPool(1);
    pool.get(opts);
    expect(pool.get(opts)).toBeNull();
  });
});

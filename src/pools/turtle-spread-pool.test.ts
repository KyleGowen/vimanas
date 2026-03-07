import { describe, it, expect } from 'vitest';
import { TurtleSpreadPool } from './turtle-spread-pool';

describe('TurtleSpreadPool', () => {
  const opts = {
    x: 100,
    y: 200,
    vx: 0,
    vy: -135,
    damage: 8,
    spawnTime: 0,
  };

  it('pre-allocates pool of given size', () => {
    const pool = new TurtleSpreadPool(8);
    expect(pool.size).toBe(8);
    expect(pool.availableCount).toBe(8);
  });

  it('get returns projectile with reset options', () => {
    const pool = new TurtleSpreadPool(2);
    const p = pool.get(opts);
    expect(p).not.toBeNull();
    expect(p!.x).toBe(100);
    expect(p!.damage).toBe(8);
  });

  it('getSpread returns multiple projectiles', () => {
    const pool = new TurtleSpreadPool(8);
    const options = [
      opts,
      { ...opts, x: 101 },
      { ...opts, x: 102 },
    ];
    const result = pool.getSpread(options);
    expect(result).toHaveLength(3);
    expect(result[0].x).toBe(100);
    expect(result[1].x).toBe(101);
    expect(result[2].x).toBe(102);
  });

  it('return reuses projectile', () => {
    const pool = new TurtleSpreadPool(2);
    const a = pool.get(opts);
    pool.get(opts);
    pool.return(a!);
    const b = pool.get({ ...opts, x: 50 });
    expect(b).toBe(a);
    expect(b!.x).toBe(50);
  });
});

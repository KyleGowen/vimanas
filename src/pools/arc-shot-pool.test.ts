import { describe, it, expect } from 'vitest';
import { ArcShotPool } from './arc-shot-pool';

describe('ArcShotPool', () => {
  it('returns arc on get, pool depletes', () => {
    const pool = new ArcShotPool(2);
    const a1 = pool.get({
      x: 10,
      y: 20,
      damage: 4,
      spawnTime: 0,
    });
    expect(a1).not.toBeNull();
    expect(a1!.x).toBe(10);
    expect(a1!.y).toBe(20);
    expect(a1!.damage).toBe(4);

    const a2 = pool.get({ x: 0, y: 0, damage: 0, spawnTime: 0 });
    expect(a2).not.toBeNull();

    const a3 = pool.get({ x: 0, y: 0, damage: 0, spawnTime: 0 });
    expect(a3).toBeNull();
  });

  it('return makes arc available again', () => {
    const pool = new ArcShotPool(1);
    const a = pool.get({ x: 0, y: 0, damage: 4, spawnTime: 0 });
    expect(a).not.toBeNull();
    expect(pool.get({ x: 0, y: 0, damage: 0, spawnTime: 0 })).toBeNull();

    pool.return(a!);
    const a2 = pool.get({ x: 5, y: 5, damage: 1, spawnTime: 1 });
    expect(a2).toBe(a);
    expect(a2!.x).toBe(5);
    expect(a2!.damage).toBe(1);
  });
});

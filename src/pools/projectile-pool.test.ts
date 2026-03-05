import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectilePool } from './projectile-pool';
import { PlayerProjectile } from '../projectiles/player-projectile';

describe('ProjectilePool', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('pre-allocates pool of given size', () => {
    const pool = new ProjectilePool(5);
    expect(pool.size).toBe(5);
    expect(pool.availableCount).toBe(5);
  });

  it('get returns and reuses same objects', () => {
    const pool = new ProjectilePool(3);
    const a = pool.get({ x: 1, y: 2, vx: 0, vy: -1, damage: 5, spawnTime: 0 });
    const b = pool.get({ x: 3, y: 4, vx: 0, vy: -1, damage: 6, spawnTime: 0 });
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).not.toBe(b);

    pool.return(a!);
    pool.return(b!);

    const c = pool.get({ x: 10, y: 20, vx: 0, vy: -1, damage: 7, spawnTime: 0 });
    const d = pool.get({ x: 30, y: 40, vx: 0, vy: -1, damage: 8, spawnTime: 0 });
    expect([c, d]).toContain(a);
    expect([c, d]).toContain(b);
    expect(c).not.toBe(d);
    const [first, second] = [c!, d!].sort((p, q) => p.x - q.x);
    expect(first.x).toBe(10);
    expect(first.y).toBe(20);
    expect(first.damage).toBe(7);
    expect(second.x).toBe(30);
    expect(second.y).toBe(40);
    expect(second.damage).toBe(8);
  });

  it('get returns null when exhausted', () => {
    const pool = new ProjectilePool(2);
    pool.get({ x: 0, y: 0, vx: 0, vy: -1, damage: 1, spawnTime: 0 });
    pool.get({ x: 0, y: 0, vx: 0, vy: -1, damage: 1, spawnTime: 0 });
    const third = pool.get({ x: 0, y: 0, vx: 0, vy: -1, damage: 1, spawnTime: 0 });
    expect(third).toBeNull();
  });

  it('no allocations during simulated fire loop', () => {
    const pool = new ProjectilePool(12);
    const active: PlayerProjectile[] = [];
    const initialAvailable = pool.availableCount;

    for (let i = 0; i < 20; i++) {
      const p = pool.get({
        x: 100,
        y: 200,
        vx: 0,
        vy: -240,
        damage: 5,
        spawnTime: i * 0.15,
      });
      if (p) active.push(p);
      if (i >= 5) {
        pool.return(active.shift()!);
      }
    }

    expect(pool.size).toBe(12);
    expect(pool.availableCount).toBe(initialAvailable - active.length);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemyProjectilePool } from './enemy-projectile-pool';
import { ENEMY_PROJECTILE_SPEED_PX_S } from '../projectiles/enemy-projectile';

describe('EnemyProjectilePool', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('pre-allocates pool of given size', () => {
    const pool = new EnemyProjectilePool(5);
    expect(pool.size).toBe(5);
    expect(pool.availableCount).toBe(5);
  });

  it('get returns and reuses same objects', () => {
    const pool = new EnemyProjectilePool(3);
    const a = pool.get({
      x: 1,
      y: 2,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const b = pool.get({
      x: 3,
      y: 4,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).not.toBe(b);

    pool.return(a!);
    pool.return(b!);

    const c = pool.get({
      x: 10,
      y: 20,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const d = pool.get({
      x: 30,
      y: 40,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    expect([c, d]).toContain(a);
    expect([c, d]).toContain(b);
    expect(c).not.toBe(d);
    const [first, second] = [c!, d!].sort((p, q) => p.x - q.x);
    expect(first.x).toBe(10);
    expect(first.y).toBe(20);
    expect(first.weaponStrength).toBe(48);
    expect(second.x).toBe(30);
    expect(second.y).toBe(40);
  });

  it('get returns null when exhausted', () => {
    const pool = new EnemyProjectilePool(2);
    pool.get({
      x: 0,
      y: 0,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    pool.get({
      x: 0,
      y: 0,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    const third = pool.get({
      x: 0,
      y: 0,
      vx: 0,
      vy: ENEMY_PROJECTILE_SPEED_PX_S,
      weaponStrength: 48,
      spawnTime: 0,
    });
    expect(third).toBeNull();
  });
});

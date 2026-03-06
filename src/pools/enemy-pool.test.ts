import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemyPool } from './enemy-pool';
import { ScoutEnemy } from '../enemies/scout-enemy';

vi.mock('../assets/asset-loader', () => ({
  loadImage: vi.fn().mockResolvedValue({} as HTMLImageElement),
}));

describe('EnemyPool', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('pre-allocates pool of given size', () => {
    const pool = new EnemyPool(60);
    expect(pool.size).toBe(60);
    expect(pool.availableCount).toBe(60);
  });

  it('get returns Scout reset at (x, y)', async () => {
    const pool = new EnemyPool(5);
    await pool.prewarm();

    const scout = pool.get(100, 200);
    expect(scout).not.toBeNull();
    expect(scout!.x).toBe(100);
    expect(scout!.y).toBe(200);
    expect(scout!.hp).toBe(15);
  });

  it('get returns null when exhausted', async () => {
    const pool = new EnemyPool(2);
    await pool.prewarm();

    pool.get(0, 0);
    pool.get(0, 0);
    const third = pool.get(0, 0);
    expect(third).toBeNull();
  });

  it('return reuses same instances', async () => {
    const pool = new EnemyPool(3);
    await pool.prewarm();

    const a = pool.get(10, 20);
    const b = pool.get(30, 40);
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).not.toBe(b);

    pool.return(a!);
    pool.return(b!);

    const c = pool.get(100, 200);
    const d = pool.get(300, 400);
    expect([c, d]).toContain(a);
    expect([c, d]).toContain(b);
    expect(c).not.toBe(d);
    const [first, second] = [c!, d!].sort((p, q) => p.x - q.x);
    expect(first.x).toBe(100);
    expect(first.y).toBe(200);
    expect(first.hp).toBe(15);
    expect(second.x).toBe(300);
    expect(second.y).toBe(400);
    expect(second.hp).toBe(15);
  });

  it('reset restores HP and position', async () => {
    const pool = new EnemyPool(1);
    await pool.prewarm();

    const scout = pool.get(50, 60)!;
    scout.takeDamage(5);
    expect(scout.hp).toBe(10);

    pool.return(scout);
    const reused = pool.get(100, 120)!;
    expect(reused).toBe(scout);
    expect(reused.hp).toBe(15);
    expect(reused.x).toBe(100);
    expect(reused.y).toBe(120);
  });

  it('no allocations during simulated spawn/death loop', async () => {
    const pool = new EnemyPool(70);
    await pool.prewarm();

    const active: ScoutEnemy[] = [];
    const initialAvailable = pool.availableCount;

    for (let i = 0; i < 80; i++) {
      const scout = pool.get(100 + (i % 10) * 50, 80 + Math.floor(i / 10) * 60);
      if (scout) active.push(scout);
      if (i >= 20) {
        pool.return(active.shift()!);
      }
    }

    expect(pool.size).toBe(70);
    expect(pool.availableCount).toBe(initialAvailable - active.length);
  });
});

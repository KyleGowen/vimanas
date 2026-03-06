import { describe, it, expect, vi } from 'vitest';
import { ScoutEnemy, SCOUT_SIZE } from './scout-enemy';

vi.mock('../assets/asset-loader', () => ({
  loadImage: vi.fn().mockResolvedValue({} as HTMLImageElement),
}));

describe('ScoutEnemy', () => {

  it('constructs with HP 15 and Defense 1 per scout_design_lock', () => {
    const scout = new ScoutEnemy();
    expect(scout.hp).toBe(15);
    expect(scout.defense).toBe(1);
    expect(scout.x).toBe(0);
    expect(scout.y).toBe(0);
  });

  it('SCOUT_SIZE is 62 (48 × 1.3 scale)', () => {
    expect(SCOUT_SIZE).toBe(62);
  });

  it('takeDamage: 3 hits of 5 = dead (Sparrow basic gun)', () => {
    const scout = new ScoutEnemy();
    const weaponStrength = 5; // Sparrow Attack 20 → 5
    expect(scout.takeDamage(weaponStrength)).toBe(false); // 15 - 5 = 10
    expect(scout.takeDamage(weaponStrength)).toBe(false); // 10 - 5 = 5
    expect(scout.takeDamage(weaponStrength)).toBe(true); // 5 - 5 = 0, dead
  });

  it('takeDamage applies actualDamage = Max(0.1, weaponStrength/defense)', () => {
    const scout = new ScoutEnemy();
    scout.takeDamage(5);
    expect(scout.hp).toBe(10); // 5/1 = 5
  });

  it('takeDamage floors at 0.1 for very weak weapons', () => {
    const scout = new ScoutEnemy();
    scout.takeDamage(0.05); // 0.05/1 = 0.05, floored to 0.1
    expect(scout.hp).toBe(14.9);
  });

  it('update moves south (y increases)', () => {
    const scout = new ScoutEnemy();
    scout.y = 100;
    scout.update(0.5); // 0.5 s
    expect(scout.y).toBe(150); // 100 + 100*0.5
  });

  it('load resolves and sets loaded', async () => {
    const scout = new ScoutEnemy();
    await scout.load();
    expect(scout.isLoaded()).toBe(true);
  });

  it('tryFire returns projectile options on first call (cooldown elapsed)', () => {
    const scout = new ScoutEnemy();
    scout.x = 100;
    scout.y = 80;
    const opts = scout.tryFire(0);
    expect(opts).not.toBeNull();
    expect(opts!.weaponStrength).toBe(24); // 48 × 0.5 CEO tuning
    expect(opts!.vy).toBeGreaterThan(0); // south
  });

  it('tryFire returns null when cooldown not elapsed (0.2 < 0.533)', () => {
    const scout = new ScoutEnemy();
    scout.x = 100;
    scout.y = 80;
    scout.tryFire(0);
    const opts = scout.tryFire(0.2); // 0.2 < 0.4 cooldown
    expect(opts).toBeNull();
  });

  it('tryFire returns options after cooldown elapsed', () => {
    const scout = new ScoutEnemy();
    scout.x = 100;
    scout.y = 80;
    scout.tryFire(0);
    const opts = scout.tryFire(0.6); // 0.6 - 0 >= 0.533
    expect(opts).not.toBeNull();
  });

  it('reset restores position and HP for pool reuse', () => {
    const scout = new ScoutEnemy();
    scout.x = 50;
    scout.y = 60;
    scout.takeDamage(5);
    expect(scout.hp).toBe(10);

    scout.reset(100, 200);
    expect(scout.x).toBe(100);
    expect(scout.y).toBe(200);
    expect(scout.hp).toBe(15);
  });
});

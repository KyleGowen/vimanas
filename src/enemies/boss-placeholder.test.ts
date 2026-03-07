import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BossPlaceholder,
  BOSS_WIDTH,
  BOSS_HEIGHT,
} from './boss-placeholder';
import { createMockCanvasContext } from '../test-utils';

describe('BossPlaceholder', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('constructs with full HP', () => {
    const boss = new BossPlaceholder();
    expect(boss.hp).toBe(150);
    expect(boss.defense).toBe(5);
  });

  it('reset sets position and restores HP', () => {
    const boss = new BossPlaceholder();
    boss.hp = 50;
    boss.reset(100, 200);
    expect(boss.x).toBe(100);
    expect(boss.y).toBe(200);
    expect(boss.hp).toBe(150);
  });

  it('tryFire returns projectile options when cooldown elapsed', () => {
    const boss = new BossPlaceholder();
    boss.reset(100, 50);
    const result = boss.tryFire(1, 0);
    expect(result).not.toBeNull();
    expect(result!.x).toBeDefined();
    expect(result!.y).toBeDefined();
    expect(result!.vy).toBeGreaterThan(0);
  });

  it('tryFire returns null when cooldown not elapsed', () => {
    const boss = new BossPlaceholder();
    boss.reset(100, 50);
    boss.tryFire(1, 0);
    const result = boss.tryFire(1.5, 0);
    expect(result).toBeNull();
  });

  it('takeDamage reduces HP and returns true when dead', () => {
    const boss = new BossPlaceholder();
    boss.hp = 1;
    expect(boss.takeDamage(100)).toBe(true);
  });

  it('draw does not throw', () => {
    const boss = new BossPlaceholder();
    boss.reset(100, 50);
    const ctx = createMockCanvasContext();
    expect(() => boss.draw(ctx)).not.toThrow();
  });

  it('BOSS_WIDTH and BOSS_HEIGHT are defined', () => {
    expect(BOSS_WIDTH).toBeGreaterThan(0);
    expect(BOSS_HEIGHT).toBeGreaterThan(0);
  });
});

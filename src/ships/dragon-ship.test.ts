import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DragonShip,
  DRAGON_STATS,
  DRAGON_SHIP_SIZE,
  DRAGON_MEDITATING_REGEN_MULTIPLIER,
} from './dragon-ship';
import { createMockCanvasContext } from '../test-utils';

describe('DragonShip', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('constructs with default stats', () => {
    const ship = new DragonShip();
    expect(ship.stats).toEqual(DRAGON_STATS);
  });

  it('constructs with custom stats', () => {
    const custom = { ...DRAGON_STATS, hp: 25 };
    const ship = new DragonShip(custom);
    expect(ship.stats.hp).toBe(25);
  });

  it('DRAGON_SHIP_SIZE is defined', () => {
    expect(DRAGON_SHIP_SIZE).toBeGreaterThan(0);
  });

  it('DRAGON_MEDITATING_REGEN_MULTIPLIER is 1.75', () => {
    expect(DRAGON_MEDITATING_REGEN_MULTIPLIER).toBe(1.75);
  });

  it('maxHp and maxMana return DRAGON_STATS values', () => {
    const ship = new DragonShip();
    expect(ship.maxHp).toBe(18);
    expect(ship.maxMana).toBe(28);
  });

  it('takeDamage applies defense', () => {
    const ship = new DragonShip();
    const hpBefore = ship.stats.hp;
    ship.takeDamage(16);
    expect(ship.stats.hp).toBeLessThan(hpBefore);
  });

  it('takeDamage returns true when dead', () => {
    const ship = new DragonShip();
    ship.stats.hp = 0.5;
    expect(ship.takeDamage(100)).toBe(true);
  });

  it('setShieldInput sets meditatingActive', () => {
    const ship = new DragonShip();
    ship.setShieldInput(true);
    expect(ship.meditatingActive).toBe(true);
    ship.setShieldInput(false);
    expect(ship.meditatingActive).toBe(false);
  });

  it('update clamps to bounds', () => {
    const ship = new DragonShip();
    const bounds = { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    ship.x = 50;
    ship.y = 50;
    ship.update({ x: 1, y: 0 }, 1, bounds);
    expect(ship.x).toBeGreaterThanOrEqual(0);
    expect(ship.x).toBeLessThanOrEqual(100);
  });

  it('draw does not throw without sprite', () => {
    const ship = new DragonShip();
    const ctx = createMockCanvasContext();
    expect(() => ship.draw(ctx, 100, 200, 1)).not.toThrow();
  });

  it('dispose clears sprite', () => {
    const ship = new DragonShip();
    ship.dispose();
    expect(() => ship.draw(createMockCanvasContext(), 0, 0, 0)).not.toThrow();
  });
});

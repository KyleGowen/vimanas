import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TurtleShip,
  TURTLE_SHIP_SIZE,
  TURTLE_STATS,
  TURTLE_SHIELD_MANA_PER_SECOND,
  TURTLE_SHIELD_DAMAGE_REDUCTION,
  type TurtleShipStats,
} from './turtle-ship';

describe('TurtleShip', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('constructs with default stats', () => {
    const ship = new TurtleShip();
    expect(ship.stats).toEqual(TURTLE_STATS);
  });

  it('constructs with custom stats', () => {
    const custom: TurtleShipStats = {
      ...TURTLE_STATS,
      hp: 20,
      speed: 10,
    };
    const ship = new TurtleShip(custom);
    expect(ship.stats.hp).toBe(20);
    expect(ship.stats.speed).toBe(10);
  });

  it('TURTLE_SHIP_SIZE is 100', () => {
    expect(TURTLE_SHIP_SIZE).toBe(100);
  });

  it('TURTLE_SHIELD_MANA_PER_SECOND is 0.75', () => {
    expect(TURTLE_SHIELD_MANA_PER_SECOND).toBe(0.75);
  });

  it('TURTLE_SHIELD_DAMAGE_REDUCTION is 0.65', () => {
    expect(TURTLE_SHIELD_DAMAGE_REDUCTION).toBe(0.65);
  });

  it('stats match turtle_design_lock', () => {
    expect(TURTLE_STATS.hp).toBe(26);
    expect(TURTLE_STATS.defense).toBe(24);
    expect(TURTLE_STATS.attack).toBe(14);
    expect(TURTLE_STATS.mana).toBe(20);
    expect(TURTLE_STATS.manaRegenRate).toBe(3.2);
    expect(TURTLE_STATS.speed).toBe(16);
  });

  it('takeDamage applies defense and shield reduction', () => {
    const ship = new TurtleShip();
    ship.shieldActive = false;
    const dmgNoShield = ship.stats.hp;
    ship.takeDamage(24);
    expect(ship.stats.hp).toBeLessThan(dmgNoShield);
  });

  it('takeDamage reduces less when shield active', () => {
    const ship = new TurtleShip();
    ship.currentMana = 100;
    ship.setShieldInput(true);
    const hpBefore = ship.stats.hp;
    ship.takeDamage(24);
    const hpAfterShield = ship.stats.hp;
    ship.stats.hp = hpBefore;
    ship.setShieldInput(false);
    ship.takeDamage(24);
    const hpAfterNoShield = ship.stats.hp;
    expect(hpAfterShield).toBeGreaterThan(hpAfterNoShield);
  });

  it('maxHp and maxMana return TURTLE_STATS values', () => {
    const ship = new TurtleShip();
    expect(ship.maxHp).toBe(26);
    expect(ship.maxMana).toBe(20);
  });
});

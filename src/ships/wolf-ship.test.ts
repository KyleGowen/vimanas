import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  WolfShip,
  WOLF_SHIP_SIZE,
  WOLF_STATS,
  WOLF_SHIELD_MANA_PER_SECOND,
  WOLF_SHIELD_DAMAGE_REDUCTION,
  type WolfShipStats,
} from './wolf-ship';

describe('WolfShip', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('constructs with default stats', () => {
    const ship = new WolfShip();
    expect(ship.stats).toEqual(WOLF_STATS);
  });

  it('constructs with custom stats', () => {
    const custom: WolfShipStats = {
      ...WOLF_STATS,
      hp: 25,
      speed: 15,
    };
    const ship = new WolfShip(custom);
    expect(ship.stats.hp).toBe(25);
    expect(ship.stats.speed).toBe(15);
  });

  it('WOLF_SHIP_SIZE is 100', () => {
    expect(WOLF_SHIP_SIZE).toBe(100);
  });

  it('WOLF_SHIELD_MANA_PER_SECOND is 0.8', () => {
    expect(WOLF_SHIELD_MANA_PER_SECOND).toBe(0.8);
  });

  it('WOLF_SHIELD_DAMAGE_REDUCTION is 0.45', () => {
    expect(WOLF_SHIELD_DAMAGE_REDUCTION).toBe(0.45);
  });

  it('stats match wolf_design_lock', () => {
    expect(WOLF_STATS.hp).toBe(20);
    expect(WOLF_STATS.defense).toBe(20);
    expect(WOLF_STATS.attack).toBe(20);
    expect(WOLF_STATS.mana).toBe(20);
    expect(WOLF_STATS.manaRegenRate).toBe(3);
    expect(WOLF_STATS.speed).toBe(20);
  });

  it('takeDamage applies defense and shield reduction', () => {
    const ship = new WolfShip();
    ship.shieldActive = false;
    const dmgNoShield = ship.stats.hp;
    ship.takeDamage(20);
    expect(ship.stats.hp).toBeLessThan(dmgNoShield);
  });

  it('takeDamage reduces less when shield active and attack from front', () => {
    const ship = new WolfShip();
    ship.x = 100;
    ship.y = 100;
    ship.currentMana = 100;
    ship.setShieldInput(true);
    const shipWorldY = 150; // scrollOffset + ship.y + shipSize/2
    const hpBefore = ship.stats.hp;
    ship.takeDamage(20, 150, 50, shipWorldY); // damage source in front (above ship center)
    const hpAfterShield = ship.stats.hp;
    ship.stats.hp = hpBefore;
    ship.setShieldInput(false);
    ship.takeDamage(20);
    const hpAfterNoShield = ship.stats.hp;
    expect(hpAfterShield).toBeGreaterThan(hpAfterNoShield);
  });

  it('maxHp and maxMana return WOLF_STATS values', () => {
    const ship = new WolfShip();
    expect(ship.maxHp).toBe(20);
    expect(ship.maxMana).toBe(20);
  });
});

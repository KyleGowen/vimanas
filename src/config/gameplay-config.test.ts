import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SHIP,
  createDefaultShip,
  getDefaultShipSize,
  getDefaultShipMaxHp,
  getDefaultShipMana,
} from './gameplay-config';
import { WolfShip, WOLF_SHIP_SIZE, WOLF_STATS } from '../ships/wolf-ship';

describe('gameplay-config', () => {
  it('DEFAULT_SHIP is wolf', () => {
    expect(DEFAULT_SHIP).toBe('wolf');
  });

  it('createDefaultShip returns WolfShip when DEFAULT_SHIP is wolf', () => {
    const ship = createDefaultShip();
    expect(ship).toBeInstanceOf(WolfShip);
  });

  it('getDefaultShipSize returns WOLF_SHIP_SIZE when DEFAULT_SHIP is wolf', () => {
    expect(getDefaultShipSize()).toBe(WOLF_SHIP_SIZE);
  });

  it('getDefaultShipMaxHp returns WOLF_STATS.hp when DEFAULT_SHIP is wolf', () => {
    expect(getDefaultShipMaxHp()).toBe(WOLF_STATS.hp);
  });

  it('getDefaultShipMana returns WOLF_STATS.mana when DEFAULT_SHIP is wolf', () => {
    expect(getDefaultShipMana()).toBe(WOLF_STATS.mana);
  });
});

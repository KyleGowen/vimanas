import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SHIP,
  createDefaultShip,
  getDefaultShipSize,
  getDefaultShipMaxHp,
  getDefaultShipMana,
} from './gameplay-config';
import { DragonShip, DRAGON_SHIP_SIZE, DRAGON_STATS } from '../ships/dragon-ship';

describe('gameplay-config', () => {
  it('DEFAULT_SHIP matches config', () => {
    expect(['wolf', 'turtle', 'dragon']).toContain(DEFAULT_SHIP);
  });

  it('createDefaultShip returns correct ship type for DEFAULT_SHIP', () => {
    const ship = createDefaultShip();
    expect(ship).toBeInstanceOf(DragonShip);
  });

  it('getDefaultShipSize returns size for DEFAULT_SHIP', () => {
    expect(getDefaultShipSize()).toBe(DRAGON_SHIP_SIZE);
  });

  it('getDefaultShipMaxHp returns max HP for DEFAULT_SHIP', () => {
    expect(getDefaultShipMaxHp()).toBe(DRAGON_STATS.hp);
  });

  it('getDefaultShipMana returns mana for DEFAULT_SHIP', () => {
    expect(getDefaultShipMana()).toBe(DRAGON_STATS.mana);
  });
});

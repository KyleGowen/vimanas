import { describe, it, expect } from 'vitest';
import {
  createShip,
  getShipSize,
  getShipMaxHp,
  getShipMana,
  isValidShipId,
  type ShipId,
} from './ship-registry';
import { SparrowShip } from '../ships/sparrow-ship';
import { TurtleShip } from '../ships/turtle-ship';
import { WolfShip } from '../ships/wolf-ship';
import { DragonShip } from '../ships/dragon-ship';
import { SPARROW_SHIP_SIZE, SPARROW_STATS } from '../ships/sparrow-ship';
import { TURTLE_SHIP_SIZE, TURTLE_STATS } from '../ships/turtle-ship';
import { WOLF_SHIP_SIZE, WOLF_STATS } from '../ships/wolf-ship';
import { DRAGON_SHIP_SIZE, DRAGON_STATS } from '../ships/dragon-ship';

describe('ship-registry', () => {
  describe('isValidShipId', () => {
    it('returns true for valid ship ids', () => {
      expect(isValidShipId('sparrow')).toBe(true);
      expect(isValidShipId('turtle')).toBe(true);
      expect(isValidShipId('wolf')).toBe(true);
      expect(isValidShipId('dragon')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isValidShipId('invalid')).toBe(false);
      expect(isValidShipId('')).toBe(false);
      expect(isValidShipId(123)).toBe(false);
      expect(isValidShipId(null)).toBe(false);
      expect(isValidShipId(undefined)).toBe(false);
    });
  });

  describe('createShip', () => {
    it('creates SparrowShip for sparrow', () => {
      const ship = createShip('sparrow');
      expect(ship).toBeInstanceOf(SparrowShip);
    });

    it('creates TurtleShip for turtle', () => {
      const ship = createShip('turtle');
      expect(ship).toBeInstanceOf(TurtleShip);
    });

    it('creates WolfShip for wolf', () => {
      const ship = createShip('wolf');
      expect(ship).toBeInstanceOf(WolfShip);
    });

    it('creates DragonShip for dragon', () => {
      const ship = createShip('dragon');
      expect(ship).toBeInstanceOf(DragonShip);
    });

    it('falls back to DragonShip for unknown id', () => {
      const ship = createShip('unknown' as ShipId);
      expect(ship).toBeInstanceOf(DragonShip);
    });
  });

  describe('getShipSize', () => {
    it('returns correct size for each ship', () => {
      expect(getShipSize('sparrow')).toBe(SPARROW_SHIP_SIZE);
      expect(getShipSize('turtle')).toBe(TURTLE_SHIP_SIZE);
      expect(getShipSize('wolf')).toBe(WOLF_SHIP_SIZE);
      expect(getShipSize('dragon')).toBe(DRAGON_SHIP_SIZE);
    });
  });

  describe('getShipMaxHp', () => {
    it('returns correct HP for each ship', () => {
      expect(getShipMaxHp('sparrow')).toBe(SPARROW_STATS.hp);
      expect(getShipMaxHp('turtle')).toBe(TURTLE_STATS.hp);
      expect(getShipMaxHp('wolf')).toBe(WOLF_STATS.hp);
      expect(getShipMaxHp('dragon')).toBe(DRAGON_STATS.hp);
    });
  });

  describe('getShipMana', () => {
    it('returns correct mana for each ship', () => {
      expect(getShipMana('sparrow')).toBe(SPARROW_STATS.mana);
      expect(getShipMana('turtle')).toBe(TURTLE_STATS.mana);
      expect(getShipMana('wolf')).toBe(WOLF_STATS.mana);
      expect(getShipMana('dragon')).toBe(DRAGON_STATS.mana);
    });
  });
});

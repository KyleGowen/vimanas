/**
 * Ship registry: factory and stats for all playable ships.
 * Used by ship selection (6.S.2) and GameplayScene.
 */
import { SparrowShip, SPARROW_SHIP_SIZE, SPARROW_STATS } from '../ships/sparrow-ship';
import { TurtleShip, TURTLE_SHIP_SIZE, TURTLE_STATS } from '../ships/turtle-ship';
import { WolfShip, WOLF_SHIP_SIZE, WOLF_STATS } from '../ships/wolf-ship';
import { DragonShip, DRAGON_SHIP_SIZE, DRAGON_STATS } from '../ships/dragon-ship';

export type ShipId = 'sparrow' | 'turtle' | 'wolf' | 'dragon';

const VALID_SHIP_IDS: readonly ShipId[] = ['sparrow', 'turtle', 'wolf', 'dragon'];

export function isValidShipId(id: unknown): id is ShipId {
  return typeof id === 'string' && (VALID_SHIP_IDS as readonly string[]).includes(id);
}

export type PlayerShip = SparrowShip | TurtleShip | WolfShip | DragonShip;

/** Create a ship instance by id. */
export function createShip(id: ShipId): PlayerShip {
  switch (id) {
    case 'sparrow':
      return new SparrowShip();
    case 'turtle':
      return new TurtleShip();
    case 'wolf':
      return new WolfShip();
    case 'dragon':
      return new DragonShip();
    default:
      return new DragonShip();
  }
}

/** Get ship size in pixels for the given ship type. */
export function getShipSize(id: ShipId): number {
  switch (id) {
    case 'sparrow':
      return SPARROW_SHIP_SIZE;
    case 'turtle':
      return TURTLE_SHIP_SIZE;
    case 'wolf':
      return WOLF_SHIP_SIZE;
    case 'dragon':
      return DRAGON_SHIP_SIZE;
    default:
      return DRAGON_SHIP_SIZE;
  }
}

/** Get initial HP for the given ship type. */
export function getShipMaxHp(id: ShipId): number {
  switch (id) {
    case 'sparrow':
      return SPARROW_STATS.hp;
    case 'turtle':
      return TURTLE_STATS.hp;
    case 'wolf':
      return WOLF_STATS.hp;
    case 'dragon':
      return DRAGON_STATS.hp;
    default:
      return DRAGON_STATS.hp;
  }
}

/** Get initial mana for the given ship type. */
export function getShipMana(id: ShipId): number {
  switch (id) {
    case 'sparrow':
      return SPARROW_STATS.mana;
    case 'turtle':
      return TURTLE_STATS.mana;
    case 'wolf':
      return WOLF_STATS.mana;
    case 'dragon':
      return DRAGON_STATS.mana;
    default:
      return DRAGON_STATS.mana;
  }
}

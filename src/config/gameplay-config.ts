import { WolfShip, WOLF_SHIP_SIZE, WOLF_STATS } from '../ships/wolf-ship';
import { TurtleShip, TURTLE_SHIP_SIZE, TURTLE_STATS } from '../ships/turtle-ship';
import { DragonShip, DRAGON_SHIP_SIZE, DRAGON_STATS } from '../ships/dragon-ship';

/**
 * Gameplay configuration. Change DEFAULT_SHIP to switch which ship loads in Gameplay.
 * Used until ship selection (6.S.2) is implemented.
 */
export type DefaultShipId = 'wolf' | 'turtle' | 'dragon';

/** Default ship for Gameplay scene. Change this to test different ships. */
export const DEFAULT_SHIP: DefaultShipId = 'dragon';

export type DefaultShip = WolfShip | TurtleShip | DragonShip;

/** Create the default ship based on gameplay config. */
export function createDefaultShip(): DefaultShip {
  switch (DEFAULT_SHIP) {
    case 'wolf':
      return new WolfShip();
    case 'turtle':
      return new TurtleShip();
    case 'dragon':
      return new DragonShip();
    default:
      return new WolfShip();
  }
}

/** Get ship size in pixels for the default ship type. */
export function getDefaultShipSize(): number {
  if (DEFAULT_SHIP === 'wolf') return WOLF_SHIP_SIZE;
  if (DEFAULT_SHIP === 'dragon') return DRAGON_SHIP_SIZE;
  return TURTLE_SHIP_SIZE;
}

/** Get initial HP for the default ship type (for enter() reset). */
export function getDefaultShipMaxHp(): number {
  if (DEFAULT_SHIP === 'wolf') return WOLF_STATS.hp;
  if (DEFAULT_SHIP === 'dragon') return DRAGON_STATS.hp;
  return TURTLE_STATS.hp;
}

/** Get initial mana for the default ship type (for enter() reset). */
export function getDefaultShipMana(): number {
  if (DEFAULT_SHIP === 'wolf') return WOLF_STATS.mana;
  if (DEFAULT_SHIP === 'dragon') return DRAGON_STATS.mana;
  return TURTLE_STATS.mana;
}

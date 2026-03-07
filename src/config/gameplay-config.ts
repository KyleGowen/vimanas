import { WolfShip, WOLF_SHIP_SIZE, WOLF_STATS } from '../ships/wolf-ship';
import { TurtleShip, TURTLE_SHIP_SIZE, TURTLE_STATS } from '../ships/turtle-ship';

/**
 * Gameplay configuration. Change DEFAULT_SHIP to switch which ship loads in Gameplay.
 * Used until ship selection (6.S.2) is implemented.
 */
export type DefaultShipId = 'wolf' | 'turtle';

/** Default ship for Gameplay scene. Change this to test different ships. */
export const DEFAULT_SHIP: DefaultShipId = 'wolf';

export type DefaultShip = WolfShip | TurtleShip;

/** Create the default ship based on gameplay config. */
export function createDefaultShip(): DefaultShip {
  switch (DEFAULT_SHIP) {
    case 'wolf':
      return new WolfShip();
    case 'turtle':
      return new TurtleShip();
    default:
      return new WolfShip();
  }
}

/** Get ship size in pixels for the default ship type. */
export function getDefaultShipSize(): number {
  return DEFAULT_SHIP === 'wolf' ? WOLF_SHIP_SIZE : TURTLE_SHIP_SIZE;
}

/** Get initial HP for the default ship type (for enter() reset). */
export function getDefaultShipMaxHp(): number {
  return DEFAULT_SHIP === 'wolf' ? WOLF_STATS.hp : TURTLE_STATS.hp;
}

/** Get initial mana for the default ship type (for enter() reset). */
export function getDefaultShipMana(): number {
  return DEFAULT_SHIP === 'wolf' ? WOLF_STATS.mana : TURTLE_STATS.mana;
}

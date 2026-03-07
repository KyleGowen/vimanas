import {
  createShip,
  getShipSize,
  getShipMaxHp,
  getShipMana,
  type ShipId,
  type PlayerShip,
} from './ship-registry';

/**
 * Gameplay configuration. Change DEFAULT_SHIP to switch which ship loads when no shipId in scene state.
 * Used for retry/fallback until ship selection (6.S.2) UI is complete.
 */
export type DefaultShipId = ShipId;

/** Default ship for Gameplay scene fallback (retry, etc.). */
export const DEFAULT_SHIP: DefaultShipId = 'dragon';

export type DefaultShip = PlayerShip;

/** Create the default ship based on gameplay config. */
export function createDefaultShip(): DefaultShip {
  return createShip(DEFAULT_SHIP);
}

/** Get ship size in pixels for the default ship type. */
export function getDefaultShipSize(): number {
  return getShipSize(DEFAULT_SHIP);
}

/** Get initial HP for the default ship type (for enter() reset). */
export function getDefaultShipMaxHp(): number {
  return getShipMaxHp(DEFAULT_SHIP);
}

/** Get initial mana for the default ship type (for enter() reset). */
export function getDefaultShipMana(): number {
  return getShipMana(DEFAULT_SHIP);
}

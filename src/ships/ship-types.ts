import type { ShipMovementConfig } from './ship-movement';

/** Bounds for ship movement (play area). Used by all ship update() methods. */
export interface PlayAreaBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Base stats shared by all ships. Extends movement config with combat stats. */
export interface ShipStatsBase extends ShipMovementConfig {
  hp: number;
  defense: number;
  attack: number;
  mana: number;
  manaRegenRate: number;
}

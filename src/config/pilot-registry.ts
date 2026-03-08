/**
 * Pilot registry: PilotId type and modifier application for ship–pilot combos.
 * Per pilot_ship_pairing_design.md and pilot_ship_stat_design_lock.md.
 */
import type { ShipStatsBase } from '../ships/ship-types';

export type PilotId = 'speed' | 'weapon' | 'defensive' | 'rookie';

const VALID_PILOT_IDS: readonly PilotId[] = ['speed', 'weapon', 'defensive', 'rookie'];

export function isValidPilotId(id: unknown): id is PilotId {
  return typeof id === 'string' && (VALID_PILOT_IDS as readonly string[]).includes(id);
}

export const DEFAULT_PILOT: PilotId = 'rookie';

/**
 * Apply pilot modifiers to ship stats. Per pilot_ship_pairing_design.md:
 * - Speed: speed↑, defense↓
 * - Weapon: attack↑ (fire speed via weapon modules; attack boost for now)
 * - Defensive: hp↑, defense↑, speed↓
 * - Rookie: no modifiers
 */
export function applyPilotModifiers(stats: ShipStatsBase, pilotId: PilotId): void {
  switch (pilotId) {
    case 'speed': {
      const mult = 1.15;
      stats.speed *= mult;
      if (stats.forwardSpeed != null) stats.forwardSpeed *= mult;
      if (stats.backwardSpeed != null) stats.backwardSpeed *= mult;
      if (stats.leftSpeed != null) stats.leftSpeed *= mult;
      if (stats.rightSpeed != null) stats.rightSpeed *= mult;
      stats.defense *= 0.85;
      break;
    }
    case 'weapon':
      stats.attack *= 1.2;
      break;
    case 'defensive': {
      stats.hp *= 1.15;
      stats.defense *= 1.15;
      const mult = 0.9;
      stats.speed *= mult;
      if (stats.forwardSpeed != null) stats.forwardSpeed *= mult;
      if (stats.backwardSpeed != null) stats.backwardSpeed *= mult;
      if (stats.leftSpeed != null) stats.leftSpeed *= mult;
      if (stats.rightSpeed != null) stats.rightSpeed *= mult;
      break;
    }
    case 'rookie':
      break;
  }
}

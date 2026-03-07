import { weaponStrength } from './weapon-strength';

/** Mana consumed per second while beam is held (sustained beam) */
export const WOLF_SECONDARY_MANA_PER_SECOND = 5;

/** Damage per second to enemies in beam (weaponStrength = 5 for Wolf Attack 20) */
export function wolfSecondaryDamagePerSecond(attack: number): number {
  return weaponStrength(attack);
}

export interface WolfSecondaryMuzzleOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
}

/** Center nose muzzle position for Wolf sustained beam */
export function getWolfSecondaryMuzzle(options: WolfSecondaryMuzzleOptions): {
  x: number;
  y: number;
} {
  return {
    x: options.shipX + options.shipSize / 2,
    y: options.shipY,
  };
}

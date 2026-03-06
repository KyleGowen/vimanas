import type { EnergyRingProjectileOptions } from '../projectiles/energy-ring-projectile';
import { ENERGY_RING_SPEED_PX_S } from '../projectiles/energy-ring-projectile';
import { weaponStrength } from './weapon-strength';

/** Mana cost per ring */
export const SPARROW_SECONDARY_MANA_COST = 1;

/** Fire rate: 0.12 s cooldown per ring (held fire produces stream) */
export const SPARROW_SECONDARY_FIRE_RATE_S = 0.12;

/** North = up. vy negative for up. All rings travel straight. */
const NORTH_VY = -ENERGY_RING_SPEED_PX_S;

export interface SparrowSecondaryFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

/**
 * Compute energy ring spawn options for Sparrow secondary. Spawn at muzzle (ship center-top).
 * All rings travel straight north; no cone spread.
 */
export function fireSparrowSecondary(
  options: SparrowSecondaryFireOptions
): EnergyRingProjectileOptions {
  const muzzleX = options.shipX + options.shipSize / 2;
  const muzzleY = options.shipY;
  const damage = weaponStrength(options.attack);

  return {
    x: muzzleX,
    y: muzzleY,
    vx: 0,
    vy: NORTH_VY,
    damage,
    spawnTime: options.spawnTime,
  };
}

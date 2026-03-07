import type { PlayerProjectileOptions } from '../projectiles/player-projectile';
import { WOLF_SECONDARY_BEAM_PALETTE } from '../effects/projectile-beam-effect';
import { weaponStrength } from './weapon-strength';

/** White/silver palette for Wolf primary projectiles */
const WOLF_PRIMARY_BEAM_CONFIG = {
  palette: WOLF_SECONDARY_BEAM_PALETTE,
  length: 24,
  width: 6,
};

/** Fire rate: 0.15 s cooldown per wolf_primary_weapon_design_lock */
export const WOLF_PRIMARY_FIRE_RATE_S = 0.15;

/** Projectile speed: 240 px/s */
export const WOLF_PRIMARY_PROJECTILE_SPEED_PX_S = 240;

/** Projectile lifetime: 3 s */
export const WOLF_PRIMARY_PROJECTILE_LIFETIME_S = 3;

/** North = up. vy negative for up. */
const NORTH_VY = -WOLF_PRIMARY_PROJECTILE_SPEED_PX_S;
const NORTH_VX = 0;

export interface WolfPrimaryFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

/**
 * Compute two projectile spawn options for Wolf primary. Dual wing-tip muzzles.
 * Returns [left, right] projectiles. Both travel north.
 */
export function fireWolfPrimary(
  options: WolfPrimaryFireOptions
): [PlayerProjectileOptions, PlayerProjectileOptions] {
  const damage = weaponStrength(options.attack);
  const leftMuzzleX = options.shipX + options.shipSize * 0.25;
  const rightMuzzleX = options.shipX + options.shipSize * 0.75;
  const muzzleY = options.shipY + options.shipSize * 0.15;

  return [
    {
      x: leftMuzzleX,
      y: muzzleY,
      vx: NORTH_VX,
      vy: NORTH_VY,
      damage,
      spawnTime: options.spawnTime,
      beamConfig: WOLF_PRIMARY_BEAM_CONFIG,
    },
    {
      x: rightMuzzleX,
      y: muzzleY,
      vx: NORTH_VX,
      vy: NORTH_VY,
      damage,
      spawnTime: options.spawnTime,
      beamConfig: WOLF_PRIMARY_BEAM_CONFIG,
    },
  ];
}

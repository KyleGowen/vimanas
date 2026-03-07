import type { PlayerProjectileOptions } from '../projectiles/player-projectile';
import { WOLF_SECONDARY_BEAM_PALETTE } from '../effects/projectile-beam-effect';
import { weaponStrength } from './weapon-strength';
import { getWingTipMuzzlePositions, type PrimaryWeaponOptions } from './weapon-options';

/** White/silver palette for Wolf primary projectiles */
const WOLF_PRIMARY_BEAM_CONFIG = {
  palette: WOLF_SECONDARY_BEAM_PALETTE,
  length: 45,
  width: 4.8,
};

/** Fire rate: 0.3 s cooldown (half rate) */
export const WOLF_PRIMARY_FIRE_RATE_S = 0.3;

/** Projectile speed: 240 px/s */
export const WOLF_PRIMARY_PROJECTILE_SPEED_PX_S = 240;

/** Projectile lifetime: 3 s */
export const WOLF_PRIMARY_PROJECTILE_LIFETIME_S = 3;

/** North = up. vy negative for up. */
const NORTH_VY = -WOLF_PRIMARY_PROJECTILE_SPEED_PX_S;
const NORTH_VX = 0;

/**
 * Compute two projectile spawn options for Wolf primary. Dual wing-tip muzzles.
 * Returns [left, right] projectiles. Both travel north.
 */
export function fireWolfPrimary(
  options: PrimaryWeaponOptions
): [PlayerProjectileOptions, PlayerProjectileOptions] {
  const damage = weaponStrength(options.attack) * 0.5;
  const { leftX: leftMuzzleX, rightX: rightMuzzleX, y: muzzleY } = getWingTipMuzzlePositions(options);

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

import type { HomingCrescentOptions } from '../projectiles/homing-crescent-projectile';
import { HOMING_CRESCENT_SPEED_PX_S } from '../projectiles/homing-crescent-projectile';
import { weaponStrength } from './weapon-strength';
import type { PrimaryWeaponOptions } from './weapon-options';
import { getWingTipMuzzlePositions } from './weapon-options';

/** Fire rate: 0.35 s cooldown per dragon_primary_weapon_design_lock */
export const DRAGON_PRIMARY_FIRE_RATE_S = 0.35;

/** Mana cost per fire */
export const DRAGON_PRIMARY_MANA_COST = 3;

/** Damage multiplier vs weaponStrength (0.6×) */
export const DRAGON_PRIMARY_DAMAGE_MULTIPLIER = 0.6;

/** North = up. vy negative for up. */
const NORTH_VY = -HOMING_CRESCENT_SPEED_PX_S;
const NORTH_VX = 0;

/**
 * Compute two homing crescent spawn options for Dragon primary. Dual wing-tip muzzles.
 * Returns [left, right] projectiles. Both start north; homing steers toward nearest enemy.
 */
export function fireDragonPrimary(
  options: PrimaryWeaponOptions
): [HomingCrescentOptions, HomingCrescentOptions] {
  const damage = weaponStrength(options.attack) * DRAGON_PRIMARY_DAMAGE_MULTIPLIER;
  const { leftX: leftMuzzleX, rightX: rightMuzzleX, y: muzzleY } = getWingTipMuzzlePositions(options);

  return [
    {
      x: leftMuzzleX,
      y: muzzleY,
      vx: NORTH_VX,
      vy: NORTH_VY,
      damage,
      spawnTime: options.spawnTime,
    },
    {
      x: rightMuzzleX,
      y: muzzleY,
      vx: NORTH_VX,
      vy: NORTH_VY,
      damage,
      spawnTime: options.spawnTime,
    },
  ];
}

import type { ArcShotOptions } from '../arc-shot/arc-shot';
import { weaponStrength } from './weapon-strength';
import type { PrimaryWeaponOptions } from './weapon-options';

/** Fire rate: 0.4 s cooldown per turtle_primary_weapon_design_lock */
export const TURTLE_PRIMARY_FIRE_RATE_S = 0.4;

/** Damage modifier: +15% for heavy feel */
export const TURTLE_PRIMARY_DAMAGE_MULTIPLIER = 1.15;

/**
 * Compute arc shot spawn options for Turtle primary. Spawn at muzzle (ship center-top).
 * Arc is curved beam in front of ship; does not travel.
 */
export function fireTurtlePrimary(
  options: PrimaryWeaponOptions
): ArcShotOptions {
  const muzzleX = options.shipX + options.shipSize / 2;
  const muzzleY = options.shipY;
  const baseDamage = weaponStrength(options.attack);
  const damage = Math.round(baseDamage * TURTLE_PRIMARY_DAMAGE_MULTIPLIER);

  return {
    x: muzzleX,
    y: muzzleY,
    damage,
    spawnTime: options.spawnTime,
  };
}

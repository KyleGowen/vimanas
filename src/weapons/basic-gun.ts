import { PlayerProjectile, PROJECTILE_SPEED_PX_S } from '../projectiles/player-projectile';
import { weaponStrength } from './weapon-strength';

/** Fire rate: 0.15 s cooldown per basic_gun_design_lock */
export const BASIC_GUN_FIRE_RATE_S = 0.15;

/** North = up. vy negative for up. */
const NORTH_VY = -PROJECTILE_SPEED_PX_S;
const NORTH_VX = 0;

export interface BasicGunFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

/**
 * Fire a single projectile from BasicGun. Spawn at muzzle (ship center-top for north-facing).
 */
export function fireBasicGun(options: BasicGunFireOptions): PlayerProjectile {
  const muzzleX = options.shipX + options.shipSize / 2;
  const muzzleY = options.shipY;
  const damage = weaponStrength(options.attack);

  return new PlayerProjectile({
    x: muzzleX,
    y: muzzleY,
    vx: NORTH_VX,
    vy: NORTH_VY,
    damage,
    spawnTime: options.spawnTime,
  });
}

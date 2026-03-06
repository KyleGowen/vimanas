import {
  type EnemyProjectileOptions,
  ENEMY_PROJECTILE_SPEED_PX_S,
} from '../projectiles/enemy-projectile';
import { weaponStrength } from './weapon-strength';

/** Scout fire rate: 0.533 s cooldown (CEO: slowed by 1/3 from 0.4 s) */
export const SCOUT_FIRE_RATE_S = 0.4 * (4 / 3);

/** Scout Attack per scout_design_lock, enemy_projectile_design_lock */
export const SCOUT_ATTACK = 192;

/** South = down. vy positive for down (toward player). */
const SOUTH_VY = ENEMY_PROJECTILE_SPEED_PX_S;
const SOUTH_VX = 0;

export interface ScoutWeaponFireOptions {
  scoutX: number;
  scoutY: number;
  scoutSize: number;
  attack: number;
  spawnTime: number;
}

/** CEO: half Scout shot power (was 4 hits to down Sparrow, now 8) */
const SCOUT_DAMAGE_MULTIPLIER = 0.5;

/**
 * Compute projectile spawn options for Scout weapon. Spawn at Scout center-front (south-facing).
 * Use with EnemyProjectilePool.get() for zero-allocation firing.
 */
export function fireScoutWeapon(options: ScoutWeaponFireOptions): EnemyProjectileOptions {
  const muzzleX = options.scoutX + options.scoutSize / 2;
  const muzzleY = options.scoutY + options.scoutSize; // bottom of scout (south)
  const ws = weaponStrength(options.attack) * SCOUT_DAMAGE_MULTIPLIER;

  return {
    x: muzzleX,
    y: muzzleY,
    vx: SOUTH_VX,
    vy: SOUTH_VY,
    weaponStrength: ws,
    spawnTime: options.spawnTime,
  };
}

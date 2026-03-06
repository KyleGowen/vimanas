import {
  type EnemyProjectileOptions,
  ENEMY_PROJECTILE_SPEED_PX_S,
} from '../projectiles/enemy-projectile';
import { weaponStrength } from './weapon-strength';

/** Boss fire rate: 1.0 s cooldown per boss_placeholder_spec.md */
export const BOSS_FIRE_RATE_S = 1.0;

/** Boss Attack per boss_placeholder_spec.md — 5 dmg/hit vs Sparrow Def 12 */
export const BOSS_ATTACK = 240;

/** South = down. vy positive for down (toward player). */
const SOUTH_VY = ENEMY_PROJECTILE_SPEED_PX_S;
const SOUTH_VX = 0;

export interface BossWeaponFireOptions {
  bossX: number;
  bossY: number;
  bossWidth: number;
  bossHeight: number;
  attack: number;
  spawnTime: number;
  scrollOffset: number;
}

/**
 * Compute projectile spawn options for Boss weapon. Spawn at boss center-bottom (south-facing).
 * Uses world Y for consistency with EnemyProjectile and player collision.
 */
export function fireBossWeapon(options: BossWeaponFireOptions): EnemyProjectileOptions {
  const muzzleX = options.bossX + options.bossWidth / 2;
  const muzzleWorldY = options.scrollOffset + options.bossY + options.bossHeight;
  const ws = weaponStrength(options.attack);

  return {
    x: muzzleX,
    y: muzzleWorldY,
    vx: SOUTH_VX,
    vy: SOUTH_VY,
    weaponStrength: ws,
    spawnTime: options.spawnTime,
  };
}

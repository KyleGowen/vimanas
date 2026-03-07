import type { PlayerProjectileOptions } from '../projectiles/player-projectile';
import { WOLF_SECONDARY_BEAM_CONFIG } from '../effects/projectile-beam-effect';
import { weaponStrength } from './weapon-strength';

/** Mana cost per beam per wolf_secondary_weapon_design_lock */
export const WOLF_SECONDARY_MANA_COST = 3;

/** Cooldown: 0.9 s between uses */
export const WOLF_SECONDARY_COOLDOWN_S = 0.9;

/** Projectile speed: 280 px/s */
export const WOLF_SECONDARY_PROJECTILE_SPEED_PX_S = 280;

/** Projectile lifetime: 1.8 s */
export const WOLF_SECONDARY_PROJECTILE_LIFETIME_S = 1.8;

/** North = up. vy negative for up. */
const NORTH_VY = -WOLF_SECONDARY_PROJECTILE_SPEED_PX_S;
const NORTH_VX = 0;

export interface WolfSecondaryFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

/**
 * Compute beam projectile spawn options for Wolf secondary. Center nose muzzle.
 * Single beam, white/silver palette, WOLF_SECONDARY_BEAM_CONFIG.
 */
export function fireWolfSecondary(
  options: WolfSecondaryFireOptions
): PlayerProjectileOptions {
  const muzzleX = options.shipX + options.shipSize / 2;
  const muzzleY = options.shipY;
  const damage = weaponStrength(options.attack);

  return {
    x: muzzleX,
    y: muzzleY,
    vx: NORTH_VX,
    vy: NORTH_VY,
    damage,
    spawnTime: options.spawnTime,
    beamConfig: WOLF_SECONDARY_BEAM_CONFIG,
    lifetimeS: WOLF_SECONDARY_PROJECTILE_LIFETIME_S,
  };
}

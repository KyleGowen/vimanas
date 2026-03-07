import { weaponStrength } from './weapon-strength';
import { CHARGED_BALL_SPEED_PX_S } from '../projectiles/charged-ball-projectile';
import type { ChargedBallOptions } from '../projectiles/charged-ball-projectile';

/** Mana drain while charging: 4 mana/s per dragon_secondary_weapon_design_lock */
export const DRAGON_SECONDARY_MANA_PER_SECOND = 4;

/** Min charge for valid shot */
export const DRAGON_SECONDARY_MIN_CHARGE_S = 0.2;

/** Radius growth: 8 px per second of charge (reaches 12px in 1s, keeps growing) */
export const DRAGON_SECONDARY_RADIUS_GROWTH_PER_SEC = 8;

/** Charge multiplier for damage: damage = base × (1 + multiplier × chargeDuration) */
export const DRAGON_SECONDARY_CHARGE_DAMAGE_MULTIPLIER = 1.5;

/** Min radius 4 px at min charge */
export const DRAGON_SECONDARY_MIN_RADIUS = 4;

export interface DragonSecondaryFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  chargeDuration: number;
  spawnTime: number;
}

/**
 * Compute charged ball projectile options. Call on release when chargeDuration >= MIN_CHARGE.
 */
export function fireDragonChargedBall(options: DragonSecondaryFireOptions): ChargedBallOptions {
  const baseDamage = weaponStrength(options.attack);
  const damage =
    baseDamage *
    (1 + DRAGON_SECONDARY_CHARGE_DAMAGE_MULTIPLIER * options.chargeDuration);

  const chargeBeyondMin = Math.max(0, options.chargeDuration - DRAGON_SECONDARY_MIN_CHARGE_S);
  const radius =
    DRAGON_SECONDARY_MIN_RADIUS +
    chargeBeyondMin * DRAGON_SECONDARY_RADIUS_GROWTH_PER_SEC;

  const originX = options.shipX + options.shipSize / 2;
  const originY = options.shipY + options.shipSize * 0.05;

  return {
    x: originX,
    y: originY,
    vx: 0,
    vy: -CHARGED_BALL_SPEED_PX_S,
    damage,
    radius,
    spawnTime: options.spawnTime,
  };
}

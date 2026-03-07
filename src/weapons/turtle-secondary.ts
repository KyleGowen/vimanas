import { weaponStrength } from './weapon-strength';

/** Mana cost per turtle_secondary_weapon_design_lock */
export const TURTLE_SECONDARY_MANA_COST = 5;

/** Cooldown in seconds per turtle_secondary_weapon_design_lock */
export const TURTLE_SECONDARY_FIRE_RATE_S = 1.5;

/** Speed 135 px/s (25% slower than design lock 180) */
export const TURTLE_SPREAD_SPEED_PX_S = 135;

/** Damage per projectile: 100% of weaponStrength (doubled from design lock 50%) */
export const TURTLE_SPREAD_DAMAGE_MULTIPLIER = 1;

/** Angles in degrees: 0 (North), 45, 90, 135, 180, 225, 270, 315 */
const SPREAD_ANGLES_DEG = [0, 45, 90, 135, 180, 225, 270, 315];

export interface TurtleSpreadFireOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

export interface TurtleSpreadProjectileOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;
}

/**
 * Compute 8 spread projectile options for Turtle secondary.
 * Origin: ship center. Angles: 0° (North) through 315°.
 * Per turtle_secondary_weapon_design_lock.md.
 */
export function fireTurtleSpread(
  options: TurtleSpreadFireOptions
): TurtleSpreadProjectileOptions[] {
  const baseDamage = weaponStrength(options.attack);
  const damage = Math.round(baseDamage * TURTLE_SPREAD_DAMAGE_MULTIPLIER) + 1;
  const dmg = Math.max(1, damage);
  const originX = options.shipX + options.shipSize / 2;
  const originY = options.shipY + options.shipSize / 2;

  return SPREAD_ANGLES_DEG.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const vx = TURTLE_SPREAD_SPEED_PX_S * Math.sin(rad);
    const vy = -TURTLE_SPREAD_SPEED_PX_S * Math.cos(rad);
    return {
      x: originX,
      y: originY,
      vx,
      vy,
      damage: dmg,
      spawnTime: options.spawnTime,
    };
  });
}

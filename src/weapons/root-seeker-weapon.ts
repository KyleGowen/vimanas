/**
 * Root Seeker boss weapons (8.7).
 * Primary: triangular projectiles from multiple origins/angles (lifesteal on player hit).
 * Secondary: wave of leaves (spread of projectiles, like Turtle primary feel).
 */

import {
  type EnemyProjectileOptions,
  ENEMY_PROJECTILE_SPEED_PX_S,
} from '../projectiles/enemy-projectile';
import { weaponStrength } from './weapon-strength';
import { BOSS_ATTACK } from './boss-weapon';

/** Root Seeker primary fire rate (seconds between volleys). */
export const ROOT_SEEKER_PRIMARY_FIRE_RATE_S = 0.9;

/** Lifesteal HP when a primary projectile hits the player (8.7). */
export const ROOT_SEEKER_LIFESTEAL_HP = 5;

/** Root Seeker secondary (leaf wave) cooldown in seconds (8.7). */
export const ROOT_SEEKER_SECONDARY_COOLDOWN_S = 5;

/** Multiplier for Root Seeker primary damage vs boss-weapon. */
const ROOT_SEEKER_DAMAGE_MULT = 0.7;

const SPEED = ENEMY_PROJECTILE_SPEED_PX_S * 0.9;

/** Source ID for lifesteal: when this projectile hits the player, boss gains 5 HP. */
export const ROOT_SEEKER_PRIMARY_SOURCE_ID = 'root_seeker_primary';

export interface RootSeekerPrimaryOptions {
  bossX: number;
  bossY: number;
  bossWidth: number;
  bossHeight: number;
  scrollOffset: number;
  spawnTime: number;
}

/**
 * Fire a volley of triangular (multi-angle) projectiles from multiple origins on the boss.
 * Origins: center-bottom, left-third, right-third. Angles: south, south-west, south-east, and two in between.
 */
export function fireRootSeekerPrimary(options: RootSeekerPrimaryOptions): EnemyProjectileOptions[] {
  const ws = weaponStrength(BOSS_ATTACK) * ROOT_SEEKER_DAMAGE_MULT;
  const origins = [
    { x: options.bossX + options.bossWidth / 2, y: options.scrollOffset + options.bossY + options.bossHeight },
    { x: options.bossX + options.bossWidth * 0.25, y: options.scrollOffset + options.bossY + options.bossHeight * 0.9 },
    { x: options.bossX + options.bossWidth * 0.75, y: options.scrollOffset + options.bossY + options.bossHeight * 0.9 },
  ];
  /** Angles in radians: 0 = south (vy positive), -0.4 = south-west, 0.4 = south-east, etc. */
  const angles = [0, -0.35, 0.35, -0.2, 0.2];
  const result: EnemyProjectileOptions[] = [];
  for (const origin of origins) {
    for (const angle of angles) {
      const vy = Math.cos(angle) * SPEED;
      const vx = Math.sin(angle) * SPEED;
      result.push({
        x: origin.x,
        y: origin.y,
        vx,
        vy,
        weaponStrength: ws,
        spawnTime: options.spawnTime,
        sourceId: ROOT_SEEKER_PRIMARY_SOURCE_ID,
      });
    }
  }
  return result;
}

export interface RootSeekerSecondaryOptions {
  bossX: number;
  bossY: number;
  bossWidth: number;
  bossHeight: number;
  scrollOffset: number;
  spawnTime: number;
}

/**
 * Fire leaf-wave secondary: spread of projectiles in an arc (wave of leaves feel).
 */
export function fireRootSeekerSecondary(options: RootSeekerSecondaryOptions): EnemyProjectileOptions[] {
  const ws = weaponStrength(BOSS_ATTACK) * 0.5;
  const originY = options.scrollOffset + options.bossY + options.bossHeight;
  const originX = options.bossX + options.bossWidth / 2;
  const angles = [-0.5, -0.25, 0, 0.25, 0.5, -0.35, 0.35];
  return angles.map((angle) => {
    const vy = Math.cos(angle) * SPEED * 0.85;
    const vx = Math.sin(angle) * SPEED * 0.85;
    return {
      x: originX,
      y: originY,
      vx,
      vy,
      weaponStrength: ws,
      spawnTime: options.spawnTime,
    };
  });
}

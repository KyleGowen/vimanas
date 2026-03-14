/**
 * Mini-boss Entity (8.5)
 *
 * Smaller boss variant for mid-level encounters. Per boss_archetype_library.md:
 * - elite_scout: HP ~150
 * - elite_medium: HP ~250
 * - Size: ~150x100 (vs full boss 360x240)
 * - Behavior: stationary for now; strafing in Phase 12
 *
 * Takes damage, fires at player, can be defeated.
 */

import { loadImage } from '../assets/asset-loader';
import { drawRect } from '../render/renderer';
import {
  fireScoutWeapon,
  SCOUT_FIRE_RATE_S,
  SCOUT_ATTACK,
} from '../weapons/scout-weapon';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';

/** Mini-boss size per design: ~150x100 (smaller than boss 360x240) */
export const MINI_BOSS_WIDTH = 150;
export const MINI_BOSS_HEIGHT = 100;

/** Default HP values per archetype (can be overridden by level spec) */
export const MINI_BOSS_HP_ELITE_SCOUT = 150;
export const MINI_BOSS_HP_ELITE_MEDIUM = 250;

/** Mini-boss defense (same as scout; damage formula uses this) */
const MINI_BOSS_DEFENSE = 3;

const SPRITE_PATH_ELITE_SCOUT = '/images/enemies/miniboss_elite_scout.png';
const SPRITE_PATH_ELITE_MEDIUM = '/images/enemies/miniboss_elite_medium.png';
const FALLBACK_COLOR = '#4a3520';

export interface MiniBossOptions {
  hp: number;
  archetypeId: string;
}

/**
 * Mini-boss entity. Similar to BossPlaceholder but smaller.
 * Fires at player using scout weapon pattern. Uses screen coords when spawned.
 */
export class MiniBoss {
  hp: number;
  readonly defense: number;
  readonly attack: number;
  readonly archetypeId: string;
  x: number;
  y: number;
  private lastFireTime = -Infinity;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;
  private readonly maxHp: number;

  constructor(options: MiniBossOptions) {
    this.maxHp = options.hp;
    this.hp = this.maxHp;
    this.defense = MINI_BOSS_DEFENSE;
    this.attack = SCOUT_ATTACK;
    this.archetypeId = options.archetypeId;
    this.x = 0;
    this.y = 0;
  }

  /** Reset for reuse. Sets position and full HP. */
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.lastFireTime = -Infinity;
  }

  /**
   * Try to fire at player. Returns projectile options if cooldown elapsed; otherwise null.
   * Fires from bottom-center of mini-boss (toward player below).
   */
  tryFire(now: number, scrollOffset: number): EnemyProjectileOptions | null {
    if (now - this.lastFireTime < SCOUT_FIRE_RATE_S) return null;
    this.lastFireTime = now;
    return fireScoutWeapon({
      scoutX: this.x,
      scoutY: scrollOffset + this.y,
      scoutSize: MINI_BOSS_WIDTH,
      attack: this.attack,
      spawnTime: now,
    });
  }

  /** Load sprite via asset-loader. Call from scene enter() before spawn. */
  async load(): Promise<void> {
    try {
      const path =
        this.archetypeId === 'elite_medium'
          ? SPRITE_PATH_ELITE_MEDIUM
          : SPRITE_PATH_ELITE_SCOUT;
      this.sprite = await loadImage(path);
      this.loaded = true;
    } catch {
      this.loaded = true;
    }
  }

  /** Whether the sprite has finished loading (success or failure). */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Apply damage per basic_gun_design_lock: actualDamage = Max(0.1, weaponStrength / targetDefense).
   * @param weaponStrength - From projectile
   * @returns true if mini-boss is dead (hp <= 0)
   */
  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.defense);
    this.hp -= actualDamage;
    return this.hp <= 0;
  }

  /**
   * Draw mini-boss. Uses screen coords.
   * Sprite is flipped vertically so mini-boss faces south (toward player).
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite && this.loaded) {
      ctx.save();
      ctx.translate(this.x, this.y + MINI_BOSS_HEIGHT);
      ctx.scale(1, -1);
      ctx.drawImage(this.sprite, 0, 0, MINI_BOSS_WIDTH, MINI_BOSS_HEIGHT);
      ctx.restore();
    } else {
      drawRect(ctx, this.x, this.y, MINI_BOSS_WIDTH, MINI_BOSS_HEIGHT, FALLBACK_COLOR);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}

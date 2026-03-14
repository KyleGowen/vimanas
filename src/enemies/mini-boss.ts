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

/** Mini-boss base size per design: ~150x100 (smaller than boss 360x240) */
export const MINI_BOSS_WIDTH = 150;
export const MINI_BOSS_HEIGHT = 100;

/** enlarged_elite is 2× scale (8.7) */
const ENLARGED_ELITE_SCALE = 2;

/** Default HP values per archetype (can be overridden by level spec) */
export const MINI_BOSS_HP_ELITE_SCOUT = 150;
export const MINI_BOSS_HP_ELITE_MEDIUM = 250;

/** Mini-boss defense (same as scout; damage formula uses this) */
const MINI_BOSS_DEFENSE = 3;

const SPRITE_PATH_ELITE_SCOUT = '/images/enemies/miniboss_elite_scout.png';
const SPRITE_PATH_ELITE_MEDIUM = '/images/enemies/miniboss_elite_medium.png';
const SPRITE_PATH_ENLARGED_ELITE = '/images/enemies/mini_boss_level_1.png';
const FALLBACK_COLOR = '#4a3520';

export interface MiniBossOptions {
  hp: number;
  archetypeId: string;
}

/**
 * Mini-boss entity. Similar to BossPlaceholder but smaller.
 * Fires at player using scout weapon pattern. Uses screen coords when spawned.
 */
/** Speed for enlarged_elite movement (px/s) */
const ENLARGED_ELITE_SPEED = 80;

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
  /** Scale for draw and collision (1 or 2 for enlarged_elite). */
  private readonly scale: number;
  /** Movement direction for enlarged_elite (stays in upper half). */
  private vx = ENLARGED_ELITE_SPEED;
  private vy = ENLARGED_ELITE_SPEED * 0.5;
  /** Spawn time (gameTime) for invulnerability window; set by controller. */
  private spawnTime = -Infinity;

  constructor(options: MiniBossOptions) {
    this.maxHp = options.hp;
    this.hp = this.maxHp;
    this.defense = MINI_BOSS_DEFENSE;
    this.attack = SCOUT_ATTACK;
    this.archetypeId = options.archetypeId;
    this.x = 0;
    this.y = 0;
    this.scale = options.archetypeId === 'enlarged_elite' ? ENLARGED_ELITE_SCALE : 1;
  }

  getWidth(): number {
    return MINI_BOSS_WIDTH * this.scale;
  }

  getHeight(): number {
    return MINI_BOSS_HEIGHT * this.scale;
  }

  /**
   * Update position. For enlarged_elite: move left/right and forward/back, never in lower half of screen.
   */
  update(deltaTime: number, screenWidth: number, screenHeight: number): void {
    if (this.archetypeId !== 'enlarged_elite') return;
    const w = this.getWidth();
    const h = this.getHeight();
    const maxY = Math.max(0, screenHeight / 2 - h);
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    if (this.x <= 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
    }
    if (this.x >= screenWidth - w) {
      this.x = screenWidth - w;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
    }
    if (this.y >= maxY) {
      this.y = maxY;
      this.vy = -Math.abs(this.vy);
    }
  }

  /** Reset for reuse. Sets position and full HP. */
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.lastFireTime = -Infinity;
  }

  /** Set spawn time (gameTime) for invulnerability. Call when spawning. */
  setSpawnTime(gameTime: number): void {
    this.spawnTime = gameTime;
  }

  /** Spawn time for invulnerability check. */
  getSpawnTime(): number {
    return this.spawnTime;
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
      scoutSize: this.getWidth(),
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
          : this.archetypeId === 'enlarged_elite'
            ? SPRITE_PATH_ENLARGED_ELITE
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
   * enlarged_elite draws at 2× scale.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    const w = this.getWidth();
    const h = this.getHeight();
    if (this.sprite && this.loaded) {
      // Use full image dimensions so large assets (e.g. 1536x1024) are drawn entirely, scaled to w×h
      const srcW = this.sprite.naturalWidth || MINI_BOSS_WIDTH;
      const srcH = this.sprite.naturalHeight || MINI_BOSS_HEIGHT;
      ctx.drawImage(this.sprite, 0, 0, srcW, srcH, this.x, this.y, w, h);
    } else {
      drawRect(ctx, this.x, this.y, w, h, FALLBACK_COLOR);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}

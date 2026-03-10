import { loadImage } from '../assets/asset-loader';
import { drawRect } from '../render/renderer';
import {
  fireBossWeapon,
  BOSS_FIRE_RATE_S,
  BOSS_ATTACK,
} from '../weapons/boss-weapon';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';

/** Boss stats per boss_placeholder_spec.md */
const BOSS_HP = 150;
const BOSS_DEFENSE = 5;

/** Placeholder size ~300×200 px per design, +20% on-screen (CEO) */
export const BOSS_WIDTH = Math.round(300 * 1.2);
export const BOSS_HEIGHT = Math.round(200 * 1.2);

const SPRITE_PATH = '/images/enemies/boss_placeholder.png';
const FALLBACK_COLOR = '#3d2914';

/**
 * Boss placeholder. HP 150 (or from level spec), Defense 5. Takes damage per basic_gun_design_lock.
 * Fires at player per boss_placeholder_spec.md. Screen coords (fixed during boss phase).
 * 9.5: boss.hp from level spec overrides default.
 */
export class BossPlaceholder {
  hp: number;
  readonly defense: number;
  readonly attack: number;
  x: number;
  y: number;
  private lastFireTime = -Infinity;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;
  private readonly maxHp: number;

  constructor(options?: { hp?: number }) {
    this.maxHp = options?.hp ?? BOSS_HP;
    this.hp = this.maxHp;
    this.defense = BOSS_DEFENSE;
    this.attack = BOSS_ATTACK;
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
   * Caller spawns projectile via EnemyProjectilePool.get(options).
   */
  tryFire(now: number, scrollOffset: number): EnemyProjectileOptions | null {
    if (now - this.lastFireTime < BOSS_FIRE_RATE_S) return null;
    this.lastFireTime = now;
    return fireBossWeapon({
      bossX: this.x,
      bossY: this.y,
      bossWidth: BOSS_WIDTH,
      bossHeight: BOSS_HEIGHT,
      attack: this.attack,
      spawnTime: now,
      scrollOffset,
    });
  }

  /** Load sprite via asset-loader. Call from scene enter() before boss spawn. */
  async load(): Promise<void> {
    try {
      this.sprite = await loadImage(SPRITE_PATH);
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
   * @param weaponStrength - From projectile (e.g. Sparrow Attack 20 → 5)
   * @returns true if boss is dead (hp <= 0)
   */
  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.defense);
    this.hp -= actualDamage;
    return this.hp <= 0;
  }

  /**
   * Draw boss. Uses screen coords (boss does not scroll).
   * Sprite is flipped vertically so boss faces south (toward player).
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite && this.loaded) {
      ctx.save();
      ctx.translate(this.x, this.y + BOSS_HEIGHT);
      ctx.scale(1, -1);
      ctx.drawImage(this.sprite, 0, 0, BOSS_WIDTH, BOSS_HEIGHT);
      ctx.restore();
    } else {
      drawRect(ctx, this.x, this.y, BOSS_WIDTH, BOSS_HEIGHT, FALLBACK_COLOR);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}

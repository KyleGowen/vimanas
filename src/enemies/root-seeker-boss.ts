/**
 * Root Seeker boss (8.7). Forest boss; uses placeholder sprite until Phase 12.
 * Primary: triangular projectiles from multiple origins/angles; lifesteal +5 HP when primary hits player.
 * Secondary: leaf-wave (spread) at most every 5 s.
 */

import { loadImage } from '../assets/asset-loader';
import { drawRect } from '../render/renderer';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';
import {
  fireRootSeekerPrimary,
  fireRootSeekerSecondary,
  ROOT_SEEKER_PRIMARY_FIRE_RATE_S,
  ROOT_SEEKER_SECONDARY_COOLDOWN_S,
} from '../weapons/root-seeker-weapon';
import { BOSS_WIDTH, BOSS_HEIGHT } from './boss-placeholder';

/** Root Seeker is drawn and collides at 2× boss size. */
const ROOT_SEEKER_SCALE = 2;

const BOSS_HP_DEFAULT = 200;
const BOSS_DEFENSE = 5;
const SPRITE_PATH = '/images/enemies/root_seeker.png';
const FALLBACK_COLOR = '#3d2914';

export interface RootSeekerBossOptions {
  hp?: number;
}

export class RootSeekerBoss {
  hp: number;
  readonly defense: number;
  readonly maxHp: number;
  x: number;
  y: number;
  private lastPrimaryFireTime = -Infinity;
  private lastSecondaryFireTime = -Infinity;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;

  constructor(options?: RootSeekerBossOptions) {
    this.maxHp = options?.hp ?? BOSS_HP_DEFAULT;
    this.hp = this.maxHp;
    this.defense = BOSS_DEFENSE;
    this.x = 0;
    this.y = 0;
  }

  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.lastPrimaryFireTime = -Infinity;
    this.lastSecondaryFireTime = -Infinity;
  }

  getWidth(): number {
    return BOSS_WIDTH * ROOT_SEEKER_SCALE;
  }

  getHeight(): number {
    return BOSS_HEIGHT * ROOT_SEEKER_SCALE;
  }

  /** Lifesteal: add HP when primary projectile hits player (8.7). */
  addHp(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  /**
   * Primary fire: multiple triangular projectiles. Returns array of options (or empty array).
   */
  tryFire(now: number, scrollOffset: number): EnemyProjectileOptions[] | null {
    if (now - this.lastPrimaryFireTime < ROOT_SEEKER_PRIMARY_FIRE_RATE_S) {
      return null;
    }
    this.lastPrimaryFireTime = now;
    return fireRootSeekerPrimary({
      bossX: this.x,
      bossY: this.y,
      bossWidth: this.getWidth(),
      bossHeight: this.getHeight(),
      scrollOffset,
      spawnTime: now,
    });
  }

  /**
   * Secondary fire: leaf wave. At most every 5 s. Returns array or null.
   */
  trySecondaryFire(now: number, scrollOffset: number): EnemyProjectileOptions[] | null {
    if (now - this.lastSecondaryFireTime < ROOT_SEEKER_SECONDARY_COOLDOWN_S) {
      return null;
    }
    this.lastSecondaryFireTime = now;
    return fireRootSeekerSecondary({
      bossX: this.x,
      bossY: this.y,
      bossWidth: this.getWidth(),
      bossHeight: this.getHeight(),
      scrollOffset,
      spawnTime: now,
    });
  }

  async load(): Promise<void> {
    try {
      this.sprite = await loadImage(SPRITE_PATH);
      this.loaded = true;
    } catch {
      this.loaded = true;
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.defense);
    this.hp -= actualDamage;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const w = this.getWidth();
    const h = this.getHeight();
    if (this.sprite && this.loaded) {
      const srcW = this.sprite.naturalWidth || BOSS_WIDTH;
      const srcH = this.sprite.naturalHeight || BOSS_HEIGHT;
      ctx.drawImage(this.sprite, 0, 0, srcW, srcH, this.x, this.y, w, h);
    } else {
      drawRect(ctx, this.x, this.y, w, h, FALLBACK_COLOR);
    }
  }

  dispose(): void {
    this.sprite = null;
  }
}

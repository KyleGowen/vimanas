/**
 * Elite enemy — wave-tier lieutenant. Per forest_level_enemy_design.md.
 * 2–3× Scout scale; more HP; fires at player. Used in waves with scouts (eliteCount in level spec).
 */

import { loadImage } from '../assets/asset-loader';
import { drawImageFit, drawRect } from '../render/renderer';
import {
  fireScoutWeapon,
  SCOUT_FIRE_RATE_S,
  SCOUT_ATTACK,
} from '../weapons/scout-weapon';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';
import { SCOUT_SIZE } from './scout-enemy';

/** Elite HP: ~3× Scout (15 → 45) */
const ELITE_HP = 45;
const ELITE_DEFENSE = 2;

/** Elite size: ~1.5× Scout per forest_level_enemy_design (2–3× range; use 1.5 for wave readability) */
export const ELITE_SIZE = Math.round(SCOUT_SIZE * 1.5);

const SPRITE_PATH = '/images/enemies/elite_scout.png';
const FALLBACK_COLOR = '#6b6b8e';

/** Speed south: slightly slower than Scout (120 px/s) */
const ELITE_SPEED_PX_S = 120;

export class EliteEnemy {
  hp: number;
  readonly defense: number;
  readonly attack: number;
  x: number;
  y: number;
  private lastFireTime = -Infinity;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;

  constructor() {
    this.hp = ELITE_HP;
    this.defense = ELITE_DEFENSE;
    this.attack = SCOUT_ATTACK;
    this.x = 0;
    this.y = 0;
  }

  tryFire(now: number): EnemyProjectileOptions | null {
    if (now - this.lastFireTime < SCOUT_FIRE_RATE_S) return null;
    this.lastFireTime = now;
    return fireScoutWeapon({
      scoutX: this.x,
      scoutY: this.y,
      scoutSize: ELITE_SIZE,
      attack: this.attack,
      spawnTime: now,
    });
  }

  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.hp = ELITE_HP;
    this.lastFireTime = -Infinity;
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

  update(deltaTime: number): void {
    this.y += ELITE_SPEED_PX_S * deltaTime;
  }

  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.defense);
    this.hp -= actualDamage;
    return this.hp <= 0;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    if (this.sprite && this.loaded) {
      drawImageFit(ctx, this.sprite, x, y, ELITE_SIZE, ELITE_SIZE);
    } else {
      drawRect(ctx, x, y, ELITE_SIZE, ELITE_SIZE, FALLBACK_COLOR);
    }
  }

  dispose(): void {
    this.sprite = null;
  }
}

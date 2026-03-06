import { drawRect } from '../render/renderer';

/** Projectile speed: 240 px/s (CEO: doubled from 120 for snappier feel) */
export const PROJECTILE_SPEED_PX_S = 240;

/** Projectile lifetime in seconds (CEO: halved from 3s for snappier feel) */
export const PROJECTILE_LIFETIME_S = 1.5;

/** Projectile size: 10 base, scaled +30% for test. Exported for collision. */
const BASE_SIZE = 10;
const SPRITE_SCALE = 1.3;
export const PROJECTILE_SIZE = Math.round(BASE_SIZE * SPRITE_SCALE);

/** Cyan per art_style_guide, basic_gun_design_lock */
const PROJECTILE_COLOR = '#00FFFF';

export interface PlayerProjectileOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;
}

/**
 * Player projectile. Travels toward facing; despawns after lifetime or off-screen.
 */
export class PlayerProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;

  constructor(options: PlayerProjectileOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Reset projectile for pool reuse. Sets x, y, vx, vy, damage, spawnTime.
   */
  reset(options: PlayerProjectileOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Update position. Returns true if still alive.
   */
  update(deltaTime: number, bounds: { width: number; height: number }): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const age = performance.now() / 1000 - this.spawnTime;
    if (age > PROJECTILE_LIFETIME_S) return false;

    if (this.y < -PROJECTILE_SIZE) return false;
    if (this.y > bounds.height + PROJECTILE_SIZE) return false;
    if (this.x < -PROJECTILE_SIZE) return false;
    if (this.x > bounds.width + PROJECTILE_SIZE) return false;

    return true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawRect(ctx, this.x - PROJECTILE_SIZE / 2, this.y - PROJECTILE_SIZE / 2, PROJECTILE_SIZE, PROJECTILE_SIZE, PROJECTILE_COLOR);
  }
}

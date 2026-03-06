import {
  drawProjectileBeam,
  ENEMY_PROJECTILE_BEAM_CONFIG,
} from '../effects/projectile-beam-effect';
import { drawRect } from '../render/renderer';

/** Enemy projectile speed: 180 px/s per enemy_projectile_design_lock */
export const ENEMY_PROJECTILE_SPEED_PX_S = 180;

/** Enemy projectile lifetime: 2.0 s per enemy_projectile_design_lock */
export const ENEMY_PROJECTILE_LIFETIME_S = 2.0;

/** Projectile size: 10 base, scaled +30% for test. Exported for collision. */
const BASE_SIZE = 10;
const SPRITE_SCALE = 1.3;
export const ENEMY_PROJECTILE_SIZE = Math.round(BASE_SIZE * SPRITE_SCALE);

/** Orange/amber per art_style_guide, enemy_projectile_design_lock */
const PROJECTILE_COLOR = '#FF8C00';

export interface EnemyProjectileOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  weaponStrength: number;
  spawnTime: number;
}

/**
 * Enemy projectile. Travels south toward player; despawns after lifetime or off-screen.
 * weaponStrength used for damage formula: actualDamage = Max(0.1, weaponStrength / playerDefense).
 */
export class EnemyProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  weaponStrength: number;
  spawnTime: number;

  constructor(options: EnemyProjectileOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.weaponStrength = options.weaponStrength;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Reset projectile for pool reuse.
   */
  reset(options: EnemyProjectileOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.weaponStrength = options.weaponStrength;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Update position. Returns true if still alive.
   * Bounds: width/height for visible area. scrollOffset (optional) = world Y at top of viewport. gameTime (optional) for age.
   */
  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number }
  ): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > ENEMY_PROJECTILE_LIFETIME_S) return false;

    const minY = bounds.scrollOffset ?? 0;
    const maxY = minY + bounds.height;

    if (this.y < minY - ENEMY_PROJECTILE_SIZE) return false;
    if (this.y > maxY + ENEMY_PROJECTILE_SIZE) return false;
    if (this.x < -ENEMY_PROJECTILE_SIZE) return false;
    if (this.x > bounds.width + ENEMY_PROJECTILE_SIZE) return false;

    return true;
  }

  /**
   * Draw projectile. If screenX, screenY provided (scene passes screen coords), draw there.
   * When gameTime is provided, draws glowing beam; else fallback to rect for tests.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    if (gameTime !== undefined) {
      drawProjectileBeam(
        ctx,
        x,
        y,
        this.vx,
        this.vy,
        gameTime,
        ENEMY_PROJECTILE_BEAM_CONFIG
      );
    } else {
      drawRect(
        ctx,
        x - ENEMY_PROJECTILE_SIZE / 2,
        y - ENEMY_PROJECTILE_SIZE / 2,
        ENEMY_PROJECTILE_SIZE,
        ENEMY_PROJECTILE_SIZE,
        PROJECTILE_COLOR
      );
    }
  }
}

import {
  drawProjectileBeam,
  PLAYER_PROJECTILE_BEAM_CONFIG,
} from '../effects/projectile-beam-effect';
import { drawRect } from '../render/renderer';

/** Projectile speed: 240 px/s (CEO: doubled from 120 for snappier feel) */
export const PROJECTILE_SPEED_PX_S = 240;

/** Projectile lifetime in seconds (CEO: doubled from 1.5s for 2× range) */
export const PROJECTILE_LIFETIME_S = 3.0;

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
   * bounds must include scrollOffset for world Y, gameTime for age. Despawn when world Y above or below viewport.
   */
  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number }
  ): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > PROJECTILE_LIFETIME_S) return false;

    const scrollOffset = bounds.scrollOffset ?? 0;
    const minY = scrollOffset;
    const maxY = scrollOffset + bounds.height;

    if (this.y < minY - PROJECTILE_SIZE) return false;
    if (this.y > maxY + PROJECTILE_SIZE) return false;
    if (this.x < -PROJECTILE_SIZE) return false;
    if (this.x > bounds.width + PROJECTILE_SIZE) return false;

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
        PLAYER_PROJECTILE_BEAM_CONFIG
      );
    } else {
      drawRect(
        ctx,
        x - PROJECTILE_SIZE / 2,
        y - PROJECTILE_SIZE / 2,
        PROJECTILE_SIZE,
        PROJECTILE_SIZE,
        PROJECTILE_COLOR
      );
    }
  }
}

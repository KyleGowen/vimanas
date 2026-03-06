import { drawEnergyRing, SPARROW_ENERGY_RING_CONFIG } from '../effects/energy-ring-effect';
import { drawRect } from '../render/renderer';

/** Energy ring speed: same as player projectile for consistency */
export const ENERGY_RING_SPEED_PX_S = 240;

/** Energy ring lifetime: 1 s */
export const ENERGY_RING_LIFETIME_S = 1.0;

/** Base radius at spawn (px) */
export const ENERGY_RING_BASE_RADIUS = 16;

/** Radius growth rate (px per second) */
export const ENERGY_RING_GROWTH_RATE = 100;

/** Fallback color for tests */
const FALLBACK_COLOR = '#00FFFF';

export interface EnergyRingProjectileOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;
}

/**
 * Energy ring projectile. Travels forward; radius grows over time.
 * Despawns after lifetime or off-screen.
 */
export class EnergyRingProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;

  constructor(options: EnergyRingProjectileOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Reset for pool reuse.
   */
  reset(options: EnergyRingProjectileOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Current radius based on age. Grows linearly over time.
   */
  getRadius(gameTime: number): number {
    const age = gameTime - this.spawnTime;
    return ENERGY_RING_BASE_RADIUS + ENERGY_RING_GROWTH_RATE * age;
  }

  /**
   * Update position. Returns true if still alive.
   */
  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number }
  ): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > ENERGY_RING_LIFETIME_S) return false;

    const radius = this.getRadius(now);
    const size = radius * 2;
    const scrollOffset = bounds.scrollOffset ?? 0;
    const minY = scrollOffset;
    const maxY = scrollOffset + bounds.height;

    if (this.y < minY - size) return false;
    if (this.y > maxY + size) return false;
    if (this.x < -size) return false;
    if (this.x > bounds.width + size) return false;

    return true;
  }

  /**
   * Draw energy ring. If gameTime provided, draws glowing ring; else fallback rect for tests.
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
      const radius = this.getRadius(gameTime);
      drawEnergyRing(ctx, x, y, radius, gameTime, SPARROW_ENERGY_RING_CONFIG);
    } else {
      const size = 16;
      drawRect(ctx, x - size / 2, y - size / 2, size, size, FALLBACK_COLOR);
    }
  }
}

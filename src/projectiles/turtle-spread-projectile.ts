import { drawRect } from '../render/renderer';

/** Speed 180 px/s per turtle_secondary_weapon_design_lock */
export const TURTLE_SPREAD_SPEED_PX_S = 180;

/** Lifetime 1.5 s per turtle_secondary_weapon_design_lock */
export const TURTLE_SPREAD_LIFETIME_S = 1.5;

/** Size 10-12 px diameter per design lock */
export const TURTLE_SPREAD_PROJECTILE_SIZE = 12;

/** Amber/gold per turtle design lock */
const TURTLE_SPREAD_COLOR = '#FFBF00';

export interface TurtleSpreadProjectileOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;
}

/**
 * Turtle spread projectile. Round, amber; travels in one of 8 directions.
 * Per turtle_secondary_weapon_design_lock.md.
 */
export class TurtleSpreadProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;

  constructor(options: TurtleSpreadProjectileOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  reset(options: TurtleSpreadProjectileOptions): void {
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
  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number }
  ): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > TURTLE_SPREAD_LIFETIME_S) return false;

    const scrollOffset = bounds.scrollOffset ?? 0;
    const minY = scrollOffset;
    const maxY = scrollOffset + bounds.height;
    const s = TURTLE_SPREAD_PROJECTILE_SIZE;

    if (this.y < minY - s) return false;
    if (this.y > maxY + s) return false;
    if (this.x < -s) return false;
    if (this.x > bounds.width + s) return false;

    return true;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number
  ): void {
    const x = (screenX ?? this.x) - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
    const y = (screenY ?? this.y) - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
    drawRect(
      ctx,
      x,
      y,
      TURTLE_SPREAD_PROJECTILE_SIZE,
      TURTLE_SPREAD_PROJECTILE_SIZE,
      TURTLE_SPREAD_COLOR
    );
  }
}

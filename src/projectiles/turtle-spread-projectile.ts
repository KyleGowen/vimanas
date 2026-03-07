import { drawTurtleShieldSphere } from '../effects/turtle-shield-effect';

/** Speed 135 px/s (25% slower than design lock 180) */
export const TURTLE_SPREAD_SPEED_PX_S = 135;

/** Lifetime 1.875 s (25% longer than design lock 1.5) */
export const TURTLE_SPREAD_LIFETIME_S = 1.875;

/** Size 72 px diameter (500% bigger than original 12 px) */
export const TURTLE_SPREAD_PROJECTILE_SIZE = 72;

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
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    const t = gameTime ?? this.spawnTime;
    const age = t - this.spawnTime;
    const radius = TURTLE_SPREAD_PROJECTILE_SIZE / 2;
    drawTurtleShieldSphere(ctx, x, y, radius, t, age, TURTLE_SPREAD_LIFETIME_S);
  }
}

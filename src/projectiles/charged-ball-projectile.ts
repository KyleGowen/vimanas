import { drawDragonChargedBall } from '../effects/dragon-charged-ball-effect';

/** Speed 280 px/s per dragon_secondary_weapon_design_lock */
export const CHARGED_BALL_SPEED_PX_S = 280;

/** Lifetime 2 s */
export const CHARGED_BALL_LIFETIME_S = 2;

export interface ChargedBallOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  spawnTime: number;
}

/**
 * Dragon secondary: charged ball projectile. Size and damage scale with charge.
 */
export class ChargedBallProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  spawnTime: number;

  constructor(options: ChargedBallOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.radius = options.radius;
    this.spawnTime = options.spawnTime;
  }

  reset(options: ChargedBallOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.radius = options.radius;
    this.spawnTime = options.spawnTime;
  }

  /** Collision size (AABB) */
  get size(): number {
    return this.radius * 2;
  }

  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number }
  ): boolean {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > CHARGED_BALL_LIFETIME_S) return false;

    const scrollOffset = bounds.scrollOffset ?? 0;
    const s = this.size;

    if (this.y < scrollOffset - s) return false;
    if (this.y > scrollOffset + bounds.height + s) return false;
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
    drawDragonChargedBall(ctx, x, y, this.radius, t);
  }
}

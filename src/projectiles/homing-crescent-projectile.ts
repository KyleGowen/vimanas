import { drawCrescentBeam } from '../effects/crescent-beam-effect';
import { SCOUT_SIZE } from '../enemies/scout-enemy';
import type { ScoutEnemy } from '../enemies/scout-enemy';
import type { Boss } from '../enemies/boss-factory';

/** Homing crescent size for collision (AABB) */
export const HOMING_CRESCENT_SIZE = 14;

/** Base speed: 420 px/s */
export const HOMING_CRESCENT_SPEED_PX_S = 420;

/** Lifetime: 3 s */
export const HOMING_CRESCENT_LIFETIME_S = 3;

/** Homing strength: rad/s turn rate */
export const HOMING_CRESCENT_STRENGTH = 2.5;

export interface HomingCrescentOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;
}

/**
 * Dragon primary: homing crescent projectile. Steers toward nearest enemy each frame.
 */
export class HomingCrescentProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  spawnTime: number;

  constructor(options: HomingCrescentOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  reset(options: HomingCrescentOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  /**
   * Find nearest enemy (scout or boss) to this projectile.
   */
  private findNearestTarget(
    scouts: ScoutEnemy[],
    boss: Boss | null,
    scrollOffset: number
  ): { tx: number; ty: number } | null {
    let nearest: { tx: number; ty: number; dist: number } | null = null;

    for (const scout of scouts) {
      const cx = scout.x + SCOUT_SIZE / 2;
      const cy = scout.y + SCOUT_SIZE / 2;
      const dx = cx - this.x;
      const dy = cy - this.y;
      const dist = Math.hypot(dx, dy);
      if (nearest === null || dist < nearest.dist) {
        nearest = { tx: cx, ty: cy, dist };
      }
    }

    if (boss) {
      const cx = boss.x + boss.getWidth() / 2;
      const cy = scrollOffset + boss.y + boss.getHeight() / 2;
      const dx = cx - this.x;
      const dy = cy - this.y;
      const dist = Math.hypot(dx, dy);
      if (nearest === null || dist < nearest.dist) {
        nearest = { tx: cx, ty: cy, dist };
      }
    }

    return nearest ? { tx: nearest.tx, ty: nearest.ty } : null;
  }

  /**
   * Update position with homing. Steer velocity toward nearest enemy.
   * Returns true if still alive.
   */
  update(
    deltaTime: number,
    bounds: { width: number; height: number; scrollOffset?: number; gameTime?: number },
    scouts: ScoutEnemy[],
    boss: Boss | null
  ): boolean {
    const scrollOffset = bounds.scrollOffset ?? 0;
    const target = this.findNearestTarget(scouts, boss, scrollOffset);
    if (target) {
      const dx = target.tx - this.x;
      const dy = target.ty - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        const wantVx = (dx / dist) * HOMING_CRESCENT_SPEED_PX_S;
        const wantVy = (dy / dist) * HOMING_CRESCENT_SPEED_PX_S;
        const turn = HOMING_CRESCENT_STRENGTH * deltaTime;
        this.vx += (wantVx - this.vx) * Math.min(1, turn);
        this.vy += (wantVy - this.vy) * Math.min(1, turn);
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > 1e-6) {
          const scale = HOMING_CRESCENT_SPEED_PX_S / speed;
          this.vx *= scale;
          this.vy *= scale;
        }
      }
    }

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    if (age > HOMING_CRESCENT_LIFETIME_S) return false;

    const minY = scrollOffset;
    const maxY = scrollOffset + bounds.height;

    if (this.y < minY - HOMING_CRESCENT_SIZE) return false;
    if (this.y > maxY + HOMING_CRESCENT_SIZE) return false;
    if (this.x < -HOMING_CRESCENT_SIZE) return false;
    if (this.x > bounds.width + HOMING_CRESCENT_SIZE) return false;

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
    drawCrescentBeam(ctx, x, y, this.vx, this.vy, t);
  }
}

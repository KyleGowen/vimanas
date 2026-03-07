/**
 * Arc shot: curved beam that shoots out in front of the ship.
 * Per turtle_primary_weapon_design_lock.md.
 * Does not travel; anchored at spawn. Dissipates over short duration.
 */

import {
  drawArcShot,
  TURTLE_ARC_DRAW_CONFIG,
} from './arc-shot-effect';

/** Arc duration in seconds - dissipates fairly quickly */
export const ARC_SHOT_DURATION_S = 0.3125;

/** Arc length (forward extent) for hit detection */
export const ARC_LENGTH_PX = 160;

/** Arc width (span) for hit detection - wider than ship */
export const ARC_WIDTH_PX = 298;

export interface ArcShotOptions {
  x: number;
  y: number;
  damage: number;
  spawnTime: number;
}

/**
 * Arc shot. Curved beam in front of ship. Static; dissipates over duration.
 * Persists after hitting an enemy so it can hit multiple; each enemy hit only once per arc.
 */
export class ArcShot {
  x: number;
  y: number;
  damage: number;
  spawnTime: number;
  /** Enemies already hit by this arc (reference equality). */
  readonly hitTargets = new Set<object>();

  constructor(options: ArcShotOptions) {
    this.x = options.x;
    this.y = options.y;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
  }

  reset(options: ArcShotOptions): void {
    this.x = options.x;
    this.y = options.y;
    this.damage = options.damage;
    this.spawnTime = options.spawnTime;
    this.hitTargets.clear();
  }

  /**
   * Returns false when arc has dissipated (lifetime exceeded).
   */
  update(
    deltaTime: number,
    bounds: { gameTime?: number }
  ): boolean {
    const now = bounds.gameTime ?? performance.now() / 1000;
    const age = now - this.spawnTime;
    return age <= ARC_SHOT_DURATION_S;
  }

  /**
   * Check if enemy AABB overlaps the arc's hit area.
   * Arc is curved (Bezier from (-w/2,0) via (0,-L) to (w/2,0)); AABB is conservative.
   */
  overlapsRect(rectX: number, rectY: number, rectW: number, rectH: number): boolean {
    const arcMinX = this.x - ARC_WIDTH_PX / 2;
    const arcMaxX = this.x + ARC_WIDTH_PX / 2;
    const arcMinY = this.y - ARC_LENGTH_PX;
    const arcMaxY = this.y;

    return (
      rectX < arcMaxX &&
      rectX + rectW > arcMinX &&
      rectY < arcMaxY &&
      rectY + rectH > arcMinY
    );
  }

  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    const now = gameTime ?? performance.now() / 1000;
    drawArcShot(
      ctx,
      x,
      y,
      now,
      this.spawnTime,
      ARC_SHOT_DURATION_S,
      TURTLE_ARC_DRAW_CONFIG
    );
  }
}

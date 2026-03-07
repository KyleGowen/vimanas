/**
 * Wolf shield: front-half arc only. Per wolf_shield_design_lock.md.
 * Covers -90° to +90° (north-facing semicircle). White/silver palette.
 */

import { THRUSTER_PALETTES } from './thruster-effect';

/** Radius scale: ship half-diagonal × 1.2 (similar to Sparrow glow) */
const RADIUS_SCALE = 1.2;

/** Default radius from ship size. Ship 100×100 → half-diag ~70.7 → radius ~85 */
export function getWolfShieldRadius(shipWidth: number, shipHeight: number): number {
  const halfDiag = Math.hypot(shipWidth, shipHeight) / 2;
  return halfDiag * RADIUS_SCALE;
}

/** Precomputed for WOLF_SHIP_SIZE 100×100 */
export const WOLF_SHIELD_ARC_RADIUS_PX = getWolfShieldRadius(100, 100);

const palette = THRUSTER_PALETTES.wolf;
const PULSE_FREQ = 1.5;

/**
 * Draw Wolf front-half shield zone. Semicircle covering north-facing 180°.
 * ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2) for north-facing.
 * Radial gradient white/silver.
 */
export function drawWolfShieldZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  gameTime: number
): void {
  const cx = x + width / 2;
  const cy = y + height / 2;

  const pulseScale = 0.98 + 0.02 * Math.sin(gameTime * PULSE_FREQ);
  const r = radius * pulseScale;

  ctx.save();

  // Front semicircle: -90° to +90° (top half, north-facing)
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0, palette.core);
  gradient.addColorStop(0.5, palette.mid);
  gradient.addColorStop(1, 'rgba(176, 176, 176, 0)');

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
}

/**
 * Check if an enemy's center is within the Wolf's front shield arc.
 * Used for contact damage (1 dps) when shield is active.
 * @param enemyCenterX - World X of enemy center
 * @param enemyCenterY - World Y of enemy center
 */
export function isEnemyInWolfFrontArc(
  wolfScreenX: number,
  wolfScreenY: number,
  shipSize: number,
  shipWorldY: number,
  enemyCenterX: number,
  enemyCenterY: number
): boolean {
  const wolfCx = wolfScreenX + shipSize / 2;
  const wolfCy = shipWorldY;

  const dx = enemyCenterX - wolfCx;
  const dy = enemyCenterY - wolfCy;
  const dist = Math.hypot(dx, dy);
  if (dist > WOLF_SHIELD_ARC_RADIUS_PX) return false;

  const angle = Math.atan2(dy, dx);
  const frontArcMin = -Math.PI / 2;
  const frontArcMax = Math.PI / 2;
  return angle >= frontArcMin && angle <= frontArcMax;
}

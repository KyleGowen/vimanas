/**
 * Turtle shield: force-field zone. Visible barrier that ships can be inside.
 * Per turtle_shield_design_lock.md. Distinct from Sparrow's personal glow.
 * Uses thruster-like 2D effects: segmented edge band with time-based pulse.
 */

import { THRUSTER_PALETTES } from './thruster-effect';

/** Default radius 165 px — wide enough for 2+ ships per design lock */
export const TURTLE_SHIELD_RADIUS_PX = 165;

/** Amber surface per design lock; matches thruster palette */
const palette = THRUSTER_PALETTES.turtle;
const EDGE_COLOR = '#CC8F00';
const INTERIOR_TINT = 'rgba(255, 191, 0, 0.06)';

/** Pulse frequency — slow, subtle radius breathing */
const PULSE_FREQ = 1.5;
/** Edge segment animation — similar to thruster heightFreq */
const EDGE_FREQ = 8;
/** Number of arc segments around the rim */
const NUM_EDGE_SEGMENTS = 72;
/** Width of the edge band (px) */
const EDGE_BAND_WIDTH = 14;

/**
 * Draw Turtle force-field zone. Circular bubble with hard edge.
 * Single segmented outer ring; ship visible inside.
 * Center at ship center (x + width/2, y + height/2).
 */
export function drawTurtleShieldZone(
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
  const innerR = r - EDGE_BAND_WIDTH;

  ctx.save();

  // 1. Interior tint — very low opacity so ship remains visible
  const interiorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
  interiorGrad.addColorStop(0, INTERIOR_TINT);
  interiorGrad.addColorStop(0.6, 'rgba(255, 191, 0, 0.04)');
  interiorGrad.addColorStop(1, 'rgba(255, 191, 0, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = interiorGrad;
  ctx.fill();

  // 2. Segmented outer ring — thruster-like moving energy (core→mid→tip)
  const segAngle = (2 * Math.PI) / NUM_EDGE_SEGMENTS;
  const edgeGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, r);
  edgeGrad.addColorStop(0, palette.tip);
  edgeGrad.addColorStop(0.5, palette.mid);
  edgeGrad.addColorStop(1, palette.core);
  for (let i = 0; i < NUM_EDGE_SEGMENTS; i++) {
    const segScale = 0.6 + 0.4 * Math.sin(gameTime * EDGE_FREQ + i * 1.2);
    const a0 = i * segAngle;
    const a1 = (i + 1) * segAngle;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.arc(cx, cy, innerR, a1, a0, true);
    ctx.closePath();
    ctx.fillStyle = edgeGrad;
    ctx.globalAlpha = segScale;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 3. Sharp outer stroke — hard edge
  ctx.strokeStyle = EDGE_COLOR;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

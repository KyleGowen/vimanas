import { getShieldPulseScale } from './shield-utils';

/**
 * Turtle shield: force-field zone. Visible barrier that ships can be inside.
 * Per turtle_shield_design_lock.md. Distinct from Sparrow's personal glow.
 * Uses thruster-like 2D effects: segmented edge band with time-based pulse.
 */

import { TURTLE_ARC_PALETTE } from '../arc-shot/arc-shot-effect';
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

  const pulseScale = getShieldPulseScale(gameTime, PULSE_FREQ);
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

/** Scale factor for small spheres (e.g. spread shot) vs full shield */
const SHIELD_BASE_RADIUS = 165;

/**
 * Draw the same force-field effect at arbitrary radius (e.g. spread shot spheres).
 * Segmented outer ring, hard edge, pulse — scaled down from full shield.
 */
export function drawTurtleShieldSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  gameTime: number,
  age: number,
  lifetime: number
): void {
  if (age < 0 || age > lifetime) return;

  const scale = radius / SHIELD_BASE_RADIUS;
  /** Slower fade, less transparent: gentler curve + higher base opacity */
  const baseOpacity = 0.85 + 0.15 * Math.pow(1 - age / lifetime, 0.5);
  /** Spread shot rings: 3x base, +2, 2x, then half */
  const SPHERE_EDGE_MULTIPLIER = 3;
  const edgeBandWidth = ((Math.max(2, EDGE_BAND_WIDTH * scale * SPHERE_EDGE_MULTIPLIER) + 2) * 2) / 2;
  const numSegments = Math.max(12, Math.round(NUM_EDGE_SEGMENTS * scale));
  const segAngle = (2 * Math.PI) / numSegments;
  const pulseScale = 0.98 + 0.02 * Math.sin(gameTime * PULSE_FREQ);
  const r = radius * pulseScale;
  const innerR = Math.max(1, r - edgeBandWidth);

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = baseOpacity;

  // 1. Interior tint
  const innerRingWidth = ((Math.max(1, edgeBandWidth * 0.5) + 2) * 2) / 2;
  const innerRingInner = Math.max(1, innerR - innerRingWidth);
  const interiorGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRingInner);
  interiorGrad.addColorStop(0, INTERIOR_TINT);
  interiorGrad.addColorStop(0.6, 'rgba(255, 191, 0, 0.04)');
  interiorGrad.addColorStop(1, 'rgba(255, 191, 0, 0)');
  ctx.beginPath();
  ctx.arc(0, 0, innerRingInner, 0, Math.PI * 2);
  ctx.fillStyle = interiorGrad;
  ctx.fill();

  // 2. Inner ring — rotates opposite direction
  const innerEdgeGrad = ctx.createRadialGradient(0, 0, innerRingInner, 0, 0, innerR);
  innerEdgeGrad.addColorStop(0, palette.tip);
  innerEdgeGrad.addColorStop(0.5, palette.mid);
  innerEdgeGrad.addColorStop(1, palette.core);
  for (let i = 0; i < numSegments; i++) {
    const segScale = 0.6 + 0.4 * Math.sin(gameTime * -EDGE_FREQ + i * 1.2);
    const a0 = i * segAngle;
    const a1 = (i + 1) * segAngle;
    ctx.beginPath();
    ctx.arc(0, 0, innerR, a0, a1);
    ctx.arc(0, 0, innerRingInner, a1, a0, true);
    ctx.closePath();
    ctx.fillStyle = innerEdgeGrad;
    ctx.globalAlpha = baseOpacity * segScale * 0.8;
    ctx.fill();
  }
  ctx.globalAlpha = baseOpacity;

  // 3. Outer ring — arc-shot style: multi-layer stroked circle, fiery palette, glow
  const arcPalette = TURTLE_ARC_PALETTE;
  const numLayers = 4;
  const pulseFreq = 12;
  const strokeRadius = (r + innerR) / 2;
  const strokeSpan = r - innerR;
  for (let layer = 0; layer < numLayers; layer++) {
    const layerScale = 0.7 + 0.3 * Math.sin(gameTime * pulseFreq + layer * 1.5);
    const widthScale = 0.85 + 0.15 * Math.cos(gameTime * pulseFreq * 0.8 + layer);
    const layerOpacity = baseOpacity * layerScale * (0.5 + 0.5 * (layer / numLayers));
    const layerWidth = (2 + (numLayers - 1 - layer) * 2) * widthScale;

    const gradient = ctx.createRadialGradient(0, 0, innerR, 0, 0, r);
    gradient.addColorStop(0, arcPalette.fade);
    gradient.addColorStop(0.3, arcPalette.edge);
    gradient.addColorStop(0.5, arcPalette.core);
    gradient.addColorStop(0.7, arcPalette.edge);
    gradient.addColorStop(1, arcPalette.fade);

    ctx.globalAlpha = layerOpacity;
    ctx.shadowColor = arcPalette.edge;
    ctx.shadowBlur = 16 + layer * 3;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1.5, layerWidth * (strokeSpan / 10));
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, strokeRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = baseOpacity;

  // 4. Sharp outer stroke (arc palette for consistency)
  ctx.strokeStyle = arcPalette.edge;
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.globalAlpha = 0.85 * baseOpacity;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Wolf shield: front-half arc only. Per wolf_shield_design_lock.md.
 * Covers -90° to +90° (north-facing semicircle). White/silver palette.
 * When sprite is provided, uses Sparrow-style sprite-outline glow with taper.
 */

import { drawImageFit } from '../render/renderer';
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
const OUTLINE_BLUR = 18;
const OPACITY = 1;

/**
 * Draw Wolf front-half shield zone. Semicircle covering north-facing 180°.
 * When sprite is provided: uses shadowBlur to outline the sprite contour (like Sparrow),
 * with a gradient mask that tapers from full at the nose to transparent at the back.
 * When sprite is null: falls back to radial gradient semicircle.
 */
export function drawWolfShieldZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  gameTime: number,
  sprite?: HTMLImageElement | null
): void {
  const cx = x + width / 2;
  const cy = y + height / 2;

  const pulseScale = 0.98 + 0.02 * Math.sin(gameTime * PULSE_FREQ);
  const r = radius * pulseScale;

  ctx.save();

  const startAngle = 0;
  const endAngle = Math.PI;
  const counterclockwise = true;

  if (sprite) {
    // Render to offscreen so gradient mask only affects our glow, not the main canvas.
    const pad = Math.ceil(OUTLINE_BLUR * 1.5);
    const offW = width + pad * 2;
    const offH = height + pad * 2;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = offW;
    offCanvas.height = offH;
    const off = offCanvas.getContext('2d')!;

    const ox = pad;
    const oy = pad;
    const ocx = ox + width / 2;

    const blur = OUTLINE_BLUR * pulseScale;
    off.shadowColor = palette.core;
    off.shadowBlur = blur;
    off.globalAlpha = OPACITY;
    drawImageFit(off, sprite, ox, oy, width, height);

    // Taper inward from halfway down: full at top, fade to transparent at bottom.
    off.shadowBlur = 0;
    off.globalCompositeOperation = 'destination-in';
    const mask = off.createLinearGradient(ocx, oy, ocx, oy + height);
    mask.addColorStop(0, 'rgba(255,255,255,1)');
    mask.addColorStop(0.5, 'rgba(255,255,255,1)');
    mask.addColorStop(0.8, 'rgba(255,255,255,0.3)');
    mask.addColorStop(1, 'rgba(255,255,255,0)');
    off.fillStyle = mask;
    off.fillRect(0, 0, offW, offH);
    off.globalCompositeOperation = 'source-over';

    ctx.drawImage(offCanvas, x - pad, y - pad, offW, offH);
  } else {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, palette.core);
    gradient.addColorStop(0.5, palette.mid);
    gradient.addColorStop(1, 'rgba(176, 176, 176, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

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
  // Front arc: west (π) through north (-π/2) to east (0). Angles in [-π, 0].
  const frontArcMin = -Math.PI;
  const frontArcMax = 0;
  return angle >= frontArcMin && angle <= frontArcMax;
}

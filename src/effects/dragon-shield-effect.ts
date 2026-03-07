/**
 * Dragon shield (Meditating): teal sprite tracing with vibrant radiant glow.
 * No damage reduction; boosts mana regen.
 * Includes rotational light ray effect.
 */

import { drawImageFit } from '../render/renderer';

/** Teal palette for vibrant, radiant shield glow */
const TEAL_PALETTE = {
  core: '#00FFFF',
  mid: '#00CED1',
  edge: '#20B2AA',
};
const PULSE_FREQ = 2.5;
const OUTLINE_BLUR = 42;
const OPACITY = 1;
const SIZE_SCALE = 1.5;
const NUM_RAYS = 12;
const RAY_ANGLE = (Math.PI * 2) / NUM_RAYS * 0.72;
const RAY_ROTATION_SPEED = 0.5;

const LIGHTER_RAY_ANGLE = (Math.PI * 2) / NUM_RAYS * 0.45;

/**
 * Draw rotational light rays emanating from center.
 * Base rays + alternating lighter rays on top.
 */
function drawLightRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  gameTime: number
): void {
  const baseAngle = gameTime * RAY_ROTATION_SPEED;
  const lightAngle = -gameTime * RAY_ROTATION_SPEED;
  const angleStep = (Math.PI * 2) / NUM_RAYS;

  ctx.save();

  // Base rays (rotate clockwise)
  for (let i = 0; i < NUM_RAYS; i++) {
    const angle = baseAngle + i * angleStep;
    const startAngle = angle - RAY_ANGLE / 2;
    const endAngle = angle + RAY_ANGLE / 2;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.595)');
    gradient.addColorStop(0.4, 'rgba(0, 206, 209, 0.298)');
    gradient.addColorStop(0.7, 'rgba(0, 206, 209, 0.085)');
    gradient.addColorStop(1, 'rgba(0, 206, 209, 0)');

    ctx.shadowColor = 'rgba(0, 206, 209, 0.425)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius * 0.81, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Alternating lighter rays (between the base rays, rotate counter-clockwise)
  for (let i = 0; i < NUM_RAYS; i++) {
    const angle = lightAngle + (i + 0.5) * angleStep;
    const startAngle = angle - LIGHTER_RAY_ANGLE / 2;
    const endAngle = angle + LIGHTER_RAY_ANGLE / 2;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.765)');
    gradient.addColorStop(0.25, 'rgba(200, 255, 255, 0.468)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.17)');
    gradient.addColorStop(0.75, 'rgba(0, 206, 209, 0.043)');
    gradient.addColorStop(1, 'rgba(0, 206, 209, 0)');

    ctx.shadowColor = 'rgba(255, 255, 255, 0.34)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius * 0.72, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

/**
 * Draw Dragon meditating zone. Teal sprite tracing with vibrant, radiant glow.
 * When sprite is provided: uses shadowBlur to outline the sprite contour,
 * with a gradient mask that tapers from full at the nose to transparent at the back.
 */
export function drawDragonMeditatingZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  gameTime: number,
  sprite?: HTMLImageElement | null
): void {
  const cx = x + width / 2;
  const cy = y + height / 2;

  const pulseScale = 0.97 + 0.03 * Math.sin(gameTime * PULSE_FREQ);
  const rayRadius = Math.hypot(width, height) * SIZE_SCALE * pulseScale * 0.5;

  ctx.save();

  // Rotational light rays (drawn first, behind sprite glow)
  drawLightRays(ctx, cx, cy, rayRadius, gameTime);

  if (sprite) {
    const pad = Math.ceil(OUTLINE_BLUR * 2.2 * SIZE_SCALE);
    const offW = width + pad * 2;
    const offH = height + pad * 2;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = offW;
    offCanvas.height = offH;
    const off = offCanvas.getContext('2d')!;

    const ox = pad;
    const oy = pad;
    const ocx = ox + width / 2;

    // Outer radiant halo (softer, wider)
    off.shadowColor = TEAL_PALETTE.mid;
    off.shadowBlur = OUTLINE_BLUR * 2 * pulseScale * SIZE_SCALE;
    off.globalAlpha = 0.75;
    drawImageFit(off, sprite, ox, oy, width, height);

    // Inner vibrant core glow
    off.shadowColor = TEAL_PALETTE.core;
    off.shadowBlur = OUTLINE_BLUR * pulseScale * SIZE_SCALE;
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
    const halfDiag = Math.hypot(width, height) / 2;
    const r = halfDiag * 1.5 * SIZE_SCALE * pulseScale;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, TEAL_PALETTE.core);
    gradient.addColorStop(0.4, TEAL_PALETTE.mid);
    gradient.addColorStop(0.7, TEAL_PALETTE.edge);
    gradient.addColorStop(1, 'rgba(0, 206, 209, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  ctx.restore();
}

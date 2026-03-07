/**
 * Wolf secondary: sustained energy beam fired from center nose.
 * Hold-to-fire; consumes 2 mana/sec. Continuous rectangular blast
 * like Cyclops optic blast—unbroken stream, not a spike.
 */

/** Beam growth rate: px per second. No max—grows indefinitely while mana lasts. */
export const WOLF_BEAM_GROWTH_RATE = 620;

/** Beam width (px); parallel edges for main body */
export const WOLF_BEAM_WIDTH = 14;

/** Length (px) of taper at back near ship; rest of beam has parallel edges */
const TAPER_LENGTH = 28;

/** Wolf beam palette: outer grey → mid light grey → core white */
const PALETTE = {
  outer: 'rgba(160, 160, 160, 0.9)',
  mid: '#C0C0C0',
  core: '#FFFFFF',
  tip: 'rgba(224, 224, 224, 0)',
};

/** Animation frequency for energy ripple */
const RIPPLE_FREQ = 10;

/**
 * Draw beam layer: short taper at back (point at nose), then parallel edges.
 * Like Cyclops optic blast—taper only near origin, main beam is rectangular.
 */
function drawBeamWithBackTaper(
  ctx: CanvasRenderingContext2D,
  muzzleX: number,
  muzzleY: number,
  length: number,
  width: number,
  gradient: CanvasGradient
): void {
  const tipY = muzzleY - length;
  const taperEndY = muzzleY - TAPER_LENGTH;
  const halfW = width / 2;

  if (length <= 0) return;

  if (length <= TAPER_LENGTH) {
    // Short beam: whole thing is taper, width scales with length
    const scale = length / TAPER_LENGTH;
    const halfWAtTip = halfW * scale;
    ctx.beginPath();
    ctx.moveTo(muzzleX, muzzleY);
    ctx.lineTo(muzzleX + halfWAtTip, tipY);
    ctx.lineTo(muzzleX - halfWAtTip, tipY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    return;
  }

  // Taper at back: triangle from point at nose to full width
  ctx.beginPath();
  ctx.moveTo(muzzleX, muzzleY);
  ctx.lineTo(muzzleX + halfW, taperEndY);
  ctx.lineTo(muzzleX - halfW, taperEndY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Main beam: parallel edges from taper end to tip
  ctx.beginPath();
  ctx.moveTo(muzzleX - halfW, taperEndY);
  ctx.lineTo(muzzleX + halfW, taperEndY);
  ctx.lineTo(muzzleX + halfW, tipY);
  ctx.lineTo(muzzleX - halfW, tipY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
}

/**
 * Draw sustained Wolf secondary beam from muzzle, extending north (negative Y).
 * Grows from nose; length increases over time while held. Rectangular continuous blast.
 */
export function drawWolfSustainedBeam(
  ctx: CanvasRenderingContext2D,
  muzzleX: number,
  muzzleY: number,
  gameTime: number,
  length: number
): void {
  const tipY = muzzleY - length;
  const ripple = 0.94 + 0.06 * Math.sin(gameTime * RIPPLE_FREQ);
  const baseWidth = WOLF_BEAM_WIDTH * ripple;

  // Layer 1: outer glow (widest)
  const outerGrad = ctx.createLinearGradient(muzzleX, muzzleY, muzzleX, tipY);
  outerGrad.addColorStop(0, PALETTE.outer);
  outerGrad.addColorStop(0.7, 'rgba(180, 180, 180, 0.7)');
  outerGrad.addColorStop(0.9, 'rgba(200, 200, 200, 0.3)');
  outerGrad.addColorStop(1, PALETTE.tip);
  drawBeamWithBackTaper(ctx, muzzleX, muzzleY, length, baseWidth * 1.5, outerGrad);

  // Layer 2: mid (energy body)
  const midGrad = ctx.createLinearGradient(muzzleX, muzzleY, muzzleX, tipY);
  midGrad.addColorStop(0, PALETTE.mid);
  midGrad.addColorStop(0.6, 'rgba(192, 192, 192, 0.95)');
  midGrad.addColorStop(0.9, 'rgba(210, 210, 210, 0.4)');
  midGrad.addColorStop(1, PALETTE.tip);
  drawBeamWithBackTaper(ctx, muzzleX, muzzleY, length, baseWidth, midGrad);

  // Layer 3: core (bright center)
  const coreGrad = ctx.createLinearGradient(muzzleX, muzzleY, muzzleX, tipY);
  coreGrad.addColorStop(0, PALETTE.core);
  coreGrad.addColorStop(0.5, PALETTE.mid);
  coreGrad.addColorStop(0.85, 'rgba(220, 220, 220, 0.5)');
  coreGrad.addColorStop(1, PALETTE.tip);
  drawBeamWithBackTaper(ctx, muzzleX, muzzleY, length, baseWidth * 0.45, coreGrad);
}

/**
 * Dragon primary: single crescent moon projectile.
 * Teal/gold/orange palette.
 */

/** Dragon palette: teal core, gold mid, orange edge */
const DRAGON_CRESCENT_PALETTE = {
  core: '#00CED1',
  mid: '#FFD700',
  edge: '#FF8C00',
};

const CRESCENT_RADIUS = 10;
const CRESCENT_THICKNESS = 5;
const PULSE_FREQ = 12;

/**
 * Draw a single crescent moon shape oriented along velocity.
 */
export function drawCrescentBeam(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
  gameTime: number
): void {
  let dirX = vx;
  let dirY = vy;
  const len = Math.hypot(dirX, dirY);
  if (len < 1e-6) {
    dirX = 0;
    dirY = -1;
  } else {
    dirX /= len;
    dirY /= len;
  }

  const angle = Math.atan2(-dirX, dirY);
  const pulse = 0.95 + 0.05 * Math.sin(gameTime * PULSE_FREQ);
  const r = CRESCENT_RADIUS * pulse;
  const thick = CRESCENT_THICKNESS * pulse;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const gradient = ctx.createRadialGradient(0, -r / 2, 0, 0, 0, r + thick);
  gradient.addColorStop(0, DRAGON_CRESCENT_PALETTE.core);
  gradient.addColorStop(0.4, DRAGON_CRESCENT_PALETTE.mid);
  gradient.addColorStop(1, DRAGON_CRESCENT_PALETTE.edge);

  ctx.shadowColor = DRAGON_CRESCENT_PALETTE.edge;
  ctx.shadowBlur = 8;
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(0, 0, r + thick, 0, Math.PI);
  ctx.arc(0, 0, r, Math.PI, 0, true);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.restore();
}

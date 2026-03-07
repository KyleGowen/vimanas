/**
 * Turtle shield: force-field zone. Visible barrier that ships can be inside.
 * Per turtle_shield_design_lock.md. Distinct from Sparrow's personal glow.
 */

/** Default radius 165 px — wide enough for 2+ ships per design lock */
export const TURTLE_SHIELD_RADIUS_PX = 165;

/** Amber surface per design lock */
const SURFACE_COLOR = '#FFBF00';
const EDGE_COLOR = '#CC8F00';
const INTERIOR_TINT = 'rgba(255, 191, 0, 0.08)';

/** Pulse frequency — slower than Sparrow for tank feel */
const PULSE_FREQ = 4;

/**
 * Draw Turtle force-field zone. Circular barrier; semi-transparent amber.
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

  const pulseScale = 0.94 + 0.06 * Math.sin(gameTime * PULSE_FREQ);
  const r = radius * pulseScale;

  ctx.save();

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0, INTERIOR_TINT);
  gradient.addColorStop(0.7, 'rgba(255, 191, 0, 0.15)');
  gradient.addColorStop(0.95, 'rgba(255, 191, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(204, 143, 0, 0.5)');

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = EDGE_COLOR;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.stroke();

  ctx.restore();
}

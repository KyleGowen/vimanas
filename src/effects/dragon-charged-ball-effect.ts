/**
 * Dragon secondary: charged energy ball with water-like rippling effect.
 * Teal/white palette, concentric ripples, wavy surface.
 */

const CORE = 'rgba(255, 255, 255, 0.85)';
const MID = 'rgba(0, 206, 209, 0.75)';
const EDGE = 'rgba(13, 148, 136, 0.65)';
const RIPPLE_FREQ = 6;
const WAVE_FREQ = 5;
const NUM_RIPPLES = 5;
const NUM_POINTS = 32;

/**
 * Draw charged ball with water-like rippling effect.
 * Base sphere + concentric ripple rings + wavy distorted edge.
 */
export function drawDragonChargedBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  gameTime: number
): void {
  const pulse = 0.92 + 0.08 * Math.sin(gameTime * 8);
  const r = radius * pulse;

  ctx.save();

  // Base watery sphere
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, CORE);
  gradient.addColorStop(0.35, MID);
  gradient.addColorStop(1, EDGE);

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Concentric ripple rings expanding outward
  for (let i = 0; i < NUM_RIPPLES; i++) {
    const phase = (gameTime * RIPPLE_FREQ + i * 0.8) % 1;
    const rippleRadius = r * (0.3 + phase * 0.7);
    const alpha = (1 - phase) * 0.5;
    ctx.strokeStyle = `rgba(0, 206, 209, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Wavy edge overlay - draw a second pass with distorted boundary
  const waveAmp = r * 0.08;
  const waveCount = WAVE_FREQ;
  ctx.beginPath();
  for (let i = 0; i <= NUM_POINTS; i++) {
    const angle = (i / NUM_POINTS) * Math.PI * 2;
    const wave = waveAmp * Math.sin(angle * waveCount + gameTime * 10);
    const dist = r + wave;
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Inner highlight (water reflection)
  const highlightY = y - r * 0.2;
  const highlightGrad = ctx.createRadialGradient(
    x, highlightY, 0,
    x, y, r * 0.6
  );
  highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = highlightGrad;
  ctx.fill();

  ctx.restore();
}

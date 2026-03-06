/** Gradient colors for shield glow (core = center, tip = edge/transparent) */
export interface ShieldPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Configuration for a shield glow effect. */
export interface ShieldEffectConfig {
  palette: ShieldPalette;
  opacity?: number;
  /** Radius scale relative to ship half-diagonal. 1.2 = slightly larger than ship. */
  radiusScale?: number;
  pulseFreq?: number;
  /** Blur radius for sprite-outline glow. Used when sprite is provided. */
  outlineBlur?: number;
}

const DEFAULTS: Required<Omit<ShieldEffectConfig, 'palette'>> = {
  opacity: 0.2,
  radiusScale: 1.2,
  pulseFreq: 6,
  outlineBlur: 18,
};

/** Sparrow: cyan per thruster/beam, art_style_guide */
export const SPARROW_SHIELD_PALETTE: ShieldPalette = {
  core: '#00FFFF',
  mid: '#0088CC',
  tip: 'rgba(0, 100, 150, 0)',
};

/** Sparrow shield preset: cyan aether glow surrounding ship (art_style_guide) */
export const SPARROW_SHIELD_CONFIG: ShieldEffectConfig = {
  palette: SPARROW_SHIELD_PALETTE,
  opacity: 1,
  radiusScale: 1.2,
  pulseFreq: 6,
  outlineBlur: 18,
};

/**
 * Draw a faint radial glow around the ship (shield effect).
 * When sprite is provided, uses shadowBlur to outline the sprite silhouette.
 * When sprite is null, falls back to a radial gradient circle.
 * Uses same palette as thruster/beam for visual consistency.
 */
export function drawShieldGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
  config: ShieldEffectConfig,
  sprite?: HTMLImageElement | null
): void {
  const palette = config.palette;
  const opacity = config.opacity ?? DEFAULTS.opacity;
  const pulseFreq = config.pulseFreq ?? DEFAULTS.pulseFreq;

  if (sprite) {
    const outlineBlur = config.outlineBlur ?? DEFAULTS.outlineBlur;
    const pulseScale = 0.92 + 0.08 * Math.sin(time * pulseFreq);
    const blur = outlineBlur * pulseScale;

    ctx.save();
    ctx.shadowColor = palette.core;
    ctx.shadowBlur = blur;
    ctx.globalAlpha = opacity;
    ctx.drawImage(sprite, x, y, width, height);
    ctx.restore();
    return;
  }

  const radiusScale = config.radiusScale ?? DEFAULTS.radiusScale;
  const halfDiag = Math.sqrt(width * width + height * height) / 2;
  const baseRadius = halfDiag * radiusScale;
  const pulseScale = 0.92 + 0.08 * Math.sin(time * pulseFreq);
  const radius = baseRadius * pulseScale;

  const cx = x + width / 2;
  const cy = y + height / 2;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, palette.core);
  gradient.addColorStop(0.4, palette.mid);
  gradient.addColorStop(1, palette.tip);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

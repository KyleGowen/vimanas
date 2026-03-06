/** Gradient colors for energy ring (core = inner edge, tip = outer edge) */
export interface EnergyRingPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Configuration for an energy ring effect. */
export interface EnergyRingConfig {
  palette: EnergyRingPalette;
  innerRadiusRatio?: number;
  /** Horizontal radius multiplier. 1 = circle. */
  radiusXScale?: number;
  /** Vertical radius multiplier. 1 = circle. */
  radiusYScale?: number;
  numSegments?: number;
  pulseFreq?: number;
}

const DEFAULTS: Required<Omit<EnergyRingConfig, 'palette'>> = {
  innerRadiusRatio: 0.85,
  radiusXScale: 1.4,
  radiusYScale: 0.45,
  numSegments: 8,
  pulseFreq: 8,
};

/** Sparrow: cyan per thruster/projectile beam, art_style_guide */
export const SPARROW_ENERGY_RING_PALETTE: EnergyRingPalette = {
  core: '#00FFFF',
  mid: '#0088CC',
  tip: 'rgba(0, 100, 150, 0)',
};

/** Sparrow energy ring preset: cyan donut, thin band, elliptical, subtle pulse */
export const SPARROW_ENERGY_RING_CONFIG: EnergyRingConfig = {
  palette: SPARROW_ENERGY_RING_PALETTE,
  innerRadiusRatio: 0.85,
  radiusXScale: 1.4,
  radiusYScale: 0.45,
  numSegments: 8,
  pulseFreq: 8,
};

/**
 * Draw a glowing energy ring (donut) centered at (x, y).
 * Gradient: core at inner edge, tip (transparent) at outer edge.
 * Optional subtle time-based pulse for consistency with thruster/projectile beam.
 */
export function drawEnergyRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  config: EnergyRingConfig
): void {
  const palette = config.palette;
  const innerRatio = config.innerRadiusRatio ?? DEFAULTS.innerRadiusRatio;
  const radiusXScale = config.radiusXScale ?? DEFAULTS.radiusXScale;
  const radiusYScale = config.radiusYScale ?? DEFAULTS.radiusYScale;
  const pulseFreq = config.pulseFreq ?? DEFAULTS.pulseFreq;

  const pulseScale = 0.92 + 0.08 * Math.sin(time * pulseFreq);
  const outerR = radius * pulseScale;
  const innerR = outerR * innerRatio;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(radiusXScale, radiusYScale);

  const gradient = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
  gradient.addColorStop(0, palette.core);
  gradient.addColorStop(0.4, palette.mid);
  gradient.addColorStop(1, palette.tip);

  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.arc(0, 0, innerR, Math.PI * 2, 0, true);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
}

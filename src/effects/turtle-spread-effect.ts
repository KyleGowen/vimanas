/**
 * Draw a fiery sphere for Turtle secondary (spread shot).
 * Same palette and multi-layer glow as the arc shot, in sphere form.
 */

import { TURTLE_ARC_PALETTE, type ArcShotPalette } from '../arc-shot/arc-shot-effect';

export interface TurtleSpreadSphereConfig {
  palette: ArcShotPalette;
  /** Base radius in px */
  radius: number;
  /** Number of overlapping energy layers (arc-style) */
  numLayers?: number;
  /** Animation frequency for layer pulse */
  pulseFreq?: number;
}

/** Default: 6px radius (12px diameter), arc-style layers */
export const TURTLE_SPREAD_SPHERE_CONFIG: TurtleSpreadSphereConfig = {
  palette: TURTLE_ARC_PALETTE,
  radius: 6,
  numLayers: 4,
  pulseFreq: 12,
};

/**
 * Draw a glowing energy sphere with arc shot styling.
 * Multi-layer circles with radial gradient, pulse, and shadow glow.
 */
export function drawTurtleSpreadSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gameTime: number,
  spawnTime: number,
  lifetime: number,
  config: TurtleSpreadSphereConfig
): void {
  const age = gameTime - spawnTime;
  if (age < 0 || age > lifetime) return;

  const baseOpacity = 1 - age / lifetime;
  const { palette, radius } = config;
  const numLayers = config.numLayers ?? 4;
  const pulseFreq = config.pulseFreq ?? 12;

  ctx.save();
  ctx.translate(x, y);

  for (let layer = 0; layer < numLayers; layer++) {
    const layerScale = 0.7 + 0.3 * Math.sin(gameTime * pulseFreq + layer * 1.5);
    const radiusScale = 0.85 + 0.15 * Math.cos(gameTime * pulseFreq * 0.8 + layer);
    const layerOpacity = baseOpacity * layerScale * (0.5 + 0.5 * (layer / numLayers));
    const layerRadius = radius * radiusScale * (0.6 + 0.4 * (1 - layer / numLayers));

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
    gradient.addColorStop(0, palette.core);
    gradient.addColorStop(0.4, palette.edge);
    gradient.addColorStop(1, palette.fade);

    ctx.globalAlpha = layerOpacity;
    ctx.shadowColor = palette.edge;
    ctx.shadowBlur = 24 + layer * 4;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, layerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
}

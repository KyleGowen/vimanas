/**
 * Draw a curved arc beam for Turtle primary weapon.
 * Arc shoots out in front (north), curves like a crescent, wider than ship.
 * Per turtle_primary_weapon_design_lock.md
 */

export interface ArcShotPalette {
  core: string;
  edge: string;
  fade: string;
}

/** Firey yellow/orange per Turtle design lock – intense glowing energy beam */
export const TURTLE_ARC_PALETTE: ArcShotPalette = {
  core: '#FFFFCC',
  edge: '#FF8800',
  fade: 'rgba(255, 120, 0, 0)',
};

export interface ArcShotDrawConfig {
  palette: ArcShotPalette;
  /** Arc length (forward extent) in px */
  length: number;
  /** Arc width (span) in px - wider than ship */
  width: number;
  /** Number of segments for smooth curve */
  segments: number;
  /** Number of overlapping energy layers (thruster-style) */
  numLayers?: number;
  /** Animation frequency for layer pulse */
  pulseFreq?: number;
}

/** Default: 160px length, 298px width per design lock */
export const TURTLE_ARC_DRAW_CONFIG: ArcShotDrawConfig = {
  palette: TURTLE_ARC_PALETTE,
  length: 160,
  width: 298,
  segments: 16,
  numLayers: 4,
  pulseFreq: 12,
};

/**
 * Quadratic Bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
 */
function bezierPoint(
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const twoMtT = 2 * mt * t;
  return {
    x: mt2 * p0x + twoMtT * p1x + t2 * p2x,
    y: mt2 * p0y + twoMtT * p1y + t2 * p2y,
  };
}

/**
 * Draw curved arc beam. Arc bows forward from origin.
 * North = up, so arc extends in -y direction.
 * P0 = left edge (-width/2, 0), P2 = right edge (width/2, 0), P1 = (0, -length) control.
 */
export function drawArcShot(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  gameTime: number,
  spawnTime: number,
  duration: number,
  config: ArcShotDrawConfig
): void {
  const age = gameTime - spawnTime;
  if (age < 0 || age > duration) return;

  const baseOpacity = 1 - age / duration;
  const { palette, length, width, segments } = config;
  const numLayers = config.numLayers ?? 4;
  const pulseFreq = config.pulseFreq ?? 12;

  const p0x = -width / 2;
  const p0y = 0;
  const p1x = 0;
  const p1y = -length;
  const p2x = width / 2;
  const p2y = 0;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(bezierPoint(p0x, p0y, p1x, p1y, p2x, p2y, t));
  }

  ctx.save();
  ctx.translate(originX, originY);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let layer = 0; layer < numLayers; layer++) {
    const layerScale = 0.7 + 0.3 * Math.sin(gameTime * pulseFreq + layer * 1.5);
    const widthScale = 0.85 + 0.15 * Math.cos(gameTime * pulseFreq * 0.8 + layer);
    const layerOpacity = baseOpacity * layerScale * (0.5 + 0.5 * (layer / numLayers));
    const layerWidth = (4 + (numLayers - 1 - layer) * 3) * widthScale;

    const gradient = ctx.createLinearGradient(0, 0, 0, -length);
    gradient.addColorStop(0, palette.fade);
    gradient.addColorStop(0.3, palette.edge);
    gradient.addColorStop(0.5, palette.core);
    gradient.addColorStop(0.7, palette.edge);
    gradient.addColorStop(1, palette.fade);

    ctx.globalAlpha = layerOpacity;
    ctx.shadowColor = palette.edge;
    ctx.shadowBlur = 24 + layer * 4;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = layerWidth;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
}

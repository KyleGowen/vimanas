/** Gradient colors for thruster (core = near ship, tip = far/transparent) */
export interface ThrusterPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Thruster direction: down = exhaust below (player), up = exhaust above (enemies flying south) */
export type ThrusterDirection = 'down' | 'up';

/** Full configuration for a thruster instance. All params tunable. */
export interface ThrusterConfig {
  palette: ThrusterPalette;
  widthRatio?: number;
  heightRatio?: number;
  originXOffset?: number;
  originYOffset?: number;
  direction?: ThrusterDirection;
  numSegments?: number;
  heightFreq?: number;
  widthFreq?: number;
  drawOrder?: 'behind' | 'inFront';
  /** When moving north (moveAxis.y < 0), scale width by this. Default 1 = no change. */
  northWidthScale?: number;
  /** When moving north (moveAxis.y < 0), scale height by this. Default 1 = no change. */
  northHeightScale?: number;
  /** When moving south (moveAxis.y > 0), scale width by this. Default 1 = no change. */
  southWidthScale?: number;
  /** When moving south (moveAxis.y > 0), scale height by this. Default 1 = no change. */
  southHeightScale?: number;
}

const DEFAULTS: Required<
  Omit<ThrusterConfig, 'palette'>
> = {
  widthRatio: 0.06,
  heightRatio: 0.396,
  originXOffset: 0.5,
  originYOffset: 0.74,
  direction: 'down',
  numSegments: 4,
  heightFreq: 10,
  widthFreq: 8,
  drawOrder: 'inFront',
  northWidthScale: 1,
  northHeightScale: 1,
  southWidthScale: 1,
  southHeightScale: 1,
};

/** Ship propulsion palettes per art_style_guide.md */
export const THRUSTER_PALETTES: Record<string, ThrusterPalette> = {
  aether: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  firey: { core: '#FFAA00', mid: '#FF6600', tip: 'rgba(200, 50, 0, 0)' },
  sparrow: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  turtle: { core: '#FFBF00', mid: '#E6A800', tip: 'rgba(180, 120, 0, 0)' },
  wolf: { core: '#E8E8E8', mid: '#B0B0B0', tip: 'rgba(120, 120, 120, 0)' },
  dragon: { core: '#FF4500', mid: '#CC3300', tip: 'rgba(150, 50, 0, 0)' },
  scout: { core: '#B8C900', mid: '#8B9A00', tip: 'rgba(80, 90, 0, 0)' },
};

/** Sparrow: cyan/blue aether glow. Tuned for Sparrow sprite nozzle. */
export const SPARROW_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.sparrow,
  widthRatio: 0.06,
  heightRatio: 0.396,
  originYOffset: 0.74,
  numSegments: 4,
  heightFreq: 10,
  widthFreq: 8,
  drawOrder: 'inFront',
  northWidthScale: 1.15,
  northHeightScale: 1.5,
  southWidthScale: 0.9,
  southHeightScale: 0.75,
};

/** Turtle: amber/gold per art_style_guide. */
export const TURTLE_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.turtle,
  ...DEFAULTS,
};

/** Wolf: white/silver per art_style_guide. */
export const WOLF_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.wolf,
  ...DEFAULTS,
};

/** Dragon: orange/red per art_style_guide. */
export const DRAGON_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.dragon,
  ...DEFAULTS,
};

/** Scout: sickly green/yellow per enemy palette. Enemies fly south, so thrust at top, facing up. */
export const SCOUT_THRUSTER_CONFIG: ThrusterConfig = {
  ...DEFAULTS,
  palette: THRUSTER_PALETTES.scout,
  widthRatio: 0.08,
  heightRatio: 0.25,
  originYOffset: 0.22,
  direction: 'up',
  numSegments: 3,
};

/**
 * Reusable thruster effect instance. Ships create one per ship with a preset or custom config.
 */
export class Thruster {
  private readonly config: Required<ThrusterConfig>;

  constructor(config: ThrusterConfig) {
    this.config = {
      palette: config.palette,
      widthRatio: config.widthRatio ?? DEFAULTS.widthRatio,
      heightRatio: config.heightRatio ?? DEFAULTS.heightRatio,
      originXOffset: config.originXOffset ?? DEFAULTS.originXOffset,
      originYOffset: config.originYOffset ?? DEFAULTS.originYOffset,
      direction: config.direction ?? DEFAULTS.direction,
      numSegments: config.numSegments ?? DEFAULTS.numSegments,
      heightFreq: config.heightFreq ?? DEFAULTS.heightFreq,
      widthFreq: config.widthFreq ?? DEFAULTS.widthFreq,
      drawOrder: config.drawOrder ?? DEFAULTS.drawOrder,
      northWidthScale: config.northWidthScale ?? DEFAULTS.northWidthScale,
      northHeightScale: config.northHeightScale ?? DEFAULTS.northHeightScale,
      southWidthScale: config.southWidthScale ?? DEFAULTS.southWidthScale,
      southHeightScale: config.southHeightScale ?? DEFAULTS.southHeightScale,
    };
  }

  /**
   * Draw thruster at ship position. Thruster originates at nozzle and extends in direction (down or up).
   * Pass moveAxis when moving; north (moveAxis.y < 0) applies config's northWidthScale/northHeightScale when set.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    moveAxis?: { x: number; y: number }
  ): void {
    const { palette, widthRatio, heightRatio, originXOffset, originYOffset, direction, numSegments, heightFreq, widthFreq, northWidthScale, northHeightScale, southWidthScale, southHeightScale } =
      this.config;

    const cx = x + width * originXOffset;
    const thrusterOriginY = y + height * originYOffset;
    const movingNorth = moveAxis != null && moveAxis.y < 0;
    const movingSouth = moveAxis != null && moveAxis.y > 0;
    const wScale = movingNorth ? northWidthScale : movingSouth ? southWidthScale : 1;
    const hScale = movingNorth ? northHeightScale : movingSouth ? southHeightScale : 1;
    const baseHeight = height * heightRatio * hScale;
    const baseWidth = width * widthRatio * wScale;
    const up = direction === 'up';

    for (let i = 0; i < numSegments; i++) {
      const heightScale = 0.7 + 0.3 * Math.sin(time * heightFreq + i * 1.5);
      const widthScale = 0.8 + 0.2 * Math.cos(time * widthFreq + i);
      const segHeight = baseHeight * heightScale;
      const segWidth = baseWidth * widthScale;
      const left = cx - segWidth / 2;
      const right = cx + segWidth / 2;
      const tipY = up ? thrusterOriginY - segHeight : thrusterOriginY + segHeight;
      const tipExtY = up ? thrusterOriginY - segHeight - segHeight * 0.2 : thrusterOriginY + segHeight + segHeight * 0.2;

      const gradStart = up ? thrusterOriginY : thrusterOriginY;
      const gradEnd = up ? thrusterOriginY - segHeight : thrusterOriginY + segHeight;
      const gradient = ctx.createLinearGradient(cx, gradStart, cx, gradEnd);
      gradient.addColorStop(0, palette.core);
      gradient.addColorStop(0.4, palette.mid);
      gradient.addColorStop(1, palette.tip);

      ctx.beginPath();
      ctx.moveTo(left, thrusterOriginY);
      ctx.lineTo(right, thrusterOriginY);
      ctx.lineTo(cx + segWidth / 4, tipY);
      ctx.lineTo(cx, tipExtY);
      ctx.lineTo(cx - segWidth / 4, tipY);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /** Whether to draw behind (true) or in front of (false) the ship sprite. */
  get drawOrder(): 'behind' | 'inFront' {
    return this.config.drawOrder;
  }
}

/** Legacy options for drawThruster wrapper. */
export interface ThrusterOptions {
  colorStyle?: 'aether' | 'firey';
}

/**
 * One-off draw without creating a Thruster instance. Prefer Thruster class for ships.
 */
export function drawThruster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
  options?: ThrusterOptions
): void {
  const colorStyle = options?.colorStyle ?? 'aether';
  const thruster = new Thruster({
    palette: THRUSTER_PALETTES[colorStyle],
  });
  thruster.draw(ctx, x, y, width, height, time);
}

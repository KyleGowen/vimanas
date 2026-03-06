/** Gradient colors for thruster (core = near ship, tip = far/transparent) */
export interface ThrusterPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Full configuration for a thruster instance. All params tunable. */
export interface ThrusterConfig {
  palette: ThrusterPalette;
  widthRatio?: number;
  heightRatio?: number;
  originYOffset?: number;
  numSegments?: number;
  heightFreq?: number;
  widthFreq?: number;
  drawOrder?: 'behind' | 'inFront';
}

const DEFAULTS: Required<
  Omit<ThrusterConfig, 'palette'>
> = {
  widthRatio: 0.06,
  heightRatio: 0.396,
  originYOffset: 0.74,
  numSegments: 4,
  heightFreq: 10,
  widthFreq: 8,
  drawOrder: 'inFront',
};

/** Ship propulsion palettes per art_style_guide.md */
export const THRUSTER_PALETTES: Record<string, ThrusterPalette> = {
  aether: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  firey: { core: '#FFAA00', mid: '#FF6600', tip: 'rgba(200, 50, 0, 0)' },
  sparrow: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  turtle: { core: '#FFBF00', mid: '#E6A800', tip: 'rgba(180, 120, 0, 0)' },
  wolf: { core: '#E8E8E8', mid: '#B0B0B0', tip: 'rgba(120, 120, 120, 0)' },
  dragon: { core: '#FF4500', mid: '#CC3300', tip: 'rgba(150, 50, 0, 0)' },
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
      originYOffset: config.originYOffset ?? DEFAULTS.originYOffset,
      numSegments: config.numSegments ?? DEFAULTS.numSegments,
      heightFreq: config.heightFreq ?? DEFAULTS.heightFreq,
      widthFreq: config.widthFreq ?? DEFAULTS.widthFreq,
      drawOrder: config.drawOrder ?? DEFAULTS.drawOrder,
    };
  }

  /**
   * Draw thruster at ship position. Thruster originates at center-bottom (nozzle) and extends downward.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number
  ): void {
    const { palette, widthRatio, heightRatio, originYOffset, numSegments, heightFreq, widthFreq } =
      this.config;

    const cx = x + width / 2;
    const thrusterOriginY = y + height * originYOffset;
    const baseHeight = height * heightRatio;
    const baseWidth = width * widthRatio;

    for (let i = 0; i < numSegments; i++) {
      const heightScale = 0.7 + 0.3 * Math.sin(time * heightFreq + i * 1.5);
      const widthScale = 0.8 + 0.2 * Math.cos(time * widthFreq + i);
      const segHeight = baseHeight * heightScale;
      const segWidth = baseWidth * widthScale;
      const left = cx - segWidth / 2;
      const right = cx + segWidth / 2;
      const bottom = thrusterOriginY + segHeight;

      const gradient = ctx.createLinearGradient(cx, thrusterOriginY, cx, bottom);
      gradient.addColorStop(0, palette.core);
      gradient.addColorStop(0.4, palette.mid);
      gradient.addColorStop(1, palette.tip);

      ctx.beginPath();
      ctx.moveTo(left, thrusterOriginY);
      ctx.lineTo(right, thrusterOriginY);
      ctx.lineTo(cx + segWidth / 4, bottom);
      ctx.lineTo(cx, bottom + segHeight * 0.2);
      ctx.lineTo(cx - segWidth / 4, bottom);
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

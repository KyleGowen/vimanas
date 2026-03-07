import type { ThrusterConfig } from './thruster-config';
import {
  THRUSTER_PALETTES,
  SPARROW_THRUSTER_CONFIG,
  TURTLE_THRUSTER_CONFIG,
  WOLF_THRUSTER_CONFIG,
  DRAGON_THRUSTER_CONFIG,
  SCOUT_THRUSTER_CONFIG,
} from './thruster-config';

export type { ThrusterConfig, ThrusterPalette, ThrusterDirection } from './thruster-config';
export {
  THRUSTER_PALETTES,
  SPARROW_THRUSTER_CONFIG,
  TURTLE_THRUSTER_CONFIG,
  WOLF_THRUSTER_CONFIG,
  DRAGON_THRUSTER_CONFIG,
  SCOUT_THRUSTER_CONFIG,
};

const DEFAULTS: Required<Omit<ThrusterConfig, 'palette'>> = {
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

  get drawOrder(): 'behind' | 'inFront' {
    return this.config.drawOrder;
  }
}

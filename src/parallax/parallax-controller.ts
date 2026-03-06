import { ParallaxLayer, type ParallaxLayerConfig } from './parallax-layer';

/** Layer configs per level_1_forest_design.md: Far 0.3x, Mid 0.6x, Near 1.0x */
const LEVEL1_LAYER_CONFIGS: ParallaxLayerConfig[] = [
  { spritePath: '/images/level1/parallax_far.png', scrollRatio: 0.3, depth: 1 },
  { spritePath: '/images/level1/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
  { spritePath: '/images/level1/parallax_near.png', scrollRatio: 1.0, depth: 3 },
];

/**
 * Orchestrates parallax layers for Level 1 (forest).
 * Draws Far → Mid → Near in depth order.
 */
export class ParallaxController {
  private readonly layers: ParallaxLayer[] = LEVEL1_LAYER_CONFIGS.map(
    (config) => new ParallaxLayer(config)
  );

  /** Load all layers. Call from scene enter. */
  async load(): Promise<void> {
    await Promise.all(this.layers.map((l) => l.load()));
  }

  /**
   * Draw layers in depth order (Far → Mid → Near).
   * @param ctx - Canvas 2D context
   * @param scrollOffset - Current world scroll from LevelScrollController
   * @param screenWidth - Viewport width
   * @param screenHeight - Viewport height
   */
  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    screenWidth: number,
    screenHeight: number
  ): void {
    for (const layer of this.layers) {
      layer.draw(ctx, scrollOffset, screenWidth, screenHeight);
    }
  }

  /** Release all layer resources. Call from scene exit. */
  dispose(): void {
    for (const layer of this.layers) {
      layer.dispose();
    }
  }

  /** Pass through screen size if layers need it. Layers use dimensions in draw(). */
  setScreenSize(_width: number, _height: number): void {
    // Layers receive screen dimensions in draw(); no pre-config needed.
  }

  /** Expose layers for testing (draw order, scrollOffset passthrough). */
  getLayers(): ParallaxLayer[] {
    return [...this.layers];
  }
}

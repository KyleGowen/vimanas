import { loadImage } from '../assets/asset-loader';
import { drawImage, drawRect } from '../render/renderer';

/** Parallax layer config. Far 0.3x, Mid 0.6x, Near 1.0x per level_1_forest_design.md */
export interface ParallaxLayerConfig {
  /** Asset path (e.g. /images/level1/parallax_far.png). From public root. */
  spritePath: string;
  /** Scroll speed ratio relative to play plane. 0.3 = far (slowest), 1.0 = near (full). */
  scrollRatio: number;
  /** Depth order for draw order (1=back, 4=front). Not used by single layer; for ParallaxController. */
  depth: number;
}

const FALLBACK_COLOR = '#1a3a1a';

/**
 * Single parallax layer. Loads a sprite, draws at offset derived from scrollRatio × scrollOffset.
 * When scrollOffset=0, draws at y=0. When scrollOffset increases, layer offset = -(scrollRatio × scrollOffset)
 * so it lags behind (parallax effect).
 */
export class ParallaxLayer {
  private sprite: HTMLImageElement | null = null;
  private loaded = false;

  constructor(readonly config: ParallaxLayerConfig) {}

  /** Load sprite via asset-loader. Call from scene enter or ParallaxController. */
  async load(): Promise<void> {
    try {
      this.sprite = await loadImage(this.config.spritePath);
      this.loaded = true;
    } catch {
      this.loaded = true;
    }
  }

  /** Whether the sprite has finished loading (success or failure). */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Draw layer at parallax offset. Layer Y = -(scrollRatio × scrollOffset) so it lags behind.
   * Tiles vertically so the background repeats infinitely as the level scrolls.
   * @param ctx - Canvas 2D context
   * @param scrollOffset - Current world scroll (from LevelScrollController)
   * @param screenWidth - Viewport width
   * @param screenHeight - Viewport height
   */
  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    screenWidth: number,
    screenHeight: number
  ): void {
    const offsetY = scrollOffset === 0 ? 0 : -(this.config.scrollRatio * scrollOffset);

    const kMin = Math.ceil(-(offsetY + screenHeight) / screenHeight);
    const kMax = Math.floor((screenHeight - offsetY) / screenHeight);

    if (this.sprite && this.loaded) {
      for (let k = kMin; k <= kMax; k++) {
        const tileY = offsetY + k * screenHeight;
        drawImage(ctx, this.sprite, 0, tileY, screenWidth, screenHeight);
      }
    } else {
      for (let k = kMin; k <= kMax; k++) {
        const tileY = offsetY + k * screenHeight;
        drawRect(ctx, 0, tileY, screenWidth, screenHeight, FALLBACK_COLOR);
      }
    }
  }

  /** Release sprite reference. Call from scene exit. */
  dispose(): void {
    this.sprite = null;
  }
}

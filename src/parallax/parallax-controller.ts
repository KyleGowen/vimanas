import { ParallaxLayer } from './parallax-layer';
import { getLayerConfigsForTheme } from '../levels/theme-layers';
import type { ThemeId } from '../levels/level-spec';

/**
 * Orchestrates parallax layers per theme.
 * Draws Far → Mid → Near in depth order.
 * Per docs/concepts/level_theme_taxonomy.md (9.3).
 */
export class ParallaxController {
  private layers: ParallaxLayer[] = [];

  /**
   * Set theme and build layers. Call before load().
   * Defaults to forest if not set.
   */
  setTheme(themeId: ThemeId): void {
    for (const layer of this.layers) {
      layer.dispose();
    }
    const configs = getLayerConfigsForTheme(themeId);
    this.layers = configs.map((config) => new ParallaxLayer(config));
  }

  /** Load all layers. Call from scene enter. Call setTheme first. */
  async load(): Promise<void> {
    if (this.layers.length === 0) {
      this.setTheme('forest');
    }
    await Promise.all(this.layers.map((l) => l.load()));
  }

  /**
   * Draw layers in depth order (Far → Mid → Near).
   * Lazy-inits with forest theme if setTheme was never called.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    screenWidth: number,
    screenHeight: number
  ): void {
    if (this.layers.length === 0) {
      this.setTheme('forest');
    }
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
    if (this.layers.length === 0) {
      this.setTheme('forest');
    }
    return [...this.layers];
  }
}

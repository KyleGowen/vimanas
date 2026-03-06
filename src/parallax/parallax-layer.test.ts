import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParallaxLayer, type ParallaxLayerConfig } from './parallax-layer';
import { clearImageCache } from '../assets/asset-loader';

function createMockContext() {
  const calls: { method: string; args: unknown[] }[] = [];
  const ctx = {
    fillStyle: '',
    fillRect: (...args: unknown[]) => calls.push({ method: 'fillRect', args }),
    drawImage: (...args: unknown[]) => calls.push({ method: 'drawImage', args }),
    _calls: calls,
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

describe('ParallaxLayer', () => {
  beforeEach(() => {
    clearImageCache();
  });

  it('draws at correct Y offset for scrollOffset=0, scrollRatio=0.3', () => {
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_far.png',
      scrollRatio: 0.3,
      depth: 1,
    };
    const layer = new ParallaxLayer(config);
    layer.draw(ctx, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // offsetY = 0; tiles at -720, 0, 720
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(3);
    expect(calls.some((c) => c.args[1] === 0)).toBe(true);
  });

  it('draws at correct Y offset for scrollOffset=100, scrollRatio=0.3', () => {
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_far.png',
      scrollRatio: 0.3,
      depth: 1,
    };
    const layer = new ParallaxLayer(config);
    layer.draw(ctx, 100, SCREEN_WIDTH, SCREEN_HEIGHT);
    // offsetY = -30; tiles at -30, 690
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -30, SCREEN_WIDTH, SCREEN_HEIGHT]);
  });

  it('draws at correct Y offset for scrollOffset=200, scrollRatio=0.6', () => {
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_mid.png',
      scrollRatio: 0.6,
      depth: 2,
    };
    const layer = new ParallaxLayer(config);
    layer.draw(ctx, 200, SCREEN_WIDTH, SCREEN_HEIGHT);
    // offsetY = -120; tiles at -120, 600
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -120, SCREEN_WIDTH, SCREEN_HEIGHT]);
  });

  it('draws at correct Y offset for scrollRatio=1.0 (near layer)', () => {
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_near.png',
      scrollRatio: 1.0,
      depth: 3,
    };
    const layer = new ParallaxLayer(config);
    layer.draw(ctx, 50, SCREEN_WIDTH, SCREEN_HEIGHT);
    // offsetY = -50; tiles at -50, 670
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -50, SCREEN_WIDTH, SCREEN_HEIGHT]);
  });

  it('draws fallback rect when sprite not loaded (matches SparrowShip pattern)', () => {
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_far.png',
      scrollRatio: 0.3,
      depth: 1,
    };
    const layer = new ParallaxLayer(config);
    layer.draw(ctx, 100, SCREEN_WIDTH, SCREEN_HEIGHT);
    expect(ctx.fillStyle).toBe('#1a3a1a');
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
  });

  it('isLoaded returns false before load', () => {
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_far.png',
      scrollRatio: 0.3,
      depth: 1,
    };
    const layer = new ParallaxLayer(config);
    expect(layer.isLoaded()).toBe(false);
  });

  it('draws sprite when loaded', async () => {
    const instances: { onload: (() => void) | null }[] = [];
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        src = '';
        constructor() {
          instances.push(this as unknown as { onload: (() => void) | null });
        }
      }
    );
    const { ctx, calls } = createMockContext();
    const config: ParallaxLayerConfig = {
      spritePath: '/images/level1/parallax_far.png',
      scrollRatio: 0.3,
      depth: 1,
    };
    const layer = new ParallaxLayer(config);
    const loadPromise = layer.load();
    instances[0]!.onload!();
    await loadPromise;
    layer.draw(ctx, 100, SCREEN_WIDTH, SCREEN_HEIGHT);
    expect(calls.filter((c) => c.method === 'drawImage')).toHaveLength(2);
    // drawImage(img, 0, offsetY, screenWidth, screenHeight) → first tile at offsetY = -30
    expect(calls[0].args).toEqual([expect.anything(), 0, -30, SCREEN_WIDTH, SCREEN_HEIGHT]);
  });
});

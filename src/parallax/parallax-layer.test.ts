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
    // Per engine_learnings.md: positive offsetY (parallax scrolls south when player flies north)
    // offsetY = 30; tiles at k=-1: 30-720=-690, k=0: 30
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -690, SCREEN_WIDTH, SCREEN_HEIGHT]);
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
    // Per engine_learnings.md: positive offsetY
    // offsetY = 120; tiles at k=-1: 120-720=-600, k=0: 120
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -600, SCREEN_WIDTH, SCREEN_HEIGHT]);
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
    // Per engine_learnings.md: positive offsetY
    // offsetY = 50; tiles at k=-1: 50-720=-670, k=0: 50
    expect(calls.filter((c) => c.method === 'fillRect')).toHaveLength(2);
    expect(calls[0].args).toEqual([0, -670, SCREEN_WIDTH, SCREEN_HEIGHT]);
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
    // Per engine_learnings.md: positive offsetY = 30; first tile at k=-1: -690
    expect(calls[0].args).toEqual([expect.anything(), 0, -690, SCREEN_WIDTH, SCREEN_HEIGHT]);
  });
});

import { describe, it, expect } from 'vitest';
import { ParallaxController } from './parallax-controller';

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

describe('ParallaxController', () => {
  it('draws layers in depth order (Far → Mid → Near)', () => {
    const { ctx, calls } = createMockContext();
    const controller = new ParallaxController();
    controller.draw(ctx, 100, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Each layer tiles vertically (2 tiles each for scrollOffset=100)
    // Far (0.3x): offsetY = -30, tiles at -30, 690
    // Mid (0.6x): offsetY = -60, tiles at -60, 660
    // Near (1.0x): offsetY = -100, tiles at -100, 620
    expect(calls).toHaveLength(6);
    expect(calls[0].args[1]).toBe(-30); // Far first tile
    expect(calls[2].args[1]).toBe(-60); // Mid first tile
    expect(calls[4].args[1]).toBe(-100); // Near first tile
  });

  it('passes correct scrollOffset to each layer', () => {
    const { ctx, calls } = createMockContext();
    const controller = new ParallaxController();
    controller.draw(ctx, 200, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Far: -60, Mid: -120, Near: -200 (first tile of each)
    expect(calls[0].args[1]).toBe(-60);
    expect(calls[2].args[1]).toBe(-120);
    expect(calls[4].args[1]).toBe(-200);
  });

  it('passes screen dimensions to each layer', () => {
    const { ctx, calls } = createMockContext();
    const controller = new ParallaxController();
    const w = 640;
    const h = 360;
    controller.draw(ctx, 0, w, h);

    // scrollOffset=0: 3 tiles per layer (9 total)
    expect(calls.every((c) => c.args[2] === w && c.args[3] === h)).toBe(true);
  });

  it('getLayers returns layers in depth order', () => {
    const controller = new ParallaxController();
    const layers = controller.getLayers();
    expect(layers).toHaveLength(3);
    expect(layers[0].config.depth).toBe(1);
    expect(layers[0].config.scrollRatio).toBe(0.3);
    expect(layers[1].config.depth).toBe(2);
    expect(layers[1].config.scrollRatio).toBe(0.6);
    expect(layers[2].config.depth).toBe(3);
    expect(layers[2].config.scrollRatio).toBe(1.0);
  });
});

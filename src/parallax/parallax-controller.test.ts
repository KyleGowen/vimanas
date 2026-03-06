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

    // Far (0.3x): offsetY = -(0.3 * 100) = -30
    // Mid (0.6x): offsetY = -(0.6 * 100) = -60
    // Near (1.0x): offsetY = -(1.0 * 100) = -100
    expect(calls).toHaveLength(3);
    expect(calls[0].method).toBe('fillRect');
    expect(calls[0].args[1]).toBe(-30); // Far y
    expect(calls[1].method).toBe('fillRect');
    expect(calls[1].args[1]).toBe(-60); // Mid y
    expect(calls[2].method).toBe('fillRect');
    expect(calls[2].args[1]).toBe(-100); // Near y
  });

  it('passes correct scrollOffset to each layer', () => {
    const { ctx, calls } = createMockContext();
    const controller = new ParallaxController();
    controller.draw(ctx, 200, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Far: -0.3 * 200 = -60
    // Mid: -0.6 * 200 = -120
    // Near: -1.0 * 200 = -200
    expect(calls[0].args[1]).toBe(-60);
    expect(calls[1].args[1]).toBe(-120);
    expect(calls[2].args[1]).toBe(-200);
  });

  it('passes screen dimensions to each layer', () => {
    const { ctx, calls } = createMockContext();
    const controller = new ParallaxController();
    const w = 640;
    const h = 360;
    controller.draw(ctx, 0, w, h);

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

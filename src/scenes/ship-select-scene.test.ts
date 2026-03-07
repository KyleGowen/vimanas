import { describe, it, expect, vi } from 'vitest';
import { ShipSelectScene } from './ship-select-scene';
import type { GameContext } from '../game';
import { createMockCanvasContext } from '../test-utils';

/** Slot layout: 4 slots, 220 wide, 28 gap. startX=158, slotY=210. Slot 0: 158-378, Slot 3: 902-1122. */
const SLOT_0_CENTER_X = 158 + 110;
const SLOT_0_CENTER_Y = 210 + 130;
const SLOT_3_CENTER_X = 902 + 110;
const SLOT_3_CENTER_Y = 210 + 130;

function createMockContext(
  options: {
    isPrimaryActionPressed?: boolean;
    isMenuPressed?: boolean;
    getMenuNavigateX?: number;
    consumeClick?: { x: number; y: number } | null;
  } = {}
): GameContext {
  const {
    isPrimaryActionPressed = false,
    isMenuPressed = false,
    getMenuNavigateX = 0,
    consumeClick = null,
  } = options;
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  return {
    canvas,
    ctx: createMockCanvasContext(),
    input: {
      isPrimaryActionPressed: () => isPrimaryActionPressed,
      isMenuPressed: () => isMenuPressed,
      getMenuNavigateX: () => getMenuNavigateX,
      consumeClick: () => consumeClick,
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: vi.fn(),
  };
}

describe('ShipSelectScene', () => {
  it('transitions to gameplay with sparrow when A/Enter (default focus)', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ isPrimaryActionPressed: true });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'sparrow' });
  });

  it('transitions to gameplay with dragon when navigate right 3x then A', () => {
    vi.useFakeTimers();
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const baseCtx = createMockContext();
    baseCtx.goToScene = goToScene;
    scene.enter(baseCtx);
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(200);
      const ctx = createMockContext({ getMenuNavigateX: 1 });
      ctx.goToScene = goToScene;
      scene.update(ctx);
    }
    const ctx = createMockContext({ isPrimaryActionPressed: true });
    ctx.goToScene = goToScene;
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon' });
    vi.useRealTimers();
  });

  it('transitions to boot when B/Escape', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ isMenuPressed: true });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('boot');
  });

  it('transitions to gameplay with dragon when click on dragon slot', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ consumeClick: { x: SLOT_3_CENTER_X, y: SLOT_3_CENTER_Y } });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon' });
  });

  it('transitions to gameplay with sparrow when click on sparrow slot', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ consumeClick: { x: SLOT_0_CENTER_X, y: SLOT_0_CENTER_Y } });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'sparrow' });
  });

  it('does not transition when no input', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext();
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).not.toHaveBeenCalled();
  });

  it('draws without throwing', () => {
    const scene = new ShipSelectScene();
    const ctx = createMockContext();
    scene.enter(ctx);
    expect(() => scene.draw(ctx)).not.toThrow();
  });

  it('exit clears goToScene', () => {
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ isPrimaryActionPressed: true });
    const goToScene = vi.fn();
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.exit();
    scene.update(ctx);
    expect(goToScene).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { ShipSelectScene } from './ship-select-scene';
import type { GameContext } from '../game';
import { createMockCanvasContext } from '../test-utils';

/** Slot layout: shipY=140, ship slot 220×200. PilotY=430, pilot slot 180×200. */
const SLOT_0_CENTER_X = 158 + 110;
const SLOT_0_CENTER_Y = 140 + 100;
const SLOT_3_CENTER_X = 902 + 110;
const SLOT_3_CENTER_Y = 140 + 100;
const PILOT_0_CENTER_X = 238 + 90;
const PILOT_0_CENTER_Y = 430 + 100;

function createMockContext(
  options: {
    isPrimaryActionPressed?: boolean;
    isMenuPressed?: boolean;
    getMenuNavigateX?: number;
    getMenuNavigateY?: number;
    consumeClick?: { x: number; y: number } | null;
    goToScene?: (id: string, state?: unknown) => void;
  } = {}
): GameContext {
  const {
    isPrimaryActionPressed = false,
    isMenuPressed = false,
    getMenuNavigateX = 0,
    getMenuNavigateY = 0,
    consumeClick = null,
    goToScene = vi.fn(),
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
      getMenuNavigateY: () => getMenuNavigateY,
      consumeClick: () => consumeClick,
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene,
  };
}

describe('ShipSelectScene', () => {
  it('transitions to gameplay with sparrow and speed when visit pilot row then A', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    scene.update(createMockContext({ getMenuNavigateY: 1, goToScene }));
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'sparrow', pilotId: 'speed' });
  });

  it('does not confirm when A pressed before visiting pilot row', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).not.toHaveBeenCalled();
  });

  it('transitions to gameplay with dragon when navigate right 3x, down, then A', () => {
    vi.useFakeTimers();
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(200);
      scene.update(createMockContext({ getMenuNavigateX: 1, goToScene }));
    }
    vi.advanceTimersByTime(200);
    scene.update(createMockContext({ getMenuNavigateY: 1, goToScene }));
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon', pilotId: 'speed' });
    vi.useRealTimers();
  });

  it('transitions to gameplay with dragon+weapon when select ship then pilot then confirm', () => {
    vi.useFakeTimers();
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(200);
      scene.update(createMockContext({ getMenuNavigateX: 1, goToScene }));
    }
    vi.advanceTimersByTime(200);
    scene.update(createMockContext({ getMenuNavigateY: 1, goToScene }));
    vi.advanceTimersByTime(200);
    scene.update(createMockContext({ getMenuNavigateX: 1, goToScene }));
    vi.advanceTimersByTime(200);
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon', pilotId: 'weapon' });
    vi.useRealTimers();
  });

  it('transitions to boot when B/Escape', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ isMenuPressed: true, goToScene });
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('boot');
  });

  it('selects dragon and pilot when click both slots, then confirm', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    scene.update(createMockContext({ consumeClick: { x: SLOT_3_CENTER_X, y: SLOT_3_CENTER_Y }, goToScene }));
    scene.update(createMockContext({ consumeClick: { x: PILOT_0_CENTER_X, y: PILOT_0_CENTER_Y }, goToScene }));
    expect(goToScene).not.toHaveBeenCalled();
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).toHaveBeenCalledWith('gameplay', {
      shipId: 'dragon',
      pilotId: 'speed',
    });
  });

  it('selects sparrow and pilot when click both slots, then confirm', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    scene.update(createMockContext({ consumeClick: { x: SLOT_0_CENTER_X, y: SLOT_0_CENTER_Y }, goToScene }));
    scene.update(createMockContext({ consumeClick: { x: PILOT_0_CENTER_X, y: PILOT_0_CENTER_Y }, goToScene }));
    expect(goToScene).not.toHaveBeenCalled();
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).toHaveBeenCalledWith('gameplay', {
      shipId: 'sparrow',
      pilotId: 'speed',
    });
  });

  it('does not transition when no input', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    scene.update(createMockContext({ goToScene }));
    expect(goToScene).not.toHaveBeenCalled();
  });

  it('draws without throwing', () => {
    const scene = new ShipSelectScene();
    const ctx = createMockContext({ goToScene: vi.fn() });
    scene.enter(ctx);
    expect(() => scene.draw(ctx)).not.toThrow();
  });

  it('exit clears goToScene', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    scene.exit();
    scene.update(createMockContext({ isPrimaryActionPressed: true, goToScene }));
    expect(goToScene).not.toHaveBeenCalled();
  });
});

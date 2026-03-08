/**
 * Integration tests: Boot → ShipSelect and ShipSelect → Gameplay transitions.
 * BootScene: isStartPressed or consumeClick triggers goToScene('shipSelect').
 * ShipSelectScene: isPrimaryActionPressed triggers goToScene('gameplay', { shipId }) with focused ship (default: sparrow).
 */
import { describe, it, expect, vi } from 'vitest';
import { BootScene } from './boot-scene';
import { ShipSelectScene } from './ship-select-scene';
import type { GameContext } from '../game';
import { createMockCanvasContext } from '../test-utils';

function createMockContext(overrides: Partial<GameContext>): GameContext {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  return {
    canvas,
    ctx: createMockCanvasContext(),
    input: {
      getMoveAxis: () => ({ x: 0, y: 0 }),
      getMenuNavigateX: () => 0,
      getMenuNavigateY: () => 0,
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
      isShieldPressed: () => false,
      isEscapePressed: () => false,
      isStartPressed: () => false,
      isPrimaryActionPressed: () => false,
      isRetryPressed: () => false,
      isMenuPressed: () => false,
      consumeClick: () => null,
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: vi.fn(),
    ...overrides,
  };
}

describe('Boot → ShipSelect integration', () => {
  it('goToScene(shipSelect) when isStartPressed', () => {
    const goToScene = vi.fn();
    const scene = new BootScene();
    const ctx = createMockContext({
      goToScene,
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
        getMenuNavigateX: () => 0,
        isFirePressed: () => false,
        isSecondaryFirePressed: () => false,
        isShieldPressed: () => false,
        isEscapePressed: () => false,
        isStartPressed: () => true,
        isPrimaryActionPressed: () => false,
        isRetryPressed: () => false,
        isMenuPressed: () => false,
        consumeClick: () => null,
      } as GameContext['input'],
    });
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });

  it('goToScene(shipSelect) when consumeClick returns coords', () => {
    const goToScene = vi.fn();
    const scene = new BootScene();
    const ctx = createMockContext({
      goToScene,
        input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
        getMenuNavigateX: () => 0,
        isFirePressed: () => false,
        isSecondaryFirePressed: () => false,
        isShieldPressed: () => false,
        isEscapePressed: () => false,
        isStartPressed: () => false,
        isPrimaryActionPressed: () => false,
        isRetryPressed: () => false,
        isMenuPressed: () => false,
        consumeClick: () => ({ x: 100, y: 200 }),
      } as GameContext['input'],
    });
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });
});

describe('ShipSelect → Gameplay integration', () => {
  it('goToScene(gameplay, { shipId: sparrow, pilotId: speed }) when visit pilot row then isPrimaryActionPressed', () => {
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    const baseCtx = createMockContext({ goToScene });
    scene.enter(baseCtx);
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
          getMenuNavigateX: () => 0,
          getMenuNavigateY: () => 1,
          isFirePressed: () => false,
          isSecondaryFirePressed: () => false,
          isShieldPressed: () => false,
          isEscapePressed: () => false,
          isStartPressed: () => false,
          isPrimaryActionPressed: () => false,
          isRetryPressed: () => false,
          isMenuPressed: () => false,
          consumeClick: () => null,
        } as GameContext['input'],
      })
    );
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
          getMenuNavigateX: () => 0,
          getMenuNavigateY: () => 0,
          isFirePressed: () => false,
          isSecondaryFirePressed: () => false,
          isShieldPressed: () => false,
          isEscapePressed: () => false,
          isStartPressed: () => false,
          isPrimaryActionPressed: () => true,
          isRetryPressed: () => false,
          isMenuPressed: () => false,
          consumeClick: () => null,
        } as GameContext['input'],
      })
    );
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'sparrow', pilotId: 'speed' });
  });

  it('goToScene(gameplay, { shipId: dragon, pilotId: speed }) when navigate right 3x, down, then isPrimaryActionPressed', () => {
    vi.useFakeTimers();
    const goToScene = vi.fn();
    const scene = new ShipSelectScene();
    scene.enter(createMockContext({ goToScene }));
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(200);
      scene.update(
        createMockContext({
          goToScene,
          input: {
            getMoveAxis: () => ({ x: 0, y: 0 }),
            getMenuNavigateX: () => 1,
            getMenuNavigateY: () => 0,
            isFirePressed: () => false,
            isSecondaryFirePressed: () => false,
            isShieldPressed: () => false,
            isEscapePressed: () => false,
            isStartPressed: () => false,
            isPrimaryActionPressed: () => false,
            isRetryPressed: () => false,
            isMenuPressed: () => false,
            consumeClick: () => null,
          } as GameContext['input'],
        })
      );
    }
    vi.advanceTimersByTime(200);
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
          getMenuNavigateX: () => 0,
          getMenuNavigateY: () => 1,
          isFirePressed: () => false,
          isSecondaryFirePressed: () => false,
          isShieldPressed: () => false,
          isEscapePressed: () => false,
          isStartPressed: () => false,
          isPrimaryActionPressed: () => false,
          isRetryPressed: () => false,
          isMenuPressed: () => false,
          consumeClick: () => null,
        } as GameContext['input'],
      })
    );
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
          getMenuNavigateX: () => 0,
          getMenuNavigateY: () => 0,
          isFirePressed: () => false,
          isSecondaryFirePressed: () => false,
          isShieldPressed: () => false,
          isEscapePressed: () => false,
          isStartPressed: () => false,
          isPrimaryActionPressed: () => true,
          isRetryPressed: () => false,
          isMenuPressed: () => false,
          consumeClick: () => null,
        } as GameContext['input'],
      })
    );
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon', pilotId: 'speed' });
    vi.useRealTimers();
  });
});

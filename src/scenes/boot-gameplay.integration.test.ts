/**
 * Integration test: Boot → Gameplay scene transition.
 * BootScene.update with isStartPressed or consumeClick triggers goToScene('gameplay').
 */
import { describe, it, expect, vi } from 'vitest';
import { BootScene } from './boot-scene';
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

describe('Boot → Gameplay integration', () => {
  it('goToScene(gameplay) when isStartPressed', () => {
    const goToScene = vi.fn();
    const scene = new BootScene();
    const ctx = createMockContext({
      goToScene,
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
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
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });

  it('goToScene(gameplay) when consumeClick returns coords', () => {
    const goToScene = vi.fn();
    const scene = new BootScene();
    const ctx = createMockContext({
      goToScene,
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
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
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });
});

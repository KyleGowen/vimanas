/**
 * Integration tests: Results scene transitions.
 * ResultsScene → Boot (victory Continue, defeat Menu)
 * ResultsScene → Gameplay (victory Retry, defeat Retry)
 */
import { describe, it, expect, vi } from 'vitest';
import { ResultsScene } from './results-scene';
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

describe('Results scene transitions integration', () => {
  it('victory + primary action → goToScene(boot)', () => {
    const goToScene = vi.fn();
    const scene = new ResultsScene();
    scene.enter(
      createMockContext({
        goToScene,
        sceneState: { victory: true, score: 1000, lives: 3 },
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
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
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
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
        width: 1280,
        height: 720,
        deltaTime: 0.016,
      })
    );
    expect(goToScene).toHaveBeenCalledWith('boot');
  });

  it('victory + retry → goToScene(gameplay)', () => {
    const goToScene = vi.fn();
    const scene = new ResultsScene();
    scene.enter(
      createMockContext({
        goToScene,
        sceneState: { victory: true, score: 1000, lives: 3 },
      })
    );
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
          isFirePressed: () => false,
          isSecondaryFirePressed: () => false,
          isShieldPressed: () => false,
          isEscapePressed: () => false,
          isStartPressed: () => false,
          isPrimaryActionPressed: () => false,
          isRetryPressed: () => true,
          isMenuPressed: () => false,
          consumeClick: () => null,
        } as GameContext['input'],
        width: 1280,
        height: 720,
        deltaTime: 0.016,
      })
    );
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });

  it('defeat + primary → goToScene(gameplay)', () => {
    const goToScene = vi.fn();
    const scene = new ResultsScene();
    scene.enter(
      createMockContext({
        goToScene,
        sceneState: { victory: false, score: 500, lives: 0 },
      })
    );
    scene.update(
      createMockContext({
        goToScene,
        input: {
          getMoveAxis: () => ({ x: 0, y: 0 }),
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
        width: 1280,
        height: 720,
        deltaTime: 0.016,
      })
    );
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });

  it('defeat + menu → goToScene(boot)', () => {
    const goToScene = vi.fn();
    const scene = new ResultsScene();
    scene.enter(
      createMockContext({
        goToScene,
        sceneState: { victory: false, score: 500, lives: 0 },
      })
    );
    scene.update(
      createMockContext({
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
          isMenuPressed: () => true,
          consumeClick: () => null,
        } as GameContext['input'],
        width: 1280,
        height: 720,
        deltaTime: 0.016,
      })
    );
    expect(goToScene).toHaveBeenCalledWith('boot');
  });
});

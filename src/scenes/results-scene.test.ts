import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResultsScene } from './results-scene';
import type { GameContext, ResultsSceneState } from '../game';
import { createMockCanvasContext } from '../test-utils';

function createMockContext(
  options: {
    sceneState?: ResultsSceneState;
    isPrimaryActionPressed?: boolean;
    isRetryPressed?: boolean;
    isMenuPressed?: boolean;
    consumeClick?: { x: number; y: number } | null;
  } = {}
): GameContext {
  const {
    sceneState,
    isPrimaryActionPressed = false,
    isRetryPressed = false,
    isMenuPressed = false,
    consumeClick = null,
  } = options;
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const baseCtx = createMockCanvasContext();
  const ctx = {
    ...baseCtx,
    fillText: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
  return {
    canvas,
    ctx,
    input: {
      consumeClick: () => consumeClick,
      isPrimaryActionPressed: () => isPrimaryActionPressed,
      isRetryPressed: () => isRetryPressed,
      isMenuPressed: () => isMenuPressed,
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: vi.fn(),
    sceneState,
  };
}

describe('ResultsScene', () => {
  let scene: ResultsScene;
  let goToScene: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scene = new ResultsScene();
    goToScene = vi.fn();
  });

  it('receives victory state from sceneState on enter', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 12340, lives: 2 },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.draw(ctx);
    expect(ctx.ctx.fillText).toHaveBeenCalledWith(
      'LEVEL COMPLETE',
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('receives defeat state from sceneState on enter', () => {
    const ctx = createMockContext({
      sceneState: { victory: false, score: 8720, lives: 0 },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.draw(ctx);
    expect(ctx.ctx.fillText).toHaveBeenCalledWith(
      'DEFEAT',
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('draws score and lives', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 12340, lives: 2 },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.draw(ctx);
    const fillText = ctx.ctx.fillText as ReturnType<typeof vi.fn>;
    const texts = fillText.mock.calls.map((c: unknown[]) => c[0]);
    expect(texts).toContain('Score: 12,340');
    expect(texts).toContain('Lives: 2 ♥♥');
  });

  it('victory: primary action goes to shipSelect', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1 },
      isPrimaryActionPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });

  it('victory: retry goes to gameplay', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1 },
      isRetryPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', undefined);
  });

  it('victory: retry with shipId passes shipId to gameplay', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1, shipId: 'dragon' },
      isRetryPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', { shipId: 'dragon' });
  });

  it('defeat: primary action goes to gameplay', () => {
    const ctx = createMockContext({
      sceneState: { victory: false, score: 500, lives: 0 },
      isPrimaryActionPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', undefined);
  });

  it('defeat: retry goes to gameplay', () => {
    const ctx = createMockContext({
      sceneState: { victory: false, score: 500, lives: 0 },
      isRetryPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', undefined);
  });

  it('defeat: menu goes to boot', () => {
    const ctx = createMockContext({
      sceneState: { victory: false, score: 500, lives: 0 },
      isMenuPressed: true,
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('boot');
  });

  it('victory: click on Continue button goes to shipSelect', () => {
    const centerX = 1280 / 2;
    const button1X = centerX - 180 - 14;
    const clickX = button1X + 50;
    const clickY = 440 + 22;
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1 },
      consumeClick: { x: clickX, y: clickY },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });

  it('victory: click on Retry button goes to gameplay', () => {
    const centerX = 1280 / 2;
    const button2X = centerX + 14;
    const clickX = button2X + 50;
    const clickY = 440 + 22;
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1 },
      consumeClick: { x: clickX, y: clickY },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', undefined);
  });

  it('defeat: click on Retry button goes to gameplay', () => {
    const centerX = 1280 / 2;
    const button1X = centerX - 180 - 14;
    const clickX = button1X + 50;
    const clickY = 440 + 22;
    const ctx = createMockContext({
      sceneState: { victory: false, score: 500, lives: 0 },
      consumeClick: { x: clickX, y: clickY },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay', undefined);
  });

  it('defeat: click on Menu button goes to boot', () => {
    const centerX = 1280 / 2;
    const button2X = centerX + 14;
    const clickX = button2X + 50;
    const clickY = 440 + 22;
    const ctx = createMockContext({
      sceneState: { victory: false, score: 500, lives: 0 },
      consumeClick: { x: clickX, y: clickY },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('boot');
  });

  it('does not transition when no input', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 1000, lives: 1 },
    });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).not.toHaveBeenCalled();
  });

  it('draws dimmed overlay', () => {
    const ctx = createMockContext({
      sceneState: { victory: true, score: 0, lives: 0 },
    });
    scene.enter(ctx);
    scene.draw(ctx);
    expect(ctx.ctx.fillRect).toHaveBeenCalledWith(0, 0, 1280, 720);
  });
});

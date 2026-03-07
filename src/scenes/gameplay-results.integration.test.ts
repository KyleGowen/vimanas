/**
 * Integration test: Gameplay → Results (game over).
 * When ship takes lethal damage from enemy projectile, goToScene('results', { victory: false, ... }).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SparrowShip, SPARROW_SHIP_SIZE, SPARROW_STATS } from '../ships/sparrow-ship';
import { GameplayScene } from './gameplay-scene';
import type { GameContext } from './game';
import { EnemyProjectile } from '../projectiles/enemy-projectile';
import { createMockCanvasContext } from '../test-utils';

vi.mock('../config/gameplay-config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./config/gameplay-config')>();
  return {
    ...actual,
    DEFAULT_SHIP: 'sparrow' as const,
    createDefaultShip: () => new SparrowShip(),
    getDefaultShipSize: () => SPARROW_SHIP_SIZE,
    getDefaultShipMaxHp: () => SPARROW_STATS.hp,
    getDefaultShipMana: () => SPARROW_STATS.mana,
  };
});

function createMockContext(overrides?: Partial<GameContext>): GameContext {
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
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: vi.fn(),
    ...overrides,
  };
}

describe('Gameplay → Results (game over) integration', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('goToScene(results, victory: false) when ship dies from enemy projectile', () => {
    const goToScene = vi.fn();
    const scene = new GameplayScene();
    const ctx = createMockContext({ goToScene });
    scene.enter(ctx);

    scene.update(ctx);

    const state = scene as unknown as {
      ship: { x: number; y: number; stats: { hp: number } };
      enemyProjectiles: EnemyProjectile[];
      levelScroll: { getScrollOffset: () => number };
    };

    state.ship.stats.hp = 0.5;
    const scrollOffset = state.levelScroll.getScrollOffset();
    const shipCenterX = state.ship.x + SPARROW_SHIP_SIZE / 2;
    const shipCenterY = state.ship.y + SPARROW_SHIP_SIZE / 2;
    const worldY = scrollOffset + shipCenterY;

    const ep = new EnemyProjectile({
      x: shipCenterX,
      y: worldY,
      vx: 0,
      vy: 270,
      weaponStrength: 100,
      spawnTime: 0,
    });
    state.enemyProjectiles.push(ep);

    scene.update(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith(
      'results',
      expect.objectContaining({
        victory: false,
        score: expect.any(Number),
        lives: expect.any(Number),
      })
    );
  });
});

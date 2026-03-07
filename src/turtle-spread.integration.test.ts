/**
 * Integration tests for Turtle spread shot: secondary fire, mana, collision, lifetime.
 * Exercises the full chain: TurtleShip → fireTurtleSpread → TurtleSpreadPool → TurtleSpreadProjectile
 * → GameplayScene collision and despawn.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TurtleShip, TURTLE_SHIP_SIZE, TURTLE_STATS } from './ships/turtle-ship';
import { GameplayScene } from './scenes/gameplay-scene';
import type { GameContext } from './game';
import { TURTLE_SECONDARY_FIRE_RATE_S } from './weapons/turtle-secondary';
import { TURTLE_SPREAD_LIFETIME_S } from './projectiles/turtle-spread-projectile';
import { createMockCanvasContext } from './test-utils';

vi.mock('./config/gameplay-config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./config/gameplay-config')>();
  return {
    ...actual,
    DEFAULT_SHIP: 'turtle',
    createDefaultShip: () => new TurtleShip(),
    getDefaultShipSize: () => TURTLE_SHIP_SIZE,
    getDefaultShipMaxHp: () => TURTLE_STATS.hp,
    getDefaultShipMana: () => TURTLE_STATS.mana,
  };
});

function createMockContext(overrides?: Partial<GameContext>): GameContext {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = createMockCanvasContext();
  return {
    canvas,
    ctx,
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
    goToScene: () => {},
    ...overrides,
  };
}

describe('Turtle spread shot integration', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('secondary fire spawns spread projectiles and depletes mana', () => {
    const scene = new GameplayScene();
    const ctx = createMockContext({
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
        isFirePressed: () => false,
        isSecondaryFirePressed: () => true,
        isShieldPressed: () => false,
        isEscapePressed: () => false,
      } as GameContext['input'],
    });
    ctx.deltaTime = TURTLE_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    const state = scene as unknown as {
      ship: { currentMana: number };
      spreadProjectiles: unknown[];
    };
    const manaBefore = state.ship.currentMana;
    scene.update(ctx);
    expect(state.spreadProjectiles.length).toBeGreaterThan(0);
    expect(state.ship.currentMana).toBe(manaBefore - 5);
  });

  it('mana regenerates when secondary fire not held', () => {
    const scene = new GameplayScene();
    const ctx = createMockContext({
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
        isFirePressed: () => false,
        isSecondaryFirePressed: () => false,
        isShieldPressed: () => false,
        isEscapePressed: () => false,
      } as GameContext['input'],
    });
    ctx.deltaTime = 0.5;
    scene.enter(ctx);
    const state = scene as unknown as {
      ship: { currentMana: number };
    };
    state.ship.currentMana = 10;
    scene.update(ctx);
    expect(state.ship.currentMana).toBeGreaterThan(10);
  });

  it('spread projectiles despawn after lifetime', () => {
    const scene = new GameplayScene();
    let fireCount = 0;
    const ctx = createMockContext({
      input: {
        getMoveAxis: () => ({ x: 0, y: 0 }),
        isFirePressed: () => false,
        isSecondaryFirePressed: () => fireCount++ < 1,
        isShieldPressed: () => false,
        isEscapePressed: () => false,
      } as GameContext['input'],
    });
    ctx.deltaTime = TURTLE_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const state = scene as unknown as { spreadProjectiles: unknown[] };
    expect(state.spreadProjectiles.length).toBeGreaterThanOrEqual(1);
    ctx.deltaTime = 0.016;
    const framesToLifetime = Math.ceil((TURTLE_SPREAD_LIFETIME_S + 0.1) / 0.016);
    for (let i = 0; i < framesToLifetime; i++) {
      scene.update(ctx);
    }
    expect(state.spreadProjectiles.length).toBe(0);
  });
});

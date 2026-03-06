/**
 * Integration tests for the energy ring module: secondary fire, mana, collision, lifetime.
 * Exercises the full chain: SparrowShip → fireSparrowSecondary → EnergyRingPool → EnergyRingProjectile
 * → GameplayScene collision and despawn.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameplayScene } from './scenes/gameplay-scene';
import type { GameContext } from './game';
import type { ScoutEnemy } from './enemies/scout-enemy';
import { SPARROW_SECONDARY_FIRE_RATE_S } from './weapons/sparrow-secondary';
import { ENERGY_RING_LIFETIME_S } from './projectiles/energy-ring-projectile';
import { createMockCanvasContext } from './test-utils';

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

describe('Energy ring integration', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('secondary fire spawns ring and depletes mana', () => {
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
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    const state = scene as unknown as {
      ship: { currentMana: number };
      energyRings: unknown[];
    };
    const manaBefore = state.ship.currentMana;
    scene.update(ctx);
    expect(state.energyRings.length).toBeGreaterThan(0);
    expect(state.ship.currentMana).toBe(manaBefore - 1);
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

  it('ring despawns after lifetime', () => {
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
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const state = scene as unknown as { energyRings: unknown[] };
    expect(state.energyRings.length).toBe(1);
    ctx.deltaTime = 0.016;
    const framesToLifetime = Math.ceil((ENERGY_RING_LIFETIME_S + 0.1) / 0.016);
    for (let i = 0; i < framesToLifetime; i++) {
      scene.update(ctx);
    }
    expect(state.energyRings.length).toBe(0);
  });

  it('ring hitting scout applies damage and awards score', () => {
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
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const state = scene as unknown as {
      energyRings: { x: number; y: number }[];
      scouts: ScoutEnemy[];
      enemyPool: { get: (x: number, y: number) => ScoutEnemy | null };
      score: number;
    };
    expect(state.energyRings.length).toBe(1);
    const ring = state.energyRings[0];
    const scout = state.enemyPool.get(ring.x, ring.y - 30);
    expect(scout).not.toBeNull();
    if (scout) {
      state.scouts.push(scout);
    }
    const scoreBefore = state.score;
    for (let i = 0; i < 15; i++) {
      ctx.deltaTime = 0.05;
      scene.update(ctx);
    }
    expect(state.score).toBe(scoreBefore + 100);
  });
});

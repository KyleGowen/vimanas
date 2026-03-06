import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SparrowShip,
  SPARROW_SHIP_SIZE,
  SPARROW_STATS,
  SPARROW_SHIELD_MANA_PER_SECOND,
  SPARROW_SHIELD_DAMAGE_REDUCTION,
  type SparrowShipStats,
} from './sparrow-ship';
import { clearImageCache } from '../assets/asset-loader';
import { createMockCanvasContext } from '../test-utils';

function createMockContext() {
  const calls: { method: string; args?: unknown[] }[] = [];
  const ctx = {
    fillStyle: '',
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    save: () => {},
    restore: () => {},
    fillRect: (...args: unknown[]) => calls.push({ method: 'fillRect', args }),
    drawImage: (...args: unknown[]) => calls.push({ method: 'drawImage', args }),
    _calls: calls,
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe('SparrowShip', () => {
  beforeEach(() => {
    clearImageCache();
  });

  it('constructs with default stats', () => {
    const ship = new SparrowShip();
    expect(ship.stats).toEqual(SPARROW_STATS);
    expect(ship.x).toBe(0);
    expect(ship.y).toBe(0);
  });

  it('constructs with custom stats', () => {
    const custom: SparrowShipStats = {
      hp: 10,
      defense: 8,
      attack: 15,
      mana: 12,
      manaRegenRate: 3,
      speed: 40,
    };
    const ship = new SparrowShip(custom);
    expect(ship.stats).toEqual(custom);
  });

  it('SPARROW_SHIP_SIZE is 100 (64 base +30% +20% on-screen CEO)', () => {
    expect(SPARROW_SHIP_SIZE).toBe(100);
  });

  it('SPARROW_SHIELD_MANA_PER_SECOND is 1', () => {
    expect(SPARROW_SHIELD_MANA_PER_SECOND).toBe(1);
  });

  it('SPARROW_SHIELD_DAMAGE_REDUCTION is 0.5', () => {
    expect(SPARROW_SHIELD_DAMAGE_REDUCTION).toBe(0.5);
  });

  it('stats match design lock (HP 28 CEO doubled)', () => {
    expect(SPARROW_STATS.hp).toBe(28);
    expect(SPARROW_STATS.defense).toBe(12);
    expect(SPARROW_STATS.attack).toBe(20);
    expect(SPARROW_STATS.mana).toBe(19);
    expect(SPARROW_STATS.manaRegenRate).toBe(3);
    expect(SPARROW_STATS.speed).toBe(35);
  });

  it('initializes currentMana from stats.mana', () => {
    const ship = new SparrowShip();
    expect(ship.currentMana).toBe(19);
  });

  it('draws cyan fallback rect when not loaded', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 100;
    ship.y = 200;
    ship.draw(ctx);
    expect(ctx.fillStyle).toBe('#00FFFF');
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe('fillRect');
    expect(calls[0].args).toEqual([100, 200, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE]);
  });

  it('draws at position (x, y)', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 50;
    ship.y = 75;
    ship.draw(ctx);
    expect(calls[0].args).toEqual([50, 75, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE]);
  });

  it('draws at screen coords when provided (world Y → screen Y)', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 100;
    ship.y = 570; // world Y
    ship.draw(ctx, 100, 0); // screen Y = worldToScreenY(570) when scrollOffset=570
    expect(calls[0].args).toEqual([100, 0, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE]);
  });

  it('isLoaded returns false before load', () => {
    const ship = new SparrowShip();
    expect(ship.isLoaded()).toBe(false);
  });

  it('update moves ship by moveAxis * (speed * deltaTime * scale)', () => {
    const ship = new SparrowShip();
    ship.x = 100;
    ship.y = 200;
    const bounds = { minX: 0, maxX: 1280, minY: 0, maxY: 720 };
    ship.update({ x: 1, y: 0 }, 0.016, bounds);
    // speed 35 * 0.016 * 10 = 5.6 px per frame
    expect(ship.x).toBe(105.6);
    expect(ship.y).toBe(200);
  });

  it('update clamps position to bounds', () => {
    const ship = new SparrowShip();
    ship.x = 100;
    ship.y = 200;
    const bounds = { minX: 50, maxX: 150, minY: 100, maxY: 300 };
    ship.update({ x: 1, y: 0 }, 1, bounds); // large move would exceed maxX
    expect(ship.x).toBe(150);
    expect(ship.y).toBe(200);
  });

  it('update clamps when moving past min bounds', () => {
    const ship = new SparrowShip();
    ship.x = 60;
    ship.y = 150;
    const bounds = { minX: 50, maxX: 500, minY: 100, maxY: 400 };
    ship.update({ x: -1, y: 0 }, 1, bounds); // would go to 25
    expect(ship.x).toBe(50);
    expect(ship.y).toBe(150);
  });

  it('update uses custom speed when provided', () => {
    const ship = new SparrowShip({ hp: 14, defense: 12, attack: 20, mana: 19, manaRegenRate: 2, speed: 50 });
    ship.x = 0;
    ship.y = 0;
    const bounds = { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
    ship.update({ x: 1, y: 0 }, 0.016, bounds);
    // speed 50 * 0.016 * 10 = 8 px per frame
    expect(ship.x).toBe(8);
  });

  it('takeDamage reduces damage by 50% when shield active', () => {
    const ship = new SparrowShip();
    ship.shieldActive = true;
    ship.stats.hp = 20;
    const dead = ship.takeDamage(12); // 12/12 = 1 base, 0.5 with shield
    expect(ship.stats.hp).toBe(19.5);
    expect(dead).toBe(false);
  });

  it('takeDamage applies full damage when shield inactive', () => {
    const ship = new SparrowShip();
    ship.shieldActive = false;
    ship.stats.hp = 20;
    ship.takeDamage(12);
    expect(ship.stats.hp).toBe(19);
  });

  it('setShieldInput sets shieldActive when held and mana > 0', () => {
    const ship = new SparrowShip();
    ship.currentMana = 5;
    ship.setShieldInput(true);
    expect(ship.shieldActive).toBe(true);
    ship.setShieldInput(false);
    expect(ship.shieldActive).toBe(false);
  });

  it('setShieldInput sets shieldActive false when mana is 0', () => {
    const ship = new SparrowShip();
    ship.currentMana = 0;
    ship.setShieldInput(true);
    expect(ship.shieldActive).toBe(false);
  });

  it('consumeShieldMana drains mana at 1 per second', () => {
    const ship = new SparrowShip();
    ship.currentMana = 5;
    ship.consumeShieldMana(1);
    expect(ship.currentMana).toBe(4);
    ship.consumeShieldMana(0.5);
    expect(ship.currentMana).toBe(3.5);
  });

  it('consumeShieldMana clamps to 0', () => {
    const ship = new SparrowShip();
    ship.currentMana = 0.5;
    ship.consumeShieldMana(1);
    expect(ship.currentMana).toBe(0);
  });

  it('draw with shield active does not throw', () => {
    const ship = new SparrowShip();
    ship.shieldActive = true;
    ship.x = 100;
    ship.y = 200;
    const ctx = createMockCanvasContext();
    expect(() => ship.draw(ctx, 100, 200, 1.5)).not.toThrow();
  });

  it('draws shield glow before ship when shield active (draw order)', async () => {
    const instances: { onload: (() => void) | null }[] = [];
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        src = '';
        constructor() {
          instances.push(this as unknown as { onload: (() => void) | null });
        }
      }
    );
    const ctx = createMockCanvasContext();
    const drawImageSpy = vi.spyOn(ctx, 'drawImage');
    const ship = new SparrowShip();
    const loadPromise = ship.load();
    instances[0]!.onload!();
    await loadPromise;
    ship.shieldActive = true;
    ship.x = 50;
    ship.y = 60;
    ship.draw(ctx, 50, 60, 1);
    expect(drawImageSpy).toHaveBeenCalled();
    const calls = drawImageSpy.mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[0]).toEqual([expect.anything(), 50, 60, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE]);
    drawImageSpy.mockRestore();
  });

  it('draws sprite when loaded', async () => {
    const instances: { onload: (() => void) | null }[] = [];
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        src = '';
        constructor() {
          instances.push(this as unknown as { onload: (() => void) | null });
        }
      }
    );
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    const loadPromise = ship.load();
    instances[0]!.onload!();
    await loadPromise;
    ship.x = 10;
    ship.y = 20;
    ship.draw(ctx);
    expect(calls[0].method).toBe('drawImage');
    expect(calls[0].args).toEqual([expect.anything(), 10, 20, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE]);
  });
});

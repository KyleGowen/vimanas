import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SparrowShip, SPARROW_SHIP_SIZE, SPARROW_STATS, type SparrowShipStats } from './sparrow-ship';
import { clearImageCache } from '../assets/asset-loader';

function createMockContext() {
  const calls: { method: string; args: unknown[] }[] = [];
  const ctx = {
    fillStyle: '',
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
      speed: 40,
    };
    const ship = new SparrowShip(custom);
    expect(ship.stats).toEqual(custom);
  });

  it('SPARROW_SHIP_SIZE is 83 (64 base +30% CEO)', () => {
    expect(SPARROW_SHIP_SIZE).toBe(83);
  });

  it('stats match design lock (HP 28 CEO doubled)', () => {
    expect(SPARROW_STATS.hp).toBe(28);
    expect(SPARROW_STATS.defense).toBe(12);
    expect(SPARROW_STATS.attack).toBe(20);
    expect(SPARROW_STATS.mana).toBe(19);
    expect(SPARROW_STATS.speed).toBe(35);
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
    expect(calls[0].args).toEqual([100, 200, 83, 83]);
  });

  it('draws at position (x, y)', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 50;
    ship.y = 75;
    ship.draw(ctx);
    expect(calls[0].args).toEqual([50, 75, 83, 83]);
  });

  it('draws at screen coords when provided (world Y → screen Y)', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 100;
    ship.y = 570; // world Y
    ship.draw(ctx, 100, 0); // screen Y = worldToScreenY(570) when scrollOffset=570
    expect(calls[0].args).toEqual([100, 0, 83, 83]);
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
    const ship = new SparrowShip({ hp: 14, defense: 12, attack: 20, mana: 19, speed: 50 });
    ship.x = 0;
    ship.y = 0;
    const bounds = { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
    ship.update({ x: 1, y: 0 }, 0.016, bounds);
    // speed 50 * 0.016 * 10 = 8 px per frame
    expect(ship.x).toBe(8);
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
    expect(calls[0].args).toEqual([expect.anything(), 10, 20, 83, 83]);
  });
});

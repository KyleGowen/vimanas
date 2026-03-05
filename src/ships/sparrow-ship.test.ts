import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SparrowShip, SPARROW_STATS, type SparrowShipStats } from './sparrow-ship';
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

  it('stats match design lock', () => {
    expect(SPARROW_STATS.hp).toBe(14);
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
    expect(calls[0].args).toEqual([100, 200, 64, 64]);
  });

  it('draws at position (x, y)', () => {
    const { ctx, calls } = createMockContext();
    const ship = new SparrowShip();
    ship.x = 50;
    ship.y = 75;
    ship.draw(ctx);
    expect(calls[0].args).toEqual([50, 75, 64, 64]);
  });

  it('isLoaded returns false before load', () => {
    const ship = new SparrowShip();
    expect(ship.isLoaded()).toBe(false);
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
    expect(calls[0].args).toEqual([expect.anything(), 10, 20, 64, 64]);
  });
});

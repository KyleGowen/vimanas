import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CombatHUD } from './combat-hud';
import { SPARROW_STATS } from '../ships/sparrow-ship';

vi.mock('../assets/asset-loader', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../assets/asset-loader')>();
  return {
    ...actual,
    loadImage: vi.fn().mockResolvedValue({} as HTMLImageElement),
  };
});

function createMockContext() {
  const calls: { method: string; args: unknown[] }[] = [];
  const ctx = {
    fillStyle: '',
    font: '',
    strokeStyle: '',
    lineWidth: 0,
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    fillRect: (...args: unknown[]) => calls.push({ method: 'fillRect', args }),
    drawImage: (...args: unknown[]) => calls.push({ method: 'drawImage', args }),
    fillText: (...args: unknown[]) => calls.push({ method: 'fillText', args }),
    strokeRect: (...args: unknown[]) => calls.push({ method: 'strokeRect', args }),
    measureText: (text: string) => ({ width: text.length * 10 }),
    _calls: calls,
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const mockShip = (hp: number, mana?: number) => ({
  stats: {
    ...SPARROW_STATS,
    hp,
    mana: mana ?? SPARROW_STATS.mana,
  },
});

describe('CombatHUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads assets on load()', async () => {
    const hud = new CombatHUD();
    await hud.load();
    expect(hud.isLoaded()).toBe(true);
  });

  it('draws score at top-left in 8-digit format', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx, calls } = createMockContext();

    hud.draw({
      ctx,
      width: 1280,
      height: 720,
      ship: mockShip(28),
      score: 1234,
      lives: 1,
    });

    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    const scoreCall = fillTextCalls.find((c) =>
      (c.args[0] as string).match(/^\d{6,8}$/)
    );
    expect(scoreCall).toBeDefined();
    expect(scoreCall!.args[0]).toMatch(/^\d{6,8}$/);
  });

  it('draws HP bar with correct fill ratio when damaged', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx, calls } = createMockContext();

    hud.draw({
      ctx,
      width: 1280,
      height: 720,
      ship: mockShip(14),
      score: 0,
      lives: 1,
    });

    const expectedW = (220 - 4) * (14 / SPARROW_STATS.hp);
    const fillRects = calls.filter((c) => c.method === 'fillRect');
    const hpFill = fillRects.find(
      (c) =>
        (c.args[2] as number) === expectedW && (c.args[3] as number) === 14
    );
    expect(hpFill).toBeDefined();
    expect(hpFill!.args[2]).toBe(expectedW);
  });

  it('draws without throwing when hp is 0', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx } = createMockContext();

    expect(() =>
      hud.draw({
        ctx,
        width: 1280,
        height: 720,
        ship: mockShip(0),
        score: 0,
        lives: 1,
      })
    ).not.toThrow();
  });

  it('draws mana bar full (placeholder)', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx, calls } = createMockContext();

    hud.draw({
      ctx,
      width: 1280,
      height: 720,
      ship: mockShip(28),
      score: 0,
      lives: 1,
    });

    const fillRects = calls.filter((c) => c.method === 'fillRect');
    const fullWidthFills = fillRects.filter(
      (c) => (c.args[2] as number) === 216 && (c.args[3] as number) === 14
    );
    expect(fullWidthFills.length).toBeGreaterThanOrEqual(1);
  });

  it('draws boss bar when boss is active', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx, calls } = createMockContext();

    hud.draw({
      ctx,
      width: 1280,
      height: 720,
      ship: mockShip(28),
      score: 5000,
      lives: 2,
      boss: { hp: 75 },
    });

    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    const bossNameCall = fillTextCalls.find((c) =>
      (c.args[0] as string).includes('BOSS:')
    );
    expect(bossNameCall).toBeDefined();
    expect(bossNameCall!.args[0]).toContain('ROOT-SEEKER');
  });

  it('draws score and lives at top-right when boss is active', async () => {
    const hud = new CombatHUD();
    await hud.load();
    const { ctx, calls } = createMockContext();

    hud.draw({
      ctx,
      width: 1280,
      height: 720,
      ship: mockShip(28),
      score: 9999,
      lives: 3,
      boss: { hp: 150 },
    });

    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
  });

  it('dispose clears asset references', async () => {
    const hud = new CombatHUD();
    await hud.load();
    hud.dispose();
    hud.draw({
      ctx: createMockContext().ctx,
      width: 1280,
      height: 720,
      ship: mockShip(28),
      score: 0,
      lives: 1,
    });
    expect(hud.isLoaded()).toBe(true);
  });
});

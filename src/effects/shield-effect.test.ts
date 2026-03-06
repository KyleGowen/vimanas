import { describe, it, expect } from 'vitest';
import {
  drawShieldGlow,
  SPARROW_SHIELD_CONFIG,
  SPARROW_SHIELD_PALETTE,
  type ShieldEffectConfig,
} from './shield-effect';
import { createMockCanvasContext } from '../test-utils';

function createSpyContext() {
  const calls: { method: string; args?: unknown[] }[] = [];
  const base = createMockCanvasContext();
  return {
    ctx: new Proxy(base, {
      get(target, prop) {
        const val = (target as Record<string, unknown>)[prop];
        if (prop === 'drawImage') {
          return (...args: unknown[]) => {
            calls.push({ method: 'drawImage', args });
            (base.drawImage as (...a: unknown[]) => void)(...args);
          };
        }
        if (prop === 'arc') {
          return (...args: unknown[]) => {
            calls.push({ method: 'arc', args });
            (base.arc as (...a: unknown[]) => void)(...args);
          };
        }
        if (prop === 'fill') {
          return () => {
            calls.push({ method: 'fill' });
            (base.fill as () => void)();
          };
        }
        return typeof val === 'function' ? val.bind(target) : val;
      },
    }) as CanvasRenderingContext2D,
    calls,
  };
}

describe('drawShieldGlow', () => {
  it('does not throw with zero size', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawShieldGlow(ctx, 100, 200, 0, 0, 0, SPARROW_SHIELD_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with typical ship size', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawShieldGlow(ctx, 100, 200, 64, 64, 0.5, SPARROW_SHIELD_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with custom config', () => {
    const ctx = createMockCanvasContext();
    const config: ShieldEffectConfig = {
      palette: SPARROW_SHIELD_PALETTE,
      opacity: 0.15,
      radiusScale: 1.3,
    };
    expect(() =>
      drawShieldGlow(ctx, 50, 100, 64, 64, 1, config)
    ).not.toThrow();
  });

  it('does not throw with sprite (sprite-outline path)', () => {
    const ctx = createMockCanvasContext();
    const sprite = document.createElement('img');
    expect(() =>
      drawShieldGlow(ctx, 50, 100, 64, 64, 0.5, SPARROW_SHIELD_CONFIG, sprite)
    ).not.toThrow();
  });

  it('falls back to circle when sprite is null', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawShieldGlow(ctx, 50, 100, 64, 64, 0.5, SPARROW_SHIELD_CONFIG, null)
    ).not.toThrow();
  });

  it('falls back to circle when sprite is undefined (not passed)', () => {
    const { ctx, calls } = createSpyContext();
    drawShieldGlow(ctx, 50, 100, 64, 64, 0.5, SPARROW_SHIELD_CONFIG);
    expect(calls.some((c) => c.method === 'arc')).toBe(true);
    expect(calls.some((c) => c.method === 'fill')).toBe(true);
    expect(calls.some((c) => c.method === 'drawImage')).toBe(false);
  });

  it('uses sprite-outline path when sprite provided', () => {
    const { ctx, calls } = createSpyContext();
    const sprite = document.createElement('img');
    drawShieldGlow(ctx, 50, 100, 64, 64, 0.5, SPARROW_SHIELD_CONFIG, sprite);
    expect(calls.some((c) => c.method === 'drawImage')).toBe(true);
    const drawCall = calls.find((c) => c.method === 'drawImage');
    expect(drawCall?.args).toEqual([sprite, 50, 100, 64, 64]);
  });

  it('uses circle path when sprite is null', () => {
    const { ctx, calls } = createSpyContext();
    drawShieldGlow(ctx, 50, 100, 64, 64, 0.5, SPARROW_SHIELD_CONFIG, null);
    expect(calls.some((c) => c.method === 'arc')).toBe(true);
    expect(calls.some((c) => c.method === 'fill')).toBe(true);
  });

  it('uses config opacity and outlineBlur when provided', () => {
    const ctx = createMockCanvasContext();
    const config: ShieldEffectConfig = {
      palette: SPARROW_SHIELD_PALETTE,
      opacity: 0.5,
      outlineBlur: 24,
    };
    expect(() =>
      drawShieldGlow(ctx, 50, 100, 64, 64, 0, config, document.createElement('img'))
    ).not.toThrow();
  });
});

describe('presets', () => {
  it('SPARROW_SHIELD_PALETTE has cyan core and mid', () => {
    expect(SPARROW_SHIELD_PALETTE.core).toBe('#00FFFF');
    expect(SPARROW_SHIELD_PALETTE.mid).toBe('#0088CC');
  });

  it('SPARROW_SHIELD_PALETTE has transparent tip', () => {
    expect(SPARROW_SHIELD_PALETTE.tip).toBe('rgba(0, 100, 150, 0)');
  });

  it('SPARROW_SHIELD_CONFIG has full opacity', () => {
    expect(SPARROW_SHIELD_CONFIG.opacity).toBe(1);
  });

  it('SPARROW_SHIELD_CONFIG has outlineBlur and pulseFreq', () => {
    expect(SPARROW_SHIELD_CONFIG.outlineBlur).toBe(18);
    expect(SPARROW_SHIELD_CONFIG.pulseFreq).toBe(6);
  });
});

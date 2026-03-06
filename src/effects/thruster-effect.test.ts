import { describe, it, expect } from 'vitest';
import { SPARROW_SHIP_SIZE } from '../ships/sparrow-ship';
import {
  Thruster,
  drawThruster,
  SPARROW_THRUSTER_CONFIG,
  TURTLE_THRUSTER_CONFIG,
  WOLF_THRUSTER_CONFIG,
  DRAGON_THRUSTER_CONFIG,
  SCOUT_THRUSTER_CONFIG,
  THRUSTER_PALETTES,
  type ThrusterConfig,
} from './thruster-effect';
import { createMockCanvasContext } from '../test-utils';

describe('Thruster', () => {
  it('draw does not throw with preset config', () => {
    const ctx = createMockCanvasContext();
    const thruster = new Thruster(SPARROW_THRUSTER_CONFIG);
    expect(() =>
      thruster.draw(ctx, 100, 200, SPARROW_SHIP_SIZE, SPARROW_SHIP_SIZE, 1.5)
    ).not.toThrow();
  });

  it('draw does not throw with custom config', () => {
    const ctx = createMockCanvasContext();
    const config: ThrusterConfig = {
      palette: THRUSTER_PALETTES.dragon,
      widthRatio: 0.08,
      heightRatio: 0.3,
      originYOffset: 0.8,
    };
    const thruster = new Thruster(config);
    expect(() =>
      thruster.draw(ctx, 0, 0, 64, 64, 0)
    ).not.toThrow();
  });

  it('uses default values for omitted config', () => {
    const thruster = new Thruster({
      palette: THRUSTER_PALETTES.aether,
    });
    expect(thruster.drawOrder).toBe('inFront');
  });

  it('drawOrder returns config value', () => {
    const thrusterBehind = new Thruster({
      palette: THRUSTER_PALETTES.aether,
      drawOrder: 'behind',
    });
    expect(thrusterBehind.drawOrder).toBe('behind');
  });

  it('draw does not throw with direction up for enemies flying south', () => {
    const ctx = createMockCanvasContext();
    const thruster = new Thruster({
      palette: THRUSTER_PALETTES.scout,
      direction: 'up',
      originYOffset: 0.22,
    });
    expect(() => thruster.draw(ctx, 0, 0, 64, 64, 0)).not.toThrow();
  });

  it('draw does not throw with originXOffset for left/right placement', () => {
    const ctx = createMockCanvasContext();
    const thrusterLeft = new Thruster({
      palette: THRUSTER_PALETTES.scout,
      originXOffset: 0.25,
    });
    const thrusterRight = new Thruster({
      palette: THRUSTER_PALETTES.scout,
      originXOffset: 0.75,
    });
    expect(() => thrusterLeft.draw(ctx, 0, 0, 64, 64, 0)).not.toThrow();
    expect(() => thrusterRight.draw(ctx, 0, 0, 64, 64, 0)).not.toThrow();
  });
});

describe('drawThruster (legacy wrapper)', () => {
  it('does not throw', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawThruster(ctx, 50, 100, 83, 83, 2, { colorStyle: 'aether' })
    ).not.toThrow();
  });

  it('defaults to aether when options omitted', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawThruster(ctx, 0, 0, 64, 64, 0)
    ).not.toThrow();
  });
});

describe('presets', () => {
  it('SPARROW_THRUSTER_CONFIG has sparrow palette', () => {
    expect(SPARROW_THRUSTER_CONFIG.palette).toEqual(THRUSTER_PALETTES.sparrow);
    expect(SPARROW_THRUSTER_CONFIG.palette.core).toBe('#00FFFF');
  });

  it('SPARROW_THRUSTER_CONFIG has north scaling for moving-north thrust boost', () => {
    expect(SPARROW_THRUSTER_CONFIG.northWidthScale).toBe(1.15);
    expect(SPARROW_THRUSTER_CONFIG.northHeightScale).toBe(1.5);
  });

  it('SPARROW_THRUSTER_CONFIG has south scaling for moving-south thrust reduction', () => {
    expect(SPARROW_THRUSTER_CONFIG.southWidthScale).toBe(0.9);
    expect(SPARROW_THRUSTER_CONFIG.southHeightScale).toBe(0.75);
  });

  it('TURTLE_THRUSTER_CONFIG has turtle palette', () => {
    expect(TURTLE_THRUSTER_CONFIG.palette).toEqual(THRUSTER_PALETTES.turtle);
    expect(TURTLE_THRUSTER_CONFIG.palette.core).toBe('#FFBF00');
  });

  it('WOLF_THRUSTER_CONFIG has wolf palette', () => {
    expect(WOLF_THRUSTER_CONFIG.palette).toEqual(THRUSTER_PALETTES.wolf);
  });

  it('DRAGON_THRUSTER_CONFIG has dragon palette', () => {
    expect(DRAGON_THRUSTER_CONFIG.palette).toEqual(THRUSTER_PALETTES.dragon);
    expect(DRAGON_THRUSTER_CONFIG.palette.core).toBe('#FF4500');
  });

  it('SCOUT_THRUSTER_CONFIG has scout palette', () => {
    expect(SCOUT_THRUSTER_CONFIG.palette).toEqual(THRUSTER_PALETTES.scout);
    expect(SCOUT_THRUSTER_CONFIG.palette.core).toBe('#B8C900');
  });
});

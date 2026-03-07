import { describe, it, expect } from 'vitest';
import {
  THRUSTER_PALETTES,
  SPARROW_THRUSTER_CONFIG,
  TURTLE_THRUSTER_CONFIG,
  WOLF_THRUSTER_CONFIG,
  DRAGON_THRUSTER_CONFIG,
  SCOUT_THRUSTER_CONFIG,
} from './thruster-config';

describe('thruster-config', () => {
  describe('THRUSTER_PALETTES', () => {
    it('has palette for each ship type', () => {
      expect(THRUSTER_PALETTES.sparrow).toBeDefined();
      expect(THRUSTER_PALETTES.turtle).toBeDefined();
      expect(THRUSTER_PALETTES.wolf).toBeDefined();
      expect(THRUSTER_PALETTES.dragon).toBeDefined();
      expect(THRUSTER_PALETTES.scout).toBeDefined();
    });

    it('each palette has core, mid, tip', () => {
      for (const key of Object.keys(THRUSTER_PALETTES)) {
        const p = THRUSTER_PALETTES[key];
        expect(p.core).toBeDefined();
        expect(typeof p.core).toBe('string');
        expect(p.mid).toBeDefined();
        expect(typeof p.mid).toBe('string');
        expect(p.tip).toBeDefined();
        expect(typeof p.tip).toBe('string');
      }
    });
  });

  describe('ship thruster configs', () => {
    it('SPARROW_THRUSTER_CONFIG has palette and drawOrder', () => {
      expect(SPARROW_THRUSTER_CONFIG.palette).toBe(THRUSTER_PALETTES.sparrow);
      expect(SPARROW_THRUSTER_CONFIG.drawOrder).toBe('inFront');
    });

    it('TURTLE_THRUSTER_CONFIG has correct originYOffset', () => {
      expect(TURTLE_THRUSTER_CONFIG.originYOffset).toBe(0.84);
    });

    it('WOLF_THRUSTER_CONFIG has drawOrder behind', () => {
      expect(WOLF_THRUSTER_CONFIG.drawOrder).toBe('behind');
    });

    it('DRAGON_THRUSTER_CONFIG has direction down by default', () => {
      expect(DRAGON_THRUSTER_CONFIG.direction).toBe('down');
    });

    it('SCOUT_THRUSTER_CONFIG has direction up', () => {
      expect(SCOUT_THRUSTER_CONFIG.direction).toBe('up');
    });
  });
});

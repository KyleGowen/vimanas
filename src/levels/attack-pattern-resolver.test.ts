import { describe, it, expect } from 'vitest';
import {
  resolveAttackPatternToFormation,
  resolveAttackPatternToMovementBehavior,
  resolveAttackPatternsInSpec,
} from './attack-pattern-resolver';

describe('attack-pattern-resolver', () => {
  describe('resolveAttackPatternToFormation', () => {
    it('resolves "Wedge Assault" to v', () => {
      expect(resolveAttackPatternToFormation('Wedge Assault')).toBe('v');
      expect(resolveAttackPatternToFormation('  Wedge Assault  ')).toBe('v');
      expect(resolveAttackPatternToFormation('wedge assault')).toBe('v');
    });

    it('resolves "Pincer Assault" to pincer', () => {
      expect(resolveAttackPatternToFormation('Pincer Assault')).toBe('pincer');
      expect(resolveAttackPatternToFormation('pincer assault')).toBe('pincer');
    });

    it('resolves all 16 reference patterns to a formation', () => {
      expect(resolveAttackPatternToFormation('Zig-Zag Pressure')).toBe('line');
      expect(resolveAttackPatternToFormation('Scatter & Converge')).toBe('staggered_wedge');
      expect(resolveAttackPatternToFormation('Sniper Attack')).toBe('pincer');
    });

    it('returns null for unknown pattern name', () => {
      expect(resolveAttackPatternToFormation('Unknown Pattern')).toBeNull();
    });
  });

  describe('resolveAttackPatternToMovementBehavior', () => {
    it('resolves Wedge Assault to straight', () => {
      expect(resolveAttackPatternToMovementBehavior('Wedge Assault')).toBe('straight');
    });

    it('resolves Zig-Zag Pressure to zig_zag', () => {
      expect(resolveAttackPatternToMovementBehavior('Zig-Zag Pressure')).toBe('zig_zag');
    });

    it('resolves Scatter & Converge to scatter_converge', () => {
      expect(resolveAttackPatternToMovementBehavior('Scatter & Converge')).toBe('scatter_converge');
    });

    it('resolves Pincer Assault to pincer_swoop', () => {
      expect(resolveAttackPatternToMovementBehavior('Pincer Assault')).toBe('pincer_swoop');
    });

    it('resolves In & Out to swoop_in_out', () => {
      expect(resolveAttackPatternToMovementBehavior('In & Out')).toBe('swoop_in_out');
    });

    it('resolves Sniper Attack to sniper_pause', () => {
      expect(resolveAttackPatternToMovementBehavior('Sniper Attack')).toBe('sniper_pause');
    });

    it('resolves Dive Bombers to dive_arc', () => {
      expect(resolveAttackPatternToMovementBehavior('Dive Bombers')).toBe('dive_arc');
    });

    it('returns straight for unknown pattern', () => {
      expect(resolveAttackPatternToMovementBehavior('Unknown')).toBe('straight');
    });
  });

  describe('resolveAttackPatternsInSpec', () => {
    it('sets formation from attackPattern when mapping exists', () => {
      const spec = {
        waves: [
          { attackPattern: 'Wedge Assault', enemyType: 'scout', staggerSeconds: 0.6, betweenWaveDelaySeconds: 1 },
        ] as Array<{ formation?: 'v' | 'staggered_wedge' | 'pincer'; attackPattern?: string }>,
      };
      resolveAttackPatternsInSpec(spec);
      expect(spec.waves[0].formation).toBe('v');
    });

    it('sets formation from attackPattern for Zig-Zag Pressure to line', () => {
      const spec = {
        waves: [
          { attackPattern: 'Zig-Zag Pressure', enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 1 },
        ] as Array<{ formation?: 'v' | 'staggered_wedge' | 'pincer' | 'line'; attackPattern?: string }>,
      };
      resolveAttackPatternsInSpec(spec);
      expect(spec.waves[0].formation).toBe('line');
    });

    it('keeps existing formation when attackPattern is absent', () => {
      const spec = {
        waves: [
          { formation: 'staggered_wedge' as const, enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 1 },
        ] as Array<{ formation?: 'v' | 'staggered_wedge' | 'pincer'; attackPattern?: string }>,
      };
      resolveAttackPatternsInSpec(spec);
      expect(spec.waves[0].formation).toBe('staggered_wedge');
    });

    it('prefers resolved formation over existing when attackPattern is set', () => {
      const spec = {
        waves: [
          {
            formation: 'staggered_wedge',
            attackPattern: 'Pincer Assault',
            enemyType: 'scout',
            staggerSeconds: 0.6,
            betweenWaveDelaySeconds: 1,
          },
        ] as Array<{ formation?: 'v' | 'staggered_wedge' | 'pincer'; attackPattern?: string }>,
      };
      resolveAttackPatternsInSpec(spec);
      expect(spec.waves[0].formation).toBe('pincer');
    });
  });
});

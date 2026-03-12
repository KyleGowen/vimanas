import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadLevelSpec, loadLevelSpecSync, getLevelIdFromState } from './level-loader';
import type { LevelSpec } from './level-spec';

describe('level-loader', () => {
  describe('loadLevelSpecSync', () => {
    it('returns embedded level_1_forest spec', () => {
      const spec = loadLevelSpecSync('level_1_forest');
      expect(spec).not.toBeNull();
      expect(spec!.id).toBe('level_1_forest');
      expect(spec!.name).toBe('Level 1: Forest');
      expect(spec!.theme).toBe('forest');
      expect(spec!.difficulty).toBe('medium');
      expect(spec!.waves).toHaveLength(5);
      expect(spec!.boss.archetypeId).toBe('placeholder');
    });

    it('returns null for unknown level', () => {
      const spec = loadLevelSpecSync('level_99_unknown');
      expect(spec).toBeNull();
    });

    it('embedded level spec has correct wave formations', () => {
      const spec = loadLevelSpecSync('level_1_forest');
      expect(spec).not.toBeNull();
      expect(spec!.waves[0].formation).toBe('v');
      expect(spec!.waves[1].formation).toBe('staggered_wedge');
      expect(spec!.waves[2].formation).toBe('staggered_wedge');
      expect(spec!.waves[3].formation).toBe('pincer');
      expect(spec!.waves[4].formation).toBe('pincer');
    });

    it('embedded level spec has correct enemy types', () => {
      const spec = loadLevelSpecSync('level_1_forest');
      expect(spec).not.toBeNull();
      expect(spec!.waves.every((w) => w.enemyType === 'scout')).toBe(true);
    });

    it('embedded level spec has correct enemy style', () => {
      const spec = loadLevelSpecSync('level_1_forest');
      expect(spec).not.toBeNull();
      expect(spec!.enemyStyle).toBe('mixed');
    });
  });

  describe('loadLevelSpec', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns embedded level_1_forest without fetch', async () => {
      const spec = await loadLevelSpec('level_1_forest');
      expect(spec).not.toBeNull();
      expect(spec!.id).toBe('level_1_forest');
      expect(vi.mocked(fetch)).not.toHaveBeenCalled();
    });

    it('fetches level spec from /levels/{id}.json for non-embedded levels', async () => {
      const mockSpec: LevelSpec = {
        id: 'level_2_industrial',
        name: 'Level 2: Industrial',
        theme: 'industrial',
        difficulty: 'medium_hard',
        timing: { preMiniBossSeconds: null, preBossSeconds: null },
        waves: [
          { formation: 'v', enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 4 },
        ],
        enemyStyle: 'aggressive',
        boss: { archetypeId: 'conduit_crawler', hp: 200 },
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSpec),
      } as Response);

      const spec = await loadLevelSpec('level_2_industrial');
      expect(vi.mocked(fetch)).toHaveBeenCalledWith('/levels/level_2_industrial.json');
      expect(spec).not.toBeNull();
      expect(spec!.id).toBe('level_2_industrial');
    });

    it('returns null when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      const spec = await loadLevelSpec('level_99_nonexistent');
      expect(spec).toBeNull();
    });

    it('returns null when fetch throws', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      const spec = await loadLevelSpec('level_99_error');
      expect(spec).toBeNull();
    });

    it('returns null for invalid spec (missing id)', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ name: 'Test', theme: 'forest' }),
      } as Response);

      const spec = await loadLevelSpec('invalid_spec');
      expect(spec).toBeNull();
    });

    it('returns null for invalid theme', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'test',
            name: 'Test',
            theme: 'invalid_theme',
            difficulty: 'medium',
            timing: {},
            waves: [{ formation: 'v', enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 0 }],
            enemyStyle: 'mixed',
            boss: { archetypeId: 'test' },
          }),
      } as Response);

      const spec = await loadLevelSpec('invalid_theme');
      expect(spec).toBeNull();
    });

    it('returns null for invalid difficulty', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'test',
            name: 'Test',
            theme: 'forest',
            difficulty: 'invalid_difficulty',
            timing: {},
            waves: [{ formation: 'v', enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 0 }],
            enemyStyle: 'mixed',
            boss: { archetypeId: 'test' },
          }),
      } as Response);

      const spec = await loadLevelSpec('invalid_difficulty');
      expect(spec).toBeNull();
    });

    it('returns null for invalid wave formation', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'test',
            name: 'Test',
            theme: 'forest',
            difficulty: 'medium',
            timing: {},
            waves: [{ formation: 'invalid_formation', enemyType: 'scout', staggerSeconds: 0.5, betweenWaveDelaySeconds: 0 }],
            enemyStyle: 'mixed',
            boss: { archetypeId: 'test' },
          }),
      } as Response);

      const spec = await loadLevelSpec('invalid_formation');
      expect(spec).toBeNull();
    });

    it('returns null for empty waves array', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'test',
            name: 'Test',
            theme: 'forest',
            difficulty: 'medium',
            timing: {},
            waves: [],
            enemyStyle: 'mixed',
            boss: { archetypeId: 'test' },
          }),
      } as Response);

      const spec = await loadLevelSpec('empty_waves');
      expect(spec).toBeNull();
    });
  });

  describe('getLevelIdFromState', () => {
    it('returns levelId from state object', () => {
      const state = { levelId: 'level_2_industrial', shipId: 'sparrow' };
      expect(getLevelIdFromState(state)).toBe('level_2_industrial');
    });

    it('returns DEFAULT_LEVEL_ID when state is null', () => {
      expect(getLevelIdFromState(null)).toBe('level_1_forest');
    });

    it('returns DEFAULT_LEVEL_ID when state is undefined', () => {
      expect(getLevelIdFromState(undefined)).toBe('level_1_forest');
    });

    it('returns DEFAULT_LEVEL_ID when state has no levelId', () => {
      expect(getLevelIdFromState({ shipId: 'sparrow' })).toBe('level_1_forest');
    });

    it('returns DEFAULT_LEVEL_ID when levelId is not a string', () => {
      expect(getLevelIdFromState({ levelId: 123 })).toBe('level_1_forest');
    });
  });
});

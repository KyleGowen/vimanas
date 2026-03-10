/**
 * Level loader — Fetches and validates level spec from JSON.
 * Per docs/concepts/level_spec_schema.md. Extensibility: docs/context/LEVEL_SPEC.md
 */

import type { LevelSpec } from './level-spec';
import { DEFAULT_LEVEL_ID } from './level-spec';

const LEVELS_BASE = '/levels';

/** Embedded default for level_1_forest (matches public/levels/level_1_forest.json) */
const EMBEDDED_LEVEL_1_FOREST: LevelSpec = {
  id: 'level_1_forest',
  name: 'Level 1: Forest',
  theme: 'forest',
  difficulty: 'medium',
  timing: { preMiniBossSeconds: null, preBossSeconds: null },
  waves: [
    { formation: 'v', enemyType: 'scout', count: 5, staggerSeconds: 0.6, betweenWaveDelaySeconds: 4.5 },
    { formation: 'staggered_wedge', enemyType: 'scout', count: 7, staggerSeconds: 0.5, betweenWaveDelaySeconds: 3.75 },
    { formation: 'staggered_wedge', enemyType: 'scout', count: 7, staggerSeconds: 0.5, betweenWaveDelaySeconds: 3.25 },
    { formation: 'pincer', enemyType: 'scout', count: 6, staggerSeconds: 0.6, betweenWaveDelaySeconds: 3.0 },
    { formation: 'pincer', enemyType: 'scout', count: 6, staggerSeconds: 0.6, betweenWaveDelaySeconds: 0 },
  ],
  enemyStyle: 'mixed',
  miniboss: null,
  boss: { archetypeId: 'placeholder', hp: 100 },
};

/**
 * Load level spec synchronously. Returns embedded default for level_1_forest.
 * For other levels, returns null (use loadLevelSpec for async fetch).
 */
export function loadLevelSpecSync(levelId: string): LevelSpec | null {
  if (levelId === 'level_1_forest') {
    return EMBEDDED_LEVEL_1_FOREST;
  }
  return null;
}

/**
 * Load level spec from JSON. Fetches from /levels/{levelId}.json.
 * @param levelId - Level ID (e.g. level_1_forest)
 * @returns Parsed and validated LevelSpec, or null if fetch/parse fails
 */
export async function loadLevelSpec(levelId: string): Promise<LevelSpec | null> {
  if (levelId === 'level_1_forest') {
    return EMBEDDED_LEVEL_1_FOREST;
  }
  const path = `${LEVELS_BASE}/${levelId}.json`;
  try {
    const res = await fetch(path);
    if (!res.ok) {
      console.warn(`[LevelLoader] Failed to load ${path}: ${res.status}`);
      return null;
    }
    const raw = (await res.json()) as unknown;
    return validateLevelSpec(raw) ? (raw as LevelSpec) : null;
  } catch (e) {
    console.warn(`[LevelLoader] Error loading ${path}:`, e);
    return null;
  }
}

/**
 * Validate raw object as LevelSpec. Returns true if valid.
 */
function validateLevelSpec(raw: unknown): raw is LevelSpec {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string') return false;
  if (typeof o.name !== 'string') return false;
  if (!isThemeId(o.theme)) return false;
  if (!isDifficultyId(o.difficulty)) return false;
  if (!o.timing || typeof o.timing !== 'object') return false;
  if (!Array.isArray(o.waves) || o.waves.length === 0) return false;
  for (const w of o.waves) {
    if (!validateWaveConfig(w)) return false;
  }
  if (!isEnemyStyleId(o.enemyStyle)) return false;
  if (!o.boss || typeof o.boss !== 'object') return false;
  const boss = o.boss as Record<string, unknown>;
  if (typeof boss.archetypeId !== 'string') return false;
  return true;
}

function isThemeId(v: unknown): v is LevelSpec['theme'] {
  return v === 'forest' || v === 'industrial' || v === 'sky' || v === 'city_metropolis';
}

function isDifficultyId(v: unknown): v is LevelSpec['difficulty'] {
  return v === 'easy' || v === 'medium' || v === 'medium_hard' || v === 'hard';
}

function isEnemyStyleId(v: unknown): v is LevelSpec['enemyStyle'] {
  return v === 'aggressive' || v === 'defensive' || v === 'swarm' || v === 'mixed';
}

function validateWaveConfig(w: unknown): w is LevelSpec['waves'][0] {
  if (!w || typeof w !== 'object') return false;
  const o = w as Record<string, unknown>;
  if (o.formation !== 'v' && o.formation !== 'staggered_wedge' && o.formation !== 'pincer') return false;
  if (o.enemyType !== 'scout' && o.enemyType !== 'medium' && o.enemyType !== 'elite') return false;
  if (typeof o.staggerSeconds !== 'number') return false;
  if (typeof o.betweenWaveDelaySeconds !== 'number') return false;
  return true;
}

/**
 * Get level ID from scene state. Defaults to DEFAULT_LEVEL_ID.
 */
export function getLevelIdFromState(state: unknown): string {
  if (state && typeof state === 'object' && 'levelId' in state && typeof (state as { levelId: unknown }).levelId === 'string') {
    return (state as { levelId: string }).levelId;
  }
  return DEFAULT_LEVEL_ID;
}

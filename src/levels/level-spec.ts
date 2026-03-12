/**
 * Level spec types per docs/concepts/level_spec_schema.md
 *
 * Extensible: when adding new themes, formations, enemy types, or top-level fields,
 * update: level_spec_schema.md §10, docs/context/LEVEL_SPEC.md, level-spec.schema.json,
 * level-loader.ts validation, and consumers (wave-spawner, theme-layers, gameplay-scene).
 */

export type ThemeId = 'forest' | 'industrial' | 'sky' | 'city_metropolis' | 'volcano';
export type DifficultyId = 'easy' | 'medium' | 'medium_hard' | 'hard';
export type FormationType = 'v' | 'staggered_wedge' | 'pincer';
export type EnemyTypeId = 'scout' | 'medium' | 'elite';
export type EnemyStyleId = 'aggressive' | 'defensive' | 'swarm' | 'mixed';
export type SpawnEdge = 'top' | 'left' | 'right';

export interface SpawnFromConfig {
  edge?: SpawnEdge;
  position?: number;
}

export interface LevelTimingConfig {
  preMiniBossSeconds?: number | null;
  preBossSeconds?: number | null;
  /** Mini-boss spawns after N waves complete. Null = not wave-triggered. */
  preMiniBossWaves?: number | null;
  /** Boss spawns after N waves complete. Null = not wave-triggered (uses time or all-waves-complete). */
  preBossWaves?: number | null;
}

export interface WaveConfig {
  formation: FormationType;
  enemyType: EnemyTypeId;
  count?: number;
  squads?: number;
  enemiesPerSquad?: number;
  staggerSeconds: number;
  betweenWaveDelaySeconds: number;
  /** Optional. Where on screen the wave appears. Omit = top center. */
  spawnFrom?: SpawnFromConfig;
  /** Optional. CEO suggestion for this wave. Specialist considers when designing; game ignores. */
  suggestion?: string;
}

export interface BossConfig {
  archetypeId: string;
  hp?: number;
  phases?: number;
}

export interface MinibossConfig {
  archetypeId: string;
  hp?: number;
}

export interface LevelSpec {
  id: string;
  name: string;
  theme: ThemeId;
  difficulty: DifficultyId;
  timing: LevelTimingConfig;
  waves: WaveConfig[];
  enemyStyle: EnemyStyleId;
  miniboss?: MinibossConfig | null;
  boss: BossConfig;
  /** Optional. CEO suggestions for specialist when creating/revising. Game ignores at runtime. */
  designNotes?: string;
}

/** Default level ID when none specified */
export const DEFAULT_LEVEL_ID = 'level_1_forest';

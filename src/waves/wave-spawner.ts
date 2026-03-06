/**
 * WaveSpawner — Spawns waves of Scouts in sequence per wave_design_spec.md.
 * Uses EnemyPool.get(x, y); no allocations. Stagger timers use real time.
 */

import type { ScoutEnemy } from '../enemies/scout-enemy';
import { SCOUT_SIZE } from '../enemies/scout-enemy';
import type { EnemyPool } from '../pools/enemy-pool';

/** Formation types per wave_design_spec */
export type FormationType = 'v' | 'staggered_wedge' | 'pincer';

/** Spawn position for a Scout in a formation */
export interface SpawnPosition {
  x: number;
  y: number;
  /** Relative spawn time in seconds from wave start (for stagger) */
  spawnOffset: number;
}

/**
 * Per-transition between-wave delays per wave_sequence_design.md.
 * Level 1: 3 waves. 1→2: 4.5s, 2→3: 3.75s.
 * Wave 3 complete → level_waves_complete (immediate).
 */
export function getBetweenWaveDelaySeconds(waveIndex: number): number {
  if (waveIndex === 1) return 4.5;
  if (waveIndex === 2) return 3.75;
  return 0; // wave 3 complete → level_waves_complete (immediate)
}

/** Stagger delays per formation (CEO 2026-03-05: loosened for clearer target separation) */
const STAGGER_V = 0.6;
const STAGGER_STAGGERED_WEDGE = 0.5;
const STAGGER_PINCER = 0.6;
const PINCER_WING_OFFSET = 0.3;

/** Formation layout constants per wave_design_spec (CEO 2026-03-05: formations loosened ~50%) */
const V_LATERAL = 60;
const V_DEPTH = 36;
const V_LEADER_AHEAD = 48;
const WEDGE_ROW_DEPTH = 54;
const WEDGE_LATERAL = 72;
const PINCER_LATERAL = 60;
const PINCER_DEPTH = 42;
const PINCER_WING_SEPARATION = 240;

/**
 * Compute spawn positions for V formation (5 Scouts).
 * Leader at apex; 2 per wing. Wing spacing 60 px lateral, 36 px depth; leader 48 px ahead.
 */
export function getVFormationPositions(centerX: number, spawnY: number): SpawnPosition[] {
  // Leader 32 px ahead of wing tips. Wing tips at depth 32 from leader.
  // Wing scouts: first at 24 depth, second (wing tip) at 32 depth.
  const positions: SpawnPosition[] = [
    { x: centerX, y: spawnY, spawnOffset: 0 },
    { x: centerX - V_LATERAL, y: spawnY + V_DEPTH, spawnOffset: STAGGER_V },
    { x: centerX - V_LATERAL * 2, y: spawnY + V_LEADER_AHEAD, spawnOffset: STAGGER_V * 2 },
    { x: centerX + V_LATERAL, y: spawnY + V_DEPTH, spawnOffset: STAGGER_V * 3 },
    { x: centerX + V_LATERAL * 2, y: spawnY + V_LEADER_AHEAD, spawnOffset: STAGGER_V * 4 },
  ];
  return positions;
}

/**
 * Compute spawn positions for Staggered Wedge (7 Scouts).
 * 1 leader, 2 rows of 3. Row spacing 54 px; lateral 72 px between outer wings.
 */
export function getStaggeredWedgePositions(centerX: number, spawnY: number): SpawnPosition[] {
  const halfLateral = WEDGE_LATERAL / 2;
  const positions: SpawnPosition[] = [
    { x: centerX, y: spawnY, spawnOffset: 0 },
    { x: centerX - halfLateral, y: spawnY + WEDGE_ROW_DEPTH, spawnOffset: STAGGER_STAGGERED_WEDGE },
    { x: centerX, y: spawnY + WEDGE_ROW_DEPTH, spawnOffset: STAGGER_STAGGERED_WEDGE * 2 },
    { x: centerX + halfLateral, y: spawnY + WEDGE_ROW_DEPTH, spawnOffset: STAGGER_STAGGERED_WEDGE * 3 },
    { x: centerX - halfLateral, y: spawnY + WEDGE_ROW_DEPTH * 2, spawnOffset: STAGGER_STAGGERED_WEDGE * 4 },
    { x: centerX, y: spawnY + WEDGE_ROW_DEPTH * 2, spawnOffset: STAGGER_STAGGERED_WEDGE * 5 },
    { x: centerX + halfLateral, y: spawnY + WEDGE_ROW_DEPTH * 2, spawnOffset: STAGGER_STAGGERED_WEDGE * 6 },
  ];
  return positions;
}

/**
 * Compute spawn positions for Pincer (6 Scouts).
 * 2 wings of 3. Each wing: leader + 2 behind; 60 px lateral, 42 px depth. Wings 240 px apart.
 * Stagger 0.6 s per Scout within wing; wings 0.3 s apart.
 */
export function getPincerPositions(centerX: number, spawnY: number): SpawnPosition[] {
  const halfSep = PINCER_WING_SEPARATION / 2;
  const leftCenter = centerX - halfSep;
  const rightCenter = centerX + halfSep;

  // Left wing: leader, scout2, scout3. Right wing: same, offset 0.2s.
  const left: SpawnPosition[] = [
    { x: leftCenter, y: spawnY, spawnOffset: 0 },
    { x: leftCenter - PINCER_LATERAL, y: spawnY + PINCER_DEPTH, spawnOffset: STAGGER_PINCER },
    { x: leftCenter - PINCER_LATERAL * 2, y: spawnY + PINCER_DEPTH * 2, spawnOffset: STAGGER_PINCER * 2 },
  ];
  const right: SpawnPosition[] = [
    { x: rightCenter, y: spawnY, spawnOffset: PINCER_WING_OFFSET },
    { x: rightCenter + PINCER_LATERAL, y: spawnY + PINCER_DEPTH, spawnOffset: PINCER_WING_OFFSET + STAGGER_PINCER },
    { x: rightCenter + PINCER_LATERAL * 2, y: spawnY + PINCER_DEPTH * 2, spawnOffset: PINCER_WING_OFFSET + STAGGER_PINCER * 2 },
  ];

  // Interleave by spawn time
  const combined = [...left, ...right].sort((a, b) => a.spawnOffset - b.spawnOffset);
  return combined;
}

/**
 * Get formation type for wave index (1-based).
 */
export function getFormationForWave(waveIndex: number): FormationType {
  if (waveIndex === 1) return 'v';
  if (waveIndex <= 3) return 'staggered_wedge';
  return 'pincer';
}

/**
 * Get spawn positions for a wave. Center formation at top of screen.
 */
export function getFormationPositions(
  formation: FormationType,
  centerX: number,
  spawnY: number
): SpawnPosition[] {
  switch (formation) {
    case 'v':
      return getVFormationPositions(centerX, spawnY);
    case 'staggered_wedge':
      return getStaggeredWedgePositions(centerX, spawnY);
    case 'pincer':
      return getPincerPositions(centerX, spawnY);
    default:
      return getVFormationPositions(centerX, spawnY);
  }
}

/** State of the wave spawner */
export type WaveSpawnerState = 'spawning' | 'wave_active' | 'between_wave' | 'level_waves_complete';

export interface WaveSpawnerCallbacks {
  onScoutSpawned: (scout: ScoutEnemy) => void;
  onWaveComplete: (waveIndex: number) => void;
  onLevelWavesComplete?: () => void;
}

/**
 * WaveSpawner — Manages wave sequence, formation positions, stagger timing, between-wave delay.
 * Call update() each frame. Use get() for EnemyPool; pass spawned scouts to callback.
 * Call notifyScoutDied() when a Scout from the current wave is destroyed.
 */
export class WaveSpawner {
  private readonly enemyPool: EnemyPool;
  private readonly callbacks: WaveSpawnerCallbacks;
  private waveIndex = 1;
  private state: WaveSpawnerState = 'spawning';
  private waveScoutCount = 0;
  private spawnPositions: SpawnPosition[] = [];
  private nextSpawnIndex = 0;
  private nextSpawnTime = 0;
  private betweenWaveEndTime = 0;
  private screenWidth = 1280;
  private screenHeight = 720;
  /** World Y for formation spawn (above viewport). Set via setSpawnWorldY before update. */
  private spawnWorldY = 0;
  private waveStartTime = 0;
  /** Game time (pauses with game); used for stagger and between-wave timing */
  private gameTime = 0;

  constructor(enemyPool: EnemyPool, callbacks: WaveSpawnerCallbacks) {
    this.enemyPool = enemyPool;
    this.callbacks = callbacks;
  }

  /**
   * Configure screen dimensions. Center formation at top. Call before first update.
   */
  setScreenSize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Set world Y for spawning formations (above viewport). Call each frame before update.
   */
  setSpawnWorldY(worldY: number): void {
    this.spawnWorldY = worldY;
  }

  /**
   * Start wave 1. Call on scene enter.
   */
  start(): void {
    this.waveIndex = 1;
    this.beginWave();
  }

  /**
   * Reset to wave 1 and begin spawning. Call on scene re-enter.
   * Pass gameTime (e.g. 0) so stagger timing starts correctly after restart.
   */
  reset(gameTime = 0): void {
    this.waveIndex = 1;
    this.state = 'spawning';
    this.waveScoutCount = 0;
    this.nextSpawnIndex = 0;
    this.gameTime = gameTime;
    this.beginWave();
  }

  private beginWave(): void {
    const formation = getFormationForWave(this.waveIndex);
    const centerX = this.screenWidth / 2 - SCOUT_SIZE / 2;
    this.spawnPositions = getFormationPositions(formation, centerX, this.spawnWorldY);
    this.waveScoutCount = this.spawnPositions.length;
    this.nextSpawnIndex = 0;
    this.waveStartTime = this.gameTime;
    this.nextSpawnTime = this.waveStartTime + (this.spawnPositions[0]?.spawnOffset ?? 0);
    this.state = 'spawning';
  }

  /**
   * Call when a Scout from the current wave is destroyed or goes offscreen.
   * Wave complete when all Scouts are either destroyed or offscreen.
   */
  notifyScoutDied(): void {
    this.waveScoutCount = Math.max(0, this.waveScoutCount - 1);
  }

  /**
   * Update wave spawner. Returns scouts to add to scene (caller uses EnemyPool.get).
   * Uses gameTime (pauses with game) for stagger and between-wave delay.
   */
  update(gameTime: number): ScoutEnemy[] {
    this.gameTime = gameTime;
    const spawned: ScoutEnemy[] = [];

    if (this.state === 'spawning') {
      while (
        this.nextSpawnIndex < this.spawnPositions.length &&
        gameTime >= this.nextSpawnTime
      ) {
        const pos = this.spawnPositions[this.nextSpawnIndex];
        const scout = this.enemyPool.get(pos.x, pos.y);
        if (scout) {
          spawned.push(scout);
          this.callbacks.onScoutSpawned(scout);
        }
        this.nextSpawnIndex++;
        const nextPos = this.spawnPositions[this.nextSpawnIndex];
        this.nextSpawnTime = nextPos
          ? this.waveStartTime + nextPos.spawnOffset
          : Infinity;
      }
      if (this.nextSpawnIndex >= this.spawnPositions.length) {
        this.state = 'wave_active';
      }
    }

    if (this.state === 'wave_active') {
      if (this.waveScoutCount <= 0) {
        this.callbacks.onWaveComplete(this.waveIndex);
        this.betweenWaveEndTime = gameTime + getBetweenWaveDelaySeconds(this.waveIndex);
        this.state = 'between_wave';
      }
    }

    if (this.state === 'between_wave') {
      if (gameTime >= this.betweenWaveEndTime) {
        if (this.waveIndex < 3) {
          this.waveIndex++;
          this.beginWave();
        } else {
          this.state = 'level_waves_complete';
          this.callbacks.onLevelWavesComplete?.();
        }
      }
    }

    return spawned;
  }

  get currentWaveIndex(): number {
    return this.waveIndex;
  }

  get currentState(): WaveSpawnerState {
    return this.state;
  }

  get waveScoutsRemaining(): number {
    return this.waveScoutCount;
  }
}

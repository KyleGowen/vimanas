import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  WaveSpawner,
  getBetweenWaveDelaySeconds,
  getVFormationPositions,
  getStaggeredWedgePositions,
  getPincerPositions,
  getFormationForWave,
  getFormationPositions,
} from './wave-spawner';
import { EnemyPool } from '../pools/enemy-pool';
import { SCOUT_SIZE } from '../enemies/scout-enemy';

vi.mock('../assets/asset-loader', () => ({
  loadImage: vi.fn().mockResolvedValue({} as HTMLImageElement),
}));

describe('WaveSpawner formation positions', () => {
  const centerX = 640;
  const spawnY = 50;

  describe('getVFormationPositions', () => {
    it('returns 5 positions for V formation', () => {
      const positions = getVFormationPositions(centerX, spawnY);
      expect(positions).toHaveLength(5);
    });

    it('leader at center and spawnY', () => {
      const positions = getVFormationPositions(centerX, spawnY);
      expect(positions[0]).toEqual({ x: centerX, y: spawnY, spawnOffset: 0 });
    });

    it('wing scouts have correct lateral spacing (60 px)', () => {
      const positions = getVFormationPositions(centerX, spawnY);
      expect(positions[1].x).toBe(centerX - 60);
      expect(positions[3].x).toBe(centerX + 60);
    });

    it('stagger offsets increase by 0.6 s', () => {
      const positions = getVFormationPositions(centerX, spawnY);
      expect(positions[0].spawnOffset).toBe(0);
      expect(positions[1].spawnOffset).toBe(0.6);
      expect(positions[2].spawnOffset).toBe(1.2);
    });
  });

  describe('getStaggeredWedgePositions', () => {
    it('returns 7 positions', () => {
      const positions = getStaggeredWedgePositions(centerX, spawnY);
      expect(positions).toHaveLength(7);
    });

    it('leader at center', () => {
      const positions = getStaggeredWedgePositions(centerX, spawnY);
      expect(positions[0].x).toBe(centerX);
      expect(positions[0].y).toBe(spawnY);
    });

    it('row spacing 54 px depth', () => {
      const positions = getStaggeredWedgePositions(centerX, spawnY);
      expect(positions[1].y).toBe(spawnY + 54);
      expect(positions[4].y).toBe(spawnY + 108);
    });

    it('stagger offsets increase by 0.5 s', () => {
      const positions = getStaggeredWedgePositions(centerX, spawnY);
      expect(positions[0].spawnOffset).toBe(0);
      expect(positions[1].spawnOffset).toBe(0.5);
    });
  });

  describe('getPincerPositions', () => {
    it('returns 6 positions', () => {
      const positions = getPincerPositions(centerX, spawnY);
      expect(positions).toHaveLength(6);
    });

    it('wings 240 px apart', () => {
      const positions = getPincerPositions(centerX, spawnY);
      const leftX = positions.find((p) => p.x < centerX)?.x ?? 0;
      const rightX = positions.find((p) => p.x > centerX)?.x ?? 0;
      expect(rightX - leftX).toBe(240);
    });

    it('positions sorted by spawn offset (interleaved wings)', () => {
      const positions = getPincerPositions(centerX, spawnY);
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i].spawnOffset).toBeGreaterThanOrEqual(positions[i - 1].spawnOffset);
      }
    });
  });

  describe('getFormationForWave', () => {
    it('wave 1 is V', () => {
      expect(getFormationForWave(1)).toBe('v');
    });
    it('wave 2-3 is staggered_wedge', () => {
      expect(getFormationForWave(2)).toBe('staggered_wedge');
      expect(getFormationForWave(3)).toBe('staggered_wedge');
    });
    it('wave 4+ is pincer', () => {
      expect(getFormationForWave(4)).toBe('pincer');
      expect(getFormationForWave(5)).toBe('pincer');
    });
  });

  describe('getFormationPositions', () => {
    it('delegates to correct formation', () => {
      expect(getFormationPositions('v', centerX, spawnY)).toHaveLength(5);
      expect(getFormationPositions('staggered_wedge', centerX, spawnY)).toHaveLength(7);
      expect(getFormationPositions('pincer', centerX, spawnY)).toHaveLength(6);
    });
  });

  describe('getBetweenWaveDelaySeconds', () => {
    it('returns per-transition delays (level 1: 5 waves per wave_sequence_design)', () => {
      expect(getBetweenWaveDelaySeconds(1)).toBe(4.5);
      expect(getBetweenWaveDelaySeconds(2)).toBe(3.75);
      expect(getBetweenWaveDelaySeconds(3)).toBe(3.25);
      expect(getBetweenWaveDelaySeconds(4)).toBe(3.0);
      expect(getBetweenWaveDelaySeconds(5)).toBe(0); // wave 5 complete → level_waves_complete
    });
  });
});

describe('WaveSpawner', () => {
  let pool: EnemyPool;
  let spawner: WaveSpawner;
  const onScoutSpawned = vi.fn();
  const onWaveComplete = vi.fn();
  const onLevelWavesComplete = vi.fn();

  beforeEach(async () => {
    vi.useFakeTimers();
    pool = new EnemyPool(20);
    await pool.prewarm();
    onScoutSpawned.mockClear();
    onWaveComplete.mockClear();
    onLevelWavesComplete.mockClear();
    spawner = new WaveSpawner(pool, {
      onScoutSpawned,
      onWaveComplete,
      onLevelWavesComplete,
    });
    spawner.setScreenSize(1280, 720);
  });

  it('starts in spawning state', () => {
    spawner.start();
    expect(spawner.currentState).toBe('spawning');
    expect(spawner.currentWaveIndex).toBe(1);
  });

  it('spawns scouts with stagger timing (uses gameTime)', async () => {
    spawner.start();
    const gameTime = 0;
    const spawned0 = spawner.update(gameTime);
    expect(spawned0.scouts).toHaveLength(1); // Leader spawns immediately
    expect(spawner.currentState).toBe('spawning');

    vi.advanceTimersByTime(599); // 0.599 s - not yet (stagger 0.6 s)
    const spawned1 = spawner.update(0.599);
    expect(spawned1.scouts).toHaveLength(0);

    vi.advanceTimersByTime(2); // 0.601 s total
    const spawned2 = spawner.update(0.601);
    expect(spawned2.scouts).toHaveLength(1);

    vi.advanceTimersByTime(600); // 1.201 s
    const spawned3 = spawner.update(1.201);
    expect(spawned3.scouts).toHaveLength(1);
  });

  it('spawns all 5 scouts for wave 1 (V)', async () => {
    spawner.start();
    let total = 0;
    for (let t = 0; t < 3; t += 0.016) {
      const s = spawner.update(t);
      total += s.scouts.length;
    }
    vi.advanceTimersByTime(2500); // Allow all stagger delays
    for (let t = 2.5; t < 5; t += 0.016) {
      const s = spawner.update(t);
      total += s.scouts.length;
    }
    expect(total).toBe(5);
    expect(spawner.currentState).toBe('wave_active');
  });

  it('detects wave complete when all scouts destroyed', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 3; t += 0.016) {
      const r = spawner.update(t);
      scouts.push(...r.scouts);
    }
    vi.advanceTimersByTime(2500);
    for (let t = 2.5; t < 5; t += 0.016) {
      const r = spawner.update(t);
      scouts.push(...r.scouts);
    }
    expect(scouts).toHaveLength(5);

    for (const scout of scouts) {
      if (scout) spawner.notifyScoutDied();
    }
    spawner.update(5);
    expect(onWaveComplete).toHaveBeenCalledWith(1);
  });

  it('transitions to between_wave after wave complete', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 5; t += 0.1) {
      const r = spawner.update(t);
      scouts.push(...r.scouts);
    }
    for (const s of scouts) {
      if (s) spawner.notifyScoutDied();
    }
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');
  });

  it('spawns next wave after per-transition between-wave delay (1→2: 4.5s)', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 5; t += 0.1) {
      const r = spawner.update(t); scouts.push(...r.scouts);
    }
    for (const s of scouts) {
      if (s) spawner.notifyScoutDied();
    }
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');

    // 1→2 delay is 4.5s. At gameTime 9.5, delay not yet elapsed (5.1 + 4.5 = 9.6)
    const spawnedBefore = spawner.update(9.5);
    expect(spawner.currentWaveIndex).toBe(1);
    expect(spawner.currentState).toBe('between_wave');
    expect(spawnedBefore.scouts.length).toBe(0);

    // At gameTime 9.6, delay elapsed
    vi.advanceTimersByTime(100);
    const spawned = spawner.update(9.6);
    expect(spawner.currentWaveIndex).toBe(2);
    expect(spawner.currentState).toBe('spawning');
    expect(spawned.scouts.length).toBeGreaterThanOrEqual(0);
  });

  it('uses correct delay for 2→3 transition (3.75s)', async () => {
    spawner.start();
    spawner.setSpawnWorldY(0);
    // Complete wave 1 (5 scouts)
    const w1Scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 5; t += 0.1) {
      const rt = spawner.update(t);
      w1Scouts.push(...rt.scouts);
    }
    const r5 = spawner.update(5); w1Scouts.push(...r5.scouts);
    for (const s of w1Scouts) if (s) spawner.notifyScoutDied();
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');

    // Advance to 9.6 to spawn wave 2 (1→2 delay 4.5s)
    for (let t = 5.1; t < 9.6; t += 0.1) spawner.update(t);
    const w2Scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 9.6; t < 14; t += 0.1) {
      const rt = spawner.update(t);
      w2Scouts.push(...rt.scouts);
    }
    for (const s of w2Scouts) if (s) spawner.notifyScoutDied();
    spawner.update(14.1);
    expect(onWaveComplete).toHaveBeenCalledWith(2);
    expect(spawner.currentState).toBe('between_wave');

    // 2→3 delay is 3.75s. betweenWaveEndTime = 14.1 + 3.75 = 17.85
    spawner.update(17.8);
    expect(spawner.currentWaveIndex).toBe(2);
    spawner.update(17.86);
    expect(spawner.currentWaveIndex).toBe(3);
  });

  it('caps at 5 waves (fallback): when wave 5 completes, calls onLevelWavesComplete', async () => {
    spawner.start();
    spawner.setSpawnWorldY(0);

    let t = 0;
    for (let i = 0; i < 600; i++) {
      const spawned = spawner.update(t);
      for (const s of spawned.scouts) {
        if (s) {
          spawner.notifyScoutDied();
          pool.return(s);
        }
      }
      t += 0.1;
    }

    expect(onLevelWavesComplete).toHaveBeenCalledTimes(1);
    expect(spawner.currentState).toBe('level_waves_complete');
    expect(spawner.currentWaveIndex).toBe(5);
  });

  it('pause: gameTime frozen so between-wave does not fire', async () => {
    // Simulate: wave 1 complete at gameTime 5.1, between-wave until 9.6
    spawner.start();
    for (let t = 0; t < 5; t += 0.1) spawner.update(t);
    const result = spawner.update(5);
    for (const s of result.scouts) if (s) spawner.notifyScoutDied();
    for (let i = 0; i < 4; i++) spawner.notifyScoutDied();
    spawner.notifyScoutDied();
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');

    // If gameTime stayed at 5.1 (simulating pause), wave 2 should NOT spawn
    // Even after "real" time passes, gameTime 5.1 means we're still in between_wave
    vi.advanceTimersByTime(5000);
    spawner.update(5.1); // gameTime frozen
    expect(spawner.currentWaveIndex).toBe(1);
    expect(spawner.currentState).toBe('between_wave');

    // When gameTime advances to 9.6, wave 2 spawns
    spawner.update(9.6);
    expect(spawner.currentWaveIndex).toBe(2);
  });

  it('centers formation at screen width and uses spawn world Y', async () => {
    spawner.setScreenSize(1280, 720);
    spawner.setSpawnWorldY(50);
    spawner.start();
    const spawned = spawner.update(0);
    expect(spawned.scouts).toHaveLength(1);
    const leader = spawned.scouts[0];
    expect(leader).not.toBeNull();
    const expectedX = 1280 / 2 - SCOUT_SIZE / 2;
    expect(leader!.x).toBe(expectedX);
    expect(leader!.y).toBe(50);
  });

  it('spawnFrom.position offsets horizontal center (level spec)', async () => {
    const levelSpec = {
      id: 'test',
      name: 'Test',
      theme: 'forest' as const,
      difficulty: 'medium' as const,
      timing: { preMiniBossSeconds: null, preBossSeconds: null },
      waves: [
        {
          formation: 'v' as const,
          enemyType: 'scout' as const,
          staggerSeconds: 0.6,
          betweenWaveDelaySeconds: 4.5,
          spawnFrom: { edge: 'top', position: 0.25 },
        },
      ],
      enemyStyle: 'mixed' as const,
      boss: { archetypeId: 'placeholder' },
    };
    spawner.setScreenSize(1280, 720);
    spawner.setSpawnWorldY(50);
    spawner.reset(0, levelSpec);
    const spawned = spawner.update(0);
    expect(spawned.scouts).toHaveLength(1);
    const leader = spawned.scouts[0];
    expect(leader).not.toBeNull();
    const expectedX = 0.25 * 1280 - SCOUT_SIZE / 2;
    expect(leader!.x).toBe(expectedX);
  });

  it('reset restarts from wave 1', async () => {
    spawner.start();
    for (let t = 0; t < 5; t += 0.1) {
      spawner.update(t);
    }
    spawner.reset();
    expect(spawner.currentWaveIndex).toBe(1);
    expect(spawner.currentState).toBe('spawning');
  });
});

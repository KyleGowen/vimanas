import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  WaveSpawner,
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
});

describe('WaveSpawner', () => {
  let pool: EnemyPool;
  let spawner: WaveSpawner;
  const onScoutSpawned = vi.fn();
  const onWaveComplete = vi.fn();

  beforeEach(async () => {
    vi.useFakeTimers();
    pool = new EnemyPool(20);
    await pool.prewarm();
    onScoutSpawned.mockClear();
    onWaveComplete.mockClear();
    spawner = new WaveSpawner(pool, {
      onScoutSpawned,
      onWaveComplete,
    });
    spawner.setScreenSize(1280, 720);
  });

  it('starts in spawning state', () => {
    spawner.start();
    expect(spawner.currentState).toBe('spawning');
    expect(spawner.currentWaveIndex).toBe(1);
  });

  it('spawns scouts with stagger timing', async () => {
    spawner.start();
    const now = 0;
    const spawned0 = spawner.update(now);
    expect(spawned0).toHaveLength(1); // Leader spawns immediately
    expect(spawner.currentState).toBe('spawning');

    vi.advanceTimersByTime(599); // 0.599 s - not yet (stagger 0.6 s)
    const spawned1 = spawner.update(0.599);
    expect(spawned1).toHaveLength(0);

    vi.advanceTimersByTime(2); // 0.601 s total
    const spawned2 = spawner.update(0.601);
    expect(spawned2).toHaveLength(1);

    vi.advanceTimersByTime(600); // 1.201 s
    const spawned3 = spawner.update(1.201);
    expect(spawned3).toHaveLength(1);
  });

  it('spawns all 5 scouts for wave 1 (V)', async () => {
    spawner.start();
    let total = 0;
    for (let t = 0; t < 3; t += 0.016) {
      const s = spawner.update(t);
      total += s.length;
    }
    vi.advanceTimersByTime(2500); // Allow all stagger delays
    for (let t = 2.5; t < 5; t += 0.016) {
      const s = spawner.update(t);
      total += s.length;
    }
    expect(total).toBe(5);
    expect(spawner.currentState).toBe('wave_active');
  });

  it('detects wave complete when all scouts destroyed', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 3; t += 0.016) {
      scouts.push(...spawner.update(t));
    }
    vi.advanceTimersByTime(2500);
    for (let t = 2.5; t < 5; t += 0.016) {
      scouts.push(...spawner.update(t));
    }
    expect(scouts).toHaveLength(5);

    for (const s of scouts) {
      spawner.notifyScoutDied();
    }
    spawner.update(5);
    expect(onWaveComplete).toHaveBeenCalledWith(1);
  });

  it('transitions to between_wave after wave complete', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 5; t += 0.1) {
      scouts.push(...spawner.update(t));
    }
    for (const s of scouts) {
      if (s) spawner.notifyScoutDied();
    }
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');
  });

  it('spawns next wave after between-wave delay', async () => {
    spawner.start();
    const scouts: ReturnType<EnemyPool['get']>[] = [];
    for (let t = 0; t < 5; t += 0.1) {
      scouts.push(...spawner.update(t));
    }
    for (const s of scouts) {
      if (s) spawner.notifyScoutDied();
    }
    spawner.update(5.1);
    expect(spawner.currentState).toBe('between_wave');

    vi.advanceTimersByTime(5000); // 4-5 s delay
    const spawned = spawner.update(10.5);
    expect(spawner.currentWaveIndex).toBe(2);
    expect(spawner.currentState).toBe('spawning');
    expect(spawned.length).toBeGreaterThanOrEqual(0);
  });

  it('centers formation at screen width and uses spawn world Y', async () => {
    spawner.setScreenSize(1280, 720);
    spawner.setSpawnWorldY(50);
    spawner.start();
    const spawned = spawner.update(0);
    expect(spawned).toHaveLength(1);
    const leader = spawned[0];
    expect(leader).not.toBeNull();
    const expectedX = 1280 / 2 - SCOUT_SIZE / 2;
    expect(leader!.x).toBe(expectedX);
    expect(leader!.y).toBe(50);
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

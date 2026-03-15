import { ScoutEnemy } from '../enemies/scout-enemy';
import type { MovementBehaviorId } from '../levels/attack-pattern-resolver';

/** Pool size: 50+ on screen + buffer. 70 covers stress test and wave overlap. */
const DEFAULT_POOL_SIZE = 70;

/**
 * Object pool for ScoutEnemy. Pre-allocates instances; Get/Return reuse without allocation.
 * Zero Instantiate during wave; no GC spikes.
 */
export class EnemyPool {
  private readonly pool: ScoutEnemy[] = [];
  private readonly available: ScoutEnemy[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const scout = new ScoutEnemy();
      this.pool.push(scout);
      this.available.push(scout);
    }
  }

  /**
   * Pre-load sprites for all Scouts. Call before first get().
   * Asset-loader caches; first load populates cache, rest resolve from cache.
   */
  async prewarm(): Promise<void> {
    await Promise.all(this.pool.map((s) => s.load()));
  }

  /**
   * Get an inactive Scout, reset at (x, y), mark active. Returns null if pool exhausted.
   * Pass options with behaviorId and spawnTime for movement behaviors.
   */
  get(
    x: number,
    y: number,
    options?: { behaviorId?: MovementBehaviorId; spawnTime?: number }
  ): ScoutEnemy | null {
    const scout = this.available.pop();
    if (!scout) return null;
    scout.reset(x, y, options?.behaviorId, options?.spawnTime);
    return scout;
  }

  /**
   * Return a Scout to the pool. Call when Scout dies.
   */
  return(scout: ScoutEnemy): void {
    this.available.push(scout);
  }

  /** Number of Scouts currently available (not in use). */
  get availableCount(): number {
    return this.available.length;
  }

  /** Total pool capacity. */
  get size(): number {
    return this.capacity;
  }
}

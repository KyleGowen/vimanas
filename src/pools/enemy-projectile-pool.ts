import { EnemyProjectile, type EnemyProjectileOptions } from '../projectiles/enemy-projectile';

/** Pool size: Scout fire rate 2.5/s, lifetime 2s, multiple Scouts. 20 covers typical combat. */
const DEFAULT_POOL_SIZE = 20;

/**
 * Object pool for EnemyProjectile. Pre-allocates instances; Get/Return reuse without allocation.
 */
export class EnemyProjectilePool {
  private readonly pool: EnemyProjectile[] = [];
  private readonly available: EnemyProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const p = new EnemyProjectile({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        weaponStrength: 0,
        spawnTime: 0,
      });
      this.pool.push(p);
      this.available.push(p);
    }
  }

  /**
   * Get an inactive projectile, reset it with options, mark active. Returns null if pool exhausted.
   */
  get(options: EnemyProjectileOptions): EnemyProjectile | null {
    const p = this.available.pop();
    if (!p) return null;
    p.reset(options);
    return p;
  }

  /**
   * Return a projectile to the pool. Call when projectile despawns.
   */
  return(p: EnemyProjectile): void {
    this.available.push(p);
  }

  /** Number of projectiles currently available (not in use). */
  get availableCount(): number {
    return this.available.length;
  }

  /** Total pool capacity. */
  get size(): number {
    return this.capacity;
  }
}

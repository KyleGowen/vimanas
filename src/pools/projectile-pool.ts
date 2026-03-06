import { PlayerProjectile, type PlayerProjectileOptions } from '../projectiles/player-projectile';

/** Pool size: ~6–7 on screen (Sparrow 6.67/s) + buffer. 24 covers 3s lifetime at 6.67/s. */
const DEFAULT_POOL_SIZE = 24;

/**
 * Object pool for PlayerProjectile. Pre-allocates instances; Get/Return reuse without allocation.
 */
export class ProjectilePool {
  private readonly pool: PlayerProjectile[] = [];
  private readonly available: PlayerProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const p = new PlayerProjectile({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        damage: 0,
        spawnTime: 0,
      });
      this.pool.push(p);
      this.available.push(p);
    }
  }

  /**
   * Get an inactive projectile, reset it with options, mark active. Returns null if pool exhausted.
   */
  get(options: PlayerProjectileOptions): PlayerProjectile | null {
    const p = this.available.pop();
    if (!p) return null;
    p.reset(options);
    return p;
  }

  /**
   * Return a projectile to the pool. Call when projectile despawns.
   */
  return(p: PlayerProjectile): void {
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

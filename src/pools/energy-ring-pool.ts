import {
  EnergyRingProjectile,
  type EnergyRingProjectileOptions,
} from '../projectiles/energy-ring-projectile';

/** Pool size: secondary fire ~8/s, 3s lifetime. 20 covers typical combat. */
const DEFAULT_POOL_SIZE = 20;

/**
 * Object pool for EnergyRingProjectile. Pre-allocates instances; Get/Return reuse without allocation.
 */
export class EnergyRingPool {
  private readonly pool: EnergyRingProjectile[] = [];
  private readonly available: EnergyRingProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const r = new EnergyRingProjectile({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        damage: 0,
        spawnTime: 0,
      });
      this.pool.push(r);
      this.available.push(r);
    }
  }

  /**
   * Get an inactive ring, reset it with options, mark active. Returns null if pool exhausted.
   */
  get(options: EnergyRingProjectileOptions): EnergyRingProjectile | null {
    const r = this.available.pop();
    if (!r) return null;
    r.reset(options);
    return r;
  }

  /**
   * Return a ring to the pool. Call when ring despawns.
   */
  return(r: EnergyRingProjectile): void {
    this.available.push(r);
  }

  /** Number of rings currently available (not in use). */
  get availableCount(): number {
    return this.available.length;
  }

  /** Total pool capacity. */
  get size(): number {
    return this.capacity;
  }
}

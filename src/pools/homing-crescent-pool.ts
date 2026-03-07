import {
  HomingCrescentProjectile,
  type HomingCrescentOptions,
} from '../projectiles/homing-crescent-projectile';

/** Pool size: 2 per volley × ~3 volleys/s × 3s lifetime ≈ 18 + buffer */
const DEFAULT_POOL_SIZE = 24;

/**
 * Object pool for HomingCrescentProjectile.
 */
export class HomingCrescentPool {
  private readonly pool: HomingCrescentProjectile[] = [];
  private readonly available: HomingCrescentProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const p = new HomingCrescentProjectile({
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

  get(options: HomingCrescentOptions): HomingCrescentProjectile | null {
    const p = this.available.pop();
    if (!p) return null;
    p.reset(options);
    return p;
  }

  return(p: HomingCrescentProjectile): void {
    this.available.push(p);
  }

  get availableCount(): number {
    return this.available.length;
  }

  get size(): number {
    return this.capacity;
  }
}

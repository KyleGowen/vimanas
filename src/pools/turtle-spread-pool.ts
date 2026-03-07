import {
  TurtleSpreadProjectile,
  type TurtleSpreadProjectileOptions,
} from '../projectiles/turtle-spread-projectile';

/** Pool size: 8 per burst, allow 2 bursts (16) */
const DEFAULT_POOL_SIZE = 16;

/**
 * Object pool for Turtle spread projectiles.
 */
export class TurtleSpreadPool {
  private readonly pool: TurtleSpreadProjectile[] = [];
  private readonly available: TurtleSpreadProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const p = new TurtleSpreadProjectile({
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

  get(options: TurtleSpreadProjectileOptions): TurtleSpreadProjectile | null {
    const p = this.available.pop();
    if (!p) return null;
    p.reset(options);
    return p;
  }

  /** Get up to 8 projectiles for a spread burst. Returns fewer if pool exhausted. */
  getSpread(options: TurtleSpreadProjectileOptions[]): TurtleSpreadProjectile[] {
    const result: TurtleSpreadProjectile[] = [];
    for (const opt of options) {
      const p = this.get(opt);
      if (p) result.push(p);
    }
    return result;
  }

  return(p: TurtleSpreadProjectile): void {
    this.available.push(p);
  }

  get availableCount(): number {
    return this.available.length;
  }

  get size(): number {
    return this.capacity;
  }
}

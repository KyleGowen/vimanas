import { ArcShot, type ArcShotOptions } from '../arc-shot/arc-shot';

/** Pool size: Turtle fires ~4/s; arc lasts 0.2s. Max ~1 active. 4 covers buffer. */
const DEFAULT_POOL_SIZE = 4;

/**
 * Object pool for ArcShot. Pre-allocates instances; Get/Return reuse without allocation.
 */
export class ArcShotPool {
  private readonly pool: ArcShot[] = [];
  private readonly available: ArcShot[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const a = new ArcShot({
        x: 0,
        y: 0,
        damage: 0,
        spawnTime: 0,
      });
      this.pool.push(a);
      this.available.push(a);
    }
  }

  get(options: ArcShotOptions): ArcShot | null {
    const a = this.available.pop();
    if (!a) return null;
    a.reset(options);
    return a;
  }

  return(a: ArcShot): void {
    this.available.push(a);
  }

  get availableCount(): number {
    return this.available.length;
  }

  get size(): number {
    return this.capacity;
  }
}

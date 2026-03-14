import { EliteEnemy } from '../enemies/elite-enemy';

const DEFAULT_POOL_SIZE = 20;

/**
 * Object pool for EliteEnemy. Pre-allocates instances; get/return reuse without allocation.
 */
export class ElitePool {
  private readonly pool: EliteEnemy[] = [];
  private readonly available: EliteEnemy[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const elite = new EliteEnemy();
      this.pool.push(elite);
      this.available.push(elite);
    }
  }

  async prewarm(): Promise<void> {
    await Promise.all(this.pool.map((e) => e.load()));
  }

  get(x: number, y: number): EliteEnemy | null {
    const elite = this.available.pop();
    if (!elite) return null;
    elite.reset(x, y);
    return elite;
  }

  return(elite: EliteEnemy): void {
    this.available.push(elite);
  }

  get availableCount(): number {
    return this.available.length;
  }

  get size(): number {
    return this.capacity;
  }
}

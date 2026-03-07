import {
  ChargedBallProjectile,
  type ChargedBallOptions,
} from '../projectiles/charged-ball-projectile';

const DEFAULT_POOL_SIZE = 12;

export class ChargedBallPool {
  private readonly pool: ChargedBallProjectile[] = [];
  private readonly available: ChargedBallProjectile[] = [];
  private readonly capacity: number;

  constructor(capacity = DEFAULT_POOL_SIZE) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const p = new ChargedBallProjectile({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        damage: 0,
        radius: 8,
        spawnTime: 0,
      });
      this.pool.push(p);
      this.available.push(p);
    }
  }

  get(options: ChargedBallOptions): ChargedBallProjectile | null {
    const p = this.available.pop();
    if (!p) return null;
    p.reset(options);
    return p;
  }

  return(p: ChargedBallProjectile): void {
    this.available.push(p);
  }
}

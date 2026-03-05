import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import type { PlayerProjectile } from '../projectiles/player-projectile';
import { fireBasicGun, BASIC_GUN_FIRE_RATE_S } from '../weapons/basic-gun';
import { SparrowShip, SPARROW_SHIP_SIZE } from '../ships/sparrow-ship';
import { ProjectilePool } from '../pools/projectile-pool';

/** Padding from screen edges for play area bounds */
const PLAY_AREA_PADDING = 50;

export class GameplayScene implements Scene {
  private ship: SparrowShip;
  private readonly projectilePool: ProjectilePool;
  private projectiles: PlayerProjectile[] = [];
  private lastFireTime = 0;
  private paused = false;
  private wasEscapeDown = false;

  constructor() {
    this.ship = new SparrowShip();
    this.projectilePool = new ProjectilePool();
  }

  enter(ctx: GameContext): void {
    this.ship.x = ctx.width / 2 - SPARROW_SHIP_SIZE / 2;
    this.ship.y = ctx.height - 150;
    for (const p of this.projectiles) {
      this.projectilePool.return(p);
    }
    this.projectiles = [];
    this.lastFireTime = 0;
    this.paused = false;
    this.wasEscapeDown = false;
    void this.ship.load();
  }

  update(ctx: GameContext): void {
    const escapeDown = ctx.input.isEscapePressed();
    if (escapeDown && !this.wasEscapeDown) {
      this.paused = !this.paused;
    }
    this.wasEscapeDown = escapeDown;

    if (this.paused) return;

    const playAreaBounds = {
      minX: PLAY_AREA_PADDING,
      maxX: ctx.width - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
      minY: PLAY_AREA_PADDING,
      maxY: ctx.height - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
    };
    this.ship.update(ctx.input.getMoveAxis(), ctx.deltaTime, playAreaBounds);

    if (ctx.input.isFirePressed()) {
      const now = performance.now() / 1000;
      if (now - this.lastFireTime >= BASIC_GUN_FIRE_RATE_S) {
        this.lastFireTime = now;
        const opts = fireBasicGun({
          shipX: this.ship.x,
          shipY: this.ship.y,
          shipSize: SPARROW_SHIP_SIZE,
          attack: this.ship.stats.attack,
          spawnTime: now,
        });
        const p = this.projectilePool.get(opts);
        if (p) this.projectiles.push(p);
      }
    }

    const screenBounds = { width: ctx.width, height: ctx.height };
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const alive = p.update(ctx.deltaTime, screenBounds);
      if (!alive) {
        this.projectilePool.return(p);
        this.projectiles[i] = this.projectiles[this.projectiles.length - 1];
        this.projectiles.pop();
      }
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a1520');
    this.ship.draw(ctx.ctx);
    for (const p of this.projectiles) {
      p.draw(ctx.ctx);
    }
    if (this.paused) {
      ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);
      drawText(ctx.ctx, 'PAUSED', ctx.width / 2, ctx.height / 2 - 20, {
        font: '48px sans-serif',
        color: '#ffffff',
        align: 'center',
        baseline: 'middle',
      });
      drawText(ctx.ctx, 'Press Escape to resume', ctx.width / 2, ctx.height / 2 + 20, {
        font: '20px sans-serif',
        color: '#aaaaaa',
        align: 'center',
        baseline: 'middle',
      });
    }
  }

  exit(): void {
    this.ship.dispose();
  }
}

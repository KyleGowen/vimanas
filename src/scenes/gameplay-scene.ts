import type { GameContext, Scene } from '../game';
import { clear, drawRect, drawText } from '../render/renderer';
import { SparrowShip, SPARROW_SHIP_SIZE } from '../ships/sparrow-ship';

/** Padding from screen edges for play area bounds */
const PLAY_AREA_PADDING = 50;
const FIRE_RATE = 0.15;
const PROJECTILE_SPEED = 400;
const PROJECTILE_COLOR = '#00FFFF';

interface PlaceholderProjectile {
  x: number;
  y: number;
  vy: number;
}

export class GameplayScene implements Scene {
  private ship: SparrowShip;
  private projectiles: PlaceholderProjectile[] = [];
  private lastFireTime = 0;
  private paused = false;
  private wasEscapeDown = false;

  constructor() {
    this.ship = new SparrowShip();
  }

  enter(ctx: GameContext): void {
    this.ship.x = ctx.width / 2 - SPARROW_SHIP_SIZE / 2;
    this.ship.y = ctx.height - 150;
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

    const bounds = {
      minX: PLAY_AREA_PADDING,
      maxX: ctx.width - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
      minY: PLAY_AREA_PADDING,
      maxY: ctx.height - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
    };
    this.ship.update(ctx.input.getMoveAxis(), ctx.deltaTime, bounds);

    if (ctx.input.isFirePressed()) {
      const now = performance.now() / 1000;
      if (now - this.lastFireTime >= FIRE_RATE) {
        this.lastFireTime = now;
        this.projectiles.push({
          x: this.ship.x + SPARROW_SHIP_SIZE / 2 - 4,
          y: this.ship.y,
          vy: -PROJECTILE_SPEED,
        });
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.y += p.vy * ctx.deltaTime;
      if (p.y < -20) this.projectiles.splice(i, 1);
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a1520');
    this.ship.draw(ctx.ctx);
    for (const p of this.projectiles) {
      drawRect(ctx.ctx, p.x, p.y, 8, 24, PROJECTILE_COLOR);
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

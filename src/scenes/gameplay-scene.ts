import type { GameContext, Scene } from '../game';
import { clear, drawRect, drawText } from '../render/renderer';
import { SparrowShip } from '../ships/sparrow-ship';

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
    this.ship.x = ctx.width / 2 - 32;
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

    const move = ctx.input.getMoveAxis();
    const speed = this.ship.stats.speed * ctx.deltaTime * 10;
    this.ship.x += move.x * speed;
    this.ship.y += move.y * speed;

    const minX = PLAY_AREA_PADDING;
    const maxX = ctx.width - PLAY_AREA_PADDING - 64;
    const minY = PLAY_AREA_PADDING;
    const maxY = ctx.height - PLAY_AREA_PADDING - 64;
    this.ship.x = Math.max(minX, Math.min(maxX, this.ship.x));
    this.ship.y = Math.max(minY, Math.min(maxY, this.ship.y));

    if (ctx.input.isFirePressed()) {
      const now = performance.now() / 1000;
      if (now - this.lastFireTime >= FIRE_RATE) {
        this.lastFireTime = now;
        this.projectiles.push({
          x: this.ship.x + 32 - 4,
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

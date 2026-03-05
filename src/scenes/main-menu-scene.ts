import type { GameContext, Scene } from '../game';
import { clear, drawRect, drawText } from '../render/renderer';

export class MainMenuScene implements Scene {
  private goToScene?: (id: 'boot' | 'mainmenu' | 'gameplay') => void;
  private button = { x: 0, y: 0, w: 300, h: 50 };

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    this.button.x = (ctx.width - this.button.w) / 2;
    this.button.y = ctx.height / 2 - 25;
  }

  update(ctx: GameContext): void {
    if (!this.goToScene) return;
    if (ctx.input.isStartPressed()) {
      this.goToScene('gameplay');
      return;
    }
    const click = ctx.input.consumeClick();
    if (click && ctx.input.isClickInBounds(this.button.x, this.button.y, this.button.w, this.button.h, click.x, click.y)) {
      this.goToScene('gameplay');
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a0a0f');
    drawText(ctx.ctx, 'VIMANAS', ctx.width / 2, ctx.height / 3, {
      font: '56px sans-serif',
      color: '#87CEEB',
      align: 'center',
    });
    drawRect(ctx.ctx, this.button.x, this.button.y, this.button.w, this.button.h, '#0047AB');
    drawText(ctx.ctx, 'PRESS START / NEW GAME', ctx.width / 2, this.button.y + 32, {
      font: '20px sans-serif',
      color: '#ffffff',
      align: 'center',
    });
    drawText(ctx.ctx, '1–4 PLAYERS', ctx.width / 2, ctx.height - 60, {
      font: '18px sans-serif',
      color: '#666',
      align: 'center',
    });
  }

  exit(): void {
    this.goToScene = undefined;
  }
}

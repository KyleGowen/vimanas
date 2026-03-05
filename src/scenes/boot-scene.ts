import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';

export class BootScene implements Scene {
  private elapsed = 0;
  private goToScene?: (id: 'boot' | 'mainmenu' | 'gameplay') => void;

  enter(ctx: GameContext): void {
    this.elapsed = 0;
    this.goToScene = ctx.goToScene;
  }

  update(ctx: GameContext): void {
    this.elapsed += ctx.deltaTime;
    if (this.elapsed >= 1.5 && this.goToScene) {
      this.goToScene('mainmenu');
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a0a0f');
    drawText(ctx.ctx, 'VIMANAS', ctx.width / 2, ctx.height / 2 - 20, {
      font: '48px sans-serif',
      color: '#87CEEB',
      align: 'center',
    });
    drawText(ctx.ctx, 'Loading...', ctx.width / 2, ctx.height / 2 + 20, {
      font: '20px sans-serif',
      color: '#666',
      align: 'center',
    });
  }

  exit(): void {
    this.goToScene = undefined;
  }
}

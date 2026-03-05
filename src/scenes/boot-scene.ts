import type { GameContext, Scene } from '../game';
import { clear, drawImage } from '../render/renderer';
import { loadImage } from '../assets/asset-loader';

const TITLE_IMAGE_PATH = '/images/title_screen.png';

export class BootScene implements Scene {
  private goToScene?: (id: 'boot' | 'gameplay') => void;
  private titleImage: HTMLImageElement | null = null;
  private loaded = false;

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    this.titleImage = null;
    this.loaded = false;
    loadImage(TITLE_IMAGE_PATH)
      .then((img) => {
        this.titleImage = img;
        this.loaded = true;
      })
      .catch(() => {
        this.loaded = true;
      });
  }

  update(ctx: GameContext): void {
    const startPressed = ctx.input.isStartPressed();
    const clicked = ctx.input.consumeClick();

    if ((startPressed || clicked) && this.goToScene) {
      this.goToScene('gameplay');
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a0a0f');

    if (this.titleImage && this.loaded) {
      const img = this.titleImage;
      const scale = Math.max(ctx.width / img.width, ctx.height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const x = (ctx.width - drawW) / 2;
      const y = (ctx.height - drawH) / 2;
      drawImage(ctx.ctx, img, x, y, drawW, drawH);
    }
    // No placeholder during load—just dark background to avoid flash of old placeholder
  }

  exit(): void {
    this.goToScene = undefined;
    this.titleImage = null;
  }
}

import type { GameContext, Scene } from '../game';
import type { ShipId } from '../config/ship-registry';
import { clear, drawImageFit, drawText } from '../render/renderer';
import { loadImage } from '../assets/asset-loader';

/** Ship order per ship_selection_ui_design.md: Sparrow → Turtle → Wolf → Dragon */
const SHIP_IDS: readonly ShipId[] = ['sparrow', 'turtle', 'wolf', 'dragon'];

const SHIP_LABELS: Record<ShipId, string> = {
  sparrow: 'SPARROW',
  turtle: 'TURTLE',
  wolf: 'WOLF',
  dragon: 'DRAGON',
};

/** Propulsion glow colors per art_style_guide.md */
const SHIP_GLOW_COLORS: Record<ShipId, string> = {
  sparrow: '#00FFFF',
  turtle: '#FFBF00',
  wolf: '#C0C0C0',
  dragon: '#FF4500',
};

const SPRITE_PATHS: Record<ShipId, string> = {
  sparrow: '/images/ships/sparrow/sparrow_facing_n.png',
  turtle: '/images/ships/turtle/turtle_facing_n.png',
  wolf: '/images/ships/wolf/wolf_facing_n.png',
  dragon: '/images/ships/dragon/dragon_facing_n.png',
};

/** Palette per ship_selection_ui_design.md */
const COPPER = '#B87333';
const BRASS = '#B5A642';
const SLOT_BG = '#3d2914';
const WARM_WHITE = '#F5F0E6';
const MUTED_TEXT = 'rgba(245, 240, 230, 0.75)';

const TITLE_Y = 100;
const SLOT_WIDTH = 220;
const SLOT_HEIGHT = 260;
const SLOT_GAP = 28;
const SLOT_CORNER_RADIUS = 6;
const FRAME_WIDTH = 3;
const PROMPT_Y = 660;
const NAV_REPEAT_MS = 180;

export class ShipSelectScene implements Scene {
  private goToScene?: GameContext['goToScene'];
  private focusedIndex = 0;
  private lastNavigateTime = 0;
  private sprites: Record<ShipId, HTMLImageElement | null> = {
    sparrow: null,
    turtle: null,
    wolf: null,
    dragon: null,
  };
  private loaded = false;

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    this.focusedIndex = 0;
    this.lastNavigateTime = 0;
    this.loaded = false;
    SHIP_IDS.forEach((id) => {
      this.sprites[id] = null;
    });
    Promise.all(
      SHIP_IDS.map((id) =>
        loadImage(SPRITE_PATHS[id])
          .then((img) => ({ id, img }))
          .catch(() => ({ id, img: null as HTMLImageElement | null }))
      )
    ).then((results) => {
      results.forEach(({ id, img }) => {
        this.sprites[id] = img;
      });
      this.loaded = true;
    });
  }

  update(ctx: GameContext): void {
    if (!this.goToScene) return;

    const navX = ctx.input.getMenuNavigateX();
    const now = performance.now();
    if (navX !== 0 && now - this.lastNavigateTime > NAV_REPEAT_MS) {
      this.focusedIndex = (this.focusedIndex + navX + 4) % 4;
      this.lastNavigateTime = now;
    }

    if (ctx.input.isMenuPressed()) {
      this.goToScene('boot');
      return;
    }

    const primaryPressed = ctx.input.isPrimaryActionPressed();
    const clicked = ctx.input.consumeClick();

    const shipId = SHIP_IDS[this.focusedIndex];

    if (primaryPressed && this.goToScene) {
      this.goToScene('gameplay', { shipId });
      return;
    }

    if (clicked) {
      const { slots } = this.getSlotLayout(ctx.width, ctx.height);
      for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        if (
          clicked.x >= s.x &&
          clicked.x <= s.x + s.w &&
          clicked.y >= s.y &&
          clicked.y <= s.y + s.h
        ) {
          this.goToScene!('gameplay', { shipId: SHIP_IDS[i] });
          return;
        }
      }
    }
  }

  private getSlotLayout(
    width: number,
    height: number
  ): { slots: Array<{ x: number; y: number; w: number; h: number }>; rowWidth: number } {
    const totalWidth = 4 * SLOT_WIDTH + 3 * SLOT_GAP;
    const startX = (width - totalWidth) / 2;
    const slotY = height / 2 - SLOT_HEIGHT / 2 - 20;
    const slots: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < 4; i++) {
      slots.push({
        x: startX + i * (SLOT_WIDTH + SLOT_GAP),
        y: slotY,
        w: SLOT_WIDTH,
        h: SLOT_HEIGHT,
      });
    }
    return { slots, rowWidth: totalWidth };
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a0a0f');

    const centerX = ctx.width / 2;

    drawText(ctx.ctx, 'SELECT YOUR SHIP', centerX, TITLE_Y, {
      font: '36px sans-serif',
      color: BRASS,
      align: 'center',
      baseline: 'middle',
    });

    const { slots } = this.getSlotLayout(ctx.width, ctx.height);

    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const shipId = SHIP_IDS[i];
      const isFocused = i === this.focusedIndex;

      ctx.ctx.save();

      if (isFocused) {
        ctx.ctx.shadowColor = SHIP_GLOW_COLORS[shipId];
        ctx.ctx.shadowBlur = 20;
      }

      ctx.ctx.fillStyle = SLOT_BG;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.fill();

      ctx.ctx.strokeStyle = isFocused ? BRASS : COPPER;
      ctx.ctx.lineWidth = isFocused ? FRAME_WIDTH + 1 : FRAME_WIDTH;
      ctx.ctx.globalAlpha = isFocused ? 1 : 0.8;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.stroke();

      ctx.ctx.restore();

      const img = this.sprites[shipId];
      const spriteAreaH = s.h - 36;
      const spriteAreaW = s.w - 24;
      const spriteX = s.x + (s.w - spriteAreaW) / 2;
      const spriteY = s.y + 12;

      if (img && this.loaded) {
        drawImageFit(ctx.ctx, img, spriteX, spriteY, spriteAreaW, spriteAreaH);
      } else {
        ctx.ctx.fillStyle = SHIP_GLOW_COLORS[shipId];
        ctx.ctx.globalAlpha = 0.5;
        ctx.ctx.fillRect(spriteX, spriteY, spriteAreaW, spriteAreaH);
        ctx.ctx.globalAlpha = 1;
      }

      const labelY = s.y + s.h - 20;
      drawText(ctx.ctx, SHIP_LABELS[shipId], s.x + s.w / 2, labelY, {
        font: '16px sans-serif',
        color: isFocused ? SHIP_GLOW_COLORS[shipId] : WARM_WHITE,
        align: 'center',
        baseline: 'middle',
      });
    }

    drawText(ctx.ctx, '[A] CONFIRM    [B] BACK', centerX, PROMPT_Y, {
      font: '18px sans-serif',
      color: MUTED_TEXT,
      align: 'center',
      baseline: 'middle',
    });
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  exit(): void {
    this.goToScene = undefined;
  }
}

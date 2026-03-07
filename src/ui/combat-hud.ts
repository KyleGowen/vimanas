import { loadImage } from '../assets/asset-loader';
import { drawImage, drawText } from '../render/renderer';

/** Generic ship interface for HUD - supports Sparrow, Turtle, Wolf, Dragon. */
type HUDShip = { stats: { hp: number; mana: number }; currentMana: number; maxHp?: number; maxMana?: number };

const HP_BAR_FRAME_PATH = '/images/ui/hud/hp_bar_frame.svg';
const MANA_BAR_FRAME_PATH = '/images/ui/hud/mana_bar_frame.svg';
const LIFE_ICON_PATH = '/images/ui/hud/life_icon.svg';
const BOSS_BAR_FRAME_PATH = '/images/ui/hud/boss_bar_frame.svg';

/** HP bar: 220×18 px per hud_design.md */
const HP_BAR_WIDTH = 220;
const HP_BAR_HEIGHT = 18;
const HP_FILL_COLOR = '#C41E3A';
const MANA_FILL_COLOR = '#4A90D9';

/** Layout constants per hud_design.md (1280×720). Use bottom-relative for variable resolution. */
const TOP_LEFT_X = 22;
const TOP_LEFT_Y = 14;
const BOTTOM_LEFT_X = 22;
const BOTTOM_PADDING = 24;
const LIFE_ICON_SIZE = 22;
const SCORE_FONT = '18px sans-serif';
const SCORE_COLOR = '#F5F0E6';
const BOSS_NAME_COLOR = '#B5A642';
const BOSS_NAME_FONT = '18px sans-serif';

/** Boss bar: narrower, centered—reads as health indicator, not full-width banner */
const BOSS_BAR_WIDTH = 400;
const BOSS_BAR_HEIGHT = 22;
const BOSS_MAX_HP = 150;

/** Placeholder boss name for level 1 per boss_placeholder_design.md */
const BOSS_NAME = 'ROOT-SEEKER';

export interface CombatHUDOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  ship: HUDShip;
  score: number;
  lives: number;
  boss?: { hp: number } | null;
}

export class CombatHUD {
  private hpFrame: HTMLImageElement | null = null;
  private manaFrame: HTMLImageElement | null = null;
  private lifeIcon: HTMLImageElement | null = null;
  private bossFrame: HTMLImageElement | null = null;
  private loaded = false;

  /** Load HUD assets. Call from scene enter(). */
  async load(): Promise<void> {
    try {
      const [hp, mana, life, boss] = await Promise.all([
        loadImage(HP_BAR_FRAME_PATH),
        loadImage(MANA_BAR_FRAME_PATH),
        loadImage(LIFE_ICON_PATH),
        loadImage(BOSS_BAR_FRAME_PATH),
      ]);
      this.hpFrame = hp;
      this.manaFrame = mana;
      this.lifeIcon = life;
      this.bossFrame = boss;
      this.loaded = true;
    } catch {
      this.loaded = true;
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Draw the combat HUD. Call each frame after gameplay layer.
   * HP bar: bottom-left 220×18, fill from ship.stats.hp / maxHP.
   * Mana bar: below HP, fill from ship.currentMana / maxMana.
   * Score: top-left, 6–8 digit format.
   * Lives: top-right, life_icon repeated.
   * Boss phase: boss name + boss_bar_frame + fill when boss active.
   */
  draw(opts: CombatHUDOptions): void {
    const { ctx, width, height, ship, score, lives, boss } = opts;
    /** Fallback when ship has no maxHp/maxMana (e.g. generic HUDShip). All playable ships provide these. */
    const maxHp = ship.maxHp ?? 28;
    const maxMana = ship.maxMana ?? 28;

    const hpY = height - BOTTOM_PADDING - HP_BAR_HEIGHT * 2 - 6;
    const manaY = height - BOTTOM_PADDING - HP_BAR_HEIGHT;

    if (boss) {
      this.drawBossBar(ctx, width, boss);
      this.drawScoreAndLivesRight(ctx, width, score, lives);
    } else {
      this.drawScore(ctx, score);
      this.drawLives(ctx, width, lives);
    }
    this.drawHPBar(ctx, hpY, ship.stats.hp, maxHp);
    this.drawManaBar(ctx, manaY, ship.currentMana, maxMana);
  }

  private drawScore(ctx: CanvasRenderingContext2D, score: number): void {
    const formatted = String(Math.floor(score)).padStart(8, '0').slice(-8);
    drawText(ctx, formatted, TOP_LEFT_X, TOP_LEFT_Y, {
      font: SCORE_FONT,
      color: SCORE_COLOR,
      align: 'left',
      baseline: 'top',
    });
  }

  private drawScoreAndLivesRight(ctx: CanvasRenderingContext2D, width: number, score: number, lives: number): void {
    const formatted = String(Math.floor(score)).padStart(8, '0').slice(-8);
    const rightX = width - 24;
    const iconCount = Math.max(0, Math.min(lives, 4));
    const livesWidth = iconCount * (LIFE_ICON_SIZE + 4) - 4;
    ctx.font = SCORE_FONT;
    const scoreWidth = ctx.measureText(formatted).width;
    const totalWidth = scoreWidth + 20 + livesWidth;
    let x = rightX - totalWidth;
    drawText(ctx, formatted, x, TOP_LEFT_Y, {
      font: SCORE_FONT,
      color: SCORE_COLOR,
      align: 'left',
      baseline: 'top',
    });
    x += scoreWidth + 20;
    for (let i = 0; i < iconCount; i++) {
      if (this.lifeIcon) {
        drawImage(ctx, this.lifeIcon, x, TOP_LEFT_Y - 2, LIFE_ICON_SIZE, LIFE_ICON_SIZE);
      } else {
        ctx.fillStyle = '#B87333';
        ctx.fillRect(x, TOP_LEFT_Y, LIFE_ICON_SIZE, LIFE_ICON_SIZE);
      }
      x += LIFE_ICON_SIZE + 4;
    }
  }

  private drawLives(ctx: CanvasRenderingContext2D, width: number, lives: number): void {
    const rightX = width - 24;
    const iconCount = Math.max(0, Math.min(lives, 4));
    for (let i = 0; i < iconCount; i++) {
      const x = rightX - (iconCount - i) * (LIFE_ICON_SIZE + 4);
      if (this.lifeIcon) {
        drawImage(ctx, this.lifeIcon, x, TOP_LEFT_Y - 2, LIFE_ICON_SIZE, LIFE_ICON_SIZE);
      } else {
        ctx.fillStyle = '#B87333';
        ctx.fillRect(x, TOP_LEFT_Y, LIFE_ICON_SIZE, LIFE_ICON_SIZE);
      }
    }
  }

  private drawHPBar(ctx: CanvasRenderingContext2D, y: number, current: number, max: number): void {
    const x = BOTTOM_LEFT_X;
    if (this.hpFrame) {
      drawImage(ctx, this.hpFrame, x, y, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    } else {
      ctx.strokeStyle = '#B87333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    }
    const ratio = Math.max(0, Math.min(1, current / max));
    const fillW = Math.max(0, (HP_BAR_WIDTH - 4) * ratio);
    ctx.fillStyle = '#3d2914';
    ctx.fillRect(x + 2, y + 2, HP_BAR_WIDTH - 4, HP_BAR_HEIGHT - 4);
    if (fillW > 0) {
      ctx.fillStyle = HP_FILL_COLOR;
      ctx.fillRect(x + 2, y + 2, fillW, HP_BAR_HEIGHT - 4);
    }
  }

  private drawManaBar(ctx: CanvasRenderingContext2D, y: number, currentMana: number, maxMana: number): void {
    const x = BOTTOM_LEFT_X;
    if (this.manaFrame) {
      drawImage(ctx, this.manaFrame, x, y, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    } else {
      ctx.strokeStyle = '#B87333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    }
    const ratio = Math.max(0, Math.min(1, currentMana / maxMana));
    const fillW = Math.max(0, (HP_BAR_WIDTH - 4) * ratio);
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(x + 2, y + 2, HP_BAR_WIDTH - 4, HP_BAR_HEIGHT - 4);
    if (fillW > 0) {
      ctx.fillStyle = MANA_FILL_COLOR;
      ctx.fillRect(x + 2, y + 2, fillW, HP_BAR_HEIGHT - 4);
    }
  }

  private drawBossBar(ctx: CanvasRenderingContext2D, width: number, boss: { hp: number }): void {
    const barWidth = Math.min(BOSS_BAR_WIDTH, width - 48);
    const barX = (width - barWidth) / 2;
    const barY = 36;
    drawText(ctx, `BOSS: ${BOSS_NAME}`, TOP_LEFT_X, TOP_LEFT_Y, {
      font: BOSS_NAME_FONT,
      color: BOSS_NAME_COLOR,
      align: 'left',
      baseline: 'top',
    });
    if (this.bossFrame) {
      drawImage(ctx, this.bossFrame, barX, barY, barWidth, BOSS_BAR_HEIGHT);
    } else {
      ctx.strokeStyle = '#B87333';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, BOSS_BAR_HEIGHT);
    }
    const ratio = Math.max(0, Math.min(1, boss.hp / BOSS_MAX_HP));
    const fillW = Math.max(0, (barWidth - 4) * ratio);
    ctx.fillStyle = '#3d2914';
    ctx.fillRect(barX + 2, barY + 2, barWidth - 4, BOSS_BAR_HEIGHT - 4);
    if (fillW > 0) {
      ctx.fillStyle = HP_FILL_COLOR;
      ctx.fillRect(barX + 2, barY + 2, fillW, BOSS_BAR_HEIGHT - 4);
    }
  }

  dispose(): void {
    this.hpFrame = null;
    this.manaFrame = null;
    this.lifeIcon = null;
    this.bossFrame = null;
  }
}

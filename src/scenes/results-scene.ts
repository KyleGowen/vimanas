import type { GameContext, ResultsSceneState, Scene } from '../game';
import { drawText } from '../render/renderer';

/** Palette per results_screen_design.md */
const BRASS = '#B5A642';
const MUTED_COPPER = '#8B6914';
const COPPER = '#B87333';
const WARM_WHITE = '#F5F0E6';
const AETHER_BLUE = '#4A90D9';
const BUTTON_FILL = '#3d2914';

const OVERLAY_OPACITY = 0.6;
const TITLE_Y = 200;
const SCORE_Y = 300;
const LIVES_Y = 360;
const BUTTONS_Y = 440;
const BUTTON_WIDTH = 180;
const BUTTON_HEIGHT = 44;
const BUTTON_GAP = 28;
const TITLE_FONT = '48px sans-serif';
const BODY_FONT = '20px sans-serif';
const BUTTON_FONT = '18px sans-serif';

function formatScore(score: number): string {
  return score.toLocaleString();
}

function livesText(lives: number): string {
  const hearts = '♥'.repeat(Math.max(0, lives));
  return `Lives: ${lives} ${hearts}`.trim();
}

export class ResultsScene implements Scene {
  private state: ResultsSceneState = { victory: false, score: 0, lives: 0 };
  private goToScene?: (id: 'boot' | 'gameplay' | 'results' | 'shipSelect', state?: unknown) => void;

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    const raw = ctx.sceneState;
    if (raw && typeof raw === 'object' && 'victory' in raw && 'score' in raw && 'lives' in raw) {
      this.state = {
        victory: (raw as ResultsSceneState).victory,
        score: (raw as ResultsSceneState).score,
        lives: (raw as ResultsSceneState).lives,
        shipId: (raw as ResultsSceneState).shipId,
        pilotId: (raw as ResultsSceneState).pilotId,
      };
    }
  }

  update(ctx: GameContext): void {
    if (!this.goToScene) return;

    const clicked = ctx.input.consumeClick();
    const primary = ctx.input.isPrimaryActionPressed();
    const retry = ctx.input.isRetryPressed();
    const menu = ctx.input.isMenuPressed();

    const { victory } = this.state;
    const centerX = ctx.width / 2;
    const button1X = centerX - BUTTON_WIDTH - BUTTON_GAP / 2;
    const button2X = centerX + BUTTON_GAP / 2;

    const inButton1 =
      clicked &&
      clicked.x >= button1X &&
      clicked.x <= button1X + BUTTON_WIDTH &&
      clicked.y >= BUTTONS_Y &&
      clicked.y <= BUTTONS_Y + BUTTON_HEIGHT;
    const inButton2 =
      clicked &&
      clicked.x >= button2X &&
      clicked.x <= button2X + BUTTON_WIDTH &&
      clicked.y >= BUTTONS_Y &&
      clicked.y <= BUTTONS_Y + BUTTON_HEIGHT;

    if (victory) {
      if (primary || inButton1) {
        this.goToScene('shipSelect');
        return;
      }
      if (retry || inButton2) {
        this.goToScene(
          'gameplay',
          this.state.shipId
            ? { shipId: this.state.shipId, pilotId: this.state.pilotId }
            : undefined
        );
        return;
      }
    } else {
      if (primary || retry || inButton1) {
        this.goToScene(
          'gameplay',
          this.state.shipId
            ? { shipId: this.state.shipId, pilotId: this.state.pilotId }
            : undefined
        );
        return;
      }
      if (menu || inButton2) {
        this.goToScene('boot');
        return;
      }
    }
  }

  draw(ctx: GameContext): void {
    const { victory, score, lives } = this.state;

    ctx.ctx.fillStyle = `rgba(0, 0, 0, ${OVERLAY_OPACITY})`;
    ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);

    const centerX = ctx.width / 2;
    const titleColor = victory ? BRASS : MUTED_COPPER;
    const title = victory ? 'LEVEL COMPLETE' : 'DEFEAT';

    drawText(ctx.ctx, title, centerX, TITLE_Y, {
      font: TITLE_FONT,
      color: titleColor,
      align: 'center',
      baseline: 'middle',
    });

    drawText(ctx.ctx, `Score: ${formatScore(score)}`, centerX, SCORE_Y, {
      font: BODY_FONT,
      color: WARM_WHITE,
      align: 'center',
      baseline: 'middle',
    });

    drawText(ctx.ctx, livesText(lives), centerX, LIVES_Y, {
      font: BODY_FONT,
      color: WARM_WHITE,
      align: 'center',
      baseline: 'middle',
    });

    const button1X = centerX - BUTTON_WIDTH - BUTTON_GAP / 2;
    const button2X = centerX + BUTTON_GAP / 2;

    if (victory) {
      this.drawButton(ctx, button1X, BUTTONS_Y, 'CONTINUE', true);
      this.drawButton(ctx, button2X, BUTTONS_Y, 'RETRY', false);
    } else {
      this.drawButton(ctx, button1X, BUTTONS_Y, 'RETRY', true);
      this.drawButton(ctx, button2X, BUTTONS_Y, 'MENU', false);
    }
  }

  private drawButton(
    ctx: GameContext,
    x: number,
    y: number,
    label: string,
    focused: boolean
  ): void {
    ctx.ctx.fillStyle = BUTTON_FILL;
    ctx.ctx.fillRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

    ctx.ctx.strokeStyle = focused ? AETHER_BLUE : COPPER;
    ctx.ctx.lineWidth = focused ? 3 : 2;
    ctx.ctx.strokeRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

    drawText(ctx.ctx, label, x + BUTTON_WIDTH / 2, y + BUTTON_HEIGHT / 2, {
      font: BUTTON_FONT,
      color: WARM_WHITE,
      align: 'center',
      baseline: 'middle',
    });
  }

  exit(): void {
    this.goToScene = undefined;
  }
}

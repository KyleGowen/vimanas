import type { GameContext, Scene } from '../game';
import type { ShipId } from '../config/ship-registry';
import type { PilotId } from '../config/pilot-registry';
import { clear, drawImageCover, drawImageFit, drawText } from '../render/renderer';
import { loadImage } from '../assets/asset-loader';

/** Ship order per ship_selection_ui_design.md: Sparrow → Turtle → Wolf → Dragon */
const SHIP_IDS: readonly ShipId[] = ['sparrow', 'turtle', 'wolf', 'dragon'];

/** Pilot order per ship_selection_ui_design.md Section 12 */
const PILOT_IDS: readonly PilotId[] = ['speed', 'weapon', 'defensive', 'rookie'];

const SHIP_LABELS: Record<ShipId, string> = {
  sparrow: 'SPARROW',
  turtle: 'TURTLE',
  wolf: 'WOLF',
  dragon: 'DRAGON',
};

const PILOT_LABELS: Record<PilotId, string> = {
  speed: 'SPEED',
  weapon: 'WEAPON',
  defensive: 'DEFENSIVE',
  rookie: 'ROOKIE',
};

/** Propulsion glow colors per art_style_guide.md */
const SHIP_GLOW_COLORS: Record<ShipId, string> = {
  sparrow: '#00FFFF',
  turtle: '#FFBF00',
  wolf: '#C0C0C0',
  dragon: '#FF4500',
};

/** Pilot accent colors per ship_selection_ui_design.md Section 14 */
const PILOT_GLOW_COLORS: Record<PilotId, string> = {
  speed: '#00FFFF',
  weapon: '#FFBF00',
  defensive: '#B5A642',
  rookie: '#F5F0E6',
};

const SPRITE_PATHS: Record<ShipId, string> = {
  sparrow: '/images/ships/sparrow/sparrow_facing_n.png',
  turtle: '/images/ships/turtle/turtle_facing_n.png',
  wolf: '/images/ships/wolf/wolf_facing_n.png',
  dragon: '/images/ships/dragon/dragon_facing_n.png',
};

/** Pilot portrait paths per ship_selection_ui_design.md Section 15 */
const PILOT_PATHS: Record<PilotId, string> = {
  speed: '/images/pilots/pilot_speed_specialist.png',
  weapon: '/images/pilots/pilot_weapon_specialist.png',
  defensive: '/images/pilots/pilot_defensive_specialist.png',
  rookie: '/images/pilots/pilot_neutral_rookie.png',
};

/** Palette per ship_selection_ui_design.md */
const COPPER = '#B87333';
const BRASS = '#B5A642';
const SLOT_BG = '#3d2914';
const WARM_WHITE = '#F5F0E6';

const TITLE_Y = 80;
const SLOT_WIDTH = 220;
const SLOT_HEIGHT = 200;
const SLOT_GAP = 28;
const SLOT_CORNER_RADIUS = 6;
const FRAME_WIDTH = 3;
const NAV_REPEAT_MS = 180;

/** Pilot slot dimensions; portrait fills frame; label drawn below */
const PILOT_SLOT_WIDTH = 180;
const PILOT_SLOT_HEIGHT = 200;
/** Vertical gap between frame bottom and label (clear space before text) */
const LABEL_GAP = 24;

type FocusedRow = 'ship' | 'pilot';

export class ShipSelectScene implements Scene {
  private goToScene?: GameContext['goToScene'];
  private focusedRow: FocusedRow = 'ship';
  private focusedIndex = 0;
  /** Selected ship index; updated when on ship row or when switching away from it */
  private selectedShipIndex = 0;
  /** Selected pilot index; updated when on pilot row or when switching away from it */
  private selectedPilotIndex = 0;
  /** Must visit pilot row before confirming (choose one of each) */
  private hasVisitedPilotRow = false;
  private lastNavigateTime = 0;
  private sprites: Record<ShipId, HTMLImageElement | null> = {
    sparrow: null,
    turtle: null,
    wolf: null,
    dragon: null,
  };
  private pilotSprites: Record<PilotId, HTMLImageElement | null> = {
    speed: null,
    weapon: null,
    defensive: null,
    rookie: null,
  };
  private loaded = false;
  /** Level ID from URL (8.6); forwarded to gameplay when starting. */
  private selectedLevelId: string | undefined;

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    this.focusedRow = 'ship';
    this.focusedIndex = 0;
    this.selectedShipIndex = 0;
    this.selectedPilotIndex = 0;
    this.hasVisitedPilotRow = false;
    const raw = ctx.sceneState;
    this.selectedLevelId =
      raw && typeof raw === 'object' && 'levelId' in raw && typeof (raw as { levelId: unknown }).levelId === 'string'
        ? (raw as { levelId: string }).levelId
        : undefined;
    this.lastNavigateTime = 0;
    this.loaded = false;
    SHIP_IDS.forEach((id) => {
      this.sprites[id] = null;
    });
    PILOT_IDS.forEach((id) => {
      this.pilotSprites[id] = null;
    });
    Promise.all([
      ...SHIP_IDS.map((id) =>
        loadImage(SPRITE_PATHS[id])
          .then((img) => ({ id, img }))
          .catch(() => ({ id, img: null as HTMLImageElement | null }))
      ),
      ...PILOT_IDS.map((id) =>
        loadImage(PILOT_PATHS[id])
          .then((img) => ({ id, img }))
          .catch(() => ({ id, img: null as HTMLImageElement | null }))
      ),
    ]).then((results) => {
      for (const r of results as Array<{ id: ShipId | PilotId; img: HTMLImageElement | null }>) {
        if (SHIP_IDS.includes(r.id as ShipId)) {
          this.sprites[r.id as ShipId] = r.img;
        }
        if (PILOT_IDS.includes(r.id as PilotId)) {
          this.pilotSprites[r.id as PilotId] = r.img;
        }
      }
      this.loaded = true;
    });
  }

  update(ctx: GameContext): void {
    if (!this.goToScene) return;

    const navX = ctx.input.getMenuNavigateX();
    const navY = ctx.input.getMenuNavigateY();
    const now = performance.now();

    if (navX !== 0 && now - this.lastNavigateTime > NAV_REPEAT_MS) {
      this.focusedIndex = (this.focusedIndex + navX + 4) % 4;
      if (this.focusedRow === 'ship') {
        this.selectedShipIndex = this.focusedIndex;
      } else {
        this.selectedPilotIndex = this.focusedIndex;
      }
      this.lastNavigateTime = now;
    }

    if (navY !== 0 && now - this.lastNavigateTime > NAV_REPEAT_MS) {
      if (navY > 0 && this.focusedRow === 'ship') {
        this.selectedShipIndex = this.focusedIndex;
        this.focusedRow = 'pilot';
        this.focusedIndex = this.selectedPilotIndex;
        this.hasVisitedPilotRow = true;
        this.lastNavigateTime = now;
      } else if (navY < 0 && this.focusedRow === 'pilot') {
        this.selectedPilotIndex = this.focusedIndex;
        this.focusedRow = 'ship';
        this.focusedIndex = this.selectedShipIndex;
        this.lastNavigateTime = now;
      }
    }

    if (ctx.input.isMenuPressed()) {
      this.goToScene('boot');
      return;
    }

    const primaryPressed = ctx.input.isPrimaryActionPressed();
    const clicked = ctx.input.consumeClick();

    const shipId = SHIP_IDS[this.selectedShipIndex];
    const pilotId = PILOT_IDS[this.selectedPilotIndex];

    if (primaryPressed && this.goToScene && this.hasVisitedPilotRow) {
      const state: { shipId: ShipId; pilotId: PilotId; levelId?: string } = { shipId, pilotId };
      if (this.selectedLevelId) state.levelId = this.selectedLevelId;
      this.goToScene('gameplay', state);
      return;
    }

    if (clicked) {
      const { shipSlots, pilotSlots } = this.getSlotLayout(ctx.width, ctx.height);

      for (let i = 0; i < shipSlots.length; i++) {
        const s = shipSlots[i];
        if (
          clicked.x >= s.x &&
          clicked.x <= s.x + s.w &&
          clicked.y >= s.y &&
          clicked.y <= s.y + s.h
        ) {
          this.selectedShipIndex = i;
          this.focusedRow = 'ship';
          this.focusedIndex = i;
          return;
        }
      }

      for (let i = 0; i < pilotSlots.length; i++) {
        const s = pilotSlots[i];
        if (
          clicked.x >= s.x &&
          clicked.x <= s.x + s.w &&
          clicked.y >= s.y &&
          clicked.y <= s.y + s.h
        ) {
          this.selectedPilotIndex = i;
          this.focusedRow = 'pilot';
          this.focusedIndex = i;
          this.hasVisitedPilotRow = true;
          return;
        }
      }
    }
  }

  private getSlotLayout(
    width: number,
    _height: number
  ): {
    shipSlots: Array<{ x: number; y: number; w: number; h: number }>;
    pilotSlots: Array<{ x: number; y: number; w: number; h: number }>;
  } {
    const totalShipWidth = 4 * SLOT_WIDTH + 3 * SLOT_GAP;
    const totalPilotWidth = 4 * PILOT_SLOT_WIDTH + 3 * SLOT_GAP;
    const startShipX = (width - totalShipWidth) / 2;
    const startPilotX = (width - totalPilotWidth) / 2;

    const shipY = 140;
    const pilotY = 430;

    const shipSlots: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < 4; i++) {
      shipSlots.push({
        x: startShipX + i * (SLOT_WIDTH + SLOT_GAP),
        y: shipY,
        w: SLOT_WIDTH,
        h: SLOT_HEIGHT,
      });
    }

    const pilotSlots: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < 4; i++) {
      pilotSlots.push({
        x: startPilotX + i * (PILOT_SLOT_WIDTH + SLOT_GAP),
        y: pilotY,
        w: PILOT_SLOT_WIDTH,
        h: PILOT_SLOT_HEIGHT,
      });
    }

    return { shipSlots, pilotSlots };
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a0a0f');

    const centerX = ctx.width / 2;

    drawText(ctx.ctx, 'SELECT YOUR SHIP AND PILOT', centerX, TITLE_Y, {
      font: '36px sans-serif',
      color: BRASS,
      align: 'center',
      baseline: 'middle',
    });

    const { shipSlots, pilotSlots } = this.getSlotLayout(ctx.width, ctx.height);

    for (let i = 0; i < shipSlots.length; i++) {
      const s = shipSlots[i];
      const shipId = SHIP_IDS[i];
      const isFocused = this.focusedRow === 'ship' && i === this.focusedIndex;
      const isSelected = i === this.selectedShipIndex;

      ctx.ctx.save();

      if (isFocused || isSelected) {
        ctx.ctx.shadowColor = SHIP_GLOW_COLORS[shipId];
        ctx.ctx.shadowBlur = isFocused ? 20 : 12;
      }

      ctx.ctx.fillStyle = SLOT_BG;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.fill();

      ctx.ctx.strokeStyle = isFocused ? BRASS : isSelected ? BRASS : COPPER;
      ctx.ctx.lineWidth = isFocused ? FRAME_WIDTH + 1 : isSelected ? FRAME_WIDTH : FRAME_WIDTH;
      ctx.ctx.globalAlpha = isFocused ? 1 : isSelected ? 0.95 : 0.8;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.stroke();

      ctx.ctx.restore();

      const img = this.sprites[shipId];
      const spriteAreaH = s.h - 24;
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

      const labelY = s.y + s.h + LABEL_GAP;
      drawText(ctx.ctx, SHIP_LABELS[shipId], s.x + s.w / 2, labelY, {
        font: '16px sans-serif',
        color: isFocused || isSelected ? SHIP_GLOW_COLORS[shipId] : WARM_WHITE,
        align: 'center',
        baseline: 'middle',
      });
    }

    for (let i = 0; i < pilotSlots.length; i++) {
      const s = pilotSlots[i];
      const pilotId = PILOT_IDS[i];
      const isFocused = this.focusedRow === 'pilot' && i === this.focusedIndex;
      const isSelected = i === this.selectedPilotIndex;

      ctx.ctx.save();

      if (isFocused || isSelected) {
        ctx.ctx.shadowColor = PILOT_GLOW_COLORS[pilotId];
        ctx.ctx.shadowBlur = isFocused ? 20 : 12;
      }

      ctx.ctx.fillStyle = SLOT_BG;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.fill();

      ctx.ctx.strokeStyle = isFocused ? BRASS : isSelected ? BRASS : COPPER;
      ctx.ctx.lineWidth = isFocused ? FRAME_WIDTH + 1 : isSelected ? FRAME_WIDTH : FRAME_WIDTH;
      ctx.ctx.globalAlpha = isFocused ? 1 : isSelected ? 0.95 : 0.8;
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.stroke();

      ctx.ctx.restore();

      const img = this.pilotSprites[pilotId];
      const portraitW = s.w;
      const portraitH = s.h;
      const portraitX = s.x;
      const portraitY = s.y;

      ctx.ctx.save();
      this.roundRect(ctx.ctx, s.x, s.y, s.w, s.h, SLOT_CORNER_RADIUS);
      ctx.ctx.clip();
      if (img && this.loaded) {
        drawImageCover(ctx.ctx, img, portraitX, portraitY, portraitW, portraitH);
      } else {
        ctx.ctx.fillStyle = PILOT_GLOW_COLORS[pilotId];
        ctx.ctx.globalAlpha = 0.5;
        ctx.ctx.fillRect(portraitX, portraitY, portraitW, portraitH);
        ctx.ctx.globalAlpha = 1;
      }
      ctx.ctx.restore();

      const labelY = s.y + s.h + LABEL_GAP;
      drawText(ctx.ctx, PILOT_LABELS[pilotId], s.x + s.w / 2, labelY, {
        font: '16px sans-serif',
        color: isFocused || isSelected ? PILOT_GLOW_COLORS[pilotId] : WARM_WHITE,
        align: 'center',
        baseline: 'middle',
      });
    }

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

import { SHIELD_KEY_CODES } from './input-config';

export class InputService {
  private keys: Set<string> = new Set();
  private gamepads: Map<number, Gamepad> = new Map();
  private lastClick: { x: number; y: number } | null = null;

  private preventDefaultKeys = new Set<string>([
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'Space',
    'Escape',
    'Enter',
    'KeyR',
    'KeyJ',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ]);

  init(canvas?: HTMLCanvasElement, additionalPreventDefaultKeys?: string[]): void {
    if (additionalPreventDefaultKeys) {
      for (const k of additionalPreventDefaultKeys) {
        this.preventDefaultKeys.add(k);
      }
    }
    if (canvas) {
      canvas.addEventListener('click', this.onClick);
    }
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.preventDefaultKeys.has(e.code)) {
      e.preventDefault();
    }
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private onGamepadConnected = (e: GamepadEvent): void => {
    this.gamepads.set(e.gamepad.index, e.gamepad);
  };

  private onGamepadDisconnected = (e: GamepadEvent): void => {
    this.gamepads.delete(e.gamepad.index);
  };

  private onClick = (e: MouseEvent): void => {
    const target = e.target as HTMLCanvasElement;
    if (target?.tagName === 'CANVAS') {
      const rect = target.getBoundingClientRect();
      const scaleX = target.width / rect.width;
      const scaleY = target.height / rect.height;
      this.lastClick = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  consumeClick(): { x: number; y: number } | null {
    const c = this.lastClick;
    this.lastClick = null;
    return c;
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  isKeyPressed(code: string): boolean {
    return this.keys.has(code);
  }

  getMoveAxis(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.keys.has('KeyW')) y -= 1;
    if (this.keys.has('KeyS')) y += 1;
    if (this.keys.has('KeyA')) x -= 1;
    if (this.keys.has('KeyD')) x += 1;

    this.gamepads.forEach((gp) => {
      const lx = Math.abs(gp.axes[0]) > 0.15 ? gp.axes[0] : 0;
      const ly = Math.abs(gp.axes[1]) > 0.15 ? gp.axes[1] : 0;
      x += lx;
      y += ly;
    });

    return { x, y };
  }

  isFirePressed(): boolean {
    if (this.keys.has('Space')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[0]?.pressed) return true;
    }
    return false;
  }

  /** Secondary fire: J (keyboard) or gamepad X (buttons[2]). */
  isSecondaryFirePressed(): boolean {
    if (this.keys.has('KeyJ')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[2]?.pressed) return true;
    }
    return false;
  }

  isEscapePressed(): boolean {
    if (this.keys.has('Escape')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[8]?.pressed) return true;
    }
    return false;
  }

  isStartPressed(): boolean {
    if (this.keys.has('Enter') || this.keys.has('Space')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[9]?.pressed) return true;
    }
    return false;
  }

  /** Primary action: Enter or gamepad A (buttons[0]). For Continue/Retry. */
  isPrimaryActionPressed(): boolean {
    if (this.keys.has('Enter')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[0]?.pressed) return true;
    }
    return false;
  }

  /** Retry: R key. */
  isRetryPressed(): boolean {
    return this.keys.has('KeyR');
  }

  /** Menu/Back: Escape or gamepad B (buttons[1]). */
  isMenuPressed(): boolean {
    if (this.keys.has('Escape')) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[1]?.pressed) return true;
    }
    return false;
  }

  /**
   * Menu navigation: left/right for ship select, etc.
   * Returns -1 (left), 1 (right), or 0.
   * Uses Arrow keys and left stick X / d-pad X.
   */
  getMenuNavigateX(): number {
    if (this.keys.has('ArrowLeft')) return -1;
    if (this.keys.has('ArrowRight')) return 1;
    for (const gp of this.gamepads.values()) {
      const stickX = Math.abs(gp.axes[0]) > 0.15 ? gp.axes[0] : 0;
      if (stickX !== 0) return stickX < 0 ? -1 : 1;
      const dpadX = gp.axes[6] ?? 0;
      if (Math.abs(dpadX) > 0.15) return dpadX < 0 ? -1 : 1;
      if (gp.buttons[14]?.pressed) return -1;
      if (gp.buttons[15]?.pressed) return 1;
    }
    return 0;
  }

  /**
   * Menu navigation: up/down for ship select pilot row, etc.
   * Returns -1 (up), 1 (down), or 0.
   * Uses Arrow keys and left stick Y / d-pad Y.
   */
  getMenuNavigateY(): number {
    if (this.keys.has('ArrowUp')) return -1;
    if (this.keys.has('ArrowDown')) return 1;
    for (const gp of this.gamepads.values()) {
      const stickY = Math.abs(gp.axes[1]) > 0.15 ? gp.axes[1] : 0;
      if (stickY !== 0) return stickY < 0 ? -1 : 1;
      const dpadY = gp.axes[7] ?? 0;
      if (Math.abs(dpadY) > 0.15) return dpadY < 0 ? -1 : 1;
      if (gp.buttons[12]?.pressed) return -1;
      if (gp.buttons[13]?.pressed) return 1;
    }
    return 0;
  }

  /** Shield: Shift or I (keyboard) or gamepad Y (buttons[3]). */
  isShieldPressed(): boolean {
    if (SHIELD_KEY_CODES.some((code) => this.keys.has(code))) return true;
    for (const gp of this.gamepads.values()) {
      if (gp.buttons[3]?.pressed) return true;
    }
    return false;
  }

  isClickInBounds(x: number, y: number, w: number, h: number, clickX: number, clickY: number): boolean {
    return clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h;
  }
}

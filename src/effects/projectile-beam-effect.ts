/** Gradient colors for projectile beam (core = leading edge, tip = trailing/transparent) */
export interface ProjectileBeamPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Configuration for a projectile beam. */
export interface ProjectileBeamConfig {
  palette: ProjectileBeamPalette;
  length?: number;
  width?: number;
  numSegments?: number;
  lengthFreq?: number;
  widthFreq?: number;
}

const DEFAULTS: Required<Omit<ProjectileBeamConfig, 'palette'>> = {
  length: 24,
  width: 6,
  numSegments: 3,
  lengthFreq: 10,
  widthFreq: 8,
};

/** Player: cyan per basic_gun_design_lock, art_style_guide */
export const PLAYER_PROJECTILE_BEAM_PALETTE: ProjectileBeamPalette = {
  core: '#00FFFF',
  mid: '#0088CC',
  tip: 'rgba(0, 100, 150, 0)',
};

/** Enemy: orange/amber per enemy_projectile_design_lock */
export const ENEMY_PROJECTILE_BEAM_PALETTE: ProjectileBeamPalette = {
  core: '#FF8C00',
  mid: '#E67A00',
  tip: 'rgba(180, 80, 0, 0)',
};

/** Player projectile beam preset: cyan, length 24, width 6 */
export const PLAYER_PROJECTILE_BEAM_CONFIG: ProjectileBeamConfig = {
  palette: PLAYER_PROJECTILE_BEAM_PALETTE,
  length: 24,
  width: 6,
  numSegments: 3,
  lengthFreq: 10,
  widthFreq: 8,
};

/** Enemy projectile beam preset: orange, length 20, width 5 */
export const ENEMY_PROJECTILE_BEAM_CONFIG: ProjectileBeamConfig = {
  palette: ENEMY_PROJECTILE_BEAM_PALETTE,
  length: 20,
  width: 5,
  numSegments: 3,
  lengthFreq: 10,
  widthFreq: 8,
};

/**
 * Draw a glowing projectile beam centered at (x, y), oriented along velocity (vx, vy).
 * Gradient: tip (transparent) at trailing edge, core (bright) at leading edge.
 */
export function drawProjectileBeam(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
  time: number,
  config: ProjectileBeamConfig
): void {
  const palette = config.palette;
  const length = config.length ?? DEFAULTS.length;
  const width = config.width ?? DEFAULTS.width;
  const numSegments = config.numSegments ?? DEFAULTS.numSegments;
  const lengthFreq = config.lengthFreq ?? DEFAULTS.lengthFreq;
  const widthFreq = config.widthFreq ?? DEFAULTS.widthFreq;

  let dirX = vx;
  let dirY = vy;
  const len = Math.hypot(dirX, dirY);
  if (len < 1e-6) {
    dirX = 0;
    dirY = -1;
  } else {
    dirX /= len;
    dirY /= len;
  }

  const perpX = -dirY;
  const perpY = dirX;

  for (let i = 0; i < numSegments; i++) {
    const lengthScale = 0.7 + 0.3 * Math.sin(time * lengthFreq + i * 1.5);
    const widthScale = 0.8 + 0.2 * Math.cos(time * widthFreq + i);
    const segLength = length * lengthScale * 0.5;
    const segWidth = width * widthScale * 0.5;

    const backX = x - dirX * segLength;
    const backY = y - dirY * segLength;
    const frontX = x + dirX * segLength;
    const frontY = y + dirY * segLength;

    const backLeftX = backX - perpX * segWidth;
    const backLeftY = backY - perpY * segWidth;
    const backRightX = backX + perpX * segWidth;
    const backRightY = backY + perpY * segWidth;
    const frontLeftX = frontX - perpX * segWidth;
    const frontLeftY = frontY - perpY * segWidth;
    const frontRightX = frontX + perpX * segWidth;
    const frontRightY = frontY + perpY * segWidth;

    const gradient = ctx.createLinearGradient(backX, backY, frontX, frontY);
    gradient.addColorStop(0, palette.tip);
    gradient.addColorStop(0.4, palette.mid);
    gradient.addColorStop(1, palette.core);

    ctx.beginPath();
    ctx.moveTo(backLeftX, backLeftY);
    ctx.lineTo(backRightX, backRightY);
    ctx.lineTo(frontRightX, frontRightY);
    ctx.lineTo(frontLeftX, frontLeftY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

/** Gradient colors for thruster (core = near ship, tip = far/transparent) */
export interface ThrusterPalette {
  core: string;
  mid: string;
  tip: string;
}

/** Thruster direction: down = exhaust below (player), up = exhaust above (enemies flying south) */
export type ThrusterDirection = 'down' | 'up';

/** Full configuration for a thruster instance. All params tunable. */
export interface ThrusterConfig {
  palette: ThrusterPalette;
  widthRatio?: number;
  heightRatio?: number;
  originXOffset?: number;
  originYOffset?: number;
  direction?: ThrusterDirection;
  numSegments?: number;
  heightFreq?: number;
  widthFreq?: number;
  drawOrder?: 'behind' | 'inFront';
  northWidthScale?: number;
  northHeightScale?: number;
  southWidthScale?: number;
  southHeightScale?: number;
}

const DEFAULTS: Required<Omit<ThrusterConfig, 'palette'>> = {
  widthRatio: 0.06,
  heightRatio: 0.396,
  originXOffset: 0.5,
  originYOffset: 0.74,
  direction: 'down',
  numSegments: 4,
  heightFreq: 10,
  widthFreq: 8,
  drawOrder: 'inFront',
  northWidthScale: 1,
  northHeightScale: 1,
  southWidthScale: 1,
  southHeightScale: 1,
};

/** Ship propulsion palettes per art_style_guide.md */
export const THRUSTER_PALETTES: Record<string, ThrusterPalette> = {
  aether: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  firey: { core: '#FFAA00', mid: '#FF6600', tip: 'rgba(200, 50, 0, 0)' },
  sparrow: { core: '#00FFFF', mid: '#0088CC', tip: 'rgba(0, 100, 150, 0)' },
  turtle: { core: '#FFBF00', mid: '#E6A800', tip: 'rgba(180, 120, 0, 0)' },
  wolf: { core: '#E8E8E8', mid: '#B0B0B0', tip: 'rgba(120, 120, 120, 0)' },
  dragon: { core: '#FF4500', mid: '#FF6600', tip: 'rgba(200, 50, 0, 0)' },
  scout: { core: '#B8C900', mid: '#8B9A00', tip: 'rgba(80, 90, 0, 0)' },
};

/** Sparrow: cyan/blue aether glow. */
export const SPARROW_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.sparrow,
  widthRatio: 0.06,
  heightRatio: 0.396,
  originYOffset: 0.74,
  numSegments: 4,
  heightFreq: 10,
  widthFreq: 8,
  drawOrder: 'inFront',
  northWidthScale: 1.15,
  northHeightScale: 1.5,
  southWidthScale: 0.9,
  southHeightScale: 0.75,
};

/** Turtle: amber/gold per art_style_guide. */
export const TURTLE_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.turtle,
  ...DEFAULTS,
  originYOffset: 0.84,
  widthRatio: 0.12,
  heightRatio: 0.317,
  northWidthScale: 1.15,
  northHeightScale: 1.2,
  southWidthScale: 0.85,
  southHeightScale: 0.8,
};

/** Wolf: white/silver per art_style_guide. */
export const WOLF_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.wolf,
  ...DEFAULTS,
  widthRatio: 0.075,
  originYOffset: 0.79,
  drawOrder: 'behind',
  northWidthScale: 1.35,
  northHeightScale: 1.33,
  southWidthScale: 1.1,
  southHeightScale: 0.67,
};

/** Dragon: orange/red per art_style_guide. */
export const DRAGON_THRUSTER_CONFIG: ThrusterConfig = {
  palette: THRUSTER_PALETTES.dragon,
  ...DEFAULTS,
  widthRatio: 0.096,
  heightRatio: 0.317,
  originYOffset: 0.66,
  drawOrder: 'behind',
  northWidthScale: 1.2,
  northHeightScale: 1.25,
  southWidthScale: 1.25,
  southHeightScale: 0.8,
};

/** Scout: sickly green/yellow per enemy palette. */
export const SCOUT_THRUSTER_CONFIG: ThrusterConfig = {
  ...DEFAULTS,
  palette: THRUSTER_PALETTES.scout,
  widthRatio: 0.08,
  heightRatio: 0.25,
  originYOffset: 0.22,
  direction: 'up',
  numSegments: 3,
};

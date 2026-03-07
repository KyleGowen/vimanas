/** Common options for primary weapon fire. Used by Wolf, Dragon, Turtle. */
export interface PrimaryWeaponOptions {
  shipX: number;
  shipY: number;
  shipSize: number;
  attack: number;
  spawnTime: number;
}

/** Wing-tip muzzle positions: 25% and 75% of ship width, 45% from top. Used by Wolf and Dragon. */
export function getWingTipMuzzlePositions(opts: PrimaryWeaponOptions): {
  leftX: number;
  rightX: number;
  y: number;
} {
  return {
    leftX: opts.shipX + opts.shipSize * 0.25,
    rightX: opts.shipX + opts.shipSize * 0.75,
    y: opts.shipY + opts.shipSize * 0.45,
  };
}

/** Pulse scale for shield radius: 0.98 + 0.02 * sin(gameTime * freq). Used by Wolf, Turtle, Dragon. */
export function getShieldPulseScale(gameTime: number, freq: number): number {
  return 0.98 + 0.02 * Math.sin(gameTime * freq);
}

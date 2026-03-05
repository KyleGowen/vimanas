/**
 * Weapon strength formula per basic_gun_design_lock.md.
 * weaponStrength = Attack × 0.25
 * Sparrow (Attack 20) → 5 damage per shot.
 */
export function weaponStrength(attack: number): number {
  return attack * 0.25;
}

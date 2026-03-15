/**
 * Resolves CEO-facing attack pattern names to formation types and movement behaviors.
 * Per docs/design_system/attack_pattern_reference.md.
 */

import type { FormationType } from './level-spec';

/** Movement behavior IDs for scout path. Per attack pattern reference. */
export type MovementBehaviorId =
  | 'straight'
  | 'zig_zag'
  | 'scatter_converge'
  | 'pincer_swoop'
  | 'swoop_in_out'
  | 'dive_arc'
  | 'sniper_pause'
  | 'column_advance';

/** Canonical CEO names that map to a formation. Case-insensitive, trimmed. */
const PATTERN_TO_FORMATION: Record<string, FormationType> = {
  'wedge assault': 'v',
  'scatter & converge': 'staggered_wedge',
  'crescent swarm': 'v',
  'zig-zag pressure': 'line',
  'pincer assault': 'pincer',
  'column advance': 'v',
  'side winders': 'pincer',
  'wall of fire': 'staggered_wedge',
  'loops & dives': 'v',
  'dive bombers': 'pincer',
  'sniper attack': 'pincer',
  'in & out': 'pincer',
  'burst surge': 'pincer',
  'arcing barrage': 'pincer',
  'staggered rushdown': 'staggered_wedge',
  'persistent dive bomb': 'staggered_wedge',
};

/** Canonical CEO names that map to a movement behavior. Case-insensitive, trimmed. */
const PATTERN_TO_BEHAVIOR: Record<string, MovementBehaviorId> = {
  'wedge assault': 'straight',
  'scatter & converge': 'scatter_converge',
  'crescent swarm': 'straight',
  'zig-zag pressure': 'zig_zag',
  'pincer assault': 'pincer_swoop',
  'column advance': 'straight',
  'side winders': 'pincer_swoop',
  'wall of fire': 'straight',
  'loops & dives': 'dive_arc',
  'dive bombers': 'dive_arc',
  'sniper attack': 'sniper_pause',
  'in & out': 'swoop_in_out',
  'burst surge': 'straight',
  'arcing barrage': 'pincer_swoop',
  'staggered rushdown': 'straight',
  'persistent dive bomb': 'dive_arc',
};

/**
 * Resolve an attack pattern name (e.g. "Wedge Assault") to a FormationType.
 * Returns null if the pattern has no current mapping.
 */
export function resolveAttackPatternToFormation(ceoName: string): FormationType | null {
  const key = ceoName.trim().toLowerCase();
  return PATTERN_TO_FORMATION[key] ?? null;
}

/**
 * Resolve an attack pattern name to a MovementBehaviorId.
 * Returns 'straight' when pattern is missing or unknown.
 */
export function resolveAttackPatternToMovementBehavior(ceoName: string): MovementBehaviorId {
  const key = ceoName.trim().toLowerCase();
  return PATTERN_TO_BEHAVIOR[key] ?? 'straight';
}

/**
 * Resolve attack pattern names in a level spec's waves.
 * Mutates each wave: if attackPattern is set, sets formation from the resolver (or keeps existing formation);
 * if formation was missing, uses resolved value or 'v' as fallback.
 * Call after validating level spec so every wave ends up with formation set.
 */
export function resolveAttackPatternsInSpec(spec: {
  waves: Array<{ formation?: FormationType; attackPattern?: string }>;
}): void {
  for (const wave of spec.waves) {
    const resolved = wave.attackPattern
      ? resolveAttackPatternToFormation(wave.attackPattern)
      : null;
    wave.formation = resolved ?? wave.formation ?? 'v';
  }
}

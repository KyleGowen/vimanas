# Enemy Type & Style Taxonomy

**Phase 9 · 9.A.5**

Enemy tiers (Scout, Medium, Elite) and behavior styles (aggressive, defensive, swarm, mixed). CEO says "focus on swarm style"; system selects appropriate formation mix and spawn pacing. Gates 9.2 (WaveSpawner refactor) and level spec interpretation.

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Scout design lock** | [scout_design_lock.md](scout_design_lock.md) | Scout tier; formations (V, Staggered Wedge, Pincer); swarm-like behavior |
| **Wave design spec** | [wave_design_spec.md](wave_design_spec.md) | Formation → formation read (flock, hive-mind, decentralized) |
| **Enemy hierarchy** | [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout spec; insectoid; swarm formations |

---

## 1. Enemy Types (Tiers)

| Type | Status | Description |
|------|--------|-------------|
| `scout` | Implemented (Phase 3) | Tier 1. Smallest, insectoid, swarm-like. HP 15, Defense 1. Formations: V, Staggered Wedge, Pincer. |
| `medium` | Phase 12 | Tier 2. Larger, distinct behavior vs Scout. Per medium_enemy_design_lock (future). |
| `elite` | Phase 12 | Tier 3. Mini-boss feel; unique ability; rewarding. Per elite_enemy_design_lock (future). |

**Level spec:** `enemyType` in WaveConfig. Scout-only until Phase 12. Invalid type falls back to scout.

---

## 2. Enemy Styles

Style influences formation mix and pacing when level spec uses `enemyStyle` without explicit per-wave overrides.

| Style | Formation emphasis | Spawn pacing | Read |
|-------|-------------------|--------------|------|
| `aggressive` | Pincer-heavy; converging threat | Tighter stagger; shorter between-wave delay | Rush the player; lateral pressure |
| `defensive` | V, Staggered Wedge; single cone | Looser stagger; longer between-wave delay | Hold back; deliberate approach |
| `swarm` | Staggered Wedge-heavy; depth | Medium stagger; medium delay | Many weak; hive-mind; overwhelming numbers |
| `mixed` | Balanced V, Wedge, Pincer | Per difficulty preset | Default; variety |

---

## 3. Style → Formation Mix (Recommendation)

When Director generates a level from "enemies should focus on X style", use this mix:

| Style | Wave 1 | Wave 2 | Wave 3 | Wave 4 | Wave 5 |
|-------|--------|--------|--------|--------|--------|
| aggressive | pincer | pincer | staggered_wedge | pincer | pincer |
| defensive | v | v | staggered_wedge | staggered_wedge | pincer |
| swarm | staggered_wedge | staggered_wedge | staggered_wedge | staggered_wedge | pincer |
| mixed | v | staggered_wedge | staggered_wedge | pincer | pincer |

**Override:** Level spec can explicitly set `formation` per wave. Style is a hint for generation; explicit wave config wins.

---

## 4. Style → Stagger / Delay Adjustment

| Style | Stagger multiplier | Between-wave multiplier |
|-------|-------------------|-------------------------|
| aggressive | 0.9 | 0.85 |
| defensive | 1.1 | 1.15 |
| swarm | 1.0 | 0.95 |
| mixed | 1.0 | 1.0 |

Multiply base (from difficulty curve) by these. Optional; level spec can override per wave.

---

## 5. CEO Request Mapping

| CEO says | enemyStyle |
|----------|------------|
| "focus on aggressive" | aggressive |
| "enemies should rush" | aggressive |
| "defensive / hold back" | defensive |
| "swarm style" | swarm |
| "lots of weak enemies" | swarm |
| "mixed" or unspecified | mixed |

---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Enemy type:** Only `scout` spawns until Phase 12. WaveSpawner ignores `medium`/`elite` or logs warning.
- **Style:** Applied at level generation time (Director/Level Encounter). Runtime uses explicit wave config.

---

## 7. References

| Document | Purpose |
|----------|---------|
| [scout_design_lock.md](scout_design_lock.md) | Scout stats; formations |
| [wave_design_spec.md](wave_design_spec.md) | Formation semantics |
| [difficulty_curve_design.md](difficulty_curve_design.md) | Base stagger; delay |
| [level_spec_schema.md](level_spec_schema.md) | enemyStyle field |

---

## Gate

This document gates:
- **9.2** — WaveSpawner can apply style-derived formation mix when spec omits explicit waves
- **9.A.7** — Director protocol maps CEO style phrases to enemyStyle

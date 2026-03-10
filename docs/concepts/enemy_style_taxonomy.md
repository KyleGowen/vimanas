# Enemy Type & Style Taxonomy

**Phase 8 · 8.A.5**

Enemy hierarchy (Scout → Medium → Elite → Mini-boss → Boss) and behavior styles (aggressive, defensive, swarm, mixed). CEO says "focus on swarm style"; system selects appropriate formation mix and spawn pacing. **Extensible:** This list will expand over time. Gates 8.2 (WaveSpawner refactor) and level spec interpretation.

---

## P0 Mocks Considered


| P0 Mock               | Path                                                                                      | What it informs                                                          |
| --------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Scout design lock** | [scout_design_lock.md](scout_design_lock.md)                                              | Scout tier; formations (V, Staggered Wedge, Pincer); swarm-like behavior |
| **Wave design spec**  | [wave_design_spec.md](wave_design_spec.md)                                                | Formation → formation read (flock, hive-mind, decentralized)             |
| **Enemy hierarchy**   | [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout spec; insectoid; swarm formations                                  |


---

## 1. Enemy Hierarchy (Tiers)

**Design intent:** This list will expand over time. Each tier has a distinct role and feel.


| Tier          | Status                | Description                                                                                                              |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Scout**     | Implemented (Phase 3) | Light ships. Very swarm-like. Appear in formations (V, Staggered Wedge, Pincer, etc.). Many per wave. HP 15, Defense 1.  |
| **Medium**    | Phase 12              | Fewer per wave than Scouts. Stronger, more interesting weapons. Distinct behavior vs Scout.                              |
| **Elite**     | Phase 12              | Same base as Scout or Medium, but better: more HP, slightly different color, one extra shot type. Quality over quantity. |
| **Mini-boss** | Phase 12              | Solo encounter; mini-boss feel. Optional per level. Per [boss_archetype_library.md](boss_archetype_library.md).          |
| **Boss**      | Implemented (Phase 4) | Level apex. Solo encounter; phases/forms. Per [boss_archetype_library.md](boss_archetype_library.md).                    |


**Wave config:** `enemyType` in WaveConfig = `scout`  `medium`  `elite`. Wave enemies only. Scout-only until Phase 12; invalid type falls back to scout.

**Level config:** `miniboss` (optional) and `boss` are configured at level level, not in waves. See level_spec_schema §4–5.

---

## 2. Enemy Styles

Style influences formation mix and pacing when level spec uses `enemyStyle` without explicit per-wave overrides.


| Style        | Formation emphasis              | Spawn pacing                                | Read                                       |
| ------------ | ------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `aggressive` | Pincer-heavy; converging threat | Tighter stagger; shorter between-wave delay | Rush the player; lateral pressure          |
| `defensive`  | V, Staggered Wedge; single cone | Looser stagger; longer between-wave delay   | Hold back; deliberate approach             |
| `swarm`      | Staggered Wedge-heavy; depth    | Medium stagger; medium delay                | Many weak; hive-mind; overwhelming numbers |
| `mixed`      | Balanced V, Wedge, Pincer       | Per difficulty preset                       | Default; variety                           |


---

## 3. Style → Formation Mix (Recommendation)

When Director generates a level from "enemies should focus on X style", use this mix:


| Style      | Wave 1          | Wave 2          | Wave 3          | Wave 4          | Wave 5 |
| ---------- | --------------- | --------------- | --------------- | --------------- | ------ |
| aggressive | pincer          | pincer          | staggered_wedge | pincer          | pincer |
| defensive  | v               | v               | staggered_wedge | staggered_wedge | pincer |
| swarm      | staggered_wedge | staggered_wedge | staggered_wedge | staggered_wedge | pincer |
| mixed      | v               | staggered_wedge | staggered_wedge | pincer          | pincer |


**Override:** Level spec can explicitly set `formation` per wave. Style is a hint for generation; explicit wave config wins.

---

## 4. Style → Stagger / Delay Adjustment


| Style      | Stagger multiplier | Between-wave multiplier |
| ---------- | ------------------ | ----------------------- |
| aggressive | 0.9                | 0.85                    |
| defensive  | 1.1                | 1.15                    |
| swarm      | 1.0                | 0.95                    |
| mixed      | 1.0                | 1.0                     |


Multiply base (from difficulty curve) by these. Optional; level spec can override per wave.

---

## 5. CEO Request Mapping

Maps CEO phrases to `enemyStyle`. Per [director_level_request_protocol.md](director_level_request_protocol.md).


| CEO says                                                  | enemyStyle |
| --------------------------------------------------------- | ---------- |
| "focus on aggressive" / "enemies should rush"             | aggressive |
| "focus on defensive" / "defensive" / "hold back"          | defensive  |
| "focus on swarm" / "swarm style" / "lots of weak enemies" | swarm      |
| "mixed" / unspecified                                     | mixed      |


---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md). Combat-specific notes:

- **Enemy type fallback:** Invalid or unknown `enemyType` in WaveConfig falls back to `scout`. WaveSpawner ignores `medium`/`elite` until Phase 12 and may log a warning.
- **Style application:** `enemyStyle` is applied at **level generation time** (Director/Level Encounter). At **runtime**, WaveSpawner reads explicit wave config (formation, stagger, delay). If a wave omits formation, fall back to style-derived recommendation or `mixed` default.
- **Missing enemyStyle:** If level spec omits `enemyStyle`, default to `mixed`.

---

## 7. References


| Document                                                                 | Purpose                         |
| ------------------------------------------------------------------------ | ------------------------------- |
| [scout_design_lock.md](scout_design_lock.md)                             | Scout stats; formations         |
| [wave_design_spec.md](wave_design_spec.md)                               | Formation semantics             |
| [difficulty_curve_design.md](difficulty_curve_design.md)                 | Base stagger; delay             |
| [level_spec_schema.md](level_spec_schema.md)                             | enemyStyle, miniboss, boss      |
| [boss_archetype_library.md](boss_archetype_library.md)                   | Mini-boss, Boss archetypes      |
| [director_level_request_protocol.md](director_level_request_protocol.md) | CEO phrase → enemyStyle mapping |


---

## Gate

This document gates:

- **8.2** — WaveSpawner can apply style-derived formation mix when spec omits explicit waves
- **8.A.7** — Director protocol maps CEO style phrases to enemyStyle

---

## 8. Extensibility

**CEO intent:** This enemy hierarchy will expand over time. Use the steps below when adding tiers or styles.

### Adding a new wave enemy type (e.g. Heavy, Drone)

1. **Design lock:** Create design lock (stats, visuals, weapons, behavior).
2. **Taxonomy:** Add tier to §1 Enemy Hierarchy with description and status.
3. **Schema:** Add type to `enemyType` enum in [level_spec_schema.md](level_spec_schema.md) and level-spec JSON schema.
4. **WaveSpawner:** Implement spawn logic; formations as needed.
5. **Spawn density:** Define typical count per wave vs Scout (fewer = more impactful).

### Adding Mini-boss or Boss archetypes

Per [boss_archetype_library.md](boss_archetype_library.md). Add archetype; configure via level spec `miniboss`/`boss`.

### Adding a new enemy style

1. **Taxonomy:** Add style to §2 Enemy Styles (formation emphasis, spawn pacing, read).
2. **Formation mix:** Add row to §3 Style → Formation Mix.
3. **Stagger/delay:** Add row to §4 Style → Stagger / Delay Adjustment.
4. **CEO mapping:** Add phrase(s) to §5 and [director_level_request_protocol.md](director_level_request_protocol.md).
5. **Schema:** Add to `enemyStyle` enum in level_spec_schema.


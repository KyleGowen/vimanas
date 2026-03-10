# Boss / Mini-Boss Archetype Library

**Phase 8 · 8.A.6**

Archetype ID → appearance (visual reference), behavior pattern. CEO says "boss looks like X, behaves like Y"; system maps to archetype. Configurable per level via level spec. Gates 8.5 (Boss/mini-boss config) and Director level generation.

---

## P0 Mocks Considered


| P0 Mock              | Path                                                                                       | What it informs                                                         |
| -------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Boss mocks**       | [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md)                  | Root-Seeker (forest, organic); Conduit-Crawler (industrial, mechanical) |
| **Boss placeholder** | [boss_placeholder_design.md](boss_placeholder_design.md)                                   | HP bar; defeat trigger; visual placeholder                              |
| **Enemy hierarchy**  | [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md)  | Insectoid language; scale                                               |
| **Forest enemies**   | [forest_level_enemy_design.md](p8_mocks/forest_level_enemies/forest_level_enemy_design.md) | Mini-boss visual spec (forest)                                          |


---

## 1. Boss Archetypes


| Archetype ID      | Display Name    | Status                | Appearance                                                                                      | Behavior                                          |
| ----------------- | --------------- | --------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `placeholder`     | Placeholder     | Implemented (Phase 4) | Block or simple sprite; copper frame                                                            | Stationary; takes damage; defeat → level complete |
| `root_seeker`     | Root-Seeker     | Phase 12              | Forest-organic; 6–8 appendages; dark brown carapace; amber cores; still reads as a space craft. | Phase-based; 2+ phases; vine/root tendrils        |
| `conduit_crawler` | Conduit-Crawler | Phase 12              | Industrial-mechanical; tower-like; piston arms; purple-grey; copper                             | Phase-based; 2+ phases; turret volleys            |


### 1.1 Placeholder (Current)

- **Visual:** Procedural block or `/images/enemies/boss_placeholder.png`
- **Behavior:** Stationary; HP bar; defeat triggers level complete
- **Config:** `hp` override in level spec

### 1.2 Root-Seeker (Future)

- **Visual:** Per boss_mocks_deliverable; forest boss
- **Behavior:** 2+ phases; firing patterns; unique abilities per root_seeker_design_lock
- **Config:** `hp`, `phases` override

### 1.3 Conduit-Crawler (Future)

- **Visual:** Per boss_mocks_deliverable; industrial boss
- **Behavior:** 2+ phases; distinct from Root-Seeker per conduit_crawler_design_lock
- **Config:** `hp`, `phases` override

---

## 2. Phases and Forms

**Bosses change as the player reduces their HP.** We call these transitions **phases** or **forms**.


| Concept                 | Description                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase / Form**        | A distinct state of the boss, triggered at HP thresholds. As HP drops (e.g. 75%, 50%, 25%), the boss transitions to the next phase.                           |
| **Per-phase variation** | Each phase can have **different shots** (firing patterns, projectile types, fire rate) and **different hit boxes** (collision shape, size, vulnerable zones). |
| **Design intent**       | Phases keep fights evolving—player adapts to new threats and weak points. R-Type / 1943: boss arms blow off, new patterns emerge.                             |


**Examples:**

- Phase 1: Single turret, large hit box. Phase 2: Turret destroyed, side arms fire; smaller core hit box.
- Phase 1: Vine tendrils block shots; center vulnerable. Phase 2: Tendrils retract; spread beams; different hit zones.

**Level spec:** `boss.phases` (optional) overrides archetype default. Placeholder has 1 phase; Root-Seeker and Conduit-Crawler have 2+.

---

## 3. Behavior Patterns


| Pattern           | Description                                                                            | Used by                      |
| ----------------- | -------------------------------------------------------------------------------------- | ---------------------------- |
| `stationary`      | Does not move; may rotate or fire                                                      | Placeholder boss             |
| `moving`          | Moves in pattern (e.g. up/down, orbit)                                                 | Phase 12 bosses              |
| `phase_based`     | 2+ phases; HP thresholds trigger phase change; different shots and hit boxes per phase | Root-Seeker, Conduit-Crawler |
| `mini_stationary` | Mini-boss holds position; fires volleys or aimed shots                                 | elite_medium                 |
| `mini_strafing`   | Mini-boss strafes horizontally or weaves; fires while moving                           | elite_scout                  |


**Level spec:** `boss.archetypeId` / `miniboss.archetypeId` selects archetype. Behavior is intrinsic to archetype; no separate behavior field in initial schema.

---

## 4. Mini-Boss Archetypes


| Archetype ID   | Display Name | Status   | Appearance                                                           | Behavior                              |
| -------------- | ------------ | -------- | -------------------------------------------------------------------- | ------------------------------------- |
| `elite_scout`  | Elite Scout  | Phase 12 | Scout-derived; ~3× Scout; multi-segment carapace; amber/orange cores | Strafing; rapid fire                  |
| `elite_medium` | Elite Medium | Phase 12 | Medium-derived; ~4× Scout; heavier silhouette; vine/root motifs      | Stationary or slow drift; volley fire |


**Level spec:** `miniboss.archetypeId`. Null = no mini-boss.

### 4.1 Elite Scout

- **Visual:** Scout base elevated to mini-boss scale (~3× Scout). Multi-segment insectoid carapace; swept wings; darker brown with amber/orange glowing cores. Reads as "fast lieutenant"—same family as Scout, clearly tougher.
- **Behavior:** `mini_strafing`. Strafes horizontally across screen; fires rapid aimed shots while moving. Periodically pauses to unleash a burst pattern. Aggressive; rewards prediction.
- **Config:** `hp` override; default HP ~150 (10× Scout).

### 4.2 Elite Medium

- **Visual:** Medium base elevated (~4× Scout). Heavier, multi-limbed silhouette; vine/root tendril motifs; dark brown carapace with olive undertones and amber cores. "Forest lieutenant" or "Root-Seeker's herald"—foreshadows the boss.
- **Behavior:** `mini_stationary`. Holds position near screen top; fires volley patterns (spread shots, aimed bursts). May drift slowly left/right. Tanky; rewards sustained fire on weak point.
- **Config:** `hp` override; default HP ~250.

---

## 5. CEO Request Mapping


| CEO says                                          | archetypeId                                | Type     |
| ------------------------------------------------- | ------------------------------------------ | -------- |
| "boss like Root-Seeker"                           | root_seeker                                | boss     |
| "forest boss"                                     | root_seeker                                | boss     |
| "industrial boss"                                 | conduit_crawler                            | boss     |
| "boss like Conduit-Crawler"                       | conduit_crawler                            | boss     |
| "placeholder" or unspecified boss                 | placeholder                                | boss     |
| "behaves in phase-based way"                      | (inferred: root_seeker or conduit_crawler) | boss     |
| "stationary boss"                                 | placeholder                                | boss     |
| "mini-boss like elite scout" / "fast mini-boss"   | elite_scout                                | miniboss |
| "forest mini-boss" / "mini-boss herald"           | elite_medium                               | miniboss |
| "mini-boss like elite medium" / "tanky mini-boss" | elite_medium                               | miniboss |
| unspecified mini-boss                             | elite_scout                                | miniboss |


---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Unknown archetype:** Fall back to `placeholder` (boss) or `elite_scout` (mini-boss). Log warning.
- **Phase 12:** When Root-Seeker, Conduit-Crawler, and mini-boss archetypes are implemented, add to BossFactory/MiniBossFactory. Placeholder remains default for unknown boss.

---

## 7. References


| Document                                                                                   | Purpose                                              |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md)                  | Root-Seeker, Conduit-Crawler visuals                 |
| [boss_placeholder_design.md](boss_placeholder_design.md)                                   | Placeholder spec                                     |
| [level_spec_schema.md](level_spec_schema.md)                                               | boss, miniboss config                                |
| [forest_level_enemy_design.md](p8_mocks/forest_level_enemies/forest_level_enemy_design.md) | Mini-boss visual spec (forest)                       |
| [enemy_style_taxonomy.md](enemy_style_taxonomy.md)                                         | Enemy hierarchy; mini-boss/boss are level encounters |


---

## Gate

This document gates:

- **8.5** — Boss/mini-boss config from level spec
- **8.A.7** — Director protocol maps CEO boss/mini-boss phrases to archetypeId


# Forest Level Enemy Design Spec

**Phase 8 · Level / Encounter Agent**

Design spec for the **first forest level** enemy roster: Scout, Medium, Elite, Mini-boss, and Boss. For Visual Design to produce one PNG sprite per type, aligned to forest theme and canon. No code.

---

## Design Intent

The forest level introduces the full enemy hierarchy in one environment. **Why these five types:** Scouts carry the swarm—waves feel like insects emerging from the canopy. Mediums add weight and weapon variety without overwhelming. Elites are the "lieutenants"—fewer, tougher, one extra shot type—so the player learns "this one is different." The Mini-boss is a solo spike: a memorable mid-level encounter that breaks wave flow. The Boss (Root-Seeker) is the apex: organic, rooted in the forest, vine/root tendrils and amber cores. Together they form a difficulty ramp that feels **organic and readable**—cohesion, alignment, separation—like swarm behavior, with Root-Seeker as the hive anchor.

**Forest theme fit:** Palette ties to [level_1_forest_design.md](../../level_1_forest_design.md)—dark forest green, olive, sage, earth brown, gold/copper accents. All five types share insectoid/biomechanical language and warm, organic reads (amber cores, carapace, vine/root hints where appropriate). Kaladesh-adjacent: ornate, alive, not industrial. Strict top-down; silhouettes must read at combat distance.

---

## Per-Type Briefs

### Scout

- **Role:** Wave enemy. Many per wave. Formations (V, Staggered Wedge, Pincer). Swarm-like; hive-mind read.
- **Size:** Smallest. Slightly smaller than Sparrow. Baseline for scale (1×).
- **Forest visual hook:** Insectoid arrowhead with twin-mandible prow and swept carapace wings. **Palette:** amber (#FFBF00), olive (#6b8e23), dark brown (#3d2914) per [scout_design_lock.md](../../scout_design_lock.md). Reads as "creature" not "craft"; warm, organic; at a glance: alien swarm from the canopy. No filigree that disappears at scale—mandible V, body axis, wing silhouettes carry the read.
- **Reference:** [scout_design_lock.md](../../scout_design_lock.md), [enemy_hierarchy_and_ship_notes.md](../../p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md).

### Medium

- **Role:** Wave enemy. Fewer per wave than Scouts. Stronger weapons; distinct behavior. Mid-tier pressure.
- **Size:** 1.5–2× Scout. More imposing; heavier silhouette.
- **Forest visual hook:** Heavier insectoid body; larger wing span; more segments and limbs. **Palette:** olive-green, dark forest green (#2d6a2d), dark brown; optional gold/copper (#B5A642, #B87333) accents to tie to forest level gilded elements. Glowing vents or energy cores; biomechanical but still organic. Reads as "heavier swarm member"—same family as Scout, clearly tougher.
- **Reference:** [enemy_hierarchy_and_ship_notes.md](../../p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) (Medium tier).

### Elite

- **Role:** Wave enemy. Quality over quantity; one extra shot type, more HP. "Lieutenant" read—player notices and prioritizes.
- **Size:** 2–3× Scout. Significant; distinct from standard wave enemies.
- **Forest visual hook:** Multi-segment; more limbs; biomechanical fusion (organic + mechanical). **Palette:** dark brown, olive, purple-grey (#6b6b8e) for depth, amber accents for cores/eyes. Vine- or root-like detail optional (tendrils, ribs) to foreshadow Root-Seeker. Reads as "mini-boss tier" in waves—unique silhouette, health bar candidate.
- **Reference:** [enemy_hierarchy_and_ship_notes.md](../../p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) (Elite tier), [enemy_style_taxonomy.md](../../enemy_style_taxonomy.md).

### Mini-boss

- **Role:** Solo encounter. Optional per level; breaks wave flow. Mini-boss feel—single target, memorable, tuned challenge.
- **Size:** Between Elite and Boss—e.g. ~3–4× Scout. Large enough to read as "boss-like" but not screen-filling.
- **Forest visual hook:** Scout or Medium base elevated: more segments, visible vine/root or tendril motifs, darker carapace. **Palette:** dark brown, olive, amber/orange cores; optional copper/gold accents. Silhouette: multi-limbed or multi-segment; reads as "forest lieutenant" or "Root-Seeker's herald." Distinct from Elite so the player immediately knows "this is a solo fight."
- **Reference:** [boss_archetype_library.md](../../boss_archetype_library.md) (Mini-boss archetypes: elite_scout, elite_medium), [enemy_hierarchy_and_ship_notes.md](../../p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md).

### Boss (Root-Seeker)

- **Role:** Level apex. Solo encounter; phases/forms. End-of-level threat.
- **Size:** Screen-filling or near. Dominant.
- **Forest visual hook:** Root-Seeker per [boss_mocks_deliverable.md](../../p0_mocks/p0_4_boss/boss_mocks_deliverable.md): horizontal sprawl, 6–8 appendages (leg-like, mandible-like, vine/root tendrils). **Palette:** dark brown carapace, amber/orange glowing cores at joints and center. Insectoid biomechanical; "ancient predator rooted in the forest." Vine/root tendrils; organic-mechanical fusion. Sparrow in foreground, boss in background—scale and read locked from P0 mocks.
- **Reference:** [boss_mocks_deliverable.md](../../p0_mocks/p0_4_boss/boss_mocks_deliverable.md), [boss_archetype_library.md](../../boss_archetype_library.md) (root_seeker).

---

## Asset List

| Filename             | Enemy type | Description |
|----------------------|------------|-------------|
| scout_forest.png     | Scout      | Small insectoid swarm unit; amber/olive/dark brown; twin-mandible prow, carapace wings. |
| medium_forest.png    | Medium     | Heavier insectoid; 1.5–2× Scout; olive/dark green/dark brown; cores/accents. |
| elite_forest.png     | Elite      | Lieutenant-tier; 2–3× Scout; multi-segment, amber accents; optional vine/root detail. |
| miniboss_forest.png  | Mini-boss  | Solo encounter; forest lieutenant; vine/root hints; dark brown, amber/orange cores. |
| boss_forest.png      | Boss       | Root-Seeker; screen-filling; 6–8 appendages, vine/root tendrils, amber/orange cores. |

**Deliverable:** One PNG sprite per row. Top-down; readable at combat scale. Palette and silhouette aligned to forest level and canon.

---

## P0 Mocks Considered

| Document | Path | What it informs |
|----------|------|-----------------|
| **Level 1 Forest design** | [level_1_forest_design.md](../../level_1_forest_design.md) | Forest palette (#2d6a2d, #6b8e23, #8fbc8f, earth brown, gold #B5A642, copper #B87333); Kaladesh elements; strict top-down. |
| **Enemy style taxonomy** | [enemy_style_taxonomy.md](../../enemy_style_taxonomy.md) | Scout/Medium/Elite/Mini-boss/Boss roles; swarm style; wave vs solo. |
| **Enemy hierarchy and ship notes** | [enemy_hierarchy_and_ship_notes.md](../../p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Size/silhouette/palette per tier (Scout, Medium, Elite, Boss). |
| **Boss archetype library** | [boss_archetype_library.md](../../boss_archetype_library.md) | Root-Seeker = forest boss; mini-boss archetypes. |
| **Scout design lock** | [scout_design_lock.md](../../scout_design_lock.md) | Scout stats, silhouette, palette (amber, olive, dark brown). |
| **Boss mocks deliverable** | [boss_mocks_deliverable.md](../../p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Root-Seeker (forest): dark brown carapace, amber/orange cores, vine/root tendrils, insectoid biomechanical. |

---

## Gate

Visual Design uses this spec to produce the five forest-level enemy sprites. No code; asset handoff only.

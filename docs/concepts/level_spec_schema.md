# Level Spec Schema

**Phase 8 · 8.A.1**

Machine-readable schema for level definitions. The game loads level specs from JSON at runtime. CEO requests levels in natural language; Director delegates to Level/Encounter; specialist produces a level spec file. Gates 8.1 (Level config loader) and all Phase 8 tech.

**Extensible:** New themes, formations, enemy types, and top-level fields can be added. See §10 Extensibility and [docs/context/LEVEL_SPEC.md](../context/LEVEL_SPEC.md) for schema → code mapping.

---

## P0 Mocks Considered


| P0 Mock                   | Path                                                                          | What it informs                                                 |
| ------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Level 1 forest design** | [level_1_forest_design.md](level_1_forest_design.md)                          | Parallax layers (Far 0.3x, Mid 0.6x, Near 1.0x); theme; palette |
| **Wave sequence design**  | [wave_sequence_design.md](wave_sequence_design.md)                            | Wave count; formations; between-wave delays                     |
| **Wave design spec**      | [wave_design_spec.md](wave_design_spec.md)                                    | Formation types (V, Staggered Wedge, Pincer); stagger; spacing  |
| **Level mocks**           | [level_mocks_deliverable.md](p0_mocks/p0_3_levels/level_mocks_deliverable.md) | Themes: Forest, Industrial, Sky; parallax structure             |
| **Boss placeholder**      | [boss_placeholder_design.md](boss_placeholder_design.md)                      | Boss HP bar; defeat trigger; visual placeholder                 |


---

## 1. Top-Level Schema

```json
{
  "id": "string",
  "name": "string",
  "theme": "forest | industrial | sky | city_metropolis | volcano",
  "difficulty": "easy | medium | medium_hard | hard",
  "timing": {
    "preMiniBossSeconds": "number | null",
    "preBossSeconds": "number | null"
  },
  "waves": [ "WaveConfig" ],
  "enemyStyle": "aggressive | defensive | swarm | mixed",
  "miniboss": "MinibossConfig | null",
  "boss": "BossConfig"
}
```


| Field         | Type   | Required | Description                                                                                                                                                     |
| ------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | string | Yes      | Unique level ID (e.g. `level_1_forest`). Used for loading and save/load.                                                                                        |
| `name`        | string | Yes      | Display name (e.g. "Level 1: Forest").                                                                                                                          |
| `theme`       | enum   | Yes      | Background/parallax theme. Maps to asset paths per [level_theme_taxonomy.md](level_theme_taxonomy.md).                                                          |
| `difficulty`  | enum   | Yes      | Difficulty preset. Maps to concrete parameters per [difficulty_curve_design.md](difficulty_curve_design.md).                                                    |
| `timing`      | object | Yes      | Time-based triggers. `preMiniBossSeconds`: scroll/time until mini-boss spawns; `preBossSeconds`: until boss spawns. Null = no mini-boss or use wave completion. |
| `waves`       | array  | Yes      | Wave sequence. Each wave has formation, enemy type, count, stagger, between-wave delay.                                                                         |
| `enemyStyle`  | enum   | Yes      | Enemy behavior emphasis. Maps to formation mix and spawn pacing per [enemy_style_taxonomy.md](enemy_style_taxonomy.md).                                         |
| `miniboss`    | object | null     | No                                                                                                                                                              |
| `boss`        | object | Yes      | Boss config. Per [boss_archetype_library.md](boss_archetype_library.md).                                                                                        |
| `designNotes` | string | No       | CEO suggestions for the specialist when creating/revising levels. Game ignores at runtime.                                                                      |


---

## 2. Wave Config Schema

```json
{
  "formation": "v | staggered_wedge | pincer",
  "enemyType": "scout | medium | elite",
  "count": "number",
  "squads": "number",
  "enemiesPerSquad": "number",
  "staggerSeconds": "number",
  "betweenWaveDelaySeconds": "number",
  "spawnFrom": {
    "edge": "top | left | right | bottom",
    "position": "number (0-1)"
  }
}
```


| Field                     | Type   | Required | Description                                                                                                                                                                         |
| ------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formation`               | enum   | Yes      | Formation type. `v`, `staggered_wedge`, `pincer` per wave_design_spec.                                                                                                              |
| `enemyType`               | enum   | Yes      | Enemy tier. `scout` (Phase 3); `medium`, `elite` when Phase 12 ships.                                                                                                               |
| `count`                   | number | No       | Total enemies in wave. When present, overrides squads × enemiesPerSquad; when omitted, derived from formation default per [wave_composition_schema.md](wave_composition_schema.md). |
| `squads`                  | number | No       | Number of squads. For pincer: 2 wings. For single formation: 1.                                                                                                                     |
| `enemiesPerSquad`         | number | No       | Enemies per squad. V=5, Staggered Wedge=7, Pincer=6 (2×3).                                                                                                                          |
| `staggerSeconds`          | number | Yes      | Seconds between each enemy spawn within wave. Per formation spec.                                                                                                                   |
| `betweenWaveDelaySeconds` | number | Yes      | Seconds after wave complete before next wave spawns.                                                                                                                                |
| `spawnFrom`               | object | No       | **Where on screen the wave appears.** See §2.2 Spawn Position. Omit = top center (default).                                                                                         |
| `eliteCount`              | number | No       | **Secondary composition:** number of elite enemies in this wave (default 0). Wave completes when all scouts and elites cleared.                                                   |
| `suggestion`              | string | No       | Per-wave CEO suggestion (e.g. "pincer", "more scouts"). Specialist considers when designing; game ignores.                                                                          |


### 2.2 Spawn Position (`spawnFrom`)

Optional. When omitted, wave spawns at **top center** (current default). Use `spawnFrom` to place waves at different screen locations.


| Field      | Type         | Default  | Description                                                                                                                                  |
| ---------- | ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `edge`     | `"top"`      | `"left"` | `"right"`                                                                                                                                    |
| `position` | number (0–1) | `0.5`    | Position along that edge. **Top:** 0=left, 0.5=center, 1=right. **Left/right:** 0=top of edge, 1=bottom. Normalized; resolution-independent. |


**Examples:**

- `"spawnFrom": { "edge": "top", "position": 0.25 }` — Wave from top-left area
- `"spawnFrom": { "edge": "top", "position": 0.75 }` — Wave from top-right area
- `"spawnFrom": { "edge": "left" }` — Wave from left side, centered vertically (position defaults to 0.5)

**Note:** For Level 1, `count` is implicit from formation (V=5, Staggered Wedge=7, Pincer=6). Schema allows explicit override for custom levels.

### 2.1 Wave Composition

Composition semantics—when to use `count` vs `squads`/`enemiesPerSquad`, formation defaults, derivation rules, and WaveSpawner consumption—are defined in [wave_composition_schema.md](wave_composition_schema.md). Summary: `count` overrides when present; otherwise `squads × enemiesPerSquad` or formation default (V=5, Staggered Wedge=7, Pincer=6).

---

## 3. Timing Config


| Field                | Type           | Description                                                                                 |
| -------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| `preMiniBossSeconds` | number \| null | Mini-boss spawns after N seconds. Null = not time-triggered.                                |
| `preBossSeconds`     | number \| null | Boss spawns after N seconds. Null = not time-triggered.                                     |
| `preMiniBossWaves`   | number \| null | Mini-boss spawns after N waves complete. Null = not wave-triggered.                         |
| `preBossWaves`       | number \| null | Boss spawns after N waves complete. Null = not wave-triggered (uses time or all-complete).  |


**Trigger Priority:**

1. **Time-based:** If `preBossSeconds` is set AND gameTime ≥ preBossSeconds → boss spawns (time wins)
2. **Wave-based:** Else if `preBossWaves` is set AND completedWaves ≥ preBossWaves → boss spawns (wave wins)
3. **All-waves:** Else if both null → boss spawns when ALL waves complete (existing behavior via onLevelWavesComplete)

Same priority applies to mini-boss with `preMiniBossSeconds` / `preMiniBossWaves`.

**Implementation:** Level can use scroll-based, time-based, or wave-based triggers. `preBossSeconds` can be derived from scroll rate × distance. For "1 min before mini-boss, 1 min until boss": `preMiniBossSeconds: 60`, `preBossSeconds: 120`. For "boss after wave 3": `preBossWaves: 3`, `preBossSeconds: null`.

---

## 4. Boss Config Schema

```json
{
  "archetypeId": "string",
  "hp": "number",
  "phases": "number"
}
```


| Field         | Type   | Required | Description                                                                                                                       |
| ------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `archetypeId` | string | Yes      | Boss archetype from [boss_archetype_library.md](boss_archetype_library.md). E.g. `placeholder`, `root_seeker`, `conduit_crawler`. |
| `hp`          | number | No       | Override HP. Default from archetype.                                                                                              |
| `phases`      | number | No       | Number of phases/forms. Default from archetype. Each phase can have different shots and hit boxes per [boss_archetype_library.md](boss_archetype_library.md). |


---

## 5. Miniboss Config Schema

**Mini-bosses are optional.** A level may omit `miniboss` or set it to `null` for no mini-boss (e.g. Level 1 Forest).

```json
{
  "archetypeId": "string",
  "hp": "number"
}
```


| Field         | Type   | Required | Description                                              |
| ------------- | ------ | -------- | -------------------------------------------------------- |
| `archetypeId` | string | Yes      | Mini-boss archetype. E.g. `elite_scout`, `elite_medium`, `enlarged_elite`. |
| `hp`          | number | No       | Override HP.                                             |


---

## 6. Example: Level 1 Forest

```json
{
  "id": "level_1_forest",
  "name": "Level 1: Forest",
  "theme": "forest",
  "difficulty": "medium",
  "timing": {
    "preMiniBossSeconds": null,
    "preBossSeconds": null
  },
  "waves": [
    {
      "formation": "v",
      "enemyType": "scout",
      "count": 5,
      "staggerSeconds": 0.6,
      "betweenWaveDelaySeconds": 4.5
    },
    {
      "formation": "staggered_wedge",
      "enemyType": "scout",
      "count": 7,
      "staggerSeconds": 0.5,
      "betweenWaveDelaySeconds": 3.75
    },
    {
      "formation": "staggered_wedge",
      "enemyType": "scout",
      "count": 7,
      "staggerSeconds": 0.5,
      "betweenWaveDelaySeconds": 3.25
    },
    {
      "formation": "pincer",
      "enemyType": "scout",
      "count": 6,
      "staggerSeconds": 0.6,
      "betweenWaveDelaySeconds": 3.0
    }
  ],
  "enemyStyle": "mixed",
  "miniboss": null,
  "boss": {
    "archetypeId": "placeholder",
    "hp": 100
  }
}
```

---

## 7. Asset Paths

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Assets in `public/`; paths from root. Level spec does not embed asset paths; theme ID maps to paths via [level_theme_taxonomy.md](level_theme_taxonomy.md).


| Asset type      | Resolution     | Example                                    |
| --------------- | -------------- | ------------------------------------------ |
| Parallax layers | Per theme      | `/images/level1/parallax_far.png` (forest) |
| Enemy sprites   | Per enemy type | `/images/enemies/scout_facing_n.png`       |
| Boss sprites    | Per archetype  | Placeholder uses procedural until Phase 12 |


---

## 8. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **JSON loading:** Fetch level spec via `fetch('/levels/level_1_forest.json')` or equivalent. Parse and validate before passing to GameplayScene.
- **Validation:** Validate required fields, enum values, numeric ranges. Fail fast with clear error if spec invalid.
- **Default level:** If no level selected, default to `level_1_forest` or first available.
- **Performance:** Level spec is loaded once per level enter. No per-frame reads.

---

## 9. References


| Document                                                                                               | Purpose                                                    |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [LEVEL_SPEC.md](../context/LEVEL_SPEC.md)                                                              | Schema → code mapping; extension quick reference           |
| [level_1_forest_design.md](level_1_forest_design.md)                                                   | Parallax; theme; palette                                   |
| [wave_sequence_design.md](wave_sequence_design.md)                                                     | Wave sequence; between-wave delays                         |
| [wave_design_spec.md](wave_design_spec.md)                                                             | Formation types; stagger; spacing                          |
| [wave_composition_schema.md](wave_composition_schema.md)                                               | Composition model; count/squads/enemiesPerSquad derivation |
| [level_theme_taxonomy.md](level_theme_taxonomy.md)                                                     | Theme → asset path mapping                                 |
| [p8_mocks/8_a3_themes/theme_samples_deliverable.md](p8_mocks/8_a3_themes/theme_samples_deliverable.md) | Visual samples per theme                                   |
| [difficulty_curve_design.md](difficulty_curve_design.md)                                               | Difficulty → parameter mapping                             |
| [enemy_style_taxonomy.md](enemy_style_taxonomy.md)                                                     | Enemy style → formation mix                                |
| [boss_archetype_library.md](boss_archetype_library.md)                                                 | Boss/miniboss archetypes                                   |
| [engine_learnings.md](../dev_standards/engine_learnings.md)                                            | Asset paths; loading                                       |


---

## 10. Extensibility

The schema is designed to grow. When adding new capabilities:


| Extension                   | Update these                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New theme**               | [level_theme_taxonomy.md](level_theme_taxonomy.md) (theme ID, asset paths); this doc §1 `theme` enum; [LEVEL_SPEC.md](../context/LEVEL_SPEC.md) → level-spec.ts, theme-layers.ts, level-loader.ts         |
| **New difficulty preset**   | [difficulty_curve_design.md](difficulty_curve_design.md); this doc §1 `difficulty` enum; [DIFFICULTY_CURVE.md](../context/DIFFICULTY_CURVE.md) → level-spec.ts, level-loader.ts, difficulty params module |
| **New formation**           | [wave_design_spec.md](wave_design_spec.md); this doc §2 `formation` enum; `level-spec.ts` `FormationType`; `wave-spawner.ts` `getFormationPositions`; `level-loader.ts` `validateWaveConfig`              |
| **New spawn edge**          | This doc §2.2; `level-spec.ts` `SpawnEdge`; `wave-spawner.ts` centerX/spawn logic; `level-loader.ts` `validateSpawnFrom`                                                                                  |
| **New enemy type**          | [enemy_style_taxonomy.md](enemy_style_taxonomy.md); this doc §2 `enemyType` enum; `level-spec.ts` `EnemyTypeId`; `level-loader.ts` `validateWaveConfig`; WaveSpawner + enemy factory                      |
| **New timing field**        | This doc §3; `level-spec.ts` `LevelTimingConfig`; `level-loader.ts` validation; GameplayScene timing logic                                                                                                |
| **New boss/miniboss field** | [boss_archetype_library.md](boss_archetype_library.md); this doc §4–5; `level-spec.ts` `BossConfig`/`MinibossConfig`; boss controller                                                                     |
| **New top-level field**     | This doc §1; `level-spec.ts` `LevelSpec`; `level-spec.schema.json`; `level-loader.ts` `validateLevelSpec`; consumers (GameplayScene, etc.)                                                                |


**Unknown fields:** JSON schema and loader allow unknown properties on objects. Consumers should ignore unknown fields. Add known fields to the schema and types when implemented.

---

## Gate

This document gates:

- **8.1** — Level config loader
- **8.2** — WaveSpawner refactor
- **8.7** — Level 1 migration


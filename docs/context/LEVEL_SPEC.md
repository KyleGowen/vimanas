# Level Spec — Context for Code and Schema

**Phase 8 · 8.A.1**

Expandable context file for level spec schema and implementation. When adding fields, formations, themes, or enemy types, update the files listed here. See [level_spec_schema.md](../concepts/level_spec_schema.md) §10 for the extension checklist.

---

## Schema → Code Mapping

| Schema / Concept | Code File | What to Update |
|-----------------|-----------|----------------|
| **LevelSpec** (top-level) | `src/levels/level-spec.ts` | `LevelSpec` interface |
| **LevelSpec** (validation) | `src/levels/level-loader.ts` | `validateLevelSpec()`, `isThemeId`, `isDifficultyId`, `isEnemyStyleId` |
| **ThemeId** | `src/levels/level-spec.ts` | `ThemeId` type |
| **Theme → layers** | `src/levels/theme-layers.ts` | `getLayerConfigsForTheme(themeId)` switch cases |
| **Parallax theme** | `src/parallax/parallax-controller.ts` | `setTheme()`; theme ID passed from GameplayScene |
| **WaveConfig** | `src/levels/level-spec.ts` | `WaveConfig` interface |
| **FormationType** | `src/levels/level-spec.ts` | `FormationType` (re-exported from wave-spawner) |
| **Formations** | `src/waves/wave-spawner.ts` | `getFormationPositions()`, `FormationType`, `getVFormationPositions`, `getStaggeredWedgePositions`, `getPincerPositions` |
| **Wave validation** | `src/levels/level-loader.ts` | `validateWaveConfig()` — formation enum, enemyType enum |
| **Timing** | `src/levels/level-spec.ts` | `LevelTimingConfig` |
| **Boss/miniboss** | `src/levels/level-spec.ts` | `BossConfig`, `MinibossConfig` |
| **Boss consumption** | `src/scenes/gameplay/boss-controller.ts` | `updateBossPhase()` — uses `boss.hp`, `boss.archetypeId` |
| **Level loading** | `src/scenes/gameplay-scene.ts` | `enter()` — loads spec, passes to WaveSpawner, ParallaxController, BossController |
| **designNotes, suggestion** | — | Game ignores. CEO adds suggestions; specialist reads when creating/revising. See director_level_request_protocol. |

---

## File Reference

| File | Purpose |
|------|---------|
| `docs/concepts/level_spec_schema.md` | Design doc; field definitions; extensibility checklist |
| `docs/schemas/level-spec.schema.json` | JSON Schema for validation; `additionalProperties: true` for extensibility |
| `src/levels/level-spec.ts` | TypeScript types; single source of truth for interfaces |
| `src/levels/level-loader.ts` | `loadLevelSpec()`, `loadLevelSpecSync()`, validation |
| `src/levels/theme-layers.ts` | Theme ID → parallax layer configs |
| `src/waves/wave-spawner.ts` | Wave spawning; formation positions; reads `levelSpec.waves` |
| `src/parallax/parallax-controller.ts` | `setTheme(themeId)`; selects layers per theme |
| `src/scenes/gameplay-scene.ts` | Loads spec; passes to WaveSpawner, ParallaxController, BossController |
| `public/levels/*.json` | Level spec JSON files; served at `/levels/{id}.json` |

---

## Extending: Quick Reference

### Add a new theme (e.g. `underground`)

1. `docs/concepts/level_theme_taxonomy.md` — Add theme ID, asset paths
2. `docs/concepts/level_spec_schema.md` — Add to `theme` enum in §1
3. `docs/schemas/level-spec.schema.json` — Add to `theme.enum` array
4. `src/levels/level-spec.ts` — Add to `ThemeId` type
5. `src/levels/level-loader.ts` — Add to `isThemeId()` 
6. `src/levels/theme-layers.ts` — Add case to `getLayerConfigsForTheme()`
7. `public/images/level{N}/` — Add parallax assets (or placeholder)

### Add a new formation (e.g. `line`)

1. `docs/concepts/wave_design_spec.md` — Define formation layout
2. `docs/concepts/level_spec_schema.md` — Add to `formation` enum in §2
3. `docs/schemas/level-spec.schema.json` — Add to `WaveConfig.formation.enum`
4. `src/levels/level-spec.ts` — Add to `FormationType` (or extend from wave-spawner)
5. `src/waves/wave-spawner.ts` — Add `getLinePositions()`, case in `getFormationPositions()`
6. `src/levels/level-loader.ts` — Add to `validateWaveConfig()` formation check

### Add a new top-level field (e.g. `musicTrack`)

1. `docs/concepts/level_spec_schema.md` — Add field to §1 table and example
2. `docs/schemas/level-spec.schema.json` — Add to `properties`
3. `src/levels/level-spec.ts` — Add to `LevelSpec` interface
4. `src/levels/level-loader.ts` — Add validation if required
5. Consumer (e.g. GameplayScene, audio system) — Use the new field

---

## Still true?

- Update this file when adding new code files that consume level spec
- Schema and types are the source of truth; JSON files conform to spec

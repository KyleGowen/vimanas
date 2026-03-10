# Difficulty Curve — Context for Code

**Phase 8 · 8.A.2**

Expandable context file for difficulty curve design and implementation. When difficulty params are applied in code, update the files listed here. See [difficulty_curve_design.md](../concepts/difficulty_curve_design.md) for the full spec.

---

## Design → Code Mapping (When Implemented)


| Parameter                       | Code File                                | What to Update                                                                                                 |
| ------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **DifficultyId**                | `src/levels/level-spec.ts`               | `DifficultyId` type                                                                                            |
| **Validation**                  | `src/levels/level-loader.ts`             | `isDifficultyId()`                                                                                             |
| **HP multiplier**               | Enemy factory / ScoutEnemy               | Scale `maxHp` by `getHpMultiplier(difficulty)` when creating enemies                                           |
| **Boss HP multiplier**          | `src/scenes/gameplay/boss-controller.ts` | Scale boss HP by `getBossHpMultiplier(difficulty)` when `boss.hp` not in spec                                  |
| **Between-wave delay fallback** | `src/waves/wave-spawner.ts`              | When WaveConfig omits `betweenWaveDelaySeconds`, use `getBetweenWaveDelayForDifficulty(difficulty, waveIndex)` |
| **Stagger fallback**            | `src/waves/wave-spawner.ts`              | When WaveConfig omits `staggerSeconds`, use `getStaggerForDifficulty(difficulty, formation)`                   |


---

## File Reference


| File                                       | Purpose                                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `docs/concepts/difficulty_curve_design.md` | Design doc; preset table; parameter mapping; override rules                        |
| `src/levels/level-spec.ts`                 | `DifficultyId` type                                                                |
| `src/levels/level-loader.ts`               | `isDifficultyId()` validation                                                      |
| `src/waves/wave-spawner.ts`                | Wave spawning; currently uses spec values; add difficulty fallback when spec omits |
| `src/enemies/scout-enemy.ts`               | Scout HP; add difficulty scaling when creating from pool                           |
| `src/scenes/gameplay/boss-controller.ts`   | Boss HP; add difficulty scaling when spec omits `boss.hp`                          |


---

## Implementation Notes

**Current state:** Level spec provides explicit `betweenWaveDelaySeconds` and `staggerSeconds` per wave. Difficulty params are not yet applied. When implementing:

1. Create `src/levels/difficulty-params.ts` (or similar) with lookup tables from difficulty_curve_design.md §3
2. WaveSpawner: if `waveConfig.betweenWaveDelaySeconds` is undefined, use difficulty lookup
3. WaveSpawner: if `waveConfig.staggerSeconds` is undefined, use difficulty lookup
4. Enemy creation: pass `levelSpec.difficulty`; scale HP by multiplier
5. Boss: if `levelSpec.boss.hp` is undefined, compute from archetype default × difficulty multiplier

**Override precedence:** Spec overrides always win. Apply difficulty only when spec omits the value.

---

## Extending: Quick Reference

### Add a new difficulty preset (e.g. `nightmare`)

1. `docs/concepts/difficulty_curve_design.md` — Add to §1 presets, §2 parameter tables, §3 lookup
2. `src/levels/level-spec.ts` — Add to `DifficultyId` type
3. `src/levels/level-loader.ts` — Add to `isDifficultyId()`
4. `docs/schemas/level-spec.schema.json` — Add to `difficulty.enum`
5. Difficulty params module — Add to lookup tables
6. Consumers — Ensure they handle the new preset (or use default/medium)

---

## Still true?

- Update this file when adding code that applies difficulty params
- Override precedence: spec > difficulty > hardcoded default


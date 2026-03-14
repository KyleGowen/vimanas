# Wave Composition Schema

**Phase 8 · 8.A.4**

Formalizes "X waves × Y squads × Z enemies" composition and extends [level_spec_schema.md](level_spec_schema.md) §2 Wave Config. Gates 8.2 WaveSpawner refactor.

**Canon:** [level_spec_schema.md](level_spec_schema.md), [wave_design_spec.md](wave_design_spec.md), [wave_sequence_design.md](wave_sequence_design.md), [scout_design_lock.md](scout_design_lock.md).

---

## 1. Composition Model

A level's `waves` array is an ordered sequence of wave configs. Each wave config defines formation, enemy type, timing, and **composition**—either explicit count or squads × enemiesPerSquad.

### 1.1 Total Count Derivation

| Case | Condition | Total Enemies |
|------|-----------|---------------|
| **Explicit count** | `count` is present | `count` |
| **Squads × per squad** | `squads` and `enemiesPerSquad` present; `count` absent | `squads × enemiesPerSquad` |
| **Formation default** | Neither `count` nor squads/enemiesPerSquad | Formation default (see §2 table) |
| **Conflict** | Both `count` and squads/enemiesPerSquad present | `count` wins (override) |

### 1.2 Derivation Rules Summary

1. **When `count` is present:** Always use `count` as total. Ignore `squads`/`enemiesPerSquad` for total (they may still document intent).
2. **When `squads` and `enemiesPerSquad` present, `count` absent:** Total = `squads × enemiesPerSquad`.
3. **When both omitted:** Use formation default from §2. Validation may require `count` to match formation default unless explicitly overridden.

---

## 2. Formation → Squad Layout Mapping

Per [wave_design_spec.md](wave_design_spec.md) and [scout_design_lock.md](scout_design_lock.md) Formation Spec:

| Formation | Squads | Enemies per Squad | Total | Layout |
|-----------|--------|-------------------|-------|--------|
| **v** | 1 | 5 | 5 | 1 leader at apex + 2 per wing |
| **staggered_wedge** | 1 | 7 | 7 | 1 leader + 2 rows of 3 (staggered) |
| **pincer** | 2 | 3 | 6 | 2 wings × 3 (leader + 2 behind per wing) |

### 2.1 Canonical Mappings

| Formation | Default squads | Default enemiesPerSquad | Default total |
|-----------|---------------|-------------------------|---------------|
| v | 1 | 5 | 5 |
| staggered_wedge | 1 | 7 | 7 |
| pincer | 2 | 3 | 6 |

Level 1 Forest uses these defaults. Level spec can omit `count`, `squads`, and `enemiesPerSquad`; WaveSpawner derives from formation.

---

## 3. Schema Extensions (Level Spec §2)

### 3.1 Wave Config Field Semantics

The existing [level_spec_schema.md](level_spec_schema.md) §2 Wave Config already defines:

- `count` — total enemies (optional; derived when absent)
- `squads` — number of squads (optional; defaults per formation)
- `enemiesPerSquad` — enemies per squad (optional; defaults per formation)

**Clarifications for 8.2:**

| Field | Required | When to use |
|-------|----------|-------------|
| `count` | No | Explicit override; custom levels; when total ≠ formation default |
| `squads` | No | Document composition; pincer always implies 2; single formations imply 1 |
| `enemiesPerSquad` | No | Document composition; V=5, Wedge=7, Pincer=3 per wing |

**Recommended:** Level 1 can use explicit `count` (current example) or omit for formation-derived. Both valid.

**8.7 — Elite secondary composition:** When `eliteCount` is present (e.g. 1), the wave spawns formation scouts (count) plus that many elites. Wave completes when all scouts and all elites of that wave are cleared. See [level_spec_schema.md](level_spec_schema.md) §2.

### 3.2 No Breaking Changes

Existing Level 1 spec uses `count` only. Adding squads/enemiesPerSquad is additive. WaveSpawner 8.2 refactor consumes either model without breaking current JSON.

---

## 4. Implementation Notes (WaveSpawner 8.2)

### 4.1 Consumption Flow

1. **Formation:** `formation` → `getFormationPositions(formation, centerX, spawnY)` returns spawn positions with layout and stagger offsets.
2. **Spawn position:** `spawnFrom` (optional) specifies where on screen the wave appears. `edge`: top (default), left, right. `position`: 0–1 along edge. Omit = top center. Use to compute `centerX` (and for left/right, spawn Y) before calling `getFormationPositions`. Per [level_spec_schema.md](level_spec_schema.md) §2.2.
3. **Count:** Resolve total via derivation rules (§1). Use `count` if present; else `squads × enemiesPerSquad` if both present; else formation default.
4. **Position count vs total:** `getFormationPositions` returns a fixed array per formation (V=5, Wedge=7, Pincer=6). If resolved total < positions.length, slice positions to count. If total > positions.length, either extend layout functions (future) or clamp and log warning.

### 4.2 Validation Rules

| Rule | Action |
|------|--------|
| `count` must match formation default when squads/enemiesPerSquad omitted | Or: allow count as explicit override; both semantics supported. **Preferred:** count is always valid override; when omitted, use formation default. |
| `squads × enemiesPerSquad` should equal formation default when both specified | Validator may warn if product ≠ formation default (e.g. pincer with squads:2, enemiesPerSquad:4 = 8 ≠ 6). |
| Invalid formation | Reject or fallback to `v`. |
| count > formation max | Clamp to positions.length; log warning. |

### 4.3 Current WaveSpawner Behavior

From `wave-spawner.ts`:

- Uses `getFormationPositions(formation, ...)` for layout.
- If `waveConfig.count != null && waveConfig.count < positions.length`, slices to count.
- Does not yet consume `squads`/`enemiesPerSquad` for derivation when `count` absent. **8.2 refactor:** Add derivation so omitted count uses squads×enemiesPerSquad or formation default.

---

## 5. Extensibility

### 5.1 Future Formations (e.g. line, diamond)

| Step | Update |
|------|--------|
| 1 | [wave_design_spec.md](wave_design_spec.md) — define layout, spacing, stagger |
| 2 | [scout_design_lock.md](scout_design_lock.md) — add to Formation Spec if scout-specific |
| 3 | This doc §2 — add row: formation \| squads \| enemiesPerSquad \| total |
| 4 | level_spec_schema.md §2 — add to `formation` enum |
| 5 | wave-spawner.ts — add `getLinePositions()` etc., case in `getFormationPositions()` |
| 6 | level-loader.ts — validate new formation in `validateWaveConfig` |

**No break:** Existing levels omit new formations; new levels opt in.

### 5.2 Future Squad Counts

- **Pincer variants:** e.g. 3 wings × 3 = 9. Add formation or allow `squads: 3` with pincer; layout must support.
- **V with 2 squads:** Not in current spec; would require new formation or layout extension.
- **Rule:** New formations get explicit table rows. Squads/enemiesPerSquad product must match layout function output or validation warns.

---

## 6. P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Wave design spec** | [wave_design_spec.md](wave_design_spec.md) | V (5), Staggered Wedge (7), Pincer (6); stagger; spacing; CEO tuning |
| **Wave sequence design** | [wave_sequence_design.md](wave_sequence_design.md) | Level 1 sequence: 5 waves; formation order; between-wave delays |
| **Scout design lock** | [scout_design_lock.md](scout_design_lock.md) | Formation Spec: V 1×5, Staggered Wedge 1×7, Pincer 2×3; when-to-use |

---

## 7. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Delta time:** Stagger and between-wave delays use game time (pauses with game), not `performance.now()`. WaveSpawner already uses `gameTime`.
- **Coordinate system:** Spawn positions use world Y; player uses screen Y. Formation center at screen width/2; spawn above viewport via `getSpawnWorldYAboveViewport()`.
- **Canvas resolution:** Spacing (60 px, 72 px, 240 px) assumes fixed internal resolution (e.g. 1280×720). Scale consistently.
- **Pause:** Between-wave delay timer must pause with game loop.

---

## References

| Document | Purpose |
|----------|---------|
| [level_spec_schema.md](level_spec_schema.md) | WaveConfig schema; Wave composition subsection |
| [wave_design_spec.md](wave_design_spec.md) | Formation layouts; spacing; stagger |
| [wave_sequence_design.md](wave_sequence_design.md) | Level 1 sequence; difficulty ramp |
| [scout_design_lock.md](scout_design_lock.md) | Formation Spec; squad layout |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Delta time; coordinates; asset paths |

---

## Gate

This document gates:
- **8.2** — WaveSpawner refactor (reads wave config; supports count/squads/enemiesPerSquad derivation)

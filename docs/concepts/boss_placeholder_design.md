# Boss Placeholder Design

**Milestone 4.A.4 · Level/Encounter + Combat Systems**

Design spec for boss placeholder implementation. Gates milestone 4.8 (Boss prefab; HP bar; defeat → level complete). Full boss art deferred to Phase 10.

---

## P0 Mocks Considered

| Mock | Source | Notes |
|------|--------|-------|
| **boss_mocks_deliverable.md** | [p0_mocks/p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | CEO-approved 2025-03-02. Boss UI at top: name label, copper-framed health bar, score/lives. Sparrow/Dragon in foreground; boss dominates background. Strict top-down view. |
| **Root-Seeker** | [boss_encounter_briefs.md](p0_mocks/p0_4_boss/boss_encounter_briefs.md) | Level 1. Forest-organic. Horizontal sprawl; anchored/drifting. ~60–70% width, ~40–50% height. |
| **Conduit-Crawler** | [boss_encounter_briefs.md](p0_mocks/p0_4_boss/boss_encounter_briefs.md) | Level 2. Industrial-mechanical. Vertical tower; swaying pillar. ~40–50% width, ~55–65% height. |

---

## ENCOUNTER FLOW

*Level/Encounter Agent · 2026-03-05*

### 1. Boss Trigger

**When:** Boss appears **after the final wave of the level is complete**.

Per [wave_design_spec.md](wave_design_spec.md) and [design_system.md](../design_system.md): a wave is over when all enemies are destroyed or offscreen. The boss spawn is triggered **only after** the final wave meets this condition.

| Step | Trigger | Action |
|------|---------|--------|
| 1 | Final wave complete (all wave enemies destroyed or offscreen) | Emit `waveComplete` for final wave |
| 2 | WaveSpawner (or level controller) detects final wave complete | Do **not** spawn another wave; start boss transition |
| 3 | Brief transition (optional) | 1–2 s delay or immediate; player reads "boss incoming" |
| 4 | Boss spawn | Boss entity appears at spawn position |

**Implementation note:** WaveSpawner must know when it has reached the last wave in the level sequence. Boss spawn is a distinct phase—not another wave—so the level controller or scene logic should own the transition from "final wave complete" → "boss phase."

---

### 2. Boss Spawn Position

**Placement:** **Top-center of screen.**

| Axis | Position | Rationale |
|------|----------|------------|
| **Horizontal** | Center | Boss mocks show boss centered; player ships maneuver around. Root-Seeker spans ~60–70% width; Conduit-Crawler ~40–50%. Center anchor keeps boss readable. |
| **Vertical** | Top (north) | Per [design_system.md](../design_system.md): Forward = top of screen. Invaders approach from above. Boss as apex threat—player in lower play area, boss dominates upper half. Matches mocks: Sparrow/Dragon in foreground (bottom), boss in background (top). |

**Coordinate reference:** Assume fixed internal resolution (e.g. 1280×720) per [engine_learnings.md](../dev_standards/engine_learnings.md). Spawn at `(width/2, Y_TOP)` where `Y_TOP` is a small offset from top edge (e.g. 10–15% from top) so the boss is fully visible and not clipped.

---

### 3. HP Bar UI Placement

**Location:** **Top of screen**, above gameplay area.

Per [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md):

- **Label:** `"BOSS: ROOT-SEEKER"` or `"BOSS: CONDUIT-CRAWLER"` (or generic `"BOSS"` for placeholder)
- **Health bar:** Copper-framed
- **Layout:** Boss name + health bar + score/lives (existing HUD elements) at top

| Element | Placement | Notes |
|---------|-----------|-------|
| Boss name label | Top-left or centered above bar | Readable; matches mocks |
| Health bar | Below label; copper frame | Full width or proportional to boss HP; fill depletes on damage |
| Score/lives | Top-right (existing HUD) | Per design_system; unchanged during boss |

**Copper frame:** Per boss mocks—warm metallic accent; distinct from standard HUD. Placeholder can use a simple copper-colored rectangle (hex or RGB per [art_style_guide.md](../art_style_guide.md)) until full UI assets exist.

**Platform gotcha:** Canvas 2D—draw UI in same `ctx` as gameplay or separate overlay. Ensure UI does not occlude critical gameplay area; top bar should leave sufficient vertical space for player movement in lower 70–80% of screen.

---

### 4. Defeat → Level Complete Flow

**On boss defeat (HP → 0):**

| Step | Action |
|------|--------|
| 1 | Boss defeat trigger fires (Combat Systems spec) |
| 2 | Brief victory moment (0.5–1 s)—boss death VFX, optional freeze or slow-mo |
| 3 | Transition to **Results screen** |
| 4 | Results screen: score, lives remaining, level complete state |
| 5 | Player proceeds to **next level** or returns to menu (per game flow) |

**Level complete state:** The level is considered complete when the boss is defeated. No additional waves after boss. Results screen is the canonical "level done" moment per [design_system.md](../design_system.md) (Results screen).

**Implementation note:** Scene/level controller should transition from `Gameplay` → `Results` on boss defeat. No automatic next-level load in placeholder—explicit transition to Results, then player choice (Continue / Next Level / Menu).

---

### 5. Visual Placeholder

**For milestone 4.8:** Use a **block or simple sprite**—no full boss art.

| Option | Description | Recommendation |
|--------|-------------|-----------------|
| **Block** | Single colored rectangle (e.g. dark brown for Root-Seeker, purple-grey for Conduit-Crawler) | Simplest; clearly placeholder |
| **Simple sprite** | Single-frame silhouette or geometric shape (e.g. elongated hex, multi-segment blob) | Slightly more readable; still placeholder |

**Size:** Boss should read as "large"—per encounter briefs, Root-Seeker ~60–70% width × 40–50% height; Conduit-Crawler ~40–50% width × 55–65% height. Placeholder block/sprite should occupy a similar screen footprint (e.g. 200–400 px width, 150–300 px height at 1280×720) so spawn position and collision feel correct.

**Full boss art:** Deferred to **Phase 10**. Placeholder is sufficient for HP bar, defeat trigger, and level-complete flow verification.

**Phase-based bosses:** Per [boss_archetype_library.md](boss_archetype_library.md), full bosses (Root-Seeker, Conduit-Crawler) have **phases** or **forms**—different shots and hit boxes as HP drops. Placeholder has a single phase.

**Platform gotcha (engine_learnings):** Sprites need transparent backgrounds. If using a simple PNG placeholder, ensure alpha channel. Block drawn via `ctx.fillRect` requires no asset.

---

## Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Canvas resolution:** Fixed internal resolution (e.g. 1280×720); scale to window. Spawn position and UI placement use internal coordinates.
- **Delta time:** Boss movement (if any) and timers (transition delay, victory moment) use real time, not frame count.
- **Asset loading:** Placeholder block needs no asset. If using simple sprite, path from `public/`: e.g. `/images/boss/placeholder.png`. Preload with other critical assets.
- **Aspect ratio:** Letterbox/pillarbox when window aspect differs; boss spawn and UI must account for consistent gameplay area.

---

## COMBAT MECHANICS

*Combat Systems Agent · 2026-03-05*

### Stats (Placeholder)

| Stat | Value | Rationale |
|------|-------|------------|
| **HP** | 150 | Placeholder for Phase 4. Sparrow basic gun (5 dmg/shot vs Defense 5) → 1 dmg/hit → ~25 s at ~6.67 shots/s. Full boss design in Phase 10. |
| **Defense** | 5 | Placeholder. `actualDamage = Max(0.1, weaponStrength / targetDefense)` → 5/5 = 1 dmg/hit. Higher than Scout (Def 1) so boss feels tankier. |

**Tuning note:** HP 100 ≈ 15 s; HP 200 ≈ 30 s. Adjust for desired 20–40 s fight length.

### Damage Formula

Same as vs Scout per [basic_gun_design_lock.md](basic_gun_design_lock.md) and [scout_design_lock.md](scout_design_lock.md):

- **Weapon strength:** `weaponStrength = Attack × 0.25`
- **Target application:** `actualDamage = Max(0.1, weaponStrength / targetDefense)`

**Player projectile → Boss:** On hit, read firing ship's Attack, compute `weaponStrength`, pass to boss `takeDamage(weaponStrength)`. Boss applies the formula internally (same pattern as Scout).

### Defeat Trigger

- **Condition:** Boss HP ≤ 0
- **Effect:** Emit level complete (handled by Level/Encounter flow)

### Collision

- Boss takes damage from **player projectiles** only (same collision path as Scout).
- Use AABB overlap (`aabbOverlap`) between projectile rect and boss rect.
- On hit: call `boss.takeDamage(projectile.damage)` (where `projectile.damage` is weaponStrength from basic gun), return projectile to pool, one hit per projectile.

### Platform / Engine Gotchas (Mechanics)

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Delta time:** Boss movement and any timers use delta for frame-rate independence.
- **Asset loading:** Boss sprite via `new Image()`; path from `public/` (e.g. `/images/enemies/boss_placeholder.png`).
- **Transparency:** Boss sprite must have transparent background (alpha channel).
- **Performance:** 60 FPS target. Boss hit feedback and defeat VFX should stay lightweight.
- **Collision:** Reuse `aabbOverlap` from `src/util/collision.ts`; boss hitbox should match or approximate visible sprite bounds.

---

## References

- [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) — CEO-approved mocks; UI layout
- [boss_encounter_briefs.md](p0_mocks/p0_4_boss/boss_encounter_briefs.md) — Root-Seeker, Conduit-Crawler behavior and size
- [wave_design_spec.md](wave_design_spec.md) — Wave complete condition; WaveSpawner flow
- [design_system.md](../design_system.md) — Viewport, level structure, Results screen
- [engine_learnings.md](../dev_standards/engine_learnings.md) — Canvas, delta time, assets

# Boss / Mini-Boss Archetype Library

**Phase 9 · 9.A.6**

Archetype ID → appearance (visual reference), behavior pattern. CEO says "boss looks like X, behaves like Y"; system maps to archetype. Configurable per level via level spec. Gates 9.5 (Boss/mini-boss config) and Director level generation.

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Boss mocks** | [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Root-Seeker (forest, organic); Conduit-Crawler (industrial, mechanical) |
| **Boss placeholder** | [boss_placeholder_design.md](boss_placeholder_design.md) | HP bar; defeat trigger; visual placeholder |
| **Enemy hierarchy** | [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Insectoid language; scale |

---

## 1. Boss Archetypes

| Archetype ID | Display Name | Status | Appearance | Behavior |
|--------------|--------------|--------|------------|----------|
| `placeholder` | Placeholder | Implemented (Phase 4) | Block or simple sprite; copper frame | Stationary; takes damage; defeat → level complete |
| `root_seeker` | Root-Seeker | Phase 12 | Forest-organic; 6–8 appendages; dark brown carapace; amber cores | Phase-based; 2+ phases; vine/root tendrils |
| `conduit_crawler` | Conduit-Crawler | Phase 12 | Industrial-mechanical; tower-like; piston arms; purple-grey; copper | Phase-based; 2+ phases; turret volleys |

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

| Concept | Description |
|---------|-------------|
| **Phase / Form** | A distinct state of the boss, triggered at HP thresholds. As HP drops (e.g. 75%, 50%, 25%), the boss transitions to the next phase. |
| **Per-phase variation** | Each phase can have **different shots** (firing patterns, projectile types, fire rate) and **different hit boxes** (collision shape, size, vulnerable zones). |
| **Design intent** | Phases keep fights evolving—player adapts to new threats and weak points. R-Type / 1943: boss arms blow off, new patterns emerge. |

**Examples:**
- Phase 1: Single turret, large hit box. Phase 2: Turret destroyed, side arms fire; smaller core hit box.
- Phase 1: Vine tendrils block shots; center vulnerable. Phase 2: Tendrils retract; spread beams; different hit zones.

**Level spec:** `boss.phases` (optional) overrides archetype default. Placeholder has 1 phase; Root-Seeker and Conduit-Crawler have 2+.

---

## 3. Behavior Patterns

| Pattern | Description | Implemented |
|---------|-------------|-------------|
| `stationary` | Boss does not move; may rotate or fire | Placeholder |
| `moving` | Boss moves in pattern (e.g. up/down, orbit) | Phase 12 |
| `phase_based` | Boss has 2+ phases; HP thresholds trigger phase change; different shots and hit boxes per phase | Phase 12 |

**Level spec:** `boss.archetypeId` selects archetype. Behavior is intrinsic to archetype; no separate behavior field in initial schema.

---

## 4. Mini-Boss Archetypes

| Archetype ID | Display Name | Status | Description |
|--------------|--------------|--------|-------------|
| `elite_scout` | Elite Scout | Phase 12 | Scout-tier with higher stats; mini-boss feel |
| `elite_medium` | Elite Medium | Phase 12 | Medium-tier elite; unique ability |

**Level spec:** `miniboss.archetypeId`. Null = no mini-boss.

---

## 5. CEO Request Mapping

| CEO says | archetypeId |
|----------|-------------|
| "boss like Root-Seeker" | root_seeker |
| "forest boss" | root_seeker |
| "industrial boss" | conduit_crawler |
| "boss like Conduit-Crawler" | conduit_crawler |
| "placeholder" or unspecified | placeholder |
| "behaves in phase-based way" | (inferred from archetype; root_seeker, conduit_crawler) |
| "stationary boss" | placeholder (or moving archetype with stationary variant) |

---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Unknown archetype:** Fall back to `placeholder`. Log warning.
- **Phase 12:** When Root-Seeker, Conduit-Crawler implemented, add to BossFactory or equivalent. Placeholder remains default for unknown.

---

## 7. References

| Document | Purpose |
|----------|---------|
| [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Root-Seeker, Conduit-Crawler visuals |
| [boss_placeholder_design.md](boss_placeholder_design.md) | Placeholder spec |
| [level_spec_schema.md](level_spec_schema.md) | boss, miniboss config |

---

## Gate

This document gates:
- **9.5** — Boss/mini-boss config from level spec
- **9.A.7** — Director protocol maps CEO boss phrases to archetypeId

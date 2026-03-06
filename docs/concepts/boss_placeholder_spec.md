# Boss Placeholder Spec

**Milestone 4.4 · Combat Systems + Visual Design**

Spec for the Phase 4 boss placeholder. Gates boss entity, HP bar, defeat flow, and firing. Full boss art (Root-Seeker, Conduit-Crawler) deferred to Phase 10.

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Boss mocks** | [p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | UI: "BOSS" label, copper-framed health bar. Boss dominates upper half; player in foreground. |
| **Boss encounter briefs** | [p0_4_boss/boss_encounter_briefs.md](p0_mocks/p0_4_boss/boss_encounter_briefs.md) | Root-Seeker, Conduit-Crawler: insectoid, multi-limbed, firing patterns. Placeholder inherits "fires at player" behavior. |
| **Enemy hierarchy** | [p0_4_boss/enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Boss Tier 4: screen-filling, multi-limbed, amber/orange cores. Scout-like silhouette scaled up. |
| **Basic gun** | [basic_gun_design_lock.md](basic_gun_design_lock.md) | Damage formula. Boss takes damage per weaponStrength / Defense. |

---

## 1. Stats Block

| Stat | Value | Rationale |
|------|-------|-----------|
| **HP** | 150 | Placeholder. Sparrow basic gun (5 dmg/shot vs Defense 5) → 1 dmg/hit → ~25 s fight. |
| **Defense** | 5 | Tankier than Scout (Def 1). actualDamage = Max(0.1, weaponStrength / 5). |
| **Attack** | 240 | weaponStrength 60; vs Sparrow Def 12 → 5 dmg/hit. ~3 hits to down player. Meaningful threat. |

---

## 2. Firing Rules

### 2.1 Boss Fires at Player

**Rule:** The boss fires projectiles at the player. Same damage formula as Scout (weaponStrength = Attack × 0.25; actualDamage = Max(0.1, weaponStrength / playerDefense)).

| Property | Value | Rationale |
|----------|-------|-----------|
| **Fire rate** | 1.0 s cooldown | Slower than Scout (0.533 s). Boss is single target; shots telegraphed, readable. |
| **Projectile** | Reuse EnemyProjectile | Orange/amber, 180 px/s, 2 s lifetime. Same as Scout. |
| **Origin** | Center-bottom of boss | 1–3 origin points per plan; placeholder uses single center muzzle. |

### 2.2 Firing Condition

**Rule:** Boss fires when on screen (always true during boss phase—boss is fixed at top). No "on screen" check needed; boss phase implies visibility.

---

## 3. Visual Lock (Placeholder)

### 3.1 Sprite Requirements

| Requirement | Spec | Rationale |
|-------------|------|-----------|
| **Format** | PNG with **transparent background (alpha channel)** | Must composite over parallax. Opaque background breaks layering. |
| **Path** | `/images/enemies/boss_placeholder.png` | Per engine_learnings; assets in public/. |
| **Size** | ~300×200 px draw size | Boss dominates upper half; placeholder matches hitbox. |
| **Style** | Scout-like, bigger, more weapons. Spaceship aesthetic. | Per plan: insectoid silhouette scaled up; not creature-like. |
| **Facing** | South (toward player) | Boss at top of screen; weapons at bottom. Sprite drawn flipped vertically so nose faces down. |
| **Palette** | Dark brown (#3d2914), olive (#6b8e23), amber (#FFBF00) | Per enemy_hierarchy Boss tier. |

### 3.2 Transparency Rule

**Rule:** Boss sprite MUST have a transparent background. No solid fill behind the ship shape. Alpha channel required. Fallback: dark brown block (#3d2914) if sprite fails to load.

---

## 4. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Boss coords:** Screen coords (fixed during boss phase; no scroll).
- **Projectile coords:** Boss projectiles spawn in world space (scrollOffset + bossBottom) for consistency with EnemyProjectile and player collision.
- **Delta time:** Fire cooldown and projectile movement use gameTime/delta.
- **Pooling:** Boss projectiles use EnemyProjectilePool; no new allocations.

---

## 5. References

| Document | Purpose |
|----------|---------|
| [boss_placeholder_design.md](boss_placeholder_design.md) | Encounter flow, HP bar, defeat trigger |
| [enemy_projectile_design_lock.md](enemy_projectile_design_lock.md) | Projectile damage formula, speed, lifetime |
| [scout_design_lock.md](scout_design_lock.md) | Scout firing pattern; boss mirrors with slower rate |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Asset paths, delta time, coordinate systems |

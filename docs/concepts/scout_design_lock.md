# Scout Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 3.A.1**

Scout is the **Tier 1 enemy**—smallest, insectoid, appear in swarms. This document locks stats and visuals for production. Gates 3.A.2 (Scout sprite sheet) and 3.1 (First enemy).

---

## P0 Mocks Considered

Design locks must reference approved p0 mocks. The following inform this lock:

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Boss mocks** | [p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Scale and context. [boss_mock_1_forest.png](p0_mocks/p0_4_boss/boss_mock_1_forest.png), [boss_mock_2_industrial.png](p0_mocks/p0_4_boss/boss_mock_2_industrial.png) — player ship (Sparrow) scale vs boss; Scout is slightly smaller than Sparrow. Forest and industrial contexts for enemy placement. Insectoid boss language (Root-Seeker, Conduit-Crawler) extends to Scout tier. CEO approved 2025-03-02. |
| **Enemy hierarchy** | [p0_4_boss/enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout spec. Silhouette: insect-like, elongated body, wing-like appendages, angular. Palette: amber (#FFBF00), olive-green (#6b8e23), dark brown (#3d2914). Size: smallest, slightly smaller than Sparrow. VFX: small explosion on death; amber/green projectiles. Behavior: approaching from above; V-formation or staggered wedge. Carapace-like hull, segmented, sharp forms. |
| **Basic gun** | [basic_gun_design_lock.md](basic_gun_design_lock.md) | Damage formula. Sparrow (Attack 20) deals 5 damage per shot vs Scout (Defense 1). |

---

## 1. Stats Block

Per [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md): Scout is smallest, swarm-like, slightly smaller than Sparrow. Stats tuned so Sparrow basic gun feels satisfying—2–4 hits to kill.

| Stat | Value | Rationale |
|------|-------|------------|
| **HP** | 15 | 3 hits from Sparrow basic gun (5 dmg/shot). Satisfying middle: not trivial (2), not spongy (4). |
| **Defense** | 1 | Per [basic_gun_design_lock.md](basic_gun_design_lock.md): Sparrow (Attack 20) deals 5 damage per shot vs Scout. weaponStrength 5 / Defense 1 = 5 actualDamage. |
| **Attack** | TBD | Scout weapon design deferred to 3.4. Amber/green projectiles per enemy_hierarchy; damage formula will apply symmetrically when Scout weapons lock. |

**Combat Systems note:** Defense 1 is canonical—basic_gun_design_lock explicitly states "Sparrow (Attack 20): 5 damage per shot vs Scout (Defense 1) → 5 HP per hit." HP 15 yields exactly 3 hits. If tuning later: HP 10 = 2 hits, HP 20 = 4 hits.

### 1.1 Movement Pattern

Per [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md): *"Approaching from above; threat direction clear."* Formations: V (5 Scouts, 0.4s stagger), Staggered Wedge (7 Scouts, 0.3s), Pincer (2×3 Scouts, 0.4s). See Formation Spec below.

| Property | Spec | Rationale |
|----------|------|------------|
| **Approach direction** | From above (north/top of screen) | Threat direction clear. Player sees Scouts descend—readable, Star Fox 64–style. |
| **Formation** | See Formation Spec below | Swarm-like; multiple targets without clutter. Leader at apex, wings spread. R-Type clarity: deliberate positioning, not chaos. |
| **Spawn timing** | Wave-based; Scouts spawn at top of play area, move south | Matches vertical scrolling; enemies enter from top, player at bottom. |
| **Speed** | Moderate (TBD in 3.4) | Fast enough to feel threatening; slow enough to track and aim. |

**Implementation note:** First wave (3.4) can use a single formation of 3–5 Scouts. Stagger spawn by ~0.3–0.5 s so they don't appear as a single blob.

#### Formation Spec

| Formation | Design | Rationale |
|-----------|--------|------------|
| **V (Wedge)** | 5 Scouts: 1 leader at apex, 2 per wing. Wing spacing 40 px lateral, 24 px depth (1.5× Scout width). Leader 32 px ahead of wing tips. Stagger: 0.4 s. | First wave / intro. Bird migration: V reduces drag, reads as coordinated flock. Leader at apex per enemy_hierarchy. Readable threat cone; player learns "aim at point." |
| **Staggered Wedge** | 7 Scouts: 1 leader, then 2 rows of 3 (staggered). Row spacing 36 px depth; lateral 48 px between outer wings. Stagger: 0.3 s. | Mid-wave difficulty ramp. Insect swarm: depth suggests hive-mind coordination. More targets without clutter; R-Type memorization—player tracks rows, not chaos. |
| **Pincer** | 2 wings of 3 Scouts each, approaching from upper-left and upper-right. Each wing: leader + 2 behind, 40 px lateral, 28 px depth. Wings 160 px apart at spawn. Stagger: 0.4 s per Scout within wing; wings spawn 0.2 s apart. | Late wave / variation. Converging threat—two groups closing from sides. Swarm-like: decentralized decision (two "hives" coordinating). Forces lateral awareness. |

**When to use:** V for first encounter (3.4); Staggered Wedge for wave 2–3; Pincer for wave 4+ or as surprise. All approach from above; threat direction clear. Spacing avoids overlap—Craig Reynolds separation—so each Scout reads as distinct target.

### 1.2 Damage Formula Application

Per [basic_gun_design_lock.md](basic_gun_design_lock.md):

- **Weapon strength:** `weaponStrength = Attack × 0.25`
- **Target application:** `actualDamage = Max(0.1, weaponStrength / targetDefense)`

**Player projectile → Scout:**

1. On hit, read the firing ship's **Attack** stat (e.g. Sparrow = 20).
2. Compute `weaponStrength = 20 × 0.25 = 5`.
3. Compute `actualDamage = Max(0.1, 5 / 1) = 5`.
4. Subtract 5 from Scout HP. At 0 HP, Scout dies (small explosion, amber/green VFX per enemy_hierarchy).

**Implementation note:** `PlayerWeapon` and `Projectile` must pass the ship's Attack at fire time. No hardcoded projectile damage. Scout entity receives damage via the same formula as any target.

### 1.3 Firing Rule (2026-03-07)

**Enemy ships do not fire until they are on screen.** Check that Scout world Y is within viewport (`scrollOffset <= scout.y <= scrollOffset + height`) before allowing fire. Prevents off-screen enemies from shooting before the player can see them.

---

## 2. Visual Lock

### Silhouette

- **Insectoid:** Elongated body, wing-like appendages, angular. Reads as "alien" and "swarm" at a glance but also spaceship and robotic.
- **Top-down read:** Clear facing direction. No ambiguity about approach vector.
  - **Shape language:** From above, the Scout reads as an **elongated arrowhead with a mantis-like prow**—a narrow central body tapering to a pointed nose, flanked by swept wing-like appendages. The overall silhouette suggests a predatory insect in flight: sharp, angular, segmented. Think R-Type's organic enemies meets Gradius clarity—every edge serves readability.
  - **Facing read:** The nose is a **twin-mandible cluster**—two angular prongs or sensor pods that converge at the leading edge, forming a clear "V" or chevron pointing forward. No rounded cockpit; the head reads as alien anatomy—sensor cluster, mandible, or weapon mount. The player instantly knows which way the Scout is approaching.
  - **Wing/appendage sweep:** Wings are **swept back and slightly splayed**—delta-ish but with insectoid asymmetry. Each wing reads as a carapace segment: angular, hard-edged, with a visible leading edge that sweeps from shoulder to trailing tip. Slight outward splay (not flat delta) gives a mantis/grasshopper-in-flight read. Wings do not mirror Sparrow's bird-like sweep; they feel mechanical, exoskeletal.
  - **Distinct from Sparrow:** Sparrow = bird-inspired, organic curves, single pointed nose, aerodynamic arrowhead. Scout = insectoid, segmented body, mandible cluster at prow, carapace segments, sharp angular forms. At a glance: Sparrow says "craft"; Scout says "creature." The twin-mandible prow, segmented body, and splayed carapace wings make the Scout instantly "other"—alien, swarm, predator.
  - **Readability at scale (200–400 px):** Key shapes that must read at combat distance: **(1) the forward-pointing mandible V**, **(2) the central elongated body axis**, **(3) the swept wing silhouettes** (leading edges and trailing tips). Avoid fine filigree or internal detail that disappears at scale; silhouette and major carapace breaks carry the read. Strong contrast between body and wings (amber vs olive-green segments) aids instant recognition.
- **Size:** Smallest of enemy tiers. Slightly smaller than Sparrow. Swarm-like—multiple Scouts on screen without crowding.
- **Detail:** Carapace-like hull; segmented. Sharp, angular forms—hard-edged exoskeleton, elongated body, mandible-like protrusions. Avoid bulbous or rounded.

**Reference:** [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) — Scout tier spec. See [art_style_guide.md](../art_style_guide.md) Enemy Visuals.

### Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Carapace primary | Amber | #FFBF00 | Warm, organic; contrasts with player cobalt/cyan |
| Carapace secondary | Olive-green | #6b8e23 | Segments, accents |
| Shadow / depth | Dark brown | #3d2914 | Underside, depth, joints |
| Projectile glow | Amber / olive | #FFBF00 / #6b8e23 | Firing projectiles; warm read |

Per [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) and [art_style_guide.md](../art_style_guide.md): Scout palette avoids overlap with player ship (cobalt/cyan). Warm, organic; insectoid hive-mind aesthetic.

### VFX

- **Death:** Small explosion. Bright core, soft halo. Amber/green tint—readable, performant (60 FPS target).
- **Firing:** Amber or olive-green projectiles. Clear, readable; no muddy effects. Per art_style_guide VFX language: bright cores and trails.

---

## 3. References

| Document | Purpose |
|----------|---------|
| [basic_gun_design_lock.md](basic_gun_design_lock.md) | Damage formula, Sparrow 5 dmg/shot vs Defense 1 |
| [design_system.md](../design_system.md) | Viewport, ship stats, combat context |
| [art_style_guide.md](../art_style_guide.md) | Enemy Visuals: insectoid, palette (amber/olive-green/purple-grey/dark brown), size hierarchy, VFX language |
| [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout spec: silhouette, palette, size vs Sparrow, VFX, movement (V-formation, approaching from above) |
| [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Scale and context: Sparrow vs boss; forest/industrial environments |
| [sparrow_design_lock.md](p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) | Sparrow Attack 20; template structure |
| [references/README.md](../references/README.md) | sophisticated_ref_1.png–sophisticated_ref_7.png — insectoid enemies (ref_3, ref_4), biomechanical detail, projectile/VFX style |

---

## 4. Platform / Framework Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Framework-free build (HTML5 Canvas 2D, TypeScript, Vite). No game framework.

- **Asset loading:** Images via `new Image()`; paths from `public/` at root (e.g. `/images/enemies/scout_facing_n.png`).
- **Resolution:** Fixed internal resolution; scale to window. Scout sprites must read clearly at native resolution—detail, not chunky.
- **Delta time:** Multiply Scout movement by delta for frame-rate independence.
- **Performance:** 60 FPS target. Death explosion and projectiles lightweight; avoid heavy particle counts.

---

## 5. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-05 |
| **Visual Design** | Approved | 2026-03-05 |
| **CEO** | Approved | 2026-03-05 |

---

## Gate

This document gates:
- **3.A.2** — Scout sprite sheet (poses, palette, top-down read)
- **3.1** — First enemy (Scout) (stats, visuals, behavior)

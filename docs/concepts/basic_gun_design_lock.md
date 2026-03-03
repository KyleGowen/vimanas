# Basic Gun Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 2.A.3**

Basic gun for Phase 2 first playable. Locks damage formula, fire rate, projectile speed, and projectile VFX. Gates 2.3 (Basic gun) and 2.4 (Projectile pooling).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md) | Sparrow propulsion #00FFFF; projectile VFX aligns with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Player in combat; projectiles must read against forest background |
| **Title screen** | [p0_5_title_screen](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Propulsion glow at distance; cyan aether aesthetic |

---

## 1. Combat Systems

### Damage Formula

- **Weapon strength:** `weaponStrength = Attack × 0.25`
- **Target application:** `actualDamage = Max(0.1, weaponStrength / targetDefense)`
- **Sparrow (Attack 20):** 5 damage per shot vs Scout (Defense 1) → 5 HP per hit
- Attack is the single source of truth; no hardcoded projectile damage

**Implementation note:** `PlayerWeapon` and `Projectile` must read the ship's Attack stat at fire time instead of using a fixed damage value.

### Fire Rate

- **0.15 s** cooldown (~6.67 shots/s)
- Matches Star Fox 64–style responsiveness: clear shots, not bullet-hell

### Projectile Speed

- **12 units/s**
- Readable at 60 FPS (0.2 units/frame), feels responsive without being instant

### Projectile Lifetime

- **3 s**
- At 12 u/s → 36 units travel; covers screen and beyond, then despawns

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Sparrow propulsion glow = #00FFFF (cyan).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails—no muddy or indistinct shots."* Target: **illustrated, sleek**—glowing projectiles that read instantly against forest and industrial backgrounds. 60 FPS target—lightweight, performant.

### 2.1 Projectile VFX — Bright Core

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | Cyan | #00FFFF |
| **Size** | 8–12 px diameter (sprite source); ~0.10–0.12 Unity units at runtime | Large enough to read at combat distance; not so large it obscures targets or feels sluggish |
| **Intensity** | Full saturation (255, 255, 255 in additive blend) or near-white center | Bright core per art_style_guide; "clear, readable, impactful" |
| **Blend** | Additive or soft additive | Glow reads against dark and light backgrounds |

**Rationale:** Sparrow uses cyan (#00FFFF) for propulsion (engine exhaust, thruster trails). Player projectiles share that aether energy signature—visual continuity between ship and weapon. Matches art_style_guide: *"Glowing projectiles (blue spread, orange bullets, energy beams)"*—player = blue/cyan family; enemies = orange/amber (avoid overlap). Cyan also contrasts well with forest greens and industrial grays.

### 2.2 Projectile VFX — Trail

| Property | Value | Rationale |
|----------|-------|------------|
| **Length** | 0.5–1.0× projectile speed (in units) | Short enough for 60 FPS; long enough to read direction and motion |
| **Opacity** | 60–80% at head, 0% at tail (linear falloff) | Soft halo; no muddy edges |
| **Color** | Same cyan (#00FFFF) at 40–60% opacity, or slightly desaturated (#66FFFF) | Trail reads as same energy; softer than core |
| **Implementation** | Sprite-based trail, simple particle line, or 2–4 segment gradient sprite | Lightweight—no heavy particle systems per projectile. Pool-friendly |

**Performance:** Max ~6–7 projectiles on screen (Sparrow fire rate ~6.67/s). Trail = 1 draw call or simple particle strip per projectile. No per-frame mesh generation. See art_style_guide: *"Explosions and effects: lightweight, performant (60 FPS target)"*.

### 2.3 Readability Rules

**Backgrounds (per art_style_guide):**

- **Forest:** Varied greens, lush canopy, foliage. Cyan/blue contrasts with green—no overlap. See `sophisticated_ref_3.png`, `sophisticated_ref_4.png`.
- **Industrial:** Pipes, conduits, darker grays and browns. Cyan reads clearly against dark industrial. See `sophisticated_ref_5.png`, `sophisticated_ref_7.png`.

**Rules:**

| Rule | Spec |
|------|------|
| **Contrast** | Core must read against both forest (green) and industrial (gray/brown). Cyan satisfies both. Avoid desaturated or muddy tones. |
| **Size** | Minimum 8 px source sprite; scale so projectile is visible at typical combat distance (ship-to-enemy ~200–400 px). Never smaller than 6 px on screen. |
| **Motion blur** | **None or minimal.** Art_style_guide: "no muddy or indistinct shots." Crisp edges preferred. If blur is used, keep it very subtle (<2 px) to avoid readability loss. |
| **Layering** | Projectiles render above terrain, below or equal to ships. Ensure no z-fighting with foliage or structures. |
| **Enemy differentiation** | Enemy projectiles use orange/amber (#FF8C00, #FFBF00) per art_style_guide enemy palette. Player = cyan. Clear faction read. |

---

## 3. References

| Document | Purpose |
|----------|---------|
| [design_system.md](../design_system.md) | Ship stats, weapons |
| [art_style_guide.md](../art_style_guide.md) | VFX language, projectile clarity, sophistication mandate |
| [sparrow_design_lock.md](p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) | Sparrow Attack 20; propulsion #00FFFF |
| [references/README.md](../references/README.md) | sophisticated_ref_2, 4, 5, 7 — projectile variety, hit feedback |

---

## 4. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2025-03-03 |
| **Visual Design** | Approved | 2025-03-03 |
| **CEO** | Approved | 2025-03-03 |

---

## Gate

This document gates:
- **2.3** — Basic gun (projectiles spawn, travel, despawn; use Attack stat)
- **2.4** — Projectile pooling (no allocations during fire; 60 FPS)

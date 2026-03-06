# Enemy Projectile Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 3.A.3**

Enemy projectiles for Phase 3 first combat. Locks damage formula (Scout → Player), fire rate, projectile speed, lifetime, and visual direction. Gates 3.2 (Enemy projectiles) and 3.4 (First wave).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Boss mocks** | [p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Combat context. Player vs boss; projectiles must read against forest and industrial backgrounds. Amber beams, spread projectiles, orb hints. |
| **Enemy hierarchy** | [p0_4_boss/enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout VFX: amber/green projectiles. Warm, organic; distinct from player cyan. Small explosion on death. |
| **Basic gun** | [basic_gun_design_lock.md](basic_gun_design_lock.md) | **Enemy vs player contrast.** Player: weaponStrength = Attack × 0.25; actualDamage = Max(0.1, weaponStrength / targetDefense). Player projectiles: cyan (#00FFFF), 240 px/s, 1.5 s lifetime, 0.15 s fire rate. Enemy projectiles: symmetric damage formula; orange/amber palette; distinct feel. |

---

## 1. Damage Formula (Scout → Player)

**Symmetric to player formula.** Same structure; enemy Attack and player Defense as inputs.

| Step | Formula | Notes |
|------|---------|-------|
| **Weapon strength** | `enemyWeaponStrength = ScoutAttack × 0.25` | Same coefficient as player (Attack × 0.25). Attack is single source of truth. |
| **Target application** | `actualDamage = Max(0.1, enemyWeaponStrength / playerDefense)` | Same as player vs enemy. Defense reduces damage. |
| **Sparrow (Defense 12, HP 14):** | Scout must deal **meaningful but not one-shot** damage | Target: 2–4 hits to down Sparrow. |

### Scout Attack (TBD → Locked)

**Target:** 3–4 hits to down Sparrow (HP 14).

| Hits to down | Damage per hit | weaponStrength | ScoutAttack |
|--------------|----------------|----------------|-------------|
| 4 hits | 3.5 | 42 | 168 |
| 3 hits | 4.67 | 56 | 224 |

**Locked:** Scout **Attack = 192**

- `enemyWeaponStrength = 192 × 0.25 = 48`
- `actualDamage = Max(0.1, 48 / 12) = 4` per hit vs Sparrow
- **4 hits** to down Sparrow (14 HP). Satisfying middle: not trivial (2), not spongy (5+). Evasion matters; Star Fox 64 feel.

**Implementation note:** `EnemyWeapon` and `EnemyProjectile` must read the Scout's Attack stat at fire time. No hardcoded projectile damage. Player entity receives damage via the same formula as any target.

---

## 2. Fire Rate, Speed, Lifetime

Per [art_style_guide.md](../art_style_guide.md): Enemy projectiles orange/amber; distinct from player cyan. **Feel:** Threatening but readable—R-Type clarity, not bullet-hell. Scout is Tier 1 swarm; projectiles should feel lighter than player shots.

| Property | Value | Rationale |
|----------|-------|-----------|
| **Fire rate** | **0.4 s** cooldown (~2.5 shots/s) | Slower than player (0.15 s). Scout swarm = many sources; individual shots less frequent. Avoids screen clutter. |
| **Projectile speed** | **180 px/s** | Slightly slower than player (240 px/s). Enemy shots feel heavier, more telegraphed. Player can outrun or dodge. Star Fox 64: enemy fire readable. |
| **Projectile lifetime** | **2.0 s** | Slightly longer than player (1.5 s). Scout approaches from above; shots travel farther before despawn. Keeps projectiles on screen long enough to matter. |

**Contrast summary:**

| | Player | Scout |
|---|--------|-------|
| Fire rate | 0.15 s | 0.4 s |
| Speed | 240 px/s | 180 px/s |
| Lifetime | 1.5 s | 2.0 s |

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Framework-free:** HTML5 Canvas 2D, TypeScript, Vite. No game framework.
- **Asset paths:** Images via `new Image()`; paths from `public/` at root. Enemy projectiles: `/images/projectiles/scout_shot.png` (or equivalent in `public/images/`).
- **Delta time:** Multiply projectile movement by delta for frame-rate independence.
- **Pooling:** Enemy projectiles should use pooling (like player projectiles) for 60 FPS. No allocations during fire.
- **Layering:** Enemy projectiles render above terrain, below or equal to ships. No z-fighting with foliage or structures.

---

## 4. Visual Design (Placeholder)

**Visual Design:** Orange/amber (#FF8C00, #FFBF00) per [art_style_guide.md](../art_style_guide.md). Distinct from player cyan (#00FFFF). Bright core, trail. Full visual lock in separate pass if needed.

| Property | Direction | Notes |
|----------|-----------|-------|
| **Color** | Orange/amber | #FF8C00, #FFBF00. Warm; contrasts with player cyan. Faction read. |
| **Core** | Bright | Per art_style_guide: "clear, readable, impactful." No muddy shots. |
| **Trail** | Short, soft falloff | Similar structure to player trail; different palette. Lightweight for 60 FPS. |
| **Size** | 8–12 px source | Readable at combat distance; not obscuring. |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [basic_gun_design_lock.md](basic_gun_design_lock.md) | Player damage formula, fire rate, speed, lifetime; enemy vs player contrast |
| [scout_design_lock.md](scout_design_lock.md) | Scout Attack (now locked 192), Defense 1, HP 15; amber/green projectiles |
| [art_style_guide.md](../art_style_guide.md) | Enemy projectile palette (orange/amber); VFX language; readability |
| [sparrow_design_lock.md](p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) | Sparrow Defense 12, HP 14; evasion-over-tanking design |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Projectile speed/lifetime patterns; asset paths; delta time |

---

## 6. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-05 |
| **Visual Design** | Approved | 2026-03-05 |
| **CEO** | Approved | 2026-03-05 |

---

## Gate

This document gates:
- **3.2** — Enemy projectiles (Scout fires; damage, speed, lifetime)
- **3.4** — First wave (Scouts approach, shoot, player can take damage)

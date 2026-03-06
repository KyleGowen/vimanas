# Phase 3 — 3.A.2, 3.A.3, 3.A.4 (Parallel)

**Status:** Drafts complete; pending CEO review  
**Delegation:** Combat Systems + Visual Design (3.A.3), Level/Encounter (3.A.4), Visual Design (3.A.2)

---

## Deliverables

| ID    | Type   | Output | Subagent |
|-------|--------|--------|----------|
| 3.A.2 | Asset  | [scout_sprite_sheet_spec.md](docs/concepts/p0_mocks/p0_4_boss/scout_sprite_sheet_spec.md) | Visual Design |
| 3.A.3 | Design | [enemy_projectile_design_lock.md](docs/concepts/enemy_projectile_design_lock.md) | Combat Systems |
| 3.A.4 | Design | [wave_design_spec.md](docs/concepts/wave_design_spec.md) | Level/Encounter |

---

## Summary

### 3.A.2 Scout sprite sheet spec
- Pose list: Flying, Firing, Damage, Death
- 2×2 grid, 192×192 px/cell
- Image prompts for each pose; asset paths: `public/images/enemies/scout_*.png`
- **Next:** Generate placeholder sprites or full sheet per prompts

### 3.A.3 Enemy projectile design lock
- Scout Attack = 192 → 4 damage/hit vs Sparrow (Def 12) → 4 hits to down
- Fire rate 0.4 s, speed 180 px/s, lifetime 2.0 s
- Orange/amber (#FF8C00, #FFBF00); distinct from player cyan

### 3.A.4 Wave design spec
- Wave 1: V (5 Scouts, 0.4 s stagger)
- Wave 2–3: Staggered Wedge (7 Scouts, 0.3 s)
- Wave 4+: Pincer (6 Scouts, 2 wings)
- Between-wave delay: 4–5 s → 3 s ramp

---

## How to verify

- **3.A.2:** Read scout_sprite_sheet_spec.md; generate sprites per prompts; CEO approves
- **3.A.3:** Read enemy_projectile_design_lock.md; formula OK; CEO approves
- **3.A.4:** Read wave_design_spec.md; spec approved; CEO approves

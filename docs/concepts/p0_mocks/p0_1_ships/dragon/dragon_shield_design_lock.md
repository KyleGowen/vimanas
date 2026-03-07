# Dragon Shield Design Lock (Meditating)

**Joint Deliverable · Combat Systems + Visual Design · 6.D.4**

Dragon shield—**Meditating**: red sprite tracing with fire-like effect. No damage reduction. Increases mana regeneration rate. Cannot fire (primary or secondary) while meditating. Locks visual, mana regen boost, and constraints. Gates 6.D.6 (Dragon entity + shield).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Dragon red/gold; shield = fire-like tracing |
| **Dragon design lock** | [dragon_design_lock.md](dragon_design_lock.md) | Mana 28, Mana Regen 4; mana archetype |
| **Wolf shield** | [wolf_shield_design_lock.md](../wolf/wolf_shield_design_lock.md) | Contrast: Wolf = damage reduction; Dragon = regen only |

---

## 1. Combat Systems

### Damage Reduction

- **None.** Meditating does not reduce incoming damage.
- **Rationale:** Dragon trades defense for mana sustain. Meditating is a risk—vulnerable but regening.

### Mana Regen Boost

- **Multiplier:** 1.75× base mana regen while meditating.
- **Dragon base regen:** 4/s → **7/s** while meditating.
- **Mana cost:** **0** — meditating is free. Pure regen boost.

### Constraint: Cannot Fire

- **Primary:** Blocked while meditating.
- **Secondary:** Blocked while meditating (cannot charge).
- **Rationale:** Meditating = defensive/sustain mode. Player must choose: fight or recover.

### Coverage

- **Full or front-half:** Design choice. Recommend full sprite tracing (like Sparrow) for clarity—meditating reads as "wrapped in fire."
- **Hit test:** N/A — no damage reduction. No contact damage.

---

## 2. Visual Design

### Shape

- **Sprite tracing:** Red outline following dragon sprite contour. Same technique as Wolf (shadowBlur + clip) but fire-like.
- **Fire-like effect:** Use thruster-style segments (orange/red gradient, animated) — NOT simple glow. Per user: "should look like fire similar to the thrusters."

### Palette

| Stop | Color | Hex | Notes |
|------|-------|-----|-------|
| Core | Orange-red | #FF4500 | Bright; matches thruster |
| Mid | Red | #CC3300 | Transition |
| Tip | Transparent | rgba(150,50,0,0) | Fade |

**Rationale:** Dragon propulsion = orange/red. Shield shares that fire signature. Distinct from Wolf (white/silver), Sparrow (cyan), Turtle (amber).

### Draw Approach

- **Function:** `drawDragonMeditatingZone` or `drawDragonShieldZone`.
- **Technique:** Sprite outline with shadowBlur (like Wolf) but fill with fire-like gradient/segments (thruster-style layered shapes).
- **Animation:** Subtle pulse, flicker—fire feel. Reuse thruster segment drawing or similar.

---

## 3. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `DRAGON_MEDITATING_REGEN_MULTIPLIER` | 1.75 | 4/s → 7/s |
| `DRAGON_MEDITATING_MANA_COST` | 0 | Free |
| `DRAGON_MEDITATING_DAMAGE_REDUCTION` | 0 | None |

---

## 4. References

| Document | Purpose |
|----------|---------|
| [dragon_design_lock.md](dragon_design_lock.md) | Dragon stats |
| [wolf_shield_design_lock.md](../wolf/wolf_shield_design_lock.md) | Sprite tracing technique |
| [thruster-effect.ts](../../../src/effects/thruster-effect.ts) | Fire-like segment drawing |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language |

---

## 5. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-07 |
| **Visual Design** | Approved | 2026-03-07 |
| **CEO** | Pending | — |

---

## Gate

This document gates:
- **6.D.6** — Dragon entity + meditating implementation

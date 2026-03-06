# Turtle Shield Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.T.4**

Turtle shield—**fortress barrier**: a protective force-field zone around the Turtle. Unlike Sparrow's personal glow, this is a **visible barrier** that other player ships can enter to become shielded. Tank-appropriate; supports co-op. Locks damage reduction, mana drain, zone size, behavior, and VFX. Gates 6.T.6 (Turtle entity + shield).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Turtle propulsion #FFBF00; shield VFX aligns with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; shield must read against forest background |
| **Turtle design lock** | [turtle_design_lock.md](turtle_design_lock.md) | HP 26, Defense 24, Mana 20; tank archetype; amber/gold propulsion |
| **Sparrow shield** | [sparrow-ship.ts](../../../src/ships/sparrow-ship.ts), [shield-effect.ts](../../../src/effects/shield-effect.ts) | Contrast: Sparrow = personal glow; Turtle = force-field zone. Different implementation. |

---

## 1. Combat Systems

### Damage Reduction Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `actualDamage = Max(0.1, weaponStrength / targetDefense)`. Shield multiplies damage by `(1 - reduction)` when active.

**Turtle shield:** **65%** damage reduction.

- `actualDamage = Max(0.1, weaponStrength / targetDefense) × (1 - 0.65)` → **35%** of incoming damage when shield active.
- **Rationale:** Sparrow = 50%. Turtle tank = stronger block. 65% makes Turtle feel more durable while still taking some damage.

### Mana Drain Rate

- **0.75 mana/s** when shield held.

- **Rationale:** Sparrow = 1 mana/s. Turtle has Mana 20 vs Sparrow 19, and lower drain. With 0.75/s, Turtle can hold shield ~27 s at full mana vs Sparrow ~19 s. Tank identity: longer hold time.

### Mana Regen Rate

- **3.2 mana/s** when not using shield or secondary.

- **Rationale:** Sparrow = 3 mana/s. Turtle Mana 20 vs Sparrow 19; slight regen bump supports sustained shield use. Scales with Mana stat: `3 × (20/19) ≈ 3.16` → round to **3.2**.

### Shield Zone (Force Field)

- **Type:** Protective barrier zone—not a personal glow. A **force field** that the Turtle and other ships can be inside.
- **Size:** **Configurable.** Default radius ~150–180 px (wide enough for 2+ ships). Exposed as `TURTLE_SHIELD_RADIUS_PX` or equivalent.
- **Co-op:** Any player ship whose center is inside the zone receives the 65% damage reduction. Ships can briefly enter to become shielded.
- **Origin:** Zone is centered on the Turtle. Moves with the Turtle.

### Recharge / Cooldown Rules

- **No cooldown.** Shield activates on input, deactivates on release.
- **No recharge delay.** Shield is available as soon as input is held and mana > 0.
- **Behavior:** Shield active = shield held AND mana > 0. When mana hits 0, shield deactivates until mana regens.

### Tank vs Sparrow Comparison

| Aspect | Sparrow | Turtle |
|--------|---------|--------|
| **Type** | Personal glow (sprite outline) | Force-field zone (other ships can enter) |
| **Damage reduction** | 50% | 65% |
| **Mana drain (active)** | 1/s | 0.75/s |
| **Mana regen (idle)** | 3/s | 3.2/s |
| **Mana pool** | 19 | 20 |
| **Max hold time** | ~19 s | ~27 s |
| **Co-op** | Self only | Self + allies inside zone |

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — Ship Propulsion Glow Colors. Turtle propulsion glow = #FFBF00 (amber/gold). [turtle_design_lock.md](turtle_design_lock.md) — palette, Vimana language.

**Distinct from Sparrow:** Sparrow uses a personal glow (sprite-outline). Turtle uses a **force field**—a visible barrier dome/bubble that ships can be inside. Not a glow; a defined zone with a visible edge.

### 2.1 Force Field VFX

- **Type:** Force field—visible barrier (dome, bubble, or ring). Ships inside are protected; the barrier reads as a distinct zone.
- **Shape:** Circular zone (top-down). Optional: subtle dome curvature, hexagonal filigree, or energy-ring edge for Kaladesh feel.
- **Edge:** Visible boundary—not a soft glow. Semi-transparent amber surface; ships inside are clearly "within" the barrier.

### 2.2 Shield VFX Palette

Turtle shield uses the same amber/gold energy signature as propulsion and weapons.

| Use | Color | Hex / RGBA | Notes |
|-----|-------|------------|-------|
| **Surface** | Amber | #FFBF00 | Force-field face; matches propulsion |
| **Edge** | Dark amber | #CC8F00 | Defined boundary |
| **Interior** | Transparent tint | rgba(255, 191, 0, 0.08) | Subtle tint inside zone; ships visible through it |

**Rationale:** Force field reads as a barrier, not a glow. Ships inside remain visible; the barrier has a clear edge.

### 2.3 Visual Language

- **Aether-powered:** Warm amber energy barrier. Same aether glow as propulsion and weapons.
- **Filigree / ornate:** Optional hexagonal or geometric edge pattern for Kaladesh. Beauty alongside functionality.
- **Tank identity:** Slower pulse; heavier, more deliberate feel. Barrier feels substantial.
- **Kaladesh pillar:** Gilded, warm, Indian fantasy—not cold or industrial.

### 2.4 Readability

- **Forest backgrounds:** Amber contrasts with lush greens. Force-field edge must read clearly.
- **Industrial backgrounds:** Amber stands out against gray/brown pipes and conduits.
- **Co-op:** Turtle force field (amber zone) distinct from Sparrow (cyan personal glow). Other ships visible inside the zone.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Force field draw:** New effect—not `drawShieldGlow()`. Draw a circular zone (arc or filled circle with gradient). Center at Turtle position; radius from config. Ships draw on top of the zone (or zone draws behind ships). Draw order: force field → ships → thruster.
- **Hit test:** For each player ship, check `distance(shipCenter, turtleCenter) <= TURTLE_SHIELD_RADIUS_PX`. If true, that ship receives damage reduction.
- **Configurable size:** `TURTLE_SHIELD_RADIUS_PX` exposed; default 150–180 px. Tuning for "wide enough for other ships."
- **Mana logic:** Same flow as Sparrow—`consumeShieldMana(deltaTime)` when active; mana regen only when `!shieldDown && !secondaryFireDown`. Turtle ship stats include `manaRegenRate: 3.2`, `mana: 20`.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `TURTLE_SHIELD_DAMAGE_REDUCTION` | 0.65 | 65% block for any ship inside zone |
| `TURTLE_SHIELD_MANA_PER_SECOND` | 0.75 | Drain when held |
| `TURTLE_MANA_REGEN_RATE` | 3.2 | When not using shield/secondary (in Turtle stats block) |
| `TURTLE_SHIELD_RADIUS_PX` | 150–180 | Configurable; wide enough for other ships. Default 165. |
| `TURTLE_SHIELD_PALETTE.surface` | #FFBF00 | Amber force-field face |
| `TURTLE_SHIELD_PALETTE.edge` | #CC8F00 | Dark amber boundary |
| `TURTLE_SHIELD_PALETTE.interior` | rgba(255, 191, 0, 0.08) | Subtle tint inside zone |
| `TURTLE_SHIELD_CONFIG.pulseFreq` | 5 | Slower pulse; tank feel |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [turtle_design_lock.md](turtle_design_lock.md) | Turtle stats, propulsion color |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |
| [sparrow-ship.ts](../../../src/ships/sparrow-ship.ts) | Sparrow shield (contrast: personal vs zone) |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, propulsion glow colors |

---

## 6. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-06 |
| **Visual Design** | Approved | 2026-03-06 |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **6.T.6** — Turtle entity + shield implementation

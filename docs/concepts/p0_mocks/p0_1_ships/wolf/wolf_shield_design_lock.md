# Wolf Shield Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.W.4**

Wolf shield—**front-half barrier**: a protective arc covering only the front of the ship. Unlike Sparrow's full-circle glow, the Wolf's shield covers the **front semicircle only**; the back half is left exposed. Per CEO: shield covers front part only, back half left exposed. The Wolf's shield also deals **1 damage per second** to enemies in contact with it. Locks damage reduction, mana drain, coverage arc, contact damage, and VFX. Gates 6.W.6 (Wolf entity + shield).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Wolf propulsion #E8E8E8 (white/silver); shield VFX aligns with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; shield must read against forest background |
| **Wolf design lock** | [wolf_design_lock.md](wolf_design_lock.md) | HP 20, Defense 20, Mana 20; neutral archetype; white/silver propulsion |
| **Sparrow shield** | [sparrow-ship.ts](../../../src/ships/sparrow-ship.ts), [shield-effect.ts](../../../src/effects/shield-effect.ts) | Contrast: Sparrow = full circle glow; Wolf = front-half arc only. Different implementation. |
| **Turtle shield** | [turtle_shield_design_lock.md](../turtle/turtle_shield_design_lock.md) | Contrast: Turtle = full zone; Wolf = front semicircle. Partial coverage. |

---

## 1. Combat Systems

### Damage Reduction Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `actualDamage = Max(0.1, weaponStrength / targetDefense)`. Shield multiplies damage by `(1 - reduction)` when active **and** the attack originates from within the shielded arc.

**Wolf shield:** **45%** damage reduction (when attack is from front).

- `actualDamage = Max(0.1, weaponStrength / targetDefense) × (1 - 0.45)` → **55%** of incoming damage when shield active and attack from front.
- **Rationale:** Sparrow = 50%, Turtle = 65%. Wolf has partial coverage—front half only. 45% reflects that the shield is strong where it exists but doesn't cover the whole ship. Slightly weaker than Sparrow's full coverage to balance the offensive upside (contact damage).

### Mana Drain Rate

- **0.8 mana/s** when shield held.

- **Rationale:** Sparrow = 1 mana/s, Turtle = 0.75 mana/s. Wolf trades full coverage for lower mana cost. 0.8/s gives Wolf ~25 s hold time at full mana (20 mana) vs Sparrow ~19 s. Partial coverage = lower drain than Sparrow; different feel.

### Mana Regen Rate

- **3 mana/s** when not using shield or secondary.

- **Rationale:** Wolf is neutral archetype; same baseline regen as Sparrow. Wolf Mana 20; 3/s keeps Wolf versatile without specializing in sustain like Turtle.

### Shield Coverage (Front Semicircle)

- **Type:** Personal arc—not a full circle. **Front-half only.** Back half exposed.
- **Coverage:** Front semicircle. **"Front"** = north-facing half of the ship.
- **Arc definition:** 180° arc centered on ship facing. Arc from **-90° to +90°** around north (0°). Enemies and projectiles **in front** of the Wolf (within this arc) hit the shield; attacks from **behind** (the exposed back half) apply **full damage** with no reduction.
- **Hit test (incoming damage):** For each damage source, compute angle from Wolf center to source. If angle falls within the shielded arc (relative to Wolf facing), apply 45% reduction. Otherwise, full damage.
- **Origin:** Arc is centered on the Wolf. Moves and rotates with the Wolf.

### Shield Damage to Enemies (Contact Damage)

- **Rate:** **1 damage per second** to enemies in contact with the shield (front half).
- **Contact definition:** **Enemy center within the shielded arc.** An enemy takes 1 damage/s if its **center point** lies within the front semicircle arc at the shield radius. Simpler hit test; predictable behavior.
- **Alternative (deferred):** "Enemy overlaps shield region" (any part of enemy hitbox within arc) could be used for a more generous contact zone; document as implementation option if needed.
- **Radius:** Shield arc radius ~similar to Sparrow glow (ship half-diagonal × radius scale, e.g. 1.2). Configurable as `WOLF_SHIELD_ARC_RADIUS_PX` or equivalent.
- **Rationale:** Minimal offensive upside—1 dps is low but meaningful. Rewards positioning (ramming into enemies with shield up). Wolf trades full coverage for this offensive option.

### Recharge / Cooldown Rules

- **No cooldown.** Shield activates on input, deactivates on release.
- **No recharge delay.** Shield is available as soon as input is held and mana > 0.
- **Behavior:** Shield active = shield held AND mana > 0. When mana hits 0, shield deactivates until mana regens.

### Wolf vs Sparrow vs Turtle Comparison

| Aspect | Sparrow | Turtle | Wolf |
|--------|---------|--------|------|
| **Type** | Full circle glow (sprite outline) | Force-field zone (allies enter) | Front-half arc (personal) |
| **Coverage** | 360° | 360° (zone) | 180° (front only) |
| **Damage reduction** | 50% | 65% | 45% (front only) |
| **Mana drain (active)** | 1/s | 0.75/s | 0.8/s |
| **Mana regen (idle)** | 3/s | 3.2/s | 3/s |
| **Mana pool** | 19 | 20 | 20 |
| **Max hold time** | ~19 s | ~27 s | ~25 s |
| **Contact damage** | None | None | 1 dps (enemies in front arc) |
| **Co-op** | Self only | Self + allies in zone | Self only |

---

## 2. Visual Design

### Shape

**Front semicircle only.** A 180° arc covering the north-facing half of the ship. The shield reads as a **half-dome barrier** in front of the Wolf—visible boundary on the front, back clearly exposed. No glow or barrier on the rear half.

- **Arc definition:** -90° to +90° around ship facing (north = 0°). Same arc as Combat Systems hit test.
- **Contrast:** Sparrow uses `drawShieldGlow()` (full circle via `ctx.arc(..., 0, Math.PI * 2)`); Turtle uses `drawTurtleShieldZone()` (full circle). Wolf requires a **semicircle variant**—`drawFrontHalfShield` or `drawWolfShieldZone`—using `ctx.arc()` with `startAngle` and `endAngle` to draw only the front half.

### Palette

White/silver to match Wolf propulsion per [wolf_design_lock.md](wolf_design_lock.md) and [art_style_guide.md](../../../art_style_guide.md).

| Stop | Color | Hex | Notes |
|------|-------|-----|-------|
| Core | White/silver | #E8E8E8 | Bright center; matches thruster core |
| Mid | Silver | #B0B0B0 | Softer transition; matches thruster mid |
| Tip | Transparent | rgba(176,176,176,0) | Fade to nothing at arc edge |

**Rationale:** Shield shares Wolf's aether energy signature. Distinct from Sparrow (cyan #00FFFF), Turtle (amber #FFBF00). Neutral, balanced read.

### Draw Approach

- **Function:** `drawFrontHalfShield` or `drawWolfShieldZone`. New effect—not a full `drawShieldGlow()`.
- **Geometry:** `ctx.arc(cx, cy, radius, startAngle, endAngle)` where `startAngle` and `endAngle` span 180° centered on ship facing. For north-facing: `startAngle = -Math.PI/2`, `endAngle = Math.PI/2`. Rotate with ship: `startAngle = shipRotation - Math.PI/2`, `endAngle = shipRotation + Math.PI/2`.
- **Fill:** Radial gradient (core → mid → tip) clipped to the semicircle. Optional: segmented edge band (filigree-style) similar to Turtle's outer ring but only on the front arc—aether energy flowing along the visible boundary.
- **Pulse:** Subtle radius breathing (e.g. 0.98–1.02×) and optional edge shimmer for life. Keep lightweight (60 FPS target).
- **Radius:** Same scale as Sparrow glow—ship half-diagonal × 1.2 (configurable `WOLF_SHIELD_ARC_RADIUS_PX`).

### Aether / Filigree

Per [art_style_guide.md](../../../art_style_guide.md): Vimana language—ornate mechanical, filigree, flowing lines, aether glow. Wolf shield should read as **aether-powered barrier**—luminous, not flat. Options: (1) soft radial gradient with bright core; (2) segmented edge band along the arc (thruster-like energy segments); (3) subtle filigree-style highlights at the arc boundary. Prefer clarity over ornament—Wolf is "less busy" than others; shield should be readable, not cluttered.

### Readability

- **Forest background:** White/silver (#E8E8E8) contrasts with lush greens. Front arc reads clearly.
- **Industrial background:** Silver reads against gray/brown pipes and conduits.
- **Ship identity:** Wolf = front-half arc (white/silver). Sparrow = full circle (cyan). Turtle = full zone (amber). Instant visual distinction.
- **Contact damage cue:** Enemies in the front arc take 1 dps—shield edge should read as "active barrier" so players understand the contact zone.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Arc draw:** New effect—not full `drawShieldGlow()`. Draw a **semicircle arc** (180°) centered on ship facing. Use `ctx.arc()` with `startAngle` and `endAngle` based on ship rotation. Front half only; no draw on back.
- **Hit test (incoming):** For each damage source, `angleFromWolf = atan2(sourceY - wolfY, sourceX - wolfX)`. Normalize relative to Wolf facing. If within ±90°, apply shield reduction.
- **Hit test (contact damage):** For each enemy, check if enemy center is within shield arc radius AND within ±90° of Wolf facing. If true, apply 1 damage per second (deltaTime).
- **Configurable:** `WOLF_SHIELD_ARC_RADIUS_PX` or radius scale; default similar to Sparrow (~ship half-diagonal × 1.2).
- **Mana logic:** Same flow as Sparrow—`consumeShieldMana(deltaTime)` when active; mana regen only when `!shieldDown && !secondaryFireDown`. Wolf ship stats include `manaRegenRate: 3`, `mana: 20`.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `WOLF_SHIELD_DAMAGE_REDUCTION` | 0.45 | 45% block for attacks from front arc |
| `WOLF_SHIELD_MANA_PER_SECOND` | 0.8 | Drain when held |
| `WOLF_SHIELD_CONTACT_DAMAGE_PER_SECOND` | 1 | Damage to enemies in contact (front arc) |
| `WOLF_SHIELD_ARC_DEGREES` | 180 | Front semicircle (-90° to +90° around facing) |
| `WOLF_SHIELD_ARC_RADIUS_PX` | ~ship half-diag × 1.2 | Configurable; similar to Sparrow glow. Default from ship size. |
| `WOLF_MANA_REGEN_RATE` | 3 | When not using shield/secondary (in Wolf stats block) |
| `WOLF_SHIELD_PALETTE` | core #E8E8E8, mid #B0B0B0, tip transparent | Per Visual Design §2 |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [wolf_design_lock.md](wolf_design_lock.md) | Wolf stats, propulsion color |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |
| [sparrow-ship.ts](../../../src/ships/sparrow-ship.ts) | Sparrow shield (contrast: full vs front-half) |
| [shield-effect.ts](../../../src/effects/shield-effect.ts) | Sparrow glow implementation; Wolf needs arc variant |
| [turtle_shield_design_lock.md](../turtle/turtle_shield_design_lock.md) | Turtle shield (contrast: zone vs arc) |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, propulsion glow colors |

---

## 6. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-07 |
| **Visual Design** | Approved | 2026-03-07 |
| **CEO** | Pending | — |

---

## Gate

This document gates:
- **6.W.6** — Wolf entity + shield implementation

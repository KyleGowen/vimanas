# Wave Sequence Design Spec

**Level / Encounter Agent · Phase 4 · 4.A.3**

Defines the *sequence* for Level 1: which formations in which order, wave count, and difficulty ramp. Extends [wave_design_spec.md](wave_design_spec.md) (formations, spacing, between-wave delays).

**Canon:** [wave_design_spec.md](wave_design_spec.md), [scout_design_lock.md](scout_design_lock.md)

---

## 1. Level 1 Wave Sequence

| Wave | Formation | Scout Count | Between-Wave Delay | Rationale |
|------|-----------|-------------|--------------------|-----------|
| **1** | V (Wedge) | 5 | — | First encounter. Readable threat cone; player learns "aim at point." R-Type memorization—deliberate positioning. |
| **2** | Staggered Wedge | 7 | 4–5 s | Mid-wave ramp. Insect swarm depth; hive-mind coordination. More targets; player tracks rows. |
| **3** | Staggered Wedge | 7 | 3.5–4 s | Reinforce Staggered Wedge pattern; slightly tighter pacing. Player warmed up. |
| **4** | Pincer | 6 | 3–3.5 s | Late-wave variation. Converging threat from upper-left and upper-right. Forces lateral awareness. |
| **5** | Pincer | 6 | 3 s min | Boss lead-in / climax. Sustained lateral pressure; minimal recovery. Player has learned all three formations. |

**Total:** 5 waves, 31 Scouts. All formations approach from above (north); threat direction clear per scout_design_lock.

---

## 2. Between-Wave Delays (Implementation Values)

Per [wave_design_spec.md](wave_design_spec.md) §3 Spawn Timing. Delay starts when wave complete condition is met (all Scouts destroyed or offscreen).

| Transition | Range | Recommended | Rationale |
|------------|-------|-------------|-----------|
| Wave 1 → 2 | 4–5 s | 4.5 s | Player clears first wave; brief breathing room. Sparrow 3 hits/Scout × 5 Scouts ≈ 2–4 s combat; add 2 s buffer. |
| Wave 2 → 3 | 3.5–4 s | 3.75 s | Slightly tighter; player warmed up. |
| Wave 3 → 4 | 3–3.5 s | 3.25 s | Ramp continues; Staggered Wedge → Pincer is a formation shift. |
| Wave 4 → 5 | 3 s min | 3.0 s | Sustained pressure; no dead air. Climax before level end. |

**Implementation note:** WaveSpawner waits delay after `waveComplete`, then spawns next wave. Use real time (delta), not frame count.

---

## 3. Difficulty Ramp Rationale

Difficulty increases across waves via formation variety, scout count, stagger, and recovery time—not randomness. R-Type principle: memorization over chaos.

| Lever | How it ramps |
|-------|--------------|
| **Formation variety** | V (single cone) → Staggered Wedge (depth) → Pincer (converging sides). Forces different aiming and positioning. |
| **Scout count** | 5 → 7 → 7 → 6 → 6. Pincer has fewer total Scouts but two threat vectors; lateral awareness matters more than raw count. |
| **Stagger tightness** | V 0.6 s → Staggered Wedge 0.5 s (faster spawn). Pincer 0.6 s per wing but wings overlap (0.3 s offset) = overlapping pressure. |
| **Between-wave delay** | 4.5 s → 3.75 s → 3.25 s → 3 s. Less recovery time; sustained engagement. |
| **Pattern reinforcement** | Wave 2–3: same formation twice so player internalizes Staggered Wedge. Wave 4–5: Pincer twice for climax. |

**Bird migration / swarm read:** V reads as coordinated flock; Staggered Wedge as hive-mind depth; Pincer as decentralized two-hive convergence. Each wave has a readable pattern; difficulty comes from pattern variety and pacing.

---

## 4. Formation Reference (Quick Lookup)

| Formation | Scouts | Stagger | Total spawn window |
|-----------|--------|---------|--------------------|
| V (Wedge) | 5 | 0.6 s | ~3.0 s |
| Staggered Wedge | 7 | 0.5 s | ~3.5 s |
| Pincer | 6 (2×3) | 0.6 s per wing; wings 0.3 s apart | ~3.9 s |

Spacing, layout, and rationale: [wave_design_spec.md](wave_design_spec.md) §2, [scout_design_lock.md](scout_design_lock.md) Formation Spec.

---

## 5. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

| Concern | Spec |
|---------|------|
| **Delta time** | Multiply Scout movement by delta for frame-rate independence. Stagger timers (0.5 s, 0.6 s) and between-wave delays use real time, not frame count. |
| **Asset loading** | Scout sprites from `public/images/`; paths like `/images/enemies/scout_facing_n.png`. Preload before first wave. |
| **Performance** | 60 FPS target. Wave spawn (5–7 Scouts) is lightweight; enemy pooling prevents GC spikes during sustained waves. |
| **Canvas resolution** | Spacing values (60 px, 72 px, 240 px) assume fixed internal resolution (e.g. 1280×720). Scale consistently. |
| **Pause** | Stop game loop when tab hidden or paused; resume on focus. Between-wave delay timer should pause with game. |

---

## 6. References

| Document | Purpose |
|----------|---------|
| [wave_design_spec.md](wave_design_spec.md) | Formations (V, Staggered Wedge, Pincer); spacing; within-wave stagger; between-wave delay ranges |
| [scout_design_lock.md](scout_design_lock.md) | Formation Spec; Scout stats; when-to-use per formation |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Delta time, asset paths, performance, canvas resolution |

---

## Gate

This document gates **4.A.3** — Wave sequence design (3–5 waves; difficulty ramp; spacing).

# Wave Design Spec

**Level / Encounter Agent · Phase 3 · 3.A.4**

Wave composition, spawn timing, and difficulty ramp for the first level. Scouts only. Gates 3.4 (First wave) and 4.A.3 (Wave sequence design).

---

## CEO Tuning (2026-03-05)

Formations loosened per CEO feedback: enemy waves were too densely packed. Scout size ~62 px; each Scout should read as a distinct target without visual clutter. **Lateral and depth spacing increased ~50%; stagger increased for clearer target separation.**

| Formation | Property | Old | New |
|-----------|----------|-----|-----|
| **V (Wedge)** | Wing lateral | 40 px | 60 px |
| | Wing depth | 24 px | 36 px |
| | Leader offset | 32 px | 48 px |
| | Stagger | 0.4 s | 0.6 s |
| **Staggered Wedge** | Row depth | 36 px | 54 px |
| | Lateral (outer wings) | 48 px | 72 px |
| | Stagger | 0.3 s | 0.5 s |
| **Pincer** | Per-wing lateral | 40 px | 60 px |
| | Per-wing depth | 28 px | 42 px |
| | Wing separation | 160 px | 240 px |
| | Stagger (within wing) | 0.4 s | 0.6 s |
| | Wing spawn offset | 0.2 s | 0.3 s |

**Implementation:** Update `wave-spawner.ts` (and `scout_design_lock.md` Formation Spec) to use the New values above.

---

## 1. Scope

| Scope | Spec |
|-------|------|
| **Level** | First level (Phase 3–4) |
| **Enemy type** | Scouts only |
| **Scouts per wave** | 5–7 per roadmap |
| **Formations** | V, Staggered Wedge, Pincer per [scout_design_lock.md](scout_design_lock.md) Formation Spec |

No Medium, Elite, or Boss in this scope. Wave design is extensible for future tiers.

---

## 2. Wave Composition

Per [scout_design_lock.md](scout_design_lock.md) Formation Spec. All formations approach from above (north/top of screen); threat direction clear.

### Wave 1 — V (Wedge)

| Property | Value | Source |
|----------|-------|--------|
| **Formation** | V (Wedge) | scout_design_lock |
| **Scout count** | 5 | 1 leader + 2 per wing |
| **Layout** | 1 leader at apex, 2 per wing | Bird migration read; leader at apex |
| **Wing spacing** | 60 px lateral, 36 px depth | CEO tuning 2026-03-05 |
| **Leader offset** | 48 px ahead of wing tips | CEO tuning 2026-03-05 |
| **Stagger** | 0.6 s between each Scout spawn | CEO tuning 2026-03-05 |

**Rationale:** First encounter. Readable threat cone; player learns "aim at point." R-Type memorization—deliberate positioning, not chaos.

### Wave 2–3 — Staggered Wedge

| Property | Value | Source |
|----------|-------|--------|
| **Formation** | Staggered Wedge | scout_design_lock |
| **Scout count** | 7 | 1 leader + 2 rows of 3 (staggered) |
| **Row spacing** | 54 px depth | CEO tuning 2026-03-05 |
| **Lateral** | 72 px between outer wings | CEO tuning 2026-03-05 |
| **Stagger** | 0.5 s between each Scout spawn | CEO tuning 2026-03-05 |

**Rationale:** Mid-wave difficulty ramp. Insect swarm depth; hive-mind coordination. More targets without clutter; player tracks rows.

### Wave 4+ — Pincer or Variation

| Property | Value | Source |
|----------|-------|--------|
| **Formation** | Pincer | scout_design_lock |
| **Scout count** | 6 (2 wings × 3) | scout_design_lock |
| **Per wing** | Leader + 2 behind; 60 px lateral, 42 px depth | CEO tuning 2026-03-05 |
| **Wing separation** | 240 px apart at spawn | CEO tuning 2026-03-05 |
| **Stagger (within wing)** | 0.6 s per Scout | CEO tuning 2026-03-05 |
| **Wing spawn offset** | 0.3 s between wings | CEO tuning 2026-03-05 |

**Rationale:** Late wave / variation. Converging threat from upper-left and upper-right. Forces lateral awareness; decentralized swarm read.

**Variation:** For wave 5+, alternate Pincer with Staggered Wedge or repeat Pincer with tighter spacing (see Difficulty ramp).

---

## 3. Spawn Timing

### Within-Wave Stagger

Per Formation Spec above. Stagger prevents Scouts from appearing as a single blob; each reads as distinct target.

| Formation | Stagger | Total spawn window (approx) |
|-----------|---------|-----------------------------|
| V (5 Scouts) | 0.6 s | ~3.0 s |
| Staggered Wedge (7 Scouts) | 0.5 s | ~3.5 s |
| Pincer (6 Scouts) | 0.6 s per wing; wings 0.3 s apart | ~3.9 s (wing 1: 1.8 s; wing 2: 1.8 s + 0.3 s offset) |

### Between-Wave Delay

| Property | Value | Rationale |
|----------|-------|-----------|
| **Wave 1 → 2** | 4–5 s | Player clears first wave; brief breathing room. Sparrow 3 hits/Scout × 5 Scouts ≈ 2–4 s combat; add 2 s buffer. |
| **Wave 2 → 3** | 3.5–4 s | Slightly tighter; player warmed up. |
| **Wave 3 → 4** | 3–3.5 s | Ramp continues. |
| **Wave 4+** | 3 s minimum | Sustained pressure; no dead air. |

**Implementation note:** Delay starts when wave complete condition is met (all Scouts destroyed). WaveSpawner waits delay, then spawns next wave.

---

## 4. Difficulty Ramp

Difficulty increases across waves via:

| Lever | How it ramps |
|-------|--------------|
| **Scout count** | 5 (V) → 7 (Staggered Wedge) → 6 (Pincer). Pincer has fewer total Scouts but two threat vectors. |
| **Formation variety** | V (single cone) → Staggered Wedge (depth) → Pincer (converging sides). Forces different aiming and positioning. |
| **Stagger tightness** | V 0.6 s → Staggered Wedge 0.5 s (faster spawn = less time between targets). Pincer 0.6 s but two wings = overlapping pressure. |
| **Between-wave delay** | 4–5 s → 3 s. Less recovery time; sustained engagement. |
| **Spacing (future tuning)** | For wave 5+, consider 10–15% tighter lateral/depth spacing on Pincer or Staggered Wedge. Not in initial 3.4 scope. |

**R-Type principle:** Memorization over chaos. Each wave has a readable pattern; difficulty comes from pattern variety and pacing, not randomness.

---

## 5. Wave Complete Condition

**Core game rule:** A wave is over when all enemies in the wave are either **destroyed** or **offscreen**.

| Condition | Spec |
|-----------|------|
| **Trigger** | All Scouts in the wave destroyed OR offscreen |
| **State** | No live Scout entities from current wave (destroyed or flown off bottom) |

### Implementation Note for WaveSpawner

1. **Track wave entities:** When spawning a wave, register each Scout to the wave. On Scout death (OnDeath / pool return) **or** Scout going offscreen, decrement wave count.
2. **Wave complete:** When count reaches 0, emit `waveComplete` or equivalent. Start between-wave delay timer.
3. **Next wave:** When delay expires, spawn next wave per wave composition table. Repeat until level wave sequence ends.
4. **Edge case:** If player dies before wave complete, handle per game-over flow (wave does not complete; level may reset).

---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Delta time:** Multiply Scout movement by delta for frame-rate independence. Stagger timers (0.3 s, 0.4 s) use real time, not frame count.
- **Asset loading:** Scout sprites from `public/images/`; paths like `/images/enemies/scout_facing_n.png`. Preload before first wave.
- **Performance:** 60 FPS target. Wave spawn (5–7 Scouts) is lightweight; enemy pooling (3.3) prevents GC spikes during sustained waves.
- **Canvas resolution:** Spacing values (60 px, 72 px, etc.) assume fixed internal resolution (e.g. 1280×720). Scale consistently.

---

## 7. References, Sign-Off

| Document | Purpose |
|----------|---------|
| [scout_design_lock.md](scout_design_lock.md) | Formation Spec (V, Staggered Wedge, Pincer); spacing, stagger, when-to-use |
| [enemy_hierarchy_and_ship_notes.md](p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) | Scout tier; behavior (approaching from above, V-formation, staggered wedge) |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Delta time, asset paths, performance |
| [plans/roadmap.md](../../plans/roadmap.md) | 3.A.4 Wave design spec; 3.4 First wave; 4.A.3 Wave sequence |

---

## Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Level / Encounter** | Approved | 2026-03-05 |
| **Combat Systems** | Approved | 2026-03-05 |
| **CEO** | Approved | 2026-03-05 |

---

## Gate

This document gates:
- **3.4** — First wave (WaveSpawner; 5–7 Scouts; V-formation; wave complete)
- **4.A.3** — Wave sequence design (3–5 waves; difficulty ramp; spacing)

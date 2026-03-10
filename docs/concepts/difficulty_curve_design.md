# Difficulty Curve Design

**Phase 9 · 9.A.2**

Maps difficulty labels (easy, medium, medium_hard, hard) to concrete parameters: enemy HP multiplier, spawn rate, between-wave delay, formation density. CEO says "medium-hard"; system applies the correct numbers. Gates 9.2 (WaveSpawner refactor) and level spec interpretation.

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Wave design spec** | [wave_design_spec.md](wave_design_spec.md) | CEO tuning 2026-03-05: formations loosened ~50%; stagger values |
| **Wave sequence design** | [wave_sequence_design.md](wave_sequence_design.md) | Between-wave delays 4.5s → 3s; difficulty ramp rationale |
| **Scout design lock** | [scout_design_lock.md](scout_design_lock.md) | Base Scout HP, defense, attack |

---

## 1. Difficulty Presets

| Preset | Label | Use case |
|--------|-------|----------|
| `easy` | Easy | Tutorial; first-time players; breather levels |
| `medium` | Medium | Default; Level 1 equivalent |
| `medium_hard` | Medium-Hard | Ramped Level 2; challenge without frustration |
| `hard` | Hard | Late-game; experienced players |

---

## 2. Parameter Mapping

### 2.1 Enemy HP Multiplier

Scales enemy max HP from base (Scout = 15 per scout_design_lock).

| Preset | HP Multiplier | Scout HP |
|--------|---------------|----------|
| easy | 0.75 | 11 |
| medium | 1.0 | 15 |
| medium_hard | 1.25 | 19 |
| hard | 1.5 | 23 |

**Formula:** `effectiveHP = baseHP × hpMultiplier`. Round to nearest integer.

### 2.2 Between-Wave Delay (Seconds)

Time after wave complete before next wave spawns. Lower = less recovery, higher pressure.

| Preset | Wave 1→2 | Wave 2→3 | Wave 3→4 | Wave 4+ |
|--------|----------|----------|----------|---------|
| easy | 6.0 | 5.0 | 4.5 | 4.0 |
| medium | 4.5 | 3.75 | 3.25 | 3.0 |
| medium_hard | 3.5 | 3.0 | 2.5 | 2.0 |
| hard | 2.5 | 2.0 | 1.5 | 1.0 |

**Override:** Level spec can override per-wave via `betweenWaveDelaySeconds` in each WaveConfig. If present, use spec value; else use preset table by wave index.

### 2.3 Stagger (Seconds Between Spawns)

Within-wave spawn stagger. Lower = faster spawn, more simultaneous threats.

| Preset | V | Staggered Wedge | Pincer |
|--------|---|-----------------|--------|
| easy | 0.8 | 0.7 | 0.8 |
| medium | 0.6 | 0.5 | 0.6 |
| medium_hard | 0.5 | 0.4 | 0.5 |
| hard | 0.4 | 0.35 | 0.4 |

**Override:** Level spec can override via `staggerSeconds` in WaveConfig.

### 2.4 Formation Spacing (Optional Future)

CEO tuning 2026-03-05 established baseline spacing. For hard, consider 10–15% tighter lateral/depth. Not in initial 9.2 scope; defer to Phase 12 if needed.

### 2.5 Boss HP Multiplier

| Preset | Boss HP Multiplier |
|--------|-------------------|
| easy | 0.75 |
| medium | 1.0 |
| medium_hard | 1.25 |
| hard | 1.5 |

**Override:** Level spec `boss.hp` overrides if present.

---

## 3. Implementation Lookup

```typescript
// Pseudocode
const DIFFICULTY_PARAMS = {
  easy: { hpMultiplier: 0.75, bossHpMultiplier: 0.75, betweenWaveDelays: [6, 5, 4.5, 4], stagger: { v: 0.8, staggered_wedge: 0.7, pincer: 0.8 } },
  medium: { hpMultiplier: 1.0, bossHpMultiplier: 1.0, betweenWaveDelays: [4.5, 3.75, 3.25, 3], stagger: { v: 0.6, staggered_wedge: 0.5, pincer: 0.6 } },
  medium_hard: { hpMultiplier: 1.25, bossHpMultiplier: 1.25, betweenWaveDelays: [3.5, 3, 2.5, 2], stagger: { v: 0.5, staggered_wedge: 0.4, pincer: 0.5 } },
  hard: { hpMultiplier: 1.5, bossHpMultiplier: 1.5, betweenWaveDelays: [2.5, 2, 1.5, 1], stagger: { v: 0.4, staggered_wedge: 0.35, pincer: 0.4 } },
};
```

Level spec provides `difficulty`; loader applies params. WaveConfig overrides take precedence when specified.

---

## 4. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Delta time:** All delay and stagger values are in seconds. Multiply by delta for frame-rate independence.
- **Pause:** Difficulty timers pause with game. No special handling beyond existing pause flow.

---

## 5. References

| Document | Purpose |
|----------|---------|
| [wave_design_spec.md](wave_design_spec.md) | Baseline stagger; formation spacing |
| [wave_sequence_design.md](wave_sequence_design.md) | Between-wave delay rationale |
| [scout_design_lock.md](scout_design_lock.md) | Base Scout stats |
| [level_spec_schema.md](level_spec_schema.md) | difficulty field; override behavior |

---

## Gate

This document gates:
- **9.2** — WaveSpawner applies difficulty params when loading from spec

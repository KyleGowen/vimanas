# Phase 3: Milestones 3.2, 3.3, 3.4

**Status:** Done (CEO approved 3.4 2026-03-05)  
**Depends on:** 3.1 (First enemy) — Done

## Milestones

| ID | Deliverable | Gate | How to verify |
|----|-------------|------|---------------|
| 3.2 | **Enemy projectiles** — EnemyProjectile prefab; Scout fires at player; damage formula per [enemy_projectile_design_lock](docs/concepts/enemy_projectile_design_lock.md); player takes damage | Player takes damage; formula verified | player takes damage; unit test |
| 3.3 | **Enemy pooling** — EnemyPool; prewarm Scouts; Get/Return on spawn/death; zero allocations during wave | 50+ enemies; no GC spikes | 50+ enemies; smooth. Unit test |
| 3.4 | **First wave** — WaveSpawner; 5–7 Scouts in V-formation per [wave_design_spec](docs/concepts/wave_design_spec.md); wave complete when all destroyed | 5–7 Scouts; V-formation; wave complete | wave spawns; destroy all → complete |

## Delivery Order

1. **3.2 + 3.3** — Parallel (both depend only on 3.1)
2. **3.4** — After 3.3 (depends on enemy pooling)

## Delegation

- **3.2, 3.3:** Full Stack Engineer (parallel subagents)
- **3.4:** Full Stack Engineer (after 3.3)

## Specs

- [enemy_projectile_design_lock.md](../docs/concepts/enemy_projectile_design_lock.md) — Scout Attack 192; 4 dmg/hit vs Sparrow; fire rate 0.4s; speed 180 px/s; lifetime 2s; orange/amber
- [wave_design_spec.md](../docs/concepts/wave_design_spec.md) — V (5 Scouts), Staggered Wedge (7), Pincer (6); stagger, spacing, between-wave delay
- [scout_design_lock.md](../docs/concepts/scout_design_lock.md) — Scout stats, formations

# Attack Pattern Reference

**Level / Encounter · Design System**

Canonical list of enemy squad attack patterns for the top-down shooter. CEO and level designers refer to patterns by **CEO name** in briefs and level specs. Player ship starts at bottom, faces north; enemies enter from top (south → north).

**Source:** Enemy squad flight path diagrams (three reference images). Legend:

| Symbol | Meaning |
|--------|--------|
| Dashed line | **Path** — general trajectory |
| Enemy ship icon (↓) | **Entry point** — where the wave appears |
| Solid arrow | **Movement** — direction of travel |
| Curved arrow (swoop) | **Swoop / turn** — change of direction |

---

## Pattern table

| # | CEO name | One-line description | Entry | Movement / behavior | Formation | Movement behavior |
|---|----------|----------------------|--------|---------------------|-----------|-------------------|
| 1 | **Wedge Assault** | Spread out, converge, focus fire at center | Top, horizontal line (5 ships) | Converge inward in V; each ship slows and turns toward center; focus fire at center | `v` | `straight` |
| 2 | **Scatter & Converge** | Spread out, then sweep back in toward player | Top, horizontal spread (5 ships) | Spread out, then wide curve sweep back in toward player | `staggered_wedge` | `scatter_converge` |
| 3 | **Crescent Swarm** | Center direct; sides peel off; outer loop around player | Top, horizontal line (5 ships) | Center ship direct; adjacent peel off to sides; outermost loop around player then attack | `v` | `straight` |
| 4 | **Zig-Zag Pressure** | Shift left/right in waves, repeat pattern | Top, horizontal line (5 ships) | Shift left/right in waves along vertical path; repeat pattern | `line` | `zig_zag` |
| 5 | **Pincer Assault** | Two squads upper-left/right, encircle from both sides | Top-left and top-right (2 squads, 3–4 each) | Wide arcs down and across; split and encircle player from both sides; converge | `pincer` | `pincer_swoop` |
| 6 | **Column Advance** | Narrow column straight down (option: lateral shift) | Top-center (4 ships) | Narrow vertical column; descend; fire straight down; variant: slight lateral shift then continue down | `v` | `straight` |
| 7 | **Side Winders** | Swoop in from left and right to flank | Top-left and top-right (3 each) | Sharp inward swoop from sides; flank player from left and right | `pincer` | `pincer_swoop` |
| 8 | **Wall of Fire** | Wide horizontal wall descending; outer units break off and re-engage | Top, full width (7 ships) | Wall formation descends; outermost units break off horizontally, then turn in to re-engage | `staggered_wedge` | `straight` |
| 9 | **Loops & Dives** | Wedge + diving loops / acrobatic dives | Top-center or top corners | Wide line converges and shoots across; or squads from corners perform diving loops and descend on player | `v` | `dive_arc` |
| 10 | **Dive Bombers** | Shallow or aggressive dive-bomb runs from sides | Top-left and top-right (3 each) | Shallow: wide arc down, gentle curve, dive; aggressive: steep dive, brief recovery, steep descent | `pincer` | `dive_arc` |
| 11 | **Sniper Attack** | Move in, stop and shoot from distance, then resume | Top-left and top-right (3 each) | Diagonal descent; stop and shoot from distance; then resume movement toward player | `pincer` | `sniper_pause` |
| 12 | **In & Out** | Swoop in toward center, sweep back out, repeat | Top-left and top-right (2 each) | Swoop in toward center; sweep back out toward corners; repeat pattern | `pincer` | `swoop_in_out` |
| 13 | **Burst Surge** | Center pair + left/right pairs; pause then flank from three directions | Top: center (2), top-left (2), top-right (2) | Center pair moves straight down; side pairs move inward, pause, then descend to flank; three-pronged attack | `pincer` | `straight` |
| 14 | **Arcing Barrage** | Curved flight paths + curved bullet spreads | Top-left and top-right, staggered rows (3 each) | Curved flight paths; fire curved bullet spreads while arcing | `pincer` | `pincer_swoop` |
| 15 | **Staggered Rushdown** | Staggered entry, then rush down together | Top-left and top-right (3 each) | Staggered descent; then rush down together toward player; repeat | `staggered_wedge` | `straight` |
| 16 | **Persistent Dive Bomb** | Staggered waves dive repeatedly; refill at top | Top, staggered waves (4+) | Dive down repeatedly toward player; refill at top; sustained harassment | `staggered_wedge` | `dive_arc` |

---

## Resolving CEO names to formation and movement

When a wave specifies an **attack pattern by name** (e.g. in level JSON or a CEO brief), the loader resolves **formation** (spawn layout) and the spawner resolves **movement behavior** (path). All 16 patterns above have both mappings. Unknown names resolve to formation `v` and behavior `straight`.

| CEO name | Formation | Movement behavior |
|----------|-----------|-------------------|
| Wedge Assault | `v` | `straight` |
| Scatter & Converge | `staggered_wedge` | `scatter_converge` |
| Crescent Swarm | `v` | `straight` |
| Zig-Zag Pressure | `line` | `zig_zag` |
| Pincer Assault | `pincer` | `pincer_swoop` |
| Column Advance | `v` | `straight` |
| Side Winders | `pincer` | `pincer_swoop` |
| Wall of Fire | `staggered_wedge` | `straight` |
| Loops & Dives | `v` | `dive_arc` |
| Dive Bombers | `pincer` | `dive_arc` |
| Sniper Attack | `pincer` | `sniper_pause` |
| In & Out | `pincer` | `swoop_in_out` |
| Burst Surge | `pincer` | `straight` |
| Arcing Barrage | `pincer` | `pincer_swoop` |
| Staggered Rushdown | `staggered_wedge` | `straight` |
| Persistent Dive Bomb | `staggered_wedge` | `dive_arc` |

Movement behaviors are implemented in `src/enemies/scout-movement.ts`; formation and behavior resolution in `src/levels/attack-pattern-resolver.ts`.

---

## References

- [wave_design_spec.md](../concepts/wave_design_spec.md) — Formation spacing, stagger, scout count
- [wave_sequence_design.md](../concepts/wave_sequence_design.md) — Level 1 wave sequence
- [scout_design_lock.md](../concepts/scout_design_lock.md) — Scout stats and formation spec
- [level_spec_schema.md](../concepts/level_spec_schema.md) — WaveConfig and optional `attackPattern` field

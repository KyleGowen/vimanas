# Boss Encounter Briefs — Level 1 & Level 2

**Level/Encounter Agent · 2025-03-02**

Design briefs for the first two level bosses. Intended for visual mock reference and encounter implementation. Aligns with [enemy_hierarchy_and_ship_notes.md](enemy_hierarchy_and_ship_notes.md) (Boss Tier 4), [game_bible.md](../../../game_bible.md), [narrative_bible.md](../../../narrative_bible.md), and reference set sophisticated_ref_1, 5, 7.

---

## Design Pillars (Boss Canon)

- **Insectoid, hive-mind aliens:** Biomechanical fusion—organic + mechanical.
- **Size:** Screen-filling or near; dominant presence.
- **Silhouette:** Multi-limbed, multi-segment; sophisticated, not generic.
- **Palette:** Dark brown, purple-grey, amber/orange for glowing cores.
- **Pattern philosophy:** R-Type/Gradius—memorization, positioning, pressure over chaos.
- **Core elements:** Phases, unique firing patterns, visible health bar.

---

## Level 1 Boss: "Hive Anchor" / Codename: **ROOT-SEEKER**

### Theme
Forest-organic. The boss reads as grown or emerged from the canopy—roots, vines, carapace, and chitin blend with bark and leaf-like plating.

### Silhouette Notes
- **Overall:** Horizontal sprawl rather than vertical tower. Suggests a massive insect resting on or emerging from the treetops.
- **Segments:** 3–4 major body segments (head, thorax, abdomen) with visible joints and organic plating.
- **Limbs:** 6–8 appendages—some leg-like (anchoring), some mandible-like (threatening), some tendril/vine-like (organic fusion). Asymmetric but readable.
- **Biomechanical cues:** Glowing amber/orange cores at limb joints and center mass; rib-like structures under carapace; vents that pulse with energy. Gears or conduits where organic meets mechanical.
- **Distinct read:** "Ancient predator that has burrowed into the forest." Not a ship—a creature integrated with the environment.

### Size / Dominance
- **Width:** Spans ~60–70% of play area horizontally.
- **Height:** ~40–50% of screen. Dominant but leaves room for player movement above and below.
- **Presence:** Anchored or drifting slowly; feels stationary compared to player. The arena comes to it.

### Phases

| Phase | HP Threshold | Behavior Summary | Firing Patterns |
|-------|--------------|------------------|-----------------|
| **Phase 1** | 100–66% | Settles in; establishes threat. Slow, telegraphed attacks. | **Spread:** 5-way amber projectiles from center core, slight arc. Predictable timing. **Sweep:** Single limb sweeps left-to-right or vice versa, emitting a slow amber beam; safe zone above or below. Players memorize the sweep direction. |
| **Phase 2** | 66–33% | Wakes up. More limbs active; pressure increases. | **Dual Sweep:** Two limbs alternate sweep (left limb, then right). **Pincer:** Mandible-like appendages fire 3-shot bursts in a narrow cone; telegraph before firing. **Root Spawn:** Vine-like tendrils release small amber orbs that drift downward—avoidable but add pressure. |
| **Phase 3** | 33–0% | Desperate. All limbs firing; core exposed, glowing brighter. | **Triple Spread:** 7-way spread from center. **Rapid Sweep:** Sweeps happen faster with shorter telegraph. **Orb Rain:** Multiple tendrils release orbs in staggered waves. **Core Pulse:** Central core pulses, emitting a ring of damage; safe near edges. Final phase rewards memorization of sweep order and ring timing. |

### Behavior Cues for Visual Mock
- Limb movement: slow, deliberate before attacks; limbs retract or extend based on phase.
- Glow: amber cores intensify as health drops; vents pulse in sync with firing.
- Environmental integration: tendrils or roots connect to background foliage; boss feels "rooted" in the forest.
- Damage state: carapace cracks, dark brown chips; glowing cores flicker on hit.

---

## Level 2 Boss: "Pipe Leviathan" / Codename: **CONDUIT-CRAWLER**

### Theme
Industrial, mechanized. Pipes, conduits, copper and bronze. The boss reads as a machine-creature that has fused with or emerged from the industrial infrastructure.

### Silhouette Notes (Distinct from Level 1)
- **Overall:** Vertical, tower-like. Reads as a walking/creeping machine-beast rising from a pipe cluster or duct.
- **Segments:** 4–5 stacked segments—like vertebrae or pipe sections. Each segment has mechanical detailing.
- **Limbs:** Piston-like arms, pipe-tendrils, rotating turret mounts. More mechanical than organic; visible rivets, valves, copper plating.
- **Biomechanical cues:** Purple-grey carapace with copper/bronze accents. Glowing orange cores at joints and turret eyes. Exposed conduits and tubing between segments. Vent stacks that release steam or energy.
- **Distinct read:** "Industrial parasite—half creature, half machine." Angular, mechanical; contrasts with Level 1's organic sprawl.

### Size / Dominance
- **Width:** ~40–50% of play area—narrower than Level 1, more vertical.
- **Height:** ~55–65% of screen. Tall, imposing; players maneuver around a central pillar.
- **Presence:** Slight sway or rotation; turrets track. Feels like a fortified position rather than a rooted predator.

### Phases

| Phase | HP Threshold | Behavior Summary | Firing Patterns |
|-------|--------------|------------------|-----------------|
| **Phase 1** | 100–66% | Turrets warm up. Methodical, positional. | **Turret Volley:** Two upper turrets alternate 3-shot bursts in straight lines; predictable lanes. **Pipe Spout:** Lower segment releases a slow-moving stream of copper-colored orbs in an arc; safe zone at top or sides. **Conduit Charge:** Visual telegraph (glow) before a single horizontal beam from mid-section; dodge vertically. |
| **Phase 2** | 66–33% | More turrets active. Pressure from multiple angles. | **Crossfire:** Four turrets fire in sequence (top-left, top-right, mid-left, mid-right); players read the order. **Sweep Beam:** Rotating turret sweeps a narrow beam in a 90° arc; memorization of sweep speed and direction. **Steam Burst:** Valves release burst of projectiles in a fan pattern; telegraph = valve glow. |
| **Phase 3** | 33–0% | Overload. All systems firing; core exposed. | **Full Volley:** All turrets fire in rapid succession. **Spiral Beam:** Central core emits a rotating beam (like a lighthouse); safe zones shift—pure positioning. **Pipe Cascade:** Multiple segments release orb streams; staggered timing creates overlapping danger zones. **Overload Pulse:** Core flashes; screen-wide warning before a brief, wide burst—safe in very narrow dead zones. Rewards precise positioning and phase knowledge. |

### Behavior Cues for Visual Mock
- Mechanical motion: pistons extend/retract; turrets rotate and lock before firing.
- Industrial detail: copper pipes, valve wheels, vent steam; rust and wear on older plating.
- Glow: orange cores in turret "eyes" and segment joints; intensity increases with phase.
- Damage state: pipes rupture, steam vents; plating dents and sparks; turrets may smoke or flicker.

---

## Contrast Summary

| Aspect | Level 1 (Root-Seeker) | Level 2 (Conduit-Crawler) |
|--------|------------------------|---------------------------|
| **Silhouette** | Horizontal sprawl, organic limbs, vine-like | Vertical tower, piston arms, turret mounts |
| **Theme** | Forest, roots, chitin, foliage integration | Industrial, pipes, copper, conduit fusion |
| **Movement** | Anchored, drifting, limb-based | Swaying pillar, rotating turrets |
| **Pattern feel** | Sweeps, spreads, orb rain | Turret volleys, beams, crossfire |
| **Pressure type** | Memorization of sweep order, ring timing | Positioning in crossfire, rotating beam safe zones |
| **Palette accent** | Amber cores, dark brown, organic greens | Amber cores, copper/bronze, purple-grey steel |

---

## References

- [enemy_hierarchy_and_ship_notes.md](enemy_hierarchy_and_ship_notes.md) — Boss Tier 4 spec
- [art_style_guide.md](../../../art_style_guide.md) — Enemy visuals, palette, sophistication
- [references/README.md](../../../references/README.md) — sophisticated_ref_1.png, sophisticated_ref_5.png, sophisticated_ref_7.png
- [agents/level_encounter.md](../../../../agents/level_encounter.md) — Level/Encounter agent scope

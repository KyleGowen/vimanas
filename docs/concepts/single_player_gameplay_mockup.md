# Single-Player Gameplay Mockup: Level 1 — Coastline Combat

**Visual Design + Level / Encounter · Proof of Concept · 2025-03-01**

### Canonical view (in-game combat)

*Single-player gameplay — Sparrow vs insectoid wave. (Image removed — unapproved concept art.)*  
*Top-down view: Sparrow ship engaging an enemy wave over ocean and coastline. Kaladesh-inspired (gilded, ornate)—match forest mock style. 1943/Aero Fighters = gameplay only.*

---

## Design Intent

This mockup shows **actual gameplay**—more detail than the level arena POC, which was environment-only. Here we see: the full level backdrop with parallax and terrain, the player ship (Sparrow) in combat, an enemy wave in formation, projectiles, and HUD elements. Every element must read instantly: who is friend, who is foe, where the play space is, and what the player can do.

**Perspective:** Strict **top-down (bird's eye) overhead** view throughout. Camera directly above the play field, looking straight down. Ships shown as top-down silhouettes (we see their tops, not sides). Terrain (ocean, coastline) viewed from above—map-like. Style: Forest mock (Kaladesh). 1943/Aero Fighters = gameplay only.

---

## Level Detail (Beyond Arena POC)

### Parallax Layers (4 layers, more specific)

| Layer | Content | Scroll Speed | Notes |
|-------|---------|--------------|-------|
| **Far** | Deep ocean texture, distant coastline silhouette, horizon haze | Slowest | Sets atmosphere; no gameplay impact |
| **Mid** | Coastline with earth brown (#4a3728), copper accents (#b87333), olive vegetation (#6b8e23) | Medium | Terrain split (water vs land) visible; forest mock style |
| **Near** | Wave crests, shoreline detail, small islands or rocks | Faster | Adds depth; no obstructions to flight path |
| **Play plane** | Clear sky/water area for ships | N/A | Uncluttered; ships read against ocean and sky |

### Terrain Features (Level 1 — Coastline)

- **Ocean:** Deep blue (#1a3a5c), textured with subtle wave patterns. Readable but not busy.
- **Landmass:** Coastline curves from left to right; earth brown base; Kaladesh gilded accents (#B5A642), copper (#B87333) at water's edge.
- **Vegetation:** Olive (#6b8e23) patches suggesting ancient forest or scrub; depth, not clutter.
- **Horizon:** Warm metallics (gold, copper) in haze; Kaladesh atmosphere.
- **Optional:** Distant temple or structure silhouette (ancient civilization); subtle, not distracting.

### Kaladesh Language (Level)

- **Kaladesh over steampunk:** Gilded accents (#B5A642), copper (#B87333), ornate filigree, Indian-inspired patterns. Temple silhouettes, jewel-like accents. NOT Victorian pipes/gears.
- No mechanical clutter in play area
- Period-appropriate warmth; contrasts with cool ocean

---

## Player Ship: Sparrow

- **Position:** Lower third of screen, center or slightly left—player's "home" zone
- **Facing:** Nose pointed upward (scroll direction)
- **Silhouette:** Bird-inspired, tapered nose, swept wings, compact. See [player_ship_sparrow_poc.md](p0_mocks/p0_1_ships/sparrow/player_ship_sparrow_poc.md)
- **Palette:** Cobalt (#0047AB), cyan (#00BFFF), silver (#C0C0C0)
- **Engine glow:** Cyan/white exhaust; visible, readable
- **Weapon:** Muzzle flash or projectile trail from nose; clear, bright

---

## Enemy Wave: Insectoid Formation

### Wave Composition (first wave, early level)

- **Count:** 5–7 small enemy ships
- **Formation:** V or staggered wedge; hive-mind, coordinated
- **Position:** Upper half of screen, descending toward player
- **Behavior read:** Approaching from above; threat direction clear

### Enemy Visual Design (Insectoid Scout)

- **Silhouette:** Insect-like—elongated body, wing-like appendages, angular. Reads as "alien" and "swarm" at a glance.
- **Less cartoony, more realism:** Sharp, angular forms—hard-edged exoskeleton, elongated bodies, mandible-like protrusions. Avoid bulbous or rounded shapes.
- **Palette (no overlap with Sparrow):** Amber (#FFBF00), olive-green (#6b8e23), dark brown (#3d2914). Warm, organic; contrasts with player's cool blue.
- **Size:** Slightly smaller than Sparrow; suggests weaker, swarm-type
- **Detail:** Carapace-like hull; segmented; no steampunk—alien, hive-mind aesthetic

### Enemy Projectiles

- **Color:** Amber or green; distinct from player cyan/white
- **Read:** Small, clear; direction of fire obvious

---

## Combat Framing

- **Player projectiles:** Cyan/white streaks; 2–3 visible in frame
- **Enemy projectiles:** Amber/green; 1–2 incoming
- **Explosions:** Small, punchy; one enemy destroyed (smoke, debris)
- **Action:** Mid-wave engagement—player has fired, one enemy down, others advancing

---

## HUD Elements

| Element | Position | Content |
|--------|----------|----------|
| **HP** | Bottom-left | Heart or bar; red/amber when damaged |
| **Mana** | Bottom-left, below HP | Bar or gauge; blue/cyan |
| **Score** | Top-left or top-right | Numeric; period-appropriate font |
| **Lives** | Top or bottom | Ship icons × remaining lives |
| **Weapon indicator** | Bottom-center or corner | Current gun type (optional) |

- **Style:** Clean, functional; 8/16-bit SNES era
- **Contrast:** Readable against ocean and terrain

---

## Composition (Layout)

```
┌─────────────────────────────────────────────────────────┐
│  Score: 1250                    Lives: ★★★             │
│                                                         │
│         [Enemy wave: 5–6 insectoid ships in V]          │
│         [Enemy projectiles: amber, descending]           │
│         [One explosion: smoke, debris]                   │
│                                                         │
│  [Far: ocean, coastline silhouette]                     │
│  [Mid: terrain split, vegetation]                       │
│  [Near: wave detail]                                    │
│                                                         │
│                    [Sparrow ship]                       │
│                    [Player projectiles: cyan, upward]    │
│                                                         │
│  HP: ████████  Mana: ████                               │
└─────────────────────────────────────────────────────────┘
```

---

## Palette Summary

| Use | Color | Hex |
|-----|-------|-----|
| Ocean | Deep blue | #1a3a5c |
| Land | Earth brown | #4a3728 |
| Coast | Copper | #b87333 |
| Vegetation | Olive | #6b8e23 |
| Player hull | Cobalt | #0047AB |
| Player accent | Cyan | #00BFFF |
| Player projectile | Cyan/white | #00FFFF |
| Enemy hull | Amber / olive-green | #FFBF00 / #6b8e23 |
| Enemy projectile | Amber | #FFBF00 |
| HUD | Silver, red (HP) | #C0C0C0, #8B0000 |

---

## Asset List (Mockup → Production)

| Asset | Format | Notes |
|-------|--------|-------|
| Level 1 parallax (far) | PNG | Ocean, horizon |
| Level 1 parallax (mid) | PNG | Coastline, terrain |
| Level 1 parallax (near) | PNG | Wave detail |
| Sparrow sprite | PNG | Combat pose |
| Sparrow projectile | PNG | 1–2 frames |
| Insectoid Scout sprite | PNG | 4–8 dir, formation |
| Insectoid projectile | PNG | 1 frame |
| Small explosion | PNG | 2–3 frames |
| HUD elements | PNG | HP, mana, score, lives |

---

## Sophistication Notes (per Art Style Guide)

The mockup should evolve toward **sophisticated 16-bit**—not plain. Apply:

- **Ships:** Shading, metallic textures, glowing engine exhaust and thrusters
- **Enemies:** Intricate detail, carapace texture, visible internal structures (glowing vents)
- **VFX:** Glowing projectiles with bright cores; starburst explosions; hit feedback on enemies
- **Background:** Layered parallax, atmospheric depth, varied terrain shades
- **Palette:** Vibrant action colors (cyan, orange, white) against subdued backgrounds

See [art_style_guide.md](../art_style_guide.md) and [references/README.md](../references/README.md) (sophisticated_ref_1–7).

---

## References

- **1943, Aero Fighters:** Gameplay reference only—terrain-based levels, ocean + land, top-down combat. [docs/references/](../references/)
- **Sophisticated 16-bit refs:** [docs/references/README.md](../references/README.md) — detailed sprites, dynamic VFX, layered backgrounds
- **Gradius, R-Type:** Clear stage layouts, readable backdrops, formation enemies
- **Sparrow POC:** [player_ship_sparrow_poc.md](p0_mocks/p0_1_ships/sparrow/player_ship_sparrow_poc.md)
- **Level Arena POC:** [level_arena_poc.md](level_arena_poc.md)

---

## Still true?

- [ ] Validate enemy palette against Sparrow (no overlap)
- [ ] Test HUD readability at 720p (Switch handheld)
- [ ] Review wave composition with Level/Encounter for difficulty tuning
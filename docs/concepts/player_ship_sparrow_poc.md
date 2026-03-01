# Player Ship POC: Sparrow (Fast Archetype)

**Visual Design Agent · Proof of Concept · 2025-03-01**

### Canonical design (starting point)

![Sparrow ship — blue v2](sparrow_ship_blue_v2.png)  
*Sparrow: strong bird inspiration, cobalt/cyan, organic curves. Sleek and nimble.*

### Earlier concepts (reference)

![Sparrow original](sparrow_ship_concept.png)  
*Original: brass/copper steampunk*

![Sparrow blue v1](sparrow_ship_blue_v1.png)  
*Blue v1: streamlined, blue/silver*

---

## Design Intent

The Sparrow is the fast ship—sleek, nimble, stylish. In a top-down shooter, every pixel must read instantly: players need to know at a glance who they're flying and what role they fill. The Sparrow says "speed" through silhouette, not text. It borrows from Gradius/R-Type's clarity: shape communicates behavior before the first shot is fired.

---

## Silhouette

- **Bird-inspired:** Tapered nose, swept wings, compact body. Think sparrow in flight—compact, aerodynamic, purposeful.
- **Top-down read:** From above, the ship reads as a narrow arrowhead with wing extensions. The nose points forward; the tail tapers. No ambiguity about facing.
- **Size:** Smallest of the four ships. Suggests agility. Fits 1–2 player sprites on screen without crowding.

---

## Steampunk Language (Sparrow)

- **Cobalt/cyan hull:** Primary hull in cool blue tones. Silver or pale blue accents on wing edges, engine cowlings.
- **Organic curves:** Bird-like silhouette; sleek, aerodynamic. Steampunk via structure (rivets, panels) not warm metallics.
- **Gears, pipes, vents:** Minimal—single exhaust, subtle detail. No clutter.
- **Rivets:** Slight edge definition where panels meet.

---

## Palette (8/16-bit SNES era)

| Use | Color | Notes |
|-----|-------|-------|
| Hull primary | Cobalt (#0047AB) | Cool blue, readable |
| Hull secondary | Cyan (#00BFFF) | Accents, wing edges |
| Trim | Silver (#C0C0C0) | Metallic highlights |
| Interior | Dark blue (#001F3F) | Cockpit, depth |
| Highlight | Pale blue (#87CEEB) | Edge highlights |
| Shadow | Navy (#000080) | Depth, underside |
| Engine glow | Cyan/white (#00FFFF) | Idle; brighter when firing |

Limited palette, high contrast. Clear in combat.

---

## Orthographic Views

### Top-down (primary gameplay view)

- **Nose:** Pointed, forward-facing
- **Wings:** Swept back, slight asymmetry acceptable for character
- **Engine:** Single or dual exhaust at rear; glow visible
- **Cockpit:** Small circular or oval window; dark interior for contrast

### Side (for profile art, UI)

- **Profile:** Low, flat. Wings extend slightly. Engine cowling visible.
- **Cabin:** Rounded dome or angular cockpit

---

## Animation Notes

- **Idle:** Subtle engine pulse (glow intensity)
- **Movement:** Minimal wing tilt on turn; slight pitch on acceleration
- **Fire:** Muzzle flash on weapon; engine glow brightens
- **Damage:** Brief flash to white/red; smoke particles

---

## VFX Hooks

- Projectile: clear, bright, readable
- Trail: light smoke or steam; not heavy
- Explosion: small, punchy; fits the ship's scale

---

## Asset List

| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Sparrow_sprite_sheet | PNG | 64×64 or 128×128 | Idle, 4–8 dir, damage |
| Sparrow_engine_glow | PNG | 16×16 | Sprite or particle |
| Sparrow_muzzle_flash | PNG | 8×8 | 2–3 frames |
| Sparrow_trail | PNG / particle | — | Light smoke |
| Sparrow_UI_icon | PNG | 32×32 | For HUD, ship select |

---

## Variant Roadmap (Turtle, Wolf, Dragon)

- **Turtle:** Bulkier silhouette, rounded shell-like hull, tank-like. Slower read.
- **Wolf:** Mid-size, balanced. Wolf snout/muzzle hint in nose. Neutral.
- **Dragon:** Largest, multiple gun mounts. Dragon head/neck silhouette. Aggressive.

---

## Sophistication (per Art Style Guide)

- **Shading:** Visible highlights and shadows for volumetric read
- **Glowing elements:** Engine exhaust (cyan/white), muzzle flash
- **Metallic texture:** Panel lines, rivets where appropriate
- See [art_style_guide.md](../art_style_guide.md) — Sprite Sophistication

---

## Still true?

- [ ] Review after first playable; adjust scale/contrast for readability
- [ ] Validate palette against enemy insectoid palette (no overlap)
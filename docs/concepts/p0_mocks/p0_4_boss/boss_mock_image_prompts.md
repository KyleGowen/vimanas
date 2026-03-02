# Boss Mock Image Prompts — AI Generation Reference

**Visual Design Agent · 2025-03-02**

**Iteration 2 (CEO feedback 2025-03-02):** Less illustrated, match locked-in level mocks; Mock 1 ship must be in front of boss.

**Iteration 3 (CEO feedback 2025-03-02):** Ships match our mocks (sparrow_ship_kaladesh.png, dragon_ship_kaladesh_v3.png); boss UI (Conduit-Crawler style from boss_mock_2_industrial.png) on BOTH images.

**Iteration 4 (CEO feedback 2025-03-02):** Root-Seeker mock only—same boss and player ship size ratio as Conduit-Crawler mock. Keep Conduit-Crawler mocks unchanged.

**Iteration 5 (CEO feedback 2025-03-02):** Root-Seeker—ship too large on screen. Make Sparrow smaller, more proportioned like Dragon in Conduit-Crawler mocks.

**Iteration 6 (CEO feedback 2025-03-02):** Increase resolution to 2560×1440.

**Iteration 7 (CEO feedback 2025-03-02):** Lock in Conduit-Crawler mocks (all three versions approved). Regenerate Root-Seeker only—ship must look like sparrow_ship_kaladesh.png AND be exactly the same size/proportion as Dragon in Conduit-Crawler mock.

---

Detailed prompts for generating `boss_mock_1_forest.png` and `boss_mock_2_industrial.png`. Use with AI image generators (Midjourney, DALL·E, Stable Diffusion). **Target: 2560×1440.** **View:** Strict top-down (bird's eye overhead). **Reference:** level_mock_2_forest.png, level_mock_3_industrial.png.

**Style constraint (match locked-in level mocks):** 16-bit game aesthetic—sophisticated 2D but NOT overly illustrated or painterly. Clean game art, sprite-influenced. Avoid Kaladesh "high-fidelity" that skews toward illustrated/painterly; level_mock_2_forest.png and level_mock_3_industrial.png are the locked-in style baseline.

**Avoid:** Corner frames or decorative circles. Airplanes, modern jets, or contemporary aircraft. Low-resolution, flat, or childish art.

---

## Prompt 1: boss_mock_1_forest.png

```
16-bit game aesthetic, sophisticated 2D sprite-influenced artwork, top-down bird's eye overhead view, video game boss fight scene. NOT overly illustrated or painterly—clean game art matching level_mock_2_forest.png style.

SIZE RATIO (critical—match Conduit-Crawler mock): Boss 4–5× taller and 3–4× wider than player ship. Boss dominates upper half. Player ship SMALL—compact, takes up minimal screen space, same proportion as Dragon in boss_mock_2_industrial.png. Ship clearly smaller than in typical mocks. Lower-middle, clearly in front.

COMPOSITION: Sparrow IN FRONT of boss—player ship in FOREGROUND (lower-middle, closer to viewer), boss in BACKGROUND/upper frame. Viewer looks past Sparrow toward the boss.

BOSS UI (top of frame, Conduit-Crawler style—same on both mocks): Top center "BOSS: ROOT-SEEKER" in white pixel font. Health bar below: red fill (remaining health), dark red outline, metallic copper-colored elaborate frame with decorative elements on sides. Below health bar: score/lives section "X00 000", gold-framed red X icon (lives), copper border, two small star icons.

BOSS: Root-Seeker (Hive Anchor)—insectoid biomechanical alien. Horizontal sprawl in background/upper frame. 3–4 major body segments (head, thorax, abdomen) with visible joints and organic plating. 6–8 appendages: leg-like anchoring limbs, mandible-like threatening arms, vine-like or tendril-like organic appendages. Asymmetric but readable silhouette. Dark brown carapace with chitin texture. Glowing amber and orange cores at limb joints and center mass. Rib-like structures under carapace. Vents that pulse with energy. Gears or conduits where organic meets mechanical. Ancient predator that has burrowed into the forest—roots and vines connect boss to background. Boss significantly larger than player ship (4–5× taller, 3–4× wider). Dominates upper half of play area. 

PLAYER SHIP (foreground): Sparrow—MUST look like sparrow_ship_kaladesh.png: bird-inspired, cyan/cobalt hull, gold/bronze filigree on wings and body, glowing light-blue circular core, swept wings, aether blue energy trails from thrusters. Top-down adaptation preserves these design elements. Avian silhouette, compact, tapered nose. EXACT SAME size on screen as Dragon in boss_mock_2_industrial.png—reference that mock for ship scale. Ship is a small detail, boss dominates. Engaged in combat. Lower-middle, in front of boss.

ENVIRONMENT: Forest canopy from above. Dense foliage, varied greens (#2d6a2d, #6b8e23, #8fbc8f), earth brown. Tree crown tops, circular canopy shapes. Kaladesh-inspired—gilded temple or structure tops visible, ornate garden paths, jewel accents. Rich, intricate detail. NOT steampunk.

VFX HINTS: Amber projectiles or beams from boss core. Slow amber beam sweep from limb. Amber orbs drifting. Glowing energy cores. Combat energy, readable projectiles.

STYLE: 16-bit game aesthetic. Sophisticated 2D but NOT overly illustrated or painterly. Clean game art, sprite-influenced. Match level_mock_2_forest.png—gilded accents, Indian-inspired fantasy, crisp rendering. Bright, optimistic. Layered depth. No corner frames. No airplanes. 2560x1440 resolution, 16:9 aspect ratio.
```

---

## Prompt 2: boss_mock_2_industrial.png

```
16-bit game aesthetic, sophisticated 2D sprite-influenced artwork, top-down bird's eye overhead view, video game boss fight scene. NOT overly illustrated or painterly—clean game art matching level_mock_3_industrial.png style.

BOSS UI (top of frame, Conduit-Crawler style—same on both mocks): Top center "BOSS: CONDUIT-CRAWLER" in white pixel font. Health bar below: red fill (remaining health), dark red outline, metallic copper-colored elaborate frame with decorative elements on sides. Below health bar: score/lives section "X00 000", gold-framed red X icon (lives), copper border, two small star icons.

BOSS: Conduit-Crawler (Pipe Leviathan)—insectoid biomechanical alien. Vertical, tower-like. 4–5 stacked segments like vertebrae or pipe sections. Piston-like arms, pipe-tendrils, rotating turret mounts. More mechanical than organic. Purple-grey carapace with copper and bronze accents. Glowing orange cores at joints and turret eyes. Exposed conduits and tubing between segments. Vent stacks releasing steam or energy. Rivets, valves, copper plating visible. Industrial parasite—half creature, half machine. Tall, imposing pillar. Boss 40–50% width, 55–65% height of play area.

PLAYER SHIP: Dragon—match dragon_ship_kaladesh_v3.png. Compact fighter, multiple weapon ports on wings, dark red hull (#8B0000) per enemy_hierarchy, copper/bronze accents, cyan/cobalt energy from core and thrusters. Same scale as Sparrow—compact, NOT airliner. Engaged in combat, positioned to one side.

ENVIRONMENT: Industrial area from above. Grey pipes (#4a4a4a), conduits, machinery tops. Copper (#B87333), brass, gold accents (#B5A642). Dense industrial background. Kaladesh-inspired ornate accents on rooftops. Indian-inspired mechanical aesthetic. Temple-like structures. Architecture only—no vehicles. Rich detail.

VFX HINTS: Turret volleys (straight-line bursts). Copper-colored orbs in arc. Horizontal beam from mid-section. Steam bursts from valves. Glowing orange cores. Combat energy, readable projectiles.

STYLE: 16-bit game aesthetic. Sophisticated 2D but NOT overly illustrated or painterly. Clean game art, sprite-influenced. Match level_mock_3_industrial.png—ornate mechanical, Indian-inspired fantasy, crisp rendering. Bright, optimistic. Layered depth. No corner frames. No airplanes. 2560x1440 resolution, 16:9 aspect ratio.
```

---

## Negative Prompts (append if supported)

```
--no corner frames, no decorative circles, no airplanes, no modern jets, no low-resolution, no flat art, no cartoonish, no childish, no Victorian steampunk pipes, no painterly, no overly illustrated
```

---

## Reference Checklist

| Element | Mock 1 (Forest) | Mock 2 (Industrial) |
|---------|-----------------|---------------------|
| Boss UI | "BOSS: ROOT-SEEKER", copper health bar, score/lives | "BOSS: CONDUIT-CRAWLER", copper health bar, score/lives |
| Boss | Root-Seeker, horizontal sprawl, organic limbs | Conduit-Crawler, vertical tower, turret mounts |
| Player ship | Sparrow—sparrow_ship_kaladesh (cyan/cobalt, gold filigree, aether blue core/trails) | Dragon—dragon_ship_kaladesh_v3 (dark red, multi-gun, copper/bronze, cyan energy) |
| Environment | Forest canopy, varied greens, gilded temple tops | Grey pipes, copper, brass, conduits |
| Boss palette | Dark brown, amber cores | Purple-grey, copper, orange cores |
| VFX hints | Amber beams, spread, orbs | Turret volleys, beams, copper orbs |

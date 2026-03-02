# Title Screen Mock Image Prompts — AI Generation Reference

**Visual Design Agent · 2025-03-02**

Detailed prompts for generating `title_screen_mock.png`. Use with AI image generators (Midjourney, DALL·E, Stable Diffusion). **Target: 2560×1440.** **View:** Cinematic front-facing (horizon view). **Reference:** level_mock_2_forest.png, level_mock_4_sky.png, boss_mock_image_prompts.md, title_screen_concept.md.

**Iteration 2 (CEO feedback 2025-03-02):** Illustrated, sleek style—high-fidelity 2D, NOT pixel art. **Hero asset:** One of each ship silhouette (Sparrow, Turtle, Wolf, Dragon)—four distinct ships, NOT four Sparrows. Each with signature effects (engine glow, aether trails).

**Iteration 3 (CEO feedback 2025-03-02):** (a) KEEP illustrated style. (b) **CRITICAL:** Ship shapes MUST match the canonical mock ship images EXACTLY—reference and copy silhouettes from: sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png. Do NOT invent or approximate ship shapes. (c) Composition: First-iteration layout—full-frame layered sky/clouds (twilight or dawn), distant temples on horizon. VIMANAS hero title centered, large. Ships positioned below or flanking the title—cohesive fleet element, not scattered. PRESS START • 1–4 PLAYERS below the ships. Clean, balanced layout. Title dominant. Ships read as "our heroes" fleet.

**Iteration 4 (CEO feedback 2025-03-02):** (a) **Setting sun on horizon, backlit** — sun low on horizon, ships cast in silhouette (dark against bright sky). Dramatic silhouette treatment. (b) **Ships further away** — pull back, ships smaller/more distant in frame. (c) **More dynamic** — ships in motion, action pose, energetic composition. (d) **Other airships around** — additional airships in the scene (background, sky), not just the four player ships. Fleet/patrol atmosphere. KEEP ship shapes (Sparrow, Turtle, Wolf, Dragon) and illustrated style.

**Iteration 5 (CEO feedback 2025-03-02):** (a) **Title is ONLY "VIMANAS"** — no "HERO", no subtitle, no extra words. The title treatment shows only the word "VIMANAS"—nothing else. (b) **CRITICAL: Ship shapes must match mock images exactly** — use reference_image_paths: sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png. COPY the exact silhouettes from these images—do NOT invent or approximate. KEEP style and composition (setting sun, silhouette, further away, dynamic, other airships).

**Iteration 6 (CEO feedback 2025-03-02):** **ALL ships must be PURE SILHOUETTES—solid dark shapes only.** NO full-color ships. NO metallic detail on ships. NO glowing elements on ships. Reference images = shape only; render every ship as a solid dark silhouette. Remove any full-color or detailed ship sprites—the four player ships AND background airships must be pure black/dark shapes against the bright sky.

**Iteration 7 (CEO feedback 2025-03-02):** (a) **All four player ships face RIGHT**—same direction, flying right. No ships facing left. (b) **Ships SMALLER**—reduce size so more background (sky, cityscape, horizon) is visible.

**Iteration 8 (CEO feedback 2025-03-02):** **Glow applied to main mock** — Main mock (`title_screen_mock.png`) now includes propulsion glow effects. Ships remain dark silhouettes but each has distinct colored engine trails/glow behind them: Sparrow=cyan (#00FFFF), Turtle=amber (#FFBF00), Wolf=white/silver, Dragon=orange/red (#FF4500). Composition unchanged (smaller ships, all facing right, layered sky, cityscape, VIMANAS title, PRESS START).

**Iteration 9 (CEO feedback 2025-03-02):** (a) **Ships at middle depth** — Push ships back to the middle depth of buildings. Ships should be at/around the same depth as the cityscape buildings—not in the foreground sky. They fly among or just above the building silhouettes. (b) **Glow on various ship parts** — Like in title_screen_mock_dynamic.png: glow on wings, accents, energy cores, vents—not just engine trails. Glow on multiple parts of each ship to show propulsion and aether energy.

**Iteration 10 (CEO feedback 2025-03-02):** **Locked in.** Reference composition (ships in sky above cityscape) + glow effects (wings, accents, energy cores, vents, engine trails). CEO approved 2025-03-02.

**Style constraint:** Illustrated, sleek—high-fidelity 2D illustrated style, NOT pixel art, NOT 16-bit. Kaladesh aesthetic (gilded, ornate, Indian fantasy). Avoid Victorian steampunk pipes and gears as primary. See [sparrow sprite sheet spec](../p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md).

**Avoid:** Corner frames, decorative circles. Airplanes, modern jets, contemporary aircraft. Low-resolution, flat, or childish art. Painterly brushwork, watercolor look. Four identical ships (must have four distinct silhouettes).

---

## Palette (locked)

| Element | Color | Hex |
|---------|-------|-----|
| Brass (title) | Warm brass | #B5A642 |
| Copper (title, accents) | Copper | #B87333 |
| Accents | Cobalt/cyan (Sparrow) | #0047AB, #00BFFF |
| Sky/slate | Dark slate | #2F4F4F, #36454F |
| Clouds warm | Amber, copper | — |
| Clouds cool | Slate grey | — |

---

## Prompt: title_screen_mock.png

**Reference images (in order):** title_screen_mock_reference.png (primary composition), title_screen_mock_dynamic.png (glow placement), sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png.

```
Illustrated, sleek video game title screen. High-fidelity 2D illustrated style—NOT pixel art, NOT 16-bit. Kaladesh-inspired aesthetic (gilded, ornate, Indian fantasy). Cinematic horizon composition, 16:9.

BACKGROUND: Setting sun low on horizon—dramatic backlight. Layered sky with intense warm glow at horizon (amber, gold, copper #B87333) fading to deeper slate sky above. Multiple cloud layers. Distant silhouette of ancient Kaladesh-style temple domes and cityscape on horizon. **Ships in sky above cityscape**—positioned in the sky layer, above the cityscape (NOT at building depth). Use title_screen_mock_reference.png for exact composition. Atmospheric depth, parallax-ready layers. NO Victorian steampunk. Indian-inspired ornate architecture silhouettes. Hopeful, epic atmosphere.

TITLE: "VIMANAS" ONLY—large, bold, centered. NO other text. No "HERO", no subtitle, no extra words. Just the word "VIMANAS". Brass (#B5A642) and copper (#B87333) metallic gradient. Engraved or embossed treatment. Subtle metallic highlights and depth. Ornate letterforms—optional subtle filigree or wing motif. Readable, impactful. NOT plain sans-serif.

SHIPS (CRITICAL): ALL ships must be PURE SILHOUETTES—solid dark shapes only. NO full-color ships. NO metallic detail on ships. Reference images (sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png) = SHAPE only—use them to get the silhouette outline, but render every ship as a solid dark silhouette. Four ship silhouettes—COPY the EXACT shapes from reference images. **All four player ships face RIGHT**—same direction, flying right. **Ships SMALLER**—reduce scale so more of the layered sky, cityscape, and horizon are visible. **Dynamic**—ships in motion, action pose, energetic composition. **Cast in silhouette**—backlit by setting sun, dark against bright sky. **Distinct propulsion glow**—each ship has colored energy glow on **multiple parts**: wings, accents, energy cores, vents—not just engine trails. Reference title_screen_mock_dynamic.png for glow placement. Glow does NOT fill the ships—ships stay silhouettes. Glow colors: Sparrow=cyan (#00FFFF), Turtle=amber (#FFBF00), Wolf=white/silver, Dragon=orange/red (#FF4500). Engine exhaust, trails, wing edges, vents, and cores show propulsion and aether energy. **Other airships in scene**—additional airships in background/sky, fleet/patrol atmosphere; ALL must be solid dark silhouettes (no glow on background ships). Four player ships plus supporting fleet. Top-down or adapted view—must match reference shapes. If any ship appears in full color or with metallic detail, it is wrong—remove it.

PROMPT LINE: "PRESS START • 1–4 PLAYERS" in smaller text below the ships. Copper or brass-colored. Clean, readable typography. Centered.

OPTIONAL: Very subtle insectoid or alien shapes in distant clouds or horizon—threat implied, not explicit. Organic angular forms. Do not dominate.

TONE: Epic but achievable. Hopeful defiance. Cooperative. Bright, optimistic. Ancient civilization under siege—defenders ready. Kaladesh aesthetic throughout—gilded, ornate, Indian fantasy. NOT grimdark.

STYLE: Illustrated, sleek. High-fidelity 2D. NOT pixel art, NOT 16-bit. No corner frames. No airplanes. No four identical ships—must show four visibly distinct ship silhouettes. 2560x1440 resolution, 16:9 aspect ratio.
```

---

## Variant Prompt: Dynamic + Propulsion Glow

**Output:** `title_screen_mock_dynamic.png`  
**Reference:** Same composition as base prompt. Use [title_screen_mock_reference.png](title_screen_mock_reference.png) for layout. Use ship reference images for shapes: sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png.

**Differences from base prompt:**
- **(a) More dynamic** — Ships flying with more energy: banking, diving, climbing, varied angles. More action, more motion. Energetic composition.
- **(b) Distinct propulsion glow** — Each ship has a colored energy glow from engines/trails (around/behind the ships). Ships stay as silhouettes—glow does NOT fill the ships. Glow emanates from engine exhaust and trails.
  - **Sparrow:** Cyan/blue (#00FFFF) — aether glow, sleek
  - **Turtle:** Amber/gold (#FFBF00) — warm, earthy, slower exhaust
  - **Wolf:** Silver/white or soft blue — neutral, balanced
  - **Dragon:** Orange/red (#FF4500) — firepower, aggressive

```
Illustrated, sleek video game title screen. High-fidelity 2D illustrated style—NOT pixel art, NOT 16-bit. Kaladesh-inspired aesthetic (gilded, ornate, Indian fantasy). Cinematic horizon composition, 16:9.

BACKGROUND: Setting sun low on horizon—dramatic backlight. Layered sky with intense warm glow at horizon (amber, gold, copper #B87333) fading to deeper slate sky above. Multiple cloud layers. Distant silhouette of ancient Kaladesh-style temple domes on horizon. Atmospheric depth, parallax-ready layers. NO Victorian steampunk. Indian-inspired ornate architecture silhouettes. Hopeful, epic atmosphere.

TITLE: "VIMANAS" ONLY—large, bold, centered. NO other text. Brass (#B5A642) and copper (#B87333) metallic gradient. Engraved or embossed treatment. Ornate letterforms. Readable, impactful.

SHIPS (CRITICAL): Four distinct ship silhouettes—COPY exact shapes from reference images (sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png). Ships are SOLID DARK SILHOUETTES—dark shapes against bright sky. **More dynamic**—banking, diving, climbing, varied angles; energetic, action-packed flight. **All four face RIGHT**—same direction, flying right. **Ships SMALLER**—reduce scale so more sky, cityscape, horizon visible. **Distinct propulsion glow**—each ship has colored energy glow from engines/trails AROUND and BEHIND the ship. Glow does NOT fill the ships—ships stay silhouettes. Glow colors: Sparrow = cyan/blue (#00FFFF), Turtle = amber/gold (#FFBF00), Wolf = silver/white or soft blue, Dragon = orange/red (#FF4500). Engine exhaust and trails show propulsion. Optional: other airships in background as silhouettes (no glow).

PROMPT LINE: "PRESS START • 1–4 PLAYERS" below ships. Copper or brass. Clean typography. Centered.

TONE: Epic but achievable. Hopeful defiance. Cooperative. Illustrated style throughout. 2560x1440, 16:9.
```

---

## Negative Prompts (append if supported)

```
--no corner frames, no decorative circles, no airplanes, no modern jets, no low-resolution, no flat art, no cartoonish, no childish, no Victorian steampunk pipes, no painterly, no overly illustrated, no watercolor, no blurry, no four identical ships, no full-color ships, no detailed ship sprites, no metallic ships in foreground
```

---

## Reference Checklist

| Element | Specification |
|---------|---------------|
| Title | VIMANAS ONLY—brass/copper metallic, engraved/embossed. No other text (no HERO, no subtitle) |
| Background | Setting sun on horizon, backlit; layered sky, intense warm glow at horizon |
| Horizon | Distant Kaladesh temple silhouettes; sun low, dramatic silhouette lighting |
| Ships | Four distinct ship silhouettes (Sparrow, Turtle, Wolf, Dragon)—COPY exact shapes from reference images; PURE silhouettes (solid dark shapes, NO color/metallic); **in sky above cityscape** (ref: title_screen_mock_reference.png—NOT at building depth); **glow on wings, accents, cores, vents** (ref: title_screen_mock_dynamic.png); Sparrow=cyan, Turtle=amber, Wolf=white/silver, Dragon=orange/red; ALL four face RIGHT; SMALLER in frame; in motion, dynamic; cast in silhouette; other airships in scene—ALL as silhouettes (no glow) |
| Prompt line | PRESS START • 1–4 PLAYERS |
| Optional | Subtle insectoid shapes in clouds/horizon |
| Palette | Brass #B5A642, copper #B87333, cobalt/cyan accents, dark slate—limited palette |
| Style | Illustrated, sleek—high-fidelity 2D, NOT pixel art, NOT 16-bit |
| Tone | Epic, hopeful defiance, cooperative |

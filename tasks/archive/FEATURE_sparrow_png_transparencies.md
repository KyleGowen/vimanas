# Feature: Incorporate New Sparrow PNG Transparencies

**Status:** In progress  
**Specialist:** Unity Gameplay Engineer  
**Requested:** CEO (2025-03-03)

---

## Objective

Integrate the CEO's updated Sparrow PNG sprites (with proper transparency) into the game. Ensure Unity imports them correctly and the SparrowShip displays them with transparency in gameplay.

---

## Context

- **Source sprites:** `Assets/Content/Sprites/Sparrow/` — sparrow_idle, sparrow_facing_*, sparrow_boost, sparrow_firing, sparrow_hit_flash, sparrow_damage
- **Prefab:** SparrowShip.prefab uses SparrowSpriteController with _idleSprite, _boostSprite, _firingSprite
- **Current:** Prefab references sparrow_facing_n for idle; spec (PHASE2_2_1) says use sparrow_idle.png
- **Resources fallback:** `Assets/Resources/Sprites/Sparrow/` has sparrow_facing_n, sparrow_boost, sparrow_firing for runtime fallback when serialized refs fail
- **Learnings:** unity_learnings.md — textureType: 8, spriteMode: 1, alphaIsTransparency: 1 required for Resources.Load<Sprite>; macOS SpriteRenderer workaround via GameplayUIController mirror

---

## Deliverables

1. **Import settings:** Verify all Sparrow .meta files have `alphaIsTransparency: 1`, `textureType: 8`, `spriteMode: 1` so transparency is preserved
2. **Prefab wiring:** SparrowShip prefab uses sparrow_idle for idle (per spec); sparrow_boost, sparrow_firing for boost/fire
3. **Resources sync:** Copy sparrow_idle.png to Resources/Sprites/Sparrow/ and ensure its .meta has correct sprite import; update SparrowSpriteController fallback to use sparrow_idle when _idleSprite is null
4. **Verification:** Ship displays with transparent background in Gameplay scene; no cyan squares or opaque backgrounds

---

## Reference

- [sparrow_sprite_sheet_spec.md](../docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md)
- [PHASE2_2_1_SINGLE_SHIP_PREFAB.md](PHASE2_2_1_SINGLE_SHIP_PREFAB.md)
- [unity_learnings.md](../docs/dev_standards/unity_learnings.md)

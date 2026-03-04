# Sparrow Individual Sprites

**Source:** [sparrow_sprite_sheet.png](../../../docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet.png)  
**Spec:** [sparrow_sprite_sheet_spec.md](../../../docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md)

Individual sprite assets extracted from the Sparrow sprite sheet. Each cell is 512×512 px (source sheet is 2048×2048).

## Action Poses

| File | Pose | Use |
|------|------|-----|
| sparrow_flying_forward.png | Flying forward | Base movement, default state |
| sparrow_bank_left.png | Banking left | Turn-left animation |
| sparrow_bank_right.png | Banking right | Turn-right animation |
| sparrow_boost.png | Boosting | Speed boost / dash |
| sparrow_idle.png | Idle | Parked, menu, spawn |
| sparrow_firing.png | Firing | Weapon fire (blend with base) |
| sparrow_damage.png | Damage | Hit reaction (1–3 frame hold) |
| sparrow_hit_flash.png | Hit flash | Impact flash (1 frame) |

## 8-Direction Facings

| File | Facing | Use |
|------|--------|-----|
| sparrow_facing_n.png | North (0°) | Facing up |
| sparrow_facing_ne.png | Northeast (45°) | Facing up-right |
| sparrow_facing_e.png | East (90°) | Facing right |
| sparrow_facing_se.png | Southeast (135°) | Facing down-right |
| sparrow_facing_s.png | South (180°) | Facing down |
| sparrow_facing_sw.png | Southwest (225°) | Facing down-left |
| sparrow_facing_w.png | West (270°) | Facing left |
| sparrow_facing_nw.png | Northwest (315°) | Facing up-left |

## Unity Import

Place in `Assets/Content/Sprites/Ships/`. Unity will generate .meta files. For SpriteRenderer, assign `sparrow_facing_n` as default; use others for animation or runtime swap.

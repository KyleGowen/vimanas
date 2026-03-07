# Phase 2.1: Single Ship Prefab (Sparrow)

**Status:** Gate passed — awaiting CEO verification  
**Specialist:** Unity Gameplay Engineer  
**Depends on:** 2.A.1 (Sparrow design lock), 2.A.2 (Sparrow sprite sheet) — both Done

---

## Objective

Deliver SparrowShip prefab in Gameplay scene with approved sprite, top-down orientation, and wired components. Gate: Ship visible; collider; top-down; uses approved sprite; fires on Space.

---

## Deliverable Requirements

| Requirement | Spec |
|-------------|------|
| **Prefab** | SparrowShip prefab in Gameplay scene |
| **Sprite** | SpriteRenderer uses approved sprite (sparrow_facing_n north-facing) from `Assets/Content/Sprites/Sparrow/` (2.A.2) |
| **Orientation** | Top-down, facing north (up = forward) |
| **Components** | Collider2D, Rigidbody2D, PlayerShipController, PlayerWeapon wired |
| **Reference** | Per [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) |

---

## Current State

- SparrowShip prefab exists at `Assets/Content/Prefabs/SparrowShip.prefab`
- Gameplay scene has SparrowShip instance (direct scene object, not prefab instance)
- SpriteRenderer uses `sparrow_facing_n.png` (north-facing); SparrowSpriteController: idle=sparrow_facing_n, boost=sparrow_boost, firing=sparrow_firing
- Approved sprites in `Assets/Content/Sprites/Sparrow/` with correct .meta (textureType: 8, spriteMode: 1)
- PlayerShipController, PlayerWeapon, SparrowSpriteController, ProjectilePool wired

---

## Gate Criteria

- [x] Ship visible in scene
- [x] Collider present
- [x] Top-down orientation (facing north)
- [x] Uses approved sprite (sparrow_idle.png)
- [x] Fires on Space

---

## Learnings to Check

- [docs/dev_standards/unity_learnings.md](docs/dev_standards/unity_learnings.md) — Fire (Space) not working; macOS rendering; m_TargetEye; InputSystemUIInputModule

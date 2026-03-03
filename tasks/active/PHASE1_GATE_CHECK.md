# Phase 1: Foundation — Gate Verification

**Date:** 2025-03-03  
**Director:** Gate check at each incremental milestone.

---

## Milestone 1.1: Unity Project Init

**Gate:** Open in Unity 6; build succeeds

### Code Verification ✓
- `ProjectVersion.txt`: Unity 6000.0.31f1 (Unity 6)
- `EditorBuildSettings.asset`: Boot (0), MainMenu (1), Gameplay (2) in build order; **MainMenu enabled: 1** (was 0—fix applied 2025-03-03)
- Project structure: Assets/Core, Gameplay, UI, Resources

### Fix applied (2025-03-03)
MainMenu was disabled in EditorBuildSettings; LoadScene(1) failed in standalone build. Fixed: MainMenu `enabled: 1`, GUID corrected to match `MainMenu.unity.meta`.

### Manual Gate Check (you run)
1. Open project in Unity Hub → Add → `/Users/kyle/vimanas`
2. Ensure Unity 6 (6000.0.x) is selected
3. Open project
4. **File → Build Settings** → Verify Boot, MainMenu, Gameplay are in Scenes In Build (MainMenu must be checked)
5. Delete existing build folder (if any) to avoid stale artifacts
6. Build (Ctrl/Cmd+B)

**Pass criteria:** Project opens without errors; build completes. (Boot → MainMenu is 1.2's gate.)

---

## Milestone 1.2: Boot Scene

**Gate:** Boot → MainMenu transition

### Code Verification ✓
- `Boot.unity`: BootLoader GameObject with `BootLoader.cs`; serializes `_delayBeforeTransition`, `_mainMenuBuildIndex`
- `BootLoader.cs`: After ~1.5s delay, `SceneManager.LoadScene(_mainMenuBuildIndex)` (build index 1 = MainMenu)
- Build index preferred over scene name for standalone reliability (per tech_architecture)

### Manual Gate Check (you run)
1. Press Play in Unity
2. Boot scene loads (brief splash/camera)
3. After ~1.5 seconds → MainMenu loads (New Game button visible)

**Pass criteria:** Boot runs; MainMenu appears without manual scene switch.

---

## Milestone 1.3: MainMenu

**Gate:** New Game → Gameplay

### Code Verification ✓
- `MainMenu.unity`: MainMenuController with `MainMenuController.cs`
- `MainMenuController.cs`: `OnNewGameClicked()` → `SceneManager.LoadScene(_gameplayBuildIndex)` — **build index 2**, not scene name (per unity_learnings.md)
- Creates Canvas, New Game button, EventSystem at runtime
- Gameplay Main Camera: `m_TargetEye: 0` (macOS rendering fix)
- SparrowShip: PlayerShipController + PlayerWeapon; InputService loads VimanasInputActions from Resources
- ProjectilePool, WaveSpawner: null-safe; won't crash if prefabs missing

### Manual Gate Check (you run)
1. From MainMenu (after Boot or direct scene load)
2. Click **New Game** button (or navigate with keyboard/controller if supported)
3. Gameplay scene loads (ship visible, can move)

**Pass criteria:** New Game loads Gameplay; ship appears and is controllable.

---

## Milestone 1.4: Input System

**Gate:** WASD/controller + fire

### Code Verification ✓
- `VimanasInputActions.inputactions`: Gameplay map
  - **Move:** WASD composite + `<Gamepad>/leftStick`
  - **Fire:** `<Keyboard>/space` + `<Gamepad>/buttonSouth`
- `InputService.cs`: Loads from Resources, enables Gameplay map
- `PlayerShipController.cs`: Uses `InputService.Move`
- `PlayerWeapon.cs`: Uses `InputService.FirePressed`
- Gameplay scene: InputService, SparrowShip with PlayerShipController + PlayerWeapon

### Manual Gate Check (you run)
1. In Gameplay (after New Game)
2. **WASD:** Ship moves in 4 directions
3. **Space:** Projectiles fire
4. **Controller (if connected):** Left stick moves; A/Cross fires

**Pass criteria:** Movement and fire work via keyboard and gamepad.

**CEO feedback (2025-03-03):** WASD works; Space does NOT fire. **Fix applied:** InputSystemUIInputModule + muzzle flash. **CEO verified (2025-03-03):** Fire works.

---

## Summary

| Milestone | Code OK | Manual Gate |
|-----------|---------|-------------|
| 1.1 Unity project init | ✓ | ✓ 2025-03-03 |
| 1.2 Boot scene | ✓ | ✓ 2025-03-03 (CEO) |
| 1.3 MainMenu | ✓ | ✓ 2025-03-03 (CEO) |
| 1.4 Input system | ✓ | ✓ 2025-03-03 (CEO) |

**Phase 1 complete:** All gates passed 2025-03-03. Roadmap updated.

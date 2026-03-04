# Unity Learnings

**Status:** Active  
**Audience:** Unity Gameplay Engineer, Platform/Release  
**Source:** Phase 1 implementation (2025-03-03)

---

## Scene Loading

### Build index vs scene name

- **Use build index** (`SceneManager.LoadScene(int)`) for standalone builds. Scene name loading can fail if scenes are stripped or build order changes.
- **Serialization:** If BootLoader (or similar) uses `_mainMenuBuildIndex`, ensure Boot.unity serializes that field—not orphaned fields like `_mainMenuSceneName`. Scene and script must align.

### EditorBuildSettings

- Every scene in Scenes In Build must have **enabled: 1**. If MainMenu is disabled, `LoadScene(1)` fails in standalone build with no clear error.
- Verify in `ProjectSettings/EditorBuildSettings.asset`: each scene has `enabled: 1`.

---

## Camera Rendering (macOS)

### m_TargetEye

- Default `m_TargetEye: 3` (StereoTargetEyeMask.Both) can cause the main Game view to show only the camera clear color on macOS—sprites and world content do not render.
- **Fix:** Set `m_TargetEye: 0` (None) on all Main Cameras in Boot, MainMenu, and Gameplay scenes.
- Applies to built-in pipeline; project does not use XR.

### SpriteRenderer / 2D world not rendering on macOS (Metal)

- On macOS standalone builds, SpriteRenderer and 2D world content may not render while Canvas/UI does (MainMenu button works).
- **Workaround:** `GameplayUIController` mirrors SparrowShip as UI. Single source of truth: SparrowShip (position + SpriteRenderer.sprite). GameplayUIController creates a Canvas and an UI Image that copies SparrowShip's sprite and world position each frame. Canvas renders in the same pipeline as MainMenu.
- **Mirror architecture:** SparrowShip drives; GameplayUIController mirrors. Do not duplicate sprite logic or movement in GameplayUIController—only copy `SpriteRenderer.sprite` and world position each frame.
- See `Assets/UI/GameplayUIController.cs`.

### Projectile mirror for macOS (2025-03-03)

- **Symptom:** When firing, only see yellow muzzle flash; laser beams not visible.

- **Cause:** Player projectiles use SpriteRenderer. On macOS, SpriteRenderer may not render (same as ship). Muzzle flash is the only visible feedback.

- **Fix:** GameplayUIController mirrors active player projectiles to Canvas UI: `FindObjectsByType<Projectile>`, create/reuse UI Images with laser sprite, sync world position and rotation each frame. Pool UI elements when projectiles despawn.

- **Laser sprite in Resources:** Copy `sparrow_laser_beam.png` to `Assets/Resources/Sprites/Projectiles/` so it survives build stripping. Path: `Sprites/Projectiles/sparrow_laser_beam` (no extension). Must have `textureType: 8`, `spriteMode: 1` in .meta. Projectile.OnEnable applies fallback when SpriteRenderer.sprite is null.
- **Projectile mirror debugging checklist:** (1) Verify `_laserSprite` loads — log if null; (2) Verify projectiles found — log count; (3) Ensure ProjectileMirrors container is last sibling (`SetAsLastSibling`); (4) Use solid-color fallback when sprite null to isolate sprite vs logic issues.

### Resources fallback for sprites

- Serialized sprite references can be lost on reimport, script recompile, or build stripping.
- **Pattern:** For sprites that must display in all builds (e.g., player ship), add `Resources.Load<Sprite>("Sprites/Sparrow/sparrow_facing_n")` fallback when `_idleSprite == null` in Awake.
- Copy critical sprites to `Assets/Resources/Sprites/Sparrow/` so they survive builds.

### Resources sprite import (2025-03-03)

- **Critical:** `Resources.Load<Sprite>(path)` returns null if the PNG is imported as Texture2D (textureType: 0, spriteMode: 0).
- **Fix:** In the .meta file, set `textureType: 8` (Sprite 2D and UI) and `spriteMode: 1` (Single). Also: `alphaIsTransparency: 1`, `enableMipMap: 0`, `nPOTScale: 0`, `cookieLightType: 1`.
- **Symptom of wrong import:** Cyan square fallback instead of sprite. Unity specialist must verify Resources sprites before assuming load works.

---

## Meta File GUIDs

- Unity GUIDs must be **exactly 32 hexadecimal characters**. 31 or 33 chars cause "cannot be extracted by the YAML Parser" errors and build failures.
- **Fix:** Pad 31-char GUIDs with one `0` at end; trim 33-char GUIDs by one char. Update all scene/prefab references to the new GUID.
- See [build_verification.md](build_verification.md) for format details.

---

## Boot / MainMenu Flow

- Boot scene: minimal—camera + BootLoader. Delay ~1.5s, then `LoadScene(_mainMenuBuildIndex)`.
- MainMenu: MainMenuController creates Canvas, New Game button, EventSystem at runtime. No prefab UI.
- Gate for 1.2: Boot runs; MainMenu appears without manual scene switch.

---

## Input System

- `VimanasInputActions.inputactions` in Resources: Gameplay map with Move (WASD + leftStick) and Fire (Space + buttonSouth).
- `InputService` loads from Resources, enables Gameplay map. `PlayerShipController` and `PlayerWeapon` use `InputService.Move` and `InputService.FirePressed`.
- **FindObjectOfType vs FindFirstObjectByType:** Use `FindFirstObjectByType<T>()`. Unity 6 marks `FindObjectOfType` obsolete (CS0618), and Player builds treat obsolete warnings as errors.
- **FindObjectsByType (Unity 6):** Requires `FindObjectsSortMode` argument. Use `FindObjectsByType<T>(FindObjectsSortMode.None)`. Zero-argument overload does not exist.

### Fire (Space) not working — CEO verified 2025-03-03

**Feedback:** CEO cannot fire via Space bar. WASD works; fire does not.

**Fix applied (2025-03-03):**
1. **EventSystem / UI:** Replaced `StandaloneInputModule` with `InputSystemUIInputModule` in GameplayUIController. With `activeInputHandler: 2` (Input System only), StandaloneInputModule uses old `Input` API and can conflict or fail; InputSystemUIInputModule uses the new Input System and does not block Fire.
2. **Visible feedback:** Added UI muzzle flash in GameplayUIController—yellow bar above ship when Fire pressed. Confirms fire input works on macOS when SpriteRenderer projectiles may not render. CEO verified 2025-03-03.

**Investigation checklist (for future issues):**
1. EventSystem/UI consuming input — Use InputSystemUIInputModule, not StandaloneInputModule, when using new Input System.
2. PlayerWeapon wiring — Verify InputService, ProjectilePool, prefab found at runtime.
3. Input action enabled — Gameplay map enabled in InputService.Awake.
4. Projectile visibility — Add UI muzzle flash or Debug.Log if SpriteRenderer may not render (macOS).

---

## Phase 1 Collected Learnings (2025-03-03)

| Area | Learning |
|------|----------|
| Scene loading | Build index over scene name; serialization must match script fields |
| EditorBuildSettings | Every scene `enabled: 1` or LoadScene fails silently |
| Camera (macOS) | `m_TargetEye: 0` on all Main Cameras; 3 causes clear-color-only |
| SpriteRenderer (macOS) | May not render; use UI Canvas workaround (GameplayUIController) |
| Fire (Space) | Use InputSystemUIInputModule, not StandaloneInputModule, when using new Input System |
| Meta GUIDs | Exactly 32 hex chars; 31/33 break YAML parser and build |
| API compatibility | Use `FindFirstObjectByType` (Unity 6). `FindObjectOfType` is obsolete and treated as error in Player builds (CS0618). |
| FindObjectsByType | Unity 6 requires `FindObjectsSortMode` argument. Use `FindObjectsByType<T>(FindObjectsSortMode.None)`. |
| Sprite fallback | For critical sprites (player ship), add Resources.Load fallback when SerializeField is null |
| Resources sprite import | textureType: 8, spriteMode: 1 required for Resources.Load&lt;Sprite&gt;—else null → cyan fallback |
| Mirror architecture | SparrowShip drives; GameplayUIController mirrors sprite + position only. No duplicate logic |

---

---

## Component Type Mismatch / Prefab Instance

### Standalone vs prefab instance drift

- **Symptom:** Type mismatch errors at load: "Expected BoxCollider2D at FileID X, found CircleCollider2D" or "Expected Animator at FileID Y, found Rigidbody2D". Build may succeed but errors appear in Console.
- **Cause:** Scene object was a standalone copy of a prefab with different component order or types. Unity's internal slot mapping gets out of sync.
- **Fix:** Replace the standalone GameObject with a proper prefab instance. The prefab is the source of truth; the scene stores only overrides (position, scene refs like InputService, ProjectilePool).
- **How:** Either (1) delete the standalone, drag prefab into scene, wire refs; or (2) edit scene YAML: add `m_PrefabInstance`, `m_PrefabAsset`, `m_CorrespondingSourceObject` to GameObject and components, add `PrefabInstance` (!u!1001) with `m_SourcePrefab` and `m_Modification` for overrides; or (3) run `Tools > Fix SparrowShip Prefab Instance` (Editor script in Core/Editor).
- **Prevention:** Prefer prefab instances over duplicating prefab content into scenes. Keep component order identical between prefab and any manual copies.

---

## Animation Module for Builds

### Animator not supported in builds

- **Symptom:** "Animator is not supported because the module Animation is disabled in the build."
- **Cause:** `com.unity.modules.animation` was not in `Packages/manifest.json` dependencies. Unity strips unused modules; Animator requires the Animation module.
- **Fix:** Add `"com.unity.modules.animation": "1.0.0"` to the `dependencies` block in `Packages/manifest.json`.
- **Note:** Even if the project does not use Animator directly, some packages or components may reference it. Include the module if builds report this error.

---

## Still true?

- [ ] Revisit if Unity 6 updates change behavior
- [x] Gameplay Main Camera m_TargetEye: 0 applied (2025-03-03)
- [x] GameplayUIController macOS workaround in place (2025-03-03)
- [x] Fire (Space) fix: InputSystemUIInputModule + muzzle flash (2025-03-03)

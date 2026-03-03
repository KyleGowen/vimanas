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
- **FindObjectOfType vs FindFirstObjectByType:** Use `FindObjectOfType<T>()` for compatibility. Unity 6 marks it obsolete in favor of `FindFirstObjectByType`, but some builds fail with FindFirstObjectByType; FindObjectOfType compiles reliably.

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
| API compatibility | Use `FindObjectOfType` for reliability; `FindFirstObjectByType` can cause build failures in some setups |
| Sprite fallback | For critical sprites (player ship), add Resources.Load fallback when SerializeField is null |
| Resources sprite import | textureType: 8, spriteMode: 1 required for Resources.Load&lt;Sprite&gt;—else null → cyan fallback |
| Mirror architecture | SparrowShip drives; GameplayUIController mirrors sprite + position only. No duplicate logic |

---

## Still true?

- [ ] Revisit if Unity 6 updates change behavior
- [x] Gameplay Main Camera m_TargetEye: 0 applied (2025-03-03)
- [x] GameplayUIController macOS workaround in place (2025-03-03)
- [x] Fire (Space) fix: InputSystemUIInputModule + muzzle flash (2025-03-03)

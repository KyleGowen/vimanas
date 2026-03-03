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

---

## Boot / MainMenu Flow

- Boot scene: minimal—camera + BootLoader. Delay ~1.5s, then `LoadScene(_mainMenuBuildIndex)`.
- MainMenu: MainMenuController creates Canvas, New Game button, EventSystem at runtime. No prefab UI.
- Gate for 1.2: Boot runs; MainMenu appears without manual scene switch.

---

## Still true?

- [ ] Revisit if Unity 6 updates change behavior
- [ ] Add Gameplay rendering fix when New Game flow is debugged

# Build Verification

**Status:** Active  
**Canon reference:** [tech_architecture.md](../tech_architecture.md)

## Verification Cadence

**After each milestone that touches gameplay or visuals:** Build for Mac, run, verify the gate criteria. Do not mark a milestone complete until the build has been run and confirmed.

**Why:** Many issues (SpriteRenderer, Resources stripping, prefab drift) only appear in builds, not in the Editor. See [unity_learnings.md](unity_learnings.md) for macOS rendering workarounds.

## Standalone Build Debugging

For standalone build verification (e.g., Boot → MainMenu transition, scene loading), **enable Development Build** in Build Profiles:

1. **File → Build Settings** (or Build Profiles)
2. Enable **Development Build**
3. Build and run

Development Builds include the Unity console and `Debug.Log` output. Use this to verify that scripts run correctly in the built executable (e.g., `[BootLoader] Transitioning to MainMenu`).

## Meta File GUID Format (Unity 6)

Unity's YAML parser expects **unquoted** 32-character hex GUIDs in `.meta` files.

- **Correct:** `guid: fdb44eb59ce6c42f099140c39d118837`
- **Incorrect:** `guid: "fdb44eb59ce6c42f099140c39d118837"` (quotes break the parser)

GUIDs must be exactly 32 hexadecimal characters. Short or quoted GUIDs cause "cannot be extracted by the YAML Parser" errors and compile failures.

## Still true?

- [ ] Review if Unity updates change YAML/GUID requirements

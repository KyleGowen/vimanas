# Unity Gameplay Engineer Memory

C# implementation, prefabs, ScriptableObjects, scene wiring, builds. Unity specialist reads this before implementation work.

## Entries

- **2026-03-04 (Core C# First):** Core owns state; Unity is presentation-only. Verify via `dotnet test src/Vimanas.Core.Tests/` before touching Unity. Unity adapter (Phase C): Canvas/UI only for gameplay—no SpriteRenderer for ships, projectiles, enemies. See tech_architecture.md, unity_learnings.md "Core Library Verification".
- **2025-03-03 (Platform):** Test platform is macOS. Build and run on Mac after implementation. SpriteRenderer may not render in Mac builds; UI mirroring required for world-space sprites (ship, projectiles). GameplayUIController mirror pattern is the workaround. Do not assume SpriteRenderer alone will display—verify in Mac build.
- **2025-03-03:** Unity learnings documented: docs/dev_standards/unity_learnings.md. Build index for scene loading, serialization alignment, m_TargetEye on macOS, EditorBuildSettings enabled flag.
- **2025-03-03:** Phase 1 learnings collected in docs/dev_standards/unity_learnings.md: build index, EditorBuildSettings, m_TargetEye, SpriteRenderer/macOS workaround, meta GUIDs (32 chars), FindObjectOfType preference. Unity specialist must check before scene/camera/build work.
- **2025-03-03 (CEO):** Fire (Space) does NOT work. CEO verified: WASD moves ship; Space does not fire. Team must fix. Investigation checklist in unity_learnings.md (EventSystem/UI consuming input, PlayerWeapon wiring, Input action enabled, projectile visibility).
- **2025-03-03:** Fire (Space) fix applied by Unity specialist: InputSystemUIInputModule (not StandaloneInputModule) in GameplayUIController; UI muzzle flash for visible feedback on macOS.
- **2025-03-03:** Phase 2.1 Ship Visual Consolidation progress. Sparrow sprite now displays (was cyan square). Root cause: Resources sprites imported as Texture2D; fixed by setting textureType: 8, spriteMode: 1 in .meta. Mirror architecture: SparrowShip drives; GameplayUIController mirrors. unity_learnings.md updated with Resources sprite import and mirror architecture.
- **2025-03-04 (CEO):** When pushing code for macOS-specific build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.
- **2026-03-04 (2.3 failure):** Projectile mirror in GameplayUIController—lasers never visible. CEO sees only yellow muzzle flash. Read unity_learnings.md "Projectile mirror failure"; next attempt must verify in Editor first, add build-inclusive debug, consider alternative (e.g. projectile as ShipUI child for smoke test).
- **2026-03-04 (Unity MCP):** Union MCP tools available when Cursor has Unity MCP connected. Use `test_active_scene` to start Play mode; `execute_code` for Editor scripts; `get_state`, `open_scene`, `create_script`, `search`, `screenshot`, asset tools. Close Unity before connecting—MCP must launch Unity. Package: `file:Packages/is.nurture.mcp` (local; git URL has LFS issues). See platform_learnings.md "Union MCP".

## Still true?

- [ ] Review and prune stale items periodically

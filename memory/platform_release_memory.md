# Platform / Release Memory

Steam config, build scripts, controller compliance, save/platform. Platform specialist reads this before platform work.

## Entries

- **CI.1 (2025-03-04):** GitHub Actions workflow at `.github/workflows/build.yml`. GameCI `unity-builder@v4`, **StandaloneLinux64** on ubuntu-latest (not macOS—unity-request-activation-file does not support darwin). Git LFS, Library cache, allowDirtyBuild. Required: UNITY_SERIAL, UNITY_EMAIL, UNITY_PASSWORD. See docs/dev_standards/platform_learnings.md.
- **CI.2 (2025-03-04):** Request Unity License workflow deprecated. Unity no longer supports manual Personal activation (license.unity3d.com). unity-request-activation-file: does not support Unity 6 (6000.x) or darwin; obsolete for Personal.
- **2025-03-04 (CEO):** When pushing code for build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.
- **2025-03-04:** Personal license: extract serial from .ulf (`grep DeveloperData ... | sed ... | base64 -d`). Add as UNITY_SERIAL with UNITY_EMAIL, UNITY_PASSWORD. The `%` at end of output is zsh prompt (no newline), not part of serial.
- **2025-03-04:** GitHub Actions: `secrets` cannot be used in `if` conditions or expressions—only in env blocks. For conditional logic, pass secret via env and check inside run script.

## Still true?

- [ ] Review and prune stale items periodically

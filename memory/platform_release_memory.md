# Platform / Release Memory

Steam config, build scripts, controller compliance, save/platform. Platform specialist reads this before platform work.

## Entries

- **2026-03-04 (Core C# First):** Core runs on macOS via `dotnet` (dotnet test, dotnet run). No Unity required for logic verification. Unity shell uses Canvas/UI to avoid SpriteRenderer Mac bug.
- **CI.1 (2026-03-05):** GitHub Actions workflow at `.github/workflows/build.yml`. Vite build; no license. Build job first; lint, test:unit, test:integration run in parallel after build. See docs/dev_standards/platform_learnings.md.
- **CI.2 (2025-03-04):** Request Unity License workflow deprecated. Unity no longer supports manual Personal activation (license.unity3d.com). unity-request-activation-file: does not support Unity 6 (6000.x) or darwin; obsolete for Personal.
- **2025-03-04 (CEO):** When pushing code for build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.
- **2025-03-04:** Personal license: prefer UNITY_LICENSE_BASE64 (base64 of .ulf) to avoid login 401. Alternative: UNITY_SERIAL + UNITY_EMAIL + UNITY_PASSWORD; 401 = wrong credentials—Google SSO: set password at login.unity.com, avoid special chars.
- **2025-03-04:** GitHub Actions: `secrets` cannot be used in `if` conditions or expressions—only in env blocks. For conditional logic, pass secret via env and check inside run script.
- **2026-03-04 (CI.1 loss):** Unity Personal license activation in GitHub Actions did not succeed. Tried: serial+creds (401), ULF only (activation retries failed). See platform_learnings.md "CI.1 Session Loss" for full learnings. Next attempt: Pro trial, Cloud Runner, self-hosted, or GameCI Discord.

## Still true?

- [ ] Review and prune stale items periodically

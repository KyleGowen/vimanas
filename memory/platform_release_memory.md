# Platform / Release Memory

Steam config, build scripts, controller compliance, save/platform. Platform specialist reads this before platform work.

## Entries

- **CI.1 (2025-03-04):** GitHub Actions workflow at `.github/workflows/build.yml`. GameCI `unity-builder@v4`, StandaloneOSX (macOS), Git LFS, Library cache. Required secrets: UNITY_LICENSE (or UNITY_SERIAL), UNITY_EMAIL, UNITY_PASSWORD. See docs/dev_standards/platform_learnings.md.
- **CI.2 (2025-03-04):** License activation failure: added troubleshooting to platform_learnings.md; created `.github/workflows/request-license.yml` (workflow_dispatch) for Personal license .alf generation when local activation fails. Uses deprecated game-ci/unity-request-activation-file@v2.1.0; fallback is Unity Hub per docs.
- **2025-03-04 (CEO):** When pushing code for macOS-specific build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.
- **2025-03-04:** License activation failure fix: platform_learnings.md "License activation failure" troubleshooting; request-license.yml workflow for Personal license (.alf → license.unity3d.com → .ulf → UNITY_LICENSE). Build still fails until CEO completes license setup.

## Still true?

- [ ] Review and prune stale items periodically

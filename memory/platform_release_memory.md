# Platform / Release Memory

Steam config, build scripts, controller compliance, save/platform. Platform specialist reads this before platform work.

## Entries

- **CI.1 (2025-03-04):** GitHub Actions workflow at `.github/workflows/build.yml`. GameCI `unity-builder@v4`, StandaloneOSX (macOS), Git LFS, Library cache. Required secrets: UNITY_LICENSE (or UNITY_SERIAL), UNITY_EMAIL, UNITY_PASSWORD. See docs/dev_standards/platform_learnings.md.
- **2025-03-04 (CEO):** When pushing code for macOS-specific build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.

## Still true?

- [ ] Review and prune stale items periodically

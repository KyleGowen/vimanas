# Platform / Release Memory

Steam config, build scripts, controller compliance, save/platform. Platform specialist reads this before platform work.

## Entries

- **CI.1 (2026-03-05):** GitHub Actions workflow at `.github/workflows/build.yml`. Vite build; no license. Build job first; lint, test:unit, test:integration run in parallel after build. See docs/dev_standards/platform_learnings.md.
- **2025-03-04 (CEO):** When pushing code for build checks: use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Do not report "ready" until CI has succeeded.

## Still true?

- [ ] Review and prune stale items periodically

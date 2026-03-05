# Platform Learnings

**Status:** Active  
**Audience:** Platform/Release, DevOps  
**Source:** Framework-free pivot (2026-03-05)

---

## CI (Vite / Web)

The project uses Vite. CI should run:

```bash
npm ci
npm run build
```

No license activation required. Build is fast (~seconds).

---

## GitHub Actions

CI.1 workflow (`.github/workflows/build.yml`):

- **Trigger:** push, pull_request to main/master
- **Build job** (runs first): checkout → npm ci → npm run build
- **Lint, Unit tests, Integration tests** (parallel after build): each job runs `npm ci` then its script
- **Scripts:** `npm run lint`, `npm run test:unit`, `npm run test:integration`
- No secrets required for build

---

## Steam / Switch (Deferred)

- **Steam:** Tauri or Electron wrapper around web build; or native port later
- **Switch:** Requires Nintendo SDK; deferred

---

## Still true?

- [x] CI.1 workflow implemented (build, lint, unit, integration)
- [ ] Revisit Steam/Switch when platform work begins

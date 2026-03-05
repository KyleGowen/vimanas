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

A simple workflow for Vite:

- Trigger: push, pull_request
- Steps: checkout → npm ci → npm run build
- No secrets required for build

---

## Steam / Switch (Deferred)

- **Steam:** Tauri or Electron wrapper around web build; or native port later
- **Switch:** Requires Nintendo SDK; deferred

---

## Still true?

- [ ] Add Vite CI workflow when implemented
- [ ] Revisit Steam/Switch when platform work begins

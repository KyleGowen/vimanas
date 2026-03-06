# Phase 5: HUD and Basic UI

**Milestone:** 5.A.1 HUD design, 5.A.3 Results screen design  
**Status:** In progress  
**Gate:** CEO approves design specs; then 5.A.2/5.A.4 assets → 5.1/5.2 tech

---

## Context

Phase 4 (First Level) is complete. D5 (full level) is testable. Next checkpoint: **D6 — Results flow** (level complete → Results screen → Retry or Continue).

Phase 5 delivery order:
1. **5.A.1** HUD design → 5.A.2 HUD assets → 5.1 Combat HUD
2. **5.A.3** Results screen design → 5.A.4 Results assets → 5.2 Results screen

Design milestones (5.A.1, 5.A.3) gate asset and tech work.

---

## Delegation

| Phase | Specialist | Subagent | Output |
|-------|------------|----------|--------|
| 5.A.1 + 5.A.3 | Visual Design | generalPurpose | `docs/concepts/hud_design.md`, `docs/concepts/results_screen_design.md` |

Director delegates design to Visual Design via `mcp_task`. Director does NOT draft the design docs.

---

## 5.A.1 HUD Design — Spec

**Deliverable:** `docs/concepts/hud_design.md`

**Content required:**
- Layout: HP bar, mana bar, score, lives
- Aether accents, filigree framing per art_style_guide
- Legible at 1080p
- P0 Mocks Considered section (title screen, level mocks, boss mocks)
- Platform / Engine gotchas (Canvas 2D, resolution, asset paths per engine_learnings)

**Gate:** Visual Design spec; design_system compliance

---

## 5.A.3 Results Screen Design — Spec

**Deliverable:** `docs/concepts/results_screen_design.md`

**Content required:**
- Layout; Retry/Continue flow
- Victory/defeat states
- Design system compliance
- P0 Mocks Considered (if applicable)
- Platform / Engine gotchas

**Gate:** Design system compliance

---

## Verification

- Read hud_design.md; CEO approves
- Read results_screen_design.md; CEO approves

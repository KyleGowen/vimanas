# Emergency: GitHub Actions CI

**Status:** Pending  
**Specialist:** Platform / Release (or Unity Gameplay Engineer for Unity-specific wiring)  
**Depends on:** Phase 1 complete; Unity license available for CI

---

## Objective

Automate build error reporting. CEO pushes code; CI runs Unity batchmode build; if it fails, full log (CS####, file, line) is in workflow output. No manual error copying.

---

## Deliverable Requirements

| Requirement | Spec |
|-------------|------|
| **Workflow** | `.github/workflows/` using GameCI `unity-builder` or equivalent |
| **Trigger** | Push (or PR) to main |
| **Build target** | macOS (matches test platform) |
| **Unity version** | 6000.3 (per ProjectVersion.txt) |
| **License** | Personal or professional Unity license for CI runner |

---

## Flow

1. CEO pushes code
2. GitHub Actions triggers workflow
3. CI runs Unity batchmode build
4. If compile fails: full log (including CS1501, file path, line number) in workflow output
5. Agent (or CEO) opens failed run in GitHub Actions and reads log

---

## Gate Criteria

- [ ] Push → CI runs Unity build
- [ ] On compile failure: full error log visible in workflow output (CS####, file, line)
- [ ] Build target: macOS

---

## Learnings to Check

- [docs/dev_standards/platform_learnings.md](docs/dev_standards/platform_learnings.md) — create if needed for CI/license notes
- GameCI docs: https://game.ci/docs/github/getting-started

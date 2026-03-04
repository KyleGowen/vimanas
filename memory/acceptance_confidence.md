# Acceptance Criteria Confidence

Tracks CEO↔agent interaction count per milestone. Used to infer confidence in acceptance criteria and trigger clarifying questions.

**Definition:** 1 interaction = one CEO message + one agent (or subagent) response. Milestone complete = CEO explicitly signs off.

## Completed Milestones

| Milestone | Task Type | Interactions | Date |
|-----------|-----------|--------------|------|
| P0.1 Ship mocks | Visual mock | 12 | 2025-03-01 |
| P0.2 Pilot mocks | Visual mock | 2 | 2025-03-02 |
| P0.3 Level mocks | Visual mock | 13 | 2025-03-02 |
| P0.4 Boss fight mocks | Visual mock | 7 | 2025-03-02 |
| P0.5 Title screen mock | Visual mock | 10 | 2025-03-02 |
| P0.6 Narrative sample | Design lock | 1 | 2025-03-02 |
| 1.1 Unity project init | Tech implementation | 1 | 2025-03-01 |
| 1.2 Boot scene | Tech implementation | 1 | 2025-03-02 |
| 1.3 MainMenu | Tech implementation | 2 | 2025-03-02 |
| 1.4 Input system | Tech implementation | 3 | 2025-03-03 |
| 2.A.1 Sparrow design lock | Design lock | 1 | 2025-03-03 |
| 2.A.2 Sparrow sprite sheet | Asset delivery | 1 | 2025-03-03 |
| 2.A.3 Basic gun design | Design lock | 1 | 2025-03-03 |
| 2.1 Single ship prefab | Tech implementation | 2 | 2025-03-03 |
| 2.3 Basic gun | Tech implementation | 1 | 2025-03-03 |

## Averages by Task Type

| Task Type | Avg Interactions | Confidence |
|-----------|------------------|------------|
| Visual mock | ~9 | Low |
| Design lock | ~1 | High |
| Tech implementation | ~2 | High |
| Asset delivery | ~1 | High |

**Confidence heuristic:** 1–2 = High (proceed); 3–5 = Medium (consider clarifying); 6+ = Low (ask clarifying questions before delegating).

## Still true?

- [ ] Director updates this file at Session End when milestone completes
- [ ] Recompute averages when adding new rows
- [ ] Prune stale entries periodically

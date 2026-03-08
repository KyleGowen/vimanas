# 4-Ship Formation Transitions Reference

**Level / Encounter Agent · Design Reference**

Aviation-derived formation shapes and transition sequences for enemy waves and cooperative ship-combining. Source: T-34 Formation Flight Manual (4-ship transitions). Use for dynamic encounter design—enemies that shift formations mid-wave, or combined player ships that re-arrange.

---

## Formations (4 ships)

| Formation | Layout | Use case |
|-----------|--------|----------|
| **Fingertip right** | #1 central-front; #2 left-back; #3 right-back; #4 behind #3 | Default spread; good coverage, readable |
| **Echelon right** | Diagonal line extending right and back from #1 | Flanking approach; side threat |
| **Echelon left** | Diagonal line extending left and back from #1 | Mirror flank; opposite side |
| **Diamond** | #1 front; #2 left; #3 right; #4 directly behind #1 (slot) | Concentrated; narrow front, tight grouping |
| **Trail** | Single file: #1 → #2 → #3 → #4 | Narrow approach; column attack; tight spaces |

**Numbering:** #1 = leader; #2 = lead's wingman; #3 = section lead; #4 = section lead's wingman.

---

## Transition Sequences

Movement order and who moves. Implement as waypoint paths or formation-state machines.

### 1. Fingertip right → Echelon right

- **#3** moves section (#3 + #4) out and back
- **#2** crosses over to #1's right wing
- Result: diagonal line rightward

### 2. Echelon right → Fingertip right

- **#3** moves section out to create space
- **#2** crosses over to #1's left wing
- **#3** moves section back to #1's right wing
- Result: staggered fingertip

### 3. Fingertip right → Echelon left

- **#3** moves section to #2's left wing
- **#4** crosses under #3 as element crosses under #2
- Result: diagonal line leftward

### 4. Echelon left → Fingertip right

- **#3** moves section to #1's right wing
- **#4** crosses over to #3's right wing
- Result: staggered fingertip

### 5. Fingertip right → Diamond

- **#4** moves into slot (directly behind #1)
- Result: compact diamond

### 6. Diamond → Fingertip right

- **#4** moves from slot to #3's wing
- Result: staggered fingertip

### 7. Fingertip right → Trail

- **#2** slides back and behind #1
- **#3** slides back and behind #2
- **#4** slides back and behind #3
- Result: single-file column

### 8. Trail → Fingertip right

- **#2** moves forward to #1's inside wing (left)
- **#3** and **#4** join as element, then take position on #1's outside wing (right)
- Result: staggered fingertip

---

## Vimanas Application

### Enemy waves (Scouts, future tiers)

| Scenario | Formation / transition | Rationale |
|----------|------------------------|-----------|
| Approach from above | Trail → Fingertip right | Enter narrow, then fan out to engage |
| Flanking | Echelon right/left | Diagonal threat; forces lateral awareness |
| Focused attack | Diamond | Concentrated fire; narrow front |
| Defensive / regrouping | Fingertip right | Spread coverage; mutual support |
| Surprise | Mid-wave transition | E.g. Fingertip → Diamond when player commits |

**Complexity ladder:** Diamond↔Fingertip (1 ship moves) < Echelon↔Fingertip (multi-ship) < Trail↔Fingertip (full reorg). Use simpler transitions for early waves; complex for mini-bosses or late waves.

### Cooperative ship-combining (future)

If 2–4 player ships combine, these formations define combined-ship arrangement. Transitions = player commands or AI re-arrangement. Diamond = concentrated forward fire; Echelon = flank coverage; Trail = narrow penetration.

### Animation

Movement paths (who moves where) map to top-down waypoints. Sequential moves (e.g. Trail formation: #2, then #3, then #4) give clear, readable choreography. Stagger transitions by 0.2–0.4 s so players can track the shift.

---

## Relation to Current Scout Spec

Per [scout_design_lock.md](scout_design_lock.md): V (5 Scouts), Staggered Wedge (7 Scouts), Pincer (2×3). Those are **spawn formations**—how enemies enter. This reference adds **in-flight transitions** for 4-ship groups. Future enemy tiers (e.g. 4-ship squadrons) can use these; Scout swarms (5–7) use the existing V/Wedge/Pincer layouts.

---

## Reference Image

Source diagram: `docs/references/formation_transitions_4ship.png` (T-34 Formation Flight Manual, 4-ship transitions table).

---

## Still true?

- [ ] Review when implementing formation transitions (4.x+)
- [ ] Prune if superseded by locked formation-transition spec

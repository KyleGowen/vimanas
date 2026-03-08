# Earth Defense Force (SNES) Reference

**Source:** [GameFAQs FAQ by MHamlin](https://gamefaqs.gamespot.com/snes/588729-earth-defense-force/faqs/65536) (v1.0, 12/24/2012)

**Game:** Super E.D.F.: Earth Defense Force — Jaleco, 1992. Side-scrolling shoot 'em up for arcade and SNES.

**Vimanas relevance:** Weapon variety and formation interplay; stage-by-stage difficulty ramp; boss patterns; level-up and shield systems. Horizontal scroller (Vimanas is top-down) but design principles transfer.

---

## Overview

- **Customizable firepower:** Pick weapon at start of each stage or after continue.
- **Satellite ships:** Two indestructible satellites; formations change their behavior (Union, Rotation, Shadow, Homing).
- **Shields:** 3 hits before death; invulnerability frames after hit; shields refill between stages.
- **Level-up:** Kill enemies to fill XP bar; level 1–5 unlocks formations and increases weapon strength; level 5+ grants extra shields.
- **Secret bonus:** Complete stage without getting hit → huge XP boost.

---

## 4. Weapons

Weapon chosen at stage start. Game ranks by power, speed, rapid fire—rankings are inconsistent. Formation choice matters.

| Weapon | Behavior | Best formation | Notes |
|--------|----------|----------------|-------|
| **Vulcan** | Spray of bullets, shotgun spread. Satellites lose spread and shoot forward. | Union or any | Basic, decent power/speed. |
| **Laser** | Straight ahead, high power, low rate of fire. Decimates anything in path. | Homing | Devastating at level 4–5. |
| **Atomic** | Canisters → huge blue bubbles. Erases enemy gunfire. | Homing | Best all-around once Homing unlocked. |
| **Homing** | Machine-gun, shots home on enemies. | Any except Homing | Weak; enemies may fly off screen before death. |
| **Explode** | Big blasts; explode on hit → secondary blasts hit others. | Homing | Very powerful; forward-only; no shot erasure. |
| **S. Laser** | Satellites turn and aim at enemies. Shots pass through enemies. | Any | Homing-like but slower; can be dodged by fast enemies. |
| **Grenade** | Short-range grenades; explode on distance, not on hit. | Homing | Dubious value; avoid. |
| **Photon** | Charge-up for big damage. Union: satellites create energy barrier that absorbs enemy fire while charging. | Homing or Union | Strongest; Union only good for Photon. |

**Formation synergy:** Homing weapon + Homing formation is redundant. Homing formation adds homing to any weapon (e.g. Atomic, Explode). Union formation is weak except for Photon (charge barrier).

---

## 5. Walkthrough (Stage-by-Stage)

### Stage 1
- **Recommended:** Homing
- **Enemies:** Weak; round laser ships are tougher, appear behind.
- **Mid-boss:** Floats lazily; circular bullet pattern. Dodge and finish.
- **Boss:** Stay between top/bottom guns. Fireballs; then spread bullets—fly up/down around them. Secret bonus easy.

### Stage 2
- **Recommended:** Homing or S. Laser
- **Enemies:** From many sides; level 3 unlocks Shadow formation.
- **No mid-boss.** Secret bonus achievable.
- **Boss:** Safe at bottom; moves left, fires trios. Shadow formation: satellites hang above, damage boss when he returns.

### Stage 3
- **Recommended:** S. Laser
- **Enemies:** From all sides; harder to kill. Longer stage.
- **Mid-boss:** Red orb weak point; arms block fire. S. Laser passes through arms. Arms blow off → whole body vulnerable. Circular movement; avoid crescents.
- **Post-mid:** Fast enemies; move closer so S. Laser hits.
- **Boss:** In water; orbs explode in fan. Homing missiles. Rises above water; lasers rebound off bottom. Stay upper left.

### Stage 4
- **Recommended:** S. Laser or Atomic (if level 5)
- **Very difficult.** Heavy enemy fire; fast red enemies (X-pattern bullets). Blue enemies rush forward. Formations trap you in center.
- **No mid-boss.** Toughest boss yet.
- **Boss:** Flies up/down. Purple star spread; satellites that shoot S. Laser; firing line of satellites. Weakened: big crescents + purple star lines. Atomic + Homing erases gunfire.

### Stage 5
- **Recommended:** Atomic or Explode
- **Breather** after stage 4. Small probes invulnerable until they ram—don't use Homing on them.
- **Mid-boss:** Homing formation absorbs bullets; satellites in front of boss.
- **Post-mid:** Blue comets break into chunks. Green dots approach from background, then rush and shoot.
- **Boss:** Snake-like; only head vulnerable. Huge spread of blue comets; move to opposite side, repeat. Atomic slows game.

### Stage 6
- **Recommended:** Atomic, Laser, or Explode
- **Hardest.** Beefed-up enemies; tons of XP.
- **Corridor:** Limits movement; Homing for quick kills.
- **First boss:** Fast bullet spreads; red orb ram; race to kill first.
- **Second boss:** Full right side. Homing formation bad (distracting orb). Rotation or Shadow; Photon Union works. Cycle: full-screen bullets; lightning; fan of colored shots.
- **Final boss:** Green globs; rapid fire; fan fragments. Pink projectiles (slower, 3 fragments). Eyeballs fly at you when almost dead—nearly undodgeable; need 3–4 shields.

---

## Takeaways for Vimanas

| Specialist | Takeaways |
|------------|-----------|
| **Combat Systems** | Weapon–formation synergy; trade-offs (power vs rate of fire vs homing); shot-erasure vs raw damage; charge weapons with defensive options. |
| **Level / Encounter** | Stage-by-stage weapon recommendations; difficulty ramp (1–2 easy, 3–4 hard, 5 breather, 6 hardest); boss patterns (safe zones, movement cycles, phase changes); corridor vs open; invulnerable enemies. |

---

## Still true?

- [ ] Review when implementing weapon variety or stage design
- [ ] Prune if superseded by locked design

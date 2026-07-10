# Craft Knowledge Base — Index

**The measurable floor of design quality.** Where the Taste KB (`TS-NNN`) evaluates *judgment* (point of view, conviction — the unquantifiable altitude), the Craft KB (`CR-NNN`) teaches *execution* (spacing, type, color, shadow, alignment, density — the quantifiable floor). This is **Lane A**: concrete, rule-based, teachable best-practice from the field's tastemakers and the established craft canon.

Every rule is **double-grounded** in a textbook or standard source and a respected practitioner or product tradition that demonstrates it in use.

---

## Why this KB can teach where the Taste KB can only judge

Craft is rule-based, so it's checkable, and checkable means teachable. Each rule has a measurable target, a way to spot the violation, a concrete fix, and an eye-training note so the designer catches it themselves next time. (The Taste KB couldn't do this — conceptual taste is unfalsifiable.)

---

## The six dimensions

| Dir | Dimension | What it teaches | Entries |
|-----|-----------|-----------------|---------|
| `spacing-rhythm/` | Spacing & Rhythm | Scale discipline, proximity, vertical rhythm, whitespace | CR-001…007 |
| `type-hierarchy/` | Type Hierarchy | Size cap, weight+color hierarchy, body size, line length, tracking | CR-101…107 |
| `color-contrast/` | Color & Contrast | Contrast thresholds, palette discipline, OKLCH, semantic consistency | CR-201…206 |
| `shadow-elevation/` | Shadow & Elevation | Single light source, elevation ramp, layering, tinting | CR-301…305 |
| `alignment-grid/` | Alignment & Grid | Optical alignment, one edge, radius system, grid, pixel-snapping | CR-401…404 |
| `density-balance/` | Density & Balance | Consistent + appropriate density, tension/release, space-before-borders | CR-501…504 |

---

## Entry schema

Each entry: `{dimension-dir}/CR-NNN-slug.md`, frontmatter + a six-part body.

```yaml
---
id: CR-NNN
title: "Rule name"
dimension: spacing-rhythm | type-hierarchy | color-contrast | shadow-elevation | alignment-grid | density-balance
measurable: true | partial      # can a tool/linter check it deterministically?
consensus: law | strong | heuristic | one-opinion   # honesty grade — never present folklore as law
sources:                          # double-grounded: textbook/standard + tastemaker
  textbook: "Refactoring UI — Building Your Color Palette"
  tastemaker: "Karri Saarinen / Linear"
tags: [scale, proximity, ...]
---
```

### Body (six parts — the teaching shape)
1. **Rule** — the measurable recommendation, with numbers. One sentence you could lint against.
2. **Why it matters** — the reasoning. What the rule buys you; what its violation costs.
3. **How to spot it** — the tell. What the violation looks like on screen (so the skill — and the designer — can detect it).
4. **The fix** — concrete, mechanical. What to change.
5. **Eye-training** — how to *see* this yourself next time (the uplevel — turns a fix into a skill).
6. **When to flex** — contexts where the rule bends, and the consensus caveat. (Heuristics flex more than laws.)

### Why "eye-training" is mandatory (the difference from a linter)
A linter says "11px is off-scale." This KB says *why it matters, what to change, and how to see it next time.* The eye-training section is what makes this a **teaching** tool rather than design-lint — it builds the designer's judgment, not just fixes the screen.

---

## Consensus grading (honesty — non-negotiable)

Every rule is graded so the skill never presents folklore with the authority of a standard:
- **law** — a hard standard (WCAG contrast thresholds). Violating it is a defect.
- **strong** — near-universal craft consensus (spacing scale, single light source, hierarchy via weight+color).
- **heuristic** — a useful default, not a rule (60-30-10; centered short headings). Flexes by context.
- **one-opinion** — a single tastemaker's specific call (Saarinen's exact 150ms; "minimum awesome"). Cite as flavor, not law.

---

## How it composes (sibling, not silo)

```
                 TEACHES CRAFT        EVALUATES TASTE       EVALUATES USABILITY
Floor (measurable):  interface-craft   —                     /ux-critique (partly)
                     (this KB)
Altitude (judgment): —                 tastemaker (TS KB)    —
```

- **interface-craft (Lane A) ↔ tastemaker (Lane B):** craft is the floor the taste ladder stands on. Natural flow: tighten craft first, then push point of view. "Fix your spacing, then we can talk about conviction." Craft maps to the ladder's *Coherent* rung.
- **↔ /ux-critique:** different axis — ux-critique asks "can the user succeed," craft asks "is it well-made." Overlap only at contrast (both a craft rule and an a11y floor); cross-reference, don't duplicate.
- **↔ DESIGN.md / tokens:** craft can *consume* a design system as the "correct answer" and flag drift from it ("you're off your own 8px scale").

---

## Coverage status

v0.1 — all 6 dimensions populated. Grown from the sourced harvest, not invented. Same driven-production loop as the Taste KB: run on real designs → flag missing rules → add against proven need.

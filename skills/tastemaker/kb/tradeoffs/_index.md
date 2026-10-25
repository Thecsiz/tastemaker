# Trade-off Knowledge Base: Index

**What yields when two goods collide.** Craft rules (`CR-NNN`) teach how to make something well. Taste principles (`TS-NNN`) say what good looks like. Trade-offs (`TR-NNN`) decide what wins when two principles pull in opposite directions on the same surface, or when a proposed feature competes with the product's core. This is **Lane C**: the rankings that turn taste from a set of values into a point of view.

Every entry is phrased the same way: **"X over Y, even when Y wins locally."** The "even when" is the point. A ranking that only holds when it costs nothing is not a ranking.

The registry `tr-ids.json` is the source of truth for every `TR-NNN` ID. Never cite an ID that is not in it.

---

## Why rankings, not more principles

A rubric scores dimensions independently. Taste is what happens when the dimensions conflict. A surface can score well on clarity and on character and still be the wrong call, because the real decision was which one to sacrifice. Rankings make that decision explicit, citable and testable, the same way CR rules and TS principles are.

Rankings also make absence visible. A critique of a finished screen cannot see the features that were correctly cut. A ranking can say why they were cut, and the cut log can record it.

---

## Entry schema

Each entry: `TR-NNN-slug.md`, frontmatter plus a six-section body.

```
---
id: TR-NNN
title: "X over Y"
prefers: x
over: y
status: seed | established       # seed = proposed, citable, awaiting recurrence
consensus: strong | heuristic | one-opinion
tags: [...]
resolves: the conflict this ranking decides
related:
  - id: TS-NNN
    type: enforces | decides-for | decides-against | bounds | complements | enables
---
```

### Body (six sections)

1. **Ranking:** the one-line statement.
2. **Why:** the cost being accepted, and why it is worth paying.
3. **How to Spot the Conflict:** the situations where X and Y collide.
4. **Exemplars:** at least three design traditions, per the anti-monoculture rule.
5. **When It Flips:** the contexts where Y should win. This replaces When to Flex.
6. **Sources.**

---

## Entries

| ID | Ranking | Resolves | Status | Consensus |
|----|---------|----------|--------|-----------|
| TR-001 | System Consistency over In-Context Discoverability | Placement across surfaces (TS-006, TS-010, TS-011) | seed | strong |
| TR-002 | Editing over Completeness | TS-010 vs. TS-007 | seed | strong |
| TR-003 | One Primary Action over Parity of Options | TS-003 vs. pressure for equal weight | seed | strong |
| TR-004 | Convention over Expression on High-Stakes, Low-Frequency Tasks | TS-011 vs. TS-008 and TS-009 | seed | strong |
| TR-005 | Depth on the Core Interaction over Breadth of Features | Where the polish budget goes (TS-001, TS-005, TS-012) | seed | heuristic |

---

## Status: seed vs. established

All five entries ship as **seed**. A seed ranking is citable, but a finding that cites it says so (`TR-002 (seed)`), the same way a craft finding carries its consensus grade. A seed becomes **established** after it has decided the same conflict consistently across repeated critiques. Promotion follows the same recurrence rule as TS candidates: add against proven need, never invent.

## Shared rankings vs. house rankings

This KB holds rankings with broad agreement. Rankings are also where points of view legitimately differ, so a user or team can keep its own in a **house profile** (`H-TR-NNN`, stored in their project, never in this KB). A house profile can rank against a shared entry, but must say so and give its reason. Critiques name which layer decided. Full rules: `references/house-profiles.md`.

## Pending candidates (awaiting recurrence)

Unresolved conflicts found during critiques are logged as TR candidates in the coverage note: `[no TR entry: candidate "X over Y"]`. None are pending yet.

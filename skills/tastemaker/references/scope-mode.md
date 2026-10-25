# Scope Mode: Tastemaker

Use this mode before anything is built, or when an existing product needs pruning. It answers "what should exist?" and returns a cut list where every verdict carries a cited reason.

Scope mode judges proposals against the product's own stated point of view and core interaction. It does not judge market demand, revenue or business strategy. A feature can pass scope mode and still be the wrong bet for the business; say so when it matters.

## When to use it

- The user shares a brief, PRD, feature list, roadmap, backlog or an inventory of an existing app and asks what to cut, what to keep, or whether something should exist.
- The user invokes `/tastemaker scope` or asks for a cut list.
- A critique uncovers that the real problem is scope (too many things on one surface, or the wrong things), not execution. Offer scope mode instead of grading the pixels.

## Workflow

Follow the steps in order.

1. **Brief.** Establish surface, audience, register and stakes as in the standard workflow, plus **the one-sentence reason the product exists**. If the user cannot state it, that is the first finding, and it outranks everything else on the list.
2. **Core interaction.** Name the one thing the product must do exceptionally, as a verb phrase ("capture a thought in under two seconds"). If there are two, the product has two cores and that is a finding.
3. **Load rankings and history.** Read the shared TR entries that apply. If the project has a house profile (`tastemaker-house.md` at the project root, or a path the user gives), read it; house rankings outrank shared ones for this project, and the output says which layer decided. If the project has a cut log (`tastemaker-cuts.md`), read it: a proposal that brings back something already cut, or a verdict that contradicts an earlier one, is a finding. Raise any Defer whose revisit date or trigger has arrived.
4. **Classify each item** against the core:
   - **Serves the core:** makes the core interaction faster, clearer, deeper or more reliable.
   - **Competes with the core:** takes attention, screen space, craft budget or conceptual load from it.
   - **Sits beside the core:** unrelated to the core; neither helps nor directly harms it.
5. **Apply rankings** to every item that competes or sits beside. Cite the ranking that decides it. When no ranking covers the case, decide on the merits and log a TR candidate.
6. **Return the cut list** in the format below.
7. **Offer to log it.** Ask whether to append accepted verdicts to the project's cut log (`tastemaker-cuts.md`). Write only what the user accepts.

## Verdicts

| Verdict | Meaning |
|---------|---------|
| **Keep** | Serves the core. Build it, and build it fully. |
| **Cut** | Competes with the core or adds load without serving it. Remove it. |
| **Defer** | Sits beside the core, or depends on the core being finished first. Revisit later, with a date or trigger. |
| **Merge** | Duplicates or overlaps another item; fold the two into one. |
| **Move** | The capability is fine but its home is wrong. Name the right home (TR-001 is the usual citation). |

## Output format

```
## Scope review: [product or surface]

**Exists to:** [one sentence]
**Core interaction:** [verb phrase]
**Rankings applied:** [shared TR IDs] · [house H-TR IDs, if any]

| Item | Verdict | Reason | Decided by |
|------|---------|--------|------------|
| [item] | Keep / Cut / Defer / Merge / Move | [one line] | TR-NNN (seed) · H-TR-NNN · merits |

**Unresolved conflicts:** [items where two rankings disagree or none applied; each logged as a TR candidate]

**What this leaves:** [two or three sentences on the product after the cuts: what it is now, what it no longer tries to be]
```

Sort the table by verdict: Cut first, then Move, Merge, Defer, Keep. The cuts are the decisions; lead with them.

## The forcing rule

**Scope mode cuts something, or explains in one sentence why nothing should go.** A review that keeps everything has not done its job. "Every item serves the core interaction directly" is a valid explanation when true and rare. "Everything seems useful" is not an explanation; it is the failure this mode exists to catch.

## Voice

- Decisive. "Cut the in-app theme editor" beats "consider whether the theme editor is necessary."
- Specific about the cost. Every Cut names what the product gives up and why it is worth giving up.
- Respectful of effort. An item already built is not exempt; sunk cost is not a ranking.
- Honest about limits. If a cut has business consequences you cannot judge, say so and leave the call with the owner.

## Composes with

- After scope mode, the standard critique evaluates how well the remaining items are realized.
- System mode (`references/system-mode.md`) checks that the Move verdicts landed consistently across the product.
- The cut log and house profile rules live in `references/house-profiles.md`.

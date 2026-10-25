# Conflicts and Defended Breaks: Tastemaker

Two related judgments that v1 could not make: which principle wins when two collide, and whether a broken principle was a mistake or a choice.

## Conflict findings

When two principles pull in opposite directions on the same region or decision, report a **conflict finding** instead of citing both and splitting the difference. This is the third finding shape, beside craft (teach) and taste (evaluate).

### Format

```
### [Finding-NN] [Narrative hook]: [what collides]
`CONFLICT` · TS-NNN vs. TS-NNN · decided by TR-NNN (seed) | H-TR-NNN | no ranking on file

> *Verdict: [which principle yields here, in one sentence]*

**The collision:** [what each principle asks for on this specific surface, with the observation that shows it.]

**Decided by:** [the ranking and why it applies here. Name the layer: shared KB or house profile.]

**The call:** [what to change, or what to protect, so the winning principle holds.]

**Flip condition:** [what would have to be true for the other principle to win. One sentence.]

**KB Reference:** TS-NNN · TS-NNN · TR-NNN
```

### Rules

- Name the conflict only when both principles genuinely apply to the same decision. Two unrelated findings on one screen are not a conflict.
- Cite a ranking only if it exists in `kb/tradeoffs/tr-ids.json` or in the project's house profile. A seed ranking is cited with `(seed)`.
- **No ranking on file:** state the conflict, make the call on its merits, mark it `no ranking on file`, and log a candidate in the coverage note: `[no TR entry: candidate "X over Y"]`. Never invent a ranking ID.
- Apply the same ranking the same way every time the same conflict appears in one critique. Inconsistent rulings within a single review are a defect.

## Defended breaks

A convicted design sometimes breaks a TS principle on purpose, because a higher-ranked principle demanded it. Before reporting a TS violation, run this check.

### The check

1. The design breaks a TS principle.
2. Does a ranking (shared TR, house H-TR) or the designer's stated intent put something above that principle here?
3. Is the break **consistent**? The same break, in the same circumstances, everywhere it could appear on the surface or across the system. A one-off break points to sloppiness. A consistent break points to a choice.
4. Does the break actually serve the higher principle it claims? A break that cites a ranking but does not deliver its benefit is still a violation.

If 2, 3 and 4 hold, report a **defended break** instead of a violation. Otherwise report the violation as usual.

### Grading tiers

| Evidence | Effect on the grade |
|----------|---------------------|
| Declared intent only ("we break One-Thing on the dashboard on purpose") | Removes the penalty. No lift. |
| A cited ranking on file, consistent across the surface | Counts as evidence toward **Convicted**. |
| Consistent across the system, where holding the ranking cost something visible | The strongest Convicted signal the tool recognizes. |

**The ceiling still caps the grade.** TS-011 sets how high a surface should climb. A defended break on a checkout cannot push it past where a checkout should go.

Declared intent is weighed, not taken on faith. The break still has to be consistent and still has to serve the stated ranking.

### Format

Use the taste finding shape with the `DEFENDED` eyebrow:

```
### [Finding-NN] [Narrative hook]: [the principle broken, on purpose]
`DEFENDED` · `CONVICTED` · TS-NNN broken for TR-NNN | H-TR-NNN | stated intent

> *Verdict: Protect it. [One sentence on why the break is the decision.]*

**What I see:** [the break, and where it recurs consistently]
**Why it holds:** [the ranking it serves, and the benefit visible on screen]
**Protect:** [what must stay true for the break to remain defensible]

**KB Reference:** TS-NNN · TR-NNN
```

## Coverage note additions

At the end of any critique that produced conflicts:

- List every conflict and the ranking that decided it.
- List conflicts decided with no ranking on file as TR candidates.
- List defended breaks and the evidence tier each reached.

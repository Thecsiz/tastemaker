# System Mode: Tastemaker

Use this mode to judge conviction where it actually lives: across many surfaces, over time. A single screen can show character. Only a system can show that a ranking was held where breaking it would have looked better.

## Input

System mode needs a set of surfaces, not one:

- Many screens across an app (a Figma file with many frames, a folder of screenshots, a live product walked with a browser tool).
- An app plus its platform touchpoints: settings, notifications, widgets, onboarding, empty and error states, emails.

With a single screenshot, say that system mode needs more than one surface, and run the standard critique instead.

## Workflow

1. **Inventory.** List the surfaces and group them by job (setup, core loop, configuration, recovery, communication).
2. **Rankings in force.** Read the shared TR entries and the project's house profile, if any. If the product has stated no rankings, infer candidate rankings from the strongest repeated decisions you see, and present them as candidates for the owner to confirm. Never apply an inferred ranking as if it were on file.
3. **Consistency pass.** For each ranking in force, check every surface where it could apply. Record where it holds and where it breaks.
4. **Homes pass.** For each capability that appears on more than one surface, name its canonical home. Duplicates that are not links back to the home are findings (TR-001).
5. **Voice pass.** Check TS-006 (Single Voice) across the system: type, tone, motion and density should read as one author across jobs, not one author per team.
6. **Held under pressure.** Look for the surfaces where breaking a ranking would have been locally better and check whether it held. These are the strongest conviction evidence.
7. **Output.**

## Output format

```
## System review: [product]

**Surfaces reviewed:** [count, grouped by job]
**Rankings in force:** [shared TR · house H-TR · inferred candidates]

| Ranking | Holds on | Breaks on | Verdict |
|---------|----------|-----------|---------|
| TR-NNN | [surfaces] | [surfaces] | Held · Defended break · Violated |

**Homes:** [capabilities with more than one home, and where each should live]

**Held under pressure:** [the clearest cases where a ranking cost something and held]

**System grade:** [Tasteful · Competent · Unrealized, judged on consistency of rankings across the system]
```

## Grading

- **Inconsistency is the main signal of missing conviction.** A ranking held on four surfaces and broken on the fifth is weaker than a ranking held on all five, even if the fifth break looks better locally.
- A consistent break that serves a higher ranking is a defended break (`references/conflicts-and-defended-breaks.md`), not a violation.
- The context ceiling applies per surface. A system can be Tasteful with conventional checkout surfaces and expressive identity surfaces, as long as each reaches its own ceiling and the rankings hold.

## Candidates

System-scale principles that a single screen cannot show belong at the Convicted rung. When one recurs, log it as a TS candidate in the coverage note. The first candidate: **"Principles held under pressure":** the ranking holds on the surface where breaking it would have looked better. Promote only after recurrence.

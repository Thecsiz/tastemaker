---
id: CR-102
title: "Cap the Type Scale"
dimension: type-hierarchy
measurable: true
consensus: strong
sources:
  textbook: "Erik Kennedy / Learn UI Design; Refactoring UI"
  tastemaker: "Erik Kennedy"
tags: [type-scale, sizes, modular-scale, restraint]
---

# Cap the Type Scale

## Rule
Use a small, defined set of font sizes — roughly **4 to 6** distinct sizes drawn from a modular scale (a consistent ratio, ~1.2–1.25). Not 8+ ad-hoc sizes that drift by a pixel or two.

## Why it matters
A handful of deliberate sizes reads as a *system*; a sprawl of near-identical sizes (15px, 16px, 17px, 18px…) reads as accidental. Like the spacing scale (CR-001), a capped type scale is what makes typography feel engineered rather than hand-tuned per element. Too many sizes also flattens hierarchy — when everything is *slightly* different, nothing is clearly different.

## How to spot it
Inventory the distinct font sizes on the screen. More than ~6, or sizes that differ by 1–2px (16 and 17 and 18 all in play), is the violation. A clean design will show a recognizable ladder: e.g. 12 / 14 / 16 / 20 / 32.

## The fix
Define a type scale as tokens and snap every size to it. Collapse near-duplicate sizes (is 17px really doing something 16px can't?). Generate the scale from a ratio so the steps feel proportionate.

## Eye-training
Once you've worked with a capped scale, off-scale type sizes start to feel like the 11px-spacing snag — a value that doesn't belong. Build the habit of choosing from the ramp, never typing a one-off size.

## When to flex
A genuinely typographic product (an editorial site, a publication) may use a richer scale with more steps — but it's still a *defined* scale, not ad-hoc. The cap is a default for product UI; it loosens for type-forward design, never into arbitrariness.

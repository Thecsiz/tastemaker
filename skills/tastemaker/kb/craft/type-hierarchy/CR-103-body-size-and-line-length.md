---
id: CR-103
title: "Readable Body: Size & Line Length"
dimension: type-hierarchy
measurable: true
consensus: strong
sources:
  textbook: "Erik Kennedy; Butterick's Practical Typography; WCAG"
  tastemaker: "Erik Kennedy (Learn UI Design)"
tags: [body-text, legibility, line-length, measure, reading]
---

# Readable Body: Size & Line Length

## Rule
Body text on the web: **16–18px minimum** (never below 14px for sustained reading). Line length (the "measure"): **45–75 characters**, ~65 ideal. Line-height for body: **~1.4–1.6**.

## Why it matters
These are the most-tested numbers in typography, and getting them wrong has an immediate cost: text below 16px strains readers and signals "didn't think about reading"; lines longer than ~75 characters make the eye lose its place returning to the next line; lines shorter than ~45 chop the rhythm. Comfortable body type is invisible — uncomfortable body type is felt on every line. This is the floor of legibility, distinct from usability (it's not "can they read it" but "is it well-set").

## How to spot it
Measure the body size — under 16px on web is a flag. Count characters per line in a paragraph — over ~75 (text running the full width of a wide container with no max-width) or under ~45 is the violation. Tight line-height on body (1.2 or less) reads cramped.

## The fix
Bump body to 16–18px. Constrain text columns with a max-width (~65ch) so lines don't run too long on wide screens. Set body line-height to ~1.5.

## Eye-training
Once calibrated, too-small body type and over-long lines become viscerally uncomfortable to read — you'll feel the strain before you measure it. Read long-form on well-set sites (any serious editorial product) to calibrate what comfortable measure and size feel like.

## When to flex
Dense UI (data tables, captions, metadata) legitimately runs smaller than 16px — these aren't sustained-reading contexts. The 16px floor is for *body copy* the user actually reads, not every label. Line-length applies to prose, not to single-line UI text.

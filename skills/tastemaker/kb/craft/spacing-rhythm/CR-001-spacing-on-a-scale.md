---
id: CR-001
title: "Spacing Lives on a Scale"
dimension: spacing-rhythm
measurable: true
consensus: strong
sources:
  textbook: "Refactoring UI — Spacing & sizing systems"
  tastemaker: "Material Design (8pt grid); Karri Saarinen / Linear (papercut discipline)"
tags: [scale, spacing, systematic, 8pt-grid]
---

# Spacing Lives on a Scale

## Rule
Every margin, padding, and gap should come from one defined spacing scale — not arbitrary values. A common, proven scale: **4, 8, 12, 16, 24, 32, 48, 64, 96** (a roughly-1.5× ramp built on an 8px base, with 4 for fine work). If a spacing value isn't on the scale, it's a defect.

## Why it matters
A consistent scale is what makes a layout read as *systematic* rather than hand-placed. The eye can't name the scale, but it feels its absence: ad-hoc values (11px here, 13px there, 18px somewhere else) produce a subtle raggedness that registers as "undesigned" even when nothing is obviously wrong. This is the single most common craft tell, and the cheapest to fix. It's also the foundation everything else rests on — you can't have rhythm (CR-004) or clean alignment (CR-401) without a scale underneath.

## How to spot it
Sample the actual spacing values across the screen. If they cluster to a scale (multiples of 8, with some 4s), it holds. If you find a spread of off-scale values — 11, 13, 18, 22, 30 — that's the violation. In Figma you can read the real numbers; from a screenshot, look for spacing that's *almost* but not quite consistent.

## The fix
Snap every off-scale value to the nearest scale step. Define the scale as tokens/variables so new spacing inherits it. Don't eyeball gaps — pick from the scale.

## Eye-training
Squint at the screen until detail blurs. Off-scale spacing shows up as a faint unevenness in the rhythm — bands that don't quite line up, gaps that feel slightly off. Once you've trained on it, you'll feel the "snag" of an 11px gap in a sea of 8s and 16s, and you'll stop placing ad-hoc spacing in the first place. The goal is to reach for the scale by reflex.

## When to flex
The *specific* scale is a choice (some teams use a 4px base, some a modular ratio) — what's non-negotiable is that there *is* a scale and it's honored. Optical adjustments are allowed: a 1–2px nudge to make something *look* aligned (see CR-401) overrides the scale locally, because the eye outranks the math. That's a deliberate exception, not ad-hoc drift.

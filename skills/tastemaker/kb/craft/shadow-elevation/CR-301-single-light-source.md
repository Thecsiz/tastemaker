---
id: CR-301
title: "One Light Source"
dimension: shadow-elevation
measurable: partial
consensus: law
sources:
  textbook: "Refactoring UI — Creating depth; Josh Comeau — Designing Beautiful Shadows in CSS"
  tastemaker: "Josh Comeau; Refactoring UI (Wathan & Schoger)"
tags: [shadow, light-source, depth, elevation, offset]
---

# One Light Source

## Rule
All shadows on a surface share **one consistent light source** — conventionally from above, so shadows fall *below* elements (positive vertical Y-offset, horizontal offset usually 0). Comeau's ratio: the vertical offset is ~2× the horizontal. Don't make a shadow visible with blur alone — give it a Y-offset so it reads as cast by overhead light.

## Why it matters
A single consistent light source is the most basic rule of depicting depth — it's how the real world works and how the eye expects shadows to behave. Inconsistent light direction (one shadow below, another to the right, a third with a glow on all sides) is the #1 tell of amateur shadows: the scene becomes physically impossible and reads as "wrong" even to viewers who can't say why. Shadows that are all blur and no offset look like a fuzzy halo, not a cast shadow.

## How to spot it
Check that every shadow on the page falls the same direction (below, slightly down). Tells: shadows with equal blur on all sides (no directional offset → glow, not shadow); different elements casting shadows in different directions; a shadow above an element while others are below.

## The fix
Set one light direction for the whole UI — almost always "from above": positive Y-offset, ~0 X-offset. Make every shadow obey it. If you want a visible edge without direction, that's a border or a ring, not a shadow.

## Eye-training
Glow-not-shadow (all-around blur) is the most common version — once you can distinguish "this is lit from above" from "this is glowing," you'll catch it instantly. Look at any physical object on a desk: the shadow is below and offset. Match that.

## When to flex
Deliberate non-realist styles (neon glows, inner-shadow "inset" effects, brand-specific lighting) are valid *choices* — the rule guards against *accidental* inconsistency, not intentional stylization. Even then, the chosen lighting should be consistent across the surface.

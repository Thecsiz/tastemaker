---
id: CR-402
title: "One Strong Edge"
dimension: alignment-grid
measurable: true
consensus: strong
sources:
  textbook: "Refactoring UI; Müller-Brockmann grid tradition"
  tastemaker: "Refactoring UI (Wathan & Schoger)"
tags: [alignment, edge, grid, margin, structure]
---

# One Strong Edge

## Rule
Establish **strong, consistent alignment edges** and hold them. Content should share a left edge (or a deliberate center axis) that runs cleanly down the layout. Elements that break the established margin by a few pixels — or float with no shared edge — read as careless. Pick the grid/columns and don't let things drift off it.

## Why it matters
Alignment is the invisible scaffolding the eye uses to feel order. A clean shared edge makes a layout feel structured and calm even when it's dense; ragged edges (elements indented by 2–6px for no reason, a heading that doesn't line up with the body it introduces) make it feel sloppy regardless of how nice the individual pieces are. This is purely mechanical and purely fixable — there's no taste judgment, just discipline.

## How to spot it
Drop an imaginary vertical line down the left edge of the content. Does everything meet it, or do some elements sit a few pixels in or out? Tells: a card's content not aligning with the section heading above it; list items with inconsistent left padding; an element nudged off the margin with no optical reason (CR-401 is the *only* legit reason to break alignment).

## The fix
Snap stray elements back to the shared edge / grid column. Use a consistent container padding and column system. If something must break the edge, it should be a deliberate, repeated pattern — not a one-off drift.

## Eye-training
Squint and look only at the left edges — misalignments pop out as a ragged vertical line instead of a clean one. Train the habit of checking edges last, before shipping: "does everything line up?" Off-grid drift is one of the easiest tells to learn to see.

## When to flex
Intentional asymmetric/broken-grid layouts (editorial, expressive design) deliberately break alignment for composition — but they break it *boldly and on purpose*, not by 3px of accidental drift. Optical alignment (CR-401) is the other sanctioned break. The rule guards against *accidental* raggedness.

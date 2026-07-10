---
id: CR-204
title: "Semantic Consistency & Perceptual Ramps"
dimension: color-contrast
measurable: partial
consensus: strong
sources:
  textbook: "Evil Martians (OKLCH); design-systems practice"
  tastemaker: "Evil Martians; design-systems engineering community"
tags: [semantic-color, oklch, hsl, perceptual, consistency]
---

# Semantic Consistency & Perceptual Ramps

## Rule
A color must mean **one thing** across the product — red is either "destructive/error" or "on sale," not both. And build color ramps in a **perceptually uniform space (OKLCH)**, not HSL: equal HSL lightness looks wildly different across hues (a yellow and a blue at the same `L` are nowhere near equal brightness), which breaks both contrast and even-looking ramps.

## Why it matters
**Semantic drift erodes trust silently:** if red means "danger" on one screen and "discount" on the next, the user's learned association breaks and every red now requires a second look. Consistent semantic color is part of what makes a product feel coherent (it's the color expression of single-voice). **Perceptual color space** matters because HSL lies: ramps built in HSL have uneven brightness steps and unpredictable contrast, so your "same lightness" tints aren't, and your generated shades look lumpy. OKLCH gives even steps and predictable contrast.

## How to spot it
Semantic: track each accent/semantic color across screens — does red (or green, or the brand color) ever carry a second meaning? Perceptual: a color ramp where the steps look uneven (a big jump between two, a tiny one between others) is usually HSL-built; brightness that jumps around across same-`L` hues is the tell.

## The fix
Semantic: assign each meaning one token and use it everywhere; if you need "sale," give it its own color, don't reuse error-red. Perceptual: define ramps in OKLCH (or a perceptual tool) so lightness steps are even and contrast is predictable across hues.

## Eye-training
Semantic: notice when a color makes you pause to ask "wait, is this bad or good here?" — that hesitation is the drift. Perceptual: build the same ramp in HSL and OKLCH side by side and watch the HSL one's steps look uneven — once seen, lumpy ramps become obvious.

## When to flex
OKLCH is strongly-rising consensus, not yet universal — HSL/RGB ramps that happen to be hand-tuned to look even are fine; the rule guards against *trusting* HSL math for evenness. Semantic consistency is near-universal and flexes little — a color carrying two meanings is almost always a defect.

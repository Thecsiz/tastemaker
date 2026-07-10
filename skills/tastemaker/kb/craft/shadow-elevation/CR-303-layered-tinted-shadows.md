---
id: CR-303
title: "Layered, Tinted Shadows"
dimension: shadow-elevation
measurable: partial
consensus: strong
sources:
  textbook: "Tobias Ahlin — Layered box-shadows; Josh Comeau — Shadow Palette Generator"
  tastemaker: "Tobias Ahlin; Josh Comeau"
tags: [shadow, layering, tint, penumbra, realism]
---

# Layered, Tinted Shadows

## Rule
For shadows that need to feel real, **stack several** (≈3–5, each roughly doubling offset+blur) instead of one — this approximates a real penumbra (the soft gradient at a shadow's edge). And **tint** the shadow toward the background hue at low saturation rather than using pure `rgba(0,0,0)`.

## Why it matters
A single `box-shadow` has one hard, uniform falloff — real shadows fade gradually, and the eye notices the difference even subconsciously: layered shadows look "expensive," single ones look "default." Pure-black shadows are the other tell — on a colored or warm background, black reads as a dirty gray *smudge*, not a shadow; a shadow tinted toward the surface hue looks like light behaving correctly. Together these are the difference between a shadow that disappears into realism and one that announces "CSS default."

## How to spot it
A single hard-edged shadow with uniform darkness (vs. the soft graduated edge of a layered one). A grayish, slightly-dirty cast under elements on a non-white background → pure-black shadow that should be tinted. Banding at the shadow edge.

## The fix
Replace the single shadow with a layered stack (Ahlin's pattern: 3–5 shadows, doubling offset/blur, alpha tuned per layer). Tint the shadow color toward the background hue at low saturation/lightness (Comeau's Shadow Palette Generator builds these). Caveat: layered shadows cost paint performance on low-end mobile — use the technique where it earns its keep.

## Eye-training
Put a single-shadow card next to a layered-shadow one — the single one suddenly looks flat and hard. Put a black shadow next to a tinted one on a colored bg — the black looks dirty. Once seen, the "CSS-default shadow" becomes instantly recognizable.

## When to flex
Performance-critical or very flat designs may stick to a single simple shadow (or none) deliberately — fine. Pure-black shadows on a pure-white background are *less* wrong than on colored backgrounds (there's nothing to tint toward). This is a polish/craft rule, strong among craft-focused devs but the most "advanced" of the shadow rules — a single clean shadow obeying CR-301/302 is already good; layering is the next level.

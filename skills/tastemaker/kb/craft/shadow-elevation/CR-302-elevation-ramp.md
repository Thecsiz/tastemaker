---
id: CR-302
title: "Elevation Is a Ramp: Bigger + Softer + Lighter"
dimension: shadow-elevation
measurable: true
consensus: strong
sources:
  textbook: "Refactoring UI; Josh Comeau; Material Design (elevation levels 0–5)"
  tastemaker: "Josh Comeau; Material Design"
tags: [elevation, shadow-ramp, depth, system, blur]
---

# Elevation Is a Ramp: Bigger + Softer + Lighter

## Rule
Define a **small set of elevation steps** (~3–6, like Material's 0–5) and use shadows from that ramp — not ad-hoc per element. As an element rises, its shadow gets **larger Y-offset + larger blur, and slightly lower opacity**. Low elements (buttons, inputs) get tight, near shadows; high elements (modals, popovers) get large, diffuse ones.

## Why it matters
Elevation is a *language* — the size and softness of a shadow tells the user how "high" something floats and therefore how important/transient it is (a tooltip floats higher than a card). That language only works if it's systematic: a defined ramp means a modal always reads as more elevated than a card. Ad-hoc shadows (a different blur/offset invented per component) break the hierarchy and read as inconsistent, the shadow-equivalent of off-scale spacing.

## How to spot it
Count distinct shadow definitions. 4+ unrelated shadow values (different blurs/offsets with no system) is the tell. Or the inverse error: a button with a huge diffuse shadow and a modal with a tight one — elevation reversed. A flat ramp where everything has the same shadow is also a miss (no hierarchy).

## The fix
Define a 3–6 step elevation token set; assign each component a level. Within the ramp, scale offset and blur up together and ease opacity down as elevation rises. Reserve the biggest shadows for the most-elevated, most-transient surfaces.

## Eye-training
Squint at a screen with shadows — can you tell what's "higher" than what? If a card and a modal cast the same shadow, the depth language is broken. Train on Material's levels or a mature system's elevation tokens to calibrate what "one step up" should look like.

## When to flex
Very flat design languages use minimal or no shadow and express elevation through other means (borders, layering, tonal shifts — Material 3 itself adds tonal overlays). The ramp principle still applies to *whatever* depth cue you use: it should be a small, consistent, ordered set.

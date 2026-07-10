---
id: CR-403
title: "One Radius System"
dimension: alignment-grid
measurable: true
consensus: strong
sources:
  textbook: "Refactoring UI — corner radius consistency; Material Design 3 — shape scale"
  tastemaker: "Material Design (shape system); Jaytel/Taste generated skill (radius language)"
tags: [radius, corner, shape, pill, consistency, system]
---

# One Radius System

## Rule
Corner radii come from **one small, deliberate set** (e.g. a 3-step ramp: small 4–8px, medium 12–16px, large 20–28px, plus full-pill for capsule controls), applied by element role — not picked per-element. Don't mix sharp (0px) rectangles and fully-rounded pills *in the same control family*; pick a shape language and hold it. Pills/capsules use radius = half their height; nested elements step *down* in radius so an inner corner never has a larger radius than the surface containing it.

## Why it matters
Radius is a system property, like spacing or type scale — and like those, inconsistency reads as "undesigned" before the viewer can name why. A card at 16px next to a button at 4px next to an input at 11px feels assembled from parts, not designed as a whole. Radius also carries *tone*: tight radii read precise/utilitarian, generous radii read soft/friendly — so an unsystematic mix sends mixed tonal signals and undercuts a single voice (the craft-floor counterpart to TS-006). Concentric mismatches (a sharp inner corner poking out of a rounded container, or an inner radius larger than its parent) are a specific, visible defect.

## How to spot it
Scan every corner on the surface. Tells: three different "rounded" values that look almost-but-not-quite the same (no shared scale); a pill button sitting inside a sharp-cornered card in the same group; an inner element whose radius ≥ its container's radius (broken concentricity); a single rogue element at a radius that appears nowhere else.

## The fix
Define a radius ramp as tokens (e.g. `radius-sm/md/lg/full`) and assign by role: inputs and chips, cards and panels, modals, full-pill controls. Replace every ad-hoc value with the nearest token. For nested rounded elements, set the inner radius = outer radius − padding (so corners stay concentric). Resolve sharp-vs-round conflicts by committing the whole family to one language.

## Eye-training
Train on concentricity first — once you can see "the inner corner is fighting the outer corner," radius mistakes jump out everywhere. Look at a physical rounded card with a rounded photo inside it: the inner curve is *tighter* than the outer, never looser. Then train on the ramp: pick any well-made product and count its distinct radii — you'll rarely find more than 3–4, and never a near-duplicate pair.

## When to flex
The *number of steps* is a heuristic, not a law — a deliberately minimal system may use one radius everywhere, and an expressive brand may run a wider ramp on purpose. Sharp-cornered design (0px everywhere) is a fully valid, often strong choice — the rule forbids *accidental mixing*, not committed sharpness. Concentricity (inner ≤ outer) is the closest thing here to a hard rule; the ramp discipline is strong-consensus but bends for intentional expressive systems.

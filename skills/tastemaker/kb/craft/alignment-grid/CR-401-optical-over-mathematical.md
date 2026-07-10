---
id: CR-401
title: "Optical Over Mathematical Alignment"
dimension: alignment-grid
measurable: partial
consensus: strong
sources:
  textbook: "Type-setting tradition; Refactoring UI"
  tastemaker: "Rauno Freiberg / the design-engineering craft set; icon-design practice"
tags: [optical-alignment, centering, icons, polish, pixel]
---

# Optical Over Mathematical Alignment

## Rule
Align by **eye, not by math, when they disagree.** Some shapes are mathematically centered but look off — a triangle/play-icon in a circle, a glyph with uneven sidebearings, text that's box-centered but visually high. Nudge them 1–2px until they *look* right. The eye outranks the coordinates.

## Why it matters
This is the deepest "tell" of craft attention — the difference between a designer who centers with the align button and one who centers with their eye. Mathematically-but-not-optically aligned elements produce a low-grade wrongness the user feels without locating: the play button that looks shoved left (because the triangle's mass is left-heavy), the icon that sits slightly high in its button. Fixing it is invisible when done and conspicuous when not — it's the canonical "details only someone who cared would touch."

## How to spot it
Look hard at centered icons and glyphs: play/triangle icons (almost always need nudging right), single letters in avatars/badges, icons paired with text (the icon often sits optically high). If it's "centered" per the tool but your eye says it's off — trust your eye.

## The fix
Nudge the element 1–2px toward where it *looks* centered (a play triangle right; a top-heavy glyph down). This deliberately breaks the spacing scale (CR-001) locally — that's correct; optical adjustment is the sanctioned exception. Bake known optical offsets into icon components.

## Eye-training
Stare at a play-button icon mathematically centered in a circle — it looks left-shifted because the triangle's visual weight is left. Nudge it right until it looks centered, note the offset. Once you've done this a few times, "mathematically centered but wrong" becomes something you see immediately, everywhere.

## When to flex
This is itself the flex on CR-001 (the spacing scale) — optical alignment is *when* you break the math. There's no flexing the rule the other way: if it looks off, it is off, regardless of what the coordinates say.

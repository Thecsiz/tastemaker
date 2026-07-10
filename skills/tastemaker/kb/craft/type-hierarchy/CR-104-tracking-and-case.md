---
id: CR-104
title: "Tracking by Size & Case"
dimension: type-hierarchy
measurable: partial
consensus: strong
sources:
  textbook: "Refactoring UI; type-setting tradition"
  tastemaker: "Refactoring UI (Wathan & Schoger)"
tags: [letter-spacing, tracking, all-caps, display-type]
---

# Tracking by Size & Case

## Rule
Adjust letter-spacing by size and case: **tighten** large display type (slightly negative tracking, e.g. -0.01 to -0.03em); leave **body** at default (0); **add** tracking to all-caps and small eyebrow labels (≥0.05–0.1em). Tracking is a function of size and case, not a global setting.

## Why it matters
Type is drawn for a default size; at the extremes it needs correction. Large headings set at default tracking look loose and gappy — tightening them restores density and confidence. All-caps text set at default tracking looks cramped and hard to read — the uppercase forms need breathing room. These adjustments are small but they're the difference between type that looks set-by-a-typographer and type that looks dropped-in.

## How to spot it
Large headlines that look airy/gappy between letters → needs tightening. All-caps labels that look jammed together → needs tracking added. Body text with any tracking applied → usually a mistake (leave it at 0).

## The fix
Negative tracking on display sizes (scale it with size — bigger = tighter). Positive tracking on all-caps and small uppercase labels. Default (0) on body.

## Eye-training
Set a large headline at default tracking, then tighten it -0.02em and watch it "snap" into looking intentional. Do the same with an all-caps label going the other way. Once you've felt the difference, loose display type and cramped caps become obvious tells.

## When to flex
Some typefaces are drawn with optical sizing that handles this automatically (variable fonts with an `opsz` axis) — then manual tracking is less needed. The amounts are taste-calibrated, not fixed; the *direction* (tighten display, space caps) is the consensus.

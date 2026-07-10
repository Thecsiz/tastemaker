---
id: CR-002
title: "Proximity Groups Meaning"
dimension: spacing-rhythm
measurable: partial
consensus: strong
sources:
  textbook: "Refactoring UI — Spacing; Gestalt proximity"
  tastemaker: "Refactoring UI (Wathan & Schoger)"
tags: [proximity, grouping, gestalt, hierarchy]
---

# Proximity Groups Meaning

## Rule
Related elements get *less* space between them than to unrelated elements. The inner spacing of a group must be tighter than the spacing separating it from the next group. A label and its value, an icon and its text, a heading and its paragraph — these belong together and should be spaced as a unit.

## Why it matters
Proximity is how the eye parses structure before reading a word — it's the most powerful grouping tool you have, and it costs nothing. When inner and outer spacing are equal (or backwards — more space inside a group than between groups), the user can't tell what belongs to what, and the layout reads as an undifferentiated list. Correct proximity makes hierarchy *felt* without borders, boxes, or color.

## How to spot it
Look at any label-value pair, list item, or form field. Is the gap *within* the unit smaller than the gap to the next unit? The classic violation: a heading sitting equidistant between the paragraph above it and the paragraph below — it should hug the paragraph it introduces.

## The fix
Tighten intra-group spacing, widen inter-group spacing — both from the scale (CR-001). A heading should sit closer to the text it leads than to the section before it. Aim for a clear ratio (e.g. 8px within, 32px between).

## Eye-training
Practice asking "what belongs together here?" then check whether the spacing agrees. Mismatched proximity feels like items "floating" with no clear parent. Once you see it, equidistant spacing will start to look obviously wrong — a heading marooned between two paragraphs will jump out.

## When to flex
Genuinely co-equal items (a flat menu of unrelated toggles) can be evenly spaced — there's no grouping to express. The rule applies wherever a hierarchy of relatedness exists, which is most of the time.

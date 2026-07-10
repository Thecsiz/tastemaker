---
id: CR-003
title: "Whitespace Before Borders"
dimension: spacing-rhythm
measurable: partial
consensus: strong
sources:
  textbook: "Refactoring UI — Don't reach for a border"
  tastemaker: "Refactoring UI (Wathan & Schoger)"
tags: [whitespace, borders, separation, restraint]
---

# Whitespace Before Borders

## Rule
To separate elements, reach for **space first**, then a background-color shift, and only then a border or shadow. Borders are the last resort, not the default. Most things that designers separate with a line would separate more cleanly with more room.

## Why it matters
Borders add visual noise — every line is something the eye has to process and account for. A design that separates everything with borders feels busy and boxed-in; the same layout separated with whitespace feels calm and open. Space is the cheapest, quietest separator, and "start with too much, then remove" reliably produces a more refined result than "add lines until it's clear."

## How to spot it
Count the borders and dividers. If most groupings are fenced with lines — every card outlined, every row divided, every section boxed — the design is leaning on borders where space would do. A "spreadsheet of boxes" look is the tell.

## The fix
Remove borders and add space. Where a card needs to feel contained, try a subtle background tint before an outline. Reserve actual borders for cases where space genuinely can't do the job (a tight data table, an input field that needs a clear hit area).

## Eye-training
When you feel the urge to draw a line, pause and ask "would more space solve this?" Usually it would. Train yourself to see borders as a cost. Look at calm, refined interfaces (Linear, Things) and notice how *few* lines they use — separation is almost all space and tone.

## When to flex
Borders earn their place where space can't: dense data tables (rows need delineation in tight space), input fields (a clear interactive boundary), and deliberate framing. The rule is "space first," not "borders never."

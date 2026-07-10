---
id: TS-010
title: "Editing vs. Listing"
category: Simplicity & Reduction
tags: [simplicity, reduction, editing, hierarchy, grouping]
rubric_dimension: clarity
rung: coherent
weight: foundational
related:
  - id: TS-002
    type: complements
  - id: TS-003
    type: deepens
  - id: TS-007
    type: contrasts
---

# Editing vs. Listing

## Definition

When a design has many things to present — settings, options, features, list items — it can do one of two things, and the difference is taste. It can *list* them: place each item at roughly equal weight, in order of whatever came to mind, and let the user sort it out. Or it can *edit* them: decide what matters most, group related items, establish a rhythm, demote the rare and elevate the common, and present the same content as a considered, scannable structure. Listing is the absence of a decision; editing is the decision made. A long screen is not automatically a failure — a *listed* screen is, because it has pushed the work of finding order onto the user. Reduction is not always about removing items (often you can't); it is about imposing order on the items that remain.

## Why It Matters

Editing is the most invisible form of taste because its product looks effortless — a well-edited settings screen seems obvious, as if it could only have been arranged this way, and the labor of deciding the grouping, the order, and the hierarchy disappears into the result. Listing is the default that happens when no one does that labor: the options accumulate in the order they were built, each one added at the same weight as the last, and the screen grows into an undifferentiated wall. The user feels the difference as cognitive load. On an edited screen, the eye finds the relevant cluster and the right control quickly, because the structure has already done the sorting. On a listed screen, the user must read every item to locate the one they want, because nothing signals where to look.

The deeper point is that editing is a sign of understanding. To group settings well, you have to understand how users actually think about them. To decide what to elevate and what to demote, you have to know what's common and what's rare. To reduce a wall of equal options into a calm, scannable set, you have to comprehend the whole well enough to give it shape. A listed screen reveals that this understanding was never applied — the design knew *what* the options were but never decided what they *meant* relative to each other. This is why simplicity-through-editing reads as mastery, and why a "simple-looking" complex screen is often more impressive than a genuinely sparse one.

## How to Evaluate

- Ask whether the items have been *grouped* or merely *stacked*. Are related options clustered with clear separation between clusters, or is it a flat run of equal-weight rows? Grouping is the first evidence of editing.
- Check for hierarchy within the abundance. Has the design elevated the common and demoted the rare, or does a once-a-year setting sit at the same weight as a daily one? Equal weight across unequal importance is the listing tell.
- Apply the subtraction test where removal is possible: would taking this item out (or collapsing it behind a disclosure) make the screen better? If yes for several items, the design added without editing.
- Look at the ordering. Is the sequence meaningful (by frequency, by task, by logical relationship), or is it arbitrary (by build order, alphabetical-by-accident, or no discernible logic)? Meaningful order is editing; arbitrary order is listing.
- Distinguish reduction-by-editing from reduction-by-hiding. Good editing makes complexity *navigable* (grouping, progressive disclosure at the right moment); lazy reduction *buries* things the user needs. The test is whether the structure helps the user find things faster, not whether it simply shows fewer of them.

## Exemplars

**An edited settings screen (stoic.-class).** A list of preference toggles that has been grouped into two clear clusters separated by a hairline, under a calm heading, with restrained type. There are many options, but they've been *reduced to order*: related toggles sit together, the groups have a logic, and the eye can scan the structure rather than reading every row. Nothing was necessarily removed — the taste is entirely in the arrangement. The screen feels simple because it was edited, not because it is short.

**Counter-example: the listed settings screen (Picsart-class).** Eight or more setting rows — Contacts, Devices, Notifications, Tutorial Maker, Language, Content, and more — presented at near-equal weight, ungrouped beyond thin generic dividers, with one stray colored toggle breaking the rhythm and a floating control overlapping a label. Each row is individually fine. Collectively they're a wall, because no one decided what relates to what, what's common versus rare, or what order would help. The user has to read the whole list to find anything. The fix is rarely "remove settings" (they may all be needed) — it's to *edit*: group them into meaningful clusters, order by frequency of use, and let the structure do the finding.

**The contrast with Earned Density (TS-007).** Editing and earned density are close cousins but distinct. Earned density is about giving a *deliberately dense* layout a rhythm so it reads as a command center. Editing-vs-listing is about whether a set of items received the *decision* of grouping and hierarchy at all. A dense screen can be both densely packed and well-edited (Mixpanel); a sparse screen can still be poorly edited (a short but arbitrarily-ordered, ungrouped list). They reinforce each other but answer different questions.

## When to Flex

Some lists are legitimately flat and should stay that way. A simple, short set of genuinely co-equal options (three account actions, a handful of unrelated toggles) needs no elaborate grouping — imposing artificial clusters on a handful of items is its own kind of over-design. The principle applies with force as the count grows and as natural groupings exist; it doesn't demand structure where there's nothing to structure.

Reference and exhaustive surfaces also flex. A full settings catalog, an admin panel, or a complete reference list may legitimately need to show everything, and the editing shows up not as removal but as search, filtering, and grouping that make exhaustiveness navigable. The goal there is "complete and findable," not "short."

**Defaults and systems are not the enemy — *unconsidered* defaulting is.** This principle is about abdication, not about avoiding defaults. A well-chosen default, a smart template, a sensible component-library arrangement is often the *most* tasteful move: it spends the designer's editing judgment once, at the system level, so every instance inherits a considered structure. That is editing, not listing — the decision was made upstream. The failure this principle names is the *absence* of any deciding hand: items appended in build-order, a template reached for without asking whether it fits, structure left to chance. Don't read "decided, not defaulted" as "bespoke everything" — read it as "someone, somewhere, made the call." A thoughtful default carries a decision; a thoughtless one ducks it. Judge whether the decision was made, not whether a default was used.

A note on org and product process: listed screens are very often the residue of accretion — features and settings added one release at a time, each appended to the end, no one ever returning to re-edit the whole. The wall isn't a single bad decision; it's the absence of a periodic editing pass. When you find a listed screen, the durable fix is usually a process one (someone owns re-editing the surface as it grows), not a one-time rearrangement that the next three features will undo.

## Sources

- Dieter Rams, "Good design is as little design as possible" and the broader reductive tradition — reduction as a positive act of understanding, not mere removal.
- John Maeda, *The Laws of Simplicity* — "organize" and "reduce" as the first laws; grouping as the primary tool of simplicity.
- Complements TS-002 (Unused Tools as Strength) — restraint in tools; this is restraint in *arrangement* — and contrasts with TS-007 (Earned Density).
- Surfaced and validated across tastemaker runs: stoic. settings (positive — edited and grouped), Picsart settings (negative — listed and flat).

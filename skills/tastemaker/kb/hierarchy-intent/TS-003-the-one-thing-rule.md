---
id: TS-003
title: "The One-Thing Rule"
category: Hierarchy & Intent
tags: [hierarchy, focus, decisiveness, emphasis]
rubric_dimension: clarity
rung: coherent
weight: foundational
related:
  - id: TS-002
    type: complements
  - id: UX-081
    type: extends
---

# The One-Thing Rule

## Definition

Every surface should have a single thing it most wants you to understand or do, and the design should make that one thing undeniable. This is not the same as having one element — a screen can be rich and dense and still have a clear protagonist. The One-Thing Rule asks whether the design has decided what matters most and committed its hierarchy to that decision. A surface that treats four things as equally important has, in effect, decided that nothing is important, and it pushes the work of prioritizing onto the user.

## Why It Matters

Attention is the scarcest resource in any interface, and hierarchy is how a design spends it on the user's behalf. When a design names its one thing, the user is oriented in the first second: they know what this is, what it wants, and where to look. When a design refuses to choose — equal-weight cards, competing CTAs, a headline that fights its own hero image — the user must do the prioritizing themselves, and that cognitive tax registers as friction even when every individual element is well made.

This is a taste dimension, not merely a usability one, because the failure is rarely about legibility. The elements are often perfectly readable. The failure is about *conviction*: the design didn't have an opinion about its own purpose. You can feel the difference between a screen made by someone who knew exactly what it was for and a screen made by someone who hedged. The first feels decisive; the second feels like a committee. The One-Thing Rule is the most basic expression of design having a point of view about itself.

## How to Evaluate

- Look at the surface for one second, then look away. What do you remember wanting to do or understand? If the answer is clear and singular, the rule holds. If you remember a wash of equally-weighted options, it doesn't.
- Count the elements competing for primary attention — dominant-weight type, high-saturation color, large size, isolation in space. There should be one clear winner. Two or more co-equal claimants is a hierarchy failure.
- Check for duplicate-intent CTAs. "Get started" in the nav, "Try it free" in the hero, "Sign up" in the band below — three buttons, one intent, diluted three ways. One intent should resolve to one dominant action.
- Distinguish dominance from loudness. The one thing doesn't have to be the biggest or brightest — it has to be the *clearest*. A small, perfectly isolated element on a calm field can be the protagonist. Evaluate clarity of priority, not volume.

## Exemplars

**The asymmetric split hero with one action.** A hero that places a single, decisive headline and one primary button on the left, a single product asset on the right, and nothing else competing — no trust micro-strip, no version badge, no secondary tagline below the CTA. The eye lands on the headline, moves to the button, understands the product. The discipline of putting everything else in the sections *below* the hero is what lets the one thing dominate. The hero made a decision about what mattered most and protected it.

**Search-first home pages.** Google's home page is the canonical instance: a single field, radically isolated, with everything else demoted to the margins. The design decided that one thing — search — is the entire purpose, and the hierarchy is so committed that the page would feel absurd with a second co-equal element. The clarity is the point of view.

**Counter-example: the four-equal-cards landing section.** A section presenting four feature cards of identical size, weight, and color, arranged in a row. Each is fine in isolation. Together they communicate "here are four things, all equally important, you figure out which one matters to you." The design declined to have an opinion, and the user pays for it. The fix is rarely "make them prettier" — it's "decide which one leads, and let the others support."

## When to Flex

Some surfaces legitimately serve multiple co-equal purposes, and forcing a single protagonist would distort them. A dashboard's job is often to present several streams of information at comparable priority; a settings page is a deliberate menu of equals; a comparison table exists precisely to weigh options against each other. In these cases, the "one thing" may be a clear *organizing logic* rather than a single dominant element — the design's decisiveness shows up in how cleanly it groups and sequences the equals, not in elevating one above the rest.

The rule also flexes by altitude. A focused task flow should have one thing per step. A reference surface (documentation, a catalog) may intentionally present many things, with the one-thing discipline applied at the level of "what is this page's role in the journey" rather than "what is the single dominant element."

A note on org practice: stakeholder pressure is the most common cause of one-thing failure. Every team wants their feature in the hero, and the path of least resistance is to give everyone equal weight. When a surface has four co-equal CTAs because four teams each demanded one, the design didn't fail — the prioritization did. Name it as an organizational decision, not a craft one, because the fix lives upstream of the pixels.

## Sources

- Extends UX-081 (Affordance Clarity) — where ux-critique asks "is the action obvious," this asks "is there a single most-important action, and does the hierarchy commit to it."
- Karri Saarinen (Linear), "Design must be opinionated" — applied at the level of a single surface's purpose.
- Edward Tufte and the broader information-design tradition on the cost of undifferentiated emphasis ("to emphasize everything is to emphasize nothing").

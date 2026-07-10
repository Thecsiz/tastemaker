---
id: CR-201
title: "Contrast Meets the Threshold"
dimension: color-contrast
measurable: true
consensus: law
sources:
  textbook: "W3C WCAG 2.x (SC 1.4.3 / 1.4.6 / 1.4.11)"
  tastemaker: "the accessibility standard (legally binding)"
tags: [contrast, wcag, accessibility, legibility, threshold]
---

# Contrast Meets the Threshold

## Rule
Text contrast against its background: **4.5:1** for body (WCAG AA), **3:1** for large text (≥24px, or ≥18.66px bold), **3:1** for non-text UI (icons, borders, focus rings, control boundaries). AAA target: **7:1** body. These are hard thresholds, not preferences.

## Why it matters
This is the one craft rule that's also law — and the boundary where craft touches the usability/accessibility floor (so it's also `/ux-critique`'s territory; cite, don't duplicate). Below threshold, real people can't read the text — low-vision users, anyone on a sunlit phone. But it's a *craft* concern too: low-contrast type that technically "looks fine" to a designer on a calibrated monitor is the most common silent accessibility defect, and it reads as carelessness.

## How to spot it
Run the foreground/background pair through a contrast checker. Common violations: light-gray placeholder/helper text on white (often 2–3:1), white text on a mid-tone brand color, "subtle" secondary text pushed too light, thin icons below 3:1.

## The fix
Darken the text or lighten the background until it clears the threshold. For "muted" secondary text, find the lightest gray that *still* passes 4.5:1 — don't go lighter for aesthetics. Check focus rings and icon strokes against 3:1.

## Eye-training
Train on the failure: secondary text that's been pushed too light to "look elegant" is everywhere. Once you've measured a few, your eye starts flagging "that gray looks too light to actually read." But always verify with a checker — eyes (especially on good monitors) systematically overestimate contrast.

## When to flex
Genuinely decorative, non-informational text (a giant faded background number purely for texture) is exempt. Disabled states are exempt by spec. Everything a user needs to read or act on must clear the threshold — this rule doesn't flex for aesthetics. (For dark mode, see CR-202 — WCAG 2.x is unreliable there.)

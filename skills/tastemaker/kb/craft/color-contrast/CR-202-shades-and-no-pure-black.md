---
id: CR-202
title: "Many Shades, No Pure Black"
dimension: color-contrast
measurable: partial
consensus: strong
sources:
  textbook: "Refactoring UI — Building Your Color Palette"
  tastemaker: "Refactoring UI (Wathan & Schoger)"
tags: [palette, shades, pure-black, saturation, tokens]
---

# Many Shades, No Pure Black

## Rule
Define **~8–10 shades per color** (greys especially, plus primary and accents) — not one value you lighten/darken on the fly. As shades move away from 50% lightness, **increase saturation** so they don't wash out to gray. Avoid pure `#000` and pure `#fff` — use a near-black and an off-white.

## Why it matters
Real interfaces need many tones — borders, backgrounds, hover states, disabled text, three levels of text emphasis — and improvising them from one base color produces muddy, inconsistent results. A defined shade ramp gives every UI need a *deliberate* value. Pure black is the tell of an undesigned palette: it's harsher than real-world dark (which is never truly black), creates excessive contrast that vibrates against white, and flattens depth. A warm near-black (#1a1a1a-ish) reads richer and more intentional.

## How to spot it
Count distinct hex values outside the token set — a sprawl of one-off colors means no ramp. Pure `#000000` text or `#ffffff` surfaces. Light or dark shades that look grayed-out/washed (saturation wasn't bumped at the extremes).

## The fix
Build a 9-step ramp per color as tokens; pull every color from it. Replace `#000` with a near-black, `#fff` with an off-white. At the light and dark ends of each ramp, raise saturation so the color still reads as the color.

## Eye-training
Put a pure-black element next to a near-black one — the pure black will suddenly look harsh and "digital." Once you see it, `#000` becomes a flag. Study a well-built palette (any mature design system) and notice it has no pure black and many deliberate grays.

## When to flex
OLED dark themes sometimes use true black for battery/contrast reasons — a deliberate exception. Pure black is occasionally a brand choice (high-fashion minimalism). The rule is a default that prevents the *accidental* pure-black-because-it-was-the-default failure.

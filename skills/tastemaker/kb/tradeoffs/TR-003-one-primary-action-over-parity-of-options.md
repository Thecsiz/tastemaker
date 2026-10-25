---
id: TR-003
title: "One Primary Action over Parity of Options"
prefers: one primary action
over: parity of options
status: seed
consensus: strong
tags: [hierarchy, cta, emphasis, actions, focus]
resolves: TS-003 vs. pressure for equal-weight options
related:
  - id: TS-003
    type: enforces
  - id: TS-010
    type: complements
---

# One Primary Action over Parity of Options

## Ranking

**Each surface commits to one primary action and lets everything else be visibly secondary, even when several stakeholders each want their action treated as equal.**

## Why

Parity is how organizations avoid deciding. Two teams each own a button, both buttons ship at the same weight, and nobody has to say which one the surface is for. The result is a screen that asks the user to make the decision the design refused to make. TS-003 (The One-Thing Rule) names the principle; this ranking says what to do when the pressure for parity arrives, because it always arrives.

The cost accepted is that secondary actions get less use than they would at equal weight, and their owners will notice. That is the point. Emphasis is a fixed budget. Spending it equally means spending none of it.

## How to Spot the Conflict

- Two or more filled, high-contrast buttons compete in the same region.
- A surface's purpose cannot be stated in one sentence because it serves several masters.
- A design review produces "can we make ours stand out too?" requests.
- A scope list contains several "primary" calls to action for one surface.

Cite TR-003, name the one action the surface is for, and demote the rest.

## Exemplars

**Commerce (hosted checkout).** A well-built checkout has one emphasized action: pay. Saving the cart, changing the plan and applying a code are all present and all quiet.

**Platform convention (system alerts).** Platform alert dialogs mark one default action and render the alternatives plainly. The user can read the system's recommendation before reading a word.

**Utilitarian (a single search input).** A search page with one field and one submit has no parity problem to solve. Every other capability is a secondary path.

## When It Flips

- **Consent and ethics:** when two options must be presented neutrally (accepting versus declining tracking, opting in versus out of a contract term), emphasizing one is a dark pattern. Parity wins, and the correct finding is about honesty, not hierarchy.
- **Genuine forks:** a surface whose whole job is to route people (choose a plan, pick a role) may present equal options, provided the options are truly co-equal and the copy carries the difference.
- **Destructive defaults:** never make the destructive action the visually primary one just to satisfy this ranking.

## Sources

- Jakob Nielsen, "10 Usability Heuristics," heuristic 8 (aesthetic and minimalist design).
- Platform human interface guidelines on default buttons in alerts.
- Enforces TS-003 (The One-Thing Rule); complements TS-010 (Editing vs. Listing).

---
id: TS-011
title: "Convention as the Tasteful Choice"
category: Contextual Fit
tags: [contextual-fit, convention, stakes, restraint, trust]
rubric_dimension: care
rung: ceiling-setter
role: governor
weight: foundational
related:
  - id: TS-001
    type: contrasts
  - id: TS-009
    type: complements
  - id: TS-002
    type: complements
---

# Convention as the Tasteful Choice

## Definition

Taste is not the same as novelty. There are moments when the most tasteful thing a design can do is follow the convention — to look like every other well-made version of the same thing — because the convention is load-bearing, the stakes are high, and inventing a distinctive alternative would cost the user trust, comprehension, or both. A checkout summary, a security prompt, a destructive-action confirmation, a tax form: at these moments, recognizability *is* the quality. Contextual fit is the meta-dimension that asks whether the design's level of distinctiveness is calibrated to the moment — bold where boldness serves the user, conventional where convention serves them. The failure is treating "distinctive" as always good and "conventional" as always lazy. Sometimes reaching for a signature treatment at a high-stakes, convention-governed moment is the actual lapse in taste.

> **This entry is the ceiling-setter for the Taste Ladder.** The ladder (Correct → Coherent → Characterful → Convicted) describes how high a design *can* climb. This principle describes how high it *should* — it sets the context-appropriate ceiling against which every other rung is judged. An identity surface (hero, onboarding, core loop) has a **Convicted** ceiling: stalling at Coherent there is the failure. A convention-governed, high-stakes surface (checkout, security, legal) has a **Coherent** ceiling: climbing past it toward signature distinctiveness is the failure. The grade a design earns is not its absolute rung but how close it gets to *its own* ceiling. Higher is not better; *right for the context* is better. Every other TS entry tells you whether a design holds a rung; this one tells you which rung it was supposed to reach.

## Why It Matters

Distinctiveness is a tool, and like every tool it has a right and wrong context (this is the contextual-fit counterpart to TS-002). At a high-stakes, transactional moment, the user is not looking to be charmed or surprised — they are looking to confirm that this is safe, correct, and familiar enough to trust. A checkout that follows the line-item-summary convention (items, fees, a bold total, the payment method) lets the user verify the amount and proceed with confidence, because they've seen this pattern a hundred times and they know how to read it. The convention is doing real work: it's carrying the user's trust. A checkout that reinvents this — a clever non-standard layout, a distinctive treatment of the total — forces the user to re-learn the most consequential moment in the flow, and the cost is hesitation exactly where you least want it.

This matters as a *taste* principle, not just a usability one, because the temptation it guards against is specifically an aesthetic one: the designer's urge to make every surface express the brand, to leave no screen "generic." That urge produces bad taste when it's applied to surfaces where convention is the right answer. A tasteful designer knows the difference between a surface that should carry the brand's point of view (the hero, the onboarding, the core loop — see TS-001) and a surface that should defer to convention (the payment, the legal, the security moment). Recognizing which is which — and having the discipline to *not* be distinctive where distinctiveness would harm — is itself a refined judgment. The restraint to look conventional when convention serves the user is as much taste as the conviction to be bold when boldness does.

## How to Evaluate

- Classify the surface by stakes and convention-load. Is this a high-consequence, pattern-governed moment (payment, security, confirmation, legal, data-loss) where the user relies on recognizability? Or an identity-defining moment (hero, onboarding, core experience) where a point of view serves them? The two call for opposite instincts.
- At high-stakes/high-convention surfaces, check whether the design *defers appropriately*. Does it follow the established pattern so the user can act with confidence, or has it reached for distinctiveness that forces re-learning at the worst moment?
- Watch for brand intrusion at the wrong moment — an upsell banner, a signature flourish, or a novel layout injected into a confirmation or security screen. These are the tells of distinctiveness misapplied. (Often overlaps with TS-002: a promotional element deployed where calm confirmation was the job.)
- Conversely, check identity surfaces for the opposite failure: defaulting to convention where a point of view was needed (see TS-001). Contextual fit cuts both ways — the question is always "is the distinctiveness calibrated to *this* moment," not "is it distinctive."
- Assess platform and category convention. Does the design follow the platform's expected patterns where users rely on them, breaking them only where the break is motivated and the user benefits? Gratuitous convention-breaking is a contextual-fit failure even when the result is "interesting."

## Exemplars

**Conventional checkout done right (Careem / Gojek-class).** A payment-confirmation screen that follows the universal pattern: itemized list, a payment summary with fees and discounts, a bold total, the payment method. Nothing distinctive, and that's exactly right — the user is confirming a money transaction and wants to recognize, verify, and proceed. The taste is in the *restraint to be conventional* at the moment recognizability carries trust. (The narrow failure to watch for: a "Free delivery on your next order" promo banner intruding on the confirmation — distinctiveness/brand pushed into a moment that wanted calm. The cleaner version omits it.)

**The identity surface that should NOT be conventional (contrast with TS-001).** The same product's onboarding or marketing hero should carry a strong point of view — there, convention is the failure and distinctiveness is the quality. This is the whole point of contextual fit: the *same product* should be conventional at checkout and distinctive at the hero, and a designer with taste knows which surface is which. A product that's distinctive everywhere (including checkout) is as mis-calibrated as one that's conventional everywhere (including the hero).

**Counter-example: novelty at the high-stakes moment.** A security or payment confirmation reimagined with a signature layout, a non-standard control, or a playful treatment — distinctiveness applied where the user needed recognizability. It may win a design award and lose the user's trust at the exact moment trust matters most. The "lapse in taste" here is precisely the thing that looks, superficially, like more design effort.

## When to Flex

The line between "load-bearing convention" and "lazy default" is the whole judgment, and it moves. A convention worth following is one the user *relies on* to act safely and confidently (the checkout pattern, the platform's destructive-action confirmation). A convention worth breaking is one that has become a thoughtless default with no protective function — and breaking it can be exactly the distinctiveness that gives a product its point of view. The skill is telling these apart: defer to convention where the user's trust or comprehension depends on it; depart from it where it's merely inertia and the departure serves the user.

Stakes set the default lean. The higher the consequence, the stronger the pull toward convention; the lower the stakes, the more room for distinctiveness even on a "utility" surface. A confirmation that only undoes a trivial action can afford more personality than one that moves money.

A note on org dynamics: the intrusion of distinctiveness into high-stakes surfaces is frequently a *business* decision, not a design one — the growth team wants the upsell on the confirmation screen, the brand team wants every surface to express the identity. When a high-stakes moment is cluttered with brand or promo, check whether it's a designer's misjudgment or a stakeholder mandate overriding the user's need for a calm, recognizable moment. Name it, because the fix lives in the priority conversation, not the layout.

## Sources

- Jakob's Law ("users spend most of their time on other sites/apps, and prefer yours to work the same way") — the usability grounding for why convention carries trust; this entry extends it into a *taste* judgment about when to honor it.
- Contrasts with TS-001 (The Inevitability Test) — inevitability calls for a committed point of view on identity surfaces; this calls for deference on convention-governed ones. Together they define *where* to be distinctive.
- Complements TS-009 (Register-Stakes Match) — both calibrate the design to stakes — and TS-002 (Unused Tools) — distinctiveness is a tool to withhold where it doesn't serve.
- Surfaced and validated across tastemaker runs: Careem / Gojek checkout (positive — conventional and trustworthy; Careem's promo banner the narrow lapse), and the general pattern across runs that distinctiveness is right on identity surfaces and wrong on transactional ones.

# Figma Output Mode — Tastemaker

Read this file whenever the user supplies a Figma URL or asks for taste cards in Figma.

## Confirm the output

- If the user explicitly asks to add, draw, write, or drop cards into Figma, proceed to the capability check.
- If the user supplies a Figma URL without specifying output, ask: **"Do you want the critique added as cards in Figma, or kept in chat?"**
- Do not mutate the file until the user chooses writeback.

## Check capabilities first

Figma reading and writing are separate capabilities.

1. Identify the configured Figma read tools for screenshots and metadata.
2. Identify a write tool that can execute Figma Plugin API code in the open file.
3. Use the fully qualified tool names exposed by the environment.
4. Probe the write connection before creating anything.

If reading is unavailable, ask for screenshots or a storyboard. If reading works but writing does not, complete the critique in chat and state exactly why cards could not be added. Never imply writeback succeeded when it did not.

## Capture the flow

Extract the file key and node ID from the URL. Convert a URL node such as `234-4771` to the API form `234:4771` when required.

1. Capture the top-level node to understand the sequence and intended viewport.
2. Identify screen-level frames without loading an oversized metadata response directly into context.
3. Capture each relevant screen at a legible size.
4. Separate briefing or context frames from actual product surfaces.
5. Establish the Brief and flow-level ladder read before creating per-screen findings.

## Use the bundled card builder

Read `scripts/taste-cards.js` relative to the installed skill directory and paste its complete contents into each fresh plugin-execution sandbox. It exposes the local `TM` helper object.

Recommended sequence:

```javascript
await TM.preLoadFonts();
const layout = TM.preScanLayout();

const brief = TM.buildBriefCard({
  headline: "Subscription management flow",
  surfaceType: "desktop flow",
  audience: "people reviewing recurring costs",
  register: "calm, clear, trustworthy",
  stakes: "medium — recurring money movement",
  ceiling: "Coherent on confirmation; Characterful on overview",
}, { x: 0, y: 0, width: 780 });

const finding = TM.buildFindingCard({
  findingId: "Finding-01",
  type: "GAP",
  rung: "COHERENT",
  tsId: "TS-006",
  tsTitle: "Single Voice",
  title: "The confirmation changes tone at the highest-stakes moment",
  verdict: "Fix: carry the same calm voice through confirmation.",
  whatISee: "The overview is restrained; the confirmation introduces promotional language.",
  whyTaste: "The seam makes the flow feel assembled by different authors.",
  judgment: "The flow reaches coherent until its final step.",
  fixOrProtect: ["Remove the promotional module", "Reuse the overview's type and spacing rhythm"],
}, 0, 0);

const craft = TM.buildCraftCard({
  findingId: "Craft-01",
  type: "GAP",
  dimension: "TYPE HIERARCHY",
  crId: "CR-102",
  crTitle: "Cap the Type Scale",
  consensus: "strong",
  title: "Seven unrelated sizes blur the reading order",
  evidence: "Visible text sizes: 12, 13, 14, 16, 18, 22, and 32px.",
  fix: "Collapse the surface to four intentional type roles.",
  rule: "A compact product surface rarely needs more than five sizes.",
  eye: "Squint and count how many visually different text tiers remain.",
}, 400, 0);

const overlaps = await TM.verifyNoOverlap([brief.id, finding.id, craft.id]);
return { createdIds: [brief.id, finding.id, craft.id], overlaps };
```

Use `TM.buildSolidCard` for a reviewed screen that holds its rung with nothing to flag. Flow Mode requires visible coverage for every relevant screen.

## Card content model

### Finding card

1. Type, rung, and real `TS-NNN` reference
2. Principle title
3. Decisive finding title
4. Fix-or-protect verdict
5. What is visible
6. Why it matters for taste
7. The judgment
8. Concrete fix or protect direction
9. Optional source link

### Craft card

Craft findings use `TM.buildCraftCard` and the measurable teaching shape: evidence, fix or protect direction, rule, eye-training, and consensus grade. Use only real `CR-NNN` entries.

### Color mapping

- Strength → green
- Coherent/craft gap → amber
- Characterful gap → burnt orange
- Convicted gap → magenta
- Ceiling/contextual-fit gap → violet
- Flow synthesis → charcoal

Color is reinforcement, not the sole signal. Every card also names its type and rung.

## Required flow cards

- One Brief card
- Craft cards for material measurable findings (`buildCraftCard`)
- One taste-coverage card for every product screen (`buildFindingCard` or `buildSolidCard`)
- One `buildFlowLadderCard`
- One `buildOverallCard`, including the masking caveat

The masking caveat must say that Tastemaker evaluates craft and taste, not usability, accessibility, or whether the product should exist.

## Verify writeback

After creation:

1. Resolve every returned node ID.
2. Confirm the cards are on the intended page.
3. Confirm every product screen received coverage.
4. Run `await TM.verifyNoOverlap(createdIds)`.
5. Report the page, card count, grade, and any remaining overlap.

If verification fails, repair placement once and recheck. If it still fails, report the partial result honestly.

## Builder invariants

- Load fonts before setting text characters.
- Paste the builder into every fresh execution sandbox.
- Let the builder set auto-layout and text-sizing properties in its tested order.
- Use `TM.preScanLayout()` instead of guessing placement.
- Set Y after building tall cards when using `TM.placeAbove()`.
- Return structured data; do not rely on invisible console output.
- Use the asynchronous node lookup in `TM.verifyNoOverlap()`.

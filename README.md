# Tastemaker

Tastemaker is a design-critique skill for Claude Code and Codex. You give it a screenshot, a Figma file or a live page, and it critiques the craft and the taste. You can also give it a feature list before anything is built, and it tells you what to cut.

[Browse the 37-entry knowledge base](https://thecsiz.github.io/tastemaker/) · [Download the installable skill](https://github.com/Thecsiz/tastemaker/raw/refs/heads/main/skills/tastemaker.skill)

## Why I built this

I've been building a lot of apps and side projects lately. At this point most things I can think of, I can build, and get to a pretty high level of quality. It gets easier every time the AI tools and workflows get better. So the harder question for me has become what not to build.

I keep thinking about Apple under Steve Jobs. Apple had the money to build anything, and a lot of the time they shipped the simplest version of the software experience. They didn't over-design it or over-engineer it. Jobs seemed to know where the cutoff line was.

The iOS Settings app is a good example. An app might have a few settings of its own, but the full set lives under that app in the Settings app. Someone made the call to split those two things. Maybe it was for simplicity, maybe it was because they had to support a billion users. Either way, the call was made, the principle was defined, and for the most part it held.

I think a lot of what looks like instinct there is a short list of principles that decide things ahead of time, plus the discipline to keep them when an exception looks better. I want Tastemaker to work that way. The first version could tell me if a screen was well made and whether it had a point of view. It couldn't tell me which principle should win when two of them disagreed, and it couldn't see a feature that had been correctly cut, because there's nothing on screen to look at.

## What it does

When you share a design, it works through it in order. First it sets the brief: what the surface is, who it's for, how much is at stake, and how far up the ladder it should go. Then it checks the craft against 20 craft rules, things like spacing, type and contrast. Each craft finding comes with the fix and how to spot the problem next time. After that it judges the taste against 12 taste principles. If two of those principles disagree on the same screen, one of 5 ranked trade-offs decides which one wins. It finishes with a grade, the next move up, and what to keep.

Scope mode works earlier. It takes a feature list instead of a design and tells you what to keep and what to cut.

Every finding has to cite a real entry in the knowledge base. If nothing fits, it says what it sees without an ID instead of making one up.

It doesn't redesign anything for you, check brand compliance, judge market demand or do a full usability and accessibility audit.

## The ladder

```text
        Contextual Fit sets how high the design should climb

  4. Convicted    commits to a defensible point of view
  3. Characterful expresses a specific, earned identity
  2. Coherent     the parts agree and the craft feels finished
  1. Correct      usable and clear; assumed, not audited here
```

Higher isn't always better. A checkout should probably stop at Coherent, and a hero or an onboarding flow should push for Convicted. The grade is how close a design gets to the right ceiling for its context.

Craft comes first. A design with off-scale spacing and eight type sizes can't get to the upper rungs, even if the idea behind it is good.

## Ranked trade-offs

A rubric scores each thing on its own. The hard calls usually happen when two good things pull against each other. A dashboard can't be as complete as possible and as edited as possible at the same time, and the first version of Tastemaker would cite both principles and leave it there.

The rankings make that call. Each one is written as "X over Y, even when Y wins locally," because a ranking only matters in the cases where following it costs you something.

| ID | Ranking |
|----|---------|
| TR-001 | System Consistency over In-Context Discoverability |
| TR-002 | Editing over Completeness |
| TR-003 | One Primary Action over Parity of Options |
| TR-004 | Convention over Expression on High-Stakes, Low-Frequency Tasks |
| TR-005 | Depth on the Core Interaction over Breadth of Features |

TR-001 is basically the Settings example written down. TR-005 is the same idea applied to features: get the one interaction the product exists for really good before spreading the work across more things. Each ranking also says when it flips. On a trading terminal, for example, completeness should win over editing.

All five are seeds for now. I'm not sure yet that these are the right five, so a critique marks them as `(seed)` when it cites one. A seed only becomes established after it's decided the same conflict the same way across a lot of critiques.

The rankings show up in three places:

- When two principles collide, the critique gives one finding and names the ranking that decided it. If no ranking covers it, it makes the call anyway and logs it as a candidate for a new ranking.
- When a design breaks a principle on purpose, Tastemaker checks whether the break is consistent and serves a higher ranking. If it does, it protects the decision instead of flagging it. Saying it was on purpose only removes the penalty. Holding a ranking consistently is what moves a design toward Convicted.
- Scope mode uses them to decide what stays.

## Scope mode

You give it a brief, a PRD, a feature list, a roadmap, or a list of what's in an app you already have. It asks for the one-sentence reason the product exists and the core interaction, the one thing it has to do really well. If you can't answer those, that's the first finding.

Then it goes through each item, decides whether it serves the core, competes with it or just sits next to it, and gives you a table:

| Verdict | Meaning |
|---------|---------|
| Keep | Serves the core. Build it fully. |
| Cut | Competes with the core. Remove it. |
| Defer | Sits next to the core, or depends on the core being finished first. Revisit later. |
| Merge | Overlaps another item. Fold them together. |
| Move | Fine, but it lives in the wrong place. Put it where it belongs. |

It has to cut something, or tell you in one sentence why nothing should go. I added that rule because it's easy for a review to approve everything when each item makes sense on its own. It only judges items against the product's own purpose. Whether the business should make the bet is still your call.

## System mode

A single screen can show character, but holding to a principle shows up across a whole product, especially on the screen where breaking it would have looked better. System mode takes a Figma file with a lot of frames, a folder of screenshots or a live product. It checks each ranking screen by screen, picks one home for anything that shows up in more than one place, and grades the product on how consistently the rankings hold.

## Your own rankings

The shared rankings are the ones most people would agree with. Teams will disagree on others, and that's fine. You can keep your own in a `tastemaker-house.md` file at the root of your project. One person owns the file and decides what becomes a ranking. Anyone else, including Tastemaker, can only add proposals. Your rankings win over the shared ones for that project, and a critique always says which one made the call.

When you accept a cut, it goes into `tastemaker-cuts.md`. Later runs read that file, so if you bring back something you cut last month, or make a call that contradicts an earlier one, it gets flagged. The format is in [references/house-profiles.md](skills/tastemaker/references/house-profiles.md).

## Install for Claude Code

```bash
git clone https://github.com/thecsiz/tastemaker.git
cd tastemaker
mkdir -p ~/.claude/skills/tastemaker
cp -R skills/tastemaker/. ~/.claude/skills/tastemaker/
```

The knowledge base is bundled inside the skill folder, so there's nothing else to set up. Claude can pick up the skill on its own when a request matches, or you can call it directly:

```text
/tastemaker Why does this design look off? Teach me the craft fixes first.
```

```text
/tastemaker Does this landing page have a real point of view, or is it stopping at coherent?
```

```text
/tastemaker scope: here's the v1 feature list. What should go?
```

```text
/tastemaker System review of this Figma file. Do our rankings hold on every screen?
```

## Use with Codex

```bash
git clone https://github.com/thecsiz/tastemaker.git
cd tastemaker
mkdir -p ~/.codex/skills/tastemaker
cp -R skills/tastemaker/. ~/.codex/skills/tastemaker/
```

Then call it with `$tastemaker`. The bundled `agents/openai.yaml` has the Codex display info. Everything else works the same as in Claude Code.

## Figma cards and HTML reports

If you want the critique written into a Figma file, ask for it:

```text
/tastemaker Evaluate this Figma flow and add the taste cards to the file: [Figma URL]
```

It reads the frames, sets the brief, checks the craft before the taste, and then adds a card for every screen, a summary of the flow and an overall verdict. After that it checks that none of the cards overlap. Reading and writing in Figma are separate permissions, so if it can read the file but can't write to it, it tells you and gives you the critique in chat. If you share a Figma link without saying which one you want, it asks.

For anything that isn't in Figma, it can build an HTML report on your machine:

```bash
node ~/.claude/skills/tastemaker/scripts/build-report.js report.json --out tastemaker-report.html
```

It won't publish the report anywhere unless you ask.

## The knowledge base

The [viewer](https://thecsiz.github.io/tastemaker/) shows the same entries that ship with the skill. You can search by ID, title or tag, and filter by layer.

- [`CR-NNN` craft rules](skills/tastemaker/kb/craft/_index.md): 20 measurable rules across six dimensions, each with a fix and a note on how to train your eye.
- [`TS-NNN` taste principles](skills/tastemaker/kb/_index.md): 12 principles across 11 categories, for judging coherence, character, conviction and fit.
- [`TR-NNN` ranked trade-offs](skills/tastemaker/kb/tradeoffs/_index.md): 5 rankings that decide which principle wins when they collide.

Each layer has a registry (`cr-ids.json`, `ts-ids.json`, `tr-ids.json`) that holds its IDs and its count. At one point the craft index listed one fewer rule than the registry had, and nobody noticed. Now the validator fails if any count or ID range in the docs doesn't match a registry.

```text
.
├── index.html                         # generated knowledge base viewer
├── scripts/build-kb-viewer.js
├── _tools/                            # validator and package builder
└── skills/tastemaker/
    ├── SKILL.md                       # the router
    ├── agents/openai.yaml
    ├── evals/
    ├── kb/                            # 12 TS principles at the root
    │   ├── craft/                     # 20 CR rules
    │   └── tradeoffs/                 # 5 ranked trade-offs
    ├── references/                    # output modes, scope, system, conflicts, house profiles
    ├── scripts/
    └── LICENSE
```

## Validate

```bash
node _tools/validate.js
```

It checks the skill structure, all three registries, every entry the docs point to, whether the counts and ID ranges in the docs match the registries, the report renderer, the generated viewer, the packaged skill, licensing, and that nothing private or secret slipped into the repo.

## Where it's at

The knowledge base covers a lot, but it's not a complete theory of design. Some real findings won't have an entry yet, and Tastemaker should say so instead of making up an ID. It can't judge motion from a static screenshot, so use a prototype or a video when motion matters. A good taste grade also doesn't mean the design works or that it's solving the right problem.

Conflict findings and defended breaks only show up in chat for now. The Figma cards and the HTML report don't show them yet. The next thing I'm doing is running the new evals against the installed skill, starting with the one that checks whether scope mode actually cuts something.

## License

- Skill behavior, validation, viewer and renderer scripts: [MIT](LICENSE-MIT)
- Knowledge-base entries, manifesto, examples and documentation: [CC BY 4.0](LICENSE-CC-BY-4.0)

See [LICENSE](LICENSE) for the exact scope map and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for notices.

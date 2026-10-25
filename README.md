# Tastemaker

A design-critique skill for Claude Code and Codex. It judges whether a design is well made and whether it has taste, and it helps decide what shouldn't be built in the first place.

[Browse the 37-entry knowledge base](https://thecsiz.github.io/tastemaker/) · [Download the installable skill](https://github.com/Thecsiz/tastemaker/raw/refs/heads/main/skills/tastemaker.skill)

## Why I built this

I've been building a lot of apps on my own lately, and I've gotten to the point where most things I can picture, I can build, and build well. The AI tools keep getting better and the quality bar keeps getting easier to reach. That changes where the hard part is. If building is cheap, the decision that matters is what to leave out.

I keep coming back to Apple under Steve Jobs. Apple had the money and the people to build anything, and the software often shipped as the smallest version of the idea. When Jobs came back in 1997 he cut the product line down to four boxes: consumer and pro, desktop and portable. Everything outside that grid went.

The iOS Settings app is a good example of the same instinct at the interface level. An app keeps a few settings inside itself, and the full set lives in the system Settings app. That split is invisible in any single screenshot. Someone drew that line once and then held it across the whole platform, even where putting a setting in context would have been easier for one app. It costs some discoverability, and it buys a system where you know where configuration lives.

What looked like instinct was mostly a small number of principles that decided cases before they came up, plus the willingness to keep them when an exception looked tempting. I wanted a tool that works that way. The first version of Tastemaker could tell you whether a screen was well made. It couldn't tell you which principle should win when two of them disagreed, and it couldn't see the features that were correctly cut, because a cut feature leaves nothing on screen to critique.

## What it does

Tastemaker answers four questions, and the first two came first:

1. Is this well made? Spacing, type, color, shadow, alignment and density are checked against 20 craft rules (`CR-NNN`). Each finding teaches the fix and how to spot it next time.
2. Is this good? Point of view, coherence, character, conviction and fit for the context are judged against 12 taste principles (`TS-NNN`).
3. Which principle wins here? When two principles pull in opposite directions on the same surface, one of 5 ranked trade-offs (`TR-NNN`) decides.
4. Should this exist? Before anything gets built, scope mode goes through a feature list and returns what to keep and what to cut.

Every citation has to resolve to a real entry in the bundled knowledge base. When nothing fits closely enough, Tastemaker states the finding without an ID instead of inventing one.

It doesn't generate replacement designs, enforce a brand system, judge market demand or run a full usability and accessibility audit.

## The ladder

```text
        Contextual Fit sets how high the design should climb

  4. Convicted    commits to a defensible point of view
  3. Characterful expresses a specific, earned identity
  2. Coherent     the parts agree and the craft feels finished
  1. Correct      usable and clear; assumed, not audited here
```

Higher isn't automatically better. A checkout should probably stop at Coherent. A hero or an onboarding flow should push for Convicted. The grade is how close a design gets to the ceiling that fits its context, and craft comes first, because a design with sloppy spacing and eight type sizes can't reach the upper rungs no matter how good the idea is.

## Ranked trade-offs

A rubric scores each dimension on its own, and taste shows up when two of them conflict. A screen can be clear and full of character and still be the wrong call, because the real decision was which one to give up. So the rankings all take the same form: X over Y, even when Y wins locally. The "even when" part is the point. A ranking that only holds when it costs nothing isn't doing any work.

| ID | Ranking |
|----|---------|
| TR-001 | System Consistency over In-Context Discoverability |
| TR-002 | Editing over Completeness |
| TR-003 | One Primary Action over Parity of Options |
| TR-004 | Convention over Expression on High-Stakes, Low-Frequency Tasks |
| TR-005 | Depth on the Core Interaction over Breadth of Features |

TR-001 is the Settings split written down as a rule. TR-005 is the 1997 grid applied to features: put the craft into the one interaction the product exists for before spreading it across more things. Each entry also says when it flips. Completeness wins on a trading terminal, for example, and convention loses on an identity surface.

All five ship as seeds. A critique that cites one marks it `(seed)`, and a seed only becomes established after it has decided the same conflict the same way across a lot of critiques. I'm not sure yet these are the right five, which is why they're seeds.

The rankings show up in three places:

- Conflict findings. When two principles collide, the critique reports one finding and the ranking that decided it, instead of citing both and splitting the difference. If no ranking covers the conflict, it makes the call on the merits and logs a candidate for a new one.
- Defended breaks. Sometimes a design breaks a principle on purpose. If the break is consistent and serves a higher ranking, Tastemaker protects it instead of flagging it. Saying "we meant to do that" only removes the penalty. A ranking held consistently is what counts toward Convicted.
- Scope cuts. Scope mode uses them to decide what stays.

## Scope mode

Scope mode runs before anything gets built. You give it a brief, a PRD, a feature list, a roadmap or an inventory of an app you already have. It asks for the one-sentence reason the product exists and the core interaction, the one thing it has to do really well. If you can't state those, that's the first finding.

Then it goes through each item and asks whether it serves the core, competes with it, or just sits next to it, and returns a table:

| Verdict | Meaning |
|---------|---------|
| Keep | Serves the core. Build it fully. |
| Cut | Competes with the core. Remove it. |
| Defer | Sits next to the core, or depends on the core being finished first. Revisit later. |
| Merge | Overlaps another item. Fold them together. |
| Move | Fine, but it lives in the wrong place. Put it where it belongs. |

It has to cut something, or explain in one sentence why nothing should go. A scope review that keeps everything hasn't done its job. It judges each item against the product's own stated purpose. Whether the business should make the bet is a separate call it leaves to you.

## System mode

A single screen can show character. Conviction mostly shows across a whole product: the same ranking held on the screen where breaking it would have looked better. System mode takes a Figma file with a lot of frames, a folder of screenshots or a live product, checks each ranking surface by surface, names one home for every capability that shows up in more than one place, and grades the system on how consistently the rankings hold.

## Your own rankings

The shared rankings are where most people would agree. Rankings are also where teams legitimately disagree, so you can keep your own in a `tastemaker-house.md` file at the root of your project. One person owns it and promotes rankings. Anyone, including Tastemaker, can only add proposals. House rankings outrank the shared ones for that project, and a critique always says which one decided.

Cuts you accept go into `tastemaker-cuts.md`. Later runs read it, so a cut today that contradicts a ranking you applied last month gets flagged. The format and rules are in [references/house-profiles.md](skills/tastemaker/references/house-profiles.md).

## Install for Claude Code

```bash
git clone https://github.com/thecsiz/tastemaker.git
cd tastemaker
mkdir -p ~/.claude/skills/tastemaker
cp -R skills/tastemaker/. ~/.claude/skills/tastemaker/
```

The knowledge base is bundled inside the skill folder, so there are no machine-specific paths or extra repos to set up. Claude can load the skill on its own when a request matches, or you can call it directly:

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

Then call it with `$tastemaker`. The bundled `agents/openai.yaml` has the Codex display metadata. The workflow and knowledge base are the same as in Claude Code.

## Figma cards and HTML reports

If you want the critique written into a Figma file, say so:

```text
/tastemaker Evaluate this Figma flow and add the taste cards to the file: [Figma URL]
```

It reads the frames, sets the brief and ceiling, checks craft before taste, then adds a card for every screen plus a flow summary and an overall verdict, and checks that nothing overlaps. Reading and writing in Figma are separate permissions. If it can read but not write, it says so and gives you the critique in chat. If you share a Figma link without saying which you want, it asks.

For anything outside Figma, it can build a self-contained HTML report locally:

```bash
node ~/.claude/skills/tastemaker/scripts/build-report.js report.json --out tastemaker-report.html
```

Publishing that report anywhere is a separate step you have to ask for.

## The knowledge base

The [viewer](https://thecsiz.github.io/tastemaker/) shows the same entries and registries that ship with the skill. You can search by ID, title or tag and filter by layer.

- [`CR-NNN` craft rules](skills/tastemaker/kb/craft/_index.md): 20 measurable rules across six dimensions, each with a fix and an eye-training note.
- [`TS-NNN` taste principles](skills/tastemaker/kb/_index.md): 12 principles across 11 categories, for judging coherence, character, conviction and fit.
- [`TR-NNN` ranked trade-offs](skills/tastemaker/kb/tradeoffs/_index.md): 5 rankings that decide what yields when principles collide.

Each registry (`cr-ids.json`, `ts-ids.json`, `tr-ids.json`) is the source of truth for its IDs and its count. The craft rules had drifted at one point. The index listed one fewer rule than the registry, and the registry was right. Now the validator fails if any count or ID range in the docs disagrees with a registry.

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

It checks the skill structure, all three registries, every referenced entry, that stated counts and ID ranges match the registries, renderer syntax, the HTML report fixture, the generated viewer, the packaged archive, licensing, private references and common secret patterns.

## Where it's at

This is a working knowledge base, not a complete theory of design. Some valid findings will go past the current 37-entry set, and Tastemaker should say so without making up an ID. Motion can't be judged from a static screenshot, so use a live prototype or video when motion matters. A tasteful verdict also doesn't mean the design works or that it solves the right problem.

Conflict findings and defended breaks only show up in chat right now. The Figma cards and HTML report don't render them yet. Next I'm running the new evals against the installed skill, starting with the one that checks whether scope mode actually cuts something.

## License

- Skill behavior, validation, viewer and renderer scripts: [MIT](LICENSE-MIT)
- Knowledge-base entries, manifesto, examples and documentation: [CC BY 4.0](LICENSE-CC-BY-4.0)

See [LICENSE](LICENSE) for the exact scope map and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for notices.

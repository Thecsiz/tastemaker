# Tastemaker

An AI design-critique skill that teaches the measurable craft floor, evaluates the taste above it, and decides what should exist at all.

[**Browse the 37-entry knowledge base →**](https://thecsiz.github.io/tastemaker/) · [Download the installable skill](https://github.com/Thecsiz/tastemaker/raw/refs/heads/main/skills/tastemaker.skill)

## What it is

Tastemaker is an evaluation and teaching system for design craft and judgment. It answers four connected questions:

1. **Is this well made?** Spacing, type, color, shadow, alignment, and density are evaluated against concrete craft rules.
2. **Is this good?** Point of view, coherence, character, conviction, and contextual fit are evaluated as design judgment.
3. **Which principle wins here?** When two principles pull in opposite directions on one surface, a ranked trade-off decides.
4. **Should this exist?** Before anything is built, scope mode returns a cut list where every verdict carries a reason.

It has three parts:

- **The skill** runs critiques, scope reviews, and system reviews in Claude Code or Codex.
- **The knowledge base** contains 20 measurable craft rules, 12 taste principles, and 5 ranked trade-offs, each with a stable citable ID.
- **The outputs** can stay in chat, become critique cards inside Figma, or render as a self-contained HTML report.

It does not generate a replacement design, enforce a brand system, judge market strategy, or perform a full usability and accessibility audit.

## How it works

1. Share a screenshot, Figma flow, live page, source file, or description.
2. Tastemaker establishes the brief: surface, audience, register, stakes, and the appropriate taste ceiling.
3. It evaluates the measurable craft floor and teaches specific fixes through `CR-NNN` rules.
4. It evaluates coherence, character, conviction, and contextual fit through `TS-NNN` principles.
5. It gives an overall grade, explains the climb to the next rung, and protects the decisions already working.

Every citation must resolve to a real entry in the bundled knowledge base. When no entry supports a finding closely enough, Tastemaker states the finding without inventing a citation.

## Why it exists

AI design tools can produce interfaces quickly, but generation does not answer whether the result is disciplined, intentional, or appropriate for its context. Tastemaker provides the missing evaluation and teaching loop:

- identify the measurable craft problems;
- explain the rule behind each fix;
- teach the designer how to see the issue next time;
- judge the design's point of view and contextual fit;
- protect the decisions already giving the work character.

When anything can be built cheaply, the scarce judgment moves upstream: deciding what not to build. A critic that only sees finished screens cannot see what was correctly left out. Rankings and scope mode move Tastemaker from critic to editor.

## The Taste Ladder

```text
        Contextual Fit sets how high the design should climb

  4. Convicted    — commits to a defensible point of view
  3. Characterful — expresses a specific, earned identity
  2. Coherent     — the parts agree and the craft feels finished
  1. Correct      — usable and clear; assumed, not audited here
```

Higher is not automatically better. A checkout may appropriately stop at Coherent; an identity-defining hero may need to reach Convicted. The grade reflects how closely the design reaches its context-appropriate ceiling.

## Ranked trade-offs

A rubric scores dimensions independently. Taste is what happens when they conflict. Ranked trade-offs (`TR-NNN`) make those calls explicit, in one form: **"X over Y, even when Y wins locally."**

| ID | Ranking |
|----|---------|
| TR-001 | System Consistency over In-Context Discoverability |
| TR-002 | Editing over Completeness |
| TR-003 | One Primary Action over Parity of Options |
| TR-004 | Convention over Expression on High-Stakes, Low-Frequency Tasks |
| TR-005 | Depth on the Core Interaction over Breadth of Features |

All five ship as **seed**: citable, marked `(seed)` in findings, and promoted to established only after they decide the same conflict consistently across repeated critiques. Each entry also says when it flips.

Rankings power three behaviors:

- **Conflict findings.** When two principles collide, the critique reports one finding decided by a ranking, instead of citing both and splitting the difference. No ranking on file means the call is made on its merits and logged as a candidate.
- **Defended breaks.** A design that breaks a principle on purpose, consistently, in service of a higher ranking is protected rather than penalized. Stated intent alone only removes the penalty; a cited, consistent ranking counts toward Convicted.
- **Scope cuts.** Proposed features are kept, cut, deferred, merged, or moved against the product's core interaction.

### House profiles

Rankings are where points of view legitimately differ, so a person or team can keep its own in `tastemaker-house.md` at their project root. A named owner promotes rankings; anyone, including Tastemaker, can only propose. House rankings outrank shared ones for that project, and critiques say which layer decided. Accepted cuts go to `tastemaker-cuts.md`, which later runs check for consistency. Format and rules: [`references/house-profiles.md`](skills/tastemaker/references/house-profiles.md).

## Capabilities

- Screenshot, file, description, live-page, and multi-screen flow critique
- Scope mode: a pre-build cut list from a brief, feature list, or roadmap
- System mode: conviction and consistency judged across many surfaces
- 20 measurable craft rules across six dimensions
- 12 taste principles across 11 categories
- 5 ranked trade-offs that decide conflicts and cuts
- Separate teaching, judgment, conflict, and defended-break finding formats
- House profiles and a cut log for a team's own rankings
- Tasteful / Competent / Unrealized overall grade
- Figma critique-card writeback when compatible read and write tools are available
- Self-contained HTML reports for durable local output
- Browsable GitHub Pages knowledge base
- Cite-or-skip validation for every `CR-NNN`, `TS-NNN`, and `TR-NNN` reference

## Install for Claude Code

Claude Code is the primary supported environment. Its official skill location is `~/.claude/skills/<skill-name>/SKILL.md`.

```bash
git clone https://github.com/thecsiz/tastemaker.git
cd tastemaker
mkdir -p ~/.claude/skills/tastemaker
cp -R skills/tastemaker/. ~/.claude/skills/tastemaker/
```

The knowledge base is bundled inside the skill folder, so no machine-specific paths or additional repositories are required.

Invoke it directly:

```text
/tastemaker Evaluate this design: [attach a screenshot or describe the surface]
```

Claude may also load the skill automatically when your request matches its description.

### Useful prompts

```text
/tastemaker Why does this design look off? Teach me the craft fixes first.
```

```text
/tastemaker Does this landing page have a real point of view, or is it stopping at coherent?
```

```text
/tastemaker Evaluate this dashboard at its intended desktop viewport. Focus on density and hierarchy.
```

```text
/tastemaker scope: here's the v1 feature list. What should go?
```

```text
/tastemaker System review of this Figma file. Do our rankings hold on every screen?
```

## Scope mode

Scope mode runs before anything is built. Share a brief, PRD, feature list, roadmap, or an inventory of an existing app. Tastemaker states the product's reason to exist and its core interaction, classifies each item as serving, competing with, or sitting beside the core, and returns a cut list:

| Verdict | Meaning |
|---------|---------|
| Keep | Serves the core. Build it fully. |
| Cut | Competes with the core. Remove it. |
| Defer | Sits beside the core or depends on it being finished. Revisit later. |
| Merge | Overlaps another item. Fold them together. |
| Move | Fine, but its home is wrong. Put it where it belongs. |

Scope mode must cut something or explain in one sentence why nothing should go. It judges proposals against the product's own stated point of view, not market demand. Full workflow: [`references/scope-mode.md`](skills/tastemaker/references/scope-mode.md).

## System mode

Conviction mostly shows across many surfaces over time: the same ranking held on the screen where breaking it would have looked better. System mode takes a multi-frame Figma file, a screenshot set, or a walked product, checks each ranking surface by surface, names one home for every capability, and grades the system on consistency. Full workflow: [`references/system-mode.md`](skills/tastemaker/references/system-mode.md).

## Add taste cards to Figma

Be explicit when you want the critique written into the file:

```text
/tastemaker Evaluate this Figma flow and add the taste cards to the file: [Figma URL]
```

The skill will:

1. read the linked frames and reconstruct the flow;
2. establish the design brief and context-appropriate ceiling;
3. evaluate the craft floor before the taste altitude;
4. create a brief, per-screen cards, flow synthesis, and overall verdict;
5. verify the created nodes and check for overlap.

Figma reading and writing are separate capabilities. Reading requires a configured Figma integration. Writing requires a tool that can execute Figma Plugin API code in the open file. If write access is unavailable, Tastemaker must say so and return the critique in chat—it must never claim that cards were added when they were not.

If you share a Figma URL without specifying the output, Tastemaker asks whether you want cards added or a chat-only critique.

## Create an HTML report

```text
/tastemaker Evaluate this design and create a self-contained HTML report.
```

The skill authors structured report data and runs:

```bash
node ~/.claude/skills/tastemaker/scripts/build-report.js report.json --out tastemaker-report.html
```

The output contains the verdict, brief, evidence, numbered regions, craft score, findings, and masking caveat. It is created locally; publishing requires a separate explicit request.

## Use with Codex

```bash
git clone https://github.com/thecsiz/tastemaker.git
cd tastemaker
mkdir -p ~/.codex/skills/tastemaker
cp -R skills/tastemaker/. ~/.codex/skills/tastemaker/
```

Invoke it with:

```text
$tastemaker Evaluate this design: [attach or describe the design]
```

The bundled `agents/openai.yaml` supplies Codex-facing display metadata. The critique workflow and KB are shared with Claude Code.

## Explore the 37-entry knowledge base

[**Open the browsable knowledge base →**](https://thecsiz.github.io/tastemaker/)

The viewer exposes the same Markdown entries and validator registries shipped with the skill. You can search by ID, title, or tag; filter craft, taste, and trade-off entries; and open the complete rule, principle, or ranking without installing anything.

The installed skill contains three citable layers:

- [`CR-NNN` craft rules](skills/tastemaker/kb/craft/_index.md) teach measurable fixes and eye-training.
- [`TS-NNN` taste principles](skills/tastemaker/kb/_index.md) support judgment about coherence, character, conviction, and fit.
- [`TR-NNN` ranked trade-offs](skills/tastemaker/kb/tradeoffs/_index.md) decide what yields when principles collide.

Each run follows the same retrieval sequence:

1. Build a brief: surface, audience, register, stakes, and ceiling.
2. Inspect the craft dimensions and route measurable issues to candidate `CR-NNN` rules.
3. Inspect the taste rungs and route judgment findings to candidate `TS-NNN` principles.
4. Where two principles collide, route the conflict to a `TR-NNN` ranking or the project's house profile.
5. Read the complete candidate entries, including when-to-flex and when-it-flips guidance.
6. Cite an ID only when it exists in `cr-ids.json`, `ts-ids.json`, or `tr-ids.json`; otherwise state the finding without inventing a citation.

## Repository map

```text
.
├── index.html                         # generated GitHub Pages KB viewer
├── scripts/build-kb-viewer.js
├── _tools/
└── skills/tastemaker/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── evals/
    ├── kb/                            # 12 TS principles at the root
    │   ├── craft/                     # 20 CR rules
    │   └── tradeoffs/                 # 5 ranked trade-offs
    ├── references/                    # output modes, scope, system, conflicts, house profiles
    ├── scripts/
    └── LICENSE
```

## Validate the project

```bash
node _tools/validate.js
```

The validator checks the skill structure, all three ID registries, every referenced KB file, that every stated count and ID range in the docs matches the registries, renderer syntax, the HTML report fixture, the generated viewer, the packaged archive, licensing, private references, and common secret patterns. Counts in prose are never trusted on their own: the registries are the source of truth, and drift fails the build.

## Status and limits

This is a focused working knowledge base, not a complete theory of design. Some valid findings will outrun the current 37-entry knowledge base; Tastemaker should report those without fabricating IDs. The five rankings are seeds, not settled law.

Motion principles cannot be evaluated from a static screenshot. Use a live prototype or video when motion is material. A positive taste verdict also does not prove that the product solves the right problem or that the interface is usable and accessible.

## License

This repository uses two licenses:

- Skill behavior, validation, viewer, and renderer scripts: [MIT](LICENSE-MIT)
- Knowledge-base entries, manifesto, examples, and explanatory documentation: [CC BY 4.0](LICENSE-CC-BY-4.0)

See [LICENSE](LICENSE) for the exact scope map and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for notices.

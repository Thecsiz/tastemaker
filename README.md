# Tastemaker

An AI design-critique skill that teaches the measurable craft floor and evaluates the taste above it.

[**Browse the 32-entry knowledge base →**](https://thecsiz.github.io/tastemaker/) · [Download the installable skill](https://github.com/Thecsiz/tastemaker/raw/refs/heads/main/skills/tastemaker.skill)

## What it is

Tastemaker is an evaluation and teaching system for design craft and judgment. It answers two connected questions:

1. **Is this well made?** Spacing, type, color, shadow, alignment, and density are evaluated against concrete craft rules.
2. **Is this good?** Point of view, coherence, character, conviction, and contextual fit are evaluated as design judgment.

It has three parts:

- **The skill** runs critiques in Claude Code or Codex.
- **The knowledge base** contains 20 measurable craft rules and 12 taste principles, each with a stable citable ID.
- **The outputs** can stay in chat, become critique cards inside Figma, or render as a self-contained HTML report.

It does not generate a replacement design, enforce a brand system, validate product strategy, or perform a full usability and accessibility audit.

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

## The Taste Ladder

```text
        Contextual Fit sets how high the design should climb

  4. Convicted    — commits to a defensible point of view
  3. Characterful — expresses a specific, earned identity
  2. Coherent     — the parts agree and the craft feels finished
  1. Correct      — usable and clear; assumed, not audited here
```

Higher is not automatically better. A checkout may appropriately stop at Coherent; an identity-defining hero may need to reach Convicted. The grade reflects how closely the design reaches its context-appropriate ceiling.

## Capabilities

- Screenshot, file, description, live-page, and multi-screen flow critique
- 20 measurable craft rules across six dimensions
- 12 taste principles across 11 categories
- Separate teaching and judgment finding formats
- Tasteful / Competent / Unrealized overall grade
- Figma critique-card writeback when compatible read and write tools are available
- Self-contained HTML reports for durable local output
- Browsable GitHub Pages knowledge base
- Cite-or-skip validation for every `CR-NNN` and `TS-NNN` reference

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

## Explore the 32-entry knowledge base

[**Open the browsable knowledge base →**](https://thecsiz.github.io/tastemaker/)

The viewer exposes the same Markdown entries and validator registries shipped with the skill. You can search by ID, title, or tag; filter craft and taste entries; and open the complete rule or principle without installing anything.

The installed skill contains two citable layers:

- [`CR-NNN` craft rules](skills/tastemaker/kb/craft/_index.md) teach measurable fixes and eye-training.
- [`TS-NNN` taste principles](skills/tastemaker/kb/_index.md) support judgment about coherence, character, conviction, and fit.

Each run follows the same retrieval sequence:

1. Build a brief: surface, audience, register, stakes, and ceiling.
2. Inspect the craft dimensions and route measurable issues to candidate `CR-NNN` rules.
3. Inspect the taste rungs and route judgment findings to candidate `TS-NNN` principles.
4. Read the complete candidate entries, including when-to-flex guidance.
5. Cite an ID only when it exists in `cr-ids.json` or `ts-ids.json`; otherwise state the finding without inventing a citation.

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
    ├── kb/                            # 20 CR rules + 12 TS principles
    ├── references/
    ├── scripts/
    └── LICENSE
```

## Validate the project

```bash
node _tools/validate.js
```

The validator checks the skill structure, both ID registries, every referenced KB file, renderer syntax, the HTML report fixture, the generated viewer, the packaged archive, licensing, private references, and common secret patterns.

## Status and limits

This is a focused working knowledge base, not a complete theory of design. Some valid findings will outrun its current 32 entries; Tastemaker should report those without fabricating IDs.

Motion principles cannot be evaluated from a static screenshot. Use a live prototype or video when motion is material. A positive taste verdict also does not prove that the product solves the right problem or that the interface is usable and accessible.

## License

This repository uses two licenses:

- Skill behavior, validation, viewer, and renderer scripts: [MIT](LICENSE-MIT)
- Knowledge-base entries, manifesto, examples, and explanatory documentation: [CC BY 4.0](LICENSE-CC-BY-4.0)

See [LICENSE](LICENSE) for the exact scope map and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for notices.

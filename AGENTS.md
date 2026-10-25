# Contributor guidance

Tastemaker is an installable design-evaluation skill with a bundled knowledge
base and generated public viewer.

## Source contracts

- `skills/tastemaker/SKILL.md` is the runtime router and must stay below 500 lines.
- `skills/tastemaker/kb/ts-ids.json` is the source of truth for all `TS-NNN` IDs.
- `skills/tastemaker/kb/craft/cr-ids.json` is the source of truth for all `CR-NNN` IDs.
- `skills/tastemaker/kb/tradeoffs/tr-ids.json` is the source of truth for all `TR-NNN` IDs.
- Registries are also the source of truth for every count and ID range stated in prose.
  The validator fails on drift, so update the registry first and the prose to match.
- House-profile rankings (`H-TR-NNN`) live in users' projects. Never add them to `tr-ids.json`.
- Never invent or cite an ID absent from its registry.
- Every registry path must exist and every entry must appear exactly once.
- Keep references one level below `SKILL.md` and link them directly.
- Do not add raw research runs, source screenshots, generated reports, local logs,
  cloned repositories, or organization-specific material to the public tree.

## Output contracts

- A bare Figma URL requires a choice between writeback and chat-only output.
- Never claim Figma writeback succeeded without verifying the created nodes.
- HTML reports are local artifacts unless the user separately authorizes publishing.
- Rebuild `index.html` after editing the KB.
- Rebuild `skills/tastemaker.skill` after changing any installed skill file.

## Validation

Run `node _tools/validate.js` before committing. It validates KB coverage, links,
generated artifacts, renderer syntax, package integrity, licenses, and public-data
safety checks.

## Licensing

Follow the scope map in `LICENSE`. New KB prose belongs under CC BY 4.0; new
skill implementation and scripts belong under MIT unless explicitly noted.

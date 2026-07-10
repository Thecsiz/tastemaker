# HTML Artifact Output Mode — Tastemaker

Use this mode when the user asks to save, share, or create a durable report. Building the report is local; publishing it requires a separate explicit request.

## When to use it

- A screenshot, live URL, file, or description needs more durable output than chat.
- The user asks for a report, artifact, saved critique, or `--artifact`.
- The user requests an additional shareable-format copy of a Figma critique.

## Report shape

- Verdict first: grade, rung reached versus ceiling, and the climb.
- Labeled Brief: surface, audience, register, stakes, ceiling, grade, and input.
- Evidence with numbered region callouts.
- Craft score across spacing, type, color, shadow, alignment, and density.
- Craft cards that teach: fix, rule, and eye-training.
- Taste cards that judge: observation, taste implication, judgment, and fix/protect direction.
- Masking caveat: Tasteful does not mean usable, accessible, strategically sound, or ready to ship.

Numbers are the evidence-to-finding link; color only reinforces it.

## Layouts

The builder selects among three layouts:

1. **Single mobile:** tall evidence remains beside the findings.
2. **Single wide:** landscape evidence sits above the findings.
3. **Flow:** screen thumbnails, flow synthesis, and collapsible per-screen finding groups.

## Build sequence

1. Capture evidence to local PNG, JPG, or WebP files when evidence exists.
2. Author `report.json` using the schema below.
3. Run `node scripts/build-report.js report.json --out <slug>.html` from the installed skill directory.
4. Open the HTML locally and verify the title, verdict, evidence, score, findings, and caveat.
5. Return the local output path. Do not publish automatically.

## Single-screen schema

```json
{
  "title": "Subscription overview",
  "subtitle": "Tastemaker evaluation",
  "brief": {
    "surface": "Desktop dashboard",
    "audience": "People reviewing recurring costs",
    "register": "Calm and trustworthy",
    "stakes": "Medium",
    "ceiling": "Characterful"
  },
  "grade": "Competent",
  "gradeNote": "Tight craft, but the identity remains generic.",
  "input": "Screenshot",
  "image": "overview.png",
  "layout": "wide",
  "regions": [
    {"label": "Hero summary", "rung": "characterful", "x": 4, "y": 6, "w": 60, "h": 26}
  ],
  "craftScore": [
    {"dim": "Spacing", "status": "ok", "note": "Uses a consistent scale."},
    {"dim": "Type", "status": "gap", "note": "Seven sizes; cap near five."}
  ],
  "findings": [
    {
      "kind": "craft",
      "dimension": "Type",
      "crIds": ["CR-102"],
      "consensus": "strong",
      "title": "The hierarchy uses too many sizes",
      "fix": "Collapse seven sizes to five.",
      "rule": "Use a small, deliberate type scale.",
      "eye": "Count sizes before judging hierarchy.",
      "region": 1
    },
    {
      "kind": "taste",
      "type": "GAP",
      "rung": "CHARACTERFUL",
      "tsIds": ["TS-008"],
      "title": "Typography communicates hierarchy but not voice",
      "verdict": "Fix: make the display type carry the product's identity.",
      "whatISee": "The same neutral sans handles every role.",
      "whyTaste": "The surface is coherent but could belong to any product.",
      "judgment": "It stops one rung below its ceiling.",
      "fixProtect": "Introduce one purposeful display treatment.",
      "region": 1
    }
  ],
  "verdict": {
    "reached": "Coherent; ceiling is Characterful.",
    "climb": "Simplify the type scale, then give display type a voice.",
    "protect": "The disciplined spacing rhythm."
  }
}
```

## Flow schema

Use `screens[]` plus `flowSynthesis` instead of root `image`, `regions`, and `findings`:

```json
{
  "title": "Onboarding flow",
  "grade": "Tasteful",
  "brief": {"surface": "Mobile onboarding", "ceiling": "Characterful"},
  "flowSynthesis": {
    "reached": "Characterful across the journey.",
    "climb": "Resolve the confirmation-screen voice seam.",
    "protect": "The illustration and type pairing."
  },
  "screens": [
    {"name": "Welcome", "image": "welcome.png", "regions": [], "findings": []},
    {"name": "Confirm", "image": "confirm.png", "regions": [], "findings": []}
  ],
  "craftScore": []
}
```

## Honest limits

- Screenshot region coordinates are estimates unless exact bounds are available.
- Images must be local to become self-contained data URIs.
- The skill authors the JSON; the builder does not extract findings automatically.
- Motion requires live or video evidence.

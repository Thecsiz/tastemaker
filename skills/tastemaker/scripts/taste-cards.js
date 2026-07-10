/*
 * taste-cards.js — Tastemaker Figma Output Mode
 *
 * Forked from ux-critique's figma-cards.js (v4.0). The MECHANICS are inherited
 * byte-for-faithful (font loading, text order-of-ops, auto-layout sizing,
 * pre-scan, overlap check, stage-flag) — those solved real bugs and are
 * brand-agnostic. The CONTENT MODEL is taste-specific:
 *   - Findings are STRENGTH / GAP (not severity), tagged with a ladder RUNG.
 *   - Craft findings use a dedicated CR-NNN teaching card: fix, rule, and eye.
 *   - Card sections: What I see / Why it matters for taste / The judgment /
 *     Fix-or-Protect.
 *   - Cites TS-NNN (+ optional UX-NNN cross-ref).
 *   - Flow synthesis: rung-reached-vs-ceiling + Overall grade + the climb +
 *     what to protect.
 *   - A masking-caveat card (tastemaker-specific): "Tasteful ≠ ship it."
 *
 * HOW TO USE FROM THE SKILL:
 *   1. Read this file, paste its full contents at the top of a `figma_execute`
 *      call. It self-attaches helpers to a local `TM` object.
 *   2. In the same call: await TM.preLoadFonts(); then build cards.
 *   3. Each figma_execute is a fresh sandbox — re-paste every call. Don't stash
 *      TM on globalThis.
 *
 * DESIGN INVARIANTS (inherited — do not change without updating the spec):
 *   - Fonts loaded once per call via preLoadFonts().
 *   - Every frame appended to parent BEFORE sizing/auto-layout props.
 *   - Text: textAutoResize=NONE → resize(w,h) → textAutoResize=HEIGHT → set characters.
 *   - Card layoutMode set BEFORE counterAxisSizingMode=FIXED; width set before either.
 *   - Colors come from the constant tables. Pass finding-type/rung names, not raw hex.
 */

const TM = (() => {
  // ───────────── Constants ──────────────────────────────────────────────────

  const COLOR = {
    cream:        rgb(0xFA, 0xF7, 0xF2),  // body surface
    innerCream:   rgb(0xF2, 0xED, 0xE5),  // judgment + fix block
    outline:      rgb(0xD9, 0xD4, 0xCC),  // 1px card border
    briefOutline: rgb(0xD9, 0xCF, 0xC1),  // Brief card outline
    near_black:   rgb(0x1A, 0x1A, 0x26),
    body:         rgb(0x33, 0x33, 0x33),
    subtle:       rgb(0x4D, 0x4D, 0x4D),
    label_gray:   rgb(0x66, 0x66, 0x66),
    kb_subtle:    rgb(0x99, 0x99, 0x99),  // entry title above card title
    link_blue:    rgb(0x33, 0x59, 0xB3),  // TS ref hyperlink
    protect_green:rgb(0x00, 0x80, 0x50),  // strength / protect
    caveat_amber: rgb(0xB3, 0x80, 0x00),  // masking-caveat accent
  };

  // Finding-type × rung determines the left rule + eyebrow color.
  // GREEN = strength/protect. WARM = a gap BELOW the ceiling (unfinished /
  // under-reaching). COOL/VIOLET = a gap OVER the ceiling (distinctiveness
  // where convention was right). CHARCOAL = flow-level. This is the ladder
  // made visible, not a severity scale.
  const FINDING = {
    // STRENGTH — always protect-green regardless of rung
    STRENGTH:        { rule: rgb(0x00, 0x80, 0x50), eyebrow: rgb(0x00, 0x80, 0x50) },
    // GAPs by where they sit on the ladder
    "GAP-COHERENT":     { rule: rgb(0xB3, 0x80, 0x00), eyebrow: rgb(0xB3, 0x80, 0x00) }, // amber — unfinished / incoherent
    "GAP-CHARACTERFUL": { rule: rgb(0xC2, 0x6A, 0x1F), eyebrow: rgb(0xC2, 0x6A, 0x1F) }, // burnt orange — missing identity
    "GAP-CONVICTED":    { rule: rgb(0x8E, 0x3B, 0x8E), eyebrow: rgb(0x8E, 0x3B, 0x8E) }, // deep magenta — under-reaching a high ceiling
    "GAP-CEILING":      { rule: rgb(0x58, 0x4D, 0x99), eyebrow: rgb(0x58, 0x4D, 0x99) }, // violet — over-reaching (distinctiveness where convention was right)
    FLOW:            { rule: rgb(0x33, 0x33, 0x33), eyebrow: rgb(0x33, 0x33, 0x33) },
    CAVEAT:          { rule: rgb(0xB3, 0x80, 0x00), eyebrow: rgb(0xB3, 0x80, 0x00) }, // amber — the masking caveat
  };

  // Resolve a finding's color key from {type, rung}.
  function findingKey(type, rung) {
    if (type === "STRENGTH") return "STRENGTH";
    const r = (rung || "").toUpperCase();
    if (r.includes("CEILING")) return "GAP-CEILING";
    if (r.includes("CONVICTED")) return "GAP-CONVICTED";
    if (r.includes("CHARACTERFUL")) return "GAP-CHARACTERFUL";
    return "GAP-COHERENT"; // default for COHERENT/CORRECT gaps
  }

  const FONTS = {
    sans: "Inter",
    mono_primary: "JetBrains Mono",
    mono_fallback: ["SF Mono", "Geist Mono", "Roboto Mono", "Menlo"],
  };

  let monoFamily = null;

  function rgb(r, g, b) {
    return { r: r / 255, g: g / 255, b: b / 255 };
  }
  function solid(color) {
    return [{ type: "SOLID", color }];
  }

  // ───────────── Font loading (inherited verbatim) ──────────────────────────

  async function preLoadFonts() {
    const sansStyles = ["Regular", "Medium", "Semi Bold", "Bold"];
    for (const style of sansStyles) {
      await figma.loadFontAsync({ family: FONTS.sans, style });
    }
    const available = await figma.listAvailableFontsAsync();
    const availNames = new Set(available.map(f => f.fontName.family));
    const tryOrder = [FONTS.mono_primary, ...FONTS.mono_fallback];
    for (const fam of tryOrder) {
      if (availNames.has(fam)) {
        await figma.loadFontAsync({ family: fam, style: "Regular" });
        monoFamily = fam;
        break;
      }
    }
    if (!monoFamily) monoFamily = FONTS.sans;
    return { sansFamily: FONTS.sans, monoFamily };
  }

  // ───────────── Text + frame primitives (inherited verbatim) ───────────────

  function txt(parent, content, opts = {}) {
    const {
      family = FONTS.sans, style = "Regular", size = 13,
      color = COLOR.body, width, letterSpacing,
    } = opts;
    const t = figma.createText();
    parent.appendChild(t);
    t.fontName = { family, style };
    t.fontSize = size;
    if (letterSpacing != null) t.letterSpacing = { unit: "PERCENT", value: letterSpacing };
    t.fills = solid(color);
    if (width != null) {
      t.textAutoResize = "NONE";
      t.resize(width, 20);
      t.textAutoResize = "HEIGHT";
    } else {
      t.textAutoResize = "WIDTH_AND_HEIGHT";
    }
    t.characters = content;
    return t;
  }

  function vstack(parent, opts = {}) {
    const {
      width = 375, itemSpacing = 12,
      padding = { top: 16, right: 16, bottom: 16, left: 16 },
      fillColor, stroke, cornerRadius = 0, hugVertical = true,
    } = opts;
    const f = figma.createFrame();
    parent.appendChild(f);
    f.layoutMode = "VERTICAL";
    f.resize(width, 100);
    f.primaryAxisSizingMode = hugVertical ? "AUTO" : "FIXED";
    f.counterAxisSizingMode = "FIXED";
    f.itemSpacing = itemSpacing;
    f.paddingTop = padding.top;
    f.paddingRight = padding.right;
    f.paddingBottom = padding.bottom;
    f.paddingLeft = padding.left;
    if (fillColor) f.fills = solid(fillColor);
    else f.fills = [];
    if (stroke) {
      f.strokes = solid(stroke.color);
      f.strokeWeight = stroke.weight || 1;
      if (stroke.leftWeight != null) {
        f.strokeTopWeight = stroke.weight || 1;
        f.strokeRightWeight = stroke.weight || 1;
        f.strokeBottomWeight = stroke.weight || 1;
        f.strokeLeftWeight = stroke.leftWeight;
      }
    }
    if (cornerRadius) f.cornerRadius = cornerRadius;
    return f;
  }

  function innerWidth(outerWidth, leftPad = 16, rightPad = 16) {
    return outerWidth - leftPad - rightPad;
  }

  // ───────────── Brief card (taste Brief from Step 0.5) ─────────────────────

  /**
   * @param brief — { surfaceType, audience, register, stakes, ceiling, focus }
   * @param opts  — { x, y, width, parent }
   */
  function buildBriefCard(brief, opts) {
    const { x = 0, y = 0, width = 375, parent = figma.currentPage } = opts || {};
    const card = vstack(parent, {
      width, itemSpacing: 8,
      padding: { top: 18, right: 20, bottom: 18, left: 20 },
      fillColor: COLOR.cream, stroke: { color: COLOR.briefOutline, weight: 1 },
      cornerRadius: 6,
    });
    card.name = `BRIEF — ${brief.surfaceType ? String(brief.surfaceType).slice(0, 50) : "session"}`;
    card.x = x; card.y = y;
    const w = innerWidth(width, 20, 20);

    txt(card, "TASTE BRIEF", { family: monoFamily, size: 11, letterSpacing: 6, color: COLOR.label_gray });
    if (brief.headline) {
      txt(card, brief.headline, { family: FONTS.sans, style: "Bold", size: 16, color: COLOR.near_black, width: w });
    }
    const rows = [];
    if (brief.surfaceType) rows.push(["Surface", brief.surfaceType]);
    if (brief.audience)    rows.push(["Audience", brief.audience]);
    if (brief.register)    rows.push(["Register", brief.register]);
    if (brief.stakes)      rows.push(["Stakes", brief.stakes]);
    if (brief.ceiling)     rows.push(["Ceiling", brief.ceiling]);
    for (const [label, value] of rows) {
      const t = txt(card, `· ${label}: ${value}`, { size: 13, color: COLOR.subtle, width: w });
      const start = 2, end = 2 + label.length;
      t.setRangeFontName(start, end, { family: FONTS.sans, style: "Semi Bold" });
      t.setRangeFills(start, end, solid(COLOR.near_black));
    }
    if (brief.focus) {
      txt(card, "FOCUS", { family: monoFamily, size: 10, letterSpacing: 6, color: COLOR.label_gray });
      txt(card, brief.focus, { size: 13, color: COLOR.subtle, width: w });
    }
    return card;
  }

  // ───────────── Finding card (per-screen STRENGTH / GAP) ────────────────────

  /**
   * @param spec — TasteFindingSpec:
   *   {
   *     findingId,        // "Finding-01"
   *     type,             // "STRENGTH" | "GAP"
   *     rung,             // "COHERENT" | "CHARACTERFUL" | "CONVICTED" | "CEILING"
   *     tsId,             // "TS-001"
   *     tsTitle,          // "The Inevitability Test"
   *     uxRef,            // optional "UX-081" cross-ref string
   *     title,            // narrative hook (bold)
   *     verdict,          // pull-quote (Medium italic-feel): "Fix: ..." or "Protect: ..."
   *     whatISee,         // prose
   *     whyTaste,         // prose — "why it matters for taste"
   *     judgment,         // prose — the committed taste verdict (inner surface)
   *     fixOrProtect,     // string[] of bullets (inner surface) — fixes OR protect-notes
   *     tsViewerBase,     // optional URL base for citation hyperlink
   *   }
   * @returns { card, id, height }
   */
  function buildFindingCard(spec, x, y, width = 375, parent = figma.currentPage) {
    const key = findingKey(spec.type, spec.rung);
    const fc = FINDING[key] || FINDING["GAP-COHERENT"];

    const isStrength = spec.type === "STRENGTH";
    const card = vstack(parent, {
      width, itemSpacing: 14,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      fillColor: isStrength ? rgb(0xF2, 0xFA, 0xF7) : COLOR.cream, // strengths get a faint green tint
      stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    const rungLabel = spec.rung ? ` ${String(spec.rung).toUpperCase()}` : "";
    card.name = `${spec.type}${rungLabel} · ${spec.tsId || ""} — ${(spec.title || "").slice(0, 50)}`;
    card.x = x; card.y = y;
    const w = innerWidth(width, 20, 20);

    // 1. Eyebrow: TYPE · RUNG · TS-NNN  (+ optional UX cross-ref)
    let eyebrow = spec.type;
    if (spec.rung) eyebrow += ` · ${String(spec.rung).toUpperCase()}`;
    if (spec.tsId) eyebrow += ` · ${spec.tsId}`;
    if (spec.uxRef) eyebrow += ` · ${spec.uxRef}`;
    txt(card, eyebrow, { family: monoFamily, size: 11, letterSpacing: 6, color: fc.eyebrow });

    // 2. TS entry title (subtle)
    if (spec.tsTitle) {
      txt(card, spec.tsTitle, { size: 12, color: COLOR.kb_subtle, width: w });
    }

    // 3. Bold title
    const titleStr = spec.findingId ? `${spec.findingId} · ${spec.title}` : spec.title;
    txt(card, titleStr, { family: FONTS.sans, style: "Bold", size: 18, color: COLOR.near_black, width: w });

    // 4. Verdict pull-quote (Medium)
    if (spec.verdict) {
      txt(card, spec.verdict, { family: FONTS.sans, style: "Medium", size: 14, color: COLOR.subtle, width: w });
    }

    // Section: What I see
    if (spec.whatISee) {
      addLabeledProse(card, "WHAT I SEE", spec.whatISee, w, COLOR.label_gray);
    }
    // Section: Why it matters for taste
    if (spec.whyTaste) {
      addLabeledProse(card, "WHY IT MATTERS FOR TASTE", spec.whyTaste, w, COLOR.label_gray);
    }

    // Inner surface: The judgment + Fix/Protect
    if (spec.judgment || (spec.fixOrProtect && spec.fixOrProtect.length)) {
      const inner = vstack(card, {
        width: w, itemSpacing: 10,
        padding: { top: 14, right: 16, bottom: 14, left: 16 },
        fillColor: isStrength ? rgb(0xE8, 0xF5, 0xEF) : COLOR.innerCream,
        cornerRadius: 4,
      });
      inner.layoutSizingHorizontal = "FILL";
      const innerW = innerWidth(w, 16, 16);
      if (spec.judgment) {
        addLabeledProse(inner, "THE JUDGMENT", spec.judgment, innerW, COLOR.near_black);
      }
      if (spec.fixOrProtect && spec.fixOrProtect.length) {
        const label = isStrength ? "PROTECT" : "FIX";
        addLabeledBullets(inner, label, spec.fixOrProtect, innerW, COLOR.protect_green);
      }
    }

    // TS reference line — hyperlinked
    if (spec.tsId && spec.tsTitle) {
      const refStr = `${spec.tsId} — ${spec.tsTitle}`;
      const ref = txt(card, refStr, { family: monoFamily, size: 11, color: COLOR.link_blue, width: w });
      if (spec.tsViewerBase) {
        try {
          ref.setRangeHyperlink(0, refStr.length, { type: "URL", value: `${spec.tsViewerBase}#${spec.tsId}` });
        } catch (e) { /* degrade to colored text */ }
      }
    }

    return { card, id: card.id, height: card.height };
  }

  // ───────────── Craft card (measurable CR-NNN teaching finding) ───────────

  /**
   * @param spec — CraftFindingSpec:
   *   {
   *     findingId,   // "Craft-01"
   *     type,        // "STRENGTH" | "GAP"
   *     dimension,   // "TYPE HIERARCHY"
   *     crId,        // "CR-102"
   *     crTitle,     // "Cap the Type Scale"
   *     consensus,   // "law" | "strong" | "heuristic" | "one-opinion"
   *     title,       // concise observed mechanism
   *     fix,         // specific change (or what to protect for a strength)
   *     rule,        // measurable principle behind the change
   *     eye,         // how to notice this issue next time
   *     evidence,    // optional observed values or visible evidence
   *     crViewerBase // optional URL base for citation hyperlink
   *   }
   * @returns { card, id, height }
   */
  function buildCraftCard(spec, x, y, width = 375, parent = figma.currentPage) {
    const isStrength = spec.type === "STRENGTH";
    const fc = isStrength ? FINDING.STRENGTH : FINDING["GAP-COHERENT"];
    const card = vstack(parent, {
      width, itemSpacing: 12,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      fillColor: isStrength ? rgb(0xF2, 0xFA, 0xF7) : COLOR.cream,
      stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    card.name = `CRAFT ${spec.type || "GAP"} · ${spec.crId || ""} — ${(spec.title || "").slice(0, 50)}`;
    card.x = x; card.y = y;
    const w = innerWidth(width, 20, 20);

    let eyebrow = `CRAFT ${spec.type || "GAP"}`;
    if (spec.dimension) eyebrow += ` · ${String(spec.dimension).toUpperCase()}`;
    if (spec.crId) eyebrow += ` · ${spec.crId}`;
    txt(card, eyebrow, { family: monoFamily, size: 11, letterSpacing: 6, color: fc.eyebrow });

    if (spec.crTitle) txt(card, spec.crTitle, { size: 12, color: COLOR.kb_subtle, width: w });
    const titleStr = spec.findingId ? `${spec.findingId} · ${spec.title}` : spec.title;
    txt(card, titleStr, { family: FONTS.sans, style: "Bold", size: 18, color: COLOR.near_black, width: w });
    if (spec.consensus) {
      txt(card, `CONSENSUS · ${String(spec.consensus).toUpperCase()}`, {
        family: monoFamily, size: 10, letterSpacing: 4, color: COLOR.label_gray,
      });
    }
    if (spec.evidence) addLabeledProse(card, "EVIDENCE", spec.evidence, w, COLOR.label_gray);

    const inner = vstack(card, {
      width: w, itemSpacing: 10,
      padding: { top: 14, right: 16, bottom: 14, left: 16 },
      fillColor: isStrength ? rgb(0xE8, 0xF5, 0xEF) : COLOR.innerCream,
      cornerRadius: 4,
    });
    inner.layoutSizingHorizontal = "FILL";
    const innerW = innerWidth(w, 16, 16);
    if (spec.fix) addLabeledProse(inner, isStrength ? "PROTECT" : "FIX", spec.fix, innerW, fc.eyebrow);
    if (spec.rule) addLabeledProse(inner, "RULE", spec.rule, innerW, COLOR.near_black);
    if (spec.eye) addLabeledProse(inner, "TRAIN YOUR EYE", spec.eye, innerW, COLOR.near_black);

    if (spec.crId && spec.crTitle) {
      const refStr = `${spec.crId} — ${spec.crTitle}`;
      const ref = txt(card, refStr, { family: monoFamily, size: 11, color: COLOR.link_blue, width: w });
      if (spec.crViewerBase) {
        try {
          ref.setRangeHyperlink(0, refStr.length, { type: "URL", value: `${spec.crViewerBase}#${spec.crId}` });
        } catch (e) { /* degrade to colored text */ }
      }
    }

    return { card, id: card.id, height: card.height };
  }

  // ───────────── Solid card ("this screen holds — nothing to flag") ─────────

  /**
   * A green "SOLID" card for a screen with no gap — so every screen in a flow
   * gets a card and the designer sees COVERAGE, not silence. Smaller than a
   * finding card: it names what holds and why.
   * @param spec — { findingId?, tsId?, tsTitle?, title, why }
   */
  function buildSolidCard(spec, x, y, width = 375, parent = figma.currentPage) {
    const fc = FINDING.STRENGTH;
    const card = vstack(parent, {
      width, itemSpacing: 12,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      fillColor: rgb(0xF2, 0xFA, 0xF7),
      stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    card.name = `SOLID · ${(spec.title || "").slice(0, 50)}`;
    card.x = x; card.y = y;
    const w = innerWidth(width, 20, 20);
    txt(card, "SOLID — HOLDS ITS RUNG", { family: monoFamily, size: 11, letterSpacing: 6, color: fc.eyebrow });
    if (spec.tsTitle) txt(card, spec.tsTitle, { size: 12, color: COLOR.kb_subtle, width: w });
    const titleStr = spec.findingId ? `${spec.findingId} · ${spec.title}` : spec.title;
    txt(card, titleStr, { family: FONTS.sans, style: "Bold", size: 16, color: COLOR.near_black, width: w });
    if (spec.why) txt(card, spec.why, { size: 13, color: COLOR.subtle, width: w });
    if (spec.tsId && spec.tsTitle) txt(card, `${spec.tsId} — ${spec.tsTitle}`, { family: monoFamily, size: 11, color: COLOR.link_blue, width: w });
    return { card, id: card.id, height: card.height };
  }

  // ───────────── Flow synthesis cards ───────────────────────────────────────

  /**
   * Flow-level ladder read — rung reached vs. ceiling across the whole flow.
   * @param spec — {
   *   reached,     // "Reached Characterful; ceiling is Convicted — one rung short."
   *   byRung,      // optional prose: where different surfaces sit
   *   theClimb,    // "The one move that would lift the flow: ..."
   *   protect,     // "What to protect: ..."
   * }
   */
  function buildFlowLadderCard(spec, x, y, width = 780, parent = figma.currentPage) {
    const fc = FINDING.FLOW;
    const card = vstack(parent, {
      width, itemSpacing: 14,
      padding: { top: 20, right: 24, bottom: 20, left: 24 },
      fillColor: COLOR.cream, stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    card.name = "FLOW · Ladder Read";
    card.x = x; card.y = y;
    const w = innerWidth(width, 24, 24);

    txt(card, "FLOW · LADDER READ", { family: monoFamily, size: 11, letterSpacing: 6, color: fc.eyebrow });
    if (spec.reached) {
      txt(card, spec.reached, { family: FONTS.sans, style: "Bold", size: 18, color: COLOR.near_black, width: w });
    }
    if (spec.byRung)   addLabeledProse(card, "ACROSS THE FLOW", spec.byRung, w, COLOR.label_gray);
    if (spec.theClimb) addLabeledProse(card, "THE CLIMB", spec.theClimb, w, COLOR.label_gray);
    if (spec.protect)  addLabeledProse(card, "WHAT TO PROTECT", spec.protect, w, COLOR.protect_green);
    return { card, id: card.id, height: card.height };
  }

  /**
   * Overall assessment — grade + the climb + masking caveat baked in.
   * @param spec — {
   *   grade,            // "Tasteful" | "Competent" | "Unrealized"
   *   gradeReason,      // one-line why
   *   findingTally,     // "2 strengths · 2 gaps · 1 ceiling note"
   *   topMoves,         // string[] of ranked moves
   *   coverage,         // "Cited TS-001,002,006…; 0 candidate principles flagged."
   * }
   */
  function buildOverallCard(spec, x, y, width = 780, parent = figma.currentPage) {
    const fc = FINDING.FLOW;
    const card = vstack(parent, {
      width, itemSpacing: 14,
      padding: { top: 20, right: 24, bottom: 20, left: 24 },
      fillColor: COLOR.cream, stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    card.name = "FLOW · Overall Assessment";
    card.x = x; card.y = y;
    const w = innerWidth(width, 24, 24);

    txt(card, "FLOW · OVERALL ASSESSMENT", { family: monoFamily, size: 11, letterSpacing: 6, color: fc.eyebrow });
    if (spec.grade) {
      txt(card, `Grade: ${spec.grade}`, { family: FONTS.sans, style: "Bold", size: 20, color: COLOR.near_black, width: w });
    }
    if (spec.gradeReason) txt(card, spec.gradeReason, { size: 13, color: COLOR.subtle, width: w });
    if (spec.findingTally) {
      txt(card, `Findings: ${spec.findingTally}`, { family: monoFamily, size: 12, color: COLOR.subtle, width: w });
    }
    if (spec.topMoves && spec.topMoves.length) {
      addLabeledBullets(card, "THE CLIMB — TOP MOVES", spec.topMoves, w, COLOR.protect_green);
    }
    if (spec.coverage) {
      txt(card, `KB coverage: ${spec.coverage}`, { family: monoFamily, size: 11, color: COLOR.kb_subtle, width: w });
    }

    // The masking caveat — always present on the overall card (tastemaker-specific).
    const caveat = vstack(card, {
      width: w, itemSpacing: 6,
      padding: { top: 12, right: 14, bottom: 12, left: 14 },
      fillColor: rgb(0xFB, 0xF3, 0xE0), // faint amber wash
      stroke: { color: FINDING.CAVEAT.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 4,
    });
    caveat.layoutSizingHorizontal = "FILL";
    const cw = innerWidth(w, 14, 14);
    txt(caveat, "SCOPE", { family: monoFamily, size: 10, letterSpacing: 6, color: FINDING.CAVEAT.eyebrow });
    txt(caveat,
      "This assesses TASTE only. It does not verify that the design works (usability / accessibility — run /ux-critique) or that it's worth building (the right problem — product strategy, upstream). “Tasteful” is not “good to ship.”",
      { size: 12, color: COLOR.body, width: cw });

    return { card, id: card.id, height: card.height };
  }

  /**
   * Standalone masking-caveat card — for Broad/Targeted (single-screen) runs
   * that don't get the Overall card. Same content, card-shaped.
   */
  function buildMaskingCaveatCard(x, y, width = 375, parent = figma.currentPage) {
    const fc = FINDING.CAVEAT;
    const card = vstack(parent, {
      width, itemSpacing: 6,
      padding: { top: 16, right: 18, bottom: 16, left: 18 },
      fillColor: rgb(0xFB, 0xF3, 0xE0),
      stroke: { color: fc.rule, weight: 1, leftWeight: 4 },
      cornerRadius: 6,
    });
    card.name = "SCOPE · Taste-only caveat";
    card.x = x; card.y = y;
    const w = innerWidth(width, 18, 18);
    txt(card, "SCOPE", { family: monoFamily, size: 10, letterSpacing: 6, color: fc.eyebrow });
    txt(card,
      "This assesses TASTE only. It does not verify that the design works (usability / accessibility — run /ux-critique) or that it's worth building (the right problem — product strategy, upstream). “Tasteful” is not “good to ship.”",
      { size: 12, color: COLOR.body, width: w });
    return { card, id: card.id, height: card.height };
  }

  // ───────────── Section helpers (inherited) ────────────────────────────────

  function addLabeledProse(parent, label, proseText, width, labelColor) {
    txt(parent, label, { family: monoFamily, size: 11, letterSpacing: 6, color: labelColor });
    txt(parent, proseText, { size: 12, color: COLOR.body, width });
  }
  function addLabeledBullets(parent, label, bullets, width, labelColor) {
    txt(parent, label, { family: monoFamily, size: 11, letterSpacing: 6, color: labelColor });
    for (const b of bullets) txt(parent, `• ${b}`, { size: 12, color: COLOR.body, width });
  }

  // ───────────── Layout helpers (inherited verbatim) ────────────────────────

  function preScanLayout(page = figma.currentPage) {
    const sections = page.children.filter(n =>
      n.type === "SECTION" && n.height > 0 && n.width > 0 && !/^v3:/.test(n.name));
    const allFrames = page.children.filter(n =>
      (n.type === "FRAME" || n.type === "INSTANCE") && n.height > 0 && n.width > 0);
    const looseFrameArtboards = allFrames.filter(n =>
      n.height > 400 && n.width >= 320 && !/^v3:/.test(n.name) && !/^Frame \d+$/.test(n.name));
    const artboards = [...sections, ...looseFrameArtboards];
    const colMap = new Map();
    for (const ab of artboards) {
      if (!colMap.has(ab.x)) colMap.set(ab.x, { x: ab.x, artboard: ab, elements: [] });
    }
    const sectionXRanges = sections.map(s => ({ x0: s.x, x1: s.x + s.width }));
    for (const f of allFrames) {
      if (artboards.includes(f)) continue;
      const insideSection = sectionXRanges.some(r => f.x >= r.x0 && f.x + f.width <= r.x1);
      if (insideSection) continue;
      for (const col of colMap.values()) {
        const ab = col.artboard;
        if (f.x < ab.x + ab.width && f.x + f.width > ab.x) col.elements.push(f);
      }
    }
    const columns = [];
    let pageBottom = 0;
    for (const col of colMap.values()) {
      const bottoms = [col.artboard.y + col.artboard.height, ...col.elements.map(e => e.y + e.height)];
      col.cardStartY = Math.max(...bottoms) + 40;
      pageBottom = Math.max(pageBottom, col.cardStartY);
      columns.push(col);
    }
    columns.sort((a, b) => a.x - b.x);
    return { columns, pageBottom };
  }

  async function verifyNoOverlap(cardIds, page = figma.currentPage) {
    // Figma dynamic-page document access requires the async getter — the sync
    // figma.getNodeById throws under documentAccess: dynamic-page. (Caught on the
    // first live writeback test, 2026-06-01.)
    const cards = (await Promise.all(cardIds.map(id => figma.getNodeByIdAsync(id)))).filter(Boolean);
    const otherFrames = page.children.filter(n =>
      (n.type === "FRAME" || n.type === "SECTION") && !cardIds.includes(n.id));
    function intersect(a, b) {
      return !(a.x + a.width <= b.x || b.x + b.width <= a.x ||
               a.y + a.height <= b.y || b.y + b.height <= a.y);
    }
    const overlaps = [];
    for (const card of cards) {
      for (const other of otherFrames) {
        if (intersect(card, other)) overlaps.push({ type: "card-element", card: card.name, element: other.name });
      }
      for (const c2 of cards) {
        if (c2 === card || c2.id <= card.id) continue;
        if (intersect(card, c2)) overlaps.push({ type: "card-card", card1: card.name, card2: c2.name });
      }
    }
    return overlaps;
  }

  function placeAbove(card, artboardTopY, gap = 24) {
    card.y = artboardTopY - card.height - gap;
  }

  // ───────────── Stage-flag fast-path (inherited verbatim) ──────────────────

  const CONTEXT_FRAME_KEYWORDS = [
    "overview", "timeline", "objectives", "agenda", "context", "deliverables",
    "success metrics", "target audience", "customer problem", "customer mindset",
    "from and to", "segments", "notes", "note", "cover", "resources",
    "requirements", "drivers", "brief", "background", "research", "how to",
  ];
  const CONTEXT_PAGE_KEYWORDS = ["context", "read me", "cover", "archive", "local component"];
  const META_MIN_WIDTH = 1800;

  function pickStageFlag(frame, pageName) {
    if (!frame) return null;
    const fname = (frame.name || "").toLowerCase().trim();
    const pname = (pageName || "").toLowerCase().trim();
    if (CONTEXT_PAGE_KEYWORDS.some(k => pname.includes(k))) return "META";
    if (fname === ":::" || fname === "---" || fname === "" || fname.startsWith(":::")) return "META";
    if ((frame.width || 0) < META_MIN_WIDTH) return null;
    for (const k of CONTEXT_FRAME_KEYWORDS) {
      if (fname === k || fname.startsWith(k + " ") || fname.startsWith(k + ":")) return "META";
    }
    return null;
  }

  // ───────────── Public surface ─────────────────────────────────────────────

  return {
    COLOR, FINDING, FONTS,
    CONTEXT_FRAME_KEYWORDS, CONTEXT_PAGE_KEYWORDS, META_MIN_WIDTH,
    rgb, solid, txt, vstack, innerWidth, findingKey,
    preLoadFonts,
    get monoFamily() { return monoFamily; },
    buildBriefCard, buildCraftCard, buildFindingCard, buildSolidCard,
    buildFlowLadderCard, buildOverallCard, buildMaskingCaveatCard,
    preScanLayout, verifyNoOverlap, placeAbove,
    pickStageFlag,
  };
})();

// `TM` is in scope for the rest of the figma_execute body.
if (typeof module !== "undefined") module.exports = { TM };

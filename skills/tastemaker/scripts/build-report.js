#!/usr/bin/env node
/*
 * build-report.js — Tastemaker HTML Artifact Output Mode (v2: mobile · wide · flow)
 *
 * Emits a self-contained HTML taste report. Three layouts, auto-detected:
 *   - SINGLE-MOBILE  : tall screenshot → evidence sticky on the left, findings beside (the original).
 *   - SINGLE-WIDE    : landscape screenshot (aspect > 1.2, or layout:"wide") → evidence FULL-WIDTH
 *                      on top, findings below. Fixes desktop screenshots squashing in a 300px column.
 *   - FLOW           : data has `screens[]` → a row of screen thumbnails (each with its own regions +
 *                      per-screen finding group) + a flow-level synthesis card on top.
 * Always: craft-score table, verdict, masking caveat. Editorial-on-warm-paper styling.
 * The image(s) are base64-embedded → self-contained, survives publishing.
 *
 * USAGE: node build-report.js <report.json> [--out report.html]
 *
 * SCHEMA — single screen (mobile or wide):
 *   { title, subtitle, brief, grade, gradeNote, input,
 *     image:"/abs/path.png", layout:"auto"|"wide"|"mobile",
 *     regions:[{label,rung,x,y,w,h}],            // percent of the image
 *     craftScore:[{dim,status:"ok"|"gap"|"na",note}],
 *     findings:[ craftFinding | tasteFinding ],
 *     verdict:{reached,climb,protect} }
 *
 * SCHEMA — flow (multi-screen): same top-level fields, but instead of image/regions/findings use:
 *   { ...title/brief/grade/input...,
 *     flowSynthesis:{ reached, climb, protect, byScreen? },   // the flow-level read (rendered on top)
 *     screens:[ { name, image, regions:[...], findings:[...], note? } ],   // per-screen
 *     craftScore:[...]?,                                       // optional flow-wide craft score
 *     verdict:{reached,climb,protect} }                        // optional; falls back to flowSynthesis
 *
 * Finding shapes:
 *   CRAFT (teach):  { kind:"craft", dimension, crIds:[], consensus, title, fix, rule, eye, ref }
 *   TASTE (eval):   { kind:"taste", type:"STRENGTH|GAP", rung, tsIds:[], title, verdict, whatISee, whyTaste, judgment, fixProtect, ref }
 *
 * rung/kind → color: convicted/characterful=magenta · craft/coherent=amber · ceiling=violet · strength=green
 */

const fs = require("fs");
const path = require("path");

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function colorClass(f) {
  if (f.kind === "craft") return "craft";
  if (f.type === "STRENGTH") return "strength";
  const r = (f.rung || "").toLowerCase();
  if (r.includes("ceiling")) return "ceiling";
  if (r.includes("convicted")) return "convicted";
  if (r.includes("characterful")) return "characterful";
  return "coherent";
}
function regionClass(rung) {
  const r = (rung || "").toLowerCase();
  if (r === "strength") return "strength";
  if (r.includes("ceiling")) return "ceiling";
  if (r.includes("convict")) return "convicted";
  if (r.includes("character")) return "characterful";
  return "craft";
}

// image path → { tag, mime } base64 data-URI <img>, or null
function imgTagFor(imgPath, alt) {
  if (!imgPath) return null;
  if (!fs.existsSync(imgPath)) throw new Error(`Image not found: ${imgPath}`);
  const buf = fs.readFileSync(imgPath);
  const ext = path.extname(imgPath).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `<img alt="${esc(alt || "")}" src="data:${mime};base64,${buf.toString("base64")}">`;
}

// crude aspect read (PNG/JPEG header) to auto-pick wide vs mobile
function aspectOf(imgPath) {
  try {
    const b = fs.readFileSync(imgPath);
    // PNG: width@16, height@20 (big-endian)
    if (b[0] === 0x89 && b[1] === 0x50) {
      const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
      return w / h;
    }
    // JPEG: scan SOF markers
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        const h = b.readUInt16BE(i + 5), w = b.readUInt16BE(i + 7);
        return w / h;
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch (e) {}
  return 0.5; // assume tall if unknown
}

// UX-049: number each region so the evidence↔finding link survives without color. Rung word in the label too.
const NUM = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
function rungWord(rung) {
  const c = regionClass(rung);
  return { convicted: "Convicted", characterful: "Characterful", coherent: "Coherent", craft: "Craft", ceiling: "Ceiling", strength: "Strength" }[c] || "";
}
function regionDivs(regions = []) {
  return regions.map((r, i) =>
    `<div class="region ${regionClass(r.rung)}" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%"><span>${NUM[i] || (i + 1)} ${esc(r.label)}</span></div>`
  ).join("\n");
}
function legendFor(regions = []) {
  if (!regions.length) return "";
  return `<div class="legend">` + regions.map((r, i) =>
    `<span class="lg-num ${regionClass(r.rung)}">${NUM[i] || (i + 1)}</span> <b>${esc(r.label)}</b> <span class="lg-rung">${rungWord(r.rung)}</span>`).join("<br>\n") + `</div>`;
}
function shot(imgTag, regions, wide) {
  return `<div class="shot${wide ? " wide" : ""}">${imgTag}\n${regionDivs(regions)}</div>`;
}

// region marker chip — echoes the numbered region box on the screenshot (UX-049 redundant channel)
function regionMark(f) {
  if (!f.region) return "";
  const i = f.region - 1;
  return `<span class="rmark ${colorClass(f)}">${NUM[i] || f.region}</span> `;
}
function craftCard(f) {
  const ids = [].concat(f.crIds || []).join(" / ");
  return `<div class="card craft">
    <div class="eyebrow">${regionMark(f)}Craft · ${esc(f.dimension || "")} · ${esc(ids)}${f.consensus ? " · " + esc(f.consensus) : ""}</div>
    <h3>${esc(f.title)}</h3>
    ${f.fix ? `<div class="label">The fix</div><p>${esc(f.fix)}</p>` : ""}
    ${f.rule ? `<div class="label">The rule</div><p>${esc(f.rule)}</p>` : ""}
    ${f.eye ? `<div class="label">Train your eye</div><p>${esc(f.eye)}</p>` : ""}
    ${f.ref ? `<div class="ref">${esc(f.ref)}</div>` : ""}
  </div>`;
}
function tasteCard(f) {
  const cls = colorClass(f);
  const ids = [].concat(f.tsIds || []).join(" · ");
  const eyebrow = `${esc(f.type || "")}${f.rung ? " · " + esc(f.rung) : ""}${ids ? " · " + esc(ids) : ""}`;
  const fpLabel = f.type === "STRENGTH" ? "Protect" : "Fix";
  return `<div class="card ${cls}">
    <div class="eyebrow">${regionMark(f)}${eyebrow}</div>
    <h3>${esc(f.title)}</h3>
    ${f.verdict ? `<p class="verdict">${esc(f.verdict)}</p>` : ""}
    ${f.whatISee ? `<div class="label">What I see</div><p>${esc(f.whatISee)}</p>` : ""}
    ${f.whyTaste ? `<div class="label">Why it matters for taste</div><p>${esc(f.whyTaste)}</p>` : ""}
    ${f.judgment ? `<div class="label">The judgment</div><p>${esc(f.judgment)}</p>` : ""}
    ${f.fixProtect ? `<div class="label">${fpLabel}</div><p>${esc(f.fixProtect)}</p>` : ""}
    ${f.ref ? `<div class="ref">${esc(f.ref)}</div>` : ""}
  </div>`;
}
function cards(findings = []) {
  return findings.map(f => f.kind === "craft" ? craftCard(f) : tasteCard(f)).join("\n");
}

function scoreBlock(craftScore) {
  if (!craftScore || !craftScore.length) return "";
  const rows = craftScore.map(s =>
    `<span class="dim">${esc(s.dim)}</span><span class="${s.status}">${s.status === "na" ? "—" : s.status === "gap" ? "✗" : "✓"} ${esc(s.note)}</span>`
  ).join("\n");
  return `<h2>Craft score — the measurable floor</h2><div class="score">${rows}</div>`;
}

function synthBlock(s, label = "Flow synthesis") {
  if (!s) return "";
  return `<div class="climb">
    ${s.reached ? `<p style="margin-bottom:10px"><b>Rung reached vs. ceiling:</b> ${esc(s.reached)}</p>` : ""}
    ${s.byScreen ? `<p style="margin-bottom:10px"><b>Across the flow:</b> ${esc(s.byScreen)}</p>` : ""}
    ${s.climb ? `<p style="margin-bottom:10px"><b>The climb:</b> ${esc(s.climb)}</p>` : ""}
    ${s.protect ? `<p style="margin:0"><b>What to protect:</b> ${esc(s.protect)}</p>` : ""}
  </div>`;
}

// UX-429: lead with the verdict. Grade chip + the climb, right under the title, before the evidence.
function summaryBand(data) {
  const gradeClass = (data.grade || "").toLowerCase();
  const v = data.verdict || data.flowSynthesis || {};
  const climb = v.climb ? `<p class="band-climb"><b>The climb:</b> ${esc(v.climb)}</p>` : "";
  const ceiling = v.reached ? `<p class="band-ceiling">${esc(v.reached)}</p>` : "";
  // chip carries only the grade word — the long gradeNote lives in the band body + the Brief Grade row.
  return `<div class="summary">
    <span class="grade ${gradeClass}">${esc(data.grade)}</span>
    <div class="summary-body">${ceiling}${climb}</div>
  </div>`;
}

// UX-487: the Brief as a labeled key-value list, not a middot run-on. Ceiling pulled out + emphasized.
// Accepts either the legacy string brief, or a structured object {surface,audience,register,stakes,ceiling}.
function briefBlock(data) {
  const b = data.brief;
  const gradeMeta = `<div class="brief-row"><span class="brief-k">Grade</span><span class="brief-v">${esc(data.grade)}${data.gradeNote ? " · " + esc(data.gradeNote) : ""}</span></div>`;
  const inputMeta = data.input ? `<div class="brief-row"><span class="brief-k">Input</span><span class="brief-v">${esc(data.input)}</span></div>` : "";
  if (b && typeof b === "object") {
    const order = [["surface", "Surface"], ["audience", "Audience"], ["register", "Register"], ["stakes", "Stakes"]];
    const rows = order.filter(([k]) => b[k]).map(([k, label]) =>
      `<div class="brief-row"><span class="brief-k">${label}</span><span class="brief-v">${esc(b[k])}</span></div>`).join("\n");
    const ceiling = b.ceiling ? `<div class="brief-row ceiling-row"><span class="brief-k">Ceiling</span><span class="brief-v">${esc(b.ceiling)}</span></div>` : "";
    return `<div class="brief">${rows}\n${ceiling}\n${gradeMeta}${inputMeta}</div>`;
  }
  // legacy string brief — still render as a labeled block, not a run-on
  const reading = b ? `<div class="brief-row"><span class="brief-k">Reading as</span><span class="brief-v">${esc(b)}</span></div>` : "";
  return `<div class="brief">${reading}\n${gradeMeta}${inputMeta}</div>`;
}

function buildBody(data) {
  // ── FLOW ──
  if (Array.isArray(data.screens) && data.screens.length) {
    const thumbs = data.screens.map((sc, i) => {
      const tag = imgTagFor(sc.image, sc.name);
      const wide = sc.image ? aspectOf(sc.image) > 1.2 : false;
      return `<figure class="screen${wide ? " wide" : ""}">
        ${tag ? shot(tag, sc.regions, wide) : ""}
        <figcaption>${esc(sc.name || ("Screen " + (i + 1)))}${sc.note ? ` — <span>${esc(sc.note)}</span>` : ""}</figcaption>
      </figure>`;
    }).join("\n");
    // UX-104: collapse per-screen groups so a long flow is navigable, not one flat scroll.
    // First group open by default; the rest collapsed behind a one-line summary.
    const perScreen = data.screens.map((sc, i) => {
      if (!sc.findings || !sc.findings.length) return "";
      const n = sc.findings.length;
      const summary = `${esc(sc.name || ("Screen " + (i + 1)))} <span class="det-count">${n} finding${n === 1 ? "" : "s"}</span>`;
      return `<details class="screen-findings"${i === 0 ? " open" : ""}>
        <summary class="screen-h">${summary}</summary>
        <div class="det-body">${cards(sc.findings)}</div>
      </details>`;
    }).join("\n");
    return `
      <h2>Flow synthesis — the whole journey</h2>
      ${synthBlock(data.flowSynthesis)}
      <h2>The screens</h2>
      <div class="screenrow">${thumbs}</div>
      <h2>Per-screen findings</h2>
      ${perScreen}
      ${scoreBlock(data.craftScore)}`;
  }

  // ── SINGLE ──
  const tag = imgTagFor(data.image, data.title);
  const wide = data.layout === "wide" || (data.layout !== "mobile" && data.image && aspectOf(data.image) > 1.2);
  const findingCards = cards(data.findings);
  let evidence;
  if (!tag) {
    evidence = `<div class="findings nofig">${findingCards}</div>`;
  } else if (wide) {
    // full-width evidence on top, findings below
    evidence = `<div class="evidence-wide">${shot(tag, data.regions, true)}${legendFor(data.regions)}</div>
      <div class="findings">${findingCards}</div>`;
  } else {
    // sticky side column (tall phone shot)
    evidence = `<div class="split"><div class="evidence">${shot(tag, data.regions, false)}${legendFor(data.regions)}</div>
      <div class="findings">${findingCards}</div></div>`;
  }
  return `<h2>Evidence &amp; findings</h2>${evidence}${scoreBlock(data.craftScore)}`;
}

function build(data) {
  const gradeClass = (data.grade || "").toLowerCase();
  const verdict = data.verdict || data.flowSynthesis;
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tastemaker · ${esc(data.title)}</title>
<style>
  /* UX-040: --faint darkened #9a9186→#6e665b (≈4.6:1 on paper) for genuine secondary text;
     --label a touch lighter only where it sits at larger sizes. amber darkened for white-on-amber labels. */
  :root{--ink:#16140f;--muted:#5a5349;--faint:#6e665b;--paper:#faf7f1;--card:#fff;--line:#e6ded2;
    --green:#1a6a43;--amber:#946a14;--magenta:#8e3b8e;--violet:#514696;
    --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
    --mono:"SF Mono",ui-monospace,"JetBrains Mono",Menlo,monospace}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.6 var(--serif);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:64px 28px 120px}
  .kicker{font:600 11px/1 var(--mono);letter-spacing:.22em;text-transform:uppercase;color:var(--faint)}
  h1{font:600 40px/1.05 var(--serif);letter-spacing:-.02em;margin:14px 0 6px}
  .sub{color:var(--muted);font-size:18px;margin:0 0 4px;max-width:680px}
  /* verdict summary band — leads, before the evidence (UX-429) */
  .summary{display:flex;flex-wrap:wrap;align-items:flex-start;gap:14px 18px;margin:26px 0 8px;padding:18px 22px;background:#fff;border:1px solid var(--line);border-radius:11px;box-shadow:0 1px 2px rgba(40,30,10,.04),0 10px 30px rgba(40,30,10,.05);max-width:860px}
  .summary .grade{flex:0 0 auto;margin-top:1px;white-space:nowrap}
  .summary-body{flex:1 1 360px;min-width:280px}
  .band-ceiling{font:600 15px/1.4 var(--serif);color:var(--ink);margin:0 0 6px}
  .band-climb{font-size:15px;color:var(--muted);margin:0}
  .band-climb b{color:var(--ink);font-weight:600}
  /* brief — labeled key-value rows, not a run-on (UX-487) */
  .brief{margin:14px 0 8px;max-width:860px;font:500 13px/1.5 var(--mono)}
  .brief-row{display:flex;gap:14px;padding:5px 0;border-bottom:1px dotted var(--line)}
  .brief-row:last-child{border-bottom:none}
  .brief-k{flex:0 0 96px;color:var(--faint);text-transform:uppercase;letter-spacing:.08em;font-size:11px;padding-top:1px}
  .brief-v{flex:1 1 auto;color:var(--muted)}
  .brief-row.ceiling-row .brief-k{color:var(--violet)} .brief-row.ceiling-row .brief-v{color:var(--violet);font-weight:600}
  h2{font:600 13px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:60px 0 20px;padding-bottom:10px;border-bottom:1px solid var(--line)}
  /* single-mobile: sticky side column */
  .split{display:grid;grid-template-columns:300px 1fr;gap:40px;align-items:start}
  @media (max-width:760px){.split{grid-template-columns:1fr}}
  .evidence{position:sticky;top:32px}
  /* single-wide: full-width evidence on top */
  .evidence-wide{margin-bottom:32px}
  .evidence-wide .shot{max-width:100%}
  .findings{max-width:760px}
  .shot{position:relative;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 2px 4px rgba(40,30,10,.05),0 18px 50px rgba(40,30,10,.10);background:#eee}
  .shot img{display:block;width:100%}
  .shot.wide{border-radius:12px}
  .region{position:absolute;border:2px solid;border-radius:10px}
  .region span{position:absolute;top:-9px;left:8px;padding:2px 6px;border-radius:5px;font:600 10px/1 var(--mono);letter-spacing:.04em;color:#fff;white-space:nowrap}
  .region.convicted,.region.characterful{border-color:var(--magenta)} .region.convicted span,.region.characterful span{background:var(--magenta)}
  .region.craft,.region.coherent{border-color:var(--amber)} .region.craft span,.region.coherent span{background:var(--amber)}
  .region.ceiling{border-color:var(--violet)} .region.ceiling span{background:var(--violet)}
  .region.strength{border-color:var(--green)} .region.strength span{background:var(--green)}
  .legend{font:500 12px/2 var(--mono);color:var(--muted);margin-top:14px} .legend b{font-weight:600;color:var(--ink)}
  .legend .lg-rung{color:var(--faint);font-size:11px}
  /* numbered legend chip — the non-color cross-reference (UX-049) */
  .lg-num{display:inline-block;min-width:17px;height:17px;line-height:17px;text-align:center;border-radius:4px;color:#fff;font:700 11px/17px var(--mono);margin-right:5px;vertical-align:middle}
  .lg-num.convicted,.lg-num.characterful{background:var(--magenta)} .lg-num.craft,.lg-num.coherent{background:var(--amber)} .lg-num.ceiling{background:var(--violet)} .lg-num.strength{background:var(--green)}
  /* region marker chip echoed on the finding card eyebrow */
  .rmark{display:inline-block;min-width:16px;height:16px;line-height:16px;text-align:center;border-radius:4px;color:#fff;font:700 10px/16px var(--mono);vertical-align:middle}
  .rmark.convicted,.rmark.characterful{background:var(--magenta)} .rmark.craft,.rmark.coherent{background:var(--amber)} .rmark.ceiling{background:var(--violet)} .rmark.strength{background:var(--green)}
  /* flow: screen row */
  .screenrow{display:flex;gap:20px;overflow-x:auto;padding-bottom:8px}
  .screen{flex:0 0 220px;margin:0}
  .screen.wide{flex-basis:420px}
  .screen figcaption{font:500 12px/1.4 var(--mono);color:var(--muted);margin-top:10px} .screen figcaption span{color:var(--faint)}
  /* collapsible per-screen finding groups (UX-104) */
  details.screen-findings{margin:0 0 14px;border:1px solid var(--line);border-radius:9px;background:#fffdf9;overflow:hidden}
  details.screen-findings>summary.screen-h{cursor:pointer;list-style:none;font:600 16px/1.2 var(--serif);color:var(--ink);margin:0;padding:14px 18px;display:flex;align-items:center;gap:10px}
  details.screen-findings>summary.screen-h::-webkit-details-marker{display:none}
  details.screen-findings>summary.screen-h::before{content:"▸";color:var(--faint);font:400 13px/1 var(--mono);transition:transform .15s}
  details.screen-findings[open]>summary.screen-h::before{transform:rotate(90deg)}
  details.screen-findings .det-count{font:500 11px/1 var(--mono);color:var(--faint);letter-spacing:.06em;text-transform:uppercase}
  details.screen-findings .det-body{padding:4px 18px 18px}
  .nofig{max-width:760px}
  .score{display:grid;grid-template-columns:1fr auto;gap:2px 16px;font:500 14px/1.5 var(--mono);max-width:620px}
  .score .dim{color:var(--muted)} .score .ok{color:var(--green)} .score .gap{color:var(--amber)} .score .na{color:var(--faint)}
  .card{background:var(--card);border:1px solid var(--line);border-left-width:4px;border-radius:9px;padding:22px 24px;margin:0 0 18px;box-shadow:0 1px 2px rgba(40,30,10,.04),0 8px 24px rgba(40,30,10,.04)}
  .card.craft,.card.coherent{border-left-color:var(--amber)}
  .card.convicted,.card.characterful{border-left-color:var(--magenta)} .card.ceiling{border-left-color:var(--violet)} .card.strength{border-left-color:var(--green)}
  .eyebrow{font:600 11px/1.3 var(--mono);letter-spacing:.12em;text-transform:uppercase;margin-bottom:9px}
  .craft .eyebrow,.coherent .eyebrow{color:var(--amber)} .convicted .eyebrow,.characterful .eyebrow{color:var(--magenta)} .ceiling .eyebrow{color:var(--violet)} .strength .eyebrow{color:var(--green)}
  .card h3{font:600 21px/1.25 var(--serif);letter-spacing:-.01em;margin:0 0 6px}
  .verdict{font:italic 500 16px/1.4 var(--serif);color:var(--muted);margin:0 0 16px}
  .label{font:600 10.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin:14px 0 5px}
  .card p{margin:0 0 4px}
  .ref{font:500 12px/1 var(--mono);color:var(--violet);margin-top:16px}
  .grade{display:inline-block;font:600 13px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:9px 14px;border-radius:7px}
  .grade.tasteful{background:#eaf3ec;color:var(--green)} .grade.competent{background:#fbf3e0;color:var(--amber)} .grade.unrealized{background:#f6e9e9;color:#9a2b2b}
  .climb{background:#fff;border:1px solid var(--line);border-radius:9px;padding:20px 24px;margin-top:16px;max-width:820px}
  .caveat{font:400 13px/1.55 var(--mono);color:var(--muted);background:#fbf3e0;border:1px solid #ecdfc0;border-left:4px solid var(--amber);border-radius:7px;padding:14px 16px;margin-top:40px;max-width:820px} .caveat b{color:var(--ink)}
</style></head><body><div class="wrap">
  <div class="kicker">Tastemaker · Whole-ladder evaluation${Array.isArray(data.screens) ? " · Flow" : ""}</div>
  <h1>${esc(data.title)}</h1>
  ${data.subtitle ? `<p class="sub">${esc(data.subtitle)}</p>` : ""}

  ${summaryBand(data)}
  ${briefBlock(data)}

  ${buildBody(data)}

  <h2>The verdict</h2>
  <p><span class="grade ${gradeClass}">${esc(data.grade)}${data.gradeNote ? " — " + esc(data.gradeNote) : ""}</span></p>
  ${synthBlock(verdict)}

  <div class="caveat"><b>Scope.</b> This assesses craft and taste only — not whether the design works (usability / accessibility — run /ux-critique) or whether it's worth building (strategy, upstream). A tight, tasteful design can still be the wrong thing, or unusable. "Tasteful" is not "good to ship."</div>
</div></body></html>`;
}

function main() {
  const args = process.argv.slice(2);
  const jsonPath = args.find(a => !a.startsWith("--"));
  const outIdx = args.indexOf("--out");
  const out = outIdx > -1 ? args[outIdx + 1] : (jsonPath ? jsonPath.replace(/\.json$/, "") + ".html" : "report.html");
  if (!jsonPath) { console.error("usage: node build-report.js <report.json> [--out file.html]"); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  fs.writeFileSync(out, build(data));
  const mode = Array.isArray(data.screens) ? `flow (${data.screens.length} screens)` :
    (data.image && aspectOf(data.image) > 1.2 ? "single-wide" : "single-mobile");
  console.log(`wrote ${out} — ${mode}`);
}
if (require.main === module) main();
module.exports = { build, aspectOf };

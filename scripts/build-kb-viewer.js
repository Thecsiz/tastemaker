#!/usr/bin/env node
/*
 * build-kb-viewer.js — generates the self-contained root index.html for GitHub Pages.
 *
 * Reads the two validators (the source of truth) + the entry markdown, bakes them
 * into one DATA object, and emits a single static HTML file (no build step, no deps).
 *
 * The viewer is ONE unified ladder — the skill's actual spine:
 *
 *   Correct → Coherent → Characterful → Convicted   (+ Contextual Fit as the ceiling-setter)
 *
 *   - Correct        : the assumed usability floor (handed to ux-critique; no entries here)
 *   - Coherent       : holds the 20 measurable CRAFT rules (CR-NNN) — the floor that makes a
 *                      design "finished" — PLUS the TS principles that live at coherence
 *   - Characterful   : TS principles about earned identity
 *   - Convicted      : TS principles about committing to an opinion
 *   - Contextual Fit : TS-011, the governor that caps how high any surface should climb
 *
 * Craft (CR) and Taste (TS) are NOT peers — craft is the floor you clear to reach the taste
 * questions above it. The board teaches that one-ladder model rather than two separate KBs.
 *
 * Cards are clickable → modal with the full body, deep-linkable via #CR-403 / #TS-001.
 * Style: neutral-minimalist (sans, pale-gray canvas, one radius system) + the semantic
 * rung-color system (amber=coherent/craft · magenta=characterful/convicted · violet=ceiling · green=law).
 *
 * USAGE:
 *   node scripts/build-kb-viewer.js          # write index.html
 *   node scripts/build-kb-viewer.js --check  # fail when index.html is stale
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const KB = path.join(ROOT, "skills", "tastemaker", "kb");
const CRAFT = path.join(KB, "craft");

// ── tiny frontmatter + body parser ──────────────────────────────────────────
function parseEntry(absPath) {
  const raw = fs.readFileSync(absPath, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const fm = {};
  let body = raw;
  if (m) {
    body = m[2].trim();
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { fm, body };
}
const stripH1 = (body) => body.replace(/^#\s+.*\r?\n+/, "").trim();
const parseTags = (raw) => (raw || "").replace(/[[\]]/g, "").split(",").map(s => s.trim()).filter(Boolean);

// ── load CRAFT (CR) → all into the Coherent rung, grouped by dimension ─────────
const crIds = JSON.parse(fs.readFileSync(path.join(CRAFT, "cr-ids.json"), "utf8"));
const DIM_LABEL = {
  "spacing-rhythm": "Spacing & Rhythm", "type-hierarchy": "Type Hierarchy",
  "color-contrast": "Color & Contrast", "shadow-elevation": "Shadow & Elevation",
  "alignment-grid": "Alignment & Grid", "density-balance": "Density & Balance",
};
const craftByDim = {};
for (const dim of crIds.dimensions) craftByDim[dim] = [];
for (const [id, meta] of Object.entries(crIds.ids)) {
  const { fm, body } = parseEntry(path.join(CRAFT, meta.path));
  craftByDim[meta.dimension].push({
    id, kind: "CR", title: meta.title, group: DIM_LABEL[meta.dimension] || meta.dimension,
    grade: meta.consensus || fm.consensus || "", measurable: fm.measurable || "",
    tags: parseTags(fm.tags), rungClass: "coherent", body: stripH1(body),
  });
}
// ── load TASTE (TS) → into rungs by frontmatter ────────────────────────────────
const tsIds = JSON.parse(fs.readFileSync(path.join(KB, "ts-ids.json"), "utf8"));
function rungBucket(rung, role) {
  if (role === "governor") return "ceiling";
  const r = (rung || "").toLowerCase();
  if (r.includes("ceiling")) return "ceiling";
  if (r.includes("convict")) return "convicted";
  if (r.includes("character")) return "characterful";
  if (r.includes("correct")) return "correct";
  return "coherent";
}
const tasteByRung = { correct: [], coherent: [], characterful: [], convicted: [], ceiling: [] };
for (const [id, meta] of Object.entries(tsIds.ids)) {
  const { fm, body } = parseEntry(path.join(KB, meta.path));
  const bucket = rungBucket(meta.rung, meta.role);
  tasteByRung[bucket].push({
    id, kind: "TS", title: meta.title, category: meta.category || fm.category || "",
    rung: meta.rung || fm.rung || "", role: meta.role || "",
    tags: parseTags(fm.tags),
    rungClass: meta.role === "governor" ? "ceiling" : (bucket === "correct" ? "coherent" : bucket),
    body: stripH1(body),
  });
}
// ── flatten into one ordered entry list, each tagged with its rung ─────────────
// Order: by ladder rung, and within Coherent the craft floor (CR) comes first.
const entries = [];
// Coherent: craft floor first (dimension order), then coherence TS
for (const dim of crIds.dimensions) {
  for (const e of craftByDim[dim]) entries.push({ ...e, rung: "coherent", rungLabel: "Coherent" });
}
for (const e of tasteByRung.coherent) entries.push({ ...e, rung: "coherent", rungLabel: "Coherent" });
for (const e of tasteByRung.characterful) entries.push({ ...e, rung: "characterful", rungLabel: "Characterful" });
for (const e of tasteByRung.convicted) entries.push({ ...e, rung: "convicted", rungLabel: "Convicted" });
for (const e of tasteByRung.ceiling) entries.push({ ...e, rung: "ceiling", rungLabel: "Contextual Fit" });

const DATA = {
  entries,
  filters: [
    { key: "all", label: "All entries" },
    { key: "kind:CR", label: "Craft only · CR" },
    { key: "kind:TS", label: "Taste only · TS" },
    { key: "rung:coherent", label: "Rung · Coherent" },
    { key: "rung:characterful", label: "Rung · Characterful" },
    { key: "rung:convicted", label: "Rung · Convicted" },
    { key: "rung:ceiling", label: "Contextual Fit (ceiling)" },
  ],
  craftCount: crIds.count,
  tasteCount: tsIds.count,
};

// ── viewer template ──────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tastemaker — Knowledge Base</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FAFAFA;--fg:#131316;--muted:#52525B;--faint:#71717A;
  --card:#FFFFFF;--line:#E8E8EA;--hover:#F4F4F5;
  --green:#1A6A43;--amber:#9A6B12;--magenta:#8E3B8E;--violet:#514696;
  --r-sm:8px;--r-md:12px;--r-lg:16px;
  --sans:Inter,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace}
@media(prefers-color-scheme:dark){:root{
  --bg:#0B0B0C;--fg:#FAFAFA;--muted:#A1A1AA;--faint:#8B8B93;
  --card:#161618;--line:#27272A;--hover:#202022;
  --green:#46C088;--amber:#E0B450;--magenta:#D98AD9;--violet:#A99CF0}}
html{color-scheme:light dark}
body{font-family:var(--sans);background:var(--bg);color:var(--fg);height:100vh;display:flex;flex-direction:column;overflow:hidden;-webkit-font-smoothing:antialiased}
.header{flex-shrink:0;display:flex;align-items:center;gap:1rem;padding:.8rem 1.25rem;border-bottom:1px solid var(--line);background:var(--bg);z-index:10}
.brand{font-size:.95rem;font-weight:700;letter-spacing:-.02em;white-space:nowrap}
.brand span{color:var(--faint);font-weight:500}
.filter-select{height:2rem;padding:0 1.8rem 0 .7rem;background:var(--hover);border:1px solid var(--line);border-radius:var(--r-sm);font-family:var(--sans);font-size:.8rem;font-weight:500;color:var(--fg);cursor:pointer;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2371717A' d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .55rem center}
.filter-select:focus{border-color:var(--fg)}
.search-wrap{flex:1;max-width:24rem}
.search{width:100%;height:2rem;padding:0 .7rem;background:var(--hover);border:1px solid var(--line);border-radius:var(--r-sm);font-family:var(--sans);font-size:.82rem;color:var(--fg);outline:none;transition:border-color .15s}
.search:focus{border-color:var(--fg)}
.stats{font-family:var(--mono);font-size:.72rem;color:var(--faint);white-space:nowrap;margin-left:auto}
.source{font-family:var(--mono);font-size:.68rem;color:var(--faint);text-decoration:none;white-space:nowrap}.source:hover{color:var(--fg)}
.board{flex:1;overflow-y:auto;padding:1.1rem 1.25rem 2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:.7rem}
.card{background:var(--card);border:1px solid var(--line);border-left-width:3px;border-radius:var(--r-md);padding:.8rem .9rem;cursor:pointer;transition:background .12s,box-shadow .12s,transform .12s;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.card:hover{background:var(--hover);box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-1px)}
.card.hidden{display:none}
.card.coherent{border-left-color:var(--amber)} .card.characterful,.card.convicted{border-left-color:var(--magenta)} .card.ceiling{border-left-color:var(--violet)}
.card-top{display:flex;align-items:baseline;justify-content:space-between;gap:.4rem;margin-bottom:.35rem}
.card-id{font-family:var(--mono);font-size:.66rem;color:var(--faint)}
.kind-dot{font-family:var(--mono);font-size:.58rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.kind-dot.cr{color:var(--amber)} .kind-dot.ts{color:var(--magenta)}
.grade{font-family:var(--mono);font-size:.6rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--faint)}
.grade.law{color:var(--green)} .grade.strong{color:var(--amber)} .grade.heuristic{color:var(--faint)}
.card-title{font-size:.88rem;font-weight:600;line-height:1.3;letter-spacing:-.01em;margin-bottom:.5rem}
.card-meta{display:flex;align-items:center;gap:.3rem;flex-wrap:wrap}
.rung-badge{display:inline-flex;align-items:center;height:1.2rem;padding:0 .5rem;border-radius:999px;font-size:.56rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
.rung-badge.coherent{background:color-mix(in srgb,var(--amber) 14%,transparent);color:var(--amber)}
.rung-badge.characterful,.rung-badge.convicted{background:color-mix(in srgb,var(--magenta) 14%,transparent);color:var(--magenta)}
.rung-badge.ceiling{background:color-mix(in srgb,var(--violet) 16%,transparent);color:var(--violet)}
.badge{display:inline-flex;align-items:center;height:1.2rem;padding:0 .45rem;border-radius:999px;font-size:.58rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;background:var(--hover);color:var(--muted);border:1px solid var(--line);white-space:nowrap}
.modal-bd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;align-items:center;justify-content:center;padding:2rem 1rem}
.modal-bd.open{display:flex}
.modal{background:var(--card);border:1px solid var(--line);border-radius:var(--r-lg);width:100%;max-width:720px;max-height:calc(100vh - 4rem);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 16px 50px rgba(0,0,0,.25);border-top:4px solid var(--line)}
.modal.coherent{border-top-color:var(--amber)} .modal.characterful,.modal.convicted{border-top-color:var(--magenta)} .modal.ceiling{border-top-color:var(--violet)}
.modal-head{flex-shrink:0;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.4rem 1.6rem 1.1rem;border-bottom:1px solid var(--line)}
.modal-id{font-family:var(--mono);font-size:.72rem;color:var(--faint);margin-bottom:.3rem}
.modal-title{font-size:1.2rem;font-weight:700;letter-spacing:-.02em;line-height:1.25}
.modal-meta{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.7rem;align-items:center}
.modal-close{flex-shrink:0;appearance:none;border:1px solid var(--line);background:transparent;width:1.9rem;height:1.9rem;border-radius:var(--r-sm);color:var(--muted);cursor:pointer;font-size:1rem;line-height:1}
.modal-close:hover{background:var(--hover);color:var(--fg)}
.modal-body{flex:1;min-height:0;overflow-y:auto;padding:1.3rem 1.6rem 1.7rem;font-size:.9rem;line-height:1.65;color:var(--fg)}
.modal-body h2{font-size:.74rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:1.5rem 0 .6rem}
.modal-body h2:first-child{margin-top:0}
.modal-body p{margin:0 0 .7rem;color:var(--muted)}
.modal-body strong{color:var(--fg);font-weight:600}
.modal-body ul{margin:0 0 .8rem 1.1rem;color:var(--muted)} .modal-body li{margin-bottom:.35rem}
.modal-body code{font-family:var(--mono);font-size:.85em;background:var(--hover);padding:.1em .35em;border-radius:4px}
.modal-body em{color:var(--muted)}
.tag{font-family:var(--mono);font-size:.62rem;color:var(--faint);background:var(--hover);border:1px solid var(--line);padding:.1rem .4rem;border-radius:5px}
.no-results{display:none;padding:3rem;text-align:center;color:var(--faint);font-size:.9rem;width:100%}
.no-results.show{display:block}
</style></head><body>
<div class="header">
  <div class="brand">Tastemaker <span>· Knowledge Base</span></div>
  <select class="filter-select" id="filter"></select>
  <div class="search-wrap"><input class="search" id="search" placeholder="Search ID, title, or tag…" autocomplete="off"></div>
  <div class="stats" id="stats"></div>
  <a class="source" href="https://github.com/thecsiz/tastemaker">Source · CC BY 4.0</a>
</div>
<div class="board" id="board"><div class="grid" id="grid"></div><div class="no-results" id="noResults">No entries match.</div></div>
<div class="modal-bd" id="modalBd"><div class="modal" id="modal">
  <div class="modal-head">
    <div style="flex:1;min-width:0">
      <div class="modal-id" id="mId"></div>
      <div class="modal-title" id="mTitle"></div>
      <div class="modal-meta" id="mMeta"></div>
    </div>
    <button class="modal-close" id="mClose">×</button>
  </div>
  <div class="modal-body" id="mBody"></div>
</div></div>
<script>
const DATA = ${JSON.stringify(DATA)};
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function md(src){
  const lines=String(src||"").split(/\\r?\\n/);let html="",inList=false;
  const inline=t=>esc(t).replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\\*(.+?)\\*/g,"<em>$1</em>").replace(/\`(.+?)\`/g,"<code>$1</code>");
  for(let line of lines){
    if(/^##\\s+/.test(line)){if(inList){html+="</ul>";inList=false}html+="<h2>"+inline(line.replace(/^##\\s+/,""))+"</h2>";continue}
    if(/^[-*]\\s+/.test(line)){if(!inList){html+="<ul>";inList=true}html+="<li>"+inline(line.replace(/^[-*]\\s+/,""))+"</li>";continue}
    if(inList){html+="</ul>";inList=false}
    if(line.trim()==="")continue;
    html+="<p>"+inline(line)+"</p>";
  }
  if(inList)html+="</ul>";return html;
}

const allEntries=DATA.entries;
function cardHtml(e){
  const right = e.kind==="CR"
    ? '<span class="grade '+esc(e.grade)+'">'+esc(e.grade)+'</span>'
    : '<span class="kind-dot ts">'+esc(e.category||"taste")+'</span>';
  return '<div class="card '+(e.rungClass||"coherent")+'" data-id="'+esc(e.id)+'" data-kind="'+esc(e.kind)+'" data-rung="'+esc(e.rung)+'" data-t="'+esc((e.id+" "+e.title+" "+(e.tags||[]).join(" ")+" "+(e.category||e.group||"")).toLowerCase())+'">'+
    '<div class="card-top"><span class="card-id">'+esc(e.id)+'</span>'+right+'</div>'+
    '<div class="card-title">'+esc(e.title)+'</div>'+
    '<div class="card-meta">'+
      '<span class="rung-badge '+(e.rungClass||"coherent")+'">'+esc(e.rungLabel)+'</span>'+
      (e.group?'<span class="badge">'+esc(e.group)+'</span>':'')+
      ((e.tags&&e.tags.length)?e.tags.slice(0,2).map(t=>'<span class="badge">'+esc(t)+'</span>').join(""):'')+
    '</div>'+
    '</div>';
}

function buildGrid(){
  const grid=document.getElementById("grid");
  grid.innerHTML=allEntries.map(cardHtml).join("");
  for(const card of grid.querySelectorAll(".card")){
    card.addEventListener("click",()=>{const e=findById(card.dataset.id);if(e)openModal(e)});
  }
}

function buildFilter(){
  const sel=document.getElementById("filter");
  sel.innerHTML=DATA.filters.map(f=>'<option value="'+esc(f.key)+'">'+esc(f.label)+'</option>').join("");
  sel.addEventListener("change",applyFilter);
}

function updateStats(n){document.getElementById("stats").textContent=(n===undefined?allEntries.length:n)+" of "+allEntries.length+" · "+DATA.tasteCount+" taste · "+DATA.craftCount+" craft"}

function applyFilter(){
  const f=document.getElementById("filter").value;
  const q=document.getElementById("search").value.trim().toLowerCase();
  let total=0;
  for(const card of document.querySelectorAll(".card")){
    let m=true;
    if(f.startsWith("kind:")) m = card.dataset.kind===f.slice(5);
    else if(f.startsWith("rung:")) m = card.dataset.rung===f.slice(5);
    if(m && q) m = card.dataset.t.includes(q);
    card.classList.toggle("hidden",!m);if(m)total++;
  }
  document.getElementById("noResults").classList.toggle("show",total===0);
  updateStats(total);
}

function openModal(e){
  document.getElementById("mId").textContent=e.id;
  document.getElementById("mTitle").textContent=e.title;
  const meta=[];
  meta.push('<span class="rung-badge '+(e.rungClass||"coherent")+'">'+esc(e.rungLabel)+'</span>');
  meta.push('<span class="badge">'+(e.kind==="CR"?"Craft · CR":"Taste · TS")+'</span>');
  if(e.group)meta.push('<span class="badge">'+esc(e.group)+'</span>');
  if(e.category)meta.push('<span class="badge">'+esc(e.category)+'</span>');
  if(e.grade)meta.push('<span class="grade '+esc(e.grade)+'" style="margin-left:auto">'+esc(e.grade)+'</span>');
  if(e.measurable)meta.push('<span class="tag">measurable: '+esc(e.measurable)+'</span>');
  document.getElementById("mMeta").innerHTML=meta.join("");
  document.getElementById("mBody").innerHTML=md(e.body);
  document.getElementById("modal").className="modal "+(e.rungClass||"coherent");
  document.getElementById("modalBd").classList.add("open");document.body.style.overflow="hidden";
  if(location.hash!=="#"+e.id)history.replaceState(null,"","#"+e.id);
}
function closeModal(){document.getElementById("modalBd").classList.remove("open");document.body.style.overflow="";if(location.hash)history.replaceState(null,"",location.pathname)}

function findById(id){return allEntries.find(e=>e.id.toLowerCase()===id.toLowerCase())}
function applyHash(){const id=location.hash.slice(1);if(!id){closeModal();return}const e=findById(decodeURIComponent(id));if(e)openModal(e)}

buildFilter();
buildGrid();
updateStats();
document.getElementById("search").addEventListener("input",applyFilter);
document.getElementById("mClose").addEventListener("click",closeModal);
document.getElementById("modalBd").addEventListener("click",e=>{if(e.target===e.currentTarget)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
window.addEventListener("hashchange",applyHash);
applyHash();
</script></body></html>`;

const OUT = path.join(ROOT, "index.html");
if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== HTML) {
    console.error(`${path.relative(ROOT, OUT)} is stale; run node scripts/build-kb-viewer.js`);
    process.exit(1);
  }
  console.log(`${path.relative(ROOT, OUT)} is current — ${DATA.tasteCount} TS + ${DATA.craftCount} CR`);
} else {
  fs.writeFileSync(OUT, HTML);
  console.log(`wrote ${path.relative(ROOT, OUT)} — one ladder: ${DATA.tasteCount} TS across rungs + ${DATA.craftCount} CR in the Coherent floor`);
}

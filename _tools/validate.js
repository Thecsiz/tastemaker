#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SKILL = path.join(ROOT, "skills", "tastemaker");
const KB = path.join(SKILL, "kb");
const CRAFT = path.join(KB, "craft");
const TRADEOFFS = path.join(KB, "tradeoffs");
const ARCHIVE = path.join(ROOT, "skills", "tastemaker.skill");
const errors = [];
const checks = [];

function ok(message) { checks.push(message); }
function fail(message) { errors.push(message); }
function rel(file) { return path.relative(ROOT, file); }
function read(file) { return fs.readFileSync(file, "utf8"); }
function exists(file, message) {
  if (!fs.existsSync(file)) fail(message || `Missing ${rel(file)}`);
  return fs.existsSync(file);
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", ...options });
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  }
  return result;
}
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}
function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return data;
}
function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function hasReservedPrivateMarker(raw) {
  // Hashes let the release validator catch reserved organization/project names
  // without putting those names back into the public source tree.
  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  const targets = [
    [6, "80daf15e57af2a318ecfba9b83746a6a165a3694fdaad25e56b1f0878ac8e2f6"],
    [11, "44a658032cbe822e7c7d016cc8151b7a8da209a04ebe07ca7eec92d6a26352da"],
    [14, "4ca0efc7d75323d85681ccd572ee96e44c19b0e8b00c65c87517e06b3addf269"],
    [9, "3265e60298351c2dea7ca66cbe9f916a187c9015fabf416ebc7990f12ae50d58"],
  ];
  for (const [length, expected] of targets) {
    for (let i = 0; i <= normalized.length - length; i++) {
      if (digest(normalized.slice(i, i + length)) === expected) return true;
    }
  }
  const shortTarget = "dac8bf0d219d3ba64c275b57c67bc01555dc9a940e8135c0d5e1b287a1cec8c0";
  return raw.toLowerCase().split(/\s+/).some(token => digest(token.replace(/[^a-z0-9]/g, "")) === shortTarget);
}

// Core skill structure and metadata.
for (const required of [
  "SKILL.md", "agents/openai.yaml", "LICENSE", "LICENSE-MIT", "LICENSE-CC-BY-4.0",
  "references/figma-output-mode.md", "references/artifact-output-mode.md",
  "references/scope-mode.md", "references/system-mode.md",
  "references/conflicts-and-defended-breaks.md", "references/house-profiles.md",
  "scripts/taste-cards.js", "scripts/build-report.js", "evals/evals.json",
  "evals/report-fixture.json", "kb/ts-ids.json", "kb/craft/cr-ids.json",
  "kb/tradeoffs/tr-ids.json", "kb/tradeoffs/_index.md",
]) exists(path.join(SKILL, required));

const skillRaw = read(path.join(SKILL, "SKILL.md"));
const skillFm = frontmatter(skillRaw);
if (!skillFm) fail("SKILL.md is missing YAML frontmatter");
else {
  if (skillFm.name !== "tastemaker") fail(`SKILL.md name must be tastemaker, found ${skillFm.name}`);
  if (!skillFm.description) fail("SKILL.md is missing description");
  else if (skillFm.description.length > 1024) fail(`SKILL.md description is ${skillFm.description.length} characters; max is 1024`);
}
const skillLines = skillRaw.split(/\r?\n/).length;
if (skillLines >= 500) fail(`SKILL.md is ${skillLines} lines; keep the core router below 500`);
else ok(`SKILL.md · ${skillLines} lines`);

const openaiYaml = read(path.join(SKILL, "agents", "openai.yaml"));
if (!/display_name:\s*["']Tastemaker["']/.test(openaiYaml)) fail("agents/openai.yaml is missing display_name");
if (!/default_prompt:.*\$tastemaker/.test(openaiYaml)) fail("agents/openai.yaml default_prompt must invoke $tastemaker");

// All relative Markdown links in the skill entrypoint must resolve inside the package.
for (const match of skillRaw.matchAll(/\]\(([^)]+)\)/g)) {
  const target = match[1].split("#")[0];
  if (!target || /^(https?:|mailto:)/.test(target)) continue;
  const abs = path.resolve(SKILL, target);
  if (!abs.startsWith(SKILL + path.sep)) fail(`SKILL.md link escapes the package: ${match[1]}`);
  else if (!fs.existsSync(abs)) fail(`SKILL.md link is broken: ${match[1]}`);
}
ok("SKILL.md local links resolve");

// Registry-to-file integrity and cite-or-skip coverage.
function validateRegistry(registryFile, entryRoot, prefix) {
  const registry = JSON.parse(read(registryFile));
  const ids = Object.keys(registry.ids || {});
  if (registry.count !== ids.length) fail(`${rel(registryFile)} count=${registry.count}, ids=${ids.length}`);
  const seenPaths = new Set();
  for (const [id, meta] of Object.entries(registry.ids || {})) {
    if (!new RegExp(`^${prefix}-\\d{3}$`).test(id)) fail(`Invalid ${prefix} ID: ${id}`);
    if (!meta.path) { fail(`${id} has no path`); continue; }
    if (seenPaths.has(meta.path)) fail(`Duplicate path in ${rel(registryFile)}: ${meta.path}`);
    seenPaths.add(meta.path);
    const abs = path.join(entryRoot, meta.path);
    if (!exists(abs, `${id} points to missing ${rel(abs)}`)) continue;
    const fm = frontmatter(read(abs));
    if (!fm || fm.id !== id) fail(`${rel(abs)} frontmatter id is ${fm && fm.id}; expected ${id}`);
    if (!path.basename(abs).startsWith(`${id}-`)) fail(`${rel(abs)} filename does not begin with ${id}-`);
  }
  const onDisk = walk(entryRoot).filter(file => new RegExp(`/${prefix}-\\d{3}[^/]*\\.md$`).test(file));
  if (onDisk.length !== ids.length) fail(`${prefix} registry has ${ids.length} entries but disk has ${onDisk.length}`);
  ok(`${prefix} registry · ${ids.length} entries`);
  return new Set(ids);
}

const tsIds = validateRegistry(path.join(KB, "ts-ids.json"), KB, "TS");
const crIds = validateRegistry(path.join(CRAFT, "cr-ids.json"), CRAFT, "CR");
const trIds = validateRegistry(path.join(TRADEOFFS, "tr-ids.json"), TRADEOFFS, "TR");
const tsRegistry = JSON.parse(read(path.join(KB, "ts-ids.json")));
const crRegistry = JSON.parse(read(path.join(CRAFT, "cr-ids.json")));
const trRegistry = JSON.parse(read(path.join(TRADEOFFS, "tr-ids.json")));

// Ranked trade-offs: status, consensus, and the principles each ranking decides between.
for (const [id, meta] of Object.entries(trRegistry.ids || {})) {
  if (!(trRegistry.statuses || []).includes(meta.status)) fail(`${id} has unknown status ${meta.status}`);
  if (!(trRegistry.consensus_grades || []).includes(meta.consensus)) fail(`${id} has unknown consensus ${meta.consensus}`);
  if (!meta.prefers || !meta.over) fail(`${id} must name what it prefers and what it ranks over`);
  for (const ts of meta.resolves || []) if (!tsIds.has(ts)) fail(`${id} resolves unknown ${ts}`);
  const fm = frontmatter(read(path.join(TRADEOFFS, meta.path)));
  if (fm && fm.status !== meta.status) fail(`${id} frontmatter status ${fm.status} differs from registry ${meta.status}`);
}
ok(`TR rankings · statuses, grades, and resolved principles check out`);

// House-profile IDs (H-TR-NNN) are project-local and excluded from KB citation checks.
const textFiles = walk(SKILL).filter(file => /\.(md|json|js|yaml)$/.test(file));
for (const file of textFiles) {
  const raw = read(file);
  for (const id of raw.match(/TS-\d{3}/g) || []) if (!tsIds.has(id)) fail(`${rel(file)} cites unknown ${id}`);
  for (const id of raw.match(/CR-\d{3}/g) || []) if (!crIds.has(id)) fail(`${rel(file)} cites unknown ${id}`);
  for (const id of raw.match(/(?<!H-)TR-\d{3}/g) || []) if (!trIds.has(id)) fail(`${rel(file)} cites unknown ${id}`);
}
ok("all numeric CR/TS/TR citations resolve");

// Stated counts and ID ranges must match the registries. Prose drifts; the registries don't.
const prefixIds = { CR: crIds, TS: tsIds, TR: trIds };
const tsCategories = new Set(Object.values(tsRegistry.ids).map(meta => meta.category)).size;
const countRules = [
  { re: /(\d+)\s+(?:measurable\s+)?(?:craft|CR)\s+rules/gi, expected: crIds.size, label: "craft rules" },
  { re: /`?CR-NNN`?,\s*(\d+)\s+entries/g, expected: crIds.size, label: "CR entries" },
  { re: /(\d+)\s+`(?:CR|TS|TR)-NNN`\s+(?:rules|principles|rankings|entries)/g, expected: null, label: "entries" },
  { re: /(\d+)\s+(?:taste|TS)\s+principles/gi, expected: tsIds.size, label: "taste principles" },
  { re: /`?TS-NNN`?,\s*(\d+)\s+entries/g, expected: tsIds.size, label: "TS entries" },
  { re: /(\d+)\s+(?:ranked\s+)?trade-offs/gi, expected: trIds.size, label: "trade-offs" },
  { re: /`?TR-NNN`?,\s*(\d+)\s+entries/g, expected: trIds.size, label: "TR entries" },
  { re: /(\d+)-entry\b/g, expected: crIds.size + tsIds.size + trIds.size, label: "total KB entries" },
  { re: /(\d+)\s+(?:taste\s+)?categories/gi, expected: tsCategories, label: "taste categories" },
  { re: /(\d+)\s+(?:craft\s+)?dimensions/gi, expected: crRegistry.dimensions.length, label: "craft dimensions" },
];
const proseFiles = [
  path.join(ROOT, "README.md"), path.join(ROOT, "AGENTS.md"),
  path.join(ROOT, "scripts", "build-kb-viewer.js"),
  ...walk(SKILL).filter(file => /\.md$/.test(file) && !/\/(?:CR|TS|TR)-\d{3}[^/]*\.md$/.test(file)),
];
let countMismatches = 0;
for (const file of proseFiles) {
  const raw = read(file);
  for (const rule of countRules) {
    for (const match of raw.matchAll(rule.re)) {
      // A null expectation reads the prefix from the match itself ("20 `CR-NNN` rules").
      const prefix = rule.expected === null ? match[0].match(/(CR|TS|TR)-NNN/)[1] : null;
      const expected = prefix ? prefixIds[prefix].size : rule.expected;
      if (Number(match[1]) !== expected) {
        countMismatches++;
        fail(`${rel(file)} says "${match[0]}"; registries have ${expected} ${prefix ? prefix + " " : ""}${rule.label}`);
      }
    }
  }
  // A range like CR-401…403 must list exactly the registry IDs in that hundred block.
  for (const match of raw.matchAll(/\b(CR|TS|TR)-(\d{3})(?:…|\.\.\.)(\d{3})\b/g)) {
    const [, prefix, startRaw, endRaw] = match;
    const start = Number(startRaw), end = Number(endRaw), block = Math.floor(start / 100);
    const inBlock = [...prefixIds[prefix]].map(id => Number(id.slice(3))).filter(n => Math.floor(n / 100) === block).sort((a, b) => a - b);
    const expected = inBlock.length ? `${prefix}-${String(inBlock[0]).padStart(3, "0")}…${String(inBlock.at(-1)).padStart(3, "0")}` : "no entries";
    if (!inBlock.length || inBlock[0] !== start || inBlock.at(-1) !== end || inBlock.length !== end - start + 1) {
      countMismatches++;
      fail(`${rel(file)} lists range ${match[0]}; registry has ${expected}`);
    }
  }
}
if (!countMismatches) ok(`stated counts and ID ranges match registries · ${crIds.size} CR · ${tsIds.size} TS · ${trIds.size} TR`);

// Eval surface.
const evals = JSON.parse(read(path.join(SKILL, "evals", "evals.json")));
if (evals.skill_name !== "tastemaker") fail("evals/evals.json has the wrong skill_name");
if (!Array.isArray(evals.evals) || evals.evals.length < 9) fail("evals/evals.json must include at least nine cases");
else {
  const names = new Set(evals.evals.map(item => item.name));
  for (const expected of [
    "craft-floor-leads", "contextual-fit-conventional-checkout", "maximalism-dogma-test",
    "conflict-consistency", "scope-cuts-against-core", "scope-forcing-rule",
    "defended-vs-sloppy-break", "system-planted-inconsistency", "house-ranking-outranks-shared",
  ]) {
    if (!names.has(expected)) fail(`Missing retrieval eval: ${expected}`);
  }
  ok(`eval suite · ${evals.evals.length} cases`);
}

// Renderer syntax/API and report fixture.
run(process.execPath, ["--check", "skills/tastemaker/scripts/taste-cards.js"]);
run(process.execPath, ["--check", "skills/tastemaker/scripts/build-report.js"]);
try {
  const { TM } = require(path.join(SKILL, "scripts", "taste-cards.js"));
  for (const helper of ["buildBriefCard", "buildCraftCard", "buildFindingCard", "buildSolidCard", "buildFlowLadderCard", "buildOverallCard", "verifyNoOverlap"]) {
    if (typeof TM[helper] !== "function") fail(`taste-cards.js is missing TM.${helper}`);
  }
  ok("Figma card API · craft + taste + flow");
} catch (error) { fail(`Could not load taste-cards.js: ${error.message}`); }

const reportOut = path.join(os.tmpdir(), `tastemaker-report-${process.pid}.html`);
const report = run(process.execPath, [
  "skills/tastemaker/scripts/build-report.js",
  "skills/tastemaker/evals/report-fixture.json",
  "--out", reportOut,
]);
if (report.status === 0 && fs.existsSync(reportOut)) {
  const html = read(reportOut);
  for (const marker of ["Tastemaker", "CR-102", "TS-008", "Tasteful", "good to ship"]) {
    if (!html.includes(marker)) fail(`HTML report fixture is missing marker: ${marker}`);
  }
  fs.rmSync(reportOut);
  ok("HTML report fixture renders");
}

// Generated viewer must be current and contain valid JavaScript.
run(process.execPath, ["scripts/build-kb-viewer.js", "--check"]);
const viewer = read(path.join(ROOT, "index.html"));
for (const [key, count] of [["craftCount", crIds.size], ["tasteCount", tsIds.size], ["tradeoffCount", trIds.size]]) {
  if (!viewer.includes(`"${key}":${count}`)) fail(`index.html ${key} does not match the registry (${count})`);
}
const scriptMatches = [...viewer.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (!scriptMatches.length) fail("index.html has no inline script");
else {
  const viewerJs = path.join(os.tmpdir(), `tastemaker-viewer-${process.pid}.js`);
  fs.writeFileSync(viewerJs, scriptMatches.at(-1)[1]);
  run(process.execPath, ["--check", viewerJs]);
  fs.rmSync(viewerJs);
  ok("GitHub Pages viewer · current and valid JS");
}

// License parity and portability/safety checks.
for (const license of ["LICENSE-MIT", "LICENSE-CC-BY-4.0"]) {
  if (read(path.join(ROOT, license)) !== read(path.join(SKILL, license))) fail(`${license} differs between repo and package`);
}
for (const file of walk(SKILL)) {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) fail(`Symlink is not portable: ${rel(file)}`);
  if (stat.size > 10 * 1024 * 1024) fail(`File exceeds 10 MB: ${rel(file)}`);
  if (!/\.(md|json|js|yaml|txt)$/i.test(file) && !/LICENSE(?:-|$)/.test(file)) continue;
  const raw = read(file);
  const homePath = new RegExp("/" + "Users" + "/|/" + "Volumes" + "/");
  if (homePath.test(raw)) fail(`Machine-specific absolute path in ${rel(file)}`);
  const secretPatterns = [
    /ghp_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{30,}/,
    /sk-[A-Za-z0-9]{32,}/, /AKIA[0-9A-Z]{16}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  ];
  for (const pattern of secretPatterns) if (pattern.test(raw)) fail(`Possible secret in ${rel(file)} (${pattern})`);
}
for (const file of walk(ROOT).filter(file => !file.endsWith(".skill"))) {
  if (!/\.(md|json|js|yaml|html|gitignore)$/i.test(file) && !/\/(?:LICENSE|AGENTS|README|THIRD_PARTY_NOTICES)(?:-|\.|$)/.test(file)) continue;
  if (hasReservedPrivateMarker(read(file))) fail(`Reserved private-project marker in ${rel(file)}`);
}
ok("portable paths, private markers, size limits, symlinks, and common secrets");

// The distributable archive must match the skill directory exactly.
run(process.execPath, ["_tools/build-skill-package.js", "--check"]);
if (fs.existsSync(ARCHIVE)) {
  const listing = run("unzip", ["-Z1", ARCHIVE]);
  if (listing.status === 0) {
    const actual = listing.stdout.split(/\r?\n/).filter(Boolean).filter(item => !item.endsWith("/")).sort();
    const expected = walk(SKILL).map(file => path.relative(path.dirname(SKILL), file)).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail("skills/tastemaker.skill file list differs from skills/tastemaker/");
    for (const required of ["tastemaker/LICENSE", "tastemaker/LICENSE-MIT", "tastemaker/LICENSE-CC-BY-4.0", "tastemaker/SKILL.md"]) {
      if (!actual.includes(required)) fail(`Archive is missing ${required}`);
    }
    ok(`installable archive · ${actual.length} files`);
  }
}

if (errors.length) {
  console.error(`\nValidation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`\nTastemaker validation passed (${checks.length} checks)`);
for (const check of checks) console.log(`  ✓ ${check}`);

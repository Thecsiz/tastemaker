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
  "scripts/taste-cards.js", "scripts/build-report.js", "evals/evals.json",
  "evals/report-fixture.json", "kb/ts-ids.json", "kb/craft/cr-ids.json",
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
const textFiles = walk(SKILL).filter(file => /\.(md|json|js|yaml)$/.test(file));
for (const file of textFiles) {
  const raw = read(file);
  for (const id of raw.match(/TS-\d{3}/g) || []) if (!tsIds.has(id)) fail(`${rel(file)} cites unknown ${id}`);
  for (const id of raw.match(/CR-\d{3}/g) || []) if (!crIds.has(id)) fail(`${rel(file)} cites unknown ${id}`);
}
ok("all numeric CR/TS citations resolve");

// Eval surface.
const evals = JSON.parse(read(path.join(SKILL, "evals", "evals.json")));
if (evals.skill_name !== "tastemaker") fail("evals/evals.json has the wrong skill_name");
if (!Array.isArray(evals.evals) || evals.evals.length < 3) fail("evals/evals.json must include at least three cases");
else {
  const names = new Set(evals.evals.map(item => item.name));
  for (const expected of ["craft-floor-leads", "contextual-fit-conventional-checkout", "maximalism-dogma-test"]) {
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
if (!viewer.includes('"craftCount":20') || !viewer.includes('"tasteCount":12')) {
  fail("index.html does not contain the expected 20 craft + 12 taste counts");
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

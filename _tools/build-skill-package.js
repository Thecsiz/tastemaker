#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const SKILL_NAME = "tastemaker";
const SKILL_DIR = path.join(SKILLS_DIR, SKILL_NAME);
const OUT = path.join(SKILLS_DIR, `${SKILL_NAME}.skill`);
const CHECK = process.argv.includes("--check");

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

// The archive must be byte-identical across machines and fresh clones, or --check
// fails on every clone. Zip records file mtimes (as local time), permissions and
// traversal order, so build from a staged copy with all three normalized.
const FIXED_TIME = new Date("2020-01-01T00:00:00Z");

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(abs, base));
    else out.push(path.relative(base, abs));
  }
  return out;
}

function build(target) {
  if (fs.existsSync(target)) fs.rmSync(target);
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), "tastemaker-stage-"));
  try {
    fs.cpSync(SKILL_DIR, path.join(stage, SKILL_NAME), { recursive: true });
    const files = listFiles(stage);
    for (const file of files) {
      const abs = path.join(stage, file);
      fs.chmodSync(abs, 0o644);
      fs.utimesSync(abs, FIXED_TIME, FIXED_TIME);
    }
    const result = spawnSync("zip", ["-X", "-D", "-q", path.resolve(target), "-@"], {
      cwd: stage,
      encoding: "utf8",
      input: files.join("\n") + "\n",
      env: { ...process.env, TZ: "UTC" },
    });
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || "zip failed");
    }
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

if (!fs.existsSync(path.join(SKILL_DIR, "SKILL.md"))) {
  throw new Error(`Missing ${path.relative(ROOT, SKILL_DIR)}/SKILL.md`);
}

if (CHECK) {
  if (!fs.existsSync(OUT)) {
    console.error(`${path.relative(ROOT, OUT)} is missing; run node _tools/build-skill-package.js`);
    process.exit(1);
  }
  const tmp = path.join(os.tmpdir(), `tastemaker-${process.pid}.skill`);
  try {
    build(tmp);
    if (sha256(tmp) !== sha256(OUT)) {
      console.error(`${path.relative(ROOT, OUT)} is stale; run node _tools/build-skill-package.js`);
      process.exit(1);
    }
  } finally {
    if (fs.existsSync(tmp)) fs.rmSync(tmp);
  }
  console.log(`${path.relative(ROOT, OUT)} is current · sha256 ${sha256(OUT)}`);
} else {
  build(OUT);
  console.log(`wrote ${path.relative(ROOT, OUT)} · sha256 ${sha256(OUT)}`);
}

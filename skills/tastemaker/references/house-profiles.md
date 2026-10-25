# House Profiles and the Cut Log: Tastemaker

The shared KB is the floor: craft rules, taste principles and rankings with broad agreement. A **house profile** is where a person or team records its own rankings. A **cut log** is the durable record of what was cut and which ranking cut it. Together they let Tastemaker sharpen a team's own point of view instead of pulling everyone toward one shared taste.

Both files live in the user's project, never in the installed skill.

## Why a house layer

A shared taste KB used by many people pushes toward agreement. Conviction is partly the willingness to disagree with consensus. The exemplar diversity rule keeps the aesthetic from converging; it does nothing for judgment. Rankings are where points of view legitimately differ, so rankings are what a house can own.

## House profile

**File:** `tastemaker-house.md` at the project root, unless the user names another path.

```
---
owner: [name or role]          # the only one who promotes proposals to rankings
updated: YYYY-MM-DD
---

# House profile: [product or team]

## Rankings

### H-TR-001: [X over Y]
- **Ranking:** X over Y, even when Y wins locally.
- **Why:** [the cost accepted]
- **Flips when:** [the condition]
- **Against shared:** [TR-NNN it overrides, with reason] | none

## Proposals

- [date] · "[X over Y]" · proposed by [name or tastemaker] · source: [cut log entry or unresolved conflict]
```

### Rules

1. **A named owner promotes; anyone proposes.** A ranking anyone can edit is not held, and holding is the point. Contributors, and Tastemaker itself, add to **Proposals**. Only the owner moves a proposal into **Rankings**. A solo user is the owner by default.
2. **Tastemaker never writes to Rankings.** It may append to Proposals when the user asks it to, after a critique surfaces an unresolved conflict or a repeated cut pattern.
3. **Overriding a shared ranking is allowed and must be explicit.** Fill in **Against shared** with the TR ID and the reason. A silent contradiction is a finding.
4. **Critiques name the layer.** "Decided by house ranking H-TR-003" or "decided by TR-002 (seed)." House rankings outrank shared ones for that project.
5. **House IDs are local.** `H-TR-NNN` IDs are valid only inside their profile. They are never added to `tr-ids.json` and never cited outside that project.

### Bootstrapping a profile

When a project has no profile, Tastemaker can propose candidate rankings from (a) the cut log, (b) designs the user calls exemplary, or (c) repeated decisions found in system mode. It presents them as proposals and asks the owner to confirm each one. It never infers a ranking and applies it silently.

## Cut log

**File:** `tastemaker-cuts.md` at the project root, unless the user names another path.

```
# Cut log: [product]

| Date | Item | Verdict | Decided by | Who decided | Revisit |
|------|------|---------|------------|-------------|---------|
| YYYY-MM-DD | [item] | Cut / Move / Merge / Defer | TR-NNN (seed) · H-TR-NNN · merits | [name] | [date or trigger] |
```

### Rules

1. **Newest first.** One row per decision.
2. **Write only accepted verdicts.** Scope mode and conflict findings propose; the user accepts; then the row is written.
3. **Read it on later runs.** When a cut log exists, scope mode and system mode check new decisions against it. A cut today that contradicts a ranking applied last month is a finding: either the ranking changed (update the profile) or the decision is inconsistent.
4. **Revisit dates are real.** When a Defer reaches its revisit date or trigger, scope mode raises it.
5. **The log is evidence.** Repeated cuts decided by the same reasoning, with no ranking on file, are the strongest source of new ranking proposals, for the house profile or, when they recur across projects, for a shared TR candidate.

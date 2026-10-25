---
id: TR-001
title: "System Consistency over In-Context Discoverability"
prefers: system consistency
over: in-context discoverability
status: seed
consensus: strong
tags: [placement, settings, system, consistency, architecture]
resolves: placement of functionality across surfaces
related:
  - id: TS-006
    type: enforces
  - id: TS-010
    type: complements
  - id: TS-011
    type: bounded-by
---

# System Consistency over In-Context Discoverability

## Ranking

**Every piece of functionality gets one predictable home across the system, even when putting a copy of it in context would make one surface easier to use.**

## Why

The pull toward in-context placement is local and constant. Every team can argue that its surface would be easier if the related setting, filter or control lived right there. Each argument is reasonable on its own, and accepting all of them produces a system where the same capability lives in four places with four slightly different behaviors. The user can no longer predict where anything is, so every surface becomes a search.

The cost this ranking accepts is real: some users will not find a capability on the first try, because it lives in its home rather than beside them. The ranking pays that cost once, in exchange for a system that teaches itself. After a user learns where one kind of thing lives, they know where every thing of that kind lives. That compounding predictability is worth more than any single surface's convenience.

The split between an app's own settings and a platform's system Settings is an example of this kind of line. It is invisible in any single screenshot. It only shows up when you look across the whole system and notice that the line was drawn once and then held.

## How to Spot the Conflict

- The same control, setting or entry point appears on more than one surface, with differences in label, default or behavior.
- A proposal says "let's also put it here" for something that already has a home.
- A settings or preferences area exists, yet a feature surface carries its own private configuration panel.
- Users ask where to change something that the product changes in several places.

When this conflict shows up, cite TR-001 and say which home the capability belongs in. Use the **Move** verdict in scope mode when the capability is fine but lives in the wrong place.

## Exemplars

**Consumer platform (system settings).** Apple's guidance puts task-specific options in the screens they affect, sends only the most rarely changed options to the system Settings app, and asks apps to respect systemwide settings rather than include redundant versions of them. The second part is this ranking: a system-level preference has one home, and an app does not ship its own private copy. The first part is this ranking's flip condition, below.

**Developer-tool craft (command palettes).** Tools built around a single command palette route every action through one predictable entry point. Some actions are a keystroke farther away than a dedicated button would be. In exchange, a user who learns the palette can reach everything, and new features arrive without new chrome.

**Editorial (fixed section architecture).** A well-run publication keeps sections in the same order and the same place in every issue, even when a story would get more attention moved forward. Readers navigate by habit, and the habit is the product.

## When It Flips

- **Frequency:** a control used inside the task, many times per session, belongs in context. A camera's flash toggle lives on the viewfinder, not in settings. The home for high-frequency, task-bound controls *is* the task.
- **Discovery failure becomes a usability failure:** when users demonstrably cannot complete a task because the capability is too far from where they need it, the Correct floor wins. That is a usability finding first.
- **Shortcuts that point home:** a contextual entry point is fine when it opens the one canonical home rather than duplicating it. A link is not a second home.

## Sources

- Apple Human Interface Guidelines, Settings: task-specific options belong in the screens they affect; the most rarely changed options can go to system Settings; respect systemwide settings and avoid including redundant versions of them.
- Jakob Nielsen, "10 Usability Heuristics for User Interface Design," heuristic 4 (consistency and standards).
- Enforces TS-006 (Single Voice) at system scale; bounded by TS-011 (Convention as the Tasteful Choice) where platform convention sets the home.

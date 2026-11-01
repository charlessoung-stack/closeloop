# DEVPOST.md — Devpost submission description (Skeleton Crew category)

> All submission materials must be in English (or accompanied by an English
> translation). Fill the bracketed placeholders before submitting. Category:
> **Skeleton Crew** — one template + two independent application folders.

---

## Project title

**Closeloop — close the B2B sales loop: one template, two apps, zero API keys**

## Tagline (one line)

Inbound leads never go cold: capture → qualify → route → act → track, driven
by Kiro steering, specs, and hooks.

## Elevator pitch (why it exists)

Small B2B teams lose inbound leads between the form and the follow-up: nobody
scores them, nobody owns the next step, and the spreadsheet goes stale.
Closeloop is a reusable template plus two applications that close that loop —
LeadGen captures and qualifies, Pipeline enforces the process, and one shared
engine makes the whole thing testable and reproducible.

## What it does

- **app-1 · LeadGen Agent** — a landing page with a validated lead form and a
  scripted qualification chat. Every lead is scored 0–100 by a deterministic
  agent with explicit reasons (budget, decision-maker, timeline, need
  signals), labeled cold/warm/hot, and pushed into a scored queue. One click
  sends qualified leads to the pipeline.
- **app-2 · Pipeline Agent** — a kanban board over an 8-stage state machine
  (`NEW_LEAD → QUALIFIED → CONTACTED → DEMO → PROPOSAL → NEGOTIATION → WON |
  LOST`) where the engine rejects invalid transitions and `WON` is terminal.
  Includes next-best-action recommendations, follow-up scheduling, notes, and
  live analytics (funnel conversion, win rate, time-in-stage).
- **template · @closeloop/core** — the reusable engine: pipeline, agents,
  storage adapters (localStorage/memory), analytics, and a UI kit. Both apps
  import it directly, so any third app can reuse the same foundation.

The demo runs fully client-side with **zero API keys** (deterministic
heuristic agents; a pluggable `AgentAdapter` interface is the seam for real
LLMs). Data lives in `localStorage` under `closeloop-db`, shared by both apps.

## How we built it (Kiro usage — judged criterion)

This is our first real project with Kiro, and the build was spec-driven from
the start:

- **Steering** — `.kiro/steering/{product,tech,structure}.md`, all
  `inclusion: always`, pinning stack, constraints, and non-goals.
- **Specs** — EARS requirements → design → wave-scheduled tasks for the core
  engine, LeadGen, and Pipeline; the transition map and scoring weights were
  fixed before code.
- **Hooks** — `PostFileSave` hooks run the repo's real `typecheck` and test
  commands on every save.
- **Custom agent** — `closeloop-sales` pre-loads steering + specs as
  resources.
- **MCP** — optional `fetch` server declared in `settings/mcp.json`.
- **Property-based tests** — fast-check invariants (score bounds, transition
  guard, next-action shape), 300 runs each; PBT caught a bad test setup during
  development.

Full honest write-up: `docs/KIRO_USAGE.md` in the repo.

## Links

- GitHub: https://github.com/charlessoung-stack/closeloop
- Working apps: LeadGen https://speedy-mercury-fws9i9m.tmp.now · Pipeline https://zippy-carbon-rdy9hdc.tmp.now
- Demo video (YouTube, public, < 3 min): [<VIDEO_URL> — record per docs/VIDEO_SCRIPT.md]
- Blog post: [<BLOG_URL> — publish per docs/BLOG_DRAFT.md]
- Social post: [<SOCIAL_URL> — post per docs/SOCIAL_DRAFT.md]

## Category & awards

- **Category:** Skeleton Crew (one template + two independent app folders).
- **Bonus entries:** Blog, Social Blitz (other bonus categories do not apply —
  not a student, not a founder, first Kiroween).

## Tech stack

TypeScript (strict) · React 18 · Vite 5 · Vitest 3 · fast-check · npm
workspaces · localStorage. No backend, no paid APIs.

## Demos / credentials

No login required. Seed data uses fictional companies (`.example` domains) —
no real trademarks.

## What's in the repo

```
.kiro/       steering · specs · hooks · agents · settings/mcp.json
template/    @closeloop/core (engine, agents, storage, UI kit, tests)
app-1/       LeadGen Agent
app-2/       Pipeline Agent
docs/        KIRO_USAGE · VIDEO_SCRIPT · BLOG_DRAFT · SOCIAL_DRAFT · CHECKLIST
LICENSE      MIT (visible in GitHub About)
README.md    layout, quick start, verification commands
```

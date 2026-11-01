# KIRO_USAGE.md — How Closeloop Uses Kiro (Kiroween 2026)

> Honest note up front: **this is our first real project using Kiro.** We had not
> used Kiro IDE, CLI, Web, or Crew before this hackathon. Everything below is
> what we actually configured in this repo, validated against the official Kiro
> docs (`kiro.dev/docs`) — not a retrospective of long-term experience. Configs
> are shipped in `.kiro/` so judges can inspect exactly what Kiro will pick up.

## 1. Which Kiro products we used, and how they differ for us

We treated Kiro as the **spec-and-automation layer** of the build. We did not
rely on a model chatting us through the code; we wrote the artifacts Kiro reads
first, then implemented from them:

| Kiro surface | What we put in it | Role in the build |
|---|---|---|
| Steering (`/steering/*.md`) | `product.md`, `tech.md`, `structure.md`, all `inclusion: always` | Persistent project memory for every future prompt/session |
| Specs (`/specs/<feature>/`) | `requirements.md` (EARS), `design.md`, `tasks.md` for 3 features | The source of truth that code, tests, and apps were written against |
| Hooks (`/hooks/*.json`) | `lint-on-save.json`, `test-on-save.json` (`PostFileSave`) | Automated guardrails triggered on file save |
| Custom agent (`/agents/closeloop-sales.json`) | A sales-flow implementation agent with steering+specs resources | A focused, repeatable working context |
| MCP (`/settings/mcp.json`) | `fetch` MCP server (optional, disabled-friendly) | Ready-to-use web fetching when enabled |
| Powers | Not used in this submission | We stayed with core Kiro surfaces; the `Agent Plugins` format is documented in our research notes for follow-ups |

The main practical difference we observed between surfaces: **steering is
always-on memory**, **specs are structured work**, and **hooks are the only
piece that executes commands automatically**. Keeping them separate made the
project self-documenting: someone cloning the repo can read `.kiro/` and
understand both the *why* and the *how* of every file.

## 2. Custom agent — `closeloop-sales`

`.kiro/agents/closeloop-sales.json` defines a custom agent that:
- loads our three steering files and all three spec folders as resources
  (`"resources": ["file://.kiro/steering/**/*.md", "file://.kiro/specs/**/*.md"]`),
  so every session starts with the full context;
- is restricted to file-tooling plus `npm *` / `npx *` / `git *` permissions —
  enough to implement and verify, not enough to wander;
- greets with an explicit "this agent implements the Closeloop specs" message
  so a future session knows its job.

Why we like this: instead of re-explaining the project in every chat, the agent
re-hydrates from `.kiro` automatically. For a two-app repo with one shared
engine, that removed a whole class of context drift.

## 3. Hooks — what got automated

Two `PostFileSave` hooks:

- `lint-on-save.json` — on any `*.ts` / `*.tsx` save, runs `npm run typecheck`
  (the same command we run in CI; verified passing: `tsc --noEmit` across all
  three workspaces).
- `test-on-save.json` — on any `*.test.ts` save, runs `npm run test:quiet`
  (vitest, silent), including our fast-check property tests.

Both hooks use the `{"version":"v1","hooks":[{name,trigger,matcher,action}]}`
format documented at `kiro.dev/docs/hooks/`. Because the hooks invoke the exact
commands the repo already ships, "typecheck on save" is the same check in the
editor, in CI, and in the checklist.

## 4. Specs vs. vibe coding

We wrote specs first (`WHEN … THE System SHALL …` EARS requirements, a design
doc with the transition table and scoring weights, then wave-scheduled tasks),
and the implementation followed the tasks. Compared with vibe coding (prompt →
code → fix), the measurable difference we hit in practice:

- **The transition map and scoring weights were pinned before a single test was
  written.** When a test disagreed with behavior, we could tell whether the code
  or the expectation was wrong — and in one case the *test* was wrong (a weak
  lead scores 15, not 25; the spec math `10 + 5` was right).
- **Tasks in dependency waves** kept template (engine) before app-1/app-2, so
  the two apps could be built in parallel against a stable core.
- **Property tests** (P1–P3) encoded invariants from the requirements — scores
  in `[0,100]`, moves succeed iff the map says so, next-actions always
  well-formed — and fast-check ran 300 rounds per property.

### PBT bug it actually caught

During development, an early property test constructed a lead and immediately
called `moveLead` without persisting it to the store first. The engine correctly
threw `LEAD_NOT_FOUND`, and the property was vacuously false. The fix (persist
before moving, fresh store per run) turned the property meaningful — a nice
example of property tests finding *bad test setup* as well as bad code.

## 5. Steering strategy

Three files, all `inclusion: always`:

- `product.md` — purpose, target users, features, business objectives, non-goals;
- `tech.md` — the stack decision (TypeScript strict, React 18, Vite, Vitest +
  fast-check, npm workspaces), command table, and the **zero-API-key demo
  constraint** (agents run in deterministic heuristic mode; the LLM adapter
  interface is the seam for later);
- `structure.md` — repo layout, naming conventions, where tests live.

Strategy: keep them short, factual, and non-negotiable. Anything that must not
be re-litigated by a future prompt (stack, licensing, the `.kiro` tracking rule)
lives there.

## 6. MCP

`.kiro/settings/mcp.json` declares one `mcpServers` entry: `fetch`
(`uvx mcp-server-fetch`), `disabled: false`. It is optional by design — the
project never depends on it — but it documents how a future session gets web
data inside Kiro without leaving the agent context.

## 7. Powers — planned, not shipped

We studied the Agent Plugins format (`plugin.json` + skills + `mcp.json`) in the
official docs but did not ship a power in this submission: our scope didn't need
one, and an untested plugin would weaken the "everything verified" story. The
interface seam for it is the same `AgentAdapter` we use for LLMs.

## 8. What we could not verify (and did instead)

As first-time users we could not run the Kiro IDE/CLI in this build environment,
so we could not execute the hooks live. Mitigations:

- every hook/spec/steering file was written to the exact JSON/front-matter
  formats from the official docs and re-read against them;
- the commands the hooks call (`typecheck`, `test:quiet`) are the repo's real
  scripts, verified passing here;
- the whole `.kiro/` tree is tracked (official rule: never `.gitignore` it) so
  judges can diff format against `kiro.dev/docs` directly.

That is the honest boundary of this write-up: configuration verified against
docs, execution verified in npm, live Kiro behavior to be confirmed on the
judging side.

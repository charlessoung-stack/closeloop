# Closeloop — B2B Agent Sales-Loop Template

**Kiroween 2026 · Skeleton Crew category** — a lean, reusable template + two distinct applications from one foundation.

Closeloop closes the loop small B2B sales teams lose: **capture → qualify → route → act → track**. Inbound leads never go cold because an agent pipeline scores every lead, suggests the next best action, and enforces the sales process end-to-end.



***

## Repository layout (Skeleton Crew: template + 2 apps)



```
closeloop/
├── .kiro/                  # Kiro steering, specs, hooks, agents, settings (tracked — official rule)
│   ├── steering/           # product.md, tech.md, structure.md (inclusion: always)
│   ├── specs/              # core-pipeline, leadgen-app, pipeline-app (requirements/design/tasks)
│   ├── hooks/              # lint-on-save.json, test-on-save.json
│   ├── agents/             # closeloop-sales.json custom agent
│   └── settings/mcp.json   # MCP server config (fetch, optional)
├── template/               # @closeloop/core — the reusable engine (pipeline, agents, storage, UI kit)
├── app-1/                  # LeadGen Agent — capture + AI qualification + scored lead queue
├── app-2/                  # Pipeline Agent — kanban board + next actions + follow-ups + analytics
├── docs/                   # submission artifacts (KIRO_USAGE, VIDEO_SCRIPT, BLOG_DRAFT, SOCIAL_DRAFT, DEVPOST, CHECKLIST)
├── LICENSE                 # MIT (visible in GitHub About — official rule)
└── package.json            # npm workspaces
```

## Live demo (deployed on Vercel)

* **LeadGen Agent (app-1):** https://speedy-mercury-fws9i9m.tmp.now
* **Pipeline Agent (app-2):** https://zippy-carbon-rdy9hdc.tmp.now

No login required — seed data ships with the app. Both apps share the same `localStorage` key (`closeloop-db`), so a lead captured in app-1 shows up in app-2 (open them in the same browser profile).

## Quick start



```
npm install
npm run dev:leadgen     # http://localhost:5173  — capture & qualify a lead
npm run dev:pipeline    # http://localhost:5174  — manage the pipeline
```

Verification commands:



```
npm run typecheck       # tsc --noEmit across all workspaces
npm test                # vitest unit + property-based tests
npm run build           # production builds of both apps (typecheck + vite build)
```

> Demo runs fully client-side with 
>
> **zero API keys**
>
> : agents run in deterministic heuristic mode; an 
>
> `AgentAdapter`
>
>  interface exists for plugging a real LLM later. Data persists in 
>
> `localStorage`
>
>  (
>
> `closeloop-db`
>
> ), shared by both apps.

## Template (`/template`, `@closeloop/core`)

One engine, two surfaces:



* **Pipeline engine** — 8 stages (`NEW_LEAD → QUALIFIED → CONTACTED → DEMO → PROPOSAL → NEGOTIATION → WON | LOST`), validated transitions, activity log, terminal-stage guards.

* **Agents** — Qualifier (score 0–100 + reasons), Next-Best-Action (stage playbooks), scoring (BANT-style weights), pluggable LLM adapter.

* **Storage** — memory + localStorage adapters.

* **UI kit** — PipelineBoard, LeadCard, ScoreBadge, StageBadge, AgentSuggestion, FollowUpList, dark ops-console design tokens.

* **Analytics** — funnel conversion, win rate, avg time-in-stage.

## The two applications



| App                | Folder   | What it does                                                                                                                                                                 |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LeadGen Agent**  | `/app-1` | Landing page + validated lead form + scripted qualification chat that re-scores live + scored lead queue with agent reasons; one click sends qualified leads to the pipeline |
| **Pipeline Agent** | `/app-2` | Kanban pipeline with engine-guarded moves, next-best-action per lead, follow-up scheduling, meeting notes, and live analytics                                                |

## Kiro usage (summary)



* Steering docs in `.kiro/steering` (`inclusion: always`) drive every implementation decision.

* Spec-driven: requirements (EARS) → design → tasks in `.kiro/specs`; tasks run in dependency waves.

* Hooks: type-check on every TS save, tests on every test-file save.

* Custom agent `closeloop-sales` pre-loads steering + specs as resources.

* Property-based tests (fast-check) guard pipeline transitions and scoring invariants.

Full honest write-up: [docs/KIRO\_USAGE.md](docs/KIRO_USAGE.md) · submission checklist: [docs/CHECKLIST.md](docs/CHECKLIST.md)

## License

MIT — see [LICENSE](LICENSE). Built as a new project during the Kiroween 2026 Submission Period (October 30 – December 4, 2026).
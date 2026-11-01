---
inclusion: always
---

# Closeloop — Project Structure

## Repo layout (Skeleton Crew: 1 template + 2 applications in separate folders)
- `/template` — reusable core package `@closeloop/core`: pipeline engine, agents (qualifier / next-action / scoring), storage adapters, shared UI kit, design tokens
- `/app-1` — **LeadGen Agent** app: landing page + lead capture + AI qualification chat + scored lead queue
- `/app-2` — **Pipeline Agent** app: kanban pipeline board + next-best-action + follow-ups + analytics
- `/docs` — submission artifacts (KIRO_USAGE, VIDEO_SCRIPT, BLOG_DRAFT, SOCIAL_DRAFT, DEVPOST, CHECKLIST)
- `/.kiro` — Kiro steering, specs, hooks, agents, settings (must stay tracked; official rule)

## Conventions
- Apps import the core as `@closeloop/core` (resolved by Vite alias to `../template/src`)
- Naming: camelCase functions/variables, PascalCase components & types, kebab-case file names
- Tests: pure-logic tests live in `template/tests/*.test.ts`; app smoke tests in `app-*/tests/`
- Every public core function is unit-tested; pipeline transitions and scoring invariants have property-based tests (fast-check)
- Demo data uses clearly fictional company names (no real trademarks)

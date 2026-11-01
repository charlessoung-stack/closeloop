---
inclusion: always
---

# Closeloop — Technology Stack

## Stack (decided 2026-11-01, during the Kiroween Submission Period)
- **TypeScript 5.x, strict mode** everywhere
- **React 18 + Vite 5** for the two applications (app-1 LeadGen, app-2 Pipeline)
- **Vitest 3 + fast-check** for unit and property-based tests
- **Plain CSS with design tokens** (CSS variables) — no UI framework dependency
- **npm workspaces**: `template` (`@closeloop/core`) + `app-1` + `app-2`

## Constraints
- NO runtime API keys required for the demo: agents run in heuristic mode; an LLM adapter interface is provided for optional real-model mode via env config
- Runs fully client-side (localStorage persistence) so judges can run it without a backend
- Each app must build with `npm run build` and serve via `vite preview`
- `@closeloop/core` is consumed as source (Vite alias `@closeloop/core` → `../template/src`), so the template edits apply to both apps immediately

## Commands
- `npm install` (proxy-configured) — installs all workspaces
- `npm run typecheck` — tsc --noEmit across workspaces
- `npm test` — vitest across workspaces
- `npm run build` — typecheck + vite build for both apps
- `npm run dev:leadgen` / `npm run dev:pipeline` — local dev servers

# Core Pipeline Engine — Tasks

Dependency waves: tasks with no dependencies run first (wave 1), then wave 2, etc. Kiro executes independent tasks concurrently.

## Wave 1 — foundation
- [ ] `template/src/types.ts` — `PipelineStageId`, `Lead`, `Note`, `Activity`, `FollowUp`, `QualificationInput`, `QualificationResult`, `AgentAction`
- [ ] `template/src/pipeline/stages.ts` — `STAGES` (label/color per stage) + `TRANSITIONS` map
- [ ] `template/src/pipeline/errors.ts` — `PipelineError` + codes

## Wave 2 — engine & storage
- [ ] `template/src/pipeline/engine.ts` — `PipelineEngine` (addLead, moveLead with guards, updateScore, addNote, addFollowUp, completeFollowUp, getLead, listLeads)
- [ ] `template/src/storage/memory.ts` — `createMemoryStore(seed?)`
- [ ] `template/src/storage/localStorage.ts` — `createLocalStorageStore(key?)` with browser guard
- [ ] `template/src/index.ts` — public exports + `createCloseloop(store?)`

## Wave 3 — agents
- [ ] `template/src/agents/scoring.ts` — `scoreLead` + `bucket`
- [ ] `template/src/agents/qualifier.ts` — `qualify(input): QualificationResult`
- [ ] `template/src/agents/nextAction.ts` — `suggestNextAction(lead): AgentAction`
- [ ] `template/src/agents/llmAdapter.ts` — `AgentAdapter` interface + `heuristicAdapter`

## Wave 4 — UI kit
- [ ] `template/src/ui/ScoreBadge.tsx` / `StageBadge.tsx` / `LeadCard.tsx` / `PipelineBoard.tsx` / `AgentSuggestion.tsx` / `FollowUpList.tsx`
- [ ] `template/src/ui/styles.css` — design tokens (dark ops-console theme)

## Wave 5 — tests (blocked by waves 2–3)
- [ ] `template/tests/pipeline.test.ts` — R1–R4, AC1–AC2
- [ ] `template/tests/scoring.test.ts` — R5–R6
- [ ] `template/tests/agents.test.ts` — R7–R8 playbooks
- [ ] `template/tests/properties.test.ts` — P1–P3 with fast-check

## Wave 6 — package wiring
- [ ] `template/package.json`, `tsconfig.json` (strict, react-jsx)
- [ ] Root `package.json` workspaces + scripts; `npm install` resolves; `npm run typecheck && npm test` green

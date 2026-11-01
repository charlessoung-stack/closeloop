# Core Pipeline Engine — Requirements (EARS)

Feature spec for the reusable `@closeloop/core` engine. All statements use EARS (`WHEN … THE System SHALL …`).

## 1. Lead lifecycle

- **R1** WHEN a lead is created, THE System SHALL place it in stage `NEW_LEAD` with score `0`, `createdAt`/`updatedAt`/`stageChangedAt` set to the current time, and an empty activity log.
- **R2** WHEN a lead is moved to a stage `to`, THE System SHALL accept the move only if `to ∈ TRANSITIONS[lead.stage]`; otherwise THE System SHALL reject it with a `PipelineError` and leave the lead unchanged.
- **R3** WHEN a lead is moved to `WON` or `LOST`, THE System SHALL treat that stage as terminal: no further moves are allowed from `WON`; `LOST` may only move back to `NEW_LEAD` (re-open).
- **R4** WHEN a lead changes stage, THE System SHALL append a dated `Activity` of type `stage_change` recording from/to stage and the actor, and update `updatedAt` + `stageChangedAt`.

## 2. Scoring

- **R5** WHEN a lead is scored with a `QualificationInput`, THE System SHALL return a score clamped to `[0, 100]` and a bucket derived from the score (`cold < 40`, `warm 40–69`, `hot ≥ 70`).
- **R6** WHEN scoring reasons are produced, THE System SHALL include at least one reason per contributing signal (budget, authority, timeline, need signals).

## 3. Agents

- **R7** WHEN qualification signals are provided, THE Qualifier SHALL return `{ score, bucket, qualified, reasons, suggestedStage, nextAction }`.
- **R8** WHEN a lead is at stage `S` with follow-up history, THE NextActionAgent SHALL return exactly one recommended action with a priority and a due offset in days, chosen from stage-specific playbooks.

## 4. Storage & notes

- **R9** WHEN a note is added to a lead, THE System SHALL append it and record an `Activity` of type `note`.
- **R10** WHEN a follow-up is created or completed, THE System SHALL update the lead's follow-up list and record an `Activity` of type `followup`.
- **R11** WHEN the store is a persistent adapter (localStorage), THE System SHALL restore the full lead set on reload without data loss.

## PBT-eligible properties

- **P1** For any valid sequence of scored inputs: `score ∈ [0,100]` and `bucket(score)` is consistent (`cold/warm/hot` boundaries exact).
- **P2** For any lead and any target stage `to`: `move` succeeds **iff** `to ∈ TRANSITIONS[lead.stage]`; success always appends exactly one `stage_change` activity; failure never mutates the lead.
- **P3** For any lead: `suggestNextAction` always returns a non-empty action with `priority ∈ {low, mid, high}` and `dueInDays ∈ [1, 90]`.

## Acceptance criteria

- **AC1** All 8 stages exist: `NEW_LEAD, QUALIFIED, CONTACTED, DEMO, PROPOSAL, NEGOTIATION, WON, LOST`.
- **AC2** Terminal behavior per R3 is enforced by the engine, not only by the UI.
- **AC3** `createCloseloop(store)` works with both memory and localStorage stores; seed data loads in both apps.

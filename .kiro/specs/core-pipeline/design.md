# Core Pipeline Engine — Design

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│  app-1 (LeadGen)   app-2 (Pipeline)                       │
│  └─ React UI kit (PipelineBoard, LeadCard, …)             │
├───────────────────────────────────────────────────────────┤
│  @closeloop/core                                          │
│   PipelineEngine ──► agents (Qualifier, NextAction)       │
│        │  ▲                                               │
│        ▼  │                                               │
│   LeadStore (MemoryStore | LocalStorageStore)             │
└───────────────────────────────────────────────────────────┘
```

- `PipelineEngine` is the only mutation path: `addLead / moveLead / updateScore / addNote / addFollowUp / completeFollowUp`.
- Agents are pure functions over `(input | lead)` → decision; the engine persists decisions as activities.
- The LLM adapter is an interface; the default `heuristic` implementation is deterministic and key-free. A real model can be injected later without touching the engine.

## Data model

```ts
type PipelineStageId = "NEW_LEAD"|"QUALIFIED"|"CONTACTED"|"DEMO"|"PROPOSAL"|"NEGOTIATION"|"WON"|"LOST";

interface Lead {
  id, company, contactName, email, phone?, source,
  budget: "low"|"mid"|"high", isDecisionMaker: boolean, timelineWeeks: number,
  needDescription: string,
  stage: PipelineStageId, score: number,
  createdAt, updatedAt, stageChangedAt: ISO strings,
  notes: Note[], activities: Activity[], followUps: FollowUp[],
}
```

## Stage transition map (guards live in the engine)

```ts
const TRANSITIONS: Record<PipelineStageId, PipelineStageId[]> = {
  NEW_LEAD:   ["QUALIFIED", "LOST"],
  QUALIFIED:  ["CONTACTED", "LOST"],
  CONTACTED:  ["DEMO", "LOST", "QUALIFIED"],
  DEMO:       ["PROPOSAL", "LOST", "CONTACTED"],
  PROPOSAL:   ["NEGOTIATION", "LOST", "DEMO"],
  NEGOTIATION:["WON", "LOST", "PROPOSAL"],
  WON:        [],
  LOST:       ["NEW_LEAD"],
};
```

## Scoring weights (heuristic mode)

| Signal | Contribution |
|---|---|
| Budget high/mid/low | 30 / 20 / 10 |
| Decision maker | 25 |
| Timeline ≤4w / ≤12w / ≤26w / else | 30 / 20 / 10 / 5 |
| Need signals (≤3, +5 each) | ≤15 |

Score = clamp(sum, 0, 100). Buckets: cold <40, warm 40–69, hot ≥70. `qualified = score ≥ 55 && isDecisionMaker`.

## Error handling
- `PipelineError` with a machine-readable code (`INVALID_TRANSITION`, `LEAD_NOT_FOUND`, `TERMINAL_STAGE`) surfaced in UI as inline warnings; the engine never partially mutates.

## Testing strategy
- Unit tests: engine transitions, scoring weights, agent playbooks.
- PBT (fast-check): P1–P3 properties above, 200 runs each, seeded.
- App smoke tests: import + render the root component (node environment, no DOM assertions beyond import success).

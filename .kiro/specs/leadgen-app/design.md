# LeadGen Agent App — Design

## Screens (tabbed single-page app)
1. **Landing** — hero + `LeadForm` + `QualifyChat` (right rail) → verdict card
2. **Lead Queue** — `LeadQueue` table: company, contact, source, score badge, bucket, top reasons, next action, “Send to pipeline” button

## Flow

```
LeadForm submit → engine.addLead (stage NEW_LEAD, score 0)
   → qualify(input from form+chat answers) → engine.updateScore + suggestedStage
   → verdict card (score, bucket, reasons, nextAction) + lead appended to queue
QualifyChat answers → live re-score via qualify() → verdict updates
“Send to pipeline” → engine.moveLead(id, "QUALIFIED") → persisted in shared store
```

## Data
- Store: `createLocalStorageStore("closeloop-db")` via `createCloseloop`.
- Chat answers map to `QualificationInput` fields; unanswered questions use neutral defaults (mid budget, 12-week timeline, decision maker unknown → false) and are disclosed on the verdict.

## UI
- Uses core UI kit (`ScoreBadge`, `AgentSuggestion`).
- Dark “ops console” theme; single column form on desktop, sticky verdict rail.

## Testing
- Smoke test: app renders (imports `App`), engine round-trip (create → qualify → move) passes.

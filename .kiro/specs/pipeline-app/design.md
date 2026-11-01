# Pipeline Agent App — Design

## Screens (tabbed single-page app)
1. **Pipeline** — `PipelineBoard` (core kit) + lead detail drawer (notes, follow-ups, next action, move buttons)
2. **Next Actions** — `NextActions` list: per-lead agent suggestion + schedule-to-follow-up
3. **Follow-ups** — `FollowUpList` (core kit) with complete toggle
4. **Analytics** — computed funnel + win rate + avg time-in-stage

## Flow

```
Board: moveLead(id, to) → engine guard → persist or inline PipelineError
Detail drawer: suggestNextAction(lead) → “Schedule” → addFollowUp
Next Actions tab: all open follow-ups + suggestions, sorted by due
Analytics tab: derive stats from store.list() (pure functions in core: computeAnalytics)
```

## Data
- Same `createLocalStorageStore("closeloop-db")` key as app-1; seed data loads when empty so judges see a living pipeline immediately.
- Analytics functions live in core (`template/src/analytics.ts`) so both apps and tests share them.

## UI
- Dark ops-console theme; columns scroll horizontally; stage colors from `STAGES`.

## Testing
- Smoke test: app renders; `computeAnalytics` unit-tested in core.

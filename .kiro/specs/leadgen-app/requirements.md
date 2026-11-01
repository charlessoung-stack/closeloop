# LeadGen Agent App — Requirements (EARS)

Feature spec for `app-1`: capture inbound B2B leads and qualify them with an agent.

## 1. Landing & capture
- **R1** WHEN a visitor submits the lead form (company, contact, email, source, budget, decision maker, timeline, need description), THE System SHALL create a lead via the core engine and show an agent verdict (score, bucket, reasons, next action).
- **R2** WHEN a form field is missing or email is malformed, THE System SHALL block submission and show a field-level error.

## 2. Qualification chat
- **R3** WHEN the visitor opens the qualification chat, THE System SHALL ask up to 3 scripted questions (budget, authority, timeline) and re-score the lead after each answer, updating the verdict live.
- **R4** WHEN qualification completes, THE System SHALL persist the final score, reasons, and suggested stage to the lead.

## 3. Lead queue
- **R5** WHEN the queue view is opened, THE System SHALL list all captured leads sorted by score (desc) with score badge, reasons, and next action.
- **R6** WHEN the user clicks “Send to pipeline”, THE System SHALL move the lead to `QUALIFIED` (via engine, valid transition) so `app-2` can pick it up from the shared store.

## Acceptance criteria
- **AC1** Capture → verdict → queue works end-to-end without any API key.
- **AC2** Verdict reasons are non-empty and human-readable.
- **AC3** Leads persist in localStorage and survive reload.

# Pipeline Agent App — Requirements (EARS)

Feature spec for `app-2`: run the sales process and automate next actions.

## 1. Pipeline board
- **R1** WHEN the pipeline view is opened, THE System SHALL render one column per stage with leads grouped by stage, using the shared store.
- **R2** WHEN the user moves a lead to an allowed stage, THE System SHALL persist the move via the engine and log a `stage_change` activity; illegal moves SHALL show an inline error and change nothing.

## 2. Next-best-action agent
- **R3** WHEN a lead is selected, THE System SHALL show the agent's recommended next action (action text, priority, due offset, reason) from the core playbook.
- **R4** WHEN the user schedules the suggested action, THE System SHALL create a `FollowUp` with due date and add a `followup` activity.

## 3. Follow-ups & notes
- **R5** WHEN the Follow-ups tab is opened, THE System SHALL list open follow-ups sorted by due date with a complete toggle.
- **R6** WHEN a note is added to a lead, THE System SHALL persist it and log a `note` activity.

## 4. Analytics
- **R7** WHEN analytics is opened, THE System SHALL compute and display: leads per stage, avg score, funnel conversion (`NEW_LEAD → WON`), win rate (`WON/(WON+LOST)`), and avg days in current stage.

## Acceptance criteria
- **AC1** Board, next actions, follow-ups, analytics all work from the same store with seed data.
- **AC2** Illegal transitions are blocked by the engine and surfaced in UI.
- **AC3** All numbers are computed from the live lead set (no hardcoded stats).

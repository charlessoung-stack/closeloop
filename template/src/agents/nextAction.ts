import type { AgentAction, Lead, PipelineStageId } from "../types";

const PLAYBOOK: Record<PipelineStageId, AgentAction> = {
  NEW_LEAD: {
    action: "Run qualification & respond within 1 business day",
    priority: "high",
    dueInDays: 1,
    reason: "Response speed is the #1 predictor of inbound conversion.",
  },
  QUALIFIED: {
    action: "Send a tailored intro email with a clear CTA",
    priority: "high",
    dueInDays: 1,
    reason: "Qualified leads expect a personal follow-up immediately.",
  },
  CONTACTED: {
    action: "Book a demo / discovery call",
    priority: "high",
    dueInDays: 3,
    reason: "Move the conversation to a live meeting to build momentum.",
  },
  DEMO: {
    action: "Send the proposal within 48h of the demo",
    priority: "high",
    dueInDays: 2,
    reason: "Strike while the demo is fresh in their memory.",
  },
  PROPOSAL: {
    action: "Follow up on the proposal",
    priority: "mid",
    dueInDays: 3,
    reason: "Proposals left untouched for a week go cold.",
  },
  NEGOTIATION: {
    action: "Prepare discount options & next offer",
    priority: "mid",
    dueInDays: 4,
    reason: "Have room to move while protecting margin.",
  },
  WON: {
    action: "Hand off to onboarding / send kickoff email",
    priority: "mid",
    dueInDays: 1,
    reason: "Lock in the win with a clean handoff.",
  },
  LOST: {
    action: "Schedule a re-engage touch in 90 days",
    priority: "low",
    dueInDays: 90,
    reason: "Lost deals often return with a new budget cycle.",
  },
};

/** Next-best-action agent: exactly one recommended action per stage, tuned by open follow-ups. */
export function suggestNextAction(lead: Lead): AgentAction {
  const base = PLAYBOOK[lead.stage];
  if (lead.followUps.some((f) => !f.done)) {
    return {
      ...base,
      reason: `${base.reason} (an open follow-up exists — do that first if it is due).`,
    };
  }
  return base;
}

import type { AgentAction, Lead, QualificationInput, QualificationResult } from "../types";
import { qualify } from "./qualifier";
import { suggestNextAction } from "./nextAction";

export interface AgentAdapter {
  readonly mode: string;
  qualify(input: QualificationInput): QualificationResult;
  suggestNextAction(lead: Lead): AgentAction;
}

/** Deterministic, zero-dependency adapter — the default demo mode (no API keys). */
export const heuristicAdapter: AgentAdapter = {
  mode: "heuristic",
  qualify,
  suggestNextAction,
};

/**
 * Pluggable adapter for a real LLM later. Implementers must return the same
 * shapes; the engine and UI never change. Not wired to any provider by
 * default so the demo always runs offline.
 */
export function createAdapter(overrides: Partial<AgentAdapter>): AgentAdapter {
  return { ...heuristicAdapter, ...overrides };
}

import type { PipelineStageId } from "../types";

export interface StageMeta {
  id: PipelineStageId;
  label: string;
  color: string;
}

export const STAGES: StageMeta[] = [
  { id: "NEW_LEAD", label: "New", color: "#8b5cf6" },
  { id: "QUALIFIED", label: "Qualified", color: "#6366f1" },
  { id: "CONTACTED", label: "Contacted", color: "#0ea5e9" },
  { id: "DEMO", label: "Demo", color: "#10b981" },
  { id: "PROPOSAL", label: "Proposal", color: "#f59e0b" },
  { id: "NEGOTIATION", label: "Negotiation", color: "#f97316" },
  { id: "WON", label: "Won", color: "#22c55e" },
  { id: "LOST", label: "Lost", color: "#64748b" },
];

/** Allowed forward moves (plus back-moves a real CRM allows, and LOST → NEW_LEAD reopen). */
export const TRANSITIONS: Record<PipelineStageId, PipelineStageId[]> = {
  NEW_LEAD: ["QUALIFIED", "LOST"],
  QUALIFIED: ["CONTACTED", "LOST"],
  CONTACTED: ["DEMO", "LOST", "QUALIFIED"],
  DEMO: ["PROPOSAL", "LOST", "CONTACTED"],
  PROPOSAL: ["NEGOTIATION", "LOST", "DEMO"],
  NEGOTIATION: ["WON", "LOST", "PROPOSAL"],
  WON: [],
  LOST: ["NEW_LEAD"],
};

export const TERMINAL_STAGES: PipelineStageId[] = ["WON", "LOST"];

export function isTerminal(stage: PipelineStageId): boolean {
  return TERMINAL_STAGES.includes(stage);
}

export function canMove(from: PipelineStageId, to: PipelineStageId): boolean {
  if (from === "WON") return false;
  if (from === "LOST") return to === "NEW_LEAD";
  return TRANSITIONS[from].includes(to);
}

export function stageLabel(id: PipelineStageId): string {
  return STAGES.find((s) => s.id === id)?.label ?? id;
}

export function stageColor(id: PipelineStageId): string {
  return STAGES.find((s) => s.id === id)?.color ?? "#94a3b8";
}

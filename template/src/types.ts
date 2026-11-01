export type PipelineStageId =
  | "NEW_LEAD"
  | "QUALIFIED"
  | "CONTACTED"
  | "DEMO"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type ScoreBucket = "cold" | "warm" | "hot";
export type BudgetLevel = "low" | "mid" | "high";
export type Priority = "low" | "mid" | "high";

export interface Note {
  id: string;
  text: string;
  author: string;
  at: string;
}

export interface Activity {
  id: string;
  type: "stage_change" | "note" | "score" | "followup";
  message: string;
  at: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  action: string;
  dueAt: string;
  done: boolean;
  priority: Priority;
}

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  source: string;
  budget: BudgetLevel;
  isDecisionMaker: boolean;
  timelineWeeks: number;
  needDescription: string;
  stage: PipelineStageId;
  score: number;
  createdAt: string;
  updatedAt: string;
  stageChangedAt: string;
  notes: Note[];
  activities: Activity[];
  followUps: FollowUp[];
  qualification?: QualificationResult;
}

export interface LeadDraft {
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  source: string;
  budget: BudgetLevel;
  isDecisionMaker: boolean;
  timelineWeeks: number;
  needDescription: string;
}

export interface QualificationInput {
  budget: BudgetLevel;
  isDecisionMaker: boolean;
  timelineWeeks: number;
  needSignals: string[];
}

export interface QualificationResult {
  score: number;
  bucket: ScoreBucket;
  qualified: boolean;
  reasons: string[];
  suggestedStage: PipelineStageId;
  nextAction: string;
}

export interface AgentAction {
  action: string;
  priority: Priority;
  dueInDays: number;
  reason: string;
}

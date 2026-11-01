import { PipelineError } from "./errors";
import { canMove } from "./stages";
import type { FollowUp, Lead, LeadDraft, PipelineStageId, Priority, QualificationResult } from "../types";
import type { LeadStore } from "../storage/types";

let uid = 0;

function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}_${Date.now().toString(36)}_${uid.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** The single mutation path for leads. All stage/score/note/follow-up changes go through here. */
export class PipelineEngine {
  constructor(private readonly store: LeadStore) {}

  addLead(draft: LeadDraft): Lead {
    const at = nowIso();
    const lead: Lead = {
      ...draft,
      id: nextId("ld"),
      stage: "NEW_LEAD",
      score: 0,
      createdAt: at,
      updatedAt: at,
      stageChangedAt: at,
      notes: [],
      activities: [{ id: nextId("act"), type: "stage_change", message: "Lead created (NEW_LEAD)", at }],
      followUps: [],
    };
    this.store.save(lead);
    return lead;
  }

  getLead(id: string): Lead | undefined {
    return this.store.get(id);
  }

  listLeads(): Lead[] {
    return this.store.list();
  }

  moveLead(id: string, to: PipelineStageId, actor = "agent"): Lead {
    const lead = this.requireLead(id);
    const from = lead.stage;
    if (from === "WON") {
      throw new PipelineError("TERMINAL_STAGE", "Won deals are terminal and cannot be moved.");
    }
    if (!canMove(from, to)) {
      throw new PipelineError("INVALID_TRANSITION", `Cannot move a lead from ${from} to ${to}.`);
    }
    const at = nowIso();
    const updated: Lead = {
      ...lead,
      stage: to,
      updatedAt: at,
      stageChangedAt: at,
      activities: [
        ...lead.activities,
        { id: nextId("act"), type: "stage_change", message: `${from} → ${to} (by ${actor})`, at },
      ],
    };
    this.store.save(updated);
    return updated;
  }

  /** Convenience scorer without a full verdict (used by tests / analytics). */
  updateScore(id: string, score: number): Lead {
    const lead = this.requireLead(id);
    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    const at = nowIso();
    const updated: Lead = {
      ...lead,
      score: clamped,
      updatedAt: at,
      activities: [...lead.activities, { id: nextId("act"), type: "score", message: `Score updated to ${clamped}`, at }],
    };
    this.store.save(updated);
    return updated;
  }

  /** Persist a full agent qualification verdict (score + bucket + reasons + next action). */
  setVerdict(id: string, result: QualificationResult): Lead {
    const lead = this.requireLead(id);
    const at = nowIso();
    const updated: Lead = {
      ...lead,
      score: result.score,
      qualification: result,
      updatedAt: at,
      activities: [
        ...lead.activities,
        { id: nextId("act"), type: "score", message: `Agent qualified: ${result.bucket} (${result.score})`, at },
      ],
    };
    this.store.save(updated);
    return updated;
  }

  addNote(id: string, text: string, author = "user"): Lead {
    const lead = this.requireLead(id);
    const at = nowIso();
    const updated: Lead = {
      ...lead,
      updatedAt: at,
      notes: [...lead.notes, { id: nextId("nt"), text, author, at }],
      activities: [...lead.activities, { id: nextId("act"), type: "note", message: `Note added by ${author}`, at }],
    };
    this.store.save(updated);
    return updated;
  }

  addFollowUp(id: string, action: string, dueAt: string, priority: Priority): Lead {
    const lead = this.requireLead(id);
    const at = nowIso();
    const followUp: FollowUp = { id: nextId("fu"), leadId: id, action, dueAt, done: false, priority };
    const updated: Lead = {
      ...lead,
      updatedAt: at,
      followUps: [...lead.followUps, followUp],
      activities: [...lead.activities, { id: nextId("act"), type: "followup", message: `Follow-up scheduled: ${action}`, at }],
    };
    this.store.save(updated);
    return updated;
  }

  completeFollowUp(followUpId: string): Lead {
    for (const lead of this.store.list()) {
      const fu = lead.followUps.find((f) => f.id === followUpId);
      if (fu) {
        const updated: Lead = {
          ...lead,
          updatedAt: nowIso(),
          followUps: lead.followUps.map((f) => (f.id === followUpId ? { ...f, done: true } : f)),
        };
        this.store.save(updated);
        return updated;
      }
    }
    throw new PipelineError("LEAD_NOT_FOUND", `Follow-up ${followUpId} not found.`);
  }

  private requireLead(id: string): Lead {
    const lead = this.store.get(id);
    if (!lead) {
      throw new PipelineError("LEAD_NOT_FOUND", `Lead ${id} not found.`);
    }
    return lead;
  }
}

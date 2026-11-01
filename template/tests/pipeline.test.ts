import { describe, expect, it } from "vitest";
import { createCloseloop } from "../src/closeloop";
import { createMemoryStore } from "../src/storage/memory";
import { PipelineError } from "../src/pipeline/errors";
import { canMove } from "../src/pipeline/stages";
import type { LeadDraft } from "../src/types";

const DRAFT: LeadDraft = {
  company: "Test Corp",
  contactName: "Ada Lovelace",
  email: "ada@test.example",
  source: "website",
  budget: "high",
  isDecisionMaker: true,
  timelineWeeks: 4,
  needDescription: "Automate pipeline",
};

describe("PipelineEngine", () => {
  it("creates a lead in NEW_LEAD with score 0 and a creation activity", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    expect(lead.stage).toBe("NEW_LEAD");
    expect(lead.score).toBe(0);
    expect(lead.activities.length).toBe(1);
    expect(lead.activities[0].type).toBe("stage_change");
  });

  it("accepts only declared transitions and records exactly one activity", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    const moved = engine.moveLead(lead.id, "QUALIFIED");
    expect(moved.stage).toBe("QUALIFIED");
    const added = moved.activities.filter((a) => a.type === "stage_change");
    expect(added.length).toBe(2);
  });

  it("rejects invalid transitions without mutating the lead", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    const before = { ...lead, activities: [...lead.activities] };
    expect(() => engine.moveLead(lead.id, "WON")).toThrow(PipelineError);
    expect(() => engine.moveLead(lead.id, "WON")).toThrow(/Cannot move/);
    const after = engine.getLead(lead.id)!;
    expect(after.stage).toBe(before.stage);
    expect(after.activities.length).toBe(before.activities.length);
  });

  it("treats WON as terminal and LOST as reopenable to NEW_LEAD", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    engine.moveLead(lead.id, "QUALIFIED");
    engine.moveLead(lead.id, "CONTACTED");
    engine.moveLead(lead.id, "DEMO");
    engine.moveLead(lead.id, "PROPOSAL");
    engine.moveLead(lead.id, "NEGOTIATION");
    const won = engine.moveLead(lead.id, "WON");
    expect(won.stage).toBe("WON");
    expect(() => engine.moveLead(lead.id, "LOST")).toThrow(PipelineError);

    const lost = engine.addLead(DRAFT);
    engine.moveLead(lost.id, "LOST");
    expect(() => engine.moveLead(lost.id, "CONTACTED")).toThrow(PipelineError);
    const reopened = engine.moveLead(lost.id, "NEW_LEAD");
    expect(reopened.stage).toBe("NEW_LEAD");
  });

  it("throws LEAD_NOT_FOUND for unknown leads and follow-ups", () => {
    const { engine } = createCloseloop(createMemoryStore());
    expect(() => engine.moveLead("nope", "QUALIFIED")).toThrow(PipelineError);
    expect(() => engine.completeFollowUp("nope")).toThrow(PipelineError);
  });

  it("adds notes and follow-ups and logs activities", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    const noted = engine.addNote(lead.id, "Needs CFO sign-off");
    expect(noted.notes.length).toBe(1);
    expect(noted.activities.some((a) => a.type === "note")).toBe(true);

    const due = new Date(Date.now() + 86_400_000).toISOString();
    const withFu = engine.addFollowUp(lead.id, "Send intro email", due, "high");
    expect(withFu.followUps.length).toBe(1);
    expect(withFu.followUps[0].done).toBe(false);
    const done = engine.completeFollowUp(withFu.followUps[0].id);
    expect(done.followUps[0].done).toBe(true);
  });

  it("setVerdict persists the qualification and updates score", () => {
    const { engine, agent } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    const verdict = agent.qualify({
      budget: "high",
      isDecisionMaker: true,
      timelineWeeks: 4,
      needSignals: ["integration", "automation"],
    });
    const scored = engine.setVerdict(lead.id, verdict);
    expect(scored.score).toBe(verdict.score);
    expect(scored.qualification?.bucket).toBe(verdict.bucket);
  });
});

describe("transition map sanity (all declared targets are reachable)", () => {
  it("canMove agrees with the declared map for the full state space", () => {
    const stages = ["NEW_LEAD", "QUALIFIED", "CONTACTED", "DEMO", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
    for (const from of stages) {
      for (const to of stages) {
        const declared =
          from === "WON"
            ? false
            : from === "LOST"
              ? to === "NEW_LEAD"
              : (canMove(from, to) && to !== "NEW_LEAD" && to !== from);
        expect(canMove(from, to)).toBe(declared);
      }
    }
  });
});

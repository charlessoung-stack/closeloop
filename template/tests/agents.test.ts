import { describe, expect, it } from "vitest";
import { qualify } from "../src/agents/qualifier";
import { suggestNextAction } from "../src/agents/nextAction";
import { createCloseloop } from "../src/closeloop";
import { createMemoryStore } from "../src/storage/memory";
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

describe("Qualifier agent", () => {
  it("qualifies a hot lead and suggests QUALIFIED", () => {
    const r = qualify({ budget: "high", isDecisionMaker: true, timelineWeeks: 4, needSignals: ["automation"] });
    expect(r.score).toBeGreaterThanOrEqual(70);
    expect(r.bucket).toBe("hot");
    expect(r.qualified).toBe(true);
    expect(r.suggestedStage).toBe("QUALIFIED");
    expect(r.nextAction).toContain("24h");
  });

  it("does not qualify a cold non-decision-maker", () => {
    const r = qualify({ budget: "low", isDecisionMaker: false, timelineWeeks: 40, needSignals: [] });
    expect(r.qualified).toBe(false);
    expect(r.suggestedStage).toBe("NEW_LEAD");
    expect(r.nextAction).toContain("nurture");
  });
});

describe("NextAction agent", () => {
  it("returns exactly one valid action for every stage", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const stages = ["NEW_LEAD", "QUALIFIED", "CONTACTED", "DEMO", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
    for (const stage of stages) {
      const lead = { ...engine.addLead(DRAFT), stage };
      const a = suggestNextAction(lead);
      expect(a.action.length).toBeGreaterThan(0);
      expect(["low", "mid", "high"]).toContain(a.priority);
      expect(a.dueInDays).toBeGreaterThanOrEqual(1);
      expect(a.dueInDays).toBeLessThanOrEqual(90);
    }
  });

  it("flags when an open follow-up exists", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const lead = engine.addLead(DRAFT);
    const due = new Date(Date.now() + 86_400_000).toISOString();
    const withFu = engine.addFollowUp(lead.id, "Call back", due, "high");
    const a = suggestNextAction(withFu);
    expect(a.reason).toContain("open follow-up");
  });
});

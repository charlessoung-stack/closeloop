import { describe, expect, it } from "vitest";
import { computeAnalytics } from "../src/analytics";
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

describe("computeAnalytics", () => {
  it("computes win rate and conversion from the live set", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const won = engine.addLead(DRAFT);
    engine.moveLead(won.id, "QUALIFIED");
    engine.moveLead(won.id, "CONTACTED");
    engine.moveLead(won.id, "DEMO");
    engine.moveLead(won.id, "PROPOSAL");
    engine.moveLead(won.id, "NEGOTIATION");
    engine.moveLead(won.id, "WON");

    const lost = engine.addLead(DRAFT);
    engine.moveLead(lost.id, "LOST");

    const open = engine.addLead(DRAFT);

    const a = computeAnalytics(engine.listLeads());
    expect(a.total).toBe(3);
    expect(a.winRate).toBe(50);
    expect(a.conversionToWon).toBeCloseTo(33.3, 0);
    expect(a.byStage.find((s) => s.stage === "WON")?.count).toBe(1);
    expect(a.byStage.find((s) => s.stage === "LOST")?.count).toBe(1);
    expect(a.byStage.find((s) => s.stage === "NEW_LEAD")?.count).toBe(1);
  });

  it("is safe on an empty set", () => {
    const a = computeAnalytics([]);
    expect(a.total).toBe(0);
    expect(a.winRate).toBe(0);
    expect(a.avgDaysInCurrentStage).toBe(0);
  });
});

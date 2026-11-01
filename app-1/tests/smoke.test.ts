import { describe, expect, it } from "vitest";
import { createCloseloop, createMemoryStore } from "@closeloop/core";

describe("app-1 smoke: LeadGen round trip", () => {
  it("capture → qualify → verdict → send to pipeline works end to end", () => {
    const { engine, agent } = createCloseloop(createMemoryStore());
    const lead = engine.addLead({
      company: "Acme Widgets",
      contactName: "Sam Rivera",
      email: "sam@acmewidgets.example",
      source: "website",
      budget: "high",
      isDecisionMaker: true,
      timelineWeeks: 3,
      needDescription: "Automate inbound",
    });
    const verdict = agent.qualify({
      budget: "high",
      isDecisionMaker: true,
      timelineWeeks: 3,
      needSignals: ["automation"],
    });
    engine.setVerdict(lead.id, verdict);
    const scored = engine.getLead(lead.id)!;
    expect(scored.score).toBeGreaterThanOrEqual(70);
    expect(scored.qualification?.nextAction).toContain("24h");
    const moved = engine.moveLead(lead.id, "QUALIFIED");
    expect(moved.stage).toBe("QUALIFIED");
  });
});

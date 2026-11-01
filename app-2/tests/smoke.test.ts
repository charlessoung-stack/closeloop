import { describe, expect, it } from "vitest";
import { computeAnalytics, createCloseloop, createMemoryStore, createSeedLeads } from "@closeloop/core";

describe("app-2 smoke: pipeline round trip", () => {
  it("board moves are engine-guarded and analytics derive from the live set", () => {
    const { engine } = createCloseloop(createMemoryStore(createSeedLeads()));
    const open = engine.listLeads().find((l) => l.stage === "NEW_LEAD")!;
    expect(open).toBeDefined();
    const moved = engine.moveLead(open.id, "QUALIFIED");
    expect(moved.stage).toBe("QUALIFIED");

    const a = computeAnalytics(engine.listLeads());
    expect(a.total).toBeGreaterThanOrEqual(7);
    expect(a.byStage.length).toBe(8);
    expect(a.winRate).toBeGreaterThan(0);
  });
});

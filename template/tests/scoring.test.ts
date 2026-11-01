import { describe, expect, it } from "vitest";
import { bucket, scoreLead } from "../src/agents/scoring";

describe("scoreLead", () => {
  it("scores a strong lead at 100 (clamped) and a weak one at 15", () => {
    const strong = scoreLead({ budget: "high", isDecisionMaker: true, timelineWeeks: 2, needSignals: ["a", "b", "c"] });
    expect(strong.score).toBe(100);

    const weak = scoreLead({ budget: "low", isDecisionMaker: false, timelineWeeks: 40, needSignals: [] });
    expect(weak.score).toBe(15);
  });

  it("returns at least one reason per contributing signal", () => {
    const r = scoreLead({ budget: "mid", isDecisionMaker: true, timelineWeeks: 8, needSignals: ["compliance"] });
    expect(r.reasons.length).toBeGreaterThanOrEqual(4);
    expect(r.reasons.some((x) => x.includes("Budget"))).toBe(true);
    expect(r.reasons.some((x) => x.includes("Decision maker"))).toBe(true);
    expect(r.reasons.some((x) => x.includes("Timeline"))).toBe(true);
    expect(r.reasons.some((x) => x.includes("Need signals"))).toBe(true);
  });
});

describe("bucket boundaries (exact)", () => {
  it("cold < 40, warm 40–69, hot ≥ 70", () => {
    expect(bucket(0)).toBe("cold");
    expect(bucket(39)).toBe("cold");
    expect(bucket(40)).toBe("warm");
    expect(bucket(69)).toBe("warm");
    expect(bucket(70)).toBe("hot");
    expect(bucket(100)).toBe("hot");
  });
});

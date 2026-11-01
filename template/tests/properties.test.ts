import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { bucket, scoreLead } from "../src/agents/scoring";
import { suggestNextAction } from "../src/agents/nextAction";
import { canMove, STAGES } from "../src/pipeline/stages";
import { createCloseloop } from "../src/closeloop";
import { createMemoryStore } from "../src/storage/memory";
import { PipelineError } from "../src/pipeline/errors";
import type { LeadDraft, PipelineStageId, QualificationInput } from "../src/types";

const STAGE_IDS: PipelineStageId[] = STAGES.map((s) => s.id);
const SIGNALS = ["automation", "integration", "compliance", "cost", "scale"];

const inputArb: fc.Arbitrary<QualificationInput> = fc.record({
  budget: fc.constantFrom("low", "mid", "high"),
  isDecisionMaker: fc.boolean(),
  timelineWeeks: fc.integer({ min: 1, max: 52 }),
  needSignals: fc.array(fc.constantFrom(...SIGNALS), { maxLength: 4 }),
});

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

/** P1 — score stays in [0,100] and bucket is consistent for arbitrary inputs. */
describe("PBT P1: scoring invariants", () => {
  it("score ∈ [0,100] and bucket(score) consistent", () => {
    fc.assert(
      fc.property(inputArb, (input) => {
        const { score } = scoreLead(input);
        if (score < 0 || score > 100) return false;
        const b = bucket(score);
        return (
          (score < 40 && b === "cold") ||
          (score >= 40 && score < 70 && b === "warm") ||
          (score >= 70 && b === "hot")
        );
      }),
      { numRuns: 300 }
    );
  });
});

/** P2 — a move succeeds iff declared by the transition map; failure never mutates. */
describe("PBT P2: transition guard", () => {
  it("move succeeds iff canMove(from, to); failure leaves the lead untouched", () => {
    const seed = createCloseloop(createMemoryStore()).engine.addLead(DRAFT);
    fc.assert(
      fc.property(
        fc.constantFrom(...STAGE_IDS),
        fc.constantFrom(...STAGE_IDS),
        (from, to) => {
          // Fresh store + engine per run so the constructed lead is the only one present.
          const store = createMemoryStore();
          const { engine } = createCloseloop(store);
          const lead = { ...seed, id: `pb_${from}_${to}`, stage: from, activities: [...seed.activities] };
          store.save(lead);
          const beforeActivities = lead.activities.length;
          try {
            const moved = engine.moveLead(lead.id, to);
            if (!canMove(from, to)) return false;
            return (
              moved.stage === to &&
              moved.activities.filter((a) => a.type === "stage_change").length === beforeActivities + 1
            );
          } catch (err) {
            if (canMove(from, to)) return false;
            if (!(err instanceof PipelineError)) return false;
            return err.code === "INVALID_TRANSITION" || err.code === "TERMINAL_STAGE";
          }
        }
      ),
      { numRuns: 300 }
    );
  });
});

/** P3 — next-action agent always returns a well-formed recommendation. */
describe("PBT P3: next-action shape", () => {
  it("non-empty action, valid priority, dueInDays ∈ [1,90]", () => {
    const { engine } = createCloseloop(createMemoryStore());
    const seed = engine.addLead(DRAFT);
    fc.assert(
      fc.property(
        fc.constantFrom(...STAGE_IDS),
        fc.array(fc.boolean()),
        (stage, followUpFlags) => {
          const lead = {
            ...seed,
            id: `pa_${stage}`,
            stage,
            followUps: followUpFlags.map((done, i) => ({
              id: `fu_${i}`,
              leadId: `pa_${stage}`,
              action: "x",
              dueAt: new Date(Date.now() + 86_400_000).toISOString(),
              done,
              priority: "high" as const,
            })),
          };
          const a = suggestNextAction(lead);
          return (
            a.action.length > 0 &&
            (a.priority === "low" || a.priority === "mid" || a.priority === "high") &&
            a.dueInDays >= 1 &&
            a.dueInDays <= 90
          );
        }
      ),
      { numRuns: 300 }
    );
  });
});

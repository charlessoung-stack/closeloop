import type { PipelineStageId, QualificationInput, QualificationResult } from "../types";
import { bucket, scoreLead } from "./scoring";

/**
 * Lead qualification agent. Pure function: signals in → verdict out.
 * `qualified` gates whether the lead should be worked by sales now.
 */
export function qualify(input: QualificationInput): QualificationResult {
  const { score, reasons } = scoreLead(input);
  const qualified = score >= 55 && input.isDecisionMaker;
  const suggestedStage: PipelineStageId = qualified ? "QUALIFIED" : "NEW_LEAD";

  let nextAction: string;
  if (score >= 70) {
    nextAction = "Book a demo call within 24h";
  } else if (score >= 40) {
    nextAction = "Send a tailored intro email today";
  } else {
    nextAction = "Add to nurture sequence (weekly value email)";
  }

  return { score, bucket: bucket(score), qualified, reasons, suggestedStage, nextAction };
}

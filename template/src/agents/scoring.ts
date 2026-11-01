import type { QualificationInput, ScoreBucket } from "../types";

export interface ScoreResult {
  score: number;
  reasons: string[];
}

/**
 * BANT-style heuristic scoring, deterministic and key-free.
 * Weights: budget 30/20/10 · decision maker 25 · timeline 30/20/10/5 · need signals ≤15.
 */
export function scoreLead(input: QualificationInput): ScoreResult {
  const reasons: string[] = [];
  let score = 0;

  const budgetPoints = input.budget === "high" ? 30 : input.budget === "mid" ? 20 : 10;
  score += budgetPoints;
  reasons.push(`Budget: ${input.budget} (+${budgetPoints})`);

  if (input.isDecisionMaker) {
    score += 25;
    reasons.push("Decision maker confirmed (+25)");
  } else {
    reasons.push("Decision maker not confirmed");
  }

  const tl = input.timelineWeeks;
  const tlPoints = tl <= 4 ? 30 : tl <= 12 ? 20 : tl <= 26 ? 10 : 5;
  score += tlPoints;
  reasons.push(`Timeline: ${tl} weeks (+${tlPoints})`);

  const signals = input.needSignals.slice(0, 3);
  if (signals.length > 0) {
    const pts = signals.length * 5;
    score += pts;
    reasons.push(`Need signals (${signals.join(", ")}): +${pts}`);
  } else {
    reasons.push("No explicit need signals yet");
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function bucket(score: number): ScoreBucket {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

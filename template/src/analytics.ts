import type { Lead, PipelineStageId } from "./types";
import { STAGES } from "./pipeline/stages";

export interface StageStat {
  stage: PipelineStageId;
  label: string;
  count: number;
  avgScore: number;
}

export interface Analytics {
  total: number;
  byStage: StageStat[];
  avgScore: number;
  conversionToWon: number;
  winRate: number;
  lostRate: number;
  avgDaysInCurrentStage: number;
}

function daysBetween(fromIso: string, toIso: string): number {
  return Math.max(0, (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 86_400_000);
}

/** All analytics are derived live from the lead set — never hardcoded. */
export function computeAnalytics(leads: Lead[], now: Date = new Date()): Analytics {
  const total = leads.length;

  const byStage: StageStat[] = STAGES.map((s) => {
    const inStage = leads.filter((l) => l.stage === s.id);
    const avgScore = inStage.length ? inStage.reduce((a, l) => a + l.score, 0) / inStage.length : 0;
    return { stage: s.id, label: s.label, count: inStage.length, avgScore: Math.round(avgScore * 10) / 10 };
  });

  const avgScore = total ? leads.reduce((a, l) => a + l.score, 0) / total : 0;
  const won = leads.filter((l) => l.stage === "WON").length;
  const lost = leads.filter((l) => l.stage === "LOST").length;
  const winRate = won + lost > 0 ? (won / (won + lost)) * 100 : 0;
  const conversionToWon = total > 0 ? (won / total) * 100 : 0;

  const stageAges = leads.map((l) => daysBetween(l.stageChangedAt, now.toISOString()));
  const avgDaysInCurrentStage = stageAges.length ? stageAges.reduce((a, b) => a + b, 0) / stageAges.length : 0;

  return {
    total,
    byStage,
    avgScore: Math.round(avgScore * 10) / 10,
    conversionToWon: Math.round(conversionToWon * 10) / 10,
    winRate: Math.round(winRate * 10) / 10,
    lostRate: Math.round((100 - winRate) * 10) / 10,
    avgDaysInCurrentStage: Math.round(avgDaysInCurrentStage * 10) / 10,
  };
}

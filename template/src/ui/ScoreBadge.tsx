import type { CSSProperties } from "react";
import { bucket } from "../agents/scoring";
import type { ScoreBucket } from "../types";

const COLORS: Record<ScoreBucket, string> = {
  hot: "#f43f5e",
  warm: "#f59e0b",
  cold: "#64748b",
};

export function ScoreBadge({ score }: { score: number }) {
  const b = bucket(score);
  return (
    <span className="score-badge" style={{ "--score-color": COLORS[b] } as CSSProperties}>
      {score} · {b}
    </span>
  );
}

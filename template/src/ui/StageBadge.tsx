import type { CSSProperties } from "react";
import { stageColor, stageLabel } from "../pipeline/stages";
import type { PipelineStageId } from "../types";

export function StageBadge({ stage }: { stage: PipelineStageId }) {
  return (
    <span className="stage-badge" style={{ "--stage-color": stageColor(stage) } as CSSProperties}>
      {stageLabel(stage)}
    </span>
  );
}

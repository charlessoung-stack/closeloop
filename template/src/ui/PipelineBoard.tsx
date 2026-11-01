import type { CSSProperties } from "react";
import type { Lead } from "../types";
import { canMove, STAGES } from "../pipeline/stages";
import { LeadCard } from "./LeadCard";

export function PipelineBoard({
  leads,
  onMove,
  onSelectLead,
}: {
  leads: Lead[];
  onMove: (leadId: string, to: string) => void;
  onSelectLead?: (lead: Lead) => void;
}) {
  return (
    <div className="board">
      {STAGES.map((s) => {
        const inStage = leads.filter((l) => l.stage === s.id);
        return (
          <section key={s.id} className="board-col" style={{ "--col-color": s.color } as CSSProperties}>
            <h3 className="board-col-title">
              {s.label} <span className="count">{inStage.length}</span>
            </h3>
            {inStage.map((l) => (
              <div key={l.id} className="board-item">
                <LeadCard lead={l} onSelect={onSelectLead ? () => onSelectLead(l) : undefined} />
                <div className="move-row">
                  {STAGES.filter((t) => canMove(l.stage, t.id)).map((t) => (
                    <button
                      key={t.id}
                      className="move-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMove(l.id, t.id);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {inStage.length === 0 && <p className="board-empty">—</p>}
          </section>
        );
      })}
    </div>
  );
}

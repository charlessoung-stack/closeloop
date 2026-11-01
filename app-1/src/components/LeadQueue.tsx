import { useState } from "react";
import {
  PipelineError,
  ScoreBadge,
  StageBadge,
  suggestNextAction,
  type Closeloop,
  type Lead,
} from "@closeloop/core";

export function LeadQueue({
  closeloop,
  leads,
  onDataChanged,
}: {
  closeloop: Closeloop;
  leads: Lead[];
  onDataChanged: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const sorted = [...leads].sort((a, b) => b.score - a.score);

  const sendToPipeline = (id: string) => {
    try {
      closeloop.engine.moveLead(id, "QUALIFIED");
      setError(null);
      onDataChanged();
    } catch (err) {
      setError(err instanceof PipelineError ? err.message : String(err));
    }
  };

  return (
    <div className="queue">
      <h2 className="section-title">Scored lead queue</h2>
      {error && <div className="banner-error">{error}</div>}
      <table className="queue-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Source</th>
            <th>Score</th>
            <th>Top reason</th>
            <th>Next action</th>
            <th>Stage</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => (
            <tr key={l.id}>
              <td>
                <strong>{l.company}</strong>
              </td>
              <td>
                {l.contactName}
                <div className="muted small">{l.email}</div>
              </td>
              <td>{l.source}</td>
              <td>
                <ScoreBadge score={l.score} />
              </td>
              <td className="muted small">{l.qualification?.reasons[0] ?? "—"}</td>
              <td className="muted small">{suggestNextAction(l).action}</td>
              <td>
                <StageBadge stage={l.stage} />
              </td>
              <td>
                {l.stage === "NEW_LEAD" && (
                  <button className="mini-btn" onClick={() => sendToPipeline(l.id)}>
                    Send to pipeline
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">
        Qualified leads land in <em>app-2 (Pipeline Agent)</em> through the shared store.
      </p>
    </div>
  );
}

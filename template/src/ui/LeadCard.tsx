import type { Lead } from "../types";
import { ScoreBadge } from "./ScoreBadge";
import { StageBadge } from "./StageBadge";

export function LeadCard({ lead, onSelect }: { lead: Lead; onSelect?: () => void }) {
  const hasOpenFollowUp = lead.followUps.some((f) => !f.done);
  return (
    <article className="lead-card" onClick={onSelect} role="button" tabIndex={0}>
      <header className="lead-card-head">
        <strong>{lead.company}</strong>
        <ScoreBadge score={lead.score} />
      </header>
      <div className="lead-card-meta">
        {lead.contactName} · {lead.email}
      </div>
      <footer className="lead-card-foot">
        <StageBadge stage={lead.stage} />
        {hasOpenFollowUp && <span className="pill">⏳ follow-up</span>}
      </footer>
    </article>
  );
}

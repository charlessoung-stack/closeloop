import {
  AgentSuggestion,
  suggestNextAction,
  type Closeloop,
  type Lead,
} from "@closeloop/core";

const PRIORITY_ORDER: Record<string, number> = { high: 0, mid: 1, low: 2 };

export function NextActions({
  closeloop,
  leads,
  onDataChanged,
}: {
  closeloop: Closeloop;
  leads: Lead[];
  onDataChanged: () => void;
}) {
  const rows = leads
    .map((lead) => ({ lead, suggestion: suggestNextAction(lead) }))
    .sort((a, b) => PRIORITY_ORDER[a.suggestion.priority] - PRIORITY_ORDER[b.suggestion.priority]);

  const schedule = (lead: Lead) => {
    const a = suggestNextAction(lead);
    const due = new Date(Date.now() + a.dueInDays * 86_400_000).toISOString();
    closeloop.engine.addFollowUp(lead.id, a.action, due, a.priority);
    onDataChanged();
  };

  return (
    <div className="actions">
      <h2 className="section-title">Next-best-action queue</h2>
      <p className="muted">
        The agent picks one action per lead from its stage playbook — sorted by priority.
      </p>
      <div className="action-list">
        {rows.map(({ lead, suggestion }) => (
          <div key={lead.id} className="action-row">
            <div className="action-company">
              <strong>{lead.company}</strong>
              <span className="muted small">{lead.stage}</span>
            </div>
            <AgentSuggestion suggestion={suggestion} />
            <button className="mini-btn" onClick={() => schedule(lead)}>
              Schedule follow-up
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

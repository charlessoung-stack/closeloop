import type { AgentAction } from "../types";

export function AgentSuggestion({ suggestion }: { suggestion: AgentAction }) {
  return (
    <div className="agent-suggestion">
      <span className="agent-avatar" aria-hidden>
        ◆
      </span>
      <div>
        <div className="agent-action">{suggestion.action}</div>
        <div className="agent-meta">
          priority {suggestion.priority} · due in {suggestion.dueInDays}d
        </div>
        <div className="agent-reason">{suggestion.reason}</div>
      </div>
    </div>
  );
}

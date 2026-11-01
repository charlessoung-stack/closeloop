import { useState } from "react";
import {
  AgentSuggestion,
  FollowUpList,
  PipelineBoard,
  PipelineError,
  ScoreBadge,
  StageBadge,
  suggestNextAction,
  type Closeloop,
  type Lead,
  type PipelineStageId,
} from "@closeloop/core";

export function PipelineView({
  closeloop,
  leads,
  onDataChanged,
}: {
  closeloop: Closeloop;
  leads: Lead[];
  onDataChanged: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const selected = selectedId ? leads.find((l) => l.id === selectedId) ?? null : null;
  const suggestion = selected ? suggestNextAction(selected) : null;

  const move = (id: string, to: string) => {
    try {
      closeloop.engine.moveLead(id, to as PipelineStageId);
      setError(null);
      onDataChanged();
    } catch (err) {
      setError(err instanceof PipelineError ? err.message : String(err));
    }
  };

  const addNote = () => {
    if (!selected || !noteText.trim()) return;
    closeloop.engine.addNote(selected.id, noteText.trim());
    setNoteText("");
    onDataChanged();
  };

  const scheduleSuggestion = () => {
    if (!selected || !suggestion) return;
    const due = new Date(Date.now() + suggestion.dueInDays * 86_400_000).toISOString();
    closeloop.engine.addFollowUp(selected.id, suggestion.action, due, suggestion.priority);
    onDataChanged();
  };

  const complete = (fuId: string) => {
    closeloop.engine.completeFollowUp(fuId);
    onDataChanged();
  };

  return (
    <div className="pipeline">
      {error && <div className="banner-error">{error}</div>}
      <h2 className="section-title">Pipeline board</h2>
      <PipelineBoard leads={leads} onMove={move} onSelectLead={(l) => setSelectedId(l.id)} />

      {selected && suggestion && (
        <aside className="drawer">
          <header className="drawer-head">
            <div>
              <strong>{selected.company}</strong>
              <div className="muted small">
                {selected.contactName} · {selected.email} · {selected.source}
              </div>
            </div>
            <div className="drawer-badges">
              <ScoreBadge score={selected.score} />
              <StageBadge stage={selected.stage} />
            </div>
          </header>

          <div className="drawer-section">
            <h4>Agent recommendation</h4>
            <AgentSuggestion suggestion={suggestion} />
            <button className="primary-btn small-btn" onClick={scheduleSuggestion}>
              Schedule as follow-up
            </button>
          </div>

          <div className="drawer-section">
            <h4>Notes</h4>
            <ul className="notes">
              {selected.notes.length === 0 && <li className="muted">No notes yet.</li>}
              {selected.notes.map((n) => (
                <li key={n.id}>
                  <span className="muted small">{n.author} · {new Date(n.at).toLocaleDateString()}</span>
                  <div>{n.text}</div>
                </li>
              ))}
            </ul>
            <div className="note-row">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note…"
                onKeyDown={(e) => e.key === "Enter" && addNote()}
              />
              <button className="mini-btn" onClick={addNote}>
                Add
              </button>
            </div>
          </div>

          <div className="drawer-section">
            <h4>Follow-ups</h4>
            <FollowUpList items={selected.followUps} onComplete={complete} />
          </div>

          <div className="drawer-section">
            <h4>Activity log</h4>
            <ul className="activity">
              {[...selected.activities].reverse().map((a) => (
                <li key={a.id} className="muted small">
                  {new Date(a.at).toLocaleString()} — {a.message}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

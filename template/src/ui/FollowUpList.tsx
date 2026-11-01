import type { FollowUp } from "../types";

export function FollowUpList({
  items,
  onComplete,
}: {
  items: FollowUp[];
  onComplete?: (id: string) => void;
}) {
  const sorted = [...items].sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  if (sorted.length === 0) return <p className="muted">No follow-ups yet.</p>;
  return (
    <ul className="followup-list">
      {sorted.map((f) => (
        <li key={f.id} className={`followup-item ${f.done ? "done" : ""}`}>
          <span className={`priority-dot ${f.priority}`} />
          <span className="followup-action">{f.action}</span>
          <time className="followup-due">{new Date(f.dueAt).toLocaleDateString()}</time>
          {!f.done && onComplete && (
            <button className="mini-btn" onClick={() => onComplete(f.id)}>
              done
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

import {
  FollowUpList,
  type Closeloop,
  type Lead,
} from "@closeloop/core";

export function FollowUpsView({
  closeloop,
  leads,
  onDataChanged,
}: {
  closeloop: Closeloop;
  leads: Lead[];
  onDataChanged: () => void;
}) {
  const withOpen = leads.filter((l) => l.followUps.some((f) => !f.done));
  const allDone = leads.filter((l) => l.followUps.length > 0 && l.followUps.every((f) => f.done));

  const complete = (fuId: string) => {
    closeloop.engine.completeFollowUp(fuId);
    onDataChanged();
  };

  return (
    <div className="followups">
      <h2 className="section-title">Follow-ups</h2>
      {withOpen.length === 0 && <p className="muted">No open follow-ups. Schedule one from Next Actions.</p>}

      {withOpen.map((l) => (
        <div key={l.id} className="followup-group">
          <h4>{l.company}</h4>
          <FollowUpList items={l.followUps} onComplete={complete} />
        </div>
      ))}

      {allDone.length > 0 && (
        <details className="done-block">
          <summary className="muted">Completed ({allDone.length})</summary>
          {allDone.map((l) => (
            <FollowUpList key={l.id} items={l.followUps} />
          ))}
        </details>
      )}
    </div>
  );
}

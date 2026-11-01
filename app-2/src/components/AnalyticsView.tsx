import {
  computeAnalytics,
  stageColor,
  type Lead,
} from "@closeloop/core";

export function AnalyticsView({ leads }: { leads: Lead[] }) {
  const a = computeAnalytics(leads);
  const maxCount = Math.max(1, ...a.byStage.map((s) => s.count));

  return (
    <div className="analytics">
      <h2 className="section-title">Pipeline analytics</h2>
      <div className="metric-grid">
        <div className="metric">
          <div className="metric-value">{a.total}</div>
          <div className="metric-label">total leads</div>
        </div>
        <div className="metric">
          <div className="metric-value">{a.avgScore}</div>
          <div className="metric-label">avg score</div>
        </div>
        <div className="metric">
          <div className="metric-value">{a.conversionToWon}%</div>
          <div className="metric-label">NEW_LEAD → WON</div>
        </div>
        <div className="metric">
          <div className="metric-value">{a.winRate}%</div>
          <div className="metric-label">win rate</div>
        </div>
        <div className="metric">
          <div className="metric-value">{a.avgDaysInCurrentStage}d</div>
          <div className="metric-label">avg time in stage</div>
        </div>
      </div>

      <h3 className="section-title sub">Leads per stage</h3>
      <div className="bars">
        {a.byStage.map((s) => (
          <div key={s.stage} className="bar-row">
            <span className="bar-label">{s.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(s.count / maxCount) * 100}%`, background: stageColor(s.stage) }}
              />
            </div>
            <span className="bar-count">{s.count}</span>
            <span className="bar-score muted small">avg {s.avgScore}</span>
          </div>
        ))}
      </div>
      <p className="muted">All metrics are computed live from the lead set.</p>
    </div>
  );
}

import { useCallback, useState } from "react";
import {
  createCloseloop,
  createLocalStorageStore,
  createSeedLeads,
  seedIfEmpty,
  type Closeloop,
  type Lead,
} from "@closeloop/core";
import { PipelineView } from "./components/PipelineView";
import { NextActions } from "./components/NextActions";
import { FollowUpsView } from "./components/FollowUpsView";
import { AnalyticsView } from "./components/AnalyticsView";

type Tab = "pipeline" | "actions" | "followups" | "analytics";

export function App() {
  const [closeloop] = useState<Closeloop>(() => {
    const store = createLocalStorageStore();
    seedIfEmpty(store, createSeedLeads());
    return createCloseloop(store);
  });
  const [tab, setTab] = useState<Tab>("pipeline");
  const [leads, setLeads] = useState<Lead[]>(() => closeloop.engine.listLeads());

  const refresh = useCallback(() => {
    setLeads([...closeloop.engine.listLeads()]);
  }, [closeloop]);

  const openFollowUps = leads.reduce((n, l) => n + l.followUps.filter((f) => !f.done).length, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">◈</span> Closeloop <span className="brand-sub">Pipeline Agent</span>
        </div>
        <nav className="tabs">
          <button className={tab === "pipeline" ? "tab active" : "tab"} onClick={() => setTab("pipeline")}>
            Pipeline <span className="count">{leads.length}</span>
          </button>
          <button className={tab === "actions" ? "tab active" : "tab"} onClick={() => setTab("actions")}>
            Next Actions
          </button>
          <button className={tab === "followups" ? "tab active" : "tab"} onClick={() => setTab("followups")}>
            Follow-ups <span className="count">{openFollowUps}</span>
          </button>
          <button className={tab === "analytics" ? "tab active" : "tab"} onClick={() => setTab("analytics")}>
            Analytics
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "pipeline" && <PipelineView closeloop={closeloop} leads={leads} onDataChanged={refresh} />}
        {tab === "actions" && <NextActions closeloop={closeloop} leads={leads} onDataChanged={refresh} />}
        {tab === "followups" && <FollowUpsView closeloop={closeloop} leads={leads} onDataChanged={refresh} />}
        {tab === "analytics" && <AnalyticsView leads={leads} />}
      </main>

      <footer className="app-footer">heuristic agent mode · zero API keys · data in localStorage</footer>
    </div>
  );
}

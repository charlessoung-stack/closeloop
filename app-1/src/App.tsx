import { useCallback, useState } from "react";
import {
  createCloseloop,
  createLocalStorageStore,
  createSeedLeads,
  seedIfEmpty,
  type Closeloop,
  type Lead,
} from "@closeloop/core";
import { LandingPage } from "./components/LandingPage";
import { LeadQueue } from "./components/LeadQueue";

type Tab = "landing" | "queue";

export function App() {
  const [closeloop] = useState<Closeloop>(() => {
    const store = createLocalStorageStore();
    seedIfEmpty(store, createSeedLeads());
    return createCloseloop(store);
  });
  const [tab, setTab] = useState<Tab>("landing");
  const [leads, setLeads] = useState<Lead[]>(() => closeloop.engine.listLeads());

  const refresh = useCallback(() => {
    setLeads([...closeloop.engine.listLeads()]);
  }, [closeloop]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">◈</span> Closeloop <span className="brand-sub">LeadGen Agent</span>
        </div>
        <nav className="tabs">
          <button className={tab === "landing" ? "tab active" : "tab"} onClick={() => setTab("landing")}>
            Landing <span className="count">{leads.length}</span>
          </button>
          <button className={tab === "queue" ? "tab active" : "tab"} onClick={() => setTab("queue")}>
            Lead Queue <span className="count">{leads.filter((l) => l.stage === "NEW_LEAD" || l.stage === "QUALIFIED").length}</span>
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "landing" ? <LandingPage closeloop={closeloop} onDataChanged={refresh} /> : <LeadQueue closeloop={closeloop} leads={leads} onDataChanged={refresh} />}
      </main>

      <footer className="app-footer">heuristic agent mode · zero API keys · data in localStorage</footer>
    </div>
  );
}

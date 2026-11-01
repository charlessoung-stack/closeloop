import { PipelineEngine } from "./pipeline/engine";
import type { LeadStore } from "./storage/types";
import { createMemoryStore } from "./storage/memory";
import { heuristicAdapter, type AgentAdapter } from "./agents/llmAdapter";

export interface Closeloop {
  engine: PipelineEngine;
  store: LeadStore;
  agent: AgentAdapter;
}

/** Convenience factory: one engine + store + agent per app. */
export function createCloseloop(store?: LeadStore, agent: AgentAdapter = heuristicAdapter): Closeloop {
  const resolved = store ?? createMemoryStore();
  return { engine: new PipelineEngine(resolved), store: resolved, agent };
}

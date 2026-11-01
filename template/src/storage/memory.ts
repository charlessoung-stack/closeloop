import type { Lead } from "../types";
import type { LeadStore } from "./types";

export function createMemoryStore(seed: Lead[] = []): LeadStore {
  const leads = new Map<string, Lead>(seed.map((l) => [l.id, l]));
  return {
    list: () => Array.from(leads.values()),
    get: (id) => leads.get(id),
    save: (lead) => {
      leads.set(lead.id, lead);
    },
  };
}

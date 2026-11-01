import type { Lead } from "../types";
import type { LeadStore } from "./types";
import { createMemoryStore } from "./memory";

export const DEFAULT_STORE_KEY = "closeloop-db";

/** localStorage-backed store. Falls back to in-memory when storage is unavailable (SSR/private mode). */
export function createLocalStorageStore(key: string = DEFAULT_STORE_KEY): LeadStore {
  const memory = createMemoryStore();
  let hydrated = false;

  const hydrate = () => {
    if (hydrated) return;
    hydrated = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Lead[];
      if (Array.isArray(parsed)) {
        parsed.forEach((l) => memory.save(l));
      }
    } catch {
      // Corrupt storage: start fresh rather than crash the demo.
    }
  };

  const persist = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(memory.list()));
    } catch {
      // Quota / private mode: keep in-memory only.
    }
  };

  return {
    list: () => {
      hydrate();
      return memory.list();
    },
    get: (id) => {
      hydrate();
      return memory.get(id);
    },
    save: (lead) => {
      hydrate();
      memory.save(lead);
      persist();
    },
  };
}

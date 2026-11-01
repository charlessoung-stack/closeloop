import type { Lead } from "../types";

export interface LeadStore {
  list(): Lead[];
  get(id: string): Lead | undefined;
  save(lead: Lead): void;
}

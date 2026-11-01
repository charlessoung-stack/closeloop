import type { Activity, Lead } from "../types";
import type { LeadStore } from "./types";

function iso(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString();
}

function activityLog(path: Array<{ from: string; to: string; daysAgo: number; actor?: string }>): Activity[] {
  return path.map((p, i) => ({
    id: `act_seed_${i}`,
    type: "stage_change" as const,
    message: `${p.from} → ${p.to}${p.actor ? ` (by ${p.actor})` : ""}`,
    at: iso(p.daysAgo),
  }));
}

interface SeedSpec {
  id: string;
  company: string;
  contactName: string;
  email: string;
  source: string;
  budget: "low" | "mid" | "high";
  isDecisionMaker: boolean;
  timelineWeeks: number;
  needDescription: string;
  stage: Lead["stage"];
  score: number;
  createdAtDaysAgo: number;
  stageChangedDaysAgo: number;
  path: Array<{ from: string; to: string; daysAgo: number; actor?: string }>;
}

const SPECS: SeedSpec[] = [
  {
    id: "ld_seed_1",
    company: "Northwind Manufacturing",
    contactName: "Elena Marsh",
    email: "elena@northwind.example",
    source: "website",
    budget: "high",
    isDecisionMaker: true,
    timelineWeeks: 4,
    needDescription: "Replace manual quoting with an automated pipeline",
    stage: "NEGOTIATION",
    score: 92,
    createdAtDaysAgo: 24,
    stageChangedDaysAgo: 2,
    path: [
      { from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 23 },
      { from: "QUALIFIED", to: "CONTACTED", daysAgo: 21 },
      { from: "CONTACTED", to: "DEMO", daysAgo: 16 },
      { from: "DEMO", to: "PROPOSAL", daysAgo: 11 },
      { from: "PROPOSAL", to: "NEGOTIATION", daysAgo: 2 },
    ],
  },
  {
    id: "ld_seed_2",
    company: "BlueRock Logistics",
    contactName: "Miles Chen",
    email: "miles@bluerock.example",
    source: "linkedin",
    budget: "mid",
    isDecisionMaker: true,
    timelineWeeks: 8,
    needDescription: "Centralize scattered follow-up notes across reps",
    stage: "DEMO",
    score: 78,
    createdAtDaysAgo: 12,
    stageChangedDaysAgo: 3,
    path: [
      { from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 11 },
      { from: "QUALIFIED", to: "CONTACTED", daysAgo: 9 },
      { from: "CONTACTED", to: "DEMO", daysAgo: 3 },
    ],
  },
  {
    id: "ld_seed_3",
    company: "Helios Energy",
    contactName: "Priya Nair",
    email: "priya@helios.example",
    source: "trade-show",
    budget: "high",
    isDecisionMaker: true,
    timelineWeeks: 12,
    needDescription: "Qualify inbound volume before passing to field sales",
    stage: "CONTACTED",
    score: 70,
    createdAtDaysAgo: 7,
    stageChangedDaysAgo: 4,
    path: [
      { from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 6 },
      { from: "QUALIFIED", to: "CONTACTED", daysAgo: 4 },
    ],
  },
  {
    id: "ld_seed_4",
    company: "Polaris Medical",
    contactName: "Tom Alvarez",
    email: "tom@polaris.example",
    source: "referral",
    budget: "mid",
    isDecisionMaker: false,
    timelineWeeks: 6,
    needDescription: "Win-rate reporting for the sales leadership deck",
    stage: "QUALIFIED",
    score: 55,
    createdAtDaysAgo: 4,
    stageChangedDaysAgo: 3,
    path: [{ from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 3 }],
  },
  {
    id: "ld_seed_5",
    company: "Cedar & Co Interiors",
    contactName: "Sofia Reyes",
    email: "sofia@cedarco.example",
    source: "website",
    budget: "low",
    isDecisionMaker: true,
    timelineWeeks: 20,
    needDescription: "Exploring options; no budget approved yet",
    stage: "NEW_LEAD",
    score: 25,
    createdAtDaysAgo: 1,
    stageChangedDaysAgo: 1,
    path: [],
  },
  {
    id: "ld_seed_6",
    company: "Atlas Freight",
    contactName: "Daniel Kim",
    email: "daniel@atlasfreight.example",
    source: "email-campaign",
    budget: "high",
    isDecisionMaker: true,
    timelineWeeks: 3,
    needDescription: "Pilot the loop on one sales region first",
    stage: "WON",
    score: 95,
    createdAtDaysAgo: 30,
    stageChangedDaysAgo: 5,
    path: [
      { from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 29 },
      { from: "QUALIFIED", to: "CONTACTED", daysAgo: 26 },
      { from: "CONTACTED", to: "DEMO", daysAgo: 21 },
      { from: "DEMO", to: "PROPOSAL", daysAgo: 17 },
      { from: "PROPOSAL", to: "NEGOTIATION", daysAgo: 12 },
      { from: "NEGOTIATION", to: "WON", daysAgo: 5 },
    ],
  },
  {
    id: "ld_seed_7",
    company: "Meridian Health Systems",
    contactName: "Grace Liu",
    email: "grace@meridian.example",
    source: "website",
    budget: "mid",
    isDecisionMaker: false,
    timelineWeeks: 16,
    needDescription: "Needs compliance sign-off before any purchase",
    stage: "LOST",
    score: 34,
    createdAtDaysAgo: 18,
    stageChangedDaysAgo: 6,
    path: [
      { from: "NEW_LEAD", to: "QUALIFIED", daysAgo: 17 },
      { from: "QUALIFIED", to: "CONTACTED", daysAgo: 14 },
      { from: "CONTACTED", to: "DEMO", daysAgo: 10 },
      { from: "DEMO", to: "LOST", daysAgo: 6 },
    ],
  },
];

export function createSeedLeads(): Lead[] {
  return SPECS.map((s) => {
    const createdAt = iso(s.createdAtDaysAgo);
    const stageChangedAt = iso(s.stageChangedDaysAgo);
    return {
      id: s.id,
      company: s.company,
      contactName: s.contactName,
      email: s.email,
      source: s.source,
      budget: s.budget,
      isDecisionMaker: s.isDecisionMaker,
      timelineWeeks: s.timelineWeeks,
      needDescription: s.needDescription,
      stage: s.stage,
      score: s.score,
      createdAt,
      updatedAt: stageChangedAt,
      stageChangedAt,
      notes: [],
      activities: [...activityLog(s.path), { id: `act_seed_create`, type: "stage_change", message: "Lead created (NEW_LEAD)", at: createdAt }],
      followUps: [],
    };
  });
}

/** Seeds the store only when it is empty. Returns true if seeding happened. */
export function seedIfEmpty(store: LeadStore, leads: Lead[]): boolean {
  if (store.list().length > 0) return false;
  leads.forEach((l) => store.save(l));
  return true;
}

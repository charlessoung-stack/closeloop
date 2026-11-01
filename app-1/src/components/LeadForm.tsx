import { useState } from "react";
import type { BudgetLevel, Closeloop, Lead, QualificationResult } from "@closeloop/core";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SIGNAL_OPTIONS = ["automation", "integration", "compliance", "cost", "scale"];

interface FormState {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  source: string;
  budget: BudgetLevel;
  isDecisionMaker: boolean;
  timelineWeeks: string;
  needDescription: string;
  needSignals: string[];
}

const EMPTY: FormState = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  source: "website",
  budget: "mid",
  isDecisionMaker: false,
  timelineWeeks: "12",
  needDescription: "",
  needSignals: [],
};

export function LeadForm({
  closeloop,
  onCreated,
}: {
  closeloop: Closeloop;
  onCreated: (lead: Lead, result: QualificationResult) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSignal = (s: string) =>
    setForm((f) => ({
      ...f,
      needSignals: f.needSignals.includes(s) ? f.needSignals.filter((x) => x !== s) : [...f.needSignals, s],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.company.trim()) errs.company = "Company is required";
    if (!form.contactName.trim()) errs.contactName = "Contact name is required";
    if (!EMAIL_RE.test(form.email)) errs.email = "A valid email is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const lead = closeloop.engine.addLead({
      company: form.company.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      source: form.source,
      budget: form.budget,
      isDecisionMaker: form.isDecisionMaker,
      timelineWeeks: Math.max(1, Math.min(52, Number(form.timelineWeeks) || 12)),
      needDescription: form.needDescription.trim(),
    });

    const result = closeloop.agent.qualify({
      budget: form.budget,
      isDecisionMaker: form.isDecisionMaker,
      timelineWeeks: Number(form.timelineWeeks) || 12,
      needSignals: form.needSignals,
    });

    const scored = closeloop.engine.setVerdict(lead.id, result);
    onCreated(scored, result);
    setForm(EMPTY);
  };

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <div className="field">
        <label>Company *</label>
        <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Northwind Manufacturing" />
        {errors.company && <span className="field-error">{errors.company}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label>Contact name *</label>
          <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Full name" />
          {errors.contactName && <span className="field-error">{errors.contactName}</span>}
        </div>
        <div className="field">
          <label>Work email *</label>
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@company.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
      </div>

      <div className="field">
        <label>What are you trying to solve?</label>
        <textarea value={form.needDescription} onChange={(e) => set("needDescription", e.target.value)} rows={2} placeholder="Short description of the need" />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Budget range</label>
          <select value={form.budget} onChange={(e) => set("budget", e.target.value as BudgetLevel)}>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="field">
          <label>Timeline (weeks)</label>
          <input type="number" min={1} max={52} value={form.timelineWeeks} onChange={(e) => set("timelineWeeks", e.target.value)} />
        </div>
      </div>

      <label className="check">
        <input type="checkbox" checked={form.isDecisionMaker} onChange={(e) => set("isDecisionMaker", e.target.checked)} />
        I am the decision maker
      </label>

      <div className="field">
        <label>Need signals</label>
        <div className="chips">
          {SIGNAL_OPTIONS.map((s) => (
            <button
              type="button"
              key={s}
              className={`chip ${form.needSignals.includes(s) ? "on" : ""}`}
              onClick={() => toggleSignal(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button className="primary-btn" type="submit">
        Submit lead → run qualification agent
      </button>
    </form>
  );
}

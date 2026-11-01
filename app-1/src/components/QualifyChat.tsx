import { useState } from "react";
import {
  ScoreBadge,
  type BudgetLevel,
  type Closeloop,
  type Lead,
  type QualificationInput,
} from "@closeloop/core";

interface Question {
  key: "budget" | "decision" | "timeline";
  prompt: string;
  options: Array<{ label: string; value: string }>;
}

const QUESTIONS: Question[] = [
  {
    key: "budget",
    prompt: "Q1 · What budget range are we working with?",
    options: [
      { label: "Low", value: "low" },
      { label: "Mid", value: "mid" },
      { label: "High", value: "high" },
    ],
  },
  {
    key: "decision",
    prompt: "Q2 · Are you the decision maker for this purchase?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    key: "timeline",
    prompt: "Q3 · When do you need this live?",
    options: [
      { label: "≤ 4 weeks", value: "4" },
      { label: "1–3 months", value: "12" },
      { label: "3–6 months", value: "26" },
      { label: "Later", value: "40" },
    ],
  },
];

export function QualifyChat({
  lead,
  closeloop,
  onUpdated,
}: {
  lead: Lead;
  closeloop: Closeloop;
  onUpdated: (lead: Lead) => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const input: QualificationInput = {
    budget: lead.budget,
    isDecisionMaker: lead.isDecisionMaker,
    timelineWeeks: lead.timelineWeeks,
    needSignals: [],
  };

  const answer = (value: string) => {
    const q = QUESTIONS[step];
    const next: QualificationInput = {
      ...input,
      budget: q.key === "budget" ? (value as BudgetLevel) : input.budget,
      isDecisionMaker: q.key === "decision" ? value === "yes" : input.isDecisionMaker,
      timelineWeeks: q.key === "timeline" ? Number(value) : input.timelineWeeks,
    };
    const result = closeloop.agent.qualify(next);
    const updated = closeloop.engine.setVerdict(lead.id, result);
    onUpdated(updated);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setDone(false);
  };

  return (
    <div className="chat">
      <div className="chat-head">◆ Qualification agent</div>

      {!done ? (
        <div className="chat-body">
          <div className="chat-prompt">{QUESTIONS[step].prompt}</div>
          <div className="chat-options">
            {QUESTIONS[step].options.map((o) => (
              <button key={o.value} className="chat-option" onClick={() => answer(o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-body">
          <div className="chat-prompt">Qualification complete.</div>
          <p className="muted">
            Live verdict below reflects every answer. Scores update after each reply.
          </p>
          <button className="mini-btn" onClick={reset}>
            Start over
          </button>
        </div>
      )}

      <div className="chat-verdict">
        <ScoreBadge score={lead.score} />
        <span className="muted">
          {lead.qualification ? lead.qualification.nextAction : "Waiting for answers…"}
        </span>
      </div>
    </div>
  );
}

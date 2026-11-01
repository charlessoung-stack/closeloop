# VIDEO_SCRIPT.md — Closeloop demo (target ~170 seconds, < 3 min)

**Format:** screen recording + voiceover. **Audio policy:** voiceover only plus
public-domain/CC0 sound design — no copyrighted music, no third-party
trademarks. **Upload:** YouTube, unlisted → public before submission.

---

## 0:00–0:15 — Problem (15 s)

**VO:** *"Every B2B team loses inbound leads between the form and the follow-up.
The lead sits in a spreadsheet, nobody scores it, and it goes cold."*

**Screen:** title card "Closeloop — closing the B2B sales loop" → cut to a
spreadsheet mock with stale rows, then to the app.

## 0:15–1:20 — End-to-end demo (65 s)

**VO:** *"Here's the loop. App one is the front door — LeadGen."*

1. **0:15** Landing page of **app-1 (LeadGen)**. Type a new inbound lead: a
   company, a contact, a work email, a budget, a timeline. Submit.
2. **0:30** The qualification agent instantly returns a **score with reasons** —
   budget, decision maker, timeline, need signals — and a verdict.
3. **0:42** Run the scripted **qualification chat**: three quick questions
   (budget / decision maker / timeline). Show the score re-computing after each
   answer.
4. **0:55** Open the **scored lead queue** in app-1: leads sorted by score, top
   reason and next action visible. Click **"Send to pipeline"** on one hot lead.
5. **1:05** Switch to **app-2 (Pipeline Agent)** — same data (shared store). The
   lead appears in `QUALIFIED`. Drag it through `CONTACTED → DEMO → PROPOSAL →
   NEGOTIATION`, showing that **invalid jumps are blocked** by the engine
   (highlight a rejected `NEW_LEAD → WON` attempt).
6. **1:16** Open the lead drawer: **agent-recommended next action**, one click to
   **schedule the follow-up**, add a **note**, tick the follow-up done.

**Screen:** each step labeled with a stage chip; keep the score badge visible.

## 1:20–2:40 — Kiro usage highlights (80 s)

**VO:** *"None of this was vibe-coded. Kiro ran the build book."*

1. **1:20** Show `.kiro/` in the repo tree — **steering** (`product.md`,
   `tech.md`, `structure.md`, `inclusion: always`), **specs** (EARS
   requirements → design → tasks in dependency waves), **hooks**, **custom
   agent**, **settings/mcp.json**.
2. **1:38** Open one hook file: *"typecheck on every TS save"* and *"tests on
   every test-file save"* — `PostFileSave` triggers wired to the repo's real
   npm scripts.
3. **1:50** Open the custom agent `closeloop-sales.json`: it **pre-loads all
   steering + specs as resources**, so every future session re-hydrates context
   instead of re-explaining the project.
4. **2:02** Open `tech.md`: the **zero-API-key constraint** and the
   `AgentAdapter` seam — the demo runs fully client-side with deterministic
   heuristic agents; a real LLM plugs in later without touching the UI.
5. **2:15** Show the **property-based tests** (fast-check, 300 runs each):
   *"The engine's transition rules and the scoring invariants are property-
   tested — PBT even caught a bad test setup during development."*
6. **2:30** Verdict: *"Steering + specs + hooks turned a hackathon sprint into a
   reviewable, testable engineering process."*

## 2:40–2:50 — Summary (10 s)

**VO:** *"Closeloop: one template, two apps, one closed loop — capture,
qualify, route, act, track. Built with Kiro."*

**Screen:** end card with repo link + "#KiroweenHackathon26".

---

## Recording checklist

- [ ] Total length ≤ 3:00 (target 2:50).
- [ ] English narration + on-screen text.
- [ ] YouTube public, title contains "Closeloop — Kiroween 2026".
- [ ] No copyrighted music; voiceover + CC0/self-made sounds only.
- [ ] No third-party logos/trademarks (all demo companies are fictional).
- [ ] Describe the Kiro usage explicitly (judging criterion "Technical Kiro use").

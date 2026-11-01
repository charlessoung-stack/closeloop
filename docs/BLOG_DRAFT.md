# BLOG_DRAFT.md — Closeloop: closing the B2B sales loop with Kiro (blog draft)

> Publish on a third-party public platform during the submission period
> (2026-10-30 → 2026-12-04). Required sentence is included verbatim below.
> Suggested title options at the end. Add your name/links before publishing.

---

Every B2B sales team knows the same silent leak: a prospect fills the "contact
us" form, the row lands in a spreadsheet, and then nobody qualifies it for a
week. By the time someone calls, the budget has moved, the champion has left,
or the deal simply went cold.

**Closeloop** is our Kiroween 2026 project that closes that loop. It is a
lean, reusable template plus two distinct applications: **LeadGen** (capture
and AI qualification) and **Pipeline** (kanban flow, next-best-actions,
follow-ups, analytics). One shared engine, one shared data store, zero API
keys needed to run the demo.

## The loop

1. **Capture.** An inbound lead form validates the input and stores the lead.
2. **Qualify.** A deterministic agent scores every lead 0–100 with explicit
   reasons — budget, decision-maker signal, timeline, need signals — and
   labels it cold/warm/hot.
3. **Route.** Hot leads move into the pipeline in one click.
4. **Act.** The agent recommends the next best action per pipeline stage and
   schedules it as a follow-up.
5. **Track.** A kanban board with engine-guarded transitions, notes, and live
   analytics (funnel conversion, win rate, time-in-stage).

The pipeline is a real state machine: `NEW_LEAD → QUALIFIED → CONTACTED →
DEMO → PROPOSAL → NEGOTIATION → WON | LOST`, with invalid transitions rejected
by the engine and `WON` as a terminal stage. We property-tested those rules
with fast-check (300 runs per property) instead of trusting examples.

## Why we built it the Kiro way

We are first-time Kiro users, and we wanted the build itself to demonstrate
the tool. The repo's `.kiro/` directory is the whole story:

- **Steering** (`product.md`, `tech.md`, `structure.md`, `inclusion: always`)
  pins the stack, the zero-API-key constraint, and the non-goals so no future
  prompt can re-litigate them.
- **Specs** — EARS requirements, design docs, and tasks in dependency waves —
  meant we wrote the transition map and scoring weights *before* any code, and
  the implementation followed the tasks, not the vibes.
- **Hooks** — `typecheck` on every TS save, tests on every test-file save —
  turned our verification commands into editor behavior.
- **A custom agent** pre-loads all steering and specs as resources, so a fresh
  session re-hydrates the whole project context instead of asking for a recap.

The most honest thing we learned: property tests catch bad test setup as well
as bad code. Our first transition property failed not because the engine was
wrong, but because the test forgot to persist the lead before moving it —
vacuous truth, caught in 300 rounds.

## Try it

Clone the repo, `npm install`, run the two apps, and watch an inbound form
become a won deal in your browser. Everything runs client-side.

This post was written as part of the Kiroween 2026 hackathon.

---

### Suggested titles

- "Closeloop: closing the B2B sales loop with Kiro (Kiroween 2026)"
- "We built a two-app sales loop on one template — here's the `.kiro` story"
- "From form to won deal: a Kiro-driven B2B agent demo"

### Publish checklist

- [ ] Published on a third-party public platform (dev.to / Hashnode / Medium / personal blog).
- [ ] Published within the submission period (before 2026-12-04 14:00 PT).
- [ ] Required sentence present (verbatim): *"This post was written as part of the Kiroween 2026 hackathon."*
- [ ] Add repo link once public.

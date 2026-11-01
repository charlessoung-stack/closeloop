# CHECKLIST.md — Closeloop · Kiroween 2026 submission self-check

> Generated 2026-11-01 against the official rules (kiroween.devpost.com/rules,
> fetched 2026-10-31) and the build book rubric r1. Status legend:
> ✅ verified here · ⏳ user action required (AI does not publish/submit per
> build book) · ⚠️ conditional.

## 0. Hard deadlines (official rules)

| Item | Value | Status |
|---|---|---|
| Submission opens | 2026-10-30 09:00 PT | ✅ passed |
| Submission deadline | **2026-12-04 14:00 PT** (ET 17:00 / Beijing 12-05 06:00) | ✅ noted |
| Free credits request deadline | 2026-12-01 12:00 PT | ⏳ apply if not done |
| Credits redemption deadline | 2026-12-04 | ⏳ redeem after approval |
| Credits expiry | 2026-12-31 23:59 PT | ⏳ use before |

## 1. Rubric r1 — pass/fail gates

| # | Criterion | Status | Evidence / action |
|---|---|---|---|
| R1 | Repo public on GitHub | ⏳ | `gh` CLI not installed; user creates/pushes repo and makes it public. All files ready at repo root. |
| R2 | License visible in GitHub About | ⏳ | `LICENSE` = MIT, `Copyright (c) 2026 Closeloop contributors`; README declares MIT. User sets About → license on GitHub. |
| R3 | `/.kiro` at root, NOT gitignored | ✅ | `.gitignore` lines 18–19: `!.kiro` / `!.kiro/**` guards; full tree present (steering 3, specs 9, hooks 2, agents 1, settings 1). |
| R4 | Specs + hooks + steering present | ✅ | `.kiro/steering/{product,tech,structure}.md` (`inclusion: always`); specs = EARS requirements + design + tasks for 3 features; hooks = 2 `PostFileSave` JSON per documented v1 format. |
| R5 | All code after 2026-10-30 | ✅ | Every file created 2026-11-01 (inside submission period). |
| R6 | Working app URLs + test credentials | ✅ | Local verification: `npm run typecheck` ✅, `npm test` 22/22 ✅, `npm run build` ✅, `vite preview` HTTP 200. **Deployed on Vercel:** LeadGen https://speedy-mercury-fws9i9m.tmp.now · Pipeline https://zippy-carbon-rdy9hdc.tmp.now. No login needed; seed uses fictional companies. |
| R7 | Video < 3 min, public YouTube, no copyright music | ⏳ | `docs/VIDEO_SCRIPT.md` = ~170 s script with CC0/voiceover-only audio policy. User records/renders/uploads. |
| R8 | Kiro usage write-up done | ✅ | `docs/KIRO_USAGE.md` — honest first-time-use write-up, configs validated against kiro.dev/docs. |
| R9 | Category chosen + bonus fields filled | ✅ | **Skeleton Crew** (template + 2 independent app folders). Bonus: Blog + Social Blitz apply. Startup/Student/Ghost of 2025: N/A (not student, not founder, first Kiroween). |
| R10 | Blog + social links published in period | ⏳ | Drafts ready: `docs/BLOG_DRAFT.md` (required sentence included), `docs/SOCIAL_DRAFT.md` (starts with #KiroweenHackathon26, ≤ 280 chars). User publishes before 12-04 14:00 PT. |
| R11 | Skeleton Crew: two app folders | ✅ | `app-1/` (LeadGen) + `app-2/` (Pipeline) both build and serve; both import `@closeloop/core` from `template/`. |
| R12 | Submitted before deadline | ⏳ | User submits on Devpost; all materials in English (rule: English or English translation). |

## 2. Category-specific evidence (Skeleton Crew)

- One template: `template/` = `@closeloop/core` (engine, agents, storage, UI kit, tests) — ✅
- Two independent apps in separate folders: `app-1/`, `app-2/` — ✅
- Both apps reuse the same template via workspaces + Vite alias `@closeloop/core → ../template/src` — ✅
- No duplicated core logic between apps (shared store key `closeloop-db`) — ✅

## 3. Technical verification (run in this repo)

```bash
npm run typecheck   # ✅ passes — template, app-1, app-2
npm test            # ✅ 22/22 — unit + fast-check PBT (P1/P2/P3 × 300 runs)
npm run build       # ✅ both apps produce dist/ (tsc + vite build)
vite preview        # ✅ HTTP 200 on both apps
```

## 4. Open items for the user (AI does not publish per build book)

1. `git init` → commit → push to GitHub → **make repo public**.
2. GitHub → About → **set License: MIT**.
3. Deploy both apps (Vercel/Netlify); fill `<APP1_URL>` / `<APP2_URL>` in README + `docs/DEVPOST.md`.
4. Record the demo per `docs/VIDEO_SCRIPT.md` (< 3 min, no copyright music) → upload **public** to YouTube → fill `<VIDEO_URL>`.
5. Publish blog per `docs/BLOG_DRAFT.md` (required sentence included) → fill `<BLOG_URL>`.
6. Post social per `docs/SOCIAL_DRAFT.md` (starts with `#KiroweenHackathon26`) → fill `<SOCIAL_URL>`.
7. Request free credits (by 12-01 12:00 PT) if not done; redeem by 12-04.
8. Submit on Devpost **before 2026-12-04 14:00 PT** with English materials.

## 5. Honest-limits note

- Kiro IDE/CLI was not runnable in the build environment (first-time user);
  hooks/specs/steering follow the official formats and the commands they invoke
  are verified passing. See `docs/KIRO_USAGE.md` §8.

# Fuel Log — Start Here 🧭

**Updated:** 2026-08-07 (session 12).

**Where the code is.** `main` @ `88a283a` is what's **live on Pages** (sw v56): the harm-fix that floors
*Maintain* at sedentary TDEE (BMR × 1.2), so the adaptive auto-lowering can no longer show a maintenance
target below resting metabolism. Everything since lives **uncommitted-to-`main`** on branch
**`energy-safety-bmr-floor`** — **Steps 1–4 of the energy plan, all built, committed and Jest-green
(142/142, sw v60), none deployed or device-tested.** The device test is deliberately **batched** into one
pass at the end (Next up 2).

**What Steps 1–4 did**, in one line each — detail lives in `ENERGY_MODEL.md` §5 and `DOCS.md` §37, not here:

| Step | What changed | State |
|---|---|---|
| 1 | Flat BMR×1.2 → a 4-chip lifestyle (NEAT) multiplier, 1.20–1.55, that seeds a believable target | built |
| 2 | Adaptive TDEE converges properly (no more cap-pinning) + the app now *invites* weigh-ins | built |
| 3 | A workout's calories spread forward over 3 days instead of all unlocking the same day | built |
| 4 | A body-sized **steady-loss floor** replaces the flat safe minimum as the real protection; energy availability becomes a **warning**, not an override | built |

**Read `ENERGY_MODEL.md` before touching targets** — it owns the model (seed → calibrate) and the ordered
plan, including **§5.1: why Step 4 shipped differently from its spec** (the drafted EA-30 override would
have capped a 98.5 kg cut at a 161 kcal deficit; the EA-45 "all clear" band is unreachable by construction).

Read this file first. It never duplicates roadmap detail — it points to it.

---

## Right now

- **🔵 NOW (session 12) — Step 5: sustainability (02 cut-cycling · 03 diet break · 04-rest).** Steps 1–4 are
  **built and committed** on `energy-safety-bmr-floor` (Jest 142, sw v60; not deployed/device-tested —
  batched). Now that a cut is a *real, bounded* deficit, the cycling/diet-break features become meaningful.
  **02 is yours to proofread first.** See `ENERGY_MODEL.md` §5 Step 5.
  - **✅ Step 4 (energy floor) DONE 2026-08-07 — re-shaped from the draft.** Two protections, not one clamp:
    (a) **steady-loss floor**, the hard clamp for everyone — `MAX_DEFICIT_FRAC = 0.25` off believable
    maintenance + the applied training bonus (`deficitFloorApplied`, amber *"Eased to a steady pace"* with a
    "Why?"); (b) **low-fuel warning** — EA `(target − raw burn) ÷ FFM`, **never clamps**, shown only for a lean
    body (`LEAN_BF` 15% M / 23% F) on a day it trained with EA < 30. **`EA_OK = 45` dropped** — unreachable by
    construction. EA uses the **raw** burn while the target uses Step 3's **smoothed** bonus. `SAFE_MIN` stays as
    the absolute backstop + body-fat-unset fallback. Feature file 01 rewritten to match. Jest 142, sw v60.
    Reasoning + persona numbers: `ENERGY_MODEL.md` §5.1.
  - Steps 1–3 are summarised in the table at the top; their full changelists live in `DOCS.md` §37 and
    `ENERGY_MODEL.md` §5. ([[project_workout_smoothing_idea]] shipped as Step 3.)

**Git:** `main` @ `88a283a` = the harm-fix, **live on Pages**. Ongoing energy-safety work continues on branch
**`energy-safety-bmr-floor`** (checked out) — Steps 1–4, latest `bfe926f`. Parked `targets-bmr-floor-wip`
**deleted**. Rollback tag `pre-bmr-floor` (pre-fix `main`).

- **What's left in the energy plan** — `ENERGY_MODEL.md` §5 is the authoritative table; don't restate it here.
  - **Step 5 — Sustainability: 02 cut-cycling · 03 diet break · 04-rest (no auto-lower on gain-in-deficit).**
    Only meaningful now that a cut is a real, bounded deficit. **02 is yours to proofread.** ← next build.
  - **Step 6 — 05 LEA symptom check**, sex-neutral → *"see a healthcare professional."* ⚠️ Its trigger needs
    re-picking: it was written against the EA 30–45 caution band, which Step 4 dropped (noted in the file).
  - **Convention:** specs are @draft — implement to the **NUMBERS CONTRACT** (derived worked-examples vs named
    policy constants; exact numbers owned by `logic.test.js`; steps assert observable outcomes). Coach + design +
    QA hats; consultant believability gate before each deploy. Device-testing stays **BATCHED** (one pass later).
    See [[project_energy_safety_workstream]].

- **⏸ DEFERRED (per user) — AI photo→log (v6.7) device-verify.** Already live on Pages; 3 checks remain
  (see Next-up 2), held until the energy-safety build lands and gets its batch device-test.

## Next up (in order)

1. **◀ Work the re-sequenced energy plan** (`ENERGY_MODEL.md` §5): ✅ Step 1 activity input + ✅ Step 2
   adaptive-TDEE (+ weigh-in engagement 06) + ✅ Step 3 smooth earn-to-eat + ✅ Step 4 energy floor DONE →
   **◀ Step 5 sustainability (02/03/04) (next)** → Step 6 LEA (05). Commit as each lands (keep Jest green);
   **batch the on-device test + deploy of all feature files** once complete. *(Steps 1–4 committed + Jest-green
   on `energy-safety-bmr-floor`, not yet deployed.)*
2. **Batch device-test everything** — the whole energy-safety set AND the still-open AI-capture (v6.7) checks
   in one pass (hard-reload first, PWA cache): (a) v55 optional follow-up flow; (b) ⚐ Report-wrong opens a
   prefilled email; (c) + Log all lands in today's food; plus the energy-safety UI ("Eased to a steady pace" +
   "Low on fuel today" and their "Why?" toggles, diet-break mode, symptom check, "Held at your minimum
   maintenance"). **Note:** the steady-loss floor only *visibly* bites on smaller bodies — to see it, temporarily
   set a ~60 kg profile. When green, flip `@wip` on the AI-capture + two
   v6.6 features in `fuel-log.feature`. **Then bind `RATE_LIMIT` KV** (ops blocker below) before any launch.
3. **🗓️ carb floor** (deferred): clamp carbs to 2 g/kg bodyweight on aggressive cuts, reduce **fat** first
   (to its 0.6 g/kg hormonal floor). Changes the macro split for all cutters. Its blocker (the energy floor)
   is now built — but the steady-loss floor means "aggressive cut" needs redefining, since a preset can no
   longer go deeper than 25%; it now really only applies to typed custom targets.
4. **Build: more badge categories** (`DOCS §23`: Protein King, Cut Champion, Bulk Mode, Balanced) — reuses
   the v6.5 tier + celebration engine.
5. **Optional / legal:** Cloudflare cron trigger (`LEGAL §13` step 4) — now also drives the committed
   Supabase keep-alive ping; use **every-3-days** `0 3 */3 * *`, not weekly. Test "Download my data"
   (`§13` step 6) — ⚠️ **never** test "Delete my account" on your real account. Pre-Play: Art. 9
   consent-wording review (`§7` 7g) + ICO fee & PO-box/correspondence address (risk **R7**).

## Reference — operational facts (don't lose these)

- **Rollback tags:** v6.7 line → `pre-ai-capture-v67`; Phase B → `8622d24`.
- **⚠️ Launch blocker (not code):** worker `RATE_LIMIT` KV namespace is **unbound** → the daily AI cap is a
  no-op (vision/photo calls cost more than text). Bind it (worker → Settings → Bindings → KV, var
  `RATE_LIMIT`) + keep the Anthropic Console spend cap. (launch hat)
- **⚠️ PWA cache:** an installed PWA serves the **old bundle** until a full SW cycle — background isn't enough;
  fully close & reopen (or hard-reload) to pick up a new `sw.js`. (Bit us mid-test: stale "0.72%".)
- **Build:** edit `app.jsx` → `npx babel app.jsx --out-file app.js`; **bump `sw.js` cache version on every
  build**; run `npx jest` (currently **142/142**, sw **v60**).
- **⚠️ Local-only profile fields** (energy Steps 1–2): the `profiles` table has no `activity` or
  `weighCadence` column, so both live only in the local profile blob (preserved across sync pulls via the
  pull-merge, but a brand-new device defaults until re-picked). The weigh-in nudge's dismissal timestamp
  (`weigh_nudge_dismissed`) and the dead-time-comp log (`tdee_adj_log`) are likewise local-only. Cloud sync
  for `activity` is a trivial fast-follow — add the column (`setup/supabase-schema.sql` has it commented)
  **then** wire `syncProfile`/pull; don't add it to the upsert before the column exists or profile sync
  silently breaks.
- **Shipped + verified so far:** Phase B compliance (consent gate + `/delete-account` + dormant sweep, LIVE
  2026-06-10) · session-3 features #2–#8 · v6.3 per-field units + allergen safety fix · v6.4 light mode ·
  v6.5 celebration engine · v6.5.1 manifest/icon fix · v6.6 meal data-integrity + Separated-confidence ·
  v6.7 AI voice/photo capture (live, device-verify pending). Product detail + changelog live in `DOCS.md`.
- **Abandoned:** web haptics (`navigator.vibrate` is a silent platform no-op on mobile Chrome / Pixel 7 —
  `haptic()` left as a feature-detected no-op; **do not re-debug**).

## Which doc, when

| Open this… | …when you want |
|---|---|
| **START-HERE.md** (this) | where am I / what's next |
| **ENERGY_MODEL.md** | the target-energy model (seed→calibrate) + the ordered energy-safety build plan |
| **SECURITY_ROADMAP.md** | the master phase plan (0 → F) + threat model |
| **LEGAL_ROADMAP.md** | privacy/compliance detail (Phase B), deploy checklist, risk register |
| **DOCS.md** | how the product works — features, design system, changelog, backlog |
| **ARCHITECTURE_REVIEW.md** | known issues & severities |
| **SETUP.md** | how to build / run / deploy locally |
| **personas/** | reusable chat "hats" — `Admin` (docs), `privacy-counsel` (legal), `QA` (BDD/Gherkin), `coach` (nutrition), `design`/`UX` (UI), `launch` (store submission & launch) |

---

## How this file stays current (the contract)

This file is the **single source of truth for "where we are."** To stop it drifting:

- **Only the `Right now` + `Next up` blocks are volatile** — they're the session leave-off note.
  Everything durable lives in the owning roadmap; this file just links to it.
- **Claude will proactively prompt** you to refresh this file (and flag any other doc that needs
  updating) whenever the project's status changes or a working session wraps up. You can also just ask
  for "a docs update" any time.
- **When you finish a chunk of work,** update (or ask Claude to update): this file's two blocks, the
  relevant checkbox in the owning roadmap, and `DOCS.md` changelog if product behaviour changed.

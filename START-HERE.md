# Fuel Log — Start Here 🧭

**Updated:** 2026-08-07 (session 12). **Energy-plan Steps 1–4 BUILT** (activity seed · adaptive-TDEE + weigh-in engagement · smoothed earn-to-eat · energy floor).
Step 4 (the EA floor, file 01) was **re-shaped at build time** after its own numbers failed: the drafted
EA-30 *clamp* would have capped the founder's cut at a 161 kcal deficit, and the EA-45 "all clear" band is
**unreachable by construction** in a NEAT-only model that subtracts training back out. It shipped as **two
separate protections**: a **steady-loss floor** (the hard clamp — no preset target sits more than 25% below
believable maintenance; scales with body size: 1,673 for a 98.5 kg body, 1,208 for a 60 kg one; eases, never
blocks) and a **low-fuel warning** (energy availability, **warning only**, only for a lean body on a day it
actually trained). Custom targets warn, never get overridden. **Jest 142/142, sw v60, compiled — NOT
deployed or device-tested** (batched). Full reasoning + persona table: `ENERGY_MODEL.md` §5.1.
Step 2 replaced the flat ±150 adaptive integrator with a **dead-time-compensated, confidence-scaled**
convergence (gain 0.8; per-run cap 100/150/200; engages at 6 weigh-ins) — a simulation closes a 500 kcal
gap by day 19 without pinning the ±600 cap (the old loop overshot and pinned ~10 days). Because calibrate
needs weigh-ins the believable seed no longer *requires*, it also ships **weigh-in engagement** (Coach +
Design + QA): the widget **invites** instead of saying "log daily", shows a **progress cue** to the
6th check-in, a **cadence picker** (few/daily/weekly/"I'd rather not"=mute) sits by the activity chips,
and one **gentle 7-day nudge** (dismiss + 14-day cooldown + mute) lives on the dashboard. **Jest 117/117,
sw v58, compiled — NOT committed/deployed or device-tested** (batched). Step 3 (smooth earn-to-eat) next.
*Prev in session 12:* **Step 1 (activity input + seeded NEAT multiplier).** Flat BMR×1.2 replaced by a 4-chip lifestyle multiplier (Sedentary 1.20 / Light 1.35 /
Active 1.45 / Very 1.55 — NEAT-only, locked against the believability gate: 3 personas within ~7.5% of
MyFitnessPal). Profile selector with "we auto-tune as you log" framing; seed feeds targets, calibration
base + effective-TDEE display; maintenance floor stays **sedentary** (BMR×1.2), so a negative adaptive
adj still bites for active users. Activity is **local-only** (survives sync pulls; no `profiles` column
yet). Sedentary == the old baseline → zero regression for existing/desk users. **Jest 108/108, sw v57,
compiled — NOT yet committed/deployed or device-tested** (device-test stays batched, Next-up 2). Step 2
(strengthen adaptive TDEE) is next. *Prev session 11:* **Harm-fix DEPLOYED + LIVE:** the adaptive-TDEE auto-lowering — targets drop automatically as weight falls and don't climb back on their own — could show a
*Maintain* target below resting metabolism (founder's harm report: ~1,650 vs an ~1,859 BMR). Maintenance is
now floored at **sedentary TDEE (BMR × 1.2)** — merged to `main` @ `88a283a`, **live on Pages (sw v56,
verified)**; rollback tag `pre-bmr-floor`. **Strategy CHANGED 2026-08-07:** a coach + launch-consultant +
design-lead review found file 01 (the EA floor) collides with the flat sedentary TDEE model — on today's
model it would cap every *Cut* to a ~160 kcal deficit and paint maintenance amber for most users. The model
is re-locked to **seed → calibrate** and the energy-safety features are **re-sequenced behind an activity
model + an adaptive-TDEE fix**. Full design + ordered plan: **`ENERGY_MODEL.md`** (read it before touching
targets). AI photo→log verify stays deferred until after.

Read this first. It never duplicates roadmap detail — it points to it.

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
  - **✅ Step 3 (smoothed earn-to-eat) DONE 2026-08-07.** A logged workout's kcal are spread FORWARD across a
    3-day window as an energy-conserving weighted average (`SMOOTH_WEIGHTS = [0.5, 0.3, 0.2]` over today/−1d/−2d,
    Σ=1 — total training energy unchanged, only un-spiked): same-day bonus halved, a rest day after training still
    carries fuel, back-to-back days average instead of stacking. `priorWorkoutKcal` state loads the prior 2 days
    from `workouts__<date>`; `smoothedBonus` feeds `calcTargets`; workout-card copy reworked. New
    `07-smoothed-earn-to-eat.feature` (@draft). Jest 125, sw v59, committed. [[project_workout_smoothing_idea]].

**Git:** `main` @ `88a283a` = the harm-fix, **live on Pages**. Ongoing energy-safety work continues on branch
**`energy-safety-bmr-floor`** (checked out). Parked `targets-bmr-floor-wip` **deleted**. Rollback tag
`pre-bmr-floor` (pre-fix `main`).

- **✅ DEPLOYED — the BMR × 1.2 maintenance floor ONLY** (this is feature **04**'s fix (a), *not* file 01).
  **⚠️ Read this before assuming 01 is done:** what's live is a single sub-floor — maintenance can't drop below
  sedentary TDEE (BMR × 1.2). The **energy-availability floor (30 kcal/kg FFM) and its warning bands — the
  substance of file 01 — are NOT built** (the app has zero EA logic; only a `calcTargets` comment marks it
  "later", [app.jsx:319](app.jsx#L319)). The BMR × 1.2 floor happens to also be *one row* (`maint_floor`) of
  01's "strictest floor wins" table, which is why it can look like 01 landed — it didn't.
  - Changelist: `calcTargets` floor + `bmrFloorApplied`; effective TDEE floored in Profile/weigh-in/dashboard;
    *"Held at your minimum maintenance"* note + dashboard banner; custom-target warning baseline floored. Stale
    `calcTargets` test mirror resynced (it tested a ×1.375 formula the app never ran) + BMR-floor tests →
    **Jest 107/107**; `fuel-log.feature` flat guard reframed as a backstop + new maintenance-floor Feature.
    **sw v56.** Verified: 1631 → 2231. See [[project_targets_bmr_floor]].

- **◀ NEXT — the re-sequenced energy plan (see `ENERGY_MODEL.md` §5 for the authoritative table).** Root cause:
  the app models everyone as **sedentary (BMR × 1.2)** and counts **no NEAT**, so it under-estimates TDEE — and
  the EA floor bolted on that under-count fires on everyone. **Fix the model first, then the floor.** Locked
  model = **seed → calibrate** (a coarse activity chip seeds a believable target; a strengthened adaptive TDEE
  becomes the truth; NEAT-only multiplier; earn-to-eat kept but smoothed). Ordered steps:
  - **Step 1 — Activity input + seeded multiplier** ✅ **BUILT 2026-08-07** (flat ×1.2 → 4-chip NEAT
    multiplier 1.20/1.35/1.45/1.55; Profile selector = onboarding surface; gate passed vs MFP; local-only).
    Compiled + Jest 108, **not committed/deployed/device-tested yet**.
  - **Step 2 — Strengthen adaptive TDEE** ✅ **BUILT 2026-08-07** (dead-time comp + confidence-scaled steps;
    engages at 6; sim closes 500 kcal by day 19, no cap-pinning). **+ weigh-in engagement (file 06)** —
    invite/progress/cadence-picker/7-day nudge. Compiled + Jest 117, **not committed/deployed/device-tested yet**.
  - **Step 3 — Smooth earn-to-eat** ✅ **BUILT 2026-08-07** (3-day energy-conserving weighted average
    `[0.5,0.3,0.2]`; `07-smoothed-earn-to-eat.feature`; Jest 125, sw v59). ([[project_workout_smoothing_idea]])
  - **Step 4 — Energy floor (file 01), re-seated** ✅ **BUILT 2026-08-07** — split into a steady-loss **clamp**
    (25% max deficit, body-sized) + a lean-body, training-day **low-fuel warning**; EA-45 dropped as
    unreachable. Jest 142, sw v60. (`ENERGY_MODEL.md` §5.1 for why the draft changed.)
  - **Step 5 — Sustainability: 02 cut-cycling · 03 diet break · 04-rest (no auto-lower on gain-in-deficit)** —
    only meaningful once a cut is a real deficit. **02 is yours to proofread.** **← the actual next build.**
  - **Step 6 — 05 LEA symptom check**, sex-neutral → *"see a healthcare professional."*
  - **Convention:** specs are @draft — implement to the **NUMBERS CONTRACT** (derived worked-examples vs named
    policy constants; exact numbers owned by `logic.test.js`; steps assert observable outcomes). Coach + design +
    QA hats; consultant believability gate before each deploy. Device-testing stays **BATCHED** (one pass later).
    See [[project_energy_safety_workstream]].

- **⏸ DEFERRED (per user) — AI photo→log (v6.7) device-verify.** Already live on Pages; 3 checks remain
  (see Next-up 2), held until the energy-safety build lands and gets its batch device-test.

- **NEW IDEA (parked) — smooth how workouts inflate targets/carbs.** Spread a logged workout's kcals across
  following days (a smoothed curve, tolerant of rest-day clusters *and* back-to-back training) instead of
  same-day "earn to eat" via `totalWorkoutKcal`. Design + coach + maths; tied to the activity-model review.
  [[project_workout_smoothing_idea]].

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
3. **✅ activity-model review — DONE 2026-08-07** (coach + consultant + design). Outcome: flat ×1.2 rejected;
   model locked to **seed → calibrate** (NEAT multiplier + smoothed earn-to-eat). Now Steps 1–3 of the energy
   plan above — no longer a separate later item. Detail: `ENERGY_MODEL.md`. [[project_workout_smoothing_idea]].
4. **🗓️ carb floor** (deferred): clamp carbs to 2 g/kg bodyweight on aggressive cuts, reduce **fat** first
   (to its 0.6 g/kg hormonal floor). Changes the macro split for all cutters — do after the EA floor lands.
5. **Build: more badge categories** (`DOCS §23`: Protein King, Cut Champion, Bulk Mode, Balanced) — reuses
   the v6.5 tier + celebration engine.
6. **Optional / legal:** Cloudflare cron trigger (`LEGAL §13` step 4) — now also drives the committed
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

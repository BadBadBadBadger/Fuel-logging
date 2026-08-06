# Fuel Log — Start Here 🧭

**Updated:** 2026-08-06 (session 11). **Harm-fix DEPLOYED + LIVE:** the adaptive-TDEE "ratchet" could show a
*Maintain* target below resting metabolism (founder's harm report: ~1,650 vs an ~1,859 BMR). Maintenance is
now floored at **sedentary TDEE (BMR × 1.2)** — merged to `main` @ `88a283a`, **live on Pages (sw v56,
verified)**; rollback tag `pre-bmr-floor`. **Strategy (user's call): keep building + deploying the remaining
ENERGY-SAFETY features on the `energy-safety-bmr-floor` branch; device-test ALL feature files together in one
pass later** (no per-feature device check). AI photo→log verify stays deferred until after.

Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

**Git:** `main` @ `88a283a` = the harm-fix, **live on Pages**. Ongoing energy-safety work continues on branch
**`energy-safety-bmr-floor`** (checked out). Parked `targets-bmr-floor-wip` **deleted**. Rollback tag
`pre-bmr-floor` (pre-fix `main`).

- **✅ DEPLOYED — Energy-safety piece 1 of 5: the BMR × 1.2 maintenance floor** (part of feature 04).
  Maintenance floored at **BMR × 1.2, maintain-only** — a deliberate cut may still sit below it, backstopped
  by SAFE_MIN. `calcTargets` floor + `bmrFloorApplied`; effective TDEE floored in Profile/weigh-in/dashboard;
  *"Held at your minimum maintenance"* note + dashboard banner; custom-target warning baseline floored. Stale
  `calcTargets` test mirror resynced (it tested a ×1.375 formula the app never ran) + BMR-floor tests →
  **Jest 107/107**; `fuel-log.feature` flat guard reframed as a backstop + new maintenance-floor Feature.
  **sw v56.** Verified: 1631 → 2231. See [[project_targets_bmr_floor]].

- **◀ NEXT — build + deploy the remaining energy-safety features** (`features/energy-safety/`, all `@draft`),
  on the branch, merging + deploying as each lands. **Device-testing is BATCHED** — the user will test every
  feature file in one pass later, so DON'T stop for a per-feature on-device check; just keep Jest green,
  merge, deploy. **4½ features left to deploy:**
  - **01 — Energy-availability floor** (30 kcal/kg FFM; target 45) that *replaces* the flat SAFE_MIN for every
    mode, + warning bands: green ≥45 · amber "Low fuel" chip+sheet 30–45 · red "Held at safe minimum" <30.
    Strictest floor wins (`max()`). *(The BMR × 1.2 maintain floor above is the first slice of the same model.)*
  - **02 — cut-cycling:** time-boxed blocks (soft 8 wk / hard 12 wk / 5 %-loss triggers; leaner → earlier);
    cumulative-cut escalation. **02 is yours to proofread.**
  - **03 — diet break** as a first-class mode (2 wk at true maintenance, ratchet paused).
  - **04 (remaining half) — ratchet asymmetry:** weight *gain during a deficit* must NOT ratchet targets down —
    flag + offer a diet break; recomp / muscle-gain not misread as a lower metabolism.
  - **05 — LEA symptom check**, sex-neutral → *"see a healthcare professional."*
  - **Convention:** specs are @draft — implement to the **NUMBERS CONTRACT** (derived worked-examples vs named
    policy constants; exact numbers owned by `logic.test.js`; steps assert observable outcomes). Coach + QA
    hats. Suggested order: 01 → 03 → 04-rest → 02 → 05 (floor & break first; cut-cycling/symptoms build on
    them). See [[project_energy_safety_workstream]].

- **⏸ DEFERRED (per user) — AI photo→log (v6.7) device-verify.** Already live on Pages; 3 checks remain
  (see Next-up 2), held until the energy-safety build lands and gets its batch device-test.

- **NEW IDEA (parked) — smooth how workouts inflate targets/carbs.** Spread a logged workout's kcals across
  following days (a smoothed curve, tolerant of rest-day clusters *and* back-to-back training) instead of
  same-day "earn to eat" via `totalWorkoutKcal`. Design + coach + maths; tied to the activity-model review.
  [[project_workout_smoothing_idea]].

## Next up (in order)

1. **◀ Build + deploy the remaining energy-safety features** — 01 EA floor · 02 cut-cycling · 03 diet break ·
   04-rest ratchet asymmetry · 05 LEA check (see Right-now for the suggested order). Merge + deploy as each
   lands (keep Jest green); **batch the on-device test of all feature files once the set is complete.**
2. **Batch device-test everything** — the whole energy-safety set AND the still-open AI-capture (v6.7) checks
   in one pass (hard-reload first, PWA cache): (a) v55 optional follow-up flow; (b) ⚐ Report-wrong opens a
   prefilled email; (c) + Log all lands in today's food; plus the energy-safety UI (EA warning bands, diet-break
   mode, symptom check, "Held at your minimum maintenance"). When green, flip `@wip` on the AI-capture + two
   v6.6 features in `fuel-log.feature`. **Then bind `RATE_LIMIT` KV** (ops blocker below) before any launch.
3. **🗓️ activity-model review + workout→target smoothing** (own coach session): flat ×1.2 vs activity-picker
   vs event-based; the workout-smoothing idea above. [[project_workout_smoothing_idea]].
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
  build**; run `npx jest` (currently **107/107**).
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

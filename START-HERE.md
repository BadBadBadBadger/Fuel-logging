# Fuel Log — Start Here 🧭

**Updated:** 2026-06-25 (session 9 — **AI meal-capture pipeline (v6.7) BUILT, MERGED to `main` + LIVE on Pages; device-tested, partially verified.** Inline 🎤 **voice** (on-device Web Speech API, transcript-only), 📷 **photo** (downscaled ≤1024px in memory, vision once, **never stored**), and an **optional confidence follow-up** layer (≤2 chips when kcal-weighted conf <80%, ranked by `kcal×(100−conf)`). Per-meal **`source`** + **`followups`** persisted (no media); **`runCalibration`** confidence-weights intake + drops <50% days; **⚐ Report-wrong** → mailto (Play GenAI). Coach + launch `# OPEN` blocks resolved (DOCS §37 v6.7). **Merged via `--no-ff` (rollback tag `pre-ai-capture-v67`); then 4 device-test fixes shipped: v52 confidence-fraction normaliser (`normConf` — vision returned 0.72 not 72), v53 cooking-fat chips reframed around added fat (egg-sensible), v54 dairy-aware copy (no "butter" for vegan/dairy-free), v55 follow-ups made OPTIONAL (removed the forced Skip tap — log buttons always visible).** Tests **103/103**, sw **v50→v55**. **No worker change, no Supabase migration** (`source`/`followups` are local-only). **Then started a NUTRITION bug (targets): maintenance target shown BELOW BMR — diagnosed (adaptive `tdeeAdj` ≈ −582 with no BMR floor) and BMR-floor fix written, but it's PARKED on branch `targets-bmr-floor-wip` (pushed), NOT built/tested/shipped — see "⏸ PAUSED HERE" below.** *Prev session 8: spec-only scoping. Prev session 7: v6.6 data-integrity + Separated-confidence (DB migration applied).* · **One screen: where we are, what's next, which doc for what.**
Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

- **⏸ PAUSED HERE (session 9, end) — TARGETS BUG: maintenance below BMR.** A user in **Maintain** (98.5 kg,
  172 cm, 30% BF → LBM 69, **BMR ≈ 1859**) was shown a **1650 kcal** target — *below resting metabolism,
  physiologically impossible as maintenance*. **Root cause CONFIRMED** (user checked Profile): the **adaptive
  `tdeeAdj` (≈ −582)** dragged it down and the only floor was the flat `SAFE_MIN` 1400, which sits below BMR.
  The 51 g carbs were a **symptom** (carbs are the leftover, bottomed out on their 50 g min) — fixing kcal
  restores them. **Fix written** (BMR floor: the adjustment can lower TDEE toward BMR but never below it;
  intentional *cut* deficits below BMR still allowed): in `calcTargets`, the dashboard `effectiveTDEE`, and the
  Profile/weigh-in TDEE displays (+ "Held at BMR" note). **⚠️ STATE: on branch `targets-bmr-floor-wip` (pushed),
  `app.jsx` ONLY — NOT rebuilt to `app.js`, NOT tested, NOT merged.**
- **⚠️ KEY FINDING — the `calcTargets` test mirror is STALE.** `__tests__/logic.test.js` mirrors an OLD
  formula (activity multiplier **×1.375** + `training`/`sessKcal` bonus); the shipped app uses **flat ×1.2 +
  `totalWorkoutKcal`**. So those unit tests validate a formula the app doesn't run — *that's why no test caught
  maintenance < BMR*. **Next session MUST: (1) `git checkout targets-bmr-floor-wip`; (2) resync the mirror to
  the real ×1.2 + BMR-floor formula and fix/replace the ~10 dependent tests; (3) add BMR-floor tests (the spec
  the user handed over); (4) `npx babel app.jsx --out-file app.js`; (5) bump sw (v55→v56); (6) full Jest green;
  (7) merge → push → deploy.**
- **NEW IDEA (user, session 9 end) — smooth how workouts inflate targets/carbs.** Today workout kcals are
  added to the *same day's* target ("earn to eat") via `totalWorkoutKcal`, so over-eating those earned kcals
  erodes weight loss / recomp. User wants a **multi-day smoothed curve**: spread a logged workout's energy over
  following days, tolerant of **rest-day clusters AND consecutive workout days**. This is a design + coach +
  maths task, closely tied to the **activity-model review** below — treat them together. *Not started; captured
  in `[[project_workout_smoothing_idea]]`.*
- **Decisions locked this session:** BMR floor **now**; **carb floor** (spec scenario 5: clamp carbs to 2 g/kg,
  reduce fat first) **deferred** to a follow-up; **activity-model review** (×1.2 vs activity-level vs
  event-based, now + the workout-smoothing idea) **queued as its own coach session** — do not bundle into the
  bug fix.

- **Phase:** B — Compliance & data rights — is **LIVE and verified** (`main` @ Phase B, 2026-06-10;
  rollback point `8622d24`). Consent gate fires, consent recorded, existing data intact. Engineering
  deploy is effectively complete. *Phases 0 & A deployed before it.*
- **Product (session 4, 2026-06-12):** session-3 features **#2–#8 are SHIPPED + VERIFIED on device**
  (see feature-track note below). New **app icon** shipped (`icon-192/512.png` regenerated from
  `logo-master.png`, sw `v36 → v37`). Tests **70/70 green**.
- **Shipped v6.3 (session 5, 2026-06-12, device-verified + merged to `main`):** **independent
  per-field display units** on Profile (weight {kg, st+lb, lb}, height {cm, ft+in, in} — chosen
  separately per beta feedback that UK users mix; storage stays metric) + an **allergen/preference
  auto-select safety fix** (`TagField` Enter resolves to the canonical preset, restoring the allergen
  synonym scan). Unit fields use a self-contained `MeasureField` (seed-once local buffers,
  remount-on-unit-switch) with **contextual-zero** handling — blank when a measurement is unset, but a
  real 0 (12 st 0 lb / 5 ft 0 in) is shown. Tests **85/85**, sw `v37 → v41`, BDD scenarios verified,
  DOCS **v6.3**. The previously-held **v37 app-icon** commit went to `main` in the same merge.
- **AI capture (session 9, 2026-06-25 — v6.7 LIVE on `main` + Pages, `@wip` until verify finishes):**
  voice + photo + optional confidence follow-ups + report-wrong + calibration safeguard. Merged `--no-ff`
  (rollback tag **`pre-ai-capture-v67`**). Both `# OPEN` blocks resolved (coach: threshold
  `INTAKE_FLAG_BELOW` 80, impact-ranked top-2, 3-question bank; launch: reuse premium gate + worker cap,
  mailto report). **No worker change, no Supabase migration.** Tests **103/103**, sw **v55**.
- **Device-test fixes shipped this session (v52→v55):** v52 `normConf` (vision returned confidence as a
  0–1 fraction → showed "0.72%"); v53 cooking-fat chips reframed around **added fat** (was nonsense for
  eggs); v54 **dairy-aware** copy (no "butter" for vegan/dairy-free); v55 follow-ups made **optional** —
  removed the forced "Skip" tap, log buttons always visible (usability fix, see [[feedback_minimise_taps]]).
- **Still UNVERIFIED on device (pick up here):** (1) v55 optional-follow-up flow feels right; (2) **⚐
  Report-wrong** opens an email; (3) **+ Log all** actually lands in **today's food**. Then flip `@wip` on
  the AI-capture feature (and the two v6.6 features) in `features/fuel-log.feature`.
- **⚠️ Ops blocker before launch (not code):** the worker's **`RATE_LIMIT` KV namespace is still unbound**,
  so the daily AI cap is a **no-op** — and vision (photo) calls cost more than text. Bind it (worker →
  Settings → Bindings → KV, var name `RATE_LIMIT`) + keep the Anthropic Console spend cap. (launch hat)
- **⚠️ PWA cache gotcha (confirmed live this session):** an installed PWA keeps serving the **old cached
  bundle** until a full SW cycle — backgrounding isn't enough. To get a new `sw.js` version, fully close &
  reopen the app (or hard-reload). This bit us mid-test (saw stale "0.72%" after the fix was already live).
- **⚠️ Spec deviation (intentional):** photo uses a file input with `capture="environment"`, so "camera
  denied → button unavailable" became "degrades to gallery / type / dictate"; Gherkin reworded to match.
- **Badges still queued:** **more badge categories** (backlog) — the next clean build after AI capture is
  fully verified.

## Next up (in order)

0. **✅ DONE — light mode (v6.4) + celebration redesign (v6.5), shipped to `main`, session 6.**
   Light: system-aware + 3-way 🌙/☀️/🖥️ toggle, CSS-variable palette (DOCS §35). Celebration: one
   rarity-scaled engine — quiet 🔥 **thumb-zone pip** on daily log, Bronze/Silver **toast + 🏆 glow**,
   Gold+ **fanfare** (count-up, ~2.5s, silent); old streak/milestone overlays deleted; **frozen
   dashboard/Account headers**; **`?dev`** test harness (DOCS §36). New **design-lead persona** ("design
   hat"/"UX hat"). **One on-device follow-up still open:** confirm the *live* OS dark/light flip applies
   mid-session in the installed PWA (the one light-mode scenario not verifiable by trace).
1. **✅ DONE — PWA manifest icon fix (v6.5.1), session 7.** Split into 4 entries (full-bleed `any`
   + 80% `maskable`), `make-icons.js` emits both, relative `scope`, `start_url` **relative**, sw v49,
   `?sw` localhost override. DevTools → Application → Manifest shows **Installable** ✓.
   **Deferred (non-blocking):** add manifest `screenshots` (1 `wide` + 1 mobile) for the richer install
   UI — folded into the Play store-listing work (launch hat). **TWA/Play (absolute `start_url` +
   `assetlinks.json` + Bubblewrap) is BLOCKED on a production domain** — use the **launch hat**.
2. **✅ DONE — v6.6 bugfixes (session 7), shipped to `main` (`03fb831`), DB migration applied.**
   (1) Meal **data integrity**: AI "Log all" stores full **`elements[]`** (name+kcal+macros+`conf`) as
   truth; coach reads structured elements, not the truncated display string. (2) **Confidence "Separated"**:
   `EST. BUDGET · N%` on the budget only (50/65/80/92 by weigh-in tier), intake exact, quiet flag on
   guess-heavy days (<80%), coach never sees confidence. Tests **90/90**, sw v50, DOCS v6.6. **Open
   follow-up:** device-verify on `:8080` then flip the `@wip` on the two new Gherkin features (data
   integrity + confidence) in `features/fuel-log.feature`.
3. **◀ NOW — finish the TARGETS BMR-floor fix** (paused mid-work; see "⏸ PAUSED HERE" above). Steps:
   `git checkout targets-bmr-floor-wip` → **resync the stale `calcTargets` test mirror** to the real ×1.2 +
   BMR-floor formula (fix the ~10 dependent tests) → **add the BMR-floor tests** from the user's handed-over
   Gherkin (maintain ≥ BMR; no deficit in maintain) → rebuild `app.js` → bump sw **v55→v56** → full Jest green
   → merge → push → deploy → device-verify the user's own profile now shows maintain ≥ BMR. (Rollback tag for
   the whole v6.7 line is still `pre-ai-capture-v67`.)
4. **◀ THEN — finish device-verifying AI capture (v6.7), already LIVE on Pages.** Voice transcript + photo
   recognition **confirmed working** on device this session. **3 checks left** (on the live github.io site,
   premium account, **hard-reload first** to dodge the PWA cache): (a) the v55 **optional** follow-up flow
   feels right; (b) **⚐ Report-wrong** opens a prefilled email; (c) **+ Log all** lands in **today's food**.
   When green, **flip `@wip`** on the *AI meal capture* feature (and the two v6.6 features) in
   `fuel-log.feature`. **Then bind the `RATE_LIMIT` KV** (ops ⚠️ above) before any real launch.
   *Rollback if needed:* `git reset --hard pre-ai-capture-v67 && git push --force-with-lease origin main`.
5. **🗓️ Queued — activity-model review + workout→target smoothing (own coach session).** Revisit
   `TDEE = BMR×1.2` (flat sedentary) vs an activity-level picker vs event-based; AND the user's idea to
   **spread workout kcals across days as a smoothed curve** (tolerant of rest-day clusters / back-to-back
   training) instead of inflating the same day's target. See [[project_workout_smoothing_idea]]. Coach + design + maths.
6. **🗓️ Deferred — carb floor (spec scenario 5):** clamp carbs to 2 g/kg bodyweight on aggressive cuts,
   reduce **fat** first (down to its 0.6 g/kg hormonal floor). Changes the macro split for all cutters —
   do deliberately, after the BMR-floor fix lands.
7. **▶ Build: more badge categories** — backlog feature (`DOCS §23`): Protein King, Cut Champion, Bulk
   Mode, Balanced. Reuses the v6.5 tier + celebration engine — mostly metric calcs + data.
8. **Optional, deferred:** Cloudflare cron trigger (`LEGAL_ROADMAP §13` step 4 — nothing depends on it).
9. **Optional, safe:** test **"Download my data"** (`§13` step 6). ⚠️ **Never test "Delete my account"
   on your real account** — use a throwaway Google account.
10. **Before Play submission:** narrow Art. 9 consent-wording review (`§7` tier 7g — downgradeable to a
   self-assessment + free ICO steer; Anthropic transfer mechanism already **resolved**, `§8`) **+**
   ICO fee & correspondence address (risk **R7**: get a PO box / virtual address *before* registering
   so your home address stays off the public register).

> **Feature track (parallel to legal, last touched 2026-06-12 session 4):** triaged product backlog
> lives in `DOCS.md §23`.
>
> **Session-3 features #2–#8 are SHIPPED + VERIFIED.** Built session 3 (sw `v33 → v36`), deployed live
> to `origin/main`, tests **70/70 green**. On-device verification (Pixel 7) **complete 2026-06-12**:
> - ✅ **#2 Quick Add AI estimate** — milk-while-vegan now fills correctly (v36 fix confirmed; the old
>   false-"✓ Filled"-with-blanks bug is gone).
> - ✅ **#3 repeat-add** — `✓ Added` tick + re-blink confirmed.
> - ✅ **#5/#6 coach** — state-aware (avoided re-suggesting logged foods) + safe pacing confirmed.
> - ✅ **#7 macro floors** — low custom target shows "FLOORS KEPT" warning (saving not blocked).
> - ✅ **#8 dietary/allergies** — diet filter keeps suggestions on-diet; declared-allergen log flags ⚠️.
> - ⏸️ **#4 haptics — DEFERRED to native/Play packaging.** `navigator.vibrate` is a silent no-op on
>   mobile Chrome / Pixel 7 (confirmed via isolation test — platform, not our code). `haptic()` left in
>   as a feature-detected no-op. **Do not re-debug web haptics.** (Debug page recoverable at git `9f4b54f`.)
>
> **Bookkeeping done this session:** `@wip` tags flipped in `features/fuel-log.feature` (only the
> celebration redesign + deferred haptics keep `@wip`); superseded proportional-scaling scenario
> deleted; `DOCS.md` changelog written (new **v6.2** entry). **Not yet committed.**
>
> **Next (feature track):** **celebration redesign → one engine** (`features/fuel-log.feature`, `@wip`) —
> decided + specced, NOT built. The sole remaining backlog feature.
>
> **Stray file:** `features/_inbox.feature` (untracked BDD staging placeholder) — keep or bin.
>
> **Housekeeping:** branch `phase-b-compliance` is **pushed** to `origin` and tracking it; the exposed
> PAT was **deleted on GitHub**. **DB migration + worker deploy are DONE** (consent columns live; worker
> serves `/delete-account` + sweep). **⏳ TODO later (optional):** Cloudflare cron trigger `0 3 * * 0`
> (`§13` step 4) — deferred, nothing depends on it yet.

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

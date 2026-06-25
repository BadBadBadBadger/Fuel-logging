# Fuel Log — Start Here 🧭

**Updated:** 2026-06-25 (session 9 — **AI meal-capture pipeline BUILT (v6.7), not yet device-verified or committed.** Implemented in `app.jsx` + built: inline 🎤 **voice** (on-device Web Speech API, transcript-only, hides when unsupported/denied), 📷 **photo** (downscaled ≤1024px in memory, vision once, **never stored**, discarded on save), and a **confidence-gated follow-up** layer (≤2 skippable chips when kcal-weighted conf <80%, ranked by `kcal×(100−conf)`, deterministic offline refine). Also: per-meal **`source`** flag + **`followups`** persisted (no media ever); **`runCalibration`** now confidence-weights intake + drops <50% days so AI guesses can't retrain TDEE; **⚐ Report estimate as wrong** → prefilled mailto (Play GenAI policy). Coach + launch `# OPEN` blocks **decided & recorded** (DOCS §37 v6.7). Tests **100/100** (+10), sw **v50→v51**, scenarios folded into `features/fuel-log.feature` (`@wip`, device-verify pending); `ai-capture.feature` kept as design-rationale only. **No worker change** (forwards `messages` verbatim, model vision-capable). *Prev session 8: spec-only scoping of the same pipeline. Prev session 7: v6.6 data-integrity + Separated-confidence bugfixes (DB migration applied).* · **One screen: where we are, what's next, which doc for what.**
Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

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
- **AI capture (session 9, 2026-06-25 — BUILT v6.7, in working tree, NOT committed, NOT device-verified):**
  voice + photo + confidence follow-ups + report-wrong + calibration safeguard all implemented and built
  (`app.jsx` → `app.js`), sw v51, DOCS §37 v6.7, **tests 100/100**, scenarios in `fuel-log.feature` (`@wip`).
  Both `# OPEN` persona blocks resolved (coach: threshold = `INTAKE_FLAG_BELOW` 80, impact-ranked top-2,
  3-question bank; launch: reuse premium gate + worker cap, mailto report). **Automated checks green**
  (babel build, `node --check`, dev server serves). **Pick up at device-verify + the two ⚠️ below.**
- **⚠️ Ops blocker before launch (not code):** the worker's **`RATE_LIMIT` KV namespace is still unbound**,
  so the daily AI cap is a **no-op** — and vision (photo) calls cost more than text. Bind it (worker →
  Settings → Bindings → KV, var name `RATE_LIMIT`) + keep the Anthropic Console spend cap. (launch hat)
- **⚠️ Spec deviation (intentional):** photo uses a file input with `capture="environment"` (robust PWA
  path), so "camera denied → button unavailable" became "degrades to gallery / type / dictate"; the
  Gherkin scenario was reworded to match reality.
- **Badges still queued:** **more badge categories** (backlog) remains the next clean build after AI
  capture is verified + committed.

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
3. **◀ NOW — device-verify + commit AI capture (v6.7).** Built, not yet on a device or in git. On
   `:8080` (premium account): dictate a meal (transcript appears, no audio sent) · photograph a plate ·
   log a vague meal ("salad") to trigger ≤2 chips · answer vs **Skip** · confirm **⚐ Report estimate as
   wrong** opens a prefilled email. Then **commit** the working tree (`app.jsx`/`app.js`/`sw.js`/`DOCS.md`/
   `features/*`/`__tests__/*`). When green, flip `@wip` on the new *AI meal capture* feature in
   `fuel-log.feature`. **Then bind the `RATE_LIMIT` KV** (ops ⚠️ above) before any real launch.
4. **▶ Build: more badge categories** — backlog feature (`DOCS §23`): Protein King, Cut Champion, Bulk
   Mode, Balanced. Reuses the v6.5 tier + celebration engine — mostly metric calcs + data. **The clean
   build after AI capture is verified.**
5. **Optional, deferred:** Cloudflare cron trigger (`LEGAL_ROADMAP §13` step 4 — nothing depends on it).
6. **Optional, safe:** test **"Download my data"** (`§13` step 6). ⚠️ **Never test "Delete my account"
   on your real account** — use a throwaway Google account.
7. **Before Play submission:** narrow Art. 9 consent-wording review (`§7` tier 7g — downgradeable to a
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

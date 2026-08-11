# Fuel Log — Start Here 🧭

**Updated:** 2026-08-11 (session 16). **Jest 236/236 · Playwright 57/57 · sw v70 · `main` — LIVE.**

> ## ▶ START HERE
>
> **The energy-safety workstream is MERGED AND DEPLOYED.** Steps 1–5 of `ENERGY_MODEL.md` are live on
> Pages, including the auto-lowering fix that closes the original harm. Rollback tag:
> **`pre-energy-safety`**. `cut_break_load` is run on Supabase. File 05 is **SHELVED** (see below).
>
> **Session 16 added a Playwright UI suite: `npm run test:ui`.** It covers all of `DEVICE-TEST.md`
> Part B in about twenty seconds — the cut bar, the break, the guard, the stall, the auto-lowering
> card — plus the Quick Add fix and a render/theme smoke pass. **`PLAYWRIGHT-PLAN.md` is its live
> status doc.** Run it before testing by hand; it is far cheaper to find a break there.
>
> **The one job left is still to test it on the phone: `DEVICE-TEST.md`.** The suite cannot tell you
> anything about *this device* — iOS Safari, PWA install, service-worker cycling, haptics. Fully close
> and reopen the PWA first or you're still on an old bundle. One open question is parked in that file
> — whether *"Below your resting metabolism"* should become a one-time acknowledgement, since it
> currently shows for every sedentary cutter forever.
>
> ⚠️ **Never sign in for real on `preview.html`.** A faked clock plus a real account wrote
> future-dated `food_logs` to Supabase once, and they were waiting when the real date arrived. This is
> now enforced in code — no Supabase client and no Google Identity on the harness, and `sb()` refuses
> whenever `dev_date_offset` is set. Use the 🔓 **Premium** toggle in the toolbar instead.
>
> ⚠️ **Reminder learned the hard way, again, on 2026-08-09:** running the *whole* schema file against
> the live database fails on `CREATE POLICY` (42710) and the single-transaction rollback silently
> takes your new `ALTER TABLE` with it. Run the one line you need, on its own.

---

## For a fresh Claude session — read this, then stop

To avoid burning credits rediscovering things: **this file alone is enough to start work.** Do not grep
the repo for orientation. Open further docs only when the task actually needs them:

| Task | Read |
|---|---|
| Anything touching calorie targets | `ENERGY_MODEL.md` §5, §5.1, §5.2, §5.3 — **mandatory, it owns the model** |
| Building an energy-safety feature | that one `.feature` file + `ENERGY_MODEL.md` §5 |
| Product behaviour / changelog | `DOCS.md` §37 |
| Legal, privacy, deploy checklist | `LEGAL_ROADMAP.md` |
| Known bugs & severities | `ARCHITECTURE_REVIEW.md` |
| Writing or running UI tests | `PLAYWRIGHT-PLAN.md` — coverage, status, and the traps |

**House rules that will bite you if you skip them:**
- `app.js` is **generated** — edit `app.jsx`, then `npx babel app.jsx --out-file app.js`. Never edit `app.js`.
- **Bump `sw.js` cache version on every build** (`const CACHE = "fuel-log-vNN"`). Currently **v67**.
- Run `npx jest` before claiming anything works. Currently **213/213**.
- Only `useState`/`useEffect` are available as React hooks. Storage keys use `__`, not colons.
- Exact numbers live in `__tests__/logic.test.js`, which **mirrors** the pure functions from `app.jsx`.
  Change a constant in one, change it in both.
- **Write plainly. Banned words — "clamp" and "gate" (as a verb)** — not in docs, specs, comments, or
  chat. Both have been removed repeatedly and both crept back, because they were seeded through **code
  comments**, so each new session re-read and copied them. If you sweep one, sweep the comments too.
  Say what actually happens instead:
  - *clamp* → a rule either **moves your target** (*"raises the target to the floor"*) or it **only
    warns** (*"warns, never changes the target"*). Survives only as an identifier in `seed-data.js`.
  - *gate* → name the condition: *"the bar appears once your load reaches a week's worth"*, *"shown
    only to lean bodies"*, *"never make log/save wait on it"*. Still fine as the **name of a thing**:
    the premium gate (paywall), consent gate (sign-up), believability gate (the pre-ship check against
    MyFitnessPal, defined in full at `ENERGY_MODEL.md` §4).

  Same rule for any other jargon noun: if a plain sentence needs more words, use more words. When the
  founder says a word means nothing to him, that's the signal — fix the word everywhere, not just in
  the reply.

---

## Where the code is

`main` @ `efad462` is what is **live on Pages** (sw **v70**), deployed 2026-08-11: the whole
energy-safety workstream (Steps 1–5), the Quick Add fix, the weigh-in reporting fix, and the AI
capture follow-up fix. Rollback tag **`pre-energy-safety`** is the state before the workstream
(`88a283a`, sw v56, the BMR×1.2 maintenance floor alone). The branch `energy-safety-bmr-floor` is
merged and can be deleted once the device test passes.

**Three user-visible changes went out in v69–v70 and none has been seen on a phone yet:**
1. The weight card no longer says *"your logged results match the estimate"* when it has in fact
   refused to lower the target — it now says the scale disagrees, and why.
2. The stall card reports how long the scale has really been flat, not a fixed "three weeks".
3. AI capture asks portion questions in units the food has (glasses / spoons / hand sizes) and
   never asks about an item under 75 kcal.

**Deployed ≠ verified on a device.** The UI suite now covers Part B of `DEVICE-TEST.md`, so the
behaviour is verified in a real browser — but nothing here has been used on a real *phone*, and the
suite cannot speak to iOS Safari, PWA install, service-worker cycling or haptics.

| Step | What changed | State |
|---|---|---|
| 1 | Flat BMR×1.2 → a 4-chip lifestyle (NEAT) multiplier, 1.20–1.55, seeding a believable target | ✅ live |
| 2 | Adaptive TDEE converges properly (no more cap-pinning) + the app *invites* weigh-ins | ✅ live |
| 3 | A workout's calories spread forward over 3 days instead of unlocking the same day | ✅ live |
| 4 | A body-sized **steady-loss floor** replaces the flat safe minimum; energy availability becomes a **warning**, not an override | ✅ live |
| 5a | A cut runs as **load-weighted blocks** that prompt a diet break (file 02) | ✅ live |
| 5b | A break is **time not cutting** — the load bar drains while you rest; plus the **stall check**; minus the rolling-year track (file 03) | ✅ live |
| 5c | **The auto-lowering fix** — the app only lowers its estimate of what you burn when you're *not* cutting (file 04). The original harm, closed. | ✅ live |

---

## The seven energy-safety feature files — what's actually left

The `features/energy-safety/` numbering confuses everyone (it confused us). Plain state:

| File | What it does | State |
|---|---|---|
| 01 energy floor | steady-loss floor + low-fuel warning | ✅ live |
| 02 cut cycling | load-weighted blocks + diet-break prompts | ✅ live |
| 03 the break bar | a break is just *not cutting*; the load bar drains pro-rata over 14 rest days, + the stall check | ✅ live |
| 06 weigh-in engagement | invites check-ins, cadence picker | ✅ live |
| 07 smoothed earn-to-eat | workout kcal spread over 3 days | ✅ live |
| 04 **first half** | *Maintain* floored at BMR × 1.2 | ✅ live |
| 04 **second half** — *"the auto-lowering fix"* | the app only lowers its estimate of what you burn when you're *not* cutting | ✅ live |
| 05 symptom check | asks how you're feeling after a long under-eat | 🗄️ **SHELVED** (founder, 2026-08-09) |

> **Terminology fix:** earlier notes called the last unbuilt half of file 04 **"04-rest"**. That name meant
> nothing. It is **the auto-lowering fix** — use that. It was the exact mechanism that caused the founder's
> harm: `runCalibration` read *"weight went up while eating in a deficit"* as *"your metabolism is slower"*
> and lowered the target. Water, glycogen and a full gut look identical to fat gain over one week.
> **Closed 2026-08-09** — the correction is now one-directional while cutting (`ENERGY_MODEL.md` §5.4).

**Note on `@draft` tags:** 06 and 07 still carry `@draft` and 04 says so in a comment, but **their code is
built**. The tag is stale, not a to-do. Clear the tags during the device test (`DEVICE-TEST.md`).

---

## Right now

**Session 16 fixed Quick Add and built a UI test layer.** The "Reset to defaults" button that wiped a
whole meal library on one tap is gone, deletes now propagate to the cloud instead of silently
resurrecting, and a one-time revive restores what the button wiped (`DOCS.md` §37). Deployed as
sw **v68**. Then: **38 Playwright tests** through the preview harness, covering all of Part B plus a
render/theme smoke pass — see **`PLAYWRIGHT-PLAN.md`**.

That run found **no production bugs**, but three defects worth knowing: the harness never applied a
saved theme (it had borrowed `index.html`'s CSS but not its theme init — *fixed*); `DEVICE-TEST.md`
seeded a **UTC** day key while the app reads a **local** one, which silently mis-seeds between 00:00
and 00:59 BST (*fixed*); and its B6 fixture cleared the stall check's history requirement by exactly
one weigh-in (*fixed, now 30 days*).

**Session 15 shipped the whole workstream.** Built file 03, rewrote and built file 04, shelved 05,
merged to `main` and deployed. Jest **213/213**, sw **v65**. The remaining job is `DEVICE-TEST.md`.

**Two bugs were caught by actually running it, not by the tests** — both worth remembering, because
213 green unit tests said nothing about either. (1) The preview harness had **no theme CSS at all**,
so every colour variable resolved to nothing and the UI flattened to white-on-dark; it now borrows
`index.html`'s block instead of keeping a copy that would drift. (2) The break bar announced *"ON A
BREAK · STARTING TODAY — about 14 days to fully recharged"* **on a fresh install with nothing logged**,
because Cut is the default mode, so opening the app for one day opened a block — and the pro-rata drain
then needed a full fortnight to clear that one day. Fixed with `CUT_BAR_MIN_LOAD` (7): the counter still
runs from day one, but the app stays quiet until there's about a week of real cutting to talk about.

**What file 03 does.** A break is simply **not cutting** — the mode picker is the only mode surface, nothing
ever switches for you, and there is no break state to fail at. 02's cut load became a **bar read in two
directions**: it fills while cutting and drains while not, by `loadAtBreakStart × (1 − restDays ÷ 14)`,
so 14 rest days clear any block, 7 clear half, and a partial break keeps its dent. Maintain and Bulk
drain identically. One guarded action (back to Cut mid-break, only past the soft threshold — Bulk never);
one "Recharged" card that self-retires after 3 days, then silence.

**Two things changed at proofread, both the founder's calls.** (1) **The rolling-year track is gone** —
`CUMULATIVE_CUT_ESCALATE` / `MAINTENANCE_DECAY` removed outright. It escalated after ~a year of dieting,
which measures the wrong thing: harm tracks energy availability and bodyweight lost, not calendar time
under a mild deficit. (2) **The stall check replaces it** — cutting 3 weeks with a flat scale opens 02's
soft nudge with blameless copy ("your loss has stalled"). That's the honest trigger, and it aims at the
person who needs it rather than at everyone who's been at it a while. Full reasoning: `ENERGY_MODEL.md` §5.3.

**Session 15 then rewrote file 04 in plain English and BUILT it — Step 5 is complete.** Jest **213/213**,
sw **v65**. The rewrite found that three of 04's four protections had already shipped, and that its draft
contradicted 03 in two places (a card with mode buttons; a duplicated break recommendation) — both fixed.
The one real piece left was **the asymmetry**, and it closes the original harm: *the app only lowers its
estimate of what you burn when you are NOT cutting.* While your target sits below maintenance a
disappointing scale never moves the number down — not on a gain, not on a stall. In Maintain or Bulk it
does, because there the evidence is clean. Raising is never slowed. Nothing is lost: an over-estimate
surfaces as a stall → the stall check suggests a break → a break is Maintain, where the correction runs.
Two new cards: *"Weight up while eating less than maintenance"* and *"Below your resting metabolism"*.
Reasoning: `ENERGY_MODEL.md` **§5.4**.

**What 02 does, in one paragraph.** A cut is measured as **cut load**, not calendar days: each day is
weighted by how deep the deficit is, so a gentle cut runs much longer before prompting a break and an
aggressive one is cautioned sooner (~24 / 12 / ~9.5 real weeks at a 10 / 20 / 25% deficit). Whether a day
counts comes from the **declared daily mode** plus a weight-trend backstop — **never from food logs**, so
not logging can't quietly stop the clock. Cards show **real elapsed weeks**, never load. Reasoning and the
rejected alternatives (a 42-day universal cut default; a sleep/fatigue traffic light; folding training load
into the term) are in **`ENERGY_MODEL.md` §5.2** — don't re-litigate them without new evidence.

**Where 02 and 03's code lives** (so you don't have to search): `app.jsx` — constants + `dayCutLoad`,
`cutThresholds`, `trendLossFrac`, `stepCutBlock` (the drain lives inside it), `accrueCutBlock`,
`cutPromptFor` (the stall lives inside it), `cutBarFor`, `cutGuardFor`, `rechargedCardDue` in one
commented block after `runCalibration`; state (`cutBlock`), daily accrual effect and `startDietBreak` in
`App`; the bar, the Recharged card and the two prompt cards in `Dashboard` next to the Step 4 warnings;
the guard confirm sits under the mode picker; `syncCutBlock` beside `syncProfile`.

**✅ 02's known deviation is closed.** The prompt button now honestly says **"Start a 2-week break"** —
it switches to Maintain, and the drain gauge is the tracked feedback that makes the promise true.

**⚠️ Soft spot in 02, deliberately left.** When the scale says you're cutting but the mode says "Maintain",
there's no prescribed deficit to measure, so the day accrues at the reference rate (1.0) rather than a
measured one. It's a guess, commented at the accrual site. Fixing it properly needs the 7700 kcal/kg figure
that §4 warns against leaning on.

---

## Next up (in order)

1. **◀ Finish the energy plan** (`ENERGY_MODEL.md` §5): ✅1 activity · ✅2 adaptive-TDEE (+06) · ✅3 smooth
   earn-to-eat · ✅4 energy floor · ✅5a cut cycling (02) · ✅5b the break bar + stall check (03) ·
   ✅5c the auto-lowering fix (04). **Step 6 (file 05, the symptom check) is SHELVED** — the founder
   called it on 2026-08-09, after the structural protections that it sat on top of had all landed.
   **The energy plan is therefore done.** What remains is the `cut_break_load` SQL and the
   **batched on-device test + deploy of every feature file** (2 below).

   > **Why shelving 05 is defensible, so nobody reopens it on a hunch.** 05 was the self-report layer:
   > ask the user how they're sleeping/feeling after a long under-eat, then point at a doctor. Everything
   > underneath it now exists and works without asking anyone anything — the steady-loss floor, the
   > low-fuel warning, the BMR×1.2 maintain floor, load-weighted cut blocks with break prompts, the
   > stall check, and the auto-lowering fix. The one line 05 uniquely owned — *"if you're feeling run
   > down with it, it's worth talking to a doctor"* — is already in the hard break prompt. What is
   > genuinely lost is the ability to catch someone whose numbers look fine but who feels awful; that
   > needs data the app doesn't have and would have to ask for. Worth revisiting only if real usage
   > shows people sailing past every structural guardrail.
3. **◀ Device-test the live release** — the checklist is **`DEVICE-TEST.md`**, written for this go-live
   and deletable once done. It covers what you can check in normal use on your phone, plus Chrome
   console snippets for the time-dependent surfaces (cut blocks, the drain, the guard, the stall) that
   need weeks of history and will otherwise never appear. **Sign out or use incognito before seeding** —
   block state syncs to Supabase and would overwrite your real row. **Fully close and reopen the PWA
   first**, or you're testing v56. When green, clear the stale `@draft`/`@wip` tags and **bind
   `RATE_LIMIT` KV** (blocker below).
4. **🗓️ carb floor** (deferred): hold carbs at 2 g/kg bodyweight on aggressive cuts, reducing **fat** first
   (to its 0.6 g/kg hormonal floor). Its blocker (the energy floor) is built — but "aggressive cut" now needs
   redefining, since a preset can't go deeper than 25%; it really only applies to typed custom targets.
5. **Build: more badge categories** (`DOCS §23`: Protein King, Cut Champion, Bulk Mode, Balanced) — reuses
   the v6.5 tier + celebration engine.
6. **Optional / legal:** Cloudflare cron trigger (`LEGAL §13` step 4) — also drives the Supabase keep-alive
   ping; use **every-3-days** `0 3 */3 * *`, not weekly. Test "Download my data" (`§13` step 6) — ⚠️ **never**
   test "Delete my account" on your real account. Pre-Play: Art. 9 consent-wording review (`§7` 7g) + ICO fee
   & PO-box address (risk **R7**).

---

## Reference — operational facts (don't lose these)

**Git**
- `main` @ `88a283a` = the harm-fix, **live on Pages** (sw v56).
- `energy-safety-bmr-floor` carries Steps 1–5a committed (`2209548` = file 02, `d509d86` = its docs).
- Rollback tags: `pre-bmr-floor` (pre-fix `main`) · `pre-ai-capture-v67` · Phase B → `8622d24`.
- Parked branch `targets-bmr-floor-wip` was **deleted** — superseded, don't resurrect it.

**Gotchas that have already cost time**
- **⚠️ Never re-run `setup/supabase-schema.sql` whole** on the live database. `CREATE POLICY` has no
  `IF NOT EXISTS`, so it fails with `42710` — and because the SQL Editor runs the file in **one
  transaction**, that abort **rolls back every `ALTER TABLE` above it**, so columns you believe you added
  silently don't exist. Run only the `ALTER TABLE` lines, then confirm via `information_schema.columns`.
  Nothing in the file deletes data. (The file's own header now says this.)
- **⚠️ Adding a column to the upsert before it exists in Postgres 400s the whole profile sync**, silently.
  Column first, wiring second. Always.
- **⚠️ PWA cache:** an installed PWA serves the **old bundle** until a full SW cycle — backgrounding isn't
  enough. Fully close & reopen, or hard-reload. (Bit us mid-test with a stale "0.72%".)
- **⚠️ Launch blocker (not code):** the worker's `RATE_LIMIT` KV namespace is **unbound**, so the daily AI
  cap is a no-op — and vision/photo calls cost more than text. Bind it (worker → Settings → Bindings → KV,
  var `RATE_LIMIT`) and keep the Anthropic Console spend cap. (launch hat)
- **Abandoned — do not re-debug:** web haptics. `navigator.vibrate` is a silent platform no-op on mobile
  Chrome / Pixel 7; `haptic()` is left as a feature-detected no-op.

**Cloud sync state**
- ✅ **Synced:** weight, height, body fat, sex, consent columns, `activity`, and the cut-block columns
  (`cut_block_start`, `cut_block_load`, `cut_break_load`, `last_break_end`) via `syncProfile` /
  `syncCutBlock` and the pull-merge. The **rest-day count is derived, not stored** —
  `offRun = 14 × (1 − load ÷ breakLoad)` on pull, so there's nothing extra to drift.
- ✅ **`cut_break_load` was run on Supabase 2026-08-09.** Every synced column above now exists.
- 🪦 **Retired:** `cut_load_year` — the column still exists but nothing reads or writes it (file 03
  removed the rolling-year track). Left in place deliberately; safe to drop by hand if you ever want to.
- ⚠️ **Still local-only:** `weighCadence` (no column), `weigh_nudge_dismissed`, `tdee_adj_log`, and the
  cut-block *working* fields (accrual cursor, prompt dismissals, `rechargedOn`) inside the `cut_block` blob.

**Shipped + verified**
Phase B compliance (consent gate + `/delete-account` + dormant sweep, LIVE 2026-06-10) · session-3 features
#2–#8 · v6.3 per-field units + allergen safety fix · v6.4 light mode · v6.5 celebration engine · v6.5.1
manifest/icon fix · v6.6 meal data-integrity + Separated-confidence · v6.7 AI voice/photo capture (live,
device-verify pending). Product detail + changelog in `DOCS.md`.

---

## Working conventions

**Specs before code.** Each `.feature` file is proofread by the founder, then built to its **NUMBERS
CONTRACT**: worked examples are *derived* from named policy constants, Scenario Outlines use contrasting
rows so a value can't be hardcoded, exact numbers are owned by `logic.test.js`, and steps assert observable
outcomes rather than implementation.

**Hats.** `personas/` holds reusable chat personas — invoke by name. `Admin` (docs), `coach` (nutrition
science — **use for anything advice-touching**), `QA` (BDD/Gherkin), `design`/`UX`, `privacy-counsel`
(legal), `launch` (store submission). The coach hat has a standing veto on health copy.

**Device testing stays BATCHED** — one pass at the end, not per feature.

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
| **personas/** | the reusable chat hats listed above |

---

## How this file stays current (the contract)

This file is the **single source of truth for "where we are."** To stop it drifting:

- **Only `▶ THE ONE NEXT ACTION`, `Right now` and `Next up` are volatile** — they're the session leave-off
  note. Everything durable lives in the owning roadmap; this file points at it.
- **Claude will proactively prompt** you to refresh this file (and flag any other doc that needs updating)
  whenever status changes or a session wraps. You can also just ask for "a docs update" any time.
- **When you finish a chunk of work,** update: this file's three volatile blocks, the relevant checkbox in
  the owning roadmap, and the `DOCS.md` changelog if product behaviour changed.

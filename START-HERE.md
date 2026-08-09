# Fuel Log — Start Here 🧭

**Updated:** 2026-08-09 (session 15). **Jest 209/209 · sw v63 · branch `energy-safety-bmr-floor`.**

> ## ▶ START HERE
>
> **Step 5 is complete — including the fix for the harm that started all of this — and the Supabase
> column is run.** ✅ `cut_break_load` added 2026-08-09; the sync wiring is live-safe.
>
> **The only work left is the batched on-device test + deploy of the whole energy-safety set**
> (Next up 2). Nothing on this branch has ever run on a device. **File 05 is SHELVED** (founder,
> 2026-08-09; see below) — don't start it, and don't treat it as an obligation.
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

**House rules that will bite you if you skip them:**
- `app.js` is **generated** — edit `app.jsx`, then `npx babel app.jsx --out-file app.js`. Never edit `app.js`.
- **Bump `sw.js` cache version on every build** (`const CACHE = "fuel-log-vNN"`). Currently **v63**.
- Run `npx jest` before claiming anything works. Currently **209/209**.
- Only `useState`/`useEffect` are available as React hooks. Storage keys use `__`, not colons.
- Exact numbers live in `__tests__/logic.test.js`, which **mirrors** the pure functions from `app.jsx`.
  Change a constant in one, change it in both.
- **Write plainly. Do not use the word "clamp"** — not in docs, specs, comments, or chat. It has been
  removed repeatedly and keeps creeping back in. Say what actually happens instead:
  a rule either **moves your target** (*"raises the target to the floor"*) or it **only warns**
  (*"warns, never changes the target"*). Same rule for any other jargon noun: if a plain sentence
  needs more words, use more words. (`clamp` survives only as a code identifier in `seed-data.js`.)

---

## Where the code is

`main` @ `88a283a` is what's **live on Pages** (sw v56) — the harm-fix flooring *Maintain* at sedentary
TDEE (BMR × 1.2). Everything since lives on **`energy-safety-bmr-floor`**, **none of it deployed or
device-tested**. The device test is deliberately **batched** into one pass at the end (Next up 2).

| Step | What changed | State |
|---|---|---|
| 1 | Flat BMR×1.2 → a 4-chip lifestyle (NEAT) multiplier, 1.20–1.55, seeding a believable target | ✅ committed |
| 2 | Adaptive TDEE converges properly (no more cap-pinning) + the app *invites* weigh-ins | ✅ committed |
| 3 | A workout's calories spread forward over 3 days instead of unlocking the same day | ✅ committed |
| 4 | A body-sized **steady-loss floor** replaces the flat safe minimum; energy availability becomes a **warning**, not an override | ✅ committed |
| 5a | A cut runs as **load-weighted blocks** that prompt a diet break (file 02) | ✅ committed |
| 5b | A break is **time not cutting** — the load bar drains while you rest; plus the **stall check**; minus the rolling-year track (file 03) | ✅ committed |
| 5c | **The auto-lowering fix** — the app only lowers its estimate of what you burn when you're *not* cutting (file 04). The original harm, closed. | ⚠️ **built, UNCOMMITTED** |

---

## The seven energy-safety feature files — what's actually left

The `features/energy-safety/` numbering confuses everyone (it confused us). Plain state:

| File | What it does | State |
|---|---|---|
| 01 energy floor | steady-loss floor + low-fuel warning | ✅ built |
| 02 cut cycling | load-weighted blocks + diet-break prompts | ✅ built |
| 03 the break bar | a break is just *not cutting*; the load bar drains pro-rata over 14 rest days, + the stall check | ✅ built (uncommitted) |
| 06 weigh-in engagement | invites check-ins, cadence picker | ✅ built |
| 07 smoothed earn-to-eat | workout kcal spread over 3 days | ✅ built |
| 04 **first half** | *Maintain* floored at BMR × 1.2 | ✅ built + **live on `main`** |
| 04 **second half** — *"the auto-lowering fix"* | the app only lowers its estimate of what you burn when you're *not* cutting | ✅ built (uncommitted) |
| 05 symptom check | asks how you're feeling after a long under-eat | 🗄️ **SHELVED** (founder, 2026-08-09) |

> **Terminology fix:** earlier notes called the last unbuilt half of file 04 **"04-rest"**. That name meant
> nothing. It is **the auto-lowering fix** — use that. It was the exact mechanism that caused the founder's
> harm: `runCalibration` read *"weight went up while eating in a deficit"* as *"your metabolism is slower"*
> and lowered the target. Water, glycogen and a full gut look identical to fat gain over one week.
> **Closed 2026-08-09** — the correction is now one-directional while cutting (`ENERGY_MODEL.md` §5.4).

**Note on `@draft` tags:** 06 and 07 still carry `@draft` and 04 says so in a comment, but **their code is
built**. The tag is stale, not a to-do. Clear the tags during the batched device test (Next up 2).

---

## Right now

**Session 15 proofread and BUILT file 03.** Jest **199/199** (27 new), sw **v62**, `app.js` rebuilt,
**uncommitted**. A break is simply **not cutting** — the mode picker is the only mode surface, nothing
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

**Session 15 then rewrote file 04 in plain English and BUILT it — Step 5 is complete.** Jest **209/209**,
sw **v63**. The rewrite found that three of 04's four protections had already shipped, and that its draft
contradicted 03 in two places (a card with mode buttons; a duplicated break recommendation) — both fixed.
The one real piece left was **the asymmetry**, and it closes the original harm: *the app only lowers its
estimate of what you burn when you are NOT cutting.* While your target sits below maintenance a
disappointing scale never moves the number down — not on a gain, not on a stall. In Maintain or Bulk it
does, because there the evidence is clean. Raising is never slowed. Nothing is lost: an over-estimate
surfaces as a stall → the stall check suggests a break → a break is Maintain, where the correction runs.
Two new cards: *"Weight up while eating less than maintenance"* and *"Below your resting metabolism"*.
Reasoning: `ENERGY_MODEL.md` **§5.4**.

**⚠️ One SQL line is owed before any deploy** — see START HERE at the top. `cut_break_load` is the drain
rate; the app writes it now, and an upsert naming a column that doesn't exist 400s and takes the whole
profile sync down. Not urgent (nothing is deployed), but it must precede the batched device test.

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
3. **Batch device-test everything** — the whole energy-safety set AND the still-open AI-capture (v6.7)
   checks in one pass (**hard-reload first** — PWA cache): (a) v55 optional follow-up flow; (b) ⚐
   Report-wrong opens a prefilled email; (c) + Log all lands in today's food; plus the energy-safety UI
   ("Eased to a steady pace", "Low on fuel today", "Held at your minimum maintenance", the cut-cycling
   nudge + hard prompt, and their "Why?" toggles) **and the file-03 surfaces** — the bar filling while
   cutting, the same bar draining on Maintain *and* on Bulk, the guard confirm on the Cut chip (and its
   absence on Bulk), the "Recharged" card, and the stall nudge — **plus the file-04 pair**: "Weight up
   while eating less than maintenance" (needs a rising 2-week trend while in Cut) and "Below your resting
   metabolism" (needs a cut target under BMR that isn't already floored). ✅ The `cut_break_load` SQL is
   done.
   **Note:** the steady-loss floor only *visibly* bites on smaller bodies — to see it, temporarily set a
   ~60 kg profile. Cut-cycling and the drain need a long history to trip naturally, so seed `cut_block` in
   local storage (set `start`, `load`, and for a break `breakLoad` + `offRun`) rather than waiting weeks.
   When green, clear the stale `@draft`/`@wip` tags. **Then bind `RATE_LIMIT` KV** (blocker below) before
   any launch.
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

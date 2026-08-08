# Fuel Log — Start Here 🧭

**Updated:** 2026-08-08 (session 13). **Jest 172/172 · sw v61 · branch `energy-safety-bmr-floor`.**

> ## ▶ START HERE — in this order
>
> **1. Commit the working tree first. Nothing else starts on top of it.** Nine files are modified and
> uncommitted: file 02's build plus the docs sweep. Split it into **two commits** so the feature can be
> reverted without losing the docs:
>
> - **`feat(energy): cut cycling — load-weighted blocks + diet-break prompts`** →
>   `app.jsx`, `app.js`, `__tests__/logic.test.js`, `sw.js`, `features/energy-safety/02-cut-cycle-blocks.feature`
> - **`docs: Step 5a cut cycling + START-HERE rewrite + schema re-run warning`** →
>   `START-HERE.md`, `ENERGY_MODEL.md`, `DOCS.md`, `setup/supabase-schema.sql`
>
> Verify `npx jest` is **172/172** before committing. Stay on `energy-safety-bmr-floor` — do **not** merge
> to `main`; the whole energy-safety set deploys together after the batched device test (Next up 3).
>
> **2. Then: proofread `features/energy-safety/03-diet-break-intervention.feature`** (7 scenarios) and
> Claude builds it. That's the only thing blocking progress. Ask Claude: *"pull out the decisions 03 needs
> from me"* — that's how 02 was done, and it took ~5 minutes.

---

## For a fresh Claude session — read this, then stop

To avoid burning credits rediscovering things: **this file alone is enough to start work.** Do not grep
the repo for orientation. Open further docs only when the task actually needs them:

| Task | Read |
|---|---|
| Anything touching calorie targets | `ENERGY_MODEL.md` §5, §5.1, §5.2 — **mandatory, it owns the model** |
| Building feature 03 / 04 / 05 | that one `.feature` file + `ENERGY_MODEL.md` §5 |
| Product behaviour / changelog | `DOCS.md` §37 |
| Legal, privacy, deploy checklist | `LEGAL_ROADMAP.md` |
| Known bugs & severities | `ARCHITECTURE_REVIEW.md` |

**House rules that will bite you if you skip them:**
- `app.js` is **generated** — edit `app.jsx`, then `npx babel app.jsx --out-file app.js`. Never edit `app.js`.
- **Bump `sw.js` cache version on every build** (`const CACHE = "fuel-log-vNN"`). Currently **v61**.
- Run `npx jest` before claiming anything works. Currently **172/172**.
- Only `useState`/`useEffect` are available as React hooks. Storage keys use `__`, not colons.
- Exact numbers live in `__tests__/logic.test.js`, which **mirrors** the pure functions from `app.jsx`.
  Change a constant in one, change it in both.

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
| 5a | A cut runs as **load-weighted blocks** that prompt a diet break (file 02) | ⚠️ **built, UNCOMMITTED** |

---

## The seven energy-safety feature files — what's actually left

The `features/energy-safety/` numbering confuses everyone (it confused us). Plain state:

| File | What it does | State |
|---|---|---|
| 01 energy floor | steady-loss clamp + low-fuel warning | ✅ built |
| 02 cut cycling | load-weighted blocks + diet-break prompts | ✅ built (uncommitted) |
| 06 weigh-in engagement | invites check-ins, cadence picker | ✅ built |
| 07 smoothed earn-to-eat | workout kcal spread over 3 days | ✅ built |
| 04 **first half** | *Maintain* floored at BMR × 1.2 | ✅ built + **live on `main`** |
| **03 diet break** | the break as a real app state, and how you come off it | ⬜ **needs proofread → build** |
| **04 second half** — *"the auto-lowering fix"* | stop cutting the target when weight rises during a deficit | ⬜ **needs proofread → build** |
| 05 symptom check | asks how you're feeling after a long under-eat | ⬜ unbuilt; trigger already decided |

> **Terminology fix:** earlier notes called the last unbuilt half of file 04 **"04-rest"**. That name meant
> nothing. It is **the auto-lowering fix** — use that. It's the exact mechanism that caused the founder's
> harm: `runCalibration` reads *"weight went up while eating in a deficit"* as *"your metabolism is slower"*
> and lowers the target. Water, glycogen and a full gut look identical to fat gain over one week.

**Note on `@draft` tags:** 06 and 07 still carry `@draft` and 04 says so in a comment, but **their code is
built**. The tag is stale, not a to-do. Clear the tags during the batched device test (Next up 2).

---

## Right now

**Session 13 built file 02 (cut cycling).** Jest 172/172, sw v61, `app.js` rebuilt. The four `profiles`
columns **and** `activity` have been run on Supabase, so the sync wiring is live-safe.

**What 02 does, in one paragraph.** A cut is measured as **cut load**, not calendar days: each day is
weighted by how deep the deficit is, so a gentle cut runs much longer before prompting a break and an
aggressive one is cautioned sooner (~24 / 12 / ~9.5 real weeks at a 10 / 20 / 25% deficit). Whether a day
counts comes from the **declared daily mode** plus a weight-trend backstop — **never from food logs**, so
not logging can't quietly stop the clock. Cards show **real elapsed weeks**, never load. Reasoning and the
rejected alternatives (a 42-day universal cut default; a sleep/fatigue traffic light; folding training load
into the term) are in **`ENERGY_MODEL.md` §5.2** — don't re-litigate them without new evidence.

**Where 02's code lives** (so you don't have to search): `app.jsx` — constants + `dayCutLoad`,
`cutThresholds`, `weeklyLossFrac`, `stepCutBlock`, `accrueCutBlock`, `cutPromptFor` in one commented block
after `runCalibration`; state (`cutBlock`), daily accrual effect and `startDietBreak` in `App`; the two
cards in `Dashboard` next to the Step 4 warnings; `syncCutBlock` beside `syncProfile`.

**⚠️ Known deviation from 02's locked spec.** The prompt's primary button says **"Switch to maintenance"**,
not the spec's *"Start 2-week diet break"* — file 03 owns the tracked break and isn't built, so promising a
break nothing measures would be a lie on screen. **Building 03 closes this.** Recorded in §5.2 + `DOCS.md`.

**⚠️ Soft spot in 02, deliberately left.** When the scale says you're cutting but the mode says "Maintain",
there's no prescribed deficit to measure, so the day accrues at the reference rate (1.0) rather than a
measured one. It's a guess, commented at the accrual site. Fixing it properly needs the 7700 kcal/kg figure
that §4 warns against leaning on.

---

## Next up (in order)

1. **Commit the uncommitted work** — file 02's build + the docs sweep, as the two commits spelled out in
   the box at the top of this file. Nothing else should start on top of it.
2. **◀ Finish the energy plan** (`ENERGY_MODEL.md` §5): ✅1 activity · ✅2 adaptive-TDEE (+06) · ✅3 smooth
   earn-to-eat · ✅4 energy floor · ✅5a cut cycling (02) → **◀ 03 diet break** → **the auto-lowering fix**
   (04's second half) → 05 symptom check. Proofread each before building; commit as each lands; keep Jest
   green. **Batch the on-device test + deploy of every feature file** once complete.
3. **Batch device-test everything** — the whole energy-safety set AND the still-open AI-capture (v6.7)
   checks in one pass (**hard-reload first** — PWA cache): (a) v55 optional follow-up flow; (b) ⚐
   Report-wrong opens a prefilled email; (c) + Log all lands in today's food; plus the energy-safety UI
   ("Eased to a steady pace", "Low on fuel today", "Held at your minimum maintenance", the cut-cycling
   nudge + hard prompt, and their "Why?" toggles). **Note:** the steady-loss floor only *visibly* bites on
   smaller bodies — to see it, temporarily set a ~60 kg profile. Cut-cycling needs a long history to trip
   naturally, so seed `cut_block` in local storage rather than waiting weeks. When green, clear the stale
   `@draft`/`@wip` tags. **Then bind `RATE_LIMIT` KV** (blocker below) before any launch.
4. **🗓️ carb floor** (deferred): clamp carbs to 2 g/kg bodyweight on aggressive cuts, reducing **fat** first
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
- `energy-safety-bmr-floor` carries Steps 1–4 committed (`bfe926f` = Step 4) **plus uncommitted file 02**.
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
- ✅ **Synced:** weight, height, body fat, sex, consent columns, `activity`, and the four cut-block columns
  (`cut_block_start`, `cut_block_load`, `cut_load_year`, `last_break_end`) via `syncProfile` / `syncCutBlock`
  and the pull-merge.
- ⚠️ **Still local-only:** `weighCadence` (no column), `weigh_nudge_dismissed`, `tdee_adj_log`, and the
  cut-block *working* fields (accrual cursor + prompt dismissals) inside the `cut_block` blob.

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

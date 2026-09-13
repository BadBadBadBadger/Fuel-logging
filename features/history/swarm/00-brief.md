# Swarm brief — History/Dashboard bug batch (FL-001 … FL-010)

## What this project is

Fuel Log is a **single-file React PWA** for tracking food intake, body weight and body composition
against energy targets. `app.jsx` (~7,200 lines) is the source; `build.sh` compiles it to `app.js`
via Babel. `sw.js` carries a cache version that must be bumped on every build.

**Audience is n=1.** This is a personal tool built by and for one person (Adrian Richards) to protect
his own hormonal health while cutting. There are no other users and no launch date. **Do not design
around product/scale concerns** — no A/B tests, no onboarding funnels, no "what if users…"
multi-tenant reasoning. "What does the one person who uses this need to see to make a correct
decision about his own body" is the whole question.

## House rules that constrain any fix

These are real, previously-learned constraints. Violating them is a finding in itself.

1. **No delete friction, no tap friction.** No confirm dialogs on deletes. Never gate the primary
   log/save action behind an optional step or an extra tap. A fix that adds a modal to the logging
   path is the wrong fix.
2. **Say things plainly. No jargon, no metaphors.** The app's copy and our own reports avoid
   jargon nouns. If a report reaches for a word like "ratchet" or "surface" or "signal", it is
   usually averaging over a knowledge gap — say the mechanism instead. (`personas/anti-metaphor.md`)
3. **Local date keys, never UTC.** Day keys are local-calendar `YYYY-MM-DD`. This repo has already
   been bitten by `new Date(...).toISOString().split("T")[0]`, which is **UTC** and shifts the day
   boundary for anyone not on UTC. Look for this.
4. **Numbers contract:** every kcal figure shown against a body is *derived*, never hardcoded.
   Exact arithmetic is owned by `__tests__/logic.test.js` (Jest).
5. **No new database columns without a migration run first.** A column that does not exist in
   Postgres makes the whole sync upsert fail **with no visible error** — this repo lost its own
   history sync that way. Any fix needing new stored state must say so loudly and explicitly.
6. **Specs are documentation, not tests.** `features/**/*.feature` files are the source of truth for
   UX decisions and are updated *before* implementation. Executable coverage is
   `__tests__/logic.test.js` (Jest, 323 passing) + `e2e/` (Playwright, 89 passing).

## Current repo state — read this before proposing anything

Branch `main`. **There is substantial uncommitted work in the working tree, and it is in exactly the
code the bugs are about.** `features/body/02` ("Body measurements in History, and what a save
reports back") modified `app.jsx`, `app.js`, `__tests__/logic.test.js`, `features/README.md`,
`DOCS.md`, `START-HERE.md`, and added `e2e/body-history.spec.js` plus three `features/body/02-*`
files. It is built and tested but not committed. Read `features/README.md`'s `body/` section and
`features/body/02-founder-decisions.md` — its four founder decisions are live context, not history.

## Code pointers — the actual defective lines

All in `app.jsx`, inside `function History(...)` which begins at **line 5583**.

| What | Where | Current code / behaviour |
|---|---|---|
| Range → date cutoff for **intake** | **5609–5614** | `days = {W:7,…}[range]`; `cutoff = new Date(Date.now() - days*86400000).toISOString().split("T")[0]`; `history.filter(d => d.date >= cutoff)`. Two defects in one expression: `toISOString` is **UTC**, and `>= cutoff` over a 7-day subtraction yields **8 date keys** (today−7 … today) |
| Same cutoff, copy-pasted for **weigh-ins** | **5616–5621** | identical expression on `weighIns` |
| Same cutoff, copy-pasted for **body measurements** | **5646–5651** | identical expression on `bodyMeasurements` |
| Averages card header | **6073** | `{RLBL[range].toUpperCase()} AVERAGES · {filtered.length} DAYS` → "7 DAYS AVERAGES · 8 DAYS" (**FL-005**) |
| The average itself | **6077–6078** | `filtered.reduce(…) / filtered.length` — denominator is the row count including today's zero-row (**FL-001**) |
| Weight trend headline | **6082–6100** | `first = filteredWeighIns[0]`, `last = filteredWeighIns[len-1]`, `diff = last - first` (**FL-002**) |
| Day-list header | **6106** | `{filtered.length} DAYS LOGGED` (**FL-005**) |
| Dashboard weekly ring subtitle | **2455** | `Still filling in — {weekScore.daysUsed} of 7 days logged so far.` — a *different* day count from a *different* engine (**FL-005**) |
| Rolling average already on the chart | **5631–5639** | `weightChartData` computes a 7-point rolling mean (`ROLLING`, drawn once ≥3 points). **FL-002's fix probably already exists here** — the headline just doesn't use it |
| Body-fat rows | **5655** | `measurementChartRows(filteredBodyMeasurements)` |
| Chart X axes | ~**6020–6050** and the weight/body-fat charts | `<XAxis dataKey="date">` where `date` is a **formatted string** (`fmtShort(d.date)`). Recharts treats a string axis as categorical → points evenly spaced regardless of date (**FL-009**) |

Useful search terms: `runCalibration`, `weekScore`, `daysUsed`, `MODES`, `onUpdateDay`, `fmtShort`,
`measurementChartRows`, `bodyFatWindowChange`, `getWUnit`.

Related existing docs worth a look: `features/dashboard/` (the intake-scoring engine that produces
the weekly ring and the CUT/BULK/MAINTAIN grading), `features/energy-safety/`, `ENERGY_MODEL.md`.

## Known prior context relevant to specific bugs

- **FL-002 has a precedent.** The dashboard weight-trend badge had *this same bug* and was fixed in
  v78: it compared two raw points, so one noisy day read as a gain during a real loss; it now uses
  the same 7-day rolling average `runCalibration` trusts. The History headline is the same defect in
  a second place. Check what the dashboard fix did and whether History should just call it.
- **FL-003 / FL-010 touch the scoring engine.** CUT/BULK/MAINTAIN is a per-day user choice
  (`d.mode`, see `MODES`). The intake-scoring engine (v77) grades the day against it and feeds the
  weekly ring. Changing a past day's mode means re-deriving everything downstream of it.
- **FL-007 wants to distinguish "ate little" from "stopped logging".** There is currently no stored
  field that could tell these apart. Note rule 5 above before proposing one.

## Your job

Review **the bug report** (`BUG-REPORT.md`, same directory) through your persona's lens. You are
reviewing the *report and the proposed fix directions*, and the code they point at — not writing the
fix. Another agent implements afterwards.

**Read these first, in this order:**
1. Your persona file, `personas/<yours>.md` in the repo root — it defines your lens and your
   standard of evidence. Follow it.
2. `BUG-REPORT.md` in this scratchpad directory.
3. The code at the pointers above. **Read the real lines** — do not reason from this table alone.
   It is a map, and maps are wrong.

**Then write your report** to the path named in your instructions, and return a short summary.

**Ground rules**
- **Do not edit `app.jsx`, `app.js`, `sw.js`, or anything in `features/`, `__tests__/` or `e2e/`.**
  Review only. Write exactly one file: your own report. Implementation happens later, once all
  reviews and the debate are in.
- **Be concrete.** Cite `file:line`. Show arithmetic. A claim that cannot be checked is not a
  finding.
- **Disagreeing with the report is the most valuable thing you can do.** Severities may be wrong.
  A "bug" may be correct behaviour. A fix direction may be worse than the bug. Say so, with
  reasoning. Note explicitly where you think the reporter is right — the implementer needs to know
  what is settled as much as what is contested.
- **Flag anything you could not verify** rather than filling the gap with a plausible guess.

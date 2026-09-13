# History bug batch (FL-001 … FL-010) — where we got to

**Written:** 2026-09-13, session 22, mid-swarm, because the usage allowance was about to run out.
**Read this first if you are picking this up cold.** Nothing has been implemented. No fix exists yet.

## State of the tree

- Branch `main`. **Clean and green at commit `2a9de4c`** — Jest **370/370**, sw **v81**.
- `2a9de4c` is the `features/body/02` work (body measurements in History, save feedback, CSV
  export) which was sitting **uncommitted** when this session started. It was verified and committed
  as a baseline precisely because the bug fixes land on the same lines.
- **Rollback tag: `pre-history-bugfix`** (= `2a9de4c`). Nothing has been pushed to the remote.
- No fix branch was cut. Step 8 (implement) has **not** started.

## What this batch is

`00-bug-report.md` in this folder — ten bugs the founder found by eye in a live session on
2026-09-13, on the History screen and the Dashboard. Headline one (FL-001) is that the weekly
average divides by 8 when only 7 days are complete, so every headline average on the History screen
is wrong. FL-006 was withdrawn by the reporter before review.

## The plan, and how far it got

A nine-step swarm: six persona reviews in parallel → a critical-thinking-led debate where all agents
read each other → implement → update documentation.

| # | Step | Status |
|---|---|---|
| 1 | QA review | **Launched, did not report back.** No file written. |
| 2 | Engineering review | **Launched, did not report back.** No file written. |
| 3 | Nutrition-coach review | ✅ `swarm/03-nutrition-coach.md` (546 lines) |
| 4 | Design-lead review | ✅ `swarm/04-design-lead.md` |
| 5 | Critical-thinking review | ✅ `swarm/05-critical-thinking.md` (556 lines) |
| 6 | Anti-jargon review | ✅ `swarm/06-anti-jargon.md` (400 lines) |
| 7 | Critical-thinking-led debate | ❌ not started |
| 8 | Implement | ❌ not started |
| 9 | Update documentation | ❌ not started |

**Re-run steps 1 and 2 before the debate** — the brief they were given is saved verbatim at
`swarm/00-brief.md`, so they can be relaunched as-is. The gap that matters: nobody has done the
engineering pass on data integrity, so the sync and migration risk in any fix is still unassessed.

## What the four completed reviews established

Read the reports for the full workings. The load-bearing conclusions:

### The report's arithmetic is correct — all of it

Verified independently: 2665+2580+2334+2228+2504+2927+2331 = **17,569** (the zero day is included
and invisible, since adding 0 changes nothing). 17569÷8 = 2196.125 → **2196** ✓; ÷7 = 2509.86 →
**2510** ✓. Fat 67+72+80+80+83+79+83 = **544** ✓; ÷8 = exactly **68** ✓; ÷7 = 77.71 → **78** ✓.

The "maybe it's an 8th day with real data" alternative was tested and **ruled out**: that day would
need ~0 kcal and exactly 0g fat, i.e. an empty day. Not a competing explanation.

**FL-002's slope figures cannot be checked and do not reproduce.** Five of the seven weights are
unstated, and the x-variable is unstated too — calendar-day spacing vs reading-index differ by 17%
with 12/09 missing. The verified finding is **+0.4 kg vs the +1.7 kg shown — a 4× overstatement,
not a direction reversal.** Do not carry the "+0.87 vs −0.08 kg/week" figures forward as fact.

### Settled — four reviewers agreed independently, by different routes

**FL-003's and FL-010's central claim is false.** No day's `mode` is an input to
`weeklyIntakeScore`. The amber verdict the founder saw is the six logged days averaging
**14,904 / 6 = 2,484** against maintenance 2,709 — 225 under, which is inside the ±250 band. It is
not caused by 12/09 being set to MAINTAIN.

Consequence for implementation: **fixing FL-010 will not turn that segment green.** Say so in the
UI or in the hand-back, or the fix will look like it failed. The report's wording — "the weekly
result recalculates", "the ring reports that on the strength of that one day" — describes something
the code does not do. The confusion traces to the word "status" covering two different stored
values: the per-day `d.mode` on each snapshot, and the single app-wide live `mode`.

### FL-001's direction of harm — it invents a deficit, it does not mask one

At maintenance 2,709 the card shows a 513 kcal/day deficit where the real one is 199 — 2.6× too big.
By construction this bug can only make intake look *lower*, never higher, so it cannot hide
under-eating. The harm is the inference it invites: the scale under-performs what the screen
promised, so "my burn must be lower" → eat less. That is the exact inference
`app.jsx:751-791` exists to stop the app from making. Error size is largest at breakfast
(314 kcal) and falls to zero by bedtime.

### FL-002 — the premise does not exist, and 7 days cannot support the claim

- There is **no least-squares fit anywhere in `app.jsx`**. "The line through all the readings" would
  have to be written; it cannot be reused.
- Four defensible ways of computing a trend over those seven weigh-ins span **1.8 kg and both
  signs**. So 7 days cannot support a weight-trend claim however it is computed.
- The app already disagrees with itself about this: `gainWhileCutting` deliberately uses 14 days,
  not 7, and `STALL_WEEKS` is 3.
- Recommendation on the table: 14 days before showing a direction word, 21 before a number, and
  never red.
- `WEIGHT TREND` (`app.jsx:6090`) also contradicts the app's own copy, which promises "we use your
  7-day trend, not any single day" in three separate places.

### ⚠️ The reference line FL-002 wants to trust is itself broken

**This is the biggest finding in the batch and it is not in the bug report.** The report treats the
smoothed line on the chart as the trustworthy reading and asks the headline to match it. It is not
trustworthy.

`weightChartData` (`app.jsx:5632-5639`) rolls over the **range-filtered** array with an
**expanding 3-to-7-reading window**, not a calendar-day window. Replicated: a **perfectly flat**
98.5 kg week with one low first reading draws **+0.30 kg** — which is exactly the "about 0.3kg rise"
the report cites as the chart's honest answer. The comment at `5644-5645` explicitly claims weight
uses a calendar-day window. It does not.

So "make the headline agree with the chart" would make the headline agree with a second bug. Both
need fixing, and the chart's line is the one nobody was looking at.

### FL-001's fix as written is a blunt instrument

`filtered` has **six consumers** — `app.jsx:5625, 5931, 6073, 6077, 6108, 6145`. Excluding today
from `filtered` also deletes today's chart point and today's tappable day row, which nobody asked
for. The actual defect is narrower: **today is being counted as a complete day worth zero.** The app
already computes the right denominator twice, at `618-627` and `721` — reuse it rather than filtering
rows away.

Also note the tempting partial fixes are wrong: changing `W:7`→`6`, or `>=`→`>`, yields **2129** —
further from the truth than the 2196 it replaces, while the header still reads "7 DAYS".

### The same off-by-one sits in a safety path

FL-001's `>=` off-by-one also appears in `runCalibration` at **`app.jsx:770`**, feeding `wasCutting`
— which gates whether the calorie target is allowed to be lowered. This is the energy-safety
mechanism, so the bug is not confined to a display. Fix both or neither.

### Three unreconciled weekly averages

**2196** (History card), **2484** (Dashboard weekly score), **2510** (the truth) — all on screen at
once, diverging to 324 kcal apart once breakfast is logged. Whatever is built must end with one
number or with each number plainly labelled as answering a different question.

### FL-007 — no new column needed, and the report's own fix was rejected

- Entry times are **already stored and synced** (`app.jsx:1340`), so "this log was probably
  abandoned" is derivable with no schema change. Meal slots are not stored.
- "Leave the incomplete day out of the average" was **rejected**: it deletes exactly the low days,
  which is the evidence of under-eating this app was built to catch. It also breaks a decided
  guardrail (`dashboard/04:691`). FL-001 and FL-007 compound in the same direction — −403 kcal/day
  together.

## Traps — read before writing any code

1. **Do not use `isDayClosed` (`app.jsx:564`) to exclude today from the average.** Despite the name
   it means "14 hours after the first meal, or 22:00 if nothing is logged". Using it lets today back
   into the average at 20:00 and reinstates FL-001 in shifted form. The correct test is
   `d.date < todayKey()`. No "mark the day done" concept is needed, and the app has none.
2. **The cutoff expression is copy-pasted three times** — `app.jsx:5609` (intake), `5616`
   (weigh-ins), `5646` (body measurements). FL-004 requires intake and weight to use *different*
   windows, so this is not a one-place fix.
3. **`toISOString()` is NOT what causes the ÷8 — the missing upper bound is.** An early guess in
   this session (mine) was that the UTC date key was the culprit. The engineering pass separated
   them: the ÷8 comes from there being **no upper bound on the window at all**, so today is included.
   `toISOString` being UTC is a real but *separate* defect — under BST the window can hold 9 rows,
   not 8, between local midnight and 01:00. Fix both, but do not confuse them, and do not expect
   fixing the timezone to fix the average.
4. **A third defect: there is no dev-clock offset, so the Playwright harness cannot reach this code
   at all.** Any test plan that assumes the existing harness can drive a date boundary is wrong
   until that is addressed. This is why 89 Playwright tests never saw FL-001.
4. **`features/body/02` (`2a9de4c`) touched all three cutoffs and the whole `History` component.**
   Any fix builds on it, not around it.
5. `sw.js` cache version must be bumped on every build. It is at **v81**.

### ⚠️ FL-010 was refused by the engineering pass — it can silently corrupt the calorie target

Two independent reasons, both worse than the bug FL-010 describes.

**1. Recomputing a past day's target needs inputs that were never stored.** The snapshot
(`app.jsx:6989-7001`) stores `targetKcal`, `targetFat` and `floored` — all *derived from* that day's
mode by `calcTargets`, and the grader reads mode and stored target as a pair (`3934`, `3958`).
Editing the mode alone changes one half of that pair. A correct recomputation needs that day's
weight, body fat, `tdeeAdj`, workout bonus and custom-kcal override — **none of which are stored**,
which is the stated purpose of the snapshot (`6977-6984`). The obvious shortcut, shifting the target
by ±500, is wrong on any day a safety floor held (`calcTargets:403-414`) and would push a historical
target **below SAFE_MIN**. `h.floored` guards most of that, but a **user-typed custom target is
invisible**: `customKcalApplied` is set on `targets` (`6967`), never snapshotted, and `floored` reads
false. Closing that hole needs a new column — which is house rule 5, the one that has already cost
this repo its sync twice.

**2. Editing a past mode can unblock a TDEE lowering that cannot be undone.** Mode feeds
`runCalibration`'s `wasCutting` majority (`app.jsx:770-771`), which gates whether a **downward** TDEE
correction is refused (`784-791`). A CUT→MAINTAIN edit can lift that refusal; the lowering is then
written to `tdee_adj` and `adjLog` (`6838-6846`), and **editing the mode back does not undo it**. It
is latent — it fires at the next weigh-in, not at the moment of the edit. This is the
auto-lowering harm the whole energy-safety workstream exists to prevent.

**Also refused:** FL-002's "take the figure from the ends of the smoothed line" (that differences a
trailing mean against itself), and FL-007 *if it needs a new column* — it doesn't, `l.id`/`l.time`
are already stored and synced.

### The design pass's answer to FL-005, with literal copy

Dates identify a window; counts only qualify it. **No header states a day count.**

- Averages card: `DAILY AVERAGE · 6–12 SEP` over `7 of 7 days logged · today not counted yet`
- List header: `DAY BY DAY · 6–13 SEP`, with the word `TODAY` on today's row only
- Dashboard ring: `6 of 7 days logged` / `7–13 Sep` on two deliberate lines

Nobody subtracts anything: the list says 6–13, the average says 6–12, and the single row that
differs is labelled. Add one pure `fmtRange()` helper so every label formats identically, fed by the
same two local day-keys that filtered the rows.

**FL-002's card:** keep one big number, but only once it is the line's own number —
`97.6 → 98.0 kg · 8–13 Sep` / `+0.4 kg`, with `Raw readings 97.1–98.8 kg, 6–13 Sep` beneath as a
separate fact. **Take the colour off entirely:** `diff <= 0 ? accent : bulk` (`app.jsx:6095`) rewards
a lower number on a scale and paints a gain orange during a bulk. The same flaw is still live on the
Dashboard badge (`app.jsx:3493`).

**Two more implementation notes from that pass:** writing today's mode through `patch()` silently
reverts on the next snapshot (`app.jsx:6985-7008`) — it needs one `onSetDayMode` prop routed to
`handleSetMode`. And `--text-faint` at 9px fails AA contrast in dark mode (4.10:1) on the exact line
FL-005 is about.

**Don't build:** FL-003's warning (the information is already said twice; replace with one factual
line) and FL-007 (every available signal is a guess). Design ranked FL-005 High, FL-009 Medium,
FL-003 Low, FL-007 won't-fix.

## Founder decisions needed before step 8 — these block implementation

1. **FL-010: does changing a past day's mode keep that day's stored target, or recompute it?**
   Each snapshot stores the target that actually applied (`app.jsx:6994`) and the Dashboard prefers
   the stored value over recomputing (`app.jsx:3940-3942`). For 12/09 the two readings give opposite
   colours: keep the stored 2,709 → `kcalDelta = −378` → **green**; recompute for cut (2,209) →
   `+122` → **amber, "JUST OVER"**. One word in the spec, two opposite results.
2. **FL-010's three open questions** (already in `00-bug-report.md`): does editing a past mode
   recalculate already-closed weeks, does it disturb awarded streaks or achievements, and is there a
   cut-off past which days go read-only.
3. **FL-002: what minimum span earns a trend claim**, and does the card show nothing at 7 days.
4. **FL-003: should this warning exist at all.** An app that second-guesses a stated intention every
   time he eats a little under has a false-positive cost. Note the no-friction house rules forbid a
   dialog here.
5. **Rename "status" to "mode"** on screen, matching what the code calls it. Recommended by the
   anti-jargon pass.

## Unreported bug found during review — ranked above FL-001

**The Dashboard counts today as a complete day on `logs.length > 0` (`app.jsx:3930`)**, with no
day-closed gate, even though one is computed 37 lines earlier at `3893`. One logged breakfast flips
the week from amber to a green "keep going"; logging dinner flips it back. A spurious all-clear, in
the morning.

Needs a device check and a founder call. **This is not in `00-bug-report.md`** — it has no FL number
yet. Note the tension to resolve: the nutrition-coach pass wants this gated on the day being
complete, while the anti-jargon pass warns against using `isDayClosed` for exactly that kind of
gate. Same question, two screens, possibly two different right answers.

## Also worth knowing

- `8 DAYS LOGGED` (`app.jsx:6106`) counts days the app was *opened*, not days with food logged.
- **FL-008 is one edited string, not new state** — `app.jsx:5931` and `6145` already prevent the
  NaN the report feared.
- **FL-009 was judged fine as written**, as was the weekly copy.
- "since last month" (`app.jsx:6066`) subtracts a reading with no upper age limit.
- `pts` on one screen vs `%` at `app.jsx:6131` for the same quantity; the specs write
  "percentage points".

## Suggested next session, in order

1. Relaunch the **QA** review only — the one pass that did not report — using `swarm/00-brief.md`
   verbatim. Tell it what engineering already found: there is no dev-clock offset, so the Playwright
   harness cannot drive a date boundary as things stand. That is its first problem to solve, not an
   afterthought.
2. Run the debate (step 7) across all six.
3. Put the founder decisions above to the founder **before** writing code. The FL-010 one is not a
   preference — engineering refused to build it as specified, so it needs a scope change, not a
   ruling.
4. Write the `features/history/01-*.feature` spec, then implement, then Jest, then Playwright.
5. Update `START-HERE.md`, `DOCS.md` and `features/README.md`. **START-HERE has not been touched
   this session** — it still describes the v78 state and says Jest 323/323, when the tree is at
   `2a9de4c` with Jest 370/370 and sw v81.

## The shortest defensible first slice, if the founder wants movement before all of that

Four reviews converged on this much being safe, small, and independent of every open decision:

1. **FL-001** — stop counting today as a complete day worth zero. Use the denominator the app
   already has (`app.jsx:618-627`, `721`); do not filter today's row out of `filtered`.
2. **The broken rolling line** (`app.jsx:5632-5639`) — a calendar-day window, not an expanding
   reading-count one, and fix the comment at `5644-5645` that describes the behaviour it doesn't have.
3. **`runCalibration:770`** — the same off-by-one, on the path that moves the calorie target.
4. **Take the colour off the weight delta** (`app.jsx:6095`, and `3493` on the Dashboard).
5. **FL-008** — one edited string.

Everything else waits on a decision or on the debate. **FL-010 should not be attempted in this
slice.**

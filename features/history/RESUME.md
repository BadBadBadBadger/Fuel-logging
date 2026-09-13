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
| 4 | Design-lead review | **Launched, did not report back.** No file written. |
| 5 | Critical-thinking review | **Launched, did not report back.** No file written. |
| 6 | Anti-jargon review | ✅ `swarm/06-anti-jargon.md` (400 lines) |
| 7 | Critical-thinking-led debate | ❌ not started |
| 8 | Implement | ❌ not started |
| 9 | Update documentation | ❌ not started |

Four of the six reviews produced nothing. **Re-run steps 1, 2, 4 and 5 before the debate** — the
brief they were given is saved verbatim at `swarm/00-brief.md`, so they can be relaunched as-is.
Gaps that matters most: nobody has yet done the engineering pass on data integrity, and nobody has
independently checked the report's own arithmetic.

## What the two completed reviews established

Read the two reports for the full workings. The load-bearing conclusions:

### Settled — two reviewers agreed independently, by different routes

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
3. **`toISOString()` in those cutoffs is UTC, not local calendar days.** FL-001 is likely two
   defects braided together: an inclusive `>=` over a 7-day subtraction yielding 8 keys, *and* a
   timezone shift. Under BST the window can hold 9 rows, not 8, between local midnight and 01:00.
   Nobody has yet separated these two — that was the engineering pass that did not run.
4. **`features/body/02` (`2a9de4c`) touched all three cutoffs and the whole `History` component.**
   Any fix builds on it, not around it.
5. `sw.js` cache version must be bumped on every build. It is at **v81**.

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

1. Relaunch the four reviews that did not report (QA, engineering, design-lead, critical-thinking)
   using `swarm/00-brief.md` verbatim. Engineering and critical-thinking are the two biggest gaps.
2. Run the debate (step 7).
3. Put the five founder decisions above to the founder **before** writing code.
4. Write the `features/history/01-*.feature` spec, then implement, then Jest, then Playwright.
5. Update `START-HERE.md`, `DOCS.md` and `features/README.md`. **START-HERE has not been touched
   this session** — it still describes the v78 state and says Jest 323/323.

# 06 — Anti-Metaphor review of FL-001 … FL-010

Reviewer: Anti-Metaphor Hero. Scope: the words, on screen and in the report. No project file edited.

## Verdict

Two on-screen labels make claims their numbers cannot support, and both are the same shape as the
"ratchet" failure: the word is stronger and more specific than the arithmetic behind it.

1. **`⚖️ WEIGHT TREND` (`app.jsx:6090`)** over `last reading − first reading`. The app uses the word
   "trend" in its own copy three other times to mean *the 7-day rolling average*
   (`app.jsx:2926`, `3545`, `4596` — "we use your 7-day trend, not any single day"). History's
   headline uses the same word for the one thing that copy promises it is not.
2. **`{filtered.length} DAYS LOGGED` (`app.jsx:6106`)** over a count of history snapshot rows. The
   snapshot effect (`app.jsx:6985-7008`) writes a row **every day the app is opened**, logged or
   not — the comment at `app.jsx:3967` already says so. On the reported data one of those 8 rows
   (13/09) has 0 kcal and no entries. The label says "logged"; the number counts "opened".

And the highest-value find is in the report's own words, not the app's: **"rescores that day"**
(FL-010) hides a choice that flips the result the bug asks for. Worked below, §B-FL-010.

---

# A. On-screen copy

## A.1 Labels that claim more than the number

| Current copy | `file:line` | What the number actually is | Verdict | Plain replacement |
|---|---|---|---|---|
| `7 DAYS AVERAGES · 8 DAYS` | `app.jsx:6073` | `RLBL[range]` (the window asked for) next to `filtered.length` (rows matched). The two disagree because the filter keeps 8 date keys. | **Must change.** Names the same window twice with two different numbers. | `AVERAGE OF 7 COMPLETE DAYS · 6–12 SEP` — state the window once, as dates. A reader can check dates; they cannot check "7 vs 8". |
| `8 DAYS LOGGED` | `app.jsx:6106` | `filtered.length` — history snapshot rows in range, including days with 0 kcal and no entries. | **Must change.** "Logged" is a claim about food; the number counts app openings. | `8 DAYS` (heading a list of days), or `7 DAYS WITH FOOD LOGGED` if it is to keep the word — derived from `kcal > 0 \|\| logs.length > 0`, the test `runCalibration` and `weekDays` already use. |
| `⚖️ WEIGHT TREND` + `97.1kg → 98.8kg` + `+1.7 kg` | `app.jsx:6090-6097` | `wConv(filteredWeighIns[last]) − wConv(filteredWeighIns[0])`. Two raw readings. No period attached to `+1.7 kg`. | **Must change.** Contradicts the app's own published meaning of "trend", and the figure has no time unit while the Dashboard's equivalent (`app.jsx:3494`) is stamped `/wk`. | If the number stays two raw readings: `FIRST TO LAST WEIGH-IN` / `97.1kg on 6 Sep → 98.8kg on 13 Sep` / `+1.7 kg over 7 days`. If FL-002 is fixed: `7-DAY AVERAGE, WEEK ON WEEK` / `+0.3 kg/wk`, matching `app.jsx:3493`'s wording exactly. |
| `{Math.abs(change)} pts of body fat since last month` | `app.jsx:6066` | `newest reading − the newest reading dated on or before (today − 30 days)` (`bodyFatWindowChange`, `app.jsx:921-931`). The earlier reading has **no upper age limit**: if the last reading before the cutoff was 90 days ago, that is what is subtracted, and the card still says "last month". | **Must change** — the label, not the number. The number is honest; "since last month" names a window the comparison does not respect. | `▼ 0.7 points of body fat vs 14 Aug` — naming the actual comparison date is shorter *and* true. (`before[before.length-1].date` is already in hand.) |
| `pts` | `app.jsx:6066` | Percentage points of body fat. | **Change the abbreviation.** Every spec writes it out: `features/README.md:66` "±0.67 points of tape slip", `features/body/01-measurement-tracking.feature:120` "3 percentage points". `pts` appears nowhere but this one screen, and the same quantity is rendered with a `%` sign two screens away (`app.jsx:6131`, `📏22.3%`). A year from now `0.7 pts` next to `22.3%` is a genuine coin flip between "0.7 of a percentage point" and "0.7 percent of 22.3". | `points` in full. `▼ 0.7 points of body fat vs 14 Aug`. Four characters for an unambiguous sentence. |

## A.2 Copy covering two different situations with one sentence

| Current copy | `file:line` | The two situations | Plain replacement |
|---|---|---|---|
| `Still filling in — {weekScore.daysUsed} of 7 days logged so far.` | `app.jsx:2455` | `state:"filling-in"` is returned from **two different conditions**: the account has fewer than 7 snapshots (`app.jsx:616`, `3971`), **or** the account is old but nothing at all was logged in the last 7 days (`app.jsx:625`). A three-month-old account after a week off reads "Still filling in — 0 of 7 days logged so far", which sounds like a new install. | Two sentences for two states. New account: `Your first week is still filling in — 3 of 7 days so far.` Nothing logged this week: `Nothing logged in the last 7 days — log a day and this comes back.` |

## A.3 Copy the report proposes

| Proposed copy | Where from | Problem | Plain replacement |
|---|---|---|---|
| "marked as possibly incomplete" | FL-007 expected | "Possibly" is the report admitting it has no evidence, inside the very words meant to convey evidence. See §B-FL-007 for what is actually derivable. | Say what is known: `Last entry 13:40` on the day row. No adjective, no verdict. |
| "An empty state saying averages start once the first full day has finished." | FL-008 expected | Carries the same ambiguous "finished" as FL-001 (see §B-FL-001b). Also: **this copy may not be needed at all.** `app.jsx:5931` already guards the whole averages block with `filtered.length > 0` and `app.jsx:6145-6148` already renders `No data for this range yet.` at zero rows — so FL-008's NaN/divide-by-zero worry is structurally prevented today. What breaks after FL-001 is that the existing sentence becomes false: there *is* data, it is just excluded. | Edit the existing string rather than add a state: `No complete days yet. Today is still being logged, so it isn't averaged in.` |
| "clearly different labels where the counts genuinely differ" (FL-005 expected) | FL-005 | A principle where the deliverable is words. See §B-FL-005 — the three counts answer three different questions, and all four labels can be written out today. | §B-FL-005 writes all four. |

## A.4 Copy that is fine — leave it

- **`This week hasn't been a cut. Hit your targets and watch this change.`** (`app.jsx:601`). Plain,
  no metaphor, and the line beneath it (`app.jsx:2463`, `Based on N of M days logged`) already
  states the evidence count. "Cut" is the app's own mode name and the user's own word. No change.
- **`No data for this range yet.`** (`app.jsx:6147`) — true today; only needs the edit in A.3 after
  FL-001 lands.
- **`avg of last {r.avgN}: {r.ROLLING}%`** (`app.jsx:5573`) — states what it is built from rather
  than implying a fixed count. This is the standard the other labels should be held to.
- **`7-day avg`** in the weight chart tooltip (`app.jsx:6033`) — accurate and consistent with the
  Dashboard's wording. Note it sits on the same card as `WEIGHT TREND`: the tooltip is already
  honest about the rolling line while the headline above it is not.
- **FL-009's wording** ("Points sit where their date falls, so a missing day shows as a visible
  gap") — concrete, testable, no rewrite needed. This is the best-written item in the report.
- **Code comment at `app.jsx:4064`** says "the ONLY **surface** that changes mode". One stray jargon
  noun in a comment; the sentence survives as "the only place that changes mode". Low priority,
  mentioned only because comments are how the three banned words spread.

## A.5 One new naming decision: what to call CUT / BULK / MAINTAIN on screen

The report uses four words for it: **"status"** (title, FL-003, FL-010), **"intention"** (FL-010
background), **"selected status"**, and **"what you were trying to do"**. The code has one name,
`mode` / `d.mode` / `MODES` (`app.jsx:36-40`), and the specs have one,
**"selected mode"** (`features/dashboard/04-intake-scoring.feature:651`, "Selected mode vs. what the
week actually reads as"). On screen, the three chips carry **no label word at all** — they just say
CUT, MAINTAIN, BULK (`app.jsx:4066-4079`), and the calorie card shows the bare word
(`app.jsx:4478`).

**"Status" is the wrong word and should not be adopted.** A status is something a system reports
about you. This is a switch the user sets. It already scored one founder complaint's worth of
confusion in FL-006, which was withdrawn precisely because the reporter had been reading this value
as something the app worked out.

**Recommendation: use `mode` in prose and specs, and keep the screen label-free.** Defence:

1. Rule 1 of the persona — existing terminology wins. `mode` is the identifier, the column name
   (`history_snapshots.mode`, `app.jsx:1478`), and the spec's own word.
2. "Mode" is weak and non-committal, which is *correct here*: it makes no claim about who decided it
   or what it causes. "Status" claims the app determined it; "intention" claims a mental state the
   app cannot read.
3. The screen needs no label at all. Three chips reading CUT / MAINTAIN / BULK with one highlighted
   is already unambiguous, and adding a label word is the only way to get it wrong.

**But "mode" hides something the report's four words were groping at, and it matters.** There are
**two** stored values, not one:

- `d.mode` — a per-day copy inside each history snapshot (`app.jsx:6989`), written from whatever the
  switch was set to while that day was the current day.
- `mode` — a single app-wide current setting (`app.jsx:6329`, `saveMode` at `6544`), synced as one
  row in settings (`syncSettings`, `app.jsx:1437-1441`).

The user never makes a per-day choice. They flip one switch, and each day records the value it saw.
Both are needed in prose and they must be named apart: **"that day's recorded mode"** (`d.mode`) and
**"the mode the app is set to now"** (`mode`). Collapsing both into "status" is what produced the
two false claims in §B-FL-003 and §B-FL-010.

---

# B. The report's vague phrases

## FL-001a — "the date range should run for 7 days ending at yesterday's midnight in the user's local time"

**Unanswered:** which midnight. Midnight opening yesterday (00:00 on 12/09) or closing it (24:00 on
12/09, the same instant as 00:00 on 13/09)? Read the first way, the range is 05/09–11/09; read the
second, 06/09–12/09. An off-by-one bug is being fixed with a phrase that contains an off-by-one
ambiguity, and the two readings differ by exactly the one day at issue.

**Also unanswered:** is the range a pair of instants at all? The data has no instants. `history`,
`weighIns` and `bodyMeasurements` are all keyed by a local-calendar `YYYY-MM-DD` string. Comparing
dates is what the defect line already does wrong, by building its cutoff from
`toISOString()` (UTC) and then comparing it against local keys.

**Plain replacement:**

> The averages use exactly seven date keys: `todayKey()` minus 7 days through `todayKey()` minus 1
> day, inclusive, all built with `dateKey(...)` (local calendar), never `toISOString()`. With
> `todayKey() === "2026-09-13"` that is `2026-09-06` … `2026-09-12`. A row is in range when
> `d.date >= "2026-09-06" && d.date <= "2026-09-12"`. The denominator of every average is the
> number of rows that pass, which is at most 7.

Checkable: three date keys and two comparisons. One Jest case per boundary.

**Arithmetic confirming the defect, and a second count nobody has mentioned:** at
`app.jsx:5612`, `cutoff = new Date(Date.now() - 7*86400000).toISOString().split("T")[0]` is
`"2026-09-06"`, and `d.date >= cutoff` keeps 06,07,08,09,10,11,12,13 — **8 keys**. 17,569 ÷ 8 =
2,196 (card shows 2,196); 544 ÷ 8 = 68 (card shows 68). Correct denominator 7: 17,569 ÷ 7 = 2,510
and 544 ÷ 7 = 77.7 → 78. The report's numbers are right. **Additionally:** under British Summer
Time, between 00:00 and 00:59 local, that `toISOString()` still reads the previous UTC date, the
cutoff becomes `"2026-09-05"`, and the label reads **9 DAYS** for one hour a day. Same expression,
a third count.

## FL-001b — "The current day is excluded until it finishes."

**This is the most dangerous sentence in the report.** "Finishes" already has a live, different
meaning in this code: `isDayClosed({ firstMealHour, nowHour })` at `app.jsx:564-565` returns true
when 14 hours have passed since the first log (`EATING_WINDOW_H`), or at 22:00 with nothing logged
(`DAY_CLOSE_FALLBACK_HOUR`). An implementer who reads "until it finishes" and reaches for the
function that already means that will let today's partial total into the weekly average **at 20:00
on a day whose first meal was at 06:00** — which reinstates FL-001 in a shifted form, on the screen
the bug says the whole app is built around. This is the "clamp" failure exactly: a word whose
everyday meaning is close enough to pass, attached to a mechanism that is not the one wanted.

**No, the fix does not depend on anything that does not exist** — and this is worth stating plainly
because the question invites inventing one. There is no "mark day done" action anywhere in the app,
and none is needed.

**Plain replacement:**

> Today's row is excluded by date key alone: `d.date < todayKey()`. This is not `isDayClosed`, which
> is about grading the day in progress and can be true from 20:00. Today's row re-enters the
> averages when the local calendar date changes, and at no other moment.

## FL-002 — "the overall direction" / "the line drawn through all the readings" / "the smoothed black line"

**Three phrases, three different objects, used interchangeably.** Only one of them exists in the app:

1. **The rolling average actually drawn** — `weightChartData.ROLLING`, `app.jsx:5632-5639`. A
   **trailing** mean of up to 7 readings, `null` until 3 readings exist. It does not pass through
   all the readings and it does not start at the first one: with 7 readings in range its first
   drawn point is `mean(r1,r2,r3)` and its last is `mean(r1…r7)`.
2. **A straight-line least-squares fit** — the report's evidence ("slopes up about 0.87kg/week",
   "−0.08kg/week without 06/09"). **Grepped `app.jsx` for `slope|regress|lsq|linear` — no such
   calculation exists anywhere in the app.** This object lives only in the reporter's own
   spreadsheet. Nothing on screen draws it.
3. **"The overall direction"** — not a defined object at all.

So "the line drawn through all the readings" names (2), "the smoothed black line" names (1), and the
Fix direction's "take it from the ends of that line" is ambiguous between them. They give different
answers: (2) is sensitive to the noisy first reading at full weight, which is the report's whole
complaint; (1) is sensitive to it at one-third weight at the left end.

**Plain replacement for the Fix direction:**

> Take the headline from the rolling average already computed at `app.jsx:5632-5639` — the line drawn
> on the chart — not from raw readings and not from a straight-line fit (no straight-line fit exists
> in the app). State the period: `(last non-null ROLLING − first non-null ROLLING)`, labelled with
> the two dates it spans.

**Two concrete problems with that fix the report does not mention:**

- **Its span is not a week.** With 7 readings in range, the first non-null ROLLING is at reading 3,
  so an end-to-end difference covers reading 3 → reading 7 — **4 days** on the reported data, not 7.
  The report's "rises about 0.3kg across its span" therefore has no stated period and is not
  comparable with the Dashboard's `+x.x kg/wk` (`app.jsx:3494`).
- **"Just call the dashboard fix" does not work for a 7-day range.** `trend7`
  (`app.jsx:3466-3473`) needs `weighRollingAvg(weighIns, weekAgoKey, 7)`, which requires **3 or
  more weigh-ins dated strictly before 06/09**. The report lists weigh-ins on 06–11 and 13 Sept
  only; if there are none before 06/09 then `olderAvg` is `null`, `trend7` is `null`, and the
  Dashboard badge shows **no trend figure at all** while History shows "+1.7 kg". I could not
  verify from the report whether earlier weigh-ins exist (the stated `Calibrated` label implies 28+
  weigh-ins somewhere, so they probably do) — flagging rather than assuming.
- **A range filter silently changes the answer.** History's rolling average is computed from
  `filteredWeighIns` — the range-clipped list — so the window cannot reach back before the selected
  range. The Dashboard's reads the full `weighIns`. The same labelled quantity therefore changes
  when the user taps 30 Days instead of 7 Days. If the headline is to agree with the Dashboard, it
  must be computed from the unfiltered `weighIns`, and that is a decision, not a detail (§C-6).

## FL-003a — "Something flags that the logged intake does not match the selected status"

**Unanswered:** who, where, on what screen, with what words, and at what threshold. "Something
flags" is a placeholder standing where the deliverable goes. "Does not match" has no number — the
reported day was 378 kcal under a 2,709 maintenance target; is 150 a mismatch? 250?

**Plain replacement (a condition an implementer can build and a test can assert):**

> On a day recorded as `maintain` whose logged kcal is at least `WEEK_BAND_KCAL` (250) below that
> day's `targetKcal`, the History day row shows a second line: `Logged 378 under — more like a cut
> day.` No dialog, no automatic change. Threshold reuses `WEEK_BAND_KCAL` (`app.jsx:589`) rather
> than introducing a second number for the same idea.

## FL-003b — "the app offers to correct the status"

**Unanswered:** "offers" how, given the house rule against confirm dialogs and against extra taps
on the logging path — and given that `features/dashboard/04-intake-scoring.feature:706-709` already
carries a guardrail scenario: *"no logged entry, target, or mode is changed automatically. And the
user decides what to do next."* "Offers" sits exactly on the line that guardrail draws.

**Plain replacement:**

> No prompt and no dialog. FL-010 already makes that day's mode tappable on the day screen; the
> second line in FL-003a is the whole correction route. One tap on the mode chip, same as any other
> edit.

This also collapses FL-003 and FL-010 into one change: a sentence on the row, and a chip that can
be tapped.

## FL-003c — "The weekly ring then reports 'This week hasn't been a cut' on the strength of that one day"

**False, and the word "status" is how it got in.** `weeklyIntakeScore` (`app.jsx:614-651`) takes
`days` (kcal, loggedAnything, floored), `selectedMode` and `tdeeBaseline`. **No day's mode is an
input.** The copy is chosen by `WEEK_READ_COPY[selectedMode][band]` where `selectedMode` is the
**live app-wide** `mode` (`app.jsx:3973`), and `band` comes from the week's average kcal against raw
TDEE.

Arithmetic: the Dashboard's week is the 7 local dates 07/09–13/09, of which 6 are logged —
(2580+2334+2228+2504+2927+2331) ÷ 6 = **2,484**. 2,484 − 2,709 = −225, inside `±WEEK_BAND_KCAL`
(250), so `band = "maintain"`; live mode is `cut`; hence amber "This week hasn't been a cut."
**Changing 12/09's recorded mode cannot move that number.** The amber verdict is caused by the whole
week averaging only 225 kcal under estimated maintenance.

**Plain replacement:** delete the claim. Replace with:

> That day's ring segment is amber because `calorieDayScore` measured 2,331 against a maintain
> target of ~2,709. The weekly amber is separate: the six logged days averaged 2,484, which is 225
> under estimated maintenance and inside the ±250 band, so the week reads as maintain while the
> switch says cut.

## FL-005 — "One consistent count, or clearly different labels where the counts genuinely differ"

**Unanswered:** the labels. The counts *do* genuinely differ, and they differ because they answer
three different questions — so "one consistent count" is not available and the second half of the
sentence is the whole deliverable.

| Where | `file:line` | What its number actually counts | Write |
|---|---|---|---|
| Range filter | `app.jsx:5585` | The window requested. | `7 Days` — correct as is. |
| Averages card | `app.jsx:6073` | Rows matched by the filter. | `AVERAGE OF 7 COMPLETE DAYS · 6–12 SEP` |
| List header | `app.jsx:6106` | Rows matched by the filter. | `7 DAYS` (or `7 DAYS WITH FOOD LOGGED`, derived from `kcal > 0 \|\| logs.length > 0`) |
| Dashboard week | `app.jsx:2463` | Days with food logged among the last 7 local dates **ending today**. | `Based on 6 of the last 7 days` — "the last 7 days" distinguishes it from History's "7 complete days". |

**And the decision the sentence hides:** History's fixed range ends **yesterday**; the Dashboard's
ends **today** (`last7Keys`, `app.jsx:3914-3918`). After FL-001 they will still be different
windows, 06–12 against 07–13, and the report's "one consistent count" stays unreachable unless
someone decides whether the Dashboard week moves too. See §C-4.

## FL-007 — "marked as possibly incomplete", "Something on screen separates 'ate little' from 'stopped logging'"

**Unanswered:** marked by whom, from what. The report states in the same breath that nothing stored
can tell the two apart, then asks for a mark — so the mark would be derived from nothing.

**The brief's note that no stored field exists is partly wrong, and the correction matters.** Each
log entry stores `time` (`app.jsx:6573-6574`) and it is synced (`food_logs.time`,
`app.jsx:1340`); `id` is the creation timestamp in milliseconds, and `app.jsx:3892` already derives
`firstMealHour` from it. So **when logging stopped is recoverable; why it stopped is not.** What is
*not* stored is any meal slot — entries are food items, not "breakfast/lunch/dinner" — so "never
logged the evening meal" cannot be detected as a missing slot. Two traps for whoever builds this:
`l.time` is `toLocaleTimeString` output and its format varies by locale, so parse `l.id`, not
`l.time`; and `l.id` is the moment the entry was *created*, so on a day logged retrospectively it
falls outside that day entirely — which is the FL-010 path this report wants to encourage.

**Plain replacement:**

> Show the fact, not a verdict. On a day row whose kcal is under its `targetKcal` by 500 or more,
> add the time of the last entry: `Last entry 13:40`. No adjective, no exclusion from the average,
> no confirmation prompt. The one person using this can read "2,228 kcal, last entry 13:40" and
> knows immediately which kind of day it was; the app cannot and should not claim to.

Whether such a day is excluded from the average is a separate decision — §C-5. Note that excluding
it would contradict `features/dashboard/04-intake-scoring.feature:667-677` ("the bad day's kcal
still counts fully in the average… never dropped or zeroed out").

## FL-008 — "averages start once the first full day has finished"

Same "finished" as FL-001b. Replacement in §A.3. The crash worry is already handled by
`app.jsx:5931` and `6145`; what is needed is one edited string, not a new state.

## FL-010 — "rescores that day", "The weekly result recalculates"

**This is the one to settle before anyone writes code.** "Rescores" reads as a single obvious
operation. It is two, and they give opposite colours on the exact day the bug is about.

Each snapshot stores the real target that applied that day (`targetKcal`, `app.jsx:6994`) and the
Dashboard prefers it over recomputation (`app.jsx:3940-3942`). So changing `d.mode` from `maintain`
to `cut` on 12/09 admits two readings:

- **Keep the stored target (2,709).** `calorieDayScore({mode:"cut", kcalDelta: 2331 − 2709 = −378})`
  → `kcalDelta <= 0` → **green** (`app.jsx:496-498`).
- **Recompute the target under the new mode (2,709 − 500 = 2,209).**
  `calorieDayScore({mode:"cut", kcalDelta: 2331 − 2209 = +122})` → `cutCalorieScore(122)` → 122 <
  `CAL_BAND_MID` (200) → **amber, "JUST OVER"** (`app.jsx:482`).

One word, two outcomes, and one of them leaves the segment the same colour it is now — meaning the
fix would appear not to work. (Arithmetic assumes no workout bonus on 12/09, consistent with the
report's "roughly 380 under".)

**"The weekly result recalculates, so a week wrongly reported as 'hasn't been a cut' reports
correctly once the day is fixed" is false** for the reason in §B-FL-003c: no day's mode is an input
to `weeklyIntakeScore`. The week would still read amber at 2,484 against 2,709.

**Plain replacement:**

> Tapping the mode chip on the day screen writes `mode` into that day's history snapshot via the
> existing `onUpdateDay` path. `history_snapshots.mode` already exists (`app.jsx:1478`) — **no
> migration needed.** That day's ring segment is regraded by `calorieDayScore` against
> [the stored `targetKcal` / a target recomputed for the new mode — DECIDE, §C-1]. The weekly
> verdict does **not** change, because it is computed from logged kcal against raw TDEE and takes
> no day's mode as input.

**One thing to check in implementation, not a wording point:** the daily snapshot effect
(`app.jsx:6985-7008`) rewrites only `todayKey()`'s row, so a past-day edit survives — but it lists
`mode` in its dependency array, so correcting *today* from History and then tapping the chips on
the main screen are two routes writing the same field.

## The heading "Fix direction"

Two items have one (FL-001, FL-002). Both are wishes as written, for different reasons: FL-001's
contains the off-by-one ambiguity it is fixing, and FL-002's names an object the app does not
compute. Both become fixes with the rewrites above. The other eight items have no fix direction at
all, only an expected outcome — which is honest, and better than a vague one. **Suggest renaming the
heading to "Fix" and only using it where a condition is stated**, so the report stops implying a
decision has been taken where it has not.

---

# C. Decisions nobody has made, that the vague language was hiding

1. **When a past day's mode is corrected, does that day's target move?** Keep the snapshotted
   `targetKcal`, or recompute it for the new mode? On 12/09 these give **green** and **amber
   "JUST OVER"** respectively. Hidden by "rescores that day" (FL-010). *Consequence: which colour
   the founder sees after making the correction the bug exists to enable.* **Blocks FL-010.**
2. **Is the recorded `d.mode` a record of what the switch was set to, or a record of what the
   founder intended?** Today it is the former (`app.jsx:6989` copies the live switch). If a past day
   can be corrected, it becomes the latter, and the snapshot's `targetKcal` is then a record of a
   target that was never actually shown. Hidden by "status"/"intention" used as synonyms.
3. **What counts as "the logged intake does not match the mode", numerically?** FL-003 gives no
   threshold. Proposal: reuse `WEEK_BAND_KCAL` = 250 rather than invent a second number for the
   same idea. Hidden by "does not match".
4. **Does the Dashboard's week also move to end yesterday?** History's window will end yesterday
   (06–12); the Dashboard's ends today (07–13, `app.jsx:3914-3918`). If it does not move, FL-005's
   "one consistent count" is unreachable and both screens must name their own dates. If it does
   move, the TODAY card and THIS WEEK ring stop covering the same day, which was a deliberate
   earlier decision (`app.jsx:3930`). Hidden by FL-005's "or clearly different labels".
5. **Does a day suspected of abandoned logging stay in the average?** FL-007 offers three answers in
   one sentence ("marked… or left out… or the user is asked to confirm it"). Leaving it out
   contradicts `features/dashboard/04-intake-scoring.feature:667-677`, which decided a bad day is
   never dropped. Hidden by "or".
6. **Is History's weight headline computed from the range-filtered readings or from all of them?**
   Filtered means the number changes when the range filter changes; unfiltered means it agrees with
   the Dashboard. Hidden by "the line drawn through all the readings" — "all" meaning all in range,
   or all stored. Affects FL-002 and FL-004.
7. **Does FL-004's separate weight range mean the weight card renders when there are zero intake
   rows?** Today the weight headline sits inside the `filtered.length > 0` block (`app.jsx:5931`),
   so a new account with two weigh-ins and no complete day shows nothing at all. Hidden by "each
   card says which dates it is using", which assumes both cards render.
8. **On screen, does CUT/MAINTAIN/BULK get a label word at all?** Recommendation: no, and use
   "mode" in prose. What must not happen is "status" entering the code comments, because that is how
   "ratchet", "clamp" and "gate" each spread.

---

# D. Could not verify

- Whether weigh-ins exist before 06/09 in the reported account. This decides whether the Dashboard's
  `trend7` currently shows a figure at all, and therefore whether the two screens disagree or one is
  blank. Affects FL-002's "the dashboard already fixed this — just call it".
- The individual weight readings for 07/09–11/09 and 13/09. The report's "+0.3kg across its span"
  for the rolling line is its reading of the chart; I have not recomputed it, and I have not
  invented numbers for it. The structural point stands without them: that line's first drawn value
  is `mean(r1,r2,r3)`, so its span on this data is 4 days, not 7.
- Whether 12/09 carried a workout bonus. If it did, `targetKcal` was above 2,709 and the
  §B-FL-010 arithmetic shifts, though not its conclusion (the two readings still differ).

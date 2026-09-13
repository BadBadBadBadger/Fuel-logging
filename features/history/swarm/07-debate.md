# 07 — The closing debate: one decided plan

Chair: Critical Thinking hat (`personas/critical-thinking.md`). Step 7 of nine. Inputs:
`00-bug-report.md`, `swarm/00-brief.md`, and all six reviews (`swarm/01`…`06`) read in full.
No project file was edited. Every `file:line` below was re-read in the working tree at `30b8127`
before being cited; the three commits since `2a9de4c` are documentation only, so every report's
line numbers still hold.

**How to read this.** Where the six disagreed I state the strongest version of each side, name which
report holds it, rule, and say what would change the ruling. Where a reviewer was simply wrong I say
so and name the report that beat them. Nothing here is a survey. Step 8 should not have to reopen
anything except the four questions in §6.

---

## 0. The two things to say out loud before anything else

**The founder's arithmetic verified exactly, every figure, and it was found by eye.** I re-added it
independently: `2665+2580+2334+2228+2504+2927+2331 = 17,569`; `÷8 = 2196.125 → 2196` (shown);
`÷7 = 2509.857 → 2510` (wanted). Fat `67+72+80+80+83+79+83 = 544`; `÷8 = 68` **exactly**;
`÷7 = 77.71 → 78`. `01` reproduced the live strings verbatim on a real harness — `"7 DAYS AVERAGES
· 8 DAYS"`, `2196`, `68g`, `"+1.7 kg"`, `"Based on 6 of 7 days logged"` — and reported *nothing in
his arithmetic needed correcting*. The exact integer hit on a denominator of 8 (fat) is the
strongest single piece of evidence in the batch, and `05` tested the competing explanation (an
eighth day carrying real data) and ruled it out: that day would need ~0 kcal and exactly 0 g fat,
i.e. an empty day. Not a rival theory.

**The swarm was wrong about the founder once, and it was worth catching: four reports independently
found that his FL-003/FL-010 causal claim is false.** No day's `mode` is an input to
`weeklyIntakeScore` — I re-read `app.jsx:614-651` and confirmed the argument object is
`{ days, selectedMode, tdeeBaseline }`, `days` entries are `{ kcal, loggedAnything, floored,
colour }` (`3962`), and `selectedMode` is the single live app-wide `mode` (`3973`). The amber week
is the six logged days averaging `14,904 / 6 = 2,484` against maintenance `2,709` — 225 under,
inside the ±250 band (`WEEK_BAND_KCAL`, `589`). `02`, `03`, `04`, `05` and `06` each reached this by
a different route. **Correcting 12/09 will not turn that sentence green.** That must be said to the
founder before FL-010 is built, or the fix will be reported as broken.

`06` also found *how* the false claim got in, and this is the most useful diagnosis in the batch:
the word "status" covers two different stored values — `d.mode`, a per-day copy inside each snapshot
(`6989`), and `mode`, one app-wide live setting (`saveMode`, `6544`). Collapse them into one word and
you get exactly the claim the report made. Adopt `06`'s naming: **"that day's recorded mode"** and
**"the mode the app is set to now"**. Do not let "status" into the code comments.

---

## 1. What is settled — do not relitigate

| # | Settled | Established by |
|---|---|---|
| S1 | FL-001's observation and arithmetic are exactly right. The denominator at `6077-6078` is `filtered.length` — **rows present**, not days elapsed, not 8. | `01` (executed), `02`, `03`, `04`, `05`, `06` |
| S2 | The ÷8 comes from **no upper bound** on the window, not from `toISOString()`. The lower bound `today−7` is already right for the founder's stated window. | `02` §2 — decisive; corrects the brief's own framing |
| S3 | `toISOString()` is a separate, real defect at exactly three lines — `5612`, `5619`, `5649`. I grepped: those are the only three `toISOString().split("T")` in the file; every other `toISOString` is a timestamp. Under BST between 00:00 and 00:59 the window widens to **nine** keys. | `05` (blast radius), `02` (verified in node), `01` (hour-by-hour) |
| S4 | A **third** defect in the same expression: it uses raw `Date.now()` and ignores `getDevDateOffset()` (`202-204`), which `todayKey()` (`214`) and `last7Keys` (`3915`) both honour. This is why no Playwright test could ever reach the bug. | `02` §2 Defect C — nobody else named it |
| S5 | The tempting partial fixes make the number **worse**. `W:7→6` or `>=`→`>` both give 07–13, still with today's zero: `14,904/7 = 2129`, further from 2510 than the 2196 it replaces, while the header still reads "7 DAYS". | `05` §1.4 |
| S6 | FL-006 was correctly withdrawn. `MODES` (`36-40`) is a user choice; nothing derives it. | all six |
| S7 | FL-003's and FL-010's shared causal claim is false (see §0). | `02`, `03`, `04`, `05`, `06` |
| S8 | FL-010 needs **no migration**. `mode` is already in the snapshot (`6989`), already in the upsert (`1478`), already read back (`1623`), already in the CSV (`1002`). House rule 5 does not bite. | `05`, `02`, `04`, `01` |
| S9 | The correct rule already exists in this codebase, implemented and unit-tested: `weeklyIntakeScore` divides by `assessable = days.filter(d => d.loggedAnything)` (`618-619`, `627`), and `__tests__/logic.test.js:3470` is literally *"an unlogged day is excluded from the average, not counted as a favourable zero"*. It passes. On the other engine, 5,000 lines from the number the founder reads. | `01` §2.1, `02` §3.1, `03` |
| S10 | `features/dashboard/04-intake-scoring.feature` already decided the rule FL-001 breaks and the rule FL-007 asks to break. I read both scenarios verbatim: unlogged days are *"excluded from the week's average outright"*, and a bad day *"still counts fully in the average — never dropped or zeroed out"*. | `03` (both), `06` (the second) |
| S11 | `__tests__/logic.test.js` has **zero** `require` and zero `import` — I ran the count, it is 0. It is a 3,525-line hand-retyped mirror. The History cutoffs were never mirrored, so 370 passing tests carry **no information** about this code, and nothing reports the omission. | `01` §3.2, `02` §4.6 |
| S12 | `features/history/` has no `.feature` file. I checked: the directory holds `00-bug-report.md`, `RESUME.md` and `swarm/` only. Every other screen has one. Per house rule 6 the spec is written before the code. | `01` §3.1 |
| S13 | No least-squares fit exists anywhere in `app.jsx`. I grepped `slope|regress|lsq|linear`: three hits, all unrelated (a diet comment, the Navy formula, a CSS gradient). "The line through all the readings" would have to be written from nothing. | `06` §B-FL-002 |
| S14 | The Dashboard's `trend7` (`3466-3473`) returns `null` on the founder's own weigh-ins. `weighRollingAvg` (`657-661`) needs ≥3 readings strictly before its cutoff; his first weigh-in *is* 06/09, so `olderAvg` is null. "Just call the dashboard fix" swaps a wrong number for a blank card. | `01`, `02`, `04`, `06` independently |
| S15 | `filtered` has six consumers — `5625` (chart), `5931` (the render gate for the whole block), `6073` (header), `6077` (average), `6108` (day list, and the tap target at `6111` that opens a day), `6145` (empty state). Confirmed at all six lines. | `05` §4.1 |
| S16 | Editing **today's** mode through `patch()` (`5683-5691`) silently reverts: the snapshot effect (`6985-7008`) rebuilds today's row from the live `mode` state and lists `mode` in its dependency array. | `04` §5d, `01` §2.10 |
| S17 | No badge or streak reads `mode`. `calcStreak` reads `logs.length` (`254-264`); `BDGS` (`53-57`) count logged days, hydration and streak. `earnedBdgs` is append-only — there is no revoke path in the code. Report open question 2 is answered: no. | `02` §4.3, `04` §5e |
| S18 | There are no closed weeks to recalculate. No weekly figure is stored anywhere; `weeklyIntakeScore` runs on every render over a window rebuilt on every render (`3913-3918`, `3971-3973`). Report open question 1 is answered. | `02` §4.3, `05` §4.4 |
| S19 | The retrospective cut-block drain **cannot** be corrected, at any distance. `accrueCutBlock` is driven by `cuttingToday` (`7018`, the live mode plus the weight-trend backstop) and is idempotent by `lastAccrued` (`7026-7027`). A past day's recorded mode never re-runs it. | `02` §4.3 risk 3 |
| S20 | FL-005's `"Based on 6 of 7 days logged"` is correct, deliberate and spec'd. `last7Keys` is 7 days ending today (`3913-3918`); `app.jsx:588` and `features/dashboard/04:192` both say so in writing. The Dashboard's 7 days are 07–13; History's 8 are 06–13. **Different date sets, not two answers to one question.** The line that renders is `2463`, not `2455` — the brief's map was wrong. | `01` §2.5 (map correction), `02` §3.5, `05` |

---

## 2. Contested points, each with a ruling

### 2.1 FL-001 — the exact change

**`05`'s side.** Do not narrow `filtered`. It has six consumers (S15). Excluding today deletes
today's chart point and today's tappable day row — the latter colliding head-on with the no-tap-
friction house rule, since today is currently reachable from History in one tap.

**`01`'s side.** Stronger than `05` realised: the *whole* chart / averages / weight-trend / day-list
block is gated on `filtered.length > 0` (`5931`, closing at `6150`). Narrow `filtered` and on day
one the weight chart, the body-fat chart, the tape chart and today's weigh-in **all vanish**, and no
existing test asserts that chart is present. `01` rates this the riskiest item in the batch.

**`06`'s side.** The test is `d.date < todayKey()`. Not `isDayClosed`. And `01`'s and `05`'s
question of *which* midnight is a real ambiguity in the report's own words, so state the fix as
three date keys and two comparisons.

**`02`'s side.** The defect is not one rule but two, and the app already owns both. Reuse the
denominator at `618-627`; also exclude past days with nothing logged, because the snapshot effect
writes a row **every day the app is opened** (`6985-7008`, and the comment at `3967` says so), so
past zero rows drag the same average and excluding today does not touch them.

**Do they agree the fix belongs at the denominator rather than the row filter? Yes — and the
agreement is stronger than any of them says.**

**RULING.**

1. **`filtered` keeps exactly the rows it keeps today.** For `W` that is 06–13, eight keys. All six
   consumers are untouched. `05`'s four side effects never happen and `01`'s highest-risk item
   **dissolves** rather than being fixed — nobody noticed that these two findings cancel each other,
   and it is the single most useful consequence of this debate. FL-004 then needs no code at all
   beyond labels.
2. **Only the *construction* of the cutoff changes.** One pure top-level helper,
   `rangeWindow(range, nowMs)` → `{ from, to }`, local keys, built with `d.setDate(d.getDate() - n)`
   + `dateKey` (the `3915-3918` pattern, which is immune to both UTC and DST), honouring
   `getDevDateOffset()`. `to = todayKey()`. Filter becomes `d.date >= from && d.date <= to`. Three
   call sites (`5612`, `5619`, `5649`) collapse into one. `ALL` becomes `from = ""`, which deletes
   `02`'s 1752 arithmetic instead of relying on it.
3. **The average gets its own derived array — this is the whole fix.**
   `avgRows = filtered.filter(d => d.date < todayKey() && hasIntake(d))`, where `hasIntake` is
   lifted from `3953`: `(Number(h.kcal)||0) > 0 || (h.logs && h.logs.length > 0)`. Average is
   `sum / avgRows.length`. On the founder's data `avgRows.length === 7` and the card reads
   **2510** — his own expected number, exactly.
4. **Two clauses, not one.** `02` beat the report here: "7 complete days" alone leaves every
   app-opened-but-unlogged past day counting as a zero. Both clauses together are `S9` + `S10`,
   already decided and already tested. On his data both give 2510, so the numbers contract does not
   move — a free upgrade.
5. **`06` is right that `isDayClosed` must not be used.** I re-read `564-565`: it returns true 14
   hours after the first log (`EATING_WINDOW_H`) or at 22:00 with nothing logged. Using it lets a
   partial day back into the average at 20:00 and reinstates FL-001 in shifted form. `03` asked for
   exactly that gate and `06` beat it. No "mark the day done" concept is needed and the app has none.

**The list stays eight rows.** `04`'s shape wins over `01`'s table, which proposed narrowing the
weigh-in and list windows to seven keys ending today. That would drop 06/09 from the list while the
average still uses it — the average would then cover a day you cannot tap into, which is worse than
the reverse. Keep the list as the union (06–13), label it by its dates, and mark today's row. Nobody
subtracts anything.

**What would change this ruling:** evidence that a past row can exist with `kcal > 0` but no real
intake (which would make clause 2 wrong). I looked and found none.

---

### 2.2 The Dashboard's open day — what gates the ring, what gates the average

**`03`'s side.** Today counts as a complete logged day on `logs.length > 0` (`3930`) with no
day-closed gate, even though `dayClosed` is computed 37 lines earlier at `3893` and already used for
today's own grading. Verified arithmetic, and I re-checked it:

```
nothing logged today:  14,904 / 6 = 2,484  →  2,484 − 2,709 = −225  → maintain → AMBER
one 400 kcal breakfast: 15,304 / 7 = 2,186  →  2,186 − 2,709 = −523  → cut     → GREEN
day finishes at 2,500:  17,404 / 7 = 2,486  →  −223                  → maintain → AMBER
```

So logging breakfast flips the week to a green *"keep going"* and dinner flips it back. A false
all-clear, in the morning, with an instruction in it.

**`06`'s side.** Do not reach for `isDayClosed` to do that. It means "14 hours after the first meal,
or 22:00" — close enough to the everyday meaning of "finished" to pass a reading, attached to a
mechanism that is not the one wanted.

**RULING. `03`'s diagnosis is right and its mechanism is wrong; `06` beat it. Both screens use the
same test, and the test is the date key.**

- **What gates the average (both screens): `d.date < todayKey()`.** Today never enters a weekly
  intake average. One rule, one sentence, no new constant, no clock.
- **What gates the ring's day segments: nothing changes.** This is the distinction nobody drew, and
  it dissolves the apparent conflict. The ring does two separable things: it draws seven day
  segments *and* it computes a weekly verdict. Today's **segment** should keep showing today's live
  colour as it develops — that is useful and it is what `3930`'s `colour` field is for. Today's
  **kcal and `loggedAnything`** should stop feeding the weekly average. Same screen, two gates, only
  one of them is wrong.
- **The residual question is which seven days the verdict averages over**, and that one is genuinely
  forked because it overrides a written founder decision (`features/dashboard/04:192`, *"'this week'
  means the last 7 days ending today"*). That is founder question Q1 (§6).

**What would change this ruling:** nothing about `isDayClosed`; that is settled. Q1 could go either
way and I say so.

---

### 2.3 FL-002 — what actually ships

**`04`'s side (strongest form).** The headline is not wrong about the *direction*, only about the
*size*, by 4×. On the reconstructed readings the rolling line moves 97.6 → 98.0 (+0.4) while the
headline claims +1.7. A design that answers a size error by deleting the direction has
over-corrected. So: keep one big number, make it the line's own number, put the raw spread beside it
as a separate fact, and take the colour off.

**`01`'s side.** "Ends of the rolling line" understates by about 3×, because on a 7-day range every
window is an expanding prefix (`5633`: `arr.slice(Math.max(0, i-6), i+1)`). I replicated it: a
genuinely linear series rising 0.1 kg/day over 7 readings has mean-of-first-3 = `p0+0.1` and
mean-of-all-7 = `p0+0.3`, so the reported figure is **+0.2 against a real +0.6**. It understates in
the direction a dieter wants to hear, which on a cut-safety screen is the worse failure.

**`05`'s side.** The reference line is itself broken. I replicated `5632-5639` exactly on a
**perfectly flat** 98.5 kg week with one low first reading of 97.1:

```
readings : 97.1, 98.5, 98.5, 98.5, 98.5, 98.5, 98.5
ROLLING  :  —     —    98.0  98.2  98.2  98.3  98.3     → span +0.30 kg
```

That is exactly the "about 0.3 kg rise" the report cites as the chart's honest answer. It is the low
first reading's share of the mean shrinking from 1/3 to 1/7 as the window widens — the *same*
reading FL-002 blames, re-entering with the opposite sign. On a genuine slow loss the line still
draws **+0.2**.

**`03`'s side.** Seven days cannot support a weight-trend claim however it is computed. Four
defensible readings of one week span 1.8 kg and both signs. And the app already agrees with itself
about this — I verified all three constants: `gainWhileCutting` deliberately uses 14 days, not 7
(`1108-1112`, with the comment *"a single week of water is exactly the noise this is here to explain
away"*), `STALL_WEEKS = 3` (`1051`), and `runCalibration` refuses to lower the burn estimate on a
disappointing scale while cutting (`787-791`). Minimum defensible span: 14 days for a direction
word, 21 for a number, never red.

**`06`'s side.** Three phrases, three different objects, used interchangeably; only one of them
exists in the app (S13). And the rolling line's span on this data is 4 days, not 7, so the figure
has no stated period while the Dashboard's equivalent is stamped `/wk` (`3494`).

**RULING. `03` and `05` beat `04`. No number and no direction word at the 7-day range.**

`04`'s rejection of a "no direction" state rests on its own reconstructed intermediate weights,
which it flagged as an assumption and which produced +1.46 and +1.17 kg/week — figures that
contradict the founder's own +0.87/−0.08 rather than confirming them. So "every method agrees the
sign is positive" is not established, it is an artefact of guessed data. I tested whether the sign
is forced by the *stated* facts (first 97.1, last 98.8, next-lowest 97.75) and it is not: a fitted
slope can be negative inside those constraints if the middle of the week sits above 98.8, which
`05` also demonstrated with a constructed set. And `05`'s flat-week replication shows the +0.3/+0.4
"agreement" between headline and line is partly manufactured by the expanding window. Two
independent reasons the direction is not known over seven days.

**One shippable card, in four parts:**

1. **Fix the rolling line first (this is FL-013, §4).** A calendar-day window, not a reading-count
   one, computed from the **full** `weighIns` array rather than `filteredWeighIns`, so the left end
   is not starved by the range filter and the same labelled quantity stops changing when the range
   chip changes (`06` §C-6, ruled: unfiltered). Then delete the false premise in the comment at
   `5644-5645`, which claims the body-fat window differs from *"weight's calendar-day window"* —
   weight has no calendar-day window. This also makes the tooltip's hardcoded `"7-day avg"`
   (`6033`) true, which resolves the one place `05` and `06` flatly disagreed: `06` graded that
   tooltip "fine" by comparing it to the Dashboard's wording, `05` graded it against what the code
   computes. **`05` is right; `06` was wrong on that line.**
2. **At the 7-day range: no figure, no direction word, no colour.** Say what the card can honestly
   say — how many weigh-ins are in view, their raw range, and the dates. `03`'s copy is the model
   and `06`'s plain-language standard applies to it. Note the cost is smaller than it looks: the
   default range is `30D` (`5593`), not `W`, so the screen he opens still carries a number.
3. **From 14 days: a direction word only**, from the fixed rolling line, uncoloured.
4. **From 21 days: a figure in kg/week**, from one extracted `weightTrendKg(weighIns, todayK,
   spanDays)` — `02`'s extraction of `trend7`, which also serves `runCalibration`'s `actualChange`
   (`716-720`) and `trendLossFrac` (`1075-1081`), so the headline and the safety engine can never
   disagree again. It returns null on thin data and the card then says so rather than guessing.
5. **Colour comes off entirely** at `6095` (`diff <= 0 ? A : "var(--bulk)"`) and at `3493` on the
   Dashboard badge. `04`'s three reasons are all correct and the second is the guardrail: it rewards
   a lower number on a scale and paints a gain orange during a bulk, while `MODES` sits right there
   unconsulted. For the record, `04` is also right that the "red" in the report is `var(--bulk)`,
   not `var(--over)` — do not go looking for a red token.

**What would change this ruling:** the five real intermediate weigh-ins for 07–11/09. If they show a
monotone rise, `04`'s case strengthens considerably and Q4 should be answered its way. Nobody in the
swarm has them; four reports flagged the gap.

---

### 2.4 FL-005 — the final copy

**`04`'s side.** Dates identify a window; counts only qualify it; no header states a day count.
Literal copy supplied, with widths computed from the style literals.

**`01`'s side.** "6 of 7" is correct and deliberately spec'd (`588`, `2463`) and must be **labelled,
not unified**. Forcing the counts together would be a regression, and after the fix there are
legitimately three windows.

**RULING. Fully compatible — they are the same answer.** `04`'s copy *keeps* `6 of 7 days logged`
and adds its dates beneath; `01`'s objection is to unification, which `04` never proposes (its
"don't build" item 13 says so explicitly). `06`'s alternative header, `AVERAGE OF 7 COMPLETE DAYS ·
6–12 SEP`, states a count in the header and so breaks `06`'s own rule; `04`'s is better. Final copy:

| Where | Now | Ships as |
|---|---|---|
| Range chips `5585` | `Day 7 Days 30 Days …` | unchanged — a request, not a claim |
| Averages header `6073` | `7 DAYS AVERAGES · 8 DAYS` | `DAILY AVERAGE · 6–12 SEP` |
| Averages sub-line (new) | — | `7 of 7 days logged · today not counted yet` |
| List header `6106` | `8 DAYS LOGGED` | `DAY BY DAY · 6–13 SEP` |
| Today's row `6113-6116` | — | `TODAY` after the date and mode chip; drop it if it crowds at 360px |
| Empty range `6147` | `No data for this range yet.` | `No complete days between 6 and 12 Sep.` + `Your last logged day was 20 Aug.` when one exists outside the range |
| Ring subtitle `2463` | `Based on 6 of 7 days logged` | `6 of 7 days logged` / `7–13 Sep` on two deliberate lines |
| Ring, filling-in `2455` | `Still filling in — 3 of 7 days logged so far.` | two sentences for two states, per `06` §A.2 — `Your first week is still filling in — 3 of 7 days so far.` / `Nothing logged in the last 7 days — log a day and this comes back.` |
| Body-fat card `6066` | `▲ 0.7 pts of body fat since last month` | `▲ 0.7 points of body fat vs 14 Aug` |

Removing the word "logged" from the list header also closes `06`'s separate finding that
`filtered.length` counts days the app was *opened*, not days with food (`3967` says so in the
code's own comment). One edit, two findings.

Three supporting items, all adopted:

- **One pure `fmtRange(fromKey, toKey)`**, so Jest owns the format and every label formats
  identically. `04`'s four examples are the contract. Both keys come from the same two local day
  keys that filtered the rows — never re-derived, never from `toISOString()`.
- **`weekScore` gains `from` and `to`** (the ends of `last7Keys`) rather than `IntakeScoreCard`
  recomputing the window.
- **`--text-faint` at 9px fails AA in dark mode (4.10:1)** on `2462` — the smallest text at the worst
  contrast carrying the number FL-005 is about. Use `--text-lo` (5.19:1) there and in every new
  sub-line. `04` computed this from the tokens; I did not re-verify it and am passing it through as
  `04`'s finding.

---

### 2.5 FL-007 — nothing, a label, or a feature

**`03`'s side (decisive).** Dropping incomplete days deletes exactly the low days, which is the
evidence of under-eating this app was built to catch. It breaks a written founder decision — I read
it verbatim: a bad day *"still counts fully in the average … never dropped or zeroed out"*. And any
"leave it out" rule must guess from the only available signal, the total being low: a rule that
deletes low days because they are low.

**`05`'s side.** Same conclusion, with the arithmetic: drop 09/09 and the average goes 2510 → 2557;
drop the two lowest and it reads 2596 — away from the floor he is watching. It also feeds
`runCalibration`'s undamped raise path (`766`: *"Raising is NEVER damped"*).

**`06`'s and `02`'s side.** An abandoned log *is* derivable with no new column: `l.id` is a
`Date.now()` stamp (`5704`), already used as the meal clock by `firstMealHour` (`3892`), persisted as
`entry_id BIGINT` and synced. `l.time` is synced too (`1340`). Meal slots do not exist, so "never
logged the evening meal" cannot be detected as a missing slot.

**`04`'s side.** Don't build it. Every available signal is a bad one — the AI capture can log a whole
day in one entry, so entry count means nothing, and "last entry 14:00" is evidence of lunch, not of
abandonment. Telling a cutting man *"we think you forgot to log"* on a day he genuinely ate little is
precisely the thing this app exists not to do. And a third option beats both: he can already add the
missing meal.

**`01`'s side.** An unbuilt feature, not a defect. Low. And FL-001 *narrows* it: once the denominator
counts only days with intake, "stopped logging entirely" is already handled; what remains is only
the genuinely partial day.

**RULING: a label, and the label is one line of copy. No detector, no exclusion, no column.**

- **The exclusion is dead.** Three reports killed it and a written founder decision forbids it.
- **`06` and `02` are right that it is derivable, and derivable is not the same as worth showing.**
  `02` found the trap that settles it: `addEntry` stamps `id: Date.now()` at *edit* time (`5704` is
  shared by both paths), so a retrospectively-added entry carries a timestamp from a later date — and
  retrospective editing is exactly what FL-010 is about to encourage. A `Last entry 13:40` line would
  therefore be silently wrong on the very days the rest of this batch creates. **WON'T FIX.**
- **What ships is the averages card's own sub-line**, which `03` and `04` both proposed
  independently and which is already in §2.4's copy: the card says what it is built from
  (`7 of 7 days logged`) and, one line down, what the number is a record of. Add `03`'s sentence:
  `What you logged. Today isn't counted until it's done.` That is the honest answer at zero cost, and
  it needs no new state and no new tap.
- If the founder ever wants more, the right shape is a **marker he sets himself**, never a detector —
  and that is a column, a migration run first, and its own piece of work.

---

### 2.6 FL-010 — is there a minimal honest version

**`02`'s refusal (strongest form).** Two reasons, both worse than the bug FL-010 describes.
(i) Recomputing a past day's target needs that day's weight, body fat, `tdeeAdj`, workout bonus and
any custom-kcal override — **none of which are stored**, which is the stated purpose of the snapshot
(`6977-6984`). The obvious shortcut, shifting by ±500, is wrong on any day a safety floor held
(`calcTargets:403-414`) and would push a historical target below `SAFE_MIN`. `h.floored` guards most
of that, but a **user-typed custom target is invisible**: `customKcalApplied` is set on `targets`
(`6967`), never snapshotted, and `floored` reads false. Closing that needs a new column.
(ii) A mode edit can lift `runCalibration`'s refusal to lower the target: `wasCutting`
(`770-771`) gates the asymmetry at `787-791`, the lowering is written to `tdee_adj` and `adjLog`
(`6838-6846`), and **editing the mode back does not undo it**. It is latent — it fires at the next
weigh-in, not at the tap.

**`06`'s side.** "Rescores" reads as one operation and is two, giving opposite colours on the exact
day the bug is about. Keep the stored 2,709 → `kcalDelta = −378` → cut's "under is never a penalty"
(`497`) → **green**. Recompute for cut (2,209) → `+122` → `cutCalorieScore` → **amber, "JUST OVER"**.
One of those leaves the segment the colour it already is, so the fix would look like it failed.

**`04`'s side.** `patch()` reverts on the next snapshot (S16), so it needs an `onSetDayMode` prop
routed to `handleSetMode`. And the day detail **must** show the target the day was scored against,
because otherwise the screen says "cut" while the number it compared against is maintenance.

**`01`'s side.** A naive fix is a no-op for two reasons: the stale stored target, and today's revert.
Both invisible without a test.

**RULING: yes, there is a minimal honest version, and `02`'s refusal is satisfied by it rather than
overridden.** Five parts:

1. **Past days only.** Make the mode chip at `5757-5762` three tappable chips in the Today screen's
   own pattern (`4066-4079`, `04` §5a) — one tap, no dialog, no confirm, the sibling of the
   `training` button already beside it at `5763`. **Today's row stays non-interactive in History.**
   That single restriction removes `04`'s `onSetDayMode` requirement, `01`'s revert trap and the risk
   of a second unguarded route past `askCutGuard` (`4085-4108`), all at once — and it respects the
   standing comment at `4064-4065` that the Today screen is the only place that changes the live
   mode, which then needs no amendment. `04`'s route is more capable; this one is cheaper and
   strictly safer, and at n=1 today's mode is one tap away on the home screen anyway.
2. **Write `mode` and nothing else.** Do not touch `targetKcal`, `targetFat` or `floored`. The
   snapshot keeps the target that actually applied. This is truthful — the app really did tell him
   2,709 that day — and it removes every one of `02`'s reason (i) hazards: no unstored inputs, no
   floor shift, no custom-target hole, no column, no migration.
3. **Show the target it was scored against**, `04`'s line, with the score dot in the same colour as
   that day's ring segment: `● Scored against CUT · target 2,709 kcal · 378 under`. Needs no new
   props and no migration — every field is already in the row History is handed (`6989-7001`). This
   is also the whole of FL-003's legitimate content (§2.7).
4. **Say nothing about the week.** No line claiming a recalculation. It would be false (S7) and
   would need three new props to compute a sentence that cannot change.
5. **It ships only after FL-012.** `02`'s reason (ii) is real and is not closed by parts 1–4. The
   hazard is asymmetric: a MAINTAIN→CUT edit can only *add* refusal (safe, and it is the founder's
   actual case); a CUT→MAINTAIN edit inside the last 7 days can *lift* it (unsafe, irreversible,
   latent). Fixing FL-012's off-by-one first is necessary but not sufficient. Whether to harden
   `wasCutting` as well is founder question Q3 (§6).

**Also ruled, from `02` §4.3 risk 3:** the spec must state plainly that the cut-block ledger cannot
be corrected (S19). `03` used the cut-block drain as its strongest argument *for* FL-010; `02` showed
FL-010 cannot reach it. **`02` beat `03` there** — the drain is a reason the mis-set day mattered, not
a thing this fix repairs. Do not imply otherwise in the copy or the hand-back.

**What would change this ruling:** a check that `localStorage.target_kcal` has never been set on this
account (`02` §7). If it has, part 2 stays correct but any future recompute option is off the table
entirely. One-line check, worth doing.

---

### 2.7 FL-003 — anything left to build?

**`03`:** the amber verdict is *correct* and is the most useful sentence on the screen — he averaged
225 under maintenance in a week he intended to cut. The app's job is to report what happened, not to
ratify what he meant. And an "offer to correct" coaches the wrong lesson: change your label, when
the honest action is change your food. It also breaks a decided guardrail, which I read verbatim:
*"no logged entry, target, or mode is changed automatically. And the user decides what to do next."*

**`04`:** don't build the warning. The fact already reaches him twice (`2430` and the ring's amber
segment); a third statement that fires on most real days becomes something he stops reading.

**`05`:** 2-in-3 false positives on his own week — three warnings in seven days, one right, and the
two wrong ones fire on a deliberate maintenance day and a refeed.

**`01`:** an unbuilt feature with no spec, no threshold and no agreed moment. Medium at best.

**RULING: nothing new to build. WON'T FIX as a warning — and it costs zero extra work, because
FL-010 part 3 already delivers its legitimate content.** The one factual line `04` designed for it is
the same line, in the same place, at the point of correction. Drop `04`'s trailing clause
*"Nearer a cut day"*: that is the relabelling nudge `03` vetoed, and the veto is right. Facts only.

Four reports rejected this independently. The founder's underlying complaint — he spotted the error
himself and could not fix it — is answered entirely by FL-010.

---

### 2.8 Conflicts `RESUME.md` did not track

Found while reading all six in full.

**(a) FL-008: `01` is right; `02` and `05` are both wrong.** Both concluded "not a bug, already
guarded", reasoning from `6077` (`filtered.length ? … : 0`). That guard returns **0**, not "no
average". `01` ran it on a fresh account and the screen said `30 DAYS AVERAGES · 1 DAYS / 0 KCAL 0g
PROTEIN 0g CARBS 0g FAT`. So the real symptom is a **confident wrong number**, live today, before any
fix — worse than the NaN the report feared, because a wrong number gets acted on and a NaN gets
reported. `01` also found the structural reason the empty states never fire: today's snapshot is
created before History is ever opened (`6985-7008`), so `filtered.length === 0` is unreachable and
both `5724-5729` and `6145-6149` are dead code. **Ruling: FL-008 is a live Medium, not a Low
"to be checked", and it needs `04`'s conditional card body, not one edited string.** Execution beat
reading; that is what the QA pass was for.

**(b) The weigh-in window: `01` and `04` conflict and nobody noticed.** `01`'s table (§2.4) wants
weigh-ins on "the same N days **including today**" — seven keys, 07–13. `04`'s card labels the raw
readings `6–13 Sep` — eight keys. **Ruled with `04`:** leave it at 06–13. Narrowing it would drop the
founder's 06/09 reading, which is the single reading FL-002 is about, and would cost the weight chart
a point at the range where it has fewest.

**(c) The weight tooltip's `"7-day avg"` (`6033`): `05` says it lies, `06` says it is fine.** `05` is
right (§2.3 part 1). `06` graded it against the Dashboard's wording instead of against the code.

**(d) `03`'s cut-block argument for FL-010 versus `02`'s finding that FL-010 cannot reach it.** Ruled
in §2.6. `02` beat `03`.

**(e) FL-005's severity: `03` says Low ("protective — the counts are what caught FL-001"), `04` says
High ("it is the reason a Critical arithmetic bug stayed invisible").** They are arguing opposite
sides of the same true observation. **Ruled with `04`, partly:** the visible counts *were* protective,
which is why the fix is labelling and not unification — `03` wins the mechanism. But a screen whose
cards state how many days they used and never which days they were is the condition that hid FL-001
and will hide the next one, so the work is worth more than Low. Medium-High.

**(f) `02`'s "fixing FL-001 makes History and the Dashboard disagree" (§4.2) versus `01`'s "they are
different windows, label them" (§2.5).** Both true. `02` is right that 2510 and 2484 on adjacent
screens against a band edge of 250 is a decision, not a detail; `01` is right that they answer
different questions. Ruled: it is founder question Q1, and my recommendation removes the
disagreement entirely rather than labelling it.

**(g) `01`'s §4.3 trap, which no other report reached, and which changes the test plan.**
`dev_date_offset` does not move the History cutoffs (S4), so with `dayOffset: 5` every seeded row
clears the cutoff regardless and the off-by-one becomes invisible: **a Playwright test written that
way goes green against the broken code and stays green forever.** Rule for the implementer: no
History range test may use `dayOffset` until the cutoffs honour `getDevDateOffset()` — and once they
do, that itself needs a test.

---

## 3. One ranked severity list

Ranked by consequence to the one person who uses this app, not by how broken the code is. Where I
differ from a report I say why.

| # | Item | Severity | Report severities | Why here |
|---|---|---|---|---|
| 1 | **FL-013 + FL-002** — the weight-trend card, line and headline together | **Critical** | `05` Critical / absent; `03` Critical; `04`/`01` High | This is the only place in the app that puts a weekly weight verdict in large type, and the app's own machinery says a weekly weight rise is meaningless (`1108-1112`, `1051`, `787-791`). The headline is pre-interpreted — a sign and a colour that mean "wrong way" to a man mid-cut — and the line he would check it against draws +0.30 on a flat week. `03` ranked FL-002 above FL-001 and I agree, but only because `05`'s finding makes them one card, not two bugs. |
| 2 | **FL-001** | **Critical** | Critical, all six | 314 kcal/day wrong on the headline number the whole app is built around: a 513 kcal/day deficit shown where the real one is 199. `03`'s direction-of-harm analysis is the one to carry forward — it *invents* a deficit, it cannot mask under-eating, and the error is largest at breakfast (`(S7 − 7p)/56`, 314 at `p = 0`) when he plans the day's eating. |
| 3 | **FL-012 + FL-014** — the same two errors inside `runCalibration` | **High** | `05` Medium + High; `02` unreported ×2 | Same arithmetic family as FL-001, but the output is the calorie target rather than a label. FL-012 shifts the cut-majority threshold from 4 to 5, which gates whether the estimate may be lowered; FL-014 lets a partial today into `avgKcal` and more than doubles the apparent estimate error in the lowering direction. Both are the harm the energy-safety workstream exists to prevent. Narrower than they look (a fasted morning weigh-in has `kcal 0`; the cutting refusal shields the rest) — but the window where they bite is a diet break, which is exactly when the refusal lifts by design (`765-766`). |
| 4 | **FL-011** — the weekly verdict counts today | **High** | `03` above FL-001; `02` unreported | A spurious green *"keep going"* in the morning, on the screen that drives what he eats, flipping twice a day. `03` put it above FL-001; I put it below, because its harm is a false all-clear (which reduces pressure to cut) rather than the "eat less" push FL-001 and FL-002 both give. Still High: an unreliable verdict is worse than a missing one. |
| 5 | **FL-010** | **Medium-High** | High ×4 | Down from High because its two worst consequences are not fixable by it: the weekly sentence will not move (S7) and the cut-block drain cannot be undone (S19). What it does fix is real and cheap — the record stops being wrong forever on a mis-tap. |
| 6 | **FL-005** | **Medium-High** | `04` High; `01`/`02`/`05` Medium; `03` Low | Not cosmetic. It is the condition that hid a Critical arithmetic bug, and the same missing date labels will hide the next one. See §2.8(e). |
| 7 | **FL-009** | **Medium** | `01`/`04`/`05` Medium; report Low | `04` put it best: the body-fat chart does not compress a gap, it deletes one — three readings at 10/09, 11/09, 13/09 render at equal thirds and 12/09 disappears. Against a measured tape noise band of ±0.67 points, that is a picture of measurement error with the time axis removed. `01` measured the geometry: 48.3px uniform across a two-day jump, where date-proportional would be ~96.7px. |
| 8 | **FL-008** | **Medium** | `01` Medium; report Low; `02`/`05` "not a bug" | See §2.8(a). Live today, and it is a confident `0 KCAL`. |
| 9 | **FL-004** | **Low as work, High as a check** | `01` "riskiest item"; others Medium | `01` was right to rate it the riskiest item *given the fix it was reviewing*. Under §2.1 it dissolves: `filtered` is untouched, the gate at `5931` never breaks, today's weigh-in never leaves the chart. It survives as one acceptance test, not as code. |
| 10 | **FL-007** | **Low** | `04` won't-fix; `01`/`05` Low; `03` Medium-High | The label ships as one line of copy (§2.5). `03`'s Medium-High rests on the `runCalibration` path, which is FL-014's job. |
| 11 | **FL-003** | **Low** | `04`/`05` Low; `01` Medium; report High | Nothing to build; its content arrives free with FL-010 (§2.7). |
| — | **FL-006** | Correctly withdrawn | — | Its closing sentence carried the false causal claim forward into FL-003; retire that too. |

---

## 4. FL-011, FL-012, and two more numbers

Four new numbers. Each has a distinct code site and a distinct harm, and each needs an identifier
before it can be sequenced.

**FL-011 — The weekly verdict counts today as a complete logged day.**
`app.jsx:3930`. Today's entry is `{ kcal: totals.kcal, loggedAnything: logs.length > 0 }` with no
day gate, though `dayClosed` is computed at `3893` and used for today's own grading. One logged
breakfast flips the week from amber to a green "keep going"; dinner flips it back. Arithmetic in
§2.2. **Severity High.** Fix: exclude today from the weekly average by date key; leave today's ring
*segment* alone. Found by `03` and `02` independently. Not observed on a device — worth five minutes
before step 8 (`03` §6).

**FL-012 — The same off-by-one sits in `runCalibration`, where it gates the calorie target.**
`app.jsx:770`: `history.filter(d => d.date >= weekAgoKey)` with `weekAgoKey = dateKey(today − 7)`
(`713-714`) — eight keys, the identical defect to FL-001. It feeds `wasCutting`'s majority (`771`),
which gates whether a **downward** TDEE correction is refused (`787-791`):

```
8 days → "cutting" needs 5 cut days   (5 > 4)
7 days → "cutting" needs 4 cut days   (4 > 3.5)
```

A week with four CUT days and four others reads as **not cutting**, which lifts the refusal and
allows the estimate — and therefore the target — to be lowered. **Severity High.** `runCalibration`
*is* mirrored in `logic.test.js:457-489`, so unlike FL-001 this one is testable today. Found by `02`
§4.4 and `05` §5.3. Also fix the raw `new Date()` at `712` so it honours `getDevDateOffset()`.

**FL-013 — The weight rolling line's window is by reading count over a range-filtered array, and is
labelled as something else.**
`app.jsx:5632-5639`, with `6033` and the comment at `5644-5645`. Three compounding defects: the
window counts readings rather than calendar days; it rolls over `filteredWeighIns`, so the range
filter starves it and the same labelled quantity changes when the chip changes; and an expanding
window manufactures slope — replicated, a perfectly flat week draws **+0.30 kg**, and a genuine slow
loss draws **+0.2**. The tooltip calls it a 7-day average and the comment claims weight has a
calendar-day window; neither is true. **Severity Critical**, jointly with FL-002 (§3 rank 1). Found
by `05` §5.1; `01`, `02` and `06` each reached part of it. This is the biggest finding in the batch
and it is not in `00-bug-report.md`.

**FL-014 — A partial today enters the adaptive TDEE's intake average.**
`app.jsx:721`: `recentHist = history.filter(d => d.date >= weekAgoKey && d.kcal > 0)` → `avgKcal`
(`733`) → `avgDeficit` (`741`) → `errKcal` (`744`). Worked (`05` §5.2, `02` §4.5a):

```
complete days only : avgKcal 2510 → avgDeficit 199 → expected −0.181 kg → errKcal −199
with 400 kcal today: avgKcal 2246 → avgDeficit 463 → expected −0.421 kg → errKcal −463
```

More than double the apparent estimate error, in the lowering direction. Mitigated by timing (a
fasted morning weigh-in has `kcal 0`) and by the cutting refusal — but `correctionHeld` (`6908`)
evaluates it on render, so the mid-day path does run, and the refusal lifts on a break. **Severity
High.** One-line fix: add `d.date !== todayKey()` alongside `d.kcal > 0`.

**The hand-typed test mirror does not get an FL number, and here is why.** FL numbers identify
defects the founder can see on a screen. `logic.test.js` having zero `require` of `app.jsx` (S11) is
a tooling defect: it is the answer to *"how did 370 green tests miss a ÷8 bug"*, and it invalidates
the suite as evidence for anything in `History`, but it is not something the app does wrong. Record
it as a standing engineering item — `01`'s recommendation to extract the pure layer into a
`logic.js` that both `app.jsx` and Jest load is the real fix, it touches `build.sh`, and it is
outside this batch. Its cheap mitigation is item 1 of the build order.

The cruellest detail, and the one to put in the hand-back: `weeklyIntakeScore` divides by *logged*
days **correctly**, and `logic.test.js:3470` is literally a test named *"an unlogged day is excluded
from the average, not counted as a favourable zero"*. The right rule is implemented and tested — on
the other engine, 5,000 lines from the one that shows the number the founder reads.

---

## 5. Sequencing, and the build order

### Does testability work block the fix, or run alongside it?

**`01`'s argument.** The first thing written should be a four-line static source-text guard in the
style of `__tests__/styles.test.js`, because `logic.test.js` has zero `require` of `app.jsx` — so 370
passing tests carry no information about this code. `01` and `02` both add that the date boundary is
currently untestable: there is no dev-clock offset on the cutoffs, so a test written with `dayOffset`
passes vacuously.

**RULING: one piece of testability work blocks everything, and the rest runs alongside.**

- **Blocking (minutes, not hours): the static source guard.** I read `__tests__/styles.test.js` — it
  already exists as exactly the right template, written after a silent whole-app bug survived every
  DOM assertion, and its own header says it is static on purpose because *"it sees the tints that
  only appear once you tap to edit a target, **or open History**"*. The repo invented the right
  instrument for this class of bug, for this screen, and never pointed it at dates. `01`'s four lines
  fail immediately on `5612`, `5619`, `5649`, catch every future recurrence, need no clock and no
  fixture, and I verified the regex matches nowhere else in the file. **Write it first.** It is the
  highest value-per-line item in the plan.
- **Also blocking, and it is the house rule not a preference: the `features/history/01-*.feature`
  spec.** There is none (S12), and house rule 6 puts the spec before the code. It must name the three
  windows in writing, or the next person will "fix" one into another.
- **Not blocking: extracting `rangeWindow` and `weightTrendKg` into testable pure functions.** That
  is step 1 of the fix itself, not a prerequisite to it — `02` §4.6 is right that extraction is the
  only way these fixes get a regression test at all, so it *is* the fix's first commit. It carries no
  behaviour risk.
- **Not blocking, and explicitly deferred: a dev-clock offset for the cutoffs.** Make the new
  `rangeWindow` honour `getDevDateOffset()` (it should, for consistency with `todayKey`), and until
  its own test exists, **no History range test may use `dayOffset`** (§2.8g). Seed relative to real
  today. `page.clock` is available in Playwright 1.62.1 but `01` flagged it as unverified against
  this harness; Jest with an injected `nowMs` is the mechanism that matters, and the repo already
  does this (`bodyFatWindowChange(measurements, sex, asOfMs = Date.now(), …)` at `921`, driven with
  fixed values at `logic.test.js:1358`).

### The build order

| # | Item | Mark | Notes |
|---|---|---|---|
| 0 | Static source guard: no `toISOString().split("T")[0]` day keys in `app.jsx` | **BUILD NOW** | `01` §3.5. Fails on three lines today. |
| 1 | `features/history/01-range-windows-and-averages.feature` | **BUILD NOW** | House rule 6. Names all three windows and the label rule. Tag FL-003/FL-007 scenarios `@wip` with the ruling inline, or they read as truth. |
| 2 | Extract `rangeWindow(range, nowMs)`, `hasIntake(row)`, `fmtRange(from,to)`, `weightTrendKg(...)` — behaviour unchanged, mirrored into `logic.test.js`, with the failing tests written first | **BUILD NOW** | `02` §4.6. A1 fails at 8 ≠ 7 before the fix; that is the point. |
| 3 | **FL-001** — the `avgRows` denominator (both clauses), plus the local/dev-clock-aware window at all three call sites | **BUILD NOW** | §2.1. Expect 2510 and 78g on the founder's data. |
| 4 | **FL-005** — the whole label system, including the Dashboard's two lines and `--text-lo` | **BUILD NOW** | §2.4. Ships with FL-001; the header cannot state a count once the denominator differs from the row count. |
| 5 | **FL-008** — the day-one card body and the empty-range copy | **BUILD NOW** | §2.8(a). Live bug, not a consequence of the fix. |
| 6 | **FL-012** — `runCalibration:770` off-by-one, and `712`'s dev clock | **BUILD NOW** | §4. Already Jest-testable. Must precede FL-010. |
| 7 | **FL-014** — `d.date !== todayKey()` at `721` | **BUILD NOW** | §4. One line. |
| 8 | **FL-013** — the rolling line: calendar-day window, computed from the full `weighIns`, and delete the false comment at `5644-5645` | **BUILD NOW** | §2.3 part 1. Prerequisite for FL-002. |
| 9 | **Take the colour off** the weight delta at `6095` and the Dashboard badge at `3493` | **BUILD NOW** | `04` §3. One line each, and `04`'s reasoning is uncontested. |
| 10 | **FL-011** — exclude today from the weekly average; leave today's segment | **NEEDS FOUNDER DECISION (Q1)** | The gate is settled (`d.date < todayKey()`, not `isDayClosed`). Which seven days the verdict averages is Q1. |
| 11 | **FL-002** — the card: nothing at 7 days, a word at 14, a number at 21, no colour | **NEEDS FOUNDER DECISION (Q4)** | The mechanism is settled; the minimum span is the founder's call. |
| 12 | **FL-009** — a true time axis on the weight and body-fat charts (`type="number"`, epoch ms from the local key parsed at `T12:00:00`, `scale="time"`, `tickFormatter` reusing `fmtShort`) | **BUILD NOW** | `02` §3.9: `measurementChartRows` already carries `rawDate` (`982`), so most of it is paid for. **Leave the kcal line and bar charts categorical** — `chartData` already has one row per day and a time axis on a bar chart needs an explicit `barSize`. Break the average line at gaps of 3+ consecutive days without a reading (`04` §7; I am ruling `04`'s starting number rather than leaving it open). |
| 13 | **FL-010** — three tappable chips on **past** days only; write `mode` only; show the target it was scored against; say nothing about the week | **NEEDS FOUNDER DECISION (Q2, Q3)** | §2.6. Last, after FL-012. |
| 14 | **FL-007** — the averages sub-line copy | **BUILD NOW** | Ships inside item 4. |
| 15 | `06`'s small true-label items: `points` not `pts` (`6066`), and name the actual comparison date instead of "since last month" | **BUILD NOW** | §2.4. Four characters and one field already in hand. |
| — | FL-003's warning, in any form | **WON'T FIX** | Four reports rejected it; a decided guardrail forbids automatic changes; its content ships free with item 13. §2.7 |
| — | FL-007's incomplete-day detection, mark, or exclusion | **WON'T FIX** | A written founder decision forbids dropping a day; `02` found that `l.id` is an *edit* timestamp, so the derivable version is silently wrong on retro-edited days. §2.5 |
| — | "Ends of the rolling line" as the headline figure | **WON'T FIX** | Understates ~3× (`01`, replicated) and differences a 3-reading mean against a 7-reading mean (`02`). §2.3 |
| — | A new least-squares estimator | **WON'T FIX** | None exists (S13); a fourth smoothing rule on a 7-point window is not a trend. |
| — | Recomputing or delta-shifting a past day's `targetKcal` | **WON'T FIX** | `02` §4.3: unstored inputs, a floor that must not be shifted, and an invisible custom-target hole that needs a column. Unless Q2 goes the other way. |
| — | A read-only cut-off on old days; revoking a badge after an edit; a confirm step on a mode change; a toast after one | **WON'T FIX** | Report open questions 2 and 3, answered: S17, S18, and the no-friction house rules. `02`, `04`, `05` agree. |
| — | Reconciling the day counts into one number | **WON'T FIX** | Three legitimately different windows and one list. Naming them is the fix. |
| — | Narrowing `filtered`, in any range | **WON'T FIX** | §2.1. Four regressions for one benefit already available elsewhere. |

Every step: rebuild `app.js` via `build.sh` and bump `sw.js` (at **v81** now).

---

## 6. The founder's questions

Four. Everything else in this batch is ruled above.

---

**Q1. Should the Dashboard's weekly verdict average over the same seven days as History?**

Right now the ring's verdict averages the last 7 days *ending today* and counts today as a logged day
the moment one item is logged, so it flips amber → green at breakfast and back at dinner. The gate is
settled — today stops feeding the average. What is not settled is which seven days replace it, and
the answer overrides a decision you signed on 2026-09-04 (`features/dashboard/04:192`, *"'this week'
means the last 7 days ending today"*).

- **(a)** The ring averages the **7 complete days ending yesterday** — the same window as History.
  One weekly intake number across the whole app: 2,510 on your data. Today's ring *segment* still
  shows today's colour as it develops; only the verdict's window moves.
- **(b)** The ring keeps the last 7 days ending today, with today never counted. The verdict is then
  built from at most 6 complete days, so the ring says 2,484 while History says 2,510 — both correct,
  both labelled with their dates.
- **(c)** Leave it as it is and accept the morning flip.

**Recommendation: (a).** It ends the three-way disagreement between 2,196, 2,484 and 2,510 that
`05` ranked as a major finding, and it means the two screens can never quote different weekly
averages again. (c) is not defensible: a verdict that says *"keep going"* at breakfast and *"hasn't
been a cut"* at dinner is not a verdict.

---

**Q2. When you correct a past day's mode, does that day keep the target it was actually given?**

12/09 was set to MAINTAIN and its snapshot stores the 2,709 kcal target that applied. Correct it to
CUT and there are two readings, with opposite results:

- **(a) Keep the stored 2,709.** `2,331 − 2,709 = −378`, and under a cut "under is never a penalty",
  so the day reads **green**.
- **(b) Recompute a cut target, 2,709 − 500 = 2,209.** `2,331 − 2,209 = +122`, which is over, so the
  day reads **amber, "JUST OVER"**.

**Recommendation: (a).** Three reasons. It is truthful — the app really did tell you 2,709 that day.
It needs nothing that was never stored, whereas (b) needs that day's weight, body fat, `tdeeAdj`,
workout bonus and any typed-in target, none of which are on the snapshot; the shortcut of shifting by
500 is wrong on any day a safety floor held and could put a historical target below your safety
minimum. And a typed-in custom target is invisible to every stored field, so (b) has a hole that only
a new database column can close. Either way the day detail will show the target it was scored
against, so nothing is hidden.

---

**Q3. Should a mode correction be prevented from unblocking a lowering of your calorie target?**

`runCalibration` refuses to lower its burn estimate while you were cutting. "Were you cutting" is a
majority of the recorded modes over the last week. So correcting CUT → MAINTAIN on a recent day can
tip that majority, lift the refusal, and lower your target at your next weigh-in — and correcting the
mode back does not undo it, because the lowering has already been written. Correcting the other way,
MAINTAIN → CUT, is always safe. Your actual case is the safe direction; this is about the other one.

- **(a)** Ship the chips for all past days and accept the risk. It only bites on a CUT → MAINTAIN
  edit inside the last 7 days.
- **(b)** Ship the chips for all past days, and also let "were you cutting" fall back to the
  weight-trend cut detector the app already has (`trendCutting`, `app.jsx:7017`, which the cut-block
  already trusts): a scale falling at cut pace keeps the refusal in place whatever the labels say.
  One extra condition, in the safety engine.
- **(c)** Only allow corrections on days older than 7 days. No risk — and no fix, because the day you
  noticed was two days old.

**Recommendation: (b).** It closes the hazard with a mechanism already in the codebase and makes the
correction safe in both directions. (c) refuses exactly the correction the bug was raised for.

---

**Q4. At the 7-day range, should the weight card show a number at all?**

Your own fix direction asks for one: *"If a single figure is wanted, take it from the ends of that
line."* Three findings argue against it. The line you would take it from rises +0.30 kg on a
perfectly flat week (replicated) and understates a real rise by about 3× (replicated). Four
defensible readings of your seven weigh-ins span 1.8 kg and both signs. And the app already refuses to
read a single week of weight: the gain explanation deliberately uses 14 days *"because a single week
of water is exactly the noise this is here to explain away"*, the stall check uses 3 weeks, and the
calibration refuses to act on a disappointing scale while cutting.

- **(a)** No figure and no direction word at 7 days — the card states how many weigh-ins are in view,
  their raw range and the dates. A direction word from 14 days; a kg/week figure from 21. Never
  coloured.
- **(b)** Keep one big number at 7 days, but make it the fixed line's own number, with the raw
  readings named beside it as a separate fact and no colour.
- **(c)** As (a), and at the 7-day range also replace the curve with one flat line at the week's
  average weight, labelled — so seven dots scatter around one honest horizontal line instead of a
  curve whose smoothing changes along its length.

**Recommendation: (a), and (c) if you like the picture.** Note the cost is small: History opens on the
30-day range, not 7 days, so the screen you actually land on still carries a number. What would change
this answer is your five weigh-ins for 07–11/09 — nobody in the swarm has them, and if they show a
steady climb the case for (b) gets much stronger.

---

## 7. What I could not verify

Stated rather than filled in.

1. **The five intermediate weigh-ins for 07–11/09.** Four reports flagged this. It means the
   founder's `+0.87` / `−0.08 kg/week` figures are unauditable, `04`'s `+0.4 kg` line movement is
   computed from reconstructed data, and the "4× overstatement" figure in `RESUME.md` is contingent on
   that reconstruction rather than measured. **Do not carry any of those three numbers forward as
   fact.** The verified structural finding is enough: the headline is raw last-minus-first, and the
   line it should agree with is built wrong.
2. **Whether weigh-ins exist before 06/09 on the live account.** This decides whether the Dashboard's
   `trend7` currently shows anything at all. The `Calibrated` label implies ≥28 lifetime weigh-ins
   (`3475`), which suggests yes, but the report's "Calibrated est. TDEE" may be different copy.
3. **12/09's actual stored `targetKcal` and `floored`.** Q2's arithmetic uses 2,709 and a flat −500;
   the real snapshot also carries that day's workout bonus. Read the real row before promising a
   colour. `02` and `06` both flagged this.
4. **Whether `localStorage.target_kcal` has ever been set.** Decides whether the custom-target hole in
   Q2(b) is theoretical or live. One-line check.
5. **FL-011 on a device.** `03` reasoned it from the code and reproduced the founder's exact figures,
   but did not observe the green flip. Five minutes: log one small item in the morning and watch the
   ring.
6. **`04`'s contrast numbers** (`--text-faint` 4.10:1 dark, `--text-lo` 5.19:1) and its ~380px width
   estimates. Computed by `04` from the tokens and style literals, not re-derived by me, and not
   measured from a screenshot.
7. **`03`'s "one day off cancels roughly four cut days"**, cited from `ENERGY_MODEL.md` §5.3. I
   verified the mechanism (`1 − offRun/DIET_BREAK_DAYS`, `1145-1147`, with `DIET_BREAK_DAYS = 14`) but
   not that figure, which depends on block size.
8. **`03`'s 0.5–1.0%-of-bodyweight day-to-day weight variation.** `03` flagged it itself as a working
   estimate from practice, not a citation it re-read. Use the self-measured four-estimator spread
   (1.8 kg across one week) with the founder instead; it needs no citation.
9. **Whether `page.clock` works against this harness.** `01` flagged it unverified; `e2e/harness.js`
   seeds inside `addInitScript` using `Date.now()`, so install order matters.
10. **Whether live Postgres accepts a `mode` update on a past date.** The column exists and is in the
    payload, so no migration should be needed — but schema and row-level security are not testable
    from here by anything. FL-010 needs the one-time device check in `DEVICE-TEST.md`.

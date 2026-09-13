# Engineering review — FL-001 … FL-010

Hat: senior engineer, implementation & data-integrity (`personas/engineering.md`).
Reviewed: `BUG-REPORT.md` + the real code in `app.jsx`, `setup/supabase-schema.sql`,
`__tests__/logic.test.js`, `e2e/harness.js`. Nothing in the project was edited.

Repo state note: the `features/body/02` work that was uncommitted when this review started was
committed **during** the review as `2a9de4c feat(body): body measurements in History, save
feedback, and CSV export`. The working tree is now clean. Section 5 is written for the
post-commit world and says what changes because of that.

---

## 1. Verdict table

| ID | Reporter's verdict | Mine | Why | Build cost |
|---|---|---|---|---|
| FL-001 | Critical, ÷8 | **Real bug, correctly measured, under-diagnosed** | The ÷8 is the missing upper bound, not the UTC string. There is a *third* defect in the same line (no dev-clock offset) and a *fourth* cause of a wrong denominator the report misses (0-kcal snapshots on past days). | Small code, **structural decision** — see §4.1 |
| FL-002 | High | **Real bug. Fix direction is three different sums presented as one, and the named precedent returns `null` on the reporter's own data** | §3.2 | Medium — needs a founder call on which number |
| FL-003 | High | **Mis-diagnosed.** The mis-set mode did *not* cause the weekly "hasn't been a cut". Arithmetic in §3.3. The amber segment claim is correct. | n/a — the warning itself is a new feature, not a fix |
| FL-004 | Medium | **Real constraint, right call.** Also uncovers a hard coupling: the weight/body-fat charts are gated on *intake* rows existing (`app.jsx:5931`, `5944`). | Small, once §4.1 is decided |
| FL-005 | Medium | **Real.** Four counts, not three, and the brief's line pointer is wrong (`app.jsx:2463`, not `2455`). One of the four is mislabelled, not just inconsistent. | Small — but see §4.2, the fix makes two windows diverge |
| FL-006 | Withdrawn | **Correctly withdrawn.** | — |
| FL-007 | Medium | **Real gap. No migration needed — and "meal-slot coverage" does not exist in this data model.** Inferable from `l.id`. §3.7 | Small if inferred; a migration if stored |
| FL-008 | Low, "will break the fix" | **Not a bug. Already guarded** at `app.jsx:5931` + `6077`. No NaN, no divide-by-zero, ever. Only the empty-state *copy* becomes wrong. | One string |
| FL-009 | Low | **Real, and narrower than stated** — 2 charts, not 5. `measurementChartRows` already carries `rawDate` (`app.jsx:982`), so most of the fix is already paid for. | Small per chart; leave the bar chart alone |
| FL-010 | High | **Real bug, and the specified fix is the one thing in this batch I would refuse to build as written.** It requires recomputing a *safety-floored* calorie target from inputs that were never stored. §3.10, §4.3 | UI: ~8 lines. Doing it correctly: a founder decision, possibly a migration |

Two bugs that are **not in the report** and are higher-stakes than most that are — §4.4 and §4.5.

---

## 2. The cutoff expression, separated

The expression at `app.jsx:5609-5614`, copy-pasted at `5616-5621` and `5646-5651`:

```js
const days   = { W:7, "30D":30, "3M":90, "1Y":365, ALL:99999 }[range];
const cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
return history.filter(d => d.date >= cutoff);
```

There are **three** independent defects braided here, not two.

### Defect A — no upper bound. This is the ÷8.

Today 13/09. `Date.now() − 7×86400000` → `2026-09-06` (verified in node at 09:38 BST:
`7 -> 2026-09-06`). `d.date >= "2026-09-06"` retains `06,07,08,09,10,11,12,13` = **8 keys**.

The reporter's arithmetic is exactly right:
`2665+2580+2334+2228+2504+2927+2331 = 17569`; `17569/8 = 2196.125 → 2196` (shown);
`17569/7 = 2509.857 → 2510` (wanted). Fat `67+72+80+80+83+79+83 = 544`; `544/8 = 68` (shown),
`544/7 = 77.71 → 78` (wanted). Confirmed against `Math.round(avg)` at `app.jsx:6079`.

**Note which half is wrong.** The *lower* bound `today−7` is already correct for the founder's
stated window ("7 days ending yesterday" = 06–12). What is missing is `d.date < todayKey()`.
So the fix is an added upper bound, **not** a change to the `>=`. The brief's framing
("inclusive `>=` over a 7-day subtraction") would lead an implementer to change the wrong
operand and produce 07–13 — a 7-day window that still includes today and still climbs all day.

### Defect B — `toISOString()` is UTC. This is not the ÷8.

In BST (UTC+1) the UTC date is one day behind the local date only between local 00:00 and 01:00.
Verified in node: at local 00:30 BST the cutoff is `2026-09-05` (**9 keys**, ÷9); at 10:00 BST it
is `2026-09-06` (8 keys). In GMT the shift is zero. So defect B costs one extra day for one hour
a night, half the year. The founder measured during the day, so **defect B did not produce the
÷8 he saw.** It is still a real bug — it is house rule 3, and `app.jsx:5667-5671` (added by
`2a9de4c`) already documents it in a comment without fixing it.

### Defect C — the cutoff ignores the dev clock. Nobody has named this.

`Date.now()` is raw. Every other day-key producer in the app goes through `getDevDateOffset()`
(`app.jsx:202-204`): `todayKey()` (214-220), `calcStreak` (254-264), Dashboard's `last7Keys`
(3913-3918). So with `dev_date_offset` set — which is how `e2e/harness.js:58` seeds every
Playwright test — `history` keys are shifted and the cutoff is not. **This is why FL-001 and
FL-002 survived: the only executable harness that can reach this code cannot drive it.** Any fix
must route through a dev-clock-aware "today".

### `30D` / `3M` / `1Y` — same defect, and the report's implied severity curve is wrong

Window sizes: `30 → 31 keys` (14 Aug–13 Sep), `90 → 91`, `365 → 366`. One extra key each.

But the denominator at `app.jsx:6078` is `filtered.length` — **rows present, not days in the
window.** With the reporter's 8 rows, every non-`DAY` range retains all 8 rows, so `W`, `30D`,
`3M`, `1Y` and `ALL` **all display 2196 right now**. The error does not shrink with range; it
shrinks with how much history exists. At 8 rows it is a flat 12.5% on every range.

### `ALL` (99999 days) — works, by accident, and I checked it

`Date.now() − 99999×86400000 = −6,850,624,885,110 ms` → `new Date(...)` is a valid Date,
`toISOString()` → `1752-11-29T08:38:34.879Z`, cutoff `"1752-11-29"`. No `NaN`, no throw, and the
lexicographic compare `"2026-09-06" >= "1752-11-29"` is true because both years are 4-digit
zero-padded. JS `Date` tolerates ±8.64e15 ms, so 99999 days is ~1000× inside the limit. **Not a
bug today.** It is still worth deleting: a window helper returning `from = ""` (sorts below every
key) removes the 1752 arithmetic entirely rather than relying on it.

---

## 3. Root cause per bug

### 3.1 FL-001 — and the denominator defect the report misses

Confirmed real. Beyond §2, there is a fourth cause of a wrong denominator that will survive the
reporter's fix:

**A snapshot row exists for every day the app was opened, logged or not.** The effect at
`app.jsx:6985-7008` writes a snapshot unconditionally whenever `ready` is true. So a day the
founder opened the app and logged nothing sits in `history` as a `kcal: 0` row, is counted by
`filtered.length` (6078), and permanently drags the average down. Excluding *today* does not
touch it.

The Dashboard already solved this and History does not use the solution:
`loggedAnything` (`app.jsx:3953`) → `assessable = days.filter(d => d.loggedAnything)` →
`avgKcal` over `assessable` only (`app.jsx:618-627`). That is the same rule FL-007 is asking for,
already live one screen away.

So the correct FL-001 fix is **two rules, not one**:
1. exclude the open day (upper bound `< today`), and
2. exclude days with nothing logged, reusing the Dashboard's existing
   `(Number(h.kcal)||0) > 0 || h.logs?.length > 0` test.

Rule 2 removes a special case rather than adding one: it fixes today's zero row, past zero rows,
*and* most of FL-007, under a rule that already exists. On the reporter's data both rules give the
same 2510, so the numbers contract is unchanged — which makes this a free upgrade.

### 3.2 FL-002 — the precedent exists, is **not** a reusable function, and returns `null` on this data

**Found the dashboard fix.** It is `trend7`, an **inline IIFE** at `app.jsx:3466-3473` inside
`WeighInWidget`, with the v78 rationale in the comment at `3458-3465`. It is not a named
top-level function, so **History cannot "just call it"** — it has to be extracted first. That is
the right move anyway, because the same comparison now exists in three places:

- `runCalibration`'s internal `actualChange` (`app.jsx:716-720`),
- `WeighInWidget.trend7` (`3466-3473`),
- `trendLossFrac` (`1075-1081`), which is the same two rolling averages expressed as a *fraction
  of bodyweight per week* rather than kg.

One extracted `weightTrendKg(weighIns, todayK, spanDays)` serves all three and is Jest-testable.

**The blocking problem: on the reporter's data the dashboard's version returns `null`.**
`weighRollingAvg` (`app.jsx:657-661`) requires `subset.length >= 3` after filtering
`w.date < beforeDate`. `trend7` computes `olderAvg = weighRollingAvg(weighIns, weekAgoKey, 7)`
with `weekAgoKey = "2026-09-06"`. The reporter's weigh-ins are 06,07,08,09,10,11,13 — **zero**
are strictly before 06/09 → `olderAvg === null` → `trend7 === null`. So:

> If History's headline is switched to the dashboard's maths, on the dataset in this bug report
> the WEIGHT TREND row **disappears** rather than reading correctly. It needs ~3 weigh-ins at
> 03/09 or earlier.

That is a behaviour change the founder has not agreed to. It may well be the right answer
("silence beats a confident wrong reading" is already this codebase's stated preference —
`app.jsx:1074`), but it must be a decision, not a surprise.

**The report's fix direction is three different sums.** It says, in three sentences:
(a) "the direction of the line drawn through all the readings" — a least-squares slope;
(b) "take it from the ends of that line" — the slope endpoints;
(c) "the headline comes from the same line already drawn on the chart" — `ROLLING`
    (`app.jsx:5631-5639`).

These are not the same number. `ROLLING` is a **trailing** mean over the last ≤7 *readings*
(`arr.slice(Math.max(0,i-6), i+1)`), so its first drawn value (i=2) is a 3-reading mean and its
last is a 7-reading mean. Differencing those two compares a 3-point window against a 7-point
window — a biased, shrinking-window figure that is not a trend in any sense. Option (a)/(b) is a
fourth kind of maths again, and nothing in the codebase does least squares today.

**Recommendation:** do not add a fourth smoothing rule. Extract `trend7` to a named function,
use it for the headline, and accept that it is silent until there are readings either side of the
week boundary. The chart keeps `ROLLING` as the *picture*; the headline is the *number the safety
engine acts on*. That is the only version where the headline and `runCalibration` can never
disagree, which was the whole point of the v78 fix.

**Ordering — checked and fine.** `filteredWeighIns[0]` / `[len-1]` assume ascending order.
Writes sort (`app.jsx:6811-6812`), `updateDay` sorts (`6798-6799`), the snapshot effect sorts
(`7002-7003`), and the Supabase pull is `.order("date")` (`1537`, `1542`). No latent ordering bug.

### 3.3 FL-003 — the causal claim is wrong, and this matters for FL-010

The report says the weekly ring reported "This week hasn't been a cut" **"on the strength of that
one day"** (12/09 set to MAINTAIN). That is not how the weekly read works.

`weeklyIntakeScore` (`app.jsx:614-651`) reads **only** `kcal`, `loggedAnything` and `floored` per
day. It never reads `d.mode`. The verdict comes from `avgKcal - tdeeBaseline` against
`WEEK_BAND_KCAL = 250` (`589`, `627-628`).

Arithmetic, using the report's own numbers. Dashboard's window is the last 7 keys *including*
today (`app.jsx:3913-3918`) = 07–13. Assessable days are 07–12 (13/09 has 0 kcal, 0 logs →
`loggedAnything` false at `3930`):

```
(2580+2334+2228+2504+2927+2331) / 6 = 14904 / 6 = 2484
2484 − 2709 = −225      |−225| < 250  → band "maintain"
selectedMode "cut" × band "maintain" → amber, "This week hasn't been a cut."   (app.jsx:601)
```

The week read amber because it averaged **225 kcal under maintenance — inside the ±250 maintain
band**. 12/09's mode contributed nothing to it. What 12/09's mode *did* cause is the amber
**segment**, and that part of the report is exactly right:

```
maintain target ≈ 2709, eaten 2331 → kcalDelta = −378
|−378| ≥ MAINTAIN_WIDE_MARGIN_KCAL (200, app.jsx:473) → amber "Under-eaten"   (app.jsx:511-514)
```

**Consequence for FL-010:** correcting 12/09 to CUT will change that day's segment colour and
will **not** change the weekly verdict the founder wants changed. If FL-010 ships on the promise
at the end of FL-010's Expected outcome ("a week wrongly reported as 'hasn't been a cut' reports
correctly once the day is fixed"), it will be reported as a failed fix. The weekly verdict is a
band-width question (`WEEK_BAND_KCAL`, flagged `OPEN` in the code at `589`), not a mode question.

### 3.4 FL-004 — right call, and it exposes a gate nobody mentioned

Agreed on the substance: a weigh-in is valid the moment it is taken; intake needs a finished day.
Two separate windows is correct.

The coupling the report cannot see: the entire non-`DAY` block — charts, metric chips, averages
card, **and the weight chip itself** — is gated on `filtered.length > 0` (`app.jsx:5931`), and the
weight chip additionally on `filteredWeighIns.length > 0` (`5944`). `filtered` is *intake*. So on
day one, or any day where the intake window is empty, a weigh-in that FL-004 says must be visible
renders **nothing at all**, because the intake gate fails first. FL-004 as specified cannot be
satisfied without splitting that guard.

### 3.5 FL-005 — four counts, one of them mislabelled, and the brief's pointer is wrong

| Where | Code | Shows | Counts what |
|---|---|---|---|
| Range filter | `app.jsx:5585` `RLBL.W` | "7 Days" | intent |
| Averages header | `app.jsx:6073` | "7 DAYS AVERAGES · 8 DAYS" | `filtered.length` — snapshot rows |
| List header | `app.jsx:6106` | "8 DAYS LOGGED" | `filtered.length` — **says "LOGGED", counts rows incl. 0-kcal days** |
| Dashboard ring | `app.jsx:2463` | "Based on 6 of 7 days logged" | `weekScore.daysUsed` / `totalDays` — genuinely logged days in a fixed 7-key window |

The brief points at `app.jsx:2455`. That line is the `accountIsNew` branch ("Still filling in —
… of 7 days logged so far"), reachable only while `hist.length < 7` (`3964`, `3971-3972`). With 8
rows the founder was reading **`2463`**. Map was wrong; the copy quoted in the report is `2463`'s.

The Dashboard's count is the only correct one. The list header is not merely a different count,
it is **false**: a 0-kcal day with no entries is counted as "LOGGED".

### 3.6 FL-006 — correctly withdrawn

`MODES` (`app.jsx:36-40`) is a user choice; nothing derives it. Confirmed.

### 3.7 FL-007 — no migration needed, and the brief's suggested signal does not exist

**There are no meal slots.** A log entry is `{ id, name, kcal, protein, carbs, fat, conf?,
elements?, time }` — written at `app.jsx:5704`, synced at `1331-1342`, schema at
`setup/supabase-schema.sql:73-92`. Nothing names breakfast/lunch/dinner. "Meal-slot coverage" is
not available and should be struck from the options.

**What *is* already stored and durable:**

- `l.id` = `Date.now()` at creation (`app.jsx:5704`). Already used as a clock by
  `firstMealHour` (`3892`: `new Date(Math.min(...logs.map(l => Number(l.id)))).getHours()`).
  Persisted as `entry_id BIGINT NOT NULL` (`supabase-schema.sql:77`) and round-tripped (`1616`).
- `l.time`, an `"HH:MM"` local string (`5704`), synced as `time TEXT` (`schema:83`).
- `water` per day.

So "did logging stop early?" is derivable with **no schema change**: the latest `l.id` / `l.time`
on a closed day against `DAY_CLOSE_FALLBACK_HOUR` (22, `app.jsx:563`) and `EATING_WINDOW_H` (14,
`433`) — machinery `isDayClosed` already owns.

**The caveat that must be written into the spec:** `addEntry` in History stamps `id: Date.now()`
at *edit* time (`app.jsx:5704` is shared by both paths). So a retrospectively-added entry carries
a timestamp from a later date, and `max(l.id)` for that day is an edit time, not an eating time.
Any inference must be expressed as "the day's last entry was stamped before hour X **on that
day's own date**", and fall back to "can't tell" when the stamp lands on a different date. That
is honest and cheap; a rule written as "last edit time" will silently mark every retro-edited day
as complete.

**Recommendation: infer, do not store.** A new stored field here is exactly house rule 5, and it
would buy very little: under §3.1's rule 2, a genuinely abandoned day still has `kcal > 0` and so
still counts — but the *label* FL-007 asks for ("possibly incomplete") is a render-time
computation from data already present. If the founder later wants an explicit
"I'm done logging today" flag, that is a new column, a migration run first, and it should be
raised as its own piece of work, not smuggled into this batch.

### 3.8 FL-008 — not a bug

`app.jsx:5931` gates the whole block on `filtered.length > 0`; `6077` guards the division
(`filtered.length ? … : 0`); `6145-6149` renders "No data for this range yet." So after FL-001
there is no `NaN`, no `0 kcal` average, no crash — the empty state already fires. What breaks is
only the *copy*: "No data for this range yet" is wrong when there is data, just no finished day.
One string, plus §3.4's guard split so a day-one weigh-in still draws.

### 3.9 FL-009 — real, and half-built already

`XAxis dataKey="date"` where `date` is `fmtShort(...)` → `"DD/MM"` (`app.jsx:222`). Recharts
defaults to `type="category"` → evenly spaced. Correct diagnosis.

Scope is narrower than the brief implies. Of the five charts:

- `chartData` (`5625-5629`) feeds the kcal line and bar charts and has **one row per history
  row**, i.e. one per day the app was opened. Gaps are rare and a bar chart on a time axis needs
  an explicit `barSize`. **Leave these categorical.**
- `weightChartData` (`5632-5639`) and `bodyFatChartData` (`5655`) are built from sparse arrays.
  These are the two the report actually describes.

`measurementChartRows` already emits `rawDate: m.date` (`app.jsx:982`) — the body-fat and tape
charts have the raw local key in hand. `weightChartData` needs one added. Then
`type="number" dataKey=<ms> domain={["dataMin","dataMax"]} scale="time"` + a `tickFormatter`
that reuses `fmtShort`.

Cost note: `measurementChartRows` is mirrored and tested in `__tests__/logic.test.js:388` /
`1481+`. Adding a field means editing the mirror and its assertions too (see §4.6).

### 3.10 FL-010 — the UI is 8 lines; the correctness is not

**The UI half is genuinely trivial and house-rule-clean.** The day-detail screen already renders
`d.mode` as a read-only pill (`app.jsx:5757-5762`) *immediately beside* a `training` toggle that
already writes through `patch` → `onUpdateDay` (`5763-5769`, `5683-5691`, `6797-6806`). Making the
pill a three-way tap is the same pattern, one tap, no modal, no confirm — consistent with the
no-friction rules. `mode TEXT` already exists in Postgres (`supabase-schema.sql:190`) and is
already in the upsert payload (`app.jsx:1478`). **No migration for the mode itself.**

**The correctness half is where this stops being cheap.** `d.mode` is not a label — it is one
half of a pair, and the other half is *stored derived state*:

The snapshot (`app.jsx:6989-7001`) stores `targetKcal`, `targetProtein`, `targetFat`,
`targetFatFloor`, `floored`, `workoutBonus`. Those were computed **from that day's mode** by
`calcTargets` (`390-423`) and `computeMacros` (`290-306`). `weekDays` then grades the day using
`dayMode = h.mode` against `dayTargetKcal = h.targetKcal` (`3934`, `3940-3959`). Edit the mode and
you have changed one side of that comparison and not the other.

Concretely, for 12/09 (maintain → cut, est. TDEE 2709, eaten 2331):

| What the implementer does | `kcalDelta` | Segment |
|---|---|---|
| Edit `mode` only, leave `targetKcal` = 2709 | `2331 − 2709 = −378` → cut: "under is never a penalty" (`app.jsx:497`) | **green** |
| Edit `mode` and recompute target = `2709 − 500 = 2209` | `2331 − 2209 = +122` → `122 ≥ CAL_BAND_SOFT (100)`, `< 200` (`472`, `482`) | **amber "JUST OVER"** |

So the **buggy** version gives the founder the green day he expects and the **correct** version
does not. Green needs the recomputed cut target ≥ 2231; `2709 − 500 = 2209` misses by 22 kcal.
(I cannot confirm 12/09's actual stored `targetKcal` — it also carries that day's smoothed workout
bonus and any floor — so treat the exact colour as unresolved, and treat "it may still be amber"
as the thing to tell the founder before building.)

And `targetFat` is mode-dependent too: `FAT_MODE_PER_KG.male` is `cut 0.8` vs `maintain 1.0`
(`app.jsx:284-287`, applied at `297-298`). At 98.5 kg that is 79 g vs 99 g — a 20 g swing in the
ceiling `fatDayScore` grades against (`535-547`).

**Why it cannot simply be recomputed.** `calcTargets` needs that day's weight, body fat, sex,
activity, `tdeeAdj`, smoothed workout bonus and any custom-kcal override. **None of those are
stored per day** — that is precisely the point of the snapshot, stated in the comment at
`app.jsx:6977-6984`: "Old snapshots … have no recoverable historical target."

The three honest options are in §4.3.

---

## 4. Data-integrity risks

### 4.1 The three copied cutoffs: one helper with a parameter. Not two windows.

FL-004 requires intake and weight to use different windows. The choice is:

- **Two genuinely separate expressions** — writes the UTC fix, the upper-bound fix and the
  dev-clock fix twice, and guarantees a third copy when the next metric lands. The third copy is
  how this bug got here: `5646-5651` is the same expression a third time, and `2a9de4c`'s own
  comment at `5667-5671` documents the UTC defect *without fixing it* because fixing it in one
  copy would have made the three disagree.
- **One helper, one parameter.** Recommended:

```
rangeWindow(range, { includeToday })  →  { from, to }   // local keys, dev-clock aware
```

`includeToday: false` for intake, `true` for weigh-ins and measurements. Callers filter
`d.date >= from && d.date <= to`. Benefits beyond de-duplication:
- `to` is what FL-004's "each card says which dates it is using" needs — it is already computed.
- `ALL` becomes `from = ""`, deleting the 1752 `Date` arithmetic (§2) rather than trusting it.
- It is a top-level pure function, so Jest can own the numbers contract. **The current inline
  IIFEs are unreachable from `__tests__/logic.test.js` — that is why this shipped.**

**Second split, easily missed:** `filtered` feeds *both* the average (`6077-6078`) and the day
list (`6106-6140`), and the list row is how today is opened for editing (`6111`). Excluding today
from `filtered` silently removes today's row from the list. Two derived arrays are needed —
`windowDays` (average: upper bound + `loggedAnything`) and the list (unchanged).

### 4.2 Fixing FL-001 makes History and the Dashboard disagree — FL-005 gets worse, not better

History `W` fixed to "7 complete days ending yesterday" = **06–12**.
Dashboard "THIS WEEK" is the last 7 keys **including today** = **07–13** (`app.jsx:3913-3918`).

They then share only 6 days, and on the reporter's data:

```
History (06–12, 7 days)            17569 / 7 = 2510
Dashboard (07–13, 6 assessable)    14904 / 6 = 2484
```

A 26 kcal disagreement between two averages on adjacent screens, against a band edge of
`WEEK_BAND_KCAL = 250`. Somebody has to decide which window is canonical before FL-001 is coded,
or FL-005 is re-raised the week after it closes.

### 4.3 FL-010: stored derived state, and a floor that must not be shifted

**This is the biggest hidden risk in the batch.**

Four persisted things were computed from a day's mode:

1. **`targetKcal` / `targetFat` / `floored`** on the snapshot (`app.jsx:6989-7001`), synced to
   `history_snapshots` (`1478-1492`, schema `186-220`), read back at `1621-1634`, consumed at
   `3940-3959`.
2. **`tdeeAdj` + `adjLog`** — `runCalibration` reads per-day `mode` for its cutting asymmetry:
   `wasCutting = weekDays.filter(d => d.mode === "cut").length > weekDays.length / 2`
   (`app.jsx:770-771`), which decides whether a **downward** TDEE correction is refused
   (`784-791`). A CUT→MAINTAIN edit inside the last 7 days can **unblock** a lowering; the
   lowering is then written to `tdee_adj` and appended to `adjLog` (`6838-6846`) and **editing the
   mode back does not undo it** — the adjustment has been applied and logged. A lower `tdeeAdj`
   lowers the daily calorie target (`calcTargets:401-402`). So editing a past day's mode can
   permanently lower what a cutting person is told to eat. The report does not mention this.
   Mitigation: `runCalibration` only runs from `onWeighIn` (`6822-6850`), so the effect is
   **latent — it fires at the next weigh-in**, not at the edit.
3. **`cutBlock.load`** — `accrueCutBlock` (`1163-1177`) is cumulative and idempotent by
   `lastAccrued`; the effect at `7026-7035` accrues from `cuttingToday`, derived from *today's*
   live mode. A past day's accrual **cannot be re-run or reversed.** FL-010's "rescores
   everything downstream" is therefore **not achievable** for the cut-block ledger that drives
   the diet-break prompts. Say so in the spec rather than implying otherwise.
4. Nothing else. Confirmed: `d.training` is display-only (`app.jsx:5763-5769`, `6116`, CSV
   `1005`) — no computation reads it.

**The floor problem.** A mode delta-shift (`targetKcal + MODES[new].adj − MODES[old].adj`) is
valid only because `calcTargets` applies the mode as a flat `±500` *before* the floors
(`app.jsx:402`, then `bmrFloorApplied` 403-404, `deficitFloorApplied` 410-411, `safeMinApplied`
413-414). On any day where a floor held, the stored `targetKcal` **is** the floor, and shifting it
by −500 produces a historical target below the safety minimum the energy-safety workstream exists
to enforce. `h.floored` (`3946`) already records this, so the shift can and must refuse there.

**The hole `floored` does not cover.** A day with a user-typed custom target gets
`customKcalApplied: true` on `targets` (`app.jsx:6967`) — but the snapshot does **not** store it
(`6989-7001`), and `floored` is false on such a day (`safeMinApplied` false unless the typed value
was below SAFE_MIN; `deficitFloorApplied` hard-set false at `6970`). A typed target does not move
with mode at all, so a delta-shift on it is simply wrong, and **no stored field can tell you.**
Recording it is a new column on `history_snapshots` → house rule 5 → a migration run first.

**Recommended shape, cheapest correct version:**

- Store the corrected `mode`. Nothing else. No migration, no floor risk, no recompute.
- Re-grade the segment with the corrected mode **against the target that actually applied**, and
  show that target on the day-detail screen so the result is explicable. This is truthful: the
  app did tell him 2709 that day. Accept that a →CUT correction reads green via "under is never a
  penalty" (`497`).
- If the founder rejects that and wants the target restated: delta-shift `targetKcal` by the mode
  adj **only when `h.floored` is false**, and recompute `targetFat` from the one per-day input
  that *is* recoverable — `weight = targetFatFloor / FAT_FLOOR_PER_KG` (`283`, `6996`). Checked:
  at 98.5 kg, `targetFatFloor = round(59.1) = 59`; `59 / 0.6 = 98.33 kg`; cut fat
  `round(98.33 × 0.8) = 79` vs the true `round(98.5 × 0.8) = 79`. Rounding costs ≤ ~0.8 g. Leave
  `targetProtein` alone — protein is mode-independent by design (`275-276`, `296`).
  Before building this, check `localStorage.target_kcal` has never been set; at n=1 that settles
  the custom-target hole without a column.

**The three open questions, answered:**

1. **Does editing a past mode recalculate already-closed weeks?** There is no such thing as a
   closed week. No weekly figure is stored anywhere — `weeklyIntakeScore` runs on every render
   (`app.jsx:3971-3973`) over a window recomputed every render (`3913-3918`). So: an edit inside
   the last 7 days changes the ring on the next render; an edit older than that changes nothing on
   the Dashboard, because the ring never looks there.
2. **Does it disturb awarded streaks or achievements?** **No.** `calcStreak` reads `logs.length`
   only (`254-264`). The badge metrics are `streak`, `logger` (`d.logs?.length > 0`) and
   `hydrated` (`d.water >= 8`) — `app.jsx:6501-6506`, `BDGS` at `53-57`. None reads `mode`. And
   `earnedBdgs` is append-only (`6516`): there is no revoke path in the code at all. Verified.
3. **Should there be a read-only cut-off?** Not for integrity reasons, and a cut-off would be tap
   friction against house rule 1. But be honest about what an edit can reach: both consumers that
   re-derive anything look back exactly 7 days (`runCalibration`'s `weekAgoKey` at `713-714`/`770`;
   the ring's `last7Keys` at `3913-3918`). Beyond 7 days an edit changes only the History list and
   the CSV (`1002`). And `cutBlock` can never be corrected at any distance (risk 3 above).

### 4.4 Unreported bug: the same off-by-one is in `runCalibration`, where it moves the target

`app.jsx:770`: `const weekDays = history.filter(d => d.date >= weekAgoKey);` — `weekAgoKey` is
`today − 7` (`713-714`), so this is **8 keys**, the identical defect to FL-001. Here it changes a
majority threshold:

```
8 days → "cutting" needs 5 cut days   (5 > 4)
7 days → "cutting" needs 4 cut days   (4 > 3.5)
```

A week with 4 CUT days and 4 others reads as **not cutting** under the bug, which **lifts the
refusal at `787-791` and allows the TDEE estimate to be lowered.** Same arithmetic family as
FL-001, but the output is the calorie target rather than a label. `runCalibration` *is* mirrored
in `__tests__/logic.test.js:488-489`, so this one is testable today.

### 4.5 Unreported bug: the open day pollutes the adaptive TDEE and the weekly verdict

FL-001's mechanism — today's partial day inside an average — exists in two higher-stakes places.

**(a) `runCalibration`.** `recentHist = history.filter(d => d.date >= weekAgoKey && d.kcal > 0)`
(`app.jsx:721`) → `avgKcal` (`733`) → `avgDeficit` (`741`) → `errKcal` (`744`). Worked example,
7 full days at 2500 and today at 400 logged:

```
avgKcal = (7×2500 + 400) / 8 = 2237.5      vs 2500 → 262.5 kcal/day phantom deficit
expectedChange shifts by 262.5 × 7 / 7700 = 0.239 kg
errKcal = −0.239 × 7700 / 7 ≈ −263 kcal/day
rawAdj  = round(0.8 × −263 / 25) × 25 = −210 → capped to −100/−150/−200 (CAL_STEP_CAP, 679)
```

i.e. reading mid-day pushes the estimate **down**, which pushes the target **down**. Partly
mitigated by *when* it runs: only from `onWeighIn` (`6822`), usually fasted before eating, and
`d.kcal > 0` excludes a truly empty day. It bites when the user weighs in after eating, or
re-weighs in the evening. Also partly shielded by the cutting refusal (`787`) — which §4.4 can
defeat.

**(b) The weekly ring.** `weekDays` includes today with live partial totals
(`app.jsx:3930`) → `assessable` → `avgKcal` → band. On the reporter's data:

```
without today:  14904 / 6 = 2484 → 2484 − 2709 = −225  → "maintain" → AMBER
with 400 logged today: 15304 / 7 = 2186 → −523 ≤ −250  → "cut"     → GREEN
```

So the weekly verdict flips amber → green at breakfast and back to amber by dinner. This is very
likely a large part of what the founder actually observed in FL-003, and it is not in the report.

### 4.6 Every fix here is also a fix to a hand-copied duplicate

`__tests__/logic.test.js` is not an import — it is a **hand-maintained mirror**
("Pure logic extracted from app.jsx", line 1; `weeklyIntakeScore` re-declared at line 277;
`runCalibration` at 457-489; `measurementChartRows` at 388). Two consequences:

- Anything added to `app.jsx` as a pure function must be **copy-pasted into the mirror**, and the
  two can silently drift. (Memory already records one "stale mirror resynced" incident.)
- Anything left as an inline IIFE inside `History` is **not testable by Jest at all**. That is the
  root cause of this whole batch surviving: `5609-5621`, `5646-5651`, `6077-6078` and
  `6082-6100` are all unreachable from the suite.

So "extract to a top-level pure function" is not refactoring for its own sake here — it is the
only way these fixes get a regression test. Worth the lines.

---

## 5. Build order and sequencing

The working tree is **clean as of `2a9de4c`** — the `features/body/02` work was committed during
this review, which removes the conflict risk the brief warned about. Before starting, confirm
`git status` is still clean and `npm test` / `npm run test:ui` still pass at `2a9de4c`, so any
later breakage is attributable. Tag or note `2a9de4c` as the pre-fix baseline.

What `2a9de4c` does still constrain:

- It touched the exact region (`app.jsx:5646-5673`) and added the comment at `5667-5671` that
  *documents* the UTC defect. Fixing it means deleting that comment's premise — update the comment
  rather than leaving it claiming a workaround that is no longer needed.
- `e2e/body-history.spec.js` seeds `history: [day(3), day(2), day(1)]` and no today row
  (`e2e/body-history.spec.js:18`, `42`), so FL-001's fix does not break it. `e2e/harness.js:69-83`
  `historySpec` defaults `endDaysAgo = 0`, i.e. **it does seed today**; any suite using
  `historySpec` and then opening History must be re-checked. Defect C (§2) means the harness's
  `dayOffset` does not currently reach the cutoff at all, so expect some tests to change meaning
  once it does.
- `features/body/02-founder-decisions.md:64` has an *already-decided, not-yet-built* migration
  (`note TEXT` on `body_measurements`) and DECIDED 3 drops `TREND_MIN_POINTS`. If FL-009 touches
  `measurementChartRows`, coordinate — both edit the same function.

**Recommended order.**

0. **Decide two things before any code.** (a) Which 7-day window is canonical — History's
   06–12 or the Dashboard's 07–13 (§4.2). (b) For FL-010, which of the three target options in
   §4.3. Both are founder calls and both block implementation.
1. **Extract the three pure helpers first, behaviour unchanged, mirror them into
   `__tests__/logic.test.js`, and add the failing tests.** `rangeWindow`, `weightTrendKg`, and a
   `dayHasIntake` predicate lifted from `app.jsx:3953`. This is the step that makes everything
   after it testable (§4.6), and it is the only step with no behaviour risk.
2. **FL-001 + FL-005 + FL-008 together**, through `rangeWindow` — they are one edit to the same
   four lines and one empty-state string. Includes the §3.1 `loggedAnything` rule and the
   `windowDays` / list split (§4.1).
3. **FL-004** — second call to `rangeWindow` with `includeToday: true`, plus the guard split at
   `app.jsx:5931` / `5944` (§3.4) and the date-range labels.
4. **§4.4** — the `runCalibration` off-by-one. Cheap, already Jest-testable, and it moves the
   calorie target. Do it before FL-010, because FL-010's mode edit feeds straight into the
   `wasCutting` majority it corrects.
5. **FL-002** — extract `trend7`, use it for the headline, and accept that it is silent until
   there are weigh-ins either side of the week boundary (§3.2). Needs the founder told first.
6. **§4.5** — the open day in `runCalibration` and in the weekly ring. Higher stakes than
   anything below it; sequenced here only because it wants the helper from step 1.
7. **FL-010** — last, and only after step 0(b). UI is ~8 lines; the target decision is the work.
8. **FL-009** and **FL-007's label** — independent, low risk, do whenever.

`sw.js` version bump and a rebuild of `app.js` on every step. None of these fixes needs a
database migration **if** FL-010 takes option (a) or the `floored`-guarded option in §4.3.

---

## 6. Fix directions that are worse than the bug

- **FL-010 as specified** ("changing it from MAINTAIN to CUT rescores that day", "the weekly
  result recalculates"). As written, the cheap implementation leaves `targetKcal` stale and the
  thorough one recomputes a floored safety target from inputs that were never stored. It also
  promises a weekly-verdict change the engine cannot deliver (§3.3). **I would not build this as
  specified.** It needs a founder decision on the target first.
- **FL-002's "take it from the ends of the smoothed line."** `ROLLING` is a trailing mean over a
  growing window; differencing its first and last values compares a 3-reading mean against a
  7-reading mean and is not a trend. It would replace a number that is wrong for an
  understandable reason with one that is wrong for an unexplainable one.
- **FL-007 with a new stored field.** House rule 5, for a label that can be derived from `l.id`
  and `l.time`, both of which already exist and already sync.
- **FL-001's fix direction taken literally** ("7 days ending at yesterday's midnight") without
  §3.1's `loggedAnything` rule. It fixes the one day the founder noticed and leaves every past
  app-opened-but-unlogged day silently dragging the same average.
- **FL-009 applied to all five charts.** A time axis on the kcal bar chart needs an explicit
  `barSize` and buys nothing — `chartData` already has a row per day.

## 7. Could not verify / inferring

- **12/09's actual stored `targetKcal` and `floored`.** I used the report's "est. TDEE 2,709" and
  `MODES.cut.adj = −500`. The real snapshot also carries that day's smoothed workout bonus and any
  floor, so the predicted segment colour in §3.10 is a band, not a fact. Read the real snapshot
  before promising the founder a colour.
- **FL-002's "the black line rises about 0.3kg".** The report gives only the first (97.1) and last
  (98.8) weigh-ins; I cannot recompute `ROLLING` from five missing values. The *structural* claim
  (headline ≠ chart) is verified; the 0.3 kg figure is not.
- **Whether `trend7` is currently blank on the founder's live Dashboard.** It is `null` on the
  weigh-ins *listed in the report* (06–13). If he has weigh-ins at 03/09 or earlier that the
  report does not list, it would render. Worth one look at the device.
- **Whether `customKcal` has ever been set on this account** (`localStorage.target_kcal`). This
  decides whether §4.3's custom-target hole is theoretical or live. One-line check, not a guess I
  should make.
- **Which e2e suites seed `historySpec` and then open History.** I confirmed
  `body-history.spec.js` is safe and that `body-measurements.spec.js` and `weigh-ins.spec.js` also
  reach the History screen, but I did not read every assertion in those two.
- The brief's Recharts claim for FL-009 is confirmed by reading the code, not by running the
  charts; I did not start the app.

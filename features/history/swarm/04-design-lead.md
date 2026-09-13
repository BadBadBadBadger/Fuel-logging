# 04 — Design Lead review (Mobile UI/UX)

Bug batch FL-001 … FL-010, History + Dashboard. Review only; no project file touched.
Read: `personas/design-lead.md`, `SWARM-BRIEF.md`, `BUG-REPORT.md`, and the real code at every
pointer below. Also read `features/body/02-founder-decisions.md` (live context) and the other
agent's reproduction harness in `scratchpad/repro/repro.spec.js`, which reconstructs the founder's
weigh-ins — I use it below and flag where it is an assumption rather than reported fact.

---

## 0. What I verified, and what I could not

**Verified from the code and the reported numbers:**

| Claim | Check |
|---|---|
| Averages divide by 8 | `app.jsx:6077-6078` divides by `filtered.length`; `app.jsx:5612` cutoff `today−7` with `>=` admits 8 keys. 17,569 ÷ 8 = 2,196 (shown); ÷ 7 = 2,510. Fat 544 ÷ 8 = 68 (shown); ÷ 7 = 77.7 → 78. **FL-001 is exactly right.** |
| Four day counts | `app.jsx:5585` (`W:"7 Days"`), `6073` (`7 DAYS AVERAGES · 8 DAYS`), `6106` (`8 DAYS LOGGED`), `2455`/`2463` (`6 of 7 days logged`). **FL-005 is right, and it is four, not three.** |
| The two "7 days" are *different dates* | History after the fix = 06–12 Sep (7 complete days ending yesterday). Dashboard = `last7Keys`, `app.jsx:3914-3918` = 07–13 Sep, today included. Same word, different windows, offset by one day. |
| Headline = raw endpoints | `app.jsx:6083-6085`, `first`/`last` of `filteredWeighIns`. 98.8 − 97.1 = +1.7. |
| The smoothed line's real movement | `weightChartData.ROLLING`, `app.jsx:5632-5639`, on the repro's readings (97.1, 97.75, 97.9, 98.2, 98.0, 98.4, 98.8): 97.6 → 97.7 → 97.8 → 97.9 → **98.0**. First point 08 Sep, last 13 Sep. **The line moves +0.4 kg; the headline claims +1.7 kg. A 4× overstatement.** |
| The weekly sentence's arithmetic | Logged days in the Dashboard window (07–12 Sep): (2580+2334+2228+2504+2927+2331)/6 = **2,484**. TDEE baseline 2,709. Diff **−225**. `WEEK_BAND_KCAL = 250` (`app.jsx:589`) → band `maintain`; `selectedMode` is today's `mode` = cut → `WEEK_READ_COPY.cut.maintain` → *"This week hasn't been a cut."* **Exactly what the founder saw.** Note it is **25 kcal from flipping to "cut"**. |
| Changing a past day's status cannot change that sentence | `weeklyIntakeScore` (`app.jsx:614-651`) reads only `days[].kcal`, `days[].floored`, and `selectedMode` — which is **today's global `mode`** (`app.jsx:3973`). No `d.mode` anywhere in the band or the copy. See FL-010 §5. |
| Charts are categorical | Every `XAxis dataKey="date"` where `date` is `fmtShort(...)`, a string: `app.jsx:6005, 6020, 6031, 6039, 6046`. Recharts spaces string categories evenly. **FL-009 is right.** |
| FL-010 needs no migration | `syncHistory` already sends `mode` in the history upsert (`app.jsx:1478`), and the snapshot already writes it (`app.jsx:6989`). No new column. |
| The day detail can score a day with no new props | The snapshot carries `targetKcal`, `targetProtein`, `targetFat`, `targetFatFloor`, `floored`, `mode` (`app.jsx:6989-7001`). Everything the per-day verdict needs is already in the row History is handed. |

**Could not verify:**

- **FL-002's slope figures.** The report claims +0.87 kg/week through all seven readings and −0.08
  kg/week with the first removed. The report states only two of the seven weights (97.1, 98.8). On
  the repro harness's reconstruction I get +1.46 kg/week through all seven and **+1.17 kg/week with
  the first removed — it does not flip.** Either the real intermediate readings differ from the
  repro's guess, or the report's slope arithmetic is wrong. **The implementer must not rely on
  "remove one reading and the direction reverses."** The defensible finding is the one I did verify:
  the averaged line moves +0.4 while the headline says +1.7. That alone justifies the fix, and it
  matters for the design — see §5 FL-002, where I *reject* a "no clear direction" state precisely
  because on this data the rise is real and only its size is wrong.
- The intermediate weigh-in values themselves (assumption, from the repro harness).
- FL-004 and FL-008 behaviour after the FL-001 fix — not built yet.
- Rendered pixel widths. My 380px estimates come from the style literals (page `padding:"20px 16px"`
  `app.jsx:5713`, card `padding:"16px 18px"` `6071`, chart `margin left:-20 right:10` `6030`), not
  from a screenshot.

---

## 1. Scoring the screen as it stands

| | Score | Why |
|---|---|---|
| **Genericity** | 6/10 | The cream palette and the segmented rings are this product's own. The History screen underneath is a standard chip-filter + chart + stat-row + list stack. |
| **Delight** | 3/10 | Nothing on this screen rewards a second look. The body-fat tooltip (`app.jsx:5564-5581`) is the one piece of real craft — it states what its average is built from and how long since the last reading. That is the standard the rest of the screen should be held to. |
| **Cognitive load** | **8/10 — the finding** | Four day counts, a headline fighting the chart beneath it, and a card header that states a count twice. The reader is made to do subtraction to find out what a number covers. |
| **Visual distinctiveness** | 5/10 | Memorable on the Dashboard, forgettable on History. |

**What works:** the chips-then-chart-then-list order; the decision at `app.jsx:6118-6124` to render an
absent weight as *nothing at all* rather than a dash; the per-reading honesty in `BodyFatTooltip`.

**What doesn't:** labels that count instead of naming; one number coloured as a verdict on evidence
that cannot carry a verdict; a correction the screen invites and then refuses.

**The single diagnosis behind FL-001/002/005/008:** *every card on this screen states how many days
it used, and no card states which days it used.* A count cannot identify a window. Two cards with
legitimately different windows therefore have no way to tell the reader they are different, so they
look like the same number disagreeing with itself. Fix the identity and the rest follows.

---

## 2. THE FL-005 LABEL SYSTEM

### The rule

1. **A card that shows a number over a window names the window by its dates, in the header.**
2. **The count of days the number is built from goes next to the number, never in the header.**
3. **One count per card, ever.** `7 DAYS AVERAGES · 8 DAYS` is two counts for one card; that is the
   bug in one string.
4. **The dates in the label are the same two day-keys that filtered the rows** — passed out of the
   filter, never re-derived. Re-deriving is how this screen got into this state.
5. The range chips are a **request**, not a claim. They keep short labels and are not touched.

Dates identify, counts qualify. After this, "7 Days" appearing above a card labelled `6–12 SEP`
beside a ring labelled `7–13 Sep` is not a contradiction — it is three things correctly named.

### The literal copy

**(a) Range chips — `app.jsx:5585`. No change.**

```
Day   7 Days   30 Days   3 Months   Year   All Time
```

**(b) Averages card header — replaces `app.jsx:6073`.**

```
DAILY AVERAGE · 6–12 SEP
7 of 7 days logged · today not counted yet
```

Line 1: existing header style (11px, 800, `letterSpacing:"0.12em"`, `var(--text-label)`), uppercased.
Line 2 (new): 10px, `var(--text-lo)`, `letterSpacing:"0.04em"`, `marginTop:3`, sentence case.

- The header **no longer states any day count** — that is the whole fix. It states what the number is
  and which dates it covers.
- "today not counted yet" is stable copy that never changes wording. It stops being read within a
  week and becomes a quiet confirmation, which is what you want — not an explanation that nags.
- "7 of 7" reads slightly odd and is deliberate: it is the **same shape every day**, and it is the
  shape the founder already approved on the weekly card ("based on 5 of 7 days logged", recorded in
  `features/body/02-founder-decisions.md` DECIDED 3 as *transparency over suppression*). One shape in
  both places means he learns to read one thing.
- Other ranges follow automatically: `DAILY AVERAGE · 15 JUN–12 SEP` / `43 of 89 days logged · today
  not counted yet`. Note this is strictly better than today's `ALL TIME AVERAGES · 43 DAYS`, which
  never said 43 out of how many.

**Width at ~380px:** content width 380 − 32 (page) − 36 (card padding) = **312px**. Line 1 at 11px
uppercase with 0.12em tracking ≈ 8.1px/char → 24 chars ≈ 195px. Line 2 at 10px sentence case ≈
5.3px/char → 41 chars ≈ 217px. Both fit on one line with room. The longest realistic line 1
(`DAILY AVERAGE · 28 DEC 2025–3 JAN 2026`, 38 chars ≈ 308px) just fits; allow it to wrap rather than
shrink, and do not truncate a date.

**(c) Day list header — replaces `app.jsx:6106`.**

```
DAY BY DAY · 6–13 SEP
```

And on today's row only, after `fmtFull(d.date)` and the mode chip (`app.jsx:6113-6116`):

```
TODAY
```

10px, 900, `letterSpacing:"0.08em"`, `var(--text-lo)`, `marginLeft:8`. No background, no chip — the
mode chip beside it already owns that treatment and two pills on one line reads as two statuses.

This is the move that kills the last of FL-005 without hiding anything. The list legitimately holds
8 rows while the average used 7. Rather than reconcile the counts, **the screen shows its working**:
the list says 6–13, the average says 6–12, and the one row in the list that is not in the average is
the row marked TODAY. Nobody subtracts anything.

If `TODAY` crowds the row at 360px, drop it — the dates in the two headers already carry the fact and
the row is top of a reverse-chronological list. Do **not** reach for `TODAY · NOT IN THE AVERAGE`
(26 chars, ≈143px after a 15-char date and a mode chip): it fits on a Pixel 7 and wraps badly below
that, and it says in a row what the header already says in a header.

**(d) Empty list for the range — replaces `app.jsx:6147`.**

```
No complete days between 6 and 12 Sep.
Your last logged day was 20 Aug.
```

13px, `var(--text-faint-2)`, centred, as now. Line 2 only when a logged day exists outside the range;
otherwise line 1 alone. Current copy ("No data for this range yet.") makes him change the filter to
find out where his data is.

**(e) Dashboard ring subtitle — replaces `app.jsx:2455` and `2462-2464`.**

Verdict state (was `Based on 6 of 7 days logged`):

```
6 of 7 days logged
7–13 Sep
```

Filling-in state (was `Still filling in — 3 of 7 days logged so far.`):

```
Still filling in — 3 of 7 days logged
7–13 Sep
```

Line 1 keeps its current style; line 2 is a new 9px `var(--text-lo)` line beneath. **Two deliberate
lines, not one.** The card is `minWidth:150` with `padding:"16px 14px"` (`app.jsx:2366-2367`), so at
380px each of the two side-by-side cards has ≈150px of text width — about 32 characters at 9px.
`6 of 7 days logged · 7–13 Sep` (29 chars) would sit on the edge of wrapping and wrap unpredictably;
splitting it makes the break intentional and turns it into label-then-dates, which reads faster
anyway.

`weekScore` is an object literal returned from `weeklyIntakeScore` (`app.jsx:616, 625, 647, 650`) —
add `from` and `to` (the first and last of `last7Keys`, `app.jsx:3914-3918`) to it rather than
recomputing the window inside `IntakeScoreCard`. Same rule as (4) above: one source, two uses.

**(f) The date-range formatter.**

One pure function, so `__tests__/logic.test.js` owns it (house rule 4) and every label in the system
formats identically:

```
fmtRange("2026-09-06", "2026-09-12")  →  "6–12 Sep"
fmtRange("2026-08-28", "2026-09-03")  →  "28 Aug–3 Sep"
fmtRange("2025-12-28", "2026-01-03")  →  "28 Dec 2025–3 Jan 2026"
fmtRange("2026-09-13", "2026-09-13")  →  "13 Sep"
```

En dash, no leading zeros, month stated once when both ends share it, year stated only when the ends
differ. Short month names matching `fmtFull`'s `en-GB` output (`app.jsx:223-225`). Headers uppercase
the result; the Dashboard's 9px line does not.

**Both keys must come from the local-date helper (`todayKey`/`dateKey`, `app.jsx:214, 655`), never
from `toISOString()`.** If the label is derived from UTC while the rows are filtered on local keys,
the label will be wrong for one hour a day under British Summer Time — a second FL-005 with a shorter
fuse. The existing code already warns about exactly this at `app.jsx:5667-5671`.

### What the screen reads, end to end, after this

```
  Day   [7 Days]   30 Days   3 Months   Year   All Time

  ┌──────────────────────────────────────────────┐
  │ DAILY AVERAGE · 6–12 SEP                     │
  │ 7 of 7 days logged · today not counted yet   │
  │   2510      180g      200g       78g         │
  │   KCAL     PROTEIN    CARBS      FAT         │
  │  ┌────────────────────────────────────────┐  │
  │  │ ⚖️ WEIGHT · 7-DAY AVERAGE LINE         │  │
  │  │ 97.6 → 98.0 kg · 8–13 Sep      +0.4 kg │  │
  │  │ Raw readings 97.1–98.8 kg, 6–13 Sep    │  │
  │  └────────────────────────────────────────┘  │
  └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐
  │ DAY BY DAY · 6–13 SEP                        │
  │ Sat 13 Sep 2026  CUT  TODAY              0   │
  │ Fri 12 Sep 2026  CUT                  2331   │
  │ …                                            │
  └──────────────────────────────────────────────┘
```

Four counts became: one count with its own window named, one list with its own window named, and one
row marked as the difference. No number on this screen disagrees with another number any more.

---

## 3. FL-002 — the headline that fights its own chart

**The report is right about the defect and I reject its framing of the remedy in one respect.**

Current: `app.jsx:6082-6100`. Shown when there are **2** weigh-ins in range — two readings is not a
trend, and the gate itself is part of the bug. The number is `last − first` of the raw array, and its
colour is `diff <= 0 ? A : "var(--bulk)"` (`6095`).

**Should there be a single big number at all?** Yes — *if* it is the line's number and the raw range
sits beside it. I considered a state that refuses to give a direction when movement is small relative
to scatter, and **I am not recommending it**, because on this very data it would fire and suppress a
rise that every method agrees on: the averaged line is +0.4, the regression is +1.2 to +1.5/week,
every sign is positive. The headline is not wrong about the direction. It is wrong about the **size**,
by 4×. A design that answers a size error by deleting the direction has over-corrected.

### The card

```
⚖️ WEIGHT · 7-DAY AVERAGE LINE
97.6 → 98.0 kg · 8–13 Sep                         +0.4 kg
Raw readings 97.1–98.8 kg, 6–13 Sep
```

- Label: 10px, 800, `letterSpacing:"0.08em"`, `var(--text-label)` — as now (`6090`).
- Endpoints line: 12px, `var(--text-lo)` — as now (`6091`). **Dates added**, and they are the
  *line's* dates (08–13 Sep), not the range's, because the rolling line does not start until the
  third reading (`app.jsx:5637`).
- The number: 15px, **`fontWeight:700`** (down from 900), **`color:"var(--text-hi)"`**.
- New third line: 10px, `var(--text-lo)`. This is the line that ends the contradiction — it names
  the raw spread *as a separate fact* so the two numbers on the card stop competing to be the same
  fact.

### Colour is not earned. Take it off.

`diff <= 0 ? A : "var(--bulk)"` is wrong three ways and one of them is the guardrail:

1. **It is blind to what he is trying to do.** On a bulk, a gain is the goal and this paints it
   orange. `MODES` is right there (`app.jsx:36-40`) and the card does not consult it.
2. **It rewards a lower number on a scale with the accent colour.** That is the reflex
   `personas/design-lead.md` names explicitly under the disordered-eating note. A 0.2 kg water
   swing does not deserve a reward colour.
3. **It makes a claim the data cannot support.** One reading drives the sign today.

So: the number is `var(--text-hi)`, the sign and the two endpoints carry the direction, and the chart
below carries the shape. Colour returns to this card nowhere. (For the record: the "red" in the bug
report is `var(--bulk)` — `#ff7b4b` dark, `#c2410c` light — not `var(--over)`. It reads as red on the
dark theme, which is the reporter's point and is fair, but the implementer should not go looking for
a red token.)

**The same defect exists in a second place:** the Dashboard weight badge at `app.jsx:3493`,
`trend7 <= 0 ? "var(--accent)" : "var(--bulk)"`. Its *arithmetic* was correctly fixed in v78
(`app.jsx:3458-3473`, two 7-day rolling averages a week apart — and the comment there describes this
exact bug being fixed once already). Its **colour rule is still mode-blind and still reward-coloured.**
One-line fix, same reasoning. Outside FL-002's stated scope; do it in the same pass.

### Why not just call the Dashboard's `trend7`

Because **on this account it returns `null` and the card would vanish.** `weighRollingAvg` needs 3
readings strictly before its cutoff date (`app.jsx:657-661`); `olderAvg` is taken before 06 Sep, and
this account's first weigh-in *is* 06 Sep. `trend7 === null` → the badge renders nothing
(`app.jsx:3491`). So "History should just call the dashboard fix" (the brief's suggestion) produces an
empty card. Use the chart's own `ROLLING` series instead — it is already computed, already drawn, and
being the same array is what guarantees the headline and the line can never disagree again.

### Gate and empty state

Show the row when **`ROLLING` has at least two non-null points** (≥4 readings in range), because a
line needs a start and an end. Below that:

```
⚖️ WEIGHT · 6–13 SEP
Latest 98.8 kg from 3 readings. A direction needs 4.
```

Replaces the current `>= 2` gate (`app.jsx:6082`), which is what let two readings become a headline.

---

## 4. FL-003 — the contradiction warning

**My answer: do not build the warning. Severity High → Low. The information is already on screen;
what is missing is the route to act on it, and that is FL-010.**

Four reasons, in order of weight:

1. **The app already says it, in the place he already looks.** A closed MAINTAIN day at 2,331 against
   a 2,709 target hits `calorieDayScore`'s maintain branch (`app.jsx:510-514`): |−378| > 200 →
   amber, `heroAction: "Under by 378 kcal today."` That sentence renders on the TODAY card
   (`app.jsx:2430`) and the day goes amber on the week ring. Nothing is hidden. A new warning would
   be a third statement of a fact already stated twice.
2. **It would fire on most real days.** Eating under a maintain target is ordinary. A warning that
   fires constantly is wallpaper, and the cost is not the noise — it is that he stops reading the
   category, including the rare real one. At n=1 there is no A/B test to rescue that.
3. **It is the wrong thing for this app to say to this user.** "You ate less than you said you would"
   is the message class `personas/design-lead.md` flags hardest, on a tool built to protect the
   founder's hormonal health while cutting. **Handing to the coach hat for a second veto.**
4. **The report's own expected outcome asks for a modal in disguise** — *"the app offers to correct
   the status"*. An offer needs accepting or dismissing. That is a dialog, on the logging path, which
   both house rules forbid.

### What to build instead — one sentence, at the point of correction

On a **closed** day, in the day detail, directly **above** the status control from FL-010:

```
Logged 2,331 kcal — 378 under your maintain target. Nearer a cut day.
```

- 11px, `var(--text-mid)`, `lineHeight:1.5`. **No icon. No amber. No border. No background tint.**
  It is a statement of fact, not a warning, and it must not look like one.
- Appears only when the day is closed **and** the gap from the chosen status's target exceeds
  `WEEK_BAND_KCAL` (250, `app.jsx:589`) — reuse the constant rather than invent a threshold; the
  week already calls 250 the width of "a different thing".
- Cannot be dismissed, because there is nothing to dismiss: it disappears by itself the moment the
  status is corrected or the day is no longer a mismatch.
- Zero new taps. Zero interruption. Not on the logging path — it lives on a past-day screen that is
  only reached by deliberately opening a past day.

The whole design is: **put the fact next to the fix and say nothing anywhere else.** The bug is not
that the app failed to warn him; it is that the app told him and then gave him nowhere to go.

---

## 5. FL-010 — editing a past day's intention

**The report is right that this is the real bug, right that it is High, and wrong about one expected
outcome in a way that will read as the fix not working.** Read this section before implementing.

### 5a. The control

The precedent is already on the screen and is not being used. At `app.jsx:5757-5762` the mode chip in
the day detail is a plain `<span>`. At `5763-5769`, **immediately beside it**, the training chip is a
`<button>` that toggles `day.training` through `patch()` — one tap, no dialog, writes straight to the
row. The screen already edits one of the two intention fields in place. Status should be that chip's
sibling, not a new pattern.

**Show all three status chips, always, with the active one filled — the Today screen's control
exactly** (`app.jsx:4066-4079`): `flex:1`, `padding:"9px 4px"`, `borderRadius:10`, `fontSize:11`,
`fontWeight:900`, `letterSpacing:"0.06em"`, active = `mix(v.color,"22")` background / `v.color` text /
`mix(v.color,"55")` border, inactive = `var(--surface-2)` / `var(--text-label)` / `BD`.

Layout of the day-detail header card (`app.jsx:5748-5778`):

```
  ‹          Sat 12 Sep 2026          ›
      [  CUT  ] [ MAINTAIN ] [ BULK ]
             [ ⚡ TRAINING ]
```

Three chips on their own row under the date, training on the row below. At 380px three `flex:1` chips
inside the card's 312px of content are ~100px each — comfortably above the 44px minimum touch target
in both axes. Keeping them on one row with the training chip would need ~316px + gaps and wrap
unpredictably, so give them the row.

**Discovery needs no work.** It is pixel-for-pixel the control he taps on the home screen every day.
No hint text, no tooltip, no "tap to edit" affordance, no expand-then-choose. **One tap corrects a
past day.** An expand-then-pick interaction would be two taps and an invented pattern for no gain.

**No confirm step.** House rule: one tap = done. It is reversible by another tap, and the line under
it (5b) shows immediately what the tap did.

### 5b. Showing that the day was rescored — and the target it was rescored against

A silent recalculation is its own bug; agreed. But there is a trap underneath it. `calorieDayScore`
takes **both** a mode and a `kcalDelta` measured against a target (`app.jsx:495`), and the day's
target is **snapshotted** (`targetKcal`, `app.jsx:6994`, preferred over reconstruction at
`3940-3942`). So changing `d.mode` alone scores the day as a cut **against a maintenance target**:

- Keep the snapshotted 2,709: cut branch, delta −378 ≤ 0 → **green** (`app.jsx:497`).
- Re-derive for cut (2,709 − 500 = 2,209): delta +122 → `cutCalorieScore(122)` → **amber, "JUST
  OVER"** (`app.jsx:482`).

**Two different answers from the same tap**, and the first one is a screen that says "cut" while the
number it compared against is maintenance. So the design requirement is not negotiable: **the day
detail must show the target the day was scored against, and that number must visibly change when the
status changes.** Whichever way engineering resolves the target question, the screen cannot hide it.

Directly **below** the three chips, one line:

```
● Scored against MAINTAIN · target 2,709 kcal · 378 under
```

After tapping CUT (re-derived target):

```
● Scored against CUT · target 2,209 kcal · 122 over
```

- `●` is a 7px round dot in `SCORE_COLOUR[colour]` (`app.jsx:2316`) — the **same** red/amber/green as
  that day's segment on the week ring. The dot changing colour under his thumb *is* the feedback that
  the day was rescored. No toast, no spinner, nothing to dismiss.
- Text 11px, `var(--text-mid)`. The status word takes `MODES[mode].color`.
- In range: `● Scored against CUT · target 2,209 kcal · in range`
- Nothing logged: `Nothing logged — not scored.` (no dot; a grey dot would look like a verdict)
- Today: `Still going — 1,450 of a 2,209 kcal target.` (no dot; the TODAY ring owns today's verdict)

This needs **no new props and no migration** — every field is already in the snapshot History is
handed (`app.jsx:6989-7001`), and `mode` already syncs (`app.jsx:1478`).

### 5c. The weekly sentence will NOT change, and the report says it will

> *"The weekly result recalculates, so a week wrongly reported as 'hasn't been a cut' reports
> correctly once the day is fixed"* — FL-010, expected outcome 4.

**This is false as the engine stands, and it is the most important thing in my review.**
`weeklyIntakeScore` (`app.jsx:614-651`) derives its band from `avgKcal − tdeeBaseline` and its wording
from `selectedMode`, which is **today's global `mode`** (`app.jsx:3973`). Neither reads `d.mode`. I
reproduced the exact sentence from the data: 2,484 avg vs 2,709 baseline = −225, inside the ±250 band
→ `maintain` → `WEEK_READ_COPY.cut.maintain` → *"This week hasn't been a cut."*

Fix 12 Sep from MAINTAIN to CUT and that sentence does not move. What moves is that day's **segment
colour** (via `dayMode` at `app.jsx:3934`). So if FL-010 ships as specified, the founder will tap the
fix, watch the segment go green, return to the Dashboard, and **the exact sentence he was trying to
fix will still be there.** He will report FL-010 as not working.

Three consequences for the design:

1. **Do not write a line claiming the week was rescored.** I considered
   `This week now reads as a cut.` in the day detail and rejected it: it would be a false statement,
   and it would need `mode` + `prof` + `tdeeAdj` as new props into `History` (which today receives
   none of them, `app.jsx:5583`) to compute a sentence that cannot change. The day detail reports the
   day. It says nothing about the week.
2. **Tell the founder this directly**, in the debate, not in the app: a past day's status controls how
   *that day* is graded and coloured. The weekly sentence measures average intake against
   maintenance, and no day's chosen status feeds it.
3. **The weekly copy is what is actually misleading him**, because it sounds like a verdict on his
   intentions and is not. Proposed replacement for `WEEK_READ_COPY.cut.maintain` (`app.jsx:601`):

```
Your average this week is within 250 kcal of maintenance — not yet a deficit.
```

   It states the mechanism, so it stops sending him hunting for a wrongly-set day to explain it.
   (The ±250 band and whether a −225 average 25 kcal from the boundary should produce a confident
   sentence at all are **coach/engineering calls, not mine** — flagging, not deciding. A hard band
   edge producing a firm sentence is the same class of problem as FL-002's headline.)

### 5d. Today's row: the live-mode trap

`app.jsx:4064-4065` carries a standing rule in a comment: *"Mode selector — the ONLY surface that
changes mode. No card anywhere duplicates these three chips with buttons of its own."*

For a **past** day this rule does not bind — that is editing a stored record, not re-selecting the
live mode — and the comment should be amended to say so. For **today** it binds hard, and there is a
real defect waiting:

`patch({ mode })` writes the history row, but the snapshot effect (`app.jsx:6985-7008`) rewrites
today's row from the `mode` **state** on its next run. **Change today's status from History and it
silently reverts.** That is a worse bug than the one being fixed.

So: one new prop, `onSetDayMode(date, mode)`. App routes `date === todayKey()` to `handleSetMode`
(`app.jsx:6604`, which also writes `mode__<date>` and triggers the cut guard) and anything else to
`updateDay`. One path, no ambiguity, no revert.

And **the cut guard must not be bypassed.** `askCutGuard` (`app.jsx:4085-4108`) asks once before going
back to cutting mid-break. Today's chips in History must raise the same panel, which is fine — it is
already an inline card, not a modal, and it honours "Cut anyway" on the spot, so it fits the house
rules as it stands. If rendering it in the day detail is refused, then today's chips stay
non-interactive there — but do not ship an unguarded second route to cut.

### 5e. The report's open questions

1. *Does changing a past status recalculate closed weeks?* Design answer: there is nothing to
   recalculate — see 5c. The day's own colour and score re-derive on render; no week is stored.
2. *Does it affect streaks or achievements already awarded?* `BDGS` (`app.jsx:53-57`) count days
   logged, hydration days and streak length. None reads `mode`. So no. **Do not revoke a badge on an
   edit** under any circumstance — taking an earned badge away to correct a bookkeeping error is the
   worst possible trade at n=1.
3. *Is there a cut-off beyond which past days are read-only?* **No.** Designing a wall against an
   abuse case that cannot exist in a one-person app, at the cost of being unable to fix a real error,
   is backwards. See "Don't build this".

---

## 6. FL-007 — marking a day as possibly incomplete

**The screen should not claim to know. Do not build this. Medium → won't fix.**

There is no stored field that separates "ate little" from "stopped logging" (brief confirms;
`app.jsx:6989-7001` confirms). Which leaves two routes, both worse than the bug:

- **Guess it.** Every available signal is a bad one. Entry count is not evidence: the AI capture can
  log a whole day in one entry (`app.jsx:5703-5706`), so "few entries" means nothing. Last-entry time
  is reachable (`l.id` is a `Date.now()` stamp, used as the meal clock at `app.jsx:2528-2530`), but
  "last entry 14:00" is evidence of lunch, not of abandonment. And the failure is asymmetric and
  ugly: telling a cutting man *"we think you forgot to log"* on a day he genuinely ate little is
  precisely the thing this app exists not to do. A false mark here costs far more than an unflagged
  low day.
- **Store a flag.** New field on `body_measurements`/history → a Postgres migration, and house rule 5
  is explicit that a missing column breaks the whole sync upsert **with no visible error** — this
  repo has already lost its history sync that way. For a Medium.

And a third option exists that beats both and costs nothing: **he can already fix it.** The day detail
takes retrospective food (`app.jsx:5909-5925`). Adding the missing meal is strictly better than
annotating its absence.

What is already handled honestly, for free, by the FL-001/FL-005 work:

- A day with **no intake at all** drops out of the average's denominator, and the sub-line says so:
  `6 of 7 days logged`. The one genuinely detectable case needs no claim, no flag and no copy.
- A day with **some** intake counts at face value, which is the only honest thing to do with it,
  because the app does not know and should not pretend.

If the founder still wants it later, the right shape is a **marker he sets himself**, never a
detector — and that is a stored column and a separate decision, not this batch.

---

## 7. FL-009 — evenly-spaced points hiding date gaps

**The report is right and the severity is too low.** This is not cosmetic: on the body-fat chart a
missing week *disappears*, and three readings read as a continuous three-day slide. A chart that
deletes time is worse than no chart.

Every axis is `dataKey="date"` over `fmtShort(...)` strings → categorical, evenly spaced
(`app.jsx:6005, 6020, 6031, 6039, 6046`).

### What it should be: a true time axis, on all of them

`type="number"`, `dataKey` = epoch ms from the **local** key (`new Date(key + "T12:00:00")` — the same
midday-anchored parse `fmtFull` already uses at `app.jsx:223`, which sidesteps the UTC boundary),
`domain={[startMs, endMs]}` from the same two keys the filter used, `scale="time"`, explicit daily
`ticks` for 7-day ranges, `tickFormatter={ms => fmtShort(...)}`.

**What it looks like at ~380px.** Plot width = 380 − 32 (page) − 16 (card padding, `6071`) + 20 (the
`left:-20` margin) − 10 (right) ≈ **342px**, less ~28px of Y-axis labels ≈ **314px**. Over 7 days that
is **~45px per day**.

- **Weight chart, this account:** a one-day hole at 12 Sep is a ~45px gap between two dots — about
  the width of a fingertip, unmissable, and the step from 11 to 13 Sep is visibly double every other
  step. Today's dot lands hard against the right edge, which is correct: today is the edge.
- **Body-fat chart:** the 10/11/13 Sep readings stop being equal thirds. 12 Sep becomes a visible
  45px hole rather than vanishing. At the 30-day range, 4 weekly readings over 30 days = ~10.5px/day,
  so each 7-day interval is a clear ~73px span instead of an equal quarter.
- Keep daily ticks only at the 7-day range. At 30 days, 30 labels at 10px will not fit in 314px —
  tick every 5 days. At 3 months and beyond, tick monthly. Do not shrink the font below 10px.

### The second half of the fix, which the axis alone does not do

The raw lines already pass `connectNulls={false}` (`app.jsx:6026, 6034, 6010`), so they break
correctly once dates are real. **The rolling lines pass `connectNulls={true}`** (`6027, 6035, 6015`) —
which is exactly what draws a smooth, confident curve straight through a gap where there is no data.

**Design rule: the average line breaks where there are no readings for 3 or more consecutive days.**
Shorter gaps stay connected, because a 7-reading window genuinely tolerates one missed weigh-in and a
hole for every skipped day would be noise for a daily weigher. Longer gaps break, because either
side of them the average is built from readings that barely overlap. (The exact threshold is the
engineering/coach call; 3 days is my starting number and the reason is stated so it can be argued
with.)

### Is a 7-point chart worth drawing at all?

For **weight at the 7-day range, the dots yes, the rolling line no.** `weightChartData`'s window is
`arr.slice(Math.max(0, i-6), i+1)` (`app.jsx:5633`) — so at this range the line's *own smoothing
changes along its length*: a 3-reading average at the left end, a 7-reading average at the right. It
is drawn as one curve and it is not one kind of number. That is a subtler version of the same
dishonesty FL-002 is about.

**Recommended second step (optional, after the axis fix):** at the 7-day range only, drop the
`ROLLING` curve and draw a flat horizontal reference line at the mean of the readings in view, with
one label:

```
7-day average 97.9 kg
```

(`ReferenceLine y={mean}`, `stroke={rc(A)}`, `strokeDasharray="4 3"`, label 10px `var(--text-lo)`,
right-aligned above the line.) Seven dots scattered around one honest horizontal line is a truer
picture of a week of weigh-ins than a varying-window curve, and it removes FL-002's contradiction at
source — at this range there is no rising curve left to disagree with anything. Keep the rolling curve
unchanged at 30 days and above, where its window is genuinely 7 of 30+.

Marked optional and sequenced second because it changes a chart the founder reads daily, and the axis
fix is the part that is unambiguously a bug.

**Already built and worth reusing:** `measurementChartRows` carries `rawDate` and `sinceDays`
(`app.jsx:982, 988`), and `BodyFatTooltip` already says *"2 days later"* (`app.jsx:5574-5578`). The
data needed to fix FL-009 is sitting in the row objects. Only the axis is wrong.

---

## 8. FL-001 / FL-008 — day one and a thin week

### Day one: no complete days

The averages card must render neither `0` nor `NaN` (`app.jsx:6077` divides by `filtered.length`;
after the FL-001 fix that can be 0). Replace the whole card body:

```
DAILY AVERAGE

Nothing complete to average yet.
Today's figures land here once the day ends.
```

Header in the existing style, no date range (there is no window to name). Body 13px,
`var(--text-faint-2)`, centred, `padding:"28px 20px"` — matching the existing empty states
(`app.jsx:5725-5728, 6146-6148`).

**Do not suppress the day list on day one.** It has one row, today's, and that row is the entire
reason he opened the screen. Header: `DAY BY DAY · 13 SEP`. Row carries the `TODAY` marker.

Also check the weight trend row: with one weigh-in it is already hidden by the `>= 2` gate; under my
`ROLLING`-based gate (§3) it is hidden until 4 readings, with the `Latest … A direction needs 4.`
copy. No extra work.

### Only 2 of 7 days have data

**Does a 7-day average mean anything with 2 days? No — and the card should say what it is, not hide.**
That is the founder's own standing call, twice recorded: *transparency over suppression, "based on 5
of 7 days logged" rather than hiding a thin week* (`features/body/02-founder-decisions.md`, DECIDED 3),
and the same reasoning in code at `app.jsx:969-972`. So:

```
DAILY AVERAGE · 6–12 SEP
2 of 7 days logged · today not counted yet
```

**The count is the warning.** One shape, every day, no conditional copy that appears and vanishes.

I drafted an extra line for thin weeks — `Two days isn't a week yet — this will move a lot.` below a
4-of-7 threshold — and **I am not recommending it.** The founder chose the count over the
hand-holding, the count already carries the fact, and conditional copy that appears only sometimes is
the thing a reader stops trusting. Listed so the option is on the record, not as a proposal.

### FL-004 — weight keeps today; the cards have different windows

The report's reasoning is correct and is the right call: intake needs a whole day, a weigh-in is true
the moment it is taken. The consequence — two windows on one card — is what §2 exists to handle:
the averages header says `6–12 SEP`, the weight row says `8–13 Sep` for its line and `6–13 Sep` for
its raw readings, and each states its own dates so the difference is visible instead of inferable.
**This is the bug batch's one irreducible "two different windows" and naming them is the whole
answer.** Nothing here needs a shared window, an explanation, or a help link.

---

## 9. Accessibility findings (both themes, WCAG 2.1 AA 1.4.3)

Computed from the tokens in `index.html`, not estimated:

- **`--text-faint` on `--surface` in dark mode fails AA: 4.10:1** (`#7a746a` on `#141210`, needs 4.5).
  It is currently used for the Dashboard ring's evidence line at **9px** (`app.jsx:2462`) — the
  smallest text on the screen at the worst contrast on the screen, carrying the number FL-005 is
  about. **Use `--text-lo` (`#8b857c`, 5.19:1) there and in every new sub-line I specify.** Light mode
  `--text-faint` is 4.87:1 on `--surface` — passing but the weaker of the two; `--text-lo` is 5.50:1.
  Same token change serves both.
- `--bulk` on `--bg` in light mode is **4.59:1** (`#c2410c` on `#f4f1e9`) — passes at the current
  15px/900, and would be borderline if anyone reduced that weight. Moot if §3's recommendation lands
  and the number becomes `--text-hi`.
- The three status chips at `flex:1` in the day detail are ~100 × 35px. **Below the 44px minimum in
  the vertical axis** — the Today screen's own chips have the same `padding:"9px 4px"` at `fontSize:11`
  and so share the problem. Raise to `padding:"12px 4px"` in the day detail (≈41px) or add 4px of
  vertical margin to make the tappable area 44px without changing the visual size.
- Colour is never the only carrier in anything I propose: the score dot is always accompanied by the
  target and the over/under figure in words; the weight direction is carried by the sign and the two
  endpoints.

---

## 10. Don't build this

1. **FL-003's during-the-day contradiction warning.** The fact is already stated twice
   (`app.jsx:2430` and the week ring's amber segment). A third statement that fires on most real days
   becomes wallpaper, and this is the one message class the product exists not to send by reflex.
   Build the one factual line above the correction control instead (§4).
2. **Any "offer to correct the status" prompt.** An offer must be accepted or dismissed. That is a
   dialog, and FL-003's expected outcome asks for one without naming it.
3. **FL-007's incomplete-day detection, in any form.** No stored field, no trustworthy signal, and a
   stored flag means a migration that can break the whole sync silently. The bug costs less than
   either route. If it ever becomes real it is a marker he sets, never a detector.
4. **A "mark this day complete" control on past days.** The tempting shape of FL-007 and the worst
   one: a tap on every past day, forever, to tell the app something it should not have asked.
5. **Any confirm step on the status change.** One tap sets it, another tap undoes it.
6. **A toast, banner or "recalculating…" state after a status change.** The score dot and the target
   figure changing under his thumb *are* the feedback. A toast is a thing to dismiss.
7. **A line in the day detail claiming the week was rescored.** It would be false (§5c) and it would
   need three new props to compute a sentence that cannot change.
8. **Colour on the weight trend number.** Remove it; do not redesign it. Same for the Dashboard badge
   at `app.jsx:3493`.
9. **A read-only cut-off for old days** (the report's open question 3). Designing a wall against an
   abuse case that cannot exist in a one-person app, at the cost of being unable to fix a real error.
10. **Revoking a badge after a status edit** (open question 2). No badge reads `mode`, and taking an
    earned badge away to tidy bookkeeping is the worst available trade at n=1.
11. **Renaming the range chips.** They are a request, not a claim. The dates carry the meaning.
12. **A "no clear direction" state on the weight card.** On this very data it would suppress a rise
    every method agrees on. Stated as a considered-and-rejected option so nobody re-proposes it.
13. **Anything that reconciles the four day counts into one number.** They are three legitimately
    different windows and one list. Naming them is the fix; averaging them is a new bug.

---

## 11. Severity changes I am asking for

| Bug | Reported | Mine | Why |
|---|---|---|---|
| FL-001 | Critical | **Critical** | Agreed, unchanged. Arithmetic verified. |
| FL-002 | High | **High** | Agreed. But the remedy is endpoints-of-the-line + raw range + no colour, not a suppression state; and its slope arithmetic is unverified (§0). |
| FL-003 | High | **Low** | The information already reaches him twice. Only the route to act is missing, and that is FL-010. |
| FL-004 | Medium | **Medium** | Agreed; the labelling consequence is §2's job. |
| FL-005 | Medium | **High** | It is not cosmetic. It is the reason a Critical arithmetic bug stayed invisible, and the same missing date labels will hide the next one. |
| FL-007 | Medium | **Won't fix** | Any fix is a guess or a migration; both cost more than the bug. |
| FL-008 | Low | **Low** | Agreed; copy supplied. |
| FL-009 | Low | **Medium** | The body-fat chart does not merely compress a gap, it deletes one. A chart that deletes time misinforms. |
| FL-010 | High | **High** | Agreed, and the expected-outcome error in §5c must be settled before it is built. |

## 12. Handoffs

- **Coach hat:** second veto on FL-003 (§4, reason 3). The ±250 band producing a confident weekly
  sentence 25 kcal from its own boundary (§0, §5c). Whether a re-stated past day's target should be
  re-derived or kept as snapshotted (§5b) — it changes whether a corrected day reads green or amber.
- **Engineering hat:** the silent revert if today's mode is written through `patch()` (§5d). The
  target re-derivation question (§5b). The `connectNulls` break threshold (§7).
- **QA hat:** the FL-005 label system is testable as stated — every header's dates must equal the two
  keys that filtered its rows. That is one assertion per card and it would have caught FL-001.
- **Admin hat:** `app.jsx:4064-4065`'s "ONLY surface that changes mode" comment needs amending once
  the day-detail chips land, and `DOCS.md` needs the label rule written down, or the next card added
  to this screen will state a count in its header again.

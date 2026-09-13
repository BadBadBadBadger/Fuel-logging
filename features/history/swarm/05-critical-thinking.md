# 05 — Critical Thinking review of FL-001 … FL-010

Reviewer: Critical Thinking hat (`personas/critical-thinking.md`). Review only; no project file edited.
All line references are `app.jsx` at the working-tree state described in `SWARM-BRIEF.md`.

**Verdict in one line.** Every number the report states is arithmetically correct, and I could not
break one of them. But the report is right for the wrong reason in three places, and its two
headline fixes (FL-001, FL-002) are both aimed at the wrong mechanism — FL-001's fix breaks four
other things that share the same variable, and FL-002's "expected outcome" cites as ground truth a
chart line I can show produces exactly the observed +0.3 kg on a **perfectly flat** body weight.
The most consequential defect in this area is not in the report at all.

---

## 1. Arithmetic verification

### 1.1 FL-001 kcal — **holds**

The eight listed daily figures (`BUG-REPORT.md:11`): 2665, 2580, 2334, 2228, 2504, 2927, 2331, 0.

```
2665 + 2580               = 5245
     + 2334               = 7579
     + 2228               = 9807
     + 2504               = 12311
     + 2927               = 15238
     + 2331               = 17569   ← seven complete days, 06/09–12/09
     + 0    (13/09)       = 17569   ← all eight rows
```

So **17,569 is both totals.** The report's phrasing ("17,569 ÷ 8") is not sloppy and it is not
double-counting: because the eighth day is zero, the sum of 7 and the sum of 8 are the same number.
The total does not "already exclude" the zero day; it includes it and the inclusion is invisible.

- `17569 ÷ 8 = 2196.125` → displayed `Math.round` (line 6079) = **2196**. Matches the report. ✓
- `17569 ÷ 7 = 2509.857…` → rounds to **2510**. Matches the report. ✓

### 1.2 FL-001 fat — **holds, all three figures**

```
67 + 72 = 139
   + 80 = 219
   + 80 = 299
   + 83 = 382
   + 79 = 461
   + 83 = 544   ✓ "exactly 544"
```

- `544 ÷ 8 = 68.0` — **exactly** 68, no rounding needed. ✓ (This is the strongest single piece of
  evidence in the whole report: an exact integer hit on a denominator of 8.)
- `544 ÷ 7 = 77.714…` → the Evidence section says "77.7" ✓ and the Expected section says "78g" ✓.
  Both are correct statements of the same number. Not a contradiction.

### 1.3 Is the evidence consistent with a *different* off-by-one?

I tested the alternative the brief asked about: the window including an 8th day that holds **real**
data rather than today's zeros. For that to produce the observed figures, the extra day would need:

- kcal `X` such that `(17569 + X)/8` rounds to 2196 → `X ∈ [−5, +3]`
- fat `Y` such that `(544 + Y)/8 = 68` exactly → `Y = 0`

A day with ~0 kcal and exactly 0 g fat **is** an empty day. So this is not a competing hypothesis;
it collapses into the same one. The report's diagnosis survives this test.

But there is a distinction the evidence genuinely **cannot** settle, and it matters more than the
one the brief asked about: *is the denominator the number 8, the width of the window, or the number
of rows that happen to exist?* The code settles it — **line 6077–6078**:

```js
const avg = filtered.length
  ? filtered.reduce((a, d) => a + (d[m.key] || 0), 0) / filtered.length : 0;
```

The denominator is **rows present**, not days elapsed. This is load-bearing and the report misses
its consequence: at the 30D / 3M / 1Y / ALL ranges the same expression silently computes *"average
per day that has a row"* rather than *"average per calendar day"* — a different statistic with a
different meaning, never stated anywhere on screen. Today's zero row is one instance of a general
defect, not the defect itself. Any fix scoped to "exclude today" leaves the general case in place.

### 1.4 A trap the arithmetic exposes: the plausible partial fix makes the number *worse*

Two defects sit in one expression (line 5612). An implementer fixing the off-by-one alone will do
one of these:

- change `W:7` to `W:6`, or
- change `>= cutoff` to `> cutoff`

Both yield the key set 07/09–13/09 — **7 rows, still including today's zero**:

```
(17569 − 2665) / 7 = 14904 / 7 = 2129
```

**2129 is further from the truth than the 2196 being complained about**, and the header would then
read "7 DAYS AVERAGES · 7 DAYS" — it would *look* fixed. This is the single most likely way this
batch gets closed wrongly. Say it loudly in the implementation brief.

### 1.5 FL-002's regression slopes — **cannot be checked**

The report states `+0.87 kg/week` over 7 readings and `−0.08 kg/week` with the first removed. Given:
97.1 (06/09), 98.8 (13/09), and a derived constraint that the next-lowest reading is 97.75
(from "sits 0.65kg below the next-lowest"). **Five of seven values are unstated.** A least-squares
slope is a function of all seven; with five free it is not determinable. This is not a finding
against the report's honesty — it is a finding that the report's two most precise-looking numbers
are the two nobody else can audit.

What I *can* say:

1. **The signs are jointly achievable.** I constructed a set satisfying every stated constraint
   (97.1, 98.9, 99.0, 98.8, 98.6, 97.75, 98.8) and got full-sample `+0.56 kg/wk`, leave-first-out
   `−0.62 kg/wk`. So "positive overall, negative without the first reading" is a real shape, not an
   impossible one. The *magnitudes* +0.87 / −0.08 I could neither reproduce nor refute.
2. **The method is unstated and it changes the answer materially.** There is no weigh-in on 12/09,
   so the 7 readings span 7 calendar days across only 6 index steps. Regressing against calendar
   date and regressing against reading index differ by a factor of 7/6 ≈ **17%** in the
   "per week" conversion — larger than most of the disagreement the report is arguing about. A
   two-decimal figure (+0.87) from an unstated x-variable is over-precise.
3. **What it would take to check:** the five weights for 07–11/09, plus one sentence saying whether
   x was calendar days or reading order.

**Recommendation:** FL-002's *observation* (headline says +1.7, chart says roughly flat) stands on
its own without the regression. Drop the regression numbers from the report rather than defend
them — see §5.1, where I show the chart line the report compares against is itself unreliable, which
means neither half of FL-002's evidence is currently sound even though the bug is real.

---

## 2. What is settled — do not relitigate

These I tried to break and could not.

| ID | What is settled |
|---|---|
| **FL-001** | The observation and the arithmetic are exactly right. The denominator at **6077–6078** is `filtered.length`, which on 13/09 is 8 rows including a zero row. The headline kcal average shown to the founder is wrong by **314 kcal/day** (2196 vs 2510). Critical is the correct severity for the *bug*. Only the fix is contested (§4.1, §5.2). |
| **FL-001 (UTC)** | The brief's second defect is real and I verified the magnitude. `new Date(Date.now() − days*86400000).toISOString().split("T")[0]` at **5612, 5619, 5649**: at 00:30 local on 13/09 under BST the cutoff computes `2026-09-05`, admitting a **ninth** day key; at 01:30 it computes `2026-09-06`. So between local midnight and 01:00 every day the window silently widens by one day. I grepped every `toISOString` in the file — these three are the **only** day-key abuses; everything else uses the local `dateKey` (655) or real timestamps. The blast radius is exactly these three lines. |
| **FL-002 (the defect)** | **6083–6085** is raw first-minus-last, confirmed verbatim. And `filteredWeighIns` really is ascending — the pull path orders by date (`1537: .order("date")`) and every local write re-sorts (6812, 6799, 6867, 7003). I tried to break FL-002 on sort order and it held: `[0]` is genuinely the earliest. |
| **FL-005 (the facts)** | All four counts verified. Filter label "7 Days" (5585). Averages header (6073). List header (6106). Dashboard copy — the report quotes **line 6463** (`Based on {daysUsed} of {totalDays} days logged`) verbatim; the *brief's* table points at 6455, the other branch. The report is right and the brief is the one that is slightly off. |
| **FL-005 (why 6 of 7)** | Fully explained, and the explanation vindicates the Dashboard. 13/09/2026 is a Sunday; `last7Keys` (3914–3918) is the last 7 **calendar** days ending today = 07/09–13/09; `loggedAnything` (3953) excludes 13/09 because kcal is 0 → `daysUsed` 6, `totalDays` 7. Correct behaviour, correctly described. |
| **FL-009** | Confirmed on all four charts. `XAxis dataKey="date"` at **6020, 6031, 6039, 6046**, where `date` is `fmtShort(...)` (5626, 5636, 982) — a formatted string, so Recharts spaces categories evenly. The report's description of the visual consequence is accurate. |
| **FL-010 (the observation)** | Confirmed and stronger than the report argues. At **5757–5761** `day.mode` renders as a `<span>` — no handler. Immediately beside it at **5763** a `<button>` toggles `training` retrospectively through `patch` → `onUpdateDay`. So the screen already edits one day-level flag retrospectively and refuses the one next to it, with the plumbing already built. And `mode` is **already a synced column** (1478, 1623) and already in the CSV (1002): **house rule 5 does not apply — no migration needed.** FL-010 is materially cheaper than the brief's framing implies. |
| **FL-006** | Withdrawing it was **right**, and the stated reason is correct: per-day mode is a user choice (`d.mode`, 3934), so two days with near-identical intake legitimately grade differently. Nothing was buried — *by that reasoning*. But see §3.1: the withdrawal note's closing sentence smuggled in a claim that is false. |

---

## 3. What is contested

### 3.1 FL-003's and FL-010's shared causal claim is **false**

This is the most serious reasoning error in the report, because the founder would do the work and
not get the promised result.

FL-003 claims: *"The weekly ring then reports 'This week hasn't been a cut' **on the strength of
that one day**."* FL-010 promises: *"The weekly result recalculates, so a week wrongly reported as
'hasn't been a cut' reports correctly once the day is fixed."*

Per-day mode does not enter the weekly verdict. Trace it:

- `weeklyIntakeScore` (**614–651**) takes `{ days, selectedMode, tdeeBaseline }`. Each `days` entry
  is `{ kcal, loggedAnything, floored, colour }` (3962) — **no mode field.**
- `selectedMode` is passed as `mode` (**3973**) — the *currently selected* mode, one value for the
  whole week, not a per-day value.
- The verdict is `weekBandFor(avgKcal − tdeeBaseline)` (628) against `WEEK_BAND_KCAL = 250` (589).
- Per-day mode reaches only `dayMode` (3934) → `calorieDayScore` (3958) → that **one day's segment
  colour**.

So for the founder's actual data: `avgKcal = 14904/6 = 2484`; `2484 − 2709 = −225`; `|−225| < 250`
→ band `maintain` → with `selectedMode: cut`, copy = *"This week hasn't been a cut."* (601).

**The week reads "hasn't been a cut" because the six-day average is 225 kcal under maintenance and
the band is 250 wide. It has nothing to do with 12/09 being set to MAINTAIN.** Changing 12/09 from
MAINTAIN to CUT changes its segment from amber to (probably) green and changes nothing else. The
week still says "hasn't been a cut".

One narrow exception, and it does not apply here: at **3946**, when a day has *no* target snapshot
(`h.targetKcal == null`, i.e. recorded before the 2026-09-09 fix), `dayFloored` is reconstructed via
`calcTargets(prof, dayMode, …)`, so mode *does* move `floored` → `flooredCount` (645) → the ≥4
floor-majority override (646) → could flip the week to "cut". For 12/09/2026 the snapshot carries a
real `targetKcal`, so this path is closed. Worth a test, not a worry.

**Consequences for the implementer:**
- FL-003's severity rests on a false premise. The *observation* (amber calories beside green macros
  on one day) is real and is correct behaviour under two separately-correct rules. Downgrade.
- **FL-010 must not promise a weekly recalculation it cannot deliver.** If the mode editor ships
  with that expected outcome written into a test, the test will fail or — worse — someone will
  "fix" the weekly engine to make it pass, wiring per-day mode into a band that was deliberately
  measured from raw TDEE (see the comment at 611–613: *"that's what lets 'reads as' disagree with
  'selected'"*). That would be a real regression introduced to satisfy a wrong bug report.
- FL-006's withdrawal note ends *"The real issue is FL-003: nothing warns when the choice and the
  intake disagree."* That sentence is the one thing the withdrawal got wrong — it transferred a
  false causal claim into a live bug instead of retiring it with the rest.

### 3.2 FL-005 — the inconsistency is not the bug

The report treats four different day counts on one screen as a defect. After FL-001 and FL-004 they
are *supposed* to differ: FL-004 explicitly argues weight and intake should cover different ranges.
You cannot ask for FL-004 and FL-005 both as stated — FL-004 creates the condition FL-005 calls a
defect. FL-004 half-notices this ("each card says which dates it is using") and that sentence is the
actual fix for FL-005.

The founder has **already decided this**, twice. `features/body/02-founder-decisions.md:68–78`
(DECIDED 3): *"It must state what it is built from — 'avg of last 2', 'avg of last 3' — never
claiming four readings when it has two"*, explicitly *"Consistent with the founder's own call on the
weekly intake summary two days earlier: transparency over suppression, 'based on 5 of 7 days logged'
rather than hiding a thin week."*

So: **the bug is three cards claiming a window they do not have, not four numbers failing to match.**
Forcing the counts to agree would break the founder's own rule. Two live violations of DECIDED 3:

- **6073**: `{RLBL[range].toUpperCase()} AVERAGES · {filtered.length} DAYS` — claims "7 DAYS" while
  averaging 8 rows.
- **6033**: the weight tooltip hardcodes `"7-day avg"` while the line behind it is built from 3 to 7
  readings (§5.1). The body-fat sibling does this correctly — `measurementChartRows` carries `avgN`
  (984) and the tooltip says *"avg of last {r.avgN}"* (5573). **Weight is the chart that lies about
  its window; body fat is the one that doesn't.** The report inspected the weight chart and did not
  notice.

FL-005 should be re-aimed, not dropped. Its severity is right for the wrong reason.

### 3.3 FL-008 — already handled; reclassify as verify-only

The report asks someone to "confirm it does not show 0 kcal, NaN, or crash on a divide by zero". I
can answer from the code:

- Divide-by-zero is already guarded: `filtered.length ? … : 0` (6077).
- The whole averages-card-plus-day-list block is gated on `filtered.length > 0` (**5931**, closing
  at 6150), so it is not rendered at all when empty.
- An empty state already exists: *"No data for this range yet."* (**6145–6148**).

So NaN and crash are both impossible today. The residual risk is **wrong copy, not a crash**: if
FL-001 is fixed by excluding today from `filtered`, then on day one an account that *has* logged
shows "No data for this range yet" — which is false. That is a real but small defect, and it is
caused by the proposed fix, not by current code. FL-008 is Low and should say what it actually is.

### 3.4 Premise check — is a 7-day average the right object?

Nobody stated this premise and it deserves a challenge. The question the founder is actually asking
this card is *"am I eating at the level I intended?"* A 7-day mean answers that badly in one specific
way that is visible in his own data: 11/09 at 2927 kcal is 596 above the mean, and it alone lifts a
7-day mean by 85 kcal/day. A mean cannot distinguish "seven days at 2510" from "six days at 2440 plus
one at 2930" — and for a cut those are different weeks.

I am **not** proposing a replacement; that is a founder judgement and the nutrition-coach hat's
ground. But I will note the structural point: the app already has an engine whose job is exactly
"am I on track" — `weeklyIntakeScore` returns a band and a sentence, not a number. The History
averages card duplicates its *input* while ignoring its *output*. That duplication is the deeper
defect FL-001 is a symptom of (§5.2).

---

## 4. Fixes worse than the bug

### 4.1 FL-001's "exclude the current day" — wrong mechanism, four side effects

**Steelman first.** The fix is coherent: intake is only meaningful over a whole day; a partial day
is not a day; a 7-day average over 7 complete days is a stable number that does not move as you eat.
"The number stays put all day" is a genuine benefit — a figure that climbs from 0 to 2500 through the
day is not a figure you can compare to anything.

**Now the attack.** The defect is not *"today is included."* It is *"today is counted as a complete
day worth zero."* Those have different fixes, and the report picked the blunt one.

The minimal correct change is at **6077–6078** — divide by the number of days that actually have
intake, which is precisely what the app already does in two other places:

- `weeklyIntakeScore:618–627` — `assessable = days.filter(d => d.loggedAnything)`, then
  `/ daysUsed`.
- `runCalibration:721` — `history.filter(d => d.date >= weekAgoKey && d.kcal > 0)`.

The report's fix instead changes **`filtered`**, and `filtered` has **six** consumers:

| Line | Consumer | What excluding today does |
|---|---|---|
| 5625 | `chartData` — the kcal/macro chart | **today's point vanishes from the chart** |
| 5931 | visibility gate for the whole block | day-one account sees "No data for this range yet" |
| 6073 | header count | fixed |
| 6077 | the average | fixed |
| 6108–6110 | the day list | **today's row vanishes — losing the tap target at 6111 that opens today for editing** |
| 6145 | empty state | fires wrongly on day one |

The report reasons about **one** of the six. Two of the others are real regressions, and the day-list
one collides head-on with house rule 1 (no tap friction): today is currently reachable from History
in one tap, and the fix removes it.

**Is there a reading where both numbers are wanted?** Yes, and this is the cleanest framing of
FL-001 available: one card is being asked to be two things. "What did my last seven finished days
average" and "how am I doing so far today" are both wanted, and the card currently answers neither.
The founder's own DECIDED 3 says the resolution is a stated denominator, not a hidden day —
*"based on 6 of 7 days logged"* is his preferred shape, already shipped on the Dashboard.

**Where FL-001's fix and the existing engine diverge — a number the implementer must see.** Today,
with 0 kcal logged, "exclude today" and "exclude days with nothing logged" agree by coincidence. The
moment breakfast lands they split:

| | today = 0 kcal | after 400 kcal of breakfast |
|---|---|---|
| History card, as built (6077) | 2196 | 2246 |
| History card, fixed per FL-001 (06–12 only) | 2510 | **2510** |
| `weeklyIntakeScore` (627), drives the ring | 2484 | **2186** |
| `runCalibration` (733), drives the calorie target | 2510 | **2246** |

**There are already three different "average daily kcal over about a week" in this app, and they
disagree by up to 324 kcal/day on the same data.** FL-001's prescribed 2510 matches none of them
once the day is live. Fixing History in isolation swaps one inconsistency for another while FL-005
complains about inconsistency. Whatever is chosen must be chosen for all three, or the three must be
labelled so they can legitimately differ.

### 4.2 FL-003's "warn when intake contradicts the chosen status" — **reject as specified**

**Steelman.** One real event motivates it: 12/09 was set to MAINTAIN in error, and nothing caught it.
The founder lost confidence in a screen he relies on. That is a genuine cost.

**Attack.** As written this is the app second-guessing a stated intention, and I can put numbers on
the false-positive rate from his own week. A warning must fire when intake and status "disagree".
The app's only existing definition of disagreement is the ±250 band (589). Using it, against
TDEE 2709, with the status he actually held:

- 06/09 2665 — within band of maintenance. If CUT was selected, this "contradicts" it → warn.
- 08/09 2334 — 375 under → reads cut.
- 09/09 2228 — 481 under → reads cut.
- 11/09 2927 — 218 **over** maintenance. If CUT was selected → warn.
- 12/09 2331 — 378 under. Status MAINTAIN → warn. (The true positive.)

That is **three warnings in seven days, one of which is right.** And the two false ones fire on the
days that need no comment: a day he deliberately ate at maintenance, and a refeed/high day. A 2-in-3
false-positive rate on a once-a-day modal is not a safety feature; it is something he will learn to
dismiss without reading, which destroys the one warning that mattered.

Worse, it collides with the house rules. The only moment a warning can fire usefully is while
logging, and rule 1 forbids putting anything in the logging path. A warning at day-close is a
notification about a day he can no longer change — **unless FL-010 ships first**, in which case
FL-010 alone already solves the founder's actual problem: he noticed the error himself, and the
complaint was that he could not fix it.

**Who is it protecting?** n=1. The one person using this set the wrong mode and spotted it unaided
within a day. He does not need to be told; he needs a way to correct it. **FL-010 makes FL-003
unnecessary.** If anything replaces FL-003 it should be a passive statement of fact with no modal and
no judgement — the day row already shows the mode badge (6115); showing the day's kcal against that
day's own target beside it would let him see a mismatch without being interrupted. That is a
design-hat call, and I am flagging it rather than deciding it.

### 4.3 FL-007's "leave incomplete days out of the average" — **the cure is the disease**

**Steelman.** A half-logged day genuinely is not evidence about intake, and averaging it in is a
category error. Including it understates intake, which for a man guarding against under-eating means
the app tells him he is eating *less* than he is — arguably the safer error but still a lie.

**Attack, and it is decisive.** This app exists to detect under-eating. An average whose job is to
catch under-eating, from which you remove the low days, cannot catch under-eating. Run it on his own
data: 09/09 is 2228, the lowest complete day and the one the report itself names as indistinguishable
from an abandoned log. Drop it and the average goes 2510 → **2557**, moving *away* from the floor he
is watching. Drop the two lowest (2228, 2331) and it reads **2596**. The days that get dropped are,
by construction, exactly the days that carry the signal.

And it propagates into the safety engine. `runCalibration:733` builds `avgKcal` from the same kind of
filtered set; raise `avgKcal` and `avgDeficit` (741) shrinks, `expectedChange` (742) shrinks, so real
weight loss looks *larger than expected* → `discrepancy` negative → `errKcal` positive → the TDEE
estimate is **raised**. Line 766: *"Raising is NEVER damped."* So a heuristic that drops low days
feeds an undamped path in the one engine the energy-safety workstream was built to protect.

Third problem: **there is no field that could tell the two cases apart.** I checked the synced row
shape (1478–1490): `mode, kcal, protein, carbs, fat, water, training, target_kcal, target_protein,
target_fat, target_fat_floor, floored` and one more — nothing about completeness. So any
implementation is a guess ("below X% of target = probably abandoned"), and that guess misclassifies
a genuine low day as abandoned, silently, with no way for him to see which days were dropped. An
average you cannot audit is worse than a wrong average you can.

**FL-007's observation is real and its prescription should be rejected.** The honest version is the
opposite of what it asks: show the low day *more* prominently, not less. He is the only user; he
remembers whether he stopped logging on 09/09. What he needs is the day flagged visibly so he can
decide — which is a display change on the day row (6108–6129), not a change to any average.

### 4.4 FL-010's retrospective rescoring — mostly fine, one real hazard the report misses

**Steelman of the worry the brief raises.** If any past day's score can change, a weekly history that
was "red" can become "green", and a record you can rewrite is not a record.

**My read: at n=1 this worry is mostly misplaced**, and I will say so plainly against the framing in
my own instructions. There is one user, he is the author of the record, and the record's only
purpose is to inform his next decision about his own body. A record that preserves a mistake he
has already identified is not more truthful — it is *less* accurate about what happened. The app
already lets him edit food and water retrospectively (5763, `patch`), so the "records are immutable"
principle is not one this app holds. Applying it to `mode` alone would be inconsistent, and `mode` is
the field the report correctly identifies as the more likely to be wrong.

**But there is a hazard the report's three open questions do not name, and it is the serious one.**
`runCalibration:770–771`:

```js
const weekDays   = history.filter(d => d.date >= weekAgoKey);
const wasCutting = weekDays.filter(d => d.mode === "cut").length > weekDays.length / 2;
```

`wasCutting` gates the asymmetry at **787**: the adaptive TDEE is only allowed to be **lowered**
when the user was *not* cutting. So **editing a past day's mode changes whether the safety engine
will lower the calorie target.** Concretely: `weekDays` carries the same `>=` off-by-one, so it holds
8 days and the majority threshold is >4, i.e. ≥5. A week sitting at 4 cut days with 12/09 set to
MAINTAIN flips to `wasCutting = true` the moment 12/09 is corrected to CUT — and the engine stops
being willing to lower the estimate. That is the right direction for safety, but it happens as an
invisible side effect of a UI tap, and the reverse edit (CUT → MAINTAIN, crossing back under 5)
*unblocks* a lowering. **That is the consequence worth a test, not streaks and achievements.**

The report's open question 1 ("does changing a past status recalculate weeks that have already
closed") also has a factual answer the implementer should know: `weeklyIntakeScore` only ever looks
at `last7Keys` (3914), so there is no stored weekly result to invalidate — closed weeks are not
persisted anywhere. Question 3 ("is there a cut-off beyond which past days become read-only") has a
natural answer falling out of the above: anything older than the calibration window (7 days) cannot
affect any live figure, so a cut-off is unnecessary — not a judgement call, a consequence.

---

## 5. The missing bug

### 5.1 #1 — the chart line FL-002 treats as ground truth is built wrong, and its observed +0.3 kg is an artifact

This is the finding I would promote above everything in the report.

`weightChartData` (**5632–5639**) computes its rolling average over **`filteredWeighIns`** — the
array *already cut down to the selected range*:

```js
const weightChartData = filteredWeighIns.map((w, i, arr) => {
  const win = arr.slice(Math.max(0, i - 6), i + 1);
  ...
  ROLLING: win.length >= 3 ? Math.round(wConv(avg) * 10) / 10 : null,
```

Three defects compound:

1. **The window is by reading count, not calendar days**, despite being labelled "7-day rolling
   average" (5631) and "7-day avg" (6033). With 12/09 missing, a "7-day" window spans 8 calendar
   days. The code comment at **5644–5645** even asserts the opposite — it says the body-fat version
   uses a reading count *"rather than weight's calendar-day window."* Weight has no calendar-day
   window. **The comment is wrong about its own sibling**, which is how this survived review.
2. **The window is starved by the range filter.** Because it rolls over `filteredWeighIns` rather
   than `weighIns`, readings just outside the selected range — which exist; the "Calibrated" label
   at 3475 requires ≥28 weigh-ins — are denied to it. On the 7-day range the averages are built from
   **3, 4, 5, 6, 7** readings at successive points. It is not a rolling mean; it is an expanding one.
3. **An expanding window manufactures slope.** Replicating 5632–5639 exactly on a body weight that
   is **perfectly flat at 98.5 kg** with one low first reading of 97.1:

   ```
   readings : 97.1, 98.5, 98.5, 98.5, 98.5, 98.5, 98.5
   ROLLING  :  —     —    98.0  98.2  98.2  98.3  98.3
   span of the drawn line: +0.30 kg
   ```

   **The report observed "the black line rises about 0.3kg across its span." A perfectly flat body
   weight produces exactly that.** The rise is the outlier's share of the mean shrinking from 1/3 to
   1/7 as the window widens — it is the *same* single low reading FL-002 blames, entering with the
   opposite sign. It is not independent confirmation of anything.

   Worse: on a genuine slow **loss** (97.1 then 98.8 falling 0.1/day to 98.4) the line still draws
   **+0.2 kg** — it points up during a real loss.

**Consequences:**
- **FL-002's Expected outcome is not safe to implement as written.** "The headline comes from the
  same line already drawn on the chart" would replace a wrong number with a differently-wrong one.
- FL-002's fix direction contains **three** different objects in two sentences: *"the direction of
  the line drawn through all the readings"* (a least-squares slope), *"take it from the ends of that
  line"* (the fitted endpoints — not the same number as the slope unless you divide by the span),
  and the brief's suggestion to reuse the dashboard's `trend7` (**3466–3473**: the difference of two
  7-reading means a week apart — a third object). These are not interchangeable and the report does
  not choose.
- The dashboard's `trend7` is the best-justified of the three — it is what `runCalibration` acts on
  (3462–3465) — but note it **returns null** unless there are ≥3 readings before today−7
  (`weighRollingAvg:659`). If History reuses it, the headline disappears on thin data rather than
  reporting "roughly flat". That is honest, but it is not what FL-002's Expected outcome says will
  happen. Choose deliberately.
- `bodyFatChartData` (5655) has defect 2 as well — `measurementChartRows(filteredBodyMeasurements)`,
  same starved array. It escapes the damage because `avgN` (984) makes it state its own window and
  `TREND_MIN_POINTS = 4` (825) suppresses the line entirely at 3 readings. Note also that weight
  uses a hardcoded `>= 3` (5637) while body fat uses the named constant `4` — two different answers
  to "is this average trustworthy enough to draw" for no stated reason.

**Rank at n=1: highest in this batch.** This is the line he looks at to decide whether his weight is
actually moving, which is the input to whether he cuts harder. It can say "up" on a flat or falling
week, and it is mislabelled as a 7-day average in a tooltip he will read as authoritative.

### 5.2 #2 — three unreconciled weekly averages, one of which moves the calorie target

Laid out in §4.1's table. The concrete harm path: `runCalibration:721` filters `d.kcal > 0`, so a
**partial** today (not a zero today) enters `avgKcal` at face value as if it were a whole day. With
baseTDEE 2709 and a flat scale:

```
complete days only : avgKcal 2510 → avgDeficit 199 → expected −0.181 kg → errKcal −199
with 400 kcal today: avgKcal 2246 → avgDeficit 463 → expected −0.421 kg → errKcal −463
```

**A partial today more than doubles the apparent estimate error, in the lowering direction** — which
lowers the TDEE estimate, which lowers the calorie target. That is the exact mechanism the
energy-safety workstream exists to stop (751–756).

**Honest mitigation, which I must state:** `runCalibration` is invoked on a **new weigh-in**
(6822–6833). A fasted morning weigh-in happens before food, so `kcal` is 0 and today is excluded by
luck of timing. The bias bites only when he weighs in or re-saves a weight **later in the day** —
for which there is no guard — and `correctionHeld` (6908) evaluates `runCalibration` **on render**,
so the mid-day path does run. And while cutting, the asymmetry at 787 refuses the lowering anyway.
The window where this bites is: a later-in-the-day weigh-in, on a maintain week or a diet break —
which is precisely when line 765–766 says the refusal *lifts*.

So: real, narrower than it first looks, and squarely in the area the app is most careful about.
**Rank: High.** A one-line guard (`d.date !== todayKey()` alongside `d.kcal > 0` at 721) closes it.

### 5.3 #3 — the same off-by-one is in the safety engine, not just History

`runCalibration:770` — `history.filter(d => d.date >= weekAgoKey)` with `weekAgoKey = dateKey(today−7)`
(714) gives **8** day keys, exactly the FL-001 pattern. It feeds `wasCutting`'s majority threshold
(771), so "majority of a week" is computed over 8 days. At n=1 this is Medium: it shifts the
threshold from 4 to 5 cut days, which changes whether the TDEE estimate may be lowered. Line 721 has
the same `>=` but is saved by its own `d.kcal > 0` guard. **The report scoped FL-001 to one screen;
the pattern is in the engine.** This is the direct logical consequence of FL-001 being true that the
founder did not check — he inspected one screen, and the same expression is three lines from the
asymmetry that protects him.

### 5.4 #4 — lower-ranked but real
- FL-010's mode edit changing `wasCutting` (§4.4) — needs a test, not a redesign.
- The 30D/3M/1Y/ALL averages are *already* "per logged day" with no label (§1.3). At n=1 he will read
  "30 DAYS AVERAGES · 8 DAYS" and can work it out; Low.
- The weight tooltip's hardcoded "7-day avg" (6033) violating DECIDED 3 (§3.2). Folds into §5.1.

---

## 6. Re-ranked severity

Ranked by **consequence to the one person using this**, not by how wrong the code is. Where I differ
from the report I say why.

| Rank | ID | My severity | Report's | Why |
|---|---|---|---|---|
| 1 | **NEW — weight rolling average starved + mislabelled** (5632–5639, 6033, 5644–5645) | **Critical** | absent | The line he judges real weight movement by. Draws +0.30 kg on a perfectly flat week and +0.2 kg during a real loss; tooltip claims a 7-day window it doesn't have. Invalidates FL-002's chart evidence. |
| 2 | **FL-001** (observation) | **Critical** — confirmed | Critical | 314 kcal/day wrong on the headline number. Agreed. **Fix per §4.1, not as written.** |
| 3 | **NEW — three weekly averages, partial today in `runCalibration`** (721, 733) | **High** | absent | Doubles the measured estimate error in the lowering direction. Timing-mitigated, not guarded; the window where it bites is a diet break, where the safety refusal lifts. |
| 4 | **FL-010** | **High** — confirmed | High | Cheap (no migration; `patch` plumbing exists beside it at 5763). But **its Expected outcome is wrong** (§3.1) and its real hazard is `wasCutting` (§4.4), not streaks. |
| 5 | **FL-002** (observation) | **High** — confirmed | High | Defect at 6083–6085 is real. But **the regression numbers cannot be checked** (§1.5) and the chart it compares against is unreliable (§5.1). Fix depends on resolving #1 first. |
| 6 | **NEW — `>=` off-by-one in `runCalibration`** (770) | **Medium** | absent | FL-001's pattern in the engine. Shifts the cut-majority threshold that gates whether the target may be lowered. |
| 7 | **FL-005** | **Medium** — re-aimed | Medium | Severity right, diagnosis wrong. The bug is cards claiming windows they don't have, against the founder's own DECIDED 3 — **not** four counts failing to match. The Dashboard's "6 of 7" is correct and is the model to copy. |
| 8 | **FL-009** | **Medium** (up from Low) | Low | The report undersells its own case. It says the defect "hides gaps"; the gap it hides is a **missing weigh-in**, and a missing weigh-in is what makes the trend line unreliable (§5.1). The two bugs compound: the chart conceals the condition that breaks the line drawn on it. |
| 9 | **FL-004** | **Medium** — confirmed | Medium | Correct and well-reasoned: a weigh-in means something immediately, intake needs a whole day. The asymmetry is real and the report is right to defend it pre-emptively. Its last bullet is also the fix for FL-005. |
| 10 | **FL-007** (observation) | **Low**; prescription **reject** | Medium | Observation real. Prescription removes exactly the low days an under-eating detector needs (2510→2557 on one day), feeds an undamped raise path in `runCalibration`, and requires a stored field that does not exist (§4.3). |
| 11 | **FL-003** | **Low** (down from High) | High | Observation real; **causal claim false** (§3.1); 2-in-3 false-positive rate on his own week (§4.2); collides with house rule 1; and **FL-010 solves the underlying problem**. Should not ship as a warning. |
| 12 | **FL-008** | **Low — verify only** | Low | NaN and crash are already impossible (6077, 5931, 6145). Residual risk is wrong copy, introduced by FL-001's proposed fix, not by current code. |
| — | **FL-006** | correctly withdrawn | withdrawn | Right call. Its closing sentence is the problem, not the withdrawal (§3.1). |

**What I could not verify, stated as such:**
- FL-002's `+0.87` / `−0.08` kg/week. Needs the five weights for 07–11/09 and a statement of whether
  x is calendar date or reading index.
- Whether the founder's account has ≥3 weigh-ins before 06/09. The "Calibrated" label (3475) implies
  ≥28 lifetime weigh-ins, which would mean yes — but the report says "Calibrated est. TDEE", which
  may be different copy. This decides whether reusing the dashboard's `trend7` in History yields a
  number or nothing.
- Whether any Jest test currently pins `filtered.length` as the averages denominator.
  `__tests__/logic.test.js` has 47 hits on `weeklyIntakeScore`/`avgKcal`/`daysUsed`/
  `measurementChartRows`; I did not read them line by line, and the History card's average is inline
  JSX (6077) rather than an extracted function, so it is probably untested — which is itself worth
  saying: **the one number the whole app is built around is computed in a place no test can reach.**

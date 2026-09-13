# Review 03 — Nutrition & health-science (coach hat)

Reviewing `BUG-REPORT.md` (FL-001 … FL-010) for what each bug does to the decisions one man makes
about his own body, mid-cut. Not reviewing code quality — other hats own that.

**Profile I am reasoning against** (from the report + `ENERGY_MODEL.md` §5.1): ~98.5 kg, ~22% body
fat (`features/body/02-founder-decisions.md` worked example), calibrated maintenance 2,709 kcal,
intending to cut.

**The one-line finding.** Every intake error in this batch makes him look like he ate **less** than he
did, and the one weight error makes him look like he **gained** when he didn't. Both point the same
way behaviourally: *eat less*. That is the exact direction the whole energy-safety workstream exists
to block (`ENERGY_MODEL.md` §5.4 — "guessing low walks a dieter toward under-eating 25 kcal at a time
while telling them it is correct"). This batch re-opens that harm on the display layer, where no
guardrail is watching.

---

## 1. Re-ranked by physiological consequence

Severity here = *how directly would acting on this number hurt him*, not how broken the code is.

| Rank | Bug | Report said | I say | What he does with the wrong number | Direction |
|---|---|---|---|---|---|
| 1 | **FL-002** weight trend from raw endpoints | High | **Critical** | Sees "+1.7 kg" in red while cutting. Cuts harder, or concludes the cut is failing. | **Harmful** — pushes toward eating less, with a red colour telling him to act |
| 2 | **FL-001** average ÷ 8 | Critical | **High** | Believes he runs a 513 kcal deficit when he runs 199. Scale under-performs what the screen implies → "my metabolism is broken" → eats less. | **Harmful** — *invents* a deficit; does **not** mask under-eating |
| 3 | **FL-010 + FL-003** (treat as one) | High / High | **High** | A mis-set MAINTAIN day silently drains the cut block and can flip `wasCutting` — the diet-break prompt arrives late and the app's refusal to lower his target can lift. | **Harmful via a protection going quiet** — but FL-003's *requested warning* is wrong; see below |
| 4 | **FL-007** abandoned log reads as a low day | Medium | **Medium-High** | Nothing on the display. But it feeds `runCalibration`, which then wants to lower his target. Blocked while cutting; **active during a diet break**, exactly when he should be eating more. | **Harmful, conditionally** — and the report's own fix option is worse than the bug |
| 5 | **FL-009** chart spaces points evenly | Low | **Low-Medium** | Reads a two-day gap as a continuous three-day slide on the body-fat chart. Same "see a trend in noise" failure as FL-002, quieter. | **Mildly harmful** |
| 6 | **FL-005** three day counts | Medium | **Low** | Nothing. It is the audit trail that caught FL-001. | **Protective** — keep the counts on screen |
| 7 | **FL-004** keep today's weigh-in | Medium | **Low** | Right behaviour, wrong reason. The reason matters — see §2. | **Neutral** |
| 8 | **FL-008** day one has no yesterday | Low | **Low** | Avoids a NaN. | **Neutral** |
| — | **FL-006** | Withdrawn | **Correctly withdrawn** | — | — |

**Unreported, and I rank it above FL-001:** the Dashboard's weekly average counts **today-in-progress
as a complete day**, so the weekly verdict flips green→amber across a single day. §3 has the worked
numbers. It is on the screen he reads at breakfast before deciding what to eat.

---

## 2. Per-bug detail

### FL-001 — understating intake by 314 kcal/day. It invents a deficit; it does not mask one.

The report's arithmetic is right and I confirm the mechanism at `app.jsx:6077-6078` (sum over
`filtered`, divided by `filtered.length`) with the 8-row range built at `app.jsx:5609-5614`.

**Exact size of the error, generalised.** Let `S7` be the seven complete days' kcal and `p` today's
logged-so-far:

```
shown = (S7 + p) / 8        truth = S7 / 7
error = S7/7 − (S7+p)/8 = (S7 − 7p) / 56
```

With `S7 = 17,569` and `p = 0`: `17,569 / 56 = 313.7` kcal/day. Two things follow that the report
misses:

- **The error is biggest first thing in the morning** (`p = 0`) and shrinks to zero by the time
  today's intake reaches the week's average. So the number is at its most wrong at precisely the
  moment he would use it to plan the day's eating, and it is roughly right by bedtime when it no
  longer changes anything.
- **The denominator is not reliably 8.** `toISOString()` is UTC (`app.jsx:5612`), so between local
  midnight and 01:00 under British Summer Time the cutoff lands a day further back and the card
  divides by **9**. The error is not a fixed off-by-one; it is worse in the small hours.

**Direction of harm — the crux.** Maintenance 2,709 kcal:

| | Apparent | Actual |
|---|---|---|
| Average intake | 2,196 | 2,510 |
| Deficit vs maintenance | **513 kcal/day** | **199 kcal/day** |
| Implied loss (at the app's own 7,700 kcal/kg) | 513×7/7700 = **0.47 kg/wk** | 199×7/7700 = **0.18 kg/wk** |
| As % bodyweight | 0.47% | **0.18%** |

The screen tells him he is running a textbook −500 cut. He is running a third of that. **This bug
invents a deficit that does not exist.** It cannot mask inadequate intake — by construction it can
only make intake look *lower*, so if he were genuinely under-eating it would over-state the problem,
not hide it.

So why is it harmful rather than protectively alarmist? Because **the app has no alarm for low logged
intake at all.** The symptom check that would have watched for it (file 05) is shelved
(`ENERGY_MODEL.md` §5.5). The steady-loss floor and `SAFE_MIN` act on the *target*, never on what was
logged. So the understated number triggers no protection; it only feeds his own reasoning. And the
reasoning it feeds is the dangerous one: *the app says I am 500 under and the scale is only moving
0.18 kg a week, so my burn must be lower than 2,709 → eat less.* That is the same inference the
asymmetric calibration fix (`app.jsx:751-791`) was built to stop the app itself from making. Here the
app hands him the premises and lets him make it by hand.

**Second harm, on fat.** Fat floor is `0.6 g/kg` (`FAT_FLOOR_PER_KG`, `app.jsx:283`) = **59 g** at
98.5 kg. Shown average 68 g sits 9 g over that floor (15%); the truth, 77.7 g, sits 19 g over (32%).
The card makes his fat intake look like it is skating near the floor when it is comfortably above it.
On an app whose stated purpose is protecting hormonal health while cutting, a fat figure that reads
13% low is on-mission for the wrong reason. Dietary fat does matter to sex-hormone production and
very-low-fat diets do appear to lower testosterone modestly — but the effect sizes in that literature
are small and confounded, so I am not going to claim 68 g vs 78 g is physiologically meaningful at his
body size. What I will claim: it is the difference between a number that reads as a problem and one
that reads as fine, and it is wrong.

**Settled, and the project already decided it.** `features/dashboard/04-intake-scoring.feature:679-692`
is a founder decision from 2026-09-04 that forbids exactly this: *"an unlogged day is never averaged
in as a favourable or neutral number"*, with the reasoning spelled out — a zero-kcal day *"drags the
week's average FURTHER under the baseline — reading as MORE of a cut, not less."* FL-001 is that
decided rule being violated in a second place. The direction-of-harm argument the bug report never
makes has already been made and signed off in the repo.

### FL-002 — the most harmful bug in the batch. 7 days cannot support a weight trend at all.

Code confirmed at `app.jsx:6082-6100`: `first` and `last` raw readings, `diff` coloured red when
positive (`diff <= 0 ? A : "var(--bulk)"`, line 6095).

**What he does.** A man mid-cut is shown +1.7 kg in red. In a calorie tracker the reflex answer to
an unwanted number is to eat less. This is the harmful direction, and unlike FL-001 it arrives
pre-interpreted: a colour that means *bad* and a sign that means *wrong way*.

**The app already disagrees with this card, in three places.** This is the strongest thing I can say
about FL-002 — it is not just wrong, it contradicts decisions already taken:

- `runCalibration` **refuses to lower** the burn estimate on a disappointing scale while cutting
  (`app.jsx:787-791`), because *"a weight rise (or a stall) while eating below maintenance has five
  innocent explanations ... and none of them mean a lower burn"* (`app.jsx:758-762`).
- `gainWhileCutting` (`app.jsx:1108-1112`) exists **specifically to explain this situation away** —
  and deliberately measures over **14 days, not 7**, because *"a single week of water is exactly the
  noise this is here to explain away"* (`app.jsx:1106-1107`).
- The stall check uses `STALL_WEEKS = 3` (`app.jsx:1051`) because *"a fortnight of water retention is
  not a stall"* (`ENERGY_MODEL.md` §5.3).

So the app's internal machinery treats a 7-day weight rise as meaningless, while the History card puts
it in large red type. History is the only place in the app that claims a weekly weight verdict.

**Honest minimum detectable change over 7 days.** Signal first:

| Deficit | True fat change over 7 days (7,700 kcal/kg) |
|---|---|
| 199 kcal/day (his actual) | **0.18 kg** |
| 500 kcal/day (a full cut) | **0.45 kg** |
| 25% of maintenance, the app's ceiling (`MAX_DEFICIT_FRAC`, `app.jsx:371`) | 677×7/7700 = **0.62 kg** |

Now the noise on a single morning reading, by mechanism (not a jargon noun — these are the actual
masses moving):

- **Gut contents.** A day's food and drink in transit is on the order of 1–2 kg of mass. Constipation
  or a large late meal moves the morning reading by itself.
- **Glycogen and the water bound to it.** Each gram of stored glycogen carries roughly 3 g of water —
  that ratio is well established. A 300–500 g glycogen swing between a low-carb day and a refeed is
  therefore ~1–2 kg on the scale, and none of it is fat.
- **Sodium-driven fluid.** A salty meal or a change in sodium intake shifts 0.5–1.5 kg over a day or
  two.
- **Training.** A hard session adds fluid to the worked muscle and to the gut (post-workout carbs and
  fluid), typically for 24–72 hours.

Day-to-day variation in morning fasted bodyweight in free-living adults is routinely quoted at
roughly **0.5–1.0% of bodyweight as a standard deviation** — 0.5–1.0 kg for him. ⚠️ I am confident in
that range as a working figure from practice and from the weight-smoothing literature, but I have not
re-read the specific papers in this session and I will not cite one I cannot check. Treat the range as
a coach's working estimate, not a quoted result.

Carry it through. With daily weigh-ins, a 7-point mean has a standard error of roughly
`SD/√7 ≈ 0.19–0.38 kg`. Comparing two such means a week apart gives about `×√2 ≈ 0.27–0.53 kg`. A
change you could honestly call real (about two standard errors) is therefore **~0.5–1.1 kg per week**
— which is **larger than the true weekly change at any sane deficit** (0.18–0.62 kg above).

**Conclusion: a 7-day window cannot support a weight-trend claim, however it is computed.** Not from
raw endpoints, not from a smoothed line, not from a fitted slope. The data genuinely is not there.

The three estimators on the same seven points prove it without needing my SD at all:

| Method | Result |
|---|---|
| Raw endpoints (shipped) | **+1.7 kg** |
| Fitted line through all 7 (report's figure) | +0.87 kg/wk |
| Same line, minus the 06/09 point | −0.08 kg/wk |
| Rolling average already on the chart (`app.jsx:5631-5639`) | ~+0.3 kg |

Four defensible readings of one week spanning 1.8 kg and both signs. **That spread *is* the noise
figure** — it is self-measured, needs no citation, and it is the argument to put in front of the
founder. ⚠️ I could not verify the two fitted-line numbers: the report gives only the first and last
raw weights (97.1, 98.8), not the five in between.

**Minimum span I will defend:** **14 days of near-daily weigh-ins for a direction word only
("roughly flat", "slowly down"); 21 days before a number in kilograms.** That is not a new rule — it
is the rule the app already applies to itself at `app.jsx:1110` (14 days) and `app.jsx:1051` (3 weeks).

### FL-003 — the amber verdict is right. The report's diagnosis of it is wrong.

I checked the engine. Two corrections the implementer needs before touching this:

**1. Correcting 12/09's mode will not change the weekly verdict.** `weeklyIntakeScore` is called with
`selectedMode: mode` — the *live current* mode (`app.jsx:3973`). Per-day modes only affect that day's
own ring segment (`dayMode`, `app.jsx:3934`). So the report's claim that the ring says "This week
hasn't been a cut" *"on the strength of that one day"* is **false**. The verdict comes from the week's
average against the baseline:

```
logged days (07–12/09): 2580 + 2334 + 2228 + 2504 + 2927 + 2331 = 14,904
14,904 / 6 = 2,484          (matches the report's "Based on 6 of 7 days logged")
2,484 − 2,709 = −225        inside the ±250 band (WEEK_BAND_KCAL, app.jsx:589)
→ reads as "maintain" → on a selected Cut: amber, "This week hasn't been a cut."
```

Fix FL-010, set 12/09 to CUT, and the amber stays. Say that out loud in the fix, or he will think the
fix failed.

**2. The amber is correct and it is the most useful sentence on the screen.** He averaged 225 kcal
under maintenance in a week he intended to cut — an 8% deficit, about 0.2 kg/week. "This week hasn't
been a cut" is true. The app's job here is to report what happened, not to ratify what he meant, and
on that question the report has it backwards: it treats the honest verdict as the defect.

**So what do I grant?** The *record* should be correctable (that is FL-010, and it is a real bug —
see below). What I would **decline** is FL-003's stated expectation that the app *"offers to correct
the status"* when logged intake disagrees with the chosen mode. Three reasons:

- It coaches the wrong lesson. The action it suggests is "change your label", when the honest action
  is "change your food". On a calorie tracker, teaching someone to relabel the day until the colour
  goes green is a habit worth not building.
- It duplicates a voice that already works. The weekly read already says, in plain words, *"This
  week's average has actually run a bit under — more of a cut than maintain. More food would bring it
  back."* (`app.jsx:603`). That copy is good and it is aimed correctly.
- It breaks a decided guardrail: *"no logged entry, target, or mode is changed automatically"*
  (`features/dashboard/04-intake-scoring.feature:706-709`).

**The real, unreported harm in FL-003 is not the colour — it is what a mis-set day does downstream.**
Neither the report nor the brief mentions this and it is the strongest case for FL-010:

1. **It drains the cut block.** A non-cut day pays down the accumulated cut load pro rata —
   `b.load = breakLoad × (1 − offRun/14)` (`app.jsx:1141-1147`). `ENERGY_MODEL.md` §5.3 states the
   consequence plainly: *"one day off cancels roughly four cut days deep in a block."* So one
   wrongly-set MAINTAIN day pushes the diet-break prompt — the app's **main protection against a cut
   running too long** — about four days later than earned. That is a safety signal arriving late
   because of a mis-tap.
2. **It can lift the auto-lowering refusal.** `wasCutting` is a majority of declared modes over the
   measured week (`app.jsx:770-771`), counting only days that have a history snapshot. In a week with
   few snapshots, **two** mis-set MAINTAIN days flip the majority, the refusal lifts, and the
   calibration is free to lower his target off a cut week's data. That is the precise mechanism
   `ENERGY_MODEL.md` §5.4 was written to close.

FL-003 and FL-010 should be one item, ranked for *those* two consequences, not for a segment colour.

### FL-007 — right bug, Medium is too low, and the proposed fix is worse than the bug

On the History card an under-logged day costs little: one day in seven at 620 kcal short moves a
7-day average by 89 kcal/day. Where it actually bites is `runCalibration`, which the report does not
mention.

`recentHist` filters `d.kcal > 0` (`app.jsx:721`) — so an abandoned log **passes the filter** and its
too-low total enters `avgKcal` (`app.jsx:733`). Carry the signs through:

```
avgKcal ↓  →  avgDeficit ↑  →  expectedChange more negative (expect more loss)
scale doesn't deliver it  →  discrepancy = actual − expected  is POSITIVE
errKcal = −discrepancy × 7700/7  is NEGATIVE
→ the app concludes it burns LESS than it thought → lowers tdeeAdj → lowers his target
```

Worked: if one day of seven is under-logged by 620 kcal, `avgKcal` falls ~89, the expected weekly loss
overstates by `89×7/7700 = 0.08 kg`, and the measured error is about **−89 kcal/day** before gain and
cap. Small per week, but it is an integrator — it accumulates in the same direction every week he
logs patchily.

**What saves him today** is the asymmetry at `app.jsx:787-791`: while cutting, a lowering step is
refused. **What does not save him** is a diet break. In Maintain or Bulk the refusal lifts by design,
and that is exactly when under-logged days push his target down — during the break that was supposed
to feed him back up. That is a real hole and it is worth stating to the founder.

**And now the fix direction, which I think is the most dangerous single proposal in the report.**
FL-007 offers *"left out of the average"* as an option. Do not do it.

- Dropping days that look suspiciously low **biases every average upward** and hides real
  under-eating. The app's whole reason for existing is to not let his intake quietly drift low. A
  filter that removes low days is a filter that removes the evidence.
- There is no stored field that can tell "ate little" from "stopped logging" (the brief's own note;
  confirmed — the snapshot at `app.jsx:6989-7001` carries no completeness marker). So any "leave it
  out" rule must *guess*, from the only available signal: the total being low. That is a rule that
  deletes low days because they are low. Circular, and it points the wrong way.
- It breaks a decided guardrail, in spirit and almost in letter:
  `features/dashboard/04-intake-scoring.feature:691-692` — *"hiding a bad day by not logging it must
  never beat logging it honestly."* An automatic drop is the app doing the hiding on his behalf.
- And `features/dashboard/04-intake-scoring.feature:711-714` already decided the scope question:
  *"this feature scores the logged value as-is ... it does not attempt to judge or correct the
  estimate."*

**What I would accept instead:** nothing automatic. If anything, a **per-day marker he sets himself**
("this day's log is incomplete"), excluded only on his say-so, shown in the count
("based on 6 of 7 days"), and — critically — also excluded from `runCalibration`. That needs stored
state, which means a database column, which means a migration run first (brief rule 5). Given n=1 and
the size of the error (89 kcal/day on an average, ~89 kcal/day of slow calibration drift), **my
recommendation is to do nothing mechanical and fix it in copy**: label the average honestly so he
reads it as "what you logged", not "what you ate". See §4.

### FL-009 — small, but it is FL-002's failure in picture form

Categorical x-axis (`app.jsx` ~6020-6050, `dataKey="date"` over `fmtShort(d.date)` strings). The
body-fat case is the one that matters physiologically: three readings (10, 11, 13/09) drawn at equal
thirds reads as a continuous three-day slide. `features/body/02-founder-decisions.md` measured the
noise on that metric directly — **±0.67 points from half-centimetre tape wobble, against 0.40 points
for a whole week of genuine fat loss.** So an evenly-spaced three-point body-fat line is a picture of
tape error with the time axis removed. Fix it; it is cheap and it is the same honesty principle as
FL-002.

### FL-004 — right behaviour, wrong reason, and the reason matters

**Grant the behaviour.** Today's weigh-in must stay in the trend, and the app already does this
everywhere else: `trendLossFrac` passes *tomorrow* as the cutoff so today's reading is included
(`app.jsx:1077`), as does the block-loss average (`app.jsx:7038`). History excluding it would make
History disagree with the calibration.

**Reject the reason.** The report says *"Today's fasted morning reading is the best data in the
range."* It is not. It is one draw from a noisy distribution — see FL-002's mechanism list. It is
specifically **not** the best reading when it follows: a high-carb or high-sodium day, a hard training
session (24–72 hours of fluid), alcohol, travel, a late meal, a missed bowel movement, or a weigh-in
taken in a different state from the others (clothed, post-coffee, post-session, not first thing).

Why the wrong reason is dangerous: "today's reading is the best data" is exactly the premise that
justifies showing a raw single reading as a headline — which is FL-002. Today's weigh-in earns its
place by being **the newest point in an average**, not by being accurate. Keep it in; never promote it
to a verdict.

### FL-005 and FL-008

FL-005 is **protective and should be downgraded, not fixed away.** Three visible counts are what made
an arithmetic error findable; the founder's own decided principle is transparency over suppression
(`features/dashboard/04-intake-scoring.feature:694-702`;
`features/body/02-founder-decisions.md` DECIDED 3 — *"It must state what it is built from ... never
claiming four readings when it has two"*). Make the counts **agree and be labelled**, do not reduce
them to one number.

FL-008 is a correct defensive note. No health content.

---

## 3. The thing nobody asked — does the batch bias in one direction?

**Yes, and it is one direction across the whole batch.**

| Bug | Effect on the picture of his intake / progress |
|---|---|
| FL-001 | Intake reads **314 kcal/day lower** than truth |
| FL-007 | Intake reads lower again (~89/day per under-logged day in seven) |
| Dashboard partial day (unreported) | Intake reads lower, in the morning |
| FL-002 | Weight reads as **gaining** when it is flat |
| FL-009 | Body fat reads as a steady slide when it is three noisy points |

Intake understated, weight gain overstated. Both support the same conclusion — *I am eating less than
I thought and still not losing, so I must eat less still* — and that conclusion is false on this data.

**Compounding arithmetic for FL-001 + FL-007 (the brief asked; they add, they do not cancel).** Take
09/09's 2,228 as an abandoned log where he actually ate ~2,850:

```
True 7-day sum   = 17,569 − 2,228 + 2,850 = 18,191  →  18,191 / 7 = 2,599 kcal/day
Under-logged, ÷7 =                 17,569 / 7 = 2,510   (−89  vs truth)
Under-logged, ÷8 =                 17,569 / 8 = 2,196   (−403 vs truth, −15.5%)
```

Same sign, and the combined error is −403 kcal/day. A man reading 2,196 against a 2,709 maintenance
sees a 513 deficit where the real one is 110. **Five times too big.**

### Could a safety warning have fired late, not at all, or spuriously?

I traced each protection. Answers are specific:

**Not affected** (these read the *target* or the *scale*, never the History card):

- **Steady-loss floor** and **`SAFE_MIN`** — act on the prescribed target (`app.jsx:371-412`).
- **Low-fuel EA warning** — built from the target and raw burn, and gated on `LEAN_BF` 15% male. At
  ~22% body fat **he will never see it**, bug or no bug (`ENERGY_MODEL.md` §5.1, Step 4).
- **Stall check** — reads `trendLossFrac`, which uses rolling averages (`app.jsx:1075-1081`). Immune
  to FL-002. Worth noting the consequence: the stall check can correctly say "nothing is moving"
  while the History headline above it says "+1.7 kg". The screens will contradict each other.
- **The 30-day low-energy-availability symptom check (file 05)** — **shelved**
  (`ENERGY_MODEL.md` §5.5, §7). It cannot fire late because it does not exist. If the brief is
  working from a belief that it is live, correct that. It is also the reason FL-001's understated
  intake triggers nothing: the one thing that would have watched logged intake against the floor was
  the thing that got removed.

**Can fire late:**

- **The diet-break prompt.** Via FL-003/FL-010. A wrongly-set MAINTAIN day drains the cut block
  (`app.jsx:1141-1147`); §5.3 prices one off-day at ~four cut days deep in a block. This is the app's
  principal duration protection and a mis-tap delays it.

**Can be wrongly switched off:**

- **The refusal to lower his target while cutting.** Via `wasCutting` (`app.jsx:770-771`), a majority
  over days that have snapshots. Two mis-set MAINTAIN days in a thin-snapshot week flip it, the
  refusal lifts, and the calibration walks his target down off cut-week data. This is the original
  harm (§5.4) re-entered through a mode label nobody can edit.

**Can be biased toward lowering his target:**

- **`runCalibration`.** Via FL-007, in Maintain/Bulk weeks only — i.e. during a break.

**Can fire spuriously — and this one is unreported.** The Dashboard weekly verdict counts today as a
complete day the moment one item is logged: `loggedAnything: logs.length > 0` (`app.jsx:3930`). No
`dayClosed` gate — even though `dayClosed` is already computed 37 lines earlier at `app.jsx:3893` and
is already used for today's own grading. Worked on the report's data:

```
Nothing logged today:   14,904 / 6 = 2,484  →  2,484 − 2,709 = −225  → "maintain" → AMBER
One 400 kcal breakfast: 15,304 / 7 = 2,186  →  2,186 − 2,709 = −523  → "cut"      → GREEN
   "This week's been a real cut — averaging a genuine deficit. Keep going."
Day finishes at 2,500:  17,404 / 7 = 2,486  →  −223                   → "maintain" → AMBER again
```

So logging breakfast flips the week from amber to a green "keep going", and dinner flips it back. The
green is spurious, it appears in the morning, and it says *keep going* on a week that has not been a
cut. That is a false all-clear on the screen that drives his behaviour — and it is the same
partial-day error as FL-001, in the engine rather than the display. Cheapest correct fix: gate today's
entry into the weekly average on the existing `isDayClosed` (`app.jsx:564`), which already encodes the
project's own answer to "is this day finished". No new constant.

⚠️ One caveat the implementer must respect: `features/dashboard/04-intake-scoring.feature:192` decides
*"this week means the last 7 days ending today"*. Gating today on `dayClosed` narrows that. It is a
founder call, not a silent fix.

---

## 4. Fix-direction critique

### FL-001's fix — "complete days only". Right answer, wrong stated rule, and name what he loses.

**What he loses:** mid-week visibility of a developing shortfall on the History screen. In practice
that costs little, because the Dashboard weekly ring is the live surface and already covers it (once
its own partial-day bug above is fixed). I would accept the loss.

**But "complete days only" is not the rule I would write.** The project already has a better one,
decided and running: **average over days that were actually logged, divide by that count, and state
the count** (`weeklyIntakeScore`, `app.jsx:614-627`;
`features/dashboard/04-intake-scoring.feature:679-702`). Two reasons to prefer it:

- It also fixes the case "complete days only" misses — a past day with no log at all, which under
  `filtered.length` still counts as a zero in the denominator.
- It puts both screens on **one definition of "weekly average intake"**. Right now there are two
  (`weeklyIntakeScore` correct, History's card wrong), and the one on the screen labelled AVERAGES is
  the wrong one. That is the finding under the finding: this is not an off-by-one, it is a second
  implementation of a number that already had a correct implementation 5,400 lines up.

**Recommended rule:** exclude today unless `isDayClosed` says it is finished; exclude past days with
no logging; divide by what remains; say what that was. Do not hide a thin week behind an empty state —
that is `features/dashboard/04-intake-scoring.feature:694-702`, and it is the founder's own call.

### FL-004's fix — keep today's weigh-in. Accept the behaviour, reject the justification.

Covered above. Behaviour matches `trendLossFrac` (`app.jsx:1077`), so keep it. Strike "the best data
in the range" from the report before it becomes a premise for anything. And FL-004's request that each
card state its own dates is right and should be adopted generally — weight and intake legitimately
cover different ranges and the screen must say so.

### FL-002's fix — "report the direction of the line through all the readings". Not enough.

Over 7 points the line is not statistically meaningful, and the four-estimator table above is the
proof. Putting the rolling line's endpoints in the headline would replace a wrong number with a
quieter wrong number — and it would still carry a sign and a colour, which is where the behaviour
comes from.

**What I would defend:**

- At the 7-day range, **show no trend figure at all.** Say what the card can honestly say: how many
  weigh-ins are in view, and that a week is too short to read a direction. The chart's raw points stay
  — the founder's DECIDED 4 is explicit that the raw number is shown honestly and *"the average line
  is the thing that says whether it is real"* (`features/body/02-founder-decisions.md`). There just
  is not enough of a line yet at seven points.
- **From 14 days:** a direction word only, from the rolling average, uncoloured.
- **From 21 days:** a figure in kg/week, from the rolling average, and only then may it carry a
  colour.
- **Never colour a weight change red.** Not at any span. A gain while cutting has five innocent
  explanations and the app already says so in its own code comments (`app.jsx:758-762`) and on its own
  dashboard card. Red contradicts that, and red is the part he acts on.

Reuse, don't rebuild: `weighRollingAvg` (`app.jsx:657`) and `trendLossFrac` (`app.jsx:1075`) already
exist, already gate on ≥3 readings, already return `null` rather than guess. The report's note that
v78 fixed this same defect on the Dashboard badge is right — History should call the same thing.

### FL-007's fix — "leave the day out of the average". **Reject.** This is the failure mode the app exists to prevent.

Full reasoning in §2. In one line: a rule that drops days because they look low is a rule that deletes
the evidence of under-eating, and it breaks a decided guardrail
(`features/dashboard/04-intake-scoring.feature:691-692`). If anything is built, it must be
user-declared, never inferred, and it must also be excluded from `runCalibration` — otherwise the fix
tidies the display and leaves the target drifting down. My recommendation at n=1 is to fix this in
copy, not in arithmetic.

### FL-003's fix — grant the editability (FL-010), decline the mismatch warning

Full reasoning in §2. And whoever implements FL-010 must re-derive the cut block, not just the colour:
changing a past day's mode changes `dayCutLoad` and the drain (`app.jsx:1128-1161`) and `wasCutting`
(`app.jsx:770-771`). A mode edit that repaints a segment but leaves the cut load and the calibration
reading the old value would leave the two *safety* consequences unfixed while looking fixed — which is
worse than the bug, because it closes the ticket.

---

## 5. Recommended copy

Rules I am applying: a number on screen must not claim more than the data supports; no figure should
read as an instruction; nothing should be coloured red unless the right response to it is to act.

| Where | Now | Recommended | Why |
|---|---|---|---|
| `app.jsx:6073` averages header | `7 DAYS AVERAGES · 8 DAYS` | `DAILY AVERAGE · 7 logged days (6–12 Sep)` | One count, and it names the dates. Satisfies FL-005 and FL-004 together. |
| Averages card, sub-line | *(none)* | `What you logged. Today isn't counted until it's done.` | Tells him it is a record of logging, not of eating — the honest answer to FL-007 without deleting any data. |
| Today, on the averages card | *(folded into the average)* | `Today so far: 1,240 kcal` as its own line | He keeps mid-day visibility without a partial day corrupting an average of whole days. |
| `app.jsx:6090` | `⚖️ WEIGHT TREND` | `⚖️ WEIGH-INS IN VIEW` at 7 days; `⚖️ WEIGHT TREND` only from 14 days | The word "trend" is a claim. Do not make it on seven readings. |
| `app.jsx:6092-6096` at 7 days | `97.1kg → 98.8kg` / **+1.7 kg** in red | `7 weigh-ins, 97.1–98.8kg. A week is too short to read a direction — day-to-day swings of a kilo or more are normal from water, food in the gut and stored carbohydrate.` No figure, no colour. | Replaces a false number with the true reason there is no number. Names the actual mechanisms rather than saying "noise". |
| Same, from 14 days | — | `Average weight is roughly flat over the last 14 days.` Neutral colour. | Direction only, from the rolling average, at the span the app itself already trusts (`app.jsx:1110`). |
| Same, from 21 days | — | `Down about 0.2kg a week over 3 weeks (from your average, not single readings).` | A number, at the span that can support one, saying where it came from. |
| Weight-change colour, any span | red when positive (`app.jsx:6095`) | never red | A gain while cutting is usually water, and the app says so elsewhere. Red asks him to act on something he should not act on. |
| Body-fat card `app.jsx:6066` | `▲ 0.7 pts of body fat since last month` | `▲ 0.7 pts since last month — about the size of normal tape variation, so treat it as a maybe.` | The repo measured the wobble at ±0.67 points (`features/body/02-founder-decisions.md`). At 0.7 the app is reporting its own measurement error as a result. |
| Body-fat trend line | — | state what it is built from: `avg of last 3 readings` | Founder DECIDED 3, verbatim: never claim four readings when it has two. |
| Weekly ring, while today is open | `Based on 6 of 7 days logged` | `Based on 6 finished days. Today's still going.` | Stops the morning green flip being presented as a weekly verdict. |

Two phrases I would **not** add, despite the report asking for them:

- Anything that reads as a diagnosis or an instruction about eating — *"you're under-eating"*,
  *"your metabolism has adapted"*, *"eat more"*. The app has no data that supports either claim, and
  `ENERGY_MODEL.md` §4 already binds: a calorie-facing warning must be rare and genuinely earned.
- A mismatch nudge offering to change a past day's mode (FL-003). It teaches relabelling over eating,
  and it duplicates a line that already works (`app.jsx:603`).

---

## 6. What I could not verify

- The five intermediate weigh-in values. So the report's fitted-slope figures (+0.87 and −0.08 kg/wk)
  are unchecked. The argument in §2 does not depend on them.
- The 0.5–1.0%-of-bodyweight day-to-day weight variation figure: a working range from practice and
  from the weight-smoothing literature, not a citation I re-read in this session. Flagged as such. The
  four-estimator spread (1.8 kg across one week) is self-measured and needs no citation — use that one
  with the founder.
- The dashboard green/amber flip is reasoned from the code (`app.jsx:3930`, `app.jsx:614-650`) and the
  report's own figures, which it reproduces exactly (2,484 → "Based on 6 of 7 days logged"). **Not
  observed live.** It is worth five minutes on a device before the batch is scoped: log one small item
  in the morning and watch the ring.
- Whether 09/09's 2,228 was in fact an abandoned log. I used 2,850 as an illustration; the true value
  is unknowable from stored data, which is FL-007's actual point.
- I did not run the Jest suite or check whether `__tests__/logic.test.js` pins the History average —
  the brief put the test layer with the QA hat.

## 7. What I think is settled

- FL-001 is a real bug, the report's arithmetic is right, and the repo has already decided the rule it
  breaks (`features/dashboard/04-intake-scoring.feature:679-692`).
- FL-002 is a real bug and the rolling line that should feed it already exists (`app.jsx:5631-5639`).
- FL-010 is a real bug with two safety consequences nobody has written down yet.
- FL-006 was correctly withdrawn.
- FL-005 is a feature wearing a bug's clothes — make the counts agree, keep them visible.

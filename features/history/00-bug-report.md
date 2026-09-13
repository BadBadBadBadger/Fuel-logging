# Fuel Log — Bug Report

Date raised: 13 September 2026. Build/session: live, logged-in account.
Screens affected: History, Dashboard. Reporter: Adrian (founder, sole user).

## Test account state at time of capture

- 8 dated rows present: 06/09–13/09
- 13/09 (current day) logged with 0 kcal, 0g all macros, 0 water
- Calibrated est. TDEE 2,709 kcal; est. budget 92%
- Daily kcal: 06/09 2665 · 07/09 2580 · 08/09 2334 · 09/09 2228 · 10/09 2504 · 11/09 2927 · 12/09 2331 · 13/09 0
- Weigh-ins present for 06, 07, 08, 09, 10, 11, 13 September. None for 12/09.

---

## FL-001 — Averages are divided by 8 when only 7 days are complete

**Severity: Critical.** The weekly average is the number the whole app is built around, and it is
wrong on the screen whose job is to show it.

**Preconditions**
- 7 complete days of intake logged (06/09–12/09)
- Current day (13/09) present with 0 kcal and 0g macros

**Steps to reproduce**
1. Open History
2. Select the "7 Days" range filter
3. Read the averages card

**Expected outcome**
- The date range covers the 7 complete days ending yesterday (06/09–12/09)
- Card header reads "7 DAYS AVERAGES", with no second day count after it
- KCAL average = 17,569 ÷ 7 = 2,510
- FAT average = 544 ÷ 7 = 78g
- The number stays put all day instead of changing as meals are logged

**Actual outcome**
- Card header reads "7 DAYS AVERAGES · 8 DAYS"
- KCAL average displays 2,196, which is 17,569 ÷ 8
- FAT average displays 68g, which is 544 ÷ 8
- All four headline stats are affected, not just kcal
- The average climbs through the day as the current day is logged

**Evidence** The seven complete days' fat values (67, 72, 80, 80, 83, 79, 83) add up to exactly 544.
Divided by 8 that gives 68, which is what the card shows. Divided by 7 it gives 77.7. So the app is
dividing by 8, and today's zeros are being included in the total.

**Fix direction** The date range should run for 7 days ending at yesterday's midnight in the user's
local time. The current day is excluded until it finishes.

---

## FL-002 — Weight trend headline uses the first and last readings instead of the overall direction

**Severity: High.** The headline and the chart directly below it say opposite things, and the
headline is the one in large red type.

**Preconditions**
- 7 weigh-ins in the date range, the first of which (06/09, 97.1kg) sits 0.65kg below the
  next-lowest reading
- The smoothed black line is drawn on the same chart

**Steps to reproduce**
1. Open History
2. Select "7 Days" and the Weight metric
3. Compare the "WEIGHT TREND" headline against the black line on the chart

**Expected outcome**
- The headline comes from the same line already drawn on the chart
- With this data that reports roughly flat, or a small rise well under 1kg
- Direction and size agree with what the chart shows

**Actual outcome**
- Headline reads "97.1kg → 98.8kg" and "+1.7 kg" in red
- This is simply the last reading minus the first reading
- The black line on the same chart rises about 0.3kg across its span and flattens at the
  right-hand end
- Draw a straight line through all seven readings and it slopes up about 0.87kg/week. Remove the
  single low 06/09 reading and redraw it and the slope becomes −0.08kg/week. The headline is driven
  by one reading.

**Fix direction** Report the direction of the line drawn through all the readings. If a single
figure is wanted, take it from the ends of that line, not from the raw readings.

---

## FL-003 — A day's selected status can contradict what was actually eaten, with no warning

**Severity: High.** One mis-set day changes the whole week's result and nothing on screen catches it.

**Background** CUT / BULK / MAINTAIN is chosen by the user for each day. The app scores the day
against whichever was chosen. If the wrong one is chosen, the day is scored against a target the
user never intended, and the result looks like a bug in the scoring.

**Preconditions** Calibrated est. TDEE 2,709 kcal

**Steps to reproduce**
1. On a given day, set the status to MAINTAIN
2. Log intake well below maintenance — e.g. 2,331 kcal, roughly 380 under
3. Hit all macro targets that day
4. Let the day finish, then open Dashboard

**Expected outcome**
- Something flags that the logged intake does not match the selected status, either during the day
  or when it closes
- Better still, the app offers to correct the status rather than silently scoring against the wrong
  target

**Actual outcome**
- The day scores amber, because it is measured against MAINTAIN
- Macros score green on the same day, which reads as a contradiction
- The weekly ring then reports "This week hasn't been a cut" on the strength of that one day
- Confirmed on Sat 12 Sept 2026 in this account: status set to MAINTAIN in error, intake logged at
  cut level, macros green, segment amber

---

## FL-004 — Check weight still shows today after FL-001 is fixed

**Severity: Medium.** This is here to stop the FL-001 fix breaking something else.

**Why** Intake needs a whole day before it means anything. A weigh-in means something the moment it
is taken. Today's fasted morning reading is the best data in the range and must not be thrown away
by a blanket "complete days only" rule.

**Steps to reproduce (after FL-001 is fixed)**
1. Log a weight for the current day
2. Open History, select "7 Days", select the Weight metric

**Expected outcome**
- Today's weigh-in appears on the chart
- Today's weigh-in counts towards the trend
- Because intake and weight now cover different date ranges, each card says which dates it is using

**Actual outcome** To be checked once FL-001 is done.

---

## FL-005 — Three different day counts on one screen

**Severity: Medium.** Harmless on its own, but it is what made the arithmetic bug visible, and it
will do the same to testers.

**Steps to reproduce**
1. Open History with 7 complete days plus a current day
2. Read, in order: the range filter, the averages card header, the list header
3. Open Dashboard and read the "THIS WEEK" ring subtitle

**Expected outcome** One consistent count, or clearly different labels where the counts genuinely
differ.

**Actual outcome**
- Filter: "7 Days"
- Averages card: "7 DAYS AVERAGES · 8 DAYS"
- List header: "8 DAYS LOGGED"
- Dashboard ring: "Based on 6 of 7 days logged"

---

## FL-006 — WITHDRAWN, not a bug

Originally raised as Tue 08 Sept (2,334 kcal, CUT) and Sat 12 Sept (2,331 kcal, MAINTAIN) getting
opposite verdicts for near-identical intake.

CUT / BULK / MAINTAIN is picked by the user for each day, not worked out by the app. The two days
differ because they were set differently. Nothing to fix here. The real issue is FL-003: nothing
warns when the choice and the intake disagree.

---

## FL-007 — A day where logging was abandoned looks the same as a genuinely low day

**Severity: Medium.** The average goes wrong and nothing tells you.

**Steps to reproduce**
1. On any past day, log breakfast and lunch only
2. Never log the evening meal
3. Let the day roll over
4. Open History and read the averages card

**Expected outcome**
- The day is marked as possibly incomplete, or left out of the average, or the user is asked to
  confirm it
- Something on screen separates "ate little" from "stopped logging"

**Actual outcome**
- The day counts at face value and drags the average down
- Nothing anywhere in the UI indicates this

**Data note** 09/09 (2,228 kcal) is the lowest complete day currently shown. Nothing in the stored
data says whether that was a genuinely low day or an abandoned log. That is the bug.

---

## FL-008 — Day one has no yesterday

**Severity: Low, but it will break the FL-001 fix if unhandled.**

**Steps to reproduce**
1. Install fresh / create a new account
2. Log a first meal on the day you sign up
3. Open History

**Expected outcome** An empty state saying averages start once the first full day has finished.

**Actual outcome** To be checked. After FL-001 the date range will contain zero complete days;
confirm it does not show 0 kcal, NaN, or crash on a divide by zero.

---

## FL-009 — Chart spaces points evenly instead of by date

**Severity: Low, but it hides gaps in the data.**

**Steps to reproduce**
1. Open History, "7 Days", Weight metric — note there is no weigh-in for 12/09
2. Switch to the Body Fat % metric — note only 10/09, 11/09 and 13/09 have readings

**Expected outcome** Points sit where their date falls, so a missing day shows as a visible gap.

**Actual outcome**
- Points are spread out evenly regardless of date
- On the weight chart, the step from 11/09 to 13/09 takes up the same width as 06/09 to 07/09,
  despite covering twice the time
- On the body fat chart, 10/09, 11/09 and 13/09 sit at equal thirds and 12/09 disappears, so a
  two-day gap looks like a continuous three-day slide

---

## FL-010 — A past day's status cannot be corrected

**Severity: High.** FL-003 says the status can be set wrongly. This one says you then cannot fix it.

**Background** Selecting a day row already opens that day for editing, and food and water can both
be logged retrospectively there. The intention set for that day cannot. So the screen lets you
correct what you ate but not what you were trying to do, which is the half of the record more likely
to be wrong.

**Steps to reproduce**
1. Open History and select the row for Sat 12 Sept 2026, which was set to MAINTAIN in error
2. Look for a way to change that day's status to CUT

**Expected outcome**
- The day's status is editable on the same screen as its food and water, and changed the same way
- Changing it from MAINTAIN to CUT rescores that day
- The day's segment on the weekly ring changes colour
- The weekly result recalculates, so a week wrongly reported as "hasn't been a cut" reports
  correctly once the day is fixed

**Actual outcome**
- Food and water can be edited on that screen. Status cannot.
- The wrong intention is locked in permanently, and every weekly figure derived from it stays wrong.

---

## Open questions for implementation

1. Does changing a past status also recalculate weeks that have already closed, or only the current
   one?
2. Does it affect streaks or achievements already awarded?
3. Is there a cut-off beyond which past days become read-only, and if so how far back?

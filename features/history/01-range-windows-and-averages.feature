# ── History: range windows, averages, labels and charts ─────────────────────
# Built 2026-09-13 (session 22) from a ten-item bug report the founder wrote from a live session
# on his own phone (`features/history/00-bug-report.md`, kept verbatim). Reviewed by a six-persona
# swarm — QA, engineering, nutrition-coach, design-lead, critical-thinking, anti-metaphor — each
# answering the report independently, then a critical-thinking-chaired debate that ruled on every
# conflict. All eight reports are in `features/history/swarm/`; `07-debate.md` is the decisive one
# and carries the arithmetic behind every number below.
#
# THE ONE IDEA THIS FILE EXISTS TO HOLD. The History screen shows three windows that are NOT the
# same thing, and FL-001 happened because one expression tried to be all three:
#   • the ROW window     — which days appear on the chart and in the day list
#   • the AVERAGE window — which days the headline average divides by
#   • the LABEL          — which states, in dates, the window a number came from
# Keep them named and separate. If a future change makes two of them one, this bug comes back.
#
# The founder's arithmetic was verified exactly, all of it, found by eye: 17,569/7 = 2,510 against
# the 2,196 on screen, and 544/7 = 78g against 68g. Two of his diagnoses were wrong and are
# recorded as such below (FL-003, FL-007) — the observations were right, the causes were not.
#
# Reuses rather than re-derives:
#   • `hasIntake` — lifted verbatim from the weekly ring's own test for "this day has intake"
#     (kcal OR entries, never entries alone, because a snapshot pulled from Supabase before its
#     food_logs rows arrive has real kcal and an empty array). The two engines cannot drift.
#   • `dateKey` / `todayKey` for every boundary. Never `toISOString()`, which is UTC — that was
#     half of FL-001 and is now a build failure, see the guard note below.
#   • `computeMacros` for any re-split of a calorie target, so protein and fat keep their floors
#     and carbs absorb the change. Never proportionally scaled.
#   • `SAFE_MIN` on any typed target, so a hand-set number still cannot go below the floor.
#
# NOT in this file, on purpose:
#   • correcting a past day's mode or target — `features/history/02-correcting-a-past-day.feature`.
#   • the dashboard's weekly window — `features/dashboard/06-weekly-window.feature` (FL-011).
#   • the same off-by-one where it moves the calorie target —
#     `features/energy-safety/11-intake-window-and-cut-evidence.feature` (FL-012, FL-014).
#   • a warning when logged intake contradicts the day's chosen mode (FL-003). WON'T FIX, and not
#     merely descoped: the amber week the founder reported was CORRECT arithmetic — six logged days
#     averaging 2,484 against a 2,709 estimate, 225 under, inside the ±250 band — not a scoring
#     bug. No day's mode is an input to `weeklyIntakeScore` at all, which four reviewers confirmed
#     independently. An app that second-guesses a stated intention every time he eats a little
#     under has a false-positive cost and no upside; the legitimate half of it (saying what the day
#     was graded against) ships in file 02 for free.
#   • detecting a day where logging was abandoned (FL-007). WON'T FIX. A written founder decision
#     forbids dropping a low day from the average — that deletes exactly the evidence of
#     under-eating this app exists to catch, and drops it in the direction that flatters. It is
#     also derivable-but-wrong: entry ids are `Date.now()` stamps taken at EDIT time, so a
#     retrospectively-added meal carries a later date, and file 02 actively encourages retrospective
#     editing. A "Last entry 13:40" line would be silently false on precisely the days this batch
#     creates. What ships instead is one honest line of copy, below.
#   • a least-squares trend line. None exists in the app, and a fourth smoothing rule over a
#     seven-point window is not a trend.
#
# ⚠️ THE TEST GUARD, and why it is the most valuable four lines here. `__tests__/logic.test.js`
# has **zero `require` of `app.jsx`** — it is a hand-retyped mirror, so logic never copied across
# cannot be tested and nothing reports the omission. That is how 370 passing tests said nothing
# about a divide-by-8 on the app's headline number. `__tests__/datekeys.test.js` now fails the
# build on the UTC day-key idiom statically; it caught all three shipped call sites on its first
# run. Extracting the pure layer into a `logic.js` both `app.jsx` and Jest load is the real fix —
# it touches `build.sh` and is a standing engineering item, not part of this batch.
#
# ⚠️ A live demonstration of that gap, from building this file: an edit dropped one `const` inside
# `runCalibration` and the app crashed to a blank screen on load. Jest stayed 400/400, because the
# mirror still had the line. Only the Playwright suite caught it. Numbers here are owned by
# `__tests__/history.test.js`; what the screen says is owned by `e2e/history-averages.spec.js`.

Feature: History range windows, averages and the labels that name them

  Background:
    Given a day key is a LOCAL calendar day, "YYYY-MM-DD", and never derived from toISOString()
    And the ROW window for a range is inclusive at both ends and deliberately holds one more key
      than the range names — "7 Days" spans eight keys, the eight days ending today — so the
      chart and the day list keep every row they have
    And the AVERAGE window is the complete days within the row window that have intake
    And "has intake" means kcal above zero OR at least one logged entry, never entries alone
    And every card states its own window in dates, and no card header states a day count

  # ── FL-001 · the headline defect ──────────────────────────────────────────
  # Severity Critical. The weekly average is the number the whole app is built around, and it was
  # wrong on the screen whose job is to show it. Two clauses are needed, not one: "complete days"
  # alone still counts every past day the app was merely OPENED as a favourable zero, because the
  # daily snapshot effect writes a row whether or not anything was logged.

  Scenario: seven complete days plus an unlogged today divides by seven
    Given the seven days 6–12 Sep are logged and total 17,569 kcal
    And today, 13 Sep, has a snapshot with nothing logged
    When I open History and choose "7 Days"
    Then the calorie average reads 2,510
    And it does not read 2,196, which is the same total divided by eight

  Scenario: the average does not climb through the day as I log
    Given the same seven complete days
    When I log 1,800 kcal today
    Then the average still reads 2,510
    # The number holds still all day. Before this it rose with every meal, because today's
    # part-finished total was being counted as a whole day.

  Scenario: a past day the app was only opened is not a favourable zero
    Given 5 Sep has a snapshot with no food logged
    When the seven-day average is taken
    Then 5 Sep is excluded, and the denominator is the seven days that do have intake

  Scenario: a day whose kcal arrived before its entries still counts
    Given a snapshot carries 2,228 kcal and an empty logs array, because its food_logs rows
      have not synced yet
    Then that day has intake and is included
    # Keying only off the array once made six such days read as unlogged, greying the ring and
    # dropping them from the weekly average.

  Scenario: the window does not change size with the hour it is read
    When the seven-day window is built at 00:30 and again at 23:30 local time
    Then both hold the same eight keys
    # The UTC idiom shifted the boundary late evening and again just after local midnight; under
    # BST the window could hold nine keys for an hour every night.

  Scenario Outline: every range has the same shape, not just the week
    When I choose "<range>"
    Then the row window holds <keys> inclusive keys ending today
    And the average divides by the complete days with intake among them

    Examples:
      | range    | keys |
      | 7 Days   | 8    |
      | 30 Days  | 31   |
      | 3 Months | 91   |
      | Year     | 366  |
    # The off-by-one was never confined to the week: 30 Days read "31 DAYS" and averaged 2,323
    # against a true 2,400. "All Time" has no lower bound at all rather than doing date arithmetic
    # on 99,999 days.

  # ── FL-004 · a weigh-in is not an intake day ──────────────────────────────
  # Intake needs a whole day before it means anything. A weigh-in means something the moment it is
  # taken, and today's fasted reading is the best data in the range. The "complete days only" rule
  # is deliberately scoped to intake and must never be applied to the scale.

  Scenario: today's weigh-in still counts, even though today's intake does not
    Given I weighed in this morning
    When I open History and choose "7 Days"
    Then today's weigh-in is on the chart and in the weight figure
    And the intake average still stops at yesterday
    And each card names its own dates, because the two windows genuinely differ

  # ── FL-005 · three day counts on one screen ───────────────────────────────
  # Dates identify a window; counts only qualify it. Forcing the counts to agree would be a
  # regression — after FL-001 there are legitimately three windows — so naming them is the fix.
  # The old list header also counted days the app was OPENED rather than days with food in them;
  # removing the word "logged" closes that too. One edit, two findings.

  Scenario: the averages card names its dates and never a day count
    Then its header reads "DAILY AVERAGE · 6–12 SEP"
    And nothing is written beneath the four numbers
    # The card carried two footnote lines and they said the same thing twice — "· today not
    # counted yet" followed by "Today isn't counted until it's done." The first half of the first
    # line, "7 of 7 days logged", only carries information in the "5 of 7" case, and the header
    # above it already names the dates. The second line, "What you logged.", was the residue of
    # FL-007 — it was meant to admit that a day where logging was abandoned still counts in full,
    # and three words never said that, so it read as filler while failing its own scenario.
    # FL-007's honesty is a standing property of the card, not a fact about today's numbers, and
    # it is recorded in the code and here rather than reprinted under the tiles every day.
    # Today's exclusion stays legible without a caption: the row is directly below in DAY BY DAY,
    # tagged TODAY, and the two headers name two different end dates.

  Scenario: the day list names its own, wider window
    Then its header reads "DAY BY DAY · 6–13 SEP"
    And the one row the average excludes carries the word TODAY
    # So nobody has to subtract two counts to work out which row differs.

  Scenario: the range chips are left alone
    Then "7 Days" still reads "7 Days"
    # A chip is a request, not a claim about what was found.

  # ── FL-008 · day one, and an empty window ─────────────────────────────────
  # Live on the shipped build, and not a consequence of the FL-001 fix. The reported fear was a
  # NaN; what it actually produced was a confident "0 KCAL", which is worse — a wrong number gets
  # acted on, a blank gets asked about.

  Scenario: a brand-new account does not report a zero average
    Given I signed up today and have logged one meal
    Then the averages card reads "No complete days yet. Your average starts once today has finished."
    And no average chips are drawn, so there is no 0 to misread

  Scenario: a window with data only outside it says so, and points at the data
    Given my last logged day was 4 Aug and I am looking at the last seven days
    Then the screen names the empty window and says when I last logged
    # Close to unreachable in practice — the snapshot effect almost always puts today's row in the
    # window — so it is a fallback, not a tested state. A test for a state the app cannot reach
    # passes vacuously.

  # ── FL-002 + Q4 · the weight figure ───────────────────────────────────────
  # The shipped headline was the last reading minus the first, in colour, and the chart beneath it
  # said something else. Four defensible ways of reading one week of weigh-ins span 1.8 kg AND both
  # signs, so seven days cannot support a direction however it is computed. The report's own slope
  # figures do not reproduce and are not carried forward — five of the seven weights were never
  # stated. The app already agrees with itself about this elsewhere: `gainWhileCutting` uses 14
  # days, not 7, and STALL_WEEKS is 3.
  #
  # Founder decision Q4: compare this week's 7-day average against the PREVIOUS 7-day average.
  # Two non-overlapping windows, so the figure rests on fourteen days of data even though it reads
  # as a week, and no average is ever differenced against itself — that last part is what made the
  # old headline overstate by roughly 3x.

  Scenario: the figure compares two whole weeks, not two readings
    Then it reads "WEIGHT, WEEK ON WEEK", with both 7-day averages and the change between them
    And nothing is written beneath it
    And the two windows do not overlap
    # The caption used to read "Averages, not single days — water and food still swing this." Its
    # first half repeated the line directly above it, which already ends "· 7-day averages". Its
    # second half hedged the number without saying what to do about it, and "this" named nothing.
    # Averaging over seven days is what removes most of the water and food swing, so a caption
    # warning about that swing undercut the figure immediately after it had been computed
    # properly. The two averages and the change between them stand on their own.

  Scenario: a genuinely flat fortnight reports no change
    Given fourteen days of weigh-ins at the same weight, with one low reading at the start
    Then the figure reads 0, not a gain
    # The single low reading drove the entire "+1.7 kg" the founder reported.

  Scenario: the figure carries no colour
    Then neither direction is painted green or orange
    # The old rule rewarded a lower number on a scale and painted a gain orange during a bulk,
    # with the day's mode sitting right there unconsulted. Colour is a claim; this one cannot be
    # supported. The same flaw was fixed on the dashboard badge at the same time.

  Scenario: too little data says so rather than guessing
    Given fewer than two weigh-ins in either week
    Then the card says two weeks of weigh-ins will show which way I am going
    And no figure and no direction word is shown

  # ── FL-013 · the reference line was itself wrong ──────────────────────────
  # Severity Critical, found in review, NOT in the bug report — and the single biggest finding in
  # the batch. The report asked the headline to agree with the smoothed line on the chart. That
  # line could not be trusted: it sliced by READING COUNT over the range-filtered array, so at the
  # left edge the window expanded from 3 readings to 7 and manufactured slope. Replicated: a
  # perfectly flat 98.5 kg week with one low first reading drew +0.30 kg — exactly the "honest
  # 0.3" the report cited — and a genuine slow loss drew +0.2 against a real +0.6, understating in
  # the direction a dieter wants to hear. The tooltip called it a 7-day average and the code's own
  # comment claimed a calendar-day window. Neither was true.

  Scenario: the smoothed line is a calendar-day window over the full weigh-in list
    Then each point averages the seven calendar days ending on its own date
    And it is computed from every weigh-in, not from the ones the current range happens to show
    And it draws nothing until three readings are in the window, rather than averaging thin air

  Scenario: the line means the same thing whichever range is on screen
    When I switch between "7 Days" and "30 Days"
    Then a given date's smoothed value does not change
    # The range chip used to starve the left end, so the same labelled quantity changed meaning
    # when the chip changed.

  # ── FL-009 · one step is one day ──────────────────────────────────────────
  # The report said points were evenly spaced regardless of date. The more useful statement of it:
  # the kcal charts already had a row per calendar day, because history stores one, while weight
  # and body fat had a row per READING. That inconsistency was the defect, and it is why a two-day
  # gap collapsed on one chart while the chart beside it was fine.
  #
  # Founder decision: gaps are bridged, not broken. Hiding gap noise is acceptable; making a slow
  # change read as a fast one is not.

  Scenario: every chart on the screen shares one day axis
    Then one step across any of them is one day

  Scenario: a missing weigh-in takes up its own space
    Given I weighed in on 10 Sep and again on 12 Sep, but not on 11 Sep
    Then the step between those points is twice a one-day step
    And the line is drawn straight through the gap, with no break and no marker
    # On the body-fat chart, three weekly readings with a fortnight between two of them used to
    # draw as equal thirds, which reads as a continuous slide.

  Scenario: the reading-count rolling window inside the body charts is untouched
    Then the body-fat trend still averages the last n READINGS, matching SYNC_GATE's own
      gap-tolerant shape
    # Decided behaviour from body/01. Placing rows on a day axis changes where a reading sits,
    # never what it says.

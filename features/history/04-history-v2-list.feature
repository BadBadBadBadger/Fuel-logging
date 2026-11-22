# ── History v2: the list screen (range, daily average, intake bars, day by day) ──────────────
# Behind `?ui=v2`. Source: design/v2/reviews/history-05-ruling.md §3 and §5, owner decisions
# Q2 (no Year, no per-macro charts, no line/bar toggle) and Q4 (CUT-only lamps), D19 (Maintain
# and Bulk are neutral). Built in app.jsx REGION HB.
#
# Reuses rather than re-derives (features/history/01): the four v2 ranges map onto v1's range
# keys (7D → W, 30D, 3M, ALL) and every window, average and label comes from v1's pure helpers
# `rangeWindow`, `avgRowsOf`, `hasIntake`, `daySpine`, `onDaySpine` and `fmtRange`. The three
# windows (rows, average, label) stay named and separate. The CUT-day lamp uses the same grader
# as Today's Last 7 card: `calorieDayScore` on the day's stored target (else `calcTargets`), with
# no grading while the account is still filling in (`WEEK_MIN_HISTORY_DAYS`).
#
# Tests: e2e/v2-history-list.spec.js.

Feature: History v2 list screen

  Background:
    Given the app is opened with ?ui=v2
    And I open History from the header

  # ── Range ──
  Scenario: Four ranges, 30D by default
    Then the range control offers 7D, 30D, 3M and All
    And 30D is selected
    And there is no Day or Year range

  Scenario: The Last 7 card opens History at 7D
    Given I am on Today
    When I tap the Last 7 days card
    Then History opens with 7D selected

  # ── Daily average ──
  Scenario Outline: The readout shows v1's daily average for the same range
    Given a history of complete days, an opened-but-empty day and a logged today
    When I choose <range>
    Then KCAL, PRO, CARB and FAT equal v1's DAILY AVERAGE for <v1 range>
    And today and empty past days are not averaged in

    Examples:
      | range | v1 range |
      | 7D    | 7 Days   |
      | 30D   | 30 Days  |
      | 3M    | 3 Months |
      | All   | All Time |

  Scenario: The readout is labelled with dates, not a count
    Then it reads "Daily average · {first day}–{yesterday}"
    And the figures are ink, with no macro colours

  Scenario: No complete day yet (FL-008)
    Given nothing has been logged before today
    Then the readout says "No complete days yet. Your average starts once today has finished."
    And no zero is shown

  # ── Intake ──
  Scenario: Kcal bars against the stored target
    Then each day in the range has a neutral kcal bar, today's fainter
    And the target stored on each day is drawn as a dashed ink step line
    And the chart is compact, with no emoji and no colour coding

  Scenario: Nothing logged in the range
    Then the intake chart is not shown

  # ── Day by day ──
  Scenario: Rows, newest first
    Then the list is headed "Day by day · {dates}"
    And each row shows a mono date like "SAT 21", "P 151 · C 329 · F 89" and the kcal on the right
    And today's row is labelled "Today"
    And on a weigh-in day the weight shows dim beneath the kcal, in v1's units
    And there is no water, training, chevron or emoji
    And the list ends with "Tap a day to open."

  Scenario: The mode is shown only where it changes
    Then the top row carries its mode as a micro-label
    And any lower row carries one only when its mode differs from the row above

  Scenario: CUT days over target carry Last 7's lamp
    Given a CUT day eaten 300 over its stored target and one 600 over
    Then those rows carry the same amber and red lamp as Last 7 for that day
    And a CUT day at or under target carries none

  Scenario: Maintain and Bulk are never marked (D19)
    Given a Maintain day eaten far over its target
    Then its row carries no lamp

  Scenario: Every row opens its day, today included
    When I tap any row, including today's
    Then the day screen opens for that date

  Scenario: An empty range
    Given nothing is stored in the range
    Then the list shows one quiet line naming the dates

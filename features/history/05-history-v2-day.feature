# ── History v2: the Day screen ───────────────────────────────────────────────
# Ruling: design/v2/reviews/history-05-ruling.md §5 "Day screen", plus the owner's override of H1
# (2026-11-21): today stays editable in History, and App.updateDay routes today's food, water and
# training edits to live state, so the Day screen serves today too.
# Built behind ?ui=v2 in REGION HC of app.jsx (V2HistDay). v1 History is untouched.
#
# Reuses rather than re-derives: v1's patch (totals recomputed from logs with sumLogs),
# setDayMode (calcTargets on that day's own body, stored once — FL-010), setDayTarget (SAFE_MIN +
# computeMacros), the Last 7 grader (calorieDayScore against the stored target), V2SSeg,
# V2MealRow, V2LogButtons, V2Water and V2Macros.
#
# NOT here: a pie chart, emoji, per-row buttons, colour on Maintain or Bulk days (D19), or editing
# today's mode or target from History. updateDay does not route those to live state, so they
# would silently revert; today's mode shows read-only with a way back to Today.
#
# e2e: e2e/v2-history-day.spec.js

Feature: The Day screen in History v2

  Background:
    Given the v2 interface is on
    And History lists past days, including one saved before targets were stored
    And one past day holds two identical food entries with no id
    And one past day holds two food entries sharing one id

  # ── Header and stepping ──
  Scenario: A day opens titled by its date, and steps with ‹ ›
    When I open a past day from History's day list
    Then the header reads its weekday, date and month, like "THU 19 NOV"
    And today's day reads "Today"
    When I tap ‹
    Then the previous day in History opens
    And ‹ is disabled on the first day, › on the last

  # ── 1. Mode ──
  Scenario: Changing a past day's mode re-targets it, and the result is stored
    Given a past day saved as MAINTAIN with a target of 2,709
    When I choose CUT on its mode control
    Then the day is stored as CUT with a target worked out for a cut, below 2,709
    And the score line shows the new target at once
    And the change is still there after a reload

  Scenario: Today's mode is shown, not edited, in History
    When I open today from History
    Then its mode is shown read-only, with "Change on Today"

  # ── 2. The score line ──
  Scenario: A CUT day carries the same band lamp as Last 7
    Given a CUT day eaten 120 over its stored target
    Then the score line shows an amber lamp and "120 over"

  Scenario: A Maintain day is neutral (D19)
    Given a MAINTAIN day eaten 378 under its stored target
    Then the score line shows "378 under" in plain ink
    And there is no lamp and no colour
    And the words "Under-eaten" appear nowhere

  Scenario: A past day with no stored target offers "Set target"
    Given a past day saved before targets were stored
    Then the score line says no target was saved and offers "Set target"
    When I tap "Set target", type 2200 and press Enter
    Then the day is stored with a target of 2,200 and protein and fat targets from computeMacros
    And the score line grades the day against 2,200

  Scenario: A stored target is edited inline
    When I tap the target, which has a dashed underline (D4)
    Then it becomes an input; Enter or tapping away saves it, Escape cancels
    And the safety minimum still holds

  # ── 3. Training ──
  Scenario: TRAINING · REST
    When I choose TRAINING on a rest day
    Then the day is stored as a training day

  # ── 4. Intake ──
  Scenario: Kcal and macro tapes against the stored targets
    Then the eaten kcal shows as a large figure
    And PRO, CARB and FAT tapes compare against the stored targets
    And the carbs target is (target kcal − 4 × protein − 9 × fat) ÷ 4
    And a day with no stored target shows the macro figures without tapes

  # ── 5. Foods ──
  Scenario: Editing one of two identical id-less entries changes only that one
    When I tap the second "Toast" row, change its kcal to 250 and save
    Then only that entry changes
    And the day's kcal, protein, carbs and fat are recomputed from its foods
    And no made-up ids are written to the stored entries

  Scenario: Deleting one of two identical id-less entries removes only that one
    When I tap the first "Toast" row and delete it
    Then one "Toast" remains

  Scenario: Deleting one of two entries sharing an id removes only that one
    When I delete the second of two entries with the same id
    Then the first remains

  Scenario: Food logged with LOG FOOD goes to this day, not today
    Given I am premium
    When I log "a banana" with LOG FOOD on a past day
    Then it is added to that day's foods with a numeric id and the time
    And today's foods are unchanged

  Scenario: Save to Quick Add from a past day's food
    When I tap a food and choose "Save to Quick Add"
    Then it is saved to Quick Add, unless a meal of that name is already saved

  # ── 6–7. Water and body ──
  Scenario: Water
    When I tap + on water
    Then the day's water is stored one higher

  Scenario: BODY appears only on a day with a reading
    Given a weigh-in of 98.2 kg on a past day
    Then that day shows a BODY readout with 98.2 kg
    And a day without a weigh-in or tape reading shows no BODY readout

  # ── Today ──
  Scenario: Edits to today from History reach Today
    When I open today from History
    And I add a glass of water, delete a food and choose TRAINING
    Then Today's live water, foods and training show the same changes

  Scenario: No emoji
    Then the Day screen contains no emoji

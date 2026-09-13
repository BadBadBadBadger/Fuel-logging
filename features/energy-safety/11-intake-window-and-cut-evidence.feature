# ── The calibration intake window, and what "was I cutting" is measured from ─
# Built 2026-09-13 (session 22). Three changes to `runCalibration`, all found during the swarm
# review of `features/history/00-bug-report.md` and none of them in the founder's report. Two are
# the same off-by-one as FL-001, sitting where it moves the calorie target rather than a label.
#
# WHY THIS IS AN ENERGY-SAFETY FILE. `runCalibration` decides whether the app's estimate of what
# you burn goes up or down, and therefore what your target is tomorrow. File 04 established the
# asymmetry that protects a dieter: the estimate is only ever LOWERED when you were NOT cutting,
# because a weight rise or a stall while eating below maintenance has five innocent explanations —
# water from stress or under-eating, glycogen, a full gut, salt, lean mass gained while training —
# and none of them mean a lower burn. Everything below either feeds that decision or gates it.
#
# Reuses rather than re-derives:
#   • `avgDeficit`, already computed three lines above the refusal, as the test for "was I
#     cutting". Confidence-weighted, and built from food that was actually logged.
#   • `dateKey` / `getDevDateOffset` for both boundaries.
#
# NOT in this file, on purpose:
#   • the History screen's windows — `features/history/01-range-windows-and-averages.feature`.
#   • the dashboard's weekly window — `features/dashboard/06-weekly-window.feature`.
#   • file 04's asymmetry itself, which is unchanged. Only the signal that gates it changes.

Feature: The calibration intake window, and the evidence that gates a lowering

  Background:
    Given runCalibration compares what the scale did against what logged intake predicted
    And it may only LOWER its estimate of maintenance when the user was not cutting
    And every boundary here is a local calendar day and honours the dev clock

  # ── FL-012 · the off-by-one, where it moves a target ──────────────────────
  # Severity High. `history.filter(d => d.date >= weekAgoKey)` with weekAgoKey = today − 7 spans
  # EIGHT keys, the identical defect to FL-001. It fed the "was I cutting" majority vote:
  #
  #     8 days → "cutting" needs 5 cut days  (5 > 4)
  #     7 days → "cutting" needs 4 cut days  (4 > 3.5)
  #
  # So a week with four CUT days and four others read as NOT cutting, which lifted the refusal and
  # allowed the estimate — and the target — to come down. Unlike FL-001 this one was already
  # testable, because runCalibration is mirrored in logic.test.js.

  Scenario: the intake window is seven complete days, ending yesterday
    Then it holds seven keys, not eight
    And today is not one of them

  Scenario: the window honours a simulated date
    Given the harness has set a simulated day
    Then calibration measures against that day, not the real calendar
    # A raw `new Date()` here meant a seeded test day calibrated against real today, so no test
    # could reach this window's edges. This is one of two reasons the date boundary was previously
    # untestable; the other is that the History cutoffs ignored the same offset, which made a
    # dayOffset-driven test pass vacuously.

  # ── FL-014 · a part-finished today in the intake average ──────────────────
  # Severity High. `recentHist` took every day with kcal above zero, today included. A partial day
  # dragged the measured intake down and more than doubled the apparent estimate error, in the
  # lowering direction:
  #
  #     complete days only : avgKcal 2,510 → avgDeficit 199 → expected −0.181 kg → errKcal −199
  #     with 400 kcal today: avgKcal 2,246 → avgDeficit 463 → expected −0.421 kg → errKcal −463
  #
  # Mitigated by timing — a fasted morning weigh-in has kcal 0 — but `correctionHeld` evaluates on
  # render, so the mid-day path does run, and the refusal lifts on a break.

  Scenario: today's partial intake is not averaged into the evidence
    Given I have logged 400 kcal so far today
    Then calibration's intake average is unchanged by it

  # ── Q3 · what "was I cutting" is measured from ────────────────────────────
  # Founder decision, 2026-09-13. The signal was a majority vote over each day's DECLARED mode.
  # Two things are wrong with that, and the second is the one that made it urgent:
  #
  #   1. The prose above the refusal already stated the real test — the innocent explanations apply
  #      "while eating below maintenance", and clean evidence is "eating AT or ABOVE maintenance
  #      and still not losing". That is avgDeficit, not a label.
  #   2. A label is editable. `features/history/02` makes a past day's mode correctable, so a
  #      CUT→MAINTAIN edit inside the window could tip the majority, lift the refusal, and let a
  #      lowering through at the NEXT weigh-in — written to tdee_adj and adjLog, fired later rather
  #      than at the tap, and NOT undone by putting the mode back. Raising is never damped, so it
  #      could eventually be re-earned, but it would have to be.
  #
  # The daily mode still grades every day and still colours the ring. Only the gate changes.

  Scenario: eating below maintenance protects the target, whatever the day was called
    Given a week eating 1,800 against a 2,400 estimate, and a scale that has not moved
    When the day labels say CUT, or MAINTAIN, or BULK
    Then the lowering is refused in every case
    And the refusal is reported, so nothing is hidden

  Scenario: eating at or above maintenance lets the correction run
    Given a week eating 2,400 against a 2,400 estimate, and a scale that has not moved
    Then the estimate is lowered
    # There the evidence is clean: the deficit is not there to explain the stall away.

  Scenario: relabelling a past day cannot move the calorie target
    Given a week of logged deficits
    When I correct one of those days from CUT to MAINTAIN
    Then the refusal, and the adjustment, are both exactly as they were

  Scenario: the deferred correction is not discarded, only postponed
    Given a lowering refused during a deficit
    When intake returns to maintenance
    Then the correction runs
    And its size is recomputed from the new evidence rather than replayed
    # The expected weight change depends on the intake, so replaying the old figure would be
    # answering a question nobody asked any more. A break is a period of eating at maintenance,
    # which is where this refusal lifts and the loop converges normally.

  Scenario: good news is never damped
    Given I am losing faster than predicted
    Then the estimate is raised regardless of how the days were labelled
    # Unchanged from file 04. Guessing high costs some progress; guessing low walks a dieter
    # toward under-eating 25 kcal at a time while telling them it is correct.

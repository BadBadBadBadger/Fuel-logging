# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-model workstream, file 7.
# Companion to ENERGY_MODEL.md Step 3 (smooth earn-to-eat).
#
# WHY: today a logged workout's full kcal is added to the SAME day's calorie
# target (`totalWorkoutKcal` in calcTargets, app.jsx). That is classic "earn to
# eat", and it has three faults the user named:
#   • it invites eating back the whole session same-day, which erodes the deficit
#     the user is trying to run (recomp / fat-loss goal);
#   • one day is a noisy signal — a single big session spikes the ceiling;
#   • a REST day after hard training carries zero fuel, even though recovery,
#     glycogen resynthesis and elevated protein synthesis run 24–48h past a session.
# So instead of unlocking a session's energy all on its own day, we SPREAD it
# forward across a few days as a smoothed curve. The daily earn-to-eat bonus
# becomes a weighted average of RECENT training load, not just today.
#
# HATS IN THE ROOM (design decisions this spec encodes):
#   • COACH (maths + safeguarding): the smoothing is ENERGY-CONSERVING — the
#     weights sum to 1, so over the window a user is credited the same total
#     training energy, only un-spiked. We do NOT invent or destroy calories; we
#     re-time them. Front-loaded (today weighs most) so it still feels responsive,
#     but today's own session is DAMPED (never a full same-day unlock), which is
#     the whole point. Never frames food as a reward for exercise.
#   • DESIGN: the workout card must stop implying the whole session is "added"
#     today. Copy reflects that a session fuels today AND the next couple of days;
#     the number applied to TODAY's allowance is the smoothed bonus. No new taps,
#     no gate on logging a workout.
#   • QA: this file owns the user-visible behaviour ONLY. The exact weighted-sum
#     arithmetic and the rounding are owned by __tests__/logic.test.js. Scenarios
#     assert observable outcomes (target moves up/down, rest-day still fuels),
#     using DERIVED worked examples, never re-asserting the raw constants.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   POLICY CONSTANTS (the only literals; owned by logic.test.js):
#       SMOOTH_WINDOW_DAYS = 3        (today + the two prior days)
#       SMOOTH_WEIGHTS     = [0.50, 0.30, 0.20]   for offsets [today, −1d, −2d]
#                            Σ = 1.00  → energy-conserving (a session's kcal is
#                            spread, not multiplied).
#   DERIVED for a single 600 kcal session (illustration only; exact math in tests):
#       logged today, nothing prior ....... today's bonus = 0.50 × 600 = 300
#       logged yesterday, rest today ...... today's bonus = 0.30 × 600 = 180
#       logged 2 days ago only ............ today's bonus = 0.20 × 600 = 120
#       logged 3+ days ago only ........... today's bonus = 0   (outside window)
#       600 yesterday + 600 today ......... today's bonus = 0.50×600 + 0.30×600 = 480
#   Scenarios assert the DIRECTION and RELATIVE size of the bonus (and the copy),
#   never the internal kcal arithmetic.
# ─────────────────────────────────────────────────────────────

@draft
Feature: Spreading earned workout calories across days

  A logged workout no longer unlocks its full energy on the same day. Its calories
  are spread forward as a smoothed curve, so the day's target reflects recent
  training load rather than one noisy session — the deficit is protected, a rest
  day after hard training still carries fuel, and back-to-back days don't double up.

  Background:
    Given I have completed my profile so I have an activity-seeded target
    And my earn-to-eat bonus is the smoothed recent-training allowance

  # ── The core fix: a session is damped on its own day ──
  Scenario: A big session no longer unlocks its full energy today
    Given I have logged no workouts in the last few days
    When I log a workout that burned an estimated 600 kcal today
    Then my calorie target rises by only part of that session today, not the full 600
    And the rest of the session's energy carries forward to the next couple of days

  # ── A rest day after training still carries fuel ──
  Scenario: The day after a hard session still gets some earned fuel
    Given I logged a workout that burned an estimated 600 kcal yesterday
    And I have not logged a workout today
    When I view my daily target
    Then my target still includes some earned fuel from yesterday's session
    And it is smaller than the bonus I saw on the training day itself

  # ── Fuel tapers, then returns to baseline outside the window ──
  Scenario Outline: Earned fuel from one session decays over the following days
    Given a single workout burning an estimated 600 kcal was logged "<when>"
    And no other workouts are in the window
    When I view my daily target
    Then today's earned bonus is "<bonus>"

    # SMOOTH_WEIGHTS = [0.50, 0.30, 0.20]; outside the 3-day window it is gone.
    Examples:
      | when            | bonus                          |
      | today           | the largest share of the session |
      | yesterday       | a smaller share than the training day |
      | two days ago    | the smallest share still in the window |
      | three days ago  | no earned bonus                |

  # ── Back-to-back training does not double-spike ──
  Scenario: Consecutive training days are averaged, not stacked
    Given I logged a workout burning an estimated 600 kcal yesterday
    And I log another workout burning an estimated 600 kcal today
    When I view my daily target
    Then today's earned bonus is well below the sum of both sessions
    And it is larger than the bonus from a single one of them alone

  # ── Steady training settles into a stable daily allowance ──
  Scenario: A consistent training routine gives a steady daily bonus
    Given I have trained a similar amount on each of the last several days
    When I view my daily target on any of those days
    Then the earned bonus is roughly the same each day
    And it does not lurch up and down with each individual session

  # ── No training → no change from baseline ──
  Scenario: Someone who never logs workouts is unaffected
    Given I have never logged a workout
    When I view my daily target
    Then it is exactly my activity-seeded target with no earned bonus
    And nothing about earn-to-eat is shown to me

  # ── Copy: the workout card tells the truth about the spread ──
  Scenario: The workout card reflects spreading, not a same-day unlock
    Given I log a workout today
    Then the card does not claim the full session is "added" to today alone
    And it communicates that the session fuels today and the next couple of days
    And logging the workout never adds an extra tap or gates my food logging

  # ── Interaction with the safety floors is unchanged in shape ──
  Scenario: Smoothed earned calories still sit on top of the seeded/calibrated TDEE
    Given my maintenance target is held at its sedentary minimum
    When I log a workout today
    Then the smoothed earned bonus is added on top of that target as before
    And the earn-to-eat smoothing does not change the maintenance floor itself

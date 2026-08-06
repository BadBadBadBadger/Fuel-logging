# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 4 of 5.
#
# WHY: This is the exact mechanism that hurt the founder. runCalibration
# (app.jsx:356) reads "weight went UP while eating at a deficit" as "your
# TDEE must be lower" and drives tdeeAdj negative, capped at −600
# (app.jsx:4426), with no BMR floor — so maintenance rendered at ~1650 kcal,
# BELOW an 1859 BMR. The model cannot tell muscle gain / water / glycogen /
# scale noise from a genuinely lower metabolism, so for a stalling dieter it
# prescribes EAT LESS — the textbook wrong answer.
#
# EVIDENCE (coach hat):
#   • Weight can rise transiently during a genuine deficit via water
#     retention (cortisol from under-eating/stress), glycogen swings, and
#     lean-mass gain during recomposition — none of which mean a lower TDEE.
#   • The correct response to a stall + symptoms is a DIET BREAK / raise to
#     maintenance, not a deeper deficit (Trexler 2014; MATADOR 2018).
#
# FIXES SPECIFIED HERE:
#   (a) Maintenance floor = SEDENTARY TDEE (BMR × 1.2), NOT raw BMR. Nobody
#       lives at BMR, so a maintenance figure at raw BMR is itself unusable —
#       the parked targets-bmr-floor-wip work undershot by flooring at BMR.
#   (b) Asymmetric calibration: unexpected GAIN during a deficit must NOT
#       ratchet the target down; it flags for investigation / a break.
#   (c) The accumulated tdeeAdj can never, by itself, push maintenance below
#       sedentary TDEE. The ENERGY-AVAILABILITY floor (file 01) is the hard
#       floor for EVERY mode; raw BMR is only a label for the rare lean case.
# Intentional CUT deficits can sit below sedentary TDEE (a cut is a choice),
# bounded by the energy-availability floor in file 01; what is forbidden is
# MAINTENANCE below BMR × 1.2 and the auto-ratchet driving it there.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Any maintenance /
#   TDEE kcal value is an OUTPUT for that example body:
#       FFM = weight × (1 − bodyFat/100) · BMR = 370 + 21.6 × FFM · TDEE = BMR × 1.2
#   Implement the formulas; exact arithmetic is owned by __tests__/logic.test.js.
#   Scenario Outlines use CONTRASTING bodies so the floor value changes — proof
#   it is computed, not baked in.
#   POLICY CONSTANTS (the only literals; owned by logic.test.js):
#       ADJ_CAP = −600 kcal (accumulated adaptive adjustment limit)
#       ACTIVITY_MULT = 1.2 · EA_HARD = 30 kcal/kg FFM (see file 01)
# ─────────────────────────────────────────────────────────────

Feature: Adaptive TDEE cannot starve a stalling dieter

  Scenario Outline: Adaptive adjustment can never pull maintenance below its floor
    Given I am in "Maintain" mode
    And my sedentary-maintenance floor (BMR × 1.2) works out to <floor> kcal
    And a full negative adjustment would otherwise put maintenance at <raw> kcal
    When the app calculates my maintenance target
    Then my maintenance target is <floor> kcal, not <raw> kcal
    And I see a note "Held at your minimum maintenance"

    # Different bodies → different floors, so no single value can be baked in.
    Examples:
      | floor | raw   |
      | 2,231 | 1,631 |
      | 1,680 | 1,200 |

  Scenario: The adaptive adjustment itself is capped, and the floor still wins
    Given the weekly calibration keeps signalling a lower TDEE for many weeks
    When the adjustment accumulates
    Then it never grows more negative than ADJ_CAP (−600 kcal)
    And even at the cap my maintenance is still held at its sedentary-TDEE floor

  Scenario: Gaining weight during a deficit does NOT trigger a downward cut
    Given I have eaten at a calorie deficit for the past 2 weeks
    And my 7-day average weight has risen
    When the weekly calibration runs
    Then the app does not lower my calorie target
    And I see a card "Unexpected gain while eating less than maintenance"
    And the card explains "This is usually water, glycogen or muscle — not a slower metabolism"
    And the card offers "Hold steady" and "Take a diet break" as the two actions

  Scenario: A confirmed genuine plateau raises, not lowers, the recommendation
    Given I have eaten at a deficit for 3 weeks
    And my 7-day average weight has not fallen
    And I have taken no diet break in the current block
    When the app advises me
    Then the app recommends a diet break as the first option
    And my calorie target is unchanged from before the calibration ran

  Scenario: A deliberate cut is floored by energy availability, not by BMR
    Given I have deliberately selected "Cut" mode
    When the app calculates today's cut target
    Then the target is never below my energy-availability floor (EA_HARD × my fat-free mass)
    And no separate BMR floor is applied to a cut, because a cut is a deliberate deficit
    And my maintenance floor of BMR × 1.2 does not apply while I am cutting

  Scenario: A lean user whose cut target sits below BMR sees an honest note
    Given my fat-free mass is small enough that my energy-availability floor is below my BMR
    And today's cut target lands below my BMR but at or above the energy-availability floor
    When the app shows the target
    Then the cut target is allowed
    And I see an amber note "This is below your resting metabolism — fine short-term, not a long-term level"

  Scenario: Muscle gain during recomposition is not misread as a lower metabolism
    Given my logged strength workouts have increased over the past month
    And my weight has crept up while my measurements suggest recomposition
    When the calibration runs
    Then my TDEE estimate is unchanged by the weight rise
    And the app prompts me to update my body-fat % so targets track lean-mass change

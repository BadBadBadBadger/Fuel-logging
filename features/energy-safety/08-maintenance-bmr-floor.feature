# ─────────────────────────────────────────────────────────────
# BUILT 2026-08-06 (app.jsx calcTargets, sw v56; unit-tested in
# __tests__/logic.test.js — "calcTargets — maintenance BMR×1.2 floor").
# This is the first piece of the energy-safety workstream to ship. The
# adaptive-TDEE auto-lowering could previously drive a MAINTAIN target below
# resting metabolism (the founder's harm report: ~1,650 shown against an
# ~1,859 BMR). Maintenance is now floored at sedentary TDEE (BMR × 1.2).
#
# NUMBERS CONTRACT: every kcal shown against a body is DERIVED, never
# hardcoded — FFM = weight×(1−bodyFat/100); BMR = 370 + 21.6×FFM;
# sedentary TDEE = BMR × 1.2. Contrasting rows prove the floor is computed.
# Exact arithmetic is owned by __tests__/logic.test.js.
# ─────────────────────────────────────────────────────────────
Feature: Maintenance is never floored below sedentary TDEE (BMR × 1.2)

  Background:
    Given my profile weight is 98.5 kg and my body-fat is 30 percent
    And my fat-free mass therefore works out to about 69 kg
    And my sedentary maintenance (BMR × 1.2) therefore works out to about 2,231 kcal

  Scenario: A large negative adaptive adjustment cannot push maintenance below sedentary TDEE
    Given I am in "Maintain" mode
    And the accumulated adaptive adjustment is a full −600 kcal
    When the app calculates my maintenance target
    Then my maintenance target is held at my sedentary TDEE, not the lower adjusted figure
    And I see a note "Held at your minimum maintenance"

  Scenario: A positive adaptive adjustment still raises maintenance normally
    Given I am in "Maintain" mode
    And the accumulated adaptive adjustment is +200 kcal
    When the app calculates my maintenance target
    Then my maintenance target is my sedentary TDEE plus the adjustment
    And no "Held at your minimum maintenance" note is shown

  Scenario Outline: The floor is a formula output — a different body gives a different floor
    Given my sedentary maintenance (BMR × 1.2) works out to <floor> kcal
    And a full negative adjustment would otherwise put maintenance at <raw> kcal
    When the app calculates my maintenance target in "Maintain" mode
    Then my maintenance target is <floor> kcal, not <raw> kcal

    # <raw> = <floor> − 600 (the accumulated-adjustment cap); contrasting bodies
    # prove no single number is baked in.
    Examples:
      | floor | raw   |
      | 2,231 | 1,631 |
      | 1,680 | 1,080 |

  Scenario: A deliberate cut is still allowed below sedentary TDEE
    Given I have deliberately selected "Cut" mode
    When the app calculates my cut target
    Then the maintenance floor of BMR × 1.2 does NOT apply, because a cut is a chosen deficit
    And the target is instead bounded by the steady-loss floor (features/energy-safety/01)
    And it is still backstopped beneath that by the flat safe minimum for my sex

  Scenario: The displayed effective TDEE is floored to match the target
    Given I am in "Maintain" mode with a negative adaptive adjustment
    When I view my effective TDEE on the profile or weigh-in widget
    Then the shown effective TDEE is not below my sedentary TDEE
    And it agrees with my maintenance calorie target

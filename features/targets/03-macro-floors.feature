# ── Macro target engine — steady protein floor, protected fat floor (DOCS.md §23 #7).
# Consumes the coach-hat decisions (2026-06-11):
#   • protein = a flat g/kg-LEAN-MASS floor held across ALL modes (male 2.2 / female 2.0)
#     so it stops fluctuating on a cut/maintain/bulk switch (the "eggy farts" bug);
#   • fat stays mode-varying but never below a 0.6 g/kg-BODYWEIGHT hormonal floor;
#   • carbs absorb the entire deficit/surplus;
#   • if a target is too low to fit both floors + minimum carbs, WARN — never silently
#     break a floor.
# Replaces per-mode protein variation in calcTargets (app.jsx:142) AND the proportional
# scaling in the custom-target path (app.jsx:3517) with ONE unified floor-based engine.
# EXACT NUMBERS (the 2.2/2.0 coefficients, the 0.6 floor, the carb formula, the warning
# threshold) are owned by __tests__/logic.test.js — these scenarios assert the
# user-visible BEHAVIOUR only, so they survive a coefficient tweak.
# Built + verified on device 2026-06-12 (low custom target → "FLOORS KEPT" warning shown).
Feature: Macro targets hold their floors instead of scaling

  Background:
    Given my profile has weight, height, sex and body fat % set

  Scenario: Protein does not fluctuate when I switch mode
    Given I am viewing my protein target in maintain mode
    When I switch to cut and then to bulk
    Then my protein target is the same in every mode
    And I am never asked to eat more protein just for changing mode

  Scenario: The protein floor still differs by sex
    Given a man and a woman with the same lean body mass
    Then the man's protein floor is higher than the woman's
    # exact g/kg-LBM coefficients (male 2.2 / female 2.0) are asserted in logic.test.js

  Scenario: Fat is never scaled below its hormonal floor on an aggressive cut
    Given my cut target sets fat at its normal mode value
    When I type a custom calorie target well below my cut target
    Then my fat target is not dragged below the 0.6 g/kg-bodyweight floor
    # the original bug: proportional scaling at app.jsx:3517 pulled fat under the floor

  Scenario: Carbs absorb a change in calorie target
    Given my protein and fat targets are at their floors
    When I raise or lower my calorie target
    Then protein and fat hold at their floors
    And carbs move to absorb the whole difference

  Scenario: Fat stays mode-varying above the floor
    Given I am in cut mode
    When I switch to bulk
    Then my fat target rises, because there are more calories to spare on a bulk
    But it never drops below the 0.6 g/kg floor in any mode

  Scenario: Preset and custom targets obey the same floors
    Given I reach the same calorie number once via a preset and once by typing it
    Then the protein and fat floors apply identically in both cases

  Scenario: A target too low to fit the floors warns instead of breaking one
    Given a calorie target too low to fit the protein floor, fat floor and minimum carbs
    When the targets are calculated
    Then no floor is silently broken
    And a warning explains the target is too low to hit my protein and fat floors
    # DRAFT copy — confirm wording against the SAFE_MIN banner voice:
    # "This target's too low to hit your protein and fat floors. We've kept your floors,
    #  so your macros add up to a bit more than this number."

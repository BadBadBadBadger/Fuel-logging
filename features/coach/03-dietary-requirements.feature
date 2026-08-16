# ── Dietary requirements + allergies (DOCS.md §23 #8). Decisions (2026-06-11):
#   • Input = hybrid tag/combobox in the profile/config screen: a free-text field that
#     surfaces selectable suggestions (diet type + the regulated 'Big 14' allergens) and
#     also lets the user commit a CUSTOM tag the app didn't suggest.
#   • These feed EVERY AI food prompt (AI Log parse, AI re-estimate, Quick Add #2
#     estimate, and the daily coach).
#   • Allergens = HARD filter, enforced two ways (coach-hat call): (1) injected into the
#     prompt as the primary filter, AND (2) a zero-token client-side scan of the AI's
#     OUTPUT that hides/flags any suggestion naming a declared allergen — pre-set or
#     custom. The scan reads text already returned, so it costs no extra tokens/calls.
#   • Diet type = hard filter (never suggest off-diet food). Dislikes = SOFT preference
#     (avoid when possible; not a safety claim).
# Allergen backstop scan + prompt-building are pure logic → covered in logic.test.js.
# Built + verified on device 2026-06-12 (declared dairy allergen → milk log flagged ⚠️).
Feature: Dietary requirements and allergies steer every AI suggestion

  Background:
    Given I am on the profile / config screen

  Scenario: Entering dietary needs as tags with suggestions
    When I type in the dietary field
    Then it surfaces selectable suggestions for diet type and the common allergens
    And I can pick a suggestion or commit my own custom tag
    And my diet type, allergens and dislikes persist after a reload

  # Shipped v6.3, device-verified 2026-06-12 (resolveTag, logic.test.js).
  # SAFETY: typing the singular must resolve to the canonical preset, or the allergen
  # synonym expansion (tree nuts → almond, walnut, cashew…) used by the output scan is
  # silently lost, weakening the hard allergy filter.
  Scenario: Typing an allergen and pressing Enter selects the matching preset
    Given I am entering allergies
    When I type "tree nut" and press Enter
    Then the committed tag is the preset "tree nuts", not a custom "tree nut"
    And it carries the full synonym expansion used by the output scan

  Scenario: An exact typed match commits as the canonical preset
    When I type "milk" and press Enter
    Then the committed tag is the preset "milk"
    And no near-duplicate custom tag is created

  Scenario: Ambiguous typed text is left as a custom tag
    When I type text that matches more than one allergen suggestion
    And I press Enter
    Then it is committed exactly as I typed it

  Scenario: Diet type is a hard filter on AI suggestions
    Given I have set my diet type to vegan
    When any AI feature suggests a food
    Then it never suggests meat, fish, dairy or eggs

  Scenario: Dislikes are a soft preference, not a hard filter
    Given I have listed coriander as a dislike
    When the coach suggests food
    Then it avoids coriander where it reasonably can
    But an occasional appearance is a preference miss, not a safety failure

  Scenario: A declared allergen is never surfaced — primary filter
    Given I have declared a peanut allergy
    When any AI feature generates food suggestions
    Then the declared allergens are included in the prompt as a hard exclusion
    And no suggestion contains a declared allergen

  Scenario: The output backstop catches an allergen the model slips through
    Given I have declared a peanut allergy
    And the AI response names a food containing peanuts despite the prompt
    Then a client-side scan detects the declared allergen in the output
    And that suggestion is hidden or flagged before I ever see it
    And the scan uses no extra API call or tokens

  Scenario: Custom allergen tags are filtered too, not just the presets
    Given I have added a custom allergen tag "celeriac" that the app did not suggest
    When any AI feature generates food suggestions
    Then "celeriac" is excluded by the prompt and caught by the output scan
    And it is treated exactly like a pre-set allergen

  Scenario Outline: The allergen filter applies on every AI food surface
    Given I have a declared allergen
    When the "<surface>" produces or estimates food
    Then the declared allergen is never surfaced to me
    Examples:
      | surface                       |
      | daily coach suggestion        |
      | AI Meal Log item breakdown    |
      | AI re-estimate from name      |
      | Quick Add AI estimate         |

  Scenario: No dietary config means no constraints (no regression)
    Given I have set no diet type, allergens or dislikes
    When any AI feature suggests food
    Then it behaves exactly as it does today
    And no empty exclusions are injected into the prompt

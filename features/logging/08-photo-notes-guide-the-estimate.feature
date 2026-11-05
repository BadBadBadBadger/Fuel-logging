# ============================================================================
# BUILT 2026-11-05 (sw v104), on the founder's ask: "when you ANALYSE PHOTO, whatever text is
# entered into the box can be used as supplemental guidance for the AI to create a more
# realistic macro split."
#
# BEFORE. Text typed alongside a photo was sent, but as one line — "the user added this
# context … use it to disambiguate". In practice the model treated it as a tie-breaker: a typed
# "200g chicken" did not override its visual guess, typed oil did not add fat it could not see,
# and "ate half" was ignored. The text prompt's rules from logging/07 (dry = no fat, a weight is
# the portion, a typed number is a fact) were never given to the photo prompt at all.
#
# THE DECISION:
#   • Anything typed with a photo is the user's NOTES and is guidance for the estimate. Where the
#     notes and the photo disagree, the notes win; the photo covers what the notes do not.
#   • The photo prompt gains the logging/07 rules, phrased for notes: a weight/count IS the
#     portion (scale every macro); a named brand/restaurant uses its real nutrition; stated
#     cooking method sets the fat (dry → none; fried/oil/butter → there even if not visible);
#     ingredients the camera cannot see are their own component; a stated version is the one
#     estimated; "ate half" estimates what was eaten; a typed number is a fact, never a row.
#   • Confidence rises for what the notes pin down, and a follow-up the notes already answer is
#     not asked. The kcal ≈ 4P + 4C + 9F check now applies to photo estimates too.
#   • The model names the meal from packaging OR the notes. The entry name rule is unchanged:
#     logging/05 — the model's short name wins; the notes are a hint, not the name.
#   • UI: with a photo attached, the box's placeholder and a one-line hint say the notes guide
#     the estimate. Nothing else about the screen changes; the notes stay optional.
#
# Jest: __tests__/ai-log.test.js lifts the real AI_PHOTO_PROMPT and runs it, with and without
# notes. Playwright: e2e/photo-meal-name.spec.js checks the notes reach the worker with the image.
# The model's answers themselves are not testable from here (see logging/07's header).
# ============================================================================

@photo @ai-capture
Feature: Text typed with a photo guides the photo estimate
  As someone photographing a meal
  I want what I type alongside the photo to shape the estimate
  So that the macros reflect what I know and the camera can't see

  Background:
    Given I am on the AI logging screen with a photo of my meal attached

  Scenario: The box says what the notes are for
    Then the text box invites optional notes to sharpen the estimate
    And a hint says my notes guide the estimate and win where the photo can't tell

  Scenario Outline: My notes override what the photo suggests
    When I type "<notes>" and tap ANALYSE PHOTO
    Then the estimate uses <effect>

    Examples:
      | notes                                | effect                                          |
      | 200g chicken breast                  | 200 g as the chicken's portion, every macro scaled |
      | cooked in 1 tbsp olive oil           | the oil's fat, though it isn't visible          |
      | air-fried, no oil                    | no added cooking fat                            |
      | from Pret                            | Pret's actual nutrition for the item            |
      | there's peanut sauce under the rice  | the sauce as its own item                       |
      | vegan sausages                       | the vegan version                               |
      | only ate half the chips              | half the chips — what was eaten                 |

  Scenario: A question my notes already answer is not asked
    Given I typed "grilled, no oil, about 150g" with the photo
    Then I am not asked about cooking fat or portion for that item

  Scenario: A number I typed is a fact, not an extra row
    Given I typed "the yogurt is 120 kcal" with the photo
    Then the yogurt is estimated at 120 kcal
    And no separate 120 kcal item appears

  Scenario: With no notes, the photo is estimated on its own
    Given I typed nothing with the photo
    Then the estimate is made from the photo alone, as before

  Scenario: The notes reach the model with the image and nothing else changes
    When I type notes and tap ANALYSE PHOTO
    Then the request carries the image and my notes, labelled as guidance
    And the photo is still never stored, and the entry is still named per logging/05

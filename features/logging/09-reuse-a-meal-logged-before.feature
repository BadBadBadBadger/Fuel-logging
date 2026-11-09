# ============================================================================
# BUILT 2026-11-09 (sw v105), on the founder's ask: "when logging AI food, the AI should look at
# the user's past eaten meals and check whether the same has been logged before — i.e. save on
# spending tokens when the user has had something before."
#
# BEFORE. Every ANALYSE MEAL was a model call, even for the breakfast logged every morning. Each
# call costs tokens, takes a few seconds, and can come back a little different from last time.
#
# THE DECISION:
#   • Before the model is asked, the typed text is looked up in the user's own log: today's
#     entries and every day in history. A match is the WHOLE typed line, with case, punctuation
#     and spacing ignored ("2 Poached Eggs, on sourdough" = "2 poached eggs on sourdough").
#   • No fuzzy matching. "3 eggs on toast" is not "2 eggs on toast", "poached eggs" is not
#     "poached eggs on sourdough", and "1.5 bagels" is not "15 bagels". A wrong match would log
#     wrong numbers with no warning; a missed match only costs one model call.
#   • The most recent matching entry wins. Its stored elements become the rows, with their
#     confidences. If the entry was edited after logging (its totals no longer add up from its
#     elements), the edited totals are reused as one row, so a correction is what gets reused.
#   • No model call, no follow-up questions. The earlier entry's follow-up answers are kept on
#     the new record.
#   • The screen says so: a "LOGGED BEFORE" card with the date, and a "Re-estimate with AI"
#     button that asks the model anyway.
#   • Typed text only. A photo can't be matched against text, so a photo is always estimated.
#     A stated totals line (logging/06) is still handled first: it never needs the model either.
#
# Jest: __tests__/ai-log.test.js lifts mealKey and findPastMeal from app.jsx and runs them.
# Playwright: e2e/past-meal-reuse.spec.js counts worker calls.
# ============================================================================

@ai-capture
Feature: A meal logged before is reused, not re-estimated
  As someone who eats the same meals often
  I want the app to reuse what I logged last time
  So that it is instant, consistent, and doesn't spend AI credits

  Background:
    Given I am signed in to Premium and on the AI logging screen
    And I logged "2 poached eggs on sourdough" on 1 Nov as 373 kcal in two items

  Scenario: The same meal is answered from my log, and the AI is not asked
    When I type "2 Poached Eggs, on sourdough" and tap ANALYSE MEAL
    Then I see the same two items with the same numbers at once
    And a "LOGGED BEFORE" card says I logged this on 1 Nov
    And no AI request is made
    And no follow-up questions are asked

  Scenario: Logging a reused meal records the same numbers
    When I type "2 poached eggs on sourdough", tap ANALYSE MEAL, then LOG ALL AS ONE ENTRY
    Then today's log has one 373 kcal entry with the same two elements

  Scenario: I can ask the AI anyway
    Given the "LOGGED BEFORE" card is showing
    When I tap "Re-estimate with AI"
    Then the AI is asked and its estimate replaces the reused one
    And the "LOGGED BEFORE" card goes away

  Scenario Outline: Only the same meal counts
    When I type "<typed>" and tap ANALYSE MEAL
    Then the AI is asked

    Examples:
      | typed                         |
      | 3 poached eggs on sourdough   |
      | poached eggs                  |

  Scenario: The most recent log wins
    Given I also logged "2 poached eggs on sourdough" on 3 Nov as 410 kcal
    When I type "2 poached eggs on sourdough" and tap ANALYSE MEAL
    Then the 410 kcal version from 3 Nov is shown

  Scenario: An entry I corrected is reused as corrected
    Given I edited the 1 Nov entry to 450 kcal after logging it
    When I type "2 poached eggs on sourdough" and tap ANALYSE MEAL
    Then one row of 450 kcal is shown, not the original two items

  Scenario: A photo is always estimated
    Given I attach a photo and type "2 poached eggs on sourdough" as notes
    When I tap ANALYSE PHOTO
    Then the AI is asked

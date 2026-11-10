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
# v106 (2026-11-10), the founder's screenshot: "Half size portion of chicken fajita pasta bake",
# a dish logged almost weekly for six months, went to the model and came back 420 kcal at 42% from
# a generic recipe. v105 only matched the identical line, so it never saw the history. Now:
#   • Lines are compared on their FOOD words, in order. Filler ("size", "portion", "of", "bowl",
#     "homemade", "leftovers"…) and plurals don't count.
#   • Portion words are a multiplier: half / ½ / 1/2, quarter, third, double, twice, triple.
#     "Half size portion of X" is ½ × the user's latest X. Rows are named "½ × …".
#   • Size words (large, small, big, medium…) must be the same on both sides. "Large" has no
#     honest number, so a size the user hasn't logged before goes to the model.
#   • Order of preference: the identical line, then the same food at the same portion, then the
#     same food scaled. Newest wins within each. The card says how many times it was logged.
#   • Saved Quick Add meals count as meals logged before.
#   • No match: up to 3 past meals sharing at least half the typed food words are listed in the
#     text prompt as the user's usual recipe and portion, so the model builds on them.
#
# v107 (2026-11-10), founder: "scan both the Quick Add and fall back on past logged items even if
# they are not Quick Added." Quick Add is checked FIRST and a match there always wins (the user's
# own curated numbers); only without one does it fall back on the log. The log is the whole
# account history: the startup cloud pull pages through every food_logs row, so nothing needs a
# server lookup at estimate time. Note: on a fresh device the one-time reviveMeals recovery
# rebuilds Quick Add from the log, so on such a device most past meals are also Quick Add rows.
#
# Jest: __tests__/ai-log.test.js lifts mealKey, mealParts, findPastMeal and similarPastMeals from app.jsx and runs them.
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

  # ── v106: the same meal in other words ────────────────────────────────────

  Scenario: A portion word scales my usual
    Given I logged "Chicken fajita pasta bake" on 3 Nov as 720 kcal (P 52 C 70 F 22)
    When I type "Half size portion of chicken fajita pasta bake" and tap ANALYSE MEAL
    Then I see one row "½ × Chicken fajita pasta bake" of 360 kcal (P 26 C 35 F 11) at once
    And the card says "Half of your “Chicken fajita pasta bake”, logged on 3 Nov"
    And no AI request is made

  Scenario: A size I haven't logged goes to the AI
    Given I logged "Chicken fajita pasta bake" before
    When I type "Large chicken fajita pasta bake" and tap ANALYSE MEAL
    Then the AI is asked

  Scenario: A meal with something extra goes to the AI, with my usual as reference
    Given I logged "Chicken fajita pasta bake" on 3 Nov as 720 kcal
    When I type "chicken fajita pasta bake with garlic bread" and tap ANALYSE MEAL
    Then the AI is asked
    And the request lists "Chicken fajita pasta bake": 720 kcal as my own past log

  Scenario: A saved Quick Add meal counts
    Given "Whey protein shake" is a Quick Add meal of 130 kcal
    When I type "whey protein shake" and tap ANALYSE MEAL
    Then it is reused from Quick Add and no AI request is made

  # ── v107: Quick Add first, then the log ───────────────────────────────────

  Scenario: Quick Add wins over a newer log of the same food
    Given "Chicken fajita pasta bake" is a Quick Add meal of 650 kcal
    And I logged "Chicken fajita pasta bake" on 3 Nov as 720 kcal
    When I type "Half size portion of chicken fajita pasta bake" and tap ANALYSE MEAL
    Then one row of 325 kcal is shown
    And the card says "Half of your Quick Add meal “Chicken fajita pasta bake”"

  Scenario: Without a Quick Add match, any past log is used, however old
    Given "Mum's lasagne" is not a Quick Add meal
    And I logged "Mum's lasagne" in May as 810 kcal
    When I type "mums lasagne" and tap ANALYSE MEAL
    Then the 810 kcal entry from May is reused and no AI request is made

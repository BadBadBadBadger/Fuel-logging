# ============================================================================
# BUILT 2026-09-15 (session 23), from features/logging/00-bug-report.md Bug 2. @wip until seen
# on the phone.
#
# THE BUG. The founder typed a description that ended in the meal's totals —
#   "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each)
#    — P: 9.2g C: 66.5g F: 25.8g 539 kcal"
# — and the AI, told to "break the meal into individual components", returned a row for the
# crumpets, a row for the butter, a row for the jam AND a row for the totals line. The screen
# sums every row it is given, so LOG ALL AS ONE ENTRY wrote 942 kcal (fat exactly doubled) and
# the dashboard said "Over by 448" on a day that was about 45 over. The founder's suspected
# cause — "the parser adds the components and the totals line together" — is right in effect:
# nothing in the app knew a stated total was a total.
#
# THE DECISION (founder's user story, 2026-09-15; engineering + coach hats on the shape):
#   • If the text carries a FULL totals line — all four of kcal, protein, carbs and fat — those
#     four numbers ARE the meal. The AI is not asked. The screen shows one row, at once, named
#     after the food, with exactly those numbers, at 100% confidence, with no follow-up
#     questions. LOG ALL AS ONE ENTRY logs exactly that.
#       Why not ask the AI anyway and discard its rows? The user has already done the work; a
#       model call adds a wait, a rate-limit charge and a failure mode (rate cap, no signal),
#       and can add nothing to numbers the user has just typed. [eng]
#       Why confidence 100? The intake-confidence % on the dashboard is kcal-weighted over the
#       day's entries. A meal whose numbers came from the person's own scales or recipe
#       calculator is the best data the app will ever hold — it must not drag that figure down
#       the way a guessed takeaway does. [coach]
#   • A PARTIAL statement (a kcal figure alone, or a macro or two) still goes to the AI, whose
#     prompt now tells it to honour any stated number as fact for the item it belongs to, and
#     never to make a separate row out of a number the user typed. The client does not try to
#     merge a partial statement with a model estimate — that is the guessing that caused this.
#   • The founder's nice-to-have — "if the AI's own estimate disagrees with my totals by more
#     than ~10%, tell me" — needs the model call this feature removes. Parked, not built.
#
# WHAT COUNTS AS A STATED TOTAL (the recogniser is small and explicit — these forms and no
# others, so that "150g chicken" or "Pret" can never trip it):
#   kcal      a number followed by kcal / kcals / cal / cals / calories,
#             or the word kcal / calories followed by a number         "539 kcal"  "kcal: 539"
#   protein   "P" WITH a colon or equals, or the word protein,
#             then a number (an optional g after it)                   "P: 9.2g"   "protein 9.2"
#   carbs     "C" with : or =, or carbs / carb / carbohydrates          "C: 66.5g"  "carbs 66.5g"
#   fat       "F" with : or =, or the word fat                          "F: 25.8g"  "fat 25.8"
#   Case does not matter. The single-letter forms REQUIRE the colon/equals; the word forms do
#   not. All four must be present for the line to count.
#   The row's NAME is the text BEFORE the first of the four figures — or, if the figures come
#   first, the text AFTER the last of them — trimmed of any dash, comma or colon at its edges.
#   If nothing is left (the user typed only numbers) the row is called "Meal".
#
# The recogniser and the name rule are pure functions, mirrored in __tests__/logic.test.js.
# The screen behaviour is in e2e/stated-totals.spec.js — with the worker route asserted to be
# NEVER called.
# ============================================================================
@wip
Feature: Totals typed by the user are the meal, not another row

  Background:
    Given I am signed in with AI logging available
    And I am on the AI MEAL LOG screen

  Scenario: A full totals line becomes one row, at once, without asking the AI
    Given I type "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each) — P: 9.2g C: 66.5g F: 25.8g 539 kcal"
    When I tap ANALYSE MEAL
    Then the AI is not called
    And one row is shown immediately, named "3 Warburtons crumpets, 30g butter total (10g each), 10.5g jam total (3.5g each)"
    And that row reads 539 kcal, P 9.2, C 66.5, F 25.8
    And its confidence reads 100%
    And no follow-up questions are shown

  Scenario: LOG ALL AS ONE ENTRY logs exactly the typed totals
    Given my text carries "P: 9.2g C: 66.5g F: 25.8g 539 kcal"
    And I have tapped ANALYSE MEAL
    When I tap LOG ALL AS ONE ENTRY
    Then today's log gains one entry with 539 kcal, P 9.2, C 66.5, F 25.8
    And today's consumed calories rise by 539, not 942

  Scenario: The word forms are recognised too
    Given I type "Chilli, 450 kcal, protein 38g, carbs 40g, fat 14g"
    When I tap ANALYSE MEAL
    Then one row named "Chilli" is shown with 450 kcal, P 38, C 40, F 14

  Scenario: The figures may come before the name
    Given I type "kcal: 210, F: 2g, C: 12g, P: 40g — protein shake"
    When I tap ANALYSE MEAL
    Then one row named "protein shake" is shown with 210 kcal, P 40, C 12, F 2

  Scenario: Single letters without a colon are not read as macros
    Given I type "protein shake  kcal 210 F 2g C 12g P 40g"
    When I tap ANALYSE MEAL
    Then the text is NOT treated as a totals line, because the single letters have no colon
    And the AI is asked as normal

  Scenario: Only numbers, no food name
    Given I type "P: 30g C: 10g F: 5g 205 kcal"
    When I tap ANALYSE MEAL
    Then one row named "Meal" is shown with those numbers

  Scenario: A calorie figure on its own is not a totals line
    Given I type "Pret chicken bacon sandwich, 480 kcal"
    When I tap ANALYSE MEAL
    Then the AI is asked as normal
    And the AI is told to treat 480 kcal as the sandwich's calories, not as a separate item

  Scenario: A weight is not a macro
    Given I type "150g chicken breast and 200g rice"
    When I tap ANALYSE MEAL
    Then the AI is asked as normal

  Scenario: Fibre or other extras do not block recognition
    Given I type "Overnight oats — P: 22g C: 58g F: 11g fibre 9g 410 kcal"
    When I tap ANALYSE MEAL
    Then one row named "Overnight oats" is shown with 410 kcal, P 22, C 58, F 11

  Scenario: The stated row is still editable
    Given a stated-totals row is shown
    When I tap the row's name and change it
    Then it is re-estimated by the AI like any other row
    # Editing the name is the one way to say "actually, estimate this for me".

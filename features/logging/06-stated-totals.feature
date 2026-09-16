# ============================================================================
# BUILT 2026-09-15 (session 23), from features/logging/00-bug-report.md Bug 2. VERIFIED on the
# phone the same day — the crumpets line, one row, 539 logged.
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
#
# ----------------------------------------------------------------------------
# AMENDED 2026-09-16 — a row that is the other rows added up (the last block of scenarios).
#
# ORDER OF EVENTS, recorded honestly: the code came first. A cloud session (commit a178e03,
# PR #2) built and tested `dropDuplicateTotalRow` the same morning the founder hit the bug, and
# wrote no scenario. The founder asked for one that afternoon; these were written against the
# shipped code and its tests, not before them. The house rule is spec first — this is the
# exception, on instruction, and it is named here so it is not mistaken for the norm.
#
# THE RECURRENCE. The day after 07's prompt rule ("a number the user typed is a fact about the
# item it belongs to, never a separate item") the founder typed six foods and then
#   "Lunch estimate ≈700 kcal / Protein ~71g / Carbs ~76g / Fat ~16g"
# and the AI returned SEVEN rows — the sixth real food and then a seventh whose kcal, protein,
# carbs and fat were exactly the first six added up. The TOTAL card read 1488 for a 744 kcal
# lunch, and LOG ALL AS ONE ENTRY would have written 1488. A prompt rule is a request; the
# model can and did ignore it.
#
# WHY THE RECOGNISER ABOVE DID NOT CATCH IT — checked against the real function, 2026-09-16:
# the line has all four figures, but "Protein ~71g" puts a tilde between the word and the
# number, and the word forms accept only an optional colon or equals there. The same line with
# the ~ and ≈ removed parses as a full totals line named "Lunch estimate". So this was a
# partial statement in this file's terms, went to the model, and the model broke 07's rule.
#   FOUNDER DECISION, 2026-09-16: ~ and ≈ are NOT accepted. A figure written as "roughly" is a
#   guess, not a stated fact, and the app ignores that line — the AI works out each food. Had
#   they been accepted, the lunch would have become ONE row at 700 kcal named "Lunch estimate" at
#   100% confidence, and the six foods would not have been rows at all; the 100% reasoning above
#   ("the person's own scales or recipe calculator") does not hold for a guessed figure. If he
#   wants his own numbers used, he types them plain: "700 kcal, protein 71g". Nothing to build.
#   (Asked and answered in screen terms — two mock-ups of the AI Log, he picked "leave it".)
#
# THE DECISION (cloud session, engineering; confirmed by the founder's instruction to spec it):
#   • After every model reply in the AI Log — typed text or photo — a row is dropped when its
#     kcal AND protein AND carbs AND fat EACH equal the sum of every other row. Arithmetic, not
#     the row's name: no real dish coincides with the rest of the meal on all four figures.
#       "Equal" allows for the model's rounding: within 5% of the sum, or within 1, whichever
#       is the wider margin. The other rows' calories must add to more than zero.
#   • It needs at least two other rows to compare against. A meal of one row (a stated-totals
#     row, or a single food) and a meal of two rows are never touched — a row can only be "the
#     others added up" when there are others to add.
#   • It runs only where the model's rows land as a set. The re-estimate of a single row (a
#     name edit here, the meal form, the entry editor) replaces one row and has nothing to sum
#     against, so it is not run there — by design, not omission.
#   • The prompt rule in 07 stays. The guard is what happens when the model ignores it.
#
# The function is lifted out of app.jsx by __tests__/ai-log.test.js (the reported lunch plus
# the edge cases below). The screen and the record are in e2e/duplicate-total-row.spec.js, whose
# worker stub returns the founder's exact seven-row reply.
# ============================================================================
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

  # ── 2026-09-16 · a row that is the other rows added up ────────────────────
  # Written after the code, on the founder's instruction — see the header.

  Scenario: A total written as "roughly" is a guess, not the meal
    Given I type six foods and then "Lunch estimate ≈700 kcal / Protein ~71g / Carbs ~76g / Fat ~16g"
    When I tap ANALYSE MEAL
    Then the AI is asked as normal, because the ≈ and ~ marks mean the figures are a guess
    And the six foods are the rows, with the AI's numbers for each
    And no row is made from the estimate line
    # Founder's decision, 2026-09-16. Plain numbers — "700 kcal, protein 71g" — are still the meal.

  Scenario: A row that is every other row added up is dropped before it is shown
    Given I type six foods and then "Lunch estimate ≈700 kcal / Protein ~71g / Carbs ~76g / Fat ~16g"
    And the ~ marks stop that line being read as a totals line, so the AI is asked
    When the AI returns seven rows, the seventh being the other six added up on all four figures
    Then six rows are shown and the seventh never appears
    And the TOTAL card is the six added up — 744, not 1488
    And LOG ALL AS ONE ENTRY writes 744

  Scenario: The added-up row is caught wherever the AI puts it
    Given the AI returns the added-up row first, or in the middle of the list
    Then it is still the one dropped, and the real foods all stay

  Scenario: All four figures must match — a coincidence on calories alone is a food
    Given the AI returns a row whose kcal equals the other rows' sum
    But whose protein, carbs or fat does not
    Then that row is kept
    # No real dish coincides with the rest of the meal on all four at once. One figure can.

  Scenario: The model's rounding does not save the duplicate
    Given the added-up row is within 5% of the sum on each figure, or within 1 of it
    Then it is still dropped

  Scenario: A meal of two rows is never touched
    Given the AI returns exactly two rows, even two of the same size
    Then both are kept
    # A row can only be "the others added up" when there are at least two others.

  Scenario: A single row is never touched
    Given the AI returns one row, or my text was a full totals line and no model was called
    Then that row is shown as it is
    # Nothing to add up against.

  Scenario: Six genuine foods with no coincidence all survive
    Given the AI returns six rows and none is the other five added up
    Then all six are shown

  Scenario: A photo's rows go through the same check
    Given I sent a photo and the AI returned rows for it
    When one of them is the others added up
    Then it is dropped the same way as for typed text

  Scenario: The prompt rule still stands — the guard is what happens when it is ignored
    Given the AI is still told that a number I typed is a fact about its item, never a row
    When it makes a row of it anyway
    Then the arithmetic check removes it
    And nothing in the app relies on the model having obeyed

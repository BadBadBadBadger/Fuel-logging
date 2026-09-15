# ============================================================================
# BUILT 2026-09-15 (session 23), from features/logging/00-bug-report.md Bug 1. VERIFIED on the
# phone the same day — the three inputs in the report, typed into the real app, came back right.
#
# THE BUG AS REPORTED. Dry, air-fried chicken breast came back with far too much fat (26 g on a
# medium breast; 10 g on 150 g), the words "dry" and "zero added fat" changed nothing, and 150 g
# did not scale from 250 g — fat went UP as the weight went down.
#
# WHAT WAS ACTUALLY HAPPENING. The AI's estimate was not what reached the screen. Since v6.x the
# AI Log ran a second, unspecified step after every model reply: it searched Open Food Facts by
# each item's NAME (a free-text search, no barcode) and, if anything at all came back with a
# calorie figure, REPLACED the AI's numbers with that product's label figures — per that
# product's own serving size, not the weight the user typed — at a fixed confidence of 98,
# which beats almost any estimate of a generic food. The AI's item name was kept, so the row
# looked like the AI's estimate. Only the small "reasoning" line said "Open Food Facts label
# data — <product>". No spec in features/ ever described this step; the UI suite had to abort
# the OFF route to make its own follow-up tests deterministic (e2e/ai-followups.spec.js:35).
#
# PROVED LIVE, 2026-09-15, with the app's own query and pick rule (Node mirror of searchOFT):
#     "Butter, 30g"  →  OFF's first hit with a calorie figure: "presto (g) peanut butter 30g"
#                        (a biscuit: 500 kcal/100 g, 70 g carbs)
#                    →  would log 150 kcal · P 3 · C 21 · F 6, at 98%, under the name "Butter, 30g"
#                        (real: ~215 kcal · C 0 · F 24.6)
# The chicken queries returned 503 that afternoon — OFF is flaky, which the code comment itself
# admitted. So the SAME input gave a different answer depending on whether OFF happened to reply:
# when it did, a random product's serving replaced the AI; when it did not, the AI's own figure
# survived. That is the "250 g scales but 150 g doesn't" symptom exactly. The 250 g entry in the
# report (77 / 0 / 9, 413 kcal) is USDA cooked chicken breast to the gram — the AI, unswapped.
#
# THE DECISION (2026-09-15; coach + engineering hats):
#   • The Open Food Facts step is REMOVED, in all three places it ran: the AI Log's item list,
#     the meal form's re-estimate, and the entry editor's re-estimate. The numbers on screen are
#     the AI's estimate of what was typed. Always. The reasoning line says where they came from.
#       Why remove rather than fix? A label database earns its place when the product is
#       IDENTIFIED — a barcode, an exact product name the user picked from a list. A free-text
#       search over a crowd-sourced database, taking the first hit, is a guess dressed as a
#       label; and the model already carries label knowledge for the brands the founder names
#       (Warburtons, Pret, GDK). Nothing the founder relies on came from OFF. [coach + eng]
#       A side effect worth recording for the privacy work: what is typed into AI Log no
#       longer leaves the device to anyone but the app's own worker. The separate FOOD SEARCH
#       screen still queries Open Food Facts — there the user types a term, sees product and
#       brand names, and picks one from a list. That is the identified-product case, and it
#       stays.
#   • The prompt gains four rules the report asked for, in the model's own terms:
#       - "dry", "no oil", "zero added fat", "no butter", "air-fried without oil", "grilled",
#         "boiled", "poached", "steamed" mean NO cooking fat is added; estimate the food's own
#         fat only (cooked skinless chicken breast ≈ 3–4 g fat per 100 g).
#       - A stated weight or count is the portion. Scale every figure in proportion to it.
#       - Check kcal against the macros: kcal ≈ 4×protein + 4×carbs + 9×fat. Alcohol (7 kcal/g)
#         and sugar alcohols are the exception; say so in reasoning when they apply.
#       - A number the user typed (a kcal figure, a macro) is a fact about the item it belongs
#         to, never a separate item. (Belt-and-braces for logging/06's partial statements.)
#       - If the description already answers a follow-up question — it says dry, or gives a
#         weight — do not set "ask" to that question.
#   • The kcal-vs-macros check is the MODEL's, not the client's. The client does not rewrite a
#     kcal figure to match the macros: a pint of beer is ~180 kcal on ~15 g carbs and no protein
#     or fat, and 4×15 = 60 would under-count it by two thirds. Silent under-counting is the
#     class of harm the energy-safety work exists to prevent. [coach]
#
# WHAT THIS FILE CANNOT PROMISE. The model's answers are not testable from here: the worker
# rejects anonymous calls and the harness never signs in (feedback: never real-login on the
# harness). Jest guards the removal statically (the AI Log, meal form and entry editor must not
# reference Open Food Facts; only FoodSearch may) and the prompt's rules by text. The three
# inputs below are the phone check — DEVICE-TEST.md.
# ============================================================================
Feature: The numbers on screen are the AI's estimate of what you typed

  Background:
    Given I am signed in with AI logging available
    And I am on the AI MEAL LOG screen

  Scenario: No second source ever replaces the estimate
    Given I type any meal and tap ANALYSE MEAL
    When the estimate arrives
    Then every row's numbers are the model's, for the item it named
    And no request is made to any food database
    And no row is shown at a confidence the model did not give it

  Scenario: The reasoning line names the model's source, not a product it never named
    Given I type "30g butter"
    When the estimate arrives
    Then the row reads roughly 215 kcal, C 0, F 25
    And its reasoning line does not mention a product other than butter

  Scenario: Explicit no-added-fat input                                   # device check 1
    Given I type "Dry airfried chicken zero added fat 150g"
    When the estimate arrives
    Then fat is no more than 6 g
    And protein is between 43 g and 49 g

  Scenario: Same food at a different weight scales in proportion         # device check 2
    Given I have an estimate for "Dry airfried chicken breast 250g"
    When I type "Dry airfried chicken breast 150g"
    Then each macro is 60% of the 250 g estimate, within ±10%

  Scenario: kcal agrees with the macros                                   # device check 3
    Given any estimate for a food with no alcohol
    Then kcal is within ±5% of (P×4 + C×4 + F×9)

  Scenario: The fat question is not asked when the text has answered it
    Given I type "Dry airfried chicken breast 150g"
    When the estimate arrives
    Then no "Any oil or butter on the chicken?" question is shown

  Scenario: The meal form's re-estimate is the AI's answer too
    Given I am on the manual meal form
    And I have typed a name and tapped re-estimate
    When the estimate arrives
    Then the fields hold the model's figures
    And they are not later overwritten by a database hit

  Scenario: The entry editor's re-estimate is the AI's answer too
    Given I am editing a logged entry
    And I have tapped re-estimate
    When the estimate arrives
    Then the fields hold the model's figures
    And they are not later overwritten by a database hit

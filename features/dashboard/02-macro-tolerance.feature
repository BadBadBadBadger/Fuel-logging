# ── SUPERSEDED, 2026-09-09 — this file no longer describes the app ────────────────
# `dashboard/04-intake-scoring.feature` was BUILT on 2026-09-04/09. The macro bars' colours now
# come from the role-based engine in that file (protein = a floor, calories = the master
# constraint, fat = a floor and a ceiling, carbs = flex), not from the flat "any macro, 5g/15g
# over = amber/red, under is always fine" model below. Every scenario here is now false about the
# shipped app — including the per-macro blue/orange/red-orange tints, which 04 deliberately
# collapses into one uniform green/amber/red.
#
# 04's own header says this file "should be deleted once this is built, not kept alongside it."
# It is being marked rather than deleted because deleting a spec is the founder's call, not a
# reviewer's — but a stale spec that actively misinforms is worse than a missing one, which is
# why this header goes in now rather than waiting. Delete when you're ready.
@superseded
Feature: Macro tolerance — forgiving colour logic

  Scenario: Macro within 5g of target — counts as hit
    Given a macro is within 5g of its target in either direction
    Then the macro bar shows the macro's own colour (blue / orange / red-orange)
    And the label does not show red or amber

  Scenario: Macro 5–15g over target — amber
    Given a macro is between 5g and 15g over its target
    Then the macro bar turns amber (#ffb84b)
    And the label turns amber
    And no red is shown

  Scenario: Macro 15g+ over target — red
    Given a macro is more than 15g over its target
    Then the macro bar turns red (#ff5555)
    And the label turns red

  Scenario: Macro under target by any amount — in range
    Given a macro is under its target by more than 5g
    Then the macro bar stays the macro's own colour
    And no warning colour is shown

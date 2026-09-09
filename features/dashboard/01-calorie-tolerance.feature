# ── SCOPE: these bands are the CUT role ───────────────────────────────────────────
# Added 2026-09-09, when `dashboard/04-intake-scoring.feature` was built. The scenarios below are
# written as if they were goal-agnostic, and they are not: "over target is the penalty, under is
# always fine" is true for Cut, partly true for Maintain (which now penalises both directions
# once the day has closed), and flatly wrong for Bulk, where being UNDER is the primary penalty.
#
# 04 keeps these 100/200/500 kcal bands verbatim as Cut's calorie bands — they were not reopened,
# and this file is not superseded. It just needed saying out loud which role it describes, because
# 04's own header flagged that this file "isn't self-updating". The mirrored Bulk bands and
# Maintain's own rule live in 04, not here.
Feature: Calorie tolerance — forgiving colour logic

  Scenario: Under calorie target — in range
    Given I have consumed less than my calorie target
    Then the calorie display shows the in-range accent colour
    And the progress bar shows the in-range accent colour
    And no warning is shown

  Scenario: Within 100 kcal over target — still in range
    Given I have consumed between 0 and 100 kcal over my target
    Then the calorie display stays the in-range accent colour
    And the progress bar stays the in-range accent colour
    And no over message is shown

  Scenario: 100–200 kcal over target — amber warning
    Given I have consumed between 100 and 200 kcal over my target
    Then the calorie display turns amber
    And the progress bar turns amber
    And the label says "JUST OVER"
    And the tone feels gentle not punishing

  Scenario: 200–500 kcal over target — amber alert
    Given I have consumed between 200 and 500 kcal over my target
    Then the calorie display turns amber
    And the progress bar turns amber
    And the label says "OVER BY"

  Scenario: 500+ kcal over target — red
    Given I have consumed more than 500 kcal over my target
    Then the calorie display turns red
    And the progress bar turns red
    And the label says "OVER BY"

# ── THE LABEL STATES A FACT; THE COLOUR PASSES JUDGEMENT (2026-09-15, session 23) ──────────
# From features/logging/00-bug-report.md Bug 3. At 2,366 consumed against 2,319 the card read
# "REMAINING 47 kcal" in the calm blue — the founder read it as 47 left, and it was 47 over. The
# label was taken from the colour bands below ("no over message" inside 100 kcal became the word
# REMAINING) while the number was the size of the gap with its sign dropped. Two windows, one
# expression — the FL-001 shape again.
#
# Founder's rule, taken verbatim: if consumed is more than the target the label reads OVER BY
# and the number is consumed − target; otherwise REMAINING and target − consumed. Exactly on
# target reads REMAINING 0. The bands below keep their colours and their tone — being 47 over
# is still blue, 150 over still amber — but the WORD no longer softens: "JUST OVER" is gone
# from this card (the amber already says "just"). The Today ring's ON TRACK inside 100 kcal is
# dashboard/04's and is untouched; the founder logged that as a question, not a bug.
#
# The label is a pure function (kcalCardLabel, app.jsx) mirrored in __tests__/logic.test.js;
# the screen is checked in e2e/calorie-card-label.spec.js at 47 over, 47 under and exactly on.
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

  Scenario: Within 100 kcal over target — still in range, but the label says over
    Given I have consumed between 0 and 100 kcal over my target
    Then the calorie display stays the in-range accent colour
    And the progress bar stays the in-range accent colour
    And the label reads "OVER BY" with consumed minus target
    # Was "no over message is shown" until 2026-09-15 — see the header. The colour is the
    # judgement (still fine); the label is the fact (over).

  Scenario: Slightly over budget — the founder's case
    Given my calorie target is 2,319 kcal
    And I have consumed 2,366 kcal
    When I view the calorie card
    Then the label reads "OVER BY"
    And the value shown is 47 kcal
    And the colour is still the in-range accent

  Scenario: Under budget by the same amount
    Given my calorie target is 2,319 kcal
    And I have consumed 2,272 kcal
    When I view the calorie card
    Then the label reads "REMAINING"
    And the value shown is 47 kcal

  Scenario: Exactly on budget
    Given my calorie target is 2,319 kcal
    And I have consumed 2,319 kcal
    When I view the calorie card
    Then the label reads "REMAINING"
    And the value shown is 0 kcal

  Scenario: 100–200 kcal over target — amber warning
    Given I have consumed between 100 and 200 kcal over my target
    Then the calorie display turns amber
    And the progress bar turns amber
    And the label says "OVER BY"
    And the tone feels gentle not punishing — the amber carries that, the word does not
    # Read "JUST OVER" until 2026-09-15; see the header.

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

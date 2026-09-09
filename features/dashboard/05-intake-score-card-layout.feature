# ── Intake score card layout — presentation only ──────────────────────────────
# Split out of 04-intake-scoring.feature in the round-2 atomicity/structure swarm review,
# 2026-08-27 — see that file's own header for the full reasoning and the disagreement it
# resolves (QA-automation, Critical-Thinking, and Nutrition-Coach personas each reviewed the
# combined file independently and landed on three different structural opinions; QA's final,
# reconciled decision was logic vs. presentation, not daily vs. weekly). Full transcript:
# `04-intake-scoring-swarm-review.md`.
#
# This file owns ONLY how the card composes states that 04 computes — ring geometry,
# positioning, which surface shows which timeframe. It never computes a colour, a label, or a
# hero action itself; every state referenced here is graded in 04. No Background is needed —
# nothing here depends on macro roles, the fat floor, or any term 04 defines, which is itself
# evidence this is a genuinely separate concern from 04's grading logic.
#
# The two-ring dial has no prior art elsewhere in this app (no existing ring/dial component in
# app.jsx, checked against dashboard/03) — what it DOES have is a founder-approved design
# decision from the conversation 04 was built from: two mockup layouts were built and compared
# (a labelled weekly strip vs. concentric daily/weekly rings), the founder chose the ring
# layout, and "rolling 7 days" wording was explicitly dropped from the weekly block per his
# direction. Sizing, stroke-width, animation, and colour-blind-safe pairing for two concurrent
# full-colour rings are still undecided — recommend a design-lead pass before build, same as any
# other OPEN item in 04. (This was originally written as a `Scenario:` with no Given/When/Then —
# QA's round-2 review flagged that it isn't a testable behaviour at all, just provenance prose
# wearing the wrong label; demoted to this header comment.)
@draft
Feature: Intake score card layout — both timeframes visible together, no swipe

  Scenario: Today and the week are shown on the same card at the same time
    Given the dashboard is showing the intake score card
    Then an inner ring shows today's status and how far through the day it is
    And an outer ring shows the week's status and how far through the rolling week it is
    And the week's comment sits beside the ring, labelled "This week"
    And neither timeframe is hidden behind a swipe, a tap, or a second screen

  Scenario: The day's single action stays in the centre of the dial
    Given the two-ring dial is showing
    Then the centre word is today's action priority, not the week's
    And the week's comment stays in the position already defined above — beside the ring,
      never inside it or substituting for the centre word
    # Reworded in the round-2 atomicity pass — this previously described the comment's position
    # with different wording than the scenario above ("outside the ring" vs "beside the ring"),
    # which was compatible but not identical, and risked drifting apart under future edits.

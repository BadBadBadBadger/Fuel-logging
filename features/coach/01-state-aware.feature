# ── Coach intelligence — Track A: "give the coach real context" (DOCS.md §23).
# Both features edit the same CoachCard.gen() prompt (app.jsx ~L1187). Today the
# coach is fed only daily TOTALS and a time LABEL, so (#5) it repeats the same
# foods and re-suggests things you already ate, and (#6) it lets the LLM guess
# whether you're "behind", which misfires early in the day. The fix for both:
# compute the facts and hand them to the model; never let the LLM infer them.
# Built + verified on device 2026-06-11.
Feature: Coach is state-aware and varies its suggestions

  Background:
    Given I am a premium user with the daily coach on the dashboard

  Scenario: The coach is given today's logged items by name
    Given I have logged eggs and Greek yogurt today
    When the coach generates a tip
    Then the prompt includes the names of what I have logged today
    And the coach does not suggest eggs or Greek yogurt again

  Scenario: Suggestions vary across refreshes
    Given the coach has already given me a suggestion today
    When I tap refresh for a new tip
    Then the new suggestion is meaningfully different from the previous one
    And the coach is told what it already suggested so it does not repeat itself

  Scenario: Variety is valued for its own sake, not just macros
    Given I have hit my protein goal from the same two foods all day
    When the coach suggests something
    Then it favours variety and fibre / gut-health diversity
    And it does not just re-recommend the highest-protein option again

  Scenario: Already-met goals are still respected (existing behaviour preserved)
    Given my protein and water goals are already met
    When the coach generates a tip
    Then it does not suggest more protein or more water
    And it gives those met goals a brief celebratory nod

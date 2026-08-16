# Built + verified on device 2026-06-11 (coach avoided re-suggesting logged foods).
# COACH-HAT REVIEW (2026-06-11): pacing on a calorie tracker is a disordered-eating
# vector, so two safeguarding rules are baked in below: (1) pace only applies to
# FLOOR goals you must reach (protein, water, fibre) — NEVER the calorie ceiling,
# where being "behind" (under) is success, not a failure to fix; (2) the eating
# window is derived from today's first logged meal, not a wall-clock default, so
# fasting / Ramadan / 16:8 users are not falsely told they're "behind". Nudge copy
# stays gentle — no "catch up" urgency.
Feature: Coach paces advice to the time of day

  # Pace is COMPUTED, not judged by the LLM. The eating window starts at today's
  # first logged meal (not a wall-clock default), giving % elapsed; each FLOOR goal
  # gives its own % progress. The verdict (ahead / on / behind) is handed to the prompt.

  Background:
    Given I am a premium user with the daily coach on the dashboard

  Scenario: Low totals early in the day are not "behind"
    Given it is 07:00 and I have logged 62g of a 147g protein goal
    When the coach generates a tip
    Then it does not tell me I am behind on protein
    Because almost none of the eating window has elapsed yet

  Scenario: Ahead of pace is recognised as ahead
    Given it is 10:00 and I have logged 79g of a 146g protein goal
    When the coach generates a tip
    Then the pace verdict handed to it is "ahead"
    # paceVerdict returns one of ahead / on / behind / met; the prompt line reads
    # "verdict: ahead" (app.jsx ~L1889), not a prose phrase
    And the coach does not nag me to catch up

  Scenario: Genuinely behind late in the day gets a gentle nudge
    Given it is 20:00 and I have logged only 40g of a 150g protein goal
    When the coach generates a tip
    Then the pace verdict is "behind"
    And the coach gives a gentle, non-punishing nudge

  Scenario: Pace is computed and handed to the model, never inferred by it
    Given the coach prompt is being built
    Then it includes, per goal, the % of the eating window elapsed versus the % of the goal hit
    And it includes an explicit pace verdict (ahead / on / behind)
    And the LLM is instructed to use that verdict, not to judge pace itself

  Scenario: Before the window meaningfully starts, "behind" is never used
    Given less than a quarter of the eating window has elapsed
    Then no metric is ever described as "behind"
    And the tone assumes the day is just getting going

  # ── Safeguarding rules from the coach-hat review ──

  Scenario: The calorie ceiling is never paced as "behind"
    Given I am in cut or maintain mode and under my calorie target
    When the coach generates a tip
    Then being under calories is never described as being "behind"
    And the coach never urges me to eat more to "catch up" on calories
    And pace applies only to floor goals I am meant to reach (protein, water, fibre)

  Scenario: A fasting or late-start eating window is not falsely paced
    Given I have not logged any food yet today
    When the coach generates a tip
    Then no goal is described as "behind"
    Because the eating window only starts once I have actually eaten

  Scenario: Pace nudges stay gentle and point at a food choice, not urgency
    Given a floor goal is genuinely behind late in the day
    When the coach nudges me
    Then it suggests a specific food choice to round the day out
    And it uses no "catch up" urgency, no punishment, and no shame framing

  Scenario: Variety never outranks an unmet protein floor
    Given my protein floor is still unmet late in the day
    When the coach makes a suggestion
    Then meeting the protein floor takes priority over variety
    And variety is only a tiebreaker once the floor is met

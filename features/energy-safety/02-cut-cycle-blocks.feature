# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 2 of 5.
#
# WHY: Nothing in the app caps how LONG a user cuts. A deficit from
# January to June with no structured break is exactly what harmed the
# founder. This introduces CUT CYCLING: a deficit runs as time-boxed
# blocks, each ending in a diet break, instead of one open-ended cut.
#
# EVIDENCE (coach hat, tiered):
#   • WELL-ESTABLISHED: prolonged continuous energy restriction drives
#     adaptive thermogenesis (metabolic slowdown) — Rosenbaum & Leibel
#     (2010); Fothergill et al. (2016, "Biggest Loser" 6-yr follow-up)
#     showed it persists for years. Slower loss preserves lean mass —
#     Garthe et al. (2011, IJSNEM): 0.5%/wk beat ~1%/wk in athletes.
#   • REASONABLE / RCT-SUPPORTED: structured diet breaks improve fat-loss
#     efficiency and reduce adaptation vs continuous dieting — MATADOR,
#     Byrne et al. (2018, Int J Obes): 2-weeks-cut / 2-weeks-maintenance
#     cycles in men. Intermittent dieting retains fat-free mass — Peos et
#     al. (2021). Review: Trexler, Smith-Ryan & Norton (2014, JISSN).
#   • PRACTITIONER FRAMEWORK (label as such): cut in ~6–12 week blocks,
#     break to maintenance, cut more frequently/shorter the leaner you are
#     — Helms et al. (2014, JISSN) natural-bodybuilding recommendations.
#
# ── NUMBERS CONTRACT ─────────────────────────────────────────
#   The thresholds here are POLICY CONSTANTS (durations / percentages), owned
#   by __tests__/logic.test.js so a tweak doesn't rewrite these scenarios.
#   Where a figure is a worked example of a rule (5% of a starting weight), a
#   Scenario Outline uses CONTRASTING rows so the RULE, not the example number,
#   is what gets implemented.
#   POLICY CONSTANTS (all reviewable):
#       CUT_BLOCK_SOFT_NUDGE  = 8 weeks continuous deficit
#       CUT_BLOCK_HARD_PROMPT = 12 weeks continuous deficit
#       BLOCK_LOSS_TRIGGER    = 5% of bodyweight lost within a block
#       LEAN_MODIFIER: male < 12% BF (female < 20%) → soft 6 / hard 8 weeks
#       CUMULATIVE_CUT_ESCALATE = 24 weeks of cut in the past year
#       A "deficit week" = a calorie deficit logged on ≥ 4 of 7 days.
# The diet-break FLOW itself lives in 03-diet-break-intervention.
# ─────────────────────────────────────────────────────────────

Feature: Cut runs as time-boxed blocks, not an open-ended deficit

  Background:
    Given the app is tracking how many consecutive weeks I have been in "Cut" mode
    And a week counts as a "deficit week" when I log a calorie deficit on 4 or more of its 7 days

  Scenario: The app starts a cut block when I first select Cut
    Given I have never run a cut before
    When I switch my mode to "Cut"
    Then the app records the start date of cut block 1
    And the app begins counting my consecutive deficit weeks from 0

  Scenario: A soft nudge appears at the soft-nudge threshold
    Given I have logged CUT_BLOCK_SOFT_NUDGE (8) consecutive deficit weeks in the current block
    And I am not yet at the hard-prompt threshold
    When I open the dashboard
    Then I see a dismissable amber card "You've been cutting for 8 weeks"
    And the card says "A short break at maintenance now can protect your metabolism and results"
    And the card shows a "Plan a diet break" button
    And the card shows a "Not yet" button that dismisses it for 7 days

  Scenario: A hard prompt appears at the hard-prompt threshold
    Given I have logged CUT_BLOCK_HARD_PROMPT (12) consecutive deficit weeks in the current block
    When I open the dashboard
    Then I see a non-dismissable red-bordered card "Time for a diet break"
    And the card says "12 weeks is long enough in a deficit — let's spend 2 weeks at maintenance"
    And the card shows a primary "Start 2-week diet break" button
    And the card shows a secondary "Remind me in 3 days" button
    And I can still use the rest of the app while the card is shown

  Scenario Outline: A break is prompted after losing BLOCK_LOSS_TRIGGER of bodyweight in a block
    Given I started the current cut block at <start> kg
    And my 7-day average weight has reached <now> kg
    When I open the dashboard
    Then I see the "Time for a diet break" card
    And the card says "You've lost 5% of your bodyweight this block — a great point to consolidate"
    And this prompt fires even if I am below the 12-week threshold

    # <now> is <start> × (1 − BLOCK_LOSS_TRIGGER); different starts prove it is a percentage, not a fixed weight.
    Examples: 5% of a different starting weight → a different trigger point
      | start | now |
      | 100   | 95  |
      | 80    | 76  |

  Scenario Outline: Deficit-week thresholds shift for leaner users (LEAN_MODIFIER)
    Given my leanness classifies me as "<leanness>"
    And I have logged <weeks> consecutive deficit weeks in the current block
    When I open the dashboard
    Then I see the "<prompt>" prompt

    Examples: the lean modifier pulls both thresholds earlier
      | leanness         | weeks | prompt          |
      | normal           | 8     | soft nudge      |
      | normal           | 12    | hard diet-break |
      | lean (< 12% BF)  | 6     | soft nudge      |
      | lean (< 12% BF)  | 8     | hard diet-break |

  Scenario: Completing a diet break starts a fresh block
    Given I have completed a diet break
    When I switch back to "Cut" mode
    Then the app records the start of the next cut block
    And my consecutive-deficit-week counter resets to 0
    And the app remembers my cumulative time spent cutting across all blocks

  Scenario: Cumulative dieting time escalates the message
    Given my cumulative time in cut mode across all blocks exceeds CUMULATIVE_CUT_ESCALATE (24 weeks) in the past year
    When a diet-break prompt appears
    Then the card additionally says "You've spent a lot of this year cutting — consider a longer maintenance phase"
    And the card links to the low-energy-availability check

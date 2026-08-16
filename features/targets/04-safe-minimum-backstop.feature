# ─────────────────────────────────────────────────────────────
# BACKSTOP ONLY (framing corrected 2026-08-06; confirmed 2026-08-07 at the
# Step 4 build). The flat SAFE_MIN (1,400 male / 1,200 female) is NOT the
# primary safety mechanism — it sits BELOW a large user's BMR, so it never
# protected them. Two body-derived floors now run ABOVE it, both BUILT:
#   • the STEADY-LOSS floor — 75% of believable maintenance + the applied
#     training bonus, every preset mode (features/energy-safety/01);
#   • the MAINTENANCE floor — sedentary TDEE, BMR × 1.2, maintain only
#     (see the next Feature).
# SAFE_MIN was NOT replaced and is not going to be: it stays as the absolute
# backstop and, when body-fat is unset, the sole fallback (no energy-
# availability figure can be produced without it). It therefore only wins on
# the smallest bodies, where it out-ranks even the steady-loss floor.
# These scenarios stay because SAFE_MIN still runs exactly as described.
# ─────────────────────────────────────────────────────────────
Feature: Safe minimum calorie guard (last-resort backstop)

  # Since Step 4 a calculated target meets the steady-loss floor FIRST; SAFE_MIN
  # only decides the outcome when it is the stricter of the two (small bodies).
  Scenario: Calculated cut target falls below safe minimum for men
    Given a male user's calculated cut target is below 1,400 kcal
    Then the target is overridden to 1,400 kcal
    And a banner warning is shown on the dashboard
    And the warning contains a link that navigates to the profile screen

  Scenario: Calculated cut target falls below safe minimum for women
    Given a female user's calculated cut target is below 1,200 kcal
    Then the target is overridden to 1,200 kcal
    And the same banner warning is shown

  Scenario: Manual target below safe minimum for male
    Given I am male and my safe minimum is 1,400 kcal
    When I manually enter a target below 1,400 kcal
    Then the target is raised to 1,400 kcal
    And the banner reads "That's below the safe minimum for your body. We've set it to 1,400 kcal to keep you safe."
    And it links to the profile screen

  Scenario: Manual target below safe minimum for female
    Given I am female and my safe minimum is 1,200 kcal
    When I manually enter a target below 1,200 kcal
    Then the target is raised to 1,200 kcal
    And the same safety banner appears

  Scenario: Target is above safe minimum
    Given a user's calculated target is above the safe minimum
    Then no override occurs
    And no warning is shown

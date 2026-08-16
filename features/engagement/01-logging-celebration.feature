# ── Celebration model (agreed 2026-06-11): ONE engine, intensity scales with rarity.
# Daily logging = a quiet chip pop. Badges are the SOLE "something special" authority.
# The old standalone streak-milestone overlay (days 7/14/30/50/100) is REMOVED.
# Shipped v6.5 (2026-06-12). Replaces the former "Streak celebration animation" feature.
Feature: Logging celebration — quiet daily, fanfare for the rare

  Background:
    Given badge tiers in ascending order are Bronze, Silver, Gold, Platinum, Diamond, Elite

  Scenario: Daily streak increment is a quiet pip in the thumb zone, not an overlay
    Given I have an active streak and have not logged today
    When I log my first meal of the day
    Then a quiet 🔥 streak pip appears near the bottom, where I am logging
    # the header chip is usually scrolled off when logging, so the pip carries the moment
    And the header 🔥 streak chip also increments
    And no full-screen overlay appears
    And no celebration sound plays
    And a flag is saved for today so the pip does not repeat

  Scenario: A second log the same day does nothing
    Given today's streak pop has already played
    When I log another meal
    Then the chip does not pop again
    And the meal logs silently

  Scenario: First ever log starts the streak at 1
    Given I have no previous streak
    When I log my first ever meal
    Then the chip appears showing 1 with a pop
    And no full-screen overlay appears

  Scenario: Missed day resets the streak silently
    Given I missed logging yesterday
    When I log a meal today
    Then the streak chip resets to 1
    And no overlay and no punishing message are shown

  Scenario Outline: Celebration intensity scales with how rare the event is
    Given I trigger a "<event>"
    Then the celebration treatment is "<treatment>"
    And the overlay behaviour is "<overlay>"
    Examples:
      | event                          | treatment            | overlay        |
      | daily streak increment         | thumb-zone pip       | no overlay     |
      | Bronze or Silver badge earned  | toast + chip glow    | no overlay     |
      | Gold+ badge earned             | full fanfare         | overlay ~2.5s  |

  Scenario: Full fanfare is reserved for Gold tier and above
    Given I earn a badge at Gold, Platinum, Diamond or Elite tier
    When the badge is awarded
    Then a full-screen overlay plays
    And it stays long enough to read the badge name (~2.5 seconds)
    And the relevant number counts up

  Scenario: Low tiers do not trigger a full-screen overlay
    Given I earn a badge at Bronze or Silver tier
    When the badge is awarded
    Then only a toast and a chip glow are shown
    And no full-screen overlay appears

  # Removed by design: the standalone streak-milestone overlay at days 7/14/30/50/100.
  # Badges are now the single source of "something special happened" (app.jsx ~L3048 / ~L3112).

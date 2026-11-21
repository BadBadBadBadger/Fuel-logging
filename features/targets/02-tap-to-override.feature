Feature: Tap to override daily calorie target

  Scenario: User taps the daily target display
    Given I am on the dashboard
    And my daily target shows e.g. 2,095 kcal
    When I tap the target display
    Then it becomes an inline numeric input
    And the current value is pre-populated ready to type over
    And a numeric keyboard appears on mobile

  Scenario: User types a new target and confirms
    Given the target is in edit mode
    When I type a new number and press Done or Return
    Then the input closes
    And the target updates to the new number
    And the mode label updates automatically
    And relevant warnings appear immediately

  Scenario: User taps away without changing
    Given the target is in edit mode
    When I tap anywhere outside the input
    Then the input closes
    And if I did not change the value the original target is preserved

  Scenario: Edit mode visual treatment
    Given I am looking at the target display
    Then it has a dashed underline indicating it is tappable
    And a small pencil hint (✎) is visible beside it
    And when in edit mode the underline becomes solid and uses the mode colour
    But it does not look like a standard form box

  Scenario: Preset buttons still work after tap-to-edit
    Given I have used tap-to-edit to set a custom value
    When I tap a preset button
    Then the target updates to that preset's value
    And the custom override is cleared
    And the relevant preset button becomes active again

  # ── Today v2 (design/v2/HANDOVER.md D4; dashboard/07-gauge) ────────────────
  # On the v2 Today screen (?ui=v2) the target lives under the gauge as TARGET.
  # The pencil hint above is v1 only: v2 has the dashed underline and no pencil.

  Scenario: v2 — TARGET has a dashed underline and no pencil
    Given the v2 Today screen is on
    Then TARGET under the gauge has a dashed underline
    And no pencil hint is shown

  Scenario: v2 — the edit state shows the automatic target
    Given the v2 Today screen is on
    When I tap TARGET
    Then it becomes an inline numeric input with a solid amber underline
    And "Auto would be N" shows the automatic target for my mode

  Scenario: v2 — Use auto
    Given the v2 Today screen is on
    And I have set my own target
    When I tap TARGET
    Then "Use auto" is shown
    When I tap "Use auto"
    Then my own target is cleared and the automatic target returns

  Scenario: v2 — tapping away without changing keeps the target as it was
    Given the v2 Today screen is on
    And TARGET is in edit mode
    When I tap away without changing the number
    Then the target is unchanged and no custom target is set

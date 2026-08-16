# ── Add-feedback polish (DOCS.md §23). Two related parts: a visual repeat-add
# signal (#3) and a haptic confirmation (#4). The repeat-add signal only applies to
# buttons that STAY on screen after an add — AI Log per-item rows (app.jsx ~L2435)
# and the dashboard ⚡ quick-add chips (~L2124). Surfaces that navigate away on add
# (Quick Add list, Food Search) have no second tap to signal and are out of scope.
# Built + verified on device 2026-06-11.
Feature: Repeat-add feedback — re-blink and count

  Scenario: First tap on an AI Log item confirms the add
    Given I have an analysed meal with separate items in the AI Meal Log
    When I tap an item to log it
    Then the row shows "✓ Added · <item name>"
    And the row briefly pulses to confirm the add

  Scenario: Tapping the same item again logs it again and shows a count
    Given I have already added an AI Log item once
    When I tap the same item again
    Then a second entry is logged
    And the row re-blinks on this tap
    And the label shows a running count "✓ Added ×2"

  Scenario: The count keeps rising on further taps
    Given I have added the same item twice
    When I tap it a third time
    Then a third entry is logged
    And the label shows "✓ Added ×3"
    And each tap produces its own blink

  Scenario: A single add shows no count
    Given I have added an item exactly once
    Then the label shows "✓ Added" with no "×1"

  Scenario: The dashboard quick-add chip re-blinks on repeat add
    Given a quick-add chip on the dashboard
    When I tap it more than once in quick succession
    Then each tap logs the item
    And the ✓ confirmation re-blinks on every tap, not just the first

  Scenario: The per-item count resets when I leave and re-open the AI Log
    Given an AI Log item showing "✓ Added ×3"
    When I leave the AI Meal Log and open it again
    Then the per-item added count has reset
    And the already-logged entries themselves remain saved
    # the count is ephemeral feedback for the current analysis; re-opening starts fresh

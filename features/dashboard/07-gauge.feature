# ── TODAY v2: THE FUEL GAUGE (design/v2/HANDOVER.md §3.4–3.6, §4; D2, D3, D4, D17, D19) ──────
# The v2 Today screen (behind ?ui=v2) replaces the CONSUMED / REMAINING calorie card with a fuel
# gauge. The big number is what is LEFT; the tank fills from E towards F as you eat. Under it sit
# TARGET and EATEN, centred, with no "target − eaten = left" sum anywhere.
#
# For CUT the old 100/200/500 tolerance colours (dashboard/01) are REPLACED by three bands:
# green up to the target, amber up to 250 over, red beyond. The arc never grows past F: at or
# over target it is simply full, with the pointer stopped at F. Maintain and Bulk carry no
# colour at all (D19). dashboard/01 still describes v1 until v2 becomes the default.
#
# Saving an over-target cut day to History as Maintain/Bulk (D18) is dashboard/08, not here.
# Example numbers: cut target 2,241.

Feature: Today v2 fuel gauge

  Background:
    Given the v2 Today screen is on

  # ── Still to go ────────────────────────────────────────────────────────────
  Scenario: Under target the readout is calories left, "still to go"
    Given my target is 2,241 kcal and I have eaten 1,150 kcal
    Then the gauge readout shows "1,091" with a small "kcal" after it
    And "still to go" is shown under it
    And the arc is filled from E to about half way towards F

  Scenario: Nothing eaten yet
    Given my target is 2,241 kcal and I have eaten nothing
    Then the readout shows "2,241" "still to go"
    And the arc is empty with the pointer at E

  Scenario: Exactly on target
    Given I have eaten exactly my target
    Then the readout shows "0" "still to go"
    And the arc is full with the pointer at F

  # ── CUT colour bands (D17) ─────────────────────────────────────────────────
  Scenario: CUT at or under target is green, the number in ink
    Given my mode is CUT and I have eaten at or under my target
    Then the arc and pointer are green
    And the readout number is in the normal ink colour

  Scenario: CUT 1 to 250 over is amber
    Given my mode is CUT and my target is 2,241 kcal
    When I have eaten 2,391 kcal
    Then the readout shows "150" "over"
    And the arc is 100% full, amber, with the pointer at F
    And the readout number is amber

  Scenario: CUT more than 250 over is red
    Given my mode is CUT and my target is 2,241 kcal
    When I have eaten 2,641 kcal
    Then the readout shows "400" "over"
    And the arc is 100% full, red, with the pointer at F
    And the readout number is red

  Scenario: There is no over-zone past F
    Given my mode is CUT and I am 600 over
    Then the arc is drawn exactly as when full
    And the pointer stays at F
    And only the colour and the "over" readout show how far over the day went

  Scenario: CUT stays lit when a cut day is eaten at maintenance
    Given my mode is CUT and I have eaten at or above maintenance
    Then the gauge stays red and the CUT lamp stays lit
    # How the day is SAVED is dashboard/08.

  # ── Maintain and Bulk are neutral (D19) ────────────────────────────────────
  Scenario Outline: <mode> carries no colour, under or over
    Given my mode is <mode>
    When I have eaten <state> my target
    Then the arc and pointer are neutral grey
    And the readout number is in the normal ink colour
    And it reads "<caption>"

    Examples:
      | mode     | state | caption     |
      | MAINTAIN | under | still to go |
      | MAINTAIN | over  | over        |
      | BULK     | under | still to go |
      | BULK     | over  | over        |

  # ── TARGET · EATEN (D3) ────────────────────────────────────────────────────
  Scenario: Two figures, no sum
    Then TARGET and EATEN are shown centred under the gauge readout
    And no "target − eaten = left" sum appears anywhere
    And TARGET has a dashed underline and no pencil

  Scenario: Tapping TARGET overrides it inline
    # Same behaviour as targets/02.
    When I tap TARGET
    Then it becomes an inline numeric input holding the current target
    And "Auto would be N" shows the automatic target for my mode
    When I type 2,000 and press Done
    Then TARGET reads 2,000 and the readout updates straight away

  Scenario: Use auto clears a custom target
    Given I have set my own target
    When I tap TARGET
    Then "Use auto" is shown beside "Auto would be N"
    When I tap "Use auto"
    Then TARGET returns to the automatic target

  # ── Macro tapes (§3.6) ─────────────────────────────────────────────────────
  Scenario: PRO, CARB and FAT tapes on one row
    Then PRO, CARB and FAT are shown side by side
    And each shows eaten over target, e.g. "65/169"
    And each has a tick tape with a neutral fill and an amber pointer
    And none of them is coloured good or bad

  Scenario: A macro over its target
    Given I have eaten more protein than my target
    Then the PRO tape is full with the pointer at its end
    And the figure still reads eaten over target

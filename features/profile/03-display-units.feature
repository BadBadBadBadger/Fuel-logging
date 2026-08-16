# Shipped v6.3, device-verified 2026-06-12 (round-trips + MeasureField seed/build in
# logic.test.js). Storage is ALWAYS metric (kg/cm); units are a per-device display
# preference, never synced. Weight and height are chosen INDEPENDENTLY — UK users
# routinely mix (e.g. height in cm, weight in stone).
Feature: Independent metric / imperial display units

  Background:
    Given I am on the profile screen

  Scenario: Body stats default to metric
    Then weight is shown in kilograms and height in centimetres

  Scenario: Weight and height units are chosen independently
    When I set weight to stones-and-pounds
    And I set height to centimetres
    Then weight reads in stone and pounds while height stays in centimetres

  Scenario Outline: Weight is displayed in the chosen weight unit
    Given my stored weight is 80 kg
    When I set the weight unit to "<unit>"
    Then my weight reads "<shown>"
    Examples:
      | unit  | shown      |
      | kg    | 80 kg      |
      | st    | 12 st 8 lb |
      | lb    | 176.4 lb   |

  Scenario Outline: Height is displayed in the chosen height unit
    Given my stored height is 178 cm
    When I set the height unit to "<unit>"
    Then my height reads "<shown>"
    Examples:
      | unit  | shown     |
      | cm    | 178 cm    |
      | ftin  | 5 ft 10 in|
      | in    | 70 in     |

  Scenario: Switching units without editing never changes my stored data
    Given my stored weight is 80 kg and my stored height is 178 cm
    When I change weight and height units without editing any field
    Then my stored weight is still exactly 80 kg and my stored height 178 cm

  # ── Zero handling: a 0 has CONTEXT. The blank-vs-show decision is made once, at
  # the whole-measurement level — never per digit. A 0 may appear only as a real
  # sub-part of a measurement the user has actually set (the inches in 5 ft 0 in,
  # the pounds in 12 st 0 lb); a never-set or fully-cleared field is blank, with a
  # placeholder, and shows no 0 anywhere. Single-unit fields (kg, cm, lb, in) have
  # no meaningful 0, so they are simply blank when empty.

  Scenario: A genuine zero in a compound weight is shown (12 st 0 lb)
    Given my stored weight is 76.2 kg
    When I view weight in stones-and-pounds
    Then the stone box reads "12" and the pounds box reads "0"

  Scenario: A genuine zero in a compound height is shown (5 ft 0 in)
    Given my stored height is 152 cm
    When I view height in feet-and-inches
    Then the feet box reads "5" and the inches box reads "0"

  Scenario: An unset measurement shows blank boxes, never a zero
    Given I have not set my height
    Then every height box is blank with a placeholder
    And no box shows "0"

  Scenario: An empty single-unit field shows blank, not zero
    Given I have cleared my weight while the unit is kilograms
    Then the weight box is blank, not "0"

  # Regression (was: clear → unit switch left a stuck, undeletable "0"). The fix
  # turns on whether the measurement has data, so the two halves below differ only
  # by whether a real value remains.
  Scenario: Clearing a field leaves it blank while I keep editing
    Given I am editing my height and I have cleared the field
    Then the box stays blank and I can type straight in, with no zero to delete first

  Scenario: Switching units on a CLEARED value keeps the boxes blank
    Given I have cleared my height so it holds no value
    When I switch the height unit from centimetres to feet-and-inches
    Then the feet and inches boxes are blank, not "0"

  Scenario: Switching units on a REAL value reveals its genuine zero
    Given my stored height is 152 cm
    When I switch the height unit from centimetres to feet-and-inches
    Then the inches box reads "0", because 152 cm is exactly 5 ft 0 in
    And that zero belongs to a real record, so it is shown

  Scenario: A cleared sub-field re-shows its zero only once it is a committed record
    Given my height is 5 ft 10 in
    When I clear the inches box and leave it empty
    Then the inches box stays blank while I am editing
    But on returning to the screen the inches box reads "0", as the height is now 5 ft 0 in

  Scenario: Editing in any unit is saved back as metric
    Given the weight unit is pounds
    When I enter my weight as 176 pounds
    Then the value persisted is the equivalent in kilograms
    And switching back to pounds still reads 176 lb

  Scenario: The weight unit is applied consistently on every weight surface
    Given I have set the weight unit to stones-and-pounds
    Then the profile, the weigh-in widget and the weight trend all use it
    # the trend chart axis plots a single number, so stone mode charts in pounds

  Scenario: Each unit choice persists across sessions
    Given I have set weight to pounds and height to feet-and-inches
    When I reload the app
    Then both unit choices are unchanged

  Scenario: Logging a weigh-in in an imperial unit stores metric
    Given the weight unit is stones-and-pounds
    When I log today's weight as 12 stone 8 pounds in the weigh-in widget
    Then the weigh-in is stored in kilograms
    And the weekly trend is shown in pounds per week

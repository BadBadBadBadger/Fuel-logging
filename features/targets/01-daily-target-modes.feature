Feature: Flexible daily calorie target with auto mode detection

  Background:
    Given I have set up my profile with weight, height, sex and body fat %
    And my TDEE has been calculated

  Scenario: First time opening the app — defaults to MAINTAIN
    Given I have never set a custom calorie target
    Then my daily target defaults to my TDEE
    And the mode label shows MAINTAIN

  Scenario: Tapping CUT preset button
    Given I am on the dashboard
    When I tap the CUT button
    Then my daily target sets to TDEE minus 500 kcal
    And the mode label shows CUT
    And any custom target override is cleared

  Scenario: Tapping MAINTAIN preset button
    Given I am on the dashboard
    When I tap the MAINTAIN button
    Then my daily target sets to my TDEE exactly
    And the mode label shows MAINTAIN
    And any custom target override is cleared

  Scenario: Tapping BULK preset button
    Given I am on the dashboard
    When I tap the BULK button
    Then my daily target sets to TDEE plus 500 kcal
    And the mode label shows BULK
    And any custom target override is cleared

  Scenario: Preset buttons deselect after manual override
    Given I have typed a custom kcal number into the target field
    Then none of the preset buttons appears active
    And the mode label updates automatically based on the custom value vs TDEE

  Scenario: Manual target below TDEE — auto CUT
    Given my TDEE is 2,095 kcal
    When I set my target to any value below 2,095
    Then the mode label shows CUT and turns blue

  Scenario: Manual target equal to TDEE — auto MAINTAIN
    Given my TDEE is 2,095 kcal
    When I set my target to 2,095
    Then the mode label shows MAINTAIN and turns green

  Scenario: Manual target above TDEE — auto BULK
    Given my TDEE is 2,095 kcal
    When I set my target to any value above 2,095
    Then the mode label shows BULK and turns orange

  Scenario: Manual target within 150 kcal below TDEE — slow cut
    Given my TDEE is 2,095 kcal
    When I set my target between 1,945 and 2,094 kcal
    Then the mode label shows CUT
    And a gentle info note appears "Deficit is small — progress will be slow but sustainable 👍"

  Scenario: Manual target within 150 kcal above TDEE — slow bulk
    Given my TDEE is 2,095 kcal
    When I set my target between 2,096 and 2,245 kcal
    Then the mode label shows BULK
    And a gentle info note appears "Small surplus — lean gains but slow 👍"

  Scenario: Aggressive cut — over 750 kcal deficit
    Given my TDEE is 2,095 kcal
    When I set my target below 1,345 kcal
    Then an amber warning appears
    "This is an aggressive deficit. You may lose muscle alongside fat.
    Consider 1,345 kcal or above."
    And saving is not blocked

  Scenario: Very aggressive cut — over 1,000 kcal deficit
    Given my TDEE is 2,095 kcal
    When I set my target below 1,095 kcal
    Then a red warning appears
    "This deficit is not recommended. Extreme cuts cause muscle loss,
    fatigue and metabolic damage. Are you sure?"
    And an inline "Yes, I understand →" confirm button appears
    When the user taps confirm
    Then the warning is dismissed
    And a flag is saved to the user's profile (aggressive_cut_acked)
    And subsequent visits show only an amber reminder, not the red confirm

  Scenario: Custom target persists across sessions
    Given I have set a custom target of 1,800 kcal
    When I close and reopen the app
    Then my target is still 1,800 kcal
    And the mode label still shows the auto-detected mode

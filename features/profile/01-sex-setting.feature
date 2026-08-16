Feature: Sex setting on profile screen

  Scenario: User sets sex on first use
    Given I am on the profile screen for the first time
    Then I see a sex selector
    And the options are "Male" and "Female"
    And the default is not pre-selected
    And a helper text explains "Used to calculate your calorie and macro targets"

  Scenario: Male selected
    Given I have selected Male on the profile screen
    Then the safe minimum calorie floor is 1,400 kcal
    And protein targets use male body composition ratios

  Scenario: Female selected
    Given I have selected Female on the profile screen
    Then the safe minimum calorie floor is 1,200 kcal
    And protein targets use female body composition ratios
    And a note appears "Targets may need adjusting around your cycle — override anytime"

  Scenario: User changes sex setting
    Given I have previously set my sex to Male
    When I change it to Female
    Then all targets recalculate immediately
    And the safe minimum updates accordingly
    And a confirmation shows "TARGETS UPDATED", not a generic "saved"
    # only on a CHANGE — setting sex for the first time confirms with "✓ SAVED",
    # because there were no targets to update yet

  Scenario: Sex not set
    Given I have not set a sex
    Then the app defaults to male calculations
    And a prompt shows on the profile screen "Set your sex for more accurate targets"

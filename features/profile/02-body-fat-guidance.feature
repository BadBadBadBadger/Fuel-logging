Feature: Body fat % guidance on profile screen

  Scenario: Helper text appears when body fat field is focused
    Given I am on the profile screen
    When I tap the body fat input
    Then inline helper text expands below the field
    And it reads "Not sure? Use 25% for men or 30% for women as a starting estimate"
    And it explains that a more accurate figure improves calorie and macro targets

  Scenario: Body fat % value seems implausible
    Given a user enters a body fat % below 4% or above 50%
    Then a gentle inline warning appears below the field
    And it reads "That seems unusual — double-check this number as it affects your calorie targets"
    And saving is not blocked

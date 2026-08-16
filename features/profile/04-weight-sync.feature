Feature: Weight input sync — weigh-in updates profile weight

  Scenario: Logging a weight via the weigh-in widget updates the profile
    Given I am on the dashboard
    When I enter and save a weight in the weigh-in widget
    Then the profile weight field updates to that value
    And calorie and macro targets recalculate immediately
    And the updated weight persists after a page reload

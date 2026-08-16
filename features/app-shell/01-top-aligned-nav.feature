Feature: Top-aligned navigation — pages open at the top

  Scenario: Opening a screen scrolls it to the top
    Given I have scrolled down on the dashboard
    When I navigate to any other screen (Profile, History, Achievements, AI Log, Quick Add, Food Search)
    Then the new screen is shown scrolled to the very top
    And I do not have to scroll up to see its header

  Scenario: Returning to the dashboard resets scroll
    Given I am scrolled down inside History
    When I tap back to return to the dashboard
    Then the dashboard is shown from the top

  Scenario: Sub-navigation within a screen does not jump to top
    Given I am viewing a specific day inside History
    When I page to the previous or next day
    Then the scroll position is not forced back to the top

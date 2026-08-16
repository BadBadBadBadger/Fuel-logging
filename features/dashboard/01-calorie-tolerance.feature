Feature: Calorie tolerance — forgiving colour logic

  Scenario: Under calorie target — in range
    Given I have consumed less than my calorie target
    Then the calorie display shows the in-range accent colour
    And the progress bar shows the in-range accent colour
    And no warning is shown

  Scenario: Within 100 kcal over target — still in range
    Given I have consumed between 0 and 100 kcal over my target
    Then the calorie display stays the in-range accent colour
    And the progress bar stays the in-range accent colour
    And no over message is shown

  Scenario: 100–200 kcal over target — amber warning
    Given I have consumed between 100 and 200 kcal over my target
    Then the calorie display turns amber
    And the progress bar turns amber
    And the label says "JUST OVER"
    And the tone feels gentle not punishing

  Scenario: 200–500 kcal over target — amber alert
    Given I have consumed between 200 and 500 kcal over my target
    Then the calorie display turns amber
    And the progress bar turns amber
    And the label says "OVER BY"

  Scenario: 500+ kcal over target — red
    Given I have consumed more than 500 kcal over my target
    Then the calorie display turns red
    And the progress bar turns red
    And the label says "OVER BY"

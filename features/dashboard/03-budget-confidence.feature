Feature: Calorie-budget confidence — exact intake, estimated budget (Separated model)

  Background:
    Given logged food is treated as exact ground truth
    And the maintenance/TDEE energy budget is an estimate that calibrates with weigh-ins

  Scenario Outline: The budget confidence headline reflects TDEE maturity
    Given I have logged "<weighins>" weigh-ins
    Then the calorie summary shows an estimated budget confidence of "<percent>"
    Examples:
      | weighins | percent |
      | 0        | 50%     |
      | 7        | 65%     |
      | 14       | 80%     |
      | 28       | 92%     |

  Scenario: Intake is never shown as estimated
    Given my logged food for today
    Then the consumed-calories figure is presented as exact
    And only the remaining/budget figure carries the estimated label and confidence

  Scenario: A guess-heavy day surfaces a quiet intake flag
    Given more than 20% of today's calories come from low-confidence AI estimates
    When I view the calorie summary
    Then a quiet note says today's intake is mostly AI-estimated, with an approximate confidence
    And the note never appears on a day logged from exact entries

  Scenario: Coaching is independent of the confidence layer
    Given a budget confidence and an intake confidence both exist
    When the coach produces advice
    Then it uses the logged food directly, unqualified by any confidence value
    And it never displays or references confidence scoring

Feature: Edit a logged entry in place

  # Available on both the dashboard today-list and the History day view.
  # Manual editing is open to everyone; AI re-estimate is premium-gated.

  Scenario: Tapping an entry opens an inline editor
    Given I have a food entry in today's log
    When I tap the entry
    Then the row expands into an inline editor in place
    And the name, kcal, protein, carbs and fat fields are pre-filled with the current values
    And no separate modal or screen is opened

  Scenario: Editing values and saving updates the entry
    Given I am editing a logged entry
    When I change the kcal and macro values and tap Save
    Then the entry shows the new values
    And the day's calorie and macro totals recalculate immediately
    And the change persists after reload (and syncs to the cloud for premium users)

  Scenario: Cancelling leaves the entry unchanged
    Given I am editing a logged entry
    When I change some values and tap Cancel
    Then the editor closes
    And the entry keeps its original values

  Scenario: AI re-estimate refreshes the macros from the name (premium)
    Given I am a premium user editing an entry
    And I have corrected the entry's name
    When I tap "AI re-estimate from name"
    Then the kcal and macros are re-estimated from the corrected name
    And an Open Food Facts match overrides the AI figure when its confidence is higher
    And I can still review the values before saving

  Scenario: AI re-estimate is gated for anonymous users
    Given I am an anonymous user editing an entry
    When I tap "AI re-estimate from name"
    Then the PremiumModal appears for the "AI re-estimate" feature
    And the manual fields remain editable without premium

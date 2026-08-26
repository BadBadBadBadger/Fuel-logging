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

  # F4, fixed in v73. The editor filled the fields straight from the AI with no validity
  # check, so a parsed-but-empty response wrote NaN, still said "✓ Updated", and saved the
  # entry as 0 kcal. A silent zero does not only lose the meal — it flows into the day's
  # totals and on into calibration, teaching the app you burn less than you do.
  Scenario: An unreadable AI estimate is refused, never saved as a silent zero
    Given I am a premium user editing an entry
    When I tap "AI re-estimate from name"
    And the AI returns a response with no usable numbers in it
    Then I see "Couldn't estimate that — try rephrasing the name."
    And the button never claims the estimate succeeded
    And the fields keep the values they already had
    And saving afterwards leaves the entry at its original calories, not zero

  Scenario: AI re-estimate is gated for anonymous users
    Given I am an anonymous user editing an entry
    When I tap "AI re-estimate from name"
    Then the PremiumModal appears for the "AI re-estimate" feature
    And the manual fields remain editable without premium

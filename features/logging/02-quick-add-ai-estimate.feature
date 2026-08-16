# ── AI estimate when creating a Quick Add meal (DOCS.md §23 backlog).
# Mirrors EntryEditor's re-estimate exactly: same AI_REESTIMATE_PROMPT + Open Food
# Facts cross-check (AI shown first, OFF a bounded background refinement), premium-gated.
# Lives in MealForm (app.jsx ~L1411), so it also covers the History manual one-off
# entry, which uses the same component. Built + verified on device 2026-06-12 (sw v36
# fixed the vegan-keto "milk" false-fill; estimate now fills or says "Couldn't estimate that").
Feature: AI estimate when creating a Quick Add meal

  Background:
    Given I am creating a new meal in the Quick Add form

  Scenario: The AI estimate button is offered alongside the macro fields
    Given I have typed a meal name but no macros
    Then an "✨ AI estimate from name" button is shown
    And the kcal, protein, carbs and fat fields stay manually editable

  Scenario: Premium user fills the macros from the meal name
    Given I am a premium user
    And I have typed a meal name
    When I tap "✨ AI estimate from name"
    Then the kcal and macros are estimated from the name and fill the fields
    And the AI figure is shown immediately without waiting on Open Food Facts
    And an Open Food Facts match overrides the AI figure when its confidence is higher
    And I can still review and adjust every value before saving

  Scenario: Estimating is blocked until a name is entered
    Given the meal name field is empty
    Then tapping the AI estimate button does nothing

  Scenario: The button reflects its state
    Given I tap the AI estimate button with a valid name
    Then it shows "Estimating…" while the request is in flight
    And on success it shows "✓ Filled — estimate again"

  Scenario: AI is unreachable
    Given the AI request fails or times out
    When I tap the AI estimate button
    Then a gentle inline message reads "Couldn't reach the AI — check your connection and try again."
    And the fields keep whatever values I already had
    And I can still enter the macros by hand and save

  Scenario: AI estimate is gated for anonymous users
    Given I am an anonymous user creating a meal
    When I tap "✨ AI estimate from name"
    Then the PremiumModal appears for the "AI estimate" feature
    And the manual fields remain editable without premium

  Scenario: The button is also offered when editing an existing meal
    Given I am editing an existing Quick Add meal
    Then the "✨ AI estimate from name" button is shown
    And tapping it re-estimates the macros from the meal's current name
    And it behaves identically to the new-meal case (same fill, same gating)

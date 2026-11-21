# Today v2 (design/v2/HANDOVER.md §3 items 7–8, §5, D7, D8, open issue O5).
# Behind the ?ui=v2 flag. v1's today list (features/logging/01) is unchanged.
#
# The v2 meal list has NO per-row buttons. Tapping a row opens it in place into the editor;
# every action lives there. LOG FOOD and QUICK ADD sit above the list.
# Proof: e2e/v2-meals.spec.js
Feature: Tap a meal row to edit it (Today v2)

  Background:
    Given the v2 Today screen is on

  # ── Log buttons (D7) ──────────────────────────────────────────

  Scenario: LOG FOOD and QUICK ADD sit above the meal list
    Then I see LOG FOOD, an amber button with camera, voice and text marks and an "AI" chip (a lock in its place for free users)
    And beside it QUICK ADD, an amber outline with "saved meals" underneath
    And both sit above "EATEN TODAY"

  Scenario: A premium user opens the AI log from LOG FOOD
    Given I am a premium user
    When I tap LOG FOOD
    Then the AI meal log opens

  Scenario: A free user tapping LOG FOOD sees the premium gate
    # As v1 today: the AI log is a premium feature. The button shows a lock mark.
    Given I am a free user
    When I tap LOG FOOD
    Then the premium gate opens
    And the AI meal log does not open

  Scenario: QUICK ADD opens saved meals for everyone
    When I tap QUICK ADD
    Then the Quick Add screen opens

  # ── The list ──────────────────────────────────────────────────

  Scenario: The list shows each meal as a quiet row
    Given I have logged meals today
    Then the header reads "EATEN TODAY" with the item count and the day's kcal, e.g. "3 items · 1,150"
    And each row shows the time, the name, "P 14 · C 72 · F 8" with protein emphasised, and the kcal
    And rows are in the order they were logged
    And no row carries a button of its own
    And under the last row it says "Tap a meal to edit."

  Scenario: An empty day says so in one quiet line
    Given I have logged nothing today
    Then the list says "Nothing logged yet today."
    And there is no "Tap a meal to edit." hint

  # ── The inline editor (D8) ────────────────────────────────────

  Scenario: Tapping a row expands it into an editor in place
    Given I have a meal in today's list
    When I tap its row
    Then the row expands in place, with its time in amber and "EDITING"
    And the NAME, KCAL, PROTEIN, CARBS and FAT fields hold the meal's current values
    And I see Save, Save to Quick Add and Delete
    And below a divider, "Re-estimate from name" with a PRO tag
    And no modal or separate screen opens

  Scenario: Only one row is open at a time
    Given one meal row is open
    When I tap another meal row
    Then that row opens
    And the first row collapses, keeping its stored values

  Scenario: Saving updates the meal and the day
    Given a meal row is open
    When I change its values and tap Save
    Then the row collapses and shows the new values
    And the day's totals update
    And the change persists after reload

  Scenario Outline: Collapsing without saving discards the changes (O5)
    Given a meal row is open
    And I have changed some values
    When I <close it>
    Then the row collapses
    And the meal keeps its original values
    And opening it again shows the original values

    Examples:
      | close it                    |
      | tap the row header          |
      | tap Cancel                  |

  Scenario: Delete removes the meal
    Given a meal row is open
    When I tap Delete
    Then the meal is removed from today's list and from the day's totals

  Scenario: Save to Quick Add keeps the meal for next time
    Given a meal row is open
    When I tap "Save to Quick Add"
    Then the meal, with the values in the editor, is added to my saved meals
    And the button shows a filled bookmark and reads "Saved to Quick Add"
    And it blinks again on every further tap
    And the row stays open, and the logged meal itself is unchanged until I tap Save

  # ── Re-estimate from name (PRO) ───────────────────────────────

  Scenario: A free user tapping Re-estimate sees the premium gate
    Given I am a free user with a meal row open
    When I tap "Re-estimate from name"
    Then the premium gate opens
    And no estimate is requested
    And the fields keep their values

  Scenario: A premium user re-estimates from the name as typed
    Given I am a premium user with a meal row open
    And I have corrected the name
    When I tap "Re-estimate from name"
    Then the button reads "Re-estimating…" while it works
    And then the kcal and macros are refilled from the corrected name and the button reads "Updated"
    And nothing is saved until I tap Save
    # The same prompt and guards as v1 (logging/01, /07): an empty or malformed answer never
    # reads "Updated" and never writes a zero.

  Scenario: A failed re-estimate says so and keeps the fields
    Given I am a premium user with a meal row open
    When I tap "Re-estimate from name" and the estimate cannot be reached
    Then a short message says so
    And the fields keep their values

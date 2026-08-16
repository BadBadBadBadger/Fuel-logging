# Haptic confirmation is app-wide and organised by CRUD: every Create, Update and
# Delete action buzzes. Reads (searches, opening screens, paging History, viewing
# charts) never buzz. One shared helper, feature-detected, called from every
# create/update/delete handler. Code BUILT (haptic() helper wired into every CUD,
# feature-detected). @wip kept on purpose: navigator.vibrate is a silent no-op on
# mobile Chrome / Pixel 7 (confirmed via isolation test), so the behaviour can't be
# verified on the web build. Revisit when packaged for Play (native haptics bridge).
@wip
Feature: Haptic feedback on every Create, Update and Delete

  Scenario Outline: Create actions give a short confirmation vibrate
    Given my device supports the Vibration API
    When I "<create action>"
    Then the device gives a single short confirmation vibrate
    Examples:
      | create action                   |
      | log an AI Log item              |
      | tap a ⚡ quick-add chip          |
      | add a Food Search result        |
      | add a new meal in the meal form |
      | log a weigh-in                  |
      | log a workout                   |
      | redeem a voucher                |

  Scenario Outline: Update actions give a short confirmation vibrate
    Given my device supports the Vibration API
    When I "<update action>"
    Then the device gives a single short confirmation vibrate
    Examples:
      | update action                       |
      | Save an edited log entry            |
      | Save changes to an existing meal    |
      | confirm a daily-target override     |
      | save my profile                     |

  Scenario Outline: Delete actions give a short confirmation vibrate
    Given my device supports the Vibration API
    When I "<delete action>"
    Then the device gives a single short confirmation vibrate
    Examples:
      | delete action                       |
      | remove a logged entry               |
      | delete a quick-add meal             |
      | remove a workout                    |
    # "reset quick-add meals to defaults" was removed from this list on 2026-08-16:
    # the button it referred to was deleted in session 16 (it wiped a whole meal
    # library on one tap). See app.jsx ~L1169.

  Scenario: Read actions do not buzz
    Given my device supports the Vibration API
    When I run a Food Search, open a screen, page between History days, or view a chart
    Then no vibration is given

  Scenario: The vibration is brief, not buzzy
    Given a successful create, update or delete on a supporting device
    Then the vibration is one short pulse (~35ms — long enough for Pixel-class motors to register, still a tick not a buzz)
    And it does not repeat or sustain

  Scenario: Unsupported devices simply do nothing
    Given my device does not support the Vibration API (e.g. iOS Safari)
    When I complete any create, update or delete
    Then the action completes normally with no error
    And no vibration is attempted beyond a safe feature-detected no-op

  Scenario: Haptics never block or delay the action
    Given any create, update or delete, supported or not
    Then the vibrate call is fire-and-forget
    And a thrown or unsupported Vibration API never interrupts the action

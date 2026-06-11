Feature: Sex setting on profile screen

  Scenario: User sets sex on first use
    Given I am on the profile screen for the first time
    Then I see a sex selector
    And the options are "Male" and "Female"
    And the default is not pre-selected
    And a helper text explains "Used to calculate your calorie and macro targets"

  Scenario: Male selected
    Given I have selected Male on the profile screen
    Then the safe minimum calorie floor is 1,400 kcal
    And protein targets use male body composition ratios

  Scenario: Female selected
    Given I have selected Female on the profile screen
    Then the safe minimum calorie floor is 1,200 kcal
    And protein targets use female body composition ratios
    And a note appears "Targets may need adjusting around your cycle — override anytime"

  Scenario: User changes sex setting
    Given I have previously set my sex to Male
    When I change it to Female
    Then all targets recalculate immediately
    And the safe minimum updates accordingly
    And a confirmation shows "Targets updated"

  Scenario: Sex not set
    Given I have not set a sex
    Then the app defaults to male calculations
    And a prompt shows on the profile screen "Set your sex for more accurate targets"


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


Feature: Macro tolerance — forgiving colour logic

  Scenario: Macro within 5g of target — counts as hit
    Given a macro is within 5g of its target in either direction
    Then the macro bar shows the macro's own colour (blue / orange / red-orange)
    And the label does not show red or amber

  Scenario: Macro 5–15g over target — amber
    Given a macro is between 5g and 15g over its target
    Then the macro bar turns amber (#ffb84b)
    And the label turns amber
    And no red is shown

  Scenario: Macro 15g+ over target — red
    Given a macro is more than 15g over its target
    Then the macro bar turns red (#ff5555)
    And the label turns red

  Scenario: Macro under target by any amount — in range
    Given a macro is under its target by more than 5g
    Then the macro bar stays the macro's own colour
    And no warning colour is shown


Feature: Safe minimum calorie guard

  Scenario: Calculated cut target falls below safe minimum for men
    Given a male user's calculated cut target is below 1,400 kcal
    Then the target is overridden to 1,400 kcal
    And a banner warning is shown on the dashboard
    And the warning contains a link that navigates to the profile screen

  Scenario: Calculated cut target falls below safe minimum for women
    Given a female user's calculated cut target is below 1,200 kcal
    Then the target is overridden to 1,200 kcal
    And the same banner warning is shown

  Scenario: Manual target below safe minimum for male
    Given I am male and my safe minimum is 1,400 kcal
    When I manually enter a target below 1,400 kcal
    Then the target is clamped to 1,400 kcal
    And the banner reads "That's below the safe minimum for your body. We've set it to 1,400 kcal to keep you safe."
    And it links to the profile screen

  Scenario: Manual target below safe minimum for female
    Given I am female and my safe minimum is 1,200 kcal
    When I manually enter a target below 1,200 kcal
    Then the target is clamped to 1,200 kcal
    And the same safety banner appears

  Scenario: Target is above safe minimum
    Given a user's calculated target is above the safe minimum
    Then no override occurs
    And no warning is shown


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


# ── Celebration model (agreed 2026-06-11): ONE engine, intensity scales with rarity.
# Daily logging = a quiet chip pop. Badges are the SOLE "something special" authority.
# The old standalone streak-milestone overlay (days 7/14/30/50/100) is REMOVED.
# @wip — specced, not yet built. Replaces the former "Streak celebration animation" feature.
@wip
Feature: Logging celebration — quiet daily, fanfare for the rare

  Background:
    Given badge tiers in ascending order are Bronze, Silver, Gold, Platinum, Diamond, Elite

  Scenario: Daily streak increment is a quiet pop, not an overlay
    Given I have an active streak and have not logged today
    When I log my first meal of the day
    Then the header 🔥 streak chip increments with a brief pop
    And no full-screen overlay appears
    And no celebration sound plays
    And a flag is saved for today so the pop does not repeat

  Scenario: A second log the same day does nothing
    Given today's streak pop has already played
    When I log another meal
    Then the chip does not pop again
    And the meal logs silently

  Scenario: First ever log starts the streak at 1
    Given I have no previous streak
    When I log my first ever meal
    Then the chip appears showing 1 with a pop
    And no full-screen overlay appears

  Scenario: Missed day resets the streak silently
    Given I missed logging yesterday
    When I log a meal today
    Then the streak chip resets to 1
    And no overlay and no punishing message are shown

  Scenario Outline: Celebration intensity scales with how rare the event is
    Given I trigger a "<event>"
    Then the celebration treatment is "<treatment>"
    And the overlay behaviour is "<overlay>"
    Examples:
      | event                          | treatment            | overlay        |
      | daily streak increment         | chip pop             | no overlay     |
      | Bronze or Silver badge earned  | toast + chip glow    | no overlay     |
      | Gold+ badge earned             | full fanfare         | overlay ~2.5s  |

  Scenario: Full fanfare is reserved for Gold tier and above
    Given I earn a badge at Gold, Platinum, Diamond or Elite tier
    When the badge is awarded
    Then a full-screen overlay plays
    And it stays long enough to read the badge name (~2.5 seconds)
    And the relevant number counts up

  Scenario: Low tiers do not trigger a full-screen overlay
    Given I earn a badge at Bronze or Silver tier
    When the badge is awarded
    Then only a toast and a chip glow are shown
    And no full-screen overlay appears

  # Removed by design: the standalone streak-milestone overlay at days 7/14/30/50/100.
  # Badges are now the single source of "something special happened" (app.jsx ~L3048 / ~L3112).


Feature: Weight input sync — weigh-in updates profile weight

  Scenario: Logging a weight via the weigh-in widget updates the profile
    Given I am on the dashboard
    When I enter and save a weight in the weigh-in widget
    Then the profile weight field updates to that value
    And calorie and macro targets recalculate immediately
    And the updated weight persists after a page reload


Feature: Flexible daily calorie target with auto mode detection

  Background:
    Given I have set up my profile with weight, height, sex and body fat %
    And my TDEE has been calculated

  Scenario: First time opening the app — defaults to MAINTAIN
    Given I have never set a custom calorie target
    Then my daily target defaults to my TDEE
    And the mode label shows MAINTAIN

  Scenario: Tapping CUT preset button
    Given I am on the dashboard
    When I tap the CUT button
    Then my daily target sets to TDEE minus 500 kcal
    And the mode label shows CUT
    And any custom target override is cleared

  Scenario: Tapping MAINTAIN preset button
    Given I am on the dashboard
    When I tap the MAINTAIN button
    Then my daily target sets to my TDEE exactly
    And the mode label shows MAINTAIN
    And any custom target override is cleared

  Scenario: Tapping BULK preset button
    Given I am on the dashboard
    When I tap the BULK button
    Then my daily target sets to TDEE plus 500 kcal
    And the mode label shows BULK
    And any custom target override is cleared

  Scenario: Preset buttons deselect after manual override
    Given I have typed a custom kcal number into the target field
    Then none of the preset buttons appears active
    And the mode label updates automatically based on the custom value vs TDEE

  Scenario: Manual target below TDEE — auto CUT
    Given my TDEE is 2,095 kcal
    When I set my target to any value below 2,095
    Then the mode label shows CUT and turns blue

  Scenario: Manual target equal to TDEE — auto MAINTAIN
    Given my TDEE is 2,095 kcal
    When I set my target to 2,095
    Then the mode label shows MAINTAIN and turns green

  Scenario: Manual target above TDEE — auto BULK
    Given my TDEE is 2,095 kcal
    When I set my target to any value above 2,095
    Then the mode label shows BULK and turns orange

  Scenario: Custom target scales all macros proportionally
    Given my CUT targets are protein 144g, carbs 200g, fat 64g at 1,595 kcal
    When I set a custom target of 1,800 kcal
    Then all three macros scale by the factor 1800 ÷ 1595
    And the ratios of protein:carbs:fat as percentages of total calories remain the same

  Scenario: Manual target within 150 kcal below TDEE — slow cut
    Given my TDEE is 2,095 kcal
    When I set my target between 1,945 and 2,094 kcal
    Then the mode label shows CUT
    And a gentle info note appears "Deficit is small — progress will be slow but sustainable 👍"

  Scenario: Manual target within 150 kcal above TDEE — slow bulk
    Given my TDEE is 2,095 kcal
    When I set my target between 2,096 and 2,245 kcal
    Then the mode label shows BULK
    And a gentle info note appears "Small surplus — lean gains but slow 👍"

  Scenario: Aggressive cut — over 750 kcal deficit
    Given my TDEE is 2,095 kcal
    When I set my target below 1,345 kcal
    Then an amber warning appears
    "This is an aggressive deficit. You may lose muscle alongside fat.
    Consider 1,345 kcal or above."
    And saving is not blocked

  Scenario: Very aggressive cut — over 1,000 kcal deficit
    Given my TDEE is 2,095 kcal
    When I set my target below 1,095 kcal
    Then a red warning appears
    "This deficit is not recommended. Extreme cuts cause muscle loss,
    fatigue and metabolic damage. Are you sure?"
    And an inline "Yes, I understand →" confirm button appears
    When the user taps confirm
    Then the warning is dismissed
    And a flag is saved to the user's profile (aggressive_cut_acked)
    And subsequent visits show only an amber reminder, not the red confirm

  Scenario: Custom target persists across sessions
    Given I have set a custom target of 1,800 kcal
    When I close and reopen the app
    Then my target is still 1,800 kcal
    And the mode label still shows the auto-detected mode


Feature: Tap to override daily calorie target

  Scenario: User taps the daily target display
    Given I am on the dashboard
    And my daily target shows e.g. 2,095 kcal
    When I tap the target display
    Then it becomes an inline numeric input
    And the current value is pre-populated ready to type over
    And a numeric keyboard appears on mobile

  Scenario: User types a new target and confirms
    Given the target is in edit mode
    When I type a new number and press Done or Return
    Then the input closes
    And the target updates to the new number
    And the mode label updates automatically
    And relevant warnings appear immediately

  Scenario: User taps away without changing
    Given the target is in edit mode
    When I tap anywhere outside the input
    Then the input closes
    And if I did not change the value the original target is preserved

  Scenario: Edit mode visual treatment
    Given I am looking at the target display
    Then it has a dashed underline indicating it is tappable
    And a small pencil hint (✎) is visible beside it
    And when in edit mode the underline becomes solid and uses the mode colour
    But it does not look like a standard form box

  Scenario: Preset buttons still work after tap-to-edit
    Given I have used tap-to-edit to set a custom value
    When I tap a preset button
    Then the target updates to that preset's value
    And the custom override is cleared
    And the relevant preset button becomes active again


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

Feature: Premium account avatar — Google profile picture with fallback

  Scenario: Premium user with a Google profile picture
    Given I am signed in as a premium user with a profile picture
    Then the header shows my Google profile photo
    And the image request is sent with no referrer so it is not blocked

  Scenario: Profile picture fails to load
    Given I am a premium user whose profile image fails to load
    Then the avatar falls back to the first letter of my name in the accent colour
    And no broken-image icon is shown

  Scenario: Premium user without a picture
    Given I am a premium user with no profile picture
    Then the avatar shows the first letter of my name in the accent colour

  Scenario: Tapping the avatar opens sign-out
    Given I am a premium user
    When I tap the avatar in the header
    Then the sign-out confirmation modal opens

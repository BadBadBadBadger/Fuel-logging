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

  Scenario: Under calorie target — green
    Given I have consumed less than my calorie target
    Then the calorie display shows green
    And the progress bar shows green
    And no warning is shown

  Scenario: Within 100 kcal over target — still green
    Given I have consumed between 0 and 100 kcal over my target
    Then the calorie display stays green
    And the progress bar stays green
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

  Scenario: Macro under target by any amount — green
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


Feature: Streak celebration animation

  Background:
    Given I have an active logging streak

  Scenario: Daily streak animation plays on first meal log
    Given I have not logged any food today
    And the streak animation has not played today
    When I successfully log a meal
    Then a full-screen emoji overlay appears
    And a large 💪 emoji is centred with 🔥 emojis surrounding it
    And the streak number counts up from the previous value to the new value
    And a whoosh sound synthesised via the Web Audio API plays
    And a heavy thud sound follows
    And after 1.5 seconds the overlay fades automatically
    And the streak counter in the header updates
    And a flag is saved to localStorage keyed by today's date
      so the animation does not repeat today

  Scenario: Animation does not repeat the same day
    Given the streak animation flag for today exists in localStorage
    When I log another meal
    Then no animation plays
    And the meal logs silently as normal

  Scenario: Milestone celebration — day 7, 14, 30, 50, 100
    Given today's log completes a milestone streak day
    When I successfully log my first meal of the day
    Then the standard arm animation plays with more flames
    And 🎉🎊 confetti emojis scatter across the screen
    And the milestone number pulses on the arm
    And the screen fades back after 1.5 seconds

  Scenario: Streak starts at day 1 on first ever log
    Given I have no previous streak
    When I log my first ever meal
    Then the animation plays and the number counts from 0 to 1

  Scenario: Missed day resets streak silently
    Given I missed logging yesterday
    When I log a meal today
    Then no streak animation plays
    And the streak counter resets to 1
    And no punishing message is shown


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

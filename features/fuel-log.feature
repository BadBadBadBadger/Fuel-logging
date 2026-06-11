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

  # ⚠️ SUPERSEDED by @wip "Macro targets hold their floors instead of scaling" (below).
  # This documents current (proportional-scaling) behaviour and is TRUE until #7 ships;
  # delete this scenario when the floor-based engine lands. — QA, 2026-06-11
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


# ── AI estimate when creating a Quick Add meal (DOCS.md §23 backlog).
# Mirrors EntryEditor's re-estimate exactly: same AI_REESTIMATE_PROMPT + Open Food
# Facts cross-check (AI shown first, OFF a bounded background refinement), premium-gated.
# Lives in MealForm (app.jsx ~L1411), so it also covers the History manual one-off
# entry, which uses the same component. @wip — specced, not yet built.
@wip
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


# ── Add-feedback polish (DOCS.md §23). Two related parts: a visual repeat-add
# signal (#3) and a haptic confirmation (#4). The repeat-add signal only applies to
# buttons that STAY on screen after an add — AI Log per-item rows (app.jsx ~L2435)
# and the dashboard ⚡ quick-add chips (~L2124). Surfaces that navigate away on add
# (Quick Add list, Food Search) have no second tap to signal and are out of scope.
# @wip — specced, not yet built.
@wip
Feature: Repeat-add feedback — re-blink and count

  Scenario: First tap on an AI Log item confirms the add
    Given I have an analysed meal with separate items in the AI Meal Log
    When I tap an item to log it
    Then the row shows "✓ Added · <item name>"
    And the row briefly pulses to confirm the add

  Scenario: Tapping the same item again logs it again and shows a count
    Given I have already added an AI Log item once
    When I tap the same item again
    Then a second entry is logged
    And the row re-blinks on this tap
    And the label shows a running count "✓ Added ×2"

  Scenario: The count keeps rising on further taps
    Given I have added the same item twice
    When I tap it a third time
    Then a third entry is logged
    And the label shows "✓ Added ×3"
    And each tap produces its own blink

  Scenario: A single add shows no count
    Given I have added an item exactly once
    Then the label shows "✓ Added" with no "×1"

  Scenario: The dashboard quick-add chip re-blinks on repeat add
    Given a quick-add chip on the dashboard
    When I tap it more than once in quick succession
    Then each tap logs the item
    And the ✓ confirmation re-blinks on every tap, not just the first

  Scenario: The per-item count resets when I leave and re-open the AI Log
    Given an AI Log item showing "✓ Added ×3"
    When I leave the AI Meal Log and open it again
    Then the per-item added count has reset
    And the already-logged entries themselves remain saved
    # the count is ephemeral feedback for the current analysis; re-opening starts fresh


# Haptic confirmation is app-wide and organised by CRUD: every Create, Update and
# Delete action buzzes. Reads (searches, opening screens, paging History, viewing
# charts) never buzz. One shared helper, feature-detected, called from every
# create/update/delete handler. @wip — specced, not yet built.
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
      | reset quick-add meals to defaults   |
      | remove a workout                    |

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


# ── Coach intelligence — Track A: "give the coach real context" (DOCS.md §23).
# Both features edit the same CoachCard.gen() prompt (app.jsx ~L1187). Today the
# coach is fed only daily TOTALS and a time LABEL, so (#5) it repeats the same
# foods and re-suggests things you already ate, and (#6) it lets the LLM guess
# whether you're "behind", which misfires early in the day. The fix for both:
# compute the facts and hand them to the model; never let the LLM infer them.
# @wip — specced, not yet built.
@wip
Feature: Coach is state-aware and varies its suggestions

  Background:
    Given I am a premium user with the daily coach on the dashboard

  Scenario: The coach is given today's logged items by name
    Given I have logged eggs and Greek yogurt today
    When the coach generates a tip
    Then the prompt includes the names of what I have logged today
    And the coach does not suggest eggs or Greek yogurt again

  Scenario: Suggestions vary across refreshes
    Given the coach has already given me a suggestion today
    When I tap refresh for a new tip
    Then the new suggestion is meaningfully different from the previous one
    And the coach is told what it already suggested so it does not repeat itself

  Scenario: Variety is valued for its own sake, not just macros
    Given I have hit my protein goal from the same two foods all day
    When the coach suggests something
    Then it favours variety and fibre / gut-health diversity
    And it does not just re-recommend the highest-protein option again

  Scenario: Already-met goals are still respected (existing behaviour preserved)
    Given my protein and water goals are already met
    When the coach generates a tip
    Then it does not suggest more protein or more water
    And it gives those met goals a brief celebratory nod


# @wip — specced, not yet built.
# COACH-HAT REVIEW (2026-06-11): pacing on a calorie tracker is a disordered-eating
# vector, so two safeguarding rules are baked in below: (1) pace only applies to
# FLOOR goals you must reach (protein, water, fibre) — NEVER the calorie ceiling,
# where being "behind" (under) is success, not a failure to fix; (2) the eating
# window is derived from today's first logged meal, not a wall-clock default, so
# fasting / Ramadan / 16:8 users are not falsely told they're "behind". Nudge copy
# stays gentle — no "catch up" urgency.
@wip
Feature: Coach paces advice to the time of day

  # Pace is COMPUTED, not judged by the LLM. The eating window starts at today's
  # first logged meal (not a wall-clock default), giving % elapsed; each FLOOR goal
  # gives its own % progress. The verdict (ahead / on / behind) is handed to the prompt.

  Background:
    Given I am a premium user with the daily coach on the dashboard

  Scenario: Low totals early in the day are not "behind"
    Given it is 07:00 and I have logged 62g of a 147g protein goal
    When the coach generates a tip
    Then it does not tell me I am behind on protein
    Because almost none of the eating window has elapsed yet

  Scenario: Ahead of pace is recognised as ahead
    Given it is 10:00 and I have logged 79g of a 146g protein goal
    When the coach generates a tip
    Then the pace verdict handed to it is "ahead of pace"
    And the coach does not nag me to catch up

  Scenario: Genuinely behind late in the day gets a gentle nudge
    Given it is 20:00 and I have logged only 40g of a 150g protein goal
    When the coach generates a tip
    Then the pace verdict is "behind"
    And the coach gives a gentle, non-punishing nudge

  Scenario: Pace is computed and handed to the model, never inferred by it
    Given the coach prompt is being built
    Then it includes, per goal, the % of the eating window elapsed versus the % of the goal hit
    And it includes an explicit pace verdict (ahead / on / behind)
    And the LLM is instructed to use that verdict, not to judge pace itself

  Scenario: Before the window meaningfully starts, "behind" is never used
    Given less than a quarter of the eating window has elapsed
    Then no metric is ever described as "behind"
    And the tone assumes the day is just getting going

  # ── Safeguarding rules from the coach-hat review ──

  Scenario: The calorie ceiling is never paced as "behind"
    Given I am in cut or maintain mode and under my calorie target
    When the coach generates a tip
    Then being under calories is never described as being "behind"
    And the coach never urges me to eat more to "catch up" on calories
    And pace applies only to floor goals I am meant to reach (protein, water, fibre)

  Scenario: A fasting or late-start eating window is not falsely paced
    Given I have not logged any food yet today
    When the coach generates a tip
    Then no goal is described as "behind"
    Because the eating window only starts once I have actually eaten

  Scenario: Pace nudges stay gentle and point at a food choice, not urgency
    Given a floor goal is genuinely behind late in the day
    When the coach nudges me
    Then it suggests a specific food choice to round the day out
    And it uses no "catch up" urgency, no punishment, and no shame framing

  Scenario: Variety never outranks an unmet protein floor
    Given my protein floor is still unmet late in the day
    When the coach makes a suggestion
    Then meeting the protein floor takes priority over variety
    And variety is only a tiebreaker once the floor is met


# ── Macro target engine — steady protein floor, protected fat floor (DOCS.md §23 #7).
# Consumes the coach-hat decisions (2026-06-11):
#   • protein = a flat g/kg-LEAN-MASS floor held across ALL modes (male 2.2 / female 2.0)
#     so it stops fluctuating on a cut/maintain/bulk switch (the "eggy farts" bug);
#   • fat stays mode-varying but never below a 0.6 g/kg-BODYWEIGHT hormonal floor;
#   • carbs absorb the entire deficit/surplus;
#   • if a target is too low to fit both floors + minimum carbs, WARN — never silently
#     break a floor.
# Replaces per-mode protein variation in calcTargets (app.jsx:142) AND the proportional
# scaling in the custom-target path (app.jsx:3517) with ONE unified floor-based engine.
# EXACT NUMBERS (the 2.2/2.0 coefficients, the 0.6 floor, the carb formula, the warning
# threshold) are owned by __tests__/logic.test.js — these scenarios assert the
# user-visible BEHAVIOUR only, so they survive a coefficient tweak. @wip — not built.
@wip
Feature: Macro targets hold their floors instead of scaling

  Background:
    Given my profile has weight, height, sex and body fat % set

  Scenario: Protein does not fluctuate when I switch mode
    Given I am viewing my protein target in maintain mode
    When I switch to cut and then to bulk
    Then my protein target is the same in every mode
    And I am never asked to eat more protein just for changing mode

  Scenario: The protein floor still differs by sex
    Given a man and a woman with the same lean body mass
    Then the man's protein floor is higher than the woman's
    # exact g/kg-LBM coefficients (male 2.2 / female 2.0) are asserted in logic.test.js

  Scenario: Fat is never scaled below its hormonal floor on an aggressive cut
    Given my cut target sets fat at its normal mode value
    When I type a custom calorie target well below my cut target
    Then my fat target is not dragged below the 0.6 g/kg-bodyweight floor
    # the original bug: proportional scaling at app.jsx:3517 pulled fat under the floor

  Scenario: Carbs absorb a change in calorie target
    Given my protein and fat targets are at their floors
    When I raise or lower my calorie target
    Then protein and fat hold at their floors
    And carbs move to absorb the whole difference

  Scenario: Fat stays mode-varying above the floor
    Given I am in cut mode
    When I switch to bulk
    Then my fat target rises, because there are more calories to spare on a bulk
    But it never drops below the 0.6 g/kg floor in any mode

  Scenario: Preset and custom targets obey the same floors
    Given I reach the same calorie number once via a preset and once by typing it
    Then the protein and fat floors apply identically in both cases

  Scenario: A target too low to fit the floors warns instead of breaking one
    Given a calorie target too low to fit the protein floor, fat floor and minimum carbs
    When the targets are calculated
    Then no floor is silently broken
    And a warning explains the target is too low to hit my protein and fat floors
    # DRAFT copy — confirm wording against the SAFE_MIN banner voice:
    # "This target's too low to hit your protein and fat floors. We've kept your floors,
    #  so your macros add up to a bit more than this number."


# ── Dietary requirements + allergies (DOCS.md §23 #8). Decisions (2026-06-11):
#   • Input = hybrid tag/combobox in the profile/config screen: a free-text field that
#     surfaces selectable suggestions (diet type + the regulated 'Big 14' allergens) and
#     also lets the user commit a CUSTOM tag the app didn't suggest.
#   • These feed EVERY AI food prompt (AI Log parse, AI re-estimate, Quick Add #2
#     estimate, and the daily coach).
#   • Allergens = HARD filter, enforced two ways (coach-hat call): (1) injected into the
#     prompt as the primary filter, AND (2) a zero-token client-side scan of the AI's
#     OUTPUT that hides/flags any suggestion naming a declared allergen — pre-set or
#     custom. The scan reads text already returned, so it costs no extra tokens/calls.
#   • Diet type = hard filter (never suggest off-diet food). Dislikes = SOFT preference
#     (avoid when possible; not a safety claim).
# Allergen backstop scan + prompt-building are pure logic → covered in logic.test.js.
# @wip — specced, not yet built.
@wip
Feature: Dietary requirements and allergies steer every AI suggestion

  Background:
    Given I am on the profile / config screen

  Scenario: Entering dietary needs as tags with suggestions
    When I type in the dietary field
    Then it surfaces selectable suggestions for diet type and the common allergens
    And I can pick a suggestion or commit my own custom tag
    And my diet type, allergens and dislikes persist after a reload

  Scenario: Diet type is a hard filter on AI suggestions
    Given I have set my diet type to vegan
    When any AI feature suggests a food
    Then it never suggests meat, fish, dairy or eggs

  Scenario: Dislikes are a soft preference, not a hard filter
    Given I have listed coriander as a dislike
    When the coach suggests food
    Then it avoids coriander where it reasonably can
    But an occasional appearance is a preference miss, not a safety failure

  Scenario: A declared allergen is never surfaced — primary filter
    Given I have declared a peanut allergy
    When any AI feature generates food suggestions
    Then the declared allergens are included in the prompt as a hard exclusion
    And no suggestion contains a declared allergen

  Scenario: The output backstop catches an allergen the model slips through
    Given I have declared a peanut allergy
    And the AI response names a food containing peanuts despite the prompt
    Then a client-side scan detects the declared allergen in the output
    And that suggestion is hidden or flagged before I ever see it
    And the scan uses no extra API call or tokens

  Scenario: Custom allergen tags are filtered too, not just the presets
    Given I have added a custom allergen tag "celeriac" that the app did not suggest
    When any AI feature generates food suggestions
    Then "celeriac" is excluded by the prompt and caught by the output scan
    And it is treated exactly like a pre-set allergen

  Scenario Outline: The allergen filter applies on every AI food surface
    Given I have a declared allergen
    When the "<surface>" produces or estimates food
    Then the declared allergen is never surfaced to me
    Examples:
      | surface                       |
      | daily coach suggestion        |
      | AI Meal Log item breakdown    |
      | AI re-estimate from name      |
      | Quick Add AI estimate         |

  Scenario: No dietary config means no constraints (no regression)
    Given I have set no diet type, allergens or dislikes
    When any AI feature suggests food
    Then it behaves exactly as it does today
    And no empty exclusions are injected into the prompt

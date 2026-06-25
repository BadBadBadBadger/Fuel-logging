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
# Shipped v6.5 (2026-06-12). Replaces the former "Streak celebration animation" feature.
Feature: Logging celebration — quiet daily, fanfare for the rare

  Background:
    Given badge tiers in ascending order are Bronze, Silver, Gold, Platinum, Diamond, Elite

  Scenario: Daily streak increment is a quiet pip in the thumb zone, not an overlay
    Given I have an active streak and have not logged today
    When I log my first meal of the day
    Then a quiet 🔥 streak pip appears near the bottom, where I am logging
    # the header chip is usually scrolled off when logging, so the pip carries the moment
    And the header 🔥 streak chip also increments
    And no full-screen overlay appears
    And no celebration sound plays
    And a flag is saved for today so the pip does not repeat

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
      | daily streak increment         | thumb-zone pip       | no overlay     |
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


# ── Add-feedback polish (DOCS.md §23). Two related parts: a visual repeat-add
# signal (#3) and a haptic confirmation (#4). The repeat-add signal only applies to
# buttons that STAY on screen after an add — AI Log per-item rows (app.jsx ~L2435)
# and the dashboard ⚡ quick-add chips (~L2124). Surfaces that navigate away on add
# (Quick Add list, Food Search) have no second tap to signal and are out of scope.
# Built + verified on device 2026-06-11.
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
# Built + verified on device 2026-06-11.
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


# Built + verified on device 2026-06-11 (coach avoided re-suggesting logged foods).
# COACH-HAT REVIEW (2026-06-11): pacing on a calorie tracker is a disordered-eating
# vector, so two safeguarding rules are baked in below: (1) pace only applies to
# FLOOR goals you must reach (protein, water, fibre) — NEVER the calorie ceiling,
# where being "behind" (under) is success, not a failure to fix; (2) the eating
# window is derived from today's first logged meal, not a wall-clock default, so
# fasting / Ramadan / 16:8 users are not falsely told they're "behind". Nudge copy
# stays gentle — no "catch up" urgency.
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
# user-visible BEHAVIOUR only, so they survive a coefficient tweak.
# Built + verified on device 2026-06-12 (low custom target → "FLOORS KEPT" warning shown).
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
# Built + verified on device 2026-06-12 (declared dairy allergen → milk log flagged ⚠️).
Feature: Dietary requirements and allergies steer every AI suggestion

  Background:
    Given I am on the profile / config screen

  Scenario: Entering dietary needs as tags with suggestions
    When I type in the dietary field
    Then it surfaces selectable suggestions for diet type and the common allergens
    And I can pick a suggestion or commit my own custom tag
    And my diet type, allergens and dislikes persist after a reload

  # Shipped v6.3, device-verified 2026-06-12 (resolveTag, logic.test.js).
  # SAFETY: typing the singular must resolve to the canonical preset, or the allergen
  # synonym expansion (tree nuts → almond, walnut, cashew…) used by the output scan is
  # silently lost, weakening the hard allergy filter.
  Scenario: Typing an allergen and pressing Enter selects the matching preset
    Given I am entering allergies
    When I type "tree nut" and press Enter
    Then the committed tag is the preset "tree nuts", not a custom "tree nut"
    And it carries the full synonym expansion used by the output scan

  Scenario: An exact typed match commits as the canonical preset
    When I type "milk" and press Enter
    Then the committed tag is the preset "milk"
    And no near-duplicate custom tag is created

  Scenario: Ambiguous typed text is left as a custom tag
    When I type text that matches more than one allergen suggestion
    And I press Enter
    Then it is committed exactly as I typed it

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


# Shipped v6.3, device-verified 2026-06-12 (round-trips + MeasureField seed/build in
# logic.test.js). Storage is ALWAYS metric (kg/cm); units are a per-device display
# preference, never synced. Weight and height are chosen INDEPENDENTLY — UK users
# routinely mix (e.g. height in cm, weight in stone).
Feature: Independent metric / imperial display units

  Background:
    Given I am on the profile screen

  Scenario: Body stats default to metric
    Then weight is shown in kilograms and height in centimetres

  Scenario: Weight and height units are chosen independently
    When I set weight to stones-and-pounds
    And I set height to centimetres
    Then weight reads in stone and pounds while height stays in centimetres

  Scenario Outline: Weight is displayed in the chosen weight unit
    Given my stored weight is 80 kg
    When I set the weight unit to "<unit>"
    Then my weight reads "<shown>"
    Examples:
      | unit  | shown      |
      | kg    | 80 kg      |
      | st    | 12 st 8 lb |
      | lb    | 176.4 lb   |

  Scenario Outline: Height is displayed in the chosen height unit
    Given my stored height is 178 cm
    When I set the height unit to "<unit>"
    Then my height reads "<shown>"
    Examples:
      | unit  | shown     |
      | cm    | 178 cm    |
      | ftin  | 5 ft 10 in|
      | in    | 70 in     |

  Scenario: Switching units without editing never changes my stored data
    Given my stored weight is 80 kg and my stored height is 178 cm
    When I change weight and height units without editing any field
    Then my stored weight is still exactly 80 kg and my stored height 178 cm

  # ── Zero handling: a 0 has CONTEXT. The blank-vs-show decision is made once, at
  # the whole-measurement level — never per digit. A 0 may appear only as a real
  # sub-part of a measurement the user has actually set (the inches in 5 ft 0 in,
  # the pounds in 12 st 0 lb); a never-set or fully-cleared field is blank, with a
  # placeholder, and shows no 0 anywhere. Single-unit fields (kg, cm, lb, in) have
  # no meaningful 0, so they are simply blank when empty.

  Scenario: A genuine zero in a compound weight is shown (12 st 0 lb)
    Given my stored weight is 76.2 kg
    When I view weight in stones-and-pounds
    Then the stone box reads "12" and the pounds box reads "0"

  Scenario: A genuine zero in a compound height is shown (5 ft 0 in)
    Given my stored height is 152 cm
    When I view height in feet-and-inches
    Then the feet box reads "5" and the inches box reads "0"

  Scenario: An unset measurement shows blank boxes, never a zero
    Given I have not set my height
    Then every height box is blank with a placeholder
    And no box shows "0"

  Scenario: An empty single-unit field shows blank, not zero
    Given I have cleared my weight while the unit is kilograms
    Then the weight box is blank, not "0"

  # Regression (was: clear → unit switch left a stuck, undeletable "0"). The fix
  # turns on whether the measurement has data, so the two halves below differ only
  # by whether a real value remains.
  Scenario: Clearing a field leaves it blank while I keep editing
    Given I am editing my height and I have cleared the field
    Then the box stays blank and I can type straight in, with no zero to delete first

  Scenario: Switching units on a CLEARED value keeps the boxes blank
    Given I have cleared my height so it holds no value
    When I switch the height unit from centimetres to feet-and-inches
    Then the feet and inches boxes are blank, not "0"

  Scenario: Switching units on a REAL value reveals its genuine zero
    Given my stored height is 152 cm
    When I switch the height unit from centimetres to feet-and-inches
    Then the inches box reads "0", because 152 cm is exactly 5 ft 0 in
    And that zero belongs to a real record, so it is shown

  Scenario: A cleared sub-field re-shows its zero only once it is a committed record
    Given my height is 5 ft 10 in
    When I clear the inches box and leave it empty
    Then the inches box stays blank while I am editing
    But on returning to the screen the inches box reads "0", as the height is now 5 ft 0 in

  Scenario: Editing in any unit is saved back as metric
    Given the weight unit is pounds
    When I enter my weight as 176 pounds
    Then the value persisted is the equivalent in kilograms
    And switching back to pounds still reads 176 lb

  Scenario: The weight unit is applied consistently on every weight surface
    Given I have set the weight unit to stones-and-pounds
    Then the profile, the weigh-in widget and the weight trend all use it
    # the trend chart axis plots a single number, so stone mode charts in pounds

  Scenario: Each unit choice persists across sessions
    Given I have set weight to pounds and height to feet-and-inches
    When I reload the app
    Then both unit choices are unchanged

  Scenario: Logging a weigh-in in an imperial unit stores metric
    Given the weight unit is stones-and-pounds
    When I log today's weight as 12 stone 8 pounds in the weigh-in widget
    Then the weigh-in is stored in kilograms
    And the weekly trend is shown in pounds per week


# ── Appearance / theme (agreed 2026-06-12): ONE warm "ink-on-paper" light theme
# mirrors the existing dark "cream-on-near-black" theme — same app, gravity flipped.
# Default FOLLOWS THE DEVICE (prefers-color-scheme). A 3-way control in the Profile/⚙️
# screen — 🌙 Dark · ☀️ Light · 🖥 System — lets the user override the device, and
# "System" re-delegates to it (and follows live OS changes). Storage is metric-style
# per-device: the choice is never synced. Full token spec + AA contrasts in DOCS.md §35.
# Shipped v6.4 (2026-06-12). One scenario — "System mode follows a live device change" —
# relies on prefers-color-scheme firing mid-session in the installed PWA; confirm on-device.
Feature: Appearance — light, dark or system theme

  Background:
    Given the theme options in the Profile screen are 🌙 Dark, ☀️ Light and 🖥 System
    And the default for a fresh install is System

  Scenario Outline: A fresh install follows the device appearance
    Given I have never chosen a theme
    And my device appearance is "<device>"
    When I open the app
    Then the app renders in the "<rendered>" theme
    And the System option is shown as active
    Examples:
      | device | rendered |
      | dark   | dark     |
      | light  | light    |

  Scenario Outline: A manual choice overrides the device
    Given my device appearance is "<device>"
    When I choose the "<choice>" theme in the Profile screen
    Then the app renders in the "<rendered>" theme regardless of the device
    And the "<choice>" option is shown as active
    Examples:
      | device | choice | rendered |
      | dark   | Light  | light    |
      | light  | Dark   | dark     |
      | light  | Light  | light    |
      | dark   | Dark   | dark     |

  Scenario: Choosing System re-delegates to the device
    Given I had manually chosen the Light theme
    And my device appearance is dark
    When I choose the System theme
    Then the app renders in the dark theme
    And the System option is shown as active

  Scenario: System mode follows a live device change
    Given my chosen theme is System
    And the app is rendering in light because my device is light
    When my device switches to dark while the app is open
    Then the app switches to the dark theme without a reload

  Scenario: A manual choice ignores a live device change
    Given I have manually chosen the Light theme
    When my device switches to dark while the app is open
    Then the app stays in the light theme

  Scenario: The chosen theme persists across sessions
    Given I have chosen the Dark theme on a light device
    When I reload the app
    Then the app still renders in the dark theme
    And the theme choice is not synced to other devices

  Scenario: Switching theme recolours the whole app at once
    Given I am viewing the dashboard
    When I switch from dark to light
    Then the background, cards, text, calorie ring, mode colours and status pills all update together
    And no element is left in the previous theme

  Scenario: Accent-coloured controls stay legible in both themes
    Given the accent fills primary buttons and forms the calorie ring
    When I view a primary button in either theme
    Then the text on the accent button stays readable
    # guards the role-overload trap: dark text on a cream button (dark) must become
    # light text on a coal button (light) — never accent-on-accent

  Scenario Outline: Text and key UI meet WCAG AA contrast in both themes
    Given the "<theme>" theme is active
    Then body and label text meet at least 4.5:1 contrast against their background
    And status colours for CUT, BULK, MAINTAIN, warnings and over-target meet AA
    Examples:
      | theme |
      | dark  |
      | light |


# ── Data integrity + confidence (bugfix, 2026-06): meal ELEMENTS are the source of
# truth; the coach/totals never read truncated UI strings. Energy budget is ESTIMATED
# (own confidence); logged food is exact. Confidence model = "Separated" (DOCS §35-ish).
# @wip — built, device-verification pending.
@wip
Feature: Meal data integrity — structured elements are the source of truth

  Scenario: Logging a multi-element meal as one entry preserves every element
    Given I describe a meal with several elements (ham, egg, salad, chicken)
    When I log them all as a single meal
    Then the entry stores each element in full structured form (name + kcal + macros)
    And the stored entry name keeps my full description
    But no element data is lost to a truncated or summarised string

  Scenario: The coach reads structured elements, never the display string
    Given a logged meal whose display name is long and visually truncated
    When the nutrition coach generates advice
    Then it reads the meal's stored elements (names + per-element kcal and macros)
    And it never infers meal composition from the truncated UI text

  Scenario: Daily totals come only from persisted structured data
    Given meals are stored with per-element macros
    When daily totals are computed
    Then the totals are summed from the persisted values
    And are unaffected by any UI grouping or summarisation

  Scenario: Elements persist to the cloud for premium users
    Given I am signed in and log a multi-element meal
    When the entry syncs
    Then the elements and the meal's estimation confidence are stored in the backend
    # requires the food_logs.elements (jsonb) + food_logs.conf columns — run the migration first


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


# ── AI meal capture: text · voice · photo + confidence follow-ups (v6.7) ──────
# Folded in from features/ai-capture.feature once built. Decisions (thresholds,
# question bank, cap, report path) locked 2026-06-25 by coach + launch hats; see
# DOCS.md §37 v6.7. Gating reuses the existing premium entitlement + worker cap —
# no bespoke gate. @wip — built, device-verification pending (same as v6.6).
@wip @ai-capture
Feature: AI meal capture via text, voice, or photo

  Background:
    Given I am a premium user on the AI Meal Log screen
    And the screen shows a meal description field, an Analyse button, and inline
      microphone and photo buttons

  Scenario Outline: All three inputs converge on one editable, saveable estimate
    When I provide a meal by <input>
    And the AI returns a high-confidence estimate
    Then I see an editable estimate listing each element with its macros
    And no follow-up questions are shown
    And I can save the meal to my log
    Examples:
      | input                      |
      | typing the description     |
      | dictating the description  |
      | photographing the plate    |

  Scenario: Dictation runs on-device and only the transcript is used
    Given the browser supports on-device speech recognition and mic permission is granted
    When I tap the microphone and speak my meal
    Then the transcript appears in the description field
    And no audio leaves the device
    And I can edit the transcript before I tap Analyse

  Scenario: Voice degrades gracefully when unsupported or denied
    Given the browser lacks speech recognition, or microphone permission is denied
    Then the microphone button is not shown
    And I can still type or photograph the meal

  Scenario: A photographed meal is held only in memory and never stored
    When I photograph my meal and analyse it
    Then the image is downscaled and held in memory only
    And the saved record contains no image and no audio
    And the image is discarded when I save or leave the screen

  Scenario: Camera access degrades gracefully
    Given camera access is not granted
    Then I can still pick an existing image, or type or dictate the meal
    And the rest of the logging flow is unaffected

  Scenario: A low-confidence estimate asks at most two skippable chip questions
    When the meal's kcal-weighted confidence is below 80%
    Then I am asked no more than 2 follow-up questions, each answered by a chip
    And a Skip option is always available
    And the questions target the highest-impact unknowns first

  Scenario: Answering a follow-up refines the estimate without lowering confidence
    Given a follow-up question is shown for an element
    When I tap a chip answer
    Then that element's estimate is refined
    And its confidence is at or above its previous level

  Scenario: Skipping follow-ups logs the meal at its lower confidence
    Given follow-up questions are shown
    When I tap Skip
    Then the estimate is kept at its current, lower confidence
    And I can save the meal

  Scenario: The saved record carries numbers and answers, not media
    When I save an AI-estimated meal
    Then the record stores its elements, macros, follow-up answers, and a source flag
    And it is flagged by capture source as text, voice, or photo
    And it contains no image and no audio

  Scenario: AI-estimated days cannot silently retrain TDEE
    Given recent days include low-confidence AI-estimated intake
    When calibration runs
    Then each day's intake is weighted by its confidence
    And near-guess days below 50% confidence are dropped from the calculation

  Scenario: Reaching the daily AI cap degrades gracefully
    Given I have reached the existing per-user daily AI cap
    When I attempt an estimate
    Then I am shown a clear daily-limit message
    And I am offered manual entry
    And the input I captured is not lost

  Scenario: I can report an estimate as wrong
    Given I am reviewing an AI estimate
    When I tap "Report estimate as wrong"
    Then a prefilled report opens containing the description and the numbers only
    And it contains no account data

# ─────────────────────────────────────────────────────────────
# 🗄️ SHELVED 2026-08-09 (founder). Energy-safety workstream, file 5 of 5.
#
# NOT a to-do. Do not start building this, and do not treat it as an unpaid
# debt. It was designed when it was the only thing standing between a user and
# an open-ended deficit; Steps 4, 02, 03 and 04 now cover every risk it watched
# for — structurally, without asking the user anything — and its one unique
# line ("worth talking to a doctor") already lives in the hard break prompt.
# The accepted loss, and the evidence from real usage that would justify
# reopening it, are in ENERGY_MODEL.md §5.5. What follows is the record of a
# decided design, kept so the thinking isn't lost. It is not a plan.
#
# WHY: The app has no concept of the SYMPTOMS of under-fuelling. A user can
# grind a deficit for months while libido, mood, sleep and recovery quietly
# fall. This adds a lightweight, optional symptom check and a clear
# "see a healthcare professional" signpost. It SCREENS and SIGNPOSTS; it
# never diagnoses and never manages a medical condition.
#
# EVIDENCE (coach hat, tiered) — this affects BOTH SEXES:
#   • WELL-ESTABLISHED: sustained low energy availability suppresses the
#     hypothalamic–pituitary–gonadal (HPG) axis → lower sex hormones in
#     everyone (RED-S consensus, Mountjoy et al., BJSM 2014/2018/2023).
#   • WOMEN: reduced LH/FSH pulsatility → hypo-oestrogenism → functional
#     hypothalamic amenorrhoea, low libido, vaginal dryness, bone loss. This
#     is the ORIGINAL energy-availability research (Loucks; the female
#     athlete triad) — the female side is if anything better-evidenced.
#   • MEN: reduced testosterone → low libido, erectile dysfunction. Natural
#     bodybuilding prep pushes testosterone toward hypogonadal ranges,
#     recovering post-comp over months (Fagerberg 2018, IJSNEM).
#   • NOT SEX-SPECIFIC: low libido from under-fuelling occurs in both sexes,
#     and RED-S prevalence is comparable across sexes — so the check and its
#     escalation must be sex-neutral. (RED-S endocrine review across males
#     and females, Hormones/Springer 2020.)
#   • HARD LINE (coach persona Safeguarding): endocrine / disordered-eating
#     symptoms are BEYOND what an app should manage → "see a healthcare
#     professional" without hedging. This file encodes that boundary.
#
# ── NUMBERS CONTRACT ─────────────────────────────────────────
#   No derived kcal outputs live here. The figures are POLICY CONSTANTS, owned
#   by __tests__/logic.test.js so a tweak doesn't touch these scenarios:
#       LEA_WEEKS_TO_PROMPT    = 3 consecutive under-eating weeks before a check
#       LEA_MIN_LOGGED_DAYS    = 4 logged days for a week to count either way
#       LEA_COOLDOWN_DAYS      = 14 before the offer may reappear (matches the
#                                weigh-in nudge cooldown — one voice, one rhythm)
#       FLAG_THRESHOLD         = 2 selected symptoms escalates to break + pro
#   "The floor" below always means the STEADY-LOSS floor built in Step 4
#   (file 01): 75% of believable maintenance + the applied training bonus.
#
# ── THE TRIGGER — DECIDED 2026-08-07 (was left open at the Step 4 build) ─────
#   An "under-eating week" = a week whose AVERAGE logged intake sits at or below
#   my steady-loss floor, counted only if the week has >= LEA_MIN_LOGGED_DAYS
#   logged days. Unlogged days are EXCLUDED from the average, never counted as
#   zero. LEA_WEEKS_TO_PROMPT such weeks in a row offers the check.
#
#   Why this and not the alternatives:
#   • NOT "weeks the low-fuel note fired". That note is lean-body + training-day
#     only (file 01). The founder's own harm case — 30% body fat, months of
#     continuous deficit, measured low testosterone — would NEVER have fired it.
#     Screening off it would miss exactly the person this workstream exists for.
#     RED-S is sex-neutral AND body-composition-neutral; the trigger must be too.
#   • NOT "weeks spent cutting". Time in a deficit is files 02/03's business
#     (cut-cycling, diet break). A well-fuelled cut is not a welfare concern, and
#     firing a symptom check at every cutter is the wallpaper failure again.
#   • WEEKLY AVERAGE, not single days — the same trend-not-a-day logic the app
#     already applies to weight. One light day is normal life.
#   • MINIMUM LOGGED DAYS, and gaps excluded rather than zeroed. Someone who
#     stops logging has not been shown to be under-eating; zero-filling would
#     aim the heaviest screen in the app at the least-engaged user, which is both
#     wrong and punitive. Under-logging is a data gap, not a symptom.
#
#   NOTE: energy availability itself never moves a target — it is a warning shown
#   only to lean bodies on days they trained (file 01, ENERGY_MODEL §5.1). This
#   file's name is about the SYMPTOMS it screens for, not a threshold it reads.
#
# ── ONE TERM, ONE MEANING (naming collision, resolved) ───────────────────────
#   "Low on fuel today" is the app's SINGLE-DAY, lean-body-only note from file 01.
#   This file never uses that phrase. Here the condition is "UNDER-EATING" — weeks
#   of average intake below the floor, any body. Two different signals, two names.
#   Core symptom set (sex-neutral, reviewable): low libido/sex drive, persistent
#   low mood, poor sleep, feeling cold often, stalled/declining strength or
#   recovery, getting ill or injured often. PLUS one profile-relevant physical
#   sign (see the sex-relevant-sign scenario) — a physiological marker, not a
#   bias in WHO gets flagged.
#   FIXATION_PATTERN (observable; exact thresholds owned by logic.test.js) = any
#   of: repeatedly setting a manual target below the steady-loss floor; logging
#   intake below that floor for many consecutive days; weighing in many times per
#   day; repeatedly dismissing diet-break prompts while still under-eating.
# ─────────────────────────────────────────────────────────────

Feature: Low-energy-availability symptom check and healthcare-professional signposting

  Scenario: A symptom check is offered after a long stretch of under-eating
    Given my average logged intake has sat at or below my steady-loss floor for LEA_WEEKS_TO_PROMPT (3) consecutive weeks
    And each of those weeks has at least LEA_MIN_LOGGED_DAYS logged days
    When I open the dashboard
    Then I see a calm, optional prompt "Quick check-in: how are you feeling?"
    And I can tap "Do the 30-second check" or "Not now"
    And after tapping "Not now" I can still log food and use every other feature

  Scenario: A week is judged on its average, not on its lightest day
    Given one day this week was well below my steady-loss floor
    And the week's average logged intake is above my floor
    When the app checks whether to offer the well-being check
    Then this week does not count as an under-eating week
    # One light day is normal life — the same trend-not-a-day logic used for weight.

  Scenario: Days I did not log are excluded, never counted as zero
    Given I logged only two days this week and ate nothing into the app on the others
    When the app checks whether to offer the well-being check
    Then the unlogged days are left out of the average entirely
    And the week counts neither for nor against me, because it is below LEA_MIN_LOGGED_DAYS
    # Under-logging is a data gap, not a symptom. Zero-filling would aim the
    # heaviest screen in the app at the least-engaged user.

  Scenario: Declining the offer is respected for a fortnight
    Given I tapped "Not now" on the well-being check offer
    When I keep under-eating over the following days
    Then the offer does not reappear for LEA_COOLDOWN_DAYS (14) days
    And nothing else about the app changes in the meantime

  Scenario: A well-fuelled cut is never screened
    Given I have been in "Cut" mode for many consecutive weeks
    And my average logged intake has stayed above my steady-loss floor throughout
    When I open the dashboard
    Then no well-being check is offered
    # Time spent cutting is files 02/03's business. A fed cut is not a welfare concern.

  Scenario: The symptom check is a short, non-clinical, sex-neutral set of taps
    Given I have opened the well-being check
    Then I see a short list of yes/no items including "Low sex drive lately"
    And the list includes "Low mood or motivation"
    And the list includes "Sleeping badly"
    And the list includes "Feeling cold a lot"
    And the list includes "Strength or recovery going backwards"
    And I can select as many or as few as apply
    And a line at the top reads "This is a wellbeing check, not a diagnosis"

  Scenario Outline: The check adds the physical sign relevant to my body
    Given my profile sex is "<sex>"
    When I open the well-being check
    Then the list also includes "<physical_sign>"

    # A physiological marker shown to whom it applies — NOT a difference in who gets flagged.
    Examples:
      | sex    | physical_sign                         |
      | Female | Periods stopped, lighter or irregular |
      | Male   | Weaker or fewer morning erections     |

  Scenario: Reaching the flag threshold recommends a break and a healthcare professional
    Given I complete the well-being check with FLAG_THRESHOLD (2) or more items selected
    Then I see a summary "These can be signs your body needs more fuel"
    And the summary recommends "Take a diet break at maintenance" as the first action
    And the summary shows a clear line "If this persists, please see a healthcare professional"
    And a "Start a diet break" button is offered inline

  Scenario: Flagging low sex drive escalates the healthcare-professional message for anyone
    Given I select "Low sex drive lately" in the well-being check
    When I see the summary
    Then the healthcare-professional signpost appears as a full-width highlighted line at the top of the summary
    And the copy says "Under-fuelling can lower the sex hormones behind drive and energy in any body — worth checking with a healthcare professional"
    And the summary shows no hormone figure and no treatment or supplement offer
    And the message and its prominence are the same regardless of my sex

  Scenario: The check respects the no-friction and no-fixation principles
    Given I have completed a well-being check today
    When I return to the dashboard later the same day
    Then I am not asked to repeat the check
    And no running tally or history of my symptom scores is shown

  Scenario: Sustained under-eating with a fixation pattern is answered plainly
    Given I have logged intake below my steady-loss floor for many consecutive days
    And my behaviour matches the FIXATION_PATTERN (e.g. repeatedly pushing my target below that floor)
    When the well-being summary is shown
    Then it states plainly "Losing weight fast and eating less than your body needs harms your health, hormones, muscle and mood"
    And it says "Please speak to a healthcare professional before cutting any further"
    And this screen shows no control to lower my calorie target

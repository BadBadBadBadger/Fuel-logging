# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 5 of 5.
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
#       LEA_WEEKS_TO_PROMPT = 3 consecutive low-fuel weeks before offering a check
#       FLAG_THRESHOLD      = 2 selected symptoms escalates to break + healthcare-pro
#   Core symptom set (sex-neutral, reviewable): low libido/sex drive, persistent
#   low mood, poor sleep, feeling cold often, stalled/declining strength or
#   recovery, getting ill or injured often. PLUS one profile-relevant physical
#   sign (see the sex-relevant-sign scenario) — a physiological marker, not a
#   bias in WHO gets flagged.
#   FIXATION_PATTERN (observable; exact thresholds owned by logic.test.js) = any
#   of: repeatedly setting a manual target below the safe floor; logging intake
#   below the floor for many consecutive days; weighing in many times per day;
#   repeatedly dismissing diet-break prompts while still under-eating.
# ─────────────────────────────────────────────────────────────

Feature: Low-energy-availability symptom check and healthcare-professional signposting

  Scenario: A symptom check is offered after a long low-fuel stretch
    Given I have been in the caution band or below for LEA_WEEKS_TO_PROMPT (3) consecutive weeks
    When I open the dashboard
    Then I see a calm, optional prompt "Quick check-in: how are you feeling?"
    And I can tap "Do the 30-second check" or "Not now"
    And after tapping "Not now" I can still log food and use every other feature

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
    Given I have logged intake below my energy-availability floor for many consecutive days
    And my behaviour matches the FIXATION_PATTERN (e.g. repeatedly pushing my target below the safe floor)
    When the well-being summary is shown
    Then it states plainly "Losing weight fast and eating less than your body needs harms your health, hormones, muscle and mood"
    And it says "Please speak to a healthcare professional before cutting any further"
    And this screen shows no control to lower my calorie target

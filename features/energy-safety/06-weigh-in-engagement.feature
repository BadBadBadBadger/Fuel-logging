# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 6 of 6.
# Companion to ENERGY_MODEL.md Step 2 (adaptive-TDEE convergence).
#
# WHY: seed → calibrate only calibrates if the user actually weighs in, and
# people weigh sporadically. The app today ASSUMES daily weighing — the widget
# says "Log daily to calibrate your TDEE" (app.jsx:2009). That single line is two
# defects at once:
#   • fragile — no weigh-ins ⇒ the whole calibrate arm is inert; and
#   • unsafe framing — "log daily" is a daily scale-poke on an app that is a known
#     vector for disordered eating.
# Step 1 changed the economics: the activity-seeded target is now believable on
# its own (believability gate, within ~7.5% of MyFitnessPal), so a non-weigher is
# already served a sane target. That means calibration is UPSIDE, not a
# prerequisite — so we INVITE weigh-ins, we never demand them.
#
# HATS IN THE ROOM (design decisions this spec encodes):
#   • COACH (safeguarding): daily is never the default ask; frame around the
#     7-day TREND, not any single day (true — the engine averages); never
#     celebrate a number falling; never frame a missed weigh-in as failure; a
#     "rather not" choice must fully mute the ask (autonomy — recovery / scale-
#     avoidant users are first-class). No push notifications for weighing.
#   • DESIGN (Differentiated tier): a user-chosen CADENCE states intent and the
#     app frames around it; the confidence ladder doubles as a quiet progress cue;
#     one gentle, dismissable nudge on a simple universal backstop — no weigh-in
#     for a week. No streaks, no fanfare (respects the celebration-restraint
#     guardrail). Calibration simply uses whatever weigh-ins exist, not a rigid
#     cadence.
#   • QA: this file owns the user-visible flow ONLY. The convergence maths and
#     confidence tiers are owned by __tests__/logic.test.js and the existing
#     "Calorie-budget confidence" (features/dashboard/03) + "Maintenance floor"
#     (features/energy-safety/08) specs — this spec references them, it does
#     not redefine them. (Both lived in fuel-log.feature until 2026-08-16.)
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   POLICY CONSTANTS (the only literals; owned by logic.test.js):
#       ENGAGE_AT        = 6 weigh-ins   (calibration begins; == engine CAL_MIN_WEIGHINS)
#       NUDGE_GAP_DAYS   = 7   (a week with no weigh-in ⇒ nudge; universal, all cadences except off)
#       NUDGE_COOLDOWN   = 14 days after a dismissal
#       DEFAULT_CADENCE  = few-times-a-week   ·   "I'd rather not" (off) mutes the nudge entirely
#   Confidence LABELS (Estimating / Learning / Calibrated) and the budget
#   confidence % are DERIVED elsewhere — do not re-assert their thresholds here.
#   Scenarios assert observable copy/state, never internal kcal arithmetic.
# ─────────────────────────────────────────────────────────────

@draft
Feature: Encouraging weigh-ins without pressure

  The calibrate half of seed → calibrate needs weigh-ins, but the seed already
  stands on its own — so the app invites check-ins at the user's chosen cadence,
  frames them around the weight trend, and never nags or shames.

  Background:
    Given I have completed my profile so I have an activity-seeded target

  # ── The seed carries a non-weigher — no pressure, no broken target ──
  Scenario: A user who never weighs in still gets a usable target
    Given I have logged zero weigh-ins
    When I view my daily target
    Then a believable target is shown, seeded from my profile and activity level
    And nothing is blocked or greyed out for the lack of a weigh-in
    And I am never told I "must" weigh in

  # ── Replace "log daily" with a trend-framed invitation ──
  Scenario: The uncalibrated weigh-in widget invites rather than demands
    Given calibration has not yet engaged
    When I view the weigh-in widget
    Then it invites me to "weigh in a few times a week to fine-tune your targets"
    And it reassures me that "we use your 7-day trend, not any single day"
    And it does not tell me to weigh in "daily"

  # ── The confidence ladder doubles as a quiet progress cue ──
  Scenario Outline: Progress toward fine-tuning is shown until calibration engages
    Given I have logged "<weighins>" weigh-ins
    When I view the weigh-in widget
    Then it shows "<cue>"

    # ENGAGE_AT = 6: below it we count down; at/after it we say fine-tuning is live.
    Examples:
      | weighins | cue                                          |
      | 0        | 6 check-ins until we start fine-tuning       |
      | 3        | 3 check-ins until we start fine-tuning       |
      | 5        | 1 check-in until we start fine-tuning        |
      | 6        | Fine-tuning your targets to your weight trend|

  # ── Cadence picker: the user's chosen rhythm (Differentiated) ──
  Scenario: The weigh-in cadence defaults to a healthy rhythm and is editable
    Given I have not chosen a weigh-in cadence
    Then my cadence defaults to "a few times a week"
    And I can change it in onboarding or my profile to "weekly", "daily", or "I'd rather not"
    And "a few times a week" is presented as the suggested option, not "daily"
    And choosing a cadence never blocks logging food or saving my profile

  # ── The nudge is one simple universal backstop: a week with no weigh-in ──
  Scenario Outline: A gentle check-in nudge appears after a week without a weigh-in
    Given my cadence is not "I'd rather not"
    And my last weigh-in was "<days>" days ago
    When I open the dashboard
    Then the check-in nudge is "<shown>"

    # NUDGE_GAP_DAYS = 7 — the same threshold whatever cadence I chose.
    Examples:
      | days | shown     |
      | 3    | not shown |
      | 6    | not shown |
      | 7    | shown     |
      | 20   | shown     |

  Scenario: A user active for a week who has never weighed in is nudged too
    Given I have logged food for 7 days but never logged a weigh-in
    And my cadence is not "I'd rather not"
    When I open the dashboard
    Then the check-in nudge is shown

  Scenario: The nudge is supportive, dismissable, and stays gone once dismissed
    Given the check-in nudge is showing
    Then its copy is supportive and about keeping my targets accurate, never guilt or shame
    And it offers "Log weight", "Not now", and "Don't remind me"
    When I choose "Not now"
    Then the nudge is dismissed
    And it does not reappear for 14 days or until I next weigh in, whichever comes first

  Scenario: "I'd rather not" mutes the ask entirely and calms the progress cues
    Given I set my cadence to "I'd rather not"
    Then no check-in nudge is ever shown
    And the widget stops counting down check-ins at me
    And my target continues to run on its seed and any calibration already learned
    And I can turn the ask back on later from my profile

  # ── Coach guardrails as explicit negative assertions ──
  Scenario: Weighing in is never gamified or tied to weight going down
    Given I log a weigh-in
    Then no weigh-in "streak" is created or celebrated
    And a fall in weight is not celebrated as a win
    And a rise in weight is not framed as a failure

  # ── Return-user edge: calibrated, then lapsed ──
  Scenario: A calibrated user who lapses gets a soft check-in, not a reset
    Given my targets are already "Calibrated"
    And I have not weighed in for a week
    When I open the dashboard
    Then a soft check-in nudge invites me to keep my targets fresh
    And my learned targets are unchanged in the meantime
    And the same 14-day cooldown and "Don't remind me" apply

  # ── Non-happy path: offline still advances state ──
  Scenario: Logging a weigh-in offline still updates state and clears the nudge
    Given I am offline and the check-in nudge is showing
    When I log today's weight
    Then the weigh-in is stored locally and the nudge clears immediately
    And it syncs and advances my calibration when I am back online

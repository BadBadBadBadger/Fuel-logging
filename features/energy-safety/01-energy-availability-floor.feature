# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 1 of 5.
#
# WHY: The shipped floor is a flat SAFE_MIN (1400 male / 1200 female,
# app.jsx:269) that sits BELOW a large user's BMR, so it never protects
# them. This replaces it with a PHYSIOLOGICAL floor: Energy Availability.
#
#   Energy Availability (EA) = (intake_kcal − exercise_kcal) / FFM_kg
#     where FFM_kg (fat-free mass) = weight × (1 − bodyFat/100)  [= LBM in app]
#     and exercise_kcal = the day's logged workout burn (totalWorkoutKcal).
#
# EVIDENCE (coach hat, tiered):
#   • WELL-ESTABLISHED: below ~30 kcal/kg FFM/day, reproductive/endocrine
#     function is disrupted — Loucks & Thuma (2003) established the ~30
#     threshold for LH pulsatility in women; the IOC RED-S consensus
#     (Mountjoy et al., BJSM 2014/2018/2023) extends low-energy-availability
#     harm to MEN, including suppressed testosterone. ~45 kcal/kg FFM/day is
#     the "optimal / healthy" reference.
#   • HONEST CAVEAT: the exact male threshold is less precisely defined than
#     the female 30 figure — so we use 30 as a CONSERVATIVE hard floor and 45
#     as the target, and we never present these as personalised clinical
#     numbers. Male-specific LEA→low-T is documented in natural bodybuilding
#     (Fagerberg 2018, IJSNEM; Rossow et al. 2013, IJSPP).
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Every kcal value
#   shown against a body is the OUTPUT of a formula for that example profile:
#       FFM  = weight × (1 − bodyFat/100)
#       BMR  = 370 + 21.6 × FFM              (Katch-McArdle)
#       TDEE = BMR × 1.2                     (sedentary baseline)
#       EA floor = EA_HARD × FFM (+ logged training burn)
#   Implement the formulas; the exact arithmetic is owned by
#   __tests__/logic.test.js, not by these scenarios. Scenario Outlines use
#   CONTRASTING profiles so one rule yields different numbers — that is the
#   proof a value is computed, not baked in.
#   POLICY CONSTANTS (the only literals; also owned by logic.test.js):
#       EA_HARD = 30, EA_OK = 45 kcal/kg FFM/day · ACTIVITY_MULT = 1.2
#       window = 7-day rolling average · flat SAFE_MIN = 1400/1200 (fallback)
# ─────────────────────────────────────────────────────────────

Feature: Energy-availability floor replaces the flat calorie floor

  # Worked-example profile (illustrative only — never hardcode these outputs):
  Background:
    Given my profile weight is 98.5 kg and my body-fat is 30 percent
    And my fat-free mass therefore works out to about 69 kg
    And my resting BMR therefore works out to about 1,859 kcal

  Scenario: Targets are checked against energy availability, not a flat number
    Given I am in "Cut" mode
    When the app calculates my daily calorie target
    Then it computes energy availability as (target − expected training burn) ÷ my fat-free mass
    And my effective floor scales with my body size, so a larger user's floor sits well above the flat 1,400 kcal

  Scenario: Target lands in the healthy energy-availability band
    Given my calculated target gives an energy availability at or above EA_OK (45 kcal/kg FFM)
    When I open the dashboard
    Then no energy-availability warning is shown
    And the calorie target is displayed in the normal accent colour

  Scenario: Target lands in the caution band
    Given my calculated target gives an energy availability between EA_HARD and EA_OK (30–45 kcal/kg FFM)
    When I open the dashboard
    Then I see an amber "Low fuel" chip next to the calorie target
    And tapping the chip opens a sheet titled "You're running low on fuel"
    And the sheet explains "Eating this little for a long time can lower energy, mood, recovery and hormones"
    And the sheet offers a "What's this?" link to a plain-English energy-availability explainer

  Scenario: Target would drop below the hard energy-availability floor
    Given my calculated target gives an energy availability below EA_HARD (30 kcal/kg FFM)
    When the app calculates my daily calorie target
    Then the app raises the target to the value that gives exactly EA_HARD
    And I see a red "Held at safe minimum" banner
    And the banner says "We've raised today's target to protect your recovery and hormones"
    And I can tap "Why?" to read that my chosen target was too low to fuel recovery

  Scenario Outline: Logged training lowers today's energy availability
    Given my daily intake is <intake> kcal
    And I log training that burns <burn> kcal
    When the app computes my energy availability
    Then it uses (intake − training burn) ÷ my fat-free mass
    And a "Low fuel" warning appears only when the result is below EA_HARD (30 kcal/kg FFM)

    Examples: same intake, different training → a different fuel state
      | intake | burn |
      | 2,000  | 200  |
      | 2,000  | 700  |

  Scenario Outline: When several floors apply, the strictest one wins
    Given I am in "<mode>" mode
    And my energy-availability floor works out to <ea_floor> kcal
    And my sedentary-maintenance floor (BMR × 1.2) works out to <maint_floor> kcal
    When the app calculates my daily calorie target
    Then my target is never set below <expected> kcal
    And the floor actually applied is the "<which>" one

    # target floor = max( EA floor, [maintain only] sedentary TDEE, [fallback] SAFE_MIN )
    # Contrasting rows prove max() and mode-dependence — no single number is baked in.
    Examples: derived floors, different every time
      | mode     | ea_floor | maint_floor | expected | which               |
      | Maintain | 2,070    | 2,231       | 2,231    | sedentary TDEE      |
      | Maintain | 2,500    | 2,231       | 2,500    | energy availability |
      | Cut      | 2,070    | 2,231       | 2,070    | energy availability |

  Scenario: The flat legacy floor is retained only as a last-resort backstop
    Given the energy-availability calculation cannot run because body-fat is not set
    When the app calculates my daily calorie target
    Then the app falls back to the flat SAFE_MIN floor for my sex
    And I see a prompt "Set your body-fat % so we can protect you more accurately"

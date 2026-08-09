# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 1 of 5.
# REWRITTEN 2026-08-07 at build time (Step 4). The original draft made
# Energy Availability (EA) a hard floor at 30 kcal/kg FFM. That did not
# survive the numbers — see "WHY THIS CHANGED" below and ENERGY_MODEL.md §5.
#
# WHY: the shipped floor is a flat SAFE_MIN (1400 male / 1200 female) that sits
# BELOW a large user's BMR, so it never protects them — and sits ABOVE a small
# user's sensible target only by accident. It protects nobody in particular.
# This replaces it with a floor DERIVED FROM THE USER'S OWN ENERGY.
#
# ── THE TWO PROTECTIONS (deliberately separate) ──────────────
#   1. STEADY-LOSS FLOOR — the one that MOVES YOUR TARGET, for everyone.
#        floor = 75% of (believable maintenance + today's applied training bonus)
#      A preset target never sits more than MAX_DEFICIT_FRAC below maintenance.
#      Scales with body size, so it protects the small user the flat floor
#      under-served AND the large user it never reached. Eases, never blocks.
#   2. LOW-FUEL WARNING — energy availability, WARNING ONLY.
#        EA = (target − today's RAW training burn) ÷ fat-free mass
#      Shown only for a LEAN body on a day it actually trained, when EA < EA_HARD.
#      It never changes a number.
#
# ── WHY THIS CHANGED (coach hat, at build time) ──────────────
#   • EA_OK = 45 is UNREACHABLE BY CONSTRUCTION in this app. Our multipliers are
#     NEAT-only (max 1.55), training is added separately and then subtracted back
#     out of EA. Reaching 45 kcal/kg FFM needs a whole-day factor ≈1.68+. An
#     "all clear" band nothing can satisfy is wallpaper, not safety → DROPPED.
#   • EA_HARD = 30 AS A FLOOR FORBIDS WEIGHT LOSS for anyone carrying fat. For a
#     98.5 kg / 30% body-fat profile the EA-30 floor lands ABOVE a normal cut
#     target — it would have capped the deficit at ~160 kcal. The EA thresholds
#     were derived in LEAN ATHLETES, who have no large fat store to cover the
#     gap; a body with reserves is a different case → EA warns, never moves a
#     number, and only for the population the evidence is drawn from.
#
# EVIDENCE (coach hat, tiered):
#   • WELL-ESTABLISHED: below ~30 kcal/kg FFM/day, reproductive/endocrine
#     function is disrupted — Loucks & Thuma (2003) established the ~30
#     threshold for LH pulsatility in women; the IOC RED-S consensus
#     (Mountjoy et al., BJSM 2014/2018/2023) extends low-energy-availability
#     harm to MEN, including suppressed testosterone.
#   • HONEST CAVEAT: these figures come from lean athletic populations, and the
#     male threshold is less precisely defined than the female 30. We therefore
#     use 30 only to raise a supportive, occasional warning — never as a
#     personalised clinical number, and never to override a target.
#   • The ~25% deficit ceiling is practice, not a hard finding: it matches the
#     app's own existing "aggressive deficit" language and keeps loss near the
#     0.5–1%/wk rate ceiling for the bodies this app serves.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Every kcal value
#   shown against a body is the OUTPUT of a formula for that example profile:
#       FFM   = weight × (1 − bodyFat/100)
#       BMR   = 370 + 21.6 × FFM                    (Katch-McArdle)
#       TDEE  = BMR × activity multiplier           (NEAT-only, 1.20–1.55)
#       floor = (1 − MAX_DEFICIT_FRAC) × (TDEE + applied training bonus)
#       EA    = (target − raw training burn) ÷ FFM
#   Implement the formulas; the exact arithmetic is owned by
#   __tests__/logic.test.js, not by these scenarios. Scenario Outlines use
#   CONTRASTING profiles so one rule yields different numbers — that is the
#   proof a value is computed, not baked in.
#   POLICY CONSTANTS (the only literals; also owned by logic.test.js):
#       MAX_DEFICIT_FRAC = 0.25 · EA_HARD = 30 kcal/kg FFM/day
#       LEAN_BF = 15% male / 23% female (warning gate only)
#       flat SAFE_MIN = 1400/1200 (absolute backstop + body-fat-unset fallback)
# ─────────────────────────────────────────────────────────────

Feature: A body-sized floor replaces the flat calorie floor

  # Worked-example profile (illustrative only — never hardcode these outputs):
  Background:
    Given my profile weight is 98.5 kg and my body-fat is 30 percent
    And my fat-free mass therefore works out to about 69 kg
    And my resting BMR therefore works out to about 1,859 kcal

  Scenario: My floor is worked out from my own energy, not a fixed number
    Given I am in "Cut" mode
    When the app calculates my daily calorie target
    Then my floor is a fixed fraction below what the app believes I burn in a day
    And my floor sits well above the flat 1,400 kcal, because my body is large

  Scenario Outline: The same flat cut is fine on one body and too deep on another
    Given my body is "<body>"
    When the app calculates my "Cut" target
    Then the steady-loss floor is "<applied>"
    And my target is never more than a quarter below what the app believes I burn

    # One rule, two outcomes — proof the floor is derived, not baked in.
    Examples: a flat −500 is a modest bite for one body and a third of the other
      | body                        | applied |
      | large, 98.5 kg at 30% fat   | not     |
      | small, 60 kg at 25% fat     | yes     |

  Scenario: Being eased is explained, not silently done
    Given my calculated target falls below my steady-loss floor
    When I open the dashboard
    Then I see an amber "Eased to a steady pace" note with the target it settled on
    And I can tap "Why?" to read that losing faster mostly costs muscle and is harder to stick to
    And the note never appears when my target already clears the floor

  Scenario: Weight loss still works — the floor eases, it never blocks
    Given my calculated target falls below my steady-loss floor
    When the app calculates my daily calorie target
    Then my target is raised to the floor
    And my target still sits below what the app believes I burn, so I am still losing

  Scenario: A target I typed myself is warned about, not overridden
    Given I have set my own custom calorie target below my steady-loss floor
    When I open the dashboard
    Then I see an amber note naming the floor we would have set
    And my typed target is left exactly as I set it

  Scenario Outline: When several floors apply, the strictest one wins
    Given I am in "<mode>" mode
    When the app calculates my daily calorie target
    Then the floor actually applied is the "<which>" one

    # target floor = max( steady-loss floor, [maintain only] sedentary TDEE, SAFE_MIN )
    Examples: contrasting rows prove max() and mode-dependence
      | mode     | which                         |
      | Maintain | sedentary maintenance (BMR×1.2) |
      | Cut      | steady-loss                     |

  # ── Low fuel: a warning — it never moves your target ────────
  Scenario: A lean body that trains hard and eats little is told
    Given my body-fat is in the lean range for my sex
    And I log training that burns a large number of calories today
    And what is left after training is below EA_HARD per kg of my fat-free mass
    When I open the dashboard
    Then I see an amber "Low on fuel today" note naming what training used
    And the note says eating a bit more today would be worth it
    And I can tap "Why?" to read that it is what's LEFT after training that matters
    And the note reassures me that one light day is nothing to worry about

  Scenario: The low-fuel note never changes my target
    Given the low-fuel note is showing
    When I compare my target to the same day without the note
    Then the calorie target is identical
    And nothing has been added to or taken off my day

  Scenario: A body with fat reserves is not warned at the same numbers
    Given my body-fat is above the lean range for my sex
    And what is left after training is below EA_HARD per kg of my fat-free mass
    When I open the dashboard
    Then no low-fuel note is shown
    # Not an oversight: EA_HARD comes from lean athletes with no reserves to draw on.

  Scenario: A rest day never raises a low-fuel note
    Given my body-fat is in the lean range for my sex
    And I have logged no training today
    When I open the dashboard
    Then no low-fuel note is shown, however deep my deficit
    # Keeps the warning rare and true, and keeps a permanent "you're under-eating"
    # banner — an eating-disorder risk on a calorie tracker — off the dashboard.

  Scenario: Energy availability follows what my body actually spent today
    Given the app smooths a session's calories across the following days
    When it works out how much fuel is left today
    Then it subtracts today's FULL logged burn, not the smoothed share
    And so a hard session shows up as low fuel on the day I did it

  Scenario: The flat legacy floor is retained only as a last-resort backstop
    Given my body-fat is not set
    When the app calculates my daily calorie target
    Then no energy-availability figure is produced at all
    And the flat SAFE_MIN floor for my sex still backstops my target

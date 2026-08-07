# ─────────────────────────────────────────────────────────────
# DRAFT — for review. Energy-safety workstream, file 3 of 5.
#
# WHY: A prompt is useless without a real, low-friction path OUT of the
# deficit. This defines the DIET BREAK as a first-class app state — a
# distinct mode at true maintenance, floored at sedentary TDEE (BMR × 1.2),
# with the adaptive auto-lowering PAUSED so it cannot keep cutting during recovery.
#
# EVIDENCE (coach hat):
#   • Diet break = a planned return to maintenance (energy balance) for a
#     set period, typically ≥ 1–2 weeks — MATADOR used 2 weeks (Byrne 2018).
#   • Maintenance during the break must be REAL maintenance (floored at
#     sedentary TDEE = BMR × 1.2, no residual deficit) — a "maintenance"
#     figure at or below raw BMR (today's bug) defeats the whole point.
#   • Returning to maintenance is what restores suppressed hormones over
#     weeks-to-months (Rossow 2013; Fagerberg 2018). "Reverse dieting" as a
#     precise protocol is WEAKLY evidenced — we do not claim it; we simply
#     move to maintenance.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. A maintenance
#   floor shown in kcal is BMR × 1.2 for that example body (BMR = 370 + 21.6 ×
#   FFM). Implement the formula; exact arithmetic is owned by logic.test.js.
#   Scenario Outlines use CONTRASTING bodies so the number varies — proof it is
#   computed, not baked in.
#   POLICY CONSTANTS (owned by logic.test.js): DIET_BREAK_DAYS = 14 (2 weeks).
#
# HOUSE RULES honoured: minimise taps on the primary action; the safe path
# is the EASY tap; no confirm-dialog friction to ACCEPT a break (accepting
# is safe); the only guarded action is ending a break early.
# ─────────────────────────────────────────────────────────────

Feature: Diet break is a first-class recovery state

  Scenario: Starting a diet break from a prompt is a single tap
    Given a "Time for a diet break" card is showing
    When I tap "Start 2-week diet break"
    Then my mode changes to "Diet Break"
    And no confirmation dialog interrupts me
    And I see a confirming toast "Diet break started — eat to maintenance for 2 weeks"
    And the dashboard header shows a "Diet Break · 14 days left" badge

  Scenario Outline: Diet-break targets are true maintenance, floored at sedentary TDEE
    Given I am in "Diet Break" mode
    And my sedentary maintenance (BMR × 1.2) works out to <maint> kcal
    When the app calculates my daily calorie target
    Then my target equals my maintenance TDEE with no deficit applied
    And my target is never below <maint> kcal
    And the calorie ring is labelled "Maintenance"
    And no "under target" or deficit framing is shown

    Examples: the floor is a formula output, different for each body
      | maint |
      | 2,231 |
      | 1,680 |

  Scenario: The adaptive auto-lowering is paused during a diet break
    Given I am in "Diet Break" mode
    And my weight rises during the break
    When the weekly calibration runs
    Then the app does not lower my TDEE estimate in response to the rise
    And the app shows "Weight up a little on a break is normal — usually water and glycogen"

  Scenario Outline: The countdown reflects days remaining in the break
    Given I am on day <day> of a <length>-day diet break
    When I open the dashboard
    Then I see "Diet Break · <remaining> days left"
    And I see an encouraging line "Refuelling now sets up your next block"

    # remaining = length − day; contrasting rows show it is arithmetic, not fixed copy.
    Examples:
      | length | day | remaining |
      | 14     | 5   | 9         |
      | 14     | 1   | 13        |

  Scenario: The break completes and offers the next step
    Given my diet break has reached its final day
    When I open the dashboard
    Then I see a celebration card "Diet break complete — nice work"
    And I am offered "Start a new cut block" and "Stay at maintenance" as two buttons
    And neither option is pre-selected for me

  Scenario: Ending a break early is the one guarded action
    Given I am partway through a diet break
    When I try to switch back to "Cut" mode
    Then I see a gentle confirm "End your break early? Most benefit comes from finishing it"
    And I can choose "Keep resting" or "End break"

  Scenario: Extending a break when symptoms persist
    Given I am completing a diet break
    And I reported low-energy-availability symptoms during it
    When the completion card appears
    Then it recommends "Consider staying at maintenance longer" as the highlighted option
    And it repeats the "see a healthcare professional" signpost from the symptom check

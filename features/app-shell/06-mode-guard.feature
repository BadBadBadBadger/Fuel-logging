# ─────────────────────────────────────────────────────────────
# One guarded mode path — design/v2/HANDOVER.md §7.5, §7.6, D10, D16.
# Ruling: design/v2/reviews/early-return-ruling.md.
# v2 only for now: v1's Dashboard keeps its own local guard (features/energy-safety/03).
# ─────────────────────────────────────────────────────────────
Feature: Every mode change goes through requestMode

  Background:
    Given the v2 UI is on

  Scenario: Every surface that changes mode uses requestMode(mode, source)
    Then the Today lamps, Settings › Body & goal, committing a custom target and the
      break-due sheet all call requestMode
    And nothing else writes the mode
    # TODO (Phase 0): a static test, in the styles.test.js pattern, that fails if any code
    # calls handleSetMode/saveMode outside requestMode. Custom target (bug B4) still bypasses it.

  Scenario: Maintain and Bulk are never guarded
    Given I am mid-break with load remaining
    When I request Maintain or Bulk
    Then the mode changes at once with no confirm

  Scenario: A short casual cut never sees the guard
    Given my break began with load below the soft-nudge threshold
    When I request Cut
    Then the mode changes at once with no confirm

  Scenario: Going back to Cut early asks once
    Given I am mid-break and the break began at or above the soft-nudge threshold
    When I request Cut from any surface
    Then a bottom sheet asks "Back to cutting already?"
    And the mode is not changed until I answer

  Scenario: The confirm states the cost honestly, as an estimate
    Given the confirm sheet is showing
    Then it says "About {d} more rest days would finish this break"
    And, when the remaining load is below the soft threshold, continues
      "and if you cut now the next break reminder is likely in about {w} weeks at your cut target."
    And, when the remaining load is at or above the soft threshold, continues
      "and if you cut now the break reminder will be back in a few days."
    And it always shows the factual line "This block began on {date}."
    # {w} is computed at render from the remaining load at the CUT target's deficit
    # ((soft − load) / dayCutLoad(cutTarget, maintenance)), never today's maintenance target
    # (which would be infinite). It is whole weeks, "about", and never stored or shown again.

  Scenario: Keep resting is the primary answer
    When I tap "Keep resting"
    Then the sheet closes and my mode stays Maintain

  Scenario: Cut anyway is respected immediately
    When I tap "Cut anyway"
    Then my mode becomes Cut at once
    And there is no second confirm, no cooldown and no "why?" form
    And the tape resumes at its true level, amber at once if at or above the nudge
    And no forecast or percentage recharged is shown afterwards
    # Known bug B1 (out of scope for the UI slice): startDietBreak clears both snoozes,
    # so after "Cut anyway" the nudge can reappear at once. Fix on main: Cut anyway sets
    # nudgeAt = snoozeAt = now.

  Scenario: Tapping the dimmed screen behind the sheet keeps resting
    When I tap outside the sheet
    Then it behaves as "Keep resting"

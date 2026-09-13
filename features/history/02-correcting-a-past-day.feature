# ── Correcting a past day: its mode, and the target it was graded against ───
# Built 2026-09-13 (session 22). FL-010 from `features/history/00-bug-report.md`: the founder set
# 12 Sep 2026 to MAINTAIN by mistake and logged at cut level. History let him edit that day's food
# and water but not what he had been aiming for — the half of the record more likely to be wrong.
#
# ⚠️ THIS FILE OVERRIDES THE SWARM. The review refused FL-010 as specified, for two good reasons:
# recomputing a past day's target needs that day's adaptive TDEE adjustment and whether a custom
# target applied, neither of which is stored, and a mode edit could lift `runCalibration`'s refusal
# to LOWER the calorie target — written to `tdee_adj`, fired at the next weigh-in, and not undone
# by putting the mode back. The founder's answer dissolved both: make the target an explicit stored
# number he can set, rather than something the app reconstructs. See `swarm/07-debate.md` §2.6 for
# the refusal and `swarm/02-engineering.md` §4.3 for the hazard analysis it rests on.
#
# ⚠️ NO MIGRATION, and this was checked rather than assumed. `mode`, `target_kcal`,
# `target_protein`, `target_fat`, `target_fat_floor`, `floored` and `workout_bonus` are ALREADY in
# the `history_snapshots` upsert and already read back. Nothing new is written to Postgres. That
# matters here more than anywhere: a field written before its column exists 400s the WHOLE table's
# sync, silently, and that has already cost this repo its history sync twice — most recently v79's
# `workout_bonus`, which stopped all daily history syncing until the column was run.
#
# THE DETERMINISM RULE, which is the whole design. The target is computed ONCE, at the moment the
# mode is tapped, and written to the day. It is never re-derived on read. Re-opening the day in six
# months shows the same number even though the adaptive TDEE it was built from has moved on. A
# target recomputed on every render would be the non-deterministic version, and that is the thing
# being avoided — not the computing, the re-computing.
#
# Reuses rather than re-derives:
#   • `calcTargets` for the mode's own target, so a corrected day is built by the same engine as a
#     live one — floors included.
#   • `computeMacros` + `SAFE_MIN` for a typed target, exactly as today's typed target behaves:
#     the floor holds, protein and fat keep theirs, carbs absorb the change. Never proportionally
#     scaled — that once dragged fat under its hormonal floor on a deep custom cut.
#   • that day's OWN weight and body fat, looked up by date from `weighIns` and
#     `bodyMeasurements` — the by-date lookup pattern body/02 established. A corrected day is
#     graded against the body that actually had it.
#   • the day's stored `workout_bonus`, so earn-to-eat is not silently dropped.
#   • the TRAINING button beside it as the interaction model: one tap, no confirm, no dialog.
#
# NOT in this file, on purpose:
#   • anything about the week. No line claims a weekly recalculation, because none happens: no
#     day's mode is an input to `weeklyIntakeScore`. Four reviewers established this independently.
#     Saying otherwise would need three new props to compute a sentence that cannot change.
#   • correcting the cut-block ledger. It cannot be reached from here. The nutrition-coach report
#     used the cut-block drain as its strongest argument FOR FL-010; engineering showed FL-010
#     cannot repair it. That is a reason the mis-set day mattered, not a thing this fix undoes.
#   • a read-only cut-off on old days, a confirm step, a toast, or revoking a badge after an edit.
#     All four rejected — the no-friction house rules forbid the middle two, and the founder's
#     decision was that a past day should behave like today.
#   • editing TODAY from this screen. Today's snapshot is rewritten from live state every render,
#     so an edit here would silently revert; its controls are one tap away on the dashboard. This
#     single restriction also removes the need for a new prop routed to `handleSetMode` and the
#     risk of a second unguarded route past `askCutGuard`.

Feature: Correcting a past day's mode and calorie target

  Background:
    Given a past day already stores the calorie target that applied on it
    And a day's colour comes from comparing what was eaten against that stored target
    And today is not editable from History

  # ── The mode ──────────────────────────────────────────────────────────────

  Scenario: a past day's mode is three chips, and one tap is the whole interaction
    When I open a past day in History
    Then CUT, MAINTAIN and BULK are shown as chips with the current one marked
    And tapping one changes it immediately, with no confirm and no dialog

  Scenario: changing the mode re-targets the day for that mode
    Given 12 Sep is set to MAINTAIN with a stored target of 2,709 kcal
    When I tap CUT
    Then the day's target is worked out for a cut and stored
    And the cut target is lower than the maintain target

  Scenario: the re-targeting is frozen, not recomputed on every read
    When I tap CUT, then BULK, then CUT again
    Then the target lands on the same number it did the first time
    # One input genuinely cannot be recovered: the adaptive TDEE adjustment as it stood that day
    # is not stored per day, so today's value stands in. The app already does exactly this, and
    # calls it "a known-approximate stand-in", when grading a snapshot older than stored targets.
    # Computing once and storing is what stops that approximation drifting afterwards.

  Scenario: today's row offers no mode chips
    When I open today from History
    Then its mode is shown but not editable

  # ── The target ────────────────────────────────────────────────────────────

  Scenario: the target can be set by hand, and the day is regraded against it
    Given 12 Sep is graded against 2,709 kcal and I ate 2,331
    When I set the target to 2,209
    Then the day reads 122 over
    And its macro split is rebuilt from the new number, with the floors intact

  Scenario: the safety floor still holds on a number I typed myself
    When I set a past day's target to 900
    Then it is stored as 1,400, the male SAFE_MIN
    # A typed target is the user's own choice, but not below the floor.

  Scenario: a typed target is the last word until the mode changes again
    Given I have set 12 Sep's target to 2,209 by hand
    When I tap a different mode
    Then the day is re-targeted for that mode, replacing what I typed

  Scenario: cancelling changes nothing
    When I open the target editor and cancel
    Then the stored target is untouched

  # ── What the day says about itself ────────────────────────────────────────
  # This is the legitimate content of FL-003, and it ships here for free. Without it the screen can
  # say CUT while the number it compared against was a maintenance target, which is how a
  # correctly-scored day reads as a scoring bug — which is exactly what happened.

  Scenario: the day states what it was graded against
    Then it reads "Scored against CUT · target 2,709 kcal · 378 under"
    And a dot beside it carries that day's own colour

  Scenario: a day older than stored targets admits it instead of pretending
    Given a snapshot recorded before per-day targets existed
    Then it says no target was saved for that day and offers to set one
    # Rather than quietly grading it against today's target and showing a colour built on that.

  # ── What correcting 12 Sep actually does ─────────────────────────────────
  # Recorded because the founder will check, and because two of the three plausible outcomes look
  # like the fix failed.

  Scenario: the corrected day changes colour, and the week does not
    Given 12 Sep was set to MAINTAIN in error and logged at cut level
    When I correct it to CUT
    Then that day's target, colour and verdict all change
    But the weekly sentence is unchanged, because no day's mode feeds it
    And the cut-block ledger is unchanged, because this fix cannot reach it

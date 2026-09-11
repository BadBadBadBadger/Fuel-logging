# ─────────────────────────────────────────────────────────────
# Energy-safety workstream, companion to file 4 and file 09. BUILT 2026-09-11.
# Jest 329/329, Playwright 92/92, sw v79.
#
# Ordering note, so nobody is confused re-reading this later: this file was written AFTER the
# fix it describes, not before — the founder asked for the fix directly ("eng hat on, get it
# sorted") on the same day the underlying defect was found, rather than the usual proof-then-
# build order this repo prefers. The Numbers Contract and Scenarios below are still the real,
# derived arithmetic the code was built against, not an after-the-fact rationalisation.
#
# ── WHAT THIS FILE IS ABOUT ──────────────────────────────────
# The founder's own intuition, chasing the same bug `09` fixes: "the activity multiplier plus
# submitting gym sessions is partly responsible for my inflated figures." Put on the Critical-
# Thinking hat to check it. Two candidates:
#
#   1. Activity-tier self-selection — picking "Active" because you train, not because of your
#      non-exercise daily movement. Real, but not code-fixable (it's a self-report field) and
#      `runCalibration` never reads the `training` flag at all, so it's not this file's job.
#   2. A structural gap in `runCalibration` ITSELF — confirmed, and this file's job.
#
# `runCalibration` compares logged food (`avgKcal`) against `baseTDEE` alone to estimate the
# day's real energy deficit. But `baseTDEE` never includes a workout's own burn — and the
# TARGET the user is actually eating to already has that burn credited back as an earn-to-eat
# bonus (`calcTargets`, `totalWorkoutKcal`). So on any week the user trains and eats up near
# that correctly-elevated target, the loop sees "ate more, still lost weight" and reads it as
# "you burn more than we thought" — a false RAISE signal roughly the size of the average
# workout bonus, EVERY WEEK trained, with zero noise involved. This is a different failure
# class from `09`'s bug: deterministic, not noise-driven — it would fire against a perfectly
# smooth weight trend, and neither of `09`'s fixes touches it (Fix A only throttles HOW OFTEN a
# raise lands; Fix B only reverses a raise when LATER evidence contradicts it — this bias never
# contradicts itself, so nothing in `09` ever catches it). That is why it gets its own file
# instead of being folded into `09`, on the Critical-Thinking hat's own recommendation.
#
# ── THE FIX ────────────────────────────────────────────────────
# Credit the training. Each day's real earn-to-eat bonus (`targets.bonus` — already computed,
# already returned by `calcTargets`) is now recorded on that day's history snapshot as
# `workoutBonus`, and `runCalibration` compares intake against `baseTDEE + avgBonus`, not
# `baseTDEE` alone. A day with no training has `bonus = 0` and nothing changes. A day recorded
# before this shipped has no stored value and defaults to 0 — the honest answer: there is no
# real figure for that day, same convention as `target_kcal`'s null on old rows.
#
# ── DECIDED, DON'T RE-LITIGATE ─────────────────────────────────
#   • This does NOT touch `calcTargets`, the smoothing weights, or how much bonus a workout
#     earns — `09`'s earn-to-eat mechanism (file 07) is correct and untouched. The bug was
#     only ever in how `runCalibration` compared against it, not in the bonus itself.
#   • Activity-tier self-selection (Candidate 1 above) is NOT addressed here — it is a copy/UX
#     question (are the tier hints clear enough that "Active" isn't picked for gym attendance),
#     not a calculation bug. Left for the design/coach hats if it's worth revisiting.
#   • No new stored figure is invented beyond `workoutBonus` itself — everything else
#     (`avgBonus`, the corrected `avgDeficit`) is derived at calibration time, matching how
#     `avgKcal` and `intakeConfidence` weighting already work.
#
# ── NUMBERS CONTRACT (read before writing code) ───────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Exact arithmetic is owned by
#   `__tests__/logic.test.js`, mirroring `app.jsx`.
#   Worked example (Critical-Thinking review, verified against the founder's real stats):
#   97.8kg, 29.1% body fat → LBM 69.3kg → BMR 1868 → seed TDEE (active, ×1.45) = 2709.
#   A week with 3 training sessions (~500 kcal raw each), smoothed 3-day (weights
#   0.5/0.3/0.2, sum to 1): average daily bonus ≈ 214 kcal. Eating to a Cut target that
#   includes that bonus gives avgKcal ≈ 2709 − 500 + 214 = 2423.
#     WITHOUT this fix: avgDeficit = 2709 − 2423 = 286 → expectedChange ≈ −0.26 kg/week.
#       The true deficit (500, since the bonus exists precisely to fund the extra burn)
#       produces actualChange ≈ −0.45 kg/week → discrepancy ≈ −0.19 → errKcal ≈ +214 —
#       almost exactly the average bonus, reappearing as a spurious raise.
#     WITH this fix: avgDeficit = (2709 + 214) − 2423 = 500 — the real prescribed deficit,
#       matching actualChange with no discrepancy and no spurious signal.
# ─────────────────────────────────────────────────────────────

Feature: The calibration loop credits real training burn instead of reading it as a higher metabolism

  Scenario: A trained, earn-to-eat week produces no spurious raise
    Given I trained several times this week and ate up to my earn-to-eat-inflated target each time
    And my weight fell at exactly the rate my real deficit predicts
    When the weekly calibration runs
    Then the workout bonus baked into each day's target is credited alongside baseTDEE
    And no raise is produced from the bonus alone
    # This is the founder's own case, worked in the header above: without the fix, this
    # exact situation manufactures an ≈+214 kcal raise signal every week, deterministically.

  Scenario: A rest week is unaffected
    Given I did not train this week
    When the weekly calibration runs
    Then each day's workout bonus is 0
    And the calibration behaves exactly as it did before this file existed
    # avgBonus = 0 reduces the corrected formula to the original one — no regression for
    # the ordinary, non-training case.

  Scenario: A genuine metabolic change is still detected on top of training
    Given I trained this week AND my true TDEE has genuinely risen for an unrelated reason
    When the weekly calibration runs
    Then the workout bonus is credited first
    And any REMAINING discrepancy still produces a raise, sized to the real gap only
    # Crediting the bonus removes the systematic bias; it does not make the loop blind to
    # a real change underneath it.

  Scenario: A day recorded before this fix shipped is treated as untrained, not estimated
    Given a history snapshot has no stored workout bonus (recorded before 2026-09-11)
    When that day is included in a calibration window
    Then its bonus is treated as 0, the same honest-null convention `target_kcal` already uses
    And the day is not excluded from the average, only under-credited for training it may have had
    # Matches how `target_kcal`/`floored` already handle pre-existing rows (dashboard/04):
    # there is no real figure for those days, and 0 is the same "no known bonus" answer null
    # would give, without adding a second null-handling convention to the same function.

  Scenario: The fix reuses calcTargets' own figure, not a re-derivation
    Given `calcTargets` already returns `bonus` for the day's target
    When the daily history snapshot is recorded
    Then `workoutBonus` is read directly from that same value, not recomputed
    And a later change to the smoothing weights or the earn-to-eat window automatically
      stays consistent between what the user was told to eat and what calibration credits
    # Reuse, not a second implementation of the same idea (file 09's own engineering
    # principle) — a drift between calcTargets' bonus and a separately-computed calibration
    # credit would silently reopen exactly the bug this file closes.

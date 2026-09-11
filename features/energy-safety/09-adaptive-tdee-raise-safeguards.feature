# ─────────────────────────────────────────────────────────────
# Energy-safety workstream, companion to file 4. BUILT 2026-09-11 (session, same day as the
# spec). Both proposed constants below were confirmed by the founder as written — see
# "FOUNDER DECISION" near the bottom of this header. Jest 329/329, Playwright 92/92, sw v79.
# Written 2026-09-11, from a live bug report and its own swarm-review investigation:
# `09-tdee-raise-runaway-bug-swarm-review.md` (read that first — this file specifies
# the fix it recommended; it doesn't repeat the diagnosis).
#
# ── WHAT THIS FILE IS ABOUT ──────────────────────────────────
# File 04 made the calibration loop cautious about LOWERING your target while you're
# cutting, and left RAISING deliberately fast: "good news should arrive as fast as
# the evidence does" (04, "Good news still arrives at full speed"). That was a
# reasoned decision, not an oversight — but it assumed the evidence behind a raise
# is real. It wasn't tested against what a real scale actually does day to day.
#
# The founder hit this directly: two days of mostly-water weight drop, on top of a
# still-short weigh-in history, drove the adaptive adjustment straight to its own
# hard ceiling (+600) in five days — reproduced and confirmed against his real
# Supabase data in the linked swarm review, arithmetic to the exact kcal. The
# acceptance test this app already trusts (`logic.test.js:1235-1264`) only ever
# proves this loop against a smooth, noise-free weight trajectory; it has never been
# fed a real, noisy one. Real weigh-ins swing several kg in a week for reasons that
# have nothing to do with metabolism — water, sodium, glycogen, gut contents — and
# `runCalibration` currently treats every one of those swings, in the raising
# direction, as trustworthy evidence, applied at full speed, on every single
# weigh-in.
#
# Two separate, confirmed defects, not one:
#   1. RUNAWAY — nothing stops the SAME short-lived swing from being credited
#      more than once as fresh weigh-ins trickle in against overlapping 7-day
#      windows. The dead-time compensation (`inFlightAdj`) tries to correct the
#      SIZE of the measured error but does not stop a NEW step firing again days
#      later off substantially the same data.
#   2. STICKY — once a bad raise lands, file 04's own cutting-aware refusal (built,
#      correctly, to stop a disappointing scale walking the target down) also
#      blocks the app from ever walking a WRONG raise back down while cutting. The
#      rule can't tell "genuine new lowering evidence" from "undoing my own recent
#      mistake" — it wasn't designed to have to.
#
# ── WHAT ALREADY SHIPPED (do not rebuild, do not weaken) ─────
#   File 04's asymmetry is CORRECT for what it was built to do and is NOT being
#   reopened here:
#     • Lowering is still refused while cutting, for evidence older than the
#       reversal window this file adds (see Fix B below) — the five-innocent-
#       explanations reasoning in 04 stands untouched.
#     • The floors (sedentary maintain floor, deficit floor, SAFE_MIN) are
#       unaffected — they sit below this and don't move.
#     • `ADJ_CAP` (600) stays the absolute ceiling either direction. This file
#       makes it materially harder to REACH that ceiling on bad evidence, and
#       easier to walk back down from it once there — it does not raise or lower
#       the ceiling itself.
#
# ── THE TWO THINGS THIS FILE ADDS ─────────────────────────────
#
# Fix A — a raise must be backed by a materially new week, not a new weigh-in.
#   A positive step is only ever APPLIED if at least RAISE_MIN_INTERVAL_DAYS have
#   passed since the last APPLIED raise. Before that, `runCalibration` still
#   computes and returns what it would have applied (`wouldHaveBeen`, mirroring how
#   `refused` already works in 04) — nothing is hidden, the number just doesn't move
#   again until the window has genuinely rolled over. This applies to a raise in ANY
#   mode (Cut, Maintain, Bulk) — the bug is about evidence freshness, not about
#   cutting specifically, and 04's Maintain-mode scenarios (which are about the
#   floor and about lowering, not about raise timing) are unaffected by this.
#
#   Chosen because it reuses a number the loop already trusts: `recentAvg` and
#   `olderAvg` are both built from 7-day windows, so under 7 days apart, two
#   "runs" are still mostly measuring the SAME swing, not two independent ones.
#
# Fix B — while cutting, a lowering signal can undo a raise's OWN recent work,
#   but never touch older, settled evidence.
#   Split the current `tdeeAdj` into two parts using dates already sitting in
#   `adjLog` (already exists, already local convergence bookkeeping — no new
#   storage): the portion added by raises applied within the last
#   RAISE_REVERSAL_WINDOW_DAYS ("recent, still provisional") and everything older
#   ("settled"). While cutting, a lowering signal is now allowed to erode the
#   RECENT portion — down to, but never below, the settled floor — using the exact
#   same per-run step cap any other adjustment uses. Evidence older than the window
#   remains exactly as protected as it is today: if nothing recent needs unwinding,
#   this file changes nothing and 04's original refusal fires unchanged.
#
# ── DECIDED, DON'T RE-LITIGATE ────────────────────────────────
#   • Neither fix touches `ADJ_CAP`, the floors, or the Maintain-mode scenarios in
#     04 — only the RATE at which a raise is credited (Fix A), and what a lowering
#     signal is allowed to erode while cutting (Fix B).
#   • Fix B does not require inventing a "was this raise wrong" judgement — it only
#     ever allows erosion down to the settled floor, using the ordinary calibration
#     step cap. A raise that was genuinely correct simply won't attract a
#     contradicting lowering signal in the first place; nothing here punishes a
#     raise for being recent, only for being contradicted by later evidence.
#   • Fix A and Fix B are independent and both are needed: A alone still leaves a
#     bad raise permanent once it lands (just slower to land); B alone still lets
#     noise re-trigger a fresh raise every single day.
#
# ── FOUNDER DECISION, 2026-09-11 ──────────────────────────────
#   Both proposed constants confirmed as written, no changes: RAISE_MIN_INTERVAL_DAYS = 7,
#   RAISE_REVERSAL_WINDOW_DAYS = 21. The two Scenarios below are kept as the record of the
#   proposal and its reasoning, `@founder-blocking` removed.
#
#   Also raised the same session, addressed separately, NOT part of this file: a live
#   suspicion that the activity-tier multiplier and/or logged workouts were ALSO inflating
#   the estimate, independent of noise. Investigated by the Critical-Thinking hat and
#   confirmed as a real, distinct, deterministic defect (not noise) in `runCalibration`'s own
#   energy-balance math — see `10-workout-burn-calibration-credit.feature`. Fix A and Fix B
#   here do not address it; Fix C in file 10 does.
#
# ── NUMBERS CONTRACT (read before writing code) ───────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Scenario Outlines
#   use CONTRASTING inputs so a value can't be hardcoded. Exact arithmetic is owned
#   by `__tests__/logic.test.js`, mirroring `app.jsx`.
#   PROPOSED POLICY CONSTANTS (both `@founder-blocking` — see below):
#       RAISE_MIN_INTERVAL_DAYS    = 7    (Fix A — proposed)
#       RAISE_REVERSAL_WINDOW_DAYS = 21   (Fix B — proposed)
#   ALREADY-SETTLED CONSTANTS THIS FILE REUSES, UNCHANGED:
#       ADJ_CAP = 600 · CAL_STEP_CAP = {low:100, medium:150, high:200} ·
#       CAL_MIN_WEIGHINS = 6
# ─────────────────────────────────────────────────────────────

Feature: The adaptive TDEE loop can't be talked into a wrong number by noise, in either direction

  # ── Fix A — a raise needs a materially new week ─────────────

  Scenario Outline: A raise only lands once the evidence window has genuinely moved on
    Given the last APPLIED raise landed <daysSinceLastRaise> days ago
    And today's calibration would raise the target by <wouldBeStep> kcal
    When the weekly calibration runs
    Then the raise is <outcome>
    And if held, `wouldHaveBeen` still reports <wouldBeStep>, same as any other refusal

    # Chosen because `recentAvg`/`olderAvg` are themselves 7-day windows — under 7
    # days apart, two runs are still substantially the same evidence.
    Examples:
      | daysSinceLastRaise | wouldBeStep | outcome  |
      | 1                  | 100         | held     |
      | 3                  | 150         | held     |
      | 6                  | 200         | held     |
      | 7                  | 150         | applied  |
      | 14                 | 200         | applied  |

  Scenario: The very first raise is never held back
    Given no raise has ever been applied yet (`adjLog` has no positive entries)
    And today's calibration would raise the target by 100 kcal
    When the weekly calibration runs
    Then the raise is applied in full
    # There is nothing to be "too soon after" — this rule only ever compares
    # against a PRIOR applied raise, so a brand-new account is never penalised.

  Scenario: A raise backed by evidence the last raise never saw is not slowed down
    Given the last applied raise landed 10 days ago
    And today's calibration would raise the target by 150 kcal
    When the weekly calibration runs
    Then the raise is applied in full, at the same speed as before this file
    # The founder's own requirement, preserved: good news arriving from a genuinely
    # new week of evidence is never damped. Only a raise re-litigating the same
    # handful of recent days is held.

  # ── Fix B — a raise can undo its own recent work, never older evidence ─────

  Scenario Outline: A lowering signal while cutting can erode a raise's own recent contribution, never the settled portion beneath it
    Given my accumulated adjustment is <tdeeAdj> kcal
    And <recentRaise> kcal of that was added by a raise within the last RAISE_REVERSAL_WINDOW_DAYS
    And the rest, <settledAdj> kcal, is older than that window
    And I am cutting
    And today's calibration would lower the target by <wouldBeStep> kcal
    When the weekly calibration runs
    Then the adjustment becomes <newAdj> kcal
    And the amount actually applied is <applied> kcal, not the full <wouldBeStep>

    # newAdj = max(settledAdj, tdeeAdj − wouldBeStep). Two contrasting bodies aren't
    # needed here — the mechanism is pure arithmetic on the adjustment itself,
    # independent of BMR/activity — so these rows contrast the SHAPE of the case
    # instead: an ordinary partial erosion, an erosion that would overshoot the
    # settled floor and gets capped, and a case with no settled evidence at all
    # (the founder's actual account today: everything currently in `tdeeAdj` is
    # recent).
    Examples:
      | tdeeAdj | recentRaise | settledAdj | wouldBeStep | newAdj | applied |
      | 600     | 500         | 100        | 150         | 450    | 150     |
      | 600     | 500         | 100        | 550         | 100    | 500     |
      | 600     | 600         | 0          | 300         | 300    | 300     |

  Scenario: With no recent raise to unwind, file 04's original refusal is untouched
    Given my accumulated adjustment is 400 kcal
    And none of it was added by a raise within the last RAISE_REVERSAL_WINDOW_DAYS
    And I am cutting
    And today's calibration would lower the target by 50 kcal
    When the weekly calibration runs
    Then the lowering is refused, exactly as file 04 already specifies
    And the adjustment stays at 400 kcal
    # This is the regression case: a genuinely settled adjustment with nothing
    # recent behind it is exactly as protected today as before this file existed.

  Scenario: Reversal never overshoots into new, unrelated lowering
    Given my accumulated adjustment is 300 kcal, all of it settled (no recent raise)
    And I am cutting
    And today's calibration would lower the target by 100 kcal
    When the weekly calibration runs
    Then the lowering is refused in full, not partially applied
    # Fix B only ever erodes a RECENT raise's own contribution. It never opens a
    # new hole in evidence that was never a raise to begin with — that is still
    # exactly the case 04's five-innocent-explanations reasoning covers.

  # ── The founder's own case, worked end to end ───────────────

  Scenario: The reported bug, replayed against both fixes together
    Given my accumulated adjustment reached 600 kcal from five raises inside the last 7 days
    And none of it is older than RAISE_REVERSAL_WINDOW_DAYS
    And I am cutting
    When a noisy weigh-in swings the wrong way relative to the last few days
    Then Fix A would have held all but the first of those five raises, each one landing under 7 days after the one before it
    And Fix B allows the resulting lower adjustment to be eroded further, back toward 0, as contradicting evidence continues to arrive
    And nothing here required the manual "start clean" reset — the loop is now able to correct itself
    # Illustrative, not a literal unit test: shows why both fixes together, not
    # either alone, close this specific bug.

  # ── Decided constants — kept as the record of the proposal ──

  Scenario: RAISE_MIN_INTERVAL_DAYS — decided at 7, matching the code's own window size
    Given the swarm review proposed 7 days, matching the width of the windows `runCalibration` already compares
    Then the founder confirmed this value 2026-09-11, unchanged from the proposal
    # A shorter interval keeps genuine convergence faster but narrows the noise
    # protection; a longer one is safer but slows a real, fast metabolic change
    # from being believed. 7 was chosen because it's not a new idea — it's the
    # window size already in the code — not because it was tuned against data.

  Scenario: RAISE_REVERSAL_WINDOW_DAYS — decided at 21, matching the stall check's own horizon
    Given the swarm review proposed 21 days (three weeks — matching the stall
      check's own 3-week horizon elsewhere in this app, for the same reason: real
      metabolic evidence needs about that long to separate from noise)
    Then the founder confirmed this value 2026-09-11, unchanged from the proposal
    # Shorter makes a bad raise cheaper to undo but shrinks how long a GOOD raise
    # gets treated as provisional before it's trusted as settled; longer does the
    # reverse.

# ─────────────────────────────────────────────────────────────
# Energy-safety workstream, file 4 of 5. ✅ FULLY BUILT 2026-08-09 (session 15).
# Rewritten in plain English the same day, then the last unbuilt piece — the
# asymmetry — was implemented against it. Jest 209/209, sw v63.
#
# ── WHAT THIS FILE IS ABOUT ──────────────────────────────────
# The app guesses how much you burn in a day, then corrects that guess against
# the scale. Every week it asks: "given what they ate, did their weight do what
# I predicted?" If you lost less than it expected, it decides its guess was too
# high and lowers your calorie target.
#
# That correction is the right idea and it is why the app works. But it has one
# blind spot, and it is the blind spot that hurt the founder: **the scale going
# the wrong way does not mean your metabolism slowed down.** Weight rises during
# a genuine deficit all the time — water held from stress or under-eating, a
# glycogen swing, a big salty meal, a full gut, muscle gained while training.
# None of those mean you burn less. The app cannot tell them apart from a real
# slowdown, so it does the one thing that makes all of them worse: it tells you
# to eat less.
#
# Run that loop for months and the target walks downward with nothing to stop
# it. That is the harm this whole workstream exists to prevent, and the piece of
# it that lives in THIS file is the last one still unbuilt.
#
# ── WHAT ALREADY SHIPPED (do not rebuild) ────────────────────
#   Three of the four protections named in the original draft are live or built.
#
#   | Protection | Where | State |
#   |---|---|---|
#   | Maintain never shows below BMR × 1.2 ("Held at your minimum maintenance") | app.jsx targets layer | ✅ LIVE on main |
#   | The running correction can't exceed ADJ_CAP (600 kcal) in either direction | app.jsx:475 | ✅ built |
#   | The correction converges instead of slamming its cap; needs 6 weigh-ins to speak | app.jsx:477 runCalibration | ✅ built (Step 2) |
#   | A cut is floored by rate of loss, not by BMR (MAX_DEFICIT_FRAC = 0.25) | app.jsx calcTargets | ✅ built (Step 4, file 01) |
#   | A break is suggested when the scale stops moving for 3 weeks | file 03 (stall check) | ✅ built (Step 5b) |
#
#   So the floors are in place, the correction is well-behaved, and something
#   already speaks up when you stall. What is missing is the asymmetry.
#
# ── THE ONE THING LEFT TO BUILD ──────────────────────────────
#   Today the correction is SYMMETRIC: it moves your target down for a
#   disappointing scale exactly as readily as it moves it up for a good one.
#   That symmetry is wrong, because the two directions are not equally safe.
#   Guessing too high costs you some progress. Guessing too low walks a dieter
#   toward under-eating, one 25-kcal step at a time, while telling them it is
#   the correct thing to do.
#
#   The fix is to make the loop cautious in one direction only.
#
# ── DECIDED 2026-08-09 (founder): never lower while cutting ──
#   THE RULE, in one line: **the app only lowers its estimate of what you burn
#   when you are NOT cutting.**
#
#   While your prescribed target sits below maintenance, a disappointing scale
#   never moves your number down — not on a gain, not on a stall. In Maintain
#   or Bulk it does, because there the evidence is clean: if you are eating at
#   maintenance and still gaining, your burn really is lower than we thought,
#   and that is worth knowing.
#
#   The obvious objection is that the app can then never correct an over-
#   estimate during a cut, and most people cut most of the time. The answer is
#   that the system now routes around it: a genuinely over-estimated maintenance
#   shows up as a stall, file 03's stall check suggests a break, and the moment
#   you take that break you are in Maintain — where the correction is allowed to
#   run. The estimate still gets fixed. It just gets fixed while you are eating
#   properly rather than while you are already short.
#
#   Rejected: refusing only on an outright GAIN (the downward walk still happens
#   on a plain stall, which is the commoner case), and damping the step rather
#   than blocking it (a new number with nothing behind it, and a rule you cannot
#   say in one sentence).
#
#   Holding in all cases:
#     • Upward correction is never slowed. Finding out you burn MORE than we
#       thought is good news and should arrive as fast as the evidence does.
#     • The floors already built are unaffected — they sit underneath this.
#     • Nothing here changes your mode. Mode is the picker's job (see file 03).
#
# ── DECIDED, DON'T RE-LITIGATE ───────────────────────────────
#   • No card in this file gets mode buttons. File 03 settled it: the three
#     chips are the only surface that changes mode, and nothing duplicates them.
#     The original draft had this card offering "Take a diet break" as a button
#     — that is now a contradiction, and it is removed.
#   • The break suggestion is NOT re-specified here. File 03's stall check
#     already says "your loss has stalled" after three flat weeks while cutting,
#     with copy the coach hat signed off. This file owns only what happens to
#     the NUMBER; file 03 owns what is said about taking a break.
#   • Two different reassurances about a weight rise, deliberately: file 03's
#     is for a rise while NOT cutting ("normal on a break"), and this file's is
#     for a rise while cutting. They never appear together, because you cannot
#     be doing both.
#   • Maintenance is floored at BMR × 1.2, not raw BMR. Nobody lives at their
#     resting metabolism, so a maintenance figure at raw BMR is unusable — the
#     parked targets-bmr-floor-wip branch got this wrong and was superseded.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   DERIVED figures are WORKED EXAMPLES — never hardcode them. Any maintenance /
#   TDEE kcal value is an OUTPUT for that example body:
#       FFM = weight × (1 − bodyFat/100) · BMR = 370 + 21.6 × FFM · TDEE = BMR × 1.2
#   Implement the formulas; exact arithmetic is owned by __tests__/logic.test.js.
#   Scenario Outlines use CONTRASTING bodies so the floor value changes — proof
#   it is computed, not baked in.
#   POLICY CONSTANTS (the only literals; owned by logic.test.js):
#       ADJ_CAP = 600 kcal (accumulated adaptive adjustment limit, either way)
#       ACTIVITY_MULT = 1.2 (sedentary; the seed is 1.20–1.55, see ENERGY_MODEL §3.1)
#       MAX_DEFICIT_FRAC = 0.25 (steady-loss floor, file 01)
#       CAL_MIN_WEIGHINS = 6 (before the correction speaks at all)
#   NO new policy constant is needed. The rule is a direction test plus a
#   "was I cutting?" test, both of which the app already knows.
# ─────────────────────────────────────────────────────────────

Feature: The app's own guess can never talk you into under-eating

  # ── ALREADY BUILT — kept as regression cover, not as work ──

  Scenario Outline: The correction can never pull maintenance below its floor
    Given I am in "Maintain" mode
    And my sedentary-maintenance floor (BMR × 1.2) works out to <floor> kcal
    And a full negative adjustment would otherwise put maintenance at <raw> kcal
    When the app calculates my maintenance target
    Then my maintenance target is <floor> kcal, not <raw> kcal
    And I see a note "Held at your minimum maintenance"

    # Different bodies → different floors, so no single value can be baked in.
    Examples:
      | floor | raw   |
      | 2,231 | 1,631 |
      | 1,680 | 1,200 |

  Scenario: The correction is itself capped, and the floor still wins
    Given the weekly calibration keeps signalling a lower TDEE for many weeks
    When the adjustment accumulates
    Then it never grows more negative than ADJ_CAP (600 kcal)
    And even at the cap my maintenance is still held at its sedentary-TDEE floor

  Scenario: A deliberate cut is floored by rate of loss, not by BMR
    Given I have deliberately selected "Cut" mode
    When the app calculates today's cut target
    Then the target is never more than MAX_DEFICIT_FRAC below my believable maintenance
    And no separate BMR floor is applied to a cut, because a cut is a choice
    And my maintenance floor of BMR × 1.2 does not apply while I am cutting

  # ── BUILT 2026-08-09 — the asymmetry ───────────────────────
  # Lives in runCalibration (app.jsx): the raw step is computed exactly as before, then
  # refused if it is negative AND the majority of the measured week's declared modes were
  # "Cut". The refusal returns adj 0 alongside `wouldHaveBeen`, so nothing is hidden.
  # The explanation card is DERIVED every render (gainWhileCutting) rather than stored as
  # an event: the explanation should be available whenever the situation is real, not only
  # in the moments after a weigh-in. It reads a TWO-week trend, because one week of water
  # is precisely the noise the card exists to explain away.

  Scenario: Gaining weight while eating less than maintenance does not cut my target
    Given I have eaten at a calorie deficit for the past 2 weeks
    And my 7-day average weight has risen
    When the weekly calibration runs
    Then the app does not lower my calorie target
    And I see a card "Weight up while eating less than maintenance"
    And it says this is usually water, glycogen or muscle — not a slower metabolism
    And it does not tell me to eat less, or treat the rise as something I did wrong
    And the card has no mode buttons — changing mode is the picker's job

  Scenario: Good news still arrives at full speed
    Given my 7-day average weight has fallen faster than the app predicted
    When the weekly calibration runs
    Then my target is raised by the full step the evidence supports
    And no damping or refusal applies in this direction

  Scenario Outline: Lowering is refused whenever I am cutting, whatever the scale did
    Given my prescribed target sits <position> maintenance
    And the calibration would lower my target by <step> kcal
    When the weekly calibration runs
    Then the downward correction is <outcome>

    # Eating AT or ABOVE maintenance and still not losing is clean evidence of a
    # lower burn, and the app should act on it. Eating BELOW maintenance and not
    # losing is not — that is the case with five innocent explanations.
    Examples: the test is "was I cutting", not "did the scale rise"
      | position | step | outcome  |
      | below    | 50   | refused  |
      | below    | 200  | refused  |
      | at       | 50   | applied  |
      | above    | 200  | applied  |

  Scenario: A cut that ends lets the estimate catch up
    Given the app has been refusing to lower my estimate throughout a long cut
    And my maintenance estimate is genuinely too high
    When I switch to "Maintain" and keep weighing in
    Then the calibration is free to lower the estimate again
    And it converges from there at its normal pace
    # This is why refusing during a cut costs nothing in the end: the correction
    # is deferred to the phase where acting on it is safe, not thrown away.

  Scenario: A stall leaves the number alone and lets file 03 do the talking
    Given I have eaten at a deficit for 3 weeks
    And my 7-day average weight has not fallen
    When the app advises me
    Then my calorie target is unchanged from before the calibration ran
    And the break suggestion I see is file 03's stall nudge, not a second card
    And nothing on screen suggests eating less as the answer to a stall

  Scenario: Muscle gain during recomposition is not misread as a lower metabolism
    Given my weight has crept up while I am training and eating below maintenance
    When the calibration runs
    Then my TDEE estimate is unchanged by the weight rise
    And the same card invites me to update my body-fat % so targets track lean mass
    And the invitation is a link to my profile, optional, and blocks nothing
    # Simplified at build: the draft only showed this if "logged strength workouts
    # have increased over the past month". That condition bought nothing — the invitation is
    # harmless and useful in every gain-while-cutting case, and a month of workout
    # history is machinery to maintain for no change in what the user sees. The
    # invitation therefore rides the card that already exists rather than needing
    # a surface of its own.

  Scenario: A cut target below resting metabolism is allowed, and said plainly
    Given today's cut target lands below my BMR but at or above my steady-loss floor
    When the app shows the target
    Then the cut target is allowed
    And I see an amber note "Below your resting metabolism — fine short-term, not a
      level to live at"
    And the note is silent when a floor has already spoken, so only one card explains
    And it is silent outside Cut, where it would alarm rather than inform
    # Deliberate: a cut IS a choice to eat below what you burn, and for a lean
    # body the arithmetic lands below BMR without anything being wrong. Naming it
    # honestly beats either hiding it or forbidding it.

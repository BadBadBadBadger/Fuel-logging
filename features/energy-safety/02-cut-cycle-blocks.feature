# ─────────────────────────────────────────────────────────────
# REVIEWED & LOCKED 2026-08-07 (session 13). Energy-safety workstream, file 2 of 5.
# Resolved by: founder + coach hat + an outside review. Ready to implement.
#
# WHY: Nothing in the app caps how LONG a user cuts. A deficit from
# January to June with no structured break is exactly what harmed the
# founder. This introduces CUT CYCLING: a deficit runs as time-boxed
# blocks, each ending in a diet break, instead of one open-ended cut.
#
# EVIDENCE (coach hat, tiered):
#   • WELL-ESTABLISHED: prolonged continuous energy restriction drives
#     adaptive thermogenesis (metabolic slowdown) — Rosenbaum & Leibel
#     (2010); Fothergill et al. (2016, "Biggest Loser" 6-yr follow-up)
#     showed it persists for years. Slower loss preserves lean mass —
#     Garthe et al. (2011, IJSNEM): 0.5%/wk beat ~1%/wk in athletes.
#   • REASONABLE / RCT-SUPPORTED: structured diet breaks improve fat-loss
#     efficiency and reduce adaptation vs continuous dieting — MATADOR,
#     Byrne et al. (2018, Int J Obes): 2-weeks-cut / 2-weeks-maintenance
#     cycles in men. Intermittent dieting retains fat-free mass — Peos et
#     al. (2021). Review: Trexler, Smith-Ryan & Norton (2014, JISSN).
#   • PRACTITIONER FRAMEWORK (label as such): cut in ~6–12 week blocks,
#     break to maintenance, cut more frequently/shorter the leaner you are
#     — Helms et al. (2014, JISSN) natural-bodybuilding recommendations.
#   • NOT ESTABLISHED, DO NOT IMPLY: that any specific day count causes a
#     hormonal event. There is no threshold at which testosterone falls or
#     metabolism "breaks". Risk rises with SEVERITY × DURATION of low energy
#     availability. In people with obesity, weight loss often IMPROVES
#     testosterone; it is prolonged/severe restriction, especially alongside
#     heavy training, that suppresses it. All copy must reflect this.
#
# ── WHAT COUNTS AS CUTTING (decided, session 13) ──────────────
#   The unit is a DAY, it is NOT read from food logs, and days are NOT equal.
#
#   Rejected: an earlier draft counted a "deficit week" as a deficit logged on
#   ≥ 4 of 7 days. It under-counts the very user this exists to protect (months
#   in, logging patchily → clock barely ticks → the prompt never fires) and is
#   noisy for the diligent (one meal out flips a week).
#
#   IS IT A CUT DAY?
#     PRIMARY   — declared mode. A day counts when that day's mode is "Cut".
#                 Mode is already stored per day and synced; needs no logging.
#                 Days the app was never opened INHERIT the last known mode —
#                 mode persists until the user changes it.
#     BACKSTOP  — weight trend. A day also counts when the 7-day average weight
#                 is falling at ≥ TREND_CUT_RATE, whatever mode is selected.
#                 Catches switching to "Maintain" to silence the prompts while
#                 still under-eating.
#     NOT-LOGGED DAYS: assume MAINTENANCE for that day's *intake* (so no phantom
#     deficit reaches the adaptive TDEE) — but a non-logged day does NOT pause
#     the clock. "Stopped logging" is not evidence the cut stopped.
#
#   HOW MUCH DOES IT COUNT? — CUT LOAD (the outside review called this "cut
#   exposure"; same idea). A gentle deficit and an aggressive one are not the
#   same physiological event, so a day is weighted by how deep the deficit is:
#
#       dayLoad = deficitFrac / REFERENCE_DEFICIT
#       deficitFrac = 1 − (target kcal ÷ believable maintenance)
#
#   Both terms already exist inside calcTargets — `kcal` and `effTDEE`
#   (app.jsx:408-414). This is a weighting of the existing counter, not a new
#   subsystem. Worked through, and bounded at both ends by Step 4's
#   MAX_DEFICIT_FRAC = 0.25:
#       10% deficit → 0.50 load/day → hard prompt at ~24 real weeks
#       20% deficit → 1.00 load/day → hard prompt at 12 real weeks
#       25% deficit → 1.25 load/day → hard prompt at ~9.5 real weeks
#   A light cut may therefore run much longer; an aggressive one is cautioned
#   sooner. That IS the protection — which is why this file does NOT also adopt
#   a shorter calendar default (see REJECTED below).
#
#   LOAD USES THE PRESCRIBED DEFICIT, NOT THE ACHIEVED ONE — a deliberate
#   simplification. The target is known every day without any logging; what was
#   actually eaten is not. It errs toward prompting a break EARLIER than strictly
#   earned, which is the correct failure direction for a safety feature. Revisit
#   only if it proves noisy in practice.
#
#   "CONSECUTIVE" IS DELIBERATELY NOT STRICT: one maintain day must not reset
#   the counter, or the protection is trivially defeatable. AMENDED by file 03 —
#   a non-cut day no longer merely adds nothing, it pays the block DOWN pro rata,
#   and a block ends when that drain reaches zero. So rest days genuinely push a
#   break further out (which is the point), while a block can never be cancelled
#   by a long weekend.
#
# ── COPY MUST SHOW REAL WEEKS, NOT LOAD ──────────────────────
#   The TRIGGER is load; the NUMBER ON SCREEN is real elapsed calendar time.
#   Saying "You've been cutting for 8 weeks" to someone whose light cut took 16
#   real weeks to reach 56 load is simply false. So every card interpolates the
#   real week count. This also makes the feature self-explaining: the aggressive
#   cutter sees the prompt at 10 weeks, the gentle one at 24, and the number
#   they see is always the truth about their own calendar.
#
# ── NUMBERS CONTRACT ─────────────────────────────────────────
#   The thresholds here are POLICY CONSTANTS, owned by __tests__/logic.test.js
#   so a tweak doesn't rewrite these scenarios. Where a figure is a worked
#   example of a rule (5% of a starting weight), a Scenario Outline uses
#   CONTRASTING rows so the RULE, not the example number, is implemented.
#   They are GUARDRAILS, NOT PHYSIOLOGICAL LAWS. Copy must never present them
#   as the point at which something happens to the body.
#   POLICY CONSTANTS (all reviewable):
#       REFERENCE_DEFICIT     = 0.20 — the deficit that counts as one full day
#       CUT_MIN_FRAC          = 0.05 — below this it is noise, not a cut: 0 load
#       CUT_BLOCK_SOFT_NUDGE  = 56 load-days in the block
#       CUT_BLOCK_HARD_PROMPT = 84 load-days in the block
#       BLOCK_LOSS_TRIGGER    = 5% of bodyweight lost within a block
#       LEAN_MODIFIER: reuses the EXISTING isLeanBody()/LEAN_BF from Step 4
#                 (app.jsx:379 — 15% M / 23% F) → soft 42 / hard 56 load-days.
#                 Do NOT introduce a second leanness threshold for this file.
#       TREND_CUT_RATE   = 0.25% of bodyweight per week of sustained loss
#       DIET_BREAK_DAYS  = 14 rest days fully drain a block (owned by file 03,
#                 which replaced this file's BLOCK_END_GRACE — see below)
#
# ── REJECTED, WITH REASONS (do not re-litigate without new evidence) ─
#   • A ~42-day default cut / ~14-day forced maintenance cycle. These are
#     natural-bodybuilding numbers (Helms), whose own advice is to cut shorter
#     and more often THE LEANER YOU ARE — so applying them to everyone inverts
#     the lean modifier below. A general-population user at 32% body fat on a
#     working moderate deficit would spend a quarter of the year not losing, for
#     no demonstrated benefit in that population. Load-weighting already
#     protects the aggressive cutter; a short calendar default would do the same
#     job twice and penalise the wrong person.
#   • A GREEN/AMBER/RED traffic light over sleep, fatigue, recovery, hunger and
#     training performance. The app logs NONE of those — it has weight, deficit
#     size and estimated session calories. A system that presents as holistic
#     while running on half its inputs is worse than an honest partial one.
#     Those signals belong in 05-low-energy-availability-flags, which asks the
#     user directly and is honest about being self-report.
#   • Folding training load into the load term. Step 4 ALREADY modulates a
#     protection by training load — the low-fuel energy-availability warning
#     (app.jsx:417-418). Two protections driven by the same variable, firing at
#     different times, would contradict each other on screen. Keep it clean:
#     cut load = magnitude × duration; training load stays in the EA warning.
#
# ── AMENDED BY FILE 03, BUILT 2026-08-09 ─────────────────────
#   • BLOCK_END_GRACE is GONE. Seven consecutive rest days used to wipe a block
#     to zero outright; a block now closes only when its load has been DRAINED to
#     zero, which takes DIET_BREAK_DAYS of rest. Partial rest is never wasted and
#     never free: seven days pay half, three days leave a fifth-sized dent that
#     stands. The scenarios below say so.
#   • The rolling-year track (CUMULATIVE_CUT_ESCALATE / MAINTENANCE_DECAY) is
#     REMOVED, not amended. It escalated the break message after roughly a year
#     of dieting, and that is the wrong measure of harm: what hurts tracks energy
#     availability (Step 4) and how much bodyweight has come off
#     (BLOCK_LOSS_TRIGGER), neither of which is calendar time under a mild
#     deficit. A year of gentle, working dieting is what slow fat loss looks
#     like. Its replacement as the real backstop is file 03's STALL check — a
#     break is suggested because the scale stopped moving, not because the
#     calendar turned over.
#   • This file's known deviation is CLOSED: the prompt button now says
#     "Start a 2-week break" honestly, because the drain gauge tracks it.
#
# ── PERSISTENCE (columns are live on Supabase) ───────────────
#   Block state must survive a device change, or a long cut is forgotten by the
#   one thing meant to remember it. Unlike activity/weighCadence this may NOT be
#   local-only. Columns on `profiles`: cut_block_start (date),
#   cut_block_load (NUMERIC — fractional, not an int), cut_break_load (NUMERIC,
#   added by file 03 — the drain rate), last_break_end (date). `cut_load_year`
#   is retired and no longer written. Add a column FIRST, then wire
#   syncProfile/pull.
# The diet-break FLOW itself lives in 03-diet-break-intervention.
# ─────────────────────────────────────────────────────────────

Feature: Cut runs as load-weighted blocks, not an open-ended deficit

  Background:
    Given the app accumulates "cut load" for each day I spend in a deficit
    And a day at REFERENCE_DEFICIT (a 20% deficit) adds 1.0 load
    And a day counts as a cut day when its mode was "Cut", or my 7-day average
      weight is falling at TREND_CUT_RATE or faster whatever mode I selected
    And a day I never opened the app inherits the mode of the last day I did

  Scenario: The app starts a cut block when I first select Cut
    Given I have never run a cut before
    When I switch my mode to "Cut"
    Then the app records the start date of cut block 1
    And the app begins accumulating cut load from 0

  Scenario Outline: A gentler deficit takes longer to reach the same prompt
    Given my target sits <deficit> below my believable maintenance
    And I stay there every day without a break
    When I have been cutting for <weeks> weeks
    Then I see the hard diet-break prompt for the first time
    And the card tells me I have been cutting for <weeks> weeks

    # Same 84 load-days in every row — only the depth of the deficit differs.
    # Bounded above by Step 4's MAX_DEFICIT_FRAC, so ~9.5 weeks is the fastest
    # any preset target can possibly trip this.
    Examples: deeper cut, sooner caution
      | deficit | weeks |
      | 10%     | 24    |
      | 20%     | 12    |
      | 25%     | 9.5   |

  Scenario: A deficit too small to matter accrues nothing
    Given my target sits only 3% below my believable maintenance
    And that is under CUT_MIN_FRAC
    When I stay there for 30 days
    Then my cut load has not increased
    And no diet-break prompt appears

  Scenario: Not logging my food does not pause the clock
    Given I have accumulated 40 cut load in the current block
    And I then log no food at all for 6 days while still cutting at REFERENCE_DEFICIT
    When I open the dashboard
    Then my cut load is 46
    And those 6 days were treated as maintenance intake for my adaptive TDEE

  Scenario: A single day off Cut does not reset the counter
    Given I have accumulated 30 cut load in the current block
    And I spend one day in "Maintain" mode and then return to "Cut"
    When I open the dashboard
    Then I am still in the same cut block
    And that day added no load rather than resetting my total

  Scenario: Losing weight while calling it Maintain still counts as cutting
    Given my mode has been "Maintain" for the last 3 weeks
    And my 7-day average weight has been falling faster than TREND_CUT_RATE throughout
    When I open the dashboard
    Then those days have accumulated cut load
    And I am treated as being in an open cut block

  # This card has a SECOND way in, added by file 03: a stall. Accumulated load is the
  # trigger here; a flat scale for STALL_WEEKS is the trigger there. Same card, different
  # opening line — the rule and its copy are owned by 03, not duplicated in this file.
  Scenario: A soft nudge appears at the soft-nudge threshold
    Given I have accumulated CUT_BLOCK_SOFT_NUDGE (56) cut load in the current block
    And I am not yet at the hard-prompt threshold
    And 11 real weeks have passed since this block started
    When I open the dashboard
    Then I see a dismissable amber card "You've been cutting for 11 weeks"
    And the card says "A couple of weeks at maintenance now can ease diet fatigue and make the next stretch easier"
    And the card does not claim a break will reset my metabolism
    And the card shows a "Start a 2-week break" button
    And the card shows a "Not yet" button that dismisses it for 7 days

  Scenario: A hard prompt appears at the hard-prompt threshold
    Given I have accumulated CUT_BLOCK_HARD_PROMPT (84) cut load in the current block
    And 16 real weeks have passed since this block started
    When I open the dashboard
    Then I see a non-dismissable red-bordered card "Time for a diet break"
    And the card says "16 weeks is a long stretch in a deficit. Let's spend a couple of weeks at maintenance."
    # "a couple of weeks", not "2 weeks": the button commits to a fortnight, the sentence
    # does not — a break ends when the load drains, which rest days govern, not the calendar.
    And the card shows a primary "Start a 2-week break" button
    # Honest as of file 03: the button switches to Maintain, and the drain gauge tracks it.
    And the card shows a secondary "Remind me in 3 days" button
    And I can still use the rest of the app while the card is shown

  Scenario: The hard prompt cannot be dismissed and its week count keeps climbing
    Given the "Time for a diet break" card is showing after 16 real weeks of cutting
    When I tap "Remind me in 3 days"
    Then the card is hidden for 3 days and then returns by itself
    And there is no action anywhere that removes it permanently
    And each time it returns it shows my real elapsed weeks, which has grown
    And four weeks later it reads "20 weeks" rather than the count it first appeared with

  Scenario Outline: A break is prompted after losing BLOCK_LOSS_TRIGGER of bodyweight in a block
    Given I started the current cut block at <start> kg
    And my 7-day average weight has reached <now> kg
    When I open the dashboard
    Then I see the "Time for a diet break" card
    And the card says "You've lost 5% of your bodyweight this block — a great point to consolidate"
    And this prompt fires even if I am below the cut-load threshold

    # <now> is <start> × (1 − BLOCK_LOSS_TRIGGER); different starts prove it is a percentage, not a fixed weight.
    Examples: 5% of a different starting weight → a different trigger point
      | start | now |
      | 100   | 95  |
      | 80    | 76  |

  Scenario Outline: Thresholds shift for leaner users (LEAN_MODIFIER)
    Given my body fat classifies me as "<leanness>" by the existing isLeanBody rule
    And I have accumulated <load> cut load in the current block
    When I open the dashboard
    Then I see the "<prompt>" prompt

    Examples: the lean modifier pulls both thresholds earlier
      | leanness | load | prompt          |
      | normal   | 56   | soft nudge      |
      | normal   | 84   | hard diet-break |
      | lean     | 42   | soft nudge      |
      | lean     | 56   | hard diet-break |

  # AMENDED by file 03 (was: BLOCK_END_GRACE — 7 rest days wiped the block outright).
  # Time off now BUYS the block down rather than cancelling it, so a week off is worth
  # exactly a week and nothing is either wasted or free.
  Scenario: A block ends when rest has drained it, not after a fixed stretch off Cut
    Given I have accumulated 50 cut load in the current block
    When I spend 7 consecutive days not cutting
    Then my block load is 25 and the block is still open
    When I spend another 7 consecutive days not cutting
    Then the current cut block is closed
    And a later switch back to "Cut" starts a new block from 0

  Scenario: Completing a diet break starts a fresh block
    Given I have completed a diet break, so my block load reached 0
    When I switch back to "Cut" mode
    Then the app records the start of the next cut block
    And my cut load for the block starts from 0

  Scenario: Block state survives moving to a new device
    Given I have accumulated 60 cut load in the current block on my phone
    When I sign in on a different device
    Then that device shows the same cut block and the same 60 cut load
    And the diet-break prompts fire at the same point they would have on my phone
    And a break already under way keeps draining at the same rate — see file 03

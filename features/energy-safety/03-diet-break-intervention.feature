# ─────────────────────────────────────────────────────────────
# BUILT 2026-08-09 (session 15). Energy-safety workstream, file 3 of 5.
# v2, rewritten 2026-08-08 after founder review killed the v1 draft; proofread and
# locked by the founder 2026-08-09, with one addition made at proofread — THE STALL
# CHECK (see its own section below). Exact numbers live in __tests__/logic.test.js.
#
# WHY — AND WHAT A BREAK ACTUALLY IS (decided, session 14):
#   A break is simply NOT CUTTING. Switching to Maintain — or Bulk — IS the
#   break. There is no break state, nothing to start, nothing to finish, no
#   promise to keep and therefore nothing to fail at. v1 drafted the break as
#   a tracked 14-day mode with a countdown, completion card and choice
#   buttons; the founder rejected all of it. What survives is the one thing a
#   break is FOR: paying down the accumulated cut load so the app can tell
#   the user, honestly, when it thinks cutting again is reasonable — a safety
#   net, never an instruction.
#
# THE ONE MECHANISM — a single gauge, read in two directions:
#   The cut-load number from file 02 becomes VISIBLE as a bar. While cutting
#   it fills (deficit-weighted, per 02). While not cutting it drains. Same
#   number, same bar; only the direction and the copy flip with the mode.
#
#       Cutting:      ▓▓▓▓▓▓▓░░░  "Cutting · week 7" — filling toward the
#                                  point where a break would help
#       Not cutting:  ▓▓▓▓▓░░░░░  "On a break · day 5 — about 9 days to
#                                  fully recharged"
#
# EVIDENCE (coach hat — carried over from v1, still governs the copy):
#   • Diet break = a planned return to maintenance for a set period,
#     typically ≥ 1–2 weeks — MATADOR used 2 weeks (Byrne 2018).
#   • Maintenance must be REAL maintenance — floored at sedentary TDEE
#     (BMR × 1.2), no residual deficit. Already enforced by Step 4.
#   • Returning to maintenance is what eases diet fatigue and supports
#     recovery over weeks (Rossow 2013; Fagerberg 2018). "Reverse dieting"
#     as a precise protocol is weakly evidenced — we do not claim it.
#   • NOT ESTABLISHED, DO NOT IMPLY: that 14 days is a physiological
#     threshold. It is a policy constant sized to the best-studied break
#     length. Copy must say "about", "roughly", "if you want to".
#
# ── DECISIONS LOCKED THIS SESSION (founder) ──────────────────
#   1. Maintain and Bulk drain the load IDENTICALLY. "It's the days not in
#      cut that count." No surplus multiplier — there is no number we could
#      defend.
#   2. Drain is PRO-RATA over DIET_BREAK_DAYS (14): each non-cut day removes
#      1/14 of the load the block had when the break began. A full 14-day
#      break clears any block; 7 days clears half; 3 days is a real dent
#      (~a fifth). Partial rest is never wasted — this replaces v1's
#      completed-break-or-nothing reset AND closes the gaming vector via the
#      early-return guard (below), not by withholding credit.
#   3. NOTHING ever changes mode automatically. When the load reaches 0 the
#      app never resumes a cut, suggests one at most once, and goes quiet.
#      The mode picker — three chips, always visible — is the only surface
#      for changing mode. No card duplicates it with buttons.
#   4. The bar shows whenever there is something to show: always while a
#      block is open (cutting), and while load remains to pay down (any
#      mode — this is when a bulk shows it). Load 0 and not cutting → no
#      bar. A months-long bulk with nothing owed shows nothing.
#   5. The only guarded action is returning to Cut too early — and only when
#      the block had actually reached the point where a break was advised
#      (soft-nudge threshold). A short casual cut never sees the guard.
#      Switching to Bulk is NEVER guarded. Accepting a break is never
#      guarded, confirmed, or made into a decision — it is one tap.
#
# ── THE STALL CHECK (added at proofread, founder + coach hat) ─
#   A third way into 02's soft nudge, and the honest one. Cutting for STALL_WEEKS
#   with the scale refusing to move means one of three things: adherence has
#   drifted, the body has compensated, or water is masking a real loss. In all
#   three "cut harder" is the wrong answer and time at maintenance is the fix.
#   Calendar time alone never triggers this — a gentle cut that IS working stays
#   unbothered however long it runs.
#     • THE COPY MUST BE BLAMELESS. In a calorie tracker, the reflex answer to
#       "you're doing it wrong" is to eat less. Never imply fault; name the three
#       ordinary causes and point at maintenance.
#     • It measures over THREE WEEKS, not one: a fortnight of water retention is
#       not a stall, and saying so would be a lie we'd have to walk back.
#     • Not enough weigh-ins ⇒ SILENCE, never a guess (trendLossFrac returns null).
#   This replaces the rolling-year track as the app's backstop against endless
#   dieting, and aims it far better — see the removal note below.
#
# ── SUPERSEDES (02 amendments — made in the same build) ───────
#   • BLOCK_END_GRACE (7 non-cut days → block wiped to 0) is REPLACED by the
#     pro-rata drain: a block now closes when its load DRAINS to 0, which
#     takes DIET_BREAK_DAYS of rest. 02's block-ends scenario is rewritten.
#   • The rolling-year track (CUMULATIVE_CUT_ESCALATE = 168 / MAINTENANCE_DECAY)
#     is REMOVED outright, at the founder's call. It escalated the break message
#     after ~a year of dieting, which is the wrong measure of harm: what hurts
#     tracks energy availability (Step 4) and how much bodyweight has come off
#     (BLOCK_LOSS_TRIGGER), not calendar time under a mild deficit. A year of
#     gentle, working dieting is what slow fat loss looks like. The `cut_load_year`
#     column is left in place, unwritten, rather than dropped.
#   • 02's known deviation is closed: the hard prompt's primary button now
#     honestly says "Start a 2-week break" — it switches mode to Maintain
#     and the drain gauge is the real, tracked feedback v1's countdown
#     pretended to be.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   POLICY CONSTANTS (owned by __tests__/logic.test.js):
#       DIET_BREAK_DAYS = 14 — rest days that fully drain a block, whatever
#                 its size. Remaining = loadAtBreakStart × (1 − restDays/14),
#                 computed from the original rather than by repeated
#                 subtraction, so fourteen days land exactly on zero.
#       CUT_BAR_MIN_LOAD = 7 — about a week of real cutting before the gauge
#                 says ANYTHING. Added at build (2026-08-09) after the founder
#                 hit the nonsense case: Cut is the DEFAULT mode, so merely
#                 opening the app for a day accrues load and opens a block, and
#                 because the drain is pro rata that one-day block announced
#                 "about 14 days to fully recharged" — over a single day of
#                 cutting, with nothing logged. The counter still runs from day
#                 one (that is the protection); only the TALKING waits.
#                 While filling, the bar appears once the CURRENT load reaches
#                 the minimum. While draining, it stays up as long as the load
#                 was above the minimum when the break BEGAN — otherwise it
#                 would vanish just as the user was about to finish.
#       STALL_WEEKS = 3 — weeks of a flat scale, while cutting, that read as a
#                 stall. The RATE it compares against is TREND_CUT_RATE, which
#                 02 already owns — losing slower than the backstop calls
#                 "cutting" is precisely what a stall is. No new rate constant.
#       RECHARGED_CARD_DAYS = 3 — after which the celebration card retires
#                 itself, dismissed or not.
#       GUARD threshold: the early-return confirm fires only when
#                 loadAtBreakStart ≥ the block's soft-nudge threshold
#                 (cutThresholds — lean-adjusted, per 02). Reuse it; do NOT
#                 introduce a new constant.
#   DERIVED figures in scenarios are WORKED EXAMPLES of those constants —
#   never hardcode them. Scenario Outlines use CONTRASTING rows so the rule,
#   not the example, is what gets implemented. Exact arithmetic is owned by
#   logic.test.js.
#
# ── REJECTED, WITH REASONS (do not re-litigate without new evidence) ─
#   • A fourth "Diet Break" mode / a tracked break state with its own
#     countdown, completion card and choice buttons (v1's entire shape).
#     A break with a contract is a promise the user can break; a mode you
#     are simply in cannot be failed. Killed by the founder, session 14.
#   • Bulk draining faster than Maintain. Plausible, no defensible number.
#   • Pausing the adaptive auto-lowering "during the break". With no break
#     state there is nowhere to hang it — and the real fix is global: stop
#     misreading a weight rise as a slower metabolism. That is 04's second
#     half (the auto-lowering fix). This file ships the REASSURANCE COPY
#     only; 03 and 04 deploy together in the batched device test, so the
#     unpatched window never reaches a device.
#   • The symptom-linked "consider staying at maintenance longer" extension
#     (v1 scenario 7). It needs the symptom check that file 05 owns; a
#     dormant hook here would be dead code pretending otherwise. Moved to
#     05's remit.
#
# ── PERSISTENCE (as built) ───────────────────────────────────
#   The drain mutates cut_block_load in place, so the synced columns carry the
#   headline state. The break-start load earned ONE new column,
#   `cut_break_load` — without it a second device resumes the break at the wrong
#   speed and skips the guard, which the continuity scenario below forbids. The
#   off-day cursor needed no column: it is algebra on the two synced numbers,
#   offRun = DIET_BREAK_DAYS × (1 − load ÷ breakLoad), re-derived on pull.
#   ⚠️ Run the ALTER TABLE before deploying — an upsert naming a missing column
#   400s and takes the whole profile sync down with it.
#   Local-only, deliberately: `rechargedOn` (the celebration card). Missing one
#   card on a second device is a trivial loss; a column is not worth it.
# ─────────────────────────────────────────────────────────────

Feature: A break is time not cutting — measured, encouraged, and guarded

  Background:
    Given cut load accumulates per file 02 while I am cutting
    And any day that is not a cut day drains the open block by 1/DIET_BREAK_DAYS
      of the load it had when the break began
    And a "cut day" is decided exactly as file 02 decides it — declared mode,
      with the weight-trend backstop

  # ── Starting a break ───────────────────────────────────────

  Scenario: Accepting the break prompt is a single tap to Maintain
    Given the hard "Time for a diet break" card from file 02 is showing
    When I tap "Start a 2-week break"
    Then my mode is "Maintain" — the same Maintain as the mode picker's chip
    And no confirmation dialog interrupted me
    And I see a toast "Break started — eat at maintenance and recharge"
    And the bar switches to its draining face, reading "On a break · starting today"
    # Today already accrued as a cut day before I tapped, so the first rest day is
    # tomorrow. Calling it "day 1" now would be a day's worth of flattery.

  Scenario Outline: Maintain and Bulk are the same break — identical drain
    Given my block had 84 load when I stopped cutting
    When I spend 7 days in "<mode>" mode
    Then my block load is 42
    And the bar and its copy are identical in both modes

    # It's the days not in cut that count — a surplus earns no faster drain.
    Examples:
      | mode     |
      | Maintain |
      | Bulk     |

  # ── The drain ──────────────────────────────────────────────

  Scenario Outline: Each rest day pays down a fixed share of the block
    Given my block had <pause> load when I stopped cutting
    When I spend <days> consecutive days not cutting
    Then my block load is <after>

    # after = pause × (1 − days/DIET_BREAK_DAYS). Contrasting pause loads
    # prove the rate is derived from the block, not a fixed number.
    Examples: half the break pays half the load, whatever the load
      | pause | days | after |
      | 84    | 7    | 42    |
      | 42    | 7    | 21    |
      | 84    | 3    | 66    |

  Scenario Outline: A full break clears any block
    Given my block had <pause> load when I stopped cutting
    When I spend DIET_BREAK_DAYS (14) days not cutting
    Then my block load is 0
    And the block is closed
    And a later switch to "Cut" starts a fresh block from 0

    Examples: 14 rest days is a complete break at any depth
      | pause |
      | 84    |
      | 30    |

  Scenario: Cutting mid-break keeps the credit already earned
    Given my block had 84 load when I stopped cutting
    And I have rested 5 days, so my load has fallen
    When I switch back to "Cut" and cut for a day
    Then the drain stops and that day's load is added per file 02
    And the load I already paid down is not restored — the dent stands

  # ── The stall: the honest reason to break ──────────────────

  Scenario: Three weeks of cutting with a flat scale suggests a break
    Given I have been in an open cut block for STALL_WEEKS (3) weeks or more
    And my weight trend over those three weeks is flatter than TREND_CUT_RATE
    When I open the dashboard
    Then I see file 02's soft nudge card, opening "Your loss has stalled"
    And it says the scale hasn't moved in about three weeks, and that bodies
      adapt to a long deficit
    And it offers the same "Start a 2-week break" and "Not yet" buttons
    And nothing in it suggests eating less, or implies I am at fault

  Scenario Outline: The stall is about the scale, never the calendar
    Given I have been cutting for <weeks> weeks with a load below the soft threshold
    And my three-week weight trend is <trend>
    When I open the dashboard
    Then the stall nudge is <shown>

    # A cut that IS working stays unbothered however long it runs — this is what
    # replaced the rolling-year escalation, and it aims at the right person.
    Examples:
      | weeks | trend                       | shown     |
      | 12    | flat                        | shown     |
      | 3     | flat                        | shown     |
      | 2     | flat                        | not shown |
      | 12    | losing at TREND_CUT_RATE    | not shown |

  Scenario: Without enough weigh-ins the stall check says nothing
    Given I have been cutting for 8 weeks
    And I have too few weigh-ins to establish a three-week trend
    When I open the dashboard
    Then no stall nudge is shown
    And the app does not guess, or ask me to weigh in more as a condition of it

  Scenario: A flat scale on a break is not a stall
    Given my mode is "Maintain" and my weight has been flat for three weeks
    When I open the dashboard
    Then no stall nudge is shown — a flat scale is exactly what a break looks like

  Scenario: The more serious message wins — only one card speaks
    Given my block has reached the hard-prompt threshold
    And my three-week weight trend is also flat
    When I open the dashboard
    Then I see only the "Time for a diet break" card
    And the stall copy is not shown alongside it

  Scenario: A break in name only does not recharge
    Given I switched to "Maintain" but my 7-day average weight is still
      falling at TREND_CUT_RATE or faster
    When those days accrue
    Then they count as cut days per file 02's backstop — the load rises
    And the bar keeps filling rather than draining
    And no break copy is shown

  # ── The bar, in both directions ────────────────────────────

  Scenario: While cutting, the bar fills toward "a break would help"
    Given I am in an open cut block below the soft-nudge threshold
    When I open the dashboard
    Then I see a bar whose fill is my load as a share of my soft-nudge
      threshold (lean-adjusted, per file 02)
    And its label shows my real elapsed weeks, never a load number
    And at the soft-nudge threshold the file-02 nudge card takes over the
      messaging — the bar does not duplicate its advice

  Scenario: While a break is under way, the bar drains and counts rest days
    Given my block had 84 load when I stopped cutting
    And I have spent 5 days not cutting
    When I open the dashboard
    Then I see the bar draining, labelled "On a break · day 5"
    And an estimate "about 9 days to fully recharged"
    And an encouraging line "Recharging now sets up your next block"
    And every estimate is worded as an estimate, never an instruction

  Scenario Outline: The bar appears only when there is something to show
    Given my mode is "<mode>" and my remaining block load is <load>
    When I open the dashboard
    Then the cut-load bar is <shown>

    # Rule 4, plus CUT_BAR_MIN_LOAD: cutting → once there's about a week in the
    # block; otherwise only while load remains. A months-long bulk with nothing
    # owed shows nothing, and neither does a block barely a day old.
    Examples:
      | mode     | load | shown     |
      | Cut      | 10   | shown     |
      | Cut      | 1    | not shown |
      | Maintain | 40   | shown     |
      | Bulk     | 40   | shown     |
      | Maintain | 0    | not shown |
      | Bulk     | 0    | not shown |

  Scenario: A day-old cut says nothing at all
    Given I have just installed the app and changed no settings
    And Cut is the mode it starts in, so a block has quietly opened
    When I open the dashboard
    Then no bar, no break copy and no recharge estimate is shown
    And nothing suggests I am recovering from anything
    # The founder hit this one in the harness: "I have nothing logged at all yet,
    # so this pretty much doesn't make sense." Quite right — the app had accrued
    # a single default-mode day and was offering a fortnight of recharging for it.

  Scenario: A break that was worth announcing finishes on screen
    Given my block held well over CUT_BAR_MIN_LOAD when I stopped cutting
    And I have rested until only a sliver of load remains
    When I open the dashboard
    Then the bar is still shown, counting down its last day
    And it does not disappear just as I am about to finish

  # ── Finishing — quietly ────────────────────────────────────

  Scenario: A drained block celebrates once and goes quiet
    Given my block load has just reached 0 after a break
    When I open the dashboard
    Then I see a dismissible card "Recharged — you're in good shape to cut
      again, if you want to"
    And the card has no mode buttons — the mode picker is the only way to
      change mode
    And my mode has not changed by itself
    And the card retires by itself after 3 days if I never dismiss it
    And after that, nothing about breaks is shown at all

  Scenario: Weight up early in a break gets reassurance, not alarm
    Given I stopped cutting this week and my 7-day average weight has risen
    When I open the dashboard
    Then the break card adds "Weight up a little on a break is normal —
      usually water and glycogen, not fat"
    And no deficit framing or "over target" alarm accompanies it
    # The calibration misread itself (lowering TDEE off this rise) is fixed
    # globally by 04's auto-lowering fix — copy here, mechanism there.

  # ── The one guarded action ─────────────────────────────────

  Scenario: Returning to Cut early — after a break was advised — is guarded
    Given my block had reached its soft-nudge threshold before I stopped cutting
    And load remains to pay down
    When I tap the "Cut" chip in the mode picker
    Then I see a gentle confirm "Back to cutting already? About 9 more rest
      days would recharge you fully"
    And I can choose "Keep resting" or "Cut anyway"
    And "Cut anyway" is respected immediately with no further friction

  Scenario Outline: The guard only exists where the advice existed
    Given my block had <pause> load when I stopped cutting — <context>
    And load remains to pay down
    When I tap the "Cut" chip in the mode picker
    Then the guard confirm is <guard>

    # Reuses the lean-adjusted soft threshold from file 02 — no new constant.
    # A short casual cut never meets friction; switching to Bulk never does.
    Examples:
      | pause | context                        | guard     |
      | 84    | past the soft-nudge threshold  | shown     |
      | 20    | a short cut, never advised     | not shown |

  Scenario: Switching to Bulk is never guarded
    Given I am mid-break with load remaining, however large
    When I tap the "Bulk" chip in the mode picker
    Then the mode changes immediately with no confirm
    And the drain continues unchanged

  # ── Continuity ─────────────────────────────────────────────

  Scenario: Break progress survives a device change
    Given I am partway through a break with load partly paid down
    When I sign in on a different device
    Then that device shows the same remaining load and keeps draining from it
    And the guard behaves the same as it would have on my phone

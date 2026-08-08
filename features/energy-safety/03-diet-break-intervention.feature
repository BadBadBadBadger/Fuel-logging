# ─────────────────────────────────────────────────────────────
# DRAFT v2 — for founder proofread. Energy-safety workstream, file 3 of 5.
# Rewritten 2026-08-08 (session 14) after founder review killed the v1 draft.
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
# ── SUPERSEDES (02 amendments — make them in the same build) ──
#   • BLOCK_END_GRACE (7 non-cut days → block wiped to 0) is REPLACED by the
#     pro-rata drain: a block now closes when its load DRAINS to 0, which
#     takes DIET_BREAK_DAYS of rest. 02's scenario "A block ends after a
#     sustained stretch off Cut" must be rewritten to match. The yearly
#     total's own decay (MAINTENANCE_DECAY = 1.0/day) is unchanged.
#   • 02's known deviation is closed: the hard prompt's primary button can
#     now honestly say "Start a 2-week break" — it switches mode to Maintain
#     and the drain gauge is the real, tracked feedback v1's countdown
#     pretended to be.
#
# ── NUMBERS CONTRACT (read before writing code) ──────────────
#   POLICY CONSTANTS (owned by __tests__/logic.test.js):
#       DIET_BREAK_DAYS = 14 — rest days that fully drain a block, whatever
#                 its size. Drain per non-cut day = loadAtBreakStart / 14.
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
# ── PERSISTENCE ──────────────────────────────────────────────
#   The drain mutates cut_block_load in place, so the existing four synced
#   columns carry the headline state. The break-start load (drain rate) and
#   the off-day cursor are working fields; decide at build whether they ride
#   the local cut_block blob (a fresh device mid-break would re-derive the
#   rate from the synced load — acceptable) or earn a column. Same ordering
#   rule as always if a column is added: column first, wiring second.
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
    And the cut-load bar now drains instead of fills

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

    # Rule 4: cutting → always; otherwise only while load remains.
    # A months-long bulk with nothing owed shows nothing.
    Examples:
      | mode     | load | shown     |
      | Cut      | 10   | shown     |
      | Maintain | 40   | shown     |
      | Bulk     | 40   | shown     |
      | Maintain | 0    | not shown |
      | Bulk     | 0    | not shown |

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

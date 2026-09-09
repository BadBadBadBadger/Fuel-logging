# ── Intake scoring (red / amber / green) — daily and weekly ──────────────────
# Handover: a rough brief the founder wrote outside this repo (2026-08-26, no code access)
# argued the dashboard's four "targets" aren't equivalent — protein is a floor, calories are
# the master constraint, fat is a floor AND a ceiling, carbs are the flex remainder — and that
# scoring should grade the constraint each one actually represents, not raw distance from a
# number. This file is that argument worked through hat-by-hat (design / QA / nutrition-coach)
# in conversation on 2026-08-26, then turned into scenarios.
#
# SUPERSEDES dashboard/02-macro-tolerance.feature. That file's flat "any macro, 5g/15g over =
# amber/red, under is always fine" model is what gave the dashboard its arbitrary macro-bar
# colours in the first place — protein/carbs/fat painted blue/orange/red-orange with no role
# behind the choice. This file replaces that model with the asymmetric roles below, and
# deliberately collapses those three brand tints into one uniform green/amber/red — that's an
# intentional simplification, not an oversight the swarm review left unresolved; confirm with
# the founder if the per-macro tints were meant to survive underneath the new semantics.
# dashboard/02 should be deleted once this is built, not kept alongside it.
#
# KEEPS dashboard/01-calorie-tolerance.feature's 100/200/500 kcal over-bands as the Cut-mode
# calorie penalty (see "Calories" below) — already built, already the right shape for this
# role, not reopened here. NOTE for whoever ships this: 01's own scenarios are written as
# goal-agnostic, but this file shows they're really only true for Cut (and partly Maintain) —
# flatly wrong for Bulk, where under is the primary penalty. Once 04 ships, 01 needs a header
# note scoping it explicitly to the Cut role; it isn't self-updating.
#
# Reuses rather than re-derives:
#   • the fat health floor — FAT_FLOOR_PER_KG = 0.6 g/kg bodyweight (app.jsx:283), the same
#     hormonal floor computeMacros already enforces. Resolves handover §5.E.
#   • dashboard/01's 100/200/500 kcal shape — kept verbatim for Cut's calorie bands, mirrored
#     for Bulk's. Fat's ceiling/floor bands do NOT reuse dashboard/02's flat-gram shape — see
#     the swarm-review note below; they're percentage-of-target/floor, matching protein.
#   • the eating-window pacing already built for the coach (paceVerdict / EATING_WINDOW_H,
#     app.jsx:433-436, built specifically to give protein and water early-day grace —
#     app.jsx:427-431) as the day-open/day-close signal (§4) and now also as the mid-day protein
#     grading itself (see "While the day is open, protein is paced…") — extended with a fallback
#     for a day with nothing logged at all, which that function alone never closes on its own.
#
# NOT in this file, on purpose:
#   • a weight-trend "gaining too fast on a bulk" warning. That grades the scale, not logged
#     intake, and this file's own guardrail keeps scoring separate from the bodyweight trend and
#     from estimate accuracy. It belongs beside the other weight-trend safety cards —
#     energy-safety's gainWhileCutting (app.jsx:636) and TREND_CUT_RATE (app.jsx:574) are the
#     direct mirror — as its own card, not folded into this one.
#   • new badge or celebration mechanics for a clean week. A clean week is a badge condition
#     inside the existing badge logic (engagement/01-logging-celebration), not a fourth colour or
#     a new celebration tier — see the "more badge categories" backlog item.
#   • proving the protein floor and the calorie ceiling are simultaneously hittable on an
#     aggressive cut. That's already covered — `floorsExceedKcal` (computeMacros, app.jsx:280,
#     303) is true exactly when the floors plus minimum carbs cost more than the target allows,
#     and targets/03-macro-floors.feature owns that behaviour. This file scores whatever the
#     floored targets turn out to be; it doesn't re-derive whether they fit together.
#   • how the two-ring dial is drawn. `05-intake-score-card-layout.feature` owns presentation —
#     ring geometry, positioning, and how the card composes states this file computes. This file
#     never mentions ring geometry or screen position; if you're looking for that, it's there.
#
# Marked OPEN below are numbers the handover explicitly asked not to ship as decided (§5):
# band widths, the hero's priority order when several things are wrong at once, and the
# day-close fallback hour. Each is proposed with reasoning, not picked silently — awaiting
# founder sign-off. Do not treat as final until the @draft tag is removed.
#
# ── Swarm review, 2026-08-27 ──────────────────────────────────────────────────
# Reviewed by a QA-automation agent and a Critical-Thinking agent (personas/qa-automation.md,
# personas/critical-thinking.md), each independently, then each given the other's report and
# asked to respond. Findings below are what survived that exchange. Two were ranked above
# everything else in this file, tagged `@founder-blocking` — both DECIDED by the founder on
# 2026-09-04 (tags now removed; see the resolved scenarios themselves for the mechanism):
#
#   RESOLVED — "reads as" could tell a user pinned at their own safety floor that they "haven't
#   really cut": fixed with a floor-majority override, not a new baseline — see "A week spent
#   mostly at the safety minimum reads as a cut, not a shortfall" below. An unlogged day could
#   outscore an honestly-logged bad one on a Cut: fixed by excluding unlogged days from the
#   average outright, with the day-count always shown for transparency — see "An unlogged day is
#   excluded…" below. Both had pushed toward under-eating for the exact population this app
#   exists to protect.
#
# Also fixed in this pass: the hero priority table contradicted both the comment introducing it
# and the standalone "fat floor always outranks a ceiling breach" scenario — the table was wrong,
# not the prose; reordered so the floor genuinely comes first everywhere. Fat's ceiling/floor
# bands were flat grams while protein (a few scenarios earlier) explicitly rejected flat grams
# for the same bodyweight-scaling reason — converted fat to percentage bands too. Protein's
# under-target grading had no day-open/day-close precondition despite the header claiming it
# reuses paceVerdict, which exists specifically to give protein early-day grace — split into a
# paced open-day scenario and a scenario restricted to day close. Plus: missing scenarios for
# carbs-over-when-calories-also-over, carbs-under-at-close, a fully unlogged day's own ring
# state, and under-7-days-of-history; "green or neutral" resolved to one colour; Bulk's mirror
# now uses the
# same field name and phrasing convention as Cut's; a global rule for shared band boundaries so
# no table leaves its edge value ambiguous; "hero" defined; a scoping caveat added for
# dashboard/01.
#
# Then an Anti-Metaphor Hero pass (personas/anti-metaphor.md) swept wording only — caught a
# live "gate"(verb) regression and several coined-and-bare labels, all fixed without touching
# any number or Given/When/Then structure. Renaming one scenario's title away from a mislabelled
# "flex macro" collective surfaced a genuine gap underneath the wording: Bulk's own calorie-under
# rule has no day-open/day-close split, so it can disagree with the generic day-open "under is
# on pace" rule for the same real situation. Fixed to leave open, not silently resolved. A final
# Critical-Thinker sign-off pass then caught one more: "the baseline" scenario's Given/When/Then
# still asserted the exact formula its own comment had shown wrong — rewritten to hedge without
# deciding, matching how the unlogged-day scenario already handles its own open question.
#
# ── Swarm review round 2 (atomicity + structure), 2026-08-27 ─────────────────────
# Founder asked for a second pass: every scenario atomic (one functionality, never two), and a
# real decision on this file's structure — reviewed independently by QA-automation,
# Critical-Thinking, and a Nutrition-Coach persona (personas/nutrition-coach.md), each blind to
# the others' answer on the structural question, then reconciled.
#
# STRUCTURE: this file stays ONE file for daily + weekly grading — that was a genuine three-way
# disagreement (QA first proposed splitting daily/weekly/layout into three files; the coach
# argued for keeping everything in one file, since the weekly baseline is only ever correct in
# reference to the daily floor logic that feeds it — this file's own worst bug, the SAFE_MIN
# mismatch worked through in the weekly baseline scenario below, happened exactly when that
# reference went missing; Critical-Thinking argued
# for a different cut entirely — logic vs. presentation, not daily vs. weekly, since a strict
# daily/weekly split leaves the guardrails and the layout scenarios homeless). QA's final
# decision, after weighing both: split along logic vs. presentation. Daily and weekly grading
# stay together, permanently, in this file — `05-intake-score-card-layout.feature` carries only
# the two-ring dial's composition (~2 scenarios), which presupposes states this file computes
# rather than computing anything itself. The coach's core objection (don't sever weekly from
# daily) is fully satisfied as a side effect of solving Critical-Thinking's stated problem
# (compute vs. render are different questions) — not a compromise between the two, the one
# structure that happens to satisfy both. Full transcript:
# `features/dashboard/04-intake-scoring-swarm-review.md`.
#
# Instead of isolating the weekly section in its own file for release-granularity, the two
# TOP-PRIORITY scenarios carried an explicit `@founder-blocking` tag — more precise than a file
# boundary, since only 2 of the weekly section's 6 scenarios were actual blockers. Both decided
# 2026-09-04; see above.
#
# ATOMICITY fixes applied: the day-open "carbs or calories" scenario split into two (it silently
# matched two macros under two different rulesets — the direct cause of the still-open Bulk
# day-state ambiguity); the fat-floor scenario's hero-copy clause extracted into its own scenario
# that now explicitly cites the still-open priority-order table instead of asserting its output
# unconditionally; the priority-order table's opaque ranking strings decomposed into pairwise
# scenarios, matching the pattern the fat-floor-vs-ceiling case already used, surfacing that
# protein-under's last-place ranking contradicts this file's own "uniquely severe" language
# without saying whether severity or remaining-actionability is the ranking principle; the
# unlogged-day scenario split so the inner ring's own state and the hero's own resolution are
# two separately-checkable facts, not one; the Bulk-over scenario's undefined "unless" branch
# removed from its Then clause; the day-close Outline retitled — it claimed a "race" between two
# clocks that its own Examples table never tests, since each row's clock is the only one running
# for that row's situation; the "every macro well under" Outline scoped to exclude protein, which
# has its own unconditional day-close rule a few scenarios above and shouldn't silently agree
# with an aggregate verdict; a duplicate hero-attribution clause removed from the carbs-over
# scenario, now owned once by "Carbs never independently drive the hero's action"; "visibly
# diluted" reworded to describe the arithmetic, since no per-day visual breakdown is specified
# anywhere in this file or in the layout file; and a Background line added stating that colour,
# not copy text, is what escalates with severity across every banded table — a real, consistent
# pattern across four tables that was never previously written down as deliberate.
# ── BUILT 2026-09-04/09, then reviewed as built ───────────────────────────────────
# Tag moved `@draft` → `@wip`: the code exists (app.jsx — the scoring block after paceVerdict,
# `IntakeScoreCard`/`ScoreCard` in the dashboard, `weekDays` in `Dashboard`), it is covered by
# Jest and by `e2e/intake-scoring.spec.js`, and what is left is the batched on-device pass.
#
# A full implementation swarm review ran on 2026-09-09 — QA, nutrition-coach, design-lead,
# Anti-Metaphor, Critical-Thinking, Admin and launch hats, each reading every prior report, with
# the app actually driven rather than only read. Transcript, screenshots and the reconciled fix
# list: `04-intake-scoring-implementation-review.md`. Three defects it found were invisible to
# the unit tests and are now fixed in code and covered:
#
#   • The fat health floor was graded FLAT from the first meal onward, with none of the
#     day-open grace this file gives protein two sections above. At 11am, after an on-plan
#     breakfast, the card read a red "FAT · Add some healthy fats" — which outranks everything
#     else in the hero order — and stayed there until three quarters of the day's fat was eaten.
#     Telling a Cut to eat more fat is the one thing this file says twice it must never do.
#     FIXED: the floor is now paced against the eating window while the day is open, exactly as
#     protein's is, and reaches red only at close. See "Fat below the health floor…" below, which
#     now carries the day-state precondition it was always missing.
#   • The majority-floor override (the founder's 2026-09-04 decision) read whether the TARGET was
#     floored and never what was eaten, so a week with NOTHING logged, and a week of logged
#     binges, both returned green "This week's been a real cut — averaging a genuine deficit."
#     FIXED, narrowly, without reopening the decision itself. See that scenario below.
#   • TODAY's card and THIS WEEK's own last segment could show different colours for the same
#     day. FIXED.
#
# STILL OPEN after the review, and deliberately not decided by it — a founder call:
#   • Whether a day with no history snapshot at all should get a vote in the "4 or more of the
#     last 7 days" floor majority. It currently does, with its floored-ness reconstructed from
#     TODAY's profile. See the note on that scenario below.
#   • The red/amber/green pairing is not colour-blind-safe: measured against a deuteranope
#     simulation, light theme's green, amber and red collapse to within a 1.02–1.07 contrast
#     ratio of each other — indistinguishable. The original spec flagged this and never resolved
#     it; the review measured it rather than resolving it either.
@wip
Feature: Daily and weekly intake scoring (red / amber / green)

  Background:
    Given every macro has a role, not just a target: protein is a floor, calories are the
      master constraint (bounded on whichever side threatens the current goal — over on a Cut,
      under on a Bulk, both directions on Maintain), fat is a floor and a ceiling, carbs are the
      flex remainder (no bound of their own — defined in full in their own sections below)
    And the fat floor is 0.6 g per kg bodyweight — the same hormonal floor computeMacros
      already enforces, never a new number
    And "this week" means the last 7 days ending today, not the calendar week since Monday
    And "the hero" means the card's single headline word plus one action line — the one thing
      it says when several macros need attention at once, defined in full below
    And every banded range in this file is inclusive of its lower value and exclusive of its
      upper value, except the top band, which is open-ended — "100–200" means 100 up to but not
      including 200; a value that lands exactly on a shared edge takes the higher band
    And within any single macro's band table, colour is the only signal that escalates with
      distance from target — copy text may repeat unchanged across an amber row and the red row
      above it; this is deliberate, not a gap to fill with harsher wording as severity rises

  # ── Protein — a floor to reach, never a ceiling ──────────────────────────

  Scenario: Protein over target is always fine, at any distance
    Given I have logged more protein than my target
    Then protein shows green
    And no "cut back on protein" message is ever shown

  Scenario Outline: While the day is open, protein is paced against the eating window, not graded flat
    # Fixed in the swarm review: the header claims this file reuses paceVerdict/EATING_WINDOW_H
    # (app.jsx:433, the pacing math built specifically to give protein and water early-day grace
    # — app.jsx:427-431) as the day-open/day-close signal, but the original draft's pct-band
    # table had no day-state precondition at all, so a reader couldn't tell whether someone at
    # 20% of protein by 9am was meant to read red. Split: mid-day, protein is paced like the
    # coach already paces it (ahead/on/behind the eating window), never flat-graded, and never
    # red — red is reserved for day close (next scenario).
    Given the day is still open
    And paceVerdict for my protein intake says "<verdict>"
    Then protein shows "<colour>"
    And the tag reads "<tag>"
    Examples:
      | verdict | colour | tag        |
      | ahead   | green  | On pace    |
      | on      | green  | On pace    |
      | behind  | amber  | Increase   |

  Scenario Outline: At day close, protein under target is graded by how far short, not by grams
    # OPEN (§5.A): band widths are a proposal, not decided — same status as the old
    # amber→red call, needs feel-testing against real logged days. Proposed as a PERCENTAGE
    # of target rather than grams, because the target itself scales with bodyweight — a 50kg
    # and a 100kg body should never share one gram figure the way dashboard/02's flat 5g/15g
    # bands assumed for every macro. Now explicitly restricted to day close (see above) — this
    # table never applies while the day is still open.
    Given the day has closed
    And I have eaten "<pct>" of my protein target
    Then protein shows "<colour>"
    And the tag reads "<tag>"
    Examples:
      | pct | colour | tag             |
      | 92% | green  | On target       |
      | 75% | amber  | Increase        |
      | 50% | red    | Increase        |

  Scenario: Protein well under at day close is the one macro that can reach red regardless of goal
    Given the day has closed
    And I am well under my protein target
    Then protein shows red, whether I am cutting, maintaining or bulking
    # the worst adherence miss for a training goal in any mode — the protein target never relaxes

  # ── Calories — the master constraint, direction depends on the goal ─────

  Scenario Outline: On a Cut, going over calories is the primary penalty
    # Reuses dashboard/01's built bands verbatim — not reopened, only re-scoped to "this is
    # the Cut role", since the old file didn't distinguish by goal.
    Given I am on a Cut
    And I have eaten "<amount>" over my calorie target
    Then calories show "<colour>"
    And the label reads "<label>"
    Examples:
      | amount   | colour | label     |
      | 0–100    | green  | in range  |
      | 100–200  | amber  | JUST OVER |
      | 200–500  | amber  | OVER BY   |
      | 500+     | red    | OVER BY   |

  Scenario: On a Cut, going under calories is never a penalty
    Given I am on a Cut
    And I have eaten under my calorie target, by any amount
    Then calories show green
    And no "eat more to hit your target" message is ever shown
    # under on a deficit is the point, not a miss — guardrail §6

  Scenario Outline: On Maintain, both directions matter once the day closes
    # OPEN, flagged in the swarm review: unlike Cut and Bulk, Maintain's calorie band never
    # escalates to red at any magnitude below. Confirm this is deliberate (Maintain stays
    # gentler by design at every distance) rather than an overlooked band — if a very large
    # miss on Maintain should also redden, add that row here rather than inferring it.
    Given I am on Maintain
    And the day has closed
    And I am "<direction>" my calorie target by a wide margin
    Then calories show amber
    And the tag reads "<tag>"
    Examples:
      | direction | tag              |
      | under     | Under-eaten      |
      | over      | Over for today   |

  Scenario: On Maintain, being under mid-day is on pace, not a miss
    Given I am on Maintain
    And the day is still open
    And I am under my calorie target
    Then calories show green
    And the tag reads "On pace"

  Scenario Outline: On Bulk, going under calories is the primary penalty (the mirror of Cut)
    # OPEN (§5.D): the handover said Bulk "flips" Cut's logic but never spelt out the bands.
    # Proposed as the exact mirror of dashboard/01's Cut bands, measured as shortfall below
    # target instead of excess above it — same shape, opposite direction. Flagged in the swarm
    # review: numeric magnitude being mirrored isn't proof the CONSEQUENCE is mirrored (500 kcal
    # under a bulk target returns someone to roughly maintenance, not obviously the same severity
    # as 500 kcal over a cut's deficit) — still needs a founder call on whether the bands
    # themselves, not just their shape, are right. Field name and phrasing now genuinely match
    # Cut's table (both were "for consistency" before but didn't actually parallel each other).
    #
    # OPEN, surfaced in the final sign-off pass: this Outline has no day-open/day-close
    # precondition, unlike Maintain's calorie rule (split into an explicit open-day and a
    # closed-day scenario above). It isn't stated whether this table governs mid-day too, or
    # only applies at close — and the day-open scenario for calories below now only covers Cut
    # and Maintain explicitly (see its own OPEN note), for exactly this reason: as written the
    # two could both apply to a Bulk, mid-afternoon, 300 kcal under target, and disagree. Needs
    # the same day-state split Maintain already got, or an explicit statement that Bulk's
    # penalty applies from the moment a meal is logged, not just at close.
    Given I am on a Bulk
    And I have eaten "<amount>" under my calorie target
    Then calories show "<colour>"
    And the label reads "<label>"
    Examples:
      | amount   | colour | label            |
      | 0–100    | green  | in range         |
      | 100–200  | amber  | JUST UNDER       |
      | 200–500  | amber  | MISSING THE BULK |
      | 500+     | red    | MISSING THE BULK |

  Scenario: On Bulk, going over calories is tolerated far more loosely than under
    Given I am on a Bulk
    And I have eaten over my calorie target
    Then calories stay green
    # A very large excess is a weight-trend concern, scored by a different feature entirely
    # (see the "NOT in this file" header note) — not a second colour state defined here.

  # ── Fat — a ceiling and a health floor at once ───────────────────────────

  Scenario: Fat between its floor and its target is fine, direction doesn't matter
    Given my fat intake is at or above the health floor
    And my fat intake is at or below my fat target
    Then fat shows green

  Scenario Outline: Fat over its ceiling is graded by how far over, not by flat grams
    # OPEN (§5.A): band widths are a proposal. Changed in the swarm review from dashboard/02's
    # flat 5g/15g shape to a PERCENTAGE of target, for the identical reason protein's under-band
    # was already built as a percentage a few scenarios above: fat's floor and target both scale
    # with bodyweight (FAT_FLOOR_PER_KG, FAT_MODE_PER_KG — app.jsx:283/297), so a 50kg and a
    # 100kg body should no more share one gram figure here than they do for protein. Reusing the
    # flat-gram shape for fat while rejecting it for protein a few scenarios earlier was an
    # inconsistency in the original draft, not a deliberate distinction.
    Given I have eaten "<pct>" over my fat target
    Then fat shows "<colour>"
    Examples:
      | pct    | colour |
      | 0–10%  | green  |
      | 10–25% | amber  |
      | 25%+   | red    |

  Scenario Outline: At day close, fat below the health floor is a real problem, not a normal "under"
    # OPEN (§5.A/E): the floor value is settled (0.6 g/kg, reused). How far below it tips to red
    # is proposed here as a percentage of the floor itself, for the same bodyweight-scaling
    # reason as the ceiling table above — replaces the original flat-gram proposal, which also
    # left the 0–1g-below-floor case undefined; this table now starts at the floor itself with
    # no gap.
    #
    # RESTRICTED TO DAY CLOSE, 2026-09-09, by the implementation review — this table had no
    # day-state precondition at all, which is the identical omission the round-1 swarm review
    # already found and fixed for protein ("At day close, protein under target is graded by how
    # far short"). It matters more here than it did there: the fat floor is the one HARD SAFETY
    # row of the hero priority order, so a flat reading of a half-eaten day put a red "Add some
    # healthy fats" at the top of the card from breakfast onward, every day, for everyone. On a
    # Cut that is advice this file forbids twice ("A cut is never told to eat more fat…").
    Given the day has closed
    And my fat intake is "<pct>" below the health floor
    Then fat shows "<colour>"
    Examples:
      | pct    | colour |
      | 0–15%  | amber  |
      | 15%+   | red    |

  Scenario Outline: While the day is open, fat is paced against the eating window, like protein
    # Added 2026-09-09 by the implementation review, as the direct mirror of "While the day is
    # open, protein is paced against the eating window" above — same function (paceVerdict), same
    # reason (a cumulative daily floor needs early-day grace or it reads as a breach all morning),
    # same rule that red is reserved for day close.
    #
    # Two deliberate differences from the closed-day table above, both to keep this file's own
    # claims true: the amber tag borrows protein's "Increase" rather than "Add some healthy
    # fats", so that message stays exclusive to a real breach as the scenario below requires; and
    # a paced-behind fat does NOT take the hard-safety top rank, it sits where a ceiling breach
    # sits — below calories, above protein. It is "fat, but not the floor", which is that rank.
    Given the day is still open
    And my fat intake is below the health floor
    And paceVerdict for my fat intake says "<verdict>"
    Then fat shows "<colour>", never red
    Examples:
      | verdict | colour |
      | ahead   | green  |
      | on      | green  |
      | behind  | amber  |

  Scenario: "Add some healthy fats" is exclusive to a fat-floor breach
    # Split out of the band Outline above in the round-2 atomicity pass — "the hero says X" is
    # not a fact about fat's own band, it's a fact about the priority-order table below, which
    # this scenario now cites explicitly instead of asserting the hero's output unconditionally.
    Given fat is below the health floor
    Then the hero says "Add some healthy fats" — the fat-floor row of the priority-order table
      (see "Fat below the health floor always outranks a ceiling breach" below), never shown for
      any other reason
    And no other state ever shows that message

  Scenario: A cut is never told to eat more fat just to "hit" the target
    Given I am on a Cut
    And my fat intake is above the health floor but below my fat target
    Then fat shows green
    And no "increase fat" message is shown
    # wrong advice for a deficit — the target here is a ceiling, the floor is the only limit
    # that applies. Resolved to a single colour in the swarm review — "green or neutral" wasn't
    # a real assertion; nothing else in this file or app.jsx renders a "neutral" state.

  # ── Carbs — the flex remainder ───────────────────────────────────────────

  Scenario: Carbs over target is fine as long as calories are on track
    Given my carbs are over their target
    And my calories are not over target
    Then carbs show green
    # the day's fill landed on carbs — that is not a miss, see handover §2

  Scenario: Carbs over target when calories are also over shows the shared cause
    # Added in the swarm review — the original draft only stated carbs' colour for the
    # calories-fine case, leaving the row's own colour undefined when both are over.
    Given my carbs are over their target
    And my calories are also over target
    Then carbs show amber, matching the reason calories are over
    # hero-attribution for this case is owned once by "Carbs never independently drive the
    # hero's action" below, not re-asserted here — removed in the round-2 atomicity pass.

  Scenario: Carbs under target is always fine, at day close or at any other time
    # Added in the swarm review — carbs is defined as pure flex (Background), so unlike
    # calories and protein it has no goal-dependent "under-eaten at close" rule at all: being
    # under just means the flex room went unused.
    Given carbs are under their target, whether the day is open or has closed
    Then carbs show green
    And no goal changes this

  Scenario: Carbs never independently drive the hero's action
    Given carbs are the only macro currently out of range
    Then the hero action speaks to whichever macro or calories actually caused it
    And carbs alone never become the headline action
    # Should-fix, round-2 atomicity pass: this Given only covers carbs flagged alone. Confirm
    # it also covers the carbs-and-calories-both-over case above, or add an explicit row for it.

  # ── Day-open vs day-close ────────────────────────────────────────────────

  Scenario: While the day is open, carbs under target reads as on pace
    # Split from a combined "carbs or calories" scenario in the round-2 atomicity pass — the
    # two macros don't share a ruleset (carbs is unconditionally flex; calories varies by goal),
    # and the collapsed Given was the direct cause of the Bulk day-state ambiguity flagged below.
    Given the day is still open
    And carbs are under their target
    Then carbs show green with the tag "On pace", not a warning
    # carbs is pure flex (Background) — this never varies by goal

  Scenario: While the day is open, calories under target reads as on pace — Cut and Maintain
    Given the day is still open
    And I am on a Cut or Maintain
    And calories are under target
    Then calories show green with the tag "On pace", not a warning
    # OPEN, unresolved by this split: does this rule cover Bulk mid-day too, or does Bulk's own
    # calorie-under Outline (above) govern from the moment a meal is logged? Not decided here —
    # splitting the scenario only stops the generic rule from silently covering Bulk by default
    # via a bare "calories" match; see the OPEN note on Bulk's Outline above for the same gap.

  Scenario Outline: Day close is defined differently depending on whether anything was logged today
    # OPEN (§4): the handover asked for an explicit definition. Proposed: reuse the coach's
    # existing pacing math (paceVerdict / EATING_WINDOW_H = 14h from the first logged meal,
    # app.jsx:433) for a day with any logging at all. That function alone never closes a day
    # with NOTHING logged (elapsed stays 0 forever), so a hard local-time fallback is added for
    # that one case — proposed as 22:00, so an unlogged day still eventually reads as a miss
    # rather than staying "on pace" all night. Needed for the guardrail in §6: an unlogged day
    # must never score better than an honestly logged bad one.
    #
    # Retitled in the round-2 atomicity pass — the original title claimed a "race" between two
    # live clocks ("whichever comes first"), but the two rows below each apply to a mutually
    # exclusive situation and never actually race each other; a genuine race (a first meal
    # landing after 22:00) is the separate, already-flagged OPEN collision case below, and
    # remains untested here.
    Given "<situation>"
    Then the day is considered closed when "<condition>"
    Examples:
      | situation                          | condition                                    |
      | at least one meal logged today     | 14 hours have passed since the first meal    |
      | nothing logged today               | local time reaches 22:00                     |

    # OPEN, flagged in the swarm review, not resolved here: the two conditions above aren't
    # proven mutually exclusive. If the first meal lands at or after 22:00 (a late eater, a
    # shift worker — a realistic case, not a corner case), it's undefined whether the 22:00
    # fallback has already closed the day before the meal lands, and whether logging afterward
    # reopens it. Crossing midnight before either condition fires (first meal 23:00 → nominal
    # close 13:00 the next day) is undefined too — which day's bucket does that close belong to?
    # Needs a founder call, not a guess.

  Scenario Outline: What "under at close" means depends on the goal
    # Scoped in the round-2 atomicity pass to exclude protein — protein has its own
    # unconditional day-close rule above (well-under-at-close is always red, in any goal), and
    # shouldn't silently agree with this aggregate verdict for the other three macros.
    Given the day has closed
    And calories, fat and carbs all finished well under target
    Then the overall state reads "<state>"
    And this is independent of protein's own colour, which is graded separately and can still
      be red per "Protein well under at day close…" above, even on an otherwise-green cut day
    Examples:
      | goal     | state                              |
      | cut      | green — under is the point         |
      | maintain | amber — under-eaten                |
      | bulk     | amber to red — missed the surplus  |

  # ── Overall state and the hero's one action ──────────────────────────────

  Scenario Outline: Calories outrank fat's ceiling when both need attention
    # Decomposed from a single opaque priority-order table in the round-2 atomicity pass — see
    # that pass's header note above. This is one pairwise link in the ranking; the fat-floor
    # case (a HARD SAFETY claim, not a goal-protection one) is the standalone scenario further
    # below and always wins regardless of this link.
    Given calories are over target
    And fat is also over its ceiling
    Then the hero speaks to calories first
    Examples:
      | goal |
      | cut  |
      | bulk |

  Scenario Outline: Fat's ceiling outranks protein-under when both need attention
    # OPEN, surfaced by the nutrition-coach pass: protein-under is called "the worst adherence
    # miss for a training goal in any mode" in "Protein well under at day close…" above, yet
    # ranks LAST here. If that's because nothing more can be done about protein once the day has
    # closed (remaining actionability) rather than because it's less severe, say so explicitly; if it's
    # an oversight, the order needs to change. This table doesn't yet name which principle —
    # severity vs. remaining actionability — it's using. Needs a founder call, same status as
    # the rest of the priority order.
    Given fat is over its ceiling
    And protein is also under target
    Then the hero speaks to fat's ceiling first
    Examples:
      | goal |
      | cut  |
      | bulk |

  Scenario: Fat below the health floor always outranks a ceiling breach
    Given fat is below the health floor
    And another macro is also out of range
    Then the hero speaks to the fat floor first
    # a real problem beats a breach of a target that only exists to be forgiving — the one HARD
    # SAFETY claim in the priority order, true regardless of goal, unlike every other link above

  # Maintain's own ordering remains unresolved and isn't decomposed above: it leads with
  # "whichever is furthest from its band," which mixes units with no stated conversion —
  # calorie/fat-ceiling distance is kcal or grams, protein distance is a percentage — so as
  # written it isn't actually computable. Needs either a real normalisation rule or a fixed
  # lexicographic order like Cut/Bulk have before it can be split into pairwise scenarios the
  # same way. Fat-below-floor still wins first on Maintain too — that link doesn't depend on
  # the unresolved part.

  Scenario: A fully unlogged day, once closed, shows as a miss on the inner ring too
    # Split in the round-2 atomicity pass — the inner ring's own state and the hero's own
    # resolution are two different rendering surfaces (Background defines "the hero" as
    # distinct from per-macro/per-day states) and were previously asserted as one fact.
    Given today has closed
    And nothing was logged today
    Then the inner ring shows a miss, consistent with how that day is treated in the weekly
      average
    # keeps the daily and weekly views from disagreeing about the same unlogged day

  Scenario: A fully unlogged, closed day still produces a single hero action, not a blank centre
    Given today has closed
    And nothing was logged today, so every macro is simultaneously in its own "miss" state
    Then the centre word is resolved by the same hero priority order used for any other
      multi-macro conflict, never left blank
    # OPEN, new: nobody has named which specific word wins when every macro misses at once —
    # not even as an example row in the priority-order scenarios above. Same status as those.

  # ── The weekly rolling read ───────────────────────────────────────────────

  Scenario: The week is read from logged intake against a baseline, not from the scale
    Given the last 7 days of logged calories
    When the week's average is compared with a baseline of raw TDEE — maintenance, NOT adjusted
      for the selected mode
    Then the result is graded, not the bodyweight trend
    # Corrected wording, 2026-09-04 — this line previously said "TDEE plus the mode adjustment",
    # which contradicts the scenario's own worked example below (it measures distance from raw
    # TDEE, e.g. "only 151 kcal under TDEE", not from a mode-adjusted target). A mode-adjusted
    # baseline would also break "Selected mode vs. what the week actually reads as" below — if
    # baseline already included the selected mode's own adjustment, hitting your own target
    # would almost always read back as "maintain," and the mismatch that scenario exists to
    # catch could never fire. Prose-vs-mechanism mismatch, not a new decision.
    # keeps this feature separate from the bodyweight trend and from estimate accuracy —
    # guardrail §6; the scale already has its own cards (stall check, gainWhileCutting)
    #
    # DECIDED, founder, 2026-09-04 — resolves the TOP-PRIORITY item the swarm review found. The
    # REAL daily target a user is actually graded against every day (calcTargets, app.jsx:390-422)
    # can be floored by up to three separate safety mechanisms — the maintain-only sedentary
    # floor, the 75%-of-TDEE deficit floor, and SAFE_MIN — so it can sit much closer to TDEE than
    # a flat ±250 band around TDEE assumes. Worked example: a 50kg, 30%-body-fat, sedentary
    # female on a Cut computes to BMR 1126 → TDEE 1351 → raw cut target 851 → floored to 1013 by
    # the deficit floor → floored again to SAFE_MIN.female = 1200 (app.jsx:269). Her REAL daily
    # target is 1200, only 151 kcal under TDEE — daily-green every day (this file's own Cut rule,
    # above), yet 151 kcal under sits inside the ±250 "maintain" band below, so the week would
    # read amber: "This week hasn't been a cut." Wrong — she's at the app's own hard safety
    # minimum; there was never a lower number on offer.
    #
    # Fix: NOT a new baseline. Comparing against her own floored target instead of TDEE was
    # considered and rejected — it would make hitting-target always read "maintain" for everyone,
    # destroying the mismatch signal this scenario exists to give (someone who selected Cut but
    # never actually ran a deficit). Instead, see the next scenario — a majority-floored week
    # short-circuits this band comparison rather than reworking it.
    #
    # Separately raised by the founder in this conversation: SAFE_MIN itself (flat 1400 male /
    # 1200 female) is a known, previously-analysed flaw — a flat number can remove almost the
    # whole deficit for a small body (see `ARCHITECTURE_REVIEW.md` §4.I). That is a fix to
    # SAFE_MIN's own value, tracked separately from this file. This scenario's fix holds
    # regardless of how SAFE_MIN is eventually calculated — it only checks whether a floor was
    # binding, not what number the floor used.

  Scenario: A week spent mostly at the safety minimum reads as a cut, not a shortfall
    # DECIDED, founder, 2026-09-04. Resolves the TOP-PRIORITY item above without touching the
    # band comparison for anyone who wasn't at the floor.
    Given a safety floor — the sedentary floor, the deficit floor, or SAFE_MIN — held the daily
      target up on 4 or more of the last 7 days
    Then the week reads as "cut" outright
    And the ±250 band comparison below is not applied
    # there was no lower number the app would ever have given on those days, so comparing
    # against one compares against a target that was never real

  Scenario Outline: The week's average kcal sorts into reads-as-cut / maintain / bulk bands around the baseline
    # Applies only when the majority-floored override above does NOT fire.
    # OPEN (§5.A) — the band WIDTH below is still proposed, not decided.
    # ±250 is proposed only as the width, mirroring the mode deltas the app already defines
    # (cut −500 / maintain 0 / bulk +500, ENERGY_MODEL.md "kcal = TDEE + modeAdj").
    Given the week's average logged kcal is "<amount>" relative to the baseline
    Then the week reads as "<reads_as>"
    Examples:
      | amount                     | reads_as |
      | 250 kcal or more under     | cut      |
      | within 250 kcal either way | maintain |
      | 250 kcal or more over      | bulk     |

  Scenario: Fewer than 7 days of history shows the week as still filling in, not a colour verdict
    # Added in the swarm review, using the same mechanism proposed for an unlogged day below —
    # dashboard/03-budget-confidence.feature already handles an equivalent "0 data points yet"
    # case for its own maturity metric; this file had no equivalent for a brand-new user, whose
    # missing days are "the account didn't exist yet," not "chose not to log."
    Given fewer than 7 days of account history exist
    Then the outer ring shows the week as still filling in
    And no red/amber/green verdict or "reads as" comment is shown until a full week exists

  Scenario Outline: Selected mode vs. what the week actually reads as
    Given I have selected "<selected>"
    And the week reads as "<reads_as>"
    Then the weekly summary shows "<colour>" and says "<comment>"
    Examples:
      | selected | reads_as | colour | comment                                                              |
      | cut      | cut      | green  | This week's been a real cut — averaging a genuine deficit. Keep going. |
      | cut      | maintain | amber  | This week hasn't been a cut. Hit your targets and watch this change.  |
      | cut      | bulk     | red    | This week's average has actually run as a surplus — a cut needs it below maintenance to work. |
      | maintain | cut      | amber  | This week's average has actually run a bit under — more of a cut than maintain. More food would bring it back. |
      | maintain | maintain | green  | Right where maintain should be this week.                            |
      | maintain | bulk     | amber  | This week's average has actually run a bit over — more of a bulk than maintain. |
      | bulk     | cut      | red    | This week's average has actually been a deficit — a bulk needs it above maintenance to build. |
      | bulk     | maintain | amber  | This week hasn't been a bulk. Hit your targets and watch this change. |
      | bulk     | bulk     | green  | This week's been a real bulk — averaging a genuine surplus. Keep fuelling it. |

  Scenario: One bad day does not sink the week
    Given six days this week were on plan
    And one day was well over target
    Then the weekly summary still reads close to its usual colour for the other six days
    And the bad day's kcal still counts fully in the average — it is diluted by the other six
      days' worth of data, never dropped or zeroed out of the calculation
    # "diluted" describes the maths, not a per-day visual breakdown — no such UI element exists
    # anywhere in this file or in 05-intake-score-card-layout.feature; a visible per-day marker
    # inside the ring would be a new, undecided scenario, not this one. Reworded in the round-2
    # atomicity pass — the behavioural point stands: log the bad day honestly, it barely moves
    # the average — guardrail §6.

  Scenario: An unlogged day is excluded from the week's average, not counted as a favourable zero
    # DECIDED, founder, 2026-09-04. As originally written this scenario inverted on exactly the
    # case the app exists to protect: "counts as a miss" was never given a value, and the only
    # one consistent with "the last 7 days of logged calories" (above) is 0 kcal logged. On a
    # Cut, where under is never a penalty (this file's own rule, above), a 0-kcal day drags the
    # week's average FURTHER under the baseline — reading as MORE of a cut, not less — while an
    # honestly-logged binge day pulls the average toward maintain/bulk and reads amber or red.
    # Not logging at all would have scored better than logging a bad day honestly.
    Given one or more days this week have no logged entries at all
    Then those days are excluded from the week's average outright
    And the average is calculated only from the days that were actually logged
    And an unlogged day is never averaged in as a favourable or neutral number
    # closes the incentive gap guardrail §6 warns about: hiding a bad day by not logging it
    # must never beat logging it honestly

  Scenario: The weekly summary always states how many days it's built from
    # DECIDED, founder, 2026-09-04 — transparency over suppression, deliberately not the same
    # mechanism as "fewer than 7 days of history" above. That scenario covers a brand-new
    # account, where the missing days never existed. This one covers a returning user's thin
    # week — real data, just incomplete — and the founder's call is to always show it rather
    # than hide it behind a "still filling in" state.
    Given the week has anywhere from 1 to 7 logged days out of the last 7
    Then the weekly summary always states the count openly, e.g. "based on 5 of 7 days logged"
    And a colour verdict is still shown even when very few days were logged

  # ── Guardrails (§6) — apply across every scenario above ──────────────────

  Scenario: Scoring never changes a logged value
    Given any red or amber state anywhere in this feature
    Then no logged entry, target, or mode is changed automatically
    And the user decides what to do next

  Scenario: Estimate accuracy is out of scope
    Given a logged item's estimate may itself be too low or too high
    Then this feature scores the logged value as-is
    And it does not attempt to judge or correct the estimate

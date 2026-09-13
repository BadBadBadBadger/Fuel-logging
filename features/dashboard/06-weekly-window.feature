# ── Which days "this week" means ────────────────────────────────────────────
# Built 2026-09-13 (session 22). FL-011, found during the swarm review of
# `features/history/00-bug-report.md` by the nutrition-coach and engineering hats independently,
# and NOT in the founder's report. Ranked above FL-001 by the coach, because it produces a false
# all-clear rather than a wrong number.
#
# AMENDS `dashboard/04-intake-scoring.feature`, whose Background states *"this week means the last
# 7 days ending today"*. That is no longer true and 04's line has been corrected to point here.
# This file owns the window; 04 still owns the grading.
#
# THE BUG. Today was counted as a whole day in the weekly average. With nothing logged, the week
# read 14,904/6 = 2,484 against a 2,709 estimate and showed amber. One 400 kcal breakfast made it
# 15,304/7 = 2,186 and flipped the week to a green "keep going" — which logging dinner then flipped
# back to amber at 17,404/7 = 2,486. A false all-clear, in the morning, with an instruction in it.
# A part-finished day was being compared against a whole day's target.
#
# THE FOUNDER'S REASON, which is better than the bug. Today's progress is the hero ring on the
# left, in full detail. A segment for the same day on the right said it twice and disagreed with
# itself while the day was still open. The two cards now cover different days, so neither can
# comment on a day the other owns — the overlap is removed rather than reconciled.
#
# It also settles FL-005's harder half: this is the same window `features/history/01`'s average
# uses, so the two screens can no longer report different weekly numbers for the same week.
#
# ⚠️ NOT `isDayClosed`. The anti-metaphor hat beat the coach's own proposed mechanism here, and it
# matters. `isDayClosed` reads as "the day has finished" but means "14 hours after the first meal,
# or 22:00 if nothing is logged" — close enough to the everyday phrase to pass a reading, attached
# to a mechanism that is not the one wanted. Using it would let a part-finished day back into the
# average at 20:00 and reinstate this bug in shifted form. The test is the date key, nothing else.
#
# NOT in this file, on purpose:
#   • the grading of any individual day — `dashboard/04`.
#   • the History screen's own windows — `features/history/01`.
#   • the same off-by-one on the calorie-target path —
#     `features/energy-safety/11-intake-window-and-cut-evidence.feature`.

Feature: "This week" means the last seven completed days

  Background:
    Given "this week" is the seven complete days ending YESTERDAY
    And it is not the calendar week since Monday
    And today is never one of them

  Scenario: today is not in the weekly ring at all
    Given seven finished days, all logged, and nothing logged today
    Then all seven ring segments carry a colour
    And the card reads "7 of 7 days logged"
    # If today were still in this window it would be an eighth day and would leave a segment on
    # the empty track while TODAY called the same day a miss.

  Scenario: logging breakfast does not change the week's verdict
    Given seven finished days with a settled verdict
    When I log one meal today
    Then the week's verdict, comment and colours are all unchanged

  Scenario: the card names the days it covers
    Then it states its count on one line and its dates on the next
    # The count qualifies the window; the dates identify it. Same rule as History's cards, so the
    # two screens never have to be reconciled by hand.

  Scenario: the number matches the History screen
    Then the weekly average here and the seven-day average in History describe the same dates
      and the same figure

  Scenario: every segment is drawn at full strength
    Then no segment is dimmed relative to another
    # The old 0.55 softening existed only to make today's live segment stand out against the days
    # behind it. With no day in progress there is nothing to contrast against, and dimming six of
    # seven finished days would emphasise the last one for no reason.

  Scenario: every segment is graded the same way
    Then each is graded against its own stored snapshot and its own stored target
    # There is no live-totals branch left. It existed only for today.

  Scenario: an unlogged day among the seven stays uncoloured
    Given one of the seven days has nothing logged
    Then its segment stays on the empty grey track
    And the card's count drops to 6 of 7
    # Colouring it would misrepresent absence of data as a known good or bad day.

  Scenario: a week with nothing logged at all gives no verdict
    Then the card says nothing was logged in the last seven days and invites a day to be logged
    And it does not congratulate a deficit it never observed
    # Two states, two sentences: a first week still filling in is not the same as a week with
    # nothing in it, and "Still filling in — 0 of 7 days logged so far" said both badly.

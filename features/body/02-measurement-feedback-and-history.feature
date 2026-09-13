# ── Body measurements in History, and what a save reports back ────────────────
# Body-composition workstream, file 2. Built 2026-09-11 through a six-persona swarm
# (design-lead → nutrition-coach → engineering → qa-automation → critical-thinking →
# anti-metaphor), each reading every earlier report and answering it. Full transcript,
# including the two findings that only appeared under cross-examination:
# `02-swarm-review.md`.
#
# WHY: after a week of real use, `features/body/01` stores weekly tape readings and charts
# them, but nothing else in the app knows they exist. The History screen — the app's own
# record of what happened — lists food and water for a day and says nothing about the body
# that ate it, and the CSV export inherits the same hole. Logging a measurement reports one
# absolute number ("Estimated body fat: 22.2%") and never says what moved.
#
# SCOPE: presentation and feedback only, the same split `dashboard/04` (logic) and
# `dashboard/05` (card layout) already established. This file computes no new stored value,
# changes no target, and moves no safety rule.
#
# ── THE JOIN, AND WHY IT IS THE WHOLE FEATURE ────────────────────────────────
# Weight is in `weighIns[]`, tape readings are in `bodyMeasurements[]`, both keyed by
# `date`, and both are already props of `History`. Every value this file describes is those
# two arrays looked up by the date being rendered. NOTHING here adds a database column and
# NOTHING here adds a field to a sync payload: a column that does not exist in Postgres
# makes the entire upsert fail with no visible error, which is what cost this repo its own
# history sync on 2026-09-11. The `history_snapshots` row deliberately carries no body data
# and must not start.
#
# ── FOUNDER DECISIONS CARRIED IN ─────────────────────────────────────────────
# Four decisions were taken with the founder on 2026-09-11 and written up with their
# arithmetic in `02-founder-decisions.md`. Only the fourth is in this file's scope; 1–3
# change `body/01`'s engine and its stored shape and are separate work, recorded there.
# Decision 4 appears inline below as `# DECIDED, founder, 2026-09-11`.
#
# The number underneath all four, worked against the app's own `navyBodyFat` at 178cm neck
# 40cm waist 95cm: half a centimetre of tape slip at both sites moves the body-fat estimate
# by ±0.67 points, while a full week of genuine fat loss moves it 0.40. A single sloppy
# session therefore manufactures more apparent change than a week of real progress, and it
# is a coin flip which way it points. A month of real change is 1.61 points, which clears
# that ±0.67 band — which is why the body-fat figure is only ever reported across a
# 30-day window, never between two readings.
#
# ── WHAT THE SWARM DECIDED, THAT THE FOUNDER DID NOT ─────────────────────────
# Two calls below were made by the review, not by the founder. Both are one line of code to
# reverse, and both are named here so he can reverse them rather than discover them:
#
#   1. NECK'S CHANGE IS SHOWN WITHOUT A DIRECTION COLOUR (nutrition-coach, standing veto on
#      health copy). Waist — and hip under the female formula — are fat-storage sites, so
#      smaller is the direction this app exists to help with and they take the same accent
#      colour the weight trend uses for a falling weight. Neck is not that. Under the Navy
#      formula a BIGGER neck computes a LEANER body fat %, so applying the same rule to neck
#      would paint "your neck got smaller" as the good result. For a lifter in a deficit
#      that is backwards, and it is the app rewarding lost muscle. Neck's change is still
#      shown, at any size, exactly as decision 4 requires — it just carries no valence.
#   2. THE BODY-FAT FIGURE GETS NO READING-TO-READING CHANGE, only the 30-day one.
#      `body/01` already decided this ("Change is always framed over a window, never a
#      single most-recent-reading delta") and the founder's own arithmetic above is the
#      argument for it: a between-readings body-fat change compounds the tape wobble at TWO
#      sites and is also the number that feeds the calorie target. The tape numbers
#      themselves are different — they are the raw measurement, and decision 4 is explicit
#      that the raw number is shown honestly.
#
# ── REUSES (each checked against the real function, not assumed by resemblance) ──
#   • `bodyMeasurementFormula` (app.jsx) for the male/female filter, so a sex change ages
#     old-formula readings out of the 30-day body-fat figure the same way it already ages
#     them out of `bodyFatRollingAvg`.
#   • The weight trend's own colour rule (`trend7 <= 0 ? var(--accent) : var(--bulk)`,
#     WeighInWidget) for the fat-site direction colour — not a second colour vocabulary.
#   • The `⚖️` and `📏` markers already used by the History chart toggles and the weigh-in
#     widget's measurement line. No new iconography.
#   • `History`'s existing "since last month" body-fat card, which is replaced by the same
#     function this file's save feedback uses — one definition of the window, used twice.
#
# ── NUMBERS CONTRACT ─────────────────────────────────────────────────────────
#   BF_WINDOW_DAYS = 30 — the only constant this file introduces. It is the window the
#   body-fat change is reported across, and it is the window `History` already used before
#   this file existed (`bodyFatChangeSinceLastMonth`), promoted to a named constant and
#   mirrored in `__tests__/logic.test.js`. Chosen because 30 days of real change (1.61
#   points) clears the ±0.67-point tape-noise band; 7 days (0.40 points) does not.
#
#   Site changes are rounded to 0.1cm. Subtracting two one-decimal numbers in binary
#   floating point does not give a one-decimal number (95.3 − 94.8 = 0.5000000000000071),
#   so the rounding is load-bearing, not cosmetic.
#
#   Exact arithmetic is owned by `__tests__/logic.test.js` — `measurementSiteChanges`,
#   `bodyFatWindowChange`, `csvRows`.
#
# ── FOLLOW-UP PASS, 2026-09-11 (design-lead, with the founder) ───────────────
# Two additions after the rest of this file was built, both agreed, both still inside the
# same boundary — a lookup by date at render time, no stored field, no payload field:
#   • A `📐 Tape` chart chip: ONE chip drawing neck and waist (and hip when the readings have
#     one) as separate lines on one shared centimetre axis. The reasoning is in the scenarios
#     themselves, because it is the kind of reasoning that gets undone by a later tidy-up:
#     the Navy formula reads waist MINUS neck, so the distance between those two lines is the
#     formula's own input.
#   • The body fat % tooltip becomes a diagnostic: it now also carries the raw tape sites
#     behind that point and how long since the previous reading.
# Both reuse `measurementChartRows`, one row builder feeding both charts, so the two can
# never disagree about which readings are plotted or what an average is built from.
#
# ── DELIBERATELY NOT IN THIS FILE ────────────────────────────────────────────
#   • `SYNC_GATE`, `TREND_MIN_POINTS`, `BF_SYNC_STEP_CAP` and the conditions note. Founder
#     decisions 1–3 change all of these and are separate work (`02-founder-decisions.md`).
#     The per-reading conditions note would be the strongest line in the new tooltip — it is
#     what separates a real change from a protocol difference — and it is deliberately NOT
#     built here: it needs its `note TEXT` column run against the live database first. See
#     the tooltip section's own comment.
#   • Any noise threshold below which a change is hidden or greyed. Decision 4 overruled the
#     proposal outright, and it was the better call: a threshold hiding small numbers AND an
#     average smoothing them would have done the same job twice and made measurements
#     behave unlike weight for no reason.
#   • A day row or day detail for a date with no `history_snapshots` row. The History screen
#     walks `history[]`, so a weigh-in on a day with no snapshot has nowhere to render. The
#     CSV export does NOT have this limitation and is the complete record — see its own
#     scenario below. Stated rather than silently accepted.
# ─────────────────────────────────────────────────────────────────────────────

@wip
Feature: Body measurements in History, and what a save reports back

  The History screen and the CSV export show the body alongside the food: the weight on
  the days I weighed, the tape reading on the roughly one day in seven I measured. Saving a
  measurement says what moved since the last one, rather than only what the number is now.

  Background:
    Given weight is stored in weighIns[] and tape readings in bodyMeasurements[], both
      keyed by date
    And nothing in this feature writes a new stored field or a new sync payload field
    And "a tape site" means one of neck, waist, or hip

  # ── History day rows ───────────────────────────────────────────
  Scenario: A day I weighed shows that weight beside the day's macros
    Given a logged day that also has a weigh-in
    When I view the History day list
    Then that row's existing sub-line carries the weight alongside the macros and water

  Scenario: A day I measured also shows that day's estimated body fat %
    Given a logged day that also has a tape reading
    When I view the History day list
    Then the same sub-line carries the estimated body fat % computed for that date
    # The tape numbers themselves are not on the row — six of seven rows have no reading
    # at all, and the row is already carrying five values. The full set is one tap away in
    # the day detail.

  Scenario: A day with no body data shows nothing in its place
    Given a logged day with no weigh-in and no tape reading
    When I view the History day list
    Then that row shows no weight, no body fat %, and no separator or dash standing in
      for either
    # Most days legitimately have no tape reading. An empty slot, a dash, or a greyed
    # placeholder would read as missing data on the great majority of rows, which is the
    # opposite of the truth.

  Scenario: The weight on a day row is shown in the weight unit I have chosen
    Given my display unit is kilograms, pounds, or stone
    When I view a day row that has a weigh-in
    Then the weight is shown in the same unit the rest of the History screen uses

  # ── History day detail ─────────────────────────────────────────
  Scenario: A date with body data gets a body card in its day detail
    Given I open the day detail for a date that has a weigh-in, a tape reading, or both
    Then a body card shows what that date actually has: the weight, the tape sites, and
      the estimated body fat %

  Scenario: A date with no body data gets no body card at all
    Given I open the day detail for a date with neither a weigh-in nor a tape reading
    Then no body card is rendered
    And no empty-state message about measurements appears on that day
    # An "no measurement taken" card on six days out of seven is noise. Absence is the
    # normal case for a weekly measurement and is shown by showing nothing.

  Scenario Outline: The day detail shows only the sites that reading actually has
    Given the reading stored for that date was computed under the "<formula>" formula
    When I open that date's day detail
    Then the body card lists "<sites>"

    # Hip is explicitly null on every male-formula row rather than missing, so the card
    # tests for a value rather than for the property.
    Examples:
      | formula | sites            |
      | male    | neck, waist      |
      | female  | neck, waist, hip |

  Scenario: The day detail never borrows a nearby day's reading
    Given I measured on Sunday and not on Tuesday
    When I open Tuesday's day detail
    Then no tape reading is shown for Tuesday
    # Carrying the last reading forward would make every day claim a measurement that was
    # never taken, and would put fiction in the CSV.

  # ── What a save reports back ───────────────────────────────────
  Scenario: Saving a measurement reports each site's change against my last reading
    Given I have a previous tape reading
    When I save a new one
    Then each site I entered is listed with its signed change since that reading

  Scenario: The report states how long ago the reading it compares against was
    Given my previous reading was 7 days ago
    When I save a new one
    Then the report says the comparison is against a reading from 7 days ago
    # Without this, a change measured against a reading from three months ago reads
    # exactly like a change measured against last Sunday. The gap is the difference
    # between "you have lost 4cm" and "you have lost 4cm since the spring".

  Scenario Outline: A change of any size is shown, immediately, at whatever size it is
    # DECIDED, founder, 2026-09-11 — decision 4, verbatim: "even sub cm measurements count,
    # just show it straight away because the average line will cut through the noise. keep
    # ui consistent with weight graph." This overruled a proposed 1cm threshold below which
    # a change would have been hidden or shown without colour. The founder's reasoning is
    # the better rule: the raw number is the raw number and is reported honestly, and the
    # average line over several readings is the thing that says whether it is real.
    # Splitting that one job across a threshold AND an average would have done it twice.
    Given my waist reading moved by "<change>" since my last one
    When I save it
    Then the change is shown, with no size below which it is hidden, greyed, or delayed

    Examples:
      | change |
      | 0.2cm  |
      | 0.5cm  |
      | 3.0cm  |

  Scenario: A site that did not move says so in words rather than showing a zero
    Given my neck reading is identical to my last one
    When I save it
    Then that site reports no change
    And it carries no direction colour, because it has no direction
    # This is not the threshold decision 4 overruled: it is the difference between a change
    # and no change, not a band of changes too small to mention.

  Scenario: Waist is coloured by direction, the same way the weight trend is
    Given my waist reading is smaller than my last one
    When I save it
    Then the change is shown in the same accent colour the weight trend uses for a
      falling weight
    And a larger waist uses the same colour that trend uses for a rising weight

  Scenario: Hip is coloured by direction too, but only under the female formula
    Given my profile sex is female
    And my hip reading is smaller than my last one
    Then it is coloured by direction like the waist
    # Both formulas compute a leaner result from a smaller waist; the female formula does
    # the same for hip. Hip is not asked for under the male formula at all.

  Scenario: Neck's change is shown at full size but carries no direction colour
    Given my neck reading changed since my last one
    When I save it
    Then the change and its sign are shown like any other site
    But no accent or warning colour is applied to it
    # SWARM DECISION, nutrition-coach veto, not a founder call — see the header. Under the
    # Navy formula a bigger neck computes a leaner body-fat %, so colouring neck the same
    # way as waist would show a shrinking neck as the bad result and a growing one as the
    # good result. During a deficit, a shrinking neck is most likely lost muscle or a tape
    # sitting in a different place — neither is something to colour green or red.

  Scenario: My first ever reading says there is nothing to compare it with yet
    Given this is my first tape reading
    When I save it
    Then the estimated body fat % is shown
    And one plain line says the next reading will show what has changed
    And no change figures are shown or implied

  Scenario: Correcting today's reading compares against the previous week, not against
      the entry being replaced
    Given I already saved a reading today and am correcting a typo in it
    When I save the corrected reading
    Then the changes reported are against my last reading from a previous date
    # Saving replaces the row for that date. Comparing against the row being replaced would
    # report the size of the typo.

  # ── The body-fat figure, and the window it is framed over ──────
  Scenario: Saving never reports a body-fat change between two readings
    Given I have a previous reading
    When I save a new one
    Then the estimated body fat % is shown as a value
    And no reading-to-reading body-fat change is shown
    # features/body/01 already decided this, and this file's own arithmetic is why: half a
    # centimetre of slip at two sites moves the estimate by more than a week of real fat
    # loss does, and it is a coin flip which way.

  Scenario: A body-fat change is reported once a reading BF_WINDOW_DAYS old exists
    Given I have a reading from at least 30 days ago under my current formula
    And a reading from inside that window
    When I save a new reading
    Then the change in estimated body fat % across that window is reported
    And the copy states the window it covers

  Scenario: No body-fat change is reported when the window cannot be filled
    Given my oldest reading under my current formula is less than 30 days old
    Then no body-fat change figure is shown
    And no shorter, noisier window is substituted for it

  Scenario: A stale set of readings does not report a change of zero
    Given every reading I have is older than 30 days
    Then no body-fat change figure is shown
    # Comparing the newest reading against itself returns zero, which would read as "your
    # body fat has not moved in a month" when the truth is that nothing has been measured
    # in a month.

  Scenario: Readings taken under my previous formula are left out of the window figure
    Given I changed my sex in Profile
    Then the body-fat change is computed only from readings under my current formula
    But the site changes are still reported, because a neck is a neck under either formula

  # ── The tape chart ─────────────────────────────────────────────
  # Added 2026-09-11 in a design-lead pass with the founder, after the rest of this file was
  # built. Both additions below are agreed, and they share one purpose: making a reading
  # interpretable rather than only visible.
  Scenario: One chip covers every tape site, not one chip per site
    Given I have logged at least one tape reading
    When I view the History chart controls
    Then a single "📐 Tape" chip sits alongside "⚖️ Weight" and "📏 Body Fat %"
    # DECIDED with the founder, 2026-09-11. The Navy formula reads waist MINUS neck, so the
    # distance between those two lines is the formula's own input: seeing them together is
    # what tells you whether a body-fat move came from the waist dropping or the neck
    # creeping up. Two chips, on two charts, would hide exactly the thing that makes a
    # reading interpretable. The chip row was part of the decision too — it is already at six
    # chips plus the line/bar controls, and two more would wrap it to a second row at phone
    # width where the controls start competing with the chart. It can carry one more.

  Scenario: Selecting the tape chart clears the other two body charts
    Given the body fat % chart is showing
    When I select the tape chart
    Then the body fat % chart is no longer selected
    And the same is true in reverse, and for the weight chart

  Scenario: The sites share one centimetre axis, at their real values
    Given the tape chart is showing
    Then neck and waist are drawn as separate lines on one shared axis
    And neither line is normalised, rescaled, or given a second axis of its own
    # They share an axis honestly because they are all centimetres — a waist near 95 and a
    # neck near 40 read fine on one automatic scale. Normalising them, or giving one its own
    # axis, would make the distance between the lines mean nothing, and that distance is the
    # whole reason they are on one chart.

  Scenario: Hip is drawn only when the readings in view actually have one
    Given my readings were computed under the male formula
    When I view the tape chart
    Then no hip line is drawn, and nothing stands in for it
    # Driven by the readings, not by the profile's current sex: a sex change must not hide
    # hip lines for readings that really do carry a hip measurement.

  Scenario: Each site shows its raw readings and its rolling average
    Given the tape chart is showing
    Then each site's readings are drawn as points on a thin line
    And its rolling average is drawn as a dashed line in the same colour
    And that average uses the same window, and the same "enough readings yet?" rule, as the
      body fat % chart already uses
    # No second smoothing rule is invented here. One consequence, stated rather than
    # discovered: with exactly enough readings to qualify, the average has a single point and
    # a single point draws no line — which is already true of the weight and body fat %
    # charts. Founder decision 3 (the average line starts from the second reading, labelled
    # with what it is built from) removes that, and when it lands this chart follows from the
    # same edit, because it reads the same constant.

  Scenario: Neck's line carries no direction colour here either
    Given the tape chart is showing
    Then neck's line colour identifies the series, and never says whether the change was
      good or bad
    # The nutrition-coach veto recorded in this file's header applies to the chart exactly as
    # it applies to the save feedback.

  Scenario: No tape chip before any measurement has ever been logged
    Given I have never logged a tape reading
    Then no tape chip is offered

  # ── The body fat % tooltip, as a diagnostic ────────────────────
  # It used to give the date, the body fat %, and the average. Those three say WHAT the
  # reading was; they never say what produced it. The two rows added below are what make a
  # point on that chart answerable: which tape numbers it came from, and over how long.
  #
  # NEXT STEP, NOT BUILT HERE: the per-reading conditions note ("fasted, before shower")
  # belongs in this tooltip more than anywhere else in the app — it is the line that
  # separates a real change from a protocol difference. It depends on founder decision 2,
  # which needs its `note TEXT` column run against the live database first, and is out of
  # this file's scope. Recorded here so it is not lost. Nothing in this file reads or writes
  # a note field.
  Scenario: The tooltip reports the raw tape sites for that reading, waist first
    Given I inspect a point on the body fat % chart
    Then the sites that produced it are shown on one line, waist first, then neck
    # Waist leads because it is the dominant term in the formula and the site that actually
    # moves week to week. One line, because this card floats over a 200px-tall chart at phone
    # width: a taller card starts covering the chart it is explaining.

  Scenario: The tooltip says how long since the previous reading
    Given the reading I am inspecting was taken 6 days after the one before it
    Then the tooltip says so
    # Same gap the save feedback closes: "waist -4.0cm" reads identically whether that was a
    # week or a season, and a point on a chart is no different.

  Scenario: The tooltip states how many readings its average is built from
    Given an average exists for the reading I am inspecting
    Then the tooltip states the number of readings behind it, not just the value

  Scenario Outline: A row with nothing to say is left out entirely
    Given <situation>
    When I inspect that reading
    Then the tooltip omits "<row>" altogether
    And nothing — no dash, no blank, no placeholder — is rendered in its place

    Examples:
      | situation                                          | row              |
      | fewer readings than an average needs               | the average      |
      | a reading computed under the male formula          | hip              |
      | the first reading I ever logged                    | the interval     |

  # ── CSV export ─────────────────────────────────────────────────
  Scenario: The export carries the weight and the tape reading for each date
    Given I export my history as CSV
    Then each row carries that date's weight, neck, waist, hip, and estimated body fat %
      alongside the food columns it already had

  Scenario: A date with no body data leaves those cells empty, not zero
    Given a date with food logged and no body data
    When I export
    Then its body columns are empty
    # A 0 in a waist column is a measurement of zero centimetres, which is a different
    # claim from "not measured".

  Scenario: The export includes dates that have body data but no logged day
    Given a date with a weigh-in or a tape reading but no history snapshot
    When I export
    Then that date still appears as a row, with its food columns empty
    # The two upserts are separate calls and one can fail while the other succeeds — this
    # is not hypothetical, it happened to this repo's own data on 2026-09-11. The export is
    # the complete record; the day list, which walks history snapshots, is not.

  Scenario: Exported body values are in stored units regardless of my display preference
    Given my display unit is pounds or stone
    When I export
    Then weight is exported in kilograms and the tape sites in centimetres
    And each column heading names its unit
    # A column whose meaning changes with a display setting is not an archive. The screen
    # follows the preference; the file follows the storage.

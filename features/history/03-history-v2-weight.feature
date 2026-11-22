# ── History v2: the weight panel and the Body fat & tape sub-view ───────────
# Contract: design/v2/reviews/history-05-ruling.md §3 and §4, owner decision Q1 (2026-11-21: yes).
# Behind ?ui=v2. v1 History and its Q4 week-on-week figure (features/history/01) are untouched.
#
# Why a new trend: the owner weighs about weekly. v1's ROLLING line needs ≥3 readings in 7 days and
# weightTrendKg needs ≥2 in each of two 7-day windows, so six readings in a month drew raw dots and
# an apology. weightTrend(weighIns, toKey) works on sparse data:
#   • line  — a time-weighted EWMA over calendar days, α = 1 − 0.9^Δdays, evaluated at each reading
#             over ALL readings up to today (so the range never moves the line), drawn as straight
#             segments, never a spline.
#   • rate  — least-squares slope through the readings of the last 28 days (today and the 27
#             before), ×7, rounded to 0.1. Fixed to 28 days, never the range chip (FL-013).
# Arithmetic: __tests__/weight-trend.test.js (it lifts the real function out of app.jsx).
# Screen: e2e/v2-history-weight.spec.js.

Feature: Weight on History v2

  Background:
    Given UI v2 is on
    And I open History from the Today nav

  Scenario: The owner's six weekly-ish weigh-ins give a rate
    Given I weighed 100.1 on 23 Oct, 97.5 on 28 Oct, 98.5 on 4 Nov, 98.2 on 8 Nov, 98.1 on 18 Nov and 98.2 on 20 Nov
    And today is 22 Nov
    Then the weight panel says "+0.1 kg a week · last 4 weeks · 5 weigh-ins"
    # 23 Oct is 30 days back, outside the 28-day window; the slope is 6.2/371.2 kg a day.
    And the line is in the ink colour, with no good or bad colour, whichever way the weight went

  Scenario: The rate needs 3 readings spanning at least 10 days
    Given I have 2 weigh-ins in the last 4 weeks
    Then the weight panel says "2 weigh-ins · your trend starts after 3 over 10 days"
    And no rate is shown

  Scenario: Three readings over nine days is still not enough
    Given I weighed on the 10th, 15th and 19th, and nothing else in the last 4 weeks
    Then no rate is shown

  Scenario: A rate under 0.1 kg a week is About level
    Given my weight has not changed for 3 weeks
    Then the weight panel says "About level · last 4 weeks · 21 weigh-ins"

  Scenario: No weigh-ins at all
    Given I have never weighed in
    Then the weight panel says "No weigh-ins yet. Log one on Today."
    And there is no chart

  Scenario: The chart
    Given I have weigh-ins in the selected range
    Then the smoothed trend is a 2px ink line of straight segments
    And each reading is a small dim dot, not joined to the others
    And the grid is horizontal hairlines only
    And the weight axis ticks are round multiples of 0.5 kg spanning at least 2 kg
    And there is no tooltip
    And the trend enters from the left edge when there is a reading before the range

  Scenario: The range chip changes the chart, never the rate
    When I switch between 7D, 30D, 3M and ALL
    Then the chart shows the readings in that range
    And the rate line stays the same

  Scenario: Imperial weight units
    Given my weight unit is stone or pounds
    Then the chart and the rate are in pounds
    # v1's rule (wChartNum): a numeric axis cannot carry compound st + lb.

  Scenario: Body fat and tape are one quiet row away
    Given I have 6 body measurements
    Then under the weight chart a row says "Body fat & tape · 6 readings"
    When I tap it
    Then the Body fat & tape screen opens with the body-fat chart and the tape chart
    And it shows my latest body fat, and the change over the last 30 days when there is one
    And the tape chart has waist and neck (and hip when the readings have one) on one centimetre axis
    And nothing is colour-coded and there are no emoji
    When I tap back
    Then I am on History again

  Scenario: No body measurements
    Given I have never measured
    Then there is no Body fat & tape row

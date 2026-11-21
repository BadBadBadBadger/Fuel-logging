# ─────────────────────────────────────────────────────────────
# Body workstream, file 3. UI v2 (design/v2/HANDOVER.md §3 item 11, Decision D9).
#
# WHY: in v1, measurements live inside the weigh-in card as a one-line link, and the weekly
# check arrives as a pop-up card ("Also log this week's measurements? Log now / Not now").
# The owner decided (D9) that measurements are a PERMANENT row on Today with a quiet DUE
# state — never a pop-up — and that Settings keeps only the reminder preference.
#
# REUSES (nothing re-derived):
#   • `showMeasurementNudge` (App, built on `shouldNudgeWeighIn`) is the due signal. It already
#     respects the weigh-in cadence "off" mute and the dedicated measurement mute.
#   • Saving goes through the same `onMeasurement` handler as v1's MeasurementRow, so the Navy
#     body-fat estimate, the sync gate and the cloud upsert are unchanged (features/body/01).
#   • The save feedback (estimate, per-site change, 30-day window change) uses the same pure
#     helpers as v1 (features/body/02): measurementSiteChanges, bodyFatWindowChange.
#
# SCOPE: the Today v2 screen only (`?ui=v2`). v1 is untouched.
# ─────────────────────────────────────────────────────────────

Feature: Measurements are a permanent row on Today, with a quiet due state

  Background:
    Given the v2 Today screen is shown

  Rule: The row is always there

    Scenario: No measurement has ever been logged
      Given no body measurements are stored
      Then the Measurements row is shown
      And it invites a first measurement
      And it offers a "Log" action

    Scenario: A man's last reading
      Given my sex is male
      And my last measurement was neck 40 cm and waist 95 cm, 8 days ago
      Then the row reads "Neck 40 · Waist 95 cm"
      And under it "Last logged 8 days ago · weekly"

    Scenario: A woman's last reading includes the hip
      Given my sex is female
      And my last measurement was neck 33, waist 78 and hip 98 cm
      Then the row reads "Neck 33 · Waist 78 · Hip 98 cm"

    Scenario: Reminders are off
      Given weigh-in reminders are set to "off"
      Then the row still shows the last reading and the Log action
      But it does not say "weekly"

  Rule: Due is a state of the row, never a pop-up

    Scenario: The weekly check is due
      Given the measurement nudge would show in v1
      Then the row shows an amber dot and "DUE" beside its label
      And no "Log now / Not now" card is shown anywhere on Today

    Scenario: Not due
      Given the last measurement was 2 days ago
      Then the row shows no DUE marker

    Scenario: Logging clears the due state
      Given the row shows "DUE"
      When I log a valid measurement
      Then the DUE marker disappears

  Rule: Logging opens an inline form in the row

    Scenario: The form matches the formula
      When I tap "Log" on the Measurements row
      Then neck and waist fields appear inside the row
      And a hip field appears only for the female formula

    Scenario: An impossible reading is blocked
      When I enter neck 40 and waist 38
      Then the save button is disabled
      And the row says waist needs to be bigger than neck

    Scenario: A valid reading saves and reports back
      When I enter neck 38 and waist 83 and save
      Then the measurement is stored with the male formula and a body-fat estimate
      And the row shows "Estimated body fat" with the figure
      And the row's last reading now reads "Neck 38 · Waist 83 cm", logged today

    Scenario: The first-ever save offers the routine note
      Given no body measurements are stored
      When I open the form
      Then an optional "usual conditions" field is shown

    Scenario: Closing the form without saving
      When I open the form and tap "Close"
      Then nothing is stored and the row returns to its summary

  Rule: Settings keeps only the reminder preference

    Scenario: The reminder lives in Settings
      Then Settings › Body & goal › Reminders offers Measurements: weekly / off
      And Today has no control to mute the reminder

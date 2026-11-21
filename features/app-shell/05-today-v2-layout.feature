# ─────────────────────────────────────────────────────────────
# Today v2 ("Instrument") — layout, header and mode lamps.
# Source of truth: design/v2/HANDOVER.md §3 (order), D10, D13, D14, §2.5.
# Mockups: design/v2/mockups/a2.png (dark), a2-light.png (light).
# Behind the ?ui=v2 flag (remembered in localStorage.ui_v2) until the default flips.
# v1 (Dashboard) is untouched and keeps its own specs.
# ─────────────────────────────────────────────────────────────
Feature: Today v2 layout — header, mode lamps and element order

  Background:
    Given the v2 UI is on (opened with ?ui=v2)

  # ── Order (§3) ───────────────────────────────────────────────

  Scenario: Today reads top to bottom in the designed order
    When I open Today
    Then I see, in order: the header, the mode lamps, the cut-load tape (when shown),
      the gauge, the caution strip (when shown), TARGET · EATEN, the macro tapes,
      LOG FOOD | QUICK ADD, the meal list, water, weight | est. TDEE, measurements,
      workout, last 7 days
    And there is no AI coach card

  # ── Header (§3.1, D13) ───────────────────────────────────────

  Scenario: The header shows the wordmark and a date line with the streak as text
    When I open Today
    Then the header reads "FUEL/LOG" with the slash in amber
    And under it a date line like "FRI 20 NOV · DAY 3 STREAK"
    And the streak is plain text in the date line, with no flame chip
    And the uppercase is set by CSS, not typed into the text

  Scenario: No streak yet
    Given nothing has been logged today
    Then the date line shows only the date

  Scenario: The header stays visible while scrolling
    When I scroll down Today
    Then the header stays pinned at the top

  Scenario: Offline and sync status live in the date line
    Given the device is offline
    Then the date line ends with "OFFLINE" in amber
    When a sync message is showing
    Then it appears in the date line, quietly, after the date

  Scenario Outline: Header buttons open their screens
    When I tap the "<button>" header button
    Then the "<screen>" screen opens
    Examples:
      | button   | screen        |
      | History  | history       |
      | Badges   | achievements  |
      | Settings | profile       |

  Scenario: A new badge shows on the Badges button
    Given a badge has just been earned
    Then the Badges button carries an amber count bubble
    And there is no glow

  Scenario: The account chip appears only when signed in
    Given I am signed in with Google
    Then the header ends with a round avatar chip showing my Google photo
    And when the photo is missing or fails, it shows my initial instead
    When I tap the chip
    Then Account opens
    Given I am signed out
    Then there is no avatar chip

  # ── Mode lamps (§3.2, D10, D14) ──────────────────────────────

  Scenario: One lamp is lit for the current mode
    Given my mode is Cut
    Then the CUT lamp is lit (amber tint, amber outline) and MAINTAIN and BULK are dark

  Scenario: No lamp is lit while a custom target is set
    Given I have set my own daily target
    Then none of CUT, MAINTAIN or BULK is lit

  Scenario: A diet break is Maintain, not a fourth lamp
    Given I am on a diet break
    Then MAINTAIN is lit
    And there is no BREAK lamp and no BREAK label

  Scenario Outline: Tapping a lamp asks for the mode through the one guarded path
    When I tap the "<lamp>" lamp
    Then requestMode("<mode>", "today") is called
    And the lamp never writes the mode directly
    Examples:
      | lamp     | mode     |
      | CUT      | cut      |
      | MAINTAIN | maintain |
      | BULK     | bulk     |

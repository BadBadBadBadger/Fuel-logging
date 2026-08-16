# ── Appearance / theme (agreed 2026-06-12): ONE warm "ink-on-paper" light theme
# mirrors the existing dark "cream-on-near-black" theme — same app, gravity flipped.
# Default FOLLOWS THE DEVICE (prefers-color-scheme). A 3-way control in the Profile/⚙️
# screen — 🌙 Dark · ☀️ Light · 🖥 System — lets the user override the device, and
# "System" re-delegates to it (and follows live OS changes). Storage is metric-style
# per-device: the choice is never synced. Full token spec + AA contrasts in DOCS.md §35.
# Shipped v6.4 (2026-06-12). One scenario — "System mode follows a live device change" —
# relies on prefers-color-scheme firing mid-session in the installed PWA; confirm on-device.
Feature: Appearance — light, dark or system theme

  Background:
    Given the theme options in the Profile screen are 🌙 Dark, ☀️ Light and 🖥 System
    And the default for a fresh install is System

  Scenario Outline: A fresh install follows the device appearance
    Given I have never chosen a theme
    And my device appearance is "<device>"
    When I open the app
    Then the app renders in the "<rendered>" theme
    And the System option is shown as active
    Examples:
      | device | rendered |
      | dark   | dark     |
      | light  | light    |

  Scenario Outline: A manual choice overrides the device
    Given my device appearance is "<device>"
    When I choose the "<choice>" theme in the Profile screen
    Then the app renders in the "<rendered>" theme regardless of the device
    And the "<choice>" option is shown as active
    Examples:
      | device | choice | rendered |
      | dark   | Light  | light    |
      | light  | Dark   | dark     |
      | light  | Light  | light    |
      | dark   | Dark   | dark     |

  Scenario: Choosing System re-delegates to the device
    Given I had manually chosen the Light theme
    And my device appearance is dark
    When I choose the System theme
    Then the app renders in the dark theme
    And the System option is shown as active

  Scenario: System mode follows a live device change
    Given my chosen theme is System
    And the app is rendering in light because my device is light
    When my device switches to dark while the app is open
    Then the app switches to the dark theme without a reload

  Scenario: A manual choice ignores a live device change
    Given I have manually chosen the Light theme
    When my device switches to dark while the app is open
    Then the app stays in the light theme

  Scenario: The chosen theme persists across sessions
    Given I have chosen the Dark theme on a light device
    When I reload the app
    Then the app still renders in the dark theme
    And the theme choice is not synced to other devices

  Scenario: Switching theme recolours the whole app at once
    Given I am viewing the dashboard
    When I switch from dark to light
    Then the background, cards, text, calorie ring, mode colours and status pills all update together
    And no element is left in the previous theme

  Scenario: Accent-coloured controls stay legible in both themes
    Given the accent fills primary buttons and forms the calorie ring
    When I view a primary button in either theme
    Then the text on the accent button stays readable
    # guards the role-overload trap: dark text on a cream button (dark) must become
    # light text on a coal button (light) — never accent-on-accent

  Scenario Outline: Text and key UI meet WCAG AA contrast in both themes
    Given the "<theme>" theme is active
    Then body and label text meet at least 4.5:1 contrast against their background
    And status colours for CUT, BULK, MAINTAIN, warnings and over-target meet AA
    Examples:
      | theme |
      | dark  |
      | light |

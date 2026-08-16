# ── Data integrity + confidence (bugfix, 2026-06): meal ELEMENTS are the source of
# truth; the coach/totals never read truncated UI strings. Energy budget is ESTIMATED
# (own confidence); logged food is exact. Confidence model = "Separated" (DOCS §35-ish).
# @wip — built, device-verification pending.
@wip
Feature: Meal data integrity — structured elements are the source of truth

  Scenario: Logging a multi-element meal as one entry preserves every element
    Given I describe a meal with several elements (ham, egg, salad, chicken)
    When I log them all as a single meal
    Then the entry stores each element in full structured form (name + kcal + macros)
    And the stored entry name keeps my full description
    But no element data is lost to a truncated or summarised string

  Scenario: The coach reads structured elements, never the display string
    Given a logged meal whose display name is long and visually truncated
    When the nutrition coach generates advice
    Then it reads the meal's stored elements (names + per-element kcal and macros)
    And it never infers meal composition from the truncated UI text

  Scenario: Daily totals come only from persisted structured data
    Given meals are stored with per-element macros
    When daily totals are computed
    Then the totals are summed from the persisted values
    And are unaffected by any UI grouping or summarisation

  Scenario: Elements persist to the cloud for premium users
    Given I am signed in and log a multi-element meal
    When the entry syncs
    Then the elements and the meal's estimation confidence are stored in the backend
    # needs the food_logs.conf + food_logs.elements columns. ✅ CONFIRMED PRESENT on the
    # live database 2026-08-16. They are now declared in setup/supabase-schema.sql too,
    # which had been missing them — a fresh setup from that file would have rejected
    # every food-log upsert.

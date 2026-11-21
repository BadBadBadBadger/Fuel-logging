# Round 1, QA hat: functionality coverage, v110 vs v2

Checked against HEAD b229d45. Counts come from grep, not estimates: 177 Playwright tests in 27 specs, 469 Jest tests, 47 feature files. No `.github/workflows` exists, so nothing runs on a PR today.

## The five biggest holes

1. **Going over target is not designed.** Today v2 shows only "1,091 still to go" (a2.html). `dashboard/01` colour tolerance and `calorie-card-label.spec.js` (4 tests, including the founder's "OVER BY 47") have no v2 equivalent. Nobody has decided what the gauge shows at 2,500 / 2,241.
2. **Every conditional safety card is missing from Today.** These are: the cut guard (app.jsx:4381), aggressive-cut acknowledgement (4420), SAFE MINIMUM APPLIED (4451), maintenance minimum (4477), LOW ON FUEL (4544), weight-up-while-cutting (4574), the **cut bar** (4615), RECHARGED (4647), the soft and hard break prompts (4669, 4714) and floors-exceed-kcal (4753). The cut bar is a plain drop, not a gap waiting for design: a2 is drawn in CUT mode and shows none. Six of these have **no UI test at all**. Only `logic.test.js` covers their maths, and it tests a hand-copied version of the logic.
3. **The expanded meal row drops behaviour.** It has no Cancel or collapse (`logging/01:20`, entry-editor.spec:139). The "saved" state and the re-blink when you add a meal to Quick Add again are gone (`logging/03:33`, app.jsx:4969). Delete is still one tap with no undo, but it now sits inside the edit form.
4. **The mode can be changed in two places, and nothing keeps them in sync.** The cut guard only exists on the Today chips (4366). A custom target turns all the lamps off (`targets/01:33`). Settings › Body & goal adds a second CUT button and a second "Set my own". No spec covers either.
5. **The free and empty states are not designed.** LOG FOOD is AI, but v2 has no locked state; v1 marks it "premium ⭐" and opens a gate (4925). The empty day ("Nothing logged yet today", 4982), the no-profile prompt (4410) and the OFFLINE and sync lines in the header (4329-4330) have no home. The premium-avatar spec (`app-shell/02`) is made obsolete by Account being open to everyone.

## 1. Coverage matrix

Statuses: **Cov** = covered in the mockup, **Mov** = moved, **Rem** = removed by decision, **NO HOME** = no place in the design, **ND** = its screen is not designed yet.

| Behaviour | Spec | Tests today | v2 | Risk |
|---|---|---|---|---|
| Calories eaten vs target | dashboard/01 | calorie-card-label (4), progress-bars (2) | Cov when under target; **NO HOME** when over | H |
| Macro tapes | dashboard/02, targets/03 | progress-bars:62, smoke:78 | Cov (the text changes from "65g / 169g" to "65 /169") | M |
| Budget confidence "EST. BUDGET · %" | dashboard/03:7 | none | Mov to the EST. TDEE row, but the % is gone | M |
| Note when most of the day is AI-estimated (4833) | dashboard/03:22 | none | **NO HOME** | M |
| TODAY score card and its "one action" sentence | dashboard/04, 05 | intake-scoring (4 + 5) | **NO HOME**: only the 7-day lamps were drawn | H |
| THIS WEEK ring | dashboard/04, 06 | intake-scoring (6) | Mov to the "LAST 7 DAYS" lamps | M |
| Tap the target to override it | targets/02 | smoke:103 (✎ locator) | Cov, plus "Use auto"; the pencil in spec 02:21 is now stale | M |
| Custom target turns lamps off and auto-labels the mode | targets/01:33-63 | none | ND | H |
| Aggressive-cut acknowledgement | targets/01:65-84 | none | Rem from Profile; the Today card is **NO HOME** | H |
| Safe-minimum backstop card | targets/04 | Jest only | **NO HOME** | H |
| Maintenance BMR minimum card | energy-safety/08 | Jest only | **NO HOME** | H |
| Floors exceed kcal | targets/03 | Jest only | **NO HOME** | M |
| Cut bar and week count | energy-safety/02 | energy-safety (3) | **NO HOME** | H |
| Break prompt, guard, recharged | energy-safety/03 | cut-break (7), cut-break-sync (2), energy-safety (2) | **NO HOME** | H |
| Weight-up-while-cutting and stall cards | energy-safety/04, 06 | adaptive-guardrails (7), weigh-ins:88-128 | **NO HOME** | H |
| "The scale disagrees" explanation | energy-safety/04 | weigh-ins:140, 156 | **NO HOME** (the mockup only says "Settles as you weigh in") | H |
| LOW ON FUEL | energy-safety/01 | none | **NO HOME** | H |
| Symptom check | energy-safety/05 | none | Shelved in the spec itself | L |
| Weigh-in nudge and "Don't remind me" | energy-safety/06 | none | Mov to Reminders; the weight row has no due state | M |
| 7-day weight trend badge, changing today's weight | energy-safety/09 | weigh-ins:219, 252, 282 | ND (only the not-logged state is drawn) | M |
| Workout logging and paste-parse (Pro) | energy-safety/07, 10 | workout-parse (3), dev-premium (3), smoke:91 | Cov for the row; "spread forward" copy and remove-workout are **NO HOME** | M |
| Measurements prompt, then due state | body/01:228, 240 | body-measurements (8) | Mov to the Today row; spec 240 (dismiss and cool down) is now stale | M |
| What a measurement save reports back | body/02 | body-history (6) | ND | M |
| Water | none | none | Cov | L |
| Log a meal from Quick Add | logging/02 | quick-add (7), smoke:78 | Cov for the entry point; the sheet is ND | M |
| Edit an entry in place | logging/01 | entry-editor (7) | Cov, but Cancel is **NO HOME** | H |
| Re-estimate from the name (Pro) | logging/01:26-55 | entry-editor (4) | Cov; the anonymous gate is ND | M |
| Save to Quick Add, plus feedback on repeat adds | logging/03 | none | Cov for the action; the saved state is **NO HOME** | M |
| One-tap delete | none | none | Mov into the editor | M |
| AI capture, follow-ups, photo notes, several photos | logging/05, 08, 10 | ai-followups (8), photo-* (11) | ND | M |
| Typed totals and duplicate-total rows | logging/06, 04 | stated-totals (3), duplicate-total-row (3), Jest | ND (AI Log); the logic is unchanged | L |
| Reusing a past meal | logging/09 | past-meal-reuse (6), Jest | ND | L |
| Streak pop and badge fanfare or toast | engagement/01 | Jest calcStreak only | Header chip is Cov; fanfare is ND | M |
| Haptics | app-shell/04 (@wip) | none | Unchanged | L |
| Theme | app-shell/03 | smoke (3) | Cov (Units & look) | L |
| Premium avatar to Account | app-shell/02 | none | Rem/Mov (Account is open to everyone) | M |
| Premium modal and gates | none | dev-premium (3), entry-editor:244 | ND | H |
| Offline and sync messages; data surviving an outage | profile/04 | pull-outage, pull-long-history, no-cloud (5) | Header text is **NO HOME**; the data tests survive | M |
| Empty day and no-profile prompt | none | none | **NO HOME** | H |
| History windows, day edit, CSV export | history/01, 02 | history-* (23), body-history:359 | ND | M |
| Coach, diet type, allergies | coach/01-03 | Jest (13) | Rem | L |
| Version shown in the footer | none | app-version, version.test | Mov to the Settings footer | L |

## 2. Test-suite impact

For each spec, **L** counts tests that survive with locator changes only, **R** counts tests whose assertions must be rewritten because the behaviour or copy changed, and **D** counts tests to delete.

| Spec | Tests | L | R | Notes |
|---|---|---|---|---|
| adaptive-guardrails | 7 | 6 | 1 | ":47 points at Body Measurements", which now lives on Today |
| ai-followups | 8 | 8 | 0 | opened via `/AI LOG/` |
| app-version | 1 | 1 | 0 | navigates via ⚙️ |
| body-history | 21 | 15 | 6 | 📊 nav and emoji chips; the save report moves |
| body-measurements | 10 | 2 | 8 | Profile card goes to Reminders; prompt becomes due state |
| calorie-card-label | 4 | 0 | 4 | REMAINING / OVER BY are gone |
| cut-break(-sync) | 9 | 7 | 2 | the guard must hold on both mode controls |
| dev-premium, workout-parse | 6 | 6 | 0 | |
| duplicate-total-row, stated-totals, past-meal-reuse, photo-meal-* | 23 | 23 | 0 | `/AI LOG/` helper |
| energy-safety | 5 | 5 | 0 | only if the cut bar returns |
| entry-editor | 7 | 2 | 5 | XPath from CONSUMED; no Cancel; button names change |
| history-averages, history-day-edit | 23 | 23 | 0 | one 📊 helper each |
| intake-scoring | 15 | 0 | 15 | `div:text-is("THIS WEEK")` and SVG paths; up to 5 become D if the TODAY card goes |
| no-cloud, pull-* | 7 | 7 | 0 | |
| progress-bars | 4 | 1 | 3 | `div[style*="height: 10px"]`; the bar is now an arc |
| quick-add | 7 | 7 | 0 | sheet is ND |
| smoke | 7 | 6 | 1 | ":91 spread forward" copy is NO HOME |
| weigh-ins | 13 | 8 | 5 | BODY WEIGHT card copy, trend badge, change weight |
| **Total** | **177** | **127** | **50** | D = 0 in e2e. Jest D = 13: ai-log.test.js:356 (2), scanAllergens (7), dietaryPromptBlock (4) |

**Locator sample.** I grepped the 304 `getByText` and 1 `getByRole` calls. **104 of them hit copy that v2 changes** (57 `getByText`, 47 `getByRole`):

- `"CONSUMED"` appears 38 times across 16 specs, about 81 tests.
- Emoji buttons: ✎ (5), 🗑️ (3), ✏️ (2), "📏 Body Fat %" (7), "📐 Tape" (4).
- `TODAY'S LOG ·` and `AI re-estimate` / `Updated — re-estimate again` (7).
- "Log measurement" (11) and `/AI LOG/` (6 helpers, covering 31 tests).
- Navigation goes through `button:has-text("📊"|"⚙️")` in 5 specs, which gates 45 tests.
- The regex locators `/LOG WORKOUT/` and `/Paste log/` are case-sensitive, but the mockup reads "Log workout" and "PASTE LOG".

**Specs that would fail on v2 for cosmetic reasons only:** smoke, history-averages, history-day-edit, body-history (nav), ai-followups, duplicate-total-row, stated-totals, past-meal-reuse, photo-meal-multi, photo-meal-name, pull-outage, pull-long-history, no-cloud-from-harness, app-version, quick-add, workout-parse, dev-premium and progress-bars. That is **18 specs and roughly 127 tests**.

## 3. Specs to write before the build

```gherkin
@wip
Feature: A meal row opens in place for editing (Today v2)

  Scenario: Tapping a meal row opens it for editing, pre-filled
    Given I have logged "Chicken and rice" at 620 kcal today
    When I tap the "Chicken and rice" row
    Then it opens in place with name, kcal, protein, carbs and fat filled in
    And it offers Save, Save to Quick Add and Delete
    And no other row is open

  # OPEN: v2 has no Cancel. Does tapping the row header close it? Tapping another row?
  Scenario: Closing an open row without saving leaves the entry unchanged
    Given the "Chicken and rice" row is open and I changed kcal to 700
    When I close the row without saving
    Then the entry still reads 620 kcal and today's totals have not moved

  Scenario: Re-estimate from name refills the macros (premium)
    Given I am premium and the "Chicken and rice" row is open
    When I change the name to "Chicken and rice, large" and choose "Re-estimate from name"
    Then it shows "Re-estimating…" and then "Updated"
    And kcal, protein, carbs and fat are refilled but not saved until I tap Save

  Scenario: Re-estimate from name is gated for anonymous users
    Given I am not premium and a row is open
    When I choose "Re-estimate from name"
    Then the premium gate opens and the fields I typed are kept

@wip
Feature: Measurements row on Today

  Scenario: The measurements row shows a due state when the weekly check is due
    Given my measurement reminder is "Weekly"
    And my last measurement was 8 days ago
    When I open Today
    Then the measurements row is marked "DUE"
    And no pop-up asks me to log now

  Scenario: A reminder set to Off never shows the due state
    Given my measurement reminder is "Off" and my last measurement was 30 days ago
    Then the measurements row shows my last reading and is not marked "DUE"

@wip
Feature: Gauge semantics

  # OPEN: over-target wording, number sign and colour are not designed. dashboard/01 tolerance applies.
  Scenario Outline: The gauge reads eaten against target
    Given my target is <target> kcal and I have eaten <eaten> kcal
    Then the gauge readout is <readout>
    Examples:
      | target | eaten | readout              |
      | 2,241  | 1,150 | "1,091 still to go"  |
      | 2,241  | 2,241 | OPEN: "0 still to go"? |
      | 2,241  | 2,288 | OPEN: within tolerance |
      | 2,241  | 2,500 | OPEN: "259 over"?    |

@wip
Feature: One mode, two controls

  Scenario: Changing mode in Settings moves the Today lamps
    Given Today shows CUT lit
    When I choose MAINTAIN in Settings › Body & goal
    Then Today shows MAINTAIN lit and the auto target for Maintain

  Scenario: The back-to-cutting guard asks once from either control
    Given I am on a diet break the app advised
    When I choose CUT in Settings › Body & goal
    Then I am asked "BACK TO CUTTING ALREADY?" exactly as on Today
```

**Listed by title only:**

- Typing a target in the gauge sets "Set my own" in Settings, and "Use auto" brings back the mode's auto value.
- A custom target lights no lamp.
- Log Food and Quick Add sit above the meal list even when the day is empty.
- An empty day shows an empty state, not a blank list.
- A free user tapping Log Food sees the premium gate (or a manual path, which is open).
- Delete from an open row (decide on undo).
- Save to Quick Add shows a saved state and re-blinks on repeat.
- Each safety card has a position on Today (one scenario per card).
- The cut bar is shown while cutting.
- Offline and sync status is visible.
- A logged workout can be removed.
- Rewrites: targets/02:21 (pencil), body/01:240 (dismiss and cool down), logging/01:20 (Cancel), app-shell/02 (avatar).

## 4. Verdict on Phase 0-5

The phasing is sound. These changes would make it safe.

**Add:**

- **Phase 0a, characterisation tests on v1:** one e2e test per card listed in hole 2, plus the empty day, offline and no-profile states. v2 cannot be shown to keep behaviour that is never tested.
- **Phase 0b, spec freeze:** write section 3 and design every NO HOME and ND row on Today before TodayV2 code starts.
- **One `ready(page)` fixture and aria-label navigation helpers.** This removes about 81 tests' dependence on "CONSUMED" and 45 tests' dependence on the 📊 and ⚙️ buttons. Prefer roles and accessible names over testids; keep testids for things without text, such as the gauge and lamps.

**Watch:**

- Moving logic into `logic.js` will break `ai-log.test.js:20-21`, which slices app.jsx between `const STATED_RE = {` and `const confColor`. It fails loudly, which is fine. `styles.test.js` and `datekeys.test.js` only scan app.jsx, so they would pass silently over code that moved to logic.js. Point them at both files.
- Phase 1 must keep `paceVerdict` and `EATING_WINDOW_H` (app.jsx:438-440). Intake-score day close reuses them (569).
- Removing `scanAllergens` also changes the AI item rows (5489).

**Reorder:** run Phase 2 icons only after the Phase 0 locators land. Otherwise the emoji removal alone turns 45+ tests red.

**Gates for making `?ui=v2` the default:**

1. Every Today row in the matrix is Cov, Mov or Rem, and each Rem has a recorded decision and an updated `.feature`. Zero NO HOME rows.
2. Playwright runs as `v1` and `v2` projects. Both are green for 3 consecutive runs with no retries, and the test counts match apart from listed deletions.
3. Every v2 `@wip` scenario from section 3 is implemented and untagged.
4. Jest is green at 469 − 13, importing `logic.js` rather than a copy.
5. Screenshots pass at 375, 390 and 412 px in both themes, with no horizontal scroll.
6. The owner dogfoods for 7 days or more, covering an over-target day, an empty day, a cut and a break day, and an offline log. The DEVICE-TEST.md pass on a phone succeeds.
7. Turning the flag off brings v1 back with no data migration and no new storage keys.
